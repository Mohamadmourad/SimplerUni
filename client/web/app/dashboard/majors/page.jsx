"use client";
import axios from "axios";
import { useState } from "react";

export default function AddMajorPage() {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post("http://localhost:5000/document/uploadCampusesDocument", formData,{withCredentials: true});
    console.log(response.data);
  };

    return (
      <div className="p-8">
        <input type="file" accept=".csv,.xlsx" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
      </div>
    );
  }
  