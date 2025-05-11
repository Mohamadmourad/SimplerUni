"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";

export default function ForgotPasswordPage() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username) {
      setError("Please enter your username");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_END_POINT + "/university/sendChangePasswordLink",
        { username },
        { withCredentials: true }
      );
      
      if (response.status === 200 || response.status === 201) {
        setResetSent(true);
      } else {
        setError("Failed to send reset link");
      }
    } catch (error) {
      console.error("Error sending reset link:", error);
      
      if (error.response && error.response.status === 400) {
        setError("Username not found");
      } else {
        setError(error.response?.data?.message || "An error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  if (resetSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 relative shadow-xl">
          <div className="text-center mb-8">
            <Image 
              src="/icon.png" 
              width={48}
              height={48}
              alt="SimplerUni Logo"
              className="mx-auto mb-4"
            />
            <h2 className="text-3xl font-bold text-white">Reset Link Sent!</h2>
            <p className="text-gray-300 mt-4">
              We've sent a password reset link to the university email associated with the user: <strong>{username}</strong>
            </p>
          </div>
          <button
            onClick={() => router.push("/auth/login")}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 relative shadow-xl">
        <div className="text-center mb-8">
          <Image 
            src="/icon.png" 
            width={48}
            height={48}
            alt="SimplerUni Logo"
            className="mx-auto mb-4"
          />
          <h2 className="text-3xl font-bold text-white">SimplerUni Dashboard</h2>
          <p className="text-gray-300 mt-2">Reset your password to access your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6" method="POST">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Enter your username"
                className="pl-10 w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white bg-gray-700"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            {error && (
              <p className="mt-2 text-sm font-medium text-red-500">
                {error}
              </p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
          
          <div className="flex items-center justify-center mt-4">
            <Link href="/auth/login">
              <span className="flex items-center text-sm font-medium text-purple-500 hover:text-purple-400 cursor-pointer">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
