"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import {
  CalculatorIcon,
  Home,
  Users,
  FilePlus,
  FileText,
  LogOut,
  UserPlus,
  Menu,
  X,
  CirclePlus,
  ChartArea,
  ChartNoAxesGantt,
  Building,
  Newspaper,
  BookOpenCheck
} from "lucide-react";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [permissions, setPermissions] = useState([]); 
  const pathname = usePathname();
  const router = useRouter();

  const navigationItems = [
    { name: "Home", icon: Home, path: "/dashboard", permission: null }, 
    { name: "Analytics", icon: CalculatorIcon, path: "/dashboard/analytics", permission: "analyticsPage" },
    { name: "Majors", icon: FilePlus, path: "/dashboard/majors", permission: "majorsPage" },
    { name: "Campuses", icon: Building, path: "/dashboard/campuses", permission: "campusesPage" },
    { name: "Domains", icon: FileText, path: "/dashboard/domains", permission: "domainsPage" },
    { name: "Admins", icon: Users, path: "/dashboard/admins", permission: "adminEditPage" },
    { name: "Roles", icon: UserPlus, path: "/dashboard/roles", permission: "rolesPage" },
    { name: "Club Management", icon: ChartNoAxesGantt, path: "/dashboard/clubs", permission: "clubsPage" },
    { name: "News", icon: Newspaper, path: "/dashboard/news", permission: "newsPage" },
  ];
  const superAdminnavigationItems = [
    { name: "Home", icon: Home, path: "/dashboard", permission: null }, 
    { name: "Add University", icon: CirclePlus, path: "/dashboard/addUniversity"},
    { name: "University requests", icon: BookOpenCheck, path: "/dashboard/requestAccess"},
    { name: "Statistics", icon: ChartArea, path: "/dashboard/statictics"},
  ];

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/admin/getAdmin", {
          withCredentials: true, 
        });
        if (response.data.permissions.length > 0) {
          setPermissions(response.data.permissions || []);
        }
      } catch (error) {
        router.push("/auth/login"); 
      }
    };

    fetchPermissions();
  }, []);

  useEffect(() => {}, [permissions]);

  const handleSignOut = async() => {
    await axios.post("http://localhost:5000/university/logout", {},{withCredentials: true})
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-800 text-gray-300">
      {/* Fixed sidebar that doesn't move when scrolling */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 flex flex-col bg-gray-900 shadow-lg transition-transform duration-300 ease-in-out transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-64"
        } lg:translate-x-0`}
      >
        {/* Header - fixed height */}
        <div className="flex-shrink-0 flex items-center justify-between h-16 px-6 bg-gray-950">
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
        
        {/* Navigation - scrollable if needed */}
        <nav className="flex-1 overflow-y-auto py-6 px-4">
          {permissions.includes("superAdmin") 
            ? superAdminnavigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`flex items-center px-4 py-3 mb-2 rounded-lg transition ${
                    pathname === item.path
                      ? "bg-purple-600 text-white shadow-md"
                      : "text-gray-400 hover:bg-gray-700 hover:text-white"
                  }`}
                  onClick={() => setIsSidebarOpen(false)} 
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              ))
            : navigationItems.map((item) =>
                (!item.permission || permissions.includes(item.permission) || permissions.includes("universityDashboard")) && (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`flex items-center px-4 py-3 mb-2 rounded-lg transition ${
                      pathname === item.path
                        ? "bg-purple-600 text-white shadow-md"
                        : "text-gray-400 hover:bg-gray-700 hover:text-white"
                    }`}
                    onClick={() => setIsSidebarOpen(false)} 
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                )
              )
          }
        </nav>
        
        {/* Footer - fixed at bottom with flex-shrink-0 */}
        <div className="flex-shrink-0 p-4 border-t border-gray-800">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center px-4 py-3 rounded-lg transition text-gray-400 hover:bg-red-600 hover:text-white"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </aside>
      
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 bg-gray-900 text-gray-400 rounded-lg lg:hidden"
      >
        <Menu className="w-6 h-6" />
      </button>
      
      {/* Main content area with left padding to accommodate the fixed sidebar */}
      <div className="flex-1 lg:ml-64 min-w-0 bg-gray-800">
        <main className="p-8 w-full">{children}</main>
      </div>
    </div>
  );
}