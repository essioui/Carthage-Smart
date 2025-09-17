import React, { useEffect, useState } from "react";

function FacturationAll() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAllFactures = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(
          "http://localhost:5001/contactauth/profile/facturation/all",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        const result = await res.json();

        if (res.ok) {
          setData(result.data);
        } else {
          setMessage(result.message || "Failed to fetch all factures");
        }
      } catch (err) {
        console.error(err);
        setMessage("Network error");
      }

      setLoading(false);
    };

    fetchAllFactures();
  }, []);

  return (
    <div className="p-4 bg-gray-700 rounded w-4/5 mx-auto mt-6 text-white">
      <h2 className="text-2xl font-bold mb-4 text-center">
        All Monthly Factures
      </h2>

      {loading && <p className="text-center">Loading...</p>}
      {message && <p className="text-center text-red-400">{message}</p>}

      {!loading && data.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-500">
            <thead>
              <tr className="bg-gray-600">
                <th className="border border-gray-500 px-4 py-2">Year</th>
                <th className="border border-gray-500 px-4 py-2">Month</th>
                <th className="border border-gray-500 px-4 py-2">
                  Total Consumption (kWh)
                </th>
                <th className="border border-gray-500 px-4 py-2">
                  Total Facture (GBP)
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={index}
                  className={`text-center ${
                    index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                  }`}>
                  <td className="border border-gray-500 px-4 py-2">
                    {item.year}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {item.month}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {item.totalConsumption}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {item.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && data.length === 0 && !message && (
        <p className="text-center mt-4">No factures available.</p>
      )}
    </div>
  );
}

export default FacturationAll;
