import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("No token found. Please login first.");
        return;
      }

      try {
        const res = await fetch("http://localhost:5001/contactauth/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setUser(data);
        } else {
          setMessage(`no ${data.message || "Failed to fetch profile"}`);
        }
      } catch (err) {
        console.error(err);
        setMessage("no Network error");
      }
    };

    fetchProfile();
  }, []);

  if (message) {
    return <p className="text-red-500 mt-4 text-center">{message}</p>;
  }

  if (!user) {
    return <p className="mt-4 text-center">Loading profile...</p>;
  }

  return (
    <div className="p-12 bg-gray-500 shadow rounded-lg mt-6 w-4/5 mx-auto">
      <div className="flex items-center border-b border-gray-400 pb-2">
        <img
          src={`http://localhost:5001/${user.photo}`}
          alt="Profile"
          className="w-24 h-24 object-cover rounded-full mr-16"
        />
        <div className="flex space-x-12">
          <p>
            <strong>Name:</strong> {user.user_name}
          </p>
          <p>
            <strong>CIN:</strong> {user.CIN}
          </p>
          <p>
            <strong>Address:</strong> {user.address}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-4 text-white">
          Welcome to your profile. Here you can manage your consumption and
          billing.
        </p>

        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6 text-center text-white mt-6">
          <div className="flex flex-col items-center mt-4">
            <p className="mb-2">
              📄 Add Daily Consumption: Upload your daily consumption using a
              CSV file.
            </p>
            <Link
              to="/Clients/profile/daily"
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 mt-4">
              Add Daily Consumption
            </Link>
          </div>

          <div className="flex flex-col items-center mt-4">
            <p className="mb-2">
              📊 Export to CSV: View all your past consumption records.
            </p>
            <Link
              to="/Clients/profile/daily/export"
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 mt-4">
              Export to CSV
            </Link>
          </div>

          <div className="flex flex-col items-center mt-4">
            <p className="mb-2">
              💰 Facturation: See total consumption per month, calculate
              invoices, and view all bills.
            </p>
            <Link
              to="/Clients/profile/facturation"
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 mt-4">
              Facturation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
