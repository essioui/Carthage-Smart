import React, { useEffect, useState } from "react";

const FacturationShow = () => {
  const [prediction, setPrediction] = useState([]);
  const [plotPath, setPlotPath] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPrediction = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "http://localhost:5001/contactauth/profile/facturation/show",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Invalid data format from server");

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

    fetchPrediction();
  }, []);

  if (loading) return <h2>Loading prediction...</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Prediction Data</h2>

      <table className="table-auto border-collapse border border-gray-300 mb-4">
        <thead>
          <tr>
            <th className="border border-gray-300 px-2 py-1">Date</th>
            <th className="border border-gray-300 px-2 py-1">Consumption</th>
          </tr>
        </thead>
        <tbody>
          {prediction.map((item, index) => (
            <tr key={index}>
              <td className="border border-gray-300 px-2 py-1">{item.date}</td>
              <td className="border border-gray-300 px-2 py-1">
                {item.consumption.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {plotPath && (
        <img
          src={plotPath}
          alt="Prediction Plot"
          style={{ width: "100%", maxWidth: "600px", height: "auto" }}
        />
      )}
    </div>
  );
};

export default FacturationShow;
