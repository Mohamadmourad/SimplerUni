"use client";
import axios from "axios";
import { useState } from "react";

export default function DomainsPage() {
  const [studentDomain, setStudentDomain] = useState("");
  const [instructorDomain, setInstructorDomain] = useState("");

  const [domains, setDomains] = useState("");

  const handleAddDomain = (type) => {
    if (type === "Student" && studentDomain.trim()) {
      setDomains([...domains, { type, domain: studentDomain.trim() }]);
      setStudentDomain("");
    } else if (type === "Instructor" && instructorDomain.trim()) {
      setDomains([...domains, { type, domain: instructorDomain.trim() }]);
      setInstructorDomain("");
    }
  };

  const handleDeleteDomain = (index) => {
    setDomains(domains.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-gray-300">
      <h1 className="text-2xl font-bold mb-6 text-white">Manage Domains</h1>

      
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

        {/* Domains List */}
        <h2 className="text-xl font-semibold mt-6 mb-4 text-white">Imported Domains</h2>
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
  );
}
