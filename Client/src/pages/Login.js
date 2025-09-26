import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import MessageModal from '../components/MessageModal';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalType, setModalType] = useState('info');

  const handleLogin = async () => {
    try {
      const res = await API.post('/auth/login', { email, password });
      login(res.data.token);
      const payload = JSON.parse(atob(res.data.token.split('.')[1]));
      const role = payload.role;
      setModalTitle('Login Successful');
      setModalMessage('Redirecting to dashboard...');
      setModalType('success');
      setIsModalOpen(true);
      setTimeout(() => {
        setIsModalOpen(false);
        if (role === "doctor") {
          navigate("/doctor");
        } else if (role === "patient") {
          navigate("/patient");
        } else if (role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 1500);
    } catch (err) {
      setModalTitle('Login Failed');
      setModalMessage(err.response?.data?.msg || 'Invalid credentials. Please try again.');
      setModalType('error');
      setIsModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md transform transition-all duration-300 hover:scale-[1.02]">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-gray-800 mb-6 sm:mb-8">
          Login
        </h2>
        <div className="space-y-4 sm:space-y-6">
          <input
            className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 placeholder-gray-500 text-base sm:text-lg"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 placeholder-gray-500 text-base sm:text-lg"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white p-3 sm:p-4 rounded-lg font-bold text-lg sm:text-xl hover:bg-blue-700 transition duration-300 shadow-lg transform hover:-translate-y-1"
          >
            Login
          </button>
        </div>
        <p className="mt-6 sm:mt-8 text-center text-gray-600 text-sm sm:text-base">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-semibold">
            Register here
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

export default Login;
