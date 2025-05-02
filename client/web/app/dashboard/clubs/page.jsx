"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Users, CheckCircle, XCircle, Plus, School, Activity } from "lucide-react";
import { checkAuth } from "@/app/functions/checkAuth";

export default function ClubsManagement() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("pendingClubs");
  const [pendingClubs, setPendingClubs] = useState([]);
  const [acceptedClubs, setAcceptedClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClub, setSelectedClub] = useState(null);
  const [selectedInstructor, setSelectedInstructor] = useState("");
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [clubForm, setClubForm] = useState({
    name: "",
    description: "",
    room: "",
    adminId: ""
  });
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectClubId, setRejectClubId] = useState(null);

  const instructors = [
    { id: "1", name: "Dr. John Smith", department: "Computer Science" },
    { id: "2", name: "Prof. Sarah Johnson", department: "Mathematics" },
    { id: "3", name: "Dr. Michael Brown", department: "Engineering" },
    { id: "4", name: "Prof. Emily Davis", department: "Physics" },
    { id: "5", name: "Dr. Robert Wilson", department: "Chemistry" }
  ];

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
    fetchClubs();
  }, [router]);

  const fetchClubs = async () => {
    setLoading(true);
    try {
      const pendingResponse = await axios.get(
        process.env.NEXT_PUBLIC_END_POINT + "/clubs/underReviewClubs",
        { withCredentials: true }
      );
      setPendingClubs(pendingResponse.data);

      const acceptedResponse = await axios.get(
        process.env.NEXT_PUBLIC_END_POINT + "/clubs/acceptedClubs",
        { withCredentials: true }
      );
      setAcceptedClubs(acceptedResponse.data);
    } catch (err) {
      console.error("Error fetching clubs:", err);
      setError("Failed to load clubs data");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptClubClick = (club) => {
    setSelectedClub(club);
    setClubForm({
      name: club.name || "",
      description: club.description || "",
      room: club.room || "",
      adminId: ""
    });
    setShowAcceptModal(true);
  };

  const handleAcceptClub = async () => {
    if (!selectedClub || !clubForm.adminId) {
      setError("Please select an instructor for the club");
      return;
    }

    if (!clubForm.name.trim() || !clubForm.description.trim() || !clubForm.room.trim()) {
      setError("Club name and description are required");
      return;
    }

    try {
      await axios.post(
        process.env.NEXT_PUBLIC_END_POINT + "/clubs/acceptClubRequest",
        {
          clubId: selectedClub.clubid,
          name: clubForm.name,
          description: clubForm.description,
          room: clubForm.room,
          adminId: clubForm.adminId
        },
        { withCredentials: true }
      );
      
      setShowAcceptModal(false);
      setSelectedClub(null);
      setClubForm({
        name: "",
        description: "",
        room: "",
        adminId: ""
      });
      fetchClubs();
    } catch (err) {
      console.error("Error accepting club:", err);
      setError("Failed to accept club request");
    }
  };

  const handleRejectClubClick = (clubId) => {
    setRejectClubId(clubId);
    setShowRejectModal(true);
  };

  const handleRejectClub = async () => {
    try {
      await axios.post(
        process.env.NEXT_PUBLIC_END_POINT + "/clubs/rejectClubRequest",
        { clubId: rejectClubId },
        { withCredentials: true }
      );
      
      setShowRejectModal(false);
      setRejectClubId(null);
      fetchClubs();
    } catch (err) {
      console.error("Error rejecting club:", err);
      setError("Failed to reject club request");
    }
  };

  const filteredPendingClubs = pendingClubs.filter(club => 
    club.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    club.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAcceptedClubs = acceptedClubs.filter(club => 
    club.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    club.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <div className="flex items-center">
              <School className="mr-2 h-6 w-6 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">Club Management</h1>
            </div>
            <p className="mt-1 text-sm text-gray-400">
              Manage and monitor university clubs
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-900/50 text-red-200 p-3 rounded-md">
            {error}
            <button 
              onClick={() => setError("")} 
              className="ml-2 text-red-200 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        <div className="mb-4">
          <div className="border-b border-gray-700">
            <nav className="-mb-px flex space-x-6">
              <button
                onClick={() => setActiveTab("pendingClubs")}
                className={`border-b-2 py-2 px-1 text-sm font-medium ${
                  activeTab === "pendingClubs"
                    ? "border-purple-500 text-purple-400"
                    : "border-transparent text-gray-400 hover:border-gray-600 hover:text-gray-300"
                }`}
              >
                Pending Requests ({filteredPendingClubs.length})
              </button>
              <button
                onClick={() => setActiveTab("acceptedClubs")}
                className={`border-b-2 py-2 px-1 text-sm font-medium ${
                  activeTab === "acceptedClubs"
                    ? "border-purple-500 text-purple-400"
                    : "border-transparent text-gray-400 hover:border-gray-600 hover:text-gray-300"
                }`}
              >
                Active Clubs ({filteredAcceptedClubs.length})
              </button>
            </nav>
          </div>
        </div>

        <div className="mb-4">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-md border-0 bg-gray-700 py-2 pl-10 pr-3 text-gray-300 placeholder:text-gray-400 focus:bg-gray-600 focus:text-white focus:outline-none sm:text-sm"
              placeholder="Search clubs..."
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {activeTab === "pendingClubs" && (
              <PendingClubsTable 
                clubs={filteredPendingClubs} 
                onAccept={handleAcceptClubClick}
                onReject={handleRejectClubClick}
              />
            )}
            {activeTab === "acceptedClubs" && (
              <AcceptedClubsTable clubs={filteredAcceptedClubs} />
            )}
          </div>
        )}
      </div>

      {/* Enhanced Modal for accepting a club */}
      {showAcceptModal && selectedClub && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-lg w-full mx-4">
            <h2 className="text-xl font-semibold text-white mb-4">
              Accept Club Request
            </h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Club Name
                </label>
                <input
                  type="text"
                  value={clubForm.name}
                  onChange={(e) => setClubForm({...clubForm, name: e.target.value})}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter club name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={clubForm.description}
                  onChange={(e) => setClubForm({...clubForm, description: e.target.value})}
                  rows={3}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter club description"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Room Location
                </label>
                <input
                  type="text"
                  value={clubForm.room}
                  onChange={(e) => setClubForm({...clubForm, room: e.target.value})}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter room location (optional)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Club Instructor
                </label>
                <select
                  value={clubForm.adminId}
                  onChange={(e) => setClubForm({...clubForm, adminId: e.target.value})}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select an instructor</option>
                  {instructors.map((instructor) => (
                    <option key={instructor.id} value={instructor.id}>
                      {instructor.name} - {instructor.department}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAcceptModal(false);
                  setSelectedClub(null);
                }}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleAcceptClub}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white"
                disabled={!clubForm.adminId || !clubForm.name.trim() || !clubForm.description.trim()}
              >
                Accept Club
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection confirmation modal */}
      {showRejectModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold text-white mb-4">
              Confirm Rejection
            </h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to reject this club request? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectClubId(null);
                }}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectClub}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white"
              >
                Reject Club
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PendingClubsTable({ clubs, onAccept, onReject }) {
  if (clubs.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-400">No pending club requests found</p>
      </div>
    );
  }

  return (
    <div className="mt-2 overflow-hidden rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Description
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Request Date
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {clubs.map((club) => (
            <tr key={club.clubid} className="hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                {club.name}
              </td>
              <td className="px-6 py-4 text-sm text-gray-300 max-w-md truncate">
                {club.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {club.created_at ? new Date(club.created_at).toLocaleDateString() : "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onAccept(club)}
                  className="text-green-400 hover:text-green-300 mr-3"
                  title="Accept"
                >
                  <CheckCircle className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onReject(club.clubid)}
                  className="text-red-400 hover:text-red-300"
                  title="Reject"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AcceptedClubsTable({ clubs }) {
  if (clubs.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-400">No active clubs found</p>
      </div>
    );
  }

  return (
    <div className="mt-2 overflow-hidden rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Description
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Room
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Creation Date
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {clubs.map((club) => (
            <tr key={club.clubid} className="hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                {club.name}
              </td>
              <td className="px-6 py-4 text-sm text-gray-300 max-w-md truncate">
                {club.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {club.room || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {club.created_at ? new Date(club.created_at).toLocaleDateString() : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}