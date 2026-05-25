"use client";
import { useState, useEffect, useRef, useCallback, ChangeEvent, DragEvent } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Workshop {
  id: string;
  isim: string;
  aciklama: string;
  tarih: string;
  sure: string;
  kontenjan: number;
  kayitli_sayisi: number;
  fiyat: number;
}

const KABUL_MIME = ["application/pdf", "image/jpeg", "image/png"];
const KABUL_EXT = ["pdf", "jpg", "jpeg", "png"];
const POLLING_MS = 15_000; // 15 saniyede bir kontenjan güncelle

export default function WorkshopPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [fetchHata, setFetchHata] = useState("");

  const [secili, setSecili] = useState<Set<string>>(new Set());
  const [form, setForm] = useState({ isim: "", soyisim: "", email: "", telefon: "" });
  const [dosya, setDosya] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [hatalar, setHatalar] = useState<Record<string, string>>({});
  const [genelHata, setGenelHata] = useState("");
  const [durum, setDurum] = useState<"idle" | "loading" | "success">("idle");
  const [refKodu, setRefKodu] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Workshop listesi çek (ilk yükleme + polling) ──
  const workshopCek = useCallback(async (ilkYukleme = false) => {
    try {
      const res = await fetch("/api/workshop", { cache: "no-store" });
      const d = await res.json();
      if (d.workshops) {
        setWorkshops(d.workshops);
        setFetchHata("");
      } else {
        if (ilkYukleme) setFetchHata("Workshoplar yüklenemedi.");
      }
    } catch {
      if (ilkYukleme) setFetchHata("Bağlantı hatası. Lütfen sayfayı yenileyin.");
    } finally {
      if (ilkYukleme) setYukleniyor(false);
    }
  }, []);

  useEffect(() => {
    workshopCek(true);
    const interval = setInterval(() => workshopCek(false), POLLING_MS);
    return () => clearInterval(interval);
  }, [workshopCek]);

  // ── Workshop seç/kaldır ──
  function toggleWorkshop(id: string) {
    setSecili((prev) => {
      const yeni = new Set(prev);
      if (yeni.has(id)) yeni.delete(id);
      else yeni.add(id);
      return yeni;
    });
    if (hatalar.workshop) setHatalar((h) => ({ ...h, workshop: "" }));
  }

  const seciliWorkshoplar = workshops.filter((w) => secili.has(w.id));
  const toplamFiyat = seciliWorkshoplar.reduce((s, w) => s + w.fiyat, 0);

  // ── Dosya seçimi ──
  function handleDosyaSec(file: File) {
    const rawMime = (file.type || "").split(";")[0].trim().toLowerCase();
    const mime = rawMime === "image/jpg" ? "image/jpeg" : rawMime;
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    const extGecerli = KABUL_EXT.includes(ext);
    const mimeGecerli =
      KABUL_MIME.includes(mime) ||
      ((mime === "application/octet-stream" || mime === "") && extGecerli);
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

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (hatalar[name]) setHatalar((h) => ({ ...h, [name]: "" }));
  }

  function validate() {
    const yeni: Record<string, string> = {};
    if (secili.size === 0) yeni.workshop = "En az bir workshop seçmelisiniz.";
    if (!form.isim.trim()) yeni.isim = "Ad zorunludur.";
    if (!form.soyisim.trim()) yeni.soyisim = "Soyad zorunludur.";
    if (!form.email.trim()) yeni.email = "E-posta zorunludur.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      yeni.email = "Geçerli bir e-posta adresi girin.";
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
    fd.append("telefon", form.telefon.trim());
    fd.append("workshop_ids", JSON.stringify(Array.from(secili)));
    fd.append("dekont", dosya!);

    try {
      const res = await fetch("/api/workshop/kayit", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !json.success) {
        // Kontenjan dolu ise seçimleri güncelle
        if (json.doluWorkshopIds?.length) {
          setSecili((prev) => {
            const yeni = new Set(prev);
            json.doluWorkshopIds.forEach((id: string) => yeni.delete(id));
            return yeni;
          });
          await workshopCek(false); // anlık güncelle
        }
        setGenelHata(json.error ?? "Bir hata oluştu. Lütfen tekrar deneyin.");
        setDurum("idle");
        return;
      }
      setRefKodu(json.refKodu);
      setDurum("success");
    } catch {
      setGenelHata("Bağlantı hatası. Lütfen tekrar deneyin.");
      setDurum("idle");
    }
  }

  // ── Başarı ekranı ──
  if (durum === "success") {
    return (
      <>
        <Navbar />
        <main style={{ minHeight: "100vh", background: "var(--bg-secondary)", paddingTop: "7rem" }}>
          <div style={{ maxWidth: "560px", margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
            <div style={{
              background: "white", borderRadius: "20px",
              border: "1px solid var(--neutral-200)", padding: "3rem 2.5rem", textAlign: "center"
            }}>
              <div style={{
                width: "64px", height: "64px", borderRadius: "50%",
                background: "var(--accent-100)", display: "flex",
                alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem"
              }}>
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                  <path d="M20 6L9 17l-5-5" stroke="var(--accent-600)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 700, color: "var(--neutral-900)", marginBottom: "0.5rem" }}>
                Kaydınız Alındı
              </h2>
              <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "2rem" }}>
                Dekontunuz incelendikten sonra onay e-postası gönderilecektir.
              </p>
              <div style={{
                background: "var(--gold-100)", border: "2px solid var(--gold-300)",
                borderRadius: "12px", padding: "1.5rem", marginBottom: "2rem"
              }}>
                <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--gold-900)", marginBottom: "0.4rem" }}>
                  Referans Kodunuz
                </p>
                <p style={{ fontFamily: "var(--font-ui)", fontSize: "1.6rem", fontWeight: 800, color: "var(--gold-700)", letterSpacing: "2px", margin: 0 }}>
                  {refKodu}
                </p>
              </div>
              <div style={{ textAlign: "left", background: "var(--bg-secondary)", borderRadius: "10px", padding: "1rem 1.25rem", fontSize: "0.82rem", fontFamily: "var(--font-ui)", color: "var(--neutral-700)", lineHeight: 1.8 }}>
                <strong>Seçilen Workshoplar:</strong><br />
                {seciliWorkshoplar.map((w) => w.isim).join(", ")}<br />
                <strong>Toplam Tutar:</strong> {toplamFiyat.toLocaleString("tr-TR")} ₺
              </div>
              <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "1.5rem" }}>
                Sorularınız için:{" "}
                <a href="mailto:madok.2026.burdur@gmail.com" style={{ color: "var(--primary-600)" }}>
                  madok.2026.burdur@gmail.com
                </a>
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", background: "var(--bg-secondary)", paddingTop: "7rem" }}>

        {/* Başlık */}
        <section className="section" style={{ paddingBottom: "2rem" }}>
          <div style={{ maxWidth: "760px", margin: "0 auto", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", color: "var(--primary-500)", marginBottom: "0.75rem" }}>
              MADOK 2026
            </p>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, color: "var(--neutral-900)", marginBottom: "1rem" }}>
              Workshop Kaydı
            </h1>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: "1rem", color: "var(--text-muted)", maxWidth: "520px", margin: "0 auto" }}>
              Katılmak istediğiniz workshopları seçin, kişisel bilgilerinizi girin ve ödeme dekontuzu yükleyin.
            </p>
          </div>
        </section>

        {/* ── UYARI KUTUSU ── */}
        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "0 1.5rem 1.5rem" }}>
          <div style={{
            display: "flex", gap: "0.85rem", alignItems: "flex-start",
            background: "#fffbeb", border: "1px solid #fcd34d",
            borderRadius: "12px", padding: "1rem 1.25rem",
          }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" style={{ color: "#b45309", flexShrink: 0, marginTop: "1px" }}>
              <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: "0.85rem", color: "#92400e", lineHeight: 1.7 }}>
              <strong>Önemli Bilgilendirme:</strong> Workshop kaydı yalnızca kongre kayıtlı katılımcılara açıktır.
              Kongre kaydı bulunmayan katılımcıların workshop ödemeleri <strong>iptal edilecektir.</strong>{" "}
              Önce <a href="/paketler" style={{ color: "#b45309", textDecoration: "underline", fontWeight: 700 }}>kongre kaydınızı</a> tamamlayınız.
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ maxWidth: "760px", margin: "0 auto", padding: "0 1.5rem 5rem" }}>

            {/* ── WORKSHOP SEÇİMİ ── */}
            <div style={{ marginBottom: "2rem" }}>
              <h2 style={{ fontFamily: "var(--font-ui)", fontSize: "1rem", fontWeight: 700, color: "var(--neutral-800)", marginBottom: "1.25rem" }}>
                1. Workshop Seçin
              </h2>

              {yukleniyor && (
                <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)", fontFamily: "var(--font-ui)", fontSize: "0.9rem" }}>
                  Workshoplar yükleniyor…
                </div>
              )}

              {fetchHata && (
                <div style={{ padding: "1rem 1.25rem", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", color: "#b91c1c", fontFamily: "var(--font-ui)", fontSize: "0.88rem" }}>
                  {fetchHata}
                </div>
              )}

              {!yukleniyor && !fetchHata && workshops.length === 0 && (
                <div style={{ padding: "2rem 1.5rem", background: "white", borderRadius: "16px", border: "1px dashed var(--neutral-300)", textAlign: "center", fontFamily: "var(--font-ui)", fontSize: "0.9rem", color: "var(--text-muted)" }}>
                  Henüz yayında workshop bulunmamaktadır. Yakında açılacaktır.
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {workshops.map((w) => {
                  const dolu = w.kayitli_sayisi >= w.kontenjan;
                  const secildi = secili.has(w.id);
                  const doluluk = Math.min(100, Math.round((w.kayitli_sayisi / w.kontenjan) * 100));
                  const azKaldi = !dolu && (w.kontenjan - w.kayitli_sayisi) <= 5;

                  return (
                    <div
                      key={w.id}
                      onClick={() => !dolu && toggleWorkshop(w.id)}
                      style={{
                        background: "white",
                        borderRadius: "16px",
                        border: `2px solid ${secildi ? "var(--primary-500)" : "var(--neutral-200)"}`,
                        padding: "1.5rem",
                        cursor: dolu ? "not-allowed" : "pointer",
                        opacity: dolu ? 0.6 : 1,
                        transition: "border-color 0.15s, box-shadow 0.15s",
                        boxShadow: secildi ? "0 0 0 3px rgba(163,125,102,0.15)" : "none",
                        position: "relative",
                      }}
                    >
                      {/* Seçim indikatörü */}
                      <div style={{
                        position: "absolute", top: "1.25rem", right: "1.25rem",
                        width: "22px", height: "22px", borderRadius: "50%",
                        border: `2px solid ${secildi ? "var(--primary-500)" : "var(--neutral-300)"}`,
                        background: secildi ? "var(--primary-500)" : "white",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.15s", flexShrink: 0,
                      }}>
                        {secildi && (
                          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                            <path d="M2 5.5L4.5 8L9 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>

                      <div style={{ paddingRight: "2rem" }}>
                        <h3 style={{ fontFamily: "var(--font-ui)", fontSize: "1rem", fontWeight: 700, color: "var(--neutral-900)", marginBottom: "0.4rem" }}>
                          {w.isim}
                        </h3>
                        {w.aciklama && (
                          <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.75rem", lineHeight: 1.6 }}>
                            {w.aciklama}
                          </p>
                        )}

                        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginBottom: "0.85rem" }}>
                          {w.tarih && (
                            <span style={{ fontFamily: "var(--font-ui)", fontSize: "0.78rem", color: "var(--neutral-600)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                              <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M8 2v4M16 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                              {w.tarih}
                            </span>
                          )}
                          {w.sure && (
                            <span style={{ fontFamily: "var(--font-ui)", fontSize: "0.78rem", color: "var(--neutral-600)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                              <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                              {w.sure}
                            </span>
                          )}
                          <span style={{ fontFamily: "var(--font-ui)", fontSize: "0.78rem", fontWeight: 700, color: "var(--primary-700)" }}>
                            {w.fiyat.toLocaleString("tr-TR")} ₺
                          </span>
                        </div>

                        {/* Kontenjan bar */}
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                            <span style={{ fontFamily: "var(--font-ui)", fontSize: "0.72rem", color: dolu ? "#b91c1c" : azKaldi ? "#b45309" : "var(--neutral-500)" }}>
                              {dolu ? "Kontenjan dolu" : azKaldi ? `Son ${w.kontenjan - w.kayitli_sayisi} yer!` : `${w.kontenjan - w.kayitli_sayisi} yer mevcut`}
                            </span>
                            <span style={{ fontFamily: "var(--font-ui)", fontSize: "0.72rem", color: "var(--neutral-400)" }}>
                              {w.kayitli_sayisi}/{w.kontenjan}
                            </span>
                          </div>
                          <div style={{ height: "5px", background: "var(--neutral-100)", borderRadius: "99px", overflow: "hidden" }}>
                            <div style={{
                              height: "100%",
                              width: `${doluluk}%`,
                              background: dolu ? "#ef4444" : azKaldi ? "#f59e0b" : "var(--accent-500)",
                              borderRadius: "99px",
                              transition: "width 0.4s ease",
                            }}/>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {hatalar.workshop && (
                <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.82rem", color: "#b91c1c", marginTop: "0.5rem" }}>
                  {hatalar.workshop}
                </p>
              )}
            </div>

            {/* ── KİŞİSEL BİLGİLER ── */}
            <div style={{ background: "white", borderRadius: "16px", border: "1px solid var(--neutral-200)", padding: "1.75rem", marginBottom: "1.5rem" }}>
              <h2 style={{ fontFamily: "var(--font-ui)", fontSize: "1rem", fontWeight: 700, color: "var(--neutral-800)", marginBottom: "1.25rem" }}>
                2. Kişisel Bilgiler
              </h2>

              {/* Ad/Soyad — responsive grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                {[
                  { name: "isim", label: "Ad *", placeholder: "Adınız" },
                  { name: "soyisim", label: "Soyad *", placeholder: "Soyadınız" },
                ].map(({ name, label, placeholder }) => (
                  <div key={name}>
                    <label style={{ fontFamily: "var(--font-ui)", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "1px", color: "var(--text-muted)", display: "block", marginBottom: "0.45rem" }}>
                      {label}
                    </label>
                    <input
                      name={name}
                      value={form[name as keyof typeof form]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      style={{
                        width: "100%", padding: "0.85rem 1rem",
                        fontFamily: "var(--font-ui)", fontSize: "0.95rem",
                        border: `1px solid ${hatalar[name] ? "#e05c5c" : "var(--neutral-200)"}`,
                        borderRadius: "10px", outline: "none",
                        background: hatalar[name] ? "#fff5f5" : "white",
                        boxSizing: "border-box",
                      }}
                    />
                    {hatalar[name] && (
                      <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.75rem", color: "#b91c1c", marginTop: "0.3rem" }}>
                        {hatalar[name]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* E-posta/Telefon — responsive grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
                <div>
                  <label style={{ fontFamily: "var(--font-ui)", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "1px", color: "var(--text-muted)", display: "block", marginBottom: "0.45rem" }}>
                    E-posta *
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="ornek@email.com"
                    autoComplete="email"
                    style={{
                      width: "100%", padding: "0.85rem 1rem",
                      fontFamily: "var(--font-ui)", fontSize: "0.95rem",
                      border: `1px solid ${hatalar.email ? "#e05c5c" : "var(--neutral-200)"}`,
                      borderRadius: "10px", outline: "none",
                      background: hatalar.email ? "#fff5f5" : "white",
                      boxSizing: "border-box",
                    }}
                  />
                  {hatalar.email && (
                    <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.75rem", color: "#b91c1c", marginTop: "0.3rem" }}>
                      {hatalar.email}
                    </p>
                  )}
                </div>

                <div>
                  <label style={{ fontFamily: "var(--font-ui)", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "1px", color: "var(--text-muted)", display: "block", marginBottom: "0.45rem" }}>
                    Telefon
                  </label>
                  <input
                    name="telefon"
                    type="tel"
                    value={form.telefon}
                    onChange={handleChange}
                    placeholder="05XX XXX XX XX"
                    autoComplete="tel"
                    style={{
                      width: "100%", padding: "0.85rem 1rem",
                      fontFamily: "var(--font-ui)", fontSize: "0.95rem",
                      border: "1px solid var(--neutral-200)",
                      borderRadius: "10px", outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* ── ÖDEME BİLGİLERİ ── */}
            <div style={{ background: "white", borderRadius: "16px", border: "1px solid var(--neutral-200)", padding: "1.75rem", marginBottom: "1.5rem" }}>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "1.5px", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
                Havale / EFT Bilgileri
              </div>
              <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.84rem", color: "var(--text-muted)", lineHeight: 1.75, marginBottom: "1.2rem" }}>
                Ödeme yaparken açıklama kısmına <strong style={{ color: "var(--text-primary)" }}>Ad Soyad ve WRKP2026</strong> yazılması zorunludur.
              </p>
              <div style={{ background: "var(--bg-secondary)", borderRadius: "10px", padding: "0.4rem 1.2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0", borderBottom: "1px solid var(--neutral-200)" }}>
                  <span style={{ fontFamily: "var(--font-ui)", fontSize: "0.78rem", color: "var(--text-muted)" }}>Alıcı</span>
                  <span style={{ fontFamily: "var(--font-ui)", fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)", textAlign: "right", maxWidth: "65%" }}>
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

              {secili.size > 0 && (
                <div style={{ marginTop: "1.2rem", paddingTop: "1.2rem", borderTop: "1px solid var(--neutral-200)" }}>
                  {seciliWorkshoplar.map((w) => (
                    <div key={w.id} style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-ui)", fontSize: "0.84rem", color: "var(--neutral-700)", padding: "0.2rem 0" }}>
                      <span>{w.isim}</span>
                      <span style={{ fontWeight: 700 }}>{w.fiyat.toLocaleString("tr-TR")} ₺</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-ui)", fontSize: "1rem", fontWeight: 800, color: "var(--primary-800)", marginTop: "0.6rem", paddingTop: "0.6rem", borderTop: "1px solid var(--neutral-200)" }}>
                    <span>Toplam</span>
                    <span>{toplamFiyat.toLocaleString("tr-TR")} ₺</span>
                  </div>
                </div>
              )}
            </div>

            {/* ── DEKONT YÜKLEME ── */}
            <div style={{ background: "white", borderRadius: "16px", border: "1px solid var(--neutral-200)", padding: "1.75rem", marginBottom: "1.5rem" }}>
              <h2 style={{ fontFamily: "var(--font-ui)", fontSize: "1rem", fontWeight: 700, color: "var(--neutral-800)", marginBottom: "0.3rem" }}>
                3. Ödeme Dekontu
              </h2>
              <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
                PDF, JPG veya PNG — maks. 10 MB
              </p>

              {!dosya ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${hatalar.dosya ? "#fca5a5" : dragging ? "var(--primary-400)" : "var(--neutral-300)"}`,
                    borderRadius: "12px", padding: "2.5rem 1.5rem",
                    textAlign: "center", cursor: "pointer",
                    background: dragging ? "var(--primary-50)" : hatalar.dosya ? "#fef2f2" : "var(--bg-secondary)",
                    transition: "all 0.15s",
                  }}
                >
                  <svg width="36" height="36" fill="none" viewBox="0 0 24 24" style={{ margin: "0 auto 0.75rem", display: "block", color: "var(--neutral-400)" }}>
                    <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 12l-4-4-4 4M12 8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.88rem", color: "var(--neutral-600)", marginBottom: "0.3rem" }}>
                    Dosyayı buraya sürükleyin veya
                  </p>
                  <span style={{ fontFamily: "var(--font-ui)", fontSize: "0.85rem", color: "var(--primary-600)", fontWeight: 600 }}>
                    dosya seçin
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    style={{ display: "none" }}
                    onChange={(e) => { if (e.target.files?.[0]) handleDosyaSec(e.target.files[0]); }}
                  />
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.85rem 1rem", background: "var(--accent-50)", border: "1px solid var(--accent-200)", borderRadius: "10px" }}>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" style={{ color: "var(--accent-600)", flexShrink: 0 }}>
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                    <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ fontFamily: "var(--font-ui)", fontSize: "0.85rem", color: "var(--neutral-700)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {dosya.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => { setDosya(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--neutral-400)", padding: "2px", flexShrink: 0 }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              )}

              {hatalar.dosya && (
                <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.78rem", color: "#b91c1c", marginTop: "0.5rem" }}>
                  {hatalar.dosya}
                </p>
              )}
            </div>

            {/* ── GENEL HATA ── */}
            {genelHata && (
              <div style={{ padding: "1rem 1.25rem", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", marginBottom: "1.25rem", fontFamily: "var(--font-ui)", fontSize: "0.88rem", color: "#b91c1c" }}>
                {genelHata}
              </div>
            )}

            {/* ── GÖNDER ── */}
            <button
              type="submit"
              disabled={durum === "loading"}
              style={{
                width: "100%", padding: "1rem",
                background: durum === "loading" ? "var(--neutral-300)" : "var(--primary-600)",
                color: "white", border: "none", borderRadius: "12px",
                fontFamily: "var(--font-ui)", fontSize: "1rem", fontWeight: 700,
                cursor: durum === "loading" ? "not-allowed" : "pointer",
                transition: "background 0.15s",
                letterSpacing: "0.3px",
              }}
            >
              {durum === "loading" ? "Gönderiliyor…" : "Workshop Kaydını Tamamla"}
            </button>

            <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.75rem", color: "var(--text-muted)", textAlign: "center", marginTop: "1rem" }}>
              Sorun için:{" "}
              <a href="mailto:madok.2026.burdur@gmail.com" style={{ color: "var(--primary-600)" }}>
                madok.2026.burdur@gmail.com
              </a>
            </p>
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
}
