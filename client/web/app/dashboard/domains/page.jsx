"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function DomainsPage() {
  const [studentDomain, setStudentDomain] = useState(null);
  const [instructorDomain, setInstructorDomain] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isStudentDomainSet, setIsStudentDomainSet] = useState(false);
  const [isInstructorDomainSet, setIsInstructorDomainSet] = useState(false);

  useEffect(() => {
    const fetchUniversityData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/university/getUniversity", { withCredentials: true });
        const university = response.data;
        console.log(university);
        setStudentDomain(university.studentdomain);
        setInstructorDomain(university.instructordomain);
        setIsStudentDomainSet(!!university.studentdomain);
        setIsInstructorDomainSet(!!university.instructordomain);
      } catch (err) {
        setError("Failed to fetch university data.");
      }
    };
    
    fetchUniversityData();
  }, []);

  const handleAddDomain = async (type, domainValue) => {
    setError("");
    setLoading(true);

    try {
      if (type === "Student" && domainValue.trim()) {
        await axios.post("http://localhost:5000/university/addStudentDomain", {
          studentDomain: domainValue.trim(),
        }, { withCredentials: true });
        fetchUniversityData();
      } else if (type === "Instructor" && domainValue.trim()) {
        await axios.post("http://localhost:5000/university/addIntructorDomain", {
          instructorDomain: domainValue.trim(),
        }, { withCredentials: true });
        fetchUniversityData();
      }
    } catch (err) {
      setError(`Failed to add ${type} domain.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-6 text-white">Manage Domains</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <h2 className="text-xl font-semibold mb-4 text-white">Add Domains</h2>

      {/* Student Domain */}
      <div className="mb-4">
        <label className="block text-sm mb-1">Student Domain</label>
        <input
          type="text"
          value={studentDomain || ""}
          onChange={(e) => setStudentDomain(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-purple-500"
          placeholder="e.g., student.edu"
          disabled={loading || isStudentDomainSet}
        />
        <button
          onClick={() => handleAddDomain("Student", studentDomain)}
          className={`mt-2 px-4 py-2 rounded ${loading || isStudentDomainSet ? "bg-gray-500 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 text-white"}`}
          disabled={loading || isStudentDomainSet}
        >
          {loading ? "Adding..." : "Add Student Domain"}
        </button>
      </div>

      {/* Instructor Domain */}
      <div>
        <label className="block text-sm mb-1">Instructor Domain</label>
        <input
          type="text"
          value={instructorDomain || ""}
          onChange={(e) => setInstructorDomain(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-purple-500"
          placeholder="e.g., prof.university.com"
          disabled={loading || isInstructorDomainSet}
        />
        <button
          onClick={() => handleAddDomain("Instructor", instructorDomain)}
          className={`mt-2 px-4 py-2 rounded ${loading || isInstructorDomainSet ? "bg-gray-500 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 text-white"}`}
          disabled={loading || isInstructorDomainSet}
        >
          {loading ? "Adding..." : "Add Instructor Domain"}
        </button>
      </div>

      {/* Display Existing Domains */}
      <h2 className="text-xl font-semibold mt-6 mb-4 text-white">Existing Domains</h2>
      <div className="space-y-2">
        {isStudentDomainSet && <p className="text-gray-300">Student Domain: {studentDomain}</p>}
        {isInstructorDomainSet && <p className="text-gray-300">Instructor Domain: {instructorDomain}</p>}
        {!isStudentDomainSet && !isInstructorDomainSet && <p className="text-gray-400">No domains available.</p>}
      </div>
    </div>
  );
}
