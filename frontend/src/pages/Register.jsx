import React from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import axios from "axios"

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    // handle registration logic here
    const response = await axios.post("http://localhost:3000/api/auth/register",data,{
      withCredentials:true
    })
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl"
      >
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-100">
          Welcome  
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-2">
            <div className="w-1/2">
              <input
                type="text"
                placeholder="First Name"
                className="w-full p-3 text-white outline-none rounded-xl focus:ring-2 focus:ring-blue-500"
                {...register('firstname', { required: 'First name is required' })}
              />
              {errors.firstname && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
              )}
            </div>
            <div className="w-1/2">
              <input
                type="text"
                placeholder="Last Name"
                className="w-full p-3 text-white outline-none rounded-xl focus:ring-2 focus:ring-blue-500"
                {...register('lastname', { required: 'Last name is required' })}
              />
              {errors.lastname && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 text-white outline-none rounded-xl focus:ring-2 focus:ring-blue-500"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 text-white outline-none rounded-xl focus:ring-2 focus:ring-blue-500"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account?{' '}
              <a href="/login" className="text-blue-600 hover:underline">
                Log in
              </a>
        </p>
      </motion.div>
    </div>
  );
}