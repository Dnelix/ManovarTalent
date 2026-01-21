import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';
import { 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Zap,
  ShieldCheck,
  Users,
  Calendar,
  CheckCircle2,
  Maximize2,
  ChevronRight,
  BrainCircuit,
  ArrowRight,
  X,
  Scale,
  Award,
  Trophy,
  Filter
} from 'lucide-react';
import { UserRole } from '../types';

const PERFORMANCE_DATA = {
  'Monthly': [
    { name: 'Week 1', okr: 45, kpi: 55 },
    { name: 'Week 2', okr: 52, kpi: 48 },
    { name: 'Week 3', okr: 48, kpi: 72 },
    { name: 'Week 4', okr: 61, kpi: 85 },
  ],
  'Quarterly': [
    { name: 'Jan', okr: 40, kpi: 60 },
    { name: 'Feb', okr: 30, kpi: 55 },
    { name: 'Mar', okr: 60, kpi: 65 },
    { name: 'Apr', okr: 80, kpi: 82 },
    { name: 'May', okr: 70, kpi: 75 },
    { name: 'Jun', okr: 90, kpi: 88 },
  ]
};

const DISTRIBUTION_CURVE = [
  { name: 'Unsatisfactory', count: 4, color: '#F1F5F9' },
  { name: 'Needs Improvement', count: 12, color: '#E2E8F0' },
  { name: 'Meets Expectations', count: 68, color: '#30B7EE' },
  { name: 'Exceeds Expectations', count: 12, color: '#1659E6' },
  { name: 'Exceptional', count: 4, color: '#0F172A' },
];

const TOP_PERFORMERS = [
  { name: 'Sarah Chen', dept: 'Eng', rating: 4.9, avatar: 'https://picsum.photos/seed/sarah/100/100' },
  { name: 'Marcus Vane', dept: 'Infra', rating: 4.8, avatar: 'https://picsum.photos/seed/marcus/100/100' },
  { name: 'Emily Zhao', dept: 'Creative', rating: 5.0, avatar: 'https://picsum.photos/seed/emily/100/100' },
];

interface DashboardProps {
  role: UserRole;
}

const DashboardPage: React.FC<DashboardProps> = ({ role }) => {
  const [timeframe, setTimeframe] = useState<'Monthly' | 'Quarterly'>('Quarterly');
  const chartData = useMemo(() => PERFORMANCE_DATA[timeframe], [timeframe]);
  const isLeadership = [UserRole.ORG_ADMIN, UserRole.EXECUTIVE, UserRole.MANAGER, UserRole.HR].includes(role);

  const config = useMemo(() => ({
    title: isLeadership ? "Institutional Performance Intelligence" : "My Performance Overview",
    stats: [
      { label: "OKR Progress", value: "65%", trend: "up", icon: <Target size={20}/>, color: "primary" },
      { label: "KPI Velocity", value: "92%", trend: "up", icon: <Activity size={20}/>, color: "green" },
      { label: "Org Health", value: "87%", trend: "neutral", icon: <ShieldCheck size={20}/>, color: "secondary" },
      { label: "Unit Delta", value: "+12%", trend: "up", icon: <Users size={20}/>, color: "primary" }
    ]
  }), [isLeadership]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{config.title}</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time performance context and institutional alignment</p>
        </div>
        <div className="flex items-center space-x-1 bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
          <FilterButton label="Monthly" active={timeframe === 'Monthly'} onClick={() => setTimeframe('Monthly')} />
          <FilterButton label="Quarterly" active={timeframe === 'Quarterly'} onClick={() => setTimeframe('Quarterly')} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {config.stats.map((stat, idx) => (
          <StatsCard key={idx} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
            <div>
              <h3 className="font-bold text-slate-900 tracking-tight">Institutional Performance Velocity</h3>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Strategic Intent vs Operational RKT Streams</p>
            </div>
          </div>
          <div className="h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#64748B'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#64748B'}} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                <Area type="monotone" dataKey="okr" stroke="#E2E8F0" strokeWidth={2} fill="#F8FAFC" />
                <Area type="monotone" dataKey="kpi" stroke="#1659E6" strokeWidth={4} fill="#1659E6" fillOpacity={0.05} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          {isLeadership && (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-slate-900 tracking-tight">Performance Distribution</h3>
                <span className="text-[9px] font-black text-primary bg-primary/5 px-2 py-1 rounded-full uppercase tracking-tighter">Bell-Curve Sync</span>
              </div>
              <div className="h-44 w-full mb-6">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={DISTRIBUTION_CURVE} barGap={4}>
                      <Tooltip cursor={{fill: 'transparent'}} />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                         {DISTRIBUTION_CURVE.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} />
                         ))}
                      </Bar>
                   </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Talent Spotlight</p>
                 {TOP_PERFORMERS.map(person => (
                   <div key={person.name} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl transition-all group cursor-pointer">
                      <div className="flex items-center space-x-3">
                         <img src={person.avatar} className="w-8 h-8 rounded-lg border border-slate-100 shadow-sm" />
                         <div>
                            <p className="text-xs font-bold text-slate-800 group-hover:text-primary transition-colors">{person.name}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase">{person.dept}</p>
                         </div>
                      </div>
                      <div className="flex items-center space-x-1.5 px-2 py-0.5 bg-green-50 text-green-700 rounded-lg">
                         <Award size={10} /><span className="text-[10px] font-black">{person.rating}</span>
                      </div>
                   </div>
                 ))}
              </div>
            </div>
          )}

          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><BrainCircuit size={80} className="text-primary" /></div>
             <h3 className="text-[10px] font-black text-primary uppercase tracking-widest mb-4 border-l-2 border-primary pl-4">Institutional AI Insight</h3>
             <p className="text-xs text-slate-300 leading-relaxed font-medium italic">
                "Calibration bias detected in 'Sales' unit. Ratings show 22% skew toward top bucket compared to historical engineering benchmarks. Recommend calibration session v2."
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterButton = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
  <button onClick={onClick} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${active ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>{label}</button>
);

const StatsCard = ({ label, value, trend, icon, color }: any) => {
  const colorMap: any = { primary: 'text-primary bg-primary/5', green: 'text-green-600 bg-green-50', secondary: 'text-secondary bg-secondary/5' };
  return (
    <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all cursor-pointer group">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-xl ${colorMap[color] || colorMap.primary} group-hover:scale-105 transition-transform`}>{icon}</div>
        <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-green-600 bg-green-50"><ArrowUpRight size={12} /><span>+4%</span></div>
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 leading-none">{label}</p>
      <h4 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h4>
    </div>
  );
};

export default DashboardPage;