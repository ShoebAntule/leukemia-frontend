
import React, { useState, useEffect } from 'react';
import Sidebar from '../common/Sidebar';
import Topbar from '../common/Topbar';
import LinkDoctorForm from '../LinkDoctorForm';
import PatientUploadReport from './PatientUploadReport';
import { apiService } from '../../api/api';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingVerification: 0,
    verifiedReports: 0,
  });
  const [loading, setLoading] = useState(true);
  const [assignedDoctor, setAssignedDoctor] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiService.getCurrentUser();
        setUser({
          id: response.data.id,
          name: response.data.username,
          email: response.data.email,
        });

        // Check if user has assigned doctor
        if (response.data.assigned_doctor) {
          setAssignedDoctor(response.data.assigned_doctor);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Fallback to localStorage
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        if (userData.username) {
          setUser({
            id: userData.id || 1,
            name: userData.username,
            email: userData.email || 'user@example.com',
          });
        }
      }

      // Dummy stats
      setStats({
        totalReports: 12,
        pendingVerification: 3,
        verifiedReports: 9,
      });

      setLoading(false);
    };

    fetchUserData();
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <div className={`stat-card ${color}`}>
      <div className="stat-content">
        <div className="stat-info">
          <h3>{title}</h3>
          <p className="stat-value">{value}</p>
        </div>
        <div className="stat-icon">{icon}</div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <p className="loading-text">Loading dashboard...</p>
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
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back, {user?.name}. Here's your health overview.</p>
        </div>



        {/* Doctor Linking */}
        {!assignedDoctor && (
          <div className="link-doctor-section">
            <LinkDoctorForm onSuccess={(doctor) => setAssignedDoctor(doctor)} />
          </div>
        )}

        {assignedDoctor && (
          <div className="assigned-doctor-banner">
            <div className="banner-content">
              <span role="img" aria-label="doctor">👨‍⚕️</span>
              <p>You are linked to Dr. {assignedDoctor.full_name} ({assignedDoctor.specialization})</p>
            </div>
          </div>
        )}

        {/* Patient Report Upload */}
        {assignedDoctor && (
          <div className="upload-report-section">
            <PatientUploadReport />
          </div>
        )}

        {/* Contact Doctor Section */}
        {assignedDoctor && (
          <div className="contact-doctor-section">
            <h2 className="activity-title">Contact Your Doctor</h2>
            <div className="contact-card">
              <div className="contact-icon">
                <span role="img" aria-label="speech">💬</span>
              </div>
              <div className="contact-content">
                <h3>Send a Message</h3>
                <p>Have questions about your reports or need medical advice? Send a message to your doctor.</p>
                <button
                  className="contact-btn"
                  onClick={() => window.location.href = '/messages'}
                >
                  Send a Message
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="activity-section">
          <h2 className="activity-title">Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon activity-icon-blue">
                <span role="img" aria-label="clipboard">📋</span>
              </div>
              <div className="activity-details">
                <p className="activity-text">New report submitted</p>
                <p className="activity-time">Blood cell analysis completed - 2 hours ago</p>
              </div>
              <span className="activity-status status-pending">Pending</span>
            </div>

            <div className="activity-item">
              <div className="activity-icon activity-icon-green">
                <span role="img" aria-label="check">✅</span>
              </div>
              <div className="activity-details">
                <p className="activity-text">Report verified</p>
                <p className="activity-time">Doctor confirmed results - 1 day ago</p>
              </div>
              <span className="activity-status status-verified">Verified</span>
            </div>

            <div className="activity-item">
              <div className="activity-icon activity-icon-blue">
                <span role="img" aria-label="speech">💬</span>
              </div>
              <div className="activity-details">
                <p className="activity-text">Message from doctor</p>
                <p className="activity-time">Dr. Smith responded to your query - 2 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
