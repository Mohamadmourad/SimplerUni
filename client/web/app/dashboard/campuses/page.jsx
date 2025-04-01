"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Papa from "papaparse";

const AddCampuses = () => {
  const [campuses, setCampuses] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchCampuses();
  }, []);

  const fetchCampuses = async () => {
    try {
      const result = await axios.get("http://localhost:5000/university/getAllCampsus", { withCredentials: true });
      console.log("API Response:", result.data.data);
      setCampuses(Array.isArray(result.data.data) ? result.data.data : []);
    } catch (err) {
      setError("Failed to fetch campuses.");
    }
  };

  const handleAddCampus = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Campus name is required");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/university/addCampus",{
        campus: name.trim(),
       },{withCredentials: true});
      fetchCampuses();
      setName("");
    } catch (err) {
      setError("Failed to add campus.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCampus = async (campusId) => {
    setLoading(true);
    try {
      console.log("Removing campus with ID:", campusId);
      await axios.delete(`http://localhost:5000/university/removeCampus`, {
        campusId
      }, { withCredentials: true }
      );
      fetchCampuses();
    } catch (err) {
      setError("Failed to remove campus.");
    } finally {
      setLoading(false);
    }

  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setSelectedFile(file);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    Papa.parse(selectedFile, {
      header: true,
      complete: async (results) => {
        try {
          await axios.post("http://localhost:5000/campus/bulkAdd", { campuses: results.data });
          fetchCampuses();
        } catch (err) {
          setError("Failed to upload campuses.");
        }
      },
    });
  };

  return (
    <div className="flex flex-col p-6">
      <h1 className="text-2xl font-bold text-white mb-4">Add Campuses</h1>
      {error && <p className="text-red-500 mb-4 p-3 bg-red-900 bg-opacity-30 rounded">{error}</p>}

      <div className="bg-gray-900 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold text-white mb-3">Add Campus Manually</h2>
        <form onSubmit={handleAddCampus} className="space-y-3">
          <input 
            type="text" 
            placeholder="Campus Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="p-2 bg-gray-700 text-white rounded w-full" 
            disabled={loading}
          />
          <button 
            type="submit" 
            className={`px-4 py-2 ${loading ? 'bg-gray-600' : 'bg-purple-600 hover:bg-purple-700'} text-white rounded transition-colors w-full md:w-auto`}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Campus"}
          </button>
        </form>
      </div>

      <div className="bg-gray-900 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold text-white mb-3">Upload CSV File</h2>
        <div className="flex items-center space-x-4">
          <label className="px-3 py-1.5 bg-purple-600 text-white rounded-md cursor-pointer hover:bg-purple-700 transition-colors text-sm w-auto">
            Choose File
            <input 
              type="file" 
              accept=".csv" 
              onChange={handleFileChange} 
              className="hidden"
            />
          </label>
          {fileName && <p className="text-gray-400 text-sm">{fileName}</p>}
          {fileName && (
            <button 
              onClick={handleFileUpload} 
              className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
            >
              Import File
            </button>
          )}
        </div>
      </div>

      <div className="bg-gray-900 p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-white mb-3">Existing Campuses</h2>
        {loading ? (
          <p className="text-gray-400">Loading campuses...</p>
        ) : campuses.length === 0 ? (
          <p className="text-gray-400">No campuses found.</p>
        ) : (
          <ul className="space-y-2">
            {campuses.map((campus) => (
              <li key={campus.campusid} className="p-3 bg-gray-700 rounded-lg text-white flex justify-between items-center">
                <span>{campus.name}</span>
                <button 
                  onClick={() => handleRemoveCampus(campus.campusid)} 
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AddCampuses;
