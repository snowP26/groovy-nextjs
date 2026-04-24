"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// Target date remains constant
const DROP_DATE = new Date("2026-04-25T20:00:00+08:00");

function getTimeLeft(serverOffset: number) {
  // adjust Date.now() by the pre-calculated server offset
  const adjustedNow = Date.now() + serverOffset;
  const diff = DROP_DATE.getTime() - adjustedNow;
  
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
  const [serverOffset, setServerOffset] = useState<number | null>(null);

  useEffect(() => {
    async function syncTime() {
      try {
        // Fetch from a public API or your own /api/time route
        const response = await fetch("https://worldtimeapi.org/api/timezone/Etc/UTC");
        const data = await response.json();
        const actualServerTime = new Date(data.datetime).getTime();
        
        // Calculate how far off the user's local clock is
        const offset = actualServerTime - Date.now();
        setServerOffset(offset);

        // Initial check
        const initial = getTimeLeft(offset);
        if (!initial) {
          setExpired(true);
        } else {
          setTimeLeft(initial);
        }
      } catch (error) {
        console.error("Failed to sync server time, falling back to local:", error);
        setServerOffset(0); // Fallback to local if API is down
      }
    }

    syncTime();
  }, []);

  useEffect(() => {
    if (serverOffset === null || expired) return;

    const id = setInterval(() => {
      const next = getTimeLeft(serverOffset);
      setTimeLeft(next);
      
      if (!next) {
        clearInterval(id);
        window.sessionStorage.removeItem("groovy-home-loader-seen");
        window.dispatchEvent(new CustomEvent("groovy:countdown-expired"));
        setExpired(true);
      }
    }, 1000);

    return () => clearInterval(id);
  }, [serverOffset, expired]);

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