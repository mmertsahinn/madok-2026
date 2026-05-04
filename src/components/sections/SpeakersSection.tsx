import ScrollReveal from "@/components/ScrollReveal";

const speakers = [
  { name: "Prof. Dr. Ahmet Yılmaz", specialty: "Biyomedikal Mühendislik", title: "Prof. Dr.", topic: "Yapay Zeka ve Klinik Uygulamalar" },
  { name: "Doç. Dr. Elif Demir", specialty: "Moleküler Biyoloji", title: "Doç. Dr.", topic: "Genomik Tıpta Yeni Paradigmalar" },
  { name: "Prof. Dr. Mehmet Kaya", specialty: "Nörobilim", title: "Prof. Dr.", topic: "Beyin-Bilgisayar Arayüzleri ve Gelecek" },
  { name: "Dr. Ayşe Çelik", specialty: "Farmakoloji", title: "Dr.", topic: "Kişiselleştirilmiş Tıp Uygulamaları" },
  { name: "Prof. Dr. Hasan Öztürk", specialty: "Tıbbi Görüntüleme", title: "Prof. Dr.", topic: "Dijital Patolojide Derin Öğrenme" },
  { name: "Doç. Dr. Zeynep Arslan", specialty: "Kardiyoloji", title: "Doç. Dr.", topic: "Minimal İnvaziv Kardiyak Teknolojiler" },
  { name: "Dr. Can Erdoğan", specialty: "Robotik Cerrahi", title: "Dr.", topic: "Robot Destekli Cerrahi Prosedürler" },
  { name: "Prof. Dr. Fatma Şahin", specialty: "İmmünoloji", title: "Prof. Dr.", topic: "Kanser İmmünoterapisinde Güncel Yaklaşımlar" },
];

const initials = (name: string) => {
  const parts = name.replace(/Prof\.|Dr\.|Doç\./g, "").trim().split(" ");
  return parts.filter(p => p.length > 1).slice(0, 2).map(p => p[0]).join("");
};

export default function SpeakersSection() {
  return (
    <section className="section" id="konusmacilar">
      <div className="section-container">
        <ScrollReveal>
          <div className="section-header">
            <p className="section-overline">Konuşmacılar</p>
            <h2 className="section-title">Alanında Uzman İsimler</h2>
            <p className="section-desc">
              Ulusal alanda öncü araştırmacılar ve klinisyenler MADOK 2026&apos;da.
            </p>
          </div>
        </ScrollReveal>

        <div className="speakers-grid">
          {speakers.map((s, i) => (
            <ScrollReveal key={i}>
              <div className="speaker-card">
                <div className="speaker-avatar">{initials(s.name)}</div>
                <div className="speaker-info">
                  <p className="speaker-specialty">{s.specialty}</p>
                  <h3 className="speaker-name">{s.name}</h3>
                  <p className="speaker-title-text">{s.title}</p>
                  <p className="speaker-topic">{s.topic}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
