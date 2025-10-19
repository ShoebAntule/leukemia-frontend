import React from 'react';

const ReportCard = ({ report, onViewDetails }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Verified':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getResultColor = (result) => {
    if (result.includes('No leukemia')) {
      return 'text-green-600';
    } else if (result.includes('Leukemia')) {
      return 'text-red-600';
    }
    return 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            Report #{report.id}
          </h3>
          <p className="text-sm text-gray-600">{report.date}</p>
        </div>
        <span className={`px-3 py-1 text-xs rounded-full border ${getStatusColor(report.status)}`}>
          {report.status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Doctor:</span>
          <span className="text-sm font-medium text-gray-800">{report.doctor}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Confidence:</span>
          <span className="text-sm font-medium text-gray-800">{report.confidence}%</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-1">Result:</p>
        <p className={`text-sm font-medium ${getResultColor(report.result)}`}>
          {report.result}
        </p>
      </div>

      <button
        onClick={() => onViewDetails(report)}
        className="w-full px-4 py-2 bg-medical-blue text-white rounded-lg hover:bg-medical-dark transition-colors duration-200 font-medium"
      >
        View Details
      </button>
    </div>
  );
};

export default ReportCard;
