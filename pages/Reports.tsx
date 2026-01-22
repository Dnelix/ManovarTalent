
import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Plus, 
  BarChart, 
  PieChart, 
  Download, 
  Share2, 
  Clock,
  ChevronRight,
  Database,
  X,
  Layers,
  Calendar,
  Filter,
  ArrowRight,
  Sparkles,
  Zap,
  Globe,
  CheckCircle2,
  RefreshCw,
  Mail,
  Slack,
  MessageSquare,
  FileSpreadsheet,
  FileJson,
  FileCode,
  MoreVertical,
  // Added missing MoreHorizontal import
  MoreHorizontal,
  AlertCircle,
  TrendingUp,
  User,
  Users,
  Pencil,
  Trash2,
  Play,
  Pause,
  ChevronDown,
  Activity,
  LineChart as LineChartIcon,
  Table,
  BrainCircuit,
  ArrowLeft,
  DollarSign,
  TrendingDown,
  ShieldCheck,
  BellRing,
  ArrowUpRight,
  FileDown,
  Radar,
  Gauge,
  MousePointer2,
  BarChart3,
  Scale
} from 'lucide-react';
import { 
  BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  RePieChart, Pie, Cell, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as ReRadar, LineChart, Line, Legend
} from 'recharts';
import { UserRole } from '../types';

const CATEGORIES = [
  { id: 'execution', label: 'Execution & KPI', count: 12 },
  { id: 'strategy', label: 'Strategic Alignment', count: 5 },
  { id: 'talent', label: 'Talent & Distribution', count: 8 },
  { id: 'calibration', label: 'Calibration Quality', count: 3 },
];

const INITIAL_REPORTS = [
  { 
    id: 1, 
    title: "Institutional Loan Disbursement Velocity", 
    desc: "Comprehensive analysis of commercial and retail loan approval timelines, talent impact on cycle times, and strategic capital allocation.",
    type: "Financial Audit",
    category: "execution",
    lastRun: "Today, 09:42 AM",
    owner: "Alex Rivera",
    frequency: "Daily",
    recipients: ["Executive Board", "Credit Committee"],
    summaryStats: [
      { label: "Total Volume", value: "$1.24B", trend: "+12%", color: "primary" },
      { label: "Avg Cycle Time", value: "3.2 Days", trend: "-0.5d", color: "green" },
      { label: "Talent Efficiency", value: "94.2%", trend: "+1.4%", color: "secondary" },
      { label: "Risk Exposure", value: "2.1%", trend: "-0.2%", color: "amber" }
    ],
    // Operational Trend Data
    trendData: [
      { name: 'W1', volume: 400, efficiency: 82, risk: 20 },
      { name: 'W2', volume: 600, efficiency: 85, risk: 18 },
      { name: 'W3', volume: 550, efficiency: 90, risk: 15 },
      { name: 'W4', volume: 850, efficiency: 94, risk: 12 },
    ],
    // Strategic Radar Data
    strategyRadar: [
      { subject: 'Customer', A: 120, B: 110, fullMark: 150 },
      { subject: 'Financial', A: 98, B: 130, fullMark: 150 },
      { subject: 'Internal Process', A: 86, B: 130, fullMark: 150 },
      { subject: 'Learning', A: 99, B: 100, fullMark: 150 },
      { subject: 'Risk MGMT', A: 85, B: 90, fullMark: 150 },
    ],
    // Talent Distribution Data
    talentImpact: [
      { name: 'L1-L3', productivity: 65, tenure: 1.2 },
      { name: 'L4-L6', productivity: 88, tenure: 3.5 },
      { name: 'L7-L9', productivity: 95, tenure: 6.2 },
      { name: 'Exec', productivity: 92, tenure: 8.1 },
    ],
    ledger: [
      { name: 'Commercial - North', value: "$420M", variance: "+4.2%", health: 98, velocity: "High" },
      { name: 'SME - West', value: "$280M", variance: "-1.5%", health: 85, velocity: "Medium" },
      { name: 'Mortgage - South', value: "$390M", variance: "+8.1%", health: 92, velocity: "High" },
      { name: 'Personal - East', value: "$150M", variance: "+0.4%", health: 99, velocity: "Stable" },
    ],
    chartType: 'bar'
  },
  { 
    id: 2, 
    title: "HNW Client Conversion Pipeline", 
    desc: "End-to-end sales funnel analysis for High Net Worth private banking sectors, focusing on multi-touch attribution and talent-led conversion rates.",
    type: "Sales Strategy",
    category: "talent",
    lastRun: "2 hours ago",
    owner: "Strategy Office",
    frequency: "Weekly",
    recipients: ["Sales Managers", "Regional Heads"],
    summaryStats: [
      { label: "New Assets", value: "$480M", trend: "+24.2%", color: "primary" },
      { label: "Conversion Rate", value: "18.5%", trend: "+2.1%", color: "green" },
      { label: "Retention Index", value: "98.2", trend: "+0.4", color: "secondary" },
      { label: "CAC Efficiency", value: "$4.2k", trend: "-12%", color: "amber" }
    ],
    trendData: [
      { name: 'Jan', volume: 120, efficiency: 70, risk: 25 },
      { name: 'Feb', volume: 210, efficiency: 75, risk: 22 },
      { name: 'Mar', volume: 180, efficiency: 88, risk: 18 },
      { name: 'Apr', volume: 480, efficiency: 92, risk: 14 },
    ],
    strategyRadar: [
      { subject: 'Growth', A: 140, B: 100, fullMark: 150 },
      { subject: 'Efficiency', A: 90, B: 120, fullMark: 150 },
      { subject: 'Brand', A: 110, B: 130, fullMark: 150 },
      { subject: 'Digital', A: 130, B: 110, fullMark: 150 },
      { subject: 'Loyalty', A: 100, B: 90, fullMark: 150 },
    ],
    talentImpact: [
      { name: 'Relationship Mgr', productivity: 92, tenure: 4.2 },
      { name: 'Wealth Advisor', productivity: 85, tenure: 5.1 },
      { name: 'Admin Support', productivity: 70, tenure: 2.1 },
      { name: 'Ops Control', productivity: 88, tenure: 3.8 },
    ],
    ledger: [
      { name: 'Private Wealth - EMEA', value: "$210M", variance: "+12%", health: 95, velocity: "Extreme" },
      { name: 'Asset MGMT - US', value: "$180M", variance: "+4%", health: 91, velocity: "Stable" },
      { name: 'Family Office - APAC', value: "$90M", variance: "-2%", health: 82, velocity: "Medium" },
    ],
    chartType: 'pie'
  },
  { 
    id: 3, 
    title: "NPL Risk & Recovery Audit", 
    desc: "Critical risk analysis of Non-Performing Loans, combining financial exposure data with unit-level recovery effectiveness metrics.",
    type: "Governance",
    category: "calibration",
    lastRun: "2 days ago",
    owner: "Risk Management",
    frequency: "Monthly",
    recipients: ["Regulatory Office", "Chief Risk Officer"],
    summaryStats: [
      { label: "Distressed Debt", value: "$42M", trend: "-4%", color: "red" },
      { label: "Recovery Rate", value: "62.4%", trend: "+8%", color: "green" },
      { label: "Provision Cap", value: "112%", trend: "Stable", color: "primary" },
      { label: "Legal Exposure", value: "Low", trend: "Stable", color: "secondary" }
    ],
    trendData: [
      { name: 'Q1', volume: 50, efficiency: 40, risk: 40 },
      { name: 'Q2', volume: 45, efficiency: 52, risk: 35 },
      { name: 'Q3', volume: 42, efficiency: 62, risk: 30 },
      { name: 'Q4', volume: 38, efficiency: 70, risk: 25 },
    ],
    strategyRadar: [
      { subject: 'Compliance', A: 145, B: 140, fullMark: 150 },
      { subject: 'Capital', A: 130, B: 130, fullMark: 150 },
      { subject: 'Audit', A: 120, B: 110, fullMark: 150 },
      { subject: 'Ops Risk', A: 110, B: 100, fullMark: 150 },
      { subject: 'Recovery', A: 90, B: 120, fullMark: 150 },
    ],
    talentImpact: [
      { name: 'Compliance Unit', productivity: 98, tenure: 7.2 },
      { name: 'Collections Unit', productivity: 62, tenure: 1.5 },
      { name: 'Audit Hub', productivity: 95, tenure: 5.4 },
    ],
    ledger: [
      { name: 'Retail NPL', value: "$12M", variance: "-8%", health: 70, velocity: "Managed" },
      { name: 'Commercial NPL', value: "$30M", variance: "-2%", health: 65, velocity: "Active" },
    ],
    chartType: 'pie'
  }
];

interface ReportsPageProps {
  role?: UserRole;
}

const ReportsPage: React.FC<ReportsPageProps> = ({ role = UserRole.ORG_ADMIN }) => {
  const [activeCategory, setActiveCategory] = useState('execution');
  const [isBuildModalOpen, setIsBuildModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const isOrgAdmin = role === UserRole.ORG_ADMIN;
  const canBuild = [UserRole.ORG_ADMIN, UserRole.EXECUTIVE, UserRole.HR].includes(role);

  const filteredReports = useMemo(() => {
    return activeCategory 
      ? reports.filter(r => r.category === activeCategory)
      : reports;
  }, [activeCategory, reports]);

  const handleExport = (format: string) => {
    setExportNotice(`Initializing Comprehensive ${format.toUpperCase()} Synthesis...`);
    setTimeout(() => setExportNotice(null), 3000);
  };

  const handleAddReport = (newReport: any) => {
    setReports(prev => [newReport, ...prev]);
    setIsBuildModalOpen(false);
    setActiveCategory(newReport.category);
  };

  // IF AN ORG ADMIN HAS SELECTED A REPORT, RENDER THE COMPREHENSIVE PAGE
  if (isOrgAdmin && selectedReport) {
    return (
      <ReportDetailPage 
        report={selectedReport} 
        onBack={() => setSelectedReport(null)} 
        onExport={handleExport}
      />
    );
  }

  return (
    <div className="space-y-6 relative">
      {exportNotice && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[300] bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 animate-in slide-in-from-top-4 border border-white/10">
           <RefreshCw size={16} className="animate-spin text-primary" />
           <span className="text-sm font-bold tracking-tight">{exportNotice}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">Institutional Analytics Hub</h1>
          <p className="text-slate-500 text-sm mt-1">
            {isOrgAdmin ? 'Global institutional oversight across banking, sales, and talent domains.' : 'Generate performance insights and team analytics.'}
          </p>
        </div>
        {canBuild && (
          <button 
            onClick={() => setIsBuildModalOpen(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
          >
            <Plus size={18} />
            <span>Architect Synthesis</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
             <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-6 border-l-4 border-primary pl-4">Domains</h3>
             <nav className="space-y-1">
                {CATEGORIES.map(cat => {
                  const catCount = reports.filter(r => r.category === cat.id).length;
                  return (
                    <button 
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs font-bold transition-all ${
                        activeCategory === cat.id 
                        ? 'bg-slate-900 text-white shadow-xl translate-x-2' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                    >
                      <span className="uppercase tracking-tight">{cat.label}</span>
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black ${activeCategory === cat.id ? 'bg-white/20' : 'bg-slate-100'}`}>{catCount}</span>
                    </button>
                  );
                })}
             </nav>
           </div>
           
           <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><BrainCircuit size={100} className="text-primary" /></div>
              <h4 className="font-black text-xs uppercase tracking-widest mb-4 flex items-center relative z-10 border-b border-white/10 pb-4">
                <Sparkles size={16} className="text-primary mr-2" />
                Cross-Domain Intelligence
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-6 relative z-10 font-medium italic">
                "Identify correlation between Q4 talent churn in SME banking and loan disbursement velocity lag in West regions."
              </p>
              <button className="w-full py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all relative z-10">
                Execute AI Query
              </button>
           </div>
        </div>

        <div className="lg:col-span-3">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
              {filteredReports.map(report => (
                <ReportCard 
                  key={report.id}
                  {...report}
                  onView={() => setSelectedReport(report)}
                />
              ))}
              {filteredReports.length === 0 && (
                <div className="col-span-full py-32 text-center flex flex-col items-center bg-white border border-slate-100 rounded-[3rem] border-dashed">
                   <Database size={48} className="text-slate-200 mb-4" />
                   <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">No deployed reports in this sector</p>
                </div>
              )}
           </div>
        </div>
      </div>

      {isBuildModalOpen && (
        <BuildReportModal onAdd={handleAddReport} onClose={() => setIsBuildModalOpen(false)} />
      )}
    </div>
  );
};

/**
 * COMPREHENSIVE FULL-PAGE REPORT VIEW
 * Used specifically for Organization Admin View
 */
const ReportDetailPage = ({ report, onBack, onExport }: { report: any, onBack: () => void, onExport: (fmt: string) => void }) => {
  return (
    <div className="animate-in slide-in-from-right duration-500 pb-20 space-y-8">
      {/* Detail Header & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-6">
          <button 
            onClick={onBack}
            className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all text-slate-500 shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">{report.title}</h1>
              <span className="px-3 py-1 bg-primary text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm">{report.type}</span>
            </div>
            <p className="text-slate-500 text-sm font-medium">{report.desc}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
           <button 
            onClick={() => onExport('pdf')}
            className="flex items-center space-x-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-black transition-all"
           >
              <FileDown size={14} />
              <span>Full Analytics Export</span>
           </button>
           <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-primary transition-all">
              <Share2 size={18} />
           </button>
        </div>
      </div>

      {/* Summary KPI Bar - High Density */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {report.summaryStats.map((stat: any, i: number) => (
          <div key={i} className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm flex items-center justify-between group hover:border-primary/20 transition-all">
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className={`text-3xl font-black ${stat.color === 'red' ? 'text-red-600' : 'text-slate-900'}`}>{stat.value}</p>
             </div>
             <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold ${stat.trend.startsWith('+') ? 'bg-green-50 text-green-600' : stat.trend === 'Stable' ? 'bg-slate-50 text-slate-500' : 'bg-red-50 text-red-600'}`}>
                {stat.trend.startsWith('+') ? <ArrowUpRight size={12} /> : stat.trend === 'Stable' ? <Activity size={12} /> : <TrendingDown size={12} />}
                <span>{stat.trend}</span>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Analytics Content */}
        <div className="lg:col-span-8 space-y-8">
           {/* Section 1: Performance Trends & Forecasting */}
           <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-12">
                 <div>
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Institutional Velocity Trend</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Cross-Sector Operational Throughput (Reality vs AI Projection)</p>
                 </div>
                 <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                       <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                       <span className="text-[10px] font-black text-slate-500 uppercase">Actual Volume</span>
                    </div>
                    <div className="flex items-center space-x-2">
                       <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
                       <span className="text-[10px] font-black text-slate-500 uppercase">Unit Efficiency</span>
                    </div>
                 </div>
              </div>
              
              <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={report.trendData}>
                    <defs>
                      <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1659E6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#1659E6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorEff" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#30B7EE" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#30B7EE" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748B', fontWeight: 800}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748B', fontWeight: 800}} />
                    <Tooltip 
                      contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)'}} 
                    />
                    <Area type="monotone" dataKey="volume" stroke="#1659E6" strokeWidth={4} fillOpacity={1} fill="url(#colorVol)" />
                    <Area type="monotone" dataKey="efficiency" stroke="#30B7EE" strokeWidth={3} fillOpacity={1} fill="url(#colorEff)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>

           {/* Section 2: Strategy Alignment Radar & Talent Impact */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Radar: Strategic Correlation */}
              <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm">
                 <div className="mb-8">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Strategic Correlation Radar</h3>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Balanced Scorecard Perspective Alignment</p>
                 </div>
                 <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <RadarChart cx="50%" cy="50%" outerRadius="80%" data={report.strategyRadar}>
                          <PolarGrid stroke="#F1F5F9" />
                          <PolarAngleAxis dataKey="subject" tick={{fontSize: 8, fontWeight: 900, fill: '#94A3B8'}} />
                          <Tooltip />
                          <ReRadar name="Target" dataKey="A" stroke="#1659E6" fill="#1659E6" fillOpacity={0.1} />
                          <ReRadar name="Actual" dataKey="B" stroke="#30B7EE" fill="#30B7EE" fillOpacity={0.1} />
                       </RadarChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              {/* Bar: Talent Depth Impact */}
              <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm">
                 <div className="mb-8">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Talent Yield per Cohort</h3>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Maturity vs Productivity Ratio</p>
                 </div>
                 <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <ReBarChart data={report.talentImpact} layout="vertical">
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 800, fill: '#64748B'}} width={80} />
                          <Tooltip cursor={{fill: 'transparent'}} />
                          <Bar dataKey="productivity" fill="#1659E6" radius={[0, 4, 4, 0]} barSize={20} />
                       </ReBarChart>
                    </ResponsiveContainer>
                 </div>
              </div>
           </div>

           {/* Section 3: Detailed Data Ledger */}
           <div className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-sm">
               <div className="px-10 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                     <Table size={20} className="text-slate-400" />
                     <h4 className="font-black text-slate-900 uppercase tracking-tight">Granular Sector Ledger</h4>
                  </div>
                  <div className="flex items-center space-x-4">
                     <span className="text-[10px] font-black text-primary bg-primary/5 px-3 py-1 rounded-full">AUDIT READY</span>
                     <button className="text-[10px] font-black text-slate-400 hover:text-primary transition-colors"><MoreHorizontal size={18}/></button>
                  </div>
               </div>
               <table className="w-full text-left">
                  <thead className="bg-slate-50/30 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                     <tr>
                        <th className="px-10 py-5">Asset Segment</th>
                        <th className="px-10 py-5">Attainment Value</th>
                        <th className="px-10 py-5">Sector Variance</th>
                        <th className="px-10 py-5 text-right">Throughput Health</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {report.ledger.map((row: any, i: number) => (
                       <tr key={i} className="hover:bg-slate-50/30 transition-all group">
                          <td className="px-10 py-5">
                             <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-primary transition-all">
                                   <Database size={14} />
                                </div>
                                <span className="text-sm font-black text-slate-700 uppercase tracking-tight">{row.name}</span>
                             </div>
                          </td>
                          <td className="px-10 py-5">
                             <span className="text-sm font-black text-slate-900">{row.value}</span>
                          </td>
                          <td className="px-10 py-5">
                             <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${row.variance.startsWith('+') ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>{row.variance}</span>
                          </td>
                          <td className="px-10 py-5 text-right">
                             <div className="flex items-center justify-end space-x-3">
                                <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                   <div className={`h-full ${row.health > 90 ? 'bg-green-500' : 'bg-primary'}`} style={{ width: `${row.health}%` }} />
                                </div>
                                <span className="text-[10px] font-black text-slate-900">{row.health}%</span>
                             </div>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
           </div>
        </div>

        {/* Action Command Center & Sidebar Analytics */}
        <div className="lg:col-span-4 space-y-8">
           {/* Section 4: AI Synthesis Engine */}
           <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl border border-slate-800">
              <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity"><BrainCircuit size={140} className="text-primary" /></div>
              <div className="relative z-10">
                 <div className="flex items-center space-x-4 mb-8">
                    <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary shadow-lg border border-primary/20 animate-pulse">
                       <Sparkles size={24} />
                    </div>
                    <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] border-l-2 border-primary pl-4">Sector Intelligence Synthesis</h3>
                 </div>
                 <div className="space-y-6 mb-10">
                    <div className="p-5 bg-white/5 border border-white/10 rounded-[1.5rem]">
                       <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-2">Performance Outlook</p>
                       <p className="text-lg font-medium text-slate-300 leading-relaxed italic">
                          "Correlation detected: <span className="text-white font-bold">L4-L6 productivity</span> in the North sector is driving a 22% velocity surplus. Suggest scaling this unit's resource strategy globally."
                       </p>
                    </div>
                    <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-[1.5rem]">
                       <p className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-2">Friction Alert</p>
                       <p className="text-xs font-medium text-slate-400 leading-relaxed italic">
                          "Process latency in the West sector is attributed to a calibration mismatch. 3 staff engineers are operating outside defined policy windows."
                       </p>
                    </div>
                 </div>
                 <div className="space-y-3">
                    <button className="w-full py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-primary/20 hover:scale-[1.02]">Deploy Remediation Plan</button>
                    <button className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Request Deep Bias Scan</button>
                 </div>
              </div>
           </div>

           {/* Section 5: Institutional Controls */}
           <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm space-y-8">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                 <Activity size={14} className="mr-2" /> Global Governance Hub
              </h4>
              <div className="space-y-3">
                 <ActionRow icon={<BellRing size={16}/>} label="Threshold Alerts" desc="Velocity < 3.5 triggers Executive escalation" color="text-amber-600" bg="bg-amber-50" />
                 <ActionRow icon={<Calendar size={16}/>} label="Institutional Review" desc="Auto-dispatch to Credit Board (Weekly)" color="text-indigo-600" bg="bg-indigo-50" />
                 <ActionRow icon={<Database size={16}/>} label="Cold-Storage Archive" desc="Immutable record lock for SOC-2 compliance" color="text-slate-600" bg="bg-slate-50" />
              </div>
              <button className="w-full py-4 border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary hover:border-primary/20 transition-all">Manage Policy Mappings</button>
           </div>

           {/* Section 6: Ownership & Context */}
           <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Analytics Custodian</h4>
                 <span className="text-[9px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded uppercase">Verified</span>
              </div>
              <div className="flex items-center space-x-4">
                 <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-300">
                    <UserCircle2 size={28} />
                 </div>
                 <div>
                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{report.owner}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Global Strategy Unit</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const ActionRow = ({ icon, label, desc, color, bg }: any) => (
  <div className="p-4 border border-slate-50 bg-slate-50/50 rounded-2xl flex items-center space-x-4 hover:bg-white hover:border-slate-100 transition-all cursor-pointer group">
     <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-all group-hover:scale-110 ${bg} ${color}`}>
        {icon}
     </div>
     <div className="flex-1 min-w-0">
        <p className="text-xs font-black text-slate-900 uppercase tracking-tight leading-none mb-1.5">{label}</p>
        <p className="text-[9px] text-slate-500 font-medium leading-relaxed italic truncate">"{desc}"</p>
     </div>
  </div>
);

const UserCircle2 = ({ size }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const BuildReportModal = ({ onAdd, onClose }: any) => {
  const [formData, setFormData] = useState({ title: '', category: 'execution', chartType: 'bar', dataPoints: ['ratings'] });
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl border border-slate-200 p-10 space-y-8">
        <div className="flex items-center justify-between">
           <h3 className="text-2xl font-black text-slate-900 tracking-tight">Intelligence Architect</h3>
           <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-500 transition-colors"><X size={24}/></button>
        </div>
        <div className="space-y-4">
           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Synthesis Designation</label>
           <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Cross-Market Performance Cluster" className="w-full border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-lg shadow-inner outline-none focus:border-primary transition-all" />
        </div>
        <div className="space-y-4">
           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Define Intersection Logic</label>
           <div className="grid grid-cols-2 gap-3">
              <SelectionButton label="Appraisal Cycles" active={formData.dataPoints.includes('ratings')} />
              <SelectionButton label="Capital Disbursement" active={formData.dataPoints.includes('okrs')} />
              <SelectionButton label="Talent Retention" active={false} />
              <SelectionButton label="Market Volatility" active={false} />
           </div>
        </div>
        <button onClick={() => onAdd({
          ...INITIAL_REPORTS[0],
          id: Date.now(),
          title: formData.title,
          category: formData.category,
          owner: 'Alex Rivera (Self)',
          lastRun: 'Just now'
        })} disabled={!formData.title} className="w-full py-5 bg-primary text-white rounded-2xl font-black text-sm uppercase shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">Generate Institutional Synthesis</button>
      </div>
    </div>
  );
};

const SelectionButton = ({ label, active }: any) => (
  <button className={`p-4 rounded-2xl border-2 transition-all text-left flex items-center justify-between ${active ? 'bg-primary/5 border-primary text-primary shadow-sm' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'}`}>
     <span className="text-xs font-bold">{label}</span>
     {active && <CheckCircle2 size={16} />}
  </button>
);

const ReportCard = ({ title, desc, type, lastRun, chartType, isAI, onView }: any) => (
  <div onClick={onView} className={`bg-white border border-slate-200 p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group flex flex-col justify-between ${isAI ? 'ring-4 ring-primary/5' : ''}`}>
    <div>
      <div className="flex items-start justify-between mb-8">
        <div className={`p-4 rounded-2xl shadow-inner ${isAI ? 'bg-primary/10 text-primary' : 'bg-slate-50 text-slate-400'}`}>
          {chartType === 'bar' ? <BarChart3 size={24} /> : <PieChart size={24} />}
        </div>
        <div className="px-3 py-1 bg-slate-50 rounded-lg text-[9px] font-black uppercase text-slate-400 border border-slate-100">{type}</div>
      </div>
      <h3 className="font-black text-xl text-slate-900 mb-3 group-hover:text-primary transition-colors tracking-tight uppercase leading-snug">{title}</h3>
      <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed font-medium italic">"{desc}"</p>
    </div>
    <div className="mt-10 pt-6 border-t border-slate-50 flex items-center justify-between text-[10px] font-bold text-slate-400">
       <span className="flex items-center uppercase tracking-widest"><Clock size={12} className="mr-1.5 text-primary" /> Run {lastRun}</span>
       <div className="p-2 bg-slate-50 rounded-xl text-slate-300 group-hover:text-primary group-hover:bg-primary/5 transition-all shadow-sm">
          <ArrowRight size={18} />
       </div>
    </div>
  </div>
);

export default ReportsPage;
