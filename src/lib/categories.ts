import { unstable_cache } from "next/cache"
import prisma from "./prisma"

// Cây danh mục cấp cha + con cho sidebar shop / menu.
// Cache xuyên request (danh mục ít thay đổi) để không đánh DB mỗi lượt truy cập.
// Làm mới sau 120s; admin có thể dùng revalidateTag('categories', 'max') để xoá cache ngay.
export const getShopCategoryTree = unstable_cache(
  async () => {
    try {
      return await prisma.category.findMany({
        include: { children: { orderBy: { name: "asc" } } },
        where: { parentId: null },
        orderBy: { name: "asc" },
      })
    } catch {
      return []
    }
  },
  ['shop-category-tree'],
  { revalidate: 120, tags: ['categories'] }
)
