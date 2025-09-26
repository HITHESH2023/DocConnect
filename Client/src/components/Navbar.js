import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-white text-2xl font-bold tracking-wide">
          DocConnect
        </Link>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:text-blue-200 focus:outline-none"
          >
            {isOpen ? (
              <XMarkIcon className="h-8 w-8" />
            ) : (
              <Bars3Icon className="h-8 w-8" />
            )}
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {!user ? (
            <>
              <Link to="/login" className="text-white hover:text-blue-200 transition duration-300">
                Login
              </Link>
              <Link to="/register" className="text-white hover:text-blue-200 transition duration-300">
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="text-white text-lg font-medium">
                Welcome, {user.name || user.email}! ({user.role})
              </span>
              {user.role === 'patient' && (
                <Link
                  to="/patient"
                  className="px-4 py-2 bg-white text-blue-700 rounded-lg shadow-md hover:bg-blue-100 transition duration-300 font-semibold"
                >
                  Dashboard
                </Link>
              )}
              {user.role === 'doctor' && (
                <Link
                  to="/doctor"
                  className="px-4 py-2 bg-white text-blue-700 rounded-lg shadow-md hover:bg-blue-100 transition duration-300 font-semibold"
                >
                  Dashboard
                </Link>
              )}
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="px-4 py-2 bg-yellow-400 text-gray-800 rounded-lg shadow-md hover:bg-yellow-500 transition duration-300 font-semibold"
                >
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-300 font-semibold"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-4 bg-blue-700 rounded-lg p-4 shadow-lg">
          {!user ? (
            <>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block text-white hover:text-blue-200 transition duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="block text-white hover:text-blue-200 transition duration-300"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="block text-white text-base font-medium mb-2">
                Welcome, {user.name || user.email}! ({user.role})
              </span>
              {user.role === 'patient' && (
                <Link
                  to="/patient"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-4 py-2 bg-white text-blue-700 rounded-lg shadow-md hover:bg-blue-100 transition duration-300 font-semibold"
                >
                  Dashboard
                </Link>
              )}
              {user.role === 'doctor' && (
                <Link
                  to="/doctor"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-4 py-2 bg-white text-blue-700 rounded-lg shadow-md hover:bg-blue-100 transition duration-300 font-semibold"
                >
                  Dashboard
                </Link>
              )}
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-4 py-2 bg-yellow-400 text-gray-800 rounded-lg shadow-md hover:bg-yellow-500 transition duration-300 font-semibold"
                >
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="block w-full text-center px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-300 font-semibold"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
