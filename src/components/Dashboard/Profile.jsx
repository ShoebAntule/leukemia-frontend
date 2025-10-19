import React, { useState, useEffect } from 'react';
import Sidebar from '../common/Sidebar';
import Topbar from '../common/Topbar';
import { apiService } from '../../api/api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Get user data from localStorage and API
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (userData.id) {
      // Fetch full user profile from API
      const fetchUserProfile = async () => {
        try {
          const response = await apiService.getUserProfile(userData.id);
          setUser({
            id: response.data.id,
            name: response.data.username,
            email: response.data.email,
            phone: response.data.phone_number || '',
            dateOfBirth: response.data.date_of_birth || '',
            address: response.data.address || '',
            user_type: response.data.user_type,
            specialization: response.data.specialization,
          });
          setFormData({
            id: response.data.id,
            name: response.data.username,
            email: response.data.email,
            phone: response.data.phone_number || '',
            dateOfBirth: response.data.date_of_birth || '',
            address: response.data.address || '',
            user_type: response.data.user_type,
            specialization: response.data.specialization,
          });
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Fallback to localStorage data
          setUser({
            id: userData.id,
            name: userData.username,
            email: userData.email,
            phone: '',
            dateOfBirth: '',
            address: '',
            user_type: userData.user_type,
            specialization: userData.specialization,
          });
          setFormData({
            id: userData.id,
            name: userData.username,
            email: userData.email,
            phone: '',
            dateOfBirth: '',
            address: '',
            user_type: userData.user_type,
            specialization: userData.specialization,
          });
        } finally {
          setLoading(false);
        }
      };
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

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

    try {
      // Update user profile via API
      const updateData = {
        username: formData.name,
        email: formData.email,
        phone_number: formData.phone,
        date_of_birth: formData.dateOfBirth,
        address: formData.address,
        specialization: formData.specialization,
      };

      await apiService.updateUserProfile(formData.id, updateData);

      setUser(formData);
      setIsEditing(false);
      setMessage('Profile updated successfully!');

      // Update localStorage
      const updatedUser = { ...JSON.parse(localStorage.getItem('user') || '{}'), ...updateData };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...user });
    setIsEditing(false);
    setMessage('');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <p className="loading-text">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dashboard-container">
        <Topbar user={null} />
        <Sidebar />
        <div className="main-content">
          <div className="error-message">Unable to load profile. Please try logging in again.</div>
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
          <h1 className="page-title">Profile</h1>
          <p className="page-subtitle">Manage your personal information and account settings.</p>
        </div>

        <div className="profile-container">
          <div className="profile-card">
            <div className="profile-header">
              <h2 className="profile-title">Personal Information</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="edit-button"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {message && (
              <div className={`message ${message.includes('successfully') ? 'message-success' : 'message-error'}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  ) : (
                    <p className="modal-value">{user.name}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  ) : (
                    <p className="modal-value">{user.email}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <p className="modal-value">{user.phone || 'Not provided'}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Date of Birth
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <p className="modal-value">{user.dateOfBirth || 'Not provided'}</p>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Address
                </label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="form-textarea"
                  />
                ) : (
                  <p className="modal-value">{user.address || 'Not provided'}</p>
                )}
              </div>

              {user.user_type === 'doctor' && (
                <div className="form-group">
                  <label className="form-label">
                    Specialization
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <p className="modal-value">{user.specialization || 'Not specified'}</p>
                  )}
                </div>
              )}

              {isEditing && (
                <div className="form-actions">
                  <button
                    type="submit"
                    disabled={loading}
                    className="save-button"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="cancel-button"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Account Settings */}
          <div className="profile-card">
            <h2 className="profile-title">Account Settings</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Change Password</h3>
                  <p className="text-sm text-gray-500">Update your account password</p>
                </div>
                <button className="px-4 py-2 text-medical-blue hover:text-medical-dark font-medium">
                  Change
                </button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-500">Add an extra layer of security</p>
                </div>
                <button className="px-4 py-2 text-medical-blue hover:text-medical-dark font-medium">
                  Enable
                </button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Notification Preferences</h3>
                  <p className="text-sm text-gray-500">Manage how you receive notifications</p>
                </div>
                <button className="px-4 py-2 text-medical-blue hover:text-medical-dark font-medium">
                  Manage
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
