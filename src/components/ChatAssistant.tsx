"use client";

import { useState } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

interface ChatAssistantProps {
  zaloPhone: string;
  messengerUrl?: string;
}

interface ChatMessage {
  role: "bot" | "user";
  text: string;
}

const QUICK_QUESTIONS = [
  "Tư vấn chọn tranh phòng khách",
  "Bảng giá & kích thước",
  "Thời gian giao hàng",
];

export default function ChatAssistant({ zaloPhone, messengerUrl }: ChatAssistantProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      text: "Xin chào! Tôi là trợ lý của DanyDecor 🎨. Bạn cần tư vấn về tranh gì? Nhắn câu hỏi rồi mình kết nối bạn tới nhân viên qua Zalo/Fanpage nhé.",
    },
  ]);

  const zaloLink = `https://zalo.me/${zaloPhone}`;

  const handleSend = (text?: string) => {
    const content = (text ?? input).trim();
    if (!content) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", text: content },
      {
        role: "bot",
        text: "Cảm ơn bạn! Nhấn nút bên dưới để được nhân viên tư vấn trực tiếp và nhanh nhất.",
      },
    ]);
    setInput("");
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div
        className={`${isChatOpen ? "flex" : "hidden"} w-[380px] max-w-[90vw] h-[500px] bg-white rounded-[2rem] shadow-2xl flex-col overflow-hidden border border-gray-100 mb-6 transition-all duration-300 origin-bottom-right`}
      >
        <div className="bg-dark p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-sm">Tư vấn nhanh</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">DanyDecor</p>
            </div>
          </div>
          <button
            onClick={() => setIsChatOpen(false)}
            aria-label="Đóng"
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto bg-soft-gray flex flex-col gap-4 text-sm">
          {messages.map((m, i) => (
            <div
              key={i}
              className={
                m.role === "bot"
                  ? "bg-white text-dark p-4 rounded-2xl rounded-tl-none self-start max-w-[85%] shadow-sm border border-gray-100 leading-relaxed"
                  : "bg-primary text-white p-4 rounded-2xl rounded-tr-none self-end max-w-[85%] shadow-sm leading-relaxed"
              }
            >
              {m.text}
            </div>
          ))}

          {messages.length <= 1 && (
            <div className="flex flex-col gap-2 mt-1">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="text-left text-xs bg-white border border-gray-100 text-dark px-4 py-2.5 rounded-xl hover:border-primary hover:text-primary transition-colors shadow-sm"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {messages.length > 1 && (
            <div className="flex flex-col gap-2 self-start w-full">
              <a
                href={zaloLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-primary text-white text-sm font-bold px-4 py-3 rounded-xl hover:bg-blue-600 transition-colors shadow-md"
              >
                <MessageCircle className="w-4 h-4" /> Nhận tư vấn qua Zalo
              </a>
              {messengerUrl && (
                <a
                  href={messengerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-dark text-sm font-bold px-4 py-3 rounded-xl hover:border-primary hover:text-primary transition-colors shadow-sm"
                >
                  <Send className="w-4 h-4" /> Chat qua Fanpage
                </a>
              )}
            </div>
          )}
        </div>

        <div className="p-4 bg-white border-t border-gray-50 flex gap-2 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            className="flex-1 bg-soft-gray border-none text-sm rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="Hỏi về tranh, màu sắc..."
          />
          <button
            onClick={() => handleSend()}
            aria-label="Gửi"
            className="bg-primary text-white w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-blue-500 shadow-lg transition-all shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Nút mở chat */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        aria-label="Mở tư vấn nhanh"
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
