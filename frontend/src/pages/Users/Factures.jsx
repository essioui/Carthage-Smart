import React, { useEffect, useState } from "react";

const Factures = () => {
  const [factures, setFactures] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetch("http://localhost:5001/users/factures", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch factures");
        return res.json();
      })
      .then((data) => setFactures(data.factures))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="text-red-400">{error}</p>;
  if (!factures.length) return <p>Loading factures...</p>;

  return (
    <div className="p-6 bg-gray-700 rounded-lg shadow-lg text-white w-4/5 mx-auto mt-4">
      <h2 className="text-2xl font-bold mb-4">Factures List</h2>
      <table className="w-full text-white border border-gray-500">
        <thead>
          <tr>
            <th className="border px-2 py-1">Contact</th>
            <th className="border px-2 py-1">Month</th>
            <th className="border px-2 py-1">Year</th>
            <th className="border px-2 py-1">Total Consumption</th>
            <th className="border px-2 py-1">Total (€)</th>
          </tr>
        </thead>
        <tbody>
          {factures.map((f) => (
            <tr key={f._id}>
              <td className="border px-2 py-1">{f.contact}</td>
              <td className="border px-2 py-1">{f.month}</td>
              <td className="border px-2 py-1">{f.year}</td>
              <td className="border px-2 py-1">{f.totalConsumption}</td>
              <td className="border px-2 py-1">{f.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Factures;
