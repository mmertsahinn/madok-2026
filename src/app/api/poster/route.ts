import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabase } from '@/lib/supabase'

const resend = new Resend(process.env.RESEND_API_KEY)
const MAIL_FROM = 'MADOK 2026 <onboarding@resend.dev>'

// ── Sunucu tarafı MIME-type doğrulama — SADECE .docx ──
const ALLOWED_MIME_TYPES = [
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

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
    const kurum   = (formData.get('kurum')   as string)?.trim()
    const baslik  = (formData.get('baslik')  as string)?.trim()
    const dosya   = formData.get('dosya') as File | null

    if (!isim || !soyisim || !email || !baslik || !dosya) {
      return NextResponse.json({ error: 'Tüm zorunlu alanlar doldurulmalıdır.' }, { status: 400 })
    }

    if (!ALLOWED_MIME_TYPES.includes(dosya.type)) {
      return NextResponse.json(
        { error: 'Poster yalnızca .docx (Word) formatında yüklenmelidir.' },
        { status: 400 }
      )
    }

    const ext = dosya.name.split('.').pop()?.toLowerCase()
    if (ext !== 'docx') {
      return NextResponse.json({ error: 'Dosya uzantısı .docx olmalıdır.' }, { status: 400 })
    }

    if (dosya.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Dosya boyutu 10 MB'dan küçük olmalıdır." }, { status: 400 })
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    const safeName  = `${isim.toUpperCase().replace(/\s+/g, '_')}-${soyisim.toUpperCase().replace(/\s+/g, '_')}`
    const filename  = `${timestamp}_${safeName}.docx`

    // Supabase Storage'a yükle — posterler bucket
    const buffer = Buffer.from(await dosya.arrayBuffer())
    const { error: uploadError } = await supabase.storage
      .from('posterler')
      .upload(filename, buffer, {
        contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        upsert: false,
      })

    if (uploadError) {
      console.error('[poster] Storage upload error:', uploadError)
      return NextResponse.json({ error: 'Dosya yüklenemedi. Lütfen tekrar deneyin.' }, { status: 500 })
    }

    // posterler tablosuna kaydet
    const { error: insertError } = await supabase.from('posterler').insert({
      isim,
      soyisim,
      email,
      kurum: kurum || '',
      baslik,
      dosya_yolu: filename,
    })
    if (insertError) console.error('[poster] DB insert error:', insertError)

    // Mail gönder — Resend API → madok2026bildiri@gmail.com (poster başlığıyla)
    const mailPayload = { isim, soyisim, email, kurum, baslik, filename }
    try {
      const { data: fileData } = await supabase.storage.from('posterler').download(filename)
      const fileBuffer = fileData ? Buffer.from(await fileData.arrayBuffer()) : null

      await resend.emails.send({
        from: MAIL_FROM,
        to: [process.env.MAIL_TO_BILDIRI!],
        replyTo: email,
        subject: `MADOK 2026 — Poster Gönderimi: ${isim} ${soyisim}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #8f6b56; border-bottom: 2px solid #e2d4c8; padding-bottom: 10px;">
              MADOK 2026 — Poster Gönderimi
            </h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr><td style="padding: 8px; color: #55524d; font-weight: bold; width: 140px;">Ad:</td><td style="padding: 8px;">${isim}</td></tr>
              <tr style="background:#f8f6f3;"><td style="padding: 8px; color: #55524d; font-weight: bold;">Soyad:</td><td style="padding: 8px;">${soyisim}</td></tr>
              <tr><td style="padding: 8px; color: #55524d; font-weight: bold;">E-posta:</td><td style="padding: 8px;">${email}</td></tr>
              <tr style="background:#f8f6f3;"><td style="padding: 8px; color: #55524d; font-weight: bold;">Kurum:</td><td style="padding: 8px;">${kurum || '—'}</td></tr>
              <tr><td style="padding: 8px; color: #55524d; font-weight: bold;">Poster Başlığı:</td><td style="padding: 8px;">${baslik}</td></tr>
              <tr style="background:#f8f6f3;"><td style="padding: 8px; color: #55524d; font-weight: bold;">Gönderim Tarihi:</td><td style="padding: 8px;">${new Date().toLocaleString('tr-TR')}</td></tr>
            </table>
            <p style="margin-top: 24px; color: #918c84; font-size: 13px;">Poster dosyası ekte bulunmaktadır.</p>
            <p style="color: #918c84; font-size: 13px;">Bu mail otomatik olarak MADOK 2026 poster sistemi tarafından gönderilmiştir.</p>
          </div>
        `,
        attachments: fileBuffer ? [{ filename, content: fileBuffer }] : [],
      })
    } catch (mailErr) {
      console.error('[poster] Mail gönderilemedi, kuyruğa eklendi:', mailErr)
      await mailKuyrugunaEkle(
        'poster_admin',
        process.env.MAIL_TO_BILDIRI!,
        `MADOK 2026 — Poster Gönderimi: ${isim} ${soyisim}`,
        mailPayload
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[poster] Hata:', err)
    return NextResponse.json({ error: 'Sunucu hatası. Lütfen tekrar deneyin.' }, { status: 500 })
  }
}
