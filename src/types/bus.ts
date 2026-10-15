export type CrowdingLevel = 'SEA' | 'SDA' | 'LSD'; // Seats Available, Standing Available, Limited Standing
export type BusType = 'SD' | 'DD' | 'BD'; // Single Deck, Double Deck, Bendy Bus
export type Operator = 'SBST' | 'SMRT' | 'TTS' | 'GAS'; // SBS Transit, SMRT, Tower Transit, Go-Ahead Singapore

export interface BusArrivalInfo {
  busNumber: string;
  load: CrowdingLevel;
  type: BusType;
  feature: 'WAB' | '';
  estimatedArrival: string; // ISO date string or relative text
  secondsUntilArrival: number; // For live precise countdown
  latitude?: number;
  longitude?: number;
  distanceKm?: number;
  speedKmh?: number;
}

export interface BusServiceArrival {
  serviceNo: string;
  operator: Operator;
  nextBus: BusArrivalInfo | null;
  nextBus2: BusArrivalInfo | null;
  nextBus3: BusArrivalInfo | null;
  isMonitored?: boolean;
}

export interface BusStop {
  code: string; // 5-digit code e.g. "01012"
  road: string; // e.g. "Victoria St"
  description: string; // e.g. "Hotel Grand Pacific"
  latitude: number;
  longitude: number;
  services: string[]; // Bus service numbers calling at this stop
  mrtInterchange?: string; // e.g. "Bugis (EW12/DT14)"
}

export interface BusRouteStop {
  stopCode: string;
  seq: number;
  distanceKm: number;
  stopName: string;
  roadName: string;
  coordinates: [number, number];
}

export interface BusService {
  serviceNo: string;
  operator: Operator;
  category: 'Trunk' | 'Feeder' | 'Express' | 'City Direct';
  origin: string;
  destination: string;
  direction: 1 | 2;
  firstBus: string; // e.g. "05:30"
  lastBus: string; // e.g. "23:45"
  frequencyPeak: string; // e.g. "4-7 mins"
  frequencyOffPeak: string; // e.g. "8-12 mins"
  stops: BusRouteStop[];
}

export interface LiveBusVehicle {
  id: string;
  serviceNo: string;
  operator: Operator;
  type: BusType;
  load: CrowdingLevel;
  feature: 'WAB';
  latitude: number;
  longitude: number;
  bearing: number; // 0 - 360 degrees
  speedKmh: number;
  nextStopCode: string;
  nextStopName: string;
  currentRouteIndex: number;
  direction: 1 | 2;
  secondsToNextStop: number;
}

export interface TrafficCondition {
  mode: 'normal' | 'peak' | 'rain' | 'smooth';
  label: string;
  multiplier: number;
  description: string;
}

export interface ArrivalAlarm {
  id: string;
  serviceNo: string;
  stopCode: string;
  stopName: string;
  triggerMinutes: number;
  triggered: boolean;
  createdAt: number;
}
