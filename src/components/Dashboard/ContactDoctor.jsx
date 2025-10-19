import React, { useState } from 'react';
import Sidebar from '../common/Sidebar';
import Topbar from '../common/Topbar';

const ContactDoctor = () => {
  const [user, setUser] = useState({ id: 1, name: 'John Doe' });
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'normal',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Reset form
      setFormData({
        subject: '',
        message: '',
        priority: 'normal',
      });

      setMessage('Your message has been sent successfully! A doctor will respond within 24 hours.');
      setMessageType('success');
    } catch (error) {
      setMessage('Failed to send message. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Topbar user={user} />
      <Sidebar />

      <div className="main-content">
        <div className="page-header">
          <h1 className="page-title">Contact Doctor</h1>
          <p className="page-subtitle">Get in touch with your healthcare provider for questions about your reports.</p>
        </div>

        <div className="contact-form">
          <div className="contact-card">
            <h2 className="contact-title">Send a Message</h2>

            {message && (
              <div className={`message ${messageType === 'success' ? 'message-success' : 'message-error'}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Brief description of your inquiry"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="low">Low - General inquiry</option>
                  <option value="normal">Normal - Standard response time</option>
                  <option value="high">High - Urgent medical concern</option>
                  <option value="urgent">Urgent - Emergency situation</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className="form-textarea"
                  placeholder="Please provide detailed information about your question or concern..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="save-button"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="contact-card">
            <h2 className="contact-title">Contact Information</h2>

            <div className="space-y-4">
              <div className="contact-info">
                <div className="contact-icon">
                  <span role="img" aria-label="phone">📞</span>
                </div>
                <div className="contact-details">
                  <h3>Emergency Hotline</h3>
                  <p>For urgent medical concerns</p>
                  <p className="phone">1-800-LEUKEMIA (1-800-538-5364)</p>
                </div>
              </div>

              <div className="contact-info">
                <div className="contact-icon">
                  <span role="img" aria-label="email">📧</span>
                </div>
                <div className="contact-details">
                  <h3>Email Support</h3>
                  <p>For non-urgent inquiries</p>
                  <p className="email">support@leukemiadetection.com</p>
                </div>
              </div>

              <div className="contact-info">
                <div className="contact-icon">
                  <span role="img" aria-label="clock">🕒</span>
                </div>
                <div className="contact-details">
                  <h3>Response Time</h3>
                  <p>Typical response times</p>
                  <p>Urgent: Within 2 hours</p>
                  <p>Normal: Within 24 hours</p>
                  <p>Low: Within 48 hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="contact-card">
            <h2 className="contact-title">Frequently Asked Questions</h2>

            <div className="space-y-4">
              <div className="faq-item">
                <h3>How quickly will I receive a response?</h3>
                <p>Response times vary based on priority: Urgent (2 hours), Normal (24 hours), Low (48 hours).</p>
              </div>

              <div className="faq-item">
                <h3>Can I attach files to my message?</h3>
                <p>Currently, file attachments are not supported. Please describe your concern in detail in the message field.</p>
              </div>

              <div className="faq-item">
                <h3>What should I do in case of emergency?</h3>
                <p>For medical emergencies, please call emergency services immediately or visit the nearest emergency room.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDoctor;
