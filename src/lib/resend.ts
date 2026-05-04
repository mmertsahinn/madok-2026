import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  console.warn('[resend] RESEND_API_KEY ortam değişkeni tanımlı değil')
}

export const resend = new Resend(process.env.RESEND_API_KEY)

// "from" adresi — Resend panelinden kendi domaininizi doğruladıktan sonra değiştirin
// Örnek: 'MADOK 2026 <noreply@madok2026.com>'
// Şimdilik onboarding@resend.dev (tüm alıcılara gönderebilir)
export const MAIL_FROM = process.env.MAIL_FROM ?? 'MADOK 2026 <onboarding@resend.dev>'
