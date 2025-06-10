import React from 'react';
import { Star, Crown } from 'lucide-react';
import PlanCard from './PlanCard';
import { BillingPeriod, Currency, PricingData } from '../types/pricing';

interface Plans3DProps {
  billingPeriod: BillingPeriod;
  currency: Currency;
  pricing: PricingData;
}

const Plans3D: React.FC<Plans3DProps> = ({ billingPeriod, currency, pricing }) => {
  const formatPrice = (price: number) => {
    return Math.round(price * pricing.rates[currency]).toLocaleString();
  };

  const getPeriodSuffix = () => {
    switch (billingPeriod) {
      case 'monthly': return '/ mo';
      case 'annual': return '/ yr';
      default: return '';
    }
  };

  const get3DPrice = (base: number) => {
    if (billingPeriod === 'annual') {
      const annual = base * 12;
      const discounted = annual * 0.85;
      return {
        display: <><span className="line-through text-gray-400 mr-2">{pricing.symbols[currency]}{formatPrice(annual / 12)}</span><span className="text-purple-600 font-bold">{pricing.symbols[currency]}{formatPrice(discounted / 12)}</span></>,
        period: '/ mo',
      };
    }
    return { display: `${pricing.symbols[currency]}${formatPrice(base)}`, period: '/ mo' };
  };

  const starterFeatures = [
    'Image to 3D Conversion',
    'Product Configurator',
    'Dimension Visualization',
    'Product Annotations',
    'Manual artist delivery within 48h',
    'Email notifications on completion',
    'Iframe embed links',
    'Basic technical support'
  ];

  const proFeatures = [
    'All Starter features',
    'Custom Configurator',
    'White-label 3D Configurator',
    'Basic analytics',
    'Manual artist delivery within 1 week',
    'Priority email support',
    'Custom branding options',
    'Onboarding & Training'
  ];

  const enterpriseFeatures = [
    'Custom SKU allocation',
    'All Pro features',
    'Custom Integrations',
    'Bulk orders = huge discounts',
    'Advanced analytics',
    'Manual artist delivery within 1 month',
    'Priority email support',
    'Custom branding options',
    'Onboarding & Training'
  ];

  return (
    <div className="grid md:grid-cols-3 gap-8 mb-12">
      <PlanCard
        title="Starter"
        description="Ideal for small startups & pilot projects"
        price={get3DPrice(pricing.base3d.monthly.starter).display}
        period={get3DPrice(pricing.base3d.monthly.starter).period}
        included="Includes 2 Basic + 2 Medium SKUs"
        features={starterFeatures}
        buttonText="Start Trial"
        className="hover:shadow-xl transition-all duration-300"
      />

      <PlanCard
        title="Pro"
        description="For growing D2C brands with moderate volume"
        price={get3DPrice(pricing.base3d.monthly.pro).display}
        period={get3DPrice(pricing.base3d.monthly.pro).period}
        included="Includes 3 Basic + 3 Medium + 2 Complex SKUs"
        features={proFeatures}
        buttonText="Start Trial"
        isPopular
        icon={<Star className="h-5 w-5" />}
        className="transform scale-105 hover:shadow-2xl transition-all duration-300"
      />

      <PlanCard
        title="Enterprise"
        description="Custom solutions for large organizations"
        price="Contact Us"
        period=""
        included="Tailored package to your requirements"
        features={enterpriseFeatures}
        buttonText="Contact Sales"
        icon={<Crown className="h-5 w-5" />}
        isEnterprise
        className="hover:shadow-xl transition-all duration-300"
      />
    </div>
  );
};

export default Plans3D;