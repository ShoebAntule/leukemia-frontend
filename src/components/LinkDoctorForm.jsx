import React, { useState } from 'react';
import { apiService } from '../api/api';

const LinkDoctorForm = ({ onSuccess }) => {
  const [doctorCode, setDoctorCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await apiService.linkDoctor(doctorCode.toUpperCase());
      setMessage(response.data.message);
      setDoctorCode('');
      if (onSuccess) {
        onSuccess(response.data.doctor);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred while linking the doctor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="link-doctor-form">
      <h3>Link to Your Doctor</h3>
      <p>Enter your doctor's unique code to link your account and share reports.</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="doctorCode">Doctor Code</label>
          <input
            type="text"
            id="doctorCode"
            value={doctorCode}
            onChange={(e) => setDoctorCode(e.target.value.toUpperCase())}
            placeholder="Enter doctor code (e.g., AB12CD34)"
            maxLength={10}
            required
            className="form-control"
          />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? 'Linking...' : 'Link Doctor'}
        </button>
      </form>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default LinkDoctorForm;
