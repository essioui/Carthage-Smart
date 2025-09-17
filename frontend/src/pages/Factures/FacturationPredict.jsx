import React, { useEffect, useState } from "react";

function FacturationPredict() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPrediction = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(
          "http://localhost:5001/contactauth/profile/facturation/predict",
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
          const arrayData = Object.entries(result.data.predicted).map(
            ([date, predicted]) => ({
              date,
              predicted: Number(predicted.toFixed(2)),
            })
          );
          setData(arrayData);
        } else {
          setMessage(result.message || "Failed to fetch predictions");
        }
      } catch (err) {
        console.error(err);
        setMessage("Network error");
      }

      setLoading(false);
    };

    fetchPrediction();
  }, []);

  return (
    <div className="p-4 bg-gray-700 rounded w-4/5 mx-auto mt-6 text-white">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Predicted Daily Consumption
      </h2>

      {loading && <p className="text-center">Loading predictions...</p>}
      {message && <p className="text-center text-red-400">{message}</p>}

      {!loading && data.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-500">
            <thead>
              <tr className="bg-gray-600">
                <th className="border border-gray-500 px-4 py-2">Date</th>
                <th className="border border-gray-500 px-4 py-2">
                  Predicted Consumption (kWh)
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
                    {item.date}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {item.predicted}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && data.length === 0 && !message && (
        <p className="text-center mt-4">No predictions available.</p>
      )}
    </div>
  );
}

export default FacturationPredict;
