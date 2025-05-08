import React, { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore'
import { Bar } from 'react-chartjs-2';

const PendingReportChart = ({ filter }) => {
  const { pendingReport, isLoading, getPendingReport } = useAuthStore();

  useEffect(() => {
    getPendingReport(filter);
  }, [filter, getPendingReport]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  if (isLoading) {
    return (
      <div className="text-gray-500 flex justify-center items-center pt-20">
        Loading chart...
      </div>
    );
  }

  const hasData =
  pendingReport &&
    Array.isArray(pendingReport.labels) &&
    pendingReport.labels.length > 0 &&
    Array.isArray(pendingReport.datasets) &&
    pendingReport.datasets.length > 0;

  return (
    <div>
      <h2 className="w-full text-lg font-semibold mb-2 text-blue-800 text-center">Pending Reservation Graph</h2>
      <div className="h-[150px] w-full flex justify-center items-center text-gray-500">
        {hasData ? (
          <Bar key={JSON.stringify(filter)} data={pendingReport} options={options} />
        ) : (
          'No data available for the selected range'
        )}
      </div>
    </div>
  );
};

export default PendingReportChart;
