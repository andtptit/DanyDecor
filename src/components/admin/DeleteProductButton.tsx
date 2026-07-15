'use client';

import React, { useState } from 'react';
import { Trash, Loader2 } from 'lucide-react';
import LoadingScreen from './LoadingScreen';
import { useConfirm, useToast } from './ui/AdminUI';

interface DeleteProductButtonProps {
  productId: string;
  productName: string;
  onDelete: (formData: FormData) => Promise<any>;
}

export default function DeleteProductButton({ productId, productName, onDelete }: DeleteProductButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const confirm = useConfirm();
  const toast = useToast();

  const handleClick = async () => {
    const ok = await confirm({
      title: 'Xóa sản phẩm',
      message: `Bạn có chắc chắn muốn xóa sản phẩm "${productName}" không?\nThao tác này không thể khôi phục.`,
      confirmText: 'Xóa',
      danger: true,
    });
    if (!ok) return;

    setIsDeleting(true);
    try {
      const formData = new FormData();
      formData.set('id', productId);
      const result = await onDelete(formData);

      if (result && !result.success) {
        toast(result.error || 'Không thể xóa sản phẩm này', 'error');
        setIsDeleting(false);
      } else {
        toast(`Đã xóa "${productName}"`, 'success');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast('Có lỗi xảy ra khi xóa sản phẩm', 'error');
      setIsDeleting(false);
    }
  };

  return (
    <>
      {isDeleting && <LoadingScreen message={`Đang xóa "${productName}"...`} />}
      <button
        type="button"
        onClick={handleClick}
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
    </>
  );
}
