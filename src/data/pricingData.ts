import { PricingData } from '../types/pricing';

export const pricingData: PricingData = {
  rates: { 
    INR: 1, 
    AED: 0.045, 
    CAD: 0.016, 
    USD: 0.012 
  },
  symbols: { 
    INR: "₹", 
    AED: "د.إ", 
    CAD: "$", 
    USD: "$" 
  },
  base3d: {
    monthly: { 
      starter: 11999, 
      pro: 29999, 
      starterPlatform: 7999,
      proPlatform: 14999
    },
    payg: { 
      starter: 0, 
      pro: 0,
      starterPlatform: 0,
      proPlatform: 0 
    }
  },
  unit3d: {
    basic: 1999, 
    medium: 3999, 
    complex: 4999,
    exploded: 2599, 
    animation: 3599, 
    ar: 699
  }
};