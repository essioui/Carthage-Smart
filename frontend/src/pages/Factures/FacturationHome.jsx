import React from "react";
import { Link } from "react-router-dom";

function FacturationHome() {
  const facturationCards = [
    {
      title: "Monthly",
      description: "View your total consumption and invoices for each month.",
      icon: "📅",
      link: "monthly",
      color: "bg-blue-600",
    },
    {
      title: "Calculate",
      description:
        "Calculate your invoice for a specific period based on your consumption.",
      icon: "💰",
      link: "calculate",
      color: "bg-green-600",
    },
    {
      title: "All",
      description:
        "See a complete list of all your consumption records and invoices.",
      icon: "📊",
      link: "all",
      color: "bg-purple-600",
    },
    {
      title: "Predict",
      description:
        "Get a forecast of your future consumption based on previous data.",
      icon: "🔮",
      link: "predict",
      color: "bg-yellow-600",
    },
    {
      title: "Show",
      description:
        "Display detailed information about a specific invoice or month.",
      icon: "📝",
      link: "show",
      color: "bg-pink-600",
    },
  ];

  return (
    <div className="p-4 bg-gray-700 rounded w-4/5 mx-auto mt-2 text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Facturation Overview
      </h2>
      <p className="mb-6 text-center">
        Welcome! Use the sections below to manage your electricity consumption
        and invoices. Click any card to go to that section.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facturationCards.map((card, index) => (
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

export default FacturationHome;
