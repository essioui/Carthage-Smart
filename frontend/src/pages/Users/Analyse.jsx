import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ClustersAnalyse = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [analysisData, setAnalysisData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return (window.location.href = "/login");

    fetch("http://localhost:5001/users/cluster", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch clusters");
        return res.json();
      })
      .then((data) => setContacts(data.clusters))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="text-red-400">{error}</p>;
  if (!contacts.length) return <p>Loading clusters...</p>;

  const addresses = [...new Set(contacts.map((c) => c.address))];

  const handleAnalyse = async (address) => {
    const token = localStorage.getItem("token");
    if (!token) return (window.location.href = "/login");

    try {
      const res = await fetch(
        `http://localhost:5001/users/analyse?address=${address}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch analysis");
      }

      const data = await res.json();
      setAnalysisData(data);
      setSelectedAddress(address);
      setError("");
    } catch (err) {
      setError(err.message);
      setAnalysisData(null);
    }
  };

  const chartData =
    analysisData && analysisData.description
      ? {
          labels: ["Min", "25%", "50%", "75%", "Max"],
          datasets: [
            {
              label: "Consumption (kWh)",
              data: [
                analysisData.description.min ?? 0,
                analysisData.description["25%"] ?? 0,
                analysisData.description["50%"] ?? 0,
                analysisData.description["75%"] ?? 0,
                analysisData.description.max ?? 0,
              ],
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
            },
          ],
        }
      : null;

  return (
    <div className="p-6 bg-gray-700 rounded-lg shadow-lg text-white w-4/5 mx-auto mt-4">
      <h2 className="text-2xl font-bold mb-4">Clusters by Address</h2>

      {selectedAddress && (
        <button
          className="mb-4 bg-blue-600 py-2 px-4 rounded hover:bg-blue-700 transition"
          onClick={() => {
            setSelectedAddress("");
            setAnalysisData(null);
            setError("");
          }}>
          Back to Addresses
        </button>
      )}

      {!selectedAddress && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {addresses.map((addr) => (
            <button
              key={addr}
              className="p-4 bg-gray-600 rounded-lg hover:bg-gray-500 transition"
              onClick={() => handleAnalyse(addr)}>
              {addr}
            </button>
          ))}
        </div>
      )}

      {analysisData && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4">
            Analysis for {selectedAddress}
          </h3>

          <ul className="mb-4">
            {Object.entries(analysisData.description || {}).map(
              ([key, value]) => (
                <li key={key}>
                  <strong>{key}:</strong> {value}
                </li>
              )
            )}
          </ul>

          <h4 className="text-lg font-bold mb-2">Low Consumers</h4>
          <table className="w-full mb-6 border-collapse border border-gray-500">
            <thead>
              <tr className="bg-gray-600">
                <th className="border border-gray-500 px-4 py-2">#</th>
                <th className="border border-gray-500 px-4 py-2">
                  Consumer ID
                </th>
              </tr>
            </thead>
            <tbody>
              {(analysisData.low_consumers || []).map((id, index) => (
                <tr key={id} className="hover:bg-gray-700">
                  <td className="border border-gray-500 px-4 py-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">{id}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4 className="text-lg font-bold mb-2">High Consumers</h4>
          <table className="w-full border-collapse border border-gray-500">
            <thead>
              <tr className="bg-gray-600">
                <th className="border border-gray-500 px-4 py-2">#</th>
                <th className="border border-gray-500 px-4 py-2">
                  Consumer ID
                </th>
              </tr>
            </thead>
            <tbody>
              {(analysisData.high_consumers || []).map((id, index) => (
                <tr key={id} className="hover:bg-gray-700">
                  <td className="border border-gray-500 px-4 py-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">{id}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {chartData && (
            <>
              <h4 className="text-lg font-bold mb-2">Consumption Chart</h4>
              <Line data={chartData} />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ClustersAnalyse;
