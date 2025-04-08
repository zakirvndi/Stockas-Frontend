'use client'

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/app/lib/api';
import { toast } from 'react-toastify';
import { setAuthTokens, isAuthenticated } from '@/utils/auth';
import { BsEyeSlashFill } from 'react-icons/bs';
import { IoEyeSharp } from 'react-icons/io5';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
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
    
    if (!formData.email.trim()) {
      setEmailError('Email cannot be empty');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setEmailError('Invalid email format');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!formData.password.trim()) {
      setPasswordError('Password cannot be empty');
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
    
    if (name === 'email') setEmailError('');
    if (name === 'password') setPasswordError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    setIsLoading(true);
  
    try {
      const data = await loginUser(formData);
      setAuthTokens(data.token, data.refreshToken);
      window.location.href = '/dashboard';
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Incorrect email or password';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F4F1] px-4 sm:px-6 lg:px-8">
      {/* Mobile Logo */}
      <div className="md:hidden mb-8 flex justify-center">
        <Image
          src="/images/Logo.svg"
          alt="Logo"
          width={180} 
          height={180}
          className="w-[150px] h-auto" 
          priority
        />
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex w-full max-w-6xl">
        {/* Left Side - Welcome Graphic */}
        <div className="w-1/2 flex flex-col justify-center items-center min-h-screen">
          <div className="absolute top-6 left-6">
            <Image
              src="/images/Logo.svg"
              alt="Logo"
              width={200}
              height={200}
              className="w-[160px] lg:w-[200px] h-auto"
              priority
            />
          </div>
          <Image
            src="/images/WelcomeBack.svg"
            alt="Welcome Back"
            width={320}
            height={320}
            className="w-[280px] lg:w-[320px] h-auto"
            priority
          />
        </div>

        {/* Right Side - Login Form */}
        <div className="w-1/2 flex items-center justify-center py-12">
          <div className="w-full max-w-md bg-[#D2E8FD] p-6 rounded-lg shadow-md">
            <h2 className="text-2xl text-[#051D63] font-semibold mb-6 mt-2 text-left">Sign In</h2>
            
            {error && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-left font-medium" htmlFor="login-email">Email</label>
                <input 
                  autoComplete="email"
                  type="email" 
                  id="login-email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-2 py-3 border rounded-md bg-white italic text-sm focus:outline-none text-left ${
                    emailError ? 'border-red-500' : 'border-[#B4CCE4]'
                  }`}
                  required 
                />
                {emailError && (
                  <p className="text-red-500 text-xs mt-1 text-left">{emailError}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-left font-medium" htmlFor="login-password">Password</label>
                <div className="relative">
                  <input 
                    autoComplete="current-password"
                    type={showPassword ? "text" : "password"} 
                    id="login-password" 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md bg-white italic text-sm focus:outline-none text-left ${
                      passwordError ? 'border-red-500' : 'border-[#B4CCE4]'
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
                <a href="#" className="text-[#0040FF] text-xs mb-4 font-semibold">Forgot Password?</a>
              </div>
              
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 rounded-3xl hover:bg-blue-700 transition font-semibold disabled:opacity-70"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-3 sm:mt-4 lg:mt-5 text-center">
              <p className="text-xs sm:text-sm mb-4 sm:mb-5 px-2">
                By continuing, you are indicating that you have read and agree to the{' '}
                <a href="#" className="text-[#0040FF] font-semibold">Terms of Use</a> and{' '}
                <a href="#" className="text-[#0040FF] font-semibold">Privacy Policy</a>.
              </p>
              <p className="text-sm sm:text-base">
                Don&apos;t have an account?{' '}
                <a href="/register" className="text-[#0040FF] font-semibold">Sign up now.</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Login Form */}
      <div className="md:hidden w-full">
        <div className="w-full max-w-md bg-[#D2E8FD] p-6 rounded-lg shadow-md">
          <h2 className="text-2xl text-[#051D63] font-semibold mb-6 mt-2 text-left">Sign In</h2>
          
          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-left font-medium" htmlFor="login-email-mobile">Email</label>
              <input 
                autoComplete="email"
                type="email" 
                id="login-email-mobile" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-2 py-3 border rounded-md bg-white italic text-sm focus:outline-none text-left ${
                  emailError ? 'border-red-500' : 'border-[#B4CCE4]'
                }`}
                required 
              />
              {emailError && (
                <p className="text-red-500 text-xs mt-1 text-left">{emailError}</p>
              )}
            </div>
            
            <div className="mb-4">
              <label className="block text-left font-medium" htmlFor="login-password-mobile">Password</label>
              <div className="relative">
                <input 
                  autoComplete="current-password"
                  type={showPassword ? "text" : "password"} 
                  id="login-password-mobile" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md bg-white italic text-sm focus:outline-none text-left ${
                    passwordError ? 'border-red-500' : 'border-[#B4CCE4]'
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
              <a href="#" className="text-[#0040FF] text-xs mb-4 font-semibold">Forgot Password?</a>
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 rounded-3xl hover:bg-blue-700 transition font-semibold disabled:opacity-70"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-3 sm:mt-4 lg:mt-5 text-center">
            <p className="text-xs sm:text-sm mb-4 sm:mb-5 px-2">
              By continuing, you are indicating that you have read and agree to the{' '}
              <a href="#" className="text-[#0040FF] font-semibold">Terms of Use</a> and{' '}
              <a href="#" className="text-[#0040FF] font-semibold">Privacy Policy</a>.
            </p>
            <p className="text-sm sm:text-base">
              Don&apos;t have an account?{' '}
              <a href="/register" className="text-[#0040FF] font-semibold">Register now.</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;