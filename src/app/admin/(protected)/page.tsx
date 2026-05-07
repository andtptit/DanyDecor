import { redirect } from "next/navigation";

export default function AdminPage() {
  // Chuyển hướng tạm thời đến trang quản lý sản phẩm
  redirect("/admin/products");
}
