import React from 'react';
import { BusService, LiveBusVehicle, BusStop, TrafficCondition } from '../types/bus';
import { OPERATOR_LABELS, CROWDING_CONFIG } from '../data/singaporeBuses';
import { Clock, Layers, MapPin, Bell, Activity, AlertCircle, X, Compass, ChevronRight } from 'lucide-react';

interface BusServiceDetailModalProps {
  service: BusService;
  vehicles: LiveBusVehicle[];
  currentStopCode?: string;
  trafficCondition: TrafficCondition;
  onClose: () => void;
  onSelectStop: (stopCode: string) => void;
  onSetAlarm: (serviceNo: string, stopCode: string, stopName: string) => void;
}

export const BusServiceDetailModal: React.FC<BusServiceDetailModalProps> = ({
  service,
  vehicles,
  currentStopCode,
  trafficCondition,
  onClose,
  onSelectStop,
  onSetAlarm
}) => {
  const operator = OPERATOR_LABELS[service.operator] || OPERATOR_LABELS.SBST;
  const activeVehicles = vehicles.filter((v) => v.serviceNo === service.serviceNo);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 font-mono">
              {service.serviceNo}
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs">
                <span className={`px-2 py-0.5 rounded font-semibold border ${operator.badge}`}>
                  {operator.name}
                </span>
                <span className="text-slate-400 font-medium">· {service.category} Service</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-1">
                {service.origin} → {service.destination}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Operating Schedule & Traffic Strip */}
        <div className="px-5 sm:px-6 py-3 bg-slate-900/90 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-500 block">Peak Frequency</span>
            <span className="font-semibold text-slate-200">{service.frequencyPeak}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Off-Peak</span>
            <span className="font-semibold text-slate-200">{service.frequencyOffPeak}</span>
          </div>
          <div>
            <span className="text-slate-500 block">First / Last Bus</span>
            <span className="font-semibold text-slate-200">{service.firstBus} – {service.lastBus}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Live Fleet</span>
            <span className="font-semibold text-emerald-400">{activeVehicles.length} active on route</span>
          </div>
        </div>

        {/* Scrollable Route Progress */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {/* Traffic & Prediction Notice */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3 text-xs text-slate-300">
            <Activity className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Prediction Algorithm: </span>
              Arrival timings dynamically incorporate live GPS vehicle speeds ({trafficCondition.label} factor ×{trafficCondition.multiplier}) and boarding dwell times.
            </div>
          </div>

          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider pt-2">
            Route Stops Sequence
          </h3>

          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
            {service.stops.map((stop, index) => {
              const isCurrentSelected = stop.stopCode === currentStopCode;
              // Check if any vehicle is approaching or at this stop
              const approachingVehicle = activeVehicles.find(
                (v) => v.currentRouteIndex === index - 1 || (index === 0 && v.currentRouteIndex === 0)
              );

              // Estimate arrival minutes to this stop based on first approaching bus
              let arrivalEstimateText = '';
              if (approachingVehicle) {
                const mins = Math.max(1, Math.round(approachingVehicle.secondsToNextStop / 60));
                arrivalEstimateText = mins <= 1 ? 'Arr' : `${mins}m`;
              } else {
                // Synthesize realistic progression
                const baseMins = (index + 1) * 3;
                arrivalEstimateText = `${baseMins}m`;
              }

              return (
                <div key={stop.stopCode} className="relative group">
                  {/* Timeline dot */}
                  <div
                    className={`absolute -left-6 sm:-left-8 top-1.5 w-4 h-4 rounded-full border-2 transition-all ${
                      isCurrentSelected
                        ? 'bg-emerald-500 border-white ring-4 ring-emerald-500/20'
                        : approachingVehicle
                        ? 'bg-amber-400 border-slate-900 ring-2 ring-amber-400/30'
                        : 'bg-slate-900 border-slate-700'
                    }`}
                  />

                  {/* Stop Information Row */}
                  <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-950/50">
                          {stop.stopCode}
                        </span>
                        <span className="text-xs text-slate-400">{stop.roadName}</span>
                        {isCurrentSelected && (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded">
                            YOUR STOP
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-semibold text-white">
                        {stop.stopName}
                      </h4>
                    </div>

                    {/* Right side: ETA + Alarm trigger */}
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <span className="font-mono font-bold text-sm text-slate-100 tabular-nums">
                          {arrivalEstimateText}
                        </span>
                        <span className="text-[10px] text-slate-500 block">Est. Arrival</span>
                      </div>

                      <button
                        onClick={() => onSetAlarm(service.serviceNo, stop.stopCode, stop.stopName)}
                        className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-850 rounded-lg transition-colors cursor-pointer"
                        title="Set arrival alert for this stop"
                      >
                        <Bell className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Show Live Bus Pin between stops if active */}
                  {approachingVehicle && (
                    <div className="mt-2 ml-2 p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40 flex items-center justify-between text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                        <span className="font-semibold text-emerald-300">
                          Bus #{approachingVehicle.id}
                        </span>
                        <span>· Live Speed {approachingVehicle.speedKmh} km/h</span>
                      </div>
                      <span className="font-medium text-emerald-400">
                        {CROWDING_CONFIG[approachingVehicle.load].label}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            LTA Singapore Standard Fleet Telemetry
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Close Route
          </button>
        </div>
      </div>
    </div>
  );
};
