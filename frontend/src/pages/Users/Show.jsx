import React, { useState, useEffect } from "react";

const Show = () => {
  const [showData, setShowData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

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
      .then((data) => {
        const uniqueAddresses = [
          ...new Set(data.clusters.map((c) => c.address)),
        ];
        setAddresses(uniqueAddresses);
      })
      .catch((err) => setError(err.message));
  }, []);

  const fetchShowData = async (region) => {
    setLoading(true);
    setError("");
    setShowData(null);
    setSelectedRegion(region);

    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const res = await fetch("http://localhost:5001/users/show", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ region }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setShowData(data);
      }
    } catch (err) {
      setError("Failed to fetch show data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-700 rounded-lg shadow-lg text-white w-4/5 mx-auto mt-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Show Prediction</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {addresses.map((addr) => (
          <button
            key={addr}
            onClick={() => fetchShowData(addr)}
            className={`p-4 rounded-lg transition ${
              selectedRegion === addr
                ? "bg-yellow-600"
                : "bg-gray-600 hover:bg-gray-500"
            }`}>
            {addr}
          </button>
        ))}
      </div>

      {loading && <p className="text-yellow-400">Loading...</p>}
      {error && <p className="text-red-400 mb-4">{error}</p>}

      {showData && (
        <div className="bg-gray-600 p-4 rounded">
          <h3 className="text-xl font-bold mb-2">
            Prediction Result for {selectedRegion}
          </h3>

          <div className="flex flex-col md:flex-row gap-6">
            {showData.data?.predicted && (
              <div className="overflow-x-auto md:w-1/2">
                <table className="w-full text-white border border-gray-500">
                  <thead>
                    <tr>
                      <th className="border px-2 py-1">Date</th>
                      <th className="border px-2 py-1">Predicted Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(showData.data.predicted).map(
                      ([date, value]) => (
                        <tr key={date}>
                          <td className="border px-2 py-1">{date}</td>
                          <td className="border px-2 py-1">{value}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {showData.plot_base64 && (
              <div className="md:w-1/2 flex justify-center items-center">
                <img
                  src={showData.plot_base64}
                  alt="Prediction Plot"
                  className="rounded shadow-lg max-h-[500px]"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Show;
