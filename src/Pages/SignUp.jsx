import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider } from '../firebase'; // ✅ correct path
import { signInWithPopup } from 'firebase/auth';
import axios from 'axios';

export default function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    referrerId: '',
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get('ref');
    if (ref) {
      setFormData(prev => ({ ...prev, referrerId: ref }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Invalid email';
    if (!formData.phoneNumber.match(/^[0-9]{10,15}$/)) newErrors.phoneNumber = 'Invalid phone';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phoneNumber,
        referrerId: formData.referrerId || null, // ✅ fallback to null if not provided
      });

      console.log('✅ Registration success:', res.data);

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      navigate('/onboarding');
    } catch (err) {
      console.error(err);
      setApiError(err.response?.data?.message || 'Server error');
    }
  };

  const handleGoogleSignIn = async () => {
    setApiError('');
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log('✅ Google Firebase User:', user);

      const res = await axios.post('http://localhost:5000/api/auth/google', {
        name: user.displayName,
        email: user.email,
      });

      console.log('✅ Google backend success:', res.data);

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      navigate('/onboarding');
    } catch (error) {
      console.error('❌ Google Sign-In error:', error);
      setApiError('Google Sign-In failed. Please try again.');
    }
  };


  return (
    <div className="min-h-screen bg-[#140932] flex items-center justify-center px-4">
      <div className="bg-[#685699] rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Create Your Survico Account
        </h2>

        {apiError && (
          <p className="text-sm text-red-500 mb-2 text-center">{apiError}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded ${errors.fullName ? 'border-red-500' : ''}`}
          />
          {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}

          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded ${errors.email ? 'border-red-500' : ''}`}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}

          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded ${errors.phoneNumber ? 'border-red-500' : ''}`}
          />
          {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}

          <input
            type="password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded ${errors.password ? 'border-red-500' : ''}`}
          />
          {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-white text-center pt-5">Or</p>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 mt-4"
        >
          Sign Up with Google
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-white hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}
