import React from 'react';
import { Accessibility, Layers } from 'lucide-react';
import { BusArrivalInfo } from '../types/bus';
import { CROWDING_CONFIG } from '../data/singaporeBuses';

interface BusArrivalBadgeProps {
  arrival: BusArrivalInfo | null;
  label?: string; // e.g. "Next", "2nd", "3rd"
  showDetailedCountdown?: boolean;
}

export const BusArrivalBadge: React.FC<BusArrivalBadgeProps> = ({
  arrival,
  label,
  showDetailedCountdown = false
}) => {
  if (!arrival) {
    return (
      <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 min-w-[72px] min-h-[58px] text-slate-500 text-xs">
        {label && <span className="text-[10px] text-slate-500 font-medium mb-0.5">{label}</span>}
        <span className="font-mono text-slate-500">—</span>
      </div>
    );
  }

  const crowding = CROWDING_CONFIG[arrival.load] || CROWDING_CONFIG.SEA;
  const isArrivingSoon = arrival.secondsUntilArrival <= 45;

  return (
    <div
      className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all min-w-[74px] sm:min-w-[82px] ${
        isArrivingSoon
          ? 'bg-emerald-950/40 border-emerald-500/50 shadow-sm shadow-emerald-500/10'
          : 'bg-slate-900/80 border-slate-800/80 hover:border-slate-700'
      }`}
      title={`${label || 'Bus'}: ${crowding.label} · ${
        arrival.type === 'DD' ? 'Double Deck' : arrival.type === 'BD' ? 'Bendy Bus' : 'Single Deck'
      } · ${arrival.feature === 'WAB' ? 'Wheelchair Accessible' : ''}`}
    >
      {label && (
        <span className="text-[10px] text-slate-400 font-medium tracking-tight mb-0.5">
          {label}
        </span>
      )}

      {/* Arrival Time Countdown */}
      <div className="flex items-baseline gap-0.5">
        <span
          className={`font-mono tabular-nums font-bold text-sm sm:text-base ${
            isArrivingSoon ? 'text-emerald-400' : 'text-slate-100'
          }`}
        >
          {showDetailedCountdown && arrival.secondsUntilArrival > 45
            ? `${Math.floor(arrival.secondsUntilArrival / 60)}m ${arrival.secondsUntilArrival % 60}s`
            : arrival.estimatedArrival}
        </span>
      </div>

      {/* Meta indicators: Load color bar + Deck + WAB */}
      <div className="flex items-center gap-1.5 mt-1">
        {/* Load badge pill */}
        <span
          className={`inline-block w-2.5 h-1.5 rounded-sm ${crowding.barClass}`}
          title={crowding.label}
        />

        {/* Deck Type */}
        {arrival.type === 'DD' && (
          <span
            className="flex items-center gap-0.5 text-[9px] font-bold text-sky-400 bg-sky-950/80 px-1 py-0.2 rounded"
            title="Double Deck Bus"
          >
            <Layers className="w-2.5 h-2.5" />
            <span>DD</span>
          </span>
        )}
        {arrival.type === 'BD' && (
          <span
            className="text-[9px] font-bold text-purple-400 bg-purple-950/80 px-1 py-0.2 rounded"
            title="Bendy Bus (Articulated)"
          >
            BD
          </span>
        )}

        {/* Wheelchair accessible indicator */}
        {arrival.feature === 'WAB' && (
          <span title="Wheelchair Accessible (WAB)">
            <Accessibility className="w-2.5 h-2.5 text-slate-400" />
          </span>
        )}
      </div>
    </div>
  );
};
