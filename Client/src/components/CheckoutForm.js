import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import MessageModal from './MessageModal'; // Assuming path
import API from '../utils/api'; // Assuming path

const CheckoutForm = ({ appointmentId, consultationFee }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalType, setModalType] = useState('info');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/patient`, 
      },
      redirect: 'if_required'
    });

    if (error) {
      setModalTitle('Payment Failed');
      setModalMessage(error.message || 'An unexpected error occurred during payment.');
      setModalType('error');
      setIsModalOpen(true);
      console.error('[Stripe error]', error);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setModalTitle('Payment Successful!');
      setModalMessage('Your payment was successful. Redirecting to your dashboard...');
      setModalType('success');
      setIsModalOpen(true);
      setTimeout(() => {
        setIsModalOpen(false);
        navigate('/patient');
      }, 2000);
    } else {
      setModalTitle('Payment Status');
      setModalMessage(`Payment status: ${paymentIntent?.status || 'Unknown'}. Please check your dashboard for updates.`);
      setModalType('info');
      setIsModalOpen(true);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex justify-center items-center px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-md p-4 sm:p-6 lg:p-8 space-y-6"
      >
        <PaymentElement className="p-3 sm:p-4 border border-gray-300 rounded-lg" />
        
        <button
          disabled={isLoading || !stripe || !elements}
          className="w-full bg-green-600 text-white py-3 sm:py-4 rounded-lg font-semibold sm:font-bold text-lg sm:text-xl 
                     hover:bg-green-700 transition duration-300 shadow-lg transform hover:-translate-y-1 
                     disabled:opacity-50 disabled:cursor-not-allowed"
          id="submit"
        >
          <span id="button-text">
            {isLoading ? "Processing..." : `Pay $${(consultationFee / 100).toFixed(2)}`}
          </span>
        </button>

        <MessageModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={modalTitle}
          message={modalMessage}
          type={modalType}
        />
      </form>
    </div>
  );
};

export default CheckoutForm;
