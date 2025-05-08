import React, { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore'
import { Bar } from 'react-chartjs-2';

const CompletedReportChart = ({ filter }) => {
  const { completedReport, isLoading, getCompletedReport } = useAuthStore();

  useEffect(() => {
    getCompletedReport(filter);
  }, [filter, getCompletedReport]);

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
  completedReport &&
    Array.isArray(completedReport.labels) &&
    completedReport.labels.length > 0 &&
    Array.isArray(completedReport.datasets) &&
    completedReport.datasets.length > 0;

  return (
    <div>
      <h2 className="w-full text-lg font-semibold mb-2 text-blue-800 text-center">Completed Reservation Graph</h2>
      <div className="h-[150px] w-full flex justify-center items-center text-gray-500">
        {hasData ? (
          <Bar key={JSON.stringify(filter)} data={completedReport} options={options} />
        ) : (
          'No data available for the selected range'
        )}
      </div>
    </div>
  );
};

export default CompletedReportChart;
