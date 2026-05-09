'use client';

import React from 'react';

interface ConfirmSubmitFormProps {
  children: React.ReactNode;
  message: string;
  action: (formData: FormData) => Promise<void>;
  className?: string;
}

export default function ConfirmSubmitForm({ children, message, action, className }: ConfirmSubmitFormProps) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const confirmed = window.confirm(message);
    if (confirmed) {
      const formData = new FormData(e.currentTarget);
      await action(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  );
}
