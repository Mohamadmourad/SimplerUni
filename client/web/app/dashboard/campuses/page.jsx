"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { useRouter } from 'next/navigation';
import { checkAuth } from "@/app/functions/checkAuth";

const AddCampuses = () => {
  const [campuses, setCampuses] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedCampuses, setUploadedCampuses] = useState([]);
  const [selectedCampuses, setSelectedCampuses] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchCampuses();
    const verify = async () => {
         try{
          const result = await checkAuth("campususPage");
          result == false ? router.push("/") : null;
        }
          catch(e){router.push("/")}
        };
        verify();
  }, []);

  const fetchCampuses = async () => {
    try {
      const result = await axios.get("http://localhost:5000/university/getAllCampsus", { withCredentials: true });
      console.log("API Response:", result.data.data);
      setCampuses(Array.isArray(result.data.data) ? result.data.data : []);
    } catch (err) {
      setError("Failed to fetch campuses.");
      console.error("Error fetching campuses:", err);
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
      await axios.post(
        "http://localhost:5000/university/addCampus",
        { campus: name.trim() },
        { withCredentials: true }
      );
      fetchCampuses();
      setName("");
      setError("");
    } catch (err) {
      setError("Failed to add campus.");
      console.error("Error adding campus:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCampus = async (campusId) => {
    setLoading(true);
    try {
      console.log("Removing campus with ID:", campusId);
      await axios.delete(
        `http://localhost:5000/university/removeCampus`,
        {
          data: { campusId },
          withCredentials: true
        }
      );
      fetchCampuses();
      setError("");
    } catch (err) {
      setError("Failed to remove campus.");
      console.error("Error removing campus:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setSelectedFile(file);
    setUploadedCampuses([]);
    setSelectedCampuses([]);
    setShowPreview(false);
  };

  const parseFile = () => {
    if (!selectedFile) {
      setError("Please select a file first");
      return;
    }

    const fileExt = selectedFile.name.split('.').pop().toLowerCase();
    if (fileExt !== "csv" && fileExt !== "xlsx") {
      setError("Only CSV and XLSX files are supported");
      return;
    }

    if (fileExt === "csv") {
      Papa.parse(selectedFile, {
        header: true,
        complete: (results) => {
          console.log("Parsed CSV:", results);
          if (results.data && results.data.length > 0) {
            // Extract campuses from parsed data
            const campusData = results.data
              .filter(row => row.campuses && row.campuses.trim() !== "")
              .map(row => ({ name: row.campuses.trim() }));
            
            setUploadedCampuses(campusData);
            setShowPreview(true);
            setError("");
          } else {
            setError("No valid data found in the CSV file");
          }
        },
        error: (error) => {
          console.error("CSV parsing error:", error);
          setError("Failed to parse CSV file");
        }
      });
    } else if (fileExt === "xlsx") {
      // Handle Excel files
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get the first sheet
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          console.log("Parsed Excel:", jsonData);
          
          if (jsonData && jsonData.length > 0) {
            // Check for 'campuses' column or the first column if 'campuses' doesn't exist
            const campusField = 'campuses' in jsonData[0] ? 'campuses' : Object.keys(jsonData[0])[0];
            
            // Extract campuses from parsed data
            const campusData = jsonData
              .filter(row => row[campusField] && String(row[campusField]).trim() !== "")
              .map(row => ({ name: String(row[campusField]).trim() }));
            
            if (campusData.length > 0) {
              setUploadedCampuses(campusData);
              setShowPreview(true);
              setError("");
            } else {
              setError("No valid campuses found in the Excel file");
            }
          } else {
            setError("No data found in the Excel file");
          }
        } catch (error) {
          console.error("Excel parsing error:", error);
          setError("Failed to parse Excel file: " + error.message);
        }
      };
      
      reader.onerror = () => {
        setError("Error reading the Excel file");
      };
      
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const handleSelectAll = () => {
    if (selectedCampuses.length === uploadedCampuses.length) {
      setSelectedCampuses([]);
    } else {
      setSelectedCampuses(uploadedCampuses.map((campus, index) => index));
    }
  };

  const toggleCampusSelection = (index) => {
    if (selectedCampuses.includes(index)) {
      setSelectedCampuses(selectedCampuses.filter(i => i !== index));
    } else {
      setSelectedCampuses([...selectedCampuses, index]);
    }
  };

  const handleAddSelectedCampuses = async () => {
    if (selectedCampuses.length === 0) {
      setError("Please select at least one campus to add");
      return;
    }

    setLoading(true);
    try {
      // Extract only the names of selected campuses
      const campusesToAdd = selectedCampuses.map(index => uploadedCampuses[index].name);
      
      // Make sure we're sending the array with the correct property name: campusGroup
      await axios.post(
        "http://localhost:5000/university/addCampus", 
        { campususGroup: campusesToAdd }, 
        { withCredentials: true }
      );
      
      fetchCampuses();
      setShowPreview(false);
      setUploadedCampuses([]);
      setSelectedCampuses([]);
      setError("");
      setFileName("");
      setSelectedFile(null);
    } catch (err) {
      console.error("Error adding campuses:", err);
      setError("Failed to add selected campuses.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const worksheet = XLSX.utils.json_to_sheet([
      { campuses: "Main Campus" },
      { campuses: "Downtown Campus" },
      { campuses: "North Campus" }
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Campuses");
    
    XLSX.writeFile(workbook, "campus_template.xlsx");
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
        <h2 className="text-xl font-semibold text-white mb-3">Upload File</h2>
        <div className="flex items-center space-x-4 flex-wrap">
          <label className="px-3 py-1.5 bg-purple-600 text-white rounded-md cursor-pointer hover:bg-purple-700 transition-colors text-sm w-auto mb-2">
            Choose File
            <input 
              type="file" 
              accept=".csv, .xlsx" 
              onChange={handleFileChange} 
              className="hidden"
            />
          </label>
          {fileName && <p className="text-gray-400 text-sm mb-2">{fileName}</p>}
          {fileName && (
            <button 
              onClick={parseFile} 
              className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm mb-2"
            >
              Preview File
            </button>
          )}
          <div className="flex space-x-2">
            <button 
              onClick={handleDownloadTemplate} 
              className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm mb-2"
            >
              Download Template
            </button>
          </div>
        </div>
      </div>

      {showPreview && uploadedCampuses.length > 0 && (
        <div className="bg-gray-900 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold text-white">Select Campuses to Add</h2>
            <div className="flex space-x-2">
              <button 
                onClick={handleSelectAll} 
                className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                {selectedCampuses.length === uploadedCampuses.length ? "Deselect All" : "Select All"}
              </button>
              <button 
                onClick={handleAddSelectedCampuses} 
                className={`px-3 py-1.5 ${selectedCampuses.length === 0 ? 'bg-gray-600' : 'bg-green-600 hover:bg-green-700'} text-white rounded-md transition-colors text-sm`}
                disabled={selectedCampuses.length === 0 || loading}
              >
                {loading ? "Adding..." : "Add Selected Campuses"}
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto bg-gray-800 rounded-lg">
            <table className="w-full text-white">
              <thead className="bg-gray-700 sticky top-0">
                <tr>
                  <th className="p-3 text-left w-12">Select</th>
                  <th className="p-3 text-left">Campus Name</th>
                </tr>
              </thead>
              <tbody>
                {uploadedCampuses.map((campus, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}>
                    <td className="p-3">
                      <input 
                        type="checkbox" 
                        checked={selectedCampuses.includes(index)} 
                        onChange={() => toggleCampusSelection(index)}
                        className="w-4 h-4 accent-purple-600 cursor-pointer"
                      />
                    </td>
                    <td className="p-3">{campus.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-gray-400 mt-2">
            Selected: {selectedCampuses.length} of {uploadedCampuses.length} campuses
          </p>
        </div>
      )}

      <div className="bg-gray-900 p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-white mb-3">Existing Campuses</h2>
        {loading && !showPreview ? (
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