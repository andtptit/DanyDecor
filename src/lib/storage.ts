import { createClient } from '@supabase/supabase-js';
import prisma from './prisma';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Sử dụng Service Role để có quyền xóa mọi file
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

// Tất cả ảnh (sản phẩm, danh mục, banner) đều upload vào bucket này.
const IMAGE_BUCKET = 'product-images';

// Tắt tự động xoá ảnh khỏi Storage khi xoá/sửa bản ghi.
// Lý do: ảnh có thể được dùng lại ở nhiều nơi, xoá tự động dễ làm hỏng ảnh chỗ khác.
// Thay vào đó dọn thủ công qua trang Cài đặt (quét ảnh mồ côi).
// Đổi thành true nếu muốn bật lại hành vi xoá tự động.
const AUTO_DELETE_STORAGE = false;

/**
 * Trích xuất đường dẫn file từ URL Supabase Storage
 */
export function getStoragePathFromUrl(url: string) {
  if (!url || !url.includes('/storage/v1/object/public/')) return null;

  // URL format: https://[ref].supabase.co/storage/v1/object/public/[bucket]/[path]
  const parts = url.split('/storage/v1/object/public/');
  if (parts.length < 2) return null;

  const pathWithBucket = parts[1];
  const firstSlashIndex = pathWithBucket.indexOf('/');
  if (firstSlashIndex === -1) return null;

  const bucket = pathWithBucket.substring(0, firstSlashIndex);
  const path = pathWithBucket.substring(firstSlashIndex + 1);

  return { bucket, path };
}

/**
 * Xóa một hoặc nhiều ảnh khỏi Storage.
 * Hiện đã TẮT auto-delete (xem AUTO_DELETE_STORAGE) — hàm giữ nguyên chữ ký để
 * các nơi gọi không phải sửa; khi tắt thì đây là no-op an toàn.
 */
export async function deleteImagesFromStorage(urls: string | string[]) {
  if (!AUTO_DELETE_STORAGE) return; // Không xoá tự động — dọn thủ công ở Cài đặt

  const urlList = Array.isArray(urls) ? urls : [urls];
  for (const url of urlList) {
    const storageInfo = getStoragePathFromUrl(url);
    if (storageInfo) {
      await supabaseAdmin.storage.from(storageInfo.bucket).remove([storageInfo.path]);
    }
  }
}

/**
 * Liệt kê toàn bộ file trong một bucket (có phân trang để không sót khi > 100 file).
 */
async function listAllObjects(bucket: string) {
  const all: any[] = [];
  const pageSize = 100;
  let offset = 0;

  // Lặp cho tới khi hết file (Supabase list mặc định chỉ trả 100 file/lần)
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { data, error } = await supabaseAdmin.storage.from(bucket).list('', {
      limit: pageSize,
      offset,
      sortBy: { column: 'name', order: 'asc' },
    });
    if (error || !data || data.length === 0) break;
    all.push(...data);
    if (data.length < pageSize) break;
    offset += pageSize;
  }
  return all;
}

/**
 * Tổng dung lượng đã dùng của kho ảnh (bytes) + số lượng file.
 */
export async function getStorageUsage() {
  try {
    const files = await listAllObjects(IMAGE_BUCKET);
    let totalBytes = 0;
    let fileCount = 0;
    for (const f of files) {
      if (f.name === '.emptyFolderPlaceholder') continue;
      const size = Number(f?.metadata?.size ?? 0);
      totalBytes += Number.isNaN(size) ? 0 : size;
      fileCount++;
    }
    return { totalBytes, fileCount };
  } catch (error) {
    console.error('getStorageUsage error:', error);
    return { totalBytes: 0, fileCount: 0 };
  }
}

export interface LibraryImage {
  name: string;
  url: string;
  size: number;
  createdAt: string | null;
}

/**
 * Liệt kê toàn bộ ảnh trong kho để chọn dùng lại (mới nhất trước).
 */
export async function listLibraryImages(): Promise<LibraryImage[]> {
  try {
    const files = await listAllObjects(IMAGE_BUCKET);
    return files
      .filter(f => f.name !== '.emptyFolderPlaceholder')
      .map(f => ({
        name: f.name as string,
        url: `${supabaseUrl}/storage/v1/object/public/${IMAGE_BUCKET}/${f.name}`,
        size: Number(f?.metadata?.size ?? 0) || 0,
        createdAt: (f?.created_at as string) ?? null,
      }))
      .sort((a, b) => {
        // Mới nhất lên đầu; nếu thiếu created_at thì xếp theo tên giảm dần
        if (a.createdAt && b.createdAt) return a.createdAt < b.createdAt ? 1 : -1;
        return a.name < b.name ? 1 : -1;
      });
  } catch (error) {
    console.error('listLibraryImages error:', error);
    return [];
  }
}

export interface OrphanedFile {
  bucket: string;
  name: string;
  fullPath: string;
  size: number;
  url: string;
}

/**
 * Quét các ảnh mồ côi (có trong Storage nhưng không được bản ghi nào tham chiếu).
 */
export async function scanOrphanedImages(): Promise<OrphanedFile[]> {
  // 1. Lấy tất cả ảnh đang được tham chiếu trong Database
  const [products, categories, banners, settings] = await Promise.all([
    prisma.product.findMany({ select: { images: true } }),
    prisma.category.findMany({ select: { image: true } }),
    prisma.banner.findMany({ select: { image: true } }),
    prisma.setting.findMany({ select: { value: true } }),
  ]);

  const dbImages = new Set<string>();
  products.forEach(p => p.images.forEach(img => dbImages.add(img)));
  categories.forEach(c => { if (c.image) dbImages.add(c.image); });
  banners.forEach(b => { if (b.image) dbImages.add(b.image); });
  settings.forEach(s => {
    if (s.value && s.value.startsWith('http') && s.value.includes('supabase')) {
      dbImages.add(s.value);
    }
  });

  const dbPaths = new Set<string>();
  dbImages.forEach(url => {
    const info = getStoragePathFromUrl(url);
    if (info) dbPaths.add(`${info.bucket}/${info.path}`);
  });

  // 2. Liệt kê file thực tế trên Storage và tìm file không được tham chiếu
  const files = await listAllObjects(IMAGE_BUCKET);
  const orphaned: OrphanedFile[] = [];

  for (const file of files) {
    if (file.name === '.emptyFolderPlaceholder') continue;
    const fullPath = `${IMAGE_BUCKET}/${file.name}`;
    if (!dbPaths.has(fullPath)) {
      orphaned.push({
        bucket: IMAGE_BUCKET,
        name: file.name,
        fullPath,
        size: Number(file?.metadata?.size ?? 0) || 0,
        url: `${supabaseUrl}/storage/v1/object/public/${IMAGE_BUCKET}/${file.name}`,
      });
    }
  }

  return orphaned;
}

/**
 * Thực hiện xóa danh sách file đã chọn (dùng cho dọn thủ công).
 */
export async function deleteSelectedFiles(files: { bucket: string; name: string }[]) {
  let deletedCount = 0;
  for (const file of files) {
    const { error } = await supabaseAdmin.storage.from(file.bucket).remove([file.name]);
    if (!error) deletedCount++;
  }
  return deletedCount;
}
