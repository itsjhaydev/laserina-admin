import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MdEmail, MdLock } from 'react-icons/md';
import Input from '../components/Input';
import { useAuthStore } from '../store/authStore';
import Logo from "../assets/img/s-logo.png";

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { login, isLoading } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Email and password are required");
    }

    try {
      await login(email, password);
      toast.success("Login Successful");
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 via-white to-blue-100 px-4">
      <div className="bg-white shadow-2xl rounded-xl p-10 w-[35%] max-w-md space-y-6 animate-fade-in">
        {/* Logo */}
        <div className="flex justify-center items-center mb-6 space-x-2">
          <h2 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400">
            La
          </h2>

          <img
            src={Logo}
            alt="Admin Logo"
            className="h-16 w-auto"
          />

          <h2 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
            erina
          </h2>
        </div>


        <h2 className="text-3xl font-extrabold text-center text-blue-600">Admin Login</h2>

        <form onSubmit={handleLogin} className="space-y-4 px-2">
          <Input
            type="email"
            placeholder="Email"
            icon={MdEmail}
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Password"
            icon={MdLock}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded text-white transition-all duration-200 ${isLoading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Laserina Resort. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
