import React, { useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { useAuthStore } from '../../store/authStore';

const TotalRepeatedGuestsChart = ({ filter }) => {
  const { repeatedGuests, isLoading, getTotalRepeatedGuests } = useAuthStore();

  useEffect(() => {
    getTotalRepeatedGuests(filter);
  }, [filter, getTotalRepeatedGuests]);

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
    repeatedGuests &&
    Array.isArray(repeatedGuests.labels) &&
    repeatedGuests.labels.length > 0 &&
    Array.isArray(repeatedGuests.datasets) &&
    repeatedGuests.datasets.length > 0;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2 text-gray-800">Repeated Guests</h2>
      <div className="h-[150px] flex justify-center items-center text-gray-500">
        {hasData ? (
          <Bar key={JSON.stringify(filter)} data={repeatedGuests} options={options} />
        ) : (
          'No data available for the selected range'
        )}
      </div>
    </div>
  );
};

export default TotalRepeatedGuestsChart;
