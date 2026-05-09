'use client';

import React, { useState } from 'react';
import { Trash, Loader2 } from 'lucide-react';
import LoadingScreen from './LoadingScreen';

interface DeleteProductButtonProps {
  productId: string;
  productName: string;
  onDelete: (formData: FormData) => Promise<any>;
}

export default function DeleteProductButton({ productId, productName, onDelete }: DeleteProductButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${productName}" không?\nThao tác này KHÔNG THỂ khôi phục!`);
    
    if (confirmed) {
      setIsDeleting(true);
      try {
        const formData = new FormData(e.currentTarget);
        const result = await onDelete(formData);

        if (result && !result.success) {
          alert(result.error || 'Không thể xóa sản phẩm này');
          setIsDeleting(false);
        }
      } catch (error) {
        console.error('Delete error:', error);
        setIsDeleting(false);
      }
    }
  };

  return (
    <>
      {isDeleting && <LoadingScreen message={`Đang xóa "${productName}"...`} />}
      <form onSubmit={handleConfirm}>
        <input type="hidden" name="id" value={productId} />
        <button 
          type="submit" 
          disabled={isDeleting}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-white border border-gray-100 rounded-lg hover:bg-soft-gray disabled:opacity-50 disabled:cursor-not-allowed"
          title="Xóa sản phẩm"
        >
          {isDeleting ? (
            <Loader2 className="w-4 h-4 animate-spin text-red-500" />
          ) : (
            <Trash className="w-4 h-4" />
          )}
        </button>
      </form>
    </>
  );
}
