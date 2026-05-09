'use client';

import React, { useState } from 'react';
import LoadingScreen from './LoadingScreen';

interface ConfirmSubmitFormProps {
  children: React.ReactNode;
  message: string;
  action: (formData: FormData) => Promise<any>;
  className?: string;
  loadingMessage?: string;
}

export default function ConfirmSubmitForm({ 
  children, 
  message, 
  action, 
  className,
  loadingMessage = 'Đang lưu thay đổi...' 
}: ConfirmSubmitFormProps) {
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const confirmed = window.confirm(message);
    
    if (confirmed) {
      setIsPending(true);
      try {
        const formData = new FormData(e.currentTarget);
        await action(formData);
      } catch (error) {
        console.error('Submit error:', error);
      } finally {
        setIsPending(false);
      }
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
