import React, { useState } from 'react';
import { authAPI, authUtils } from './services/api';

const RegistrationForm = ({ onAuthSuccess }) => {
  const [formType, setFormType] = useState('register'); // 'register' or 'login'
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (formType === 'register') {
        if (!form.name || !form.email || !form.password) {
          setError('All fields are required.');
          setLoading(false);
          return;
        }

        const response = await authAPI.register(form);
        setSuccess('Registration successful! You can now login.');
        
        // Switch to login form and keep email
        setFormType('login');
        setForm({
          name: '',
          email: form.email,
          password: '',
          role: 'student'
        });
      } else {
        // Login
        if (!form.email || !form.password) {
          setError('Email and password are required.');
          setLoading(false);
          return;
        }

        const loginData = {
          email: form.email,
          password: form.password
        };

        const response = await authAPI.login(loginData);
        
        // Store auth data
        authUtils.setAuthData(response.token, response.user);
        setSuccess(`Welcome back, ${response.user.name}!`);
        
        // Call parent component's success handler
        if (onAuthSuccess) {
          setTimeout(() => {
            onAuthSuccess(response.user);
          }, 1000);
        }
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow-md flex flex-col items-center">
      {/* Toggle between Register and Login */}
      <div className="flex gap-4 mb-6">
        <button
          type="button"
          onClick={() => setFormType('register')}
          className={`px-4 py-2 rounded-md font-semibold transition ${
            formType === 'register' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Register
        </button>
        <button
          type="button"
          onClick={() => setFormType('login')}
          className={`px-4 py-2 rounded-md font-semibold transition ${
            formType === 'login' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Login
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-blue-700">
        {formType === 'register' ? 'Register' : 'Login'}
      </h2>
      
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        {formType === 'register' && (
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        )}
        
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        
        {formType === 'register' && (
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className={`py-2 rounded-md font-semibold transition ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          {loading ? 'Processing...' : (formType === 'register' ? 'Register' : 'Login')}
        </button>
      </form>
      
      {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
      {success && <p className="text-green-600 mt-4 text-center">{success}</p>}
    </div>
  );
};

export default RegistrationForm;
