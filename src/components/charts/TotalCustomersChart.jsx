import React, { useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { useAuthStore } from '../../store/authStore';

const TotalCustomersChart = ({ filter }) => {
  const { customers, isLoading, getTotalCustomers } = useAuthStore();

  useEffect(() => {
    getTotalCustomers(filter);
  }, [filter, getTotalCustomers]);

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
    customers &&
    Array.isArray(customers.labels) &&
    customers.labels.length > 0 &&
    Array.isArray(customers.datasets) &&
    customers.datasets.length > 0;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2 text-gray-800">Total Customers</h2>
      <div className="h-[150px] flex justify-center items-center text-gray-500">
        {hasData ? (
          <Line key={JSON.stringify(filter)} data={customers} options={options} />
        ) : (
          'No data available for the selected range'
        )}
      </div>
    </div>
  );
};

export default TotalCustomersChart;
