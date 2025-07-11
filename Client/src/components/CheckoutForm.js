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

        if (!stripe || !elements) {
          // Stripe.js has not yet loaded.
          // Make sure to disable form submission until Stripe.js has loaded.
          return;
        }

        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            // Make sure to change this to your payment completion page
            return_url: `${window.location.origin}/patient`, // Redirect to patient dashboard on success
          },
          redirect: 'if_required' // Handle redirection manually
        });

        if (error) {
          // This point will only be reached if there's an immediate error when
          // confirming the payment. Show error to your customer (e.g., insufficient funds).
          setModalTitle('Payment Failed');
          setModalMessage(error.message || 'An unexpected error occurred during payment.');
          setModalType('error');
          setIsModalOpen(true);
          console.error('[Stripe error]', error);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
          // Payment succeeded. The backend webhook should update the appointment status.
          // You can also confirm here if needed, but webhook is more reliable.
          setModalTitle('Payment Successful!');
          setModalMessage('Your payment was successful. Redirecting to your dashboard...');
          setModalType('success');
          setIsModalOpen(true);
          setTimeout(() => {
            setIsModalOpen(false);
            navigate('/patient');
          }, 2000);
        } else {
          // Handle other paymentIntent.status (e.g., 'requires_action', 'processing')
          setModalTitle('Payment Status');
          setModalMessage(`Payment status: ${paymentIntent?.status || 'Unknown'}. Please check your dashboard for updates.`);
          setModalType('info');
          setIsModalOpen(true);
        }

        setIsLoading(false);
      };

      return (
        <form onSubmit={handleSubmit} className="space-y-6">
          <PaymentElement className="p-4 border border-gray-300 rounded-lg" />
          <button
            disabled={isLoading || !stripe || !elements}
            className="w-full bg-green-600 text-white p-4 rounded-lg font-bold text-xl hover:bg-green-700 transition duration-300 shadow-lg transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
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
      );
    };

    export default CheckoutForm;
    