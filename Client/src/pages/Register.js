// import React, { useState } from "react";
// import API from "../utils/api";
// import { useNavigate, Link } from "react-router-dom";
// import MessageModal from "../components/MessageModal";

// export default function Register() {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "patient",
//     profileImage: "",
//     specialty: "",
//     bio: ""
//   });
//   const navigate = useNavigate();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalMessage, setModalMessage] = useState("");
//   const [modalTitle, setModalTitle] = useState("");
//   const [modalType, setModalType] = useState("info");

//   const handleRegister = async () => {
//     try {
//       const res = await API.post("/auth/register", form);
//       localStorage.setItem("token", res.data.token);
//       setModalTitle("Registration Successful");
//       setModalMessage("Account created! Redirecting to login...");
//       setModalType("success");
//       setIsModalOpen(true);
//       setTimeout(() => {
//         setIsModalOpen(false);
//         navigate("/");
//       }, 1500);
//     } catch (err) {
//       setModalTitle("Registration Failed");
//       setModalMessage(err.response?.data?.msg || "User already exists or invalid data.");
//       setModalType("error");
//       setIsModalOpen(true);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//       <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:scale-105">
//         <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Register</h2>
//         <div className="space-y-6">
//           <input
//             className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 placeholder-gray-500 text-lg"
//             placeholder="Name"
//             value={form.name}
//             onChange={(e) => setForm({ ...form, name: e.target.value })}
//           />
//           <input
//             className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 placeholder-gray-500 text-lg"
//             placeholder="Email"
//             type="email"
//             value={form.email}
//             onChange={(e) => setForm({ ...form, email: e.target.value })}
//           />
//           <input
//             className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 placeholder-gray-500 text-lg"
//             placeholder="Password"
//             type="password"
//             value={form.password}
//             onChange={(e) => setForm({ ...form, password: e.target.value })}
//           />
//           <select
//             className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 text-lg bg-white"
//             value={form.role}
//             onChange={(e) => setForm({ ...form, role: e.target.value })}
//           >
//             <option value="patient">Patient</option>
//             <option value="doctor">Doctor</option>
//           </select>

//           {form.role === "doctor" && (
//             <>
//               <input
//                 className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 placeholder-gray-500 text-lg"
//                 placeholder="Specialty (e.g., Cardiology)"
//                 value={form.specialty}
//                 onChange={(e) => setForm({ ...form, specialty: e.target.value })}
//               />
//               <input
//                 className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 placeholder-gray-500 text-lg"
//                 placeholder="Profile Image URL (optional)"
//                 value={form.profileImage}
//                 onChange={(e) => setForm({ ...form, profileImage: e.target.value })}
//               />
//               <textarea
//                 className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 placeholder-gray-500 text-lg"
//                 placeholder="Short Bio (optional)"
//                 rows="3"
//                 value={form.bio}
//                 onChange={(e) => setForm({ ...form, bio: e.target.value })}
//               ></textarea>
//             </>
//           )}

//           <button
//             onClick={handleRegister}
//             className="w-full bg-blue-600 text-white p-4 rounded-lg font-bold text-xl hover:bg-blue-700 transition duration-300 shadow-lg transform hover:-translate-y-1"
//           >
//             Register
//           </button>
//         </div>
//         <p className="mt-8 text-center text-gray-600">
//           Already have an account?{" "}
//           <Link to="/" className="text-blue-600 hover:underline font-semibold">
//             Login here
//           </Link>
//         </p>
//       </div>
//       <MessageModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         title={modalTitle}
//         message={modalMessage}
//         type={modalType}
//       />
//     </div>
//   );
// }


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
    profileImage: "",
    specialty: "",
    bio: ""
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
      setModalMessage("Account created! Please log in to continue."); // <-- CHANGED
      setModalType("success");
      setIsModalOpen(true);
      setTimeout(() => {
        setIsModalOpen(false);
        navigate("/login"); // <-- CHANGED
      }, 1500);
    } catch (err) {
      setModalTitle("Registration Failed");
      setModalMessage(err.response?.data?.msg || "User already exists or invalid data.");
      setModalType("error");
      setIsModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:scale-105">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Register</h2>
        <div className="space-y-6">
          <input
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 placeholder-gray-500 text-lg"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 placeholder-gray-500 text-lg"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 placeholder-gray-500 text-lg"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <select
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 text-lg bg-white"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>

          {form.role === "doctor" && (
            <>
              <input
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 placeholder-gray-500 text-lg"
                placeholder="Specialty (e.g., Cardiology)"
                value={form.specialty}
                onChange={(e) => setForm({ ...form, specialty: e.target.value })}
              />
              <input
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 placeholder-gray-500 text-lg"
                placeholder="Profile Image URL (optional)"
                value={form.profileImage}
                onChange={(e) => setForm({ ...form, profileImage: e.target.value })}
              />
              <textarea
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 placeholder-gray-500 text-lg"
                placeholder="Short Bio (optional)"
                rows="3"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              ></textarea>
            </>
          )}

          <button
            onClick={handleRegister}
            className="w-full bg-blue-600 text-white p-4 rounded-lg font-bold text-xl hover:bg-blue-700 transition duration-300 shadow-lg transform hover:-translate-y-1"
          >
            Register
          </button>
        </div>
        <p className="mt-8 text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-semibold"> {/* <-- CHANGED */}
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