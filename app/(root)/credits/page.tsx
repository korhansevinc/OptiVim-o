"use client";

import React from "react";
import Image from "next/image";

// Example credit packages
const creditPlans = [
  {
    id: 1,
    name: "Starter Package",
    credits: 50,
    price: 29,
    icon: "/assets/icons/free-plan.svg",
    features: ["50 credits", "Access to basic features"],
  },
  {
    id: 2,
    name: "Pro Package",
    credits: 150,
    price: 69,
    icon: "/assets/icons/free-plan.svg",
    features: ["150 credits", "Advanced transformations", "Priority support"],
  },
  {
    id: 3,
    name: "Premium Package",
    credits: 500,
    price: 199,
    icon: "/assets/icons/free-plan.svg",
    features: ["500 credits", "Full feature access", "Faster processing", "Priority updates"],
  },
];

const CreditPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-center text-violet-700 mb-4">Buy Credits</h1>
      <p className="text-center text-gray-600 mb-10">
        Choose a credit package that fits your needs and enjoy advanced image processing features instantly.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {creditPlans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition"
          >
            <div className="w-12 h-12 relative mb-3">
              <Image
                src={plan.icon}
                alt={plan.name}
                fill
                className="object-contain"
              />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-1">{plan.name}</h2>
            <p className="text-gray-600 text-sm mb-4">{plan.credits} credits</p>
            <p className="text-2xl font-bold text-violet-600 mb-4">₺{plan.price}</p>

            <ul className="text-sm text-gray-600 mb-6 space-y-1">
              {plan.features.map((feature, index) => (
                <li key={index}>• {feature}</li>
              ))}
            </ul>

            <button className="bg-violet-600 text-white px-4 py-2 rounded-xl hover:bg-violet-700 transition">
              Purchase
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreditPage;
