'use client';

import React from 'react';
import { Trash } from 'lucide-react';

interface DeleteCategoryButtonProps {
  categoryId: string;
  categoryName: string;
  onDelete: (formData: FormData) => Promise<any>;
  isSmall?: boolean;
}

export default function DeleteCategoryButton({ categoryId, categoryName, onDelete, isSmall }: DeleteCategoryButtonProps) {
  const handleConfirm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${categoryName}" không?\nThao tác này KHÔNG THỂ khôi phục!`);
    
    if (confirmed) {
      const formData = new FormData(e.currentTarget);
      const result = await onDelete(formData) as any;
      
      if (result && !result.success) {
        alert(result.error || 'Không thể xóa danh mục này');
      }
    }
  };

  return (
    <form onSubmit={handleConfirm}>
      <input type="hidden" name="id" value={categoryId} />
      <button 
        type="submit" 
        className={`${isSmall ? 'p-1.5' : 'p-2'} text-gray-400 hover:text-red-500 transition-colors bg-white border border-gray-100 rounded-lg hover:bg-soft-gray`}
        title="Xóa danh mục"
      >
        <Trash className={isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      </button>
    </form>
  );
}
