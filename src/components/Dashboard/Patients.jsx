import React, { useState, useEffect } from 'react';
import Sidebar from '../common/Sidebar';
import Topbar from '../common/Topbar';
import { apiService } from '../../api/api';

const Patients = () => {
  const [user, setUser] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmRemove, setConfirmRemove] = useState(null);

  useEffect(() => {
    // Fetch current user data from API
    const fetchUserData = async () => {
      try {
        const response = await apiService.getCurrentUser();
        setUser({
          id: response.data.id,
          name: response.data.username,
          email: response.data.email,
          specialization: response.data.specialization || 'Hematology',
          doctor_code: response.data.doctor_code || 'Loading...',
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Fallback to localStorage
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setUser({
          id: userData.id || 1,
          name: userData.username,
          email: userData.email || 'doctor@example.com',
          specialization: userData.specialization || 'Hematology',
          doctor_code: userData.doctor_code || 'Loading...',
        });
      }
    };

    // Fetch patients
    const fetchPatients = async () => {
      try {
        const response = await apiService.getDoctorPatients();
        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchUserData();
    fetchPatients();
    setLoading(false);
  }, []);

  const handleRemovePatient = async (patientId) => {
    try {
      await apiService.removePatient(patientId);
      setPatients(patients.filter(p => p.id !== patientId));
      setConfirmRemove(null);
      alert('Patient removed successfully.');
    } catch (error) {
      console.error('Error removing patient:', error);
      alert('Failed to remove patient.');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <p className="loading-text">Loading patients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Topbar user={user} />
      <Sidebar />

      <div className="main-content">
        <div className="page-header">
          <h1 className="page-title">My Patients</h1>
          <p className="page-subtitle">Manage your linked patients.</p>
        </div>

        {/* Patients List */}
        <div className="patients-section">
          <div className="patients-list">
            {patients.length > 0 ? (
              patients.map(patient => (
                <div key={patient.id} className="patient-item">
                  <div className="patient-info">
                    <p className="patient-name">{patient.username}</p>
                    <p className="patient-email">{patient.email}</p>
                  </div>
                  <span className="patient-status">Active</span>
                  <button
                    className="remove-btn"
                    onClick={() => setConfirmRemove(patient.id)}
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <p>No patients linked yet.</p>
            )}
          </div>
        </div>

        {/* Confirmation Dialog */}
        {confirmRemove && (
          <div className="confirm-dialog">
            <div className="confirm-content">
              <p>Are you sure you want to remove this patient?</p>
              <button onClick={() => handleRemovePatient(confirmRemove)}>Yes</button>
              <button onClick={() => setConfirmRemove(null)}>No</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Patients;
