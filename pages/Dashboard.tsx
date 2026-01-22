
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Cell, PieChart, Pie, LineChart, Line, ComposedChart, Legend,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { 
  BarChart3,
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
  Filter,
  User,
  MapPin,
  Clock,
  Briefcase,
  Megaphone,
  Bell,
  Star,
  FileText,
  DollarSign,
  Wallet,
  ArrowRightLeft,
  Building2,
  Download,
  Upload,
  Paperclip,
  Trash2,
  ChevronLeft,
  Plus,
  GitBranch,
  Monitor,
  ClipboardList,
  Check,
  Layers,
  Search,
  MoreVertical,
  Flag,
  Settings,
  ShieldAlert,
  Terminal,
  MousePointer2,
  Cpu,
  Mail,
  ClipboardCheck
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
    { name: 'Jun', okr: 90, okr2: 85, kpi: 88 },
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

// --- PRODUCT TEAM MOCK DATA (MANAGER VIEW) ---

const TEAM_VELOCITY_DATA = [
  { name: 'Sprint 1', velocity: 64, okr: 20, cycle: 12 },
  { name: 'Sprint 2', velocity: 78, okr: 35, cycle: 10 },
  { name: 'Sprint 3', velocity: 72, okr: 45, cycle: 11 },
  { name: 'Sprint 4', velocity: 85, okr: 60, cycle: 8 },
  { name: 'Sprint 5', velocity: 92, okr: 75, cycle: 7 },
  { name: 'Sprint 6', velocity: 95, okr: 88, cycle: 6 },
];

const TEAM_SKILL_RADAR = [
  { subject: 'Product Strategy', A: 120, fullMark: 150 },
  { subject: 'UX Design', A: 98, fullMark: 150 },
  { subject: 'Engineering', A: 86, fullMark: 150 },
  { subject: 'Data Analytics', A: 99, fullMark: 150 },
  { subject: 'Growth Ops', A: 85, fullMark: 150 },
];

const TEAM_MEMBERS = [
  { id: 1, name: 'Sarah Chen', role: 'Sr. Product Manager', health: 98, status: 'Active', avatar: 'https://picsum.photos/seed/sarah/100/100', appraisal: 'Completed', level: 'L7', email: 'sarah.c@manovar.ai', velocity: '94%' },
  { id: 2, name: 'Jordan Smith', role: 'Staff Engineer', health: 92, status: 'Active', avatar: 'https://picsum.photos/seed/jordan/100/100', appraisal: 'Completed', level: 'L8', email: 'jordan.s@manovar.ai', velocity: '92%' },
  { id: 3, name: 'Elena Rossi', role: 'Product Designer', health: 85, status: 'Active', avatar: 'https://picsum.photos/seed/elena/100/100', appraisal: 'Pending Review', level: 'L6', email: 'elena.r@manovar.ai', velocity: '88%' },
  { id: 4, name: 'Marcus Vane', role: 'DevOps Lead', health: 42, status: 'At Risk', avatar: 'https://picsum.photos/seed/marcus/100/100', appraisal: 'Draft', level: 'L7', email: 'marcus.v@manovar.ai', velocity: '65%' },
  { id: 5, name: 'Lila Ray', role: 'Product Analyst', health: 76, status: 'Active', avatar: 'https://picsum.photos/seed/lila/100/100', appraisal: 'Pending Review', level: 'L5', email: 'lila.r@manovar.ai', velocity: '82%' },
];

const TEAM_STAR_PERFORMERS = [
  { name: 'Sarah Chen', stars: 5, score: 4.9, avatar: 'https://picsum.photos/seed/sarah/100/100' },
  { name: 'Jordan Smith', stars: 5, score: 4.8, avatar: 'https://picsum.photos/seed/jordan/100/100' },
  { name: 'Emily Zhao', stars: 4, score: 4.5, avatar: 'https://picsum.photos/seed/emily/100/100' },
];

const DEPT_ANNOUNCEMENTS = [
  { id: 1, title: "Product Roadmap Q1 2025 Finalized", time: "1h ago", type: "Strategic", icon: <Target className="text-primary" /> },
  { id: 2, title: "Sprint 42 Retrospective Scheduled", time: "4h ago", type: "Process", icon: <Activity className="text-secondary" /> },
  { id: 3, title: "New API Documentation Policy", time: "1d ago", type: "Governance", icon: <ShieldCheck className="text-indigo-600" /> },
];

interface DashboardProps {
  role: UserRole;
}

const DashboardPage: React.FC<DashboardProps> = ({ role }) => {
  const [timeframe, setTimeframe] = useState<'Monthly' | 'Quarterly'>('Quarterly');
  const chartData = useMemo(() => PERFORMANCE_DATA[timeframe], [timeframe]);
  
  const isEmployee = role === UserRole.EMPLOYEE;
  const isManager = role === UserRole.MANAGER;

  if (isEmployee) return <EmployeeDashboard />;
  if (isManager) return <ManagerDashboard />;

  // LEADERSHIP / ADMIN VIEW
  const config = useMemo(() => ({
    title: "Institutional Performance Intelligence",
    stats: [
      { label: "OKR Progress", value: "65%", trend: "up", icon: <Target size={20}/>, color: "primary" },
      { label: "KPI Velocity", value: "92%", trend: "up", icon: <Activity size={20}/>, color: "green" },
      { label: "Org Health", value: "87%", trend: "neutral", icon: <ShieldCheck size={20}/>, color: "secondary" },
      { label: "Unit Delta", value: "+12%", trend: "up", icon: <Users size={20}/>, color: "primary" }
    ]
  }), []);

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

/**
 * PERSONALIZED MANAGER DASHBOARD (PRODUCT TEAM)
 */
const ManagerDashboard = () => {
  const [selectedPersonnel, setSelectedPersonnel] = useState<any>(null);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* 1. Department Profile Summary (Product Team) */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-all duration-1000 rotate-12">
           <Building2 size={220} className="text-primary" />
        </div>
        <div className="flex items-center space-x-10 relative z-10">
          <div className="relative">
            <div className="w-28 h-28 rounded-4xl bg-gradient-to-br from-primary to-secondary p-1 shadow-2xl">
               <div className="w-full h-full bg-white rounded-[1.75rem] flex items-center justify-center text-primary">
                  <Monitor size={48} />
               </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white border-4 border-white shadow-lg">
               <Zap size={24} />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <span className="px-3 py-1 bg-primary/5 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">Product Strategy Hub</span>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm border border-indigo-100">L7 Operations</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none uppercase">Product Department</h2>
            <p className="text-slate-500 font-bold mt-2 flex items-center uppercase text-base">
               Manager: Alex Rivera <span className="mx-3 text-slate-200">•</span> 42 Active Personnel
            </p>
            <div className="flex items-center space-x-8 mt-6">
              <div className="flex items-center space-x-2.5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                 <Target size={16} className="text-primary" />
                 <span>12 OKR Nodes</span>
              </div>
              <div className="flex items-center space-x-2.5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                 <Activity size={16} className="text-secondary" />
                 <span>94% Sprint Velocity</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-6 px-12 border-l border-slate-100 relative z-10 hidden xl:flex">
           <div className="flex items-center space-x-12">
              <div className="text-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Unit Health</p>
                 <p className="text-4xl font-black text-slate-900">92<span className="text-lg text-slate-300">%</span></p>
              </div>
              <div className="text-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg. Calibration</p>
                 <p className="text-4xl font-black text-slate-900">4.7<span className="text-lg text-slate-300">/5</span></p>
              </div>
           </div>
           <div className="flex justify-center w-full">
              <span className="px-4 py-2 bg-green-50 text-green-700 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border border-green-100 w-full text-center">Top-Tier Performance</span>
           </div>
        </div>
      </div>

      {/* 2. Team Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard label="Team OKR Attainment" value="84.2%" trend="+8%" icon={<Target size={20} />} color="primary" />
        <StatsCard label="Product KPI Velocity" value="96.5%" trend="+2%" icon={<Zap size={20} />} color="secondary" />
        <StatsCard label="Appraisal Completion" value="85%" trend="Active" icon={<ClipboardList size={20} />} color="green" />
        <StatsCard label="Skill Density Index" value="High" trend="Stable" icon={<Award size={20} />} color="secondary" />
      </div>

      {/* 3. Analytical Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Sprint Velocity & OKR Line/Bar */}
        <div className="lg:col-span-8 space-y-8">
           {/* Team Delivery Intelligence Chart */}
           <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-12">
                 <div>
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Team Delivery Intelligence</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Velocity vs Cycle Time vs Strategic Target</p>
                 </div>
                 <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                       <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">OKR Attainment</span>
                    </div>
                    <div className="flex items-center space-x-2">
                       <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">Delivery Index</span>
                    </div>
                 </div>
              </div>
              <div className="h-[400px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={TEAM_VELOCITY_DATA}>
                       <defs>
                          <linearGradient id="primaryGrad" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#1659E6" stopOpacity={0.1}/>
                             <stop offset="95%" stopColor="#1659E6" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94A3B8'}} />
                       <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94A3B8'}} />
                       <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)' }} />
                       <Area type="monotone" name="OKR Progress" dataKey="okr" fill="url(#primaryGrad)" stroke="#1659E6" strokeWidth={4} />
                       <Bar type="monotone" name="Sprint Velocity" dataKey="velocity" fill="#30B7EE" radius={[8, 8, 0, 0]} barSize={50} />
                       <Line type="monotone" name="Cycle Time (Days)" dataKey="cycle" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} />
                    </ComposedChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Team Personnel Board */}
           <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
              <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                 <div>
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Product Personnel Command</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Direct Report Health & Calibration Status</p>
                 </div>
                 <div className="relative group">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input placeholder="Search members..." className="bg-white border border-slate-200 rounded-2xl pl-12 pr-6 py-2.5 text-xs font-bold shadow-sm outline-none focus:ring-4 focus:ring-primary/5 transition-all w-64" />
                 </div>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-slate-50/30 border-b border-slate-100">
                       <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <th className="px-10 py-5">Personnel</th>
                          <th className="px-10 py-5">Health Index</th>
                          <th className="px-10 py-5">Velocity</th>
                          <th className="px-10 py-5">Appraisal</th>
                          <th className="px-10 py-5 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {TEAM_MEMBERS.map((member) => (
                         <tr key={member.id} className="hover:bg-slate-50/50 transition-all group">
                            <td className="px-10 py-5">
                               <div className="flex items-center space-x-4">
                                  <img src={member.avatar} className="w-12 h-12 rounded-2xl border-2 border-white shadow-md group-hover:scale-110 transition-transform" />
                                  <div>
                                     <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{member.name}</p>
                                     <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{member.role} • {member.level}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="px-10 py-5">
                               <div className="flex items-center space-x-4">
                                  <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                     <div className={`h-full ${member.health > 80 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : member.health > 50 ? 'bg-primary' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`} style={{ width: `${member.health}%` }} />
                                  </div>
                                  <span className="text-[10px] font-black text-slate-900">{member.health}%</span>
                               </div>
                            </td>
                            <td className="px-10 py-5">
                               <span className="text-xs font-black text-slate-700">{member.velocity}</span>
                            </td>
                            <td className="px-10 py-5">
                               <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                                 member.appraisal === 'Completed' ? 'bg-green-50 text-green-700 border-green-100' : 
                                 member.appraisal === 'Pending Review' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                                 'bg-slate-100 text-slate-500 border-slate-200'
                               }`}>{member.appraisal}</span>
                            </td>
                            <td className="px-10 py-5 text-right">
                               <div className="flex items-center justify-end space-x-2">
                                  <button 
                                   onClick={() => setSelectedPersonnel(member)}
                                   className="p-2 text-slate-300 hover:text-primary hover:bg-white rounded-xl transition-all shadow-sm"
                                  >
                                   <FileText size={18}/>
                                  </button>
                                  <button className="p-2 text-slate-300 hover:text-primary hover:bg-white rounded-xl transition-all shadow-sm">
                                   <MoreVertical size={18}/>
                                  </button>
                               </div>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
              <div className="p-8 bg-slate-50/50 border-t border-slate-100 text-center">
                 <button className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest">View All unit personnel (42)</button>
              </div>
           </div>
        </div>

        {/* Right Column: Spotlight, Appraisals & Insights */}
        <div className="lg:col-span-4 space-y-8">
           {/* Top Performers Spotlight */}
           <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm space-y-8">
              <div className="flex items-center justify-between">
                 <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
                    <Trophy size={16} className="mr-2 text-amber-500" /> Unit Spotlight
                 </h3>
                 <span className="text-[9px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded uppercase">Elite Tier</span>
              </div>
              <div className="space-y-6">
                 {TEAM_STAR_PERFORMERS.map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:bg-white hover:border-primary/20 hover:shadow-xl transition-all cursor-pointer">
                       <div className="flex items-center space-x-4">
                          <img src={p.avatar} className="w-12 h-12 rounded-2xl border-2 border-white shadow-md" />
                          <div>
                             <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{p.name}</p>
                             <div className="flex items-center space-x-1 text-amber-500 mt-1">
                                {[...Array(5)].map((_, i) => (
                                   <Star key={i} size={10} fill={i < p.stars ? 'currentColor' : 'none'} className={i >= p.stars ? 'text-slate-200' : ''} />
                                ))}
                             </div>
                          </div>
                       </div>
                       <div className="text-right">
                          <span className="text-xl font-black text-slate-900">{p.score}</span>
                          <p className="text-[8px] font-black text-slate-400 uppercase">Rating</p>
                       </div>
                    </div>
                 ))}
              </div>
              <button className="w-full py-4 border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-all">Nominate performance award</button>
           </div>

           {/* Team Appraisals Status Card */}
           <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm space-y-8">
              <div className="flex items-center justify-between">
                 <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
                    <ClipboardCheck size={16} className="mr-2 text-primary" /> Team Appraisals
                 </h3>
                 <span className="text-[9px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded uppercase">Active Cycle</span>
              </div>
              <div className="space-y-4">
                 {TEAM_MEMBERS.map((m) => (
                    <div key={m.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:border-primary/20 transition-all cursor-pointer">
                       <div className="flex items-center space-x-4">
                          <img src={m.avatar} className="w-10 h-10 rounded-xl border border-white shadow-sm" />
                          <span className="text-xs font-black text-slate-700 uppercase tracking-tight truncate max-w-[120px]">{m.name}</span>
                       </div>
                       <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border shadow-sm ${
                         m.appraisal === 'Completed' ? 'bg-green-50 text-green-700 border-green-100' : 
                         m.appraisal === 'Pending Review' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                         'bg-slate-100 text-slate-400 border-slate-200'
                       }`}>{m.appraisal}</span>
                    </div>
                 ))}
              </div>
              <button className="w-full py-3 text-[10px] font-black text-primary hover:underline uppercase tracking-widest">Open Full Appraisal Queue</button>
           </div>

           {/* Announcements Feed */}
           <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm space-y-8">
              <div className="flex items-center justify-between">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
                    <Megaphone size={14} className="mr-2 text-primary" /> Hub Communications
                 </h3>
                 <span className="px-2 py-0.5 bg-primary/5 text-primary rounded-lg text-[8px] font-black uppercase">3 Priority</span>
              </div>
              <div className="space-y-4">
                 {DEPT_ANNOUNCEMENTS.map(ann => (
                   <div key={ann.id} className="p-4 border border-slate-50 bg-slate-50/50 rounded-2xl flex items-center space-x-4 hover:bg-white hover:border-slate-100 transition-all cursor-pointer group">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                         {ann.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                         <p className="text-xs font-black text-slate-900 uppercase tracking-tight truncate leading-none mb-1.5">{ann.title}</p>
                         <div className="flex items-center space-x-2 text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                            <span>{ann.type}</span>
                            <span className="w-0.5 h-0.5 bg-slate-200 rounded-full" />
                            <span>{ann.time}</span>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
              <button className="w-full py-3 text-[10px] font-black text-primary hover:underline uppercase tracking-widest">Open newsroom archive</button>
           </div>

           {/* AI Manager Insight Widget */}
           <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl border border-slate-800">
              <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-all duration-700">
                 <BrainCircuit size={120} className="text-primary" />
              </div>
              <div className="relative z-10 space-y-8">
                 <div className="flex items-center space-x-3 text-primary">
                    <Sparkles size={16} />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Institutional AI Coach</span>
                 </div>
                 <p className="text-lg font-medium text-slate-300 leading-relaxed italic">
                    "Alert: <span className="text-white font-bold underline underline-offset-4">Marcus Vane (L7)</span> health index has dropped by 22% this week. Correlated with PR throughput bottlenecks. Recommend technical sync or resource shift."
                 </p>
                 <div className="flex items-center space-x-4 pt-2">
                    <button className="flex-1 py-3.5 bg-primary text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">Calibrate Unit</button>
                    <button className="p-3.5 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white transition-all"><Settings size={16} /></button>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* --- DETAIL VIEW MODAL (PERSONNEL) --- */}
      {selectedPersonnel && (
        <PersonnelDetailModal 
          person={selectedPersonnel} 
          onClose={() => setSelectedPersonnel(null)} 
        />
      )}
    </div>
  );
};

/**
 * PERSONNEL DETAIL SLIDE-OVER / MODAL
 */
const PersonnelDetailModal = ({ person, onClose }: { person: any, onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-end bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
       <div className="bg-white h-full w-full max-w-xl shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden border-l border-slate-200">
          <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
             <div className="flex items-center space-x-6">
                <div className="relative">
                  <img src={person.avatar} className="w-20 h-20 rounded-3xl border-4 border-white shadow-xl object-cover" alt={person.name} />
                  <div className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-2xl border-4 border-white flex items-center justify-center text-white shadow-lg ${person.health > 50 ? 'bg-green-500' : 'bg-red-500'}`}>
                    <Activity size={14} />
                  </div>
                </div>
                <div>
                   <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">{person.name}</h3>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">{person.role} • {person.level}</p>
                </div>
             </div>
             <button onClick={onClose} className="p-3 text-slate-300 hover:text-slate-600 hover:bg-white rounded-2xl transition-all shadow-sm"><X size={28}/></button>
          </div>

          <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar bg-white">
             {/* Stats Row */}
             <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-slate-50 border border-slate-100 rounded-[2.5rem] space-y-2">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Health Index</p>
                   <p className={`text-3xl font-black ${person.health > 50 ? 'text-primary' : 'text-red-500'}`}>{person.health}%</p>
                </div>
                <div className="p-6 bg-slate-50 border border-slate-100 rounded-[2.5rem] space-y-2">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sprint Velocity</p>
                   <p className="text-3xl font-black text-slate-900">{person.velocity}</p>
                </div>
             </div>

             {/* Personal OKR Snapshot */}
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Horizon Objectives</h4>
                   <span className="text-[9px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded uppercase">Active Calibration</span>
                </div>
                <div className="space-y-3">
                   <div className="p-5 border border-slate-100 rounded-3xl bg-white shadow-sm flex items-center justify-between group hover:border-primary/20 transition-all">
                      <div className="flex items-center space-x-4">
                         <div className="p-2 bg-slate-50 rounded-xl text-primary"><Target size={18}/></div>
                         <p className="text-xs font-black text-slate-700 uppercase tracking-tight">Core API Resilience</p>
                      </div>
                      <span className="text-xs font-black text-slate-900">82%</span>
                   </div>
                   <div className="p-5 border border-slate-100 rounded-3xl bg-white shadow-sm flex items-center justify-between group hover:border-primary/20 transition-all">
                      <div className="flex items-center space-x-4">
                         <div className="p-2 bg-slate-50 rounded-xl text-secondary"><Monitor size={18}/></div>
                         <p className="text-xs font-black text-slate-700 uppercase tracking-tight">UI Pattern Unification</p>
                      </div>
                      <span className="text-xs font-black text-slate-900">64%</span>
                   </div>
                </div>
             </div>

             {/* Personal Performance Insight */}
             <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-xl">
                <div className="absolute top-0 right-0 p-8 opacity-10"><BrainCircuit size={140} className="text-primary" /></div>
                <div className="relative z-10">
                   <div className="flex items-center space-x-3 mb-6 text-primary">
                      <Sparkles size={18} />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">AI Performance Profile</span>
                   </div>
                   <p className="text-lg font-medium text-slate-300 leading-relaxed italic mb-8">
                      "Analysis indicates high strategic alignment but recent latency in peer review cycles. Recommend reducing technical documentation overhead by 15% to boost PR throughput."
                   </p>
                   <div className="flex items-center space-x-4">
                      <button className="px-6 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-105">Calibrate Node</button>
                      <button className="px-6 py-2.5 bg-white/5 border border-white/10 text-white/60 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">View Full Dossier</button>
                   </div>
                </div>
             </div>

             {/* Communication Context */}
             <div className="space-y-4">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Institutional Contact</h4>
                <div className="p-6 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-center justify-between">
                   <div className="flex items-center space-x-4">
                      <div className="p-3 bg-white rounded-2xl text-slate-400"><Mail size={18} /></div>
                      <div>
                         <p className="text-sm font-black text-slate-900 truncate max-w-[200px]">{person.email}</p>
                         <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Primary Gateway</p>
                      </div>
                   </div>
                   <button className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm">Direct DM</button>
                </div>
             </div>
          </div>

          <div className="p-10 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
             <button onClick={onClose} className="text-xs font-black text-slate-400 hover:text-slate-800 transition-colors uppercase tracking-widest">Discard View</button>
             <button 
              onClick={onClose}
              className="px-12 py-4 bg-slate-900 text-white rounded-[2rem] text-xs font-black uppercase tracking-widest shadow-2xl hover:scale-[1.02] transition-all"
             >
                Archive Observations
             </button>
          </div>
       </div>
    </div>
  );
};

/**
 * PERSONALIZED EMPLOYEE DASHBOARD (SALES LEAD - LAPO MFB NIGERIA)
 */
const EmployeeDashboard = () => {
  const [isAssessmentStudioOpen, setIsAssessmentStudioOpen] = useState(false);
  const [isSubmitEvidenceOpen, setIsSubmitEvidenceOpen] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* 1. Profile Summary & LAPO Identity Header */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-all duration-700">
           <Building2 size={160} className="text-primary" />
        </div>
        <div className="flex items-center space-x-8 relative z-10">
          <div className="relative">
            <img src="https://picsum.photos/seed/tunde/100/100" className="w-24 h-24 rounded-3xl border-4 border-slate-50 shadow-2xl object-cover" alt="Tunde Ogunsanya" />
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white border-4 border-white shadow-lg">
               <ShieldCheck size={20} />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm">Verified Sales Lead</span>
              <span className="px-2.5 py-1 bg-primary/5 text-primary rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm">LAPO MFB Hub</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">Tunde Ogunsanya</h2>
            <p className="text-slate-500 font-bold mt-2 flex items-center uppercase text-sm">
               Regional Sales Lead <span className="mx-3 text-slate-200">•</span> Lagos Mainland Unit
            </p>
            <div className="flex items-center space-x-6 mt-4">
              <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 <MapPin size={14} className="text-primary" />
                 <span>Ikeja, Lagos, Nigeria</span>
              </div>
              <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 <Clock size={14} className="text-primary" />
                 <span>Joined: July 2021</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-12 px-12 border-l border-slate-100 relative z-10 hidden lg:flex">
           <div className="text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Current Rating</p>
              <p className="text-3xl font-black text-slate-900">4.9<span className="text-lg text-slate-300">/5</span></p>
           </div>
           <div className="text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Sales Rank</p>
              <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-[10px] font-black uppercase tracking-widest border border-amber-100 shadow-sm flex items-center space-x-1">
                 <Trophy size={10} />
                 <span>#1 Region-Wide</span>
              </span>
           </div>
        </div>
      </div>

      {/* 2. Real-Time Sales KPI Stats (Nigerian Context) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard label="Monthly Disbursement" value="₦42.5M" trend="+24%" icon={<Wallet size={20} />} color="primary" />
        <StatsCard label="New Micro-Leads" value="142" trend="+18" icon={<Users size={20} />} color="secondary" />
        <StatsCard label="Portfolio Quality (PAR)" value="1.2%" trend="-0.4%" icon={<ShieldCheck size={20} />} color="green" />
        <StatsCard label="Repayment Velocity" value="98.8%" trend="Stable" icon={<Activity size={20} />} color="secondary" />
      </div>

      {/* 3. Main Dashboard Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Rich Analytics & Appraisal */}
        <div className="lg:col-span-8 space-y-8">
           {/* Disbursement vs Onboarding Analysis */}
           <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm relative">
              <div className="flex items-center justify-between mb-12">
                 <div>
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Institutional Performance Stream</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Daily Disbursement Volume (₦M) vs Micro-Client Acquisition</p>
                 </div>
                 <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-xl">
                    <button className="px-4 py-1.5 text-[9px] font-black uppercase bg-white text-primary rounded-lg shadow-sm">Daily</button>
                    <button className="px-4 py-1.5 text-[9px] font-black uppercase text-slate-400 hover:text-slate-600">Monthly</button>
                 </div>
              </div>
              <div className="h-[380px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={SALES_KPI_DATA}>
                       <defs>
                          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#1659E6" stopOpacity={0.1}/>
                             <stop offset="95%" stopColor="#1659E6" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94A3B8'}} />
                       <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94A3B8'}} />
                       <Tooltip 
                         contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)' }}
                         cursor={{stroke: '#1659E6', strokeWidth: 1, strokeDasharray: '4 4'}}
                       />
                       <Legend verticalAlign="top" height={36} iconType="circle" />
                       <Area type="monotone" name="Disbursement (₦M)" dataKey="revenue" fill="url(#revGrad)" stroke="#1659E6" strokeWidth={4} />
                       <Bar type="monotone" name="New Onboardings" dataKey="onboarding" fill="#30B7EE" radius={[6, 6, 0, 0]} barSize={40} />
                       <Line type="monotone" name="Target Baseline" dataKey="target" stroke="#F59E0B" strokeDasharray="5 5" strokeWidth={2} dot={false} />
                    </ComposedChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Row: Portfolio Mix & Leaderboard */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Portfolio Distribution */}
              <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm flex flex-col">
                 <div className="mb-8">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Active Portfolio Mix</h3>
                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Loan Sector Weighting</p>
                 </div>
                 <div className="h-64 flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                          <Pie
                            data={PORTFOLIO_MIX}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {PORTFOLIO_MIX.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                       </PieChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="grid grid-cols-2 gap-3 mt-4">
                    {PORTFOLIO_MIX.map(item => (
                       <div key={item.name} className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-[9px] font-black text-slate-600 uppercase tracking-tight">{item.name}</span>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Hub Leaderboard */}
              <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm flex flex-col">
                 <div className="flex items-center justify-between mb-8">
                    <div>
                       <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Sales Leaderboard</h3>
                       <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Lagos Hub Performance Ranking</p>
                    </div>
                    <button className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:text-primary transition-all"><Maximize2 size={16} /></button>
                 </div>
                 <div className="space-y-4 flex-1">
                    {LEADERBOARD.map((item, idx) => (
                       <div key={item.name} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${item.position === 1 ? 'bg-primary/5 border-primary/20 ring-1 ring-primary/10' : 'bg-slate-50 border-slate-100 hover:bg-white'}`}>
                          <div className="flex items-center space-x-3">
                             <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${item.position === 1 ? 'bg-primary text-white' : 'bg-white text-slate-400 border border-slate-200 shadow-sm'}`}>
                                {item.position}
                             </div>
                             <img src={item.avatar} className="w-8 h-8 rounded-lg border border-white shadow-sm" />
                             <div>
                                <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{item.name}</p>
                                <p className="text-[9px] text-slate-400 font-bold uppercase">{item.volume}</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <div className="flex items-center space-x-1 text-amber-500">
                                <Star size={10} fill="currentColor" />
                                <span className="text-xs font-black">{item.score}</span>
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Appraisal Progression Ledger */}
           <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
              <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                 <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-primary shadow-sm"><FileText size={24}/></div>
                    <div>
                       <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Active Performance Horizon</h3>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Cycle: Q4 2024 Institutional Review</p>
                    </div>
                 </div>
                 <div className="flex items-center space-x-3">
                    <div className="text-right hidden md:block">
                       <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Exit Rating Status</p>
                       <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded-md text-[8px] font-black uppercase border border-green-100">Highly Probable Exceptional</span>
                    </div>
                    <button 
                      onClick={() => setIsSubmitEvidenceOpen(true)}
                      className="px-6 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                    >
                      Submit Evidence
                    </button>
                 </div>
              </div>
              <div className="p-10 space-y-10">
                 <div className="flex items-center justify-between">
                    <div className="space-y-2">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Overall Progress</p>
                       <p className="text-4xl font-black text-slate-900 tracking-tighter">72%</p>
                    </div>
                    <div className="flex-1 max-w-md mx-12">
                       <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner flex">
                          <div className="h-full bg-primary relative group" style={{ width: '45%' }}>
                             <div className="absolute right-0 top-0 h-full w-px bg-white/20" />
                          </div>
                          <div className="h-full bg-secondary opacity-80" style={{ width: '27%' }} />
                       </div>
                       <div className="flex justify-between mt-3">
                          <span className="text-[9px] font-black text-primary uppercase">Strategic OKRs (45%)</span>
                          <span className="text-[9px] font-black text-secondary uppercase">Operational KPIs (27%)</span>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Current Stage</p>
                       <p className="text-sm font-black text-amber-600 uppercase tracking-tight mt-1 flex items-center justify-end">
                          <Clock size={14} className="mr-1.5" /> Self-Appraisal Finalizing
                       </p>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between group hover:bg-white hover:border-primary/20 transition-all cursor-pointer">
                       <div className="flex items-center space-x-4">
                          <div className="p-3 bg-white rounded-2xl text-primary shadow-sm group-hover:scale-110 transition-transform"><Target size={20}/></div>
                          <div>
                             <p className="text-xs font-black text-slate-900 uppercase">Micro-Credit Growth</p>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">3 of 4 Success vectors complete</p>
                          </div>
                       </div>
                       <ChevronRight size={18} className="text-slate-200 group-hover:text-primary transition-colors" />
                    </div>
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between group hover:bg-white hover:border-primary/20 transition-all cursor-pointer">
                       <div className="flex items-center space-x-4">
                          <div className="p-3 bg-white rounded-2xl text-secondary shadow-sm group-hover:scale-110 transition-transform"><Users size={20}/></div>
                          <div>
                             <p className="text-xs font-black text-slate-900 uppercase">Institutional Peer Signal</p>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">6 Feedbacks verified</p>
                          </div>
                       </div>
                       <ChevronRight size={18} className="text-slate-200 group-hover:text-primary transition-colors" />
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Column: Context Hub & Notifications */}
        <div className="lg:col-span-4 space-y-8">
           {/* Current Cycle Focus Widget */}
           <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl border border-slate-800">
              <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-all duration-700">
                 <Calendar size={120} className="text-primary" />
              </div>
              <div className="relative z-10 space-y-8">
                 <div className="flex items-center space-x-3 text-primary">
                    <Clock size={16} />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Institutional Window</span>
                 </div>
                 <div>
                    <h4 className="text-3xl font-black tracking-tight leading-tight uppercase">Q4 Strategic Evaluation</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Final window for evidence upload</p>
                 </div>
                 <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                       <span>Phase: Self-Appraisal</span>
                       <span className="text-primary">6 Days Remaining</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-primary w-[75%] animate-pulse" />
                    </div>
                 </div>
                 <button 
                  onClick={() => setIsAssessmentStudioOpen(true)}
                  className="w-full py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                 >
                   Launch Assessment Studio
                 </button>
              </div>
           </div>

           {/* Announcements / Updates */}
           <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm space-y-8">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
                    <Megaphone size={14} className="mr-2" /> Communications Center
                 </h3>
                 <span className="px-2 py-0.5 bg-primary/5 text-primary rounded-lg text-[8px] font-black uppercase">4 Priority</span>
              </div>
              <div className="space-y-4">
                 {ANNOUNCEMENTS.map(ann => (
                   <div key={ann.id} className="p-4 border border-slate-50 bg-slate-50/50 rounded-2xl flex items-center space-x-4 hover:bg-white hover:border-slate-100 transition-all cursor-pointer group">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                         {ann.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                         <p className="text-xs font-black text-slate-900 uppercase tracking-tight truncate leading-none mb-1.5">{ann.title}</p>
                         <div className="flex items-center space-x-2 text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                            <span>{ann.type}</span>
                            <span className="w-0.5 h-0.5 bg-slate-200 rounded-full" />
                            <span>{ann.time}</span>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
              <button className="w-full py-3 text-[10px] font-black text-primary hover:underline uppercase tracking-widest">Open Institutional Newsroom</button>
           </div>

           {/* Last Cycle Appraisal Summary Card */}
           <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-8 shadow-inner flex flex-col space-y-6">
              <div className="flex items-center justify-between">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Q3 2024 ARCHIVE</h3>
                 <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded-lg text-[8px] font-black uppercase">Verified</span>
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-600">Calibration Score</span>
                    <span className="text-xl font-black text-slate-900">4.8 / 5.0</span>
                 </div>
                 <div className="p-4 bg-white rounded-2xl border border-slate-100 italic font-medium text-[10px] text-slate-500 leading-relaxed shadow-sm">
                    "Tunde continues to demonstrate exceptional strategic disbursement leadership in the micro-finance sector. Portfolio quality remains top-decile."
                 </div>
              </div>
              <button className="w-full py-3 border border-slate-200 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center space-x-2">
                 <Download size={14} />
                 <span>Download Full Report</span>
              </button>
           </div>

           {/* Real-Time Goal Pulse */}
           <div className="bg-primary rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity rotate-12">
                 <Sparkles size={80} />
              </div>
              <h3 className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-4">AI Performance Coach</h3>
              <p className="text-xs font-medium leading-relaxed italic mb-6">
                 "You are currently tracking <span className="text-white font-black underline underline-offset-4">12% ahead</span> of the disbursement baseline. Focus on Agric Credit onboarding this week to maximize Q4 bonus triggers."
              </p>
              <div className="flex items-center space-x-2 text-[9px] font-black uppercase bg-white/10 p-2 rounded-lg border border-white/10 backdrop-blur-sm">
                 <BrainCircuit size={14} />
                 <span>Strategic Insight: On-Track</span>
              </div>
           </div>
        </div>
      </div>

      {/* --- MODALS & WORKSPACES --- */}

      {isAssessmentStudioOpen && (
        <AssessmentStudioWorkspace onClose={() => setIsAssessmentStudioOpen(false)} objectives={MOCK_OBJECTIVES} />
      )}

      {isSubmitEvidenceOpen && (
        <SubmitEvidenceModal onClose={() => setIsSubmitEvidenceOpen(false)} objectives={MOCK_OBJECTIVES} />
      )}
    </div>
  );
};

/**
 * Submit Evidence Modal Interface
 */
const SubmitEvidenceModal = ({ onClose, objectives }: { onClose: () => void, objectives: any[] }) => {
  const [selectedObjId, setSelectedObjId] = useState(objectives[0]?.id || '');
  const [narrative, setNarrative] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<any[]>([]);

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setFiles([...files, { id: Date.now(), name: `artifact_proof_${Date.now()}.pdf`, size: '2.4 MB' }]);
      setIsUploading(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-5">
            <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20">
              <Paperclip size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">Submit Evidence</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">Attach performance artifacts for calibration</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-600 transition-all"><X size={28}/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-12 space-y-8 custom-scrollbar bg-white">
          <div className="space-y-4">
             <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Target Strategic Anchor</label>
             <select 
              value={selectedObjId}
              onChange={e => setSelectedObjId(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-sm outline-none focus:ring-4 focus:ring-primary/5 transition-all shadow-inner appearance-none cursor-pointer"
             >
                {objectives.map(o => <option key={o.id} value={o.id}>{o.title}</option>)}
             </select>
          </div>

          <div className="space-y-4">
             <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Qualitative Narrative</label>
             <textarea 
              value={narrative}
              onChange={e => setNarrative(e.target.value)}
              placeholder="Describe how this artifact proves your achievement against this objective..."
              className="w-full bg-slate-50 border-none rounded-[2rem] p-8 text-sm font-medium outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all h-40 resize-none shadow-inner"
             />
          </div>

          <div className="space-y-4">
             <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Artifact Upload</label>
             <div className="space-y-4">
                {files.map(f => (
                  <div key={f.id} className="flex items-center space-x-3 bg-slate-50 border border-slate-100 rounded-2xl animate-in zoom-in-95">
                     <div className="flex items-center space-x-3">
                        <FileText size={18} className="text-slate-400" />
                        <div>
                          <p className="text-xs font-black text-slate-700 truncate max-w-[280px]">{f.name}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase">{f.size}</p>
                        </div>
                     </div>
                     <button onClick={() => setFiles(files.filter(x => x.id !== f.id))} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                     </button>
                  </div>
                ))}
                
                <button 
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="w-full border-2 border-dashed border-slate-100 rounded-[2.5rem] py-12 flex flex-col items-center justify-center text-slate-300 hover:text-primary hover:border-primary/30 transition-all group bg-slate-50/50"
                >
                   {isUploading ? (
                     <Activity size={32} className="animate-spin text-primary" />
                   ) : (
                     <>
                        <Upload size={32} className="mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Select Supporting Documents</span>
                        <span className="text-[9px] text-slate-400 mt-2 font-bold italic">Max size: 50MB</span>
                     </>
                   )}
                </button>
             </div>
          </div>
        </div>

        <div className="p-10 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
           <button onClick={onClose} className="px-8 py-3 text-xs font-black text-slate-400 hover:text-slate-800 transition-colors uppercase tracking-widest">Discard</button>
           <button 
            disabled={!narrative || files.length === 0}
            onClick={onClose}
            className="px-14 py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30"
           >
              Upload Artifacts
           </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Assessment Studio Workspace - Immersive Experience
 */
const AssessmentStudioWorkspace = ({ onClose, objectives }: { onClose: () => void, objectives: any[] }) => {
  const [activeObjIndex, setActiveObjIndex] = useState(0);
  const [scores, setScores] = useState<Record<string, { score: number, comment: string }>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeObj = objectives[activeObjIndex];

  const handleUpdateScore = (krId: string, val: number) => {
    setScores(prev => ({ ...prev, [krId]: { ...prev[krId], score: val } }));
  };

  const handleUpdateComment = (krId: string, val: string) => {
    setScores(prev => ({ ...prev, [krId]: { ...prev[krId], comment: val } }));
  };

  const calculateProgress = (obj: any) => {
    if (obj.krs.length === 0) return 0;
    const filled = obj.krs.filter((kr: any) => (scores[kr.id]?.score || 0) > 0).length;
    return Math.round((filled / obj.krs.length) * 100);
  };

  const allComplete = objectives.every(obj => obj.krs.every((kr: any) => (scores[kr.id]?.score || 0) > 0));

  if (isSubmitting) {
    return (
      <div className="fixed inset-0 z-[500] bg-white flex flex-col items-center justify-center p-12 text-center space-y-8 animate-in fade-in duration-700">
         <div className="w-32 h-32 bg-green-50 text-green-500 rounded-[3rem] flex items-center justify-center shadow-xl shadow-green-100 border-2 border-green-100 animate-bounce">
            <CheckCircle2 size={64} />
         </div>
         <div className="space-y-4">
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">Assessment Synchronized</h2>
            <p className="text-slate-500 font-bold max-w-md mx-auto leading-relaxed">Your self-assessment has been successfully captured and dispatched to the hub calibration queue.</p>
         </div>
         <button onClick={onClose} className="px-12 py-5 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">Return to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[400] bg-slate-50 flex flex-col animate-in slide-in-from-bottom duration-500">
       <header className="h-24 bg-white border-b border-slate-200 flex items-center justify-between px-12 shrink-0 shadow-sm z-10">
          <div className="flex items-center space-x-6">
             <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-100">
                <ClipboardList size={28} />
             </div>
             <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">Assessment Studio v2.4</h2>
                <p className="text-[11px] text-slate-400 font-bold uppercase mt-1.5 tracking-[0.2em]">Institutional Pulse: Q4 Strategic Evaluation</p>
             </div>
          </div>
          <div className="flex items-center space-x-8">
             <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Workspace Status</span>
                <span className="text-[11px] font-black text-green-600 uppercase flex items-center"><ShieldCheck size={14} className="mr-1.5"/> Data Policy Integrity: Active</span>
             </div>
             <button onClick={onClose} className="p-4 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-2xl transition-all"><X size={32}/></button>
          </div>
       </header>

       <div className="flex-1 flex overflow-hidden">
          <aside className="w-96 border-r border-slate-200 bg-white flex flex-col shrink-0">
             <div className="p-10 border-b border-slate-50">
                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6">Evaluation Path</h3>
                <div className="space-y-3">
                   {objectives.map((obj, i) => {
                     const progress = calculateProgress(obj);
                     const isActive = activeObjIndex === i;
                     return (
                       <button 
                        key={obj.id} 
                        onClick={() => setActiveObjIndex(i)}
                        className={`w-full p-5 rounded-[1.5rem] border-2 transition-all flex items-center justify-between text-left group ${isActive ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-200'}`}
                       >
                          <div className="flex items-center space-x-4 min-w-0">
                             <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-sm ${isActive ? 'bg-white/20' : 'bg-slate-50 text-slate-400 group-hover:text-indigo-600'}`}>
                                {i + 1}
                             </div>
                             <span className="text-[11px] font-black uppercase tracking-tight truncate leading-tight">{obj.title}</span>
                          </div>
                          {progress === 100 && <Check size={20} className={isActive ? 'text-white' : 'text-green-500'} />}
                       </button>
                     );
                   })}
                </div>
             </div>
             <div className="mt-auto p-10 bg-slate-50/50 border-t border-slate-50 space-y-8">
                <div className="space-y-4">
                   <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      <span>Session Attainment</span>
                      <span className="text-indigo-600">{Math.round((objectives.reduce((acc, curr) => acc + calculateProgress(curr), 0) / (objectives.length * 100)) * 100)}%</span>
                   </div>
                   <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${(objectives.reduce((acc, curr) => acc + calculateProgress(curr), 0) / (objectives.length * 100)) * 100}%` }} />
                   </div>
                </div>
                <button 
                  disabled={!allComplete}
                  onClick={() => setIsSubmitting(true)}
                  className={`w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl transition-all ${allComplete ? 'bg-slate-900 text-white shadow-slate-200 hover:scale-[1.02] active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-50'}`}
                >
                   Finalize Record
                </button>
             </div>
          </aside>

          <main className="flex-1 overflow-y-auto custom-scrollbar p-16 bg-white">
             <div className="max-w-4xl mx-auto space-y-16">
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                   <div className="flex items-center space-x-6">
                      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl ${activeObj.type === 'KPI' ? 'bg-secondary text-white' : 'bg-primary text-white'}`}>
                        {activeObj.type === 'KPI' ? <Zap size={36} /> : <Target size={36} />}
                      </div>
                      <div>
                         <span className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.3em]">Horizon Pillar {activeObjIndex + 1} of {objectives.length}</span>
                         <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none mt-2">{activeObj.title}</h1>
                      </div>
                   </div>
                   <div className="p-8 bg-slate-900 rounded-[2.5rem] flex items-center justify-between shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-5"><BrainCircuit size={100} className="text-primary" /></div>
                      <p className="text-sm font-medium text-slate-400 italic max-w-xl leading-relaxed relative z-10">
                        "Your real-time velocity for this anchor is currently tracking <span className="text-white font-bold">14% ahead</span> of historical benchmarks. Ensure your self-assessment reflects this specific performance delta."
                      </p>
                      <div className="text-right relative z-10">
                         <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1.5">Sector Yield</p>
                         <p className="text-4xl font-black text-white">{calculateProgress(activeObj)}%</p>
                      </div>
                   </div>
                </div>

                <div className="space-y-12 pb-32">
                   {activeObj.krs.map((kr: any, idx: number) => (
                     <div key={kr.id} className="bg-slate-50 border border-slate-200 rounded-[3rem] p-10 space-y-12 group hover:bg-white hover:border-indigo-600/20 transition-all duration-700">
                        <div className="flex items-start justify-between border-b border-slate-200/50 pb-8">
                           <div className="flex items-center space-x-5">
                              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 shadow-sm border border-slate-100 transition-all group-hover:scale-110">
                                 <GitBranch size={24} />
                              </div>
                              <div>
                                 <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight group-hover:text-indigo-600 transition-colors leading-tight">{kr.title}</h3>
                                 <p className="text-[11px] font-bold text-slate-400 uppercase mt-2 tracking-[0.2em]">Vector {idx + 1} • Target: {kr.target}{kr.unit}</p>
                              </div>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                           <div className="lg:col-span-4 space-y-6">
                              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Calibration Intensity</label>
                              <div className="relative group">
                                 <input 
                                    type="number" 
                                    value={scores[kr.id]?.score || ''} 
                                    onChange={(e) => handleUpdateScore(kr.id, Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                                    placeholder="0-100"
                                    className="w-full bg-white border-none rounded-2xl px-10 py-6 font-black text-4xl outline-none focus:ring-8 focus:ring-indigo-600/5 transition-all shadow-xl text-center" 
                                 />
                                 <span className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-200 font-black text-2xl group-focus-within:text-indigo-200">%</span>
                              </div>
                           </div>

                           <div className="lg:col-span-8 space-y-6">
                              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Institutional Context (Narrative)</label>
                              <textarea 
                                value={scores[kr.id]?.comment || ''}
                                onChange={(e) => handleUpdateComment(kr.id, e.target.value)}
                                placeholder="Describe the tactical implementation details that validate your score..."
                                className="w-full bg-white border-none rounded-[2rem] p-10 text-base font-medium outline-none focus:ring-8 focus:ring-indigo-600/5 transition-all h-48 resize-none shadow-xl"
                              />
                           </div>
                        </div>
                     </div>
                   ))}

                   <div className="flex items-center justify-between pt-20">
                      <button 
                        disabled={activeObjIndex === 0}
                        onClick={() => setActiveObjIndex(activeObjIndex - 1)}
                        className="flex items-center space-x-3 px-10 py-5 border border-slate-200 bg-white text-slate-600 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-all disabled:opacity-30 shadow-sm"
                      >
                         <ChevronLeft size={20} />
                         <span>Previous Strategic Node</span>
                      </button>
                      <button 
                        disabled={activeObjIndex === objectives.length - 1}
                        onClick={() => setActiveObjIndex(activeObjIndex + 1)}
                        className="flex items-center space-x-4 px-14 py-5 bg-indigo-600 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30"
                      >
                         <span>Next Calibration Vector</span>
                         <ChevronRight size={20} />
                      </button>
                   </div>
                </div>
             </div>
          </main>
       </div>
    </div>
  );
};

const FilterButton = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
  <button onClick={onClick} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${active ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>{label}</button>
);

const StatsCard = ({ label, value, trend, icon, color }: any) => {
  const colorMap: any = { 
    primary: 'text-primary bg-primary/5', 
    green: 'text-green-600 bg-green-50', 
    secondary: 'text-secondary bg-secondary/5' 
  };
  return (
    <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all cursor-pointer group">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-xl ${colorMap[color] || colorMap.primary} group-hover:scale-105 transition-transform shadow-inner`}>{icon}</div>
        {trend && (
          <div className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${trend.startsWith('+') ? 'text-green-600 bg-green-50' : 'text-slate-500 bg-slate-50'}`}>
            {trend.startsWith('+') ? <ArrowUpRight size={12} /> : null}
            <span>{trend}</span>
          </div>
        )}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 leading-none">{label}</p>
      <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-none">{value}</h4>
    </div>
  );
};

// --- HELPER DATA FOR EMPLOYEE ---
const SALES_KPI_DATA = [
  { name: 'Mon', revenue: 2.4, onboarding: 12, target: 2.0 },
  { name: 'Tue', revenue: 3.1, onboarding: 8, target: 2.0 },
  { name: 'Wed', revenue: 1.8, onboarding: 15, target: 2.0 },
  { name: 'Thu', revenue: 4.5, onboarding: 22, target: 2.0 },
  { name: 'Fri', revenue: 3.8, onboarding: 18, target: 2.0 },
  { name: 'Sat', revenue: 1.2, onboarding: 5, target: 2.0 },
  { name: 'Sun', revenue: 0.5, onboarding: 2, target: 2.0 },
];

const PORTFOLIO_MIX = [
  { name: 'SME Loans', value: 45, color: '#1659E6' },
  { name: 'Agric Credits', value: 25, color: '#10B981' },
  { name: 'Retail Micro', value: 20, color: '#30B7EE' },
  { name: 'Education', value: 10, color: '#F59E0B' },
];

const LEADERBOARD = [
  { name: 'Tunde Ogunsanya', position: 1, volume: '₦42.5M', score: 4.9, avatar: 'https://picsum.photos/seed/tunde/100/100' },
  { name: 'Chidi Okoro', position: 2, volume: '₦38.2M', score: 4.7, avatar: 'https://picsum.photos/seed/chidi/100/100' },
  { name: 'Bisi Adebowale', position: 3, volume: '₦35.9M', score: 4.5, avatar: 'https://picsum.photos/seed/bisi/100/100' },
];

const ANNOUNCEMENTS = [
  { id: 1, title: "New Q4 SME Loan Policy - LAPO MFB", time: "2h ago", type: "Policy", icon: <Building2 className="text-primary" /> },
  { id: 2, title: "Lagos Hub Weekly Sales Winner", time: "1d ago", type: "Event", icon: <Trophy className="text-amber-500" /> },
  { id: 3, title: "System Maintenance: RKT Stream Sync", time: "3d ago", type: "System", icon: <Activity className="text-secondary" /> },
];

// Added MOCK_OBJECTIVES to fix "Cannot find name 'MOCK_OBJECTIVES'" error.
const MOCK_OBJECTIVES = [
  {
    id: 'obj-1',
    title: 'Achieve AI Product Leadership',
    type: 'OKR',
    krs: [
      { id: 'kr-1', title: 'Maintain < 200ms latency', target: 200, unit: 'ms' },
      { id: 'kr-2', title: 'Scale to 50k concurrent requests', target: 50000, unit: 'req' }
    ]
  },
  {
    id: 'obj-2',
    title: 'Customer Centricity Re-platforming',
    type: 'OKR',
    krs: [
      { id: 'kr-3', title: 'Achieve 95% satisfaction index', target: 95, unit: '%' }
    ]
  }
];

export default DashboardPage;
