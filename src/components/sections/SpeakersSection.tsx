import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";

const speakers = [
  {
    name: "Prof. Dr. Taha ÖZYÜREK",
    unvan: "Prof. Dr.",
    alan: "Endodonti",
    img: "/hocalar/prof. dr. taha özyürek.jpeg",
  },
  {
    name: "Prof. Dr. Mehmet Fatih ŞENTÜRK",
    unvan: "Prof. Dr.",
    alan: "Ağız Diş Çene Cerrahisi",
    img: "/hocalar/prof.dr. mehmet fatih şentürk.jpeg",
  },
  {
    name: "Doç. Dr. Hakan Yasin GÖNDER",
    unvan: "Doç. Dr.",
    alan: "Restoratif Diş Tedavisi",
    img: "/hocalar/do.dr Hakan yasin gönder.jpeg",
  },
  {
    name: "Dr. Öğr. Üyesi Abdurrahman YALÇIN",
    unvan: "Dr. Öğr. Üyesi",
    alan: "Restoratif Diş Tedavisi",
    img: "/hocalar/dr.öğr.üyesi abdurrahman yalçın.jpeg",
  },
  {
    name: "Dt. Onur YEDİKARA",
    unvan: "Dt.",
    alan: "Pratisyen",
    img: "/hocalar/dt.onur yedikara.jpeg",
  },
  {
    name: "Uzm. Dt. Burak MENGÜTAŞ",
    unvan: "Uzm. Dt.",
    alan: "Ağız Diş Çene Cerrahisi",
    img: "/hocalar/uzm.dt. burakt mengütaş.jpeg",
  },
];

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
                <div className="speaker-avatar" style={{ padding: 0, overflow: "hidden", background: "transparent" }}>
                  <Image
                    src={s.img}
                    alt={s.name}
                    width={120}
                    height={120}
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                    unoptimized
                  />
                </div>
                <div className="speaker-info">
                  <p className="speaker-specialty">{s.alan}</p>
                  <h3 className="speaker-name">{s.name}</h3>
                  <p className="speaker-title-text">{s.unvan}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
