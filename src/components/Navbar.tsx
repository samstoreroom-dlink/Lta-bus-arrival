import React from 'react';
import { Bus, SlidersHorizontal, MapPin, Star, Map as MapIcon, Radio } from 'lucide-react';
import { TrafficCondition } from '../types/bus';

interface NavbarProps {
  activeTab: 'stops' | 'nearby' | 'map' | 'favorites';
  setActiveTab: (tab: 'stops' | 'nearby' | 'map' | 'favorites') => void;
  onOpenSettings: () => void;
  trafficCondition: TrafficCondition;
  favoritesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSettings,
  trafficCondition,
  favoritesCount
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 sm:gap-8 px-4 sm:px-6 h-16">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => setActiveTab('stops')}
          className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg shrink-0 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/10">
            <Bus className="w-5 h-5 stroke-[2.4]" />
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap">
            SG Bus Tracker
          </span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => setActiveTab('stops')}
            className={`transition-colors whitespace-nowrap py-1 cursor-pointer border-b-2 ${
              activeTab === 'stops'
                ? 'text-white border-emerald-500 font-semibold'
                : 'border-transparent hover:text-slate-200'
            }`}
          >
            All Bus Stops
          </button>
          <button
            onClick={() => setActiveTab('nearby')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap py-1 cursor-pointer border-b-2 ${
              activeTab === 'nearby'
                ? 'text-white border-emerald-500 font-semibold'
                : 'border-transparent hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Nearby Radar</span>
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap py-1 cursor-pointer border-b-2 ${
              activeTab === 'map'
                ? 'text-white border-emerald-500 font-semibold'
                : 'border-transparent hover:text-slate-200'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Live GPS Map</span>
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap py-1 cursor-pointer border-b-2 ${
              activeTab === 'favorites'
                ? 'text-white border-emerald-500 font-semibold'
                : 'border-transparent hover:text-slate-200'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Saved Stops ({favoritesCount})</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action / Settings */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/70 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            title="Configure Traffic and LTA settings"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline text-slate-400">Traffic:</span>
            <span className="font-semibold text-emerald-400">{trafficCondition.label}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
