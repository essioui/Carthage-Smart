import React, { useEffect, useState } from "react";

const Clusters = () => {
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");

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
      .then((data) => setContacts(data.clusters))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="text-red-400">{error}</p>;
  if (!contacts.length) return <p>Loading clusters...</p>;

  const addresses = [...new Set(contacts.map((c) => c.address))];

  const filteredContacts = selectedAddress
    ? contacts.filter((c) => c.address === selectedAddress)
    : [];

  return (
    <div className="p-6 bg-gray-700 rounded-lg shadow-lg text-white w-4/5 mx-auto mt-4">
      <h2 className="text-2xl font-bold mb-4">Clusters by Address</h2>

      {/* قائمة العناوين */}
      {!selectedAddress && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {addresses.map((addr) => (
            <button
              key={addr}
              className="p-4 bg-gray-600 rounded-lg hover:bg-gray-500 transition"
              onClick={() => setSelectedAddress(addr)}>
              {addr}
            </button>
          ))}
        </div>
      )}

      {selectedAddress && (
        <div className="mt-6">
          <button
            className="mb-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
            onClick={() => setSelectedAddress("")}>
            Back to addresses
          </button>

          <h3 className="text-xl font-bold mb-2">
            Contacts at "{selectedAddress}"
          </h3>
          <table className="w-full text-white border border-gray-500">
            <thead>
              <tr>
                <th className="border px-2 py-1">User Name</th>
                <th className="border px-2 py-1">Cluster</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((c) => (
                <tr key={c._id}>
                  <td className="border px-2 py-1">{c.name}</td>
                  <td className="border px-2 py-1">{c.cluster}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Clusters;
