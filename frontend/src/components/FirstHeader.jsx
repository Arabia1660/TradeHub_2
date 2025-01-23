import React from "react";
import { useRoutes } from "react-router-dom";

const FirstHeader = () => {

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white shadow-md">
      <div className="text-2xl font-bold text-blue-600">TradHub</div>
      <nav>
        <ul className="flex space-x-6">
          <li><a href="#features" className="hover:text-blue-600">Features</a></li>
          <li><a href="#pricing" className="hover:text-blue-600">Pricing</a></li>
          <li><a href="#cta" className="hover:text-blue-600">Start Trading</a></li>
        </ul>
      </nav>
      <a href="/login" className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
        Login
      </a>
    </header>
  );
};

export default FirstHeader;
