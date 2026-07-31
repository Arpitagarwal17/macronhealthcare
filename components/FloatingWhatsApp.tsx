"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { company } from "@/data/company";

export default function FloatingWhatsApp() {
  const pathname = usePathname();
  const sitsAboveBasket = pathname === "/doctor-presentation";

  return (
    <a
      href={company.contactLinks.whatsapp.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={company.contactLinks.whatsapp.ariaLabel}
      className={`fixed right-4 z-40 inline-flex h-12 min-h-12 items-center justify-center gap-2 rounded-full bg-[#1f9d63] px-4 text-sm font-bold text-white shadow-[0_14px_34px_rgba(18,98,62,0.28)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#168452] focus:outline-none focus:ring-4 focus:ring-[#1f9d63]/20 sm:right-6 ${
        sitsAboveBasket ? "bottom-24" : "bottom-5"
      }`}
    >
      <MessageCircle className="h-5 w-5" aria-hidden="true" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
