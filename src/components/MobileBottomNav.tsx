import React from 'react';
import { Bus, Radio, Map as MapIcon, Star } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'stops' | 'nearby' | 'map' | 'favorites';
  setActiveTab: (tab: 'stops' | 'nearby' | 'map' | 'favorites') => void;
  favoritesCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  favoritesCount
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 pb-safe">
      <div className="grid grid-cols-4 items-center h-16">
        <button
          onClick={() => setActiveTab('stops')}
          className={`min-h-[44px] flex flex-col items-center justify-center cursor-pointer transition-colors ${
            activeTab === 'stops' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bus className="w-5 h-5" />
          <span className="text-[11px] font-medium tracking-tight mt-1">Stops</span>
        </button>

        <button
          onClick={() => setActiveTab('nearby')}
          className={`min-h-[44px] flex flex-col items-center justify-center cursor-pointer transition-colors ${
            activeTab === 'nearby' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Radio className="w-5 h-5" />
          <span className="text-[11px] font-medium tracking-tight mt-1">Nearby</span>
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`min-h-[44px] flex flex-col items-center justify-center cursor-pointer transition-colors ${
            activeTab === 'map' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MapIcon className="w-5 h-5" />
          <span className="text-[11px] font-medium tracking-tight mt-1">Live Map</span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`min-h-[44px] flex flex-col items-center justify-center cursor-pointer transition-colors relative ${
            activeTab === 'favorites' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Star className="w-5 h-5" />
            {favoritesCount > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-bold text-[9px] flex items-center justify-center tabular-nums">
                {favoritesCount}
              </span>
            )}
          </div>
          <span className="text-[11px] font-medium tracking-tight mt-1">Saved</span>
        </button>
      </div>
    </nav>
  );
};
