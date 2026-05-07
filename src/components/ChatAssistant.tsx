"use client";

import { useState } from "react";
import { Bot, X, Send, Sparkles } from "lucide-react";

export default function ChatAssistant() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div
        className={`${isChatOpen ? "flex" : "hidden"
          } w-[380px] max-w-[90vw] h-[500px] bg-white rounded-[2rem] shadow-2xl flex-col overflow-hidden border border-gray-100 mb-6 transition-all duration-300 origin-bottom-right`}
      >
        <div className="bg-dark p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-sm">AI Assistant</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                DanyDecor
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsChatOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 p-6 overflow-y-auto bg-soft-gray flex flex-col gap-4 text-sm">
          <div className="bg-white text-dark p-4 rounded-2xl rounded-tl-none self-start max-w-[85%] shadow-sm border border-gray-100 leading-relaxed">
            Xin chào! Tôi là trợ lý AI của **DanyDecor** 🎨. Tôi có thể giúp gì
            cho bạn trong việc chọn tranh trang trí hôm nay?
          </div>
        </div>
        <div className="p-4 bg-white border-t border-gray-50 flex gap-2 items-center">
          <input
            type="text"
            className="flex-1 bg-soft-gray border-none text-sm rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="Hỏi về tranh, màu sắc..."
          />
          <button className="bg-primary text-white w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-blue-500 shadow-lg transition-all shrink-0">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Nút mở chat */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="w-16 h-16 bg-primary text-white rounded-[1.5rem] shadow-2xl flex items-center justify-center hover:rotate-6 hover:scale-110 transition-all ml-auto relative group"
      >
        <Sparkles className="w-7 h-7 group-hover:animate-pulse" />
        <span className="absolute -top-1 -right-1 flex h-5 w-5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-5 w-5 bg-primary border-2 border-white"></span>
        </span>
      </button>
    </div>
  );
}
