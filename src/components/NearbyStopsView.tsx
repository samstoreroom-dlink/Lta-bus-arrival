import React, { useState, useEffect } from 'react';
import { BusStop, BusServiceArrival } from '../types/bus';
import { SINGAPORE_BUS_STOPS } from '../data/singaporeBuses';
import { busEngine } from '../services/busSimulationEngine';
import { BusStopCard } from './BusStopCard';
import { Navigation, MapPin, Compass, AlertCircle, RefreshCw } from 'lucide-react';

interface NearbyStopsViewProps {
  onSelectService: (serviceNo: string, stopCode: string) => void;
  onViewOnMap: (stop: BusStop) => void;
  onSetAlarm: (serviceNo: string, stopCode: string, stopName: string) => void;
  favorites: string[];
  onToggleFavorite: (stopCode: string) => void;
  userCoords: [number, number] | null;
  setUserCoords: (coords: [number, number]) => void;
}

const POPULAR_SINGAPORE_HUBS = [
  { name: 'Orchard Rd / ION', coords: [1.3040, 103.8320] as [number, number] },
  { name: 'Dhoby Ghaut Interchange', coords: [1.2994, 103.8452] as [number, number] },
  { name: 'Bugis Junction', coords: [1.3006, 103.8559] as [number, number] },
  { name: 'City Hall / Raffles City', coords: [1.2925, 103.8524] as [number, number] },
  { name: 'Marina Bay Sands', coords: [1.2838, 103.8590] as [number, number] },
  { name: 'Jurong East Interchange', coords: [1.3335, 103.7425] as [number, number] },
  { name: 'Tampines Central', coords: [1.3533, 103.9438] as [number, number] },
  { name: 'Bishan Junction 8', coords: [1.3508, 103.8488] as [number, number] },
  { name: 'Changi Airport PTB', coords: [1.3550, 103.9880] as [number, number] }
];

export const NearbyStopsView: React.FC<NearbyStopsViewProps> = ({
  onSelectService,
  onViewOnMap,
  onSetAlarm,
  favorites,
  onToggleFavorite,
  userCoords,
  setUserCoords
}) => {
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [selectedHubIndex, setSelectedHubIndex] = useState<number>(0);

  // Active anchor coordinates
  const activeLocation = userCoords || POPULAR_SINGAPORE_HUBS[0].coords;

  // Request real device GPS
  const handleRequestGps = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }
    setGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLoading(false);
        setUserCoords([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => {
        setGpsLoading(false);
        setGpsError(
          err.code === 1
            ? 'Location access was denied. You can select any Singapore transit hub below.'
            : 'Could not obtain GPS position. Switched to Singapore hub coordinates.'
        );
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Find nearest stops
  const nearestStopsData = busEngine.findNearestStops(activeLocation[0], activeLocation[1], 6);

  return (
    <div className="space-y-6">
      {/* Geolocation Controls & Hub Selector */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Navigation className="w-5 h-5 text-emerald-400" />
              <span>Singapore Bus Radar</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Calculating real-time walking distances and live arrivals for bus stops around you.
            </p>
          </div>

          <button
            onClick={handleRequestGps}
            disabled={gpsLoading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors disabled:opacity-50 cursor-pointer shrink-0"
          >
            <Compass className={`w-4 h-4 ${gpsLoading ? 'animate-spin' : ''}`} />
            <span>{gpsLoading ? 'Locating...' : 'Use My GPS Location'}</span>
          </button>
        </div>

        {gpsError && (
          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-xs text-amber-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{gpsError}</span>
          </div>
        )}

        {/* Singapore Hub Anchors Quick Select */}
        <div>
          <span className="text-xs font-semibold text-slate-400 block mb-2">
            Or select Singapore transit anchor:
          </span>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SINGAPORE_HUBS.map((hub, idx) => {
              const isSelected =
                activeLocation[0] === hub.coords[0] && activeLocation[1] === hub.coords[1];
              return (
                <button
                  key={hub.name}
                  onClick={() => {
                    setSelectedHubIndex(idx);
                    setUserCoords(hub.coords);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-sm'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  {hub.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Nearest Bus Stops List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 tracking-tight">
            Closest Bus Stops ({nearestStopsData.length})
          </h3>
          <span className="text-xs text-emerald-400 font-medium">
            Live ETA ticking
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {nearestStopsData.map(({ stop, distanceMeters, walkingMins }) => {
            const arrivals = busEngine.getArrivalsForStop(stop.code);
            return (
              <BusStopCard
                key={stop.code}
                stop={stop}
                arrivals={arrivals}
                isFavorite={favorites.includes(stop.code)}
                onToggleFavorite={onToggleFavorite}
                onSelectService={onSelectService}
                onViewOnMap={onViewOnMap}
                onSetAlarm={onSetAlarm}
                distanceMeters={distanceMeters}
                walkingMins={walkingMins}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
