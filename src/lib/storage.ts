import { createClient } from '@supabase/supabase-js';
import prisma from './prisma';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Sử dụng Service Role để có quyền xóa mọi file
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

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
 * Xóa một hoặc nhiều ảnh khỏi Storage
 */
export async function deleteImagesFromStorage(urls: string | string[]) {
  const urlList = Array.isArray(urls) ? urls : [urls];
  
  for (const url of urlList) {
    const storageInfo = getStoragePathFromUrl(url);
    if (storageInfo) {
      console.log(`Deleting from storage: ${storageInfo.bucket}/${storageInfo.path}`);
      await supabaseAdmin.storage
        .from(storageInfo.bucket)
        .remove([storageInfo.path]);
    }
  }
}

/**
 * Quét các ảnh mồ côi (không có trong DB)
 */
export async function scanOrphanedImages() {
  // 1. Lấy tất cả ảnh đang có trong Database
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

  // 2. Liệt kê file trên Supabase
  const buckets = ['products', 'banners', 'categories', 'uploads'];
  const orphanedFiles: { bucket: string; name: string; fullPath: string }[] = [];

  for (const bucketName of buckets) {
    const { data: files, error } = await supabaseAdmin.storage.from(bucketName).list();
    if (error || !files) continue;

    for (const file of files) {
      if (file.name === '.emptyFolderPlaceholder') continue;
      const fullPath = `${bucketName}/${file.name}`;
      if (!dbPaths.has(fullPath)) {
        orphanedFiles.push({ bucket: bucketName, name: file.name, fullPath });
      }
    }
  }

  return orphanedFiles;
}

/**
 * Thực hiện xóa danh sách file đã chọn
 */
export async function deleteSelectedFiles(files: { bucket: string; name: string }[]) {
  let deletedCount = 0;
  for (const file of files) {
    const { error } = await supabaseAdmin.storage.from(file.bucket).remove([file.name]);
    if (!error) deletedCount++;
  }
  return deletedCount;
}
