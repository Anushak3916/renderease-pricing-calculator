import React, { useState, useEffect } from 'react';
import { Camera, ImageIcon, Layers, Brush, Image as ImageLucide, Monitor, Paintbrush, Clock } from 'lucide-react';
import { Currency, PricingData, BillingPeriod } from '../types/pricing';

interface CalculatorVPProps {
  currency: Currency;
  pricing: PricingData;
}

const PLAN_DEFAULTS = {
  starter: {
    siloShots: 5,
    lifestyleScenes: 2,
    artisticRenders: 0,
    resolution: '4k',
    retouching: 'standard',
    delivery: 'standard',
  },
  pro: {
    siloShots: 8,
    lifestyleScenes: 4,
    artisticRenders: 2,
    resolution: '8k',
    retouching: 'advanced',
    delivery: 'express',
  },
  enterprise: {
    siloShots: 0,
    lifestyleScenes: 0,
    artisticRenders: 0,
    resolution: '1080',
    retouching: 'none',
    delivery: 'standard',
  }
};

const PLAN_DETAILS = {
  starter: {
    name: 'Starter',
    description: 'Includes default setup for common photography needs.',
    icon: <ImageLucide className="h-6 w-6 text-blue-600" />,
  },
  pro: {
    name: 'Pro',
    description: 'Advanced setup for complex projects and higher volumes.',
    icon: <Layers className="h-6 w-6 text-purple-600" />,
  },
  enterprise: {
    name: 'Enterprise',
    description: 'Fully customizable, tailored to your unique requirements.',
    icon: <Layers className="h-6 w-6 text-green-600" />,
  },
};

const CalculatorVP: React.FC<CalculatorVPProps> = ({ currency, pricing }) => {
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro' | 'enterprise'>('starter');
  const [vpConfig, setVPConfig] = useState(PLAN_DEFAULTS['starter']);

  // When plan changes, update config to defaults
  useEffect(() => {
    setVPConfig(PLAN_DEFAULTS[selectedPlan]);
  }, [selectedPlan]);

  const vpPricing = {
    siloShot: 300,
    lifestyleScene: 500,
    artisticRender: 1750, // 3500 for 2, so 1750 each
    resolutionUpgrade: { '1080': 0, '4k': 200, '8k': 500 },
    retouching: { 'none': 0, 'basic': 300, 'standard': 600, 'advanced': 1000 },
    delivery: { 'standard': 0, 'express': 500, 'priority': 1000 }
  };

  const calculateVPTotal = () => {
    let total = 0;

    total += vpConfig.siloShots * pricing.unitVP.siloShots;
    total += vpConfig.lifestyleScenes * pricing.unitVP.lifestyleScenes;
    total += vpConfig.artisticRenders * pricing.unitVP.productVideos;
    total += vpPricing.resolutionUpgrade[vpConfig.resolution as keyof typeof vpPricing.resolutionUpgrade];
    total += vpPricing.retouching[vpConfig.retouching as keyof typeof vpPricing.retouching];
    total += vpPricing.delivery[vpConfig.delivery as keyof typeof vpPricing.delivery];

    return total;
  };

  const formatPrice = (price: number) => `${pricing.symbols[currency]}${Math.round(price * pricing.rates[currency]).toLocaleString()}`;

  const SliderControl = ({ 
    label, 
    value, 
    onChange, 
    min = 0, 
    max = 50, 
    unitPrice,
    description,
    unitSuffix,
    step
  }: {
    label: React.ReactNode;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    unitPrice: number;
    description?: string;
    unitSuffix?: string;
    step?: number;
  }) => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div>
          <span className="font-medium">{label}</span>
          {description && <p className="text-sm text-gray-600">{description}</p>}
        </div>
        <span className="text-blue-600 font-semibold">{formatPrice(unitPrice)}{unitSuffix ? ` ${unitSuffix}` : ''}</span>
      </div>
      <div className="space-y-2">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
          step={step}
        />
        <div className="flex justify-between text-sm">
          <span>{min}</span>
          <span className="font-semibold text-blue-600">{value}</span>
          <span>{max}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8">
      {/* Plan Selection as Cards */}
      <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
        {(['starter', 'pro', 'enterprise'] as const).map((plan) => (
          <button
            key={plan}
            className={`flex-1 flex flex-col items-center p-6 rounded-xl border-2 transition-all duration-300 shadow-sm cursor-pointer focus:outline-none ${selectedPlan === plan ? 'border-blue-600 bg-blue-50 scale-105 shadow-xl' : 'border-gray-200 bg-white hover:border-blue-400 hover:scale-105 hover:shadow-lg'}`}
            onClick={() => setSelectedPlan(plan)}
          >
            {PLAN_DETAILS[plan].icon}
            <span className="mt-2 text-lg font-bold text-gray-900">{PLAN_DETAILS[plan].name}</span>
            <span className="text-sm text-gray-600 mt-1 text-center">{PLAN_DETAILS[plan].description}</span>
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Content Configuration */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-blue-50 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="h-5 w-5 text-blue-600" />
              <h4 className="text-xl font-semibold">Content Configuration</h4>
            </div>
            <div className="space-y-6">
              <SliderControl
                label={<span className="flex items-center gap-2"><ImageLucide className="h-4 w-4 text-blue-500" />Silo Shots</span>}
                description="1 silo shot = ₹100/-"
                value={vpConfig.siloShots}
                onChange={(value) => setVPConfig({...vpConfig, siloShots: value})}
                min={selectedPlan === 'starter' ? 5 : selectedPlan === 'pro' ? 8 : 0}
                max={100}
                unitPrice={pricing.unitVP.siloShots}
                unitSuffix="per shot"
              />
              <SliderControl
                label={<span className="flex items-center gap-2"><Camera className="h-4 w-4 text-purple-500" />Lifestyle Scenes</span>}
                description="1 lifestyle scene = ₹250/-"
                value={vpConfig.lifestyleScenes}
                onChange={(value) => setVPConfig({...vpConfig, lifestyleScenes: value})}
                min={selectedPlan === 'starter' ? 2 : selectedPlan === 'pro' ? 4 : 0}
                max={100}
                unitPrice={pricing.unitVP.lifestyleScenes}
                unitSuffix="per scene"
              />
              <SliderControl
                label={<span className="flex items-center gap-2"><Brush className="h-4 w-4 text-pink-500" />3D Artistic Renders</span>}
                description="2 for ₹3,500/-"
                value={vpConfig.artisticRenders}
                onChange={(value) => setVPConfig({...vpConfig, artisticRenders: value})}
                min={0}
                max={100}
                unitPrice={pricing.unitVP.productVideos}
                unitSuffix="per render"
                step={2}
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 shadow-md border border-gray-200">
            <h4 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800"><Brush className="h-5 w-5 text-indigo-500" />Quality & Delivery Options</h4>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block font-medium mb-2 text-gray-700 flex items-center gap-2"><Monitor className="h-4 w-4 text-blue-500" />Resolution</label>
                <select
                  value={vpConfig.resolution}
                  onChange={(e) => setVPConfig({...vpConfig, resolution: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white appearance-none pr-8 transition-colors hover:border-blue-400"
                >
                  <option value="1080">Full HD (1080p) - Standard</option>
                  <option value="4k">4K <span className="text-sm text-green-600">(+{formatPrice(vpPricing.resolutionUpgrade['4k'])})</span></option>
                  <option value="8k">8K <span className="text-sm text-green-600">(+{formatPrice(vpPricing.resolutionUpgrade['8k'])})</span></option>
                </select>
              </div>
              <div>
                <label className="block font-medium mb-2 text-gray-700 flex items-center gap-2"><Paintbrush className="h-4 w-4 text-pink-500" />Retouching Level</label>
                <select
                  value={vpConfig.retouching}
                  onChange={(e) => setVPConfig({...vpConfig, retouching: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white appearance-none pr-8 transition-colors hover:border-blue-400"
                >
                  <option value="none">None</option>
                  <option value="basic">Basic <span className="text-sm text-green-600">(+{formatPrice(vpPricing.retouching.basic)})</span></option>
                  <option value="standard">Standard <span className="text-sm text-green-600">(+{formatPrice(vpPricing.retouching.standard)})</span></option>
                  <option value="advanced">Advanced <span className="text-sm text-green-600">(+{formatPrice(vpPricing.retouching.advanced)})</span></option>
                </select>
              </div>
              <div>
                <label className="block font-medium mb-2 text-gray-700 flex items-center gap-2"><Clock className="h-4 w-4 text-orange-500" />Delivery Time</label>
                <select
                  value={vpConfig.delivery}
                  onChange={(e) => setVPConfig({...vpConfig, delivery: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white appearance-none pr-8 transition-colors hover:border-blue-400"
                >
                  <option value="standard">Standard (48-Hour)</option>
                  <option value="express">Express (24-Hour) <span className="text-sm text-green-600">(+{formatPrice(vpPricing.delivery.express)})</span></option>
                  <option value="priority">Priority (12-Hour) <span className="text-sm text-green-600">(+{formatPrice(vpPricing.delivery.priority)})</span></option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Cost Summary */}
        <div className="md:col-span-1">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-8 text-center transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl">
            <h4 className="text-2xl font-bold mb-2">Estimated Total</h4>
            <p className="text-5xl font-extrabold transition-opacity duration-500 ease-in-out opacity-100">
              {formatPrice(calculateVPTotal())}
            </p>
            <p className="text-blue-100 mt-2 text-lg">
              Your estimated total cost for Virtual Photography
            </p>
          </div>

          <div className="mt-8">
            <h4 className="text-xl font-semibold mb-4">Pricing Details</h4>
            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span>Silo Shots ({vpConfig.siloShots} × {formatPrice(pricing.unitVP.siloShots)})</span>
                <span className="font-semibold">{formatPrice(vpConfig.siloShots * pricing.unitVP.siloShots)}</span>
              </div>
              <div className="flex justify-between">
                <span>Lifestyle Scenes ({vpConfig.lifestyleScenes} × {formatPrice(pricing.unitVP.lifestyleScenes)})</span>
                <span className="font-semibold">{formatPrice(vpConfig.lifestyleScenes * pricing.unitVP.lifestyleScenes)}</span>
              </div>
              {vpConfig.artisticRenders > 0 && (
                <div className="flex justify-between">
                  <span>3D Artistic Renders ({vpConfig.artisticRenders} × {formatPrice(pricing.unitVP.productVideos)})</span>
                  <span className="font-semibold">{formatPrice(vpConfig.artisticRenders * pricing.unitVP.productVideos)}</span>
                </div>
              )}
              {vpConfig.resolution !== '1080' && (
                <div className="flex justify-between">
                  <span>Resolution Upgrade ({vpConfig.resolution})</span>
                  <span className="font-semibold">{formatPrice(vpPricing.resolutionUpgrade[vpConfig.resolution as keyof typeof vpPricing.resolutionUpgrade])}</span>
                </div>
              )}
              {vpConfig.retouching !== 'none' && (
                <div className="flex justify-between">
                  <span>Retouching ({vpConfig.retouching})</span>
                  <span className="font-semibold">{formatPrice(vpPricing.retouching[vpConfig.retouching as keyof typeof vpPricing.retouching])}</span>
                </div>
              )}
              {vpConfig.delivery !== 'standard' && (
                <div className="flex justify-between">
                  <span>Delivery ({vpConfig.delivery})</span>
                  <span className="font-semibold">{formatPrice(vpPricing.delivery[vpConfig.delivery as keyof typeof vpPricing.delivery])}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-4 border-t-2 border-blue-600">
                <span>Total Estimated Cost:</span>
                <span className="text-blue-600">
                  {formatPrice(calculateVPTotal())}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorVP;