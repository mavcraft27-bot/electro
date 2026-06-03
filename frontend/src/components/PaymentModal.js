import React, { useState, useContext } from 'react';
import { loadStripe } from '@stripe/js';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/payment-modal.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PaymentForm = ({ requestId, onSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create payment intent
      const intentResponse = await axios.post(
        'http://localhost:5000/api/payments/create-payment-intent',
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { clientSecret, paymentId } = intentResponse.data;

      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        // Confirm payment in backend
        await axios.post(
          'http://localhost:5000/api/payments/confirm-payment',
          { paymentId, requestId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      {error && <div className="error-message">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'Pay $40'}
      </button>
    </form>
  );
};

const PaymentModal = ({ requestId, onSuccess, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Claim Repair Request</h3>
        <p>Fee: $40 CAD</p>
        <Elements stripe={stripePromise}>
          <PaymentForm requestId={requestId} onSuccess={onSuccess} onClose={onClose} />
        </Elements>
        <button onClick={onClose} className="cancel-btn">Cancel</button>
      </div>
    </div>
  );
};

export default PaymentModal;