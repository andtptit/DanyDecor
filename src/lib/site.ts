/**
 * Cấu hình dùng chung cho SEO (metadataBase, sitemap, Open Graph...).
 * Đặt NEXT_PUBLIC_SITE_URL trong .env / Vercel để trỏ đúng domain thật.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
  'https://tranhtrangtri.com.vn'
).replace(/\/$/, '')

export const SITE_NAME = process.env.NEXT_PUBLIC_SHOP_NAME || 'DanyDecor'

export const SITE_DESCRIPTION =
  'Tranh treo tường nghệ thuật cao cấp, tranh canvas, tráng gương. Tư vấn và đặt tranh nhanh qua Zalo/Fanpage.'
