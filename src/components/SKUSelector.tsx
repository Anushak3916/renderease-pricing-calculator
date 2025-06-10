import React from 'react';
import { Package, Plus, Minus, Box, Package2 } from 'lucide-react';
import { SKUCounts, PricingData, Currency } from '../types/pricing';

interface SKUSelectorProps {
  selectedPlan: 'starter' | 'pro';
  skuCounts: SKUCounts;
  setSKUCounts: (counts: SKUCounts) => void;
  planLimits: Record<string, SKUCounts>;
  pricing: PricingData;
  currency: Currency;
  additionalCounts: {
    additionalBasic: number;
    additionalMedium: number;
    additionalComplex: number;
  };
  billingPeriod: 'monthly' | 'annual';
}

const SKUSelector: React.FC<SKUSelectorProps> = ({
  selectedPlan,
  skuCounts,
  setSKUCounts,
  planLimits,
  pricing,
  currency,
  additionalCounts,
  billingPeriod
}) => {
  const updateSKUCount = (type: keyof SKUCounts, change: number) => {
    const newCounts = { ...skuCounts };
    const newValue = Math.max(planLimits[selectedPlan][type], newCounts[type] + change);
    newCounts[type] = newValue;
    setSKUCounts(newCounts);
  };

  const formatPrice = (price: number) => {
    return `${pricing.symbols[currency]}${Math.round(price * pricing.rates[currency]).toLocaleString()}`;
  };

  const SKUControl = ({
    type,
    title,
    description,
    unitPrice,
    included,
    additional
  }: {
    type: keyof SKUCounts;
    title: string;
    description: string;
    unitPrice: number;
    included: number;
    additional: number;
  }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-all duration-200 ease-in-out">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h5 className="font-semibold text-gray-900 flex items-center gap-2">
            {type === 'basic' && <Box className="h-5 w-5 text-blue-500" />}
            {type === 'medium' && <Package className="h-5 w-5 text-purple-500" />}
            {type === 'complex' && <Package2 className="h-5 w-5 text-green-500" />}
            {title}
          </h5>
          <p className="text-sm text-gray-600 mb-2">{description}</p>
          <p className="text-base font-bold text-purple-600">
            {formatPrice(unitPrice)} per SKU (maintenance)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateSKUCount(type, -1)}
            disabled={skuCounts[type] <= planLimits[selectedPlan][type]}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="h-4 w-4 text-gray-700" />
          </button>
          <input
            type="number"
            value={skuCounts[type]}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (!isNaN(value)) {
                const newCounts = { ...skuCounts };
                newCounts[type] = Math.max(planLimits[selectedPlan][type], value);
                setSKUCounts(newCounts);
              }
            }}
            min={planLimits[selectedPlan][type]}
            className="w-20 text-center font-semibold text-gray-800 border border-gray-300 rounded-md py-1.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
          <button
            onClick={() => updateSKUCount(type, 1)}
            className="p-2 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="flex justify-between text-sm mt-3 border-t border-gray-100 pt-3">
        <span className="text-green-700 font-medium">Included: {included}</span>
        {additional > 0 && <span className="text-orange-700 font-medium">Additional: {additional}</span>}
      </div>
      {additional > 0 && (
        <div className="mt-2 text-right text-orange-700 font-bold text-base">
          Total: {`${pricing.symbols[currency]}${Math.round(unitPrice * additional).toLocaleString()}`} (one-time)
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-gray-50 rounded-xl p-6 shadow-md border border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <Package className="h-6 w-6 text-purple-600" />
        <h4 className="text-2xl font-bold text-gray-900">SKU Configuration</h4>
      </div>
      
      <div className="space-y-6">
        <SKUControl
          type="basic"
          title="Basic SKUs"
          description="Simple products with basic configurations"
          unitPrice={500}
          included={Math.min(skuCounts.basic, planLimits[selectedPlan].basic)}
          additional={additionalCounts.additionalBasic}
        />
        
        <SKUControl
          type="medium"
          title="Medium SKUs"
          description="Products with moderate complexity"
          unitPrice={500}
          included={Math.min(skuCounts.medium, planLimits[selectedPlan].medium)}
          additional={additionalCounts.additionalMedium}
        />
        
        {selectedPlan === 'pro' && (
          <SKUControl
            type="complex"
            title="Complex SKUs"
            description="Highly detailed products with advanced features"
            unitPrice={500}
            included={Math.min(skuCounts.complex, planLimits[selectedPlan].complex)}
            additional={additionalCounts.additionalComplex}
          />
        )}
      </div>
    </div>
  );
};

export default SKUSelector;