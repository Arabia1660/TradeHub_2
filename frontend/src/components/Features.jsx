import React from "react";

const Features = () => {
  const features = [
    { title: "Real-Time Analytics", description: "Track live market insights.", icon: "📊" },
    { title: "Secure Transactions", description: "Your data is always safe.", icon: "🔒" },
    { title: "Zero Commission", description: "Trade with 0% fees.", icon: "💸" },
  ];

  return (
    <section id="features" className="py-16 bg-gray-100">
      <div className="container mx-auto text-center">
        <h2 className="mb-8 text-4xl font-bold">Why Choose Us?</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg">
              <div className="mb-4 text-6xl">{feature.icon}</div>
              <h3 className="mb-2 text-2xl font-semibold">{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
