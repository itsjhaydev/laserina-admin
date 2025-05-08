import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaBars,
  FaEnvelope,
  FaSignOutAlt,
  FaPlusCircle,
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
  FaClipboardCheck,
  FaChartBar,
  FaHistory,
  FaUserTie
} from 'react-icons/fa';
import Logo from "../assets/img/s-logo.png";
import pageTitles from '../constants/pageTitle';
import { useAuthStore } from '../store/authStore';

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;
  const pageTitle = pageTitles[currentPath] || 'DASHBOARD';

  // Sidebar width and header height
  const sidebarWidth = collapsed ? '5rem' : '16rem';  // w-20 for collapsed, w-64 for expanded
  const headerHeight = '4rem';  // Example header height (adjust as necessary)

  const [sidebarStyle, setSidebarStyle] = useState(sidebarWidth);
  const [showReservation, setShowReservation] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [mainContentMarginLeft, setMainContentMarginLeft] = useState(sidebarWidth);

  const { logout, user } = useAuthStore();
  

  useEffect(() => {
    // Update the margin and sidebar width when the collapsed state changes
    setSidebarStyle(sidebarWidth);
    setMainContentMarginLeft(sidebarWidth);
  }, [collapsed]);

  // Logout function
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white text-blue-900 transition-all duration-300 ease-in-out 
        ${collapsed ? 'w-20' : 'w-64'} p-4 z-40`}
        style={{ width: sidebarStyle }}
      >
        {/* Logo & Collapse Button */}
        <div className="flex items-center justify-around mb-8">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-blue-900 hover:text-blue-700"
          >
            <FaBars size={20} />
          </button>
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <h2 className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400">
                La
              </h2>
              <img src={Logo} alt="Logo" className="h-8 w-auto" />
              <h2 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                erina
              </h2>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-4 text-lg">

          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2 rounded-md transition 
    ${isActive ? 'bg-blue-300 font-semibold' : 'hover:bg-blue-900 hover:text-white'}`
            }
          >
            <FaTachometerAlt size={25} />
            {!collapsed && <span>Dashboard</span>}
          </NavLink>

          {/* Reservation Dropdown */}
          <div>
            <button
              onClick={() => {
                setShowReservation(prev => !prev);
                setShowReports(false); // Close Reports when toggling Reservation
              }}
              className="flex items-center w-full space-x-3 px-3 py-2 rounded-md transition hover:bg-blue-900 hover:text-white"
            >
              <FaEnvelope size={25} />
              {!collapsed && <span>Reservation</span>}
            </button>
            {!collapsed && showReservation && (
              <div className="ml-8 mt-2 space-y-2">
                <NavLink
                  to="/dashboard/reservation/add-reservation"
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-2 py-1 rounded-md text-sm ${isActive ? 'bg-blue-300 font-semibold' : 'hover:bg-blue-800 hover:text-white'}`
                  }
                >
                  <FaPlusCircle size={16} />
                  <span>Add</span>
                </NavLink>

                <NavLink
                  to="/dashboard/reservation/pending-reservation"
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-2 py-1 rounded-md text-sm ${isActive ? 'bg-blue-300 font-semibold' : 'hover:bg-blue-800 hover:text-white'}`
                  }
                >
                  <FaHourglassHalf size={16} />
                  <span>Pending</span>
                </NavLink>


                <NavLink
                  to="/dashboard/reservation/confirmed-reservation"
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-2 py-1 rounded-md text-sm ${isActive ? 'bg-blue-300 font-semibold' : 'hover:bg-blue-800 hover:text-white'
                    }`
                  }
                >
                  <FaCheckCircle size={16} />
                  <span>Confirmed</span>
                </NavLink>

                <NavLink
                  to="/dashboard/reservation/cancelled-reservation"
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-2 py-1 rounded-md text-sm ${isActive ? 'bg-blue-300 font-semibold' : 'hover:bg-blue-800 hover:text-white'
                    }`
                  }
                >
                  <FaTimesCircle size={16} />
                  <span>Cancelled</span>
                </NavLink>

                <NavLink
                  to="/dashboard/reservation/completed-reservation"
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-2 py-1 rounded-md text-sm ${isActive ? 'bg-blue-300 font-semibold' : 'hover:bg-blue-800 hover:text-white'
                    }`
                  }
                >
                  <FaClipboardCheck size={16} />
                  <span>Completed</span>
                </NavLink>
              </div>
            )}

          </div>

          {/* Reports Dropdown */}
          <div>
            <button
              onClick={() => {
                setShowReports(prev => !prev);
                setShowReservation(false); // Close Reservation when toggling Reports
              }}
              className="flex items-center w-full space-x-3 px-3 py-2 rounded-md transition hover:bg-blue-900 hover:text-white"
            >
              <FaChartBar size={25} />
              {!collapsed && <span>Reports</span>}
            </button>

            {!collapsed && showReports && (
              <div className="ml-8 mt-2 space-y-2 text-sm">
                <NavLink
                  to="/dashboard/reports/pending"
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-2 py-1 rounded-md ${isActive ? 'bg-blue-300 font-semibold' : 'hover:bg-blue-800 hover:text-white'}`
                  }
                >
                  <FaHourglassHalf size={16} />
                  <span>Pending</span>
                </NavLink>

                <NavLink
                  to="/dashboard/reports/confirmed"
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-2 py-1 rounded-md ${isActive ? 'bg-blue-300 font-semibold' : 'hover:bg-blue-800 hover:text-white'}`
                  }
                >
                  <FaCheckCircle size={16} />
                  <span>Confirmed</span>
                </NavLink>

                <NavLink
                  to="/dashboard/reports/cancelled"
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-2 py-1 rounded-md ${isActive ? 'bg-blue-300 font-semibold' : 'hover:bg-blue-800 hover:text-white'}`
                  }
                >
                  <FaTimesCircle size={16} />
                  <span>Cancelled</span>
                </NavLink>

                <NavLink
                  to="/dashboard/reports/completed"
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-2 py-1 rounded-md ${isActive ? 'bg-blue-300 font-semibold' : 'hover:bg-blue-800 hover:text-white'}`
                  }
                >
                  <FaClipboardCheck size={16} />
                  <span>Completed</span>
                </NavLink>
              </div>
            )}
          </div>

          {user?.role !== 'admin' && (
            <NavLink
              to="/dashboard/activity-log"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2 rounded-md transition 
      ${isActive ? 'bg-blue-300 font-semibold' : 'hover:bg-blue-900 hover:text-white'}`
              }
            >
              <FaHistory size={25} />
              {!collapsed && <span>Activity Logs</span>}
            </NavLink>
          )}

          <div className="flex flex-col space-y-2 pb-8 absolute bottom-0">
            {user?.role !== 'admin' && (
              <NavLink
                to="/dashboard/account-manager"
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-md transition 
        ${isActive ? 'bg-blue-300 font-semibold' : 'hover:bg-blue-900 hover:text-white'}`
                }
              >
                <FaUserTie size={25} />
                {!collapsed && <span>Account Manager</span>}
              </NavLink>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-3 py-2 rounded-md transition hover:bg-blue-900 hover:text-white"
            >
              <FaSignOutAlt size={25} />
              {!collapsed && <span>Logout</span>}
            </button>
        </div>
      </nav>

    </aside>

      {/* Main Content Area */ }
  <div
    className="flex-1 flex flex-col transition-all duration-300"
    style={{
      marginLeft: mainContentMarginLeft,
      minHeight: `calc(100vh - ${headerHeight})`,
    }}
  >
    {/* Header */}
    <header
      className="sticky top-0 bg-white shadow-sm border-b px-4 flex items-center justify-between z-30"
      style={{ height: headerHeight }}
    >
      <h1 className="text-xl font-bold text-blue-900">{pageTitle}</h1>

      <div className="flex items-center space-x-4">
        <FaEnvelope className="text-blue-700 hover:text-blue-900 cursor-pointer" size={20} />
        <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center text-white font-semibold">
          A
        </div>
      </div>
    </header>

    {/* Page Content */}
    <main
      className="flex-1 overflow-y-auto overflow-x-hidden"
      style={{ marginTop: `calc(${headerHeight} - 3rem)` }}
    >
      <Outlet />
    </main>

  </div>
    </div >
  );
};

export default DashboardLayout;