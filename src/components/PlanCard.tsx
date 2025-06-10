import React from 'react';
import { Check } from 'lucide-react';

interface PlanCardProps {
  title: string;
  description: string;
  price: React.ReactNode;
  period: string;
  included: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
  isEnterprise?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

const PlanCard: React.FC<PlanCardProps> = ({
  title,
  description,
  price,
  period,
  included,
  features,
  buttonText,
  isPopular,
  isEnterprise,
  icon,
  className = ''
}) => {
  const getBorderColor = () => {
    if (isEnterprise) return 'border-purple-500';
    if (isPopular) return 'border-blue-500';
    return 'border-gray-200';
  };

  const getBackgroundColor = () => {
    if (isEnterprise) return 'bg-gradient-to-br from-purple-50 to-purple-100';
    if (isPopular) return 'bg-gradient-to-br from-blue-50 to-blue-100';
    return 'bg-white';
  };

  const getButtonColor = () => {
    if (isEnterprise) return 'bg-purple-600 hover:bg-purple-700';
    if (isPopular) return 'bg-blue-600 hover:bg-blue-700';
    return 'bg-purple-600 hover:bg-purple-700';
  };

  return (
    <div className={`relative rounded-2xl border-2 ${getBorderColor()} ${getBackgroundColor()} p-8 ${className}`}>
      {/* Badge */}
      {(isPopular || isEnterprise) && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className={`px-4 py-1 rounded-full text-white text-sm font-bold ${
            isEnterprise ? 'bg-purple-600' : 'bg-blue-600'
          }`}>
            {isEnterprise ? 'ENTERPRISE' : 'MOST POPULAR'}
          </div>
        </div>
      )}

      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          {icon}
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
        </div>
        <p className="text-gray-600 min-h-[3rem] flex items-center justify-center">{description}</p>
      </div>

      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-purple-600 mb-2">
          {price}
          <span className="text-lg font-normal text-gray-500">{period}</span>
        </div>
        <div className={`text-sm font-semibold px-4 py-2 rounded-lg ${
          isEnterprise 
            ? 'bg-purple-100 text-purple-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {included}
        </div>
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check className={`h-5 w-5 ${
              isEnterprise ? 'text-purple-600' : 'text-green-500'
            } mt-0.5 flex-shrink-0`} />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      <button className={`w-full py-3 px-6 rounded-xl text-white font-semibold ${getButtonColor()} transform transition-all duration-200 hover:scale-105 hover:shadow-lg`}>
        {buttonText}
      </button>
    </div>
  );
};

export default PlanCard;