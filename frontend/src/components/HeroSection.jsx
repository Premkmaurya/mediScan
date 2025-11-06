import React from "react";
import heroImg from '../assets/hero-medical.png'
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate()
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-white to-blue-50 py-16 md:py-24">
      <div className="container mx-auto px-6 lg:px-12 flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
        
        {/* Left Content */}
        <div className="max-w-xl text-center lg:text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-full text-xs md:text-sm font-medium border border-green-100 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            HIPAA Compliant & Secure
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-[3.2rem] font-extrabold leading-tight text-gray-900">
            Understand Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">
              Medical Reports
            </span>{" "}
            Instantly
          </h1>

          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            MediScan uses advanced AI to transform complex medical documents into clear, 
            easy-to-understand summaries. Finally, healthcare made simple.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <button onClick={()=>navigate("/chat")} className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow transition">
              Get Started Free →
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-4 text-gray-500 text-sm">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              No credit card required
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Free forever plan
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative w-full flex justify-center lg:justify-end">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-teal-100 rounded-3xl blur-3xl opacity-30"></div>
          <img
            src={heroImg}
            alt="MedScan dashboard"
            className="relative z-10 rounded-3xl shadow-2xl w-[90%] sm:w-[80%] md:w-[500px] lg:w-[600px]"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
