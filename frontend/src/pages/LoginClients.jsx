import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

function LoginClients() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [faceData, setFaceData] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [message, setMessage] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setFaceData("");
      setMessage("");
    } catch (error) {
      console.error("Camera error:", error);
      setMessage("Cannot access camera");
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.5);
    setFaceData(dataUrl);
    setMessage("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.5);
        setFaceData(dataUrl);
        setMessage("");
        console.log("Compressed image size:", dataUrl.length / 1024, "KB");
      };
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = () => {
    if (!urlInput) return;
    setFaceData(urlInput);
    setMessage("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!faceData && (!userName || !password)) {
      setMessage("Please provide username + password or select a face");
      return;
    }

    let url = "";
    let bodyData = {};

    if (faceData) {
      url = "http://localhost:5001/face/recognize";
      bodyData = { source: faceData };
    } else {
      url = "http://localhost:5001/contactauth/login";
      bodyData = { user_name: userName, password: password };
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token) localStorage.setItem("token", data.token);
        setMessage(`Login successful! User: ${data.user_name}`);
        navigate("/Clients/profile");
      } else {
        setMessage(data.error || data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Server connection error");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-gray-700 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-white">
        Client Login
      </h2>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="border p-2 rounded text-black"
          disabled={!!faceData}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded text-black"
          disabled={!!faceData}
        />

        <div className="flex flex-col gap-2">
          <p className="font-semibold text-white">Or login with face:</p>
          {faceData ? (
            <img
              src={faceData}
              alt="Face preview"
              className="border rounded w-full h-48 object-contain bg-black"
            />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              className="border rounded w-full h-48 object-cover"
            />
          )}
          <canvas ref={canvasRef} style={{ display: "none" }} />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={startCamera}
              className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600 transition">
              Start Camera
            </button>
            <button
              type="button"
              onClick={capturePhoto}
              className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 transition">
              Capture Photo
            </button>
          </div>

          <input type="file" accept="image/*" onChange={handleFileChange} />

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Image URL"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="border p-2 rounded flex-1 text-black"
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600 transition">
              Use URL
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="bg-purple-500 text-white py-2 rounded hover:bg-purple-600 transition">
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginClients;
