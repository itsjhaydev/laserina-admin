import React, { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore'
import { Bar } from 'react-chartjs-2';

const CancelledReportChart = ({ filter }) => {
  const { cancelledReport, isLoading, getCancelledReport } = useAuthStore();

  useEffect(() => {
    getCancelledReport(filter);
  }, [filter, getCancelledReport]);

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
  cancelledReport &&
    Array.isArray(cancelledReport.labels) &&
    cancelledReport.labels.length > 0 &&
    Array.isArray(cancelledReport.datasets) &&
    cancelledReport.datasets.length > 0;

  return (
    <div>
      <h2 className="w-full text-lg font-semibold mb-2 text-blue-800 text-center">Confirmed Reservation Graph</h2>
      <div className="h-[150px] w-full flex justify-center items-center text-gray-500">
        {hasData ? (
          <Bar key={JSON.stringify(filter)} data={cancelledReport} options={options} />
        ) : (
          'No data available for the selected range'
        )}
      </div>
    </div>
  );
};

export default CancelledReportChart;
