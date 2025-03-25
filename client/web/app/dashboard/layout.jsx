"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalculatorIcon,
  Home,
  Users,
  FilePlus,
  Upload,
  Menu,
  X,
  FileText,
  LogOut,
  UserPlus
} from "lucide-react";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default closed on mobile
  const pathname = usePathname();
  const router = useRouter();

  const navigation = [
    { name: "Home", icon: Home, path: "/dashboard" },
    { name: "Analytics", icon: CalculatorIcon, path: "/dashboard/analytics" },
    { name: "Majors", icon: FilePlus, path: "/dashboard/majors" },
    { name: "Domains", icon: FileText, path: "/dashboard/domains" },
    { name: "Admins", icon: Users, path: "/dashboard/admins" },
    { name: "Roles", icon: UserPlus, path: "/dashboard/admins" },
  ];

  const handleSignOut = () => {
    console.log("Signing out...");
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-800 text-gray-300">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-gray-900 shadow-lg transition-transform duration-300 ease-in-out transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-64"
        } lg:translate-x-0 lg:static`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 bg-gray-950">
          <div className="flex items-center">
            <CalculatorIcon className="w-8 h-8 text-purple-500" />
            <span className="ml-2 text-white text-xl font-bold">SimplerUni</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="mt-6 px-4 flex-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center px-4 py-3 mb-2 rounded-lg transition ${
                pathname === item.path
                  ? "bg-purple-600 text-white shadow-md"
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
              onClick={() => setIsSidebarOpen(false)} // Close on mobile tap
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Sign Out Button (Bottom Left) */}
        <div className="p-4">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center px-4 py-3 rounded-lg transition text-gray-400 hover:bg-red-600 hover:text-white"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 bg-gray-900 text-gray-400 rounded-lg lg:hidden"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Main Content */}
      <div className="flex-1 min-w-0 bg-gray-800">
        <main className="p-8 w-full">{children}</main>
      </div>
    </div>
  );
}
