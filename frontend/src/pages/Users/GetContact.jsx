import React, { useState, useEffect } from "react";

const GetContact = () => {
  const [contacts, setContacts] = useState([]);
  const [contactId, setContactId] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  if (!token) window.location.href = "/login";

  useEffect(() => {
    fetch("http://localhost:5001/users/info", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setContacts(data.contacts))
      .catch(() => setError("Failed to fetch contacts"));
  }, [token]);

  const handleFetchContact = async () => {
    if (!contactId) {
      setError("Please enter a Contact ID");
      return;
    }

    setLoading(true);
    setError("");
    setSelectedContact(null);

    try {
      const res = await fetch(
        `http://localhost:5001/users/contact/${contactId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error("Contact not found");

      const data = await res.json();
      setSelectedContact(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedContact(null);
    setContactId("");
    setError("");
  };

  return (
    <div className="p-6 bg-gray-700 min-h-screen text-white">
      {/* Navbar */}
      <div className="flex justify-between items-center bg-gray-800 p-4 rounded-lg shadow-lg mb-6">
        <h1 className="text-xl font-bold">Contacts</h1>
        <div className="flex space-x-2">
          <input
            type="text"
            value={contactId}
            onChange={(e) => setContactId(e.target.value)}
            placeholder="Enter Contact ID"
            className="px-3 py-2 rounded-lg text-black w-64"
          />
          <button
            onClick={handleFetchContact}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg">
            Search
          </button>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {selectedContact && (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <button
            onClick={handleBack}
            className="mb-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg">
            Back to Menu
          </button>
          <h2 className="text-lg font-bold mb-2">Contact Information</h2>
          <p>
            <strong>User Name:</strong> {selectedContact.user_name}
          </p>
          <p>
            <strong>CIN:</strong> {selectedContact.CIN}
          </p>
          <p>
            <strong>Address:</strong> {selectedContact.address}
          </p>
        </div>
      )}

      {!selectedContact && contacts.length > 0 && (
        <table className="w-full text-white border border-gray-500">
          <thead>
            <tr>
              <th className="border px-2 py-1">User Name</th>
              <th className="border px-2 py-1">CIN</th>
              <th className="border px-2 py-1">Address</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((c) => (
              <tr key={c._id} className="hover:bg-gray-600">
                <td className="border px-2 py-1">{c.user_name}</td>
                <td className="border px-2 py-1">{c.CIN}</td>
                <td className="border px-2 py-1">{c.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default GetContact;
