import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import PendingActionModal from "../components/PendingActionModal"; // Import the action modal
import toast from "react-hot-toast";

const ConfirmedReservation = () => {
  const { confirmedReservations, getConfirmedReservation, completeReservation, isLoading, error } = useAuthStore();

  const [selectedReservation, setSelectedReservation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredReservations, setFilteredReservations] = useState(confirmedReservations);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal state for reservation completion
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [reservationToComplete, setReservationToComplete] = useState(null); // Store reservation ID for completion

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredReservations?.length / itemsPerPage) || 1;

  // Paginate the filtered reservations data
  const paginatedData = filteredReservations?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    getConfirmedReservation();
  }, []);

  // Watch for changes in confirmedReservations and update filteredReservations
  useEffect(() => {
    setFilteredReservations(confirmedReservations);
  }, [confirmedReservations]);

  // Filter function
  const filterReservations = (query) => {
    if (!query) {
      setFilteredReservations(confirmedReservations);
    } else {
      const lowerQuery = query.toLowerCase();
      const filtered = confirmedReservations.filter((reservation) => {
        const valuesToSearch = [
          reservation.guestName,
          reservation.cottageName,
          reservation.email,
          reservation.contactNumber,
          reservation.address,
          new Date(reservation.checkIn).toDateString(),
          new Date(reservation.checkOut).toDateString(),
        ];

        return valuesToSearch.some((value) =>
          value?.toString().toLowerCase().includes(lowerQuery)
        );
      });

      setFilteredReservations(filtered);
    }

    setCurrentPage(1);
  };

  // Handle search query change
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    filterReservations(query);
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Handle completion of reservation
  const handleConfirmReservation = async () => {
    if (!reservationToComplete) return;

    try {
      await completeReservation(reservationToComplete);
      closeCompleteModal();
      toast.success(`Reservation completed successfully!`);
    } catch (error) {
      closeCompleteModal();
      toast.error("Error completing reservation");
    }
  };

  const openCompleteModal = (reservationId) => {
    setReservationToComplete(reservationId);
    setShowCompleteModal(true);
  };

  const closeCompleteModal = () => {
    setShowCompleteModal(false);
    setReservationToComplete(null);
  };

  const handleViewDetails = (reservation) => {
    setSelectedReservation(reservation);
  };

  const closeModal = () => {
    setSelectedReservation(null);
  };

  return (
    <div className="px-4 py-8 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="bg-white rounded-lg shadow-xl px-6 py-6">
          <h2 className="text-2xl font-semibold text-blue-900 mb-3 text-center">Confirmed Reservations</h2>

          {/* Search input */}
          <div className="mb-3 flex justify-center">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by guest name, cottage name, etc."
              className="w-1/2 px-4 py-2 border rounded-lg shadow-sm text-sm focus:outline-none"
            />
          </div>

          {isLoading && <p className="text-blue-500">Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!isLoading && !error && (
            <table className="w-full table-auto bg-white shadow-md rounded-lg border border-gray-300">
              <thead>
                <tr className="text-left bg-blue-100">
                  <th className="px-6 py-3 text-sm font-bold text-gray-600">Guest Name</th>
                  <th className="px-6 py-3 text-sm font-bold text-gray-600">Cottage Name</th>
                  <th className="px-6 py-3 text-sm font-bold text-gray-600">Check-in</th>
                  <th className="px-6 py-3 text-sm font-bold text-gray-600">Total Amount</th>
                  <th className="px-6 py-3 text-sm font-bold text-gray-600">Status</th>
                  <th className="px-6 py-3 text-sm font-bold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData?.map((reservation) => (
                  <tr key={reservation._id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 text-sm text-gray-800 border-b">{reservation.guestName}</td>
                    <td className="px-6 py-4 text-sm text-gray-800 border-b">{reservation.cottageName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 border-b">{new Date(reservation.checkIn).toDateString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-800 border-b">₱{reservation.totalAmount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-800 border-b">
                      <span className="px-3 py-1 rounded-full bg-blue-200 text-blue-900 text-sm font-medium">
                        {reservation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 border-b">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(reservation)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition duration-200 flex items-center justify-center"
                        >
                          View
                        </button>
                        <button
                          onClick={() => openCompleteModal(reservation._id)} // Open complete modal on click
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition duration-200 flex items-center justify-center"
                        >
                          Complete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination Controls */}
          <div className="flex justify-center mt-3 space-x-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-6 py-3 bg-gray-200 rounded hover:bg-gray-300 text-sm font-semibold disabled:opacity-50 transition duration-200"
            >
              Previous
            </button>
            <span className="self-center text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-6 py-3 bg-gray-200 rounded hover:bg-gray-300 text-sm font-semibold disabled:opacity-50 transition duration-200"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Complete Reservation Modal */}
      <PendingActionModal
        isOpen={showCompleteModal}
        message="Are you sure you want to complete this reservation?"
        onConfirm={handleConfirmReservation} // Proceed with reservation completion
        onCancel={closeCompleteModal} // Close the modal without action
      />

      {/* Reservation Details Modal */}
      {selectedReservation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl relative shadow-xl">
            <button
              className="absolute top-3 right-4 text-gray-500 text-2xl font-bold"
              onClick={closeModal}
            >
              ×
            </button>
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">Personal Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <Detail label="Name" value={selectedReservation.guestName} />
              <Detail label="Email" value={selectedReservation.email} />
              <Detail label="Contact Number" value={selectedReservation.contactNumber} />
              <Detail label="Address" value={selectedReservation.address} />
            </div>
            <h2 className="text-2xl font-semibold text-blue-700 mt-6 mb-4">Reservation Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <Detail label="Reservation ID" value={selectedReservation._id} />
              <Detail label="Status" value={selectedReservation.status} />
              <Detail label="Cottage Name" value={selectedReservation.cottageName} />
              <Detail label="Cottage Price" value={`₱${selectedReservation.cottagePrice}/head`} />
              <Detail label="Number of Guests" value={selectedReservation.numberOfGuest} />
              <Detail label="Check-in" value={new Date(selectedReservation.checkIn).toDateString()} />
              <Detail label="Check-out" value={new Date(selectedReservation.checkOut).toDateString()} />
              <Detail label="Total Amount" value={`₱${selectedReservation.totalAmount}`} />
            </div>
            {selectedReservation.proofOfPayment && (
              <>
                <h2 className="text-2xl font-semibold text-center text-blue-700 mt-6 mb-4">Proof of Payment</h2>
                <div className="flex flex-col justify-center items-center">
                  <label htmlFor="proofOfpayment">Receipt</label>
                  <Detail
                    label=""
                    value={
                      <img
                        className="h-[200px] border border-gray-400 rounded-md shadow-md mt-2"
                        src={selectedReservation.proofOfPayment}
                        alt="Proof of Payment"
                      />
                    }
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

export default ConfirmedReservation;
