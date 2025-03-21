"use client";

import { School } from "lucide-react";

export default function DashboardHome() {
  return (
    <div className="w-full max-w-3xl bg-gray-700 shadow-md rounded-lg p-8 text-center">
      <School className="w-16 h-16 text-purple-500 mx-auto mb-4" />
      <h1 className="text-4xl font-bold text-white">Welcome to SimplerUni Dashboard</h1>
      <p className="text-lg text-gray-300 mt-3">
        Manage university data, courses, and user interactions with ease. Use the sidebar to navigate through the available features.
      </p>
    </div>
  );
}
