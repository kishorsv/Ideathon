import React, { useState } from 'react';
import { GoogleLiveMapView } from './GoogleLiveMapView';
import { 
  Hospital as HospitalIcon, 
  Truck, 
  MapPin, 
  Layers, 
  Activity, 
  Compass, 
  Radio, 
  ShieldAlert,
  Globe
} from 'lucide-react';
import { useEmergencyData } from '../../context/EmergencyDataContext';

export const LiveMapView: React.FC = () => {
  const { hospitals, ambulances, incidents } = useEmergencyData();

  return (
    <div className="space-y-6">
      {/* Quick Statistics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#071321]/90 dark:bg-[#071321]/90 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-mono">
            <HospitalIcon className="w-4 h-4 text-[#168BCE]" />
            <span>CONNECTED HOSPITALS</span>
          </div>
          <p className="text-2xl font-black text-white dark:text-white light:text-slate-900 mt-1 font-mono">
            {hospitals.length} <span className="text-xs text-emerald-400 font-normal">Active</span>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#071321]/90 dark:bg-[#071321]/90 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-mono">
            <Truck className="w-4 h-4 text-emerald-400" />
            <span>108 AMBULANCE UNITS</span>
          </div>
          <p className="text-2xl font-black text-white dark:text-white light:text-slate-900 mt-1 font-mono">
            {ambulances.length} <span className="text-xs text-cyan-400 font-normal">GPS Tracked</span>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#071321]/90 dark:bg-[#071321]/90 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-mono">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>ACTIVE EMERGENCIES</span>
          </div>
          <p className="text-2xl font-black text-white dark:text-white light:text-slate-900 mt-1 font-mono">
            {incidents.filter((i) => i.status !== 'RESOLVED').length} <span className="text-xs text-rose-400 font-normal">Live</span>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#071321]/90 dark:bg-[#071321]/90 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-mono">
            <Radio className="w-4 h-4 text-[#00D4FF]" />
            <span>MAP ENGINE</span>
          </div>
          <p className="text-lg font-bold text-[#46C5F5] mt-1 truncate">
            Google Maps API
          </p>
        </div>
      </div>

      {/* Official Google Maps Interactive View */}
      <GoogleLiveMapView />
    </div>
  );
};
