import React from 'react';
import { Camera, Star, Crown } from 'lucide-react';
import PlanCard from './PlanCard';
import { Currency, PricingData, BillingPeriod } from '../types/pricing';

interface PlansVPProps {
  currency: Currency;
  pricing: PricingData;
  billingPeriod: BillingPeriod;
}

const PlansVP: React.FC<PlansVPProps> = ({ currency, pricing, billingPeriod }) => {
  const formatPrice = (price: number) => {
    return `${pricing.symbols[currency]}${Math.round(price * pricing.rates[currency]).toLocaleString()}`;
  };

  const getVPPrice = (base: number) => {
    if (billingPeriod === 'annual') {
      const annual = base * 12;
      const discounted = annual * 0.85;
      return {
        display: <><span className="line-through text-gray-400 mr-2">{formatPrice(annual / 12)}</span><span className="text-purple-600 font-bold">{formatPrice(discounted / 12)}</span></>,
        period: '/ SKU',
      };
    }
    return { display: formatPrice(base), period: '/ SKU' };
  };

  const starterFeatures = [
    'Clean, white background product images',
    'Products in real-life situations',
    'Standard resolution (1080p)',
    'Basic lighting setup',
    '48-Hour Turnaround',
    '24-hour delivery',
    'Email support'
  ];

  const proFeatures = [
    'More angles and details',
    'Twice the lifestyle content',
    'High resolution (4K)',
    'Advanced lighting setups',
    '12-hour delivery',
    'Priority support',
    'Custom prompts'
  ];

  const enterpriseFeatures = [
    'Comprehensive coverage',
    'Varied settings and contexts',
    'Ultra HD resolution (4K)',
    'Custom lighting setups',
    'Real-time Artistic Renders',
    'Dedicated Prompt engineers',
    'Advanced retouching'
  ];

  return (
    <div className="grid md:grid-cols-3 gap-8 mb-12">
      <PlanCard
        title="VP Starter"
        description="Perfect for small businesses"
        price={getVPPrice(1999).display}
        period={getVPPrice(1999).period}
        included="Includes 5 Silo shots + 2 Lifestyle scenes"
        features={starterFeatures}
        buttonText="Get Started"
        icon={<Camera className="h-5 w-5" />}
        className="hover:shadow-xl transition-all duration-300"
      />

      <PlanCard
        title="VP Professional"
        description="For growing e-commerce stores"
        price={getVPPrice(2999).display}
        period={getVPPrice(2999).period}
        included="Includes 8 Silo shots + 4 Lifestyle scenes"
        features={proFeatures}
        buttonText="Get Started"
        isPopular
        icon={<Star className="h-5 w-5" />}
        className="transform scale-105 hover:shadow-2xl transition-all duration-300"
      />

      <PlanCard
        title="VP Enterprise"
        description="For large product catalogs"
        price="Contact Us"
        period=""
        included="Unlimited Silo shots + Lifestyle scenes"
        features={enterpriseFeatures}
        buttonText="Contact Sales"
        icon={<Crown className="h-5 w-5" />}
        isEnterprise
        className="hover:shadow-xl transition-all duration-300"
      />
    </div>
  );
};

export default PlansVP;