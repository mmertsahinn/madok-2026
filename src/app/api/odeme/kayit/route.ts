import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { supabase } from '@/lib/supabase'

function refKoduUret(): string {
  const sayi = Math.floor(100000 + Math.random() * 900000)
  return `MADOK2026-${sayi}`
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
    const body = await request.json()
    const { isim, soyisim, email, telefon, paket } = body

    if (!isim?.trim() || !soyisim?.trim() || !email?.trim() || !paket?.trim()) {
      return NextResponse.json({ error: 'Tüm zorunlu alanlar doldurulmalıdır.' }, { status: 400 })
    }

    // Aynı email ile açık bekleyen kayıt var mı?
    const { data: mevcutlar } = await supabase
      .from('kayitlar')
      .select('id')
      .eq('email', email.trim())
      .eq('dekont_yuklendi', false)
      .limit(1)

    if (mevcutlar && mevcutlar.length > 0) {
      return NextResponse.json(
        { error: 'Bu e-posta adresiyle zaten açık bir başvuru var. Dekontunuzu yükleyerek tamamlayın.' },
        { status: 409 }
      )
    }

    // Benzersiz ref kodu üret
    let refKodu = refKoduUret()
    let mevcut = true
    while (mevcut) {
      const { data } = await supabase.from('kayitlar').select('id').eq('ref_kodu', refKodu).limit(1)
      if (!data || data.length === 0) mevcut = false
      else refKodu = refKoduUret()
    }

    // Kayıt ekle
    const { error: insertError } = await supabase.from('kayitlar').insert({
      ref_kodu: refKodu,
      isim: isim.trim(),
      soyisim: soyisim.trim(),
      email: email.trim(),
      telefon: telefon?.trim() || '',
      paket: paket.trim(),
      dekont_yuklendi: false,
    })

    if (insertError) {
      console.error('[odeme/kayit] DB insert error:', insertError)
      return NextResponse.json({ error: 'Kayıt oluşturulamadı. Lütfen tekrar deneyin.' }, { status: 500 })
    }

    // Mail gönder — başarısız olursa kuyruğa ekle (veri kaybolmaz)
    const mailPayload = { isim: isim.trim(), soyisim: soyisim.trim(), email: email.trim(), refKodu, paket: paket.trim() }
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      })

      await transporter.sendMail({
        from: `"MADOK 2026 Kayıt Sistemi" <${process.env.SMTP_USER}>`,
        to: email.trim(),
        subject: `MADOK 2026 — Başvuru Referans Kodunuz: ${refKodu}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #8f6b56; border-bottom: 2px solid #e2d4c8; padding-bottom: 10px;">
              MADOK 2026 — Ön Kayıt Alındı
            </h2>
            <p>Sayın <strong>${isim} ${soyisim}</strong>,</p>
            <p>Ön kaydınız alınmıştır. Başvurunuzu tamamlamak için aşağıdaki adımları izleyin:</p>
            <div style="background: #fdf6db; border: 2px solid #f6d988; border-radius: 12px; padding: 1.5rem; margin: 1.5rem 0; text-align: center;">
              <p style="margin: 0 0 0.5rem; color: #77461e; font-size: 0.9rem;">Referans Kodunuz</p>
              <p style="font-size: 2rem; font-weight: 800; color: #b26c1f; letter-spacing: 2px; margin: 0;">${refKodu}</p>
              <p style="margin: 0.5rem 0 0; color: #77461e; font-size: 0.8rem;">Bu kodu havale açıklamasına ve dekont yükleme formuna yazın</p>
            </div>
            <ol style="line-height: 2; color: #55524d;">
              <li>Aşağıdaki IBAN'a <strong>${paket}</strong> ücretini havale/EFT yapın</li>
              <li>Havale açıklamasına <strong>"${refKodu}"</strong> yazın</li>
              <li><a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://madok2026.com'}/odeme" style="color: #8f6b56;">madok2026.com/odeme</a> adresine gidip <strong>Adım 2</strong>'yi tamamlayın</li>
              <li>Dekont PDF'ini ref kodunuzla birlikte yükleyin</li>
            </ol>
            <div style="background: #f8f6f3; border-radius: 8px; padding: 1rem 1.5rem; margin-top: 1.5rem; font-size: 0.85rem; color: #55524d; line-height: 1.9;">
              <strong>Banka:</strong> [Banka Adı]<br/>
              <strong>Hesap Sahibi:</strong> MADOK 2026 Organizasyon<br/>
              <strong>IBAN:</strong> TR00 0000 0000 0000 0000 0000 00<br/>
              <strong>Açıklama:</strong> ${refKodu}
            </div>
            <p style="margin-top: 1.5rem; color: #918c84; font-size: 0.8rem;">
              Seçilen paket: ${paket} &nbsp;·&nbsp; ${new Date().toLocaleString('tr-TR')}
            </p>
          </div>
        `,
      })
    } catch (mailErr) {
      console.error('[odeme/kayit] Mail gönderilemedi, kuyruğa eklendi:', mailErr)
      await mailKuyrugunaEkle('kayit_ref_kodu', email.trim(), `MADOK 2026 — Başvuru Referans Kodunuz: ${refKodu}`, mailPayload)
    }

    return NextResponse.json({ success: true, refKodu })
  } catch (err) {
    console.error('[odeme/kayit] Hata:', err)
    return NextResponse.json({ error: 'Sunucu hatası. Lütfen tekrar deneyin.' }, { status: 500 })
  }
}
