import React, { useState, useEffect } from 'react';
import Sidebar from '../common/Sidebar';
import Topbar from '../common/Topbar';
import { apiService } from '../../api/api';

const PatientMessages = () => {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCompose, setShowCompose] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'normal'
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (userData.username) {
      setUser({
        id: userData.id || 1,
        name: userData.username,
        email: userData.email || 'user@example.com',
      });
    }

    // Fetch messages
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await apiService.getPatientMessages();
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await apiService.sendMessage(formData);
      alert('Your message has been sent successfully! A doctor will respond within 24 hours.');
      setFormData({ subject: '', message: '', priority: 'normal' });
      setShowCompose(false);
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getUserType = () => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    return userData.user_type;
  };

  const isDoctor = getUserType() === 'doctor';

  const markAsRead = async (messageId) => {
    try {
      await apiService.markMessageRead(messageId);
      fetchMessages();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'normal': return 'text-blue-600';
      case 'low': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      urgent: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      normal: 'bg-blue-100 text-blue-800',
      low: 'bg-gray-100 text-gray-800'
    };
    return colors[priority] || colors.normal;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <p className="loading-text">Loading messages...</p>
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
          <h1 className="page-title">Send Message to Doctor</h1>
          <p className="page-subtitle">Communicate with your assigned doctor</p>
        </div>

        <div className="messages-container">
          <div className="messages-header">
            <button
              className="compose-btn"
              onClick={() => setShowCompose(true)}
            >
              <span role="img" aria-label="compose">✏️</span>
              Send a Message
            </button>
          </div>

          <div className="messages-grid">
            <div className="messages-list">
              <h3 className="messages-list-title">Sent Messages</h3>
              {messages.length === 0 ? (
                <div className="no-messages">
                  <p>No messages sent yet.</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`message-item ${selectedMessage?.id === message.id ? 'active' : ''}`}
                    onClick={() => setSelectedMessage(message)}
                  >
                    <div className="message-header">
                      <h4 className="message-subject">{message.subject}</h4>
                      <span className={`priority-badge ${getPriorityBadge(message.priority)}`}>
                        {message.priority}
                      </span>
                    </div>
                    <div className="message-meta">
                      <span className="message-patient">To: {message.doctor_name || 'Your Doctor'}</span>
                      <span className="message-date">
                        {new Date(message.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="message-preview">
                      {message.message.length > 100
                        ? `${message.message.substring(0, 100)}...`
                        : message.message
                      }
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="message-detail">
              {selectedMessage ? (
                <div className="message-content">
                  <div className="message-detail-header">
                    <h3 className="message-detail-subject">{selectedMessage.subject}</h3>
                    <span className={`priority-badge ${getPriorityBadge(selectedMessage.priority)}`}>
                      {selectedMessage.priority}
                    </span>
                  </div>
                  <div className="message-detail-meta">
                    <span className="message-detail-patient">From: {selectedMessage.patient_name}</span>
                    <span className="message-detail-date">
                      {new Date(selectedMessage.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="message-detail-body">
                    <p>{selectedMessage.message}</p>
                  </div>
                </div>
              ) : (
                <div className="no-selection">
                  <p>Select a message to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {showCompose && (
          <div className="modal-overlay">
            <div className="modal-content compose-modal">
              <div className="modal-header">
                <h2 className="modal-title">Send Message to Doctor</h2>
                <button
                  onClick={() => setShowCompose(false)}
                  className="modal-close"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="compose-form">
                <div className="form-group">
                  <label className="form-label">Subject *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    placeholder="Brief description of your inquiry"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-select"
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  >
                    <option value="low">Low - Standard response time</option>
                    <option value="normal">Normal - Standard response time</option>
                    <option value="high">High - Priority response</option>
                    <option value="urgent">Urgent - Immediate attention</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea
                    className="form-textarea"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Please provide detailed information about your question or concern..."
                    rows={6}
                    required
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowCompose(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="send-btn"
                    disabled={submitting}
                  >
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientMessages;
