"use client";
import { useState, useEffect } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const update = () => {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="countdown-section">
      <div className="countdown-container">
        <p className="countdown-text">Kongreye Kalan Süre</p>
        <div className="countdown-timer">
          <div className="countdown-item">
            <div className="countdown-value">{pad(timeLeft.days)}</div>
            <div className="countdown-label">Gün</div>
          </div>
          <span className="countdown-separator">:</span>
          <div className="countdown-item">
            <div className="countdown-value">{pad(timeLeft.hours)}</div>
            <div className="countdown-label">Saat</div>
          </div>
          <span className="countdown-separator">:</span>
          <div className="countdown-item">
            <div className="countdown-value">{pad(timeLeft.minutes)}</div>
            <div className="countdown-label">Dakika</div>
          </div>
          <span className="countdown-separator">:</span>
          <div className="countdown-item">
            <div className="countdown-value">{pad(timeLeft.seconds)}</div>
            <div className="countdown-label">Saniye</div>
          </div>
        </div>
      </div>
    </section>
  );
}
