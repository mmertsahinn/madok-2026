import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { supabase } from '@/lib/supabase'

// ── Sunucu tarafı MIME-type doğrulama — PDF, JPG, PNG ──
const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png']
const MIME_TO_EXT: Record<string, string> = {
  'application/pdf': 'pdf',
  'image/jpeg': 'jpg',
  'image/png': 'png',
}

function odemeTransporter() {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER_ODEME,
      pass: process.env.SMTP_PASS_ODEME,
    },
  })
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
    const isim    = (formData.get('isim')    as string)?.trim()
    const soyisim = (formData.get('soyisim') as string)?.trim()
    const email   = (formData.get('email')   as string)?.trim()
    const paket   = (formData.get('paket')   as string)?.trim()
    const dekont  = formData.get('dekont') as File | null

    if (!isim || !soyisim || !email || !paket || !dekont) {
      return NextResponse.json(
        { error: 'Tüm zorunlu alanlar doldurulmalıdır.' },
        { status: 400 }
      )
    }

    // Sunucu tarafı MIME-type doğrulama — strict
    if (!ALLOWED_MIME_TYPES.includes(dekont.type)) {
      return NextResponse.json(
        { error: 'Dekont yalnızca PDF, JPG veya PNG formatında yüklenebilir.' },
        { status: 400 }
      )
    }

    if (dekont.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Dosya boyutu 10 MB'dan küçük olmalıdır." },
        { status: 400 }
      )
    }

    const ext       = MIME_TO_EXT[dekont.type] ?? 'bin'
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    const safeName  = `${isim.toUpperCase().replace(/\s+/g, '_')}-${soyisim.toUpperCase().replace(/\s+/g, '_')}`
    const filename  = `${timestamp}_${safeName}.${ext}`

    // Supabase Storage'a yükle — dekontlar bucket
    const buffer = Buffer.from(await dekont.arrayBuffer())
    const { error: uploadError } = await supabase.storage
      .from('dekontlar')
      .upload(filename, buffer, {
        contentType: dekont.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('[odeme] Storage upload error:', uploadError)
      return NextResponse.json(
        { error: 'Dekont yüklenemedi. Lütfen tekrar deneyin.' },
        { status: 500 }
      )
    }

    // odemeler tablosuna kaydet
    const { error: insertError } = await supabase.from('odemeler').insert({
      isim,
      soyisim,
      email,
      paket,
      dekont_storage_path: filename,
    })

    if (insertError) {
      console.error('[odeme] DB insert error:', insertError)
    }

    // Mail gönder (başarısız olursa kuyruğa)
    const mailPayload = { isim, soyisim, email, paket, filename }
    try {
      const transporter = odemeTransporter()
      const from = `"MADOK 2026 Kayıt Sistemi" <${process.env.SMTP_USER_ODEME}>`

      // Dosyayı Storage'dan al, ek olarak gönder
      const { data: fileData } = await supabase.storage.from('dekontlar').download(filename)
      const fileBuffer = fileData ? Buffer.from(await fileData.arrayBuffer()) : null

      await transporter.sendMail({
        from,
        to: process.env.MAIL_TO_ODEME,
        subject: `MADOK 2026 — Ödeme Bildirimi: ${isim} ${soyisim}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #8f6b56; border-bottom: 2px solid #e2d4c8; padding-bottom: 10px;">
              MADOK 2026 — Ödeme Bildirimi
            </h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr><td style="padding: 8px; color: #55524d; font-weight: bold; width: 140px;">Ad:</td><td style="padding: 8px;">${isim}</td></tr>
              <tr style="background: #f8f6f3;"><td style="padding: 8px; color: #55524d; font-weight: bold;">Soyad:</td><td style="padding: 8px;">${soyisim}</td></tr>
              <tr><td style="padding: 8px; color: #55524d; font-weight: bold;">E-posta:</td><td style="padding: 8px;">${email}</td></tr>
              <tr style="background: #f8f6f3;"><td style="padding: 8px; color: #55524d; font-weight: bold;">Paket:</td><td style="padding: 8px;">${paket}</td></tr>
              <tr><td style="padding: 8px; color: #55524d; font-weight: bold;">Başvuru Tarihi:</td><td style="padding: 8px;">${new Date().toLocaleString('tr-TR')}</td></tr>
              <tr style="background: #f8f6f3;"><td style="padding: 8px; color: #55524d; font-weight: bold;">Dekont Dosyası:</td><td style="padding: 8px;">${filename}</td></tr>
            </table>
            <p style="margin-top: 24px; color: #918c84; font-size: 13px;">
              Dekont dosyası ekte bulunmaktadır.
            </p>
            <p style="color: #918c84; font-size: 13px;">
              Bu mail otomatik olarak MADOK 2026 kayıt sistemi tarafından gönderilmiştir.
            </p>
          </div>
        `,
        attachments: fileBuffer
          ? [{ filename, content: fileBuffer }]
          : [],
      })
    } catch (mailErr) {
      console.error('[odeme] Mail gönderilemedi, kuyruğa eklendi:', mailErr)
      await mailKuyrugunaEkle(
        'odeme_admin',
        process.env.MAIL_TO_ODEME!,
        `MADOK 2026 — Ödeme Bildirimi: ${isim} ${soyisim}`,
        mailPayload
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[odeme] Hata:', err)
    return NextResponse.json(
      { error: 'Sunucu hatası. Lütfen tekrar deneyin.' },
      { status: 500 }
    )
  }
}
