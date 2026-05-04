import { NextRequest, NextResponse } from 'next/server'
import { resendOdeme as resend, MAIL_FROM_ODEME as MAIL_FROM } from '@/lib/resend'
import { supabase } from '@/lib/supabase'

// ── İzin verilen MIME tipleri (sunucu tarafı doğrulama) ──
const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png']
const ALLOWED_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png']

// ── Türkçe/özel karakterleri ASCII'ye çevir ──
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
    const refKodu = (formData.get('refKodu') as string)?.trim().toUpperCase()
    const dekont = formData.get('dekont') as File | null

    if (!refKodu || !dekont) {
      return NextResponse.json({ error: 'Referans kodu ve dekont zorunludur.' }, { status: 400 })
    }

    // Sunucu tarafı MIME-type doğrulama
    if (!ALLOWED_MIME_TYPES.includes(dekont.type)) {
      return NextResponse.json(
        { error: 'Dekont yalnızca PDF, JPG veya PNG formatında yüklenmelidir.' },
        { status: 400 }
      )
    }

    const ext = dekont.name.split('.').pop()?.toLowerCase() ?? ''
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { error: 'Geçersiz dosya uzantısı. PDF, JPG veya PNG yükleyin.' },
        { status: 400 }
      )
    }

    if (dekont.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Dosya boyutu 10 MB'dan küçük olmalıdır." }, { status: 400 })
    }

    // Ref kodu kontrol
    const { data: kayitlar, error: fetchError } = await supabase
      .from('kayitlar')
      .select('*')
      .eq('ref_kodu', refKodu)
      .limit(1)

    if (fetchError || !kayitlar || kayitlar.length === 0) {
      return NextResponse.json(
        { error: "Geçersiz referans kodu. Lütfen Adım 1'i tamamlayarak kod alın." },
        { status: 404 }
      )
    }

    const kayit = kayitlar[0]

    if (kayit.dekont_yuklendi) {
      return NextResponse.json(
        { error: 'Bu referans kodu ile dekont zaten yüklenmiş. Tekrar gönderim yapılamaz.' },
        { status: 409 }
      )
    }

    // Supabase Storage'a yükle
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    const safeName = `${toSafeFileName(kayit.isim)}-${toSafeFileName(kayit.soyisim)}`
    const filename = `${refKodu}_${timestamp}_${safeName}.${ext}`
    const buffer = Buffer.from(await dekont.arrayBuffer())

    const { error: uploadError } = await supabase.storage
      .from('dekontlar')
      .upload(filename, buffer, { contentType: dekont.type, upsert: false })

    if (uploadError) {
      console.error('[odeme/dekont] Storage upload error:', uploadError)
      return NextResponse.json({ error: 'Dosya yüklenemedi. Lütfen tekrar deneyin.' }, { status: 500 })
    }

    // kayitlar tablosunu güncelle
    await supabase
      .from('kayitlar')
      .update({ dekont_yuklendi: true, updated_at: new Date().toISOString() })
      .eq('ref_kodu', refKodu)

    // odemeler tablosuna kaydet (dekont storage linki + email)
    const { error: odemeInsertError } = await supabase.from('odemeler').insert({
      ref_kodu: refKodu,
      email: kayit.email,
      dekont_storage_path: filename,
    })

    if (odemeInsertError) {
      console.error('[odeme/dekont] odemeler insert error:', odemeInsertError)
    }

    // Mail gönder via Resend (başarısız olursa kuyruğa)
    try {
      const { data: fileData } = await supabase.storage.from('dekontlar').download(filename)
      const fileBuffer = fileData ? Buffer.from(await fileData.arrayBuffer()) : null

      // Admin'e
      await resend.emails.send({
        from: MAIL_FROM,
        to: [process.env.MAIL_TO_ODEME!],
        replyTo: kayit.email,
        subject: `MADOK 2026 — Ödeme Onay Bekliyor: ${kayit.isim} ${kayit.soyisim} [${refKodu}]`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #8f6b56; border-bottom: 2px solid #e2d4c8; padding-bottom: 10px;">
              MADOK 2026 — Yeni Dekont Yüklendi
            </h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr><td style="padding: 8px; color: #55524d; font-weight: bold; width: 160px;">Referans Kodu:</td><td style="padding: 8px; font-weight: bold; color: #b26c1f;">${refKodu}</td></tr>
              <tr style="background:#f8f6f3;"><td style="padding: 8px; color: #55524d; font-weight: bold;">Ad Soyad:</td><td style="padding: 8px;">${kayit.isim} ${kayit.soyisim}</td></tr>
              <tr><td style="padding: 8px; color: #55524d; font-weight: bold;">E-posta:</td><td style="padding: 8px;">${kayit.email}</td></tr>
              <tr style="background:#f8f6f3;"><td style="padding: 8px; color: #55524d; font-weight: bold;">Telefon:</td><td style="padding: 8px;">${kayit.telefon || '—'}</td></tr>
              <tr><td style="padding: 8px; color: #55524d; font-weight: bold;">Paket:</td><td style="padding: 8px;">${kayit.paket}</td></tr>
              <tr style="background:#f8f6f3;"><td style="padding: 8px; color: #55524d; font-weight: bold;">Dekont Yükleme:</td><td style="padding: 8px;">${new Date().toLocaleString('tr-TR')}</td></tr>
            </table>
            <p style="margin-top: 1.5rem; color: #918c84; font-size: 0.8rem;">Dekont ekte bulunmaktadır.</p>
          </div>
        `,
        attachments: fileBuffer
          ? [{ filename, content: fileBuffer.toString('base64'), content_type: dekont.type }]
          : [],
      })

      // Kullanıcıya
      await resend.emails.send({
        from: MAIL_FROM,
        to: [kayit.email],
        subject: `MADOK 2026 — Dekontunuz Alındı [${refKodu}]`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #8f6b56; border-bottom: 2px solid #e2d4c8; padding-bottom: 10px;">Dekontunuz Alındı</h2>
            <p>Sayın <strong>${kayit.isim} ${kayit.soyisim}</strong>,</p>
            <p><strong>${refKodu}</strong> referans kodlu başvurunuzun dekontu sistemimize ulaşmıştır.
            Organizasyon ekibimiz havale kontrolünü yaptıktan sonra kayıt onayınız e-posta ile iletilecektir.</p>
            <p style="color: #918c84; font-size: 0.85rem; margin-top: 2rem;">
              Seçilen paket: ${kayit.paket}<br/>
              İşlem tarihi: ${new Date().toLocaleString('tr-TR')}
            </p>
          </div>
        `,
      })
    } catch (mailErr) {
      console.error('[odeme/dekont] Mail gönderilemedi, kuyruğa eklendi:', mailErr)
      await mailKuyrugunaEkle(
        'dekont_admin',
        process.env.MAIL_TO_ODEME!,
        `MADOK 2026 — Ödeme Onay Bekliyor: ${kayit.isim} ${kayit.soyisim} [${refKodu}]`,
        { refKodu, kayit, filename }
      )
      await mailKuyrugunaEkle(
        'dekont_kullanici',
        kayit.email,
        `MADOK 2026 — Dekontunuz Alındı [${refKodu}]`,
        { refKodu, kayit }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[odeme/dekont] Hata:', err)
    return NextResponse.json({ error: 'Sunucu hatası. Lütfen tekrar deneyin.' }, { status: 500 })
  }
}
