import React from 'react';
import { Cuboid as Cube, Camera } from 'lucide-react';

interface PlanTabsProps {
  activeTab: '3d' | 'vp';
  setActiveTab: (tab: '3d' | 'vp') => void;
}

const PlanTabs: React.FC<PlanTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex gap-4">
      <button
        className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-200 text-lg shadow-sm focus:outline-none ${activeTab === '3d' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}
        onClick={() => setActiveTab('3d')}
        aria-pressed={activeTab === '3d'}
      >
        <Cube className="h-5 w-5" /> 3D & AR
      </button>
      <button
        className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-200 text-lg shadow-sm focus:outline-none ${activeTab === 'vp' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}
        onClick={() => setActiveTab('vp')}
        aria-pressed={activeTab === 'vp'}
      >
        <Camera className="h-5 w-5" /> Virtual Photography
      </button>
    </div>
  );
};

export default PlanTabs;