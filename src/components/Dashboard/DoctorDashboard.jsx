import React, { useState, useEffect } from 'react';
import Sidebar from '../common/Sidebar';
import Topbar from '../common/Topbar';
import { apiService } from '../../api/api';
import DoctorReports from './DoctorReports';

const DoctorDashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalPatients: 0,
    pendingReports: 0,
    verifiedReports: 0,
    consultationsToday: 0,
  });
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    // Fetch current user data from API
    const fetchUserData = async () => {
      try {
        const response = await apiService.getCurrentUser();
        setUser({
          id: response.data.id,
          name: response.data.username,
          email: response.data.email,
          user_type: response.data.user_type,
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

    // Fetch patients and report stats
    const fetchPatients = async () => {
      try {
        const response = await apiService.getDoctorPatients();
        setPatients(response.data);
        setStats(prevStats => ({
          ...prevStats,
          totalPatients: response.data.length,
        }));
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    // Fetch real report stats
    const fetchReportStats = async () => {
      try {
        const response = await apiService.getDoctorReportStats();
        setStats(prevStats => ({
          ...prevStats,
          pendingReports: response.data.pending_reports,
          verifiedReports: response.data.verified_reports,
        }));
      } catch (error) {
        console.error('Error fetching report stats:', error);
        // Fallback to dummy stats if API fails
        setStats(prevStats => ({
          ...prevStats,
          pendingReports: 0,
          verifiedReports: 0,
        }));
      }
    };

    fetchUserData();
    fetchPatients();
    fetchReportStats();

    // Dummy stats for consultations (not implemented yet)
    setStats(prevStats => ({
      ...prevStats,
      consultationsToday: 3,
    }));

    setLoading(false);
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
          <h1 className="page-title">Doctor Dashboard</h1>
          <p className="page-subtitle">Welcome back, {user?.name}. Here's your practice overview.</p>
        </div>

        {/* Doctor Code */}
        <div className="doctor-code-section">
          <h3>Your Doctor Code</h3>
          <p>Share this code with patients to link their accounts: <strong>{user?.doctor_code || 'Loading...'}</strong></p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <StatCard
            title="Total Patients"
            value={stats.totalPatients}
            icon={<span role="img" aria-label="users">👥</span>}
            color=""
          />
          <StatCard
            title="Pending Reports"
            value={stats.pendingReports}
            icon={<span role="img" aria-label="hourglass">⏳</span>}
            color=""
          />
          <StatCard
            title="Verified Reports"
            value={stats.verifiedReports}
            icon={<span role="img" aria-label="check">✅</span>}
            color=""
          />
          <StatCard
            title="Consultations Today"
            value={stats.consultationsToday}
            icon={<span role="img" aria-label="calendar">📅</span>}
            color=""
          />
        </div>

        {/* Patient Reports */}
        <div className="patient-reports-section">
          <h2 className="activity-title">Patient Reports</h2>
          <DoctorReports />
        </div>

        {/* Recent Activity */}
        <div className="activity-section">
          <h2 className="activity-title">Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon activity-icon-blue">
                <span role="img" aria-label="clipboard">📋</span>
              </div>
              <div className="activity-details">
                <p className="activity-text">New report received</p>
                <p className="activity-time">Patient John Doe submitted blood analysis - 30 min ago</p>
              </div>
              <span className="activity-status status-pending">Pending Review</span>
            </div>

            <div className="activity-item">
              <div className="activity-icon activity-icon-green">
                <span role="img" aria-label="check">✅</span>
              </div>
              <div className="activity-details">
                <p className="activity-text">Report verified</p>
                <p className="activity-time">Confirmed leukemia detection for Patient Jane - 2 hours ago</p>
              </div>
              <span className="activity-status status-verified">Completed</span>
            </div>

            <div className="activity-item">
              <div className="activity-icon activity-icon-blue">
                <span role="img" aria-label="speech">💬</span>
              </div>
              <div className="activity-details">
                <p className="activity-text">Patient consultation</p>
                <p className="activity-time">Scheduled follow-up with Patient Mike - Tomorrow 10:00 AM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Messages Section */}
        <div className="patient-messages-section">
          <h2 className="activity-title">Recent Patient Messages</h2>
          <div className="messages-preview">
            <div className="message-preview-item">
              <div className="message-preview-icon">
                <span role="img" aria-label="speech">💬</span>
              </div>
              <div className="message-preview-content">
                <p className="message-preview-text">Patient John Doe sent a message about their latest report</p>
                <p className="message-preview-time">2 hours ago</p>
              </div>
              <button
                className="view-messages-btn"
                onClick={() => window.location.href = '/messages'}
              >
                View All Messages
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <h2 className="activity-title">Quick Actions</h2>
          <div className="quick-actions-grid">
            <button className="quick-action-btn">
              <span role="img" aria-label="search">🔍</span>
              Review Pending Reports
            </button>
            <button className="quick-action-btn">
              <span role="img" aria-label="calendar">📅</span>
              Schedule Consultation
            </button>
            <button className="quick-action-btn" onClick={() => window.location.href = '/messages'}>
              <span role="img" aria-label="message">💬</span>
              Patient Messages
            </button>
            <button className="quick-action-btn" onClick={() => window.location.href = '/cell-analysis'}>
              <span role="img" aria-label="microscope">🔬</span>
              Cell Analysis
            </button>
            <button className="quick-action-btn">
              <span role="img" aria-label="chart">📊</span>
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
