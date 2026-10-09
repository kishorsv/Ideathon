import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  CartesianGrid, 
  AreaChart, 
  Area 
} from 'recharts';
import { BarChart3, TrendingUp, Clock, ShieldCheck, HeartPulse, Activity } from 'lucide-react';

const HOURLY_CALLS_DATA = [
  { time: '08:00', calls: 14, dispatched: 14 },
  { time: '10:00', calls: 22, dispatched: 21 },
  { time: '12:00', calls: 35, dispatched: 35 },
  { time: '14:00', calls: 28, dispatched: 28 },
  { time: '16:00', calls: 42, dispatched: 40 },
  { time: '18:00', calls: 48, dispatched: 48 },
  { time: '20:00', calls: 38, dispatched: 37 },
  { time: '22:00', calls: 20, dispatched: 20 },
];

const WARD_ETA_DATA = [
  { ward: 'Kuvempunagar', avgEtaMins: 3.1, incidents: 45 },
  { ward: 'Jayalakshmipuram', avgEtaMins: 2.8, incidents: 62 },
  { ward: 'Hebbal Ind.', avgEtaMins: 4.4, incidents: 28 },
  { ward: 'Agrahara / Palace', avgEtaMins: 3.2, incidents: 54 },
  { ward: 'Vijayanagar', avgEtaMins: 3.9, incidents: 38 },
  { ward: 'Chamundi Foothills', avgEtaMins: 4.8, incidents: 19 },
];

const CATEGORY_DATA = [
  { name: 'Trauma Accident', value: 38, color: '#ef4444' },
  { name: 'Cardiac / STEMI', value: 26, color: '#f59e0b' },
  { name: 'Respiratory', value: 16, color: '#00d4ff' },
  { name: 'Obstetric', value: 12, color: '#a855f7' },
  { name: 'Other Medical', value: 8, color: '#22c55e' },
];

export const AnalyticsView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#071321]/90 dark:bg-[#071321]/90 light:bg-white border border-[#168BCE]/30 dark:border-[#168BCE]/30 light:border-slate-200 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#168BCE]/15 border border-[#168BCE]/30 text-xs font-semibold text-[#46C5F5] mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>District Intelligence Metrics</span>
          </div>
          <h2 className="text-2xl font-bold text-white dark:text-white light:text-slate-900">
            Emergency Analytics & Incident Density
          </h2>
          <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-600 mt-1">
            Aggregated operational metrics, dispatch velocity benchmarks, and spatial response analytics.
          </p>
        </div>
      </div>

      {/* Top Benchmark Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#071321]/90 dark:bg-[#071321]/90 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 shadow-xl">
          <p className="text-xs uppercase font-mono text-slate-400">Mean Dispatch Latency</p>
          <h3 className="text-3xl font-black font-mono text-[#00D4FF] mt-1">
            48 <span className="text-sm font-normal text-slate-400">seconds</span>
          </h3>
          <p className="text-[11px] text-emerald-400 mt-1">⚡ Down from 4.2 mins prior to AI</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#071321]/90 dark:bg-[#071321]/90 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 shadow-xl">
          <p className="text-xs uppercase font-mono text-slate-400">Door-to-Cath Lab Time</p>
          <h3 className="text-3xl font-black font-mono text-emerald-400 mt-1">
            28 <span className="text-sm font-normal text-slate-400">minutes</span>
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">National target &lt;90 mins</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#071321]/90 dark:bg-[#071321]/90 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 shadow-xl">
          <p className="text-xs uppercase font-mono text-slate-400">Golden Window Adherence</p>
          <h3 className="text-3xl font-black font-mono text-white dark:text-white light:text-slate-900 mt-1">
            94.8%
          </h3>
          <p className="text-[11px] text-cyan-400 mt-1">100% telemetry verification</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hourly Volume Area Chart */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#071321]/90 dark:bg-[#071321]/90 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white dark:text-white light:text-slate-900">
              Hourly Emergency Call Load & Instant Dispatches
            </h4>
            <span className="text-xs font-mono text-cyan-400">Today (24h Window)</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HOURLY_CALLS_DATA}>
                <defs>
                  <linearGradient id="callsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#168BCE" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#168BCE" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#071321',
                    borderColor: '#168BCE',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Area type="monotone" dataKey="calls" stroke="#00D4FF" fillOpacity={1} fill="url(#callsGrad)" name="112 Calls" />
                <Line type="monotone" dataKey="dispatched" stroke="#22C55E" strokeWidth={2} name="Dispatched Units" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie Chart */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#071321]/90 dark:bg-[#071321]/90 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 shadow-xl space-y-4">
          <h4 className="text-sm font-bold text-white dark:text-white light:text-slate-900">
            Incident Category Breakdown
          </h4>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {CATEGORY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#071321',
                    borderColor: '#168BCE',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1 text-xs">
            {CATEGORY_DATA.map((c, i) => (
              <div key={i} className="flex items-center justify-between text-slate-300 dark:text-slate-300 light:text-slate-700">
                <span className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }}></span>
                  <span>{c.name}</span>
                </span>
                <span className="font-mono font-bold">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ward Breakdown Bar Chart */}
        <div className="lg:col-span-12 p-6 rounded-2xl bg-[#071321]/90 dark:bg-[#071321]/90 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white dark:text-white light:text-slate-900">
              Average Response Time (ETA in Minutes) by Mysuru Wards
            </h4>
            <span className="text-xs text-slate-400">Target &lt;5.0 mins across district</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WARD_ETA_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="ward" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#071321',
                    borderColor: '#168BCE',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="avgEtaMins" fill="#168BCE" radius={[6, 6, 0, 0]} name="Avg ETA (Mins)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
