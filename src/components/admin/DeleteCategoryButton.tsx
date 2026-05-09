'use client';

import React, { useState } from 'react';
import { Trash, Loader2 } from 'lucide-react';
import LoadingScreen from './LoadingScreen';

interface DeleteCategoryButtonProps {
  categoryId: string;
  categoryName: string;
  onDelete: (formData: FormData) => Promise<any>;
  isSmall?: boolean;
}

export default function DeleteCategoryButton({ categoryId, categoryName, onDelete, isSmall }: DeleteCategoryButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${categoryName}" không?\nLưu ý: Bạn không thể xóa nếu danh mục này vẫn còn sản phẩm hoặc danh mục con.`);
    
    if (confirmed) {
      setIsDeleting(true);
      try {
        const formData = new FormData(e.currentTarget);
        const result = await onDelete(formData);

        if (result && !result.success) {
          alert(result.error || 'Không thể xóa danh mục này');
          setIsDeleting(false);
        }
      } catch (error) {
        console.error('Delete category error:', error);
        setIsDeleting(false);
      }
    }
  };

  return (
    <>
      {isDeleting && <LoadingScreen message={`Đang xóa danh mục "${categoryName}"...`} />}
      <form onSubmit={handleConfirm}>
        <input type="hidden" name="id" value={categoryId} />
        <button 
          type="submit" 
          disabled={isDeleting}
          className={`${isSmall ? 'p-1.5' : 'p-2'} text-gray-400 hover:text-red-500 transition-colors bg-white border border-gray-100 rounded-lg hover:bg-soft-gray disabled:opacity-50 disabled:cursor-not-allowed`}
          title="Xóa danh mục"
        >
          {isDeleting ? (
            <Loader2 className={`${isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4'} animate-spin text-red-500`} />
          ) : (
            <Trash className={isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          )}
        </button>
      </form>
    </>
  );
}
