import React, { useState } from 'react';
import { Star, MapPin, ChevronRight, Bell, Train, Radio } from 'lucide-react';
import { BusStop, BusServiceArrival } from '../types/bus';
import { OPERATOR_LABELS } from '../data/singaporeBuses';
import { BusArrivalBadge } from './BusArrivalBadge';

interface BusStopCardProps {
  stop: BusStop;
  arrivals: BusServiceArrival[];
  isFavorite: boolean;
  onToggleFavorite: (stopCode: string) => void;
  onSelectService: (serviceNo: string, stopCode: string) => void;
  onViewOnMap: (stop: BusStop) => void;
  onSetAlarm: (serviceNo: string, stopCode: string, stopName: string) => void;
  distanceMeters?: number;
  walkingMins?: number;
}

export const BusStopCard: React.FC<BusStopCardProps> = ({
  stop,
  arrivals,
  isFavorite,
  onToggleFavorite,
  onSelectService,
  onViewOnMap,
  onSetAlarm,
  distanceMeters,
  walkingMins
}) => {
  const [filterService, setFilterService] = useState<string>('');

  const displayArrivals = filterService
    ? arrivals.filter((a) => a.serviceNo.toLowerCase().includes(filterService.toLowerCase()))
    : arrivals;

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-200 hover:border-slate-700 shadow-sm">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-900/90">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-mono font-bold tracking-wider px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800/60 tabular-nums">
                {stop.code}
              </span>
              <span className="text-slate-400 font-medium">{stop.road}</span>
              {stop.mrtInterchange && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                  <Train className="w-3 h-3" />
                  <span>{stop.mrtInterchange}</span>
                </span>
              )}
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight pt-1">
              {stop.description}
            </h3>

            {distanceMeters !== undefined && (
              <div className="flex items-center gap-2 text-xs text-slate-400 pt-0.5">
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <Radio className="w-3 h-3" />
                  <span>{distanceMeters}m away</span>
                </span>
                <span aria-hidden="true">·</span>
                <span>~{walkingMins} min walk</span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onViewOnMap(stop)}
              className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="View stop and buses on live map"
            >
              <MapPin className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleFavorite(stop.code)}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isFavorite
                  ? 'text-amber-400 hover:text-amber-300 bg-amber-950/30'
                  : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800'
              }`}
              title={isFavorite ? 'Remove from saved stops' : 'Save bus stop'}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Quick Service Filter if stop has many services */}
        {stop.services.length > 5 && (
          <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between gap-2">
            <span className="text-xs text-slate-400">
              {stop.services.length} services calling here
            </span>
            <input
              type="text"
              placeholder="Filter service (e.g. 190)..."
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
              className="px-2.5 py-1 text-xs bg-slate-950 border border-slate-700/80 rounded-md text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 max-w-[170px]"
            />
          </div>
        )}
      </div>

      {/* Services Arrival List */}
      <div className="divide-y divide-slate-800/60">
        {displayArrivals.map((arrival) => {
          const operatorInfo = OPERATOR_LABELS[arrival.operator] || OPERATOR_LABELS.SBST;
          return (
            <div
              key={arrival.serviceNo}
              className="p-3 sm:p-4 hover:bg-slate-850/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              {/* Left Column: Service Number & Operator */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onSelectService(arrival.serviceNo, stop.code)}
                  className="flex items-center gap-2 group-hover:opacity-90 text-left cursor-pointer"
                  title="View live vehicle location & route"
                >
                  <div className="w-12 h-10 rounded-xl bg-slate-950 border border-slate-700/80 flex items-center justify-center font-bold text-base text-white group-hover:border-emerald-500/70 transition-colors">
                    {arrival.serviceNo}
                  </div>
                  <div>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${operatorInfo.badge}`}>
                      {operatorInfo.name}
                    </span>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 group-hover:text-emerald-400 transition-colors">
                      <span>Track route</span>
                      <ChevronRight className="w-3 h-3 inline" />
                    </p>
                  </div>
                </button>

                {/* Alarm trigger */}
                <button
                  onClick={() => onSetAlarm(arrival.serviceNo, stop.code, stop.description)}
                  className="hidden sm:flex p-1.5 text-slate-500 hover:text-emerald-400 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                  title="Set arrival reminder chime"
                >
                  <Bell className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Right Column: 3 Arrivals (Next, 2nd, 3rd) */}
              <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
                <BusArrivalBadge arrival={arrival.nextBus} label="Next Bus" showDetailedCountdown={true} />
                <BusArrivalBadge arrival={arrival.nextBus2} label="2nd Bus" />
                <BusArrivalBadge arrival={arrival.nextBus3} label="3rd Bus" />
              </div>
            </div>
          );
        })}

        {displayArrivals.length === 0 && (
          <div className="p-6 text-center text-sm text-slate-500">
            No bus services found matching "{filterService}" at this stop.
          </div>
        )}
      </div>
    </div>
  );
};
