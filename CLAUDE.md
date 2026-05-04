# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> ⚠️ **This is NOT standard Next.js.** This project runs Next.js 16.2.4 with React 19.2.4 — APIs and conventions may differ from training data. Read `node_modules/next/dist/docs/` before writing any code. Heed all deprecation notices.

## Commands

```bash
npm run dev      # local dev server
npm run build    # production build
npm run lint     # eslint
npx tsc --noEmit # type check only (no build output)
```

No test runner is configured.

## Katı Kurallar

Bu kurallar ihlal edilemez — mimari kararlardan önce gelir.

### Dosya kısıtlamaları

| Sistem | İzin verilen formatlar | MIME kontrolü |
|--------|----------------------|---------------|
| Bildiri | `.docx` SADECE | `application/vnd.openxmlformats-officedocument.wordprocessingml.document` — tam eşleşme |
| Dekont | `.pdf`, `.jpg`, `.jpeg`, `.png` | `application/pdf`, `image/jpeg`, `image/png` |

- `application/msword` ve `application/octet-stream` bildiri için **kabul edilmez** — güvenilmez MIME
- Hem MIME type hem dosya uzantısı sunucu tarafında (`route.ts` içinde) ayrı ayrı doğrulanır
- Client-side validasyon tek başına yeterli değil — sunucu mutlaka kontrol eder

### Tablo ayrımı (ihlal edilemez)

- `kayitlar` → ödeme adım 1, ref kodu + kişisel bilgi
- `odemeler` → dekont storage path + email (ödeme tamamlandığında)
- `bildirilier` → bildiri storage path + kişisel bilgi
- **Bu üç tablo birleştirilemez, veri karıştırılamaz**

### Mail sistemi

- Ödeme mailleri: `madok.2026.burdur@gmail.com` (`SMTP_USER_ODEME`)
- Bildiri mailleri: `madok2026bildiri@gmail.com` (`SMTP_USER_BILDIRI`)
- Her iki sistemin SMTP config'i birbirine karıştırılmaz
- Mail başarısız olsa bile veri kaybı olmaz — `mail_queue` tablosuna düşer
- Dekont/bildiri dosyası Storage'dan indirilerek mail'e **attachment** olarak eklenir

---

## Architecture

**Stack:** Next.js 16 App Router · TypeScript · Tailwind CSS v4 · Supabase (PostgreSQL + Storage) · nodemailer (SMTP, not yet configured)

**Language:** Turkish UI, Turkish variable names throughout.

### Page structure

- `/` — homepage, composed of sections from `src/components/sections/`
- `/odeme` — 2-step payment wizard (client component, uses `useSearchParams` → wrapped in `<Suspense>`)
- `/bildiri` — paper submission form (DOCX upload)
- `/mekan` — venue page with Google Maps embed
- `/paketler` — registration packages; "Kayıt Ol" buttons link to `/odeme?paket=X`
- All other pages (`/hakkinda`, `/program`, `/konusmacilar`, `/komiteler`, `/iletisim`, `/sponsorluk`) are static

### API routes (all server-side)

| Route | Purpose |
|-------|---------|
| `POST /api/odeme/kayit` | Step 1 of payment — saves registration to Supabase `kayitlar` table, returns `MADOK2026-XXXXXX` ref code |
| `POST /api/odeme/dekont` | Step 2 — validates ref code, uploads PDF to Supabase Storage `dekontlar` bucket, marks `dekont_yuklendi=true` |
| `POST /api/bildiri` | Saves DOCX to Supabase Storage `bildirilier` bucket, inserts row in `bildirilier` table |
| `POST /api/odeme` | **Legacy/unused** — old single-step route using local filesystem; do not use |

### Supabase schema

Tables: `kayitlar`, `odemeler`, `bildirilier`, `mail_queue`  
Storage buckets: `dekontlar` (PDF/JPG/PNG, 10 MB), `bildirilier` (DOCX, 10 MB)  
All tables have RLS enabled; service role key bypasses it.

- `kayitlar` — ödeme adım 1: ref kodu + kişisel bilgi
- `odemeler` — ödeme adım 2: `ref_kodu` (FK → kayitlar), `email`, `dekont_storage_path`
- `bildirilier` — bildiri: isim, soyisim, email, kurum, baslik, `dosya_yolu`
- `mail_queue` — SMTP başarısız olursa `pending` satır eklenir, veri kaybolmaz

### Supabase client

`src/lib/supabase.ts` — server-side only, uses `SUPABASE_SERVICE_ROLE_KEY`. Never import this in client components.

### Mail

nodemailer + Gmail SMTP. **İki ayrı hesap:**
- Ödeme: `madok.2026.burdur@gmail.com` — `SMTP_USER_ODEME` / `SMTP_PASS_ODEME`
- Bildiri: `madok2026bildiri@gmail.com` — `SMTP_USER_BILDIRI` / `SMTP_PASS_BILDIRI`

App Passwords yapılandırılmış — aktif. Mail başarısız → `mail_queue` tablosuna düşer, veri kaybolmaz.

## Environment variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
SMTP_USER_ODEME            # madok.2026.burdur@gmail.com
SMTP_PASS_ODEME            # Gmail App Password (ödeme)
MAIL_TO_ODEME              # admin dekont alıcısı
SMTP_USER_BILDIRI          # madok2026bildiri@gmail.com
SMTP_PASS_BILDIRI          # Gmail App Password (bildiri)
MAIL_TO_BILDIRI            # admin bildiri alıcısı
NEXT_PUBLIC_SITE_URL       # mail link template'lerinde kullanılır
```

## Key conventions

- Inline styles used throughout (no CSS modules, no Tailwind in components — Tailwind only in globals)
- `@/` path alias maps to `src/`
- All user-facing text is Turkish
- File naming for uploads: `REFKOD_TIMESTAMP_ISIM-SOYISIM.ext`
