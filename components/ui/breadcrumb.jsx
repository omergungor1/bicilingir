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
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        {children}
      </ol>
    </nav>
  );
}

// Breadcrumb öğesi bileşeni
export function BreadcrumbItem({ className, isCurrentPage, children, ...props }) {
  return (
    <li className={`inline-flex items-center ${className || ""}`} {...props}>
      {!isCurrentPage && (
        <span className="mx-1.5 text-gray-400">
          <ChevronRight size={16} />
        </span>
      )}
      {children}
    </li>
  );
}

// Breadcrumb bağlantı bileşeni
export function BreadcrumbLink({ className, href, children, ...props }) {
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
      className={`text-sm font-medium text-gray-800 ${className || ""}`}
      aria-current="page"
      {...props}
    >
      {children}
    </span>
  );
} 