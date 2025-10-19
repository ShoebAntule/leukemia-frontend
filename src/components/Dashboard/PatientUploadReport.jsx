import React, { useState } from "react";
import { apiService } from "../../api/api";

const PatientUploadReport = () => {
  const [file, setFile] = useState(null);
  const [doctorCode, setDoctorCode] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("report_file", file);
    formData.append("doctor_code", doctorCode);
    try {
      await apiService.uploadPatientReport(formData);
      setMessage("✅ Report uploaded successfully!");
      setFile(null);
      setDoctorCode("");
    } catch (error) {
      setMessage("❌ Error uploading report. Please check the doctor code.");
      console.error(error);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Upload Your Report</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          required
          className="block border p-2 mt-2 rounded"
        />
        <input
          type="text"
          placeholder="Enter Doctor Code"
          value={doctorCode}
          onChange={(e) => setDoctorCode(e.target.value)}
          required
          className="block border p-2 mt-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 mt-3 rounded">
          Upload
        </button>
      </form>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
};

export default PatientUploadReport;
