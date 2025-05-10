"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { Pencil } from 'lucide-react';

export default function DomainsPage() {
  const [studentDomain, setStudentDomain] = useState("");
  const [instructorDomain, setInstructorDomain] = useState("");
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [canAddStudent, setCanAddStudent] = useState(false);
  const [canAddInstructor, setCanAddInstructor] = useState(false);
  const [isEditingStudent, setIsEditingStudent] = useState(false);
  const [isEditingInstructor, setIsEditingInstructor] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUniversityData = async () => {
      try {
        const response = await axios.get(process.env.NEXT_PUBLIC_END_POINT + "/university/getUniversity", { withCredentials: true });
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
    // const verify = async () => {
    //      try{
    //       const result = await checkAuth("domainsPage");
    //       console.log(result);
    //       result == false ? router.push("/") : null;
    //     }
    //       catch(e){router.push("/")}
    //     };
    //     verify();
  }, []);

  const handleAddOrUpdateDomain = async (type) => {
    setError("");
    setLoading(true);

    try {
      if (type === "Student" && studentDomain.trim()) {
        await axios.post(process.env.NEXT_PUBLIC_END_POINT + "/university/addStudentDomain", {
          studentDomain: studentDomain.trim(),
        }, { withCredentials: true });

        // Update existing domain or add new one
        const existingIndex = domains.findIndex(d => d.type === "Student");
        if (existingIndex >= 0) {
          const updatedDomains = [...domains];
          updatedDomains[existingIndex] = { type, domain: studentDomain.trim() };
          setDomains(updatedDomains);
        } else {
          setDomains([...domains, { type, domain: studentDomain.trim() }]);
        }
        
        setStudentDomain("");
        setCanAddStudent(false);
        setIsEditingStudent(false);
      } else if (type === "Instructor" && instructorDomain.trim()) {
        await axios.post(process.env.NEXT_PUBLIC_END_POINT + "/university/addIntructorDomain", {
          instructorDomain: instructorDomain.trim(),
        }, { withCredentials: true });

        // Update existing domain or add new one
        const existingIndex = domains.findIndex(d => d.type === "Instructor");
        if (existingIndex >= 0) {
          const updatedDomains = [...domains];
          updatedDomains[existingIndex] = { type, domain: instructorDomain.trim() };
          setDomains(updatedDomains);
        } else {
          setDomains([...domains, { type, domain: instructorDomain.trim() }]);
        }
        
        setInstructorDomain("");
        setCanAddInstructor(false);
        setIsEditingInstructor(false);
      }
    } catch (err) {
      setError(`Failed to ${isEditingStudent || isEditingInstructor ? 'update' : 'add'} ${type} domain.`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditDomain = (type, domain) => {
    if (type === "Student") {
      setStudentDomain(domain);
      setIsEditingStudent(true);
      setCanAddStudent(true);
    } else if (type === "Instructor") {
      setInstructorDomain(domain);
      setIsEditingInstructor(true);
      setCanAddInstructor(true);
    }
  };

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-6 text-white">Manage Domains</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <h2 className="text-xl font-semibold mb-4 text-white">
        {isEditingStudent ? "Edit Student Domain" : 
         isEditingInstructor ? "Edit Instructor Domain" : 
         "Add Domains"}
      </h2>

      <div className="mb-4">
        <label className="block text-sm mb-1">Student Domain</label>
        <input
          type="text"
          value={studentDomain}
          onChange={(e) => setStudentDomain(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-purple-500"
          placeholder="e.g., @student.edu"
          disabled={!canAddStudent || loading}
        />
        <button
          onClick={() => handleAddOrUpdateDomain("Student")}
          className={`mt-2 px-4 py-2 rounded ${(!canAddStudent || loading) ? "bg-gray-500 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 text-white"}`}
          disabled={!canAddStudent || loading}
        >
          {loading ? "Processing..." : isEditingStudent ? "Update Student Domain" : "Add Student Domain"}
        </button>
      </div>

      <div>
        <label className="block text-sm mb-1">Instructor Domain</label>
        <input
          type="text"
          value={instructorDomain}
          onChange={(e) => setInstructorDomain(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-purple-500"
          placeholder="e.g., @prof.university.com"
          disabled={!canAddInstructor || loading}
        />
        <button
          onClick={() => handleAddOrUpdateDomain("Instructor")}
          className={`mt-2 px-4 py-2 rounded ${(!canAddInstructor || loading) ? "bg-gray-500 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 text-white"}`}
          disabled={!canAddInstructor || loading}
        >
          {loading ? "Processing..." : isEditingInstructor ? "Update Instructor Domain" : "Add Instructor Domain"}
        </button>
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-4 text-white">Your Domains</h2>
      <div className="space-y-2">
        {domains.length > 0 ? (
          domains.map((d, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
              <span className="text-gray-300">
                {d.type}: {d.domain}
              </span>
              <button
                onClick={() => handleEditDomain(d.type, d.domain)}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                disabled={loading}
              >
                <Pencil className="h-4 w-4 mr-1" /> Edit
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
