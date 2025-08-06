// src/Pages/Login.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Enter a valid email';
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    if (!validate()) return;

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      const { user, token } = res.data;

      // ✅ Save token + user
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // ✅ Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'spectator') {
        navigate('/spectator/dashboard');
      } else {
        const onboarded = user.profileCompleted;
        navigate(onboarded ? '/dashboard' : '/onboarding');
      }

    } catch (err) {
      console.error(err);
      setLoginError(err.response?.data?.message || 'Invalid login.');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const googleUser = result.user;

      const res = await axios.post('http://localhost:5000/api/auth/google', {
        name: googleUser.displayName,
        email: googleUser.email,
      });

      const { user, token } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'spectator') {
        navigate('/spectator/dashboard');
      } else {
        const onboarded = user.profileCompleted;
        navigate(onboarded ? '/dashboard' : '/onboarding');
      }

    } catch (error) {
      console.error(error);
      setLoginError('Google login failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#140932] px-4">
      <div className="bg-[#685699] rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Log In to Survico
        </h2>

        {loginError && (
          <p className="text-sm text-red-500 mb-2 text-center">{loginError}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded focus:outline-none ${errors.email ? 'border-red-500' : ''}`}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded focus:outline-none ${errors.password ? 'border-red-500' : ''}`}
          />
          {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800"
          >
            Log In
          </button>
        </form>

        <p className="text-sm text-white text-center pt-5">Or</p>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 mt-4"
        >
          Log In with Google
        </button>

        <p className="text-sm text-center mt-4">
          Don’t have an account?{' '}
          <a href="/signup" className="text-white hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
