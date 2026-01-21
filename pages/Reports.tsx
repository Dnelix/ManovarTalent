
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
  // Added BrainCircuit to the imports to fix the "Cannot find name 'BrainCircuit'" error.
  BrainCircuit
} from 'lucide-react';
import { 
  BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart as RePieChart, Pie, Cell, LineChart, Line
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
    title: "Avg Rating by Business Unit", 
    desc: "Cross-departmental comparison of manager vs self-appraisal scores to identify calibration hotspots.",
    type: "Prebuilt",
    category: "talent",
    lastRun: "Today, 9:42 AM",
    owner: "System Admin",
    frequency: "Daily",
    recipients: ["HR Leadership", "CEO"],
    data: [
      { name: 'Eng', value: 4.2, benchmark: 4.0 },
      { name: 'Product', value: 4.5, benchmark: 4.0 },
      { name: 'Sales', value: 3.8, benchmark: 4.0 },
      { name: 'Design', value: 4.1, benchmark: 4.0 },
    ],
    chartType: 'bar'
  },
  { 
    id: 2, 
    title: "Goal Achievement Rate (Global)", 
    desc: "Percentage of OKRs closed successfully vs abandoned or carried over across the entire tenant.",
    type: "Prebuilt",
    category: "execution",
    lastRun: "2 hours ago",
    owner: "Strategy Office",
    frequency: "Weekly",
    recipients: ["All Managers"],
    data: [
      { name: 'Completed', value: 68, color: '#1659E6' },
      { name: 'In Progress', value: 24, color: '#30B7EE' },
      { name: 'At Risk', value: 8, color: '#EF4444' },
    ],
    chartType: 'pie'
  },
  { 
    id: 3, 
    title: "Bias & Fairness Audit", 
    desc: "Analysis of rating distributions by gender, location, and role level to ensure equitable calibration.",
    type: "Governance",
    category: "talent",
    lastRun: "2 days ago",
    owner: "HR Governance",
    frequency: "Monthly",
    recipients: ["DEI Committee", "HRBP Lead"],
    data: [
      { name: 'Exceeds', value: 15, color: '#1659E6' },
      { name: 'Meets', value: 65, color: '#30B7EE' },
      { name: 'Below', value: 20, color: '#E2E8F0' },
    ],
    chartType: 'pie'
  },
  { 
    id: 4, 
    title: "Top Talent Retention Risk", 
    desc: "Predictive modeling of high-performers with low alignment scores or decreasing engagement metrics.",
    type: "AI-Assisted",
    category: "talent",
    lastRun: "Just now",
    owner: "Talent Intelligence",
    frequency: "Real-time",
    recipients: ["Management Unit"],
    isAI: true,
    data: [
      { name: 'High Risk', value: 4, color: '#EF4444' },
      { name: 'Monitor', value: 12, color: '#F59E0B' },
      { name: 'Stable', value: 84, color: '#10B981' },
    ],
    chartType: 'pie'
  }
];

interface ReportsPageProps {
  role?: UserRole;
}

const ReportsPage: React.FC<ReportsPageProps> = ({ role = UserRole.ORG_ADMIN }) => {
  const [activeCategory, setActiveCategory] = useState('talent');
  const [isBuildModalOpen, setIsBuildModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const canBuild = [UserRole.ORG_ADMIN, UserRole.EXECUTIVE, UserRole.HR].includes(role);

  const filteredReports = activeCategory 
    ? reports.filter(r => r.category === activeCategory)
    : reports;

  const handleAddReport = (newReport: any) => {
    setReports(prev => [newReport, ...prev]);
    setIsBuildModalOpen(false);
    setActiveCategory(newReport.category);
  };

  const handleExport = (format: string) => {
    setExportNotice(`Initializing ${format.toUpperCase()} export engine...`);
    setTimeout(() => setExportNotice(null), 3000);
  };

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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Intelligence Reports</h1>
          <p className="text-slate-500 text-sm mt-1">Generate deep performance insights and cross-org analytics</p>
        </div>
        {canBuild && (
          <button 
            onClick={() => setIsBuildModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
          >
            <Plus size={16} />
            <span>Build Custom Report</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
             <h3 className="font-bold text-[10px] uppercase tracking-widest text-slate-400 mb-4">Report Categories</h3>
             <nav className="space-y-1">
                {CATEGORIES.map(cat => {
                  const catCount = reports.filter(r => r.category === cat.id).length;
                  return (
                    <button 
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        activeCategory === cat.id 
                        ? 'bg-primary text-white shadow-md' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${activeCategory === cat.id ? 'bg-white/20' : 'bg-slate-100'}`}>{catCount}</span>
                    </button>
                  );
                })}
             </nav>
           </div>
           
           <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Sparkles size={80}/></div>
              <h4 className="font-bold text-sm mb-3 flex items-center relative z-10">
                <Sparkles size={16} className="text-primary mr-2" />
                AI Context Query
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-4 relative z-10 font-medium">
                "Cross-reference unit attrition with low rating distribution in Engineering."
              </p>
              <button className="w-full py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative z-10">
                Run Synthesis
              </button>
           </div>
        </div>

        <div className="lg:col-span-3">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
              {filteredReports.map(report => (
                <ReportCard 
                  key={report.id}
                  {...report}
                  onView={() => setSelectedReport(report)}
                />
              ))}
           </div>
        </div>
      </div>

      {selectedReport && (
        <ReportDetailModal 
          report={selectedReport} 
          onClose={() => setSelectedReport(null)} 
          onExport={handleExport}
        />
      )}

      {isBuildModalOpen && (
        <BuildReportModal onAdd={handleAddReport} onClose={() => setIsBuildModalOpen(false)} />
      )}
    </div>
  );
};

const ReportDetailModal = ({ report, onClose, onExport }: any) => {
  const [exportFormat, setExportFormat] = useState('pdf');

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-2xl ${report.isAI ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'}`}>
              {report.chartType === 'bar' ? <BarChart size={24} /> : report.chartType === 'pie' ? <PieChart size={24} /> : <Database size={24} />}
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">{report.title}</h3>
                <span className="px-2 py-0.5 bg-primary text-white rounded text-[8px] font-black uppercase tracking-widest">{report.type}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{report.desc}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-all"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-8 space-y-8">
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8">
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    {report.chartType === 'bar' ? (
                      <ReBarChart data={report.data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748B', fontWeight: 600}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748B', fontWeight: 600}} />
                        <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                        <Bar dataKey="value" fill="#1659E6" radius={[4, 4, 0, 0]} barSize={40} />
                      </ReBarChart>
                    ) : (
                      <RePieChart>
                        <Pie data={report.data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={8}>
                          {report.data.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color || '#1659E6'} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{borderRadius: '12px', border: 'none'}} />
                      </RePieChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
                  <div className="px-8 py-4 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Report Raw Data</h4>
                     <span className="text-[9px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded uppercase">Verified Record</span>
                  </div>
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <tr><th className="px-8 py-4">Metric Dimension</th><th className="px-8 py-4">Institutional Value</th><th className="px-8 py-4">Status</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {report.data.map((row: any, i: number) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-all text-sm font-bold text-slate-700">
                          <td className="px-8 py-4">{row.name}</td>
                          <td className="px-8 py-4 text-slate-900 font-black">{row.value}{report.chartType === 'pie' ? '%' : ''}</td>
                          <td className="px-8 py-4"><span className="text-[9px] font-black uppercase text-green-600 flex items-center"><CheckCircle2 size={10} className="mr-1" /> Audit-Ready</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4 space-y-6">
              <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">Export Marketplace</h4>
                <div className="grid grid-cols-2 gap-3 mb-8">
                  <ExportOption label="PDF Analytics" active={exportFormat === 'pdf'} onClick={() => setExportFormat('pdf')} icon={<FileText size={18}/>} />
                  <ExportOption label="Excel Table" active={exportFormat === 'xlsx'} onClick={() => setExportFormat('xlsx')} icon={<FileSpreadsheet size={18}/>} />
                  <ExportOption label="Raw CSV" active={exportFormat === 'csv'} onClick={() => setExportFormat('csv')} icon={<Database size={18}/>} />
                  <ExportOption label="System JSON" active={exportFormat === 'json'} onClick={() => setExportFormat('json')} icon={<FileJson size={18}/>} />
                </div>
                <button 
                  onClick={() => { onExport(exportFormat); onClose(); }}
                  className="w-full py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center justify-center space-x-3 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <Download size={18} />
                  <span>Download {exportFormat.toUpperCase()} Dataset</span>
                </button>
              </div>

              <div className="p-6 bg-slate-900 rounded-[2rem] text-white relative overflow-hidden group">
                 {/* Added BrainCircuit icon usage here which previously caused the "Cannot find name" error. */}
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><BrainCircuit size={80} className="text-primary" /></div>
                 <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-4 border-l-2 border-primary pl-4">AI Insight Summary</h4>
                 <p className="text-xs text-slate-400 font-medium italic leading-relaxed">
                   "Analysis for this report identifies a significant skew in calibration scores for Engineering. Recommend Cross-Unit calibration session v4."
                 </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BuildReportModal = ({ onAdd, onClose }: any) => {
  const [formData, setFormData] = useState({ title: '', category: 'execution', chartType: 'bar', dataPoints: ['ratings'] });
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl border border-slate-200 p-10 space-y-8">
        <div className="flex items-center justify-between">
           <h3 className="text-2xl font-black text-slate-900 tracking-tight">Intelligence Architect</h3>
           <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-500 transition-colors"><X size={24}/></button>
        </div>
        <div className="space-y-4">
           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Custom Designation</label>
           <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Cross-Unit Velocity Q3" className="w-full border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-lg shadow-inner outline-none focus:border-primary transition-all" />
        </div>
        <div className="space-y-4">
           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Select Intersecting Data Points</label>
           <div className="grid grid-cols-2 gap-3">
              <SelectionButton label="Appraisal Ratings" active={formData.dataPoints.includes('ratings')} />
              <SelectionButton label="OKR Completion Rate" active={formData.dataPoints.includes('okrs')} />
              <SelectionButton label="Bias Scans (AI)" active={false} />
              <SelectionButton label="Employee Sentiment" active={false} />
           </div>
        </div>
        <button onClick={() => onAdd({...formData, id: Date.now(), type: 'Custom', owner: 'Self', lastRun: 'Never', data: INITIAL_REPORTS[0].data})} disabled={!formData.title} className="w-full py-5 bg-primary text-white rounded-2xl font-black text-sm uppercase shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">Generate Performance Synthesis</button>
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

const ExportOption = ({ label, icon, active, onClick }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all space-y-2 ${active ? 'bg-primary/5 border-primary text-primary shadow-sm' : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'}`}>
    {icon}<span className="text-[10px] font-black uppercase tracking-tighter">{label}</span>
  </button>
);

const ReportCard = ({ title, desc, type, lastRun, chartType, isAI, onView }: any) => (
  <div onClick={onView} className={`bg-white border border-slate-200 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col justify-between ${isAI ? 'ring-2 ring-primary/10' : ''}`}>
    <div>
      <div className="flex items-start justify-between mb-8">
        <div className={`p-4 rounded-2xl shadow-sm ${isAI ? 'bg-primary/10 text-primary' : 'bg-slate-50 text-slate-400'}`}>{chartType === 'bar' ? <BarChart size={20} /> : <PieChart size={20} />}</div>
        <div className="px-2 py-0.5 bg-slate-50 rounded text-[8px] font-black uppercase text-slate-400">{type}</div>
      </div>
      <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">{desc}</p>
    </div>
    <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between text-[10px] font-bold text-slate-400">
       <span className="flex items-center"><Clock size={12} className="mr-1.5" /> Run {lastRun}</span>
       <div className="p-1.5 bg-slate-50 rounded-lg text-slate-300 group-hover:text-primary transition-all">
          <ArrowRight size={14} />
       </div>
    </div>
  </div>
);

export default ReportsPage;
