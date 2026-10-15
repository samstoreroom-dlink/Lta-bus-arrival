import React, { useState } from 'react';
import { Bell, Clock, Check, X, Volume2 } from 'lucide-react';
import { playArrivalChime } from '../services/audioAlert';

interface AlarmModalProps {
  serviceNo: string;
  stopCode: string;
  stopName: string;
  onAddAlarm: (serviceNo: string, stopCode: string, stopName: string, minutes: number) => void;
  onClose: () => void;
}

export const AlarmModal: React.FC<AlarmModalProps> = ({
  serviceNo,
  stopCode,
  stopName,
  onAddAlarm,
  onClose
}) => {
  const [minutes, setMinutes] = useState<number>(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playArrivalChime(); // Play test confirmation sound
    onAddAlarm(serviceNo, stopCode, stopName, minutes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Set Arrival Chime Alert</h3>
              <p className="text-xs text-slate-400">Audio reminder before bus arrives</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-emerald-500/60 flex items-center justify-center font-bold text-base text-white">
              {serviceNo}
            </div>
            <div>
              <div className="text-xs font-semibold text-white">{stopName}</div>
              <span className="text-[11px] font-mono text-emerald-400">Stop #{stopCode}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Trigger alarm when bus is:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { mins: 1, label: '1 min away' },
                { mins: 2, label: '2 mins away' },
                { mins: 5, label: '5 mins away' }
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.mins}
                  onClick={() => setMinutes(opt.mins)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                    minutes === opt.mins
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
            <Volume2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Plays an audible transit announcement chime and shows a notification toast.</span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-slate-950 shadow-md transition-colors cursor-pointer"
            >
              Set Alert
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
