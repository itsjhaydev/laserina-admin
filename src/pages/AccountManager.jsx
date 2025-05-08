import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore'; // Store import
import toast from 'react-hot-toast';

const AccountManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // For controlling modal visibility
  const [selectedAdmin, setSelectedAdmin] = useState(null); // For holding the selected admin when updating
  const [adminFormData, setAdminFormData] = useState({ email: '', password: '', name: '', role: 'admin' }); // Form data for admin creation or update

  const { admins, getAllAdminAccount, signup, updateAdmin } = useAuthStore(); // Destructuring from store

  useEffect(() => {
    getAllAdminAccount();
  }, []);


  // Set form data when an admin is selected for editing
  useEffect(() => {
    if (selectedAdmin) {
      setAdminFormData({
        email: selectedAdmin.email,
        name: selectedAdmin.name,
        role: selectedAdmin.role,
        password: '', // Don't prefill password
      });
    } else {
      setAdminFormData({ email: '', password: '', name: '', role: 'admin' });
    }
  }, [selectedAdmin]);

  // Open modal for creating a new admin
  const handleCreateClick = () => {
    setSelectedAdmin(null); // Clear any previous selection
    setIsModalOpen(true); // Open modal for creating new admin
  };

  // Open modal for editing an existing admin
  const handleEditClick = (admin) => {
    setSelectedAdmin(admin); // Set the selected admin for editing
    setIsModalOpen(true); // Open modal for editing
  };

  // Handle modal submit (either create or update)
  const handleModalSubmit = async () => {
    const { email, password, name, role } = adminFormData;

    // Validate form data before submitting
    if (!email || !password || !name) {
      alert("Name, email, and password are required.");
      return;
    }

    try {
      if (selectedAdmin) {
        // Update the admin if selectedAdmin exists
        await updateAdmin(selectedAdmin._id, adminFormData);
        toast.success('Account updated successfully');
      } else {
        // Create a new admin if no selectedAdmin
        await signup(name, email, password, role);
        toast.success('Account created successfully');
      }

      setIsModalOpen(false); // Close the modal after submission
      setSelectedAdmin(null); // Clear the selected admin after submission
    } catch (err) {
      console.error("Error during form submission:", err); // Log the error
      alert("Error submitting the form.");
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Modal Close Handler
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAdmin(null); // Reset selectedAdmin when closing the modal
  };

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-semibold mb-4 ">Admin Account Manager</h2>
      <div className="flex justify-end mb-4">
        <button
          onClick={handleCreateClick}
          className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md"
        >
          Create Admin
        </button>
      </div>
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b text-left">Name</th>
            <th className="px-4 py-2 border-b text-left">Email</th>
            <th className="px-4 py-2 border-b text-left">Role</th>
            <th className="px-4 py-2 border-b text-left">Last Login</th>
            <th className="px-4 py-2 border-b text-left">Created At</th>
            <th className="px-4 py-2 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins && admins.map((admin) => (
            <tr key={admin._id}>
              <td className="px-4 py-2 border-b">{admin.name}</td>
              <td className="px-4 py-2 border-b">{admin.email}</td>
              <td className="px-4 py-2 border-b">{admin.role}</td>
              <td className="px-4 py-2 border-b">
                {new Date(admin.lastLogin).toLocaleString()}
              </td>
              <td className="px-4 py-2 border-b">
                {new Date(admin.createdAt).toLocaleString()}
              </td>
              <td className="px-4 py-2 border-b">
                <button
                  onClick={() => handleEditClick(admin)}
                  className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Create or Update */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500/50 flex justify-center items-center z-40">
          <div className="bg-white p-6 rounded-md shadow-md w-96">
            <h3 className="text-xl mb-4">{selectedAdmin ? 'Edit Admin' : 'Create Admin'}</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-4">
                <label htmlFor="name" className="block mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={adminFormData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={adminFormData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block mb-2">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={adminFormData.password}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="role" className="block mb-2">Role</label>
                <select
                  id="role"
                  name="role"
                  value={adminFormData.role}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="admin">Admin</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleModalSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  {selectedAdmin ? 'Update Admin' : 'Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountManager;
