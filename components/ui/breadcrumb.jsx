import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

// Breadcrumb konteyner bileşeni
export function Breadcrumb({ className, children, ...props }) {
  return (
    <nav
      className={`flex ${className || ""}`}
      aria-label="Breadcrumb"
      {...props}
    >
      {children}
    </nav>
  );
}

// Breadcrumb liste bileşeni
export function BreadcrumbList({ className, children, ...props }) {
  return (
    <ol className={`inline-flex items-center space-x-1 md:space-x-2 ${className || ""}`} {...props}>
      {children}
    </ol>
  );
}

// Breadcrumb öğesi bileşeni
export function BreadcrumbItem({ className, children, ...props }) {
  return (
    <li className={`inline-flex items-center ${className || ""}`} {...props}>
      {children}
    </li>
  );
}

// Breadcrumb bağlantı bileşeni
export function BreadcrumbLink({ className, href, children, asChild, ...props }) {
  if (asChild) {
    return children;
  }

  if (href) {
    return (
      <Link
        href={href}
        className={`text-sm text-gray-600 hover:text-blue-600 ${className || ""}`}
        {...props}
      >
        {children}
      </Link>
    );
  }

  return (
    <span
      className={`text-sm text-gray-600 hover:text-blue-600 ${className || ""}`}
      {...props}
    >
      {children}
    </span>
  );
}

// Breadcrumb sayfa bileşeni (aktif sayfa için)
export function BreadcrumbPage({ className, children, ...props }) {
  return (
    <span
      className={`text-sm font-medium text-gray-800 ${className || ""}`}
      aria-current="page"
      {...props}
    >
      {children}
    </span>
  );
}

// Breadcrumb ayırıcı bileşeni
export function BreadcrumbSeparator({ className, children, ...props }) {
  return (
    <span className={`mx-1.5 text-gray-400 ${className || ""}`} {...props}>
      {children || <ChevronRight size={16} />}
    </span>
  );
} 