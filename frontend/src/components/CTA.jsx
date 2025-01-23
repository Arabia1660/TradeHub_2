import React from "react";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section id="cta" className="py-16 text-center bg-yellow-500">
      <h2 className="mb-4 text-4xl font-bold">Start Trading Today!</h2>
      <p className="mb-6 text-lg">Sign up and enjoy zero commission on your first trades.</p>
      <Link to="/register" className="px-8 py-3 text-white bg-black rounded hover:bg-gray-800">
        Sign Up Now
      </Link>
    </section>
  );
};

export default CTA;
