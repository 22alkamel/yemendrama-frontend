"use client";

import { useState, ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  RiDashboardFill,
  RiUser3Fill,
  RiMovie2Fill,
  RiLogoutBoxRFill,
} from "react-icons/ri";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // قائمة Sidebar
  const menu = [
    {
      key: "dashboard",
      label: "لوحة التحكم",
      icon: <RiDashboardFill />,
      href: "/admin",
    },
    {
      key: "users",
      label: "المستخدمين",
      icon: <RiUser3Fill />,
      href: "/admin/users",
    },
    {
      key: "contents",
      label: "المحتوى",
      icon: <RiMovie2Fill />,
      href: "/admin/contents",
    },
    {
      key: "categories",
      label: "تصنيفات المحتوى",
      icon: <RiMovie2Fill />,
      href: "/admin/categories",
    },
    {
      key: "news",
      label: "الاخبار",
      icon: <RiMovie2Fill />,
      href: "/admin/news",
    },
    {
      key: "categorie_news",
      label: "تصنيفات الاخبار",
      icon: <RiMovie2Fill />,
      href: "/admin/newscategories",
    },
     // ✅ هنا أضفنا التصنيفات
      {
      key: "social-stats",
      label: " احصائيات السوشيال ميديا",
      icon: <RiMovie2Fill />,
      href: "/admin/social-stats",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <p className="text-xl animate-pulse">جارٍ تحميل البيانات...</p>
      </div>
    );
  }

  const roles = user?.roles?.map((r: any) => r.name) || [];
  if (!roles.includes("admin")) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-red-500">
        <p className="text-xl">🚫 غير مصرح بالدخول</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-black text-white" dir="rtl">
      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 z-20 w-64 min-h-screen bg-gray-900 shadow-lg transform transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-red-600">لوحه التحكم</h2>
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setSidebarOpen(false)}
          >
            ×
          </button>
        </div>

        <ul className="mt-6 space-y-2">
          {menu.map((item) => (
            <li key={item.key}>
              <button
                onClick={() => router.push(item.href)}
                className="flex items-center w-full px-4 py-3 text-right gap-3 rounded hover:bg-red-600 transition"
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-3 gap-3 rounded hover:bg-red-600 transition mt-6 text-red-400 hover:text-white justify-start"
            >
              <RiLogoutBoxRFill />
              تسجيل الخروج
            </button>
          </li>
        </ul>
      </div>

      {/* Overlay للموبايل */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 mr-0 md:mr-64 p-6 transition-all duration-300">
        {/* Mobile menu button */}
        <button
          className="md:hidden mb-4 px-3 py-2 bg-red-600 rounded text-white"
          onClick={() => setSidebarOpen(true)}
        >
          ☰ القائمة
        </button>

        {children}
      </div>
    </div>
  );
}
