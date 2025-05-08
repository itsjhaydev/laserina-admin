import React, { useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { useAuthStore } from '../../store/authStore';

const TotalReservationsChart = ({ filter }) => {
  const { reservations, isLoading, getTotalReservations } = useAuthStore();

  useEffect(() => {
    getTotalReservations(filter);
  }, [filter, getTotalReservations]);

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
    reservations &&
    Array.isArray(reservations.labels) &&
    reservations.labels.length > 0 &&
    Array.isArray(reservations.datasets) &&
    reservations.datasets.length > 0;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2 text-gray-800">Total Reservations</h2>
      <div className="h-[150px] flex justify-center items-center text-gray-500">
        {hasData ? (
          <Bar key={JSON.stringify(filter)} data={reservations} options={options} />
        ) : (
          'No data available for the selected range'
        )}
      </div>
    </div>
  );
};

export default TotalReservationsChart;
