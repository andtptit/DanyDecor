'use client';

import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  message?: string;
  subMessage?: string;
}

export default function LoadingScreen({ 
  message = 'Đang xử lý...', 
  subMessage = 'Vui lòng đợi trong giây lát'
}: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  // Giả lập progress bar tăng dần
  useEffect(() => {
    const steps = [15, 35, 55, 72, 85, 92];
    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setProgress(steps[i]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-dark/25 backdrop-blur-[3px] z-[9999] flex items-center justify-center animate-in fade-in duration-200">
      <div className="bg-white w-80 p-8 rounded-[2rem] shadow-2xl flex flex-col items-center gap-5 border border-gray-100">
        {/* Animated logo mark */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
          <div 
            className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"
            style={{ animationDuration: '0.8s' }}
          />
          <div className="absolute inset-2 rounded-full bg-primary/5 flex items-center justify-center">
            <span className="font-serif font-bold text-primary text-lg">D</span>
          </div>
        </div>

        {/* Text */}
        <div className="text-center space-y-1">
          <p className="font-bold text-dark">{message}</p>
          <p className="text-xs text-gray-400">{subMessage}</p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[10px] text-gray-300 -mt-2">{progress}%</p>
      </div>
    </div>
  );
}
