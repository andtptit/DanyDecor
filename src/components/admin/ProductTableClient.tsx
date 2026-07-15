'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Edit, ChevronRight, Star, Trash2, Loader2 } from 'lucide-react';
import DeleteProductButton from './DeleteProductButton';
import { useConfirm, useToast } from './ui/AdminUI';

type AnyProduct = any;
type Action = (fd: FormData) => Promise<any>;

interface Props {
  products: AnyProduct[];
  deleteProduct: Action;
  toggleFeatured: Action;
  bulkAction: Action;
}

function formatPrice(v: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);
}

function PriceCell({ prod }: { prod: AnyProduct }) {
  if (prod.sizes && prod.sizes.length > 0) {
    const prices = prod.sizes.map((s: AnyProduct) => s.price).filter((p: number) => p !== null && p > 0);
    if (prices.length === 0) return <span className="text-gray-400">Liên hệ</span>;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return (
      <span className="font-bold text-primary">
        {min === max ? formatPrice(min) : `${formatPrice(min)} - ...`}
      </span>
    );
  }
  return <span className="font-bold text-primary">{prod.price ? formatPrice(prod.price) : 'Liên hệ'}</span>;
}

export default function ProductTableClient({ products, deleteProduct, toggleFeatured, bulkAction }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [localFeatured, setLocalFeatured] = useState<Record<string, boolean>>({});
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const confirm = useConfirm();
  const toast = useToast();

  const allSelected = products.length > 0 && products.every((p) => selected.has(p.id));

  const toggleSelectAll = () => {
    setSelected(allSelected ? new Set() : new Set(products.map((p) => p.id)));
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isFeatured = (p: AnyProduct) => localFeatured[p.id] ?? p.isFeatured;

  const handleToggleFeatured = (p: AnyProduct) => {
    const next = !isFeatured(p);
    setLocalFeatured((prev) => ({ ...prev, [p.id]: next }));
    setTogglingId(p.id);
    startTransition(async () => {
      const fd = new FormData();
      fd.set('id', p.id);
      fd.set('featured', String(next));
      const res = await toggleFeatured(fd);
      setTogglingId(null);
      if (res && !res.success) {
        setLocalFeatured((prev) => ({ ...prev, [p.id]: !next })); // revert
        toast(res.error || 'Không thể cập nhật', 'error');
      }
    });
  };

  const runBulk = async (op: 'feature' | 'unfeature' | 'delete') => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;

    if (op === 'delete') {
      const ok = await confirm({
        title: 'Xóa nhiều sản phẩm',
        message: `Bạn có chắc muốn xóa ${ids.length} sản phẩm đã chọn không?\nThao tác này không thể khôi phục.`,
        confirmText: 'Xóa tất cả',
        danger: true,
      });
      if (!ok) return;
    }

    startTransition(async () => {
      const fd = new FormData();
      fd.set('op', op);
      fd.set('ids', JSON.stringify(ids));
      const res = await bulkAction(fd);
      if (res?.success) {
        const verb = op === 'delete' ? 'Đã xóa' : op === 'feature' ? 'Đã đánh dấu nổi bật' : 'Đã bỏ nổi bật';
        toast(`${verb} ${res.count} sản phẩm`, 'success');
        setSelected(new Set());
        setLocalFeatured({});
      } else {
        toast(res?.error || 'Có lỗi xảy ra', 'error');
      }
    });
  };

  return (
    <div className="relative">
      {/* Thanh thao tác hàng loạt */}
      {selected.size > 0 && (
        <div className="sticky top-0 z-10 bg-dark text-white px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-sm font-bold">Đã chọn {selected.size} sản phẩm</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => runBulk('feature')}
              disabled={isPending}
              className="flex items-center gap-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <Star className="w-3.5 h-3.5" /> Nổi bật
            </button>
            <button
              onClick={() => runBulk('unfeature')}
              disabled={isPending}
              className="flex items-center gap-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              Bỏ nổi bật
            </button>
            <button
              onClick={() => runBulk('delete')}
              disabled={isPending}
              className="flex items-center gap-1.5 text-xs font-bold bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" /> Xóa
            </button>
            <button
              onClick={() => setSelected(new Set())}
              className="text-xs text-gray-300 hover:text-white px-2 transition-colors"
            >
              Bỏ chọn
            </button>
          </div>
        </div>
      )}

      <table className="w-full text-left text-sm">
        <thead className="bg-soft-gray/50 text-gray-500 uppercase tracking-widest text-[10px] font-bold">
          <tr>
            <th className="pl-6 pr-2 py-4 rounded-tl-3xl w-10">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                aria-label="Chọn tất cả"
              />
            </th>
            <th className="px-6 py-4">Sản Phẩm</th>
            <th className="px-6 py-4">Danh Mục</th>
            <th className="px-6 py-4">Giá</th>
            <th className="px-6 py-4">Nổi Bật</th>
            <th className="px-6 py-4 text-right rounded-tr-3xl">Thao Tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {products.map((prod) => {
            const checked = selected.has(prod.id);
            const featured = isFeatured(prod);
            return (
              <tr key={prod.id} className={`transition-colors group ${checked ? 'bg-primary/5' : 'hover:bg-soft-gray/50'}`}>
                <td className="pl-6 pr-2 py-4">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleSelect(prod.id)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                    aria-label={`Chọn ${prod.name}`}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                      {prod.images && prod.images.length > 0 ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={prod.images[0]} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <div className="w-full h-full bg-gray-200" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-dark mb-1">{prod.name}</p>
                      <p className="text-xs text-gray-400">/{prod.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-0.5">
                    {prod.category?.parent && (
                      <Link
                        href={`/admin/products?category=${prod.category.parent.id}`}
                        className="text-[10px] text-gray-400 flex items-center gap-1 hover:text-primary transition-colors w-fit"
                      >
                        {prod.category.parent.name}
                        <ChevronRight className="w-2 h-2" />
                      </Link>
                    )}
                    <Link
                      href={`/admin/products?category=${prod.category?.id}`}
                      className="text-gray-600 font-medium hover:text-primary transition-colors w-fit"
                    >
                      {prod.category?.name || '-'}
                    </Link>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <PriceCell prod={prod} />
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggleFeatured(prod)}
                    disabled={isPending && togglingId === prod.id}
                    title={featured ? 'Bấm để bỏ nổi bật' : 'Bấm để đánh dấu nổi bật'}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors ${
                      featured
                        ? 'bg-green-100 text-green-600 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    {isPending && togglingId === prod.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Star className={`w-3 h-3 ${featured ? 'fill-current' : ''}`} />
                    )}
                    {featured ? 'Có' : 'Không'}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/products/${prod.id}/edit`}
                      className="p-2 text-gray-400 hover:text-primary transition-colors bg-white border border-gray-100 rounded-lg hover:bg-soft-gray"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <DeleteProductButton productId={prod.id} productName={prod.name} onDelete={deleteProduct} />
                  </div>
                </td>
              </tr>
            );
          })}
          {products.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                Chưa có sản phẩm nào. Hãy thêm sản phẩm mới.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
