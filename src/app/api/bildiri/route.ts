import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { resendBildiri, MAIL_FROM_BILDIRI } from '@/lib/resend'

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

// ── Sunucu tarafı MIME-type doğrulama — SADECE .docx ──
const ALLOWED_MIME_TYPES = [
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/octet-stream', // bazı tarayıcılar .docx için bunu gönderir
]

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const isim    = (formData.get('isim')    as string)?.trim()
    const soyisim = (formData.get('soyisim') as string)?.trim()
    const email   = (formData.get('email')   as string)?.trim()
    const kurum   = (formData.get('kurum')   as string)?.trim()
    const baslik  = (formData.get('baslik')  as string)?.trim()
    const dosya   = formData.get('dosya') as File | null

    // ── Alan doğrulama ──
    if (!isim || !soyisim || !email || !baslik || !dosya) {
      return NextResponse.json(
        { error: 'Tüm zorunlu alanlar doldurulmalıdır.' },
        { status: 400 }
      )
    }

    // ── Uzantı doğrulama (birincil kontrol) ──
    const ext = dosya.name.split('.').pop()?.toLowerCase()
    if (ext !== 'docx') {
      return NextResponse.json(
        { error: 'Bildiri yalnızca .docx (Word) formatında yüklenmelidir.' },
        { status: 400 }
      )
    }

    // ── MIME-type doğrulama (ikincil kontrol — mobil uyumlu) ──
    const mimeType = dosya.type.split(';')[0].trim().toLowerCase()
    if (mimeType && !ALLOWED_MIME_TYPES.includes(mimeType)) {
      return NextResponse.json(
        { error: 'Bildiri yalnızca .docx (Word) formatında yüklenmelidir.' },
        { status: 400 }
      )
    }

    // ── Boyut kontrolü ──
    if (dosya.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Dosya boyutu 10 MB'dan küçük olmalıdır." },
        { status: 400 }
      )
    }

    // ── Dosya adı oluştur (ASCII-safe) ──
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    const safeName  = `${toSafeFileName(isim)}-${toSafeFileName(soyisim)}`
    const filename  = `${timestamp}_${safeName}.docx`

    // ── Supabase Storage'a yükle — bildirilier bucket ──
    const buffer = Buffer.from(await dosya.arrayBuffer())
    const { error: uploadError } = await supabase.storage
      .from('bildirilier')
      .upload(filename, buffer, {
        contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        upsert: false,
      })

    if (uploadError) {
      console.error('[bildiri] Storage upload error:', uploadError)
      return NextResponse.json(
        { error: 'Dosya yüklenemedi. Lütfen tekrar deneyin.' },
        { status: 500 }
      )
    }

    // ── bildirilier tablosuna kaydet ──
    const { error: insertError } = await supabase.from('bildirilier').insert({
      isim,
      soyisim,
      email,
      kurum: kurum || '',
      baslik,
      dosya_yolu: filename,
    })
    if (insertError) console.error('[bildiri] DB insert error:', insertError)

    // ── Resend ile admin mailine gönder ──
    const adminTo = process.env.MAIL_TO_BILDIRI ?? 'madok2026bildiri@gmail.com'

    const { error: mailError } = await resendBildiri.emails.send({
      from: MAIL_FROM_BILDIRI,
      to: adminTo,
      reply_to: email,
      subject: `MADOK 2026 — Bildiri Gönderimi: ${isim} ${soyisim}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8f6b56; border-bottom: 2px solid #e2d4c8; padding-bottom: 10px;">
            MADOK 2026 — Bildiri Gönderimi
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr><td style="padding: 8px; color: #55524d; font-weight: bold; width: 140px;">Ad:</td><td style="padding: 8px;">${isim}</td></tr>
            <tr style="background:#f8f6f3;"><td style="padding: 8px; color: #55524d; font-weight: bold;">Soyad:</td><td style="padding: 8px;">${soyisim}</td></tr>
            <tr><td style="padding: 8px; color: #55524d; font-weight: bold;">E-posta:</td><td style="padding: 8px;">${email}</td></tr>
            <tr style="background:#f8f6f3;"><td style="padding: 8px; color: #55524d; font-weight: bold;">Kurum:</td><td style="padding: 8px;">${kurum || '—'}</td></tr>
            <tr><td style="padding: 8px; color: #55524d; font-weight: bold;">Bildiri Başlığı:</td><td style="padding: 8px;">${baslik}</td></tr>
            <tr style="background:#f8f6f3;"><td style="padding: 8px; color: #55524d; font-weight: bold;">Gönderim Tarihi:</td><td style="padding: 8px;">${new Date().toLocaleString('tr-TR')}</td></tr>
            <tr><td style="padding: 8px; color: #55524d; font-weight: bold;">Dosya Adı:</td><td style="padding: 8px;">${filename}</td></tr>
          </table>
          <p style="margin-top: 24px; color: #918c84; font-size: 13px;">Bildiri dosyası ekte bulunmaktadır.</p>
          <p style="color: #918c84; font-size: 13px;">Bu mail otomatik olarak MADOK 2026 bildiri sistemi tarafından gönderilmiştir.</p>
        </div>
      `,
      attachments: [
        {
          filename: filename,
          content: buffer.toString('base64'),
          content_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        },
      ],
    })

    if (mailError) {
      // Mail başarısız olsa bile kullanıcıya başarı döndür — dosya zaten Supabase'e yüklendi
      console.error('[bildiri] Resend mail error:', mailError)
      // mail_queue'ya kaydet (isteğe bağlı yedek)
      await supabase.from('mail_queue').insert({
        mail_type: 'bildiri_admin',
        recipient: adminTo,
        subject: `MADOK 2026 — Bildiri Gönderimi: ${isim} ${soyisim}`,
        payload: { isim, soyisim, email, kurum, baslik, filename },
        status: 'pending',
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[bildiri] Hata:', err)
    return NextResponse.json(
      { error: 'Sunucu hatası. Lütfen tekrar deneyin.' },
      { status: 500 }
    )
  }
}
