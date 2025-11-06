import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate()

  return (
    <nav className="bg-white/70 backdrop-blur-md fixed w-full top-0 left-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Medi<span className="text-blue-500">Scan</span>
          </h1>
        </div>

        {/* Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <button onClick={()=>Navigate("/sign-in")} className="px-5 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition">
            Sign in
          </button>
          <button className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow">
            Get Started
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-sm">
          <div className="flex flex-col space-y-4 py-4 px-6 text-gray-700 font-medium">
            <a href="#" className="hover:text-blue-500 transition">Home</a>
            <a href="#" className="hover:text-blue-500 transition">Apple Health</a>
            <a href="#" className="hover:text-blue-500 transition">Notion</a>
            <a href="#" className="hover:text-blue-500 transition">Learn</a>
            <hr className="border-gray-200" />
            <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100">
              Sign in
            </button>
            <button className="w-full text-left px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow">
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
