// import React, { useContext } from 'react';
// import { Link } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';

// const Navbar = () => {
//   const { user, logout } = useContext(AuthContext);

//   return (
//     <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 shadow-lg">
//       <div className="container mx-auto flex justify-between items-center">
//         <Link to={user ? (user.role === 'doctor' ? '/doctor' : '/patient') : '/'} className="text-white text-2xl font-bold tracking-wide">
//           DocConnect
//         </Link>
//         <div className="flex items-center space-x-6">
//           {!user ? (
//             <>
//               <Link to="/" className="text-white hover:text-blue-200 transition duration-300">Login</Link>
//               <Link to="/register" className="text-white hover:text-blue-200 transition duration-300">Register</Link>
//             </>
//           ) : (
//             <>
//               <span className="text-white text-lg font-medium">Welcome, {user.name || user.email}! ({user.role})</span>
//               {user.role === 'patient' && (
//                 <Link to="/book" className="px-4 py-2 bg-white text-blue-700 rounded-lg shadow-md hover:bg-blue-100 transition duration-300 font-semibold">
//                   Book Appointment
//                 </Link>
//               )}
//               {user.role === 'admin' && ( // <--- NEW ADMIN LINK
//                 <Link to="/admin" className="px-4 py-2 bg-yellow-400 text-gray-800 rounded-lg shadow-md hover:bg-yellow-500 transition duration-300 font-semibold">
//                   Admin Dashboard
//                 </Link>
//               )}
//               <button
//                 onClick={logout}
//                 className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-300 font-semibold"
//               >
//                 Logout
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold tracking-wide"> {/* <-- CHANGED */}
          DocConnect
        </Link>
        <div className="flex items-center space-x-6">
          {!user ? (
            <>
              <Link to="/login" className="text-white hover:text-blue-200 transition duration-300">Login</Link> {/* <-- CHANGED */}
              <Link to="/register" className="text-white hover:text-blue-200 transition duration-300">Register</Link>
            </>
          ) : (
            <>
              <span className="text-white text-lg font-medium">Welcome, {user.name || user.email}! ({user.role})</span>
              {user.role === 'patient' && (
                <Link to="/patient" className="px-4 py-2 bg-white text-blue-700 rounded-lg shadow-md hover:bg-blue-100 transition duration-300 font-semibold">
                  Dashboard
                </Link>
              )}
               {user.role === 'doctor' && (
                <Link to="/doctor" className="px-4 py-2 bg-white text-blue-700 rounded-lg shadow-md hover:bg-blue-100 transition duration-300 font-semibold">
                  Dashboard
                </Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" className="px-4 py-2 bg-yellow-400 text-gray-800 rounded-lg shadow-md hover:bg-yellow-500 transition duration-300 font-semibold">
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
    </nav>
  );
};

export default Navbar;
