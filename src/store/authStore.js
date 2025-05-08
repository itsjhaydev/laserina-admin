import { create } from "zustand";
import axios from "axios";

const BASE_URL =
	import.meta.env.MODE === "development"
		? "http://localhost:5000/api"
		: import.meta.env.VITE_API_URL || "/api";


const AUTH_API = `${BASE_URL}/admin`;
const RESERVATION_API = `${BASE_URL}/reservations`;

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
	user: null,
	isAuthenticated: false,
	error: null,
	isLoading: false,
	isCheckingAuth: true,
	message: null,
	reservations: null,
	pendingReservations: null,
	confirmedReservations: null,
	cancelledReservations: null,
	completedReservations: null,
	customers: null,
	repeatedGuests: null,
	revenue: null,
	pendingReport: null,
	confirmedReport: null,
	cancelledReport: null,
	completedReport: null,
	activityLogs: null,
	admins: [],

	signup: async (name, email, password, role) => {
		const token = localStorage.getItem('adminToken');
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${AUTH_API}/register`,
				{ name, email, password, role },
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				},
				{ withCredentials: true }
			);

			// ✅ Refresh accounts from the server
			await useAuthStore.getState().getAllAdminAccount();

			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
		} catch (error) {
			set({ error: error.response?.data?.message || "Error signing up", isLoading: false });
			throw error;
		}
	},

	login: async (email, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${AUTH_API}/login`, { email, password });
			
			set({ isAuthenticated: true, user: response.data.admin, error: null, isLoading: false });
		} catch (error) {
			set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
			throw error;
		}
	},

	logout: async () => {
		set({ isLoading: true, error: null });
		try {
			await axios.post(`${AUTH_API}/logout`, {}, {
				withCredentials: true // 🔥 REQUIRED for cookies to be sent
			});
			set({ user: null, isAuthenticated: false, error: null, isLoading: false });
		} catch (error) {
			set({ error: "Error logging out", isLoading: false });
			throw error;
		}
	},

	checkAuth: async () => {
		set({ isCheckingAuth: true, error: null });
		try {
			const response = await axios.get(`${AUTH_API}/check-auth`);
			set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
		} catch (error) {
			set({ error: null, isCheckingAuth: false, isAuthenticated: false });
		}
	},

	updateAdmin: async (adminId, updateData) => {
		const token = localStorage.getItem('adminToken');
		set({ isLoading: true, error: null });

		try {
			const response = await axios.put(`${AUTH_API}/update/${adminId}`, updateData, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			});

			// ✅ Refresh accounts from the server
			await useAuthStore.getState().getAllAdminAccount();

			set({ isLoading: false });
			return response.data;
		} catch (error) {
			set({ error: error.response?.data?.message || "Error updating admin", isLoading: false });
			throw error;
		}
	},

	createReservation: async (reservationData) => {
		set({ isLoading: true, error: null, message: null });

		try {
			// Send reservation data to the backend API
			await axios.post(`${AUTH_API}/create-reservation`, reservationData, {
				headers: {
					'Content-Type': 'application/json',
				},
				withCredentials: true, // Ensure we send cookies (for authentication)
			});

			set({
				message: 'Reservation created successfully',
				isLoading: false,
				error: null,
			});
		} catch (error) {
			let errorMessage = 'Error creating reservation';

			if (error.response) {
				errorMessage = error.response.data?.message || errorMessage;
			}

			set({ isLoading: false, error: errorMessage });
			throw new Error(errorMessage);
		}
	},


	getPendingReservation: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.get(`${RESERVATION_API}/pending-reservations`, {
				withCredentials: true,
			});


			set({
				pendingReservations: response.data.reservations,
				isLoading: false,
			});

		} catch (error) {
			set({
				error: error.response?.data?.message || 'Failed to fetch pending reservations',
				isLoading: false,
			});
		}
	},

	getConfirmedReservation: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.get(`${RESERVATION_API}/confirmed-reservations`, {
				withCredentials: true,
			});


			set({
				confirmedReservations: response.data.reservations,
				isLoading: false,
			});

		} catch (error) {
			set({
				error: error.response?.data?.message || 'Failed to fetch pending reservations',
				isLoading: false,
			});
		}
	},

	getCancelledReservation: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.get(`${RESERVATION_API}/cancelled-reservations`, {
				withCredentials: true,
			});

			set({
				cancelledReservations: response.data.reservations,
				isLoading: false,
			});

		} catch (error) {
			set({
				error: error.response?.data?.message || 'Failed to fetch cancelled reservations',
				isLoading: false,
			});
		}
	},

	getCompletedReservation: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.get(`${RESERVATION_API}/completed-reservations`, {
				withCredentials: true,
			});

			set({
				completedReservations: response.data.reservations,
				isLoading: false,
			});

		} catch (error) {
			set({
				error: error.response?.data?.message || 'Failed to fetch completed reservations',
				isLoading: false,
			});
		}
	},

	cancelReservation: async (reservationId) => {
		set({ isLoading: true, error: null });

		try {
			const response = await axios.post(
				`${AUTH_API}/cancel-reservation/${reservationId}`,
				{},
				{ withCredentials: true }
			);

			// ✅ Refresh reservations from the server
			await useAuthStore.getState().getPendingReservation();

			set({
				isLoading: false,
				message: response.data.message || 'Reservation canceled successfully',
			});

			return response.data;
		} catch (error) {
			set({
				error: error.response?.data?.message || "Error canceling reservation",
				isLoading: false,
			});
			throw error;
		}
	},

	confirmReservation: async (reservationId) => {
		set({ isLoading: true, error: null });

		try {
			const response = await axios.post(
				`${AUTH_API}/confirm-reservation/${reservationId}`,
				{},
				{ withCredentials: true }
			);

			// ✅ Refresh reservations from the server
			await useAuthStore.getState().getPendingReservation();

			set({
				isLoading: false,
				message: response.data.message || 'Reservation confirmed successfully',
			});

			return response.data;
		} catch (error) {
			set({
				error: error.response?.data?.message || "Error confirmed reservation",
				isLoading: false,
			});
			throw error;
		}
	},

	completeReservation: async (reservationId) => {
		set({ isLoading: true, error: null });

		try {
			const response = await axios.post(
				`${AUTH_API}/complete-reservation/${reservationId}`,
				{},
				{ withCredentials: true }
			);

			// ✅ Refresh reservations from the server
			await useAuthStore.getState().getConfirmedReservation();

			set({
				isLoading: false,
				message: response.data.message || 'Reservation confirmed successfully',
			});

			return response.data;
		} catch (error) {
			set({
				error: error.response?.data?.message || "Error confirmed reservation",
				isLoading: false,
			});
			throw error;
		}
	},

	getTotalCustomers: async (filter) => {
		set({ isLoading: true, error: null });

		try {
			const response = await axios.get(`${RESERVATION_API}/total-customers`, {
				params: filter,
			});

			const customersData = response.data.customers;
			const total = customersData.raw?.reduce((sum, item) => sum + item.totalCustomers, 0);

			const formatted = {
				labels: customersData.labels,
				datasets: customersData.datasets,
				total,
			};

			set({ customers: formatted, isLoading: false });
			return formatted;
		} catch (error) {
			set({
				error: error.response?.data?.message || 'Error fetching total customers',
				isLoading: false,
			});
			return null;
		}
	},

	getTotalRepeatedGuests: async (filter) => {
		set({ isLoading: true, error: null });

		try {
			const response = await axios.get(`${RESERVATION_API}/repeated-guests`, {
				params: filter,
			});

			const repeatedGuestsData = response.data.repeatedGuests;
			const total = repeatedGuestsData.raw?.reduce((sum, item) => sum + item.totalRepeatedGuests, 0);

			const formatted = {
				labels: repeatedGuestsData.labels,
				datasets: repeatedGuestsData.datasets,
				total,
			};

			set({ repeatedGuests: formatted, isLoading: false });
			return formatted;
		} catch (error) {
			console.error("Failed to fetch repeated guests:", error);
			set({
				error: error.response?.data?.message || "Error fetching repeated guests",
				isLoading: false,
			});
		}
		return null;
	},

	getTotalReservations: async (filter) => {
		set({ isLoading: true, error: null });

		try {
			const response = await axios.get(`${RESERVATION_API}/total-reservations`, {
				params: filter,
			});

			const totalReservationsData = response.data.totalReservations;
			const total = totalReservationsData.raw?.reduce((sum, item) => sum + item.totalReservations, 0);

			const formatted = {
				labels: totalReservationsData.labels,
				datasets: totalReservationsData.datasets,
				raw: totalReservationsData.raw,
				total,
			};

			set({ reservations: formatted, isLoading: false });
			return formatted;
		} catch (error) {
			console.error("Failed to fetch total reservations:", error);
			set({
				error: error.response?.data?.message || "Error fetching total reservations",
				isLoading: false,
			});
			return null;
		}
	},

	getTotalRevenue: async (filter) => {
		set({ isLoading: true, error: null });

		try {
			const response = await axios.get(`${RESERVATION_API}/total-revenue`, {
				params: filter,
			});

			const revenueData = response.data.totalRevenue;
			const total = revenueData.raw?.reduce((sum, item) => sum + item.totalRevenue, 0);

			const formatted = {
				labels: revenueData.labels,
				datasets: revenueData.datasets,
				raw: revenueData.raw,
				total,
			};

			set({ revenue: formatted, isLoading: false });
			return formatted;
		} catch (error) {
			console.error("Failed to fetch total revenue:", error);
			set({
				error: error.response?.data?.message || "Error fetching total revenue",
				isLoading: false,
			});
			return null;
		}
	},

	//reports

	getPendingReport: async (filter) => {
		set({ isLoading: true, error: null });

		try {
			const response = await axios.get(`${RESERVATION_API}/pending-report`, {
				params: filter,
			});

			const pendingReportData = response.data.pendingReports;

			const formatted = {
				labels: pendingReportData.labels,
				datasets: pendingReportData.datasets,
				tableData: response.data.tableData,  // ✅ store raw table data separately
				raw: pendingReportData.raw,
				total: pendingReportData.total,
			};

			set({ pendingReport: formatted, isLoading: false });
			return formatted;
		} catch (error) {
			console.error("Failed to fetch pending report:", error);
			set({
				error: error.response?.data?.message || "Error fetching pending report",
				isLoading: false,
			});
			return null;
		}
	},

	getConfirmedReport: async (filter) => {
		set({ isLoading: true, error: null });

		try {
			const response = await axios.get(`${RESERVATION_API}/confirmed-report`, {
				params: filter,
			});

			const { confirmedReports, tableData, total } = response.data;

			const formatted = {
				labels: confirmedReports.labels,
				datasets: confirmedReports.datasets,
				tableData: tableData, // ✅ correctly placed
				raw: confirmedReports.raw,
				total: total
			};

			set({ confirmedReport: formatted, isLoading: false });
			return formatted;
		} catch (error) {
			console.error("Failed to fetch confirmed report:", error);
			set({
				error: error.response?.data?.message || "Error fetching confirmed report",
				isLoading: false,
			});
			return null;
		}
	},

	getCancelledReport: async (filter) => {
		set({ isLoading: true, error: null });

		try {
			const response = await axios.get(`${RESERVATION_API}/cancelled-report`, {
				params: filter,
			});

			const { cancelledReports, tableData, total } = response.data;

			const formatted = {
				labels: cancelledReports.labels,
				datasets: cancelledReports.datasets,
				tableData: tableData, // ✅ correctly placed
				raw: cancelledReports.raw,
				total: total
			};

			set({ cancelledReport: formatted, isLoading: false });
			return formatted;
		} catch (error) {
			console.error("Failed to fetch confirmed report:", error);
			set({
				error: error.response?.data?.message || "Error fetching confirmed report",
				isLoading: false,
			});
			return null;
		}
	},

	getCompletedReport: async (filter) => {
		set({ isLoading: true, error: null });

		try {
			const response = await axios.get(`${RESERVATION_API}/completed-report`, {
				params: filter,
			});

			const { completedReports, tableData, total } = response.data;

			const formatted = {
				labels: completedReports.labels,
				datasets: completedReports.datasets,
				tableData: tableData,
				raw: completedReports.raw,
				total: total
			};

			set({ completedReport: formatted, isLoading: false });
			return formatted;
		} catch (error) {
			console.error("Failed to fetch confirmed report:", error);
			set({
				error: error.response?.data?.message || "Error fetching confirmed report",
				isLoading: false,
			});
			return null;
		}
	},


	getActivityLogs: async () => {
		set({ isLoading: true, error: null });

		try {
			const response = await axios.get(`${AUTH_API}/activity-log`);
			const activityLogs = response.data.activityLogs;

			set({ activityLogs, isLoading: false });
			return activityLogs;
		} catch (error) {
			console.error("Failed to fetch activity logs:", error);
			set({
				error: error.response?.data?.message || "Error fetching activity logs",
				isLoading: false,
			});
			return null;
		}
	},


	// acount manager
	getAllAdminAccount: async () => {
		set({ isLoading: true, error: null });  // Start loading
		try {
			const response = await axios.get(`${AUTH_API}/admins`);  // API call to fetch admins
			set({ admins: response.data, isLoading: false });  // Update admins state
		} catch (error) {
			set({
				error: error.response?.data?.message || 'Error fetching admins',
				isLoading: false,
			});
			console.error('Error fetching data:', error);
		}
	},


}));
