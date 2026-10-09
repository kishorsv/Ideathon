import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Volume2, 
  Eye, 
  X, 
  Radio, 
  Navigation,
  Timer
} from 'lucide-react';
import { useEmergencyData } from '../../context/EmergencyDataContext';
import { useAuth } from '../../context/AuthContext';
import { DriverEmergencyNotification } from '../../types';

interface DriverNotificationDrawerProps {
  onAcceptSuccess?: (incidentId: string) => void;
  onViewIncident?: (incidentId: string) => void;
}

export const DriverNotificationDrawer: React.FC<DriverNotificationDrawerProps> = ({
  onAcceptSuccess,
  onViewIncident,
}) => {
  const { user } = useAuth();
  const { driverNotifications, acceptDriverEmergency, ambulances } = useEmergencyData();
  const [selectedNotif, setSelectedNotif] = useState<DriverEmergencyNotification | null>(null);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [nowTime, setNowTime] = useState<number>(Date.now());

  // Update timer every second
  useEffect(() => {
    const timer = setInterval(() => setNowTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter active notifications for drivers (only unaccepted or recently accepted)
  const activeNotifs = driverNotifications.filter((n) => {
    if (n.isAccepted) return false;
    // 5-minute expiration check
    return nowTime <= n.expiresAtTimestamp;
  });

  const handleAccept = (notif: DriverEmergencyNotification) => {
    setAcceptingId(notif.id);
    setErrorMessage(null);

    // Identify user's ambulance or default to available unit
    const userAmbulance = ambulances.find((a) => a.id === user?.ambulanceAssignedId) || ambulances[0];
    const driverName = user?.name || userAmbulance.driverName;

    const res = acceptDriverEmergency(notif.id, userAmbulance.id, driverName);

    setAcceptingId(null);
    if (res.success && res.incident) {
      if (onAcceptSuccess) onAcceptSuccess(res.incident.id);
    } else {
      setErrorMessage(res.error || 'Failed to accept emergency.');
    }
  };

  const formatRemainingTime = (expiresAt: number) => {
    const remainingSecs = Math.max(0, Math.floor((expiresAt - nowTime) / 1000));
    const mins = Math.floor(remainingSecs / 60);
    const secs = remainingSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatElapsedTime = (createdAt: number) => {
    const elapsedSecs = Math.max(0, Math.floor((nowTime - createdAt) / 1000));
    const mins = Math.floor(elapsedSecs / 60);
    const secs = elapsedSecs % 60;
    return `${mins}m ${secs}s ago`;
  };

  if (activeNotifs.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md w-full space-y-3 pointer-events-auto animate-in slide-in-from-bottom-5 duration-300">
      {activeNotifs.map((notif) => {
        const remainingSecs = Math.max(0, Math.floor((notif.expiresAtTimestamp - nowTime) / 1000));
        const progressPct = Math.min(100, Math.max(0, (remainingSecs / 300) * 100));

        return (
          <div
            key={notif.id}
            className="rounded-3xl bg-[#071321] border-2 border-rose-500 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_40px_rgba(239,68,68,0.4)] text-slate-100 relative overflow-hidden"
          >
            {/* Top 5-Minute Expiration Progress Bar */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-slate-800">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-amber-400 transition-all duration-1000"
                style={{ width: `${progressPct}%` }}
              ></div>
            </div>

            {/* Header */}
            <div className="flex items-start justify-between mb-3 pt-1">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center">
                  <Radio className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400">
                    Incoming 108 Dispatch Alert
                  </span>
                  <h4 className="text-sm font-bold text-white font-mono">
                    ID #{notif.incidentId}
                  </h4>
                </div>
              </div>

              {/* 5-Min Expiration Countdown Badge */}
              <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-amber-300">
                <Timer className="w-3.5 h-3.5 text-amber-400" />
                <span>Expires in {formatRemainingTime(notif.expiresAtTimestamp)}</span>
              </div>
            </div>

            {/* Content Details */}
            <div className="space-y-2 text-xs bg-[#050C16] p-3 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-[#168BCE]" />
                  <span>Time Elapsed:</span>
                </span>
                <span className="font-mono text-slate-200 font-semibold">{formatElapsedTime(notif.createdAtTimestamp)}</span>
              </div>

              <div className="flex items-start justify-between">
                <span className="text-slate-400 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <span>Pickup Location:</span>
                </span>
                <span className="text-right text-white font-semibold max-w-[200px] truncate">{notif.locationName}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Road Distance to Scene:</span>
                <span className="font-mono text-cyan-400 font-bold">~{notif.distanceKmFromDriver || 2.2} km</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Emergency Type:</span>
                <span className="px-2 py-0.5 rounded bg-blue-950 text-[#46C5F5] font-mono text-[10px] font-bold">
                  {notif.category.replace('_', ' ')}
                </span>
              </div>
            </div>

            {errorMessage && (
              <p className="text-xs text-rose-400 mt-2">{errorMessage}</p>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                onClick={() => {
                  if (onViewIncident) onViewIncident(notif.incidentId);
                }}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-1 cursor-pointer transition-colors border border-slate-700"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Incident</span>
              </button>

              <button
                onClick={() => handleAccept(notif)}
                disabled={acceptingId === notif.id}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer shadow-lg transition-all active:scale-95 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{acceptingId === notif.id ? 'Claiming...' : 'Accept Emergency'}</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
