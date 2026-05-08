import { Pool } from 'pg';
import 'dotenv/config';

async function updateDatabase() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('❌ Không tìm thấy DATABASE_URL trong file .env');
    return;
  }

  const pool = new Pool({ connectionString });

  try {
    console.log('🚀 Đang cập nhật database...');

    // 1. Thêm cột parentId vào bảng Category (nếu chưa có)
    await pool.query(`
      ALTER TABLE "Category" 
      ADD COLUMN IF NOT EXISTS "parentId" TEXT;
    `);
    console.log('✅ Đã thêm cột parentId vào bảng Category');

    // 2. Thêm khóa ngoại (Foreign Key) để đảm bảo tính toàn vẹn
    // Chúng ta dùng TRY CATCH để tránh lỗi nếu ràng buộc đã tồn tại
    try {
      await pool.query(`
        ALTER TABLE "Category" 
        ADD CONSTRAINT "Category_parentId_fkey" 
        FOREIGN KEY ("parentId") REFERENCES "Category"("id") 
        ON DELETE SET NULL ON UPDATE CASCADE;
      `);
      console.log('✅ Đã thêm ràng buộc khóa ngoại (Foreign Key)');
    } catch (e) {
      console.log('ℹ️ Ràng buộc khóa ngoại đã tồn tại hoặc không cần tạo lại.');
    }

    console.log('🎉 Cập nhật database thành công!');
  } catch (err) {
    console.error('❌ Lỗi khi cập nhật database:', err);
  } finally {
    await pool.end();
  }
}

updateDatabase();
