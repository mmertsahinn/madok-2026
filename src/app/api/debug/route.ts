import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') ?? 'odeme'

  const results: Record<string, unknown> = {
    env: {
      SMTP_USER_ODEME: process.env.SMTP_USER_ODEME ?? 'EKSIK',
      SMTP_PASS_ODEME: process.env.SMTP_PASS_ODEME ? '***gizli***' : 'EKSIK',
      MAIL_TO_ODEME: process.env.MAIL_TO_ODEME ?? 'EKSIK',
      SMTP_USER_BILDIRI: process.env.SMTP_USER_BILDIRI ?? 'EKSIK',
      SMTP_PASS_BILDIRI: process.env.SMTP_PASS_BILDIRI ? '***gizli***' : 'EKSIK',
      MAIL_TO_BILDIRI: process.env.MAIL_TO_BILDIRI ?? 'EKSIK',
    },
  }

  // Ödeme maili testi
  if (type === 'odeme') {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER_ODEME,
          pass: process.env.SMTP_PASS_ODEME,
        },
      })

      await transporter.verify()
      results.odeme_smtp = 'BAĞLANTI BAŞARILI ✅'

      const info = await transporter.sendMail({
        from: `"MADOK 2026 TEST" <${process.env.SMTP_USER_ODEME}>`,
        to: process.env.MAIL_TO_ODEME,
        subject: 'MADOK 2026 — Test: Ödeme Sistemi',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #8f6b56; border-bottom: 2px solid #e2d4c8; padding-bottom: 10px;">
              ✅ MADOK 2026 — Ödeme Mail Testi
            </h2>
            <p>Bu bir test mailidir. Ödeme bildirimi sistemi çalışıyor.</p>
            <p><strong>Gönderim zamanı:</strong> ${new Date().toLocaleString('tr-TR')}</p>
            <hr style="border: 1px solid #e2d4c8; margin: 20px 0;">
            <p style="color: #918c84; font-size: 12px;">
              MADOK 2026 Kongre Sistemi — Otomatik Test Maili
            </p>
          </div>
        `,
      })

      results.odeme_mail = `Gönderildi ✅ (MessageId: ${info.messageId})`
    } catch (err: unknown) {
      const error = err as Error
      results.odeme_smtp = `HATA ❌: ${error.message}`
      results.odeme_mail = 'Gönderilemedi ❌'
    }
  }

  // Bildiri maili testi
  if (type === 'bildiri') {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER_BILDIRI,
          pass: process.env.SMTP_PASS_BILDIRI,
        },
      })

      await transporter.verify()
      results.bildiri_smtp = 'BAĞLANTI BAŞARILI ✅'

      const info = await transporter.sendMail({
        from: `"MADOK 2026 TEST" <${process.env.SMTP_USER_BILDIRI}>`,
        to: process.env.MAIL_TO_BILDIRI,
        subject: 'MADOK 2026 — Test: Bildiri/Poster Sistemi',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #8f6b56; border-bottom: 2px solid #e2d4c8; padding-bottom: 10px;">
              ✅ MADOK 2026 — Bildiri/Poster Mail Testi
            </h2>
            <p>Bu bir test mailidir. Bildiri/Poster gönderim sistemi çalışıyor.</p>
            <p><strong>Gönderim zamanı:</strong> ${new Date().toLocaleString('tr-TR')}</p>
            <hr style="border: 1px solid #e2d4c8; margin: 20px 0;">
            <p style="color: #918c84; font-size: 12px;">
              MADOK 2026 Kongre Sistemi — Otomatik Test Maili
            </p>
          </div>
        `,
      })

      results.bildiri_mail = `Gönderildi ✅ (MessageId: ${info.messageId})`
    } catch (err: unknown) {
      const error = err as Error
      results.bildiri_smtp = `HATA ❌: ${error.message}`
      results.bildiri_mail = 'Gönderilemedi ❌'
    }
  }

  return NextResponse.json(results, { status: 200 })
}
