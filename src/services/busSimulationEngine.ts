import { BusArrivalInfo, BusServiceArrival, BusStop, LiveBusVehicle, CrowdingLevel, BusType, Operator, TrafficCondition } from '../types/bus';
import { SINGAPORE_BUS_STOPS, POPULAR_BUS_SERVICES } from '../data/singaporeBuses';

export const TRAFFIC_CONDITIONS: Record<string, TrafficCondition> = {
  smooth: {
    mode: 'smooth',
    label: 'Smooth Expressway',
    multiplier: 0.85,
    description: 'Minimal congestion, buses cruising at top schedule speeds'
  },
  normal: {
    mode: 'normal',
    label: 'Normal Flow',
    multiplier: 1.0,
    description: 'Typical Singapore city traffic conditions'
  },
  peak: {
    mode: 'peak',
    label: 'Peak Hour Rush',
    multiplier: 1.35,
    description: 'Heavy ERP zones, Orchard/CBD congestion with +2 to 5 min delays'
  },
  rain: {
    mode: 'rain',
    label: 'Tropical Downpour',
    multiplier: 1.5,
    description: 'Wet road advisory, reduced speed and longer boarding times'
  }
};

class BusSimulationEngine {
  private vehicles: LiveBusVehicle[] = [];
  private currentTraffic: TrafficCondition = TRAFFIC_CONDITIONS.normal;
  private ltaApiKey: string = '';
  private lastUpdateTimestamp: number = Date.now();
  private subscribers: Array<(vehicles: LiveBusVehicle[]) => void> = [];

  constructor() {
    this.initFleet();
    this.startLiveClock();
    // Load persisted LTA Key if available
    try {
      const savedKey = localStorage.getItem('sg_bus_lta_key');
      if (savedKey) this.ltaApiKey = savedKey;
      const savedTraffic = localStorage.getItem('sg_bus_traffic_mode');
      if (savedTraffic && TRAFFIC_CONDITIONS[savedTraffic]) {
        this.currentTraffic = TRAFFIC_CONDITIONS[savedTraffic];
      }
    } catch {
      // Ignore in sandbox
    }
  }

  public getApiKey(): string {
    return this.ltaApiKey;
  }

  public setApiKey(key: string): void {
    this.ltaApiKey = key.trim();
    try {
      localStorage.setItem('sg_bus_lta_key', this.ltaApiKey);
    } catch {
      // Ignore
    }
  }

  /**
   * Queries the serverless /api/busarrival proxy
   */
  public async fetchLiveLtaArrivals(busStopCode: string): Promise<any | null> {
    try {
      const headers: Record<string, string> = {
        accept: 'application/json'
      };
      if (this.ltaApiKey) {
        headers['accountkey'] = this.ltaApiKey;
      }
      const res = await fetch(`/api/busarrival?BusStopCode=${encodeURIComponent(busStopCode)}`, {
        headers
      });
      if (res.ok) {
        return await res.json();
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Checks the serverless /api/health status
   */
  public async checkApiHealth(): Promise<{ status: string; ltaKeyConfigured: boolean } | null> {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        return await res.json();
      }
      return null;
    } catch {
      return null;
    }
  }

  public getTrafficCondition(): TrafficCondition {
    return this.currentTraffic;
  }

  public setTrafficCondition(mode: 'smooth' | 'normal' | 'peak' | 'rain'): void {
    this.currentTraffic = TRAFFIC_CONDITIONS[mode] || TRAFFIC_CONDITIONS.normal;
    try {
      localStorage.setItem('sg_bus_traffic_mode', mode);
    } catch {
      // Ignore
    }
  }

  private initFleet(): void {
    this.vehicles = [];

    // Deploy multiple buses per service along their route sequences
    POPULAR_BUS_SERVICES.forEach((service) => {
      const stops = service.stops;
      if (stops.length < 2) return;

      // Deploy 2 to 3 active vehicles per service spaced out
      const fleetCount = service.category === 'Trunk' ? 3 : 2;

      for (let i = 0; i < fleetCount; i++) {
        // Distribute vehicles at different stops along route
        const stopIndex = Math.min(Math.floor((i * (stops.length - 1)) / fleetCount), stops.length - 2);
        const fromStop = stops[stopIndex];
        const toStop = stops[stopIndex + 1];

        // Random fractional progress between stops
        const progress = 0.2 + (i * 0.3) % 0.8;
        const lat = fromStop.coordinates[0] + (toStop.coordinates[0] - fromStop.coordinates[0]) * progress;
        const lng = fromStop.coordinates[1] + (toStop.coordinates[1] - fromStop.coordinates[1]) * progress;

        // Bearing calculation
        const bearing = this.calculateBearing(fromStop.coordinates[0], fromStop.coordinates[1], toStop.coordinates[0], toStop.coordinates[1]);

        // Deck types: Double Deck (DD) common for heavy trunks 14, 65, 190, 147; Bendy (BD) for 857, 960
        let deckType: BusType = 'SD';
        if (['190', '65', '14', '147', '166', '10'].includes(service.serviceNo)) {
          deckType = i % 2 === 0 ? 'DD' : 'SD';
        } else if (['857', '960'].includes(service.serviceNo)) {
          deckType = i === 1 ? 'BD' : 'DD';
        }

        // Crowding levels: variation across fleet
        const loads: CrowdingLevel[] = ['SEA', 'SDA', 'LSD'];
        const load = loads[(i + service.stops.length) % 3];

        const remainingDist = (1 - progress) * Math.max(0.6, toStop.distanceKm - fromStop.distanceKm);
        const speed = Math.max(22, Math.round(35 / this.currentTraffic.multiplier));
        const secondsToNext = Math.round((remainingDist / (speed || 30)) * 3600);

        this.vehicles.push({
          id: `${service.serviceNo}-${i + 1}`,
          serviceNo: service.serviceNo,
          operator: service.operator,
          type: deckType,
          load,
          feature: 'WAB',
          latitude: lat,
          longitude: lng,
          bearing,
          speedKmh: speed,
          nextStopCode: toStop.stopCode,
          nextStopName: toStop.stopName,
          currentRouteIndex: stopIndex,
          direction: 1,
          secondsToNextStop: Math.max(15, secondsToNext)
        });
      }
    });
  }

  private startLiveClock(): void {
    setInterval(() => {
      this.tick();
    }, 1000);
  }

  private tick(): void {
    const now = Date.now();
    const elapsedSeconds = (now - this.lastUpdateTimestamp) / 1000;
    this.lastUpdateTimestamp = now;

    // Advance all vehicles
    this.vehicles.forEach((vehicle) => {
      const service = POPULAR_BUS_SERVICES.find((s) => s.serviceNo === vehicle.serviceNo);
      if (!service || service.stops.length < 2) return;

      const stops = service.stops;
      let currentIndex = vehicle.currentRouteIndex;

      vehicle.secondsToNextStop -= elapsedSeconds;

      // When bus reaches the stop, advance to next segment
      if (vehicle.secondsToNextStop <= 0) {
        currentIndex++;
        if (currentIndex >= stops.length - 1) {
          // Loop back to start or reverse
          currentIndex = 0;
        }
        vehicle.currentRouteIndex = currentIndex;

        const nextStop = stops[currentIndex + 1];
        const currentStop = stops[currentIndex];
        vehicle.nextStopCode = nextStop.stopCode;
        vehicle.nextStopName = nextStop.stopName;

        const dist = Math.max(0.6, nextStop.distanceKm - currentStop.distanceKm);
        const speed = Math.max(18, Math.round(32 / this.currentTraffic.multiplier));
        vehicle.speedKmh = speed;
        vehicle.secondsToNextStop = Math.round((dist / speed) * 3600);

        // Adjust crowding realistically when reaching a busy MRT stop
        if (['10018', '08057', '01112', '07211'].includes(nextStop.stopCode)) {
          vehicle.load = vehicle.load === 'SEA' ? 'SDA' : 'LSD';
        } else if (Math.random() > 0.7) {
          const loads: CrowdingLevel[] = ['SEA', 'SDA', 'LSD'];
          vehicle.load = loads[Math.floor(Math.random() * loads.length)];
        }
      }

      // Smooth coordinate interpolation between stops[currentIndex] and stops[currentIndex + 1]
      const from = stops[currentIndex];
      const to = stops[currentIndex + 1];
      if (from && to) {
        const segDist = Math.max(0.6, to.distanceKm - from.distanceKm);
        const speed = vehicle.speedKmh || 30;
        const totalSegSeconds = Math.max(20, Math.round((segDist / speed) * 3600));
        const progress = Math.min(0.99, Math.max(0.01, 1 - (vehicle.secondsToNextStop / totalSegSeconds)));

        vehicle.latitude = from.coordinates[0] + (to.coordinates[0] - from.coordinates[0]) * progress;
        vehicle.longitude = from.coordinates[1] + (to.coordinates[1] - from.coordinates[1]) * progress;
        vehicle.bearing = this.calculateBearing(from.coordinates[0], from.coordinates[1], to.coordinates[0], to.coordinates[1]);
      }
    });

    // Notify listeners
    this.notifySubscribers();
  }

  private calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const y = Math.sin((lon2 - lon1) * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180));
    const x =
      Math.cos(lat1 * (Math.PI / 180)) * Math.sin(lat2 * (Math.PI / 180)) -
      Math.sin(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.cos((lon2 - lon1) * (Math.PI / 180));
    const brng = (Math.atan2(y, x) * 180) / Math.PI;
    return (brng + 360) % 360;
  }

  public subscribe(cb: (vehicles: LiveBusVehicle[]) => void): () => void {
    this.subscribers.push(cb);
    cb(this.vehicles);
    return () => {
      this.subscribers = this.subscribers.filter((s) => s !== cb);
    };
  }

  private notifySubscribers(): void {
    this.subscribers.forEach((cb) => cb([...this.vehicles]));
  }

  public getVehicles(): LiveBusVehicle[] {
    return this.vehicles;
  }

  /**
   * Get arrivals for a specific bus stop code
   */
  public getArrivalsForStop(stopCode: string): BusServiceArrival[] {
    const stop = SINGAPORE_BUS_STOPS.find((s) => s.code === stopCode);
    if (!stop) return [];

    const arrivals: BusServiceArrival[] = [];

    stop.services.forEach((serviceNo) => {
      const service = POPULAR_BUS_SERVICES.find((s) => s.serviceNo === serviceNo);
      const operator: Operator = service ? service.operator : 'SBST';

      // Find active vehicles on this service heading towards this stop
      let nextBus: BusArrivalInfo | null = null;
      let nextBus2: BusArrivalInfo | null = null;
      let nextBus3: BusArrivalInfo | null = null;

      if (service) {
        const stopIndexInRoute = service.stops.findIndex((s) => s.stopCode === stopCode);

        if (stopIndexInRoute !== -1) {
          // Calculate seconds to this stop for each vehicle on this service
          const routeVehicles = this.vehicles.filter((v) => v.serviceNo === serviceNo);

          const candidateArrivals: { seconds: number; vehicle: LiveBusVehicle }[] = [];

          routeVehicles.forEach((vehicle) => {
            if (vehicle.currentRouteIndex <= stopIndexInRoute) {
              // It is upstream of this stop
              let totalSeconds = vehicle.secondsToNextStop;
              for (let i = vehicle.currentRouteIndex + 1; i < stopIndexInRoute; i++) {
                const s1 = service.stops[i];
                const s2 = service.stops[i + 1];
                const dist = Math.max(0.6, s2.distanceKm - s1.distanceKm);
                const segSec = Math.round((dist / (vehicle.speedKmh || 30)) * 3600);
                totalSeconds += segSec + 25; // 25s average stop dwell
              }
              candidateArrivals.push({ seconds: Math.max(5, Math.round(totalSeconds)), vehicle });
            } else {
              // Has passed this stop, will arrive on next loop
              const fullLoopSeconds = 45 * 60; // 45 min loop
              candidateArrivals.push({
                seconds: fullLoopSeconds - (vehicle.currentRouteIndex - stopIndexInRoute) * 180,
                vehicle
              });
            }
          });

          // Sort ascending by arrival time
          candidateArrivals.sort((a, b) => a.seconds - b.seconds);

          if (candidateArrivals[0]) {
            const item = candidateArrivals[0];
            const dist = this.haversineDistance(
              item.vehicle.latitude,
              item.vehicle.longitude,
              stop.latitude,
              stop.longitude
            );
            nextBus = {
              busNumber: serviceNo,
              load: item.vehicle.load,
              type: item.vehicle.type,
              feature: item.vehicle.feature,
              estimatedArrival: this.formatArrivalEstimate(item.seconds),
              secondsUntilArrival: item.seconds,
              latitude: item.vehicle.latitude,
              longitude: item.vehicle.longitude,
              distanceKm: Math.round(dist * 10) / 10,
              speedKmh: item.vehicle.speedKmh
            };
          }

          if (candidateArrivals[1]) {
            const item = candidateArrivals[1];
            nextBus2 = {
              busNumber: serviceNo,
              load: item.vehicle.load,
              type: item.vehicle.type,
              feature: item.vehicle.feature,
              estimatedArrival: this.formatArrivalEstimate(item.seconds),
              secondsUntilArrival: item.seconds,
              latitude: item.vehicle.latitude,
              longitude: item.vehicle.longitude
            };
          }

          if (candidateArrivals[2]) {
            const item = candidateArrivals[2];
            nextBus3 = {
              busNumber: serviceNo,
              load: item.vehicle.load,
              type: item.vehicle.type,
              feature: item.vehicle.feature,
              estimatedArrival: this.formatArrivalEstimate(item.seconds),
              secondsUntilArrival: item.seconds
            };
          }
        }
      }

      // If simulated service didn't have active vehicle or is a secondary trunk service, synthesize realistic LTA arrivals
      if (!nextBus) {
        const hash = this.stringToHash(serviceNo + stopCode);
        const sec1 = (hash % 10) * 60 + 45;
        const sec2 = sec1 + ((hash >> 2) % 8 + 6) * 60;
        const sec3 = sec2 + 720;

        nextBus = {
          busNumber: serviceNo,
          load: (['SEA', 'SDA', 'LSD'] as CrowdingLevel[])[hash % 3],
          type: (['SD', 'DD', 'SD'] as BusType[])[(hash >> 1) % 3],
          feature: 'WAB',
          estimatedArrival: this.formatArrivalEstimate(sec1),
          secondsUntilArrival: sec1
        };

        nextBus2 = {
          busNumber: serviceNo,
          load: (['SEA', 'SDA'] as CrowdingLevel[])[(hash >> 2) % 2],
          type: (['SD', 'DD'] as BusType[])[hash % 2],
          feature: 'WAB',
          estimatedArrival: this.formatArrivalEstimate(sec2),
          secondsUntilArrival: sec2
        };

        nextBus3 = {
          busNumber: serviceNo,
          load: 'SEA',
          type: 'SD',
          feature: 'WAB',
          estimatedArrival: this.formatArrivalEstimate(sec3),
          secondsUntilArrival: sec3
        };
      }

      arrivals.push({
        serviceNo,
        operator,
        nextBus,
        nextBus2,
        nextBus3
      });
    });

    // Sort: arrivals with buses arriving earliest first
    arrivals.sort((a, b) => {
      const aSec = a.nextBus?.secondsUntilArrival ?? 99999;
      const bSec = b.nextBus?.secondsUntilArrival ?? 99999;
      return aSec - bSec;
    });

    return arrivals;
  }

  public formatArrivalEstimate(seconds: number): string {
    if (seconds <= 45) return 'Arr';
    const mins = Math.floor(seconds / 60);
    return `${mins}m`;
  }

  public formatCountdownFull(seconds: number): string {
    if (seconds <= 45) return 'Arriving';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  }

  private stringToHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  public haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  public findNearestStops(userLat: number, userLng: number, limit = 8): { stop: BusStop; distanceMeters: number; walkingMins: number }[] {
    return SINGAPORE_BUS_STOPS.map((stop) => {
      const distKm = this.haversineDistance(userLat, userLng, stop.latitude, stop.longitude);
      const meters = Math.round(distKm * 1000);
      const walkingMins = Math.max(1, Math.round(meters / 80)); // 80 meters/min average walking
      return { stop, distanceMeters: meters, walkingMins };
    })
      .sort((a, b) => a.distanceMeters - b.distanceMeters)
      .slice(0, limit);
  }
}

export const busEngine = new BusSimulationEngine();
