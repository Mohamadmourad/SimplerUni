"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Lock, CheckCircle } from "lucide-react";
import Image from "next/image";
import axios from "axios";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const params = useParams();
  
  const token = params.token;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password) {
      setError("Please enter a new password");
      return;
    }
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_END_POINT + "/university/changeUserPassword",
        { 
          token: token,
          newPassword: password 
        },
        { withCredentials: true }
      );
      
      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
      } else {
        setError("Failed to reset password");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      
      if (error.response && error.response.status === 400) {
        setError("Invalid or expired token");
      } else {
        setError(error.response?.data?.message || "An error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 relative shadow-xl">
          <div className="text-center mb-8">
            <Image 
              src="/icon.png" 
              width={90}
              height={90}
              alt="SimplerUni Logo"
              className="mx-auto mb-4"
            />
            <h2 className="text-3xl font-bold text-white">Password Reset Successful!</h2>
            <div className="flex justify-center my-6">
              <CheckCircle size={64} className="text-green-500" />
            </div>
            <p className="text-gray-300 mt-4">
              Your password has been updated successfully.
            </p>
          </div>
          <button
            onClick={() => router.push("/auth/login")}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Go to Login
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
            width={90}
            height={90}
            alt="SimplerUni Logo"
            className="mx-auto mb-4"
          />
          <h2 className="text-3xl font-bold text-white">Reset Your Password</h2>
          <p className="text-gray-300 mt-2">Create a new password for your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6" method="POST">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                placeholder="Enter new password"
                className="pl-10 w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white bg-gray-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                placeholder="Confirm new password"
                className="pl-10 w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white bg-gray-700"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
