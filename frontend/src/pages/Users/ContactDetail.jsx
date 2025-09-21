import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const ContactDetail = () => {
  const { id } = useParams();
  const [contact, setContact] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetch(`http://localhost:5001/users/contact/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Contact not found");
        return res.json();
      })
      .then((data) => setContact(data))
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p className="text-red-400">{error}</p>;
  if (!contact) return <p>Loading contact details...</p>;

  return (
    <div className="p-6 bg-gray-700 rounded-lg shadow-lg text-white w-4/5 mx-auto mt-4">
      <h2 className="text-2xl font-bold mb-4">Contact Details</h2>
      <p>
        <strong>User Name:</strong> {contact.user_name}
      </p>
      <p>
        <strong>CIN:</strong> {contact.CIN}
      </p>
      <p>
        <strong>Address:</strong> {contact.address}
      </p>
      <Link
        to="/profileAdmins/getContact"
        className="mt-4 inline-block text-blue-400 hover:underline">
        Back to Contacts
      </Link>
    </div>
  );
};

export default ContactDetail;
