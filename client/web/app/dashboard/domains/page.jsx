"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function DomainsPage() {
  const [studentDomain, setStudentDomain] = useState("");
  const [instructorDomain, setInstructorDomain] = useState("");
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [canAddStudent, setCanAddStudent] = useState(false);
  const [canAddInstructor, setCanAddInstructor] = useState(false);

  useEffect(() => {
    const fetchUniversityData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/university/getUniversity", { withCredentials: true });
        const university = response.data;

        const domainList = [];
        if (university.studentdomain) {
          domainList.push({ type: "Student", domain: university.studentdomain });
        } else {
          setCanAddStudent(true);
        }

        if (university.instructordomain) {
          domainList.push({ type: "Instructor", domain: university.instructordomain });
        } else {
          setCanAddInstructor(true);
        }

        setDomains(domainList);
      } catch (err) {
        setError("Failed to fetch university data.");
      }
    };

    fetchUniversityData();
  }, []);

  const handleAddDomain = async (type) => {
    setError("");
    setLoading(true);

    try {
      if (type === "Student" && studentDomain.trim()) {
        await axios.post("http://localhost:5000/university/addStudentDomain", {
          studentDomain: studentDomain.trim(),
        }, { withCredentials: true });

        setDomains([...domains, { type, domain: studentDomain.trim() }]);
        setStudentDomain("");
        setCanAddStudent(false);
      } else if (type === "Instructor" && instructorDomain.trim()) {
        await axios.post("http://localhost:5000/university/addIntructorDomain", {
          instructorDomain: instructorDomain.trim(),
        }, { withCredentials: true });

        setDomains([...domains, { type, domain: instructorDomain.trim() }]);
        setInstructorDomain("");
        setCanAddInstructor(false);
      }
    } catch (err) {
      setError(`Failed to add ${type} domain.`);
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteDomain = async (type, domain) => {
    setError("");
    setLoading(true);

    try {
      if (type === "Student") {
        await axios.delete("http://localhost:5000/university/removeStudentDomain", {
          data: { studentDomain: domain },
        }, { withCredentials: true });
      } else if (type === "Instructor") {
        await axios.delete("http://localhost:5000/university/removeIntructorDomain", {
          data: { instructorDomain: domain },
        }, { withCredentials: true });
      }

      setDomains(domains.filter((d) => d.domain !== domain));
    } catch (err) {
      setError(`Failed to remove ${type} domain.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-6 text-white">Manage Domains</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <h2 className="text-xl font-semibold mb-4 text-white">Add Domains</h2>

      <div className="mb-4">
        <label className="block text-sm mb-1">Student Domain</label>
        <input
          type="text"
          value={studentDomain}
          onChange={(e) => setStudentDomain(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-purple-500"
          placeholder="e.g., student.edu"
          disabled={!canAddStudent || loading}
        />
        <button
          onClick={() => handleAddDomain("Student")}
          className={`mt-2 px-4 py-2 rounded ${(!canAddStudent || loading) ? "bg-gray-500 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 text-white"}`}
          disabled={!canAddStudent || loading}
        >
          {loading ? "Adding..." : "Add Student Domain"}
        </button>
      </div>

      <div>
        <label className="block text-sm mb-1">Instructor Domain</label>
        <input
          type="text"
          value={instructorDomain}
          onChange={(e) => setInstructorDomain(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-purple-500"
          placeholder="e.g., prof.university.com"
          disabled={!canAddInstructor || loading}
        />
        <button
          onClick={() => handleAddDomain("Instructor")}
          className={`mt-2 px-4 py-2 rounded ${(!canAddInstructor || loading) ? "bg-gray-500 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 text-white"}`}
          disabled={!canAddInstructor || loading}
        >
          {loading ? "Adding..." : "Add Instructor Domain"}
        </button>
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-4 text-white">Imported Domains</h2>
      <div className="space-y-2">
        {domains.length > 0 ? (
          domains.map((d, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
              <span className="text-gray-300">
                {d.type}: {d.domain}
              </span>
              <button
                onClick={() => handleDeleteDomain(d.type, d.domain)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                disabled={loading}
              >
                {loading ? "Removing..." : "Delete"}
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No domains added.</p>
        )}
      </div>
    </div>
  );
}
