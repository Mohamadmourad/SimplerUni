"use client";
import { useRef, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddUniversity = () => {
  const universityNameRef = useRef(null);
  const universityEmailRef = useRef(null);
  const usernameRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = {
      universityName: universityNameRef.current.value,
      universityEmail: universityEmailRef.current.value,
      username: usernameRef.current.value,
    };

    try {
      await axios.post(process.env.NEXT_PUBLIC_END_POINT + "/university/createUniversity", formData, { withCredentials: true });
      toast.success("University added successfully!");
      universityNameRef.current.value = "";
      universityEmailRef.current.value = "";
      usernameRef.current.value = "";
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add university. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 p-8">
      <ToastContainer />
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Add University</h1>
        <form onSubmit={handleSubmit} className="bg-gray-900 rounded-lg p-6 shadow-xl">
          <div className="space-y-6">
            <div>
              <label htmlFor="universityName" className="block text-sm font-medium text-gray-300 mb-2">University Name</label>
              <input
                type="text"
                id="universityName"
                ref={universityNameRef}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter university name"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="universityEmail" className="block text-sm font-medium text-gray-300 mb-2">University Email</label>
              <input
                type="email"
                id="universityEmail"
                ref={universityEmailRef}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter university email"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">Username</label>
              <input
                type="text"
                id="username"
                ref={usernameRef}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter username"
                required
                disabled={loading}
              />
            </div>
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full px-4 py-3 text-white font-medium rounded-lg ${loading ? "bg-gray-600 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"}`}
              >
                {loading ? "Adding University..." : "Add University"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUniversity;
