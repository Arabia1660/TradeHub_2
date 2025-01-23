import React from "react";
import Hero from "./components/Hero";
import Features from "./components/Features";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import FirstHeader from "./components/FirstHeader";

function App() {
  return (
    <div className="bg-gray-50">
      <FirstHeader />
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
}

export default App;
