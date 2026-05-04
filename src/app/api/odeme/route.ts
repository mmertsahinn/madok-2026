import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { resendOdeme, MAIL_FROM_ODEME } from '@/lib/resend'

// ── Türkçe/özel karakterleri ASCII'ye çevir (Supabase Storage key'i ASCII ister) ──
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

// ── Sunucu tarafı MIME-type doğrulama — PDF, JPG, PNG ──
const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png']
const MIME_TO_EXT: Record<string, string> = {
  'application/pdf': 'pdf',
  'image/jpeg': 'jpg',
  'image/png': 'png',
}
const EXT_TO_MIME: Record<string, string> = {
  'pdf': 'application/pdf',
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'png': 'image/png',
}

// Mobil tarayıcılar bazen image/jpg, application/octet-stream veya boş type gönderir
function normalizeMime(rawType: string, filename: string): string {
  let mime = rawType.split(';')[0].trim().toLowerCase()
  if (mime === 'image/jpg') mime = 'image/jpeg'
  // Belirsiz MIME → uzantıya göre çöz
  if (!mime || mime === 'application/octet-stream') {
    const ext = filename.split('.').pop()?.toLowerCase() ?? ''
    mime = EXT_TO_MIME[ext] ?? mime
  }
  return mime
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

    // Sunucu tarafı MIME-type doğrulama — mobil fallback dahil
    const mimeType = normalizeMime(dekont.type, dekont.name)
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
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

    const ext       = MIME_TO_EXT[mimeType] ?? 'bin'
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    const safeName  = `${toSafeFileName(isim)}-${toSafeFileName(soyisim)}`
    const filename  = `${timestamp}_${safeName}.${ext}`

    // ── Supabase Storage'a yükle — dekontlar bucket ──
    const buffer = Buffer.from(await dekont.arrayBuffer())
    const { error: uploadError } = await supabase.storage
      .from('dekontlar')
      .upload(filename, buffer, {
        contentType: mimeType,
        upsert: false,
      })

    if (uploadError) {
      console.error('[odeme] Storage upload error:', uploadError)
      return NextResponse.json(
        { error: 'Dekont yüklenemedi. Lütfen tekrar deneyin.' },
        { status: 500 }
      )
    }

    // ── odemeler tablosuna kaydet ──
    const { error: insertError } = await supabase.from('odemeler').insert({
      isim,
      soyisim,
      email,
      paket,
      dekont_storage_path: filename,
    })
    if (insertError) console.error('[odeme] DB insert error:', insertError)

    // ── Resend ile admin mailine gönder ──
    const adminTo = process.env.MAIL_TO_ODEME ?? 'madok.2026.burdur@gmail.com'

    const { error: mailError } = await resendOdeme.emails.send({
      from: MAIL_FROM_ODEME,
      to: adminTo,
      replyTo: email,
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
      attachments: [
        {
          filename: filename,
          content: buffer.toString('base64'),
          contentType: mimeType,
        },
      ],
    })

    if (mailError) {
      console.error('[odeme] Resend mail error:', mailError)
      await supabase.from('mail_queue').insert({
        mail_type: 'odeme_admin',
        recipient: adminTo,
        subject: `MADOK 2026 — Ödeme Bildirimi: ${isim} ${soyisim}`,
        payload: { isim, soyisim, email, paket, filename },
        status: 'pending',
      })
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
