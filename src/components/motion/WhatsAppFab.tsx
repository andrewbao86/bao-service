"use client";

import { useEffect, useState } from "react";
import { whatsappLink, WHATSAPP_MESSAGES } from "@/lib/whatsapp";

export function WhatsAppFab({ href }: { href?: string }) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 1000);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <a
      href={href ?? whatsappLink(WHATSAPP_MESSAGES.general)}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Bao Service on WhatsApp"
      title="Chat instantly with our team"
      className={`fixed right-4 bottom-4 z-50 rounded-full shadow-lg px-4 py-3 text-white bg-whatsapp hover:bg-whatsapp-hover transition-all duration-300 ${
        pulse ? "scale-110 shadow-2xl" : ""
      }`}
      data-event="wa_click"
      data-loc="floating_button"
    >
      WhatsApp
    </a>
  );
}
