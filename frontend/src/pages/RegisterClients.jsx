import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RegisterClients() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    user_name: "",
    CIN: "",
    password: "",
    passwordConfirm: "",
    address: "",
  });
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState("");
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(mediaStream);
      setIsCameraOpen(true);
    } catch (err) {
      console.error("Camera error:", err);
      setMessage("Cannot access camera");
    }
  };

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  }, [stream]);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        setPhoto(new File([blob], "camera_photo.png", { type: "image/png" }));
        closeCamera();
      }
    }, "image/png");
  };

  const closeCamera = () => {
    if (videoRef.current && stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setStream(null);
    setIsCameraOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photo) {
      setMessage("Photo is required");
      return;
    }

    try {
      const data = new FormData();
      data.append("user_name", formData.user_name);
      data.append("CIN", formData.CIN);
      data.append("password", formData.password);
      data.append("passwordConfirm", formData.passwordConfirm);
      data.append("address", formData.address);
      data.append("photo", photo);

      const res = await fetch("http://localhost:5001/contactauth/register", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (res.ok) {
        localStorage.setItem("token", result.token);
        setMessage(`Registered successfully: ${result.user_name}`);

        navigate("/Clients/profile");
      } else {
        setMessage(`no, ${result.message || "Registration failed"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("no, Network error");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Register Client</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          name="user_name"
          placeholder="User Name"
          value={formData.user_name}
          onChange={handleChange}
          className="border p-2 rounded text-black"
        />
        <input
          type="text"
          name="CIN"
          placeholder="CIN"
          value={formData.CIN}
          onChange={handleChange}
          className="border p-2 rounded text-black"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="border p-2 rounded text-black"
        />
        <input
          type="password"
          name="passwordConfirm"
          placeholder="Confirm Password"
          value={formData.passwordConfirm}
          onChange={handleChange}
          className="border p-2 rounded text-black"
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="border p-2 rounded text-black"
        />

        <label className="font-medium">Choose photo from PC:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="border p-2 rounded"
        />

        <button
          type="button"
          onClick={openCamera}
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600">
          Take Photo with Camera
        </button>

        {isCameraOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50 p-4">
            <video
              ref={videoRef}
              className="w-full max-w-md rounded border-2 border-white"
              autoPlay
            />
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={capturePhoto}
                className="bg-red-500 text-white p-2 rounded hover:bg-red-600">
                Capture
              </button>
              <button
                type="button"
                onClick={closeCamera}
                className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600">
                Close
              </button>
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mt-3">
          Register
        </button>
      </form>

      {message && <p className="mt-3">{message}</p>}
    </div>
  );
}

export default RegisterClients;
