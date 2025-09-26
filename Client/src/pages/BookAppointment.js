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
import CheckoutForm from '../components/CheckoutForm';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

export default function BookAppointment() {
  const [searchParams] = useSearchParams();
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState(new Date());
  const [consultationFee, setConsultationFee] = useState(0);
  const [paymentOption, setPaymentOption] = useState('offline');
  const [appointmentId, setAppointmentId] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalType, setModalType] = useState('info');
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toISOString().split('T')[0];
  };

  useEffect(() => {
    const doctorIdParam = searchParams.get('doctorId');
    const dateParam = searchParams.get('date');

    if (doctorIdParam) setDoctorId(doctorIdParam);
    if (dateParam) setDate(new Date(dateParam));
    setConsultationFee(5000);
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
      const res = await API.post('/appointments', {
        doctorId,
        date: formatDate(date),
        paymentStatus: paymentStatus
      });

      setAppointmentId(res.data.appointment._id);

      if (paymentStatus === 'online') {
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-red-500 text-lg sm:text-xl font-semibold text-center">
          Access Denied. Patients only.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 hover:scale-105">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-center text-gray-800 mb-6 sm:mb-8">
          Book Appointment
        </h2>
        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Doctor ID:</label>
            <input
              className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 placeholder-gray-500 text-base sm:text-lg"
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
              className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 text-base sm:text-lg"
              dateFormat="yyyy-MM-dd"
            />
          </div>

          <div className="mt-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Consultation Fee: ${consultationFee / 100}
            </label>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-3 sm:space-y-0">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-5 w-5 text-blue-600"
                  name="paymentOption"
                  value="offline"
                  checked={paymentOption === 'offline'}
                  onChange={(e) => {
                    setPaymentOption(e.target.value);
                    setClientSecret(null);
                  }}
                />
                <span className="ml-2 text-gray-700 text-sm sm:text-base">Pay Offline</span>
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
                <span className="ml-2 text-gray-700 text-sm sm:text-base">Pay Online</span>
              </label>
            </div>
          </div>

          {paymentOption === 'offline' && (
            <button
              onClick={() => handleBookAppointment('offline')}
              className="w-full bg-blue-600 text-white p-3 sm:p-4 rounded-lg font-bold text-lg sm:text-xl hover:bg-blue-700 transition duration-300 shadow-lg transform hover:-translate-y-1"
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
              className="w-full bg-purple-600 text-white p-3 sm:p-4 rounded-lg font-bold text-lg sm:text-xl hover:bg-purple-700 transition duration-300 shadow-lg transform hover:-translate-y-1"
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
