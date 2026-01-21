import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  ShieldCheck, 
  ArrowUpDown,
  FileText,
  X,
  Mail,
  MapPin,
  Briefcase,
  ExternalLink,
  Edit2,
  Trash2,
  Check,
  History,
  Award,
  ChevronRight,
  TrendingUp,
  Star,
  GraduationCap,
  BookOpen,
  UserPlus,
  Compass,
  Zap,
  Target,
  Clock,
  Plus,
  Sparkles,
  Link as LinkIcon,
  MessageCircle,
  Monitor,
  ShieldAlert as PipIcon,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  FileSearch,
  Paperclip,
  AlertTriangle,
  Flag,
  Info,
  Layers,
  BrainCircuit,
  PieChart as PieChartIcon,
  BarChart3,
  Award as Medal,
  Activity,
  CheckCircle2,
  ListTodo
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Pagination from '../components/common/Pagination';
import { UserRole } from '../types';

const MOCK_PEOPLE = [
  { 
    id: 1, 
    name: "Sarah Chen", 
    title: "Sr. Product Manager", 
    level: "L6", 
    dept: "Core Platform", 
    health: 98, 
    avatar: "https://picsum.photos/seed/sarah/100/100", 
    email: "sarah.c@manovar.ai",
    location: "San Francisco, US",
    tenure: "2.4 Years",
    strengths: ["Strategic Vision", "Technical Breadth", "Cross-functional Lead"],
    currentFocus: "v4.0 Core Engine GA",
    pastReviews: [
      { period: "Q2 2024", score: "4.8/5", status: "Exceptional", summary: "Exceeded all OKR targets for the engine refactor.", krAttainment: 94, kpiVelocity: 98 },
      { period: "Q1 2024", score: "4.5/5", status: "Exceeds Expectations", summary: "Strong leadership during the Q1 roadmap pivot.", krAttainment: 88, kpiVelocity: 92 }
    ],
    idp: {
      goals: [
        { id: 'idp1', title: "Advanced System Architecture", type: "Certification", status: "In Progress", progress: 65, provider: "AWS", linkedGap: "Scale Strategy" },
        { id: 'idp2', title: "Executive Communication", type: "Mentorship", status: "Active", progress: 40, provider: "Internal (Alex Rivera)", linkedGap: "Stakeholder Management" }
      ],
      skills: [
        { name: "Product Roadmap", level: 95 },
        { name: "System Design", level: 82 },
        { name: "Data Modeling", level: 88 },
        { name: "Stakeholder MGMT", level: 90 }
      ]
    }
  },
  { 
    id: 2, 
    name: "Marcus Vane", 
    title: "DevOps Lead", 
    level: "L7", 
    dept: "Infrastructure", 
    health: 42, 
    avatar: "https://picsum.photos/seed/marcus/100/100", 
    email: "marcus.v@manovar.ai",
    location: "London, UK",
    tenure: "1.2 Years",
    strengths: ["Reliability Engineering", "Security First"],
    currentFocus: "Cloud Cost Optimization",
    pastReviews: [
      { period: "Q2 2024", score: "3.2/5", status: "Meets Expectations", summary: "Maintenance tasks handled, but strategic projects delayed.", krAttainment: 65, kpiVelocity: 74 }
    ],
    idp: { 
      goals: [
        { id: 'idp3', title: "Cost-Aware Infrastructure", type: "Workshop", status: "Pending", progress: 0, provider: "A Cloud Guru", linkedGap: "Budget Efficiency" }
      ],
      skills: [
        { name: "Kubernetes", level: 90 },
        { name: "Terraform", level: 85 },
        { name: "FinOps", level: 45 }
      ]
    }
  },
  { 
    id: 3, 
    name: "Emily Zhao", 
    title: "UX Designer", 
    level: "L4", 
    dept: "Creative", 
    health: 100, 
    avatar: "https://picsum.photos/seed/emily/100/100", 
    email: "emily.z@manovar.ai",
    location: "New York, US",
    tenure: "3.1 Years",
    strengths: ["Visual Craft", "User Empathy", "Design Systems"],
    currentFocus: "Accessibility Pass v2",
    pastReviews: [
      { period: "Q2 2024", score: "5.0/5", status: "Exceptional", summary: "Revolutionary work on the Design System v2.", krAttainment: 100, kpiVelocity: 100 }
    ],
    idp: { 
      goals: [],
      skills: [
        { name: "Figma", level: 100 },
        { name: "Design Research", level: 92 },
        { name: "React/CSS", level: 75 }
      ]
    }
  },
  { id: 4, name: "Jordan Smith", title: "Staff Engineer", level: "L8", dept: "Core Platform", health: 85, avatar: "https://picsum.photos/seed/jordan/100/100", email: "jordan.s@manovar.ai", pastReviews: [], idp: { goals: [], skills: [] } },
];

interface PeoplePageProps {
  role?: UserRole;
}

const PeoplePage: React.FC<PeoplePageProps> = ({ role = UserRole.ORG_ADMIN }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPerson, setSelectedPerson] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [profileTab, setProfileTab] = useState<'info' | 'history' | 'idp'>('info');
  const [isPipActionOpen, setIsPipActionOpen] = useState(false);
  const navigate = useNavigate();
  
  const itemsPerPage = 10;
  const currentItems = MOCK_PEOPLE.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const canManage = [UserRole.ORG_ADMIN, UserRole.HR, UserRole.MANAGER].includes(role);

  const handleOpenPipWizard = () => {
    setIsPipActionOpen(false);
    navigate(`/initiate-pip/${selectedPerson.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">People & Structure</h1>
          <p className="text-slate-500 text-sm mt-1">Manage organizational hierarchy, roles, and skills governance</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">
            <FileText size={16} />
            <span>Org Chart</span>
          </button>
          {canManage && (
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
            >
              <Users size={16} />
              <span>Add Person</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DataIndicator label="Data Completeness" value="94%" color="green" />
        <DataIndicator label="Skill Density" value="High" color="primary" />
        <DataIndicator label="Anomaly Detection" value="2 Flags" color="red" />
        <DataIndicator label="Audit Status" value="Healthy" color="green" />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
           <div className="flex items-center space-x-4">
              <div className="relative w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Search talent..." className="w-full bg-slate-50 border border-transparent rounded-lg pl-10 pr-4 py-2 text-xs focus:bg-white focus:border-primary outline-none transition-all" />
              </div>
           </div>
        </div>

        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Role & Level</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Data Health</th>
              <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
             {currentItems.map((person) => (
               <PersonRow 
                 key={person.id}
                 person={person}
                 canManage={canManage}
                 onView={() => {
                   setSelectedPerson(person);
                   setIsViewOpen(true);
                   setProfileTab('info');
                 }}
               />
             ))}
          </tbody>
        </table>
        <Pagination currentPage={currentPage} totalItems={MOCK_PEOPLE.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} />
      </div>

      {/* View Profile Slide-over */}
      {isViewOpen && selectedPerson && (
        <>
          <div className="fixed inset-0 z-[110] bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsViewOpen(false)}></div>
          <div className="fixed top-0 right-0 bottom-0 w-full sm:w-[550px] bg-white z-[120] shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden">
            <div className="relative h-48 bg-slate-900 overflow-hidden shrink-0">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-secondary/40"></div>
               <button onClick={() => setIsViewOpen(false)} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all z-20">
                  <X size={20} />
               </button>
            </div>
            
            <div className="px-8 -mt-16 flex-1 pb-12 overflow-y-auto custom-scrollbar relative bg-white">
               <div className="flex flex-col">
                  <div className="relative inline-block w-fit">
                    <img src={selectedPerson.avatar} className="w-32 h-32 rounded-3xl border-4 border-white shadow-2xl relative z-10 bg-white object-cover" alt={selectedPerson.name} />
                  </div>
                  
                  <div className="mt-6 flex flex-col space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">{selectedPerson.name}</h2>
                        <p className="text-slate-500 font-bold text-lg flex items-center mt-1">
                          {selectedPerson.title} <span className="mx-2 text-slate-200">|</span> <span className="text-primary">{selectedPerson.level}</span>
                        </p>
                      </div>
                      
                      {canManage && (
                        <div className="relative">
                          <button 
                            onClick={() => setIsPipActionOpen(!isPipActionOpen)}
                            className={`p-3 rounded-2xl border transition-all flex items-center space-x-2 ${isPipActionOpen ? 'bg-indigo-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                          >
                             <PipIcon size={18} />
                             <ChevronDown size={14} className={`transition-transform ${isPipActionOpen ? 'rotate-180' : ''}`} />
                          </button>
                          {isPipActionOpen && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setIsPipActionOpen(false)}></div>
                              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-100 shadow-2xl rounded-2xl z-20 p-2 animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
                                 <p className="px-3 py-2 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Governance Units</p>
                                 <button 
                                  onClick={handleOpenPipWizard}
                                  className="w-full flex items-center space-x-3 px-3 py-3 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all text-left"
                                 >
                                    <PipIcon size={16} />
                                    <span>Initiate Formal PIP</span>
                                 </button>
                                 <button className="w-full flex items-center space-x-3 px-3 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-all text-left">
                                    <Flag size={16} />
                                    <span>Mark Performance Flag</span>
                                 </button>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl w-full shadow-inner">
                       <ProfileTabButton active={profileTab === 'info'} onClick={() => setProfileTab('info')} label="Context" />
                       <ProfileTabButton active={profileTab === 'history'} onClick={() => setProfileTab('history')} label="Horizon Archive" />
                       <ProfileTabButton active={profileTab === 'idp'} onClick={() => setProfileTab('idp')} label="Growth & IDP" />
                    </div>

                    {/* Context Tab */}
                    {profileTab === 'info' && (
                      <div className="space-y-8 animate-in fade-in duration-300 pb-8">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Department</p>
                            <p className="text-sm font-black text-slate-800 tracking-tight">{selectedPerson.dept}</p>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Institutional Health</p>
                            <p className={`text-sm font-black tracking-tight ${selectedPerson.health < 50 ? 'text-red-600' : 'text-primary'}`}>{selectedPerson.health}%</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Institutional Profile</h4>
                          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 space-y-4 shadow-sm">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                              <div className="flex items-center space-x-3 text-slate-500">
                                <MapPin size={14} />
                                <span className="text-xs font-bold">{selectedPerson.location || "Not specified"}</span>
                              </div>
                              <div className="flex items-center space-x-3 text-slate-500">
                                <Clock size={14} />
                                <span className="text-xs font-bold">Tenure: {selectedPerson.tenure || "--"}</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                               <p className="text-[9px] font-black text-slate-400 uppercase">Core Strengths</p>
                               <div className="flex flex-wrap gap-2">
                                  {(selectedPerson.strengths || ["Strategy", "Execution"]).map((s: string) => (
                                    <span key={s} className="px-2.5 py-1 bg-white border border-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-tight">{s}</span>
                                  ))}
                               </div>
                            </div>
                            <div className="pt-2">
                               <p className="text-[9px] font-black text-slate-400 uppercase">Current Performance Anchor</p>
                               <p className="text-sm font-bold text-slate-800 mt-1">{selectedPerson.currentFocus || "Strategy Alignment"}</p>
                            </div>
                          </div>
                        </div>

                        {selectedPerson.health < 50 && (
                          <div className="p-6 bg-red-50 border-2 border-red-100 rounded-[2rem] flex items-start space-x-5 shadow-sm">
                             <div className="p-3 bg-white rounded-2xl text-red-600 border border-red-50 shrink-0 shadow-sm">
                                <PipIcon size={24} />
                             </div>
                             <div>
                                <p className="text-sm font-black text-red-900 uppercase tracking-tight">Escalation Threshold Triggered</p>
                                <p className="text-xs text-red-700 mt-2 leading-relaxed font-medium">Health index is below institutional tolerance (50%). Formal Performance Improvement escalation is recommended via the Governance menu above.</p>
                             </div>
                          </div>
                        )}
                        
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Performance Archetype</h4>
                          <div className="p-6 bg-primary/5 border border-primary/10 rounded-3xl flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                                  <Medal size={24} />
                               </div>
                               <div>
                                  <p className="text-sm font-black text-slate-900">Elite Individual Contributor</p>
                                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Top 5% for Role Cohort</p>
                               </div>
                            </div>
                            <TrendingUp size={24} className="text-primary opacity-20" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Horizon Archive Tab */}
                    {profileTab === 'history' && (
                      <div className="space-y-6 animate-in fade-in duration-300 pb-8">
                         <div className="flex items-center justify-between px-1">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Calibration Ledger</h4>
                            <span className="text-[9px] font-bold text-slate-400 uppercase">{selectedPerson.pastReviews.length} Archived Cycles</span>
                         </div>
                         <div className="space-y-4">
                           {selectedPerson.pastReviews.map((rev: any, idx: number) => (
                             <div key={idx} className="group relative">
                               {idx < selectedPerson.pastReviews.length - 1 && (
                                 <div className="absolute left-10 top-20 bottom-0 w-[2px] bg-slate-100 z-0" />
                               )}
                               <div className="p-6 border border-slate-100 rounded-3xl bg-white hover:border-primary/20 transition-all shadow-sm relative z-10">
                                  <div className="flex justify-between items-start mb-6">
                                     <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors shadow-inner">
                                           <History size={18} />
                                        </div>
                                        <div>
                                           <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">{rev.period}</p>
                                           <p className="text-sm font-black text-slate-900 tracking-tight">Calibration: {rev.score}</p>
                                        </div>
                                     </div>
                                     <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-lg text-[8px] font-black uppercase tracking-widest shadow-sm">{rev.status}</span>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-3 mb-6">
                                     <div className="p-3 bg-slate-50 rounded-2xl flex flex-col justify-center items-center text-center border border-slate-100">
                                        <p className="text-[8px] font-black text-slate-400 uppercase mb-1">OKR Attainment</p>
                                        <p className="text-xs font-black text-slate-900">{rev.krAttainment}%</p>
                                     </div>
                                     <div className="p-3 bg-slate-50 rounded-2xl flex flex-col justify-center items-center text-center border border-slate-100">
                                        <p className="text-[8px] font-black text-slate-400 uppercase mb-1">KPI Velocity</p>
                                        <p className="text-xs font-black text-slate-900">{rev.kpiVelocity}%</p>
                                     </div>
                                  </div>

                                  <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 italic font-medium text-[11px] text-slate-500 leading-relaxed">
                                     "{rev.summary}"
                                  </div>
                               </div>
                             </div>
                           ))}
                           {selectedPerson.pastReviews.length === 0 && (
                             <div className="py-20 text-center flex flex-col items-center space-y-4">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                                   <History size={32} />
                                </div>
                                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No archived reviews found</p>
                             </div>
                           )}
                         </div>
                      </div>
                    )}

                    {/* Growth & IDP Tab */}
                    {profileTab === 'idp' && (
                      <div className="space-y-8 animate-in fade-in duration-300 pb-8">
                         <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Institutional Learning Progress</h4>
                            <div className="space-y-3">
                               {(selectedPerson.idp?.goals || []).map((goal: any) => (
                                 <div key={goal.id} className="p-5 border border-slate-100 rounded-3xl bg-white hover:shadow-md transition-all group">
                                    <div className="flex items-start justify-between mb-4">
                                       <div className="flex items-center space-x-3">
                                          <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                             {goal.type === 'Certification' ? <Medal size={20} /> : <BookOpen size={20} />}
                                          </div>
                                          <div>
                                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{goal.type}</p>
                                             <h5 className="text-sm font-black text-slate-900 tracking-tight">{goal.title}</h5>
                                          </div>
                                       </div>
                                       <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${goal.status === 'Active' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'}`}>{goal.status}</span>
                                    </div>
                                    <div className="space-y-2">
                                       <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                                          <span>{goal.provider}</span>
                                          <span className="text-slate-900">{goal.progress}%</span>
                                       </div>
                                       <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                          <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${goal.progress}%` }} />
                                       </div>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-slate-50 flex items-center space-x-2">
                                       <Target size={10} className="text-primary" />
                                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Bridges Gap: {goal.linkedGap}</span>
                                    </div>
                                 </div>
                               ))}
                               {(selectedPerson.idp?.goals?.length === 0) && (
                                 <button className="w-full py-8 border-2 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-400 hover:border-primary/40 hover:text-primary transition-all group bg-slate-50/50">
                                    <Plus size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Initialize IDP Cycle</span>
                                 </button>
                               )}
                            </div>
                         </div>

                         <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Skill Maturity Hub</h4>
                            <div className="grid grid-cols-2 gap-4">
                               {(selectedPerson.idp?.skills || []).map((skill: any) => (
                                 <div key={skill.name} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col space-y-3">
                                    <div className="flex justify-between items-center">
                                       <span className="text-xs font-bold text-slate-700">{skill.name}</span>
                                       <span className="text-[10px] font-black text-primary">{skill.level}%</span>
                                    </div>
                                    <div className="h-1 w-full bg-white rounded-full overflow-hidden shadow-inner">
                                       <div className="h-full bg-primary" style={{ width: `${skill.level}%` }} />
                                    </div>
                                 </div>
                               ))}
                            </div>
                         </div>

                         <div className="p-6 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden group shadow-xl">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><BrainCircuit size={80} className="text-primary" /></div>
                            <div className="relative z-10">
                               <h5 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 border-l-2 border-primary pl-4">Growth Intelligence</h5>
                               <p className="text-xs text-slate-300 font-medium italic leading-relaxed">
                                  "Based on technical velocity in Q2, {selectedPerson.name.split(' ')[0]} shows high aptitude for System Architecture. Suggest enrolling in AWS Solutions Architect path."
                                </p>
                            </div>
                         </div>
                      </div>
                    )}
                  </div>
               </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const DataIndicator = ({ label, value, color }: any) => {
  const colorMap: any = { primary: 'text-primary', green: 'text-green-600', red: 'text-red-600' };
  return (
    <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-center">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-2xl font-black ${colorMap[color]}`}>{value}</p>
    </div>
  );
};

const PersonRow = ({ person, canManage, onView }: any) => (
  <tr className="group hover:bg-slate-50/50 transition-all cursor-pointer" onClick={onView}>
    <td className="px-6 py-4">
      <div className="flex items-center space-x-3">
        <img src={person.avatar} alt={person.name} className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" />
        <div><p className="text-sm font-bold text-slate-800">{person.name}</p><p className="text-[10px] text-slate-500">{person.email}</p></div>
      </div>
    </td>
    <td className="px-6 py-4">
       <div><p className="text-xs font-bold text-slate-700">{person.title}</p><span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-black uppercase tracking-widest">{person.level}</span></div>
    </td>
    <td className="px-6 py-4 text-xs font-medium text-slate-600 uppercase tracking-tight">{person.dept}</td>
    <td className="px-6 py-4">
       <div className="flex items-center space-x-2">
          <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden shadow-inner">
             <div className={`h-full rounded-full ${person.health > 80 ? 'bg-green-500' : person.health > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${person.health}%` }}></div>
          </div>
          <span className={`text-[10px] font-black ${person.health < 50 ? 'text-red-500' : 'text-slate-400'}`}>{person.health}%</span>
       </div>
    </td>
    <td className="px-6 py-4 text-right">
       <button onClick={(e) => { e.stopPropagation(); onView(); }} className="p-2 text-slate-300 hover:text-primary hover:bg-white rounded-lg transition-all"><ExternalLink size={18} /></button>
    </td>
  </tr>
);

const ProfileTabButton = ({ active, onClick, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
  >
    {label}
  </button>
);

export default PeoplePage;