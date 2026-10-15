import { BusStop, BusService } from '../types/bus';

export const SINGAPORE_BUS_STOPS: BusStop[] = [
  // Orchard & Somerset Corridor
  {
    code: '10018',
    road: 'Orchard Turn',
    description: 'Opp Orchard Stn / ION Orchard',
    latitude: 1.3040,
    longitude: 103.8320,
    services: ['7', '14', '65', '106', '143', '174', '190', '972'],
    mrtInterchange: 'Orchard (NS22/TE14)'
  },
  {
    code: '09048',
    road: 'Orchard Rd',
    description: 'Somerset Stn / 313@Somerset',
    latitude: 1.3005,
    longitude: 103.8385,
    services: ['7', '14', '16', '65', '106', '123', '143', '174', '190', '857'],
    mrtInterchange: 'Somerset (NS23)'
  },
  {
    code: '09037',
    road: 'Orchard Rd',
    description: 'Opp Mandarin Orchard',
    latitude: 1.3021,
    longitude: 103.8354,
    services: ['7', '14', '65', '106', '123', '174', '190', '960'],
  },
  {
    code: '09022',
    road: 'Orchard Rd',
    description: 'Orchard Plaza',
    latitude: 1.3010,
    longitude: 103.8415,
    services: ['7', '14', '16', '36', '65', '106', '124', '174', '190'],
  },
  // Dhoby Ghaut Corridor
  {
    code: '08057',
    road: 'Orchard Rd',
    description: 'Dhoby Ghaut Stn / Plaza Singapura',
    latitude: 1.2994,
    longitude: 103.8452,
    services: ['7', '14', '16', '36', '65', '106', '124', '174', '190', '857'],
    mrtInterchange: 'Dhoby Ghaut (NS24/NE6/CC1)'
  },
  {
    code: '08031',
    road: 'Bras Basah Rd',
    description: 'Aft Bras Basah Stn Exit A',
    latitude: 1.2970,
    longitude: 103.8505,
    services: ['7', '14', '36', '106', '111', '131', '147', '166', '857'],
    mrtInterchange: 'Bras Basah (CC2)'
  },
  // Bugis & Bras Basah Corridor
  {
    code: '01012',
    road: 'Victoria St',
    description: 'Hotel Grand Pacific',
    latitude: 1.2982,
    longitude: 103.8530,
    services: ['2', '7', '12', '33', '130', '133', '147', '190'],
    mrtInterchange: 'Bugis (EW12/DT14)'
  },
  {
    code: '01112',
    road: 'Victoria St',
    description: 'Bugis Stn Exit B / Bugis Junction',
    latitude: 1.3006,
    longitude: 103.8559,
    services: ['2', '12', '33', '130', '133', '147', '190', '857', '960'],
    mrtInterchange: 'Bugis (EW12/DT14)'
  },
  {
    code: '01019',
    road: 'Victoria St',
    description: 'Opp Bugis Junction',
    latitude: 1.2995,
    longitude: 103.8548,
    services: ['2', '12', '33', '130', '147', '190', '960'],
    mrtInterchange: 'Bugis (EW12/DT14)'
  },
  // City Hall & Marina Bay / Suntec
  {
    code: '04168',
    road: 'North Bridge Rd',
    description: 'City Hall Stn Exit B / St Andrew\'s Cath',
    latitude: 1.2925,
    longitude: 103.8524,
    services: ['61', '124', '145', '166', '174', '190'],
    mrtInterchange: 'City Hall (NS25/EW13)'
  },
  {
    code: '02151',
    road: 'Temasek Blvd',
    description: 'Suntec City Mall',
    latitude: 1.2948,
    longitude: 103.8588,
    services: ['36', '70M', '97', '106', '111', '133', '857'],
    mrtInterchange: 'Promenade (CC4/DT15)'
  },
  {
    code: '03509',
    road: 'Bayfront Ave',
    description: 'Marina Bay Sands Hotel',
    latitude: 1.2838,
    longitude: 103.8590,
    services: ['97', '106', '133', '502', '518'],
    mrtInterchange: 'Bayfront (CE1/DT16)'
  },
  {
    code: '03011',
    road: 'Fullerton Rd',
    description: 'Fullerton Sq / Raffles Place MRT',
    latitude: 1.2862,
    longitude: 103.8528,
    services: ['10', '70', '100', '107', '130', '196'],
    mrtInterchange: 'Raffles Place (NS26/EW14)'
  },
  // Chinatown & Clarke Quay
  {
    code: '05019',
    road: 'New Bridge Rd',
    description: 'Chinatown Stn Exit E / People\'s Park Ctr',
    latitude: 1.2845,
    longitude: 103.8441,
    services: ['2', '12', '33', '54', '143', '147', '190'],
    mrtInterchange: 'Chinatown (NE4/DT19)'
  },
  {
    code: '04239',
    road: 'Eu Tong Sen St',
    description: 'Clarke Quay Stn / The Central',
    latitude: 1.2885,
    longitude: 103.8465,
    services: ['2', '12', '33', '54', '147', '190'],
    mrtInterchange: 'Clarke Quay (NE5)'
  },
  // Little India & Serangoon Corridor
  {
    code: '07211',
    road: 'Serangoon Rd',
    description: 'Little India Stn Exit E / Tekka Ctr',
    latitude: 1.3060,
    longitude: 103.8510,
    services: ['23', '64', '65', '66', '67', '131', '139', '147', '857'],
    mrtInterchange: 'Little India (NE7/DT12)'
  },
  {
    code: '07221',
    road: 'Serangoon Rd',
    description: 'Broadway Hotel / Sri Srinivasa Perumal',
    latitude: 1.3130,
    longitude: 103.8550,
    services: ['21', '23', '64', '65', '125', '130', '139', '147', '857'],
    mrtInterchange: 'Farrer Park (NE8)'
  },
  // HarbourFront & Southern Ridge
  {
    code: '14141',
    road: 'Telok Blangah Rd',
    description: 'HarbourFront Stn Exit B / VivoCity',
    latitude: 1.2655,
    longitude: 103.8218,
    services: ['10', '30', '57', '65', '97', '100', '131', '143', '166'],
    mrtInterchange: 'HarbourFront (NE1/CC29)'
  },
  // Jurong East & West
  {
    code: '28009',
    road: 'Jurong Gateway Rd',
    description: 'Jurong East Bus Interchange',
    latitude: 1.3335,
    longitude: 103.7425,
    services: ['51', '52', '66', '78', '98', '143', '160', '197', '334', '502'],
    mrtInterchange: 'Jurong East (NS1/EW24)'
  },
  {
    code: '28019',
    road: 'Jurong Gateway Rd',
    description: 'Opp Westgate / Jurong East Stn',
    latitude: 1.3345,
    longitude: 103.7436,
    services: ['51', '66', '78', '98', '143', '197', '334'],
    mrtInterchange: 'Jurong East (NS1/EW24)'
  },
  // Clementi
  {
    code: '17179',
    road: 'Clementi Ave 3',
    description: 'Clementi Bus Interchange / Mall',
    latitude: 1.3150,
    longitude: 103.7650,
    services: ['7', '14', '96', '99', '147', '156', '166', '175', '196', '282'],
    mrtInterchange: 'Clementi (EW23)'
  },
  // Bishan & Ang Mo Kio (Central North)
  {
    code: '54009',
    road: 'Bishan St 13',
    description: 'Bishan Bus Interchange / Junction 8',
    latitude: 1.3508,
    longitude: 103.8488,
    services: ['52', '53', '54', '55', '56', '57', '58', '59', '410G'],
    mrtInterchange: 'Bishan (NS17/CC15)'
  },
  {
    code: '55009',
    road: 'Ang Mo Kio Ave 8',
    description: 'Ang Mo Kio Bus Interchange / AMK Hub',
    latitude: 1.3695,
    longitude: 103.8495,
    services: ['22', '24', '25', '73', '86', '130', '133', '135', '166'],
    mrtInterchange: 'Ang Mo Kio (NS16)'
  },
  // Tampines & Bedok (East)
  {
    code: '75009',
    road: 'Tampines Ave 4',
    description: 'Tampines Bus Interchange',
    latitude: 1.3533,
    longitude: 103.9438,
    services: ['10', '19', '28', '29', '31', '37', '65', '67', '72'],
    mrtInterchange: 'Tampines (EW2/DT32)'
  },
  {
    code: '84009',
    road: 'Bedok North Ave 1',
    description: 'Bedok Bus Interchange / Mall',
    latitude: 1.3240,
    longitude: 103.9300,
    services: ['7', '14', '17', '26', '30', '32', '35', '40', '60', '87'],
    mrtInterchange: 'Bedok (EW5)'
  },
  // Woodlands (North)
  {
    code: '43009',
    road: 'Woodlands Sq',
    description: 'Woodlands Integrated Transport Hub',
    latitude: 1.4368,
    longitude: 103.7865,
    services: ['161', '168', '169', '187', '900', '901', '903', '960', '961'],
    mrtInterchange: 'Woodlands (NS9/TE2)'
  },
  // Changi Airport PTB
  {
    code: '95029',
    road: 'PTB2 Basement',
    description: 'Changi Airport PTB2',
    latitude: 1.3550,
    longitude: 103.9880,
    services: ['24', '27', '34', '36', '53', '110', '858'],
    mrtInterchange: 'Changi Airport (CG2)'
  }
];

export const POPULAR_BUS_SERVICES: BusService[] = [
  {
    serviceNo: '190',
    operator: 'SMRT',
    category: 'Trunk',
    origin: 'Choa Chu Kang Int',
    destination: 'New Bridge Rd Ter',
    direction: 1,
    firstBus: '05:45',
    lastBus: '23:45',
    frequencyPeak: '3-6 mins',
    frequencyOffPeak: '7-10 mins',
    stops: [
      { stopCode: '10018', seq: 18, distanceKm: 16.2, stopName: 'Opp Orchard Stn / ION', roadName: 'Orchard Turn', coordinates: [1.3040, 103.8320] },
      { stopCode: '09037', seq: 19, distanceKm: 16.8, stopName: 'Opp Mandarin Orchard', roadName: 'Orchard Rd', coordinates: [1.3021, 103.8354] },
      { stopCode: '09048', seq: 20, distanceKm: 17.5, stopName: 'Somerset Stn / 313', roadName: 'Orchard Rd', coordinates: [1.3005, 103.8385] },
      { stopCode: '09022', seq: 21, distanceKm: 18.1, stopName: 'Orchard Plaza', roadName: 'Orchard Rd', coordinates: [1.3010, 103.8415] },
      { stopCode: '08057', seq: 22, distanceKm: 18.9, stopName: 'Dhoby Ghaut Stn', roadName: 'Orchard Rd', coordinates: [1.2994, 103.8452] },
      { stopCode: '04168', seq: 23, distanceKm: 20.1, stopName: 'City Hall Stn Exit B', roadName: 'North Bridge Rd', coordinates: [1.2925, 103.8524] },
      { stopCode: '04239', seq: 24, distanceKm: 21.0, stopName: 'Clarke Quay Stn', roadName: 'Eu Tong Sen St', coordinates: [1.2885, 103.8465] },
      { stopCode: '05019', seq: 25, distanceKm: 21.8, stopName: 'Chinatown Stn Exit E', roadName: 'New Bridge Rd', coordinates: [1.2845, 103.8441] }
    ]
  },
  {
    serviceNo: '65',
    operator: 'SBST',
    category: 'Trunk',
    origin: 'Tampines Int',
    destination: 'HarbourFront Int',
    direction: 1,
    firstBus: '05:30',
    lastBus: '23:30',
    frequencyPeak: '4-7 mins',
    frequencyOffPeak: '8-12 mins',
    stops: [
      { stopCode: '75009', seq: 1, distanceKm: 0.0, stopName: 'Tampines Bus Interchange', roadName: 'Tampines Ave 4', coordinates: [1.3533, 103.9438] },
      { stopCode: '07221', seq: 19, distanceKm: 13.5, stopName: 'Broadway Hotel', roadName: 'Serangoon Rd', coordinates: [1.3130, 103.8550] },
      { stopCode: '07211', seq: 20, distanceKm: 14.4, stopName: 'Little India Stn Exit E', roadName: 'Serangoon Rd', coordinates: [1.3060, 103.8510] },
      { stopCode: '08057', seq: 22, distanceKm: 16.0, stopName: 'Dhoby Ghaut Stn', roadName: 'Orchard Rd', coordinates: [1.2994, 103.8452] },
      { stopCode: '09048', seq: 23, distanceKm: 16.8, stopName: 'Somerset Stn / 313', roadName: 'Orchard Rd', coordinates: [1.3005, 103.8385] },
      { stopCode: '10018', seq: 25, distanceKm: 18.0, stopName: 'Opp Orchard Stn / ION', roadName: 'Orchard Turn', coordinates: [1.3040, 103.8320] },
      { stopCode: '14141', seq: 35, distanceKm: 24.5, stopName: 'HarbourFront Stn Exit B', roadName: 'Telok Blangah Rd', coordinates: [1.2655, 103.8218] }
    ]
  },
  {
    serviceNo: '14',
    operator: 'SBST',
    category: 'Trunk',
    origin: 'Bedok Int',
    destination: 'Clementi Int',
    direction: 1,
    firstBus: '05:40',
    lastBus: '23:45',
    frequencyPeak: '5-8 mins',
    frequencyOffPeak: '8-12 mins',
    stops: [
      { stopCode: '84009', seq: 1, distanceKm: 0.0, stopName: 'Bedok Bus Interchange', roadName: 'Bedok North Ave 1', coordinates: [1.3240, 103.9300] },
      { stopCode: '08031', seq: 18, distanceKm: 13.2, stopName: 'Aft Bras Basah Stn Exit A', roadName: 'Bras Basah Rd', coordinates: [1.2970, 103.8505] },
      { stopCode: '08057', seq: 19, distanceKm: 14.0, stopName: 'Dhoby Ghaut Stn', roadName: 'Orchard Rd', coordinates: [1.2994, 103.8452] },
      { stopCode: '09048', seq: 20, distanceKm: 14.8, stopName: 'Somerset Stn / 313', roadName: 'Orchard Rd', coordinates: [1.3005, 103.8385] },
      { stopCode: '10018', seq: 22, distanceKm: 15.9, stopName: 'Opp Orchard Stn / ION', roadName: 'Orchard Turn', coordinates: [1.3040, 103.8320] },
      { stopCode: '17179', seq: 34, distanceKm: 26.2, stopName: 'Clementi Bus Interchange', roadName: 'Clementi Ave 3', coordinates: [1.3150, 103.7650] }
    ]
  },
  {
    serviceNo: '7',
    operator: 'SBST',
    category: 'Trunk',
    origin: 'Bedok Int',
    destination: 'Clementi Int',
    direction: 1,
    firstBus: '05:30',
    lastBus: '23:30',
    frequencyPeak: '4-7 mins',
    frequencyOffPeak: '8-11 mins',
    stops: [
      { stopCode: '84009', seq: 1, distanceKm: 0.0, stopName: 'Bedok Bus Interchange', roadName: 'Bedok North Ave 1', coordinates: [1.3240, 103.9300] },
      { stopCode: '01012', seq: 14, distanceKm: 11.5, stopName: 'Hotel Grand Pacific', roadName: 'Victoria St', coordinates: [1.2982, 103.8530] },
      { stopCode: '08031', seq: 15, distanceKm: 12.1, stopName: 'Aft Bras Basah Stn Exit A', roadName: 'Bras Basah Rd', coordinates: [1.2970, 103.8505] },
      { stopCode: '08057', seq: 16, distanceKm: 12.9, stopName: 'Dhoby Ghaut Stn', roadName: 'Orchard Rd', coordinates: [1.2994, 103.8452] },
      { stopCode: '09048', seq: 17, distanceKm: 13.7, stopName: 'Somerset Stn / 313', roadName: 'Orchard Rd', coordinates: [1.3005, 103.8385] },
      { stopCode: '10018', seq: 19, distanceKm: 14.8, stopName: 'Opp Orchard Stn / ION', roadName: 'Orchard Turn', coordinates: [1.3040, 103.8320] },
      { stopCode: '17179', seq: 32, distanceKm: 24.8, stopName: 'Clementi Bus Interchange', roadName: 'Clementi Ave 3', coordinates: [1.3150, 103.7650] }
    ]
  },
  {
    serviceNo: '36',
    operator: 'GAS',
    category: 'Express',
    origin: 'Changi Airport PTB2',
    destination: 'Tomlinson Rd (Loop)',
    direction: 1,
    firstBus: '06:00',
    lastBus: '23:58',
    frequencyPeak: '6-9 mins',
    frequencyOffPeak: '10-14 mins',
    stops: [
      { stopCode: '95029', seq: 1, distanceKm: 0.0, stopName: 'Changi Airport PTB2', roadName: 'PTB2 Basement', coordinates: [1.3550, 103.9880] },
      { stopCode: '02151', seq: 18, distanceKm: 19.8, stopName: 'Suntec City Mall', roadName: 'Temasek Blvd', coordinates: [1.2948, 103.8588] },
      { stopCode: '08031', seq: 20, distanceKm: 21.2, stopName: 'Aft Bras Basah Stn Exit A', roadName: 'Bras Basah Rd', coordinates: [1.2970, 103.8505] },
      { stopCode: '08057', seq: 21, distanceKm: 22.0, stopName: 'Dhoby Ghaut Stn', roadName: 'Orchard Rd', coordinates: [1.2994, 103.8452] },
      { stopCode: '09022', seq: 22, distanceKm: 22.6, stopName: 'Orchard Plaza', roadName: 'Orchard Rd', coordinates: [1.3010, 103.8415] },
      { stopCode: '09048', seq: 23, distanceKm: 23.2, stopName: 'Somerset Stn / 313', roadName: 'Orchard Rd', coordinates: [1.3005, 103.8385] }
    ]
  },
  {
    serviceNo: '857',
    operator: 'TTS',
    category: 'Trunk',
    origin: 'Yishun Int',
    destination: 'Suntec City (Loop)',
    direction: 1,
    firstBus: '05:30',
    lastBus: '23:30',
    frequencyPeak: '4-7 mins',
    frequencyOffPeak: '7-12 mins',
    stops: [
      { stopCode: '07221', seq: 15, distanceKm: 16.5, stopName: 'Broadway Hotel', roadName: 'Serangoon Rd', coordinates: [1.3130, 103.8550] },
      { stopCode: '07211', seq: 16, distanceKm: 17.3, stopName: 'Little India Stn Exit E', roadName: 'Serangoon Rd', coordinates: [1.3060, 103.8510] },
      { stopCode: '08057', seq: 18, distanceKm: 18.8, stopName: 'Dhoby Ghaut Stn', roadName: 'Orchard Rd', coordinates: [1.2994, 103.8452] },
      { stopCode: '09048', seq: 19, distanceKm: 19.6, stopName: 'Somerset Stn / 313', roadName: 'Orchard Rd', coordinates: [1.3005, 103.8385] },
      { stopCode: '02151', seq: 24, distanceKm: 23.5, stopName: 'Suntec City Mall', roadName: 'Temasek Blvd', coordinates: [1.2948, 103.8588] },
      { stopCode: '01112', seq: 25, distanceKm: 24.3, stopName: 'Bugis Stn Exit B', roadName: 'Victoria St', coordinates: [1.3006, 103.8559] }
    ]
  },
  {
    serviceNo: '960',
    operator: 'SMRT',
    category: 'Trunk',
    origin: 'Woodlands Int',
    destination: 'Marina Ctr Ter',
    direction: 1,
    firstBus: '05:30',
    lastBus: '23:30',
    frequencyPeak: '5-9 mins',
    frequencyOffPeak: '9-14 mins',
    stops: [
      { stopCode: '43009', seq: 1, distanceKm: 0.0, stopName: 'Woodlands Integrated Transport Hub', roadName: 'Woodlands Sq', coordinates: [1.4368, 103.7865] },
      { stopCode: '07211', seq: 25, distanceKm: 23.0, stopName: 'Little India Stn Exit E', roadName: 'Serangoon Rd', coordinates: [1.3060, 103.8510] },
      { stopCode: '01112', seq: 27, distanceKm: 24.5, stopName: 'Bugis Stn Exit B', roadName: 'Victoria St', coordinates: [1.3006, 103.8559] },
      { stopCode: '01019', seq: 28, distanceKm: 25.0, stopName: 'Opp Bugis Junction', roadName: 'Victoria St', coordinates: [1.2995, 103.8548] },
      { stopCode: '02151', seq: 30, distanceKm: 26.5, stopName: 'Suntec City Mall', roadName: 'Temasek Blvd', coordinates: [1.2948, 103.8588] }
    ]
  },
  {
    serviceNo: '147',
    operator: 'SBST',
    category: 'Trunk',
    origin: 'Hougang Ctrl Int',
    destination: 'Clementi Int',
    direction: 1,
    firstBus: '05:30',
    lastBus: '23:45',
    frequencyPeak: '4-7 mins',
    frequencyOffPeak: '7-11 mins',
    stops: [
      { stopCode: '07221', seq: 16, distanceKm: 12.0, stopName: 'Broadway Hotel', roadName: 'Serangoon Rd', coordinates: [1.3130, 103.8550] },
      { stopCode: '07211', seq: 17, distanceKm: 12.8, stopName: 'Little India Stn Exit E', roadName: 'Serangoon Rd', coordinates: [1.3060, 103.8510] },
      { stopCode: '01012', seq: 19, distanceKm: 14.0, stopName: 'Hotel Grand Pacific', roadName: 'Victoria St', coordinates: [1.2982, 103.8530] },
      { stopCode: '08031', seq: 20, distanceKm: 14.6, stopName: 'Aft Bras Basah Stn Exit A', roadName: 'Bras Basah Rd', coordinates: [1.2970, 103.8505] },
      { stopCode: '04239', seq: 22, distanceKm: 16.2, stopName: 'Clarke Quay Stn', roadName: 'Eu Tong Sen St', coordinates: [1.2885, 103.8465] },
      { stopCode: '05019', seq: 23, distanceKm: 17.0, stopName: 'Chinatown Stn Exit E', roadName: 'New Bridge Rd', coordinates: [1.2845, 103.8441] },
      { stopCode: '17179', seq: 36, distanceKm: 28.5, stopName: 'Clementi Bus Interchange', roadName: 'Clementi Ave 3', coordinates: [1.3150, 103.7650] }
    ]
  },
  {
    serviceNo: '166',
    operator: 'SBST',
    category: 'Trunk',
    origin: 'Ang Mo Kio Int',
    destination: 'Clementi Int',
    direction: 1,
    firstBus: '05:30',
    lastBus: '23:30',
    frequencyPeak: '5-9 mins',
    frequencyOffPeak: '9-13 mins',
    stops: [
      { stopCode: '55009', seq: 1, distanceKm: 0.0, stopName: 'Ang Mo Kio Bus Interchange', roadName: 'Ang Mo Kio Ave 8', coordinates: [1.3695, 103.8495] },
      { stopCode: '08031', seq: 22, distanceKm: 14.8, stopName: 'Aft Bras Basah Stn Exit A', roadName: 'Bras Basah Rd', coordinates: [1.2970, 103.8505] },
      { stopCode: '04168', seq: 23, distanceKm: 15.6, stopName: 'City Hall Stn Exit B', roadName: 'North Bridge Rd', coordinates: [1.2925, 103.8524] },
      { stopCode: '14141', seq: 32, distanceKm: 22.0, stopName: 'HarbourFront Stn Exit B', roadName: 'Telok Blangah Rd', coordinates: [1.2655, 103.8218] },
      { stopCode: '17179', seq: 42, distanceKm: 31.0, stopName: 'Clementi Bus Interchange', roadName: 'Clementi Ave 3', coordinates: [1.3150, 103.7650] }
    ]
  },
  {
    serviceNo: '10',
    operator: 'SBST',
    category: 'Trunk',
    origin: 'Tampines Int',
    destination: 'Kent Ridge Ter',
    direction: 1,
    firstBus: '05:30',
    lastBus: '23:30',
    frequencyPeak: '4-8 mins',
    frequencyOffPeak: '8-12 mins',
    stops: [
      { stopCode: '75009', seq: 1, distanceKm: 0.0, stopName: 'Tampines Bus Interchange', roadName: 'Tampines Ave 4', coordinates: [1.3533, 103.9438] },
      { stopCode: '03011', seq: 26, distanceKm: 18.5, stopName: 'Fullerton Sq / Raffles Place', roadName: 'Fullerton Rd', coordinates: [1.2862, 103.8528] },
      { stopCode: '14141', seq: 35, distanceKm: 24.2, stopName: 'HarbourFront Stn Exit B', roadName: 'Telok Blangah Rd', coordinates: [1.2655, 103.8218] }
    ]
  }
];

export const OPERATOR_LABELS: Record<string, { name: string; color: string; badge: string }> = {
  SBST: { name: 'SBS Transit', color: '#6366f1', badge: 'bg-indigo-950 text-indigo-300 border-indigo-800' },
  SMRT: { name: 'SMRT Buses', color: '#ef4444', badge: 'bg-rose-950 text-rose-300 border-rose-800' },
  TTS: { name: 'Tower Transit', color: '#10b981', badge: 'bg-emerald-950 text-emerald-300 border-emerald-800' },
  GAS: { name: 'Go-Ahead SG', color: '#f59e0b', badge: 'bg-amber-950 text-amber-300 border-amber-800' }
};

export const CROWDING_CONFIG = {
  SEA: {
    label: 'Seats Available',
    short: 'Seats',
    color: 'emerald',
    badgeClass: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/80',
    barClass: 'bg-emerald-500',
    pctRange: '0% - 60% load'
  },
  SDA: {
    label: 'Standing Available',
    short: 'Standing',
    color: 'amber',
    badgeClass: 'text-amber-400 bg-amber-950/60 border-amber-800/80',
    barClass: 'bg-amber-500',
    pctRange: '60% - 90% load'
  },
  LSD: {
    label: 'Limited Standing',
    short: 'Packed',
    color: 'rose',
    badgeClass: 'text-rose-400 bg-rose-950/60 border-rose-800/80',
    barClass: 'bg-rose-500',
    pctRange: '90% - 100% load'
  }
};
