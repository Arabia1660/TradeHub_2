import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="flex items-center h-screen text-white bg-blue-500">
      <div className="container flex flex-col items-center p-8 mx-auto lg:flex-row">
        <div className="text-center lg:w-1/2 lg:text-left">
          <h1 className="mb-6 text-5xl font-bold">
            Trade Smarter, Not Harder
          </h1>
          <p className="mb-8 text-lg">
            Join the world’s leading trading platform and maximize your profits today.
          </p>
          <Link to="/login" className="px-6 py-3 text-black bg-yellow-500 rounded hover:bg-yellow-600">
            Start Trading
          </Link>
        </div>
        <div className="mt-8 lg:w-1/2 lg:mt-0">
          <img
            src="/hero-image.jpeg"
            alt="Trading Dashboard"
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
