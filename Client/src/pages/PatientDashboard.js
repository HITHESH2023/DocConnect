import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import API from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import MessageModal from "../components/MessageModal";

export default function PatientDashboard() {
  const { user, token } = useContext(AuthContext);
  const [myAppointments, setMyAppointments] = useState([]); // Renamed from 'appointments' for clarity
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(new Date());
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [errorDoctors, setErrorDoctors] = useState(null);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalType, setModalType] = useState("info");

  // Helper to format date to YYYY-MM-DD
  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  // Fetch patient's own appointments
  useEffect(() => {
    if (token && user) {
      API.get("/appointments")
        .then((res) => setMyAppointments(res.data))
        .catch((err) => {
          setModalTitle("Error");
          setModalMessage("Failed to fetch your appointments.");
          setModalType("error");
          setIsModalOpen(true);
          console.error("Error fetching appointments:", err);
        });
    }
  }, [token, user]);

  // Fetch available doctors for the selected date
  useEffect(() => {
    const fetchAvailableDoctors = async () => {
      setLoadingDoctors(true);
      setErrorDoctors(null);
      const formattedDate = formatDate(selectedCalendarDate);

      try {
        const res = await API.get(`/doctors/available/${formattedDate}`);
        setAvailableDoctors(res.data);
      } catch (err) {
        setErrorDoctors("Failed to fetch available doctors for this date.");
        setModalTitle("Error");
        setModalMessage("Failed to fetch available doctors for this date.");
        setModalType("error");
        setIsModalOpen(true);
        console.error("Error fetching available doctors:", err);
      } finally {
        setLoadingDoctors(false);
      }
    };

    if (selectedCalendarDate) {
      fetchAvailableDoctors();
    }
  }, [selectedCalendarDate]); // Re-fetch when the selected date changes

  const appointmentsForSelectedDate = myAppointments.filter(
    (a) => formatDate(new Date(a.date)) === formatDate(selectedCalendarDate)
  );

  if (!user || user.role !== "patient") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500 text-xl font-semibold">Access Denied. Patients only.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto bg-white rounded-xl shadow-2xl p-8 space-y-10">
        <h2 className="text-5xl font-extrabold text-center text-gray-800 mb-10">Patient Dashboard</h2>

        {/* My Appointments Calendar and List */}
        <div className="bg-blue-50 p-8 rounded-lg shadow-inner">
          <h3 className="text-3xl font-bold text-blue-700 mb-6 text-center">My Appointments Calendar</h3>
          <Calendar
            onChange={setSelectedCalendarDate}
            value={selectedCalendarDate}
            className="w-full rounded-lg shadow-md border border-gray-200 p-4 custom-calendar-styles"
          />
          <div className="mt-8">
            <h4 className="text-2xl font-semibold text-gray-800 mb-4">
              Your Appointments on {formatDate(selectedCalendarDate)}
            </h4>
            {appointmentsForSelectedDate.length > 0 ? (
              <ul className="space-y-4">
                {appointmentsForSelectedDate.map((a) => (
                  <li key={a._id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center transition duration-300 hover:scale-[1.02]">
                    <div>
                      <p className="text-lg font-semibold text-gray-800">Time: {a.time}</p>
                      <p className="text-gray-600">Doctor: {a.doctorId?.name || "N/A"} ({a.doctorId?.email || "N/A"})</p>
                      <p className="text-sm text-gray-500">Status: {a.status}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-600 text-lg">No appointments for you on this date.</p>
            )}
          </div>
        </div>

        {/* Available Doctors Section */}
        <div className="bg-green-50 p-8 rounded-lg shadow-inner">
          <h3 className="text-3xl font-bold text-green-700 mb-6 text-center">
            Available Doctors on {formatDate(selectedCalendarDate)}
          </h3>
          {loadingDoctors && <p className="text-center text-gray-600 text-lg">Loading available doctors...</p>}
          {errorDoctors && <p className="text-center text-red-500 text-lg">{errorDoctors}</p>}
          {!loadingDoctors && !errorDoctors && (
            availableDoctors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableDoctors.map((doctor) => (
                  <div key={doctor._id} className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center transition duration-300 hover:scale-[1.03] hover:shadow-xl">
                    <img
                      src={doctor.profileImage || "https://placehold.co/100x100/aabbcc/ffffff?text=DR"}
                      alt={doctor.name}
                      className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-blue-200 shadow-lg"
                      onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x100/aabbcc/ffffff?text=DR"; }} // Fallback image on error
                    />
                    <h4 className="text-xl font-bold text-gray-800 mb-1">{doctor.name}</h4>
                    <p className="text-blue-600 font-semibold mb-2">{doctor.specialty}</p>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{doctor.bio}</p> {/* line-clamp for bio */}
                    <div className="w-full">
                      {doctor.availability.isAvailable ? (
                        <>
                          <p className="text-green-700 font-medium mb-2">
                            Available from {doctor.availability.startTime} ({doctor.availability.remainingSlots} slots left)
                          </p>
                          <Link
                            to={`/book?doctorId=${doctor._id}&date=${formatDate(selectedCalendarDate)}`}
                            className="block w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition duration-300 shadow-md"
                          >
                            Book Appointment
                          </Link>
                        </>
                      ) : (
                        <p className="text-red-500 font-medium">Fully Booked for this date</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600 text-lg">No doctors available on this date.</p>
            )
          )}
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
