import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [user_name, setUserName] = useState("");
  const [CIN, setCIN] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5001/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_name, CIN, password, passwordConfirm }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          user_name: data.user_name,
          CIN: data.CIN,
          _id: data._id,
        })
      );

      navigate("/Admins/profileAdmins");
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-800">
      <form
        onSubmit={handleRegister}
        className="bg-gray-600 p-8 rounded-lg shadow-lg w-96 text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block mb-1">Username</label>
          <input
            type="text"
            value={user_name}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter username"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">CIN</label>
          <input
            type="text"
            value={CIN}
            onChange={(e) => setCIN(e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter CIN"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter password"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1">Confirm Password</label>
          <input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Confirm password"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gray-500 py-2 rounded-lg hover:bg-gray-400 transition">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
