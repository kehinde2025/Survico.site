// src/Pages/Login.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider } from '../firebase'; // adjust the path if needed
import { signInWithPopup } from 'firebase/auth';
import api from '../utils/api';

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

    if (!validate()) return;

    try {
      let role = 'user';
      let userName = 'User Client';

      if (
        formData.email === 'admin@gmail.com' &&
        formData.password === 'admin123'
      ) {
        role = 'admin';
        userName = 'Admin Boss';
      } else if (
        formData.email === 'inspector@gmail.com' &&
        formData.password === 'inspect123'
      ) {
        role = 'inspector';
        userName = 'Inspector Joe';
      }

      const token = 'dummy-token-123';

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem(
        'user',
        JSON.stringify({
          email: formData.email,
          role,
          name: userName,
        })
      );

      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'inspector') {
        navigate('/inspector/dashboard');
      } else {
        const onboardingComplete = localStorage.getItem('onboardingComplete');
        if (onboardingComplete === 'true') {
          navigate('/dashboard');
        } else {
          navigate('/onboarding');
        }
      }
    } catch (err) {
      console.error(err);
      setLoginError('Invalid login. Please check your details.');
    }
  };

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log('✅ Google User:', user);

        // Example: store token or info
        localStorage.setItem('token', user.accessToken);
        localStorage.setItem('user', JSON.stringify({
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
        }));

        // Redirect to dashboard or wherever
        navigate('/dashboard');

      })
      .catch((error) => {
        console.error('❌ Google Sign-In error:', error);
      });
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#140932] px-4">
      <div className="bg-[#685699] rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Welcome Back to Survico
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
            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring ${errors.email ? 'border-red-500' : 'focus:ring-blue-300'
              }`}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring ${errors.password ? 'border-red-500' : 'focus:ring-blue-300'
              }`}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition"
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
