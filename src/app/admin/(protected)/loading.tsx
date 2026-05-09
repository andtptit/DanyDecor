import { Loader2 } from 'lucide-react';

export default function AdminLoading() {
  return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <Loader2 className="w-12 h-12 text-primary/20 animate-spin" />
        <Loader2 className="w-12 h-12 text-primary animate-spin absolute top-0 left-0 [animation-delay:-0.5s]" />
      </div>
      <div className="space-y-2 text-center">
        <h3 className="text-lg font-serif font-bold text-dark italic">DanyDecor</h3>
        <p className="text-xs text-gray-400 tracking-widest uppercase">Đang tải dữ liệu...</p>
      </div>
      
      {/* Skeleton placeholders */}
      <div className="w-full max-w-4xl mt-12 space-y-4 px-6 opacity-40">
        <div className="h-8 bg-gray-100 rounded-xl w-1/4"></div>
        <div className="h-[400px] bg-gray-100 rounded-[2rem] w-full"></div>
      </div>
    </div>
  );
}
