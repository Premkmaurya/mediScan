import React from "react";
import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <div className="w-screen h-screen">
      <Navbar />
      <HeroSection />
    </div>
  );
};

export default Home;