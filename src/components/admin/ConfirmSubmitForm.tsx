'use client';

import React, { useState } from 'react';
import LoadingScreen from './LoadingScreen';
import { useConfirm, useToast } from './ui/AdminUI';

interface ConfirmSubmitFormProps {
  children: React.ReactNode;
  message: string;
  action: (formData: FormData) => Promise<any>;
  className?: string;
  loadingMessage?: string;
  successMessage?: string;
}

export default function ConfirmSubmitForm({
  children,
  message,
  action,
  className,
  loadingMessage = 'Đang lưu thay đổi...',
  successMessage,
}: ConfirmSubmitFormProps) {
  const [isPending, setIsPending] = useState(false);
  const confirm = useConfirm();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const ok = await confirm({ title: 'Xác nhận', message });
    if (!ok) return;

    setIsPending(true);
    try {
      const result = await action(formData);
      // Nếu action redirect thành công, dòng dưới sẽ không chạy (điều hướng luôn).
      if (result?.error) {
        toast(result.error, 'error');
        setIsPending(false);
      } else if (result?.success) {
        toast(successMessage || 'Đã lưu thành công', 'success');
        setIsPending(false);
      }
    } catch (error) {
      // redirect() ném NEXT_REDIRECT — không phải lỗi thật, để nó điều hướng.
      if (error instanceof Error && error.message === 'NEXT_REDIRECT') throw error;
      console.error('Submit error:', error);
      toast('Có lỗi xảy ra, vui lòng thử lại', 'error');
      setIsPending(false);
    }
  };

  return (
    <>
      {isPending && <LoadingScreen message={loadingMessage} />}
      <form onSubmit={handleSubmit} className={className}>
        <fieldset disabled={isPending} className="contents">
          {children}
        </fieldset>
      </form>
    </>
  );
}
