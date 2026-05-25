import { NextRequest, NextResponse } from 'next/server'
import { resendOdeme as resend, MAIL_FROM_ODEME as MAIL_FROM } from '@/lib/resend'
import { supabase } from '@/lib/supabase'

const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png']
const ALLOWED_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png']

function toSafeFileName(str: string): string {
  return str
    .toUpperCase()
    .replace(/Ğ/g, 'G').replace(/Ü/g, 'U').replace(/Ş/g, 'S')
    .replace(/İ/g, 'I').replace(/Ö/g, 'O').replace(/Ç/g, 'C')
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^A-Z0-9_\-]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 50)
}

function refKoduUret(): string {
  const sayi = Math.floor(100000 + Math.random() * 900000)
  return `WRKP2026-${sayi}`
}

/** Artırılmış kontenjanları geri al (kompanzasyon) */
async function kontenjanGeriAl(ids: string[]) {
  if (ids.length === 0) return
  for (const id of ids) {
    await supabase.rpc('workshop_kontenjan_azalt', { p_id: id })
  }
}

async function mailKuyrugunaEkle(
  mailType: string,
  recipient: string,
  subject: string,
  payload: Record<string, unknown>
) {
  await supabase.from('mail_queue').insert({
    mail_type: mailType,
    recipient,
    subject,
    payload,
    status: 'pending',
  })
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const isim = (formData.get('isim') as string)?.trim()
    const soyisim = (formData.get('soyisim') as string)?.trim()
    const email = (formData.get('email') as string)?.trim()
    const telefon = (formData.get('telefon') as string)?.trim() || ''
    const workshopIdsRaw = formData.get('workshop_ids') as string
    const kategori = (formData.get('kategori') as string)?.trim() || 'ogrenci'
    const dekont = formData.get('dekont') as File | null

    // Kategori bazlı fiyat (server-side)
    const FIYATLAR: Record<string, number> = { ogrenci: 1500, hekim: 3000 }
    const fiyatPerWorkshop = FIYATLAR[kategori] ?? 1500

    // ── Zorunlu alan doğrulaması ──
    if (!isim || !soyisim || !email || !workshopIdsRaw || !dekont) {
      return NextResponse.json(
        { error: 'Tüm zorunlu alanlar doldurulmalı ve dekont yüklenmelidir.' },
        { status: 400 }
      )
    }

    let workshopIds: string[]
    try {
      workshopIds = JSON.parse(workshopIdsRaw)
      if (!Array.isArray(workshopIds) || workshopIds.length === 0) throw new Error()
    } catch {
      return NextResponse.json({ error: 'Geçersiz workshop seçimi.' }, { status: 400 })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Geçersiz e-posta adresi.' }, { status: 400 })
    }

    // ── Dosya doğrulaması ──
    const rawMime = (dekont.type || '').split(';')[0].trim().toLowerCase()
    const mime = rawMime === 'image/jpg' ? 'image/jpeg' : rawMime
    const ext = dekont.name.split('.').pop()?.toLowerCase() ?? ''
    const extGecerli = ALLOWED_EXTENSIONS.includes(ext)
    const mimeGecerli =
      ALLOWED_MIME_TYPES.includes(mime) ||
      ((mime === 'application/octet-stream' || mime === '') && extGecerli)

    if (!mimeGecerli) {
      return NextResponse.json(
        { error: 'Dekont yalnızca PDF, JPG veya PNG formatında yüklenmelidir.' },
        { status: 400 }
      )
    }
    if (!extGecerli) {
      return NextResponse.json(
        { error: 'Geçersiz dosya uzantısı. PDF, JPG veya PNG yükleyin.' },
        { status: 400 }
      )
    }
    if (dekont.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Dosya boyutu 10 MB'dan küçük olmalıdır." }, { status: 400 })
    }

    // ── Atomik kontenjan artırma (FOR UPDATE row locking) ──
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      'workshop_kontenjan_artir',
      { p_ids: workshopIds }
    )

    if (rpcError) {
      console.error('[workshop/kayit] RPC error:', rpcError)
      return NextResponse.json(
        { error: 'Kontenjan kontrolü başarısız. Lütfen tekrar deneyin.' },
        { status: 500 }
      )
    }

    const sonuclar = rpcData as Array<{ workshop_id: string; isim: string; basarili: boolean }>
    const basarisizlar = sonuclar.filter((s) => !s.basarili)
    const basariliIds = sonuclar.filter((s) => s.basarili).map((s) => s.workshop_id)

    if (basarisizlar.length > 0) {
      // Başarılı artırılanları direkt UPDATE ile geri al
      await kontenjanGeriAl(basariliIds)

      const doluIsimler = basarisizlar.map((s) => s.isim).join(', ')
      return NextResponse.json(
        {
          error: `Kontenjan dolu: ${doluIsimler}. Lütfen farklı workshop seçin.`,
          doluWorkshopIds: basarisizlar.map((s) => s.workshop_id),
        },
        { status: 409 }
      )
    }

    // ── Workshop isimleri ve toplam fiyat ──
    const { data: workshopDetay } = await supabase
      .from('workshops')
      .select('id, isim, fiyat')
      .in('id', workshopIds)

    const workshopIsimleri = (workshopDetay ?? []).map((w) => w.isim).join(', ')
    const toplamFiyat = workshopIds.length * fiyatPerWorkshop
    const kategoriLabel = kategori === 'hekim' ? 'Diş Hekimi / Akademisyen' : 'Öğrenci'

    // ── Benzersiz ref kodu üret ──
    let refKodu = refKoduUret()
    let mevcut = true
    while (mevcut) {
      const { data } = await supabase
        .from('workshop_kayitlar')
        .select('id')
        .eq('ref_kodu', refKodu)
        .limit(1)
      if (!data || data.length === 0) mevcut = false
      else refKodu = refKoduUret()
    }

    // ── Dekont Storage'a yükle ──
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    const safeName = `${toSafeFileName(isim)}-${toSafeFileName(soyisim)}`
    const filename = `${refKodu}_${timestamp}_${safeName}.${ext}`
    const buffer = Buffer.from(await dekont.arrayBuffer())

    const { error: uploadError } = await supabase.storage
      .from('workshop-dekontlar')
      .upload(filename, buffer, { contentType: mime || dekont.type, upsert: false })

    if (uploadError) {
      console.error('[workshop/kayit] Storage upload error:', uploadError)
      await kontenjanGeriAl(workshopIds)
      return NextResponse.json({ error: 'Dosya yüklenemedi. Lütfen tekrar deneyin.' }, { status: 500 })
    }

    // ── workshop_kayitlar tablosuna kayıt ekle ──
    const { error: insertError } = await supabase.from('workshop_kayitlar').insert({
      ref_kodu: refKodu,
      isim,
      soyisim,
      email,
      telefon,
      workshop_ids: workshopIds,
      workshop_isimleri: workshopIsimleri,
      toplam_fiyat: toplamFiyat,
      kategori,
      dekont_path: filename,
      dekont_yuklendi: true,
    })

    if (insertError) {
      console.error('[workshop/kayit] DB insert error:', insertError)
      // Storage'ı temizle, kontenjanı geri al
      await supabase.storage.from('workshop-dekontlar').remove([filename])
      await kontenjanGeriAl(workshopIds)
      return NextResponse.json({ error: 'Kayıt oluşturulamadı. Lütfen tekrar deneyin.' }, { status: 500 })
    }

    // ── Mail gönder ──
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://madok-2026.netlify.app'
    try {
      const { data: fileData } = await supabase.storage.from('workshop-dekontlar').download(filename)
      const fileBuffer = fileData ? Buffer.from(await fileData.arrayBuffer()) : null

      // Admin'e
      await resend.emails.send({
        from: MAIL_FROM,
        to: [process.env.MAIL_TO_ODEME!],
        replyTo: email,
        subject: `MADOK 2026 — Workshop Kaydı: ${isim} ${soyisim} [${refKodu}]`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #8f6b56; border-bottom: 2px solid #e2d4c8; padding-bottom: 10px;">
              MADOK 2026 — Yeni Workshop Kaydı
            </h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr><td style="padding: 8px; color: #55524d; font-weight: bold; width: 160px;">Referans Kodu:</td><td style="padding: 8px; font-weight: bold; color: #b26c1f;">${refKodu}</td></tr>
              <tr style="background:#f8f6f3;"><td style="padding: 8px; color: #55524d; font-weight: bold;">Ad Soyad:</td><td style="padding: 8px;">${isim} ${soyisim}</td></tr>
              <tr><td style="padding: 8px; color: #55524d; font-weight: bold;">E-posta:</td><td style="padding: 8px;">${email}</td></tr>
              <tr style="background:#f8f6f3;"><td style="padding: 8px; color: #55524d; font-weight: bold;">Telefon:</td><td style="padding: 8px;">${telefon || '—'}</td></tr>
              <tr><td style="padding: 8px; color: #55524d; font-weight: bold;">Katılımcı Tipi:</td><td style="padding: 8px;">${kategoriLabel}</td></tr>
              <tr style="background:#f8f6f3;"><td style="padding: 8px; color: #55524d; font-weight: bold;">Workshoplar:</td><td style="padding: 8px;">${workshopIsimleri}</td></tr>
              <tr><td style="padding: 8px; color: #55524d; font-weight: bold;">Toplam Tutar:</td><td style="padding: 8px; font-weight: bold;">${toplamFiyat.toLocaleString('tr-TR')} ₺</td></tr>
              <tr><td style="padding: 8px; color: #55524d; font-weight: bold;">Kayıt Tarihi:</td><td style="padding: 8px;">${new Date().toLocaleString('tr-TR')}</td></tr>
            </table>
            <p style="margin-top: 1.5rem; color: #918c84; font-size: 0.8rem;">Dekont ekte bulunmaktadır.</p>
          </div>
        `,
        attachments: fileBuffer
          ? [{ filename, content: fileBuffer.toString('base64'), contentType: mime || dekont.type }]
          : [],
      })

      // Kullanıcıya
      await resend.emails.send({
        from: MAIL_FROM,
        to: [email],
        subject: `MADOK 2026 — Workshop Kaydınız Alındı [${refKodu}]`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #8f6b56; border-bottom: 2px solid #e2d4c8; padding-bottom: 10px;">
              MADOK 2026 — Workshop Kaydı Alındı
            </h2>
            <p>Sayın <strong>${isim} ${soyisim}</strong>,</p>
            <p>Workshop kaydınız başarıyla alınmıştır. Havale kontrolü yapıldıktan sonra onayınız e-posta ile iletilecektir.</p>
            <div style="background: #fdf6db; border: 2px solid #f6d988; border-radius: 12px; padding: 1.5rem; margin: 1.5rem 0; text-align: center;">
              <p style="margin: 0 0 0.5rem; color: #77461e; font-size: 0.9rem;">Referans Kodunuz</p>
              <p style="font-size: 2rem; font-weight: 800; color: #b26c1f; letter-spacing: 2px; margin: 0;">${refKodu}</p>
            </div>
            <div style="background: #f8f6f3; border-radius: 8px; padding: 1rem 1.5rem; font-size: 0.85rem; color: #55524d; line-height: 2;">
              <strong>Seçilen Workshoplar:</strong><br/>
              ${workshopIsimleri}<br/>
              <strong>Toplam Tutar:</strong> ${toplamFiyat.toLocaleString('tr-TR')} ₺
            </div>
            <div style="background: #f0ece7; border-radius: 8px; padding: 1rem 1.5rem; margin-top: 1rem; font-size: 0.85rem; color: #55524d; line-height: 1.9;">
              <strong>Banka:</strong> Ziraat Bankası<br/>
              <strong>Hesap Sahibi:</strong> Burdur Mehmet Akif Ersoy Üniversitesi<br/>
              <strong>IBAN:</strong> TR62 0001 0015 8254 4728 4452 80<br/>
              <strong>Açıklama:</strong> ${refKodu}
            </div>
            <p style="color: #918c84; font-size: 0.8rem; margin-top: 1.5rem;">
              Sorularınız için: <a href="mailto:madok.2026.burdur@gmail.com" style="color: #8f6b56;">madok.2026.burdur@gmail.com</a><br/>
              ${siteUrl}
            </p>
          </div>
        `,
      })
    } catch (mailErr) {
      console.error('[workshop/kayit] Mail gönderilemedi, kuyruğa eklendi:', mailErr)
      await mailKuyrugunaEkle(
        'workshop_admin',
        process.env.MAIL_TO_ODEME!,
        `MADOK 2026 — Workshop Kaydı: ${isim} ${soyisim} [${refKodu}]`,
        { refKodu, isim, soyisim, email, telefon, workshopIsimleri, toplamFiyat, filename }
      )
      await mailKuyrugunaEkle(
        'workshop_kullanici',
        email,
        `MADOK 2026 — Workshop Kaydınız Alındı [${refKodu}]`,
        { refKodu, isim, soyisim, workshopIsimleri, toplamFiyat }
      )
    }

    return NextResponse.json({ success: true, refKodu })
  } catch (err) {
    console.error('[workshop/kayit] Hata:', err)
    return NextResponse.json({ error: 'Sunucu hatası. Lütfen tekrar deneyin.' }, { status: 500 })
  }
}
