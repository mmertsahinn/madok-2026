import ScrollReveal from "@/components/ScrollReveal";

const announcements = [
  {
    day: "08",
    month: "Eki",
    title: "Bildiri Gönderimi Son Tarihi Uzatıldı!",
    desc: "Son tarih 30 Eylül 2026 olarak güncellendi.",
  },
  {
    day: "20",
    month: "Eyl",
    title: "Yoğun İstek Üzerine Erken Kayıt Uzatıldı!",
    desc: "Erken kayıt fırsatını kaçırmayın.",
  },
  {
    day: "01",
    month: "Eyl",
    title: "Avantajlı Erken Kayıt Başladı",
    desc: "İndirimli kayıt fırsatlarından yararlanın.",
  },
  {
    day: "23",
    month: "Ağu",
    title: "Bildiri Gönderimi Başladı",
    desc: "Bildirilerinizi sisteme yükleyebilirsiniz.",
  },
];

export default function AnnouncementsSection() {
  return (
    <section className="section section-alt" id="duyurular">
      <div className="section-container">
        <ScrollReveal>
          <div className="section-header">
            <p className="section-overline">Duyurular</p>
            <h2 className="section-title">Güncel Gelişmeler</h2>
            <p className="section-desc">
              Kongre ile ilgili en son haberleri ve duyuruları takip edin.
            </p>
          </div>
        </ScrollReveal>

        {/* Bilimsel Program Duyurusu */}
        <ScrollReveal>
          <div className="bilimsel-duyuru-banner">
            <div className="bilimsel-duyuru-icon">🔬</div>
            <div className="bilimsel-duyuru-text">
              <h3>Bilimsel Program</h3>
              <p>Kongre bilimsel programı yakında duyurulacaktır. Gelişmeleri takip etmek için bültenimize kayıt olun.</p>
            </div>
            <div className="bilimsel-duyuru-badge">Yakında</div>
          </div>
        </ScrollReveal>

        <div className="announcements-list" style={{ marginTop: "2rem" }}>
          {announcements.map((a, i) => (
            <ScrollReveal key={i}>
              <a href="#" className="announcement-card">
                <div className="announcement-date">
                  <div className="day">{a.day}</div>
                  <div className="month">{a.month}</div>
                </div>
                <div className="announcement-divider"></div>
                <div className="announcement-content">
                  <h4>{a.title}</h4>
                  <p>{a.desc}</p>
                </div>
                <span className="announcement-arrow">→</span>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
