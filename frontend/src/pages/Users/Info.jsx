import React, { useEffect, useState } from "react";

const Info = () => {
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetch("http://localhost:5001/users/info", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setContacts(data.contacts);
      })
      .catch((err) => setError("Failed to fetch info"));
  }, []);

  if (error) return <p className="text-red-400">{error}</p>;
  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-gray-700 rounded-lg shadow-lg text-white w-4/5 mx-auto mt-4">
      <h2 className="text-2xl font-bold mb-4">User Info</h2>
      <p>
        <strong>Name:</strong> {user.user_name}
      </p>
      <p>
        <strong>CIN:</strong> {user.CIN}
      </p>

      <h3 className="text-xl font-bold mt-6 mb-2">Contacts</h3>
      {contacts.length === 0 ? (
        <p>No contacts found.</p>
      ) : (
        <table className="w-full text-white border border-gray-500">
          <thead>
            <tr>
              <th className="border px-2 py-1">User Name</th>
              <th className="border px-2 py-1">CIN</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((c) => (
              <tr key={c._id}>
                <td className="border px-2 py-1">{c.user_name}</td>
                <td className="border px-2 py-1">{c.CIN}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Info;
