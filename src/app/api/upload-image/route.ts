import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import sharp from 'sharp'
import { createClient as createServerAuthClient } from '@/utils/supabase/server'

// Chạy ở Node runtime để dùng được sharp
export const runtime = 'nodejs'

// Giới hạn kích thước & chất lượng ảnh sau khi nén
const MAX_DIMENSION = 1600
const WEBP_QUALITY = 80

export async function POST(req: NextRequest) {
  // Chỉ cho phép admin đã đăng nhập upload (endpoint dùng Service Role Key)
  const authClient = await createServerAuthClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables')
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 })
    }

    // Nén + resize ngay lúc upload để tiết kiệm Storage và tăng tốc tối ưu ảnh:
    // tự xoay theo EXIF, thu nhỏ cạnh dài về tối đa MAX_DIMENSION (không phóng to),
    // rồi chuyển sang WebP chất lượng WEBP_QUALITY.
    const inputBuffer = Buffer.from(await file.arrayBuffer())
    let outputBuffer: Buffer
    try {
      outputBuffer = await sharp(inputBuffer)
        .rotate()
        .resize({
          width: MAX_DIMENSION,
          height: MAX_DIMENSION,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: WEBP_QUALITY })
        .toBuffer()
    } catch (e) {
      console.error('Image processing error:', e)
      return NextResponse.json({ error: 'Không xử lý được ảnh (định dạng không hợp lệ?)' }, { status: 400 })
    }

    const fileName = `${uuidv4()}.webp`

    const { error } = await supabase.storage
      .from('product-images')
      .upload(fileName, outputBuffer, {
        contentType: 'image/webp',
        upsert: false,
      })

    if (error) {
      console.error('Supabase upload error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName)

    return NextResponse.json({ url: publicUrl })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
