"use client";

import Image from "next/image";
import { useEffect, useState } from "react";


const DROP_DATE = new Date("2026-04-25T20:00:00+08:00");

function getTimeLeft() {
  const diff = DROP_DATE.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    hours: Math.floor(diff / 1000 / 60 / 60),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft>>(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const t = getTimeLeft();
    if (!t) { setExpired(true); return; }
    setTimeLeft(t);

    const id = setInterval(() => {
      const next = getTimeLeft();
      setTimeLeft(next);
      if (!next) {
        clearInterval(id);
        window.sessionStorage.removeItem("groovy-home-loader-seen");
        window.dispatchEvent(new CustomEvent("groovy:countdown-expired"));
        setExpired(true);
      }
    }, 1000);
    return () => clearInterval(id);
  }, []);

  if (expired) return null;

  return (
    <div className="countdown-overlay">
      <div className="countdown-inner">
        <div className="countdown-brand">
          <Image
            src="/assets/groovy-icon.png"
            alt="Groovy"
            className="countdown-brand-image"
            fill
          />
        </div>
        <p className="countdown-teaser">Metamorphosis</p>
        <div className="countdown-timer">
          <div className="countdown-unit">
            <span className="countdown-value">{timeLeft ? pad(timeLeft.hours) : "--"}</span>
            <span className="countdown-label">hrs</span>
          </div>
          <span className="countdown-sep">:</span>
          <div className="countdown-unit">
            <span className="countdown-value">{timeLeft ? pad(timeLeft.minutes) : "--"}</span>
            <span className="countdown-label">min</span>
          </div>
          <span className="countdown-sep">:</span>
          <div className="countdown-unit">
            <span className="countdown-value">{timeLeft ? pad(timeLeft.seconds) : "--"}</span>
            <span className="countdown-label">sec</span>
          </div>
        </div>
      </div>
    </div>
  );
}
