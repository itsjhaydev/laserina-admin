import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminLogin from './pages/AdminLogin'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'

//Layout
import DashboardLayout from './layout/DashboardLayout'


//Layout Pages
import Dashboard from './pages/Dashboard'
import AccountManager from './pages/AccountManager'
import LoadingSpinner from './components/LoadingSpinner'
import AddReservation from './pages/AddReservation'
import PendingReservation from './pages/PendingReservation'
import CancelledReservation from './pages/CancelledReservation'
import CompletedReservation from './pages/CompletedReservation'
import ConfirmedReservation from './pages/ConfirmedReservation'
import PendingReports from './pages/Reports/PendingReports'
import ConfirmedReports from './pages/Reports/ConfirmedReports'
import CancelledReports from './pages/Reports/CancelledReports'
import CompletedReports from './pages/Reports/CompletedReports'
import ActivityLogs from './pages/ActivityLogs'

const App = () => {

  const { isCheckingAuth, checkAuth, user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      checkAuth();
    }
  }, [user, checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div className='w-full min-h-screen'>
      <Toaster position="top-center" />
      <Routes>
        <Route path='/' element={<AdminLogin />} />

        <Route path='/dashboard' element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="account-manager" element={<AccountManager />} />
          <Route path='activity-log' element={<ActivityLogs />} />

          {/* Reservations Route */}
          <Route path="reservation/add-reservation" element={<AddReservation />} />
          <Route path="reservation/pending-reservation" element={<PendingReservation />} />
          <Route path="reservation/confirmed-reservation" element={<ConfirmedReservation />} />
          <Route path="reservation/cancelled-reservation" element={<CancelledReservation />} />
          <Route path="reservation/completed-reservation" element={<CompletedReservation />} />
          
          {/* Reports Route */}
          <Route path="reports/pending" element={<PendingReports />} />
          <Route path="reports/confirmed" element={<ConfirmedReports />} />
          <Route path="reports/cancelled" element={<CancelledReports />} />
          <Route path="reports/completed" element={<CompletedReports />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App