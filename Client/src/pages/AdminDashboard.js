import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';
import MessageModal from '../components/MessageModal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function AdminDashboard() {
  const { user, token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]); // For creating new appointments
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalType, setModalType] = useState('info');

  const [newAppointmentForm, setNewAppointmentForm] = useState({
    doctorId: '',
    patientId: '',
    date: new Date(),
    time: '09:00',
  });

  // NEW STATE FOR REGISTERING USERS BY ADMIN
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
    profileImage: '',
    specialty: '',
    bio: ''
  });

  // Helper to format date to YYYY-MM-DD
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  };

  const fetchAllData = async () => {
    if (!token || user?.role !== 'admin') {
      setLoading(false);
      setError("Unauthorized access. Admin privileges required.");
      return;
    }
    try {
      const usersRes = await API.get('/admin/users');
      setUsers(usersRes.data);

      const appointmentsRes = await API.get('/admin/appointments');
      // Sort appointments by date and then time for better display
      const sortedAppointments = appointmentsRes.data.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA - dateB;
      });
      setAppointments(sortedAppointments);

      // Fetch doctors for appointment creation dropdown
      const doctorsRes = await API.get('/admin/users'); // Assuming this returns all users, filter for doctors
      setDoctors(doctorsRes.data.filter(u => u.role === 'doctor'));

    } catch (err) {
      console.error('Error fetching data:', err.response?.data?.msg || err.message);
      setError('Failed to fetch data.');
      setModalTitle('Error');
      setModalMessage(err.response?.data?.msg || 'Failed to fetch data.');
      setModalType('error');
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [token, user]);

  const handleCreateAppointment = async () => {
    try {
      await API.post('/admin/appointments', {
        ...newAppointmentForm,
        date: formatDate(newAppointmentForm.date),
      });
      setModalTitle('Success');
      setModalMessage('Appointment created successfully!');
      setModalType('success');
      setIsModalOpen(true);
      fetchAllData(); // Refresh data
      setNewAppointmentForm({ doctorId: '', patientId: '', date: new Date(), time: '09:00' });
    } catch (err) {
      setModalTitle('Error');
      setModalMessage(err.response?.data?.msg || 'Failed to create appointment.');
      setModalType('error');
      setIsModalOpen(true);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user and all associated data?")) {
      try {
        await API.delete(`/admin/users/${userId}`);
        setModalTitle('Success');
        setModalMessage('User deleted successfully!');
        setModalType('success');
        setIsModalOpen(true);
        fetchAllData(); // Refresh data
      } catch (err) {
        setModalTitle('Error');
        setModalMessage(err.response?.data?.msg || 'Failed to delete user.');
        setModalType('error');
        setIsModalOpen(true);
      }
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        await API.delete(`/admin/appointments/${appointmentId}`);
        setModalTitle('Success');
        setModalMessage('Appointment deleted successfully!');
        setModalType('success');
        setIsModalOpen(true);
        fetchAllData(); // Refresh data
      } catch (err) {
        setModalTitle('Error');
        setModalMessage(err.response?.data?.msg || 'Failed to delete appointment.');
        setModalType('error');
        setIsModalOpen(true);
      }
    }
  };

  // NEW: Handle registration of new user by admin
  const handleRegisterUserByAdmin = async () => {
    try {
      await API.post('/admin/register-user', newUserForm);
      setModalTitle('Success');
      setModalMessage('User registered successfully!');
      setModalType('success');
      setIsModalOpen(true);
      fetchAllData(); // Refresh user list
      setNewUserForm({ name: '', email: '', password: '', role: 'patient', profileImage: '', specialty: '', bio: '' }); // Reset form
    } catch (err) {
      setModalTitle('Registration Failed');
      setModalMessage(err.response?.data?.msg || 'Failed to register user.');
      setModalType('error');
      setIsModalOpen(true);
    }
  };

  // Group appointments by date
  const groupedAppointments = appointments.reduce((acc, appointment) => {
    const date = appointment.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(appointment);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedAppointments).sort((a, b) => new Date(a) - new Date(b));

  if (loading) return <p className="text-center text-xl mt-8">Loading admin dashboard...</p>;
  if (error) return <p className="text-center text-xl mt-8 text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-5xl font-extrabold text-center text-blue-800 mb-12 shadow-text">Admin Dashboard</h1>

      {/* Register New User Section */}
      <div className="bg-white p-8 rounded-lg shadow-xl mb-12 border-t-4 border-purple-500">
        <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">Register New User</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <input
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            placeholder="Name"
            type="text"
            value={newUserForm.name}
            onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
          />
          <input
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            placeholder="Email"
            type="email"
            value={newUserForm.email}
            onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
          />
          <input
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            placeholder="Password"
            type="password"
            value={newUserForm.password}
            onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
          />
          <select
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white"
            value={newUserForm.role}
            onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="admin">Admin</option>
          </select>

          {newUserForm.role === 'doctor' && (
            <>
              <input
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Specialty (e.g., Cardiology)"
                type="text"
                value={newUserForm.specialty}
                onChange={(e) => setNewUserForm({ ...newUserForm, specialty: e.target.value })}
              />
              <input
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Profile Image URL (optional)"
                type="text"
                value={newUserForm.profileImage}
                onChange={(e) => setNewUserForm({ ...newUserForm, profileImage: e.target.value })}
              />
              <textarea
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 md:col-span-2"
                placeholder="Short Bio (optional)"
                rows="3"
                value={newUserForm.bio}
                onChange={(e) => setNewUserForm({ ...newUserForm, bio: e.target.value })}
              ></textarea>
            </>
          )}
        </div>
        <button
          onClick={handleRegisterUserByAdmin}
          className="w-full bg-purple-600 text-white p-4 rounded-lg font-bold text-xl hover:bg-purple-700 transition duration-300 shadow-lg"
        >
          Register User
        </button>
      </div>


      {/* Create New Appointment Section */}
      <div className="bg-white p-8 rounded-lg shadow-xl mb-12 border-t-4 border-blue-500">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Create New Appointment</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <select
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            value={newAppointmentForm.doctorId}
            onChange={(e) => setNewAppointmentForm({ ...newAppointmentForm, doctorId: e.target.value })}
          >
            <option value="">Select Doctor</option>
            {doctors.map((doc) => (
              <option key={doc._id} value={doc._id}>
                {doc.name} ({doc.specialty})
              </option>
            ))}
          </select>
          <select
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            value={newAppointmentForm.patientId}
            onChange={(e) => setNewAppointmentForm({ ...newAppointmentForm, patientId: e.target.value })}
          >
            <option value="">Select Patient</option>
            {users.filter(u => u.role === 'patient').map((pat) => (
              <option key={pat._id} value={pat._id}>
                {pat.name} ({pat.email})
              </option>
            ))}
          </select>
          <DatePicker
            selected={newAppointmentForm.date}
            onChange={(date) => setNewAppointmentForm({ ...newAppointmentForm, date })}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
            dateFormat="yyyy-MM-dd"
          />
          <input
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            type="time"
            value={newAppointmentForm.time}
            onChange={(e) => setNewAppointmentForm({ ...newAppointmentForm, time: e.target.value })}
          />
        </div>
        <button
          onClick={handleCreateAppointment}
          className="w-full bg-blue-600 text-white p-4 rounded-lg font-bold text-xl hover:bg-blue-700 transition duration-300 shadow-lg"
        >
          Create Appointment
        </button>
      </div>

      {/* All Users Section */}
      <div className="bg-white p-8 rounded-lg shadow-xl mb-12 border-t-4 border-green-500">
        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">All Users</h2>
        <div className="overflow-x-auto">
          {users.length > 0 ? (
            <table className="min-w-full leading-normal">
              <thead>
                <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Name</th>
                  <th className="py-3 px-6 text-left">Email</th>
                  <th className="py-3 px-6 text-left">Role</th>
                  <th className="py-3 px-6 text-left">Specialty</th>
                  <th className="py-3 px-6 text-left">User ID</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {users.map((userItem) => (
                  <tr key={userItem._id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      <div className="flex items-center">
                        <img className="w-8 h-8 rounded-full object-cover mr-3" src={userItem.profileImage || "https://placehold.co/100x100/aabbcc/ffffff?text=U"} alt="Profile" />
                        <span>{userItem.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-left">{userItem.email}</td>
                    <td className="py-3 px-6 text-left">
                      <span className={`py-1 px-3 rounded-full text-xs font-semibold ${
                          userItem.role === 'admin' ? 'bg-purple-200 text-purple-800' :
                          userItem.role === 'doctor' ? 'bg-blue-200 text-blue-800' :
                          'bg-gray-200 text-gray-800'
                        }`}>
                        {userItem.role}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-left">{userItem.specialty || 'N/A'}</td>
                    <td className="py-3 px-6 text-left text-xs font-mono">{userItem._id}</td>
                    <td className="py-3 px-6 text-center">
                      <button
                        onClick={() => handleDeleteUser(userItem._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-600 transition duration-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-600 text-lg">No users found.</p>
          )}
        </div>
      </div>

      {/* All Appointments Section - Now Grouped by Date */}
      <div className="bg-white p-8 rounded-lg shadow-xl border-t-4 border-indigo-500">
        <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">All Appointments</h2>
        {sortedDates.length > 0 ? (
          sortedDates.map(date => (
            <div key={date} className="mb-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 bg-gray-100 p-3 rounded-md border-l-4 border-indigo-400">
                Appointments on {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full leading-normal">
                  <thead>
                    <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                      <th className="py-3 px-6 text-left">Time</th>
                      <th className="py-3 px-6 text-left">Doctor</th>
                      <th className="py-3 px-6 text-left">Patient</th>
                      <th className="py-3 px-6 text-left">Status</th>
                      <th className="py-3 px-6 text-left">Payment</th>
                      <th className="py-3 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm font-light">
                    {groupedAppointments[date].map((appointment) => (
                      <tr key={appointment._id} className="border-b border-gray-200 hover:bg-gray-100">
                        <td className="py-3 px-6 text-left">{appointment.time}</td>
                        <td className="py-3 px-6 text-left">{appointment.doctorId?.name || 'N/A'} ({appointment.doctorId?.specialty || 'N/A'})</td>
                        <td className="py-3 px-6 text-left">{appointment.patientId?.name || 'N/A'}</td>
                        <td className="py-3 px-6 text-left">
                          <span className={`py-1 px-3 rounded-full text-xs font-semibold ${
                            appointment.status === 'booked' ? 'bg-blue-200 text-blue-800' :
                            appointment.status === 'completed' ? 'bg-green-200 text-green-800' :
                            'bg-red-200 text-red-800'
                          }`}>
                            {appointment.status}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-left">
                          <span className={`py-1 px-3 rounded-full text-xs font-semibold ${
                            appointment.paymentStatus === 'paid' ? 'bg-green-200 text-green-800' :
                            appointment.paymentStatus === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                            appointment.paymentStatus === 'failed' ? 'bg-red-200 text-red-800' :
                            'bg-gray-200 text-gray-800'
                          }`}>
                            {appointment.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-center">
                          <button
                            onClick={() => handleDeleteAppointment(appointment._id)}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-600 transition duration-300"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 text-lg">No appointments found.</p>
        )}
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