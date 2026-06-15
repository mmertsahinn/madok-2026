"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function HeroSection() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date("2026-06-19T09:00:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero" id="hero">
      <div className="hero-video-container">
        <video autoPlay muted loop playsInline>
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="hero-overlay"></div>

      <div className="new-hero-content">
        
        {/* Countdown Top */}
        <div className="nh-countdown">
             <div className="nh-cd-item">
               <span className="nh-val">{timeLeft.days}</span> <span className="nh-lbl">Gün</span>
             </div>
             <div className="nh-cd-item">
               <span className="nh-val">{timeLeft.hours}</span> <span className="nh-lbl">Saat</span>
             </div>
             <div className="nh-cd-item">
               <span className="nh-val">{timeLeft.minutes}</span> <span className="nh-lbl">Dakika</span>
             </div>
             <div className="nh-cd-item">
               <span className="nh-val">{timeLeft.seconds}</span> <span className="nh-lbl">Saniye</span>
             </div>
        </div>

        {/* Card Layout */}
        <div className="nh-card-wrapper">

           <div className="nh-main-card">
              <div className="nh-mc-top">
                 <h1 className="nh-mc-title">MADOK 2026</h1>
                 <p className="nh-mc-subtitle">Burdur Mehmet Akif Ersoy Üniversitesi<br/>Ulusal Diş Hekimliği Kongresi</p>
              </div>
              <div className="nh-mc-bottom">
                 <h2 className="nh-mc-date">19-21 Haziran</h2>
                 <p className="nh-mc-location">MAKÜ Konferans ve Sergi Salonu,<br/>Burdur, Türkiye</p>
                 <span className="nh-mc-btn" style={{ opacity: 0.6, cursor: "default", pointerEvents: "none" as const, background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.2)" }}>
                    Kayıtlar Kapatıldı
                 </span>
              </div>
           </div>
           
           <Link href="/bildiri" className="nh-side-tab">
              Bildiri Başvuru
           </Link>
        </div>
      </div>
    </section>
  );
}
