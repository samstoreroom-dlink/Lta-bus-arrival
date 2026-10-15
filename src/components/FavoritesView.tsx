import React from 'react';
import { BusStop } from '../types/bus';
import { SINGAPORE_BUS_STOPS } from '../data/singaporeBuses';
import { busEngine } from '../services/busSimulationEngine';
import { BusStopCard } from './BusStopCard';
import { Star, BookmarkPlus, Sparkles } from 'lucide-react';

interface FavoritesViewProps {
  favorites: string[];
  onToggleFavorite: (stopCode: string) => void;
  onSelectService: (serviceNo: string, stopCode: string) => void;
  onViewOnMap: (stop: BusStop) => void;
  onSetAlarm: (serviceNo: string, stopCode: string, stopName: string) => void;
  onBrowseAll: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favorites,
  onToggleFavorite,
  onSelectService,
  onViewOnMap,
  onSetAlarm,
  onBrowseAll
}) => {
  const favoriteStops = SINGAPORE_BUS_STOPS.filter((stop) => favorites.includes(stop.code));

  if (favoriteStops.length === 0) {
    return (
      <div className="p-8 sm:p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5 max-w-lg mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-amber-950/50 border border-amber-800/40 text-amber-400 flex items-center justify-center mx-auto">
          <Star className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">No Saved Bus Stops Yet</h3>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Star your daily commute bus stops (e.g., home, office, school, MRT interchanges) for 1-tap arrival tracking.
          </p>
        </div>

        <div className="pt-2">
          <span className="text-xs font-semibold text-slate-400 block mb-2.5">
            Quick Add Common Commuter Stops:
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { code: '10018', name: 'Orchard Stn / ION' },
              { code: '08057', name: 'Dhoby Ghaut Stn' },
              { code: '01112', name: 'Bugis Stn Exit B' },
              { code: '28009', name: 'Jurong East Int' },
              { code: '75009', name: 'Tampines Int' }
            ].map((item) => (
              <button
                key={item.code}
                onClick={() => onToggleFavorite(item.code)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              >
                <BookmarkPlus className="w-3.5 h-3.5 text-amber-400" />
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onBrowseAll}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
        >
          Browse All Singapore Bus Stops
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span>Saved Bus Stops ({favoriteStops.length})</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time arrival countdowns for your starred bus stops.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {favoriteStops.map((stop) => {
          const arrivals = busEngine.getArrivalsForStop(stop.code);
          return (
            <BusStopCard
              key={stop.code}
              stop={stop}
              arrivals={arrivals}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
              onSelectService={onSelectService}
              onViewOnMap={onViewOnMap}
              onSetAlarm={onSetAlarm}
            />
          );
        })}
      </div>
    </div>
  );
};
