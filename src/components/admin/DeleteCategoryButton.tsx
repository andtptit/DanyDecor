'use client';

import React, { useState } from 'react';
import { Trash, Loader2 } from 'lucide-react';
import LoadingScreen from './LoadingScreen';
import { useConfirm, useToast } from './ui/AdminUI';

interface DeleteCategoryButtonProps {
  categoryId: string;
  categoryName: string;
  onDelete: (formData: FormData) => Promise<any>;
  isSmall?: boolean;
}

export default function DeleteCategoryButton({ categoryId, categoryName, onDelete, isSmall }: DeleteCategoryButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const confirm = useConfirm();
  const toast = useToast();

  const handleClick = async () => {
    const ok = await confirm({
      title: 'Xóa danh mục',
      message: `Bạn có chắc chắn muốn xóa danh mục "${categoryName}" không?\nLưu ý: không thể xóa nếu danh mục vẫn còn sản phẩm hoặc danh mục con.`,
      confirmText: 'Xóa',
      danger: true,
    });
    if (!ok) return;

    setIsDeleting(true);
    try {
      const formData = new FormData();
      formData.set('id', categoryId);
      const result = await onDelete(formData);

      if (result && !result.success) {
        toast(result.error || 'Không thể xóa danh mục này', 'error');
        setIsDeleting(false);
      } else {
        toast(`Đã xóa danh mục "${categoryName}"`, 'success');
      }
    } catch (error) {
      console.error('Delete category error:', error);
      toast('Có lỗi xảy ra khi xóa danh mục', 'error');
      setIsDeleting(false);
    }
  };

  return (
    <>
      {isDeleting && <LoadingScreen message={`Đang xóa danh mục "${categoryName}"...`} />}
      <button
        type="button"
        onClick={handleClick}
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
    </>
  );
}
