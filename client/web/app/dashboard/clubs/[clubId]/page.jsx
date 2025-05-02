"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ArrowLeft, School, MapPin, Calendar, MessageSquare } from "lucide-react";
import ClubMemberManagement from "@/app/components/ClubMemberManagement";
import { checkAuth } from "@/app/functions/checkAuth";

export default function ClubDetails({ params }) {
  const router = useRouter();
  const { clubId } = params;
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const result = await checkAuth("clubsManagementPage");
        if (result === false) router.push("/");
      } catch (e) {
        router.push("/");
      }
    };
    verify();
    fetchClubDetails();
  }, [clubId, router]);

  const fetchClubDetails = async () => {
    if (!clubId) return;
    
    setLoading(true);
    try {
      // This is a placeholder. The API endpoint for fetching club details would need to be created
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_END_POINT}/clubs/getClubDetails/${clubId}`,
        { withCredentials: true }
      );
      setClub(response.data);
    } catch (err) {
      console.error("Error fetching club details:", err);
      setError("Failed to load club details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => router.push("/dashboard/clubs")}
            className="flex items-center text-gray-400 hover:text-white mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Clubs
          </button>
          <div className="bg-red-900/50 text-red-200 p-6 rounded-lg text-center">
            <p>{error}</p>
            <button 
              onClick={fetchClubDetails}
              className="mt-4 px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 text-white text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen bg-gray-900 px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => router.push("/dashboard/clubs")}
            className="flex items-center text-gray-400 hover:text-white mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Clubs
          </button>
          <div className="text-center text-gray-400 py-12">
            <p>Club not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => router.push("/dashboard/clubs")}
          className="flex items-center text-gray-400 hover:text-white mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Clubs
        </button>

        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-10">
            <div className="flex items-center mb-2">
              <School className="text-white h-10 w-10 mr-3" />
              <h1 className="text-3xl font-bold text-white">{club.name}</h1>
            </div>
            <p className="text-purple-100 text-lg">{club.description}</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <MapPin className="h-5 w-5 text-purple-400 mr-2" />
                  <h3 className="text-md font-medium text-white">Location</h3>
                </div>
                <p className="text-gray-300">{club.room || "No location specified"}</p>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Calendar className="h-5 w-5 text-purple-400 mr-2" />
                  <h3 className="text-md font-medium text-white">Created At</h3>
                </div>
                <p className="text-gray-300">
                  {club.createdat ? new Date(club.createdat).toLocaleDateString() : "Unknown"}
                </p>
              </div>
            </div>

            {club.chatroomId && (
              <ClubMemberManagement clubId={club.clubid} chatroomId={club.chatroomId} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
