'use client';

import React from 'react';
import { MessageCircle, PhoneCall } from 'lucide-react';

interface FloatingContactProps {
  zaloPhone: string;
  hotlinePhone: string;
}

export default function FloatingContact({ zaloPhone, hotlinePhone }: FloatingContactProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
      {/* Hotline Button */}
      <a
        href={`tel:${hotlinePhone}`}
        className="group relative flex items-center justify-center w-14 h-14 bg-amber-500 text-white rounded-full shadow-lg shadow-amber-500/30 hover:bg-amber-600 hover:scale-110 transition-all duration-300"
        title="Gọi Hotline"
      >
        <div className="absolute inset-0 rounded-full animate-ping bg-amber-500 opacity-20"></div>
        <PhoneCall className="w-6 h-6 animate-pulse" />
        
        {/* Tooltip */}
        <span className="absolute right-full mr-4 bg-dark text-white text-xs font-bold px-3 py-2 rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300">
          Gọi Hotline
          <div className="absolute top-1/2 -right-1 w-2 h-2 bg-dark rotate-45 -translate-y-1/2"></div>
        </span>
      </a>

      {/* Zalo Button */}
      <a
        href={`https://zalo.me/${zaloPhone}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 bg-[#0068FF] text-white rounded-full shadow-lg shadow-[#0068FF]/30 hover:bg-blue-700 hover:scale-110 transition-all duration-300"
        title="Chat Zalo"
      >
        <div className="absolute inset-0 rounded-full animate-ping bg-[#0068FF] opacity-20" style={{ animationDelay: '0.5s' }}></div>
        <MessageCircle className="w-6 h-6 animate-pulse" />

        {/* Tooltip */}
        <span className="absolute right-full mr-4 bg-dark text-white text-xs font-bold px-3 py-2 rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300">
          Chat Zalo
          <div className="absolute top-1/2 -right-1 w-2 h-2 bg-dark rotate-45 -translate-y-1/2"></div>
        </span>
      </a>
    </div>
  );
}
