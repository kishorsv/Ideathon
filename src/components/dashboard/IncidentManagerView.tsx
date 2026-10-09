import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Plus, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Filter,
  Eye,
  Hospital as HospitalIcon,
  Truck
} from 'lucide-react';
import { useEmergencyData } from '../../context/EmergencyDataContext';
import { Incident, IncidentStatus, PriorityLevel, IncidentCategory } from '../../types';

interface IncidentManagerViewProps {
  onOpenCreateIncident: () => void;
}

export const IncidentManagerView: React.FC<IncidentManagerViewProps> = ({ onOpenCreateIncident }) => {
  const { incidents, ambulances, hospitals, updateIncidentStatus, setSelectedIncidentId } = useEmergencyData();
  const [search, setSearch] = useState('');
  const [selectedIncidentModal, setSelectedIncidentModal] = useState<Incident | null>(null);

  const filteredIncidents = incidents.filter((i) =>
    i.callerPhone.includes(search) ||
    i.locationName.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#071321]/90 dark:bg-[#071321]/90 light:bg-white border border-[#168BCE]/30 dark:border-[#168BCE]/30 light:border-slate-200 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#168BCE]/15 border border-[#168BCE]/30 text-xs font-semibold text-[#46C5F5] mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Master Operations Registry</span>
          </div>
          <h2 className="text-2xl font-bold text-white dark:text-white light:text-slate-900">
            Emergency Incident Management
          </h2>
          <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-600 mt-1">
            Complete audit records, live status tracking, telematics logs, and priority dispatch history.
          </p>
        </div>

        <button
          onClick={onOpenCreateIncident}
          className="px-4 py-2.5 rounded-xl bg-[#168BCE] hover:bg-[#1277b2] text-white text-xs font-bold shadow-md flex items-center space-x-1.5 cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Incident</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl bg-[#071321]/90 dark:bg-[#071321]/90 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 shadow-xl overflow-hidden">
        {/* Search Header */}
        <div className="p-4 border-b border-slate-800 dark:border-slate-800 light:border-slate-200 flex items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by phone, area, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#050C16] dark:bg-[#050C16] light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-300 text-xs text-white dark:text-white light:text-slate-900 focus:outline-none"
            />
          </div>
          <span className="text-xs font-mono text-slate-400">
            Showing {filteredIncidents.length} records
          </span>
        </div>

        {/* Incidents Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 dark:text-slate-300 light:text-slate-700">
            <thead className="bg-[#050C16] dark:bg-[#050C16] light:bg-slate-100 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800 dark:border-slate-800 light:border-slate-200">
              <tr>
                <th className="py-3 px-4">Caller / Time</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Assigned Unit</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 dark:divide-slate-800/60 light:divide-slate-200">
              {filteredIncidents.map((inc) => {
                const amb = ambulances.find((a) => a.id === inc.assignedAmbulanceId);
                const hosp = hospitals.find((h) => h.id === inc.assignedHospitalId);
                return (
                  <tr key={inc.id} className="hover:bg-slate-800/30 dark:hover:bg-slate-800/30 light:hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-white dark:text-white light:text-slate-900">{inc.callerPhone}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{inc.reportedAt}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-200 dark:text-slate-200 light:text-slate-800 max-w-[200px] truncate">{inc.locationName}</div>
                      <div className="text-[10px] text-slate-400">{inc.area}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-blue-950/60 text-cyan-300 font-mono text-[10px] border border-cyan-800/40">
                        {inc.category.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        inc.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {inc.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-700 font-semibold">
                        {amb ? amb.callSign : 'Unassigned'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={inc.status}
                        onChange={(e) => updateIncidentStatus(inc.id, e.target.value as IncidentStatus)}
                        className="px-2 py-1 rounded bg-[#050C16] dark:bg-[#050C16] light:bg-slate-100 border border-slate-700 text-[11px] font-semibold text-cyan-400 focus:outline-none"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="DISPATCHED">DISPATCHED</option>
                        <option value="EN_ROUTE">EN ROUTE</option>
                        <option value="ON_SCENE">ON SCENE</option>
                        <option value="TRANSPORTING">TRANSPORTING</option>
                        <option value="RESOLVED">RESOLVED</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedIncidentModal(inc)}
                        className="p-1.5 rounded-lg bg-slate-800 dark:bg-slate-800 light:bg-slate-100 hover:bg-[#168BCE] text-slate-300 hover:text-white cursor-pointer transition-colors"
                        title="View Full Audit Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incident Detail Modal */}
      {selectedIncidentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#071321] border border-[#168BCE]/40 p-6 shadow-2xl text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white font-mono">{selectedIncidentModal.callerPhone}</h3>
                <p className="text-xs text-slate-400">{selectedIncidentModal.locationName}</p>
              </div>
              <button
                onClick={() => setSelectedIncidentModal(null)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-[#050C16] border border-slate-800 text-xs space-y-2">
              <p><strong className="text-[#46C5F5]">AI Clinical Summary:</strong> {selectedIncidentModal.aiTriageSummary}</p>
              <p className="text-slate-400 italic">"{selectedIncidentModal.callerTranscriptSnippet}"</p>
            </div>

            {/* Timeline */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Complete Event Audit History</h4>
              <div className="space-y-2">
                {selectedIncidentModal.timeline.map((t) => (
                  <div key={t.id} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-white">{t.title}</p>
                      <p className="text-slate-400 text-[11px]">{t.description}</p>
                      <p className="text-cyan-400 text-[10px] font-mono mt-0.5">Actor: {t.actor}</p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{t.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
