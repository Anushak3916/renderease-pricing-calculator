import React, { useState, useEffect } from 'react';
import { Info, BarChart3 } from 'lucide-react';
import Header from './Header';
import PlanTabs from './PlanTabs';
import Plans3D from './Plans3D';
import PlansVP from './PlansVP';
import Calculator3D from './Calculator3D';
import CalculatorVP from './CalculatorVP';
import { PricingData, Currency, BillingPeriod } from '../types/pricing';
import { pricingData } from '../data/pricingData';

const PricingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'3d' | 'vp'>('3d');
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');
  const [currency, setCurrency] = useState<Currency>('INR');
  const [pricing, setPricing] = useState<PricingData>(pricingData);

  useEffect(() => {
    // Reset to original pricingData when currency changes, components will handle conversion
    setPricing(pricingData);
  }, [currency]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Header 
          currency={currency}
          setCurrency={setCurrency}
          pricing={pricing}
        />
        {/* PlanTabs and Billing Period Toggle Side by Side, now below Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4 mt-8">
          <PlanTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="flex justify-center md:justify-end">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                billingPeriod === 'monthly'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              }`}
              disabled={activeTab === 'vp'}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                billingPeriod === 'annual'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              } ml-2`}
              disabled={activeTab === 'vp'}
            >
              Annual Billing
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full ml-2">Save 15%</span>
            </button>
          </div>
        </div>

        {activeTab === '3d' && (
          <>
            <Plans3D 
              billingPeriod={billingPeriod}
              currency={currency}
              pricing={pricing}
            />
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg mb-8">
              <div className="flex items-center">
                <Info className="h-5 w-5 text-yellow-600 mr-3" />
                <p className="text-yellow-800 font-medium">
                  Our platform is currently under development. Pay As You Go option will be available upon launch.
                </p>
              </div>
            </div>

            <Calculator3D 
              billingPeriod={billingPeriod}
              currency={currency}
              pricing={pricing}
            />
          </>
        )}

        {activeTab === 'vp' && (
          <>
            <PlansVP currency={currency} pricing={pricing} billingPeriod={billingPeriod} />
            <CalculatorVP currency={currency} pricing={pricing} />
          </>
        )}
      </div>
    </div>
  );
};

export default PricingPage;