'use client';

import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';

/* ============================ TOAST ============================ */

type ToastType = 'success' | 'error' | 'info';
interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

const ToastContext = createContext<(message: string, type?: ToastType) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

const toastStyles: Record<ToastType, { icon: React.ReactNode; ring: string }> = {
  success: { icon: <CheckCircle2 className="w-5 h-5 text-green-500" />, ring: 'border-green-100' },
  error: { icon: <XCircle className="w-5 h-5 text-red-500" />, ring: 'border-red-100' },
  info: { icon: <Info className="w-5 h-5 text-primary" />, ring: 'border-blue-100' },
};

/* =========================== CONFIRM =========================== */

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}
interface ConfirmRequest extends ConfirmOptions {
  resolve: (ok: boolean) => void;
}

const ConfirmContext = createContext<(options: ConfirmOptions) => Promise<boolean>>(
  async () => false
);

export function useConfirm() {
  return useContext(ConfirmContext);
}

/* ========================== PROVIDER =========================== */

export default function AdminUIProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  const [request, setRequest] = useState<ConfirmRequest | null>(null);

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setRequest({ ...options, resolve });
    });
  }, []);

  const closeConfirm = (ok: boolean) => {
    if (request) request.resolve(ok);
    setRequest(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      <ToastContext.Provider value={showToast}>
        {children}

        {/* Toasts */}
        <div className="fixed bottom-6 right-6 z-[10000] flex flex-col gap-3 w-80 max-w-[90vw]">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`bg-white border ${toastStyles[t.type].ring} shadow-2xl rounded-2xl px-4 py-3 flex items-start gap-3 animate-in slide-in-from-right-4 fade-in duration-200`}
            >
              <div className="shrink-0 mt-0.5">{toastStyles[t.type].icon}</div>
              <p className="text-sm text-dark flex-1 leading-snug">{t.message}</p>
              <button
                onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
                className="text-gray-300 hover:text-gray-500 transition-colors"
                aria-label="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Confirm modal */}
        {request && (
          <div
            className="fixed inset-0 z-[10001] bg-dark/30 backdrop-blur-[2px] flex items-center justify-center p-4 animate-in fade-in duration-150"
            onClick={() => closeConfirm(false)}
          >
            <div
              className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl border border-gray-100 p-8 animate-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center ${request.danger ? 'bg-red-50' : 'bg-primary/10'}`}
                >
                  <AlertTriangle
                    className={`w-6 h-6 ${request.danger ? 'text-red-500' : 'text-primary'}`}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-dark text-lg mb-1">{request.title || 'Xác nhận'}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">
                    {request.message}
                  </p>
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={() => closeConfirm(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-sm text-gray-500 hover:bg-soft-gray transition-colors"
                >
                  {request.cancelText || 'Hủy'}
                </button>
                <button
                  onClick={() => closeConfirm(true)}
                  className={`px-6 py-2.5 rounded-xl font-bold text-sm text-white shadow-md transition-colors ${request.danger ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-blue-600'}`}
                >
                  {request.confirmText || 'Đồng ý'}
                </button>
              </div>
            </div>
          </div>
        )}
      </ToastContext.Provider>
    </ConfirmContext.Provider>
  );
}
