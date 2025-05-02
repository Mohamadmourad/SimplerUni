"use client";

import React, { useState } from "react";
import { Users } from "lucide-react";

export default function ClubMemberManagement({ clubId, chatroomId }) {
  const [error, setError] = useState("");

  return (
    <div className="bg-gray-800 rounded-lg p-4 mt-4">
      <div className="flex items-center mb-4">
        <Users className="h-5 w-5 text-purple-400 mr-2" />
        <h3 className="text-lg font-medium text-white">Club Members</h3>
      </div>

      <p className="text-gray-400 text-center py-4">
        Club membership management is available in the mobile application.
        Members can join clubs and administrators can accept or reject join requests from there.
      </p>
    </div>
  );
}
