import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function HomeAdmins() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || { user_name: "", CIN: "" }
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetch("http://localhost:5001/users/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser({
          user_name: data.user_name,
          CIN: data.CIN,
        });
      })
      .catch((err) => console.error("Failed to fetch profile:", err));
  }, []);

  const adminCards = [
    {
      title: "Info",
      description: "View user info",
      link: "info",
      color: "bg-blue-600",
      icon: "ℹ️",
    },
    {
      title: "Get Contact",
      description: "View contacts",
      link: "getContact",
      color: "bg-green-600",
      icon: "📇",
    },
    {
      title: "Factures",
      description: "View invoices",
      link: "factures",
      color: "bg-purple-600",
      icon: "📄",
    },
    {
      title: "Clusters",
      description: "View client clusters",
      link: "clusters",
      color: "bg-yellow-600",
      icon: "🗂️",
    },
    {
      title: "Analyse",
      description: "Analyze data",
      link: "analyse",
      color: "bg-pink-600",
      icon: "📊",
    },
    {
      title: "Predict + Show",
      description: "Show detailed info",
      link: "show",
      color: "bg-red-600",
      icon: "🔮",
    },
    {
      title: "Data",
      description: "Get last month consumption",
      link: "data",
      color: "bg-teal-600",
      icon: "📊",
    },
  ];

  return (
    <div className="p-4 bg-gray-700 rounded w-4/5 mx-auto mt-4 text-white">
      {/* Header */}
      <div className="mb-6 p-4 bg-gray-600 rounded-lg shadow">
        <h2 className="text-2xl font-bold">
          Welcome, {user.user_name || "Loading..."}
        </h2>
        <p>CIN: {user.CIN || "Loading..."}</p>
      </div>

      <h2 className="text-3xl font-bold mb-6 text-center">Admin Panel</h2>
      <p className="mb-6 text-center">
        Click on any card below to go to that section.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminCards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className={`flex flex-col justify-between p-6 rounded-lg shadow-lg hover:scale-105 transform transition-all duration-200 ${card.color}`}>
            <div className="text-4xl mb-4">{card.icon}</div>
            <h3 className="text-xl font-bold mb-2">{card.title}</h3>
            <p className="text-sm">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HomeAdmins;
