import React from 'react';
import { Link, withRouter } from 'react-router-dom';

const Sidebar = ({ location }) => {
  // Get user type from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userType = user.user_type;

  const userMenuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <span role="img" aria-label="home">🏠</span> },
    { path: '/reports', label: 'My Reports', icon: <span role="img" aria-label="clipboard">📋</span> },
    { path: '/messages', label: 'Send Message to Doctor', icon: <span role="img" aria-label="speech">💬</span> },
    { path: '/profile', label: 'Profile', icon: <span role="img" aria-label="user">👤</span> },
  ];

  const doctorMenuItems = [
    { path: '/doctor-dashboard', label: 'Dashboard', icon: <span role="img" aria-label="home">🏠</span> },
    { path: '/reports', label: 'Patient Reports', icon: <span role="img" aria-label="clipboard">📋</span> },
    { path: '/patients', label: 'My Patients', icon: <span role="img" aria-label="users">👥</span> },
    { path: '/messages', label: 'Patient Messages', icon: <span role="img" aria-label="speech">💬</span> },
    { path: '/cell-analysis', label: 'Cell Analysis', icon: <span role="img" aria-label="microscope">🔬</span> },
    { path: '/profile', label: 'Profile', icon: <span role="img" aria-label="user">👤</span> },
  ];

  const menuItems = userType === 'doctor' ? doctorMenuItems : userMenuItems;

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-logout-section">
          <button
            onClick={() => {
              // Handle logout
              localStorage.removeItem('token');
              window.location.href = '/';
            }}
            className="logout-button"
          >
            <span className="sidebar-icon"><span role="img" aria-label="door">🚪</span></span>
            <span className="sidebar-label">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Sidebar);
