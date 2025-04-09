'use client'

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/app/lib/api';
import { toast } from 'react-toastify';
import { setAuthTokens, isAuthenticated } from '@/utils/auth';
import { BsEyeSlashFill } from 'react-icons/bs';
import { IoEyeSharp } from 'react-icons/io5';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  const validateForm = () => {
    let isValid = true;
    
    if (!formData.name.trim()) {
      setNameError('Nama tidak boleh kosong.');
      isValid = false;
    } else if (formData.name.length < 3) {
      setNameError('Nama minimal memiliki 3 huruf.');
      isValid = false;
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.name)) {
      setNameError('Nama hanya boleh mengandung huruf dan spasi.');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!formData.email.trim()) {
      setEmailError('Email tidak boleh kosong.');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setEmailError('Format email tidak valid.');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!formData.password.trim()) {
      setPasswordError('Password tidak boleh kosong.');
      isValid = false;
    } else if (formData.password.length < 8) {
      setPasswordError('Password harus minimal 8 karakter.');
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
      setPasswordError('Password harus mengandung huruf besar, huruf kecil, angka, dan karakter khusus.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'name') setNameError('');
    if (name === 'email') setEmailError('');
    if (name === 'password') setPasswordError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    setIsLoading(true);
  
    try {
      const data = await registerUser(formData);
      setAuthTokens(data.token, data.refreshToken);

      sessionStorage.setItem('tempUserName', formData.name);
      sessionStorage.setItem('tempUserEmail', formData.email);

      window.location.href = '/dashboard';
    } catch (err) {
      let errorMessage = 'Registration failed';
      if (err instanceof Error) {
        errorMessage = err.message.includes('Email sudah terdaftar') 
          ? 'Email sudah terdaftar. Silakan gunakan email lain.'
          : err.message;
      }
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div style={{ backgroundColor: '#F9F4F1' }} className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md sm:max-w-md md:max-w-lg lg:max-w-md bg-transparent">
        <div className="flex items-center justify-center">
          <Image
            src="/images/Logo.svg"
            alt="Logo"
            width={170}
            height={170}
            className="h-auto w-[140px] sm:w-[160px] md:w-[170px]"
          />
        </div>

        <p className="text-center text-base sm:text-lg text-[#001B67] font-semibold mt-8 mb-2">
          Simplify Your Finances, Streamline Your Stock
        </p>
        <p className="text-center text-xs sm:text-sm text-[#676767]">
          Stockas helps small businesses streamline their finances and effortlessly manage product stock.
        </p>

        {error && (
          <div className="mt-4 mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-md bg-white focus:outline-none text-sm text-gray-500 ${
                nameError ? 'border-red-500 border-2' : 'border-[#B4CCE4] border-2'
              }`}
              required
            />
            {nameError && (
              <p className="text-red-500 text-xs mt-1 text-left">{nameError}</p>
            )}
          </div>
          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-md bg-white focus:outline-none text-sm text-gray-500 ${
                emailError ? 'border-red-500 border-2' : 'border-[#B4CCE4] border-2'
              }`}
              required
            />
            {emailError && (
              <p className="text-red-500 text-xs mt-1 text-left">{emailError}</p>
            )}
          </div>
          <div className="mb-6">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-md bg-white focus:outline-none text-sm text-gray-500 ${
                  passwordError ? 'border-red-500 border-2' : 'border-[#B4CCE4] border-2'
                }`}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <BsEyeSlashFill className="w-5 h-5" /> : <IoEyeSharp className="w-5 h-5" />}
              </button>
            </div>
            {passwordError && (
              <p className="text-red-500 text-xs mt-1 text-left">{passwordError}</p>
            )}
            {!passwordError && formData.password && (
              <div className="text-xs text-gray-500 mt-1 text-left">
                Password harus mengandung:
                <ul className="list-disc pl-5">
                  <li className={formData.password.length >= 8 ? 'text-green-500' : ''}>Minimal 8 karakter</li>
                  <li className={/[a-z]/.test(formData.password) ? 'text-green-500' : ''}>Huruf kecil</li>
                  <li className={/[A-Z]/.test(formData.password) ? 'text-green-500' : ''}>Huruf besar</li>
                  <li className={/\d/.test(formData.password) ? 'text-green-500' : ''}>Angka</li>
                  <li className={/[@$!%*?&]/.test(formData.password) ? 'text-green-500' : ''}>Karakter khusus (@$!%*?&)</li>
                </ul>
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-3 rounded-3xl hover:bg-[#0040FF] font-semibold sm:text-base transition disabled:opacity-70"
          >
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-3 sm:mt-4 lg:mt-5 text-center text-gray-500">
          <p className="text-xs sm:text-sm mb-4 sm:mb-5 px-2">
            By continuing, you are indicating that you have read and agree to the{' '}
            <a href="#" className="text-[#0040FF] font-semibold">Terms of Use</a> and{' '}
            <a href="#" className="text-[#0040FF] font-semibold">Privacy Policy</a>.
          </p>

          <p className="text-sm sm:text-base">
            Already have an account?{' '}
            <a href="/login" className="text-[#0040FF] font-semibold">Sign in now.</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;