import React, { useState, useEffect } from 'react';
import Sidebar from '../common/Sidebar';
import Topbar from '../common/Topbar';
import { apiService } from '../../api/api';

const Reports = () => {
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);

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

    // Fetch reports based on user type
    const fetchReports = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        let response;

        if (userData.user_type === 'doctor') {
          // Doctors see all patient reports
          response = await apiService.getDoctorReports();
        } else {
          // Patients see their own reports - both uploaded and microscopic
          const [uploadedResponse, microscopicResponse] = await Promise.all([
            apiService.getPatientReports(),
            apiService.getPatientMicroscopicReports()
          ]);

          // Combine both types of reports
          const combinedReports = [
            ...uploadedResponse.data.map(report => ({ ...report, type: 'uploaded' })),
            ...microscopicResponse.data.map(report => ({ ...report, type: 'microscopic' }))
          ];

          response = { data: combinedReports };
        }

        setReports(response.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Verified':
        return 'status-verified';
      case 'Pending':
        return 'status-pending';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const ReportModal = ({ report, onClose }) => (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">
            {report.type === 'microscopic' ? 'Microscopic Analysis Details' : 'Report Details'}
          </h2>
          <button
            onClick={onClose}
            className="modal-close"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-grid">
            <div className="modal-field">
              <label className="modal-label">Date</label>
              <p className="modal-value">{new Date(report.uploaded_at).toLocaleDateString()}</p>
            </div>
            <div className="modal-field">
              <label className="modal-label">Doctor</label>
              <p className="modal-value">Dr. {report.doctor_name}</p>
            </div>
            <div className="modal-field">
              <label className="modal-label">Status</label>
              <span className={`activity-status ${getStatusColor(report.verified ? 'Verified' : 'Pending')}`}>
                {report.verified ? 'Verified' : 'Pending'}
              </span>
            </div>
          </div>

          {report.type === 'microscopic' ? (
            <>
              <div className="modal-field">
                <label className="modal-label">Analysis Result</label>
                <p className="modal-value">{report.result}</p>
              </div>
              <div className="modal-field">
                <label className="modal-label">Image</label>
                <img src={report.image} alt="Cell analysis" className="modal-image" />
              </div>
            </>
          ) : (
            <div className="modal-field">
              <label className="modal-label">Report File</label>
              <a href={report.report_file} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800">
                View PDF Report
              </a>
            </div>
          )}

          {report.comments && (
            <div className="modal-field">
              <label className="modal-label">Doctor's Comments</label>
              <p className="modal-comments">{report.comments}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <p className="loading-text">Loading reports...</p>
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
          <h1 className="page-title">
            {user?.user_type === 'doctor' ? 'Patient Reports' : 'My Reports'}
          </h1>
          <p className="page-subtitle">
            {user?.user_type === 'doctor'
              ? 'View and verify patient reports.'
              : 'View your uploaded PDF reports and microscopic analysis reports from your doctor.'
            }
          </p>
        </div>

        <div className="reports-container">
          <div className="table-container">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header th">Date</th>
                  <th className="table-header th">Doctor Name</th>
                  <th className="table-header th">Type</th>
                  <th className="table-header th">Status</th>
                  <th className="table-header th">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td className="table-body td">{new Date(report.uploaded_at).toLocaleDateString()}</td>
                    <td className="table-body td">{report.doctor_name}</td>
                    <td className="table-body td">
                      <span className={`activity-status ${report.type === 'microscopic' ? 'status-verified' : 'status-pending'}`}>
                        {report.type === 'microscopic' ? 'Microscopic' : 'Uploaded'}
                      </span>
                    </td>
                    <td className="table-body td">
                      <span className={`activity-status ${getStatusColor(report.verified ? 'Verified' : 'Pending')}`}>
                        {report.verified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="table-body td">
                      {report.type === 'microscopic' ? (
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="view-details-link"
                        >
                          View Analysis
                        </button>
                      ) : (
                        <>
                          <a href={report.report_file} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 mr-2">
                            View PDF
                          </a>
                          {report.comments && (
                            <button
                              onClick={() => setSelectedReport(report)}
                              className="view-details-link"
                            >
                              View Comments
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedReport && (
          <ReportModal
            report={selectedReport}
            onClose={() => setSelectedReport(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Reports;
