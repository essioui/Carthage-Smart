import React, { useState } from "react";

const Data = () => {
  const [address, setAddress] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const res = await fetch("http://localhost:5001/users/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ address }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setResult(null);
      } else {
        setError("");
        setResult(data);
      }
    } catch (err) {
      setError("Failed to fetch data");
      setResult(null);
    }
  };

  return (
    <div className="p-6 bg-gray-700 rounded-lg shadow-lg text-white w-4/5 mx-auto mt-4">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Get Last Month Consumption
      </h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter address"
          className="w-full p-2 mb-4 rounded bg-gray-600 text-white focus:outline-none"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 py-2 rounded hover:bg-blue-700 transition">
          Submit
        </button>
      </form>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      {result && (
        <div className="bg-gray-600 p-4 rounded">
          <h3 className="text-xl font-bold mb-2">Results</h3>
          <p className="mb-2">{result.message}</p>
          <table className="w-full text-white mb-4 border border-gray-500">
            <thead>
              <tr>
                <th className="border px-2 py-1">Contact ID</th>
                <th className="border px-2 py-1">Total Consumption</th>
              </tr>
            </thead>
            <tbody>
              {result.data.contacts.map((c) => (
                <tr key={c.contactId}>
                  <td className="border px-2 py-1">{c.contactId}</td>
                  <td className="border px-2 py-1">{c.totalConsumption}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {result.csvPath && (
            <a
              href={`http://localhost:5001/csv/userData/${address}.csv`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline">
              Download CSV
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default Data;
