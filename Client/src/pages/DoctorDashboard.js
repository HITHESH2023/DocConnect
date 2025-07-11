import React, { useEffect, useState, useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import API from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import MessageModal from "../components/MessageModal";

export default function DoctorDashboard() {
  const { user, token } = useContext(AuthContext);
  const [allAppointments, setAllAppointments] = useState([]);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(new Date());
  const [availabilityForm, setAvailabilityForm] = useState({
    date: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    patientDuration: 15,
    totalSlots: 10,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalType, setModalType] = useState("info");

  // Helper to format date to YYYY-MM-DD in local timezone
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (token) {
      API.get("/appointments")
        .then((res) => setAllAppointments(res.data))
        .catch((err) => {
          setModalTitle("Error");
          setModalMessage("Failed to fetch appointments.");
          setModalType("error");
          setIsModalOpen(true);
          console.error("Error fetching appointments:", err);
        });
    }
  }, [token]);

  const setAvailability = async () => {
    try {
      await API.post("/availability", availabilityForm);
      setModalTitle("Success");
      setModalMessage("Availability set successfully!");
      setModalType("success");
      setIsModalOpen(true);
      // Optionally re-fetch appointments to update calendar view if availability affects existing slots
      API.get("/appointments").then((res) => setAllAppointments(res.data));
    } catch (err) {
      setModalTitle("Error");
      setModalMessage(err.response?.data?.msg || "Failed to set availability.");
      setModalType("error");
      setIsModalOpen(true);
      console.error("Error setting availability:", err);
    }
  };

  const appointmentsForSelectedDate = allAppointments.filter(
    (a) => formatDate(new Date(a.date)) === formatDate(selectedCalendarDate)
  );

  if (!user || user.role !== "doctor") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500 text-xl font-semibold">Access Denied. Doctors only.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto bg-white rounded-xl shadow-2xl p-8 space-y-10">
        <h2 className="text-5xl font-extrabold text-center text-gray-800 mb-10">Doctor Dashboard</h2>

        {/* Doctor Profile Info (Optional Add-on) */}
        {user && (
          <div className="bg-purple-50 p-6 rounded-lg shadow-inner flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <img
              src={user.profileImage || "https://placehold.co/100x100/aabbcc/ffffff?text=DR"}
              alt={user.name || user.email}
              className="w-28 h-28 rounded-full object-cover border-4 border-purple-300 shadow-lg"
              onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x100/aabbcc/ffffff?text=DR"; }}
            />
            <div className="text-center md:text-left">
              <h3 className="text-3xl font-bold text-purple-700">{user.name || user.email}</h3>
              <p className="text-xl text-purple-600 font-semibold mb-2">{user.specialty || "General Practitioner"}</p>
              <p className="text-gray-700 text-md">{user.bio || "No bio provided."}</p>
            </div>
          </div>
        )}

        {/* Set Availability Section */}
        <div className="bg-blue-50 p-8 rounded-lg shadow-inner">
          <h3 className="text-3xl font-bold text-blue-700 mb-6 text-center">Set Your Availability</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Select Date:</label>
              <DatePicker
                selected={new Date(availabilityForm.date)}
                onChange={(d) => setAvailabilityForm({ ...availabilityForm, date: formatDate(d) })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                dateFormat="yyyy-MM-dd"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Start Time (HH:MM):</label>
              <input
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 09:00"
                value={availabilityForm.startTime}
                onChange={(e) => setAvailabilityForm({ ...availabilityForm, startTime: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Minutes per Patient:</label>
              <input
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                type="number"
                value={availabilityForm.patientDuration}
                onChange={(e) => setAvailabilityForm({ ...availabilityForm, patientDuration: +e.target.value })}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Total Slots:</label>
              <input
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                type="number"
                value={availabilityForm.totalSlots}
                onChange={(e) => setAvailabilityForm({ ...availabilityForm, totalSlots: +e.target.value })}
              />
            </div>
          </div>
          <button
            onClick={setAvailability}
            className="w-full bg-blue-600 text-white p-4 rounded-lg font-bold text-xl hover:bg-blue-700 transition duration-300 shadow-md transform hover:-translate-y-1"
          >
            Submit Availability
          </button>
        </div>

        {/* Calendar and Appointments Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-purple-50 p-8 rounded-lg shadow-inner">
            <h3 className="text-3xl font-bold text-purple-700 mb-6 text-center">Your Appointments Calendar</h3>
            <Calendar
              onChange={setSelectedCalendarDate}
              value={selectedCalendarDate}
              className="w-full rounded-lg shadow-md border border-gray-200 p-4 custom-calendar-styles"
            />
          </div>

          <div className="bg-green-50 p-8 rounded-lg shadow-inner">
            <h3 className="text-3xl font-bold text-green-700 mb-6 text-center">
              Appointments for {formatDate(selectedCalendarDate)}
            </h3>
            {appointmentsForSelectedDate.length > 0 ? (
              <ul className="space-y-4">
                {appointmentsForSelectedDate.map((a) => (
                  <li key={a._id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center transition duration-300 hover:scale-[1.02]">
                    <div>
                      <p className="text-lg font-semibold text-gray-800">Time: {a.time}</p>
                      <p className="text-gray-600">Patient: {a.patientId?.name || "N/A"} ({a.patientId?.email || "N/A"})</p>
                      <p className="text-sm text-gray-500">Status: {a.status}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-600 text-lg">No appointments on this date.</p>
            )}
          </div>
        </div>
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
