import prisma from './prisma'

/**
 * Chuyển tên tiếng Việt thành slug an toàn (bỏ dấu, đ -> d, ký tự lạ -> '-').
 */
export function slugify(name: string): string {
  return (name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

/**
 * Sinh slug duy nhất cho Product. Nếu trùng sẽ tự thêm hậu tố -1, -2, ...
 * excludeId: id của bản ghi đang cập nhật (để không tự coi mình là trùng).
 */
export async function generateUniqueProductSlug(name: string, excludeId?: string): Promise<string> {
  const base = slugify(name) || 'san-pham'
  let slug = base
  let i = 1
  // Giới hạn vòng lặp để tránh treo trong trường hợp bất thường
  while (i < 1000) {
    const existing = await prisma.product.findUnique({ where: { slug }, select: { id: true } })
    if (!existing || existing.id === excludeId) return slug
    slug = `${base}-${i++}`
  }
  return `${base}-${Date.now()}`
}

/**
 * Sinh slug duy nhất cho Category.
 */
export async function generateUniqueCategorySlug(name: string, excludeId?: string): Promise<string> {
  const base = slugify(name) || 'danh-muc'
  let slug = base
  let i = 1
  while (i < 1000) {
    const existing = await prisma.category.findUnique({ where: { slug }, select: { id: true } })
    if (!existing || existing.id === excludeId) return slug
    slug = `${base}-${i++}`
  }
  return `${base}-${Date.now()}`
}
