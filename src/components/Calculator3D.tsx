import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp } from 'lucide-react';
import SKUSelector from './SKUSelector';
import AddOnSelector from './AddOnSelector';
import { BillingPeriod, Currency, PricingData, SKUCounts } from '../types/pricing';

interface Calculator3DProps {
  billingPeriod: BillingPeriod;
  currency: Currency;
  pricing: PricingData;
}

const Calculator3D: React.FC<Calculator3DProps> = ({ billingPeriod, currency, pricing }) => {
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro' | 'enterprise'>('starter');
  const [skuCounts, setSKUCounts] = useState<SKUCounts>({
    basic: 2,
    medium: 2,
    complex: 0
  });
  const [addOns, setAddOns] = useState({
    exploded: 0,
    animation: 0,
    texturing: 0
  });

  // Set plan limits to match included SKUs for each plan
  const planLimits: Record<string, SKUCounts> = {
    starter: { basic: 2, medium: 2, complex: 0 },
    pro: { basic: 3, medium: 3, complex: 2 },
    enterprise: { basic: 0, medium: 0, complex: 0 }
  };

  // Set default SKU counts to match plan's included SKUs
  useEffect(() => {
    const limits = planLimits[selectedPlan];
    setSKUCounts({
      basic: limits.basic,
      medium: limits.medium,
      complex: limits.complex
    });
  }, [selectedPlan]);

  const calculateCosts = () => {
    // Included SKUs per plan
    const includedBasic = selectedPlan === 'starter' ? 2 : selectedPlan === 'pro' ? 3 : 0;
    const includedMedium = selectedPlan === 'starter' ? 2 : selectedPlan === 'pro' ? 3 : 0;
    const includedComplex = selectedPlan === 'pro' ? 2 : 0;

    // Additional SKUs
    const additionalBasic = Math.max(0, skuCounts.basic - includedBasic);
    const additionalMedium = Math.max(0, skuCounts.medium - includedMedium);
    const additionalComplex = Math.max(0, skuCounts.complex - includedComplex);

    // Additional SKU costs (first period only)
    const additionalBasicCost = additionalBasic * pricing.unit3d.basic;
    const additionalMediumCost = additionalMedium * pricing.unit3d.medium;
    const additionalComplexCost = additionalComplex * pricing.unit3d.complex;
    const additionalSKUTotal = additionalBasicCost + additionalMediumCost + additionalComplexCost;

    // Maintenance fees (applies to all SKUs, included + additional)
    const maintenanceBasic = skuCounts.basic * 500;
    const maintenanceMedium = skuCounts.medium * 500;
    const maintenanceComplex = skuCounts.complex * 500;
    const maintenanceFee = maintenanceBasic + maintenanceMedium + maintenanceComplex;

    let planPrice = (selectedPlan === 'starter' || selectedPlan === 'pro' || selectedPlan === 'enterprise')
    ? pricing.base3d.monthly[selectedPlan]
    : 0;

    // Calculate add-ons total
    const addOnsTotal = (addOns.exploded * pricing.unit3d.exploded) + (addOns.animation * pricing.unit3d.animation) + (addOns.texturing * pricing.unit3d.ar);

    let firstPeriodTotal;
    let ongoingPeriodTotal;

    if (billingPeriod === 'monthly') {
        if (selectedPlan === 'starter') {
            // Starter plan logic: 11,999 covers default SKUs for first month
            firstPeriodTotal = pricing.base3d.monthly.starter + additionalSKUTotal + addOnsTotal;
        } else if (selectedPlan === 'pro') { // Pro plan logic
            firstPeriodTotal = planPrice + additionalSKUTotal + addOnsTotal;
        } else { // Enterprise plan logic
            firstPeriodTotal = additionalSKUTotal + addOnsTotal; // No plan price for enterprise
        }
        ongoingPeriodTotal = maintenanceFee;
    } else { // annual billing
        // For annual, the "first period total" should represent the total cost for the first year (plan + additional SKUs + add-ons)
        firstPeriodTotal = (selectedPlan === 'starter' ? 10999 : selectedPlan === 'pro' ? 25499 : 0) + additionalSKUTotal + addOnsTotal;
        ongoingPeriodTotal = maintenanceFee * 12; // This is total annual maintenance
    }

    return {
      additionalBasicCost,
      additionalMediumCost,
      additionalComplexCost,
      maintenanceBasic,
      maintenanceMedium,
      maintenanceComplex,
      maintenanceFee,
      firstPeriodTotal,
      ongoingPeriodTotal,
      includedBasic,
      includedMedium,
      includedComplex,
      additionalBasic,
      additionalMedium,
      additionalComplex,
      additionalSKUTotal,
      addOnsTotal
    };
  };

  const costs = calculateCosts();
  const formatPrice = (price: number) => `${pricing.symbols[currency]}${Math.round(price * pricing.rates[currency]).toLocaleString()}`;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Calculator className="h-8 w-8 text-purple-600" />
          <h3 className="text-3xl font-bold text-gray-900">Estimate Your Costs</h3>
        </div>
        <p className="text-lg text-gray-600">Select a plan and adjust your SKUs to see dynamic pricing</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-stretch">
        {/* Left Column - Plan Selection & SKU Configuration */}
        <div className="space-y-6">
          {/* Plan Selection */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-xl font-semibold mb-4">Choose Your Plan</h4>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedPlan('starter')}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedPlan === 'starter'
                    ? 'border-purple-500 bg-purple-50 text-purple-900'
                    : 'border-gray-200 bg-white hover:border-purple-200'
                }`}
              >
                <h5 className="font-semibold">Starter</h5>
                <p className="text-2xl font-bold">
                  {formatPrice(billingPeriod === 'annual' 
                    ? 10999
                    : pricing.base3d.monthly.starter
                  )}
                </p>
                <p className="text-sm text-gray-600">
                  {billingPeriod === 'annual' 
                    ? `Setup + ₹2,000`
                    : `Setup + ${formatPrice(2 * 500 + 2 * 500)}`}
                </p>
              </button>
              <button
                onClick={() => setSelectedPlan('pro')}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedPlan === 'pro'
                    ? 'border-purple-500 bg-purple-50 text-purple-900'
                    : 'border-gray-200 bg-white hover:border-purple-200'
                }`}
              >
                <h5 className="font-semibold">Pro</h5>
                <p className="text-2xl font-bold">
                  {formatPrice(billingPeriod === 'annual' 
                    ? 25499
                    : pricing.base3d.monthly.pro
                  )}
                </p>
                <p className="text-sm text-gray-600">
                  {billingPeriod === 'annual' 
                    ? `Setup + ₹2,000`
                    : `Setup + ${formatPrice(pricing.base3d.monthly.proPlatform)}`}
                </p>
              </button>
              <button
                onClick={() => setSelectedPlan('enterprise')}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedPlan === 'enterprise'
                    ? 'border-purple-500 bg-purple-50 text-purple-900'
                    : 'border-gray-200 bg-white hover:border-purple-200'
                }`}
              >
                <h5 className="font-semibold">Enterprise</h5>
                <p className="text-2xl font-bold">
                  {formatPrice(0)}
                </p>
                <p className="text-sm text-gray-600">
                  Fully customizable based on your needs
                </p>
              </button>
            </div>
          </div>

          {/* SKU Configuration */}
          <SKUSelector
            selectedPlan={selectedPlan}
            skuCounts={skuCounts}
            setSKUCounts={setSKUCounts}
            planLimits={planLimits}
            pricing={pricing}
            currency={currency}
            additionalCounts={{
              additionalBasic: costs.additionalBasic,
              additionalMedium: costs.additionalMedium,
              additionalComplex: costs.additionalComplex
            }}
            billingPeriod={billingPeriod === 'annual' ? 'annual' : 'monthly'}
          />

          {/* Add-ons */}
          <AddOnSelector
            addOns={addOns}
            setAddOns={setAddOns}
            pricing={pricing}
            currency={currency}
            billingPeriod={billingPeriod === 'annual' ? 'annual' : 'monthly'}
          />
        </div>

        {/* Right Column - Cost Breakdown & Results */}
        <div className="space-y-6">
          {/* SKU Usage Summary */}
          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <h4 className="text-xl font-semibold mb-4 text-blue-900">SKU Usage Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <h5 className="font-bold text-xl text-blue-800 mb-3 flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cube text-blue-500"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.26 7.06 12 12 20.74 7.06"></polyline><line x1="12" x2="12" y1="22" y2="12"></line></svg> Basic SKUs</h5>
                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Plan Limit:</span>
                    <span className="font-semibold">{planLimits[selectedPlan].basic}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Current Usage:</span>
                    <span className="font-semibold">{skuCounts.basic}</span>
                  </div>
                  {selectedPlan !== 'enterprise' && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-700">Included:</span>
                      <span className="font-bold text-green-700">{Math.min(skuCounts.basic, planLimits[selectedPlan].basic)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-amber-700">Additional:</span>
                    <span className="font-bold text-amber-700">{costs.additionalBasic}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-base font-medium text-blue-600">
                      {formatPrice(pricing.unit3d.basic)} per additional SKU
                    </div>
                    {costs.additionalBasic > 0 && (
                      <div className="text-sm text-amber-700 mt-1">
                        Total: {formatPrice(costs.additionalBasicCost)} (one-time)
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <h5 className="font-bold text-xl text-purple-800 mb-3 flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-package text-purple-500"><path d="m7.5 4.27 9 5.14"></path><path d="M21 8V5l-9-5-9 5v3"></path><path d="m3 7.64 9 5.14 9-5.14"></path><path d="M12 22V12"></path></svg> Medium SKUs</h5>
                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Plan Limit:</span>
                    <span className="font-semibold">{planLimits[selectedPlan].medium}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Current Usage:</span>
                    <span className="font-semibold">{skuCounts.medium}</span>
                  </div>
                  {selectedPlan !== 'enterprise' && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-700">Included:</span>
                      <span className="font-bold text-green-700">{Math.min(skuCounts.medium, planLimits[selectedPlan].medium)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-amber-700">Additional:</span>
                    <span className="font-bold text-amber-700">{costs.additionalMedium}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-base font-medium text-purple-600">
                      {formatPrice(pricing.unit3d.medium)} per additional SKU
                    </div>
                    {costs.additionalMedium > 0 && (
                      <div className="text-sm text-amber-700 mt-1">
                        Total: {formatPrice(costs.additionalMediumCost)} (one-time)
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <h5 className="font-bold text-xl text-green-800 mb-3 flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-boxes text-green-500"><path d="M2.4 12L12 2l9.6 10L12 22 2.4 12z"></path><path d="M22 12 12 2 2 12"></path><path d="M12 22 2 12 22 12"></path></svg> Complex SKUs</h5>
                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Plan Limit:</span>
                    <span className="font-semibold">{planLimits[selectedPlan].complex}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Current Usage:</span>
                    <span className="font-semibold">{skuCounts.complex}</span>
                  </div>
                  {selectedPlan !== 'enterprise' && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-700">Included:</span>
                      <span className="font-bold text-green-700">{Math.min(skuCounts.complex, planLimits[selectedPlan].complex)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-amber-700">Additional:</span>
                    <span className="font-bold text-amber-700">{costs.additionalComplex}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-base font-medium text-green-600">
                      {formatPrice(pricing.unit3d.complex)} per additional SKU
                    </div>
                    {costs.additionalComplex > 0 && (
                      <div className="text-sm text-amber-700 mt-1">
                        Total: {formatPrice(costs.additionalComplexCost)} (one-time)
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* First Year Total / First Month Total */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-8 text-center transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl">
            <div className="flex items-center justify-center gap-2 mb-4">
              <TrendingUp className="h-6 w-6 text-white" />
              <h4 className="text-2xl font-bold mb-2">
                {billingPeriod === 'annual' ? 'First Year Total' : 'First Month Total'}
              </h4>
            </div>

            <p className="text-5xl font-extrabold transition-opacity duration-500 ease-in-out opacity-100 mb-2">
              {formatPrice(costs.firstPeriodTotal)}
            </p>
            <p className="text-blue-100 mt-2 text-lg">
              * Includes one-time setup fees for additional SKUs and add-ons.
            </p>
          </div>

          {/* Ongoing Annual Maintenance / Monthly Maintenance */}
          <div className="bg-purple-50 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="h-6 w-6 text-purple-600" />
              <h4 className="text-2xl font-bold text-purple-900">
                {billingPeriod === 'annual' ? 'Ongoing Annual Maintenance (from 2nd Year)' : 'Ongoing Monthly Maintenance'}
              </h4>
            </div>

            <div className="space-y-3">
              {costs.maintenanceBasic > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">
                    Basic SKUs Maintenance ({skuCounts.basic} × {formatPrice(500)}
                    {billingPeriod === 'monthly' ? '' : '/month'})
                  </span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(costs.maintenanceBasic * (billingPeriod === 'annual' ? 12 : 1))}
                    {billingPeriod === 'monthly' ? '' : ' per year'}
                  </span>
                </div>
              )}
              {costs.maintenanceMedium > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">
                    Medium SKUs Maintenance ({skuCounts.medium} × {formatPrice(500)}
                    {billingPeriod === 'monthly' ? '' : '/month'})
                  </span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(costs.maintenanceMedium * (billingPeriod === 'annual' ? 12 : 1))}
                    {billingPeriod === 'monthly' ? '' : ' per year'}
                  </span>
                </div>
              )}
              {costs.maintenanceComplex > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">
                    Complex SKUs Maintenance ({skuCounts.complex} × {formatPrice(500)}
                    {billingPeriod === 'monthly' ? '' : '/month'})
                  </span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(costs.maintenanceComplex * (billingPeriod === 'annual' ? 12 : 1))}
                    {billingPeriod === 'monthly' ? '' : ' per year'}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-purple-200">
                <span className="text-lg font-bold text-purple-900">
                  Total {billingPeriod === 'annual' ? 'Annual' : 'Monthly'} Maintenance
                </span>
                <span className="text-lg font-bold text-purple-900">
                  {formatPrice(costs.maintenanceFee * (billingPeriod === 'annual' ? 12 : 1))}
                </span>
              </div>

              <div className="flex justify-between items-center pt-4 border-t-2 border-purple-300">
                <span className="text-xl font-bold text-purple-900">Total Price</span>
                <span className="text-xl font-bold text-purple-900">
                  {formatPrice(costs.ongoingPeriodTotal)}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                * Ongoing cost from {billingPeriod === 'annual' ? '2nd year' : '2nd month'} onwards (maintenance only)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator3D;