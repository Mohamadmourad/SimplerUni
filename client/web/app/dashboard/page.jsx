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
        const response = await axios.get(NEXT_PUBLIC_END_POINT + "/admin/getAdmin", { withCredentials: true });
        console.log("API Response:", response.data);
        setAdmin(response.data);
      } catch (err) {
        setError("Failed to load admin details.");
      }
    };

    fetchAdmin();
  }, []);

  return (
    <div className="w-full max-w-3xl bg-gray-700 shadow-md rounded-lg p-8 text-center">
      <School className="w-16 h-16 text-purple-500 mx-auto mb-4" />
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : admin ? (
        <>
          <h1 className="text-4xl font-bold text-white">Welcome {admin.firstname} {admin.lastname}!</h1>
          <p className="text-lg text-gray-300 mt-3">
            You are logged in as <span className="font-semibold text-purple-400">{admin.username}</span>.
          </p>
          
        </>
      ) : (
        <p className="text-gray-300">Loading...</p>
      )}
    </div>
  );
}