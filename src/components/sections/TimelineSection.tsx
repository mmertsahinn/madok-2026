import ScrollReveal from "@/components/ScrollReveal";

const timeline = [
  { date: "19 Haziran 2026", title: "Açılış & Bilimsel Oturumlar", desc: "Açılış konferansı (Plenary Lecture 1), 3 farklı konuşma ve serbest bildiri sözlü sunumları. Gün sonunda Gala Yemeği." },
  { date: "20 Haziran 2026", title: "Bilimsel Oturumlar & Workshop Günü", desc: "5 farklı uzman konuşması, kontenjanlı workshop oturumları, poster sunumları ve firma stant alanı ziyareti." },
  { date: "21 Haziran 2026", title: "Bildiriler & Kapanış", desc: "Uzman Konuşması, Serbest Bildiri Oturumları, Genç Araştırmacı/Öğrenci Oturumu, Ödül Töreni ve kapanış." },
];

export default function TimelineSection() {
  return (
    <section className="section" id="program">
      <div className="section-container">
        <ScrollReveal>
          <div className="section-header">
            <p className="section-overline">Önemli Tarihler</p>
            <h2 className="section-title">Zaman Çizelgesi</h2>
            <p className="section-desc">
              Kongre sürecindeki önemli tarihleri takip edin.
            </p>
          </div>
        </ScrollReveal>

        <div className="timeline">
          {timeline.map((item, i) => (
            <ScrollReveal key={i}>
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <p className="timeline-date">{item.date}</p>
                  <h4 className="timeline-title">{item.title}</h4>
                  <p className="timeline-desc">{item.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
