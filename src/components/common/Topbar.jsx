import React, { useState, useEffect } from 'react';
import { apiService } from '../../api/api';

const Topbar = ({ user }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [totalNotifications, setTotalNotifications] = useState(0);

  useEffect(() => {
    // Fetch real notifications for doctors
    const fetchNotifications = async () => {
      if (user?.user_type === 'doctor') {
        try {
          // Fetch pending reports
          const reportStatsResponse = await apiService.getDoctorReportStats();
          const pendingReports = reportStatsResponse.data.pending_reports || 0;

          // Fetch unread messages
          const messagesResponse = await apiService.getPatientMessages();
          const unreadMessages = messagesResponse.data.filter(msg => !msg.is_read);

          // Build notifications array
          const realNotifications = [];

          if (pendingReports > 0) {
            realNotifications.push({
              id: 'pending-reports',
              message: `${pendingReports} report${pendingReports > 1 ? 's' : ''} available for review`,
              time: 'Recently',
              type: 'report'
            });
          }

          unreadMessages.forEach(msg => {
            realNotifications.push({
              id: `msg-${msg.id}`,
              message: `Message from ${msg.patient_name || 'Patient'}: ${msg.message.substring(0, 50)}${msg.message.length > 50 ? '...' : ''}`,
              time: new Date(msg.created_at).toLocaleDateString(),
              type: 'message'
            });
          });

          setNotifications(realNotifications);
          setTotalNotifications(realNotifications.length);

        } catch (error) {
          console.error('Error fetching notifications:', error);
          setNotifications([]);
          setTotalNotifications(0);
        }
      } else {
        // For patients, show empty notifications
        setNotifications([]);
        setTotalNotifications(0);
      }
    };

    if (user) {
      fetchNotifications();
    }
  }, [user]);

  return (
    <div className="topbar">
      <div className="topbar-left">
        <h1 className="topbar-title">Leukemia Detection</h1>
      </div>

      <div className="topbar-right">
        {/* Notifications */}
        <div className="notifications">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="notifications-button"
          >
            <span role="img" aria-label="bell">🔔</span>
            {totalNotifications > 0 && (
              <span className="notifications-badge">
                {totalNotifications}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="notifications-header">
                <h3 className="notifications-title">Notifications</h3>
              </div>
              <div className="notifications-list">
                {notifications.map((notification) => (
                  <div key={notification.id} className="notification-item">
                    <p className="notification-text">{notification.message}</p>
                    <p className="notification-time">{notification.time}</p>
                  </div>
                ))}
              </div>
              <div className="notifications-footer">
                <button
                  className="notifications-view-all"
                  onClick={() => {
                    setShowNotifications(false);
                    window.location.href = '/messages';
                  }}
                >
                  View Messages
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="user-profile">
          <div className="user-info">
            <p className="user-name">{user?.name || 'John Doe'}</p>
            <p className="user-role">{user?.user_type === 'doctor' ? 'Doctor' : 'Patient'}</p>
          </div>
          <div className="user-avatar">
            {user?.name?.charAt(0) || 'J'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
