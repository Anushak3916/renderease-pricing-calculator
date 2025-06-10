import React from 'react';
import { Calendar, DollarSign } from 'lucide-react';
import { BillingPeriod, Currency, PricingData } from '../types/pricing';

interface HeaderProps {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  pricing: PricingData;
}

const Header: React.FC<HeaderProps> = ({
  currency,
  setCurrency,
  pricing
}) => {
  return (
    <div className="rounded-3xl shadow-lg bg-gradient-to-br from-purple-50 via-blue-50 to-white p-10 mb-8 flex flex-col items-center">
      <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-4 text-center drop-shadow-lg">
        Flexible Pricing for Your Creative Needs
      </h1>
      <p className="text-xl text-gray-600 mb-8 text-center max-w-2xl">
        Choose a plan that fits your business, and add only what you need. No restrictions, just flexibility.
      </p>
      <div className="bg-white rounded-xl shadow flex items-center gap-4 px-6 py-4 border border-gray-200">
        <span className="font-medium text-gray-700">Select Currency:</span>
        <select
          className="text-lg font-semibold px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400"
          value={currency}
          onChange={e => setCurrency(e.target.value as Currency)}
        >
          <option value="INR">INR (₹)</option>
          <option value="USD">USD ($)</option>
          <option value="CAD">CAD (C$)</option>
          <option value="AED">AED (د.إ)</option>
        </select>
      </div>
    </div>
  );
};

export default Header;