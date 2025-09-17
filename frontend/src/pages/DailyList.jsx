import React, { useEffect, useState } from "react";

function DailyList() {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(
          "http://localhost:5001/contactauth/profile/daily/export",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await res.json();
        if (res.ok) {
          setData(result.data);
        } else {
          setMessage("no " + (result.message || "Failed to fetch data"));
        }
      } catch (err) {
        console.error(err);
        setMessage("no Network error");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4 bg-gray-700 rounded w-4/5 mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">Daily Consumption Data</h2>
      {message && <p className="text-red-500">{message}</p>}
      {data.length > 0 ? (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-300">
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Consumption (kWh)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                <td className="border px-2 py-1">{row.date}</td>
                <td className="border px-2 py-1">{row.consumption}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data available yet</p>
      )}
    </div>
  );
}

export default DailyList;
