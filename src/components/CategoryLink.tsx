"use client";

import Link from "next/link";
import { useLinkStatus } from "next/link";
import { Loader2 } from "lucide-react";

// Chỉ báo đang tải hiển thị ngay khi click (dựa trên useLinkStatus của Next.js).
// Luôn render với kích thước cố định, chỉ đổi opacity để tránh layout shift.
function PendingIndicator() {
  const { pending } = useLinkStatus();
  return (
    <Loader2
      aria-hidden
      className={`w-3.5 h-3.5 shrink-0 text-current animate-spin transition-opacity duration-150 ${
        pending ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}

interface CategoryLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

// Link danh mục cho trang cửa hàng: hiển thị spinner khi điều hướng đang chờ.
// prefetch={false} để đảm bảo trạng thái pending luôn xuất hiện.
export default function CategoryLink({ href, className = "", children }: CategoryLinkProps) {
  return (
    <Link
      href={href}
      prefetch={false}
      className={`flex items-center justify-between gap-2 ${className}`}
    >
      <span className="truncate">{children}</span>
      <PendingIndicator />
    </Link>
  );
}
