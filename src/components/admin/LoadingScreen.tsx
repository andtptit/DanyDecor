'use client';

import { Loader2 } from 'lucide-react';

export default function LoadingScreen({ message = 'Đang xử lý...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-dark/20 backdrop-blur-[2px] z-[9999] flex items-center justify-center animate-in fade-in duration-300">
      <div className="bg-white p-8 rounded-[2rem] shadow-2xl flex flex-col items-center gap-4 border border-gray-100">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
        </div>
        <div className="text-center">
          <p className="font-bold text-dark text-lg">{message}</p>
          <p className="text-xs text-gray-400 mt-1">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    </div>
  );
}
