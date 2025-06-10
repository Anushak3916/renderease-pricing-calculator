import React from 'react';
import { Zap } from 'lucide-react';
import { PricingData, Currency } from '../types/pricing';

interface AddOnSelectorProps {
  addOns: {
    exploded: number;
    animation: number;
    texturing: number;
  };
  setAddOns: (addOns: { exploded: number; animation: number; texturing: number; }) => void;
  pricing: PricingData;
  currency: Currency;
  billingPeriod: 'monthly' | 'annual';
}

const AddOnSelector: React.FC<AddOnSelectorProps> = ({ addOns, setAddOns, pricing, currency, billingPeriod }) => {
  const formatPrice = (price: number) => {
    return `${pricing.symbols[currency]}${Math.round(billingPeriod === 'annual' ? price * 4 : price).toLocaleString()} per SKU`;
  };

  const handleSliderChange = (type: keyof typeof addOns, value: number) => {
    setAddOns({ ...addOns, [type]: value });
  };

  const SliderControl = ({ 
    type, 
    title, 
    unitPrice, 
    max = 100 
  }: {
    type: keyof typeof addOns;
    title: string;
    unitPrice: number;
    max?: number;
  }) => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="font-medium">{title}</span>
        <span className="text-purple-600 font-semibold">{formatPrice(unitPrice)}</span>
      </div>
      <div className="space-y-2">
        <input
          type="range"
          min="0"
          max={max}
          value={addOns[type]}
          onChange={(e) => handleSliderChange(type, parseInt(e.target.value))}
          className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-sm">
          <span>0</span>
          <span className="font-semibold text-purple-600">{addOns[type]}</span>
          <span>{max}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="h-5 w-5 text-purple-600" />
        <h4 className="text-xl font-semibold">Advanced Add-ons</h4>
      </div>
      
      <div className="space-y-6">
        <SliderControl
          type="exploded"
          title="Exploded Views"
          unitPrice={pricing.unit3d.exploded}
        />
        
        <SliderControl
          type="animation"
          title="Animation Views"
          unitPrice={pricing.unit3d.animation}
        />
        
        <SliderControl
          type="texturing"
          title="Advanced Texturing"
          unitPrice={pricing.unit3d.ar}
        />
      </div>
    </div>
  );
};

export default AddOnSelector;