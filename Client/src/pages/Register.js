import React, { useState } from "react";
import API from "../utils/api";
import { useNavigate, Link } from "react-router-dom";
import MessageModal from "../components/MessageModal";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
    specialty: "",
    bio: "",
    profileImage: "https://placehold.co/150x150/aabbcc/ffffff?text=DR",
    state: "",
    city: "",
    pincode: ""
  });

  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalType, setModalType] = useState("info");

  const handleRegister = async () => {
    try {
      await API.post("/auth/register", form);
      setModalTitle("Registration Successful");
      setModalMessage("Account created! Please log in to continue.");
      setModalType("success");
      setIsModalOpen(true);
      setTimeout(() => {
        setIsModalOpen(false);
        navigate("/login");
      }, 1500);
    } catch (err) {
      setModalTitle("Registration Failed");
      setModalMessage(err.response?.data?.msg || "User already exists or invalid data.");
      setModalType("error");
      setIsModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-xl shadow-2xl w-full max-w-md sm:max-w-lg transform transition-all duration-300 hover:scale-105">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center text-gray-800 mb-6 sm:mb-8">
          Register
        </h2>

        <div className="space-y-4 sm:space-y-6">
          <input
            className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 placeholder-gray-500 text-base sm:text-lg"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 placeholder-gray-500 text-base sm:text-lg"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 placeholder-gray-500 text-base sm:text-lg"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <select
            className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 text-base sm:text-lg bg-white"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>

          {form.role === "doctor" && (
            <>
              <input
                className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 placeholder-gray-500 text-base sm:text-lg"
                placeholder="Specialty (e.g., Cardiology)"
                value={form.specialty}
                onChange={(e) => setForm({ ...form, specialty: e.target.value })}
              />
              <input
                className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 placeholder-gray-500 text-base sm:text-lg"
                placeholder="Profile Image URL (optional)"
                value={form.profileImage}
                onChange={(e) => setForm({ ...form, profileImage: e.target.value })}
              />
              <textarea
                className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 placeholder-gray-500 text-base sm:text-lg resize-none"
                placeholder="Short Bio (optional)"
                rows="3"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              ></textarea>
              <input
                className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 placeholder-gray-500 text-base sm:text-lg"
                placeholder="State"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
              />
              <input
                className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 placeholder-gray-500 text-base sm:text-lg"
                placeholder="City / District"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
              <input
                className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 placeholder-gray-500 text-base sm:text-lg"
                placeholder="Pincode"
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
              />
            </>
          )}

          <button
            onClick={handleRegister}
            className="w-full bg-blue-600 text-white p-3 sm:p-4 rounded-lg font-bold text-lg sm:text-xl hover:bg-blue-700 transition duration-300 shadow-lg transform hover:-translate-y-1"
          >
            Register
          </button>
        </div>

        <p className="mt-6 sm:mt-8 text-center text-gray-600 text-sm sm:text-base">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-semibold">
            Login here
          </Link>
        </p>
      </div>

      <MessageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        message={modalMessage}
        type={modalType}
      />
    </div>
  );
}
