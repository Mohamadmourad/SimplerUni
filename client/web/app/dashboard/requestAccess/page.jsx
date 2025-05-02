"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle, XCircle, UserCheck, UserX } from 'lucide-react';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UniversityAccessPage = () => {
  const [pendingUniversities, setPendingUniversities] = useState([]);
  const [acceptedUniversities, setAcceptedUniversities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      const [pendingRes, acceptedRes] = await Promise.all([
        axios.get(process.env.NEXT_PUBLIC_END_POINT + "/university/getPendingUniversityAcessList", { withCredentials: true }),
        axios.get(process.env.NEXT_PUBLIC_END_POINT + "/university/getAcceptedUniversityAcessList", { withCredentials: true })
      ]);

      setPendingUniversities(pendingRes.data);
      setAcceptedUniversities(acceptedRes.data);
    } catch (err) {
      toast.error("Failed to fetch universities");
    }
  };

  const handleAccept = async (universityId) => {
    setLoading(true);
    try {
      await axios.post(
        process.env.NEXT_PUBLIC_END_POINT + "/university/universityRequestAccept",
        {requestId: universityId},
        { withCredentials: true }
      );

      toast.success("University accepted successfully!");
      fetchUniversities();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to accept university");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (universityId) => {
    setLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_END_POINT}/university/universityRequestReject`,
        {requestId: universityId},
        { withCredentials: true }
      );

      toast.success("University deleted successfully!");
      fetchUniversities();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete university");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">University Access Management</h1>
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <UserX className="w-6 h-6 text-yellow-500 mr-2" />
            <h2 className="text-2xl font-bold text-white">Pending Universities</h2>
          </div>

          <div className="grid gap-6">
            {pendingUniversities.length > 0 ? (
              pendingUniversities.map((university) => (
                <div key={university.requestid} className="bg-gray-900 rounded-lg p-6 shadow-lg border border-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{university.universityName}</h3>
                      <p className="text-gray-400 mb-1">Email: {university.email}</p>
                      <p className="text-gray-400">Username: {university.name}</p>
                      <p className="text-gray-400">additionalInfo: {university.additional_information}</p>
                      <p className="text-gray-400 text-sm mt-2">
                        Requested: {new Date(university.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleAccept(university.requestid)}
                        disabled={loading}
                        className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Accept
                      </button>
                      <button
                        onClick={() => handleDelete(university.requestid)}
                        disabled={loading}
                        className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <XCircle className="w-5 h-5 mr-2" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-8">No pending universities</p>
            )}
          </div>
        </div>
        <div>
          <div className="flex items-center mb-6">
            <UserCheck className="w-6 h-6 text-green-500 mr-2" />
            <h2 className="text-2xl font-bold text-white">Accepted Universities</h2>
          </div>

          <div className="grid gap-6">
            {acceptedUniversities.length > 0 ? (
              acceptedUniversities.map((university) => (
                <div key={university.requestid} className="bg-gray-900 rounded-lg p-6 shadow-lg border border-gray-700">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{university.universityName}</h3>
                    <p className="text-gray-400 mb-1">Email: {university.email}</p>
                    <p className="text-gray-400">Username: {university.name}</p>
                    <div className="flex justify-between items-center mt-4">
                      <p className="text-gray-400 text-sm">
                        request from: {new Date(university.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-8">No accepted universities</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityAccessPage;
