"use client";
import { useState, useRef, ChangeEvent, DragEvent, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSearchParams } from "next/navigation";

const KATEGORILER = [
  { id: "maku_ogrenci", label: "MAKÜ Öğrenci (Kayıt: 850₺, Workshop: 1.500₺)", kongreFiyat: 850, workshopFiyat: 1500, isim: "MAKÜ Öğrenci" },
  { id: "dis_ogrenci", label: "Öğrenci - MAKÜ Dışı (Kayıt: 1.350₺, Workshop: 1.500₺)", kongreFiyat: 1350, workshopFiyat: 1500, isim: "Öğrenci (MAKÜ Dışı)" },
  { id: "hekim", label: "Diş Hekimi / Akademisyen (Kayıt: 2.000₺, Workshop: 3.000₺)", kongreFiyat: 2000, workshopFiyat: 3000, isim: "Diş Hekimi / Akademisyen" },
];

const KABUL_MIME = ["application/pdf", "image/jpeg", "image/png"];
const KABUL_EXT = [".pdf", ".jpg", ".jpeg", ".png"];

function OdemeForm() {
  const [form, setForm] = useState({ isim: "", soyisim: "", email: "", kategoriId: "maku_ogrenci", workshopAdet: "0" });
  const [dosya, setDosya] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [durum, setDurum] = useState<"idle" | "loading" | "success">("idle");
  const [hatalar, setHatalar] = useState<Record<string, string>>({});
  const [genelHata, setGenelHata] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fiyat Hesaplama
  const seciliKategori = KATEGORILER.find(k => k.id === form.kategoriId) || KATEGORILER[0];
  const wAdet = parseInt(form.workshopAdet) || 0;
  const toplamTutar = seciliKategori.kongreFiyat + (wAdet * seciliKategori.workshopFiyat);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (hatalar[name]) setHatalar((h) => ({ ...h, [name]: "" }));
  }

  function handleDosyaSec(file: File) {
    // Mobil tarayıcılar bazen image/jpg, boş veya octet-stream gönderir — normalize et
    const rawMime = (file.type || '').split(';')[0].trim().toLowerCase();
    const mime = rawMime === 'image/jpg' ? 'image/jpeg' : rawMime;
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    const extGecerli = ['pdf', 'jpg', 'jpeg', 'png'].includes(ext);
    const mimeGecerli = KABUL_MIME.includes(mime) ||
      ((mime === 'application/octet-stream' || mime === '') && extGecerli);
    if (!mimeGecerli) {
      setHatalar((h) => ({ ...h, dosya: "Yalnızca PDF, JPG veya PNG kabul edilir." }));
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setHatalar((h) => ({ ...h, dosya: "Dosya boyutu 10 MB'dan küçük olmalıdır." }));
      return;
    }
    setHatalar((h) => ({ ...h, dosya: "" }));
    setDosya(file);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.[0]) handleDosyaSec(e.dataTransfer.files[0]);
  }

  function validate() {
    const yeni: Record<string, string> = {};
    if (!form.isim.trim()) yeni.isim = "Ad alanı zorunludur.";
    if (!form.soyisim.trim()) yeni.soyisim = "Soyad alanı zorunludur.";
    if (!form.email.trim()) yeni.email = "E-posta alanı zorunludur.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) yeni.email = "Geçerli bir e-posta adresi girin.";
    if (!dosya) yeni.dosya = "Ödeme dekontu yüklenmeden gönderilemez.";
    setHatalar(yeni);
    return Object.keys(yeni).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGenelHata("");
    if (!validate()) return;

    setDurum("loading");
    const fd = new FormData();
    fd.append("isim", form.isim.trim());
    fd.append("soyisim", form.soyisim.trim());
    fd.append("email", form.email.trim());
    
    const paketDetay = `${seciliKategori.isim} | Toplam: ${seciliKategori.kongreFiyat} ₺`;
    fd.append("paket", paketDetay);
    
    fd.append("dekont", dosya!);

    try {
      const res = await fetch("/api/odeme", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) { setGenelHata(json.error || "Bir hata oluştu."); setDurum("idle"); return; }
      setDurum("success");
    } catch {
      setGenelHata("Bağlantı hatası. Lütfen tekrar deneyin.");
      setDurum("idle");
    }
  }

  /* ── BAŞARI EKRANI ── */
  if (durum === "success") {
    return (
      <div style={successWrap}>
        <div style={successIconWrap}>
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="36" fill="none" stroke="var(--primary-100)" strokeWidth="2"/>
            <circle cx="40" cy="40" r="36" fill="none" stroke="var(--primary-600)" strokeWidth="2"
              strokeDasharray="226" strokeDashoffset="226"
              style={{ animation: "madok-ring 0.5s ease forwards", transformOrigin: "center", transform: "rotate(-90deg)" }}/>
            <path d="M24 41L35 52L56 29" fill="none" stroke="var(--primary-600)" strokeWidth="3"
              strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="40" strokeDashoffset="40"
              style={{ animation: "madok-check 0.5s ease forwards 0.3s" }}/>
          </svg>
        </div>
        <h2 style={successTitle}>Başvurunuz Alındı</h2>
        <p style={successDesc}>
          Ödeme dekontunuz ekibimize iletildi. Havale doğrulandıktan sonra
          kayıt onayınız <strong>{form.email}</strong> adresine gönderilecektir.
          Bu işlem 1–2 iş günü sürebilir.
        </p>
        <a href="/" style={backBtn}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M11 7H3M3 7L6.5 3.5M3 7L6.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Ana Sayfaya Dön
        </a>
      </div>
    );
  }

  /* ── FORM ── */
  return (
    <>
      {/* Loading Overlay */}
      {durum === "loading" && (
        <div style={loadingOverlay}>
          <div style={loadingCard}>
            <div style={loadingSpinner}></div>
            <div style={loadingTitle}>Gönderiliyor</div>
            <div style={loadingSubtitle}>Lütfen bekleyin, sayfayı kapatmayın.</div>
            <div style={loadingBarWrap}><div style={loadingBarFill}></div></div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ maxWidth: "580px", margin: "0 auto" }} noValidate>
        {/* Bilgi kutusu */}
        <div style={infoBox}>
          <div style={infoBoxTitle}>Ödeme Süreci</div>
          <ol style={infoBoxList}>
            <li>Bu formu doldurun ve ödeme dekontunuzu yükleyin.</li>
            <li>Dekontunuz ekibimize otomatik olarak iletilir.</li>
            <li>Havale doğrulandıktan sonra kayıt onayınız e-postanıza gönderilir.</li>
          </ol>
        </div>

        {/* Ad / Soyad */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
          <div>
            <label style={labelStyle}>Ad <span style={required}>*</span></label>
            <input
              name="isim" value={form.isim} onChange={handleChange}
              style={{ ...inputStyle, ...(hatalar.isim ? inputError : {}) }}
              placeholder="Adınız"
            />
            {hatalar.isim && <p style={errorText}>{hatalar.isim}</p>}
          </div>
          <div>
            <label style={labelStyle}>Soyad <span style={required}>*</span></label>
            <input
              name="soyisim" value={form.soyisim} onChange={handleChange}
              style={{ ...inputStyle, ...(hatalar.soyisim ? inputError : {}) }}
              placeholder="Soyadınız"
            />
            {hatalar.soyisim && <p style={errorText}>{hatalar.soyisim}</p>}
          </div>
        </div>

        {/* E-posta */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={labelStyle}>E-posta <span style={required}>*</span></label>
          <input
            name="email" type="email" value={form.email} onChange={handleChange}
            style={{ ...inputStyle, ...(hatalar.email ? inputError : {}) }}
            placeholder="ornek@mail.com"
          />
          {hatalar.email && <p style={errorText}>{hatalar.email}</p>}
        </div>

        {/* Kayıt Kategorisi */}
        <div style={{ marginBottom: "1.2rem" }}>
          <label style={labelStyle}>Kayıt Tipi <span style={required}>*</span></label>
          <select
            name="kategoriId" value={form.kategoriId} onChange={handleChange}
            style={{ ...inputStyle, cursor: "pointer", appearance: "none" as const,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 7L11 1' stroke='%23918c84' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem center",
            }}
          >
            {KATEGORILER.map((k) => <option key={k.id} value={k.id}>{k.label}</option>)}
          </select>
        </div>

        {/* Workshop — Yakında */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={labelStyle}>Workshop Katılımı</label>
          <div style={{
            padding: "0.9rem 1rem", border: "1px dashed var(--neutral-300)",
            borderRadius: "10px", background: "var(--bg-secondary)",
            fontFamily: "var(--font-ui)", fontSize: "0.88rem",
            color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.5rem",
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="8" cy="8" r="7" stroke="var(--neutral-400)" strokeWidth="1.4"/>
              <path d="M8 4.5v4l2.5 1.5" stroke="var(--neutral-400)" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            Workshop kaydı yakında açılacak
          </div>
        </div>

        {/* Toplam Tutar Özeti */}
        <div style={{
          background: "var(--primary-800)", color: "white", padding: "1.2rem",
          borderRadius: "10px", marginBottom: "1.5rem", display: "flex",
          justifyContent: "space-between", alignItems: "center"
        }}>
          <div>
            <div style={{ fontSize: "0.8rem", opacity: 0.8, marginBottom: "0.3rem" }}>Ödenecek Toplam Tutar</div>
            <div style={{ fontSize: "0.85rem", opacity: 0.9 }}>{seciliKategori.isim}</div>
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 700 }}>
            {seciliKategori.kongreFiyat.toLocaleString("tr-TR")} ₺
          </div>
        </div>

        {/* Dosya Yükleme */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={labelStyle}>Ödeme Dekontu <span style={required}>*</span> <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>(PDF, JPG veya PNG)</span></label>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              ...dropZone,
              borderColor: hatalar.dosya ? "#e05c5c" : dragging ? "var(--primary-500)" : dosya ? "var(--accent-500)" : "var(--neutral-300)",
              background: hatalar.dosya ? "#fff5f5" : dragging ? "var(--primary-50, #faf7f5)" : dosya ? "#f2f7f5" : "var(--bg-secondary)",
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={KABUL_EXT.join(",")}
              onChange={(e: ChangeEvent<HTMLInputElement>) => { if (e.target.files?.[0]) handleDosyaSec(e.target.files[0]); }}
              style={{ display: "none" }}
            />
            {dosya ? (
              <div style={{ textAlign: "center" }}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ margin: "0 auto 0.6rem", display: "block", color: "var(--accent-600)" }}>
                  <rect x="4" y="2" width="24" height="28" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M20 2v7h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M10 17l3.5 3.5L22 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p style={{ fontFamily: "var(--font-ui)", fontWeight: 600, color: "var(--accent-600)", fontSize: "0.9rem" }}>{dosya.name}</p>
                <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", marginTop: "0.2rem" }}>{(dosya.size / 1024).toFixed(0)} KB · Değiştirmek için tıklayın</p>
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ margin: "0 auto 0.75rem", display: "block", color: "var(--neutral-400)" }} stroke="currentColor" strokeWidth="1.5">
                  <rect x="4" y="6" width="28" height="24" rx="3"/>
                  <path d="M18 22v-8M18 14l-4 3.5M18 14l4 3.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p style={{ fontFamily: "var(--font-ui)", fontWeight: 600, color: "var(--text-primary)", fontSize: "0.9rem" }}>Dekontu sürükleyin veya tıklayın</p>
                <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", marginTop: "0.3rem" }}>Maks. 10 MB · PDF, JPG veya PNG</p>
              </div>
            )}
          </div>
          {hatalar.dosya && <p style={errorText}>{hatalar.dosya}</p>}
        </div>

        {genelHata && (
          <div style={genelHataBox}>
            {genelHata}
            <p style={{ marginTop: "0.5rem", fontSize: "0.8em", marginBottom: 0 }}>
              Sorun devam ederse{" "}
              <a href="mailto:madok.2026.burdur@gmail.com" style={{ color: "inherit", fontWeight: 700 }}>
                madok.2026.burdur@gmail.com
              </a>{" "}
              adresine yazın.
            </p>
          </div>
        )}

        <button type="submit" disabled={durum === "loading"} style={submitBtn}>
          Başvuruyu Gönder
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", textAlign: "center", marginTop: "1rem", lineHeight: 1.6 }}>
          Ödeme sürecinde sorun yaşıyorsanız{" "}
          <a href="mailto:madok.2026.burdur@gmail.com" style={{ color: "var(--primary-600)", fontWeight: 600 }}>
            madok.2026.burdur@gmail.com
          </a>{" "}
          adresine ulaşın.
        </p>
      </form>
    </>
  );
}

/* ── STYLES ── */
const successWrap: React.CSSProperties = {
  textAlign: "center", padding: "3rem 1rem", maxWidth: "480px", margin: "0 auto",
};
const successIconWrap: React.CSSProperties = { margin: "0 auto 2rem" };
const successTitle: React.CSSProperties = {
  fontFamily: "var(--font-heading)", fontSize: "1.8rem", color: "var(--text-primary)", marginBottom: "0.75rem",
};
const successDesc: React.CSSProperties = {
  fontFamily: "var(--font-ui)", fontSize: "0.9rem", color: "var(--text-muted)",
  lineHeight: 1.75, marginBottom: "2.5rem", maxWidth: "400px", margin: "0 auto 2rem",
};
const backBtn: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: "0.4rem",
  fontFamily: "var(--font-ui)", fontSize: "0.875rem", fontWeight: 600,
  color: "var(--primary-600)", background: "none", border: "1px solid var(--neutral-200)",
  padding: "0.7rem 1.4rem", borderRadius: "10px", cursor: "pointer", textDecoration: "none",
};
const loadingOverlay: React.CSSProperties = {
  position: "fixed", inset: 0, zIndex: 200,
  background: "rgba(28,27,25,0.72)", backdropFilter: "blur(6px)",
  display: "flex", alignItems: "center", justifyContent: "center",
};
const loadingCard: React.CSSProperties = {
  background: "white", borderRadius: "20px", padding: "3rem 3.5rem",
  textAlign: "center", maxWidth: "320px", width: "90%",
  boxShadow: "0 30px 80px rgba(0,0,0,0.25)",
};
const loadingSpinner: React.CSSProperties = {
  width: "44px", height: "44px", margin: "0 auto 1.5rem",
  border: "2.5px solid var(--neutral-200)",
  borderTopColor: "var(--primary-600)",
  borderRadius: "50%", animation: "madok-spin 0.8s linear infinite",
};
const loadingTitle: React.CSSProperties = {
  fontFamily: "var(--font-heading)", fontSize: "1.15rem", color: "var(--text-primary)", marginBottom: "0.35rem",
};
const loadingSubtitle: React.CSSProperties = {
  fontFamily: "var(--font-ui)", fontSize: "0.8rem", color: "var(--text-muted)",
};
const loadingBarWrap: React.CSSProperties = {
  height: "3px", background: "var(--neutral-200)", borderRadius: "2px",
  marginTop: "1.5rem", overflow: "hidden",
};
const loadingBarFill: React.CSSProperties = {
  height: "100%", background: "var(--primary-600)", borderRadius: "2px",
  animation: "madok-bar 2.5s ease-in-out forwards",
};
const infoBox: React.CSSProperties = {
  background: "#f2f7f5", border: "1px solid #bdd5cc",
  borderRadius: "14px", padding: "1.4rem 1.6rem", marginBottom: "2rem",
};
const infoBoxTitle: React.CSSProperties = {
  fontFamily: "var(--font-ui)", fontSize: "0.72rem", fontWeight: 700,
  textTransform: "uppercase", letterSpacing: "1.5px", color: "#365149", marginBottom: "0.75rem",
};
const infoBoxList: React.CSSProperties = {
  paddingLeft: "1.2rem", color: "#2e423c",
  fontFamily: "var(--font-ui)", fontSize: "0.84rem", lineHeight: 1.9, margin: 0,
};
const labelStyle: React.CSSProperties = {
  display: "block", fontFamily: "var(--font-ui)", fontWeight: 600,
  fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "1px",
  color: "var(--text-muted)", marginBottom: "0.45rem",
};
const required: React.CSSProperties = { color: "var(--primary-500)" };
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "0.85rem 1rem",
  border: "1px solid var(--neutral-200)", borderRadius: "10px",
  fontFamily: "var(--font-body)", fontSize: "0.95rem",
  color: "var(--text-primary)", background: "white", outline: "none",
  transition: "border-color 0.2s",
};
const inputError: React.CSSProperties = { borderColor: "#e05c5c" };
const errorText: React.CSSProperties = {
  fontFamily: "var(--font-ui)", fontSize: "0.78rem", color: "#c0392b",
  marginTop: "0.3rem",
};
const dropZone: React.CSSProperties = {
  border: "1.5px dashed", borderRadius: "14px", padding: "2.5rem 1.5rem",
  cursor: "pointer", transition: "all 0.2s",
};
const genelHataBox: React.CSSProperties = {
  background: "#fff2f0", border: "1px solid #ffccc7", borderRadius: "10px",
  padding: "0.85rem 1rem", marginBottom: "1rem",
  color: "#c0392b", fontFamily: "var(--font-ui)", fontSize: "0.875rem",
};
const submitBtn: React.CSSProperties = {
  width: "100%", padding: "1rem", background: "var(--primary-600)", color: "white",
  border: "none", borderRadius: "12px", fontFamily: "var(--font-ui)", fontWeight: 700,
  fontSize: "0.95rem", cursor: "pointer", display: "flex",
  alignItems: "center", justifyContent: "center", gap: "0.5rem", letterSpacing: "0.3px",
};

/* ── KEYFRAMES (global CSS'e eklenecek) ── */
// globals.css içine ekleyin:
// @keyframes madok-spin { to { transform: rotate(360deg); } }
// @keyframes madok-ring { to { stroke-dashoffset: 0; } }
// @keyframes madok-check { to { stroke-dashoffset: 0; } }
// @keyframes madok-bar { 0% { width: 0%; } 60% { width: 75%; } 100% { width: 100%; } }

export default function OdemePage() {
  return (
    <>
      <Navbar />
      <section className="packages-hero">
        <div className="section-container">
          <p className="section-overline">Kayıt &amp; Ödeme</p>
          <h1 className="section-title" style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", marginBottom: "1rem" }}>
            Kongre Kaydı
          </h1>
          <p className="section-desc" style={{ marginBottom: 0 }}>
            Formu doldurun ve ödeme dekontunuzu yükleyin. Ekibimiz en kısa sürede kaydınızı onaylayacaktır.
          </p>
        </div>
      </section>

      <style>{`
        @keyframes madok-spin { to { transform: rotate(360deg); } }
        @keyframes madok-ring { to { stroke-dashoffset: 0; } }
        @keyframes madok-check { to { stroke-dashoffset: 0; } }
        @keyframes madok-bar { 0% { width: 0%; } 60% { width: 75%; } 100% { width: 100%; } }
      `}</style>

      {/* Banka Bilgileri */}
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="section-container">
          <div style={{
            maxWidth: "580px", margin: "0 auto",
            background: "white", borderRadius: "16px",
            border: "1px solid var(--neutral-200)", padding: "2rem 2rem 1.8rem",
            marginBottom: "2rem",
          }}>
            <div style={{
              fontFamily: "var(--font-ui)", fontSize: "0.72rem", fontWeight: 700,
              textTransform: "uppercase" as const, letterSpacing: "1.5px",
              color: "var(--text-muted)", marginBottom: "0.75rem",
            }}>
              Havale / EFT Bilgileri
            </div>
            <p style={{
              fontFamily: "var(--font-ui)", fontSize: "0.84rem", color: "var(--text-muted)",
              lineHeight: 1.75, marginBottom: "1.2rem",
            }}>
              Ödeme yaparken açıklama kısmına <strong style={{ color: "var(--text-primary)" }}>Ad Soyad ve MADOK2026</strong> yazılması zorunludur.
            </p>
            <div style={{ background: "var(--bg-secondary)", borderRadius: "10px", padding: "0.4rem 1.2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0", borderBottom: "1px solid var(--neutral-200)" }}>
                <span style={{ fontFamily: "var(--font-ui)", fontSize: "0.78rem", color: "var(--text-muted)" }}>Alıcı</span>
                <span style={{ fontFamily: "var(--font-ui)", fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)", textAlign: "right", maxWidth: "60%" }}>
                  M.A.ERSOY ÜNV.REKTÖRLÜĞÜ STRATEJİ GELŞ.DAİRE BŞK.
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0" }}>
                <span style={{ fontFamily: "var(--font-ui)", fontSize: "0.78rem", color: "var(--text-muted)" }}>IBAN</span>
                <span style={{ fontFamily: "var(--font-ui)", fontSize: "0.88rem", fontWeight: 700, color: "var(--primary-700)", letterSpacing: "0.5px" }}>
                  TR62 0001 0015 8254 4728 4452 80
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "1rem" }}>
        <div className="section-container">
          <Suspense fallback={<div style={{ textAlign: "center", padding: "4rem", fontFamily: "var(--font-ui)", color: "var(--text-muted)" }}>Yükleniyor…</div>}>
            <OdemeForm />
          </Suspense>
        </div>
      </section>

      <Footer />
    </>
  );
}
