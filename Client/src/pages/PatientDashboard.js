import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import API from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import MessageModal from "../components/MessageModal";

export default function PatientDashboard() {
  const { user, token } = useContext(AuthContext);

  const [myAppointments, setMyAppointments] = useState([]);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(new Date());

  // 🔍 Location search state
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  // Doctors result
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [errorDoctors, setErrorDoctors] = useState(null);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalType, setModalType] = useState("info");

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };


  /* ================================
     Fetch patient appointments
  ================================= */
  useEffect(() => {
    if (token && user) {
      API.get("/appointments")
        .then((res) => setMyAppointments(res.data))
        .catch((err) => {
          setModalTitle("Error");
          setModalMessage("Failed to fetch your appointments.");
          setModalType("error");
          setIsModalOpen(true);
          console.error(err);
        });
    }
  }, [token, user]);

  /* ================================
     Search doctors (location + date)
  ================================= */
  const searchDoctors = async () => {
    if (!state && !city && !pincode) {
      setModalTitle("Missing Filters");
      setModalMessage("Please enter at least one location filter.");
      setModalType("info");
      setIsModalOpen(true);
      return;
    }

    setLoadingDoctors(true);
    setErrorDoctors(null);

    try {
      const res = await API.get("/doctors/search", {
        params: {
          state,
          city,
          pincode,
          date: formatDate(selectedCalendarDate),
        },
      });
      setAvailableDoctors(res.data);
    } catch (err) {
      setErrorDoctors("Failed to fetch doctors.");
      setModalTitle("Error");
      setModalMessage("Failed to fetch doctors.");
      setModalType("error");
      setIsModalOpen(true);
      console.error(err);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const appointmentsForSelectedDate = myAppointments.filter(
    (a) => formatDate(new Date(a.date)) === formatDate(selectedCalendarDate)
  );

  if (!user || user.role !== "patient") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-red-500 text-xl font-semibold text-center">
          Access Denied. Patients only.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto bg-white rounded-xl shadow-2xl p-4 sm:p-6 lg:p-8 space-y-10">

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center text-gray-800">
          Patient Dashboard
        </h2>

        {/* 🔍 Search Doctors */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Search Doctors</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              placeholder="State"
              className="p-3 border rounded-lg"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
            <input
              placeholder="City / District"
              className="p-3 border rounded-lg"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              placeholder="Pincode"
              className="p-3 border rounded-lg"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
            />
          </div>

          <button
            onClick={searchDoctors}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
          >
            Search
          </button>
        </div>

        {/* 📅 Appointments Calendar */}
        <div className="bg-blue-50 p-6 rounded-lg shadow-inner">
          <h3 className="text-2xl font-bold text-blue-700 mb-4 text-center">
            My Appointments
          </h3>

          <Calendar
            onChange={setSelectedCalendarDate}
            value={selectedCalendarDate}
            className="w-full rounded-lg shadow-md"
          />

          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-2">
              Appointments on {formatDate(selectedCalendarDate)}
            </h4>

            {appointmentsForSelectedDate.length > 0 ? (
              <ul className="space-y-3">
                {appointmentsForSelectedDate.map((a) => (
                  <li key={a._id} className="bg-white p-4 rounded shadow">
                    <p><b>Time:</b> {a.time}</p>
                    <p><b>Doctor:</b> {a.doctorId?.name || "N/A"}</p>
                    <p className="text-sm text-gray-500">Status: {a.status}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No appointments.</p>
            )}
          </div>
        </div>

        {/* 👨‍⚕️ Available Doctors */}
        <div className="bg-green-50 p-6 rounded-lg shadow-inner">
          <h3 className="text-2xl font-bold text-green-700 mb-4 text-center">
            Available Doctors on {formatDate(selectedCalendarDate)}
          </h3>

          {loadingDoctors && <p className="text-center">Loading...</p>}
          {errorDoctors && <p className="text-center text-red-500">{errorDoctors}</p>}

          {!loadingDoctors && !errorDoctors && (
            availableDoctors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableDoctors.map((doctor) => (
                  <div key={doctor._id} className="bg-white p-5 rounded-lg shadow text-center">
                    <img
                      src={doctor.profileImage || "https://placehold.co/150x150/aabbcc/ffffff?text=DR"}
                      alt={doctor.name}
                      className="w-24 h-24 rounded-full mx-auto mb-3"
                    />
                    <h4 className="font-bold text-lg">{doctor.name}</h4>
                    <p className="text-blue-600">{doctor.specialty}</p>
                    <p className="text-sm text-gray-600 mb-3">{doctor.bio}</p>

                    {doctor.availability?.isAvailable ? (
                      <>
                        <p className="text-green-600 mb-2">
                          Slots left: {doctor.availability.remainingSlots}
                        </p>
                        <Link
                          to={`/book?doctorId=${doctor._id}&date=${formatDate(selectedCalendarDate)}`}
                          className="block bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700"
                        >
                          Book Appointment
                        </Link>
                      </>
                    ) : (
                      <p className="text-red-500 font-semibold">Fully Booked</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600">No doctors found.</p>
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
