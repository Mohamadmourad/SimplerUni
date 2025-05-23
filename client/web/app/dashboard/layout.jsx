"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
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
  BookOpenCheck,
  LockIcon
} from "lucide-react";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [permissions, setPermissions] = useState([]); 
  const pathname = usePathname();
  const router = useRouter();

  const navigationItems = [
    { name: "Home", icon: Home, path: "/dashboard", permission: null }, 
    { name: "Manage Users", icon: Users, path: "/dashboard/usersManagement", permission: "usersManagementPage" },
    { name: "Analytics", icon: CalculatorIcon, path: "/dashboard/analytics", permission: "analyticsPage" },
    { name: "Majors", icon: FilePlus, path: "/dashboard/majors", permission: "majorsPage" },
    { name: "Campuses", icon: Building, path: "/dashboard/campuses", permission: "campusesPage" },
    { name: "Domains", icon: FileText, path: "/dashboard/domains", permission: "domainsPage" },
    { name: "Admins", icon: Users, path: "/dashboard/admins", permission: "adminEditPage" },
    { name: "Roles", icon: UserPlus, path: "/dashboard/roles", permission: "rolesPage" },
    { name: "Club Management", icon: ChartNoAxesGantt, path: "/dashboard/clubs", permission: "clubsPage" },
    { name: "News", icon: Newspaper, path: "/dashboard/news", permission: "newsPage" },
    { name: "Password", icon: LockIcon, path: "/dashboard/password", permission: null },
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
        const response = await axios.get(process.env.NEXT_PUBLIC_END_POINT + "/admin/getAdmin", {
          withCredentials: true, 
        });
        if (response.data.permissions.length > 0) {
          setPermissions(response.data.permissions || []);
        }
      } catch (error) {
        router.push("/auth/login");
        handleSignOut();
      }
    };

    fetchPermissions();
  }, []);

  useEffect(() => {}, [permissions]);

  const handleSignOut = async() => {
    await axios.post(process.env.NEXT_PUBLIC_END_POINT + "/university/logout", {},{withCredentials: true})
    router.push("/auth/login");
  };

  return (
    <>
      <style jsx global>{`
        
        .sidebar-nav::-webkit-scrollbar {
          width: 6px;
        }
        
        .sidebar-nav::-webkit-scrollbar-track {
          background: #1f2937;
        }
        
        .sidebar-nav::-webkit-scrollbar-thumb {
          background-color: #6D27D9;
          border-radius: 20px;
        }
        
        .sidebar-nav::-webkit-scrollbar-thumb:hover {
          background-color: #7E45E5;
        }
        
        /* For Firefox */
        .sidebar-nav {
          scrollbar-width: thin;
          scrollbar-color: #6D27D9 #1f2937;
        }
      `}</style>
      <div className="min-h-screen flex bg-gray-800 text-gray-300">
        <aside
          className={`fixed top-0 bottom-0 left-0 z-50 w-64 flex flex-col bg-gray-900 shadow-lg transition-transform duration-300 ease-in-out transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-64"
          } lg:translate-x-0`}
        >
          <div className="flex-shrink-0 flex items-center justify-between h-16 px-6 bg-gray-950">
            <div className="flex items-center">
              <Image 
                src="/icon.png" 
                width={90} 
                height={90} 
                alt="SimplerUni Logo" 
                className="text-purple-500"
              />
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
          <nav className="flex-1 overflow-y-auto py-6 px-4 sidebar-nav">
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
        
        <div className="flex-1 lg:ml-64 min-w-0 bg-gray-800">
          <main className="p-8 w-full">{children}</main>
        </div>
      </div>
    </>
  );
}