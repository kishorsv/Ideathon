export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type IncidentStatus = 'PENDING' | 'ASSIGNED' | 'DISPATCHED' | 'EN_ROUTE' | 'ON_SCENE' | 'TRANSPORTING' | 'RESOLVED' | 'EXPIRED';

export type IncidentCategory = 
  | 'TRAUMA_ACCIDENT'
  | 'CARDIAC_ARREST'
  | 'RESPIRATORY_DISTRESS'
  | 'FIRE_HAZARD'
  | 'OBSTETRIC_EMERGENCY'
  | 'MASS_CASUALTY'
  | 'STROKE'
  | 'GENERAL_MEDICAL';

export type AmbulanceType = 'ALS' | 'BLS' | 'NEO_NATAL' | 'FIRST_RESPONDER_BIKE';

export type AmbulanceStatus = 'AVAILABLE' | 'EN_ROUTE' | 'AT_SCENE' | 'TRANSPORTING' | 'MAINTENANCE';

export type UserRole = 'COMMANDER' | 'DISPATCHER' | 'DOCTOR' | 'PARAMEDIC' | 'CITIZEN';

export interface Vitals {
  heartRate?: number;
  bloodPressure?: string;
  spO2?: number;
  respiratoryRate?: number;
  gcs?: number; // Glasgow Coma Scale (3-15)
  temperature?: number;
}

export interface IncidentTimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  actor: string;
  type: 'CREATED' | 'TRIAGED' | 'ASSIGNED' | 'DISPATCHED' | 'ARRIVED' | 'VITALS_UPDATE' | 'HOSPITAL_ASSIGNED' | 'RESOLVED';
}

export interface Incident {
  id: string;
  createdAtTimestamp: number;
  expiresAtTimestamp: number; // 5 minutes expiration for unaccepted broadcasts
  callerPhone: string;
  callerName: string;
  locationName: string;
  area: string;
  lat: number;
  lng: number;
  accuracyRadiusM?: number;
  category: IncidentCategory;
  priority: PriorityLevel;
  status: IncidentStatus;
  reportedAt: string;
  callDurationSeconds: number;
  patientCount: number;
  aiTriageSummary: string;
  callerTranscriptSnippet: string;
  assignedAmbulanceId?: string;
  assignedHospitalId?: string;
  etaMinutes?: number;
  vitals?: Vitals;
  timeline: IncidentTimelineEvent[];
  isDemo?: boolean;
}

export interface Ambulance {
  id: string;
  callSign: string;
  registrationNumber: string;
  vehicleType: AmbulanceType;
  status: AmbulanceStatus;
  driverName: string;
  driverPhone: string;
  paramedicName: string;
  lat: number;
  lng: number;
  speedKmH: number;
  heading: number;
  fuelPct: number;
  oxygenCylinderPct: number;
  defibrillatorReady: boolean;
  baseStation: string;
  assignedIncidentId?: string;
  destinationHospitalId?: string;
}

export interface Hospital {
  id: string;
  name: string;
  shortName: string;
  type: 'GOVERNMENT' | 'PRIVATE' | 'SPECIALTY';
  area: string;
  lat: number;
  lng: number;
  emergencyPhone: string;
  totalBeds: number;
  icuBedsAvailable: number;
  totalIcuBeds: number;
  ventilatorsAvailable: number;
  totalVentilators: number;
  oxygenCapacityPct: number;
  traumaSurgeonsOnDuty: number;
  bloodBankAvailable: boolean;
  bloodStockLevels: {
    oPos: number; // units
    oNeg: number;
    aPos: number;
    bPos: number;
    abPos: number;
  };
  burnUnitReady: boolean;
  cathLabReady: boolean;
  strokeUnitReady: boolean;
  pediatricIcuReady: boolean;
  intakeAccepting: boolean;
  currentWaitTimeMinutes: number;
  lastVerifiedMinutesAgo: number;
  rating: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department: string;
  badgeNumber?: string;
  phone: string;
  avatarUrl?: string;
  hospitalAffiliationId?: string;
  ambulanceAssignedId?: string;
}

export interface DriverEmergencyNotification {
  id: string;
  incidentId: string;
  createdAtTimestamp: number;
  expiresAtTimestamp: number;
  locationName: string;
  lat: number;
  lng: number;
  callerPhone: string;
  callerName: string;
  category: IncidentCategory;
  priority: PriorityLevel;
  urgencyScore: number;
  distanceKmFromDriver?: number;
  isAccepted: boolean;
  acceptedByAmbulanceId?: string;
  acceptedByDriverName?: string;
  acceptedAt?: string;
}

export interface HospitalRecommendation {
  hospitalId: string;
  hospital: Hospital;
  roadDistanceKm: number;
  estimatedDriveTimeMins: number;
  matchScore: number; // 0 - 100
  verifiedStatus: 'VERIFIED_READY' | 'CAPACITY_LIMITED' | 'DIVERT_ACTIVE' | 'ESTIMATED_DATA';
  dataFreshness: string;
  trafficCondition: 'LIGHT' | 'MODERATE' | 'HEAVY';
  matchedCapabilities: string[];
  missingCapabilities: string[];
  rationale: string;
  routeAvailable: boolean;
}

export interface NavigationStep {
  instruction: string;
  distanceM: number;
  durationS: number;
}

export interface NavigationRoute {
  stage: 'TO_EMERGENCY' | 'TO_HOSPITAL';
  origin: { lat: number; lng: number; label: string };
  destination: { lat: number; lng: number; label: string };
  distanceKm: number;
  durationMins: number;
  trafficMultiplier: number;
  polyline: [number, number][];
  steps: NavigationStep[];
  lastUpdated: string;
  externalMapsUrl: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'ALERT' | 'INFO' | 'SUCCESS' | 'DISPATCH' | 'CRITICAL';
  timestamp: string;
  read: boolean;
  incidentId?: string;
  driverNotificationId?: string;
}

export interface AIAnalysisResult {
  sentiment: 'PANIC' | 'URGENT' | 'CALM';
  urgencyScore: number; // 0 to 100
  recommendedCategory: IncidentCategory;
  recommendedPriority: PriorityLevel;
  keyEntities: {
    casualties: number;
    symptoms: string[];
    hazards: string[];
    landmarksMentioned: string[];
  };
  recommendedActions: string[];
  recommendedHospitals: {
    hospitalId: string;
    hospitalName: string;
    distanceKm: number;
    etaMinutes: number;
    readinessScore: number;
    rationale: string;
  }[];
}
