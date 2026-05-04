import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer" id="iletisim">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>MADOK</h3>
            <p>
              MADOK 2026, alanındaki güncel bilimsel gelişmeleri, klinik uygulamaları
              ve araştırma çıktılarını ulusal ve uluslararası paydaşlarla buluşturan
              uluslararası akademik kongredir.
            </p>
          </div>

          <div className="footer-col">
            <h4>Kongre</h4>
            <ul>
              <li><Link href="/hakkinda">Hakkında</Link></li>
              <li><Link href="/program">Program</Link></li>
              <li><Link href="/konusmacilar">Konuşmacılar</Link></li>
              <li><Link href="/komiteler">Komiteler</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Katılım</h4>
            <ul>
              <li><Link href="/paketler">Kayıt & Paketler</Link></li>
              <li><Link href="/odeme">Ödeme & Dekont</Link></li>
              <li><Link href="/bildiri">Bildiri Gönder</Link></li>
              <li><Link href="/mekan">Konaklama & Ulaşım</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Medya</h4>
            <ul>
              <li><Link href="/#duyurular">Duyurular</Link></li>
              <li><Link href="/iletisim">İletişim</Link></li>
              <li><Link href="/sponsorluk">Sponsorluk</Link></li>
              <li><Link href="/paketler">Paketler</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Sponsorluk</h4>
            <ul>
              <li><Link href="/sponsorluk">Neden Sponsor?</Link></li>
              <li><Link href="/sponsorluk">Paketler</Link></li>
              <li><Link href="/iletisim">Stand Başvuru</Link></li>
              <li><Link href="/paketler">SSS</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 MADOK. Tüm hakları saklıdır.</span>
          <span>Gizlilik Politikası · Kullanım Şartları</span>
        </div>
      </div>
    </footer>
  );
}
