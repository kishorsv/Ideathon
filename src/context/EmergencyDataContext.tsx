import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Incident, 
  Ambulance, 
  Hospital, 
  SystemNotification, 
  IncidentStatus, 
  PriorityLevel, 
  IncidentCategory,
  Vitals,
  AIAnalysisResult,
  DriverEmergencyNotification,
  HospitalRecommendation,
  NavigationRoute 
} from '../types';
import { 
  INITIAL_INCIDENTS, 
  INITIAL_AMBULANCES, 
  INITIAL_HOSPITALS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_DRIVER_NOTIFICATIONS 
} from '../services/mockData';
import { calculateRoadRoute, calculateHaversineKm } from '../services/routingService';
import { rankHospitalsForEmergency } from '../services/hospitalMatcher';

interface EmergencyDataContextType {
  incidents: Incident[];
  ambulances: Ambulance[];
  hospitals: Hospital[];
  notifications: SystemNotification[];
  driverNotifications: DriverEmergencyNotification[];
  selectedIncidentId: string | null;
  selectedAmbulanceId: string | null;
  selectedHospitalId: string | null;
  activeNavigationRoute: NavigationRoute | null;
  connectionStatus: 'ONLINE' | 'RECONNECTING' | 'SYNCING';
  latencyMs: number;
  lastUpdated: string;
  isSimulatingCalls: boolean;
  soundEnabled: boolean;
  
  // Actions
  setSelectedIncidentId: (id: string | null) => void;
  setSelectedAmbulanceId: (id: string | null) => void;
  setSelectedHospitalId: (id: string | null) => void;
  setActiveNavigationRoute: (route: NavigationRoute | null) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setIsSimulatingCalls: (val: boolean | ((prev: boolean) => boolean)) => void;
  
  // Core Workflows
  createEmergencyRequest: (params: {
    callerName?: string;
    callerPhone?: string;
    locationName?: string;
    lat: number;
    lng: number;
    accuracyRadiusM?: number;
    category?: IncidentCategory;
    priority?: PriorityLevel;
    description?: string;
  }) => Promise<{ success: boolean; incident?: Incident; error?: string }>;

  createIncident: (params: {
    callerName?: string;
    callerPhone?: string;
    locationName?: string;
    area?: string;
    category?: IncidentCategory;
    priority?: PriorityLevel;
    patientCount?: number;
    description?: string;
    lat?: number;
    lng?: number;
  }) => void;

  acceptDriverEmergency: (
    notificationId: string, 
    ambulanceId?: string, 
    driverName?: string
  ) => { success: boolean; error?: string; incident?: Incident; route?: NavigationRoute };

  getHospitalRecommendationsForIncident: (incidentId: string) => HospitalRecommendation[];
  
  selectHospitalAndGenerateRoute: (
    incidentId: string, 
    hospitalId: string
  ) => { success: boolean; route?: NavigationRoute };

  generateDriverNavigationRoute: (
    incidentId: string,
    stage: 'TO_EMERGENCY' | 'TO_HOSPITAL',
    customHospitalId?: string
  ) => NavigationRoute | null;

  dispatchAmbulance: (incidentId: string, ambulanceId: string) => void;
  assignHospital: (incidentId: string, hospitalId: string) => void;
  updateIncidentStatus: (incidentId: string, status: IncidentStatus) => void;
  updateVitals: (incidentId: string, vitals: Partial<Vitals>) => void;
  updateHospitalCapacity: (hospitalId: string, changes: Partial<Hospital>) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  
  analyzeEmergencySpeechOrText: (text: string) => AIAnalysisResult;
  triggerMockEmergencyCall: () => Incident;
}

const EmergencyDataContext = createContext<EmergencyDataContextType | undefined>(undefined);

const INCIDENTS_STORAGE = 'mysuru_em_incidents_v2';
const AMBULANCES_STORAGE = 'mysuru_em_ambulances_v2';
const HOSPITALS_STORAGE = 'mysuru_em_hospitals_v2';
const DRIVER_NOTIFS_STORAGE = 'mysuru_em_driver_notifs_v2';

export const EmergencyDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [incidents, setIncidents] = useState<Incident[]>(() => {
    try {
      const stored = localStorage.getItem(INCIDENTS_STORAGE);
      return stored ? JSON.parse(stored) : INITIAL_INCIDENTS;
    } catch {
      return INITIAL_INCIDENTS;
    }
  });

  const [ambulances, setAmbulances] = useState<Ambulance[]>(() => {
    try {
      const stored = localStorage.getItem(AMBULANCES_STORAGE);
      return stored ? JSON.parse(stored) : INITIAL_AMBULANCES;
    } catch {
      return INITIAL_AMBULANCES;
    }
  });

  const [hospitals, setHospitals] = useState<Hospital[]>(() => {
    try {
      const stored = localStorage.getItem(HOSPITALS_STORAGE);
      return stored ? JSON.parse(stored) : INITIAL_HOSPITALS;
    } catch {
      return INITIAL_HOSPITALS;
    }
  });

  const [driverNotifications, setDriverNotifications] = useState<DriverEmergencyNotification[]>(() => {
    try {
      const stored = localStorage.getItem(DRIVER_NOTIFS_STORAGE);
      return stored ? JSON.parse(stored) : INITIAL_DRIVER_NOTIFICATIONS;
    } catch {
      return INITIAL_DRIVER_NOTIFICATIONS;
    }
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(INITIAL_NOTIFICATIONS);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>('inc-001');
  const [selectedAmbulanceId, setSelectedAmbulanceId] = useState<string | null>('amb-101');
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>('hosp-kr');
  const [activeNavigationRoute, setActiveNavigationRoute] = useState<NavigationRoute | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'ONLINE' | 'RECONNECTING' | 'SYNCING'>('ONLINE');
  const [latencyMs, setLatencyMs] = useState<number>(14);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString());
  const [isSimulatingCalls, setIsSimulatingCalls] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(INCIDENTS_STORAGE, JSON.stringify(incidents));
    } catch (e) {
      console.error(e);
    }
  }, [incidents]);

  useEffect(() => {
    try {
      localStorage.setItem(AMBULANCES_STORAGE, JSON.stringify(ambulances));
    } catch (e) {
      console.error(e);
    }
  }, [ambulances]);

  useEffect(() => {
    try {
      localStorage.setItem(HOSPITALS_STORAGE, JSON.stringify(hospitals));
    } catch (e) {
      console.error(e);
    }
  }, [hospitals]);

  useEffect(() => {
    try {
      localStorage.setItem(DRIVER_NOTIFS_STORAGE, JSON.stringify(driverNotifications));
    } catch (e) {
      console.error(e);
    }
  }, [driverNotifications]);

  // Web Audio Alert Sound Generator
  const playAlertSound = useCallback((type: 'alert' | 'dispatch' | 'info' = 'alert') => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'alert') {
        osc.frequency.setValueAtTime(880, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } else {
        osc.frequency.setValueAtTime(520, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(780, audioCtx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
      }
    } catch {
      // Audio context may be restricted before interaction
    }
  }, [soundEnabled]);

  // FEATURE 6: 5-Minute Notification Expiration Engine
  // Periodically sweeps unaccepted notifications older than 5 minutes (300,000 ms)
  // Preserves accepted incidents permanently.
  useEffect(() => {
    const expirationInterval = setInterval(() => {
      const currentTime = Date.now();
      
      setDriverNotifications((prev) =>
        prev.filter((notif) => {
          // If accepted, always keep in history
          if (notif.isAccepted) return true;
          // If unaccepted, remove once 5 minutes has elapsed
          return currentTime <= notif.expiresAtTimestamp;
        })
      );
    }, 5000);

    return () => clearInterval(expirationInterval);
  }, []);

  // GPS Telematics Movement Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date().toLocaleTimeString());
      setLatencyMs(Math.floor(12 + Math.random() * 8));

      setAmbulances((prev) =>
        prev.map((amb) => {
          if (amb.status === 'EN_ROUTE' || amb.status === 'TRANSPORTING') {
            const deltaLat = (Math.random() - 0.48) * 0.0004;
            const deltaLng = (Math.random() - 0.48) * 0.0004;
            const newSpeed = Math.floor(44 + Math.random() * 16);
            return {
              ...amb,
              lat: amb.lat + deltaLat,
              lng: amb.lng + deltaLng,
              speedKmH: newSpeed,
            };
          }
          return amb;
        })
      );
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // AI Speech/Text Analyzer
  const analyzeEmergencySpeechOrText = useCallback((text: string): AIAnalysisResult => {
    const lower = text.toLowerCase();
    let priority: PriorityLevel = 'MEDIUM';
    let category: IncidentCategory = 'GENERAL_MEDICAL';
    let urgency = 50;
    const symptoms: string[] = [];
    const hazards: string[] = [];
    const landmarks: string[] = [];

    if (lower.includes('heart') || lower.includes('chest pain') || lower.includes('cardiac') || lower.includes('collapse') || lower.includes('pulse')) {
      category = 'CARDIAC_ARREST';
      priority = 'CRITICAL';
      urgency = 96;
      symptoms.push('Acute Thoracic Pain', 'Diaphoresis', 'Arrhythmia Risk');
    } else if (lower.includes('accident') || lower.includes('crash') || lower.includes('collision') || lower.includes('bleeding') || lower.includes('fracture') || lower.includes('hit')) {
      category = 'TRAUMA_ACCIDENT';
      priority = 'CRITICAL';
      urgency = 92;
      symptoms.push('Blunt Force Trauma', 'Active Hemorrhage', 'Suspected Fracture');
      hazards.push('Road Traffic Obstruction', 'Fuel Leak Risk');
    } else if (lower.includes('stroke') || lower.includes('slur') || lower.includes('paralysis') || lower.includes('face droop') || lower.includes('weakness')) {
      category = 'STROKE';
      priority = 'CRITICAL';
      urgency = 94;
      symptoms.push('Unilateral Facial Droop', 'Arm Drift Weakness', 'Dysarthria');
    } else if (lower.includes('fire') || lower.includes('burn') || lower.includes('smoke') || lower.includes('flame') || lower.includes('explosion')) {
      category = 'FIRE_HAZARD';
      priority = 'HIGH';
      urgency = 88;
      symptoms.push('Thermal Burns', 'Smoke Inhalation Injury');
      hazards.push('Active Chemical Fire', 'Combustible Gas');
    } else if (lower.includes('pregnant') || lower.includes('labor') || lower.includes('baby') || lower.includes('delivery') || lower.includes('contraction')) {
      category = 'OBSTETRIC_EMERGENCY';
      priority = 'HIGH';
      urgency = 82;
      symptoms.push('Frequent Contractions', 'Amniotic Rupture');
    } else if (lower.includes('breath') || lower.includes('asthma') || lower.includes('wheez') || lower.includes('choking') || lower.includes('suffocat')) {
      category = 'RESPIRATORY_DISTRESS';
      priority = 'HIGH';
      urgency = 85;
      symptoms.push('Severe Bronchospasm', 'Hypoxia Danger');
    }

    if (lower.includes('mysore palace') || lower.includes('palace')) landmarks.push('Mysore Palace');
    if (lower.includes('sayyaji') || lower.includes('circle')) landmarks.push('Sayyaji Rao Road');
    if (lower.includes('kuvempunagar')) landmarks.push('Kuvempunagar');
    if (lower.includes('gokulam')) landmarks.push('Gokulam 3rd Stage');
    if (lower.includes('hebbal')) landmarks.push('Hebbal Industrial Area');
    if (lower.includes('vijayanagar')) landmarks.push('Vijayanagar');

    // Rank candidate hospitals
    const dummyIncident: Incident = {
      id: 'temp',
      createdAtTimestamp: Date.now(),
      expiresAtTimestamp: Date.now() + 300000,
      callerPhone: '',
      callerName: '',
      locationName: landmarks[0] || 'Mysuru District',
      area: 'Mysuru Urban',
      lat: 12.3080,
      lng: 76.6480,
      category,
      priority,
      status: 'PENDING',
      reportedAt: '',
      callDurationSeconds: 0,
      patientCount: 1,
      aiTriageSummary: '',
      callerTranscriptSnippet: '',
      timeline: [],
    };

    const ranked = rankHospitalsForEmergency(dummyIncident, hospitals);

    return {
      sentiment: urgency > 85 ? 'PANIC' : urgency > 60 ? 'URGENT' : 'CALM',
      urgencyScore: urgency,
      recommendedCategory: category,
      recommendedPriority: priority,
      keyEntities: {
        casualties: lower.includes('two') || lower.includes('2') ? 2 : lower.includes('three') || lower.includes('3') ? 3 : 1,
        symptoms,
        hazards,
        landmarksMentioned: landmarks,
      },
      recommendedActions: [
        `Dispatch nearest ${priority === 'CRITICAL' ? 'ALS' : 'BLS'} unit immediately`,
        'Pre-alert receiving hospital emergency room with AI vitals forecast',
        'Maintain open continuous tele-guidance line with on-scene caller',
      ],
      recommendedHospitals: ranked.map((r) => ({
        hospitalId: r.hospitalId,
        hospitalName: r.hospital.name,
        distanceKm: r.roadDistanceKm,
        etaMinutes: r.estimatedDriveTimeMins,
        readinessScore: r.matchScore,
        rationale: r.rationale,
      })),
    };
  }, [hospitals]);

  // FEATURE 1: Create Emergency Request (Triggered by Public Emergency Button)
  const createEmergencyRequest = useCallback(async (params: {
    callerName?: string;
    callerPhone?: string;
    locationName?: string;
    lat: number;
    lng: number;
    accuracyRadiusM?: number;
    category?: IncidentCategory;
    priority?: PriorityLevel;
    description?: string;
  }): Promise<{ success: boolean; incident?: Incident; error?: string }> => {
    try {
      const currentTime = Date.now();
      const expirationTime = currentTime + 5 * 60 * 1000; // 5 minutes expiration
      const uniqueId = `EM-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(1000 + Math.random() * 9000)}`;
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const category = params.category || 'TRAUMA_ACCIDENT';
      const priority = params.priority || 'CRITICAL';
      const locationName = params.locationName || `GPS Loc (${params.lat.toFixed(4)}, ${params.lng.toFixed(4)})`;

      const newIncident: Incident = {
        id: uniqueId,
        createdAtTimestamp: currentTime,
        expiresAtTimestamp: expirationTime,
        callerPhone: params.callerPhone || '(0821) 112-9999',
        callerName: params.callerName || 'Public Citizen (1-Tap SOS)',
        locationName,
        area: 'Mysuru Urban District',
        lat: params.lat,
        lng: params.lng,
        accuracyRadiusM: params.accuracyRadiusM || 4.5,
        category,
        priority,
        status: 'PENDING',
        reportedAt: timeStr,
        callDurationSeconds: 15,
        patientCount: 1,
        aiTriageSummary: `Public Emergency SOS Broadcast. Coordinates verified via device geolocation (±${params.accuracyRadiusM || 4}m). Urgency: 95/100.`,
        callerTranscriptSnippet: params.description || 'Emergency assistance requested via instant public SOS button.',
        timeline: [
          {
            id: `t-${Date.now()}-1`,
            timestamp: new Date().toLocaleTimeString(),
            title: '1-Tap Emergency SOS Triggered',
            description: `Location captured: ${locationName} (Lat: ${params.lat.toFixed(4)}, Lng: ${params.lng.toFixed(4)}). Broadcast sent to nearest 108 drivers.`,
            actor: 'Citizen Geolocation Engine',
            type: 'CREATED',
          },
        ],
      };

      // Save Incident
      setIncidents((prev) => [newIncident, ...prev]);
      setSelectedIncidentId(uniqueId);

      // FEATURE 2: Create Real-Time Driver Notification
      // Calculate distance for ambulance #101
      const nearestAmb = ambulances.find((a) => a.status === 'AVAILABLE') || ambulances[0];
      const distFromDriver = nearestAmb 
        ? calculateHaversineKm(nearestAmb.lat, nearestAmb.lng, params.lat, params.lng)
        : 2.1;

      const newDriverNotif: DriverEmergencyNotification = {
        id: `dnotif-${Date.now()}`,
        incidentId: uniqueId,
        createdAtTimestamp: currentTime,
        expiresAtTimestamp: expirationTime,
        locationName,
        lat: params.lat,
        lng: params.lng,
        callerPhone: newIncident.callerPhone,
        callerName: newIncident.callerName,
        category,
        priority,
        urgencyScore: 95,
        distanceKmFromDriver: Number((distFromDriver * 1.25).toFixed(1)),
        isAccepted: false,
      };

      setDriverNotifications((prev) => [newDriverNotif, ...prev]);

      // System notification
      const sysNotif: SystemNotification = {
        id: `notif-${Date.now()}`,
        title: `🚨 EMERGENCY BROADCAST: ${category.replace('_', ' ')}`,
        message: `${locationName} — Awaiting 108 Driver Acceptance`,
        type: 'CRITICAL',
        timestamp: 'Just now',
        read: false,
        incidentId: uniqueId,
        driverNotificationId: newDriverNotif.id,
      };
      setNotifications((prev) => [sysNotif, ...prev]);

      playAlertSound('alert');
      return { success: true, incident: newIncident };
    } catch (err) {
      console.error('Failed to create emergency request:', err);
      return { success: false, error: 'Could not create emergency request. Please call 112 directly.' };
    }
  }, [ambulances, playAlertSound]);

  const createIncident = useCallback((params: {
    callerName?: string;
    callerPhone?: string;
    locationName?: string;
    area?: string;
    category?: IncidentCategory;
    priority?: PriorityLevel;
    patientCount?: number;
    description?: string;
    lat?: number;
    lng?: number;
  }) => {
    createEmergencyRequest({
      callerName: params.callerName,
      callerPhone: params.callerPhone,
      locationName: params.locationName,
      lat: params.lat ?? 12.3120,
      lng: params.lng ?? 76.6500,
      category: params.category,
      priority: params.priority,
      description: params.description,
    });
  }, [createEmergencyRequest]);

  // FEATURE 2: Real-Time Ambulance Driver Acceptance
  const acceptDriverEmergency = useCallback((
    notificationId: string,
    ambulanceId?: string,
    driverName?: string
  ): { success: boolean; error?: string; incident?: Incident; route?: NavigationRoute } => {
    const notif = driverNotifications.find((n) => n.id === notificationId);
    if (!notif) {
      return { success: false, error: 'Notification not found or already expired.' };
    }

    if (notif.isAccepted) {
      return { success: false, error: `Emergency already accepted by ${notif.acceptedByDriverName || 'another unit'}.` };
    }

    const matchedIncident = incidents.find((i) => i.id === notif.incidentId);
    if (!matchedIncident) {
      return { success: false, error: 'Corresponding emergency record could not be found.' };
    }

    // Select ambulance
    const assignedAmb = ambulances.find((a) => a.id === ambulanceId) || ambulances[0];
    const assignedDriver = driverName || assignedAmb.driverName;

    // 1. Update Notification
    const acceptedAtStr = new Date().toLocaleTimeString();
    setDriverNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId
          ? {
              ...n,
              isAccepted: true,
              acceptedByAmbulanceId: assignedAmb.id,
              acceptedByDriverName: assignedDriver,
              acceptedAt: acceptedAtStr,
            }
          : n
      )
    );

    // 2. Generate Initial Stage A Navigation Route: Ambulance GPS -> Emergency Location
    const routeToEmergency = calculateRoadRoute(
      { lat: assignedAmb.lat, lng: assignedAmb.lng, label: `${assignedAmb.callSign} Current Position` },
      { lat: matchedIncident.lat, lng: matchedIncident.lng, label: matchedIncident.locationName },
      'TO_EMERGENCY'
    );
    setActiveNavigationRoute(routeToEmergency);

    // 3. Update Incident Status to ASSIGNED / EN_ROUTE
    const updatedIncident: Incident = {
      ...matchedIncident,
      status: 'EN_ROUTE',
      assignedAmbulanceId: assignedAmb.id,
      etaMinutes: routeToEmergency.durationMins,
      timeline: [
        ...matchedIncident.timeline,
        {
          id: `t-${Date.now()}-accepted`,
          timestamp: acceptedAtStr,
          title: `Ambulance ${assignedAmb.callSign} Accepted Dispatch`,
          description: `Driver ${assignedDriver} accepted emergency. En-route to pickup scene with ETA ${routeToEmergency.durationMins} mins.`,
          actor: `Driver ${assignedDriver}`,
          type: 'ASSIGNED',
        },
      ],
    };

    setIncidents((prev) =>
      prev.map((i) => (i.id === matchedIncident.id ? updatedIncident : i))
    );

    // 4. Update Ambulance Status
    setAmbulances((prev) =>
      prev.map((a) =>
        a.id === assignedAmb.id
          ? { ...a, status: 'EN_ROUTE', assignedIncidentId: matchedIncident.id }
          : a
      )
    );

    // 5. System notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `Dispatch Confirmed: ${assignedAmb.callSign}`,
        message: `Assigned to ${matchedIncident.locationName} (ETA ~${routeToEmergency.durationMins}m)`,
        type: 'DISPATCH',
        timestamp: 'Just now',
        read: false,
        incidentId: matchedIncident.id,
      },
      ...prev,
    ]);

    playAlertSound('dispatch');

    return {
      success: true,
      incident: updatedIncident,
      route: routeToEmergency,
    };
  }, [driverNotifications, incidents, ambulances, playAlertSound]);

  // FEATURE 3: Intelligent Hospital Recommendations for an Incident
  const getHospitalRecommendationsForIncident = useCallback((incidentId: string): HospitalRecommendation[] => {
    const inc = incidents.find((i) => i.id === incidentId) || incidents[0];
    if (!inc) return [];
    return rankHospitalsForEmergency(inc, hospitals);
  }, [incidents, hospitals]);

  // FEATURE 4: Generate Dual-Stage Route
  const generateDriverNavigationRoute = useCallback((
    incidentId: string,
    stage: 'TO_EMERGENCY' | 'TO_HOSPITAL',
    customHospitalId?: string
  ): NavigationRoute | null => {
    const inc = incidents.find((i) => i.id === incidentId);
    if (!inc) return null;

    const amb = ambulances.find((a) => a.id === inc.assignedAmbulanceId) || ambulances[0];
    const hospId = customHospitalId || inc.assignedHospitalId || hospitals[0].id;
    const hosp = hospitals.find((h) => h.id === hospId) || hospitals[0];

    if (stage === 'TO_EMERGENCY') {
      const route = calculateRoadRoute(
        { lat: amb.lat, lng: amb.lng, label: `${amb.callSign} Current Position` },
        { lat: inc.lat, lng: inc.lng, label: inc.locationName },
        'TO_EMERGENCY'
      );
      setActiveNavigationRoute(route);
      return route;
    } else {
      // Stage B: Patient Pickup -> Selected Hospital
      const route = calculateRoadRoute(
        { lat: inc.lat, lng: inc.lng, label: `Emergency Pickup: ${inc.locationName}` },
        { lat: hosp.lat, lng: hosp.lng, label: `${hosp.name} Emergency Bay` },
        'TO_HOSPITAL'
      );
      setActiveNavigationRoute(route);
      return route;
    }
  }, [incidents, ambulances, hospitals]);

  // Select Hospital & Generate Route
  const selectHospitalAndGenerateRoute = useCallback((
    incidentId: string,
    hospitalId: string
  ): { success: boolean; route?: NavigationRoute } => {
    const hosp = hospitals.find((h) => h.id === hospitalId);
    const inc = incidents.find((i) => i.id === incidentId);
    if (!hosp || !inc) return { success: false };

    // Update incident assigned hospital
    setIncidents((prev) =>
      prev.map((i) => {
        if (i.id === incidentId) {
          return {
            ...i,
            assignedHospitalId: hospitalId,
            timeline: [
              ...i.timeline,
              {
                id: `t-${Date.now()}-hosp`,
                timestamp: new Date().toLocaleTimeString(),
                title: `Hospital ER Assigned: ${hosp.name}`,
                description: `Pre-arrival notification sent to trauma team. Status: ${hosp.icuBedsAvailable} ICU beds ready.`,
                actor: 'Intelligent Hospital Router',
                type: 'HOSPITAL_ASSIGNED',
              },
            ],
          };
        }
        return i;
      })
    );

    // Compute Stage B route
    const route = calculateRoadRoute(
      { lat: inc.lat, lng: inc.lng, label: `Pickup: ${inc.locationName}` },
      { lat: hosp.lat, lng: hosp.lng, label: `${hosp.name} Emergency Bay` },
      'TO_HOSPITAL'
    );
    setActiveNavigationRoute(route);
    playAlertSound('info');

    return { success: true, route };
  }, [hospitals, incidents, playAlertSound]);

  const dispatchAmbulance = useCallback((incidentId: string, ambulanceId: string) => {
    const amb = ambulances.find((a) => a.id === ambulanceId);
    if (!amb) return;

    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          return {
            ...inc,
            assignedAmbulanceId: ambulanceId,
            status: 'DISPATCHED',
            etaMinutes: 4,
            timeline: [
              ...inc.timeline,
              {
                id: `t-${Date.now()}`,
                timestamp: new Date().toLocaleTimeString(),
                title: `Unit ${amb.callSign} Dispatched`,
                description: `Emergency crew notified and in-transit.`,
                actor: 'Central Dispatch Command',
                type: 'DISPATCHED',
              },
            ],
          };
        }
        return inc;
      })
    );

    setAmbulances((prev) =>
      prev.map((a) => (a.id === ambulanceId ? { ...a, status: 'EN_ROUTE', assignedIncidentId: incidentId } : a))
    );

    playAlertSound('dispatch');
  }, [ambulances, playAlertSound]);

  const assignHospital = useCallback((incidentId: string, hospitalId: string) => {
    selectHospitalAndGenerateRoute(incidentId, hospitalId);
  }, [selectHospitalAndGenerateRoute]);

  const updateIncidentStatus = useCallback((incidentId: string, status: IncidentStatus) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          return {
            ...inc,
            status,
            timeline: [
              ...inc.timeline,
              {
                id: `t-${Date.now()}`,
                timestamp: new Date().toLocaleTimeString(),
                title: `Status Changed: ${status.replace('_', ' ')}`,
                description: `Incident transitioned to ${status}.`,
                actor: 'Operations Crew',
                type: status === 'RESOLVED' ? 'RESOLVED' : 'ARRIVED',
              },
            ],
          };
        }
        return inc;
      })
    );

    if (status === 'RESOLVED') {
      setAmbulances((prev) =>
        prev.map((a) =>
          a.assignedIncidentId === incidentId
            ? { ...a, status: 'AVAILABLE', assignedIncidentId: undefined, destinationHospitalId: undefined }
            : a
        )
      );
    }
  }, []);

  const updateVitals = useCallback((incidentId: string, vitals: Partial<Vitals>) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          const currentVitals = inc.vitals || {};
          return {
            ...inc,
            vitals: { ...currentVitals, ...vitals },
            timeline: [
              ...inc.timeline,
              {
                id: `t-${Date.now()}`,
                timestamp: new Date().toLocaleTimeString(),
                title: 'Patient Telemetry Updated',
                description: `HR: ${vitals.heartRate || currentVitals.heartRate} bpm | SpO2: ${vitals.spO2 || currentVitals.spO2}%`,
                actor: 'Paramedic Live Telematics',
                type: 'VITALS_UPDATE',
              },
            ],
          };
        }
        return inc;
      })
    );
  }, []);

  const updateHospitalCapacity = useCallback((hospitalId: string, changes: Partial<Hospital>) => {
    setHospitals((prev) =>
      prev.map((h) => (h.id === hospitalId ? { ...h, ...changes, lastVerifiedMinutesAgo: 0 } : h))
    );
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const triggerMockEmergencyCall = useCallback((): Incident => {
    const mockLocations = [
      { name: 'Bogadi 2nd Stage Ring Road Junction', area: 'Bogadi', lat: 12.3020, lng: 76.6040 },
      { name: 'Chamundi Hill Steps Base, Tavarekatte', area: 'Chamundi Hill', lat: 12.2850, lng: 76.6710 },
      { name: 'Metagalli Industrial Area, KRS Road', area: 'Metagalli', lat: 12.3480, lng: 76.6210 },
      { name: 'Nazarbad Police Station Junction', area: 'Nazarbad', lat: 12.3110, lng: 76.6660 },
      { name: 'Saraswathipuram 5th Main, Near Swimming Pool', area: 'Saraswathipuram', lat: 12.3015, lng: 76.6320 },
    ];
    const loc = mockLocations[Math.floor(Math.random() * mockLocations.length)];
    const categories: IncidentCategory[] = ['TRAUMA_ACCIDENT', 'CARDIAC_ARREST', 'RESPIRATORY_DISTRESS', 'FIRE_HAZARD'];
    const cat = categories[Math.floor(Math.random() * categories.length)];

    const currentTime = Date.now();
    const newId = `EM-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newInc: Incident = {
      id: newId,
      createdAtTimestamp: currentTime,
      expiresAtTimestamp: currentTime + 300000,
      callerName: ['Ravi Kumar', 'Meenakshi Sundaram', 'Praveen Gowda', 'Farhan Ahmed'][Math.floor(Math.random() * 4)],
      callerPhone: `(0821) ${Math.floor(200 + Math.random() * 700)}-${Math.floor(1000 + Math.random() * 8999)}`,
      locationName: loc.name,
      area: loc.area,
      lat: loc.lat,
      lng: loc.lng,
      category: cat,
      priority: 'CRITICAL',
      status: 'PENDING',
      reportedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      callDurationSeconds: 20,
      patientCount: 1,
      aiTriageSummary: `Simulated 112 emergency call at ${loc.name}. Urgent ambulance response requested.`,
      callerTranscriptSnippet: `Caller reporting emergency at ${loc.name}.`,
      timeline: [
        {
          id: `t-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          title: 'Simulated 112 Emergency Call Received',
          description: `Logged at ${loc.name}. Notification transmitted to driver dispatch queue.`,
          actor: '112 Simulation Generator',
          type: 'CREATED',
        },
      ],
    };

    setIncidents((prev) => [newInc, ...prev]);
    setSelectedIncidentId(newInc.id);

    // Create driver notification
    const dnotif: DriverEmergencyNotification = {
      id: `dnotif-${Date.now()}`,
      incidentId: newInc.id,
      createdAtTimestamp: currentTime,
      expiresAtTimestamp: currentTime + 300000,
      locationName: loc.name,
      lat: loc.lat,
      lng: loc.lng,
      callerPhone: newInc.callerPhone,
      callerName: newInc.callerName,
      category: cat,
      priority: 'CRITICAL',
      urgencyScore: 92,
      distanceKmFromDriver: 2.4,
      isAccepted: false,
    };
    setDriverNotifications((prev) => [dnotif, ...prev]);

    playAlertSound('alert');
    return newInc;
  }, [playAlertSound]);

  return (
    <EmergencyDataContext.Provider
      value={{
        incidents,
        ambulances,
        hospitals,
        notifications,
        driverNotifications,
        selectedIncidentId,
        selectedAmbulanceId,
        selectedHospitalId,
        activeNavigationRoute,
        connectionStatus,
        latencyMs,
        lastUpdated,
        isSimulatingCalls,
        soundEnabled,
        setSelectedIncidentId,
        setSelectedAmbulanceId,
        setSelectedHospitalId,
        setActiveNavigationRoute,
        setSoundEnabled,
        setIsSimulatingCalls,
        createEmergencyRequest,
        createIncident,
        acceptDriverEmergency,
        getHospitalRecommendationsForIncident,
        selectHospitalAndGenerateRoute,
        generateDriverNavigationRoute,
        dispatchAmbulance,
        assignHospital,
        updateIncidentStatus,
        updateVitals,
        updateHospitalCapacity,
        markNotificationRead,
        clearAllNotifications,
        analyzeEmergencySpeechOrText,
        triggerMockEmergencyCall,
      }}
    >
      {children}
    </EmergencyDataContext.Provider>
  );
};

export const useEmergencyData = () => {
  const context = useContext(EmergencyDataContext);
  if (!context) {
    throw new Error('useEmergencyData must be used within an EmergencyDataProvider');
  }
  return context;
};
