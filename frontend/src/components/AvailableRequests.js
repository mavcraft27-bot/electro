import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import PaymentModal from './PaymentModal';
import '../styles/available-requests.css';

const AvailableRequests = () => {
  const { user, token } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    fetchAvailableRequests();
  }, []);

  const fetchAvailableRequests = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/requests/available/${user.province}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRequests(response.data.requests);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimRequest = (request) => {
    setSelectedRequest(request);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setSelectedRequest(null);
    fetchAvailableRequests();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="available-requests-container">
      <h3>Available Repair Requests</h3>
      {requests.length === 0 ? (
        <p>No available requests in your region</p>
      ) : (
        <div className="requests-list">
          {requests.map((request) => (
            <div key={request._id} className="request-card">
              <div className="request-header">
                <h4>{request.applianceType}</h4>
                <span className="badge">{request.brand}</span>
              </div>
              <div className="request-details">
                <p><strong>Model:</strong> {request.model || 'N/A'}</p>
                <p><strong>Age:</strong> {request.applianceAge || 'N/A'}</p>
                <p><strong>Problem:</strong> {request.problemDescription}</p>
                <p><strong>Customer:</strong> {request.customerId.firstName} {request.customerId.lastName}</p>
              </div>
              <button
                onClick={() => handleClaimRequest(request)}
                className="claim-btn"
              >
                Claim Request ($40)
              </button>
            </div>
          ))}
        </div>
      )}

      {showPayment && selectedRequest && (
        <PaymentModal
          requestId={selectedRequest._id}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  );
};

export default AvailableRequests;