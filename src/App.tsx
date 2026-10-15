import React, { useState, useEffect } from 'react';
import { BusStop, BusServiceArrival, LiveBusVehicle, BusService, TrafficCondition, ArrivalAlarm } from './types/bus';
import { SINGAPORE_BUS_STOPS, POPULAR_BUS_SERVICES } from './data/singaporeBuses';
import { busEngine, TRAFFIC_CONDITIONS } from './services/busSimulationEngine';
import { playArrivalChime } from './services/audioAlert';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { BusStopCard } from './components/BusStopCard';
import { InteractiveBusMap } from './components/InteractiveBusMap';
import { NearbyStopsView } from './components/NearbyStopsView';
import { FavoritesView } from './components/FavoritesView';
import { BusServiceDetailModal } from './components/BusServiceDetailModal';
import { SettingsModal } from './components/SettingsModal';
import { AlarmModal } from './components/AlarmModal';
import {
  Search,
  Filter,
  Train,
  Layers,
  Accessibility,
  Clock,
  Radio,
  Bell,
  CheckCircle,
  MapPin,
  TrendingUp,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'stops' | 'nearby' | 'map' | 'favorites'>('stops');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMrtOnly, setFilterMrtOnly] = useState(false);
  const [filterSeatsOnly, setFilterSeatsOnly] = useState(false);
  const [filterDoubleDeckOnly, setFilterDoubleDeckOnly] = useState(false);

  // Live vehicles & tick state
  const [vehicles, setVehicles] = useState<LiveBusVehicle[]>([]);
  const [trafficCondition, setTrafficCondition] = useState<TrafficCondition>(busEngine.getTrafficCondition());
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sg_bus_favorites');
      return saved ? JSON.parse(saved) : ['10018', '01112', '08057'];
    } catch {
      return ['10018', '01112', '08057'];
    }
  });

  // User location for radar and map
  const [userCoords, setUserCoords] = useState<[number, number] | null>([1.3040, 103.8320]); // Default to Orchard

  // Modals & Selected states
  const [selectedService, setSelectedService] = useState<BusService | null>(null);
  const [selectedServiceStopCode, setSelectedServiceStopCode] = useState<string | undefined>(undefined);
  const [selectedStopForMap, setSelectedStopForMap] = useState<BusStop | null>(null);
  const [mapServiceFilter, setMapServiceFilter] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [alarmModalData, setAlarmModalData] = useState<{ serviceNo: string; stopCode: string; stopName: string } | null>(null);

  // Active alarms & notification banner
  const [alarms, setAlarms] = useState<ArrivalAlarm[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Subscribe to live bus simulation ticks
  useEffect(() => {
    const unsubscribe = busEngine.subscribe((updatedVehicles) => {
      setVehicles([...updatedVehicles]);
    });
    return unsubscribe;
  }, []);

  // Update clock & check alarms every second
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTimeStr(
        now.toLocaleTimeString('en-SG', {
          timeZone: 'Asia/Singapore',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        })
      );
    };

    updateClock();
    const interval = setInterval(() => {
      updateClock();

      // Check active alarms
      if (alarms.length > 0) {
        setAlarms((prevAlarms) => {
          let hasTriggered = false;
          const updated = prevAlarms.map((alarm) => {
            if (alarm.triggered) return alarm;

            const arrivals = busEngine.getArrivalsForStop(alarm.stopCode);
            const targetArrival = arrivals.find((a) => a.serviceNo === alarm.serviceNo);
            const seconds = targetArrival?.nextBus?.secondsUntilArrival;

            if (seconds !== undefined && seconds <= alarm.triggerMinutes * 60) {
              hasTriggered = true;
              playArrivalChime();
              setToastMessage(
                `🔔 Bus ${alarm.serviceNo} is ${Math.ceil(seconds / 60)} min away from ${alarm.stopName}!`
              );
              return { ...alarm, triggered: true };
            }
            return alarm;
          });

          return updated;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [alarms]);

  // Persist favorites
  const handleToggleFavorite = (stopCode: string) => {
    setFavorites((prev) => {
      const next = prev.includes(stopCode) ? prev.filter((c) => c !== stopCode) : [...prev, stopCode];
      try {
        localStorage.setItem('sg_bus_favorites', JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  // Add alarm handler
  const handleAddAlarm = (serviceNo: string, stopCode: string, stopName: string, minutes: number) => {
    const newAlarm: ArrivalAlarm = {
      id: `${serviceNo}-${stopCode}-${Date.now()}`,
      serviceNo,
      stopCode,
      stopName,
      triggerMinutes: minutes,
      triggered: false,
      createdAt: Date.now()
    };
    setAlarms((prev) => [...prev, newAlarm]);
    setToastMessage(`✓ Alert set for Bus ${serviceNo} at ${stopName} (${minutes}m away)`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Click on service from stop card
  const handleSelectService = (serviceNo: string, stopCode: string) => {
    const service = POPULAR_BUS_SERVICES.find((s) => s.serviceNo === serviceNo);
    if (service) {
      setSelectedService(service);
      setSelectedServiceStopCode(stopCode);
    } else {
      // Create minimal service presentation if secondary
      const customService: BusService = {
        serviceNo,
        operator: 'SBST',
        category: 'Trunk',
        origin: 'Central Interchange',
        destination: 'Regional Interchange',
        direction: 1,
        firstBus: '05:40',
        lastBus: '23:45',
        frequencyPeak: '5-8 mins',
        frequencyOffPeak: '8-12 mins',
        stops: SINGAPORE_BUS_STOPS.filter((s) => s.services.includes(serviceNo)).map((s, idx) => ({
          stopCode: s.code,
          seq: idx + 1,
          distanceKm: idx * 1.5,
          stopName: s.description,
          roadName: s.road,
          coordinates: [s.latitude, s.longitude]
        }))
      };
      setSelectedService(customService);
      setSelectedServiceStopCode(stopCode);
    }
  };

  // View on map
  const handleViewOnMap = (stop: BusStop) => {
    setSelectedStopForMap(stop);
    setActiveTab('map');
  };

  // Filtered bus stops list
  const filteredStops = SINGAPORE_BUS_STOPS.filter((stop) => {
    // Search query matching stop code, description, road name, or bus service
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchesCode = stop.code.includes(q);
      const matchesDesc = stop.description.toLowerCase().includes(q);
      const matchesRoad = stop.road.toLowerCase().includes(q);
      const matchesService = stop.services.some((s) => s.toLowerCase() === q || s.toLowerCase().includes(q));

      if (!matchesCode && !matchesDesc && !matchesRoad && !matchesService) {
        return false;
      }
    }

    // MRT only
    if (filterMrtOnly && !stop.mrtInterchange) {
      return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setSettingsOpen(true)}
        trafficCondition={trafficCondition}
        favoritesCount={favorites.length}
      />

      {/* Floating Alert / Toast Banner */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-slate-950 font-bold px-4 py-2.5 rounded-2xl shadow-xl shadow-emerald-500/20 text-xs sm:text-sm flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 font-black text-slate-900 hover:text-black cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 space-y-6">
        {/* Top Commuter Header & Live Telemetry Strip */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono text-emerald-400 font-bold tabular-nums">
                {currentTimeStr} SGT
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">Singapore LTA Real-Time Fleet</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-emerald-400 font-medium">GPS Live Sync Active</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              Singapore Bus Arrival & Wait Time Predictions
            </h1>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 text-xs shrink-0">
            <div className="bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Active Buses</span>
              <span className="font-mono font-bold text-white text-sm tabular-nums">
                {vehicles.length} tracked
              </span>
            </div>
            <div className="bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Bus Stops</span>
              <span className="font-mono font-bold text-white text-sm tabular-nums">
                {SINGAPORE_BUS_STOPS.length} network stops
              </span>
            </div>
            <div className="bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Active Alarms</span>
              <span className="font-mono font-bold text-emerald-400 text-sm tabular-nums">
                {alarms.filter((a) => !a.triggered).length} armed
              </span>
            </div>
          </div>
        </div>

        {/* View Routing */}
        {activeTab === 'stops' && (
          <div className="space-y-5">
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by 5-digit bus stop code (e.g. 10018), road (Orchard), or service (190)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Filter Buttons */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setFilterMrtOnly(!filterMrtOnly)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-colors whitespace-nowrap cursor-pointer ${
                    filterMrtOnly
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <Train className="w-3.5 h-3.5" />
                  <span>MRT Interchange</span>
                </button>

                {(searchQuery || filterMrtOnly) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilterMrtOnly(false);
                    }}
                    className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Reset filters"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Results count & Quick jump anchors */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>
                Showing {filteredStops.length} bus stop{filteredStops.length === 1 ? '' : 's'}
              </span>
              <div className="hidden sm:flex items-center gap-1.5">
                <span>Quick:</span>
                {['10018 (Orchard)', '08057 (Dhoby Ghaut)', '01112 (Bugis)', '28009 (Jurong East)'].map(
                  (q) => {
                    const code = q.split(' ')[0];
                    return (
                      <button
                        key={code}
                        onClick={() => setSearchQuery(code)}
                        className="text-emerald-400 hover:underline cursor-pointer"
                      >
                        {q}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Bus Stops Grid */}
            <div className="grid grid-cols-1 gap-4">
              {filteredStops.map((stop) => {
                const arrivals = busEngine.getArrivalsForStop(stop.code);
                return (
                  <BusStopCard
                    key={stop.code}
                    stop={stop}
                    arrivals={arrivals}
                    isFavorite={favorites.includes(stop.code)}
                    onToggleFavorite={handleToggleFavorite}
                    onSelectService={handleSelectService}
                    onViewOnMap={handleViewOnMap}
                    onSetAlarm={(serviceNo, stopCode, stopName) =>
                      setAlarmModalData({ serviceNo, stopCode, stopName })
                    }
                  />
                );
              })}

              {filteredStops.length === 0 && (
                <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white">No bus stops match your search</h3>
                  <p className="text-xs text-slate-400">
                    Try searching for a bus stop code (e.g. 10018), a road name (e.g. Orchard, Victoria St), or bus number (190, 65).
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilterMrtOnly(false);
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl text-white transition-colors cursor-pointer"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'nearby' && (
          <NearbyStopsView
            onSelectService={handleSelectService}
            onViewOnMap={handleViewOnMap}
            onSetAlarm={(serviceNo, stopCode, stopName) =>
              setAlarmModalData({ serviceNo, stopCode, stopName })
            }
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            userCoords={userCoords}
            setUserCoords={setUserCoords}
          />
        )}

        {activeTab === 'map' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                  <span>Real-Time Singapore Bus GPS Map</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Track live moving buses, routes, and arrival predictions at every stop.
                </p>
              </div>

              {selectedStopForMap && (
                <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
                  <span className="text-slate-400">Focused on:</span>
                  <span className="font-bold text-emerald-400">
                    {selectedStopForMap.code} ({selectedStopForMap.description})
                  </span>
                  <button
                    onClick={() => setSelectedStopForMap(null)}
                    className="text-slate-500 hover:text-white font-bold ml-1 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            <InteractiveBusMap
              vehicles={vehicles}
              selectedStop={selectedStopForMap}
              onSelectStop={(stop) => {
                setSelectedStopForMap(stop);
              }}
              selectedServiceNo={mapServiceFilter}
              onSelectServiceNo={setMapServiceFilter}
              userCoords={userCoords}
            />
          </div>
        )}

        {activeTab === 'favorites' && (
          <FavoritesView
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectService={handleSelectService}
            onViewOnMap={handleViewOnMap}
            onSetAlarm={(serviceNo, stopCode, stopName) =>
              setAlarmModalData({ serviceNo, stopCode, stopName })
            }
            onBrowseAll={() => setActiveTab('stops')}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        favoritesCount={favorites.length}
      />

      {/* Modal: Service Detail & Route Viewer */}
      {selectedService && (
        <BusServiceDetailModal
          service={selectedService}
          vehicles={vehicles}
          currentStopCode={selectedServiceStopCode}
          trafficCondition={trafficCondition}
          onClose={() => {
            setSelectedService(null);
            setSelectedServiceStopCode(undefined);
          }}
          onSelectStop={(stopCode) => {
            const stop = SINGAPORE_BUS_STOPS.find((s) => s.code === stopCode);
            if (stop) {
              setSelectedStopForMap(stop);
              setActiveTab('map');
              setSelectedService(null);
            }
          }}
          onSetAlarm={(serviceNo, stopCode, stopName) =>
            setAlarmModalData({ serviceNo, stopCode, stopName })
          }
        />
      )}

      {/* Modal: Settings & Traffic Modifier */}
      {settingsOpen && (
        <SettingsModal
          currentTraffic={trafficCondition}
          onUpdateTraffic={(mode) => {
            busEngine.setTrafficCondition(mode);
            setTrafficCondition(busEngine.getTrafficCondition());
            setToastMessage(`Traffic mode updated to: ${TRAFFIC_CONDITIONS[mode].label}`);
            setTimeout(() => setToastMessage(null), 3000);
          }}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {/* Modal: Arrival Alert Setup */}
      {alarmModalData && (
        <AlarmModal
          serviceNo={alarmModalData.serviceNo}
          stopCode={alarmModalData.stopCode}
          stopName={alarmModalData.stopName}
          onAddAlarm={handleAddAlarm}
          onClose={() => setAlarmModalData(null)}
        />
      )}
    </div>
  );
}
