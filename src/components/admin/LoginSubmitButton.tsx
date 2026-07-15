'use client';

import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';
import LoadingScreen from './LoadingScreen';

export default function LoginSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <>
      {pending && (
        <LoadingScreen message="Đang đăng nhập..." subMessage="Đang xác thực tài khoản của bạn" />
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full btn-primary px-6 py-3.5 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {pending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Đang đăng nhập...
          </>
        ) : (
          'Đăng nhập'
        )}
      </button>
    </>
  );
}
