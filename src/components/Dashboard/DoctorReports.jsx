import React, { useEffect, useState } from "react";
import { apiService } from "../../api/api";

const DoctorReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await apiService.getDoctorReports();
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const [verificationModal, setVerificationModal] = useState(null);
  const [verificationMessage, setVerificationMessage] = useState('');

  const handleVerify = async (reportId) => {
    setVerificationModal(reportId);
  };

  const handleConfirmVerify = async () => {
    if (!verificationMessage.trim()) {
      alert('Please enter a verification message.');
      return;
    }

    try {
      await apiService.verifyPatientReport(verificationModal, { comments: verificationMessage });
      setVerificationModal(null);
      setVerificationMessage('');
      // Refresh the reports list
      fetchReports();
    } catch (error) {
      console.error('Error verifying report:', error);
    }
  };

  const handleCancelVerify = () => {
    setVerificationModal(null);
    setVerificationMessage('');
  };

  if (loading) {
    return <div>Loading reports...</div>;
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Patient Reports</h2>
      {reports.length === 0 ? (
        <p>No reports uploaded yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Patient Name</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(r => (
                <tr key={r.id} className="border-b">
                  <td className="px-4 py-2">{new Date(r.uploaded_at).toLocaleDateString()}</td>
                  <td className="px-4 py-2 font-semibold">{r.patient_name}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-sm ${r.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {r.verified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <a href={r.report_file} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 mr-2">
                      View PDF
                    </a>
                    {!r.verified && (
                      <button
                        onClick={() => handleVerify(r.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                      >
                        Verify
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Verification Modal */}
      {verificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Verify Report</h3>
            <p className="mb-4">Please enter a message for the patient about this report verification:</p>
            <textarea
              value={verificationMessage}
              onChange={(e) => setVerificationMessage(e.target.value)}
              placeholder="Enter your verification message..."
              className="w-full p-3 border border-gray-300 rounded mb-4 resize-none"
              rows="4"
              required
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCancelVerify}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmVerify}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Verify Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorReports;
