import React from 'react'
import Image from 'next/image'


const page = () => {
  return (
    <div style={{ backgroundColor: '#F9F4F1' }} className="flex items-center justify-center min-h-screen">
      <div className="m-4 w-full max-w-md">
        <div className="flex items-center justify-center">
          <Image
            src="/images/Logo.svg"
            alt="Landscape picture"
            width={180}
            height={180}
          />
        </div>
        <p className="text-center text-lg text-gray-600">
          Simplify Your Finances, Streamline Your Stock
        </p>
        <p className="text-center text-xs text-gray-600">Stockas helps small businesses streamline their finances and effortlessly manage product stock.</p>
        <form className="mt-6">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-2 rounded-md bg-white focus:outline-none focus:border-blue-500 italic"
              required
              style={{ border: '2px solid #B4CCE4' }}
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-2 rounded-md bg-white focus:outline-none focus:border-blue-500 italic"
              required
              style={{ border: '2px solid #B4CCE4' }}
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 rounded-md bg-white focus:outline-none focus:border-blue-500 italic"
              required
              style={{ border: '2px solid #B4CCE4' }}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-base text-gray-500 mt-4">
          By continuing, you are indicating that you have read and agree to the
          <a href="#" className="text-blue-500"> Terms of Use</a> and
          <a href="#" className="text-blue-500"> Privacy Policy.</a>
        </p>
        <p className="text-center text-gray-500 mt-2">
          Already have an account? <a href="#" className="text-blue-500">Sign in now.</a>
        </p>
      </div>
    </div>
  )
}

export default page