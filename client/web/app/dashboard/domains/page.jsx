"use client";

import { useState } from "react";

export default function DomainsPage() {
  const [studentDomain, setStudentDomain] = useState("");
  const [instructorDomain, setInstructorDomain] = useState("");

  const [domains, setDomains] = useState([
    { type: "Student", domain: "student.edu" },
    { type: "Instructor", domain: "prof.university.com" },
  ]);


  return (
    <div className="min-h-screen p-8 bg-gray-900 text-gray-300">
      <h1 className="text-2xl font-bold mb-6 text-white">Manage Domains</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Add Domains */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-white">Add Domains</h2>

          {/* Student Domain */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Student Domain</label>
            <input
              type="text"
              value={studentDomain}
              onChange={(e) => setStudentDomain(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., student.edu"
            />
            <button
              onClick={() => handleAddDomain("Student")}
              className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Add Student Domain
            </button>
          </div>

          {/* Instructor Domain */}
          <div>
            <label className="block text-sm mb-1">Instructor Domain</label>
            <input
              type="text"
              value={instructorDomain}
              onChange={(e) => setInstructorDomain(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., prof.university.com"
            />
            <button
              onClick={() => handleAddDomain("Instructor")}
              className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Add Instructor Domain
            </button>
          </div>
        </div>

        {/* Right Side - Imported Domains Table */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-white">Imported Domains</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-700">
              <thead>
                <tr className="bg-gray-700 text-white">
                  <th className="px-4 py-2 border border-gray-600">Type</th>
                  <th className="px-4 py-2 border border-gray-600">Domain</th>
                </tr>
              </thead>
              <tbody>
                {domains.map((d, index) => (
                  <tr key={index} className="border border-gray-600 text-gray-300">
                    <td className="px-4 py-2 border border-gray-600">{d.type}</td>
                    <td className="px-4 py-2 border border-gray-600">{d.domain}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
