"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  School,
  Home,
  Users,
  MessageCircle,
  Calendar,
  Settings,
  Menu as MenuIcon,
  X,
  BookOpen,
  BarChart2,
} from "lucide-react";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  const navigation = [
    { name: "Home", icon: Home, path: "/dashboard" },
    { name: "University Data", icon: School, path: "/dashboard/university-data" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-800 text-gray-300">
      {/* Sidebar */}
      <aside
        className={`w-64 bg-gray-900 shadow-lg transition-transform duration-200 ease-in-out lg:static lg:inset-0 ${
          isSidebarOpen ? "block" : "hidden"
        } lg:block`}
      >
        <div className="flex items-center justify-between h-16 px-6 bg-gray-950">
          <div className="flex items-center">
            <School className="w-8 h-8 text-purple-500" />
            <span className="ml-2 text-white text-xl font-bold">SimplerUni</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="mt-6 px-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center px-4 py-3 mb-2 rounded-lg transition ${
                pathname === item.path
                  ? "bg-purple-600 text-white shadow-md"
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0 bg-gray-800">
        <main className="p-8 w-full max-w-4xl">{children}</main>
      </div>
    </div>
  );
}
