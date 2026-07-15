import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

/**
 * Đảm bảo request đến từ admin đã đăng nhập.
 * Dùng ở đầu mỗi Server Action trong khu vực /admin để không phụ thuộc
 * hoàn toàn vào middleware (defense in depth). Redirect về trang login nếu chưa đăng nhập.
 */
export async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/admin/login')
  }
  return user
}
