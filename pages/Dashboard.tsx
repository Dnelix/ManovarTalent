import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Cell, PieChart, Pie, ComposedChart, Line, Legend,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter, ZAxis
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
  Building2,
  Download,
  Plus,
  Monitor,
  ClipboardList,
  Search,
  MoreVertical,
  Settings,
  ShieldAlert,
  Terminal,
  PieChart as PieChartIcon,
  Gauge,
  Flag,
  Globe,
  Layers,
  Fingerprint,
  RefreshCw,
  Cpu,
  Flame,
  Timer
} from 'lucide-react';
import { UserRole } from '../types';

// --- ENHANCED MOCK DATA FOR ORG ADMIN ---

const PERFORMANCE_VELOCITY_DATA = [
  { name: 'M1', reality: 45, projection: 40, risk: 10 },
  { name: 'M2', reality: 52, projection: 55, risk: 12 },
  { name: 'M3', reality: 48, projection: 60, risk: 15 },
  { name: 'M4', reality: 61, projection: 72, risk: 14 },
  { name: 'M5', reality: 75, projection: 78, risk: 10 },
  { name: 'M6', reality: 88, projection: 85, risk: 8 },
];

const STRATEGIC_RADAR_DATA = [
  { subject: 'Customer Success', A: 120, B: 110, fullMark: 150 },
  { subject: 'Financial Margin', A: 98, B: 130, fullMark: 150 },
  { subject: 'Operational R&D', A: 86, B: 130, fullMark: 150 },
  { subject: 'Talent Retention', A: 99, B: 100, fullMark: 150 },
  { subject: 'Risk Governance', A: 85, B: 90, fullMark: 150 },
  { subject: 'Market Expansion', A: 65, B: 85, fullMark: 150 },
];

const CROSS_UNIT_EFFICIENCY_DATA = [
  { name: 'Engineering', attainment: 92, velocity: 85, load: 78 },
  { name: 'Sales', attainment: 78, velocity: 94, load: 82 },
  { name: 'Marketing', attainment: 84, velocity: 72, load: 60 },
  { name: 'Finance', attainment: 98, velocity: 90, load: 45 },
  { name: 'Legal', attainment: 95, velocity: 82, load: 50 },
  { name: 'Ops', attainment: 82, velocity: 88, load: 92 },
];

const PERSONNEL_MATURITY_DATA = [
  { name: 'Eng', L1: 10, L4: 20, L7: 8, Exec: 2 },
  { name: 'Sales', L1: 15, L4: 10, L7: 5, Exec: 1 },
  { name: 'Ops', L1: 5, L4: 15, L7: 4, Exec: 1 },
  { name: 'Strategy', L1: 2, L4: 8, L7: 6, Exec: 3 },
];

const APPRAISAL_STATUS_DATA = [
  { name: 'Pending Review', value: 120, color: '#F59E0B' },
  { name: 'In Progress', value: 280, color: '#30B7EE' },
  { name: 'Completed', value: 550, color: '#10B981' },
  { name: 'Calibrated', value: 180, color: '#1659E6' },
];

const ORG_DEPARTMENTS = [
  { id: 'd1', name: "Core Engineering", head: "Sarah Chen", members: 42, health: 94, trend: 'up', velocity: '92%', avatar: 'https://picsum.photos/seed/sarah/100/100' },
  { id: 'd2', name: "Infrastructure", head: "Marcus Vane", members: 12, health: 72, trend: 'down', velocity: '65%', avatar: 'https://picsum.photos/seed/marcus/100/100' },
  { id: 'd3', name: "Product Strategy", head: "Alex Rivera", members: 8, health: 98, trend: 'up', velocity: '96%', avatar: 'https://picsum.photos/seed/alex/100/100' },
  { id: 'd4', name: "Growth & Sales", head: "Elena Rossi", members: 28, health: 85, trend: 'stable', velocity: '88%', avatar: 'https://picsum.photos/seed/elena/100/100' },
];

const INDIVIDUAL_PERFORMERS = [
  { name: 'Emily Zhao', role: 'UX Designer', score: 5.0, stars: 5, avatar: 'https://picsum.photos/seed/emily/100/100' },
  { name: 'Jordan Smith', role: 'Staff Engineer', score: 4.9, stars: 5, avatar: 'https://picsum.photos/seed/jordan/100/100' },
  { name: 'Lila Ray', role: 'Product Analyst', score: 4.8, stars: 4, avatar: 'https://picsum.photos/seed/lila/100/100' },
];

const STRATEGIC_RISKS = [
  { unit: "Infrastructure", issue: "Latency Surplus", impact: "High", color: "text-red-500", bg: "bg-red-50" },
  { unit: "Sales - West", issue: "Quota Stagnation", impact: "Medium", color: "text-amber-500", bg: "bg-amber-50" },
  { unit: "Product", issue: "Skill Concentration", impact: "Low", color: "text-indigo-500", bg: "bg-indigo-50" },
];

const ORG_ANNOUNCEMENTS = [
  { id: 1, title: "Q4 Performance Horizon Initiated", time: "2h ago", type: "Operational", icon: <Calendar className="text-primary" /> },
  { id: 2, title: "Infrastructure Policy v4.2 Deployment", time: "1d ago", type: "Governance", icon: <ShieldCheck className="text-indigo-600" /> },
];

const DashboardPage: React.FC<{ role: UserRole }> = ({ role }) => {
  const isEmployee = role === UserRole.EMPLOYEE;
  const isManager = role === UserRole.MANAGER;
  const isOrgAdmin = role === UserRole.ORG_ADMIN;

  if (isEmployee) return <EmployeeDashboard />;
  if (isManager) return <ManagerDashboard />;

  // COMPREHENSIVE ORG ADMIN DASHBOARD
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* 1. Institutional Summary Header */}
      <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm flex flex-col xl:flex-row items-center justify-between gap-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-all duration-1000 rotate-12">
           <Building2 size={240} className="text-primary" />
        </div>
        <div className="flex items-center space-x-10 relative z-10">
          <div className="relative">
            <div className="w-32 h-32 rounded-[2.5rem] bg-slate-900 flex items-center justify-center text-primary shadow-2xl">
               <Globe size={56} className="text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white border-4 border-white shadow-lg animate-pulse">
               <ShieldCheck size={24} />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <span className="px-3 py-1 bg-primary text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">Institutional Command</span>
              <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-200">Manovar Enterprise</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none uppercase">Global Strategy Hub</h2>
            <p className="text-slate-500 font-bold mt-2 flex items-center uppercase text-base tracking-tight">
               Oversight for <span className="text-primary mx-2">1,240 Personnel</span> across <span className="text-primary mx-2">12 Functional Units</span>
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-12 px-12 border-l border-slate-100 relative z-10 hidden xl:flex">
           <div className="text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Global Health</p>
              <p className="text-4xl font-black text-slate-900">91<span className="text-lg text-slate-300">%</span></p>
           </div>
           <div className="text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Audit Compliance</p>
              <p className="text-4xl font-black text-green-600">A<span className="text-lg text-green-200">+</span></p>
           </div>
           <div className="w-px h-16 bg-slate-100" />
           <button className="p-4 bg-slate-50 text-slate-400 rounded-[1.5rem] hover:bg-primary hover:text-white transition-all shadow-inner">
              <Settings size={24} />
           </button>
        </div>
      </div>

      {/* 2. Top-Level Institutional Metrics Grid (Expanded) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard label="Org OKR Attainment" value="82.4%" trend="+4.2%" icon={<Target size={20} />} color="primary" />
        <StatsCard label="Revenue Velocity" value="$142.5M" trend="+12%" icon={<Wallet size={20} />} color="secondary" />
        <StatsCard label="Leadership Bench" value="74%" trend="Stable" icon={<Users size={20} />} color="green" />
        <StatsCard label="Compliance Integrity" value="99.8%" trend="+0.1%" icon={<ShieldCheck size={20} />} color="indigo" />
      </div>

      {/* 3. Main Analytical Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Row 1: Primary Analytical Charts */}
        <div className="lg:col-span-8 space-y-8">
           {/* Section: Institutional Performance Velocity */}
           <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-12">
                 <div>
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Institutional Performance Velocity</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Cross-Horizon Strategic Reality vs AI Projection</p>
                 </div>
                 <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2 text-[10px] font-black text-slate-500 uppercase">
                       <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                       <span>Reality</span>
                    </div>
                    <div className="flex items-center space-x-2 text-[10px] font-black text-slate-500 uppercase">
                       <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                       <span>Projection</span>
                    </div>
                 </div>
              </div>
              <div className="h-[380px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={PERFORMANCE_VELOCITY_DATA}>
                       <defs>
                          <linearGradient id="realityGrad" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#1659E6" stopOpacity={0.1}/>
                             <stop offset="95%" stopColor="#1659E6" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94A3B8'}} />
                       <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94A3B8'}} />
                       <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)' }} />
                       <Area type="monotone" name="Reality" dataKey="reality" fill="url(#realityGrad)" stroke="#1659E6" strokeWidth={4} />
                       <Area type="monotone" name="Projection" dataKey="projection" stroke="#E2E8F0" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Row 2: Secondary Visualizations */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Radar: Strategic Pillar Coverage */}
              <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm">
                 <div className="mb-10">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Strategic Pillar Alignment</h3>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Cross-Domain Capability Coverage</p>
                 </div>
                 <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <RadarChart cx="50%" cy="50%" outerRadius="80%" data={STRATEGIC_RADAR_DATA}>
                          <PolarGrid stroke="#F1F5F9" />
                          <PolarAngleAxis dataKey="subject" tick={{fontSize: 8, fontWeight: 900, fill: '#94A3B8'}} />
                          <Radar name="Institutional Target" dataKey="A" stroke="#1659E6" fill="#1659E6" fillOpacity={0.1} />
                          <Radar name="Actual Alignment" dataKey="B" stroke="#30B7EE" fill="#30B7EE" fillOpacity={0.1} />
                          <Tooltip />
                       </RadarChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              {/* Stacked Bar: Personnel Maturity Stack */}
              <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm">
                 <div className="mb-10 flex items-center justify-between">
                    <div>
                       <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Personnel Maturity stack</h3>
                       <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Institutional Talent Distribution</p>
                    </div>
                    <Users size={20} className="text-slate-200" />
                 </div>
                 <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={PERSONNEL_MATURITY_DATA} layout="vertical">
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#64748B'}} />
                          <Tooltip cursor={{fill: 'transparent'}} />
                          <Bar dataKey="L1" stackId="a" fill="#E2E8F0" radius={[0, 0, 0, 0]} />
                          <Bar dataKey="L4" stackId="a" fill="#CBD5E1" />
                          <Bar dataKey="L7" stackId="a" fill="#1659E6" />
                          <Bar dataKey="Exec" stackId="a" fill="#30B7EE" radius={[0, 4, 4, 0]} />
                       </BarChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="mt-4 flex flex-wrap gap-4 justify-center">
                    <LegendItem color="bg-[#E2E8F0]" label="L1-L3" />
                    <LegendItem color="bg-[#CBD5E1]" label="L4-L6" />
                    <LegendItem color="bg-[#1659E6]" label="L7-L9" />
                    <LegendItem color="bg-[#30B7EE]" label="Executives" />
                 </div>
              </div>
           </div>

           {/* Row 3: Composed Cross-Unit Efficiency */}
           <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm">
              <div className="flex items-center justify-between mb-12">
                 <div>
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Cross-Unit Efficiency Pulse</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">OKR Attainment vs KPI Velocity vs System Load</p>
                 </div>
                 <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2 text-[10px] font-black text-slate-500 uppercase">
                       <div className="w-2.5 h-2.5 rounded-lg bg-primary" />
                       <span>Attainment</span>
                    </div>
                    <div className="flex items-center space-x-2 text-[10px] font-black text-slate-500 uppercase">
                       <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
                       <span>Velocity</span>
                    </div>
                 </div>
              </div>
              <div className="h-[320px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={CROSS_UNIT_EFFICIENCY_DATA}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#64748B'}} />
                       <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#64748B'}} />
                       <Tooltip />
                       <Bar dataKey="attainment" fill="#1659E6" radius={[4, 4, 0, 0]} barSize={40} />
                       <Line type="monotone" dataKey="velocity" stroke="#30B7EE" strokeWidth={4} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} />
                       <Area type="monotone" dataKey="load" fill="#F1F5F9" stroke="#E2E8F0" fillOpacity={0.5} />
                    </ComposedChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Row 4: Functional Units Registry (Existing Enhanced Table) */}
           <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
              <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                 <div>
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Functional Units Command</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Institutional Department Oversight</p>
                 </div>
                 <div className="relative group">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input placeholder="Search business units..." className="bg-white border border-slate-200 rounded-2xl pl-12 pr-6 py-2.5 text-xs font-bold shadow-sm outline-none focus:ring-4 focus:ring-primary/5 transition-all w-64" />
                 </div>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-slate-50/30 border-b border-slate-100">
                       <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <th className="px-10 py-5">Department</th>
                          <th className="px-10 py-5">Unit Leadership</th>
                          <th className="px-10 py-5">Health Index</th>
                          <th className="px-10 py-5 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {ORG_DEPARTMENTS.map((dept) => (
                         <tr key={dept.id} className="hover:bg-slate-50/50 transition-all group cursor-pointer">
                            <td className="px-10 py-5">
                               <div className="flex flex-col">
                                  <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{dept.name}</span>
                                  <span className="text-[9px] text-slate-400 font-bold uppercase mt-1">{dept.members} Personnel</span>
                               </div>
                            </td>
                            <td className="px-10 py-5">
                               <div className="flex items-center space-x-3">
                                  <img src={dept.avatar} className="w-8 h-8 rounded-xl border border-slate-100 shadow-sm" />
                                  <span className="text-xs font-bold text-slate-700">{dept.head}</span>
                               </div>
                            </td>
                            <td className="px-10 py-5">
                               <div className="flex items-center space-x-4">
                                  <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                     <div className={`h-full ${dept.health > 80 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : dept.health > 50 ? 'bg-primary' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`} style={{ width: `${dept.health}%` }} />
                                  </div>
                                  <span className="text-[10px] font-black text-slate-900">{dept.health}%</span>
                               </div>
                            </td>
                            <td className="px-10 py-5 text-right">
                               <button className="p-2 text-slate-300 hover:text-primary transition-all">
                                  <ChevronRight size={20} />
                               </button>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>

        {/* Sidebar: Appraisals, Top Talent & Dynamic Comms */}
        <div className="lg:col-span-4 space-y-8">
           {/* Global Appraisal Pulse */}
           <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm space-y-10">
              <div className="flex items-center justify-between">
                 <div>
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
                       <PieChartIcon size={16} className="mr-2 text-primary" /> Appraisal Pulse
                    </h3>
                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Active Cycle Breakdown</p>
                 </div>
                 <div className="text-right">
                    <span className="text-2xl font-black text-slate-900">72%</span>
                    <p className="text-[8px] font-black text-slate-400 uppercase">Completion</p>
                 </div>
              </div>
              
              <div className="h-48 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie
                          data={APPRAISAL_STATUS_DATA}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                       >
                          {APPRAISAL_STATUS_DATA.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                       </Pie>
                       <Tooltip />
                    </PieChart>
                 </ResponsiveContainer>
              </div>

              <div className="space-y-3">
                 {APPRAISAL_STATUS_DATA.map(item => (
                   <div key={item.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center space-x-3">
                         <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                         <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight">{item.name}</span>
                      </div>
                      <span className="text-[10px] font-black text-slate-900">{item.value} Records</span>
                   </div>
                 ))}
              </div>
           </div>

           {/* NEW Section: Strategic Risk Indicators */}
           <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm space-y-8">
              <div className="flex items-center justify-between">
                 <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
                    <ShieldAlert size={16} className="mr-2 text-red-500" /> Strategic risks
                 </h3>
                 <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded text-[8px] font-black uppercase">3 Active Flags</span>
              </div>
              <div className="space-y-4">
                 {STRATEGIC_RISKS.map((risk, idx) => (
                    <div key={idx} className={`p-4 ${risk.bg} rounded-2xl flex items-center justify-between group cursor-pointer hover:scale-[1.02] transition-all`}>
                       <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm ${risk.color}`}>
                             <AlertTriangle size={20} />
                          </div>
                          <div>
                             <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{risk.unit}</p>
                             <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">{risk.issue}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-[8px] font-black text-slate-400 uppercase">Impact</p>
                          <p className={`text-[10px] font-black uppercase ${risk.color}`}>{risk.impact}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* Elite Tier Star Performers */}
           <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl border border-slate-800">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity"><Trophy size={140} className="text-primary" /></div>
              <div className="relative z-10 space-y-10">
                 <div className="flex items-center space-x-3">
                    <Star size={18} className="text-primary" />
                    <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Institutional Star Performers</h3>
                 </div>
                 
                 <div className="space-y-6">
                    {INDIVIDUAL_PERFORMERS.map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-all cursor-pointer group/item">
                         <div className="flex items-center space-x-4">
                            <img src={p.avatar} className="w-12 h-12 rounded-2xl border-2 border-white/20 shadow-md" />
                            <div>
                               <p className="text-sm font-black uppercase tracking-tight">{p.name}</p>
                               <div className="flex items-center space-x-1 text-amber-500 mt-1">
                                  {[...Array(5)].map((_, i) => (
                                     <Star key={i} size={10} fill={i < p.stars ? 'currentColor' : 'none'} className={i >= p.stars ? 'text-slate-700' : ''} />
                                  ))}
                               </div>
                            </div>
                         </div>
                         <div className="text-right">
                            <span className="text-xl font-black">{p.score}</span>
                            <p className="text-[8px] font-black text-slate-500 uppercase">Rating</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Global Institutional Announcements */}
           <div className="bg-white border border-slate-200 rounded-[3rem] p-8 shadow-sm space-y-8">
              <div className="flex items-center justify-between mb-2">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
                    <Megaphone size={14} className="mr-2 text-primary" /> Hub Communications
                 </h3>
                 <span className="px-2 py-0.5 bg-primary/5 text-primary rounded-lg text-[8px] font-black uppercase">Institutional</span>
              </div>
              <div className="space-y-4">
                 {ORG_ANNOUNCEMENTS.map(ann => (
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
              <button className="w-full py-4 border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-all">Broadcast Announcement</button>
           </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components

const StatsCard = ({ label, value, trend, icon, color }: any) => {
  const colorMap: any = { 
    primary: 'text-primary bg-primary/5', 
    green: 'text-green-600 bg-green-50', 
    secondary: 'text-secondary bg-secondary/5',
    indigo: 'text-indigo-600 bg-indigo-50'
  };
  return (
    <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
      <div className="flex justify-between items-start mb-8">
        <div className={`p-4 rounded-2xl ${colorMap[color] || colorMap.primary} group-hover:scale-110 transition-transform shadow-inner`}>{icon}</div>
        {trend && (
          <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-500'}`}>
            {trend.startsWith('+') ? <ArrowUpRight size={12} /> : null}
            <span>{trend}</span>
          </div>
        )}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 leading-none">{label}</p>
      <h4 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{value}</h4>
    </div>
  );
};

const LegendItem = ({ color, label }: { color: string, label: string }) => (
  <div className="flex items-center space-x-2">
     <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
     <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
  </div>
);

/**
 * PERSONALIZED MANAGER DASHBOARD (PRODUCT TEAM)
 */
const ManagerDashboard = () => {
  const [selectedPersonnel, setSelectedPersonnel] = useState<any>(null);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
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
          </div>
        </div>
      </div>
      <div className="text-center py-20 bg-white border border-slate-100 rounded-[3rem]">
         <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Team Performance Overview Data Syncing...</p>
      </div>
    </div>
  );
};

/**
 * PERSONALIZED EMPLOYEE DASHBOARD
 */
const EmployeeDashboard = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 text-center py-40">
       <div className="w-20 h-20 bg-primary/5 text-primary rounded-3xl flex items-center justify-center mx-auto mb-6">
          <User size={40} />
       </div>
       <h2 className="text-2xl font-black uppercase text-slate-900 tracking-tight">Standard Employee Interface</h2>
       <p className="text-slate-500 max-w-sm mx-auto text-sm">Access limited to personal performance metrics, self-evaluations, and individual alignment views.</p>
    </div>
  );
};

export default DashboardPage;