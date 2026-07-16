import { NextResponse } from 'next/server'
import { createClient as createServerAuthClient } from '@/utils/supabase/server'
import { listLibraryImages } from '@/lib/storage'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Trả về danh sách ảnh trong kho để chọn dùng lại. Chỉ admin đã đăng nhập.
export async function GET() {
  const authClient = await createServerAuthClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const images = await listLibraryImages()
  return NextResponse.json({ images })
}
