import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/customer-dashboard.css';

const CreateRepairRequest = () => {
  const { user, token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    applianceType: '',
    brand: '',
    model: '',
    applianceAge: '',
    problemDescription: '',
    availableDates: [],
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/requests/create',
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess('Repair request created successfully!');
      setFormData({
        applianceType: '',
        brand: '',
        model: '',
        applianceAge: '',
        problemDescription: '',
        availableDates: [],
      });

      setTimeout(() => window.location.reload(), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-request-container">
      <h3>Create Repair Request</h3>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Appliance Type *</label>
          <select
            name="applianceType"
            value={formData.applianceType}
            onChange={handleChange}
            required
          >
            <option value="">Select Appliance</option>
            <option value="refrigerator">Refrigerator</option>
            <option value="washer">Washing Machine</option>
            <option value="dryer">Dryer</option>
            <option value="dishwasher">Dishwasher</option>
            <option value="oven">Oven</option>
            <option value="microwave">Microwave</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Brand *</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Model</label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Appliance Age</label>
          <select
            name="applianceAge"
            value={formData.applianceAge}
            onChange={handleChange}
          >
            <option value="">Select Age</option>
            <option value="0-1 year">0-1 year</option>
            <option value="1-3 years">1-3 years</option>
            <option value="3-5 years">3-5 years</option>
            <option value="5-10 years">5-10 years</option>
            <option value="10+ years">10+ years</option>
          </select>
        </div>

        <div className="form-group">
          <label>Problem Description *</label>
          <textarea
            name="problemDescription"
            value={formData.problemDescription}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Describe the issue with your appliance"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating Request...' : 'Create Request'}
        </button>
      </form>
    </div>
  );
};

export default CreateRepairRequest;