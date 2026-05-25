-- ─────────────────────────────────────────────────────────────────
-- MADOK 2026 — Workshop Sistemi Migration
-- Supabase SQL Editor'da çalıştır
-- ─────────────────────────────────────────────────────────────────

-- 1. WORKSHOPS TABLOSU
CREATE TABLE IF NOT EXISTS workshops (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  isim             TEXT NOT NULL,
  aciklama         TEXT DEFAULT '',
  tarih            TEXT DEFAULT '',        -- "19 Haziran 2026" gibi
  sure             TEXT DEFAULT '',        -- "3 saat" gibi
  kontenjan        INT NOT NULL DEFAULT 30,
  kayitli_sayisi   INT NOT NULL DEFAULT 0,
  fiyat            INT NOT NULL DEFAULT 0, -- TL cinsinden
  is_published     BOOLEAN NOT NULL DEFAULT false,
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now()
);

-- 2. WORKSHOP KAYITLAR TABLOSU
CREATE TABLE IF NOT EXISTS workshop_kayitlar (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ref_kodu            TEXT UNIQUE NOT NULL,
  isim                TEXT NOT NULL,
  soyisim             TEXT NOT NULL,
  email               TEXT NOT NULL,
  telefon             TEXT DEFAULT '',
  workshop_ids        UUID[] NOT NULL,       -- seçilen workshopların ID'leri
  workshop_isimleri   TEXT NOT NULL,         -- "Workshop A, Workshop B" (mail için)
  toplam_fiyat        INT NOT NULL DEFAULT 0,
  dekont_path         TEXT DEFAULT '',
  dekont_yuklendi     BOOLEAN NOT NULL DEFAULT false,
  created_at          TIMESTAMPTZ DEFAULT now(),
  updated_at          TIMESTAMPTZ DEFAULT now()
);

-- 3. RLS ENABLE
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_kayitlar ENABLE ROW LEVEL SECURITY;

-- Yalnızca service role erişebilir (uygulama service role key kullanıyor)
CREATE POLICY "service_role_all_workshops"
  ON workshops FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_workshop_kayitlar"
  ON workshop_kayitlar FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 4. ATOMİK KONTENJAN ARTTIRMA RPC
-- Race condition olmadan: FOR UPDATE + check + increment tek işlemde
CREATE OR REPLACE FUNCTION workshop_kontenjan_artir(p_ids UUID[])
RETURNS TABLE(workshop_id UUID, isim TEXT, basarili BOOLEAN) AS $$
DECLARE
  v_id    UUID;
  v_row   workshops%ROWTYPE;
BEGIN
  FOREACH v_id IN ARRAY p_ids LOOP
    SELECT * INTO v_row
    FROM workshops
    WHERE id = v_id
    FOR UPDATE;  -- satır kilitle

    IF NOT FOUND THEN
      workshop_id := v_id;
      isim        := 'Bilinmiyor';
      basarili    := FALSE;
      RETURN NEXT;
      CONTINUE;
    END IF;

    IF v_row.kayitli_sayisi >= v_row.kontenjan THEN
      workshop_id := v_id;
      isim        := v_row.isim;
      basarili    := FALSE;
      RETURN NEXT;
    ELSE
      UPDATE workshops
        SET kayitli_sayisi = kayitli_sayisi + 1,
            updated_at     = now()
        WHERE id = v_id;

      workshop_id := v_id;
      isim        := v_row.isim;
      basarili    := TRUE;
      RETURN NEXT;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4b. KONTENJAN AZALTMA RPC (kompanzasyon için)
-- Kayıt başarısız olursa artırılan kontenjanı geri alır
CREATE OR REPLACE FUNCTION workshop_kontenjan_azalt(p_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE workshops
    SET kayitli_sayisi = GREATEST(0, kayitli_sayisi - 1),
        updated_at     = now()
    WHERE id = p_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. STORAGE BUCKET (workshop dekontları)
-- Supabase Dashboard > Storage > New Bucket > "workshop-dekontlar" (private)
-- Ya da aşağıdaki SQL ile:
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'workshop-dekontlar',
  'workshop-dekontlar',
  false,
  10485760,  -- 10 MB
  ARRAY['application/pdf', 'image/jpeg', 'image/png']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: service role erişimi
CREATE POLICY "service_role_workshop_storage"
  ON storage.objects FOR ALL TO service_role
  USING (bucket_id = 'workshop-dekontlar')
  WITH CHECK (bucket_id = 'workshop-dekontlar');

-- 6. WORKSHOP VERİSİ
INSERT INTO workshops (isim, aciklama, tarih, sure, kontenjan, fiyat, is_published) VALUES
  (
    'Doç. Dr. Hakan Yasin Gönder — Anterior Bölgede Diastema Kapatma',
    'Klinik protokolden estetik sonuca anterior diastema kapatma teknikleri ve vaka yönetimi',
    '19 Haziran 2026',
    '3 saat',
    20,
    1500,
    true
  ),
  (
    'Dr. Öğr. Üyesi Abdurrahman Yalçın — Posterior Restorasyonlarda Fonksiyonel ve Estetik Oklüzal Morfoloji',
    'Posterior bölgede fonksiyon ve estetiği birleştiren oklüzal morfoloji protokolleri',
    '20 Haziran 2026',
    '3 saat',
    20,
    1500,
    true
  ),
  (
    'Prof. Dr. Alper Sindel — Temel İmplant Uygulamaları',
    'İmplant cerrahisinde temel prensipler, vaka seçimi ve klinik protokoller',
    '21 Haziran 2026',
    '3 saat',
    20,
    3000,
    true
  );

-- ─────────────────────────────────────────────────────────────────
-- NOT: Fiyat veya tarih güncellemek için:
-- UPDATE workshops SET fiyat = 2000 WHERE isim ILIKE '%Sindel%';
-- Workshop kapatmak için:
-- UPDATE workshops SET is_published = false WHERE id = '...';
-- ─────────────────────────────────────────────────────────────────
