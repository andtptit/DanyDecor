'use client';

import React from 'react';
import { Trash } from 'lucide-react';

interface DeleteProductButtonProps {
  productId: string;
  productName: string;
  onDelete: (formData: FormData) => Promise<any>;
}

export default function DeleteProductButton({ productId, productName, onDelete }: DeleteProductButtonProps) {
  const handleConfirm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${productName}" không?\nThao tác này KHÔNG THỂ khôi phục!`);
    
    if (confirmed) {
      const formData = new FormData(e.currentTarget);
      const result = await onDelete(formData) as any;

      if (result && !result.success) {
        alert(result.error || 'Không thể xóa sản phẩm này');
      }
    }
  };

  return (
    <form onSubmit={handleConfirm}>
      <input type="hidden" name="id" value={productId} />
      <button 
        type="submit" 
        className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-white border border-gray-100 rounded-lg hover:bg-soft-gray"
        title="Xóa sản phẩm"
      >
        <Trash className="w-4 h-4" />
      </button>
    </form>
  );
}
