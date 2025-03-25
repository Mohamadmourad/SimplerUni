"use client";

import { useState } from "react";

export default function DomainsPage() {
  const [studentDomain, setStudentDomain] = useState("");
  const [instructorDomain, setInstructorDomain] = useState("");

  const [domains, setDomains] = useState([
    { type: "Student", domain: "student.edu" },
    { type: "Instructor", domain: "prof.university.com" },
  ]);

  const handleAddDomain = (type) => {
    if (type === "Student" && studentDomain.trim() && !domains.some(d => d.type === "Student")) {
      setDomains([...domains, { type, domain: studentDomain.trim() }]);
      setStudentDomain("");
    } else if (type === "Instructor" && instructorDomain.trim() && !domains.some(d => d.type === "Instructor")) {
      setDomains([...domains, { type, domain: instructorDomain.trim() }]);
      setInstructorDomain("");
    }
  };

  const handleDeleteDomain = (index) => {
    setDomains(domains.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full h-96 flex items-center justify-center p-8 bg-gray-900 text-gray-300">
      <div className="max-w-2xl w-full bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-white text-center">Manage Domains</h1>

        <h2 className="text-xl font-semibold mb-4 text-white text-center">Add Domains</h2>

        {/* Student Domain */}
        <div className="mb-6">
          <label className="block text-sm mb-2">Student Domain</label>
          <input
            type="text"
            value={studentDomain}
            onChange={(e) => setStudentDomain(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-purple-500"
            placeholder="e.g., student.edu"
          />
          <button
            onClick={() => handleAddDomain("Student")}
            disabled={domains.some(d => d.type === "Student")}
            className="mt-3 w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-500"
          >
            Add Student Domain
          </button>
        </div>

        {/* Instructor Domain */}
        <div className="mb-6">
          <label className="block text-sm mb-2">Instructor Domain</label>
          <input
            type="text"
            value={instructorDomain}
            onChange={(e) => setInstructorDomain(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-purple-500"
            placeholder="e.g., prof.university.com"
          />
          <button
            onClick={() => handleAddDomain("Instructor")}
            disabled={domains.some(d => d.type === "Instructor")}
            className="mt-3 w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-500"
          >
            Add Instructor Domain
          </button>
        </div>

        {/* Domains List */}
        <h2 className="text-xl font-semibold mt-6 mb-4 text-white text-center">Imported Domains</h2>
        <div className="space-y-2">
          {domains.length > 0 ? (
            domains.map((d, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                <span className="text-gray-300">{d.type}: {d.domain}</span>
                <button
                  onClick={() => handleDeleteDomain(index)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            ))
          ) : null}
        </div>
      </div>
    </div>
  );
}
