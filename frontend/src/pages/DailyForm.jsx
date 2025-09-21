import React, { useState } from "react";

function UploadCSV() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a CSV file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("No token found. Please login first.");
        return;
      }

      const res = await fetch(
        "http://localhost:5001/contactauth/profile/daily",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();
      if (res.ok) {
        setMessage(`Success: ${data.message}`);
        setFile(null);
      } else {
        setMessage(`Error: ${data.message || "Upload failed"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error. Check server and CORS.");
    }
  };

  return (
    <div className="p-4 bg-gray-700 rounded w-2/3 mx-auto mt-6 text-white">
      <h2 className="text-xl font-bold mb-4">Upload Daily Consumption CSV</h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
          className="border px-2 py-1 rounded text-black"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Upload
        </button>
      </form>
      {message && <p className="mt-3 text-center">{message}</p>}
    </div>
  );
}

export default UploadCSV;
