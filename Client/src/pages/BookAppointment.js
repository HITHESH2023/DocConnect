import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import API from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import MessageModal from '../components/MessageModal';

// Stripe Imports
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../components/CheckoutForm'; // We will create this component

// Load Stripe outside of render to avoid recreating it on every render
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

export default function BookAppointment() {
  const [searchParams] = useSearchParams();
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState(new Date());
  const [consultationFee, setConsultationFee] = useState(0); // To display fee
  const [paymentOption, setPaymentOption] = useState('offline'); // 'offline' or 'online'
  const [appointmentId, setAppointmentId] = useState(null); // To store booked appointment ID
  const [clientSecret, setClientSecret] = useState(null); // For Stripe
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalType, setModalType] = useState('info');
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Helper to format date to YYYY-MM-DD
  const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toISOString().split('T')[0];
  };

  // Pre-fill from URL params
  useEffect(() => {
    const doctorIdParam = searchParams.get('doctorId');
    const dateParam = searchParams.get('date');

    if (doctorIdParam) setDoctorId(doctorIdParam);
    if (dateParam) setDate(new Date(dateParam));

    // Fetch doctor's fee or set a default
    // In a real app, you'd fetch this from the doctor's profile or a fixed price list
    setConsultationFee(5000); // Example: 5000 cents = $50.00
  }, [searchParams]);

  const handleBookAppointment = async (paymentStatus = 'offline') => {
    if (!doctorId || !date) {
      setModalTitle('Missing Information');
      setModalMessage('Please provide both Doctor ID and Date.');
      setModalType('info');
      setIsModalOpen(true);
      return;
    }

    try {
      // First, book the appointment
      const res = await API.post('/appointments', {
        doctorId,
        date: formatDate(date),
        paymentStatus: paymentStatus // Pass payment status to backend
      });

      setAppointmentId(res.data.appointment._id); // Save appointment ID

      if (paymentStatus === 'online') {
        // If online payment, create Payment Intent
        const paymentIntentRes = await API.post('/payment/create-payment-intent', {
          appointmentId: res.data.appointment._id,
          amount: consultationFee,
        });
        setClientSecret(paymentIntentRes.data.clientSecret);
        setModalTitle('Proceed to Payment');
        setModalMessage('Please complete the payment to confirm your appointment.');
        setModalType('info');
        setIsModalOpen(true);
      } else {
        // Offline payment
        setModalTitle('Appointment Booked!');
        setModalMessage(`Your appointment is booked for ${formatDate(date)} at ${res.data.appointment.time}. You will pay offline.`);
        setModalType('success');
        setIsModalOpen(true);
        setTimeout(() => {
          setIsModalOpen(false);
          navigate('/patient');
        }, 2000);
      }
    } catch (err) {
      setModalTitle('Booking Failed');
      setModalMessage(err.response?.data?.msg || 'Failed to book appointment. Please check Doctor ID and availability.');
      setModalType('error');
      setIsModalOpen(true);
      console.error('Booking error:', err);
    }
  };

  if (!user || user.role !== 'patient') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500 text-xl font-semibold">Access Denied. Patients only.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:scale-105">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Book Appointment</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Doctor ID:</label>
            <input
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 placeholder-gray-500 text-lg"
              placeholder="Doctor ID"
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Appointment Date:</label>
            <DatePicker
              selected={date}
              onChange={(d) => setDate(d)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 text-lg"
              dateFormat="yyyy-MM-dd"
            />
          </div>

          {/* Payment Options */}
          <div className="mt-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Consultation Fee: ${consultationFee / 100}</label>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-5 w-5 text-blue-600"
                  name="paymentOption"
                  value="offline"
                  checked={paymentOption === 'offline'}
                  onChange={(e) => {
                    setPaymentOption(e.target.value);
                    setClientSecret(null); // Reset Stripe if switching to offline
                  }}
                />
                <span className="ml-2 text-gray-700">Pay Offline</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-5 w-5 text-blue-600"
                  name="paymentOption"
                  value="online"
                  checked={paymentOption === 'online'}
                  onChange={(e) => setPaymentOption(e.target.value)}
                />
                <span className="ml-2 text-gray-700">Pay Online</span>
              </label>
            </div>
          </div>

          {paymentOption === 'offline' && (
            <button
              onClick={() => handleBookAppointment('offline')}
              className="w-full bg-blue-600 text-white p-4 rounded-lg font-bold text-xl hover:bg-blue-700 transition duration-300 shadow-lg transform hover:-translate-y-1"
            >
              Book Appointment (Pay Offline)
            </button>
          )}

          {paymentOption === 'online' && clientSecret && (
            <Elements options={{ clientSecret }} stripe={stripePromise}>
              <CheckoutForm appointmentId={appointmentId} consultationFee={consultationFee} />
            </Elements>
          )}

          {paymentOption === 'online' && !clientSecret && (
            <button
              onClick={() => handleBookAppointment('online')}
              className="w-full bg-purple-600 text-white p-4 rounded-lg font-bold text-xl hover:bg-purple-700 transition duration-300 shadow-lg transform hover:-translate-y-1"
            >
              Book Appointment & Proceed to Pay
            </button>
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
