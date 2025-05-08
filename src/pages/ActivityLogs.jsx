import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";

const ActivityLogs = () => {
    const { activityLogs, getActivityLogs, isLoading, error, currentUser } = useAuthStore();
    const [activeAdmin, setActiveAdmin] = useState(null);

    useEffect(() => {
        getActivityLogs();
    }, []);

    if (isLoading) return <p className="text-center py-10">Loading activity logs...</p>;
    if (error) return <p className="text-red-600 text-center py-10">Error: {error}</p>;

    if (!Array.isArray(activityLogs) || activityLogs.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500 italic">
                No activity logs available yet.
            </div>
        );
    }

    // Filter logs based on role
    const visibleLogs = activityLogs.filter((log) =>
        currentUser?.role === "superadmin" ? true : log.role !== "superadmin"
    );

    if (visibleLogs.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500 italic">
                No accessible activity logs to show.
            </div>
        );
    }

    const handleAdminClick = (adminId) => {
        setActiveAdmin((prevId) => (prevId === adminId ? null : adminId));
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Activity Logs</h1>
            <table className="min-w-full table-auto border-collapse">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-4 py-2 border-b text-left">Name</th>
                        <th className="px-4 py-2 border-b text-left">Role</th>
                        <th className="px-4 py-2 border-b text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {visibleLogs.map((userLog, idx) => (
                        <React.Fragment key={`${userLog.name}-${userLog.role}-${idx}`}>
                            <tr
                                className="hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleAdminClick(idx)}
                            >
                                <td className="px-4 py-2 border-b">{userLog.name}</td>
                                <td className="px-4 py-2 border-b">{userLog.role}</td>
                                <td className="px-4 py-2 border-b text-blue-500">View Logs</td>
                            </tr>
                            {activeAdmin === idx && (
                                <tr>
                                    <td colSpan="3" className="p-4 bg-gray-50">
                                        {userLog.activityLogs.length > 0 ? (
                                            <ul className="space-y-2 text-sm text-gray-800">
                                                {userLog.activityLogs.map((log) => (
                                                    <li key={log._id} className="border-b pb-2">
                                                        <div className="font-medium">{log.action}</div>
                                                        <div>{log.details}</div>
                                                        <div className="text-gray-500 text-xs">
                                                            {new Date(log.timestamp).toLocaleString()}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm italic text-gray-500">
                                                No logs found for this admin yet.
                                            </p>
                                        )}
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ActivityLogs;
