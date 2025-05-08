import React, { useEffect, useState } from 'react';
import TotalCustomersChart from '../components/charts/TotalCustomersChart';
import TotalReservationsChart from '../components/charts/TotalReservationsChart ';
import TotalRevenueChart from '../components/charts/TotalRevenueChart ';
import TotalRepeatedGuestsChart from '../components/charts/TotalRepeatedGuestsChart ';
import { useAuthStore } from '../store/authStore';
import FilterControls from '../components/FilterControls';
import StatCard from '../components/StatCard';
import ChartBox from '../components/ChartBox';

const Dashboard = () => {
  const [filter, setFilter] = useState({
    fromYear: 2024,
    toYear: 2025,
    fromMonth: '01',
    toMonth: '12',
  });

  const [statistics, setStatistics] = useState({
    totalCustomers: 0,
    totalRepeatedGuests: 0,
    totalReservations: 0,
    totalRevenue: 0,
  });

  const {
    getTotalCustomers,
    getTotalReservations,
    getTotalRevenue,
    getTotalRepeatedGuests,
  } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customerData = await getTotalCustomers(filter);
        const repeatedGuestData = await getTotalRepeatedGuests(filter);
        const reservationsData = await getTotalReservations(filter);
        const revenueData = await getTotalRevenue(filter);

        setStatistics({
          totalCustomers: customerData?.total || 0,
          totalRepeatedGuests: repeatedGuestData?.total || 0,
          totalReservations: reservationsData?.total || 0,
          totalRevenue: revenueData?.total || 0,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [filter]);

  return (
    <div className="flex flex-col space-y-2 px-4 pt-0">
      {/* Filter Section */}
      <FilterControls filter={filter} setFilter={setFilter} />

      {/* Statistics Section */}
      <div className="flex justify-between gap-4 mb-4">
        <StatCard title="Total Customers" value={statistics.totalCustomers} color="text-blue-500" />
        <StatCard title="Repeated Guests" value={statistics.totalRepeatedGuests} color="text-indigo-500" />
        <StatCard title="Total Reservations" value={statistics.totalReservations} color="text-green-500" />
        <StatCard title="Total Revenue" value={`₱${statistics.totalRevenue}`} color="text-orange-500" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-x-4 gap-y-2">
        <ChartBox><TotalCustomersChart filter={filter} /></ChartBox>
        <ChartBox><TotalRepeatedGuestsChart filter={filter} /></ChartBox>
        <ChartBox><TotalReservationsChart filter={filter} /></ChartBox>
        <ChartBox><TotalRevenueChart filter={filter} /></ChartBox>
      </div>
    </div>
  );
};

export default Dashboard;