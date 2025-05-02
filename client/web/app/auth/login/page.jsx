"use client";

import { useEffect, useState } from "react";
import { School, Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isClickable, setisClickable] = useState(true);
  const router = useRouter();

  useEffect(()=>{
    const check = async()=>{
      try{
        await axios.get(process.env.NEXT_PUBLIC_END_POINT + "/university/checkLogin",{ withCredentials: true });
        router.push("/dashboard")
      }
      catch(e){

      }
    }
    check();
  },[])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
    setisClickable(false);
    setError("");
    await axios.post(process.env.NEXT_PUBLIC_END_POINT + "/university/login",{
      username,
      password
    },{ withCredentials: true });
    setisClickable(true);
    router.push('/dashboard');
    }
    catch(e){
      setError(e);
      setisClickable(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 relative shadow-xl">
        <div className="text-center mb-8">
          <School className="w-12 h-12 text-purple-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white">SimplerUni Dashboard</h2>
          <p className="text-gray-300 mt-2">Sign in to manage your university portal</p>
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
                placeholder="admin"
                className="pl-10 w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white bg-gray-700"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <label className="text-sm font-medium text-red-600 mb-2">
              {error}
            </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                placeholder="••••••••"
                className="pl-10 w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white bg-gray-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
            </div>
            <button className="text-sm font-medium text-purple-500 hover:text-purple-400">
              Forgot password?
            </button>
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500" disabled={!isClickable}>
            {isClickable ? 'Login' : 'Logging in...'}
          </button>
        </form>
        <div className="mt-6 text-center border-t border-gray-700 pt-6">
          <p className="text-gray-400 text-sm mb-2">Don't have an admin account?</p>
          <Link href="/auth/request-access">
            <button className="inline-flex items-center px-6 py-3 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors text-sm font-medium">
              Request Access
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
