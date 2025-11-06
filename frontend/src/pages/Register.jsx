import React, { useState } from "react";
import loginSideImage from "../assets/login-img.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";

const App = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    setLoading(true);

    const response = await axios.post("https://mediscan-eqyv.onrender.com//api/auth/login",e,{
      withCredentials:true
    })
    if (response.status===400) {
      alert(response.data.message)
    }
    setLoading(false)
    navigate("/")

  };

  return (
    // Outer container: Soft light background for the entire viewport
    <div className="min-h-screen flex bg-gray-100 font-sans">
      {/* Login Card: Centered and responsive */}
      <div className="w-full max-w-[35%] flex justify-center item-center">
        <div className="w-full  bg-white p-8 sm:p-10 rounded-3xl shadow-xl transition-all duration-300">
          {/* Header/Logo Section */}
          <div className="text-center mb-10">
            {/* Logo Placeholder (Mini icon square) */}
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-xl mb-4 flex items-center justify-center shadow-md">
              {/* Replace with your actual logo/icon, e.g., using a Lucide icon like <HeartPulse className="w-8 h-8 text-blue-500" /> */}
              <span className="text-blue-500 font-bold text-xs">LOGO</span>
            </div>

            <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">
              MediScan
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Your health, simplified.
            </p>
          </div>

          {/* --- Login Form --- */}
          <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
            {/* name input */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm text-left font-medium text-gray-700 mb-2"
              >
                Name
              </label>
              <input
                type="email"
                {...register("name", { required: "Email is required" })}
                placeholder="john due"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 shadow-inner text-gray-800 placeholder-gray-400"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm text-left font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 shadow-inner text-gray-800 placeholder-gray-400"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm text-left font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                {...register("password", { required: "password is required" })}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 shadow-inner text-gray-800 placeholder-gray-400"
              />
               {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
            </div>

            {/* Login Button with Gradient */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-4 text-white font-semibold rounded-xl transition duration-300 ease-in-out
                       bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 
                       shadow-lg shadow-blue-500/50 flex items-center justify-center disabled:opacity-70 disabled:shadow-none"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center flex item-center justify-end text-sm text-gray-500 mt-6">
            Don't have an account?
            <p
              onClick={() => navigate("/register")}
              href="#"
              className="font-semibold cursor-pointer text-blue-500 hover:text-blue-600 ml-1 transition-colors"
            >
              Create an Account
            </p>
          </p>
        </div>

        {/* Footer / Compliance Text */}
        <footer className="absolute bottom-0 w-full p-4 text-center text-xs text-gray-500 bg-transparent">
          Powered by AI • HIPAA Compliant • Secure & Private
        </footer>
      </div>
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        <img
          src={loginSideImage}
          alt="Modern abstract geometric illustration"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 mix-blend-overlay" />
      </div>
    </div>
  );
};

export default App;
