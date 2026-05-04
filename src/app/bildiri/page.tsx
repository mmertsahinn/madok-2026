"use client";
import { useState, useRef, ChangeEvent, DragEvent, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ── TÜRKİYE ÜNİVERSİTELERİ ── */
const UNIVERSITELER = [
  "Abant İzzet Baysal Üniversitesi",
  "Abdullah Gül Üniversitesi",
  "Acıbadem Mehmet Ali Aydınlar Üniversitesi",
  "Adana Alparslan Türkeş Bilim ve Teknoloji Üniversitesi",
  "Adıyaman Üniversitesi",
  "Afyon Kocatepe Üniversitesi",
  "Ağrı İbrahim Çeçen Üniversitesi",
  "Akdeniz Üniversitesi",
  "Aksaray Üniversitesi",
  "Alanya Alaaddin Keykubat Üniversitesi",
  "Alanya HEP Üniversitesi",
  "Altınbaş Üniversitesi",
  "Amasya Üniversitesi",
  "Anadolu Üniversitesi",
  "Ankara Bilim Üniversitesi",
  "Ankara Hacı Bayram Veli Üniversitesi",
  "Ankara Medipol Üniversitesi",
  "Ankara Müzik ve Güzel Sanatlar Üniversitesi",
  "Ankara Sosyal Bilimler Üniversitesi",
  "Ankara Üniversitesi",
  "Ankara Yıldırım Beyazıt Üniversitesi",
  "Ardahan Üniversitesi",
  "Artvin Çoruh Üniversitesi",
  "Atatürk Üniversitesi",
  "Atılım Üniversitesi",
  "Avrasya Üniversitesi",
  "Bahçeşehir Üniversitesi",
  "Balıkesir Üniversitesi",
  "Bandırma Onyedi Eylül Üniversitesi",
  "Bartın Üniversitesi",
  "Başkent Üniversitesi",
  "Batman Üniversitesi",
  "Bayburt Üniversitesi",
  "Beykent Üniversitesi",
  "Beykoz Üniversitesi",
  "Bezm-i Âlem Vakıf Üniversitesi",
  "Bilecik Şeyh Edebali Üniversitesi",
  "Bingöl Üniversitesi",
  "Biruni Üniversitesi",
  "Bitlis Eren Üniversitesi",
  "Boğaziçi Üniversitesi",
  "Bolu Abant İzzet Baysal Üniversitesi",
  "Burdur Mehmet Akif Ersoy Üniversitesi",
  "Bursa Teknik Üniversitesi",
  "Bursa Uludağ Üniversitesi",
  "Çanakkale Onsekiz Mart Üniversitesi",
  "Çankaya Üniversitesi",
  "Çankırı Karatekin Üniversitesi",
  "Çukurova Üniversitesi",
  "Dicle Üniversitesi",
  "Doğu Akdeniz Üniversitesi",
  "Doğuş Üniversitesi",
  "Dokuz Eylül Üniversitesi",
  "Düzce Üniversitesi",
  "Ege Üniversitesi",
  "Erciyes Üniversitesi",
  "Erzincan Binali Yıldırım Üniversitesi",
  "Erzurum Teknik Üniversitesi",
  "Eskişehir Osmangazi Üniversitesi",
  "Eskişehir Teknik Üniversitesi",
  "Fatih Sultan Mehmet Vakıf Üniversitesi",
  "Fenerbahçe Üniversitesi",
  "Fırat Üniversitesi",
  "Galatasaray Üniversitesi",
  "Gazi Üniversitesi",
  "Gaziantep İslam Bilim ve Teknoloji Üniversitesi",
  "Gaziantep Üniversitesi",
  "Gebze Teknik Üniversitesi",
  "Giresun Üniversitesi",
  "Gümüşhane Üniversitesi",
  "Hakkari Üniversitesi",
  "Hacettepe Üniversitesi",
  "Harran Üniversitesi",
  "Hatay Mustafa Kemal Üniversitesi",
  "Hitit Üniversitesi",
  "Iğdır Üniversitesi",
  "Isparta Uygulamalı Bilimler Üniversitesi",
  "İbn Haldun Üniversitesi",
  "İnönü Üniversitesi",
  "İskenderun Teknik Üniversitesi",
  "İstanbul 29 Mayıs Üniversitesi",
  "İstanbul Arel Üniversitesi",
  "İstanbul Atlas Üniversitesi",
  "İstanbul Aydın Üniversitesi",
  "İstanbul Bilgi Üniversitesi",
  "İstanbul Bilim Üniversitesi",
  "İstanbul Esenyurt Üniversitesi",
  "İstanbul Gelişim Üniversitesi",
  "İstanbul Kent Üniversitesi",
  "İstanbul Kültür Üniversitesi",
  "İstanbul Medeniyet Üniversitesi",
  "İstanbul Medipol Üniversitesi",
  "İstanbul Nişantaşı Üniversitesi",
  "İstanbul Okan Üniversitesi",
  "İstanbul Rumeli Üniversitesi",
  "İstanbul Sabahattin Zaim Üniversitesi",
  "İstanbul Sağlık ve Teknoloji Üniversitesi",
  "İstanbul Teknik Üniversitesi",
  "İstanbul Ticaret Üniversitesi",
  "İstanbul Topkapı Üniversitesi",
  "İstanbul Üniversitesi",
  "İstanbul Üniversitesi-Cerrahpaşa",
  "İstanbul Yeni Yüzyıl Üniversitesi",
  "İzmir Bakırçay Üniversitesi",
  "İzmir Demokrasi Üniversitesi",
  "İzmir Ekonomi Üniversitesi",
  "İzmir Kâtip Çelebi Üniversitesi",
  "İzmir Tınaztepe Üniversitesi",
  "İzmir Yüksek Teknoloji Enstitüsü",
  "Kafkas Üniversitesi",
  "Kahramanmaraş İstiklal Üniversitesi",
  "Kahramanmaraş Sütçü İmam Üniversitesi",
  "Karabük Üniversitesi",
  "Karadeniz Teknik Üniversitesi",
  "Karamanoğlu Mehmetbey Üniversitesi",
  "Kastamonu Üniversitesi",
  "Kayseri Üniversitesi",
  "Kırıkkale Üniversitesi",
  "Kırklareli Üniversitesi",
  "Kırşehir Ahi Evran Üniversitesi",
  "Kilis 7 Aralık Üniversitesi",
  "KTO Karatay Üniversitesi",
  "Koç Üniversitesi",
  "Konya Teknik Üniversitesi",
  "Kütahya Dumlupınar Üniversitesi",
  "Kütahya Sağlık Bilimleri Üniversitesi",
  "Malatya Turgut Özal Üniversitesi",
  "Maltepe Üniversitesi",
  "Manisa Celal Bayar Üniversitesi",
  "Mardin Artuklu Üniversitesi",
  "Marmara Üniversitesi",
  "MEF Üniversitesi",
  "Mersin Üniversitesi",
  "Mimar Sinan Güzel Sanatlar Üniversitesi",
  "Muğla Sıtkı Koçman Üniversitesi",
  "Munzur Üniversitesi",
  "Muş Alparslan Üniversitesi",
  "Necmettin Erbakan Üniversitesi",
  "Nevşehir Hacı Bektaş Veli Üniversitesi",
  "Niğde Ömer Halisdemir Üniversitesi",
  "Nişantaşı Üniversitesi",
  "Ondokuz Mayıs Üniversitesi",
  "Ordu Üniversitesi",
  "Orta Doğu Teknik Üniversitesi",
  "Osmaniye Korkut Ata Üniversitesi",
  "Özyeğin Üniversitesi",
  "Pamukkale Üniversitesi",
  "Piri Reis Üniversitesi",
  "Recep Tayyip Erdoğan Üniversitesi",
  "Sabancı Üniversitesi",
  "Sakarya Uygulamalı Bilimler Üniversitesi",
  "Sakarya Üniversitesi",
  "Samsun Üniversitesi",
  "Sanko Üniversitesi",
  "Selçuk Üniversitesi",
  "Siirt Üniversitesi",
  "Sinop Üniversitesi",
  "Sivas Cumhuriyet Üniversitesi",
  "Sivas Bilim ve Teknoloji Üniversitesi",
  "Şırnak Üniversitesi",
  "TOBB Ekonomi ve Teknoloji Üniversitesi",
  "Tekirdağ Namık Kemal Üniversitesi",
  "Tokat Gaziosmanpaşa Üniversitesi",
  "Trabzon Üniversitesi",
  "TED Üniversitesi",
  "Trakya Üniversitesi",
  "Türk-Alman Üniversitesi",
  "Türk-Japon Bilim ve Teknoloji Üniversitesi",
  "Türkiye-Japonya Bilim ve Teknoloji Üniversitesi",
  "Uşak Üniversitesi",
  "Üsküdar Üniversitesi",
  "Van Yüzüncü Yıl Üniversitesi",
  "Yaşar Üniversitesi",
  "Yeditepe Üniversitesi",
  "Yıldız Teknik Üniversitesi",
  "Yozgat Bozok Üniversitesi",
  "Yüksek İhtisas Üniversitesi",
  "Zonguldak Bülent Ecevit Üniversitesi",
  "Diğer Kurum / Üniversite",
].sort((a, b) => a.localeCompare(b, "tr"));

/* ── ÜNİVERSİTE AUTOCOMPLETE ── */
function UniversiteInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const wrapRef = useRef<HTMLDivElement>(null);

  const filtered = query.length >= 1
    ? UNIVERSITELER.filter((u) =>
        u.toLowerCase().replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
          .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
          .includes(
            query.toLowerCase().replace(/ğ/g, "g").replace(/ü/g, "u")
              .replace(/ş/g, "s").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
          )
      ).slice(0, 8)
    : [];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleInput(e: ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    onChange(e.target.value);
    setOpen(true);
  }

  function select(uni: string) {
    setQuery(uni);
    onChange(uni);
    setOpen(false);
  }

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      <input
        value={query}
        onChange={handleInput}
        onFocus={() => query.length >= 1 && setOpen(true)}
        style={inputStyle}
        placeholder="Üniversite veya kurum adı yazın..."
        autoComplete="off"
      />
      {open && filtered.length > 0 && (
        <ul style={dropdownList}>
          {filtered.map((uni) => {
            const idx = uni.toLowerCase()
              .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
              .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
              .indexOf(
                query.toLowerCase().replace(/ğ/g, "g").replace(/ü/g, "u")
                  .replace(/ş/g, "s").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
              );
            const before = idx >= 0 ? uni.slice(0, idx) : uni;
            const match  = idx >= 0 ? uni.slice(idx, idx + query.length) : "";
            const after  = idx >= 0 ? uni.slice(idx + query.length) : "";
            return (
              <li key={uni} onMouseDown={() => select(uni)} style={dropdownItem}>
                {before}
                <strong style={{ color: "var(--primary-700)" }}>{match}</strong>
                {after}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ── ANA FORM ── */
function BildiriForm() {
  const [form, setForm] = useState({ isim: "", soyisim: "", email: "", kurum: "", baslik: "" });
  const [dosya, setDosya] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [durum, setDurum] = useState<"idle" | "loading" | "success">("idle");
  const [hatalar, setHatalar] = useState<Record<string, string>>({});
  const [genelHata, setGenelHata] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (hatalar[name]) setHatalar((h) => ({ ...h, [name]: "" }));
  }

  function handleKurumChange(val: string) {
    setForm((f) => ({ ...f, kurum: val }));
  }

  function handleDosyaSec(file: File) {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "docx") {
      setHatalar((h) => ({ ...h, dosya: "Yalnızca .docx formatı kabul edilmektedir." }));
      setDosya(null);
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setHatalar((h) => ({ ...h, dosya: "Dosya boyutu 20 MB'dan küçük olmalıdır." }));
      setDosya(null);
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
    if (!form.baslik.trim()) yeni.baslik = "Bildiri başlığı zorunludur.";
    if (!dosya) yeni.dosya = "Bildiri dosyası (.docx) yüklenmeden gönderilemez.";
    setHatalar(yeni);
    return Object.keys(yeni).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGenelHata("");
    if (!validate()) return;

    setDurum("loading");
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append("dosya", dosya!);

    try {
      const res = await fetch("/api/bildiri", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) { setGenelHata(json.error || "Bir hata oluştu."); setDurum("idle"); return; }
      setDurum("success");
    } catch {
      setGenelHata("Bağlantı hatası. Lütfen tekrar deneyin.");
      setDurum("idle");
    }
  }

  /* ── BAŞARI ── */
  if (durum === "success") {
    return (
      <div style={successWrap}>
        <div style={{ margin: "0 auto 2rem" }}>
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
        <h2 style={successTitle}>Bildiriniz Alındı</h2>
        <p style={successDesc}>
          Bildiriniz bilimsel komiteye iletildi. Değerlendirme sonucu{" "}
          <strong>{form.email}</strong> adresine bildirilecektir.
        </p>
        <div style={nextStepsBox}>
          <div style={nextStepsTitle}>Sonraki Adımlar</div>
          {[
            "Bilimsel komite bildirinizi değerlendirecektir.",
            "Kabul / ret kararı e-posta ile iletilecektir.",
            "Kabul sonrası kongre kaydını tamamlamanız gerekmektedir.",
          ].map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", marginBottom: i < 2 ? "0.7rem" : 0 }}>
              <div style={stepBadge}><span style={stepNum}>{i + 1}</span></div>
              <p style={stepText}>{step}</p>
            </div>
          ))}
        </div>
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
      {durum === "loading" && (
        <div style={loadingOverlay}>
          <div style={loadingCard}>
            <div style={loadingSpinner}></div>
            <div style={loadingTitle}>Gönderiliyor</div>
            <div style={loadingSub}>Lütfen bekleyin, sayfayı kapatmayın.</div>
            <div style={loadingBarWrap}><div style={loadingBarFill}></div></div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ maxWidth: "640px", margin: "0 auto" }} noValidate>
        {/* Kurallar */}
        <div style={amberBox}>
          <div style={amberTitle}>Bildiri Gönderim Kuralları</div>
          <ul style={amberList}>
            <li>Bildiriniz <strong>yalnızca .docx</strong> (Microsoft Word) formatında kabul edilmektedir.</li>
            <li>Bildiri şablonunu kullanmanız zorunludur; şablona uymayan bildiriler reddedilebilir.</li>
            <li>Her katılımcı en fazla <strong>2 bildiri</strong> gönderebilir.</li>
            <li>Bildiri kabul sonrası kongre kaydını tamamlamak zorunludur.</li>
          </ul>
        </div>

        {/* Şablon */}
        <div style={templateBox}>
          <div style={{ flex: 1 }}>
            <div style={templateLabel}>Bildiri Şablonu</div>
            <div style={templateDesc}>Şablonu indirip doldurduktan sonra .docx olarak yükleyin</div>
          </div>
          <a href="#" style={templateBtn}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2v8M7 10l-3-3M7 10l3-3M2 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Şablonu İndir
          </a>
        </div>

        {/* Ad / Soyad */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
          <div>
            <label style={labelStyle}>Ad <span style={req}>*</span></label>
            <input name="isim" value={form.isim} onChange={handleChange}
              style={{ ...inputStyle, ...(hatalar.isim ? errBorder : {}) }} placeholder="Adınız"/>
            {hatalar.isim && <p style={errText}>{hatalar.isim}</p>}
          </div>
          <div>
            <label style={labelStyle}>Soyad <span style={req}>*</span></label>
            <input name="soyisim" value={form.soyisim} onChange={handleChange}
              style={{ ...inputStyle, ...(hatalar.soyisim ? errBorder : {}) }} placeholder="Soyadınız"/>
            {hatalar.soyisim && <p style={errText}>{hatalar.soyisim}</p>}
          </div>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={labelStyle}>E-posta <span style={req}>*</span></label>
          <input name="email" type="email" value={form.email} onChange={handleChange}
            style={{ ...inputStyle, ...(hatalar.email ? errBorder : {}) }} placeholder="ornek@mail.com"/>
          {hatalar.email && <p style={errText}>{hatalar.email}</p>}
        </div>

        {/* Kurum — Autocomplete */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={labelStyle}>Kurum / Üniversite</label>
          <UniversiteInput value={form.kurum} onChange={handleKurumChange} />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={labelStyle}>Bildiri Başlığı <span style={req}>*</span></label>
          <input name="baslik" value={form.baslik} onChange={handleChange}
            style={{ ...inputStyle, ...(hatalar.baslik ? errBorder : {}) }}
            placeholder="Bildirinizin tam başlığı"/>
          {hatalar.baslik && <p style={errText}>{hatalar.baslik}</p>}
        </div>

        {/* Dosya */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={labelStyle}>Bildiri Dosyası (.docx) <span style={req}>*</span></label>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              ...dropZone,
              borderColor: hatalar.dosya ? "#e05c5c" : dragging ? "var(--primary-500)" : dosya ? "var(--accent-500)" : "var(--neutral-300)",
              background: hatalar.dosya ? "#fff5f5" : dragging ? "var(--primary-50,#faf7f5)" : dosya ? "#f2f7f5" : "var(--bg-secondary)",
            }}
          >
            <input ref={fileInputRef} type="file"
              accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e: ChangeEvent<HTMLInputElement>) => { if (e.target.files?.[0]) handleDosyaSec(e.target.files[0]); }}
              style={{ display: "none" }}/>
            {dosya ? (
              <div style={{ textAlign: "center" }}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none"
                  style={{ margin: "0 auto 0.6rem", display: "block", color: "var(--accent-600)" }}>
                  <rect x="4" y="2" width="24" height="28" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M20 2v7h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M10 17l3.5 3.5L22 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p style={{ fontFamily: "var(--font-ui)", fontWeight: 600, color: "var(--accent-600)", fontSize: "0.9rem" }}>{dosya.name}</p>
                <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", marginTop: "0.2rem" }}>
                  {(dosya.size / 1024).toFixed(0)} KB · Değiştirmek için tıklayın
                </p>
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none"
                  style={{ margin: "0 auto 0.75rem", display: "block", color: "var(--neutral-400)" }}
                  stroke="currentColor" strokeWidth="1.5">
                  <rect x="4" y="6" width="28" height="24" rx="3"/>
                  <path d="M18 22v-8M18 14l-4 3.5M18 14l4 3.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p style={{ fontFamily: "var(--font-ui)", fontWeight: 600, color: "var(--text-primary)", fontSize: "0.9rem" }}>
                  .docx dosyasını sürükleyin veya tıklayın
                </p>
                <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", marginTop: "0.3rem" }}>Maks. 20 MB · Yalnızca .docx</p>
              </div>
            )}
          </div>
          {hatalar.dosya && <p style={errText}>{hatalar.dosya}</p>}
        </div>

        {genelHata && <div style={genelHataBox}>{genelHata}</div>}

        <button type="submit" disabled={durum === "loading"} style={submitBtn}>
          Bildiriyi Gönder
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", textAlign: "center", marginTop: "1rem", lineHeight: 1.6 }}>
          Bildiriniz bilimsel komiteye iletilecek ve değerlendirme sonucu e-posta ile bildirilecektir.
        </p>
      </form>
    </>
  );
}

/* ── STYLES ── */
const successWrap: React.CSSProperties = { textAlign: "center", padding: "3rem 1rem", maxWidth: "480px", margin: "0 auto" };
const successTitle: React.CSSProperties = { fontFamily: "var(--font-heading)", fontSize: "1.8rem", color: "var(--text-primary)", marginBottom: "0.75rem" };
const successDesc: React.CSSProperties = { fontFamily: "var(--font-ui)", fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.75, marginBottom: "2rem", maxWidth: "380px", margin: "0 auto 2rem" };
const nextStepsBox: React.CSSProperties = { background: "var(--bg-secondary)", border: "1px solid var(--neutral-200)", borderRadius: "14px", padding: "1.4rem 1.8rem", textAlign: "left", marginBottom: "2rem" };
const nextStepsTitle: React.CSSProperties = { fontFamily: "var(--font-ui)", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "2px", color: "var(--text-muted)", marginBottom: "1rem" };
const stepBadge: React.CSSProperties = { width: "22px", height: "22px", borderRadius: "50%", background: "var(--primary-100)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "0.1rem" };
const stepNum: React.CSSProperties = { fontFamily: "var(--font-ui)", fontSize: "0.7rem", fontWeight: 700, color: "var(--primary-700)" };
const stepText: React.CSSProperties = { fontFamily: "var(--font-ui)", fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.5 };
const backBtn: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: "0.4rem", fontFamily: "var(--font-ui)", fontSize: "0.875rem", fontWeight: 600, color: "var(--primary-600)", border: "1px solid var(--neutral-200)", padding: "0.7rem 1.4rem", borderRadius: "10px", textDecoration: "none" };
const loadingOverlay: React.CSSProperties = { position: "fixed", inset: 0, zIndex: 200, background: "rgba(28,27,25,0.72)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center" };
const loadingCard: React.CSSProperties = { background: "white", borderRadius: "20px", padding: "3rem 3.5rem", textAlign: "center", maxWidth: "320px", width: "90%", boxShadow: "0 30px 80px rgba(0,0,0,0.25)" };
const loadingSpinner: React.CSSProperties = { width: "44px", height: "44px", margin: "0 auto 1.5rem", border: "2.5px solid var(--neutral-200)", borderTopColor: "var(--primary-600)", borderRadius: "50%", animation: "madok-spin 0.8s linear infinite" };
const loadingTitle: React.CSSProperties = { fontFamily: "var(--font-heading)", fontSize: "1.15rem", color: "var(--text-primary)", marginBottom: "0.35rem" };
const loadingSub: React.CSSProperties = { fontFamily: "var(--font-ui)", fontSize: "0.8rem", color: "var(--text-muted)" };
const loadingBarWrap: React.CSSProperties = { height: "3px", background: "var(--neutral-200)", borderRadius: "2px", marginTop: "1.5rem", overflow: "hidden" };
const loadingBarFill: React.CSSProperties = { height: "100%", background: "var(--primary-600)", borderRadius: "2px", animation: "madok-bar 2.5s ease-in-out forwards" };
const amberBox: React.CSSProperties = { background: "#fefcf3", border: "1px solid #f6d988", borderRadius: "14px", padding: "1.4rem 1.6rem", marginBottom: "1.5rem" };
const amberTitle: React.CSSProperties = { fontFamily: "var(--font-ui)", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "1.5px", color: "#b26c1f", marginBottom: "0.75rem" };
const amberList: React.CSSProperties = { paddingLeft: "1.2rem", color: "#77461e", fontFamily: "var(--font-ui)", fontSize: "0.84rem", lineHeight: 1.9, margin: 0 };
const templateBox: React.CSSProperties = { display: "flex", alignItems: "center", gap: "1.2rem", background: "white", border: "1px solid var(--neutral-200)", borderRadius: "14px", padding: "1.2rem 1.6rem", marginBottom: "1.5rem", flexWrap: "wrap" as const };
const templateLabel: React.CSSProperties = { fontFamily: "var(--font-ui)", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "2px", color: "var(--text-muted)", marginBottom: "0.25rem" };
const templateDesc: React.CSSProperties = { fontFamily: "var(--font-ui)", fontSize: "0.84rem", color: "var(--text-secondary)" };
const templateBtn: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.65rem 1.2rem", background: "var(--accent-600)", color: "white", borderRadius: "9px", fontFamily: "var(--font-ui)", fontSize: "0.82rem", fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" as const };
const labelStyle: React.CSSProperties = { display: "block", fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: "0.72rem", textTransform: "uppercase" as const, letterSpacing: "1px", color: "var(--text-muted)", marginBottom: "0.45rem" };
const req: React.CSSProperties = { color: "var(--primary-500)" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "0.85rem 1rem", border: "1px solid var(--neutral-200)", borderRadius: "10px", fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "var(--text-primary)", background: "white", outline: "none", transition: "border-color 0.2s" };
const errBorder: React.CSSProperties = { borderColor: "#e05c5c" };
const errText: React.CSSProperties = { fontFamily: "var(--font-ui)", fontSize: "0.78rem", color: "#c0392b", marginTop: "0.3rem" };
const dropZone: React.CSSProperties = { border: "1.5px dashed", borderRadius: "14px", padding: "2.5rem 1.5rem", cursor: "pointer", transition: "all 0.2s" };
const genelHataBox: React.CSSProperties = { background: "#fff2f0", border: "1px solid #ffccc7", borderRadius: "10px", padding: "0.85rem 1rem", marginBottom: "1rem", color: "#c0392b", fontFamily: "var(--font-ui)", fontSize: "0.875rem" };
const submitBtn: React.CSSProperties = { width: "100%", padding: "1rem", background: "var(--primary-600)", color: "white", border: "none", borderRadius: "12px", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" };
const dropdownList: React.CSSProperties = { position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "white", border: "1px solid var(--neutral-200)", borderRadius: "12px", boxShadow: "0 12px 40px rgba(0,0,0,0.1)", zIndex: 50, listStyle: "none", padding: "0.4rem", maxHeight: "260px", overflowY: "auto" };
const dropdownItem: React.CSSProperties = { padding: "0.65rem 1rem", borderRadius: "8px", cursor: "pointer", fontFamily: "var(--font-ui)", fontSize: "0.875rem", color: "var(--text-secondary)", transition: "background 0.15s" };

export default function BildiriPage() {
  return (
    <>
      <Navbar />
      <style>{`
        @keyframes madok-spin { to { transform: rotate(360deg); } }
        @keyframes madok-ring { to { stroke-dashoffset: 0; } }
        @keyframes madok-check { to { stroke-dashoffset: 0; } }
        @keyframes madok-bar { 0% { width: 0%; } 60% { width: 75%; } 100% { width: 100%; } }
        .uni-item:hover { background: var(--bg-secondary) !important; color: var(--primary-700) !important; }
      `}</style>
      <section className="packages-hero">
        <div className="section-container">
          <p className="section-overline">Bilimsel Bildiri</p>
          <h1 className="section-title" style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", marginBottom: "1rem" }}>
            Bildiri Gönder
          </h1>
          <p className="section-desc" style={{ marginBottom: 0 }}>
            Bildirinizi .docx formatında hazırlayın ve aşağıdaki formu doldurun.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="section-container">
          <BildiriForm />
        </div>
      </section>

      <Footer />
    </>
  );
}
