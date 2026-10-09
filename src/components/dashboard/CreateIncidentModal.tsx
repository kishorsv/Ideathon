import React, { useState } from 'react';
import { X, ShieldAlert, Sparkles, Send } from 'lucide-react';
import { useEmergencyData } from '../../context/EmergencyDataContext';
import { IncidentCategory, PriorityLevel } from '../../types';

interface CreateIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateIncidentModal: React.FC<CreateIncidentModalProps> = ({ isOpen, onClose }) => {
  const { createIncident } = useEmergencyData();
  const [callerName, setCallerName] = useState('');
  const [callerPhone, setCallerPhone] = useState('');
  const [locationName, setLocationName] = useState('');
  const [area, setArea] = useState('Mysuru Central');
  const [category, setCategory] = useState<IncidentCategory>('TRAUMA_ACCIDENT');
  const [priority, setPriority] = useState<PriorityLevel>('CRITICAL');
  const [description, setDescription] = useState('');
  const [patientCount, setPatientCount] = useState(1);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createIncident({
      callerName: callerName || '112 Caller',
      callerPhone: callerPhone || `(0821) ${Math.floor(200 + Math.random() * 700)}-${Math.floor(1000 + Math.random() * 8999)}`,
      locationName: locationName || 'Sayyaji Rao Road, Mysuru',
      area,
      category,
      priority,
      patientCount,
      description: description || 'Emergency logged by central operator.',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-[#071321] border border-[#168BCE]/40 p-6 shadow-2xl text-slate-100 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-white">Log Emergency Incident</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Caller Name</label>
              <input
                type="text"
                value={callerName}
                onChange={(e) => setCallerName(e.target.value)}
                placeholder="e.g. Ramesh Chandra"
                className="w-full px-3 py-2 rounded-xl bg-[#050C16] border border-slate-800 text-white focus:outline-none focus:border-[#168BCE]"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Caller Phone</label>
              <input
                type="text"
                value={callerPhone}
                onChange={(e) => setCallerPhone(e.target.value)}
                placeholder="(0821) 555-1234"
                className="w-full px-3 py-2 rounded-xl bg-[#050C16] border border-slate-800 text-white focus:outline-none focus:border-[#168BCE]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Exact Location / Landmark</label>
              <input
                type="text"
                required
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. 14th Cross Kuvempunagar"
                className="w-full px-3 py-2 rounded-xl bg-[#050C16] border border-slate-800 text-white focus:outline-none focus:border-[#168BCE]"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Mysuru Ward / Area</label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#050C16] border border-slate-800 text-white focus:outline-none focus:border-[#168BCE]"
              >
                <option value="Mysuru Central">Mysuru Central / Town Hall</option>
                <option value="Kuvempunagar">Kuvempunagar</option>
                <option value="Jayalakshmipuram">Jayalakshmipuram</option>
                <option value="Gokulam">Gokulam 3rd Stage</option>
                <option value="Hebbal Industrial">Hebbal Industrial Area</option>
                <option value="Vijayanagar">Vijayanagar 2nd Stage</option>
                <option value="Chamundi Foothills">Chamundi Foothills</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-slate-400 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as IncidentCategory)}
                className="w-full px-2.5 py-2 rounded-xl bg-[#050C16] border border-slate-800 text-white focus:outline-none focus:border-[#168BCE]"
              >
                <option value="TRAUMA_ACCIDENT">Trauma / Accident</option>
                <option value="CARDIAC_ARREST">Cardiac Arrest</option>
                <option value="STROKE">Stroke (FAST)</option>
                <option value="FIRE_HAZARD">Fire Hazard</option>
                <option value="RESPIRATORY_DISTRESS">Respiratory</option>
                <option value="OBSTETRIC_EMERGENCY">Obstetric</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full px-2.5 py-2 rounded-xl bg-[#050C16] border border-slate-800 text-white focus:outline-none focus:border-[#168BCE]"
              >
                <option value="CRITICAL">CRITICAL (Code Red)</option>
                <option value="HIGH">HIGH (Yellow)</option>
                <option value="MEDIUM">MEDIUM (Green)</option>
                <option value="LOW">LOW</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Casualties</label>
              <input
                type="number"
                min={1}
                max={50}
                value={patientCount}
                onChange={(e) => setPatientCount(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-xl bg-[#050C16] border border-slate-800 text-white focus:outline-none focus:border-[#168BCE]"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Incident Notes / Symptoms</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe emergency, casualties, patient condition..."
              className="w-full p-2.5 rounded-xl bg-[#050C16] border border-slate-800 text-white focus:outline-none focus:border-[#168BCE]"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#168BCE] hover:bg-[#1277b2] text-white font-bold shadow-lg flex items-center justify-center space-x-1.5 cursor-pointer transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>Submit to AI Dispatch Engine</span>
          </button>
        </form>
      </div>
    </div>
  );
};
