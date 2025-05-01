"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { checkAuth } from "@/app/functions/checkAuth";
import { useRouter } from "next/navigation";

const AddMajors = () => {
  const [majors, setMajors] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedMajors, setUploadedMajors] = useState([]);
  const [selectedMajors, setSelectedMajors] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
   const router = useRouter();

  useEffect(() => {
    fetchMajors();
    const verify = async () => {
         try{
          const result = await checkAuth("majorsPage");
          result == false ? router.push("/") : null;
        }
          catch(e){router.push("/")}
        };
        verify();
  }, []);

  const fetchMajors = async () => {
    try {
      const result = await axios.get(process.env.NEXT_PUBLIC_END_POINT + "/university/getAllMajors", { withCredentials: true });
      console.log("API Response:", result.data.data);
      setMajors(Array.isArray(result.data.data) ? result.data.data : []);
    } catch (err) {
      setError("Failed to fetch majors.");
    }
  };

  const handleAddMajor = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Major name is required");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        process.env.NEXT_PUBLIC_END_POINT + "/university/addMajor", 
        { major: name.trim() }, 
        { withCredentials: true }
      );
      fetchMajors();
      setName("");
      setError("");
    } catch (err) {
      setError("Failed to add major.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMajor = async (majorId) => {
    setLoading(true);
    try {
      console.log("Removing major with ID:", majorId);
      await axios.delete(
        `http://localhost:5000/university/removeMajor`, 
        { 
          data: { majorId },
          withCredentials: true 
        }
      );
      fetchMajors();
      setError("");
    } catch (err) {
      setError("Failed to remove major.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setSelectedFile(file);
    setUploadedMajors([]);
    setSelectedMajors([]);
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
            // Extract majors from parsed data
            const majorData = results.data
              .filter(row => row.majors && row.majors.trim() !== "")
              .map(row => ({ name: row.majors.trim() }));
            
            setUploadedMajors(majorData);
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
            // Check for 'majors' column or the first column if 'majors' doesn't exist
            const majorField = 'majors' in jsonData[0] ? 'majors' : Object.keys(jsonData[0])[0];
            
            // Extract majors from parsed data
            const majorData = jsonData
              .filter(row => row[majorField] && String(row[majorField]).trim() !== "")
              .map(row => ({ name: String(row[majorField]).trim() }));
            
            if (majorData.length > 0) {
              setUploadedMajors(majorData);
              setShowPreview(true);
              setError("");
            } else {
              setError("No valid majors found in the Excel file");
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
    if (selectedMajors.length === uploadedMajors.length) {
      setSelectedMajors([]);
    } else {
      setSelectedMajors(uploadedMajors.map((major, index) => index));
    }
  };

  const toggleMajorSelection = (index) => {
    if (selectedMajors.includes(index)) {
      setSelectedMajors(selectedMajors.filter(i => i !== index));
    } else {
      setSelectedMajors([...selectedMajors, index]);
    }
  };

  const handleAddSelectedMajors = async () => {
    if (selectedMajors.length === 0) {
      setError("Please select at least one major to add");
      return;
    }

    setLoading(true);
    try {
      // Extract only the names of selected majors
      const majorsToAdd = selectedMajors.map(index => uploadedMajors[index].name);
      
      // Make sure we're sending the array of major names, not indices
      await axios.post(
        process.env.NEXT_PUBLIC_END_POINT + "/university/addMajor", 
        { majors: majorsToAdd }, 
        { withCredentials: true }
      );
      
      fetchMajors();
      setShowPreview(false);
      setUploadedMajors([]);
      setSelectedMajors([]);
      setError("");
      setFileName("");
      setSelectedFile(null);
    } catch (err) {
      console.error("Error adding majors:", err);
      setError("Failed to add selected majors.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const worksheet = XLSX.utils.json_to_sheet([
      { majors: "Computer Science" },
      { majors: "Engineering" },
      { majors: "Business Administration" }
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Majors");
    
    XLSX.writeFile(workbook, "major_template.xlsx");
  };


  return (
    <div className="flex flex-col p-6">
      <h1 className="text-2xl font-bold text-white mb-4">Add Majors</h1>
      {error && <p className="text-red-500 mb-4 p-3 bg-red-900 bg-opacity-30 rounded">{error}</p>}

      <div className="bg-gray-900 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold text-white mb-3">Add Major Manually</h2>
        <form onSubmit={handleAddMajor} className="space-y-3">
          <input 
            type="text" 
            placeholder="Major Name" 
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
            {loading ? "Adding..." : "Add Major"}
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

      {showPreview && uploadedMajors.length > 0 && (
        <div className="bg-gray-900 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold text-white">Select Majors to Add</h2>
            <div className="flex space-x-2">
              <button 
                onClick={handleSelectAll} 
                className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                {selectedMajors.length === uploadedMajors.length ? "Deselect All" : "Select All"}
              </button>
              <button 
                onClick={handleAddSelectedMajors} 
                className={`px-3 py-1.5 ${selectedMajors.length === 0 ? 'bg-gray-600' : 'bg-green-600 hover:bg-green-700'} text-white rounded-md transition-colors text-sm`}
                disabled={selectedMajors.length === 0 || loading}
              >
                {loading ? "Adding..." : "Add Selected Majors"}
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto bg-gray-800 rounded-lg">
            <table className="w-full text-white">
              <thead className="bg-gray-700 sticky top-0">
                <tr>
                  <th className="p-3 text-left w-12">Select</th>
                  <th className="p-3 text-left">Major Name</th>
                </tr>
              </thead>
              <tbody>
                {uploadedMajors.map((major, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}>
                    <td className="p-3">
                      <input 
                        type="checkbox" 
                        checked={selectedMajors.includes(index)} 
                        onChange={() => toggleMajorSelection(index)}
                        className="w-4 h-4 accent-purple-600 cursor-pointer"
                      />
                    </td>
                    <td className="p-3">{major.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-gray-400 mt-2">
            Selected: {selectedMajors.length} of {uploadedMajors.length} majors
          </p>
        </div>
      )}

      <div className="bg-gray-900 p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-white mb-3">Existing Majors</h2>
        {loading && !showPreview ? (
          <p className="text-gray-400">Loading majors...</p>
        ) : majors.length === 0 ? (
          <p className="text-gray-400">No majors found.</p>
        ) : (
          <ul className="space-y-2">
            {majors.map((major) => (
              <li key={major.majorid} className="p-3 bg-gray-700 rounded-lg text-white flex justify-between items-center">
                <span>{major.name}</span>
                <button 
                  onClick={() => handleRemoveMajor(major.majorid)} 
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

export default AddMajors;