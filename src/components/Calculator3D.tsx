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
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro'>('starter');
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
    pro: { basic: 3, medium: 3, complex: 2 }
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
    const includedBasic = selectedPlan === 'starter' ? 2 : 3;
    const includedMedium = selectedPlan === 'starter' ? 2 : 3;
    const includedComplex = selectedPlan === 'starter' ? 0 : 2;

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

    let planPrice = pricing.base3d.monthly[selectedPlan];

    // Calculate add-ons total
    const addOnsTotal = (addOns.exploded * pricing.unit3d.exploded) + (addOns.animation * pricing.unit3d.animation) + (addOns.texturing * pricing.unit3d.ar);

    let firstPeriodTotal;
    let ongoingPeriodTotal;

    if (selectedPlan === 'starter') {
        // Starter plan logic: 11,999 covers default SKUs for first month
        firstPeriodTotal = pricing.base3d.monthly.starter + additionalSKUTotal + addOnsTotal;
        ongoingPeriodTotal = maintenanceFee;

        if (billingPeriod === 'annual') {
            firstPeriodTotal = (firstPeriodTotal * 12 * 0.85) / 12;
            ongoingPeriodTotal = maintenanceFee * 12;
        }
    } else { // Pro plan logic
        firstPeriodTotal = planPrice + additionalSKUTotal + addOnsTotal;
        ongoingPeriodTotal = maintenanceFee;

        if (billingPeriod === 'annual') {
            firstPeriodTotal = (firstPeriodTotal * 12 * 0.85) / 12;
            ongoingPeriodTotal = maintenanceFee * 12;
        }
    }

    // `displayPlanPrice` for the main plan card (before adding additional SKUs/add-ons)
    let displayPlanPrice = pricing.base3d.monthly[selectedPlan];
    if (billingPeriod === 'annual') {
      displayPlanPrice = Math.round(displayPlanPrice * 12 * 0.85); // Apply annual discount
    }

    return {
      planPrice: displayPlanPrice,
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
      additionalComplex
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

      <div className="grid lg:grid-cols-2 gap-8">
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
                    ? Math.round(pricing.base3d.monthly.starter * 12 * 0.85)
                    : pricing.base3d.monthly.starter
                  )}
                </p>
                <p className="text-sm text-gray-600">
                  Setup + {formatPrice(billingPeriod === 'annual' 
                    ? Math.round((2 * 500 + 2 * 500) * 12 * 0.85 / 12)
                    : (2 * 500 + 2 * 500)
                  )} per month
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
                    ? Math.round(pricing.base3d.monthly.pro * 12 * 0.85)
                    : pricing.base3d.monthly.pro
                  )}
                </p>
                <p className="text-sm text-gray-600">
                  Setup + {formatPrice(billingPeriod === 'annual' 
                    ? Math.round(pricing.base3d.monthly.proPlatform * 12 * 0.85 / 12)
                    : pricing.base3d.monthly.proPlatform
                  )} per month
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-700">Included:</span>
                    <span className="font-bold text-green-700">{Math.min(skuCounts.basic, planLimits[selectedPlan].basic)}</span>
                  </div>
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
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-700">Included:</span>
                    <span className="font-bold text-green-700">{Math.min(skuCounts.medium, planLimits[selectedPlan].medium)}</span>
                  </div>
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
              
              {selectedPlan === 'pro' && (
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                  <h5 className="font-bold text-xl text-green-800 mb-3 flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-boxes text-green-500"><path d="M2.4 7.4a2 2 0 0 1 0-2.8L7.6 0.8A2 2 0 0 1 10.4 0h6.8a2 2 0 0 1 1.8 1l2.6 4.4a2 2 0 0 1 0 2.8L16.4 13.2a2 2 0 0 1-1.8 1h-6.8a2 2 0 0 1-1.8-1Z"></path><path d="M2.4 16.4a2 2 0 0 1 0-2.8l5.2-4.4a2 2 0 0 1 2.8 0l6.8 3.8a2 2 0 0 1 1.8 1l2.6 4.4a2 2 0 0 1 0 2.8l-5.2 4.4a2 2 0 0 1-2.8 0h-6.8a2 2 0 0 1-1.8-1Z"></path></svg> Complex SKUs</h5>
                  <div className="space-y-2 text-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Plan Limit:</span>
                      <span className="font-semibold">{planLimits[selectedPlan].complex}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Current Usage:</span>
                      <span className="font-semibold">{skuCounts.complex}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-700">Included:</span>
                      <span className="font-bold text-green-700">{Math.min(skuCounts.complex, planLimits[selectedPlan].complex)}</span>
                    </div>
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
              )}
            </div>
            
            {/* Usage Summary Footer */}
            <div className="mt-6 pt-6 border-t-2 border-blue-200">
              <div className="flex justify-between items-center text-lg font-bold text-blue-900 mb-2">
                <span className="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-tag text-blue-500"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2 2 0 0 0 2.828 0l7.172-7.172a2 2 0 0 0 0-2.828Z"></path><path d="M7 7h.01"></path></svg>Total SKUs in Use:</span>
                <span>{skuCounts.basic + skuCounts.medium + skuCounts.complex}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold text-amber-700">
                <span className="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-plus-circle text-amber-500"><circle cx="12" cy="12" r="10"></circle><path d="M8 12h8"></path><path d="M12 8v8"></path></svg>Total Additional SKUs:</span>
                <span>
                  {costs.additionalBasic + costs.additionalMedium + costs.additionalComplex}
                </span>
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="mt-8">
            {/* First Month/Year Total */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-8 text-center mb-8">
              <h5 className="text-2xl font-bold mb-2">First Month Total</h5>
              <p className="text-5xl font-extrabold">
                {formatPrice(costs.firstPeriodTotal)}
              </p>
              <p className="text-blue-100 mt-2 text-lg">
                {selectedPlan === 'starter' ? 'Everything included for first month. Add-ons/SKUs extra.' : 'Dynamic total for Pro plan'}
              </p>
            </div>
            {/* Ongoing Period Breakdown */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h4 className="text-xl font-semibold mb-4 text-blue-900">
                {billingPeriod === 'annual' ? 'Total Annual Maintenance (from 2nd Year)' : 'Ongoing Cost Breakdown (from 2nd Month)'}
              </h4>
              <div className="space-y-3 text-gray-700">
                {billingPeriod === 'monthly' ? (
                  <>
                    {skuCounts.basic > 0 && (
                      <div className="flex justify-between">
                        <span>Basic SKUs Maintenance ({skuCounts.basic} × ₹500)</span>
                        <span className="font-semibold">{formatPrice(costs.maintenanceBasic)}</span>
                      </div>
                    )}
                    {skuCounts.medium > 0 && (
                      <div className="flex justify-between">
                        <span>Medium SKUs Maintenance ({skuCounts.medium} × ₹500)</span>
                        <span className="font-semibold">{formatPrice(costs.maintenanceMedium)}</span>
                      </div>
                    )}
                    {skuCounts.complex > 0 && (
                      <div className="flex justify-between">
                        <span>Complex SKUs Maintenance ({skuCounts.complex} × ₹500)</span>
                        <span className="font-semibold">{formatPrice(costs.maintenanceComplex)}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex justify-between">
                    <span className="font-semibold">Total Annual Maintenance</span>
                    <span className="font-semibold">{formatPrice(costs.ongoingPeriodTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-4 mt-4 border-t-2 border-gray-200">
                  <span className="text-xl font-bold text-gray-900">Total Price</span>
                  <span className="text-xl font-bold text-gray-900">
                    {formatPrice(costs.ongoingPeriodTotal)}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                * Ongoing cost from 2nd {billingPeriod === 'annual' ? 'year' : 'month'} onwards (maintenance only)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator3D;