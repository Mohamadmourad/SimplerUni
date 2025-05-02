"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { School } from "lucide-react";

export default function DashboardHome() {
  const [admin, setAdmin] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await axios.get(process.env.NEXT_PUBLIC_END_POINT + "/admin/getAdmin", { withCredentials: true });
        console.log("API Response:", response.data);
        setAdmin(response.data);
      } catch (err) {
        setError("Failed to load admin details.");
      }
    };

    fetchAdmin();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[80vh] w-full">
      <div className="w-full max-w-3xl bg-gradient-to-br from-gray-800 to-gray-700 shadow-xl rounded-lg p-8 text-center transform transition-all duration-500 hover:scale-[1.01] border border-purple-500/20">
        <School className="w-20 h-20 text-purple-400 mx-auto mb-6 animate-bounce-slow" />
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : admin ? (
          <>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text mb-4 animate-fade-in">
              Welcome {admin.firstname} {admin.lastname}!
            </h1>
            <p className="text-xl text-gray-300 mt-4">
              You are logged in as <span className="font-semibold text-purple-300">{admin.username}</span>.
            </p>
            <div className="mt-8 h-1 w-32 bg-gradient-to-r from-purple-500 to-pink-400 mx-auto rounded-full opacity-70"></div>
          </>
        ) : (
          <p className="text-gray-300 text-xl">Loading...</p>
        )}
      </div>
    </div>
  );
}