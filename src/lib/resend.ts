import { Resend } from 'resend'

// ── Bildiri + Poster mailleri için Resend ──
if (!process.env.RESEND_API_KEY_BILDIRI) {
  console.warn('[resend] RESEND_API_KEY_BILDIRI ortam değişkeni tanımlı değil')
}
export const resendBildiri = new Resend(process.env.RESEND_API_KEY_BILDIRI)

// ── Ödeme/Dekont mailleri için Resend ──
if (!process.env.RESEND_API_KEY_ODEME) {
  console.warn('[resend] RESEND_API_KEY_ODEME ortam değişkeni tanımlı değil')
}
export const resendOdeme = new Resend(process.env.RESEND_API_KEY_ODEME)

// From adresi — Resend panelinde onaylı domain gerekir
// Şimdilik Resend'in test adresini kullan (production'da değiştir)
export const MAIL_FROM_BILDIRI =
  process.env.MAIL_FROM_BILDIRI ?? 'MADOK 2026 <onboarding@resend.dev>'
export const MAIL_FROM_ODEME =
  process.env.MAIL_FROM_ODEME ?? 'MADOK 2026 <onboarding@resend.dev>'
