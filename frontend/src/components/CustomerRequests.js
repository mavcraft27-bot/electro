import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/requests-list.css';

const CustomerRequests = () => {
  const { user, token } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/requests/my-requests/${user.id}`,
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="requests-container">
      <h3>My Repair Requests</h3>
      {requests.length === 0 ? (
        <p>No repair requests yet</p>
      ) : (
        <div className="requests-list">
          {requests.map((request) => (
            <div key={request._id} className="request-card">
              <div className="request-header">
                <h4>{request.applianceType}</h4>
                <span className={`status ${request.status}`}>{request.status}</span>
              </div>
              <div className="request-details">
                <p><strong>Brand:</strong> {request.brand}</p>
                <p><strong>Model:</strong> {request.model || 'N/A'}</p>
                <p><strong>Age:</strong> {request.applianceAge || 'N/A'}</p>
                <p><strong>Problem:</strong> {request.problemDescription}</p>
                {request.technicianId && (
                  <div className="technician-info">
                    <p><strong>Technician:</strong> {request.technicianId.firstName} {request.technicianId.lastName}</p>
                    <p><strong>Phone:</strong> {request.technicianId.phone}</p>
                  </div>
                )}
              </div>
              <div className="request-date">
                Created: {new Date(request.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerRequests;