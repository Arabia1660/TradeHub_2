import React from "react";

const Footer = () => {
  return (
    <footer className="py-6 text-center text-white bg-gray-800">
      <p>&copy; {new Date().getFullYear()} TradeHub. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
