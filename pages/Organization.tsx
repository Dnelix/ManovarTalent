import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Users, 
  Target, 
  Search, 
  Filter, 
  ChevronRight,
  Activity,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  BrainCircuit,
  Network,
  Maximize2,
  History,
  MoreHorizontal,
  X,
  CheckCircle2,
  TrendingUp,
  Scale,
  FileText,
  FileCode,
  Download,
  ExternalLink,
  Lock,
  ArrowRight,
  Gavel,
  Zap,
  Plus,
  Loader2,
  FileUp,
  AlertCircle,
  Globe,
  Rocket, 
  Shield,
  Clock,
  Mic,
  FileAudio,
  AlertTriangle,
  Layers,
  Settings2,
  Compass,
  Trash2,
  ChevronLeft,
  BarChart3,
  ChevronDown,
  User,
  Quote,
  Trophy,
  TrendingDown,
  Award,
  GraduationCap,
  BookOpen,
  PieChart as PieChartIcon,
  Map as MapIcon,
  Upload,
  FileSearch,
  Check,
  // Added Pencil to fix "Cannot find name 'Pencil'" error.
  Pencil
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';
import Pagination from '../components/common/Pagination';
import { UserRole } from '../types';

// Functional Departments Data
const DEPARTMENTS = [
  { id: 'd1', name: "Product Engineering", head: "Sarah Chen", headcount: 42, progress: 78, status: "Healthy", avatar: "https://picsum.photos/seed/sarah/100/100", trend: "+4%", kpiVelocity: "92%", okrAttainment: "74%", strategyAnchor: "AI Product Leadership" },
  { id: 'd2', name: "Infrastructure", head: "Marcus Vane", headcount: 12, progress: 92, status: "Healthy", avatar: "https://picsum.photos/seed/marcus/100/100", trend: "+2%", kpiVelocity: "95%", okrAttainment: "88%", strategyAnchor: "Efficiency & Margin" },
  { id: 'd3', name: "Growth & Sales", head: "Elena Rossi", headcount: 28, progress: 64, status: "At Risk", avatar: "https://picsum.photos/seed/elena/100/100", trend: "-5%", kpiVelocity: "58%", okrAttainment: "62%", strategyAnchor: "Global Expansion" },
  { id: 'd4', name: "People & Culture", head: "Alex Rivera", headcount: 8, progress: 85, status: "Healthy", avatar: "https://picsum.photos/seed/alex/100/100", trend: "Stable", kpiVelocity: "80%", okrAttainment: "82%", strategyAnchor: "Culture & Retention" },
  { id: 'd5', name: "Finance", head: "Jordan Smith", headcount: 6, progress: 100, status: "Healthy", avatar: "https://picsum.photos/seed/jordan/100/100", trend: "Stable", kpiVelocity: "98%", okrAttainment: "100%", strategyAnchor: "Profitability" },
  { id: 'd6', name: "Legal & Compliance", head: "David Wright", headcount: 4, progress: 95, status: "Healthy", avatar: "https://picsum.photos/seed/david/100/100", trend: "+1%", kpiVelocity: "99%", okrAttainment: "96%", strategyAnchor: "Governance" },
  { id: 'd7', name: "Customer Success", head: "Lila Ray", headcount: 15, progress: 82, status: "Healthy", avatar: "https://picsum.photos/seed/lila/100/100", trend: "+3%", kpiVelocity: "88%", okrAttainment: "76%", strategyAnchor: "Retention & LTV" },
  { id: 'd8', name: "Data Science", head: "Grace Lee", headcount: 9, progress: 90, status: "Healthy", avatar: "https://picsum.photos/seed/grace/100/100", trend: "+5%", kpiVelocity: "91%", okrAttainment: "89%", strategyAnchor: "Insights Engine" },
];

const TOP_PERFORMERS = [
  { id: 'tp1', name: "Sarah Chen", role: "Sr. Product Manager", score: "4.9/5", avatar: "https://picsum.photos/seed/sarah/100/100", tags: ["High Potential", "Execution Elite"], attainment: 94, velocity: 98, lmsSuggestion: "Executive Leadership Path" },
  { id: 'tp2', name: "Jordan Smith", role: "Staff Engineer", score: "5.0/5", avatar: "https://picsum.photos/seed/jordan/100/100", tags: ["Technical Mentor"], attainment: 100, velocity: 99, lmsSuggestion: "Advanced System Architecture" },
  { id: 'tp3', name: "Emily Zhao", role: "UX Designer", score: "4.8/5", avatar: "https://picsum.photos/seed/emily/100/100", tags: ["Innovation Lead"], attainment: 92, velocity: 95, lmsSuggestion: "Cognitive Psychology in UX" },
];

const INITIAL_PILLARS = [
  { 
    id: 'p1', 
    container: 'Customer', 
    title: 'Market Leadership in AI Talent', 
    goals: [
      { title: 'Expand EMEA reach by 40%', status: 'Active', progress: 65, type: 'OKR' },
      { title: 'Achieve 95% satisfaction index', status: 'Healthy', progress: 92, type: 'KPI' }
    ], 
    progress: 82,
    velocityData: [
      { name: 'W1', performance: 40 }, { name: 'W2', performance: 55 }, { name: 'W3', performance: 62 }, { name: 'W4', performance: 80 }
    ]
  },
  { 
    id: 'p2', 
    container: 'Financial', 
    title: 'Unit Margin Optimization', 
    goals: [
      { title: 'Reduce cloud overhead by 15%', status: 'Active', progress: 88, type: 'KPI' },
      { title: 'Hit 22% EBITDA target', status: 'Healthy', progress: 100, type: 'OKR' }
    ], 
    progress: 94,
    velocityData: [
      { name: 'W1', performance: 70 }, { name: 'W2', performance: 75 }, { name: 'W3', performance: 88 }, { name: 'W4', performance: 94 }
    ]
  },
  { 
    id: 'p3', 
    container: 'Process', 
    title: 'Zero-Friction Execution', 
    goals: [
      { title: 'Automate 70% of appraisal audits', status: 'At Risk', progress: 30, type: 'KPI' },
      { title: 'Unified data schema rollout', status: 'Active', progress: 74, type: 'OKR' }
    ], 
    progress: 65,
    velocityData: [
      { name: 'W1', performance: 50 }, { name: 'W2', performance: 48 }, { name: 'W3', performance: 60 }, { name: 'W4', performance: 65 }
    ]
  },
  { 
    id: 'p4', 
    container: 'People', 
    title: 'Culture of High Calibration', 
    goals: [
      { title: '90% manager certification rate', status: 'Active', progress: 72, type: 'OKR' },
      { title: 'Reduce churn in L6+ bands', status: 'Healthy', progress: 85, type: 'KPI' }
    ], 
    progress: 78,
    velocityData: [
      { name: 'W1', performance: 60 }, { name: 'W2', performance: 68 }, { name: 'W3', performance: 72 }, { name: 'W4', performance: 78 }
    ]
  },
];

const INITIAL_BLUEPRINTS = [
  { id: 'b1', title: 'Global Product Roadmap 2025', date: 'Oct 15, 2024', type: 'Document', status: 'Active', version: 'v1.2' },
  { id: 'b2', title: 'Engineering Velocity Framework', date: 'Oct 02, 2024', type: 'Manual', status: 'Archived', version: 'v2.0' },
];

interface OrganizationPageProps {
  role: UserRole;
}

const OrganizationPage: React.FC<OrganizationPageProps> = ({ role }) => {
  const [viewMode, setViewMode] = useState<'strategy' | 'directory' | 'chart' | 'detail'>('strategy');
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);
  const [selectedPillarId, setSelectedPillarId] = useState<string | null>(null);
  const [selectedTalentId, setSelectedTalentId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddPillarModalOpen, setIsAddPillarModalOpen] = useState(false);
  const [isAddBlueprintModalOpen, setIsAddBlueprintModalOpen] = useState(false);
  const [pillars, setPillars] = useState(INITIAL_PILLARS);
  const [blueprints, setBlueprints] = useState(INITIAL_BLUEPRINTS);
  
  const itemsPerPage = 8;
  const isLeadership = [UserRole.ORG_ADMIN, UserRole.EXECUTIVE, UserRole.HR].includes(role);

  const filteredDepts = useMemo(() => {
    return DEPARTMENTS.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [currentPage]);

  const selectedDept = useMemo(() => 
    DEPARTMENTS.find(d => d.id === selectedDeptId), 
    [selectedDeptId]
  );

  const selectedPillar = useMemo(() => 
    pillars.find(p => p.id === selectedPillarId),
    [selectedPillarId, pillars]
  );

  const selectedTalent = useMemo(() => 
    TOP_PERFORMERS.find(tp => tp.id === selectedTalentId),
    [selectedTalentId]
  );

  const handleDeptSelect = (id: string) => {
    setSelectedDeptId(id);
    setViewMode('detail');
  };

  const handleBack = () => {
    if (selectedTalentId) setSelectedTalentId(null);
    else if (selectedPillarId) setSelectedPillarId(null);
    else if (viewMode === 'detail') {
      setViewMode('directory');
      setSelectedDeptId(null);
    }
  };

  const handleAddBlueprint = (newBlueprint: any) => {
    setBlueprints([newBlueprint, ...blueprints]);
    setIsAddBlueprintModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          {(viewMode === 'detail' || selectedPillarId || selectedTalentId) && (
            <button 
              onClick={handleBack}
              className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all text-slate-500 shadow-sm"
            >
              <ChevronLeft size={18} />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {selectedTalentId ? `Talent Spotlight: ${selectedTalent?.name}` : 
               selectedPillarId ? selectedPillar?.title : 
               viewMode === 'detail' ? selectedDept?.name : "Organization Intelligence"}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {selectedTalentId ? `Deep-dive performance profile for ${selectedTalent?.role}` :
               selectedPillarId ? `${selectedPillar?.container} Horizon Objectives & Velocity` :
               viewMode === 'detail' ? `Strategic performance profile for ${selectedDept?.name}` : 
               "Structural governance and strategic alignment hub"}
            </p>
          </div>
        </div>

        {!selectedPillarId && !selectedTalentId && (
          <div className="flex items-center space-x-1 bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
            <ViewButton label="Strategy" active={viewMode === 'strategy'} onClick={() => setViewMode('strategy')} icon={<Compass size={14}/>} />
            <ViewButton label="Directory" active={viewMode === 'directory'} onClick={() => setViewMode('directory')} icon={<Building2 size={14}/>} />
            <ViewButton label="Org Chart" active={viewMode === 'chart'} onClick={() => setViewMode('chart'} icon={<Network size={14}/>} />
          </div>
        )}
      </div>

      {selectedTalentId && selectedTalent ? (
        <TalentDrillDownView talent={selectedTalent} onClose={() => setSelectedTalentId(null)} />
      ) : selectedPillarId && selectedPillar ? (
        <PillarDetailView pillar={selectedPillar} onClose={() => setSelectedPillarId(null)} />
      ) : viewMode === 'strategy' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-slate-900 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden group shadow-xl border border-slate-800">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,#1659E608_0%,transparent_70%)]"></div>
               <div className="absolute -top-6 -right-6 p-12 opacity-10 group-hover:opacity-15 transition-all duration-700 group-hover:scale-105">
                  <Network size={180} className="text-primary stroke-[1px]" />
               </div>
               
               <div className="relative z-10 space-y-8">
                  <div className="flex items-center space-x-4">
                     <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary">
                        <ShieldCheck size={20} />
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary leading-none">Institutional North Star</span>
                        <span className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-widest">v2.4 Core Governance</span>
                     </div>
                  </div>

                  <div className="space-y-3 max-w-2xl">
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                      Unifying human potential with <span className="text-primary">computational velocity.</span>
                    </h2>
                  </div>

                  <div className="flex items-center space-x-6 pt-2">
                     <div className="flex items-center space-x-2">
                        <CheckCircle2 size={14} className="text-green-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Board Verified</span>
                     </div>
                     <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
                     <div className="flex items-center space-x-2">
                        <Activity size={14} className="text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Active Horizon</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Strategic Blueprints Section */}
            <div className="space-y-6">
               <div className="flex items-center justify-between px-2">
                  <div className="flex items-center space-x-3">
                     <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                        <MapIcon size={18} />
                     </div>
                     <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight uppercase">Strategic Blueprint Repository</h3>
                  </div>
                  <button 
                    onClick={() => setIsAddBlueprintModalOpen(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:scale-105 transition-all"
                  >
                    <Plus size={14} />
                    <span>Add Blueprint</span>
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {blueprints.map(bp => (
                    <div key={bp.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group border-b-[6px] border-b-slate-100 hover:border-b-indigo-400">
                       <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center space-x-3">
                             <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600 shadow-inner group-hover:scale-110 transition-transform">
                                {bp.type === 'Document' ? <FileText size={20}/> : <Pencil size={20}/>}
                             </div>
                             <div>
                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{bp.title}</h4>
                                <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Version: {bp.version} • {bp.type}</p>
                             </div>
                          </div>
                          <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                             <MoreHorizontal size={18}/>
                          </button>
                       </div>
                       <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                             <Clock size={12} className="mr-1.5" /> {bp.date}
                          </span>
                          <button className="flex items-center space-x-1.5 text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:underline">
                             <span>Open Access</span>
                             <ExternalLink size={12}/>
                          </button>
                       </div>
                    </div>
                  ))}
                  {blueprints.length === 0 && (
                    <div className="col-span-full py-12 bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-400">
                       <MapIcon size={40} className="mb-3 opacity-20" />
                       <p className="text-xs font-bold uppercase tracking-widest">No strategic blueprints deployed</p>
                    </div>
                  )}
               </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
               <div className="flex items-center justify-between px-2">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight uppercase">Strategic Pillars</h3>
                  <button 
                    onClick={() => setIsAddPillarModalOpen(true)}
                    className="flex items-center space-x-2 px-3 py-1.5 border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                  >
                    <Plus size={14} />
                    <span>Add Pillar</span>
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {pillars.map(pillar => (
                    <PillarCard 
                      key={pillar.id} 
                      {...pillar} 
                      onClick={() => setSelectedPillarId(pillar.id)}
                    />
                  ))}
               </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
             {isLeadership && (
               <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <Trophy size={18} className="text-amber-500" />
                      <h3 className="font-bold text-[11px] uppercase tracking-widest text-slate-400">Top Talent Spotlight</h3>
                    </div>
                  </div>
                  <div className="space-y-4">
                     {TOP_PERFORMERS.map(p => (
                       <div 
                        key={p.id} 
                        onClick={() => setSelectedTalentId(p.id)}
                        className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-md transition-all cursor-pointer"
                       >
                          <div className="flex items-center space-x-3">
                             <img src={p.avatar} className="w-10 h-10 rounded-xl border border-white shadow-sm" />
                             <div>
                                <p className="text-xs font-bold text-slate-800">{p.name}</p>
                                <p className="text-[9px] text-slate-400 font-bold uppercase">{p.role}</p>
                             </div>
                          </div>
                          <div className="p-1.5 bg-white border border-slate-100 rounded-lg text-slate-300 group-hover:text-primary transition-all">
                            <ChevronRight size={14} />
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
             )}

             <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm">
                <h3 className="font-bold text-[10px] sm:text-xs uppercase tracking-widest text-slate-400 mb-4 sm:mb-6 flex items-center">
                  <Settings2 size={14} className="mr-2" /> Evaluation Cycles
                </h3>
                <div className="space-y-2 sm:space-y-3">
                   <CycleItem label="Periodic OKR Alignment" cycle="Quarterly" next="Oct 31, 2024" active />
                   <CycleItem label="Executive Calibration" cycle="Bi-Annual" next="Jan 15, 2025" />
                </div>
             </div>

             <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><BrainCircuit size={80} className="text-primary" /></div>
                <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 border-l-2 border-primary pl-4">Governance Snapshot</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-medium italic">
                  Institutional strategy is currently synchronized across 8 departments and 122 performance nodes. High fidelity alignment detected in Infrastructure unit.
                </p>
             </div>
          </div>
        </div>
      ) : viewMode === 'directory' ? (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900 tracking-tight">Functional Departments</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Unit Performance Board</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50/50 border-b border-slate-100 text-left">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Business Unit</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit Leadership</th>
                    <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Execution</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Strategic Attainment</th>
                    <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDepts.map((dept) => (
                    <tr key={dept.id} onClick={() => handleDeptSelect(dept.id)} className="hover:bg-slate-50/50 transition-all group cursor-pointer">
                      <td className="px-6 py-4 sm:py-5">
                        <p className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{dept.name}</p>
                      </td>
                      <td className="px-6 py-4 sm:py-5">
                        <div className="flex items-center space-x-3">
                          <img src={dept.avatar} alt={dept.head} className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-slate-200" />
                          <span className="text-[11px] sm:text-xs font-bold text-slate-700">{dept.head}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 sm:py-5 text-center">
                         <span className="text-[11px] sm:text-xs font-bold text-slate-900">{dept.kpiVelocity}</span>
                      </td>
                      <td className="px-6 py-4 sm:py-5">
                        <div className="flex flex-col space-y-1 w-32 sm:w-48">
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${dept.status === 'At Risk' ? 'bg-red-500' : 'bg-primary'}`} style={{ width: `${dept.progress}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 sm:py-5 text-right">
                        <ChevronRight size={18} className="text-slate-300 group-hover:text-primary transition-all inline-block" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination currentPage={currentPage} totalItems={DEPARTMENTS.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} />
          </div>
        </div>
      ) : viewMode === 'chart' ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 shadow-sm flex items-center justify-center relative overflow-hidden animate-in zoom-in-95">
          <div className="relative z-10 flex flex-col items-center">
            <OrgNode name="Alex Rivera" title="Organization Strategy" isRoot health={74} />
            <svg className="h-12 w-full max-w-lg" viewBox="0 0 400 60" fill="none">
               <path d="M200 0V30 M200 30H100V60 M200 30H300V60" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <div className="flex space-x-6">
               {DEPARTMENTS.slice(0, 3).map((dept) => (
                 <OrgNode key={dept.id} name={dept.head} title={dept.name} health={dept.progress} onClick={() => handleDeptSelect(dept.id)} />
               ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in slide-in-from-bottom-4">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 space-y-6">
                 <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden group shadow-xl">
                    <div className="flex flex-col sm:flex-row items-start gap-6 relative z-10">
                       <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center text-primary border border-white/5">
                          <Sparkles size={32} />
                       </div>
                       <div className="flex-1">
                          <h3 className="text-xl font-bold tracking-tight mb-2">Unit Intelligence</h3>
                          <p className="text-slate-300 text-sm leading-relaxed font-medium">
                             Analysis for <span className="text-white font-bold">{selectedDept!.name}</span> suggests a <span className="text-green-400 font-bold">Velocity Surplus</span>. 
                          </p>
                       </div>
                    </div>
                 </div>

                 <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm overflow-hidden">
                    <h3 className="font-bold text-slate-900 tracking-tight mb-8">Unit Velocity History</h3>
                    <div className="h-[300px]">
                       <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={[
                            { name: 'W1', performance: 45 }, { name: 'W2', performance: 52 }, { name: 'W3', performance: 48 }, { name: 'W4', performance: 78 }
                          ]}>
                             <Area type="monotone" dataKey="performance" stroke="#1659E6" fill="#1659E6" fillOpacity={0.05} />
                          </AreaChart>
                       </ResponsiveContainer>
                    </div>
                 </div>
              </div>
              <div className="lg:col-span-4 space-y-6">
                 <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center">
                    <img src={selectedDept!.avatar} className="w-20 h-20 rounded-2xl border border-slate-100 mx-auto mb-4" />
                    <h4 className="text-lg font-bold text-slate-900 tracking-tight">{selectedDept!.head}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{selectedDept!.name}</p>
                 </div>
              </div>
           </div>
        </div>
      )}

      {isAddPillarModalOpen && (
        <AddPillarModal onAdd={(p: any) => { setPillars([...pillars, {...p, id: `p${Date.now()}`}]); setIsAddPillarModalOpen(false); }} onClose={() => setIsAddPillarModalOpen(false)} />
      ) }

      {isAddBlueprintModalOpen && (
        <AddBlueprintWizard onAdd={handleAddBlueprint} onClose={() => setIsAddBlueprintModalOpen(false)} />
      )}
    </div>
  );
};

// --- View: Add Blueprint Wizard ---
const AddBlueprintWizard = ({ onAdd, onClose }: { onAdd: (bp: any) => void, onClose: () => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ title: '', version: 'v1.0', type: 'Manual', desc: '' });
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      onAdd({ ...formData, id: `bp${Date.now()}`, date: 'Just now', type: 'Document', status: 'Active' });
      setIsUploading(false);
    }, 1500);
  };

  const handleManualAdd = () => {
    onAdd({ ...formData, id: `bp${Date.now()}`, date: 'Just now', type: 'Manual', status: 'Active' });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-indigo-50/50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
              <MapIcon size={24}/>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase leading-none">Blueprint Architect</h3>
              <p className="text-xs text-slate-500 mt-1">Define institutional strategic roadmaps</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><X size={24}/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
           {step === 1 && (
             <div className="space-y-8 animate-in slide-in-from-right duration-300">
                <div className="grid grid-cols-2 gap-4">
                   <button 
                    onClick={() => setStep(2)}
                    className="p-8 border-2 border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-center space-y-4 hover:border-indigo-600 hover:bg-indigo-50/30 transition-all group"
                   >
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-indigo-600 group-hover:scale-110 transition-transform"><Upload size={28}/></div>
                      <p className="text-xs font-black uppercase tracking-widest text-slate-900">Upload Asset</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">PDF, DOCX, or Strategy Map</p>
                   </button>
                   <button 
                    onClick={() => setStep(3)}
                    className="p-8 border-2 border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-center space-y-4 hover:border-indigo-600 hover:bg-indigo-50/30 transition-all group"
                   >
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-indigo-600 group-hover:scale-110 transition-transform"><Pencil size={28}/></div>
                      <p className="text-xs font-black uppercase tracking-widest text-slate-900">Manual Entry</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Define framework in-platform</p>
                   </button>
                </div>
                <div className="p-6 bg-slate-900 rounded-3xl text-white relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><BrainCircuit size={80} className="text-indigo-400" /></div>
                   <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">Architect Note</h4>
                   <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                     Blueprints serve as the "ground truth" for AI calibration. Uploaded assets are indexed for semantic context matching against unit performance.
                   </p>
                </div>
             </div>
           )}

           {step === 2 && (
             <div className="space-y-8 animate-in slide-in-from-right duration-300">
                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Blueprint Designation</label>
                      <input 
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        placeholder="e.g. FY25 Commercial Strategy"
                        className="w-full bg-white text-slate-900 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold outline-none focus:border-indigo-600 transition-all shadow-sm"
                      />
                   </div>
                   <div className="border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center space-y-4 bg-slate-50/50 hover:border-indigo-400 transition-all cursor-pointer">
                      {isUploading ? <Loader2 size={40} className="text-indigo-600 animate-spin" /> : <FileSearch size={40} className="text-slate-300" />}
                      <div>
                        <p className="text-sm font-black text-slate-700 uppercase">{isUploading ? 'Analyzing Document Integrity...' : 'Drop Strategy File Here'}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Maximum artifact size: 50MB</p>
                      </div>
                   </div>
                </div>
             </div>
           )}

           {step === 3 && (
             <div className="space-y-6 animate-in slide-in-from-right duration-300">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Institutional Title</label>
                   <input 
                     value={formData.title}
                     onChange={e => setFormData({...formData, title: e.target.value})}
                     className="w-full bg-white text-slate-900 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold outline-none focus:border-indigo-600 transition-all shadow-sm"
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Version</label>
                      <input 
                        value={formData.version}
                        onChange={e => setFormData({...formData, version: e.target.value})}
                        className="w-full bg-white text-slate-900 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold outline-none focus:border-indigo-600 transition-all shadow-sm"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Horizon</label>
                      <select className="w-full bg-white text-slate-900 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold outline-none focus:border-indigo-600 transition-all shadow-sm appearance-none">
                         <option>FY 2025</option>
                         <option>Q4 Pulse</option>
                         <option>Long-term (3Y)</option>
                      </select>
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Strategic Narrative</label>
                   <textarea 
                     value={formData.desc}
                     onChange={e => setFormData({...formData, desc: e.target.value})}
                     placeholder="Outline the core success path..."
                     className="w-full bg-white text-slate-900 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:border-indigo-600 transition-all shadow-sm h-32 resize-none"
                   />
                </div>
             </div>
           )}
        </div>

        <div className="p-8 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
           <button 
            onClick={step === 1 ? onClose : () => setStep(1)} 
            className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-all uppercase tracking-widest text-[11px]"
           >
              {step === 1 ? 'Discard' : 'Previous'}
           </button>
           <button 
            onClick={step === 2 ? handleUpload : step === 3 ? handleManualAdd : () => {}}
            disabled={step === 1 || !formData.title}
            className="px-10 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-indigo-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 flex items-center space-x-2"
           >
              {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Check size={18} />}
              <span>{step === 2 ? 'Upload & Verify' : 'Deploy Blueprint'}</span>
           </button>
        </div>
      </div>
    </div>
  );
};

// --- View: Deep Pillar Drill-down ---
const PillarDetailView = ({ pillar, onClose }: { pillar: any, onClose: () => void }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-right duration-500 pb-12">
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
            <Layers size={160} className="text-primary" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <span className="px-3 py-1 bg-primary/5 text-primary border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                Strategic Container: {pillar.container}
              </span>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="flex-1">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">{pillar.title}</h2>
                <p className="text-slate-500 text-sm mt-4 font-medium leading-relaxed max-w-xl">
                  This strategic pillar anchors all initiatives related to {pillar.container.toLowerCase()} performance and organizational health. Currently monitoring {pillar.goals.length} primary success vectors.
                </p>
              </div>
              <div className="w-40 h-40 rounded-full border-[8px] border-slate-50 flex flex-col items-center justify-center relative bg-white shadow-xl shadow-slate-200/50">
                 <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="50%" cy="50%" r="72" fill="transparent" stroke="#F1F5F9" strokeWidth="8" />
                    <circle cx="50%" cy="50%" r="72" fill="transparent" stroke="#1659E6" strokeWidth="8" strokeDasharray={`${(pillar.progress / 100) * 452} 452`} strokeLinecap="round" />
                 </svg>
                 <span className="text-3xl font-black text-slate-900 relative z-10">{pillar.progress}%</span>
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest relative z-10">Pillar Health</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
             <h3 className="font-bold text-slate-900 tracking-tight uppercase">Horizon Success Vectors</h3>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{pillar.goals.length} Active Anchors</span>
          </div>
          <div className="space-y-4">
            {pillar.goals.map((goal: any, i: number) => (
              <div key={i} className="p-6 bg-slate-50/50 border border-slate-100 rounded-2xl flex items-center justify-between group hover:bg-white hover:shadow-md transition-all">
                 <div className="flex items-center space-x-6">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${goal.type === 'KPI' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>
                       {goal.type === 'KPI' ? <Zap size={20} /> : <Target size={20} />}
                    </div>
                    <div>
                       <div className="flex items-center space-x-2">
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${goal.type === 'KPI' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>{goal.type}</span>
                          <span className={`text-[9px] font-black uppercase ${goal.status === 'Healthy' ? 'text-green-600' : 'text-amber-600'}`}>{goal.status}</span>
                       </div>
                       <h4 className="text-sm font-bold text-slate-900 mt-1.5 group-hover:text-primary transition-colors uppercase tracking-tight">{goal.title}</h4>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Attainment</p>
                    <span className="text-sm font-black text-slate-900">{goal.progress}%</span>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-4 space-y-6">
        <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <BrainCircuit size={80} className="text-primary" />
           </div>
           <h3 className="text-[10px] font-black text-primary uppercase tracking-widest mb-6 border-l-2 border-primary pl-4">AI Strategy Audit</h3>
           <p className="text-sm text-slate-300 leading-relaxed font-medium italic mb-8">
              "Pillar analysis for {pillar.title} shows high stability in financial metrics but potential friction in process automation vectors. Recommend reviewing unit d3's contribution."
           </p>
           <button className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
              Initialize Pillar Calibration
           </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
           <h3 className="font-bold text-slate-800 text-[10px] tracking-widest uppercase text-slate-400 mb-6">Pillar Velocity</h3>
           <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={pillar.velocityData}>
                    <Area type="monotone" dataKey="performance" stroke="#1659E6" fill="#1659E6" fillOpacity={0.05} />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
           <div className="mt-6 p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Growth Rate</span>
              <span className="text-xs font-black text-green-600">+12.4%</span>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- View: Talent Spotlight Drill-down ---
const TalentDrillDownView = ({ talent, onClose }: { talent: any, onClose: () => void }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex items-center space-x-8">
           <div className="relative">
              <img src={talent.avatar} className="w-24 h-24 rounded-3xl border-4 border-slate-50 shadow-2xl" />
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-amber-500 rounded-2xl flex items-center justify-center text-white border-4 border-white shadow-lg">
                 <Trophy size={18} />
              </div>
           </div>
           <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                 <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded-lg text-[9px] font-black uppercase tracking-widest">Exceptional Performance</span>
                 <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center"><Clock size={12} className="mr-1.5" /> L6 Strategy Path</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">{talent.name}</h2>
              <p className="text-slate-500 font-bold mt-1">{talent.role}</p>
              <div className="flex items-center gap-2 mt-4">
                 {talent.tags.map((t: string) => (
                   <span key={t} className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase">{t}</span>
                 ))}
              </div>
           </div>
           <div className="text-right px-8 border-l border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Calibration Rating</p>
              <p className="text-4xl font-black text-slate-900">{talent.score.split('/')[0]}<span className="text-lg text-slate-300">/5</span></p>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
           <TalentStatCard label="OKR Attainment" value={`${talent.attainment}%`} icon={<Target size={20} className="text-primary"/>} />
           <TalentStatCard label="KPI Velocity" value={`${talent.velocity}%`} icon={<Zap size={20} className="text-secondary"/>} />
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
           <h3 className="font-bold text-slate-900 tracking-tight mb-8 uppercase">Quarterly Metric Snapshot</h3>
           <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={[
                    { name: 'Strategy', val: 92, target: 80 },
                    { name: 'Execution', val: 98, target: 85 },
                    { name: 'Culture', val: 100, target: 90 },
                    { name: 'Mentorship', val: 85, target: 70 },
                 ]} barGap={8}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                    <Bar dataKey="val" fill="#1659E6" radius={[4, 4, 0, 0]} barSize={40} />
                    <Bar dataKey="target" fill="#E2E8F0" radius={[4, 4, 0, 0]} barSize={40} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>

      <div className="lg:col-span-4 space-y-6">
        <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl">
           <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-8 border-l-2 border-primary pl-4">Bridge to Growth</h3>
           <div className="space-y-6">
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                 <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-primary/20 text-primary rounded-xl"><GraduationCap size={18}/></div>
                    <p className="text-xs font-bold uppercase tracking-tight">Suggested IDP Item</p>
                 </div>
                 <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-tight">{talent.lmsSuggestion}</h4>
                 <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic">
                    "Based on top-tier technical mentoring scores, we suggest specializing in global architecture."
                 </p>
                 <button className="w-full mt-6 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-2">
                    <BookOpen size={14} />
                    <span>View in Udemy</span>
                 </button>
              </div>

              <button className="w-full py-3 border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-all rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-2">
                 <Award size={14} />
                 <span>Nominate for Elite Promotion</span>
              </button>
           </div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
           <h3 className="font-bold text-slate-400 text-[10px] uppercase tracking-widest mb-6">Unit Context</h3>
           <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                 <Building2 size={24} />
              </div>
              <div>
                 <p className="text-xs font-bold text-slate-900 uppercase tracking-tight">Engineering Unit A</p>
                 <p className="text-[10px] text-slate-500 font-medium italic">Ranked #1 in velocity</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components
const ViewButton = ({ label, active, onClick, icon }: any) => (
  <button 
    onClick={onClick}
    className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${active ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const PillarCard = ({ container, title, goals, progress, onClick }: any) => (
  <div 
    onClick={onClick}
    className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group cursor-pointer flex flex-col h-full border-b-[6px] border-b-slate-100 hover:border-b-primary/40"
  >
     <div className="flex justify-between items-start mb-6">
        <span className="px-2.5 py-1 bg-slate-50 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-100">{container}</span>
        <div className="w-10 h-10 rounded-full border-2 border-slate-50 flex items-center justify-center text-xs font-black text-slate-900 bg-white shadow-sm">
           {progress}%
        </div>
     </div>
     <h4 className="text-lg font-bold text-slate-900 transition-colors mb-4 tracking-tight leading-snug uppercase">{title}</h4>
     <div className="space-y-2 flex-1">
        {goals.map((g: any, i: number) => (
          <div key={i} className="flex items-start space-x-2 text-[11px] text-slate-500 font-medium leading-relaxed">
             <div className="w-1.5 h-1.5 bg-primary/40 rounded-full mt-1.5 shrink-0"></div>
             <span className="line-clamp-1">{g.title}</span>
          </div>
        ))}
     </div>
     <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{goals.length} Horizon Anchors</span>
        <ArrowRight size={14} className="text-slate-300 group-hover:text-primary transition-all" />
     </div>
  </div>
);

const TalentStatCard = ({ label, value, icon }: any) => (
  <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
     <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{label}</p>
        <h4 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h4>
     </div>
     <div className="p-3 bg-slate-50 rounded-2xl group-hover:scale-105 transition-transform">{icon}</div>
  </div>
);

const CycleItem = ({ label, cycle, next, active }: any) => (
  <div className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${active ? 'bg-primary/5 border-primary/20 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
     <div className="flex items-center space-x-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${active ? 'bg-primary text-white' : 'bg-slate-50 text-slate-400'}`}>
           <Clock size={14} />
        </div>
        <div>
           <p className="text-xs font-bold text-slate-800 uppercase tracking-tight">{label}</p>
           <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{cycle}</p>
        </div>
     </div>
     <div className="text-right">
        <p className="text-[8px] font-black text-slate-300 uppercase">Next</p>
        <p className="text-[10px] font-bold text-slate-700">{next}</p>
     </div>
  </div>
);

const OrgNode = ({ name, title, isRoot, health, onClick }: any) => (
  <div onClick={onClick} className={`p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer w-56 text-center group ${isRoot ? 'bg-slate-900 text-white border-slate-800 ring-4 ring-primary/5' : ''}`}>
     <p className="text-xs font-bold leading-none truncate px-1 uppercase tracking-tight">{name}</p>
     <p className={`text-[9px] font-bold mt-1.5 uppercase tracking-wider truncate px-1 ${isRoot ? 'text-slate-500' : 'text-slate-400'}`}>{title}</p>
     <div className="mt-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
        <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${health}%` }}></div>
     </div>
  </div>
);

const AddPillarModal = ({ onAdd, onClose }: any) => {
  const [formData, setFormData] = useState({ title: '', container: 'Customer', goals: [] });
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-4"><div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg"><Layers size={20} /></div>
          <div><h3 className="text-lg font-bold text-slate-900 tracking-tight uppercase">Define Strategic Pillar</h3></div></div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-all"><X size={20}/></button>
        </div>
        <div className="p-8 space-y-6">
           <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Pillar Title" className="w-full bg-white text-slate-900 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-sm outline-none focus:border-primary shadow-sm" />
           <button onClick={() => onAdd({...formData, progress: 0, goals: [], velocityData: []})} className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">Launch Pillar</button>
        </div>
      </div>
    </div>
  );
};

export default OrganizationPage;
