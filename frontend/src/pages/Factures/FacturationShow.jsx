import React, { useEffect, useState } from "react";

const FacturationShow = () => {
  const [prediction, setPrediction] = useState([]);
  const [plotPath, setPlotPath] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "http://localhost:5001/contactauth/profile/facturation/show",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("Failed to fetch prediction data");
        const data = await res.json();

        const predArray = Object.entries(data.data.predicted).map(
          ([date, consumption]) => ({
            date,
            consumption: Number(consumption),
          })
        );
        setPrediction(predArray);

        setPlotPath(
          data.data.plot_path
            ? `http://localhost:5001/${data.data.plot_path}`
            : ""
        );
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <h2>Loading data...</h2>;
  if (error) return <h2>Error: {error}</h2>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Prediction Data</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-full">
          <table className="table-auto border-collapse border border-gray-300 w-full h-full">
            <thead>
              <tr>
                <th className="border border-gray-300 px-2 py-1">Date</th>
                <th className="border border-gray-300 px-2 py-1">
                  Consumption
                </th>
              </tr>
            </thead>
            <tbody>
              {prediction.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-2 py-1">
                    {item.date}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    {item.consumption.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col h-full items-center space-y-4">
          {plotPath && (
            <img
              src={plotPath}
              alt="Prediction Plot"
              className="w-full h-[300px] object-contain rounded shadow"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FacturationShow;
