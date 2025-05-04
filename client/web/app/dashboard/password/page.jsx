"use client";
import { useState } from "react";
import axios from "axios";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentPassword.trim() || !newPassword.trim()) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        process.env.NEXT_PUBLIC_END_POINT + "/admin/changePassword",
        {
          currentPassword,
          newPassword,
        },
        { withCredentials: true }
      );
      setSuccess("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      console.error("Error changing password:", err);
      setError(err.response?.data?.message || "Failed to change password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Change Password</h1>
        {error && <p className="text-red-500 mb-4 p-3 bg-red-900 bg-opacity-30 rounded">{error}</p>}
        {success && <p className="text-green-500 mb-4 p-3 bg-green-900 bg-opacity-30 rounded">{success}</p>}
        <form onSubmit={handleChangePassword} className="space-y-4">
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={loading}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={loading}
          />
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded ${
              loading ? "bg-gray-600" : "bg-purple-600 hover:bg-purple-700"
            } text-white font-bold transition-colors`}
            disabled={loading}
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
