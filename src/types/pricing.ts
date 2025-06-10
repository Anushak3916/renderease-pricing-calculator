export type BillingPeriod = 'monthly' | 'annual' | 'payg';
export type Currency = 'INR' | 'AED' | 'CAD' | 'USD';

export interface SKUCounts {
  basic: number;
  medium: number;
  complex: number;
}

export interface PricingData {
  rates: Record<Currency, number>;
  symbols: Record<Currency, string>;
  base3d: {
    monthly: {
      starter: number;
      pro: number;
      starterPlatform: number;
      proPlatform: number;
    };
    payg: {
      starter: number;
      pro: number;
      starterPlatform: number;
      proPlatform: number;
    };
  };
  unit3d: {
    basic: number;
    medium: number;
    complex: number;
    exploded: number;
    animation: number;
    ar: number;
  };
}