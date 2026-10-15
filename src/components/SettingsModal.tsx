import React, { useState } from 'react';
import { TrafficCondition } from '../types/bus';
import { TRAFFIC_CONDITIONS, busEngine } from '../services/busSimulationEngine';
import { SlidersHorizontal, Key, Check, Info, ShieldCheck, X, Zap } from 'lucide-react';

interface SettingsModalProps {
  currentTraffic: TrafficCondition;
  onUpdateTraffic: (mode: 'smooth' | 'normal' | 'peak' | 'rain') => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  currentTraffic,
  onUpdateTraffic,
  onClose
}) => {
  const [apiKey, setApiKey] = useState(busEngine.getApiKey());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    busEngine.setApiKey(apiKey);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-emerald-400">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Prediction & LTA Settings</h2>
              <p className="text-xs text-slate-400">Adjust simulation conditions and API options</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Traffic Condition Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
              Singapore Road Traffic Condition
            </label>
            <p className="text-xs text-slate-400">
              Arrival wait predictions dynamically recalculate speeds and ETA factors according to road conditions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.values(TRAFFIC_CONDITIONS).map((cond) => {
                const isSelected = currentTraffic.mode === cond.mode;
                return (
                  <button
                    key={cond.mode}
                    onClick={() => onUpdateTraffic(cond.mode as 'smooth' | 'normal' | 'peak' | 'rain')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-950/60 border-emerald-500 shadow-sm shadow-emerald-500/10'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${isSelected ? 'text-emerald-400' : 'text-slate-200'}`}>
                        {cond.label}
                      </span>
                      {isSelected && <Zap className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block leading-snug">
                      {cond.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* LTA DataMall API Key (Optional) */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-emerald-400" />
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Official LTA DataMall Key (Optional)
              </label>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The app operates self-contained with live GPS bus simulation. If you have an official LTA DataMall AccountKey from <span className="text-emerald-400 font-medium">datamall.lta.gov.sg</span>, paste it below to enable direct LTA queries.
            </p>

            <form onSubmit={handleSaveApiKey} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="Paste LTA DataMall AccountKey here..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer shrink-0"
                >
                  Save Key
                </button>
              </div>

              {savedSuccess && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 pt-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Key configuration saved to browser storage.</span>
                </div>
              )}
            </form>
          </div>

          {/* Prediction Model Specification */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs text-slate-400">
            <span className="font-semibold text-slate-200 block">LTA DataMall Standards & Indicators:</span>
            <div className="space-y-1">
              <div><strong className="text-emerald-400">SEA:</strong> Seats Available (&lt;60% capacity)</div>
              <div><strong className="text-amber-400">SDA:</strong> Standing Available (60%-90% capacity)</div>
              <div><strong className="text-rose-400">LSD:</strong> Limited Standing (&gt;90% capacity)</div>
              <div><strong className="text-sky-400">DD / BD:</strong> Double Deck or Bendy bus fleet</div>
              <div><strong className="text-slate-300">WAB:</strong> Wheelchair Accessible Bus with ramp</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
