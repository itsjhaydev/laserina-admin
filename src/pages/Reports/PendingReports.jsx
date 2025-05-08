import React, { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import FilterControls from '../../components/FilterControls';
import PendingReportChart from '../../components/chartReports/PendingReportChart';
import ChartBoxReport from '../../components/CharBoxReport';
import { useReactToPrint } from 'react-to-print';

const PendingReports = () => {
    const [filter, setFilter] = useState({
        fromYear: 2025,
        toYear: 2026,
        fromMonth: '01',
        toMonth: '12',
    });

    const printRef = useRef();

    const handlePrint = useReactToPrint({
        contentRef: printRef,  // Use contentRef to pass the reference
        documentTitle: "Pending Report",
    });
    

    const { pendingReport, getPendingReport, isLoading, error } = useAuthStore();

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getPendingReport(filter);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [filter]);

    const pendingReportData = pendingReport?.tableData || []; // FIX: correctly map the "table" from API response

    return (
        <div className="flex flex-col space-y-6 px-4 pt-0 pb-8">
            {/* Filter Section */}
            <div className="flex justify-between">
                <button
                    onClick={handlePrint}
                    className="mb-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    Print
                </button>
                <FilterControls filter={filter} setFilter={setFilter} />
            </div>

            {/* Printable Section */}
            <div ref={printRef}>
                {/* Chart Section */}
                <div className="w-full flex justify-center items-center print:pt-40">
                    <ChartBoxReport>
                        <PendingReportChart filter={filter} />
                    </ChartBoxReport>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-lg shadow-md p-6 print:p-0 print:w-full">
                    <h2 className="text-lg font-semibold text-blue-800 mb-4 text-center">Pending Reservation Table</h2>

                    {isLoading ? (
                        <p className="text-blue-600">Loading...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : pendingReportData.length === 0 ? (
                        <p className="text-gray-500 text-center">No pending reservations available for the selected range.</p>
                    ) : (
                        <div className="w-full">
                            <table className="w-full table-auto border border-gray-200 rounded-lg">
                                <thead className="bg-blue-100 text-gray-700 text-sm">
                                    <tr>
                                        <th className="px-4 py-2 border">Guest Name</th>
                                        <th className="px-4 py-2 border">Email</th>
                                        <th className="px-4 py-2 border">Cottage</th>
                                        <th className="px-4 py-2 border">Check-in</th>
                                        <th className="px-4 py-2 border">Check-out</th>
                                        <th className="px-4 py-2 border">Amount</th>
                                        <th className="px-4 py-2 border">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingReportData.map((reservation) => (
                                        <tr key={reservation._id} className="text-sm text-gray-700 hover:bg-gray-50">
                                            <td className="px-4 py-2 border">{reservation.guestName}</td>
                                            <td className="px-4 py-2 border">{reservation.email}</td>
                                            <td className="px-4 py-2 border">{reservation.cottageName}</td>
                                            <td className="px-4 py-2 border">
                                                {new Date(reservation.checkIn).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-2 border">
                                                {new Date(reservation.checkOut).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-2 border">₱{reservation.totalAmount.toFixed(2)}</td>
                                            <td className="px-4 py-2 border">
                                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                                                    Pending
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PendingReports;
