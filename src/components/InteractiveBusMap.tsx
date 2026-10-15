import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { BusStop, LiveBusVehicle, BusService } from '../types/bus';
import { SINGAPORE_BUS_STOPS, POPULAR_BUS_SERVICES, CROWDING_CONFIG } from '../data/singaporeBuses';
import { Layers, Crosshair, Filter, Info, Bus as BusIcon } from 'lucide-react';

interface InteractiveBusMapProps {
  vehicles: LiveBusVehicle[];
  selectedStop: BusStop | null;
  onSelectStop: (stop: BusStop) => void;
  selectedServiceNo: string | null;
  onSelectServiceNo: (serviceNo: string | null) => void;
  userCoords: [number, number] | null;
}

export const InteractiveBusMap: React.FC<InteractiveBusMapProps> = ({
  vehicles,
  selectedStop,
  onSelectStop,
  selectedServiceNo,
  onSelectServiceNo,
  userCoords
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const busMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const stopMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const [filterService, setFilterService] = useState<string>(selectedServiceNo || 'all');
  const [selectedVehicle, setSelectedVehicle] = useState<LiveBusVehicle | null>(null);

  // Sync external selectedServiceNo
  useEffect(() => {
    if (selectedServiceNo) {
      setFilterService(selectedServiceNo);
    }
  }, [selectedServiceNo]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Default center: Orchard / City Hall Singapore
    const initialCenter: [number, number] = [1.302, 103.842];
    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 14,
      zoomControl: false
    });

    // High quality crisp CartoDB Voyager tiles (rich transit visibility)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapInstanceRef.current = map;

    // Render Bus Stop Markers
    SINGAPORE_BUS_STOPS.forEach((stop) => {
      const stopIcon = L.divIcon({
        className: 'custom-bus-stop-pin',
        html: `
          <div class="group relative flex items-center justify-center">
            <div class="w-4 h-4 rounded-full bg-slate-900 border-2 border-emerald-500 shadow-md flex items-center justify-center cursor-pointer transition-transform hover:scale-125">
              <div class="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
            </div>
            <div class="absolute bottom-5 left-1/2 -translate-x-1/2 hidden group-hover:flex bg-slate-950 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-lg border border-slate-700 whitespace-nowrap z-50 pointer-events-none">
              ${stop.code} - ${stop.description}
            </div>
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const marker = L.marker([stop.latitude, stop.longitude], { icon: stopIcon }).addTo(map);
      marker.on('click', () => {
        onSelectStop(stop);
        map.flyTo([stop.latitude, stop.longitude], 16, { duration: 0.8 });
      });

      stopMarkersRef.current.set(stop.code, marker);
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [onSelectStop]);

  // Update Route Polyline when filterService changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (routePolylineRef.current) {
      map.removeLayer(routePolylineRef.current);
      routePolylineRef.current = null;
    }

    if (filterService !== 'all') {
      const service = POPULAR_BUS_SERVICES.find((s) => s.serviceNo === filterService);
      if (service && service.stops.length > 1) {
        const coords = service.stops.map((s) => s.coordinates);
        const polyline = L.polyline(coords, {
          color: '#10b981',
          weight: 4,
          opacity: 0.85,
          dashArray: '2, 6',
          lineCap: 'round'
        }).addTo(map);

        routePolylineRef.current = polyline;

        // Auto zoom map to fit route
        const bounds = L.latLngBounds(coords);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      }
    }
  }, [filterService]);

  // Update live vehicle markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const filteredVehicles =
      filterService === 'all' ? vehicles : vehicles.filter((v) => v.serviceNo === filterService);

    // Keep track of active vehicle IDs
    const activeIds = new Set(filteredVehicles.map((v) => v.id));

    // Remove obsolete markers
    busMarkersRef.current.forEach((marker, id) => {
      if (!activeIds.has(id)) {
        map.removeLayer(marker);
        busMarkersRef.current.delete(id);
      }
    });

    // Update or add vehicle markers
    filteredVehicles.forEach((v) => {
      const crowding = CROWDING_CONFIG[v.load] || CROWDING_CONFIG.SEA;
      const crowdingBorder =
        v.load === 'SEA'
          ? 'border-emerald-500'
          : v.load === 'SDA'
          ? 'border-amber-500'
          : 'border-rose-500';

      const html = `
        <div class="relative flex items-center justify-center cursor-pointer group">
          <div class="w-8 h-8 rounded-full bg-slate-950 border-2 ${crowdingBorder} shadow-lg shadow-black/40 flex items-center justify-center text-white font-bold text-[11px] font-mono tabular-nums transition-transform group-hover:scale-110">
            ${v.serviceNo}
            ${v.type === 'DD' ? '<span class="absolute -top-1 -right-1 bg-sky-500 text-[8px] text-slate-950 font-black px-1 rounded-full">2D</span>' : ''}
          </div>
          <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-slate-950" style="transform: rotate(${v.bearing}deg);"></div>
        </div>
      `;

      const icon = L.divIcon({
        className: 'custom-bus-live-marker',
        html,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      let marker = busMarkersRef.current.get(v.id);
      if (marker) {
        marker.setLatLng([v.latitude, v.longitude]);
        marker.setIcon(icon);
      } else {
        marker = L.marker([v.latitude, v.longitude], { icon }).addTo(map);
        marker.on('click', () => {
          setSelectedVehicle(v);
          map.panTo([v.latitude, v.longitude]);
        });
        busMarkersRef.current.set(v.id, marker);
      }
    });
  }, [vehicles, filterService]);

  // User location marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userCoords) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng(userCoords);
    } else {
      const userIcon = L.divIcon({
        className: 'user-gps-dot',
        html: `
          <div class="relative flex items-center justify-center">
            <span class="absolute w-6 h-6 rounded-full bg-blue-500/30 animate-ping"></span>
            <span class="w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-white shadow-md"></span>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      userMarkerRef.current = L.marker(userCoords, { icon: userIcon }).addTo(map);
    }
  }, [userCoords]);

  // Fly to selected stop when prop changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedStop) return;
    map.flyTo([selectedStop.latitude, selectedStop.longitude], 16, { duration: 1.0 });
  }, [selectedStop]);

  const handleRecenter = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (userCoords) {
      map.flyTo(userCoords, 16, { duration: 0.8 });
    } else {
      map.flyTo([1.302, 103.842], 14, { duration: 0.8 });
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-140px)] min-h-[500px] rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950">
      {/* Top Filter Floating Bar */}
      <div className="absolute top-4 left-4 right-4 z-[500] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-1.5 shadow-lg pointer-events-auto">
          <div className="flex items-center gap-1.5 px-2 text-xs font-semibold text-slate-300">
            <Filter className="w-3.5 h-3.5 text-emerald-400" />
            <span>Bus Service:</span>
          </div>
          <select
            value={filterService}
            onChange={(e) => {
              setFilterService(e.target.value);
              onSelectServiceNo(e.target.value === 'all' ? null : e.target.value);
            }}
            className="bg-slate-950 text-white text-xs font-medium px-2.5 py-1 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="all">All Services ({POPULAR_BUS_SERVICES.length})</option>
            {POPULAR_BUS_SERVICES.map((s) => (
              <option key={s.serviceNo} value={s.serviceNo}>
                Bus {s.serviceNo} ({s.origin} → {s.destination})
              </option>
            ))}
          </select>
        </div>

        {/* Recenter GPS button */}
        <button
          onClick={handleRecenter}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-900/90 backdrop-blur-md text-white text-xs font-semibold rounded-xl border border-slate-700 shadow-lg hover:bg-slate-800 transition-colors pointer-events-auto cursor-pointer"
          title="Recenter to location"
        >
          <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
          <span>Locate</span>
        </button>
      </div>

      {/* Map DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Selected Bus Vehicle Detail Drawer */}
      {selectedVehicle && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:w-96 z-[500] bg-slate-950/95 backdrop-blur-md border border-slate-700 rounded-2xl p-4 shadow-2xl">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-emerald-500/60 flex items-center justify-center font-bold text-lg text-white">
                {selectedVehicle.serviceNo}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-emerald-400">
                    {selectedVehicle.operator}
                  </span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-xs text-slate-300 font-medium">
                    {selectedVehicle.type === 'DD' ? 'Double Deck' : selectedVehicle.type === 'BD' ? 'Bendy' : 'Single Deck'}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mt-0.5">
                  Bus ID: {selectedVehicle.id}
                </h4>
              </div>
            </div>
            <button
              onClick={() => setSelectedVehicle(null)}
              className="text-slate-400 hover:text-white text-sm font-medium p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-800">
            <div className="bg-slate-900 p-2 rounded-lg">
              <span className="text-slate-500 text-[10px] block">Next Stop</span>
              <span className="font-semibold text-slate-200 truncate block">
                {selectedVehicle.nextStopName}
              </span>
            </div>
            <div className="bg-slate-900 p-2 rounded-lg">
              <span className="text-slate-500 text-[10px] block">Live Speed</span>
              <span className="font-mono font-bold text-emerald-400 tabular-nums">
                {selectedVehicle.speedKmh} km/h
              </span>
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400">
            <span>Crowding Status:</span>
            <span
              className={`font-semibold ${
                selectedVehicle.load === 'SEA'
                  ? 'text-emerald-400'
                  : selectedVehicle.load === 'SDA'
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {CROWDING_CONFIG[selectedVehicle.load].label}
            </span>
          </div>
        </div>
      )}

      {/* Legend Footer */}
      <div className="hidden sm:flex absolute bottom-4 left-4 z-[500] items-center gap-3 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Seats
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Standing
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Limited
        </span>
        <span className="flex items-center gap-1.5 border-l border-slate-800 pl-2">
          <span className="w-2.5 h-2.5 rounded-full border-2 border-emerald-500 bg-slate-900"></span> Bus Stop
        </span>
      </div>
    </div>
  );
};
