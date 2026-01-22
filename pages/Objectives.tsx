
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Table as TableIcon, 
  Search, 
  Layers, 
  Plus, 
  ChevronRight, 
  ArrowLeft, 
  Target, 
  Briefcase, 
  UserPlus, 
  CheckCircle2, 
  Inbox, 
  X, 
  Activity, 
  ArrowRight, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  GitBranch,
  Building2,
  ExternalLink,
  MessageSquare,
  Clock,
  ChevronDown,
  BrainCircuit,
  Minus,
  Maximize2,
  Zap,
  Star,
  Settings2,
  Calendar,
  Hash,
  Link as LinkIcon,
  HelpCircle,
  FileText,
  Workflow,
  AlertTriangle,
  Check,
  User,
  Users,
  Trophy,
  BarChart3,
  TrendingUp,
  Scale,
  /* Added Sparkles to fix "Cannot find name 'Sparkles'" error */
  Sparkles
} from 'lucide-react';
import Pagination from '../components/common/Pagination';
import { UserRole } from '../types';

// Enhanced Mock Data with owner names for filtering
const MOCK_OBJECTIVES = [
  // Global Level
  { id: 'glo-1', code: 'GLO-01', title: "Achieve AI Product Leadership", level: "Global", mappedTo: "Product Leadership Strategy", type: "OKR", progress: 85, status: "Active", weight: 30, confidence: 92, owner: "Alex Rivera" },
  { id: 'glo-2', code: 'GLO-02', title: "Global Infrastructure Resilience", level: "Global", mappedTo: "Operational Excellence", type: "OKR", progress: 72, status: "Active", weight: 25, confidence: 85, owner: "Alex Rivera" },
  { id: 'glo-3', code: 'GLO-03', title: "Market Share Expansion EMEA", level: "Global", mappedTo: "Revenue Growth", type: "OKR", progress: 45, status: "Active", weight: 20, confidence: 70, owner: "Alex Rivera" },
  { id: 'glo-4', code: 'GLO-04', title: "Customer Centricity Re-platforming", level: "Global", mappedTo: "Customer Experience", type: "OKR", progress: 90, status: "Active", weight: 15, confidence: 95, owner: "Alex Rivera" },
  { id: 'glo-5', code: 'GLO-05', title: "Zero-Trust Security Initiative", level: "Global", mappedTo: "Compliance & Safety", type: "OKR", progress: 30, status: "Active", weight: 10, confidence: 60, owner: "Alex Rivera" },

  // Departmental Level
  { id: 'dep-1', code: 'DEP-01', title: "API Efficiency Optimization", level: "Department", ownerDept: "Core Engineering", parentCode: 'GLO-01', type: "OKR", progress: 65, status: "Active", weight: 25, confidence: 80, owner: "Sarah Chen" },
  { id: 'dep-2', code: 'DEP-02', title: "Cloud Cost Efficiency Program", level: "Department", ownerDept: "Infrastructure", parentCode: 'GLO-02', type: "KPI", progress: 88, status: "Active", weight: 30, confidence: 90, owner: "Marcus Vane" },
  { id: 'dep-3', code: 'DEP-03', title: "EMEA Sales Pipeline Velocity", level: "Department", ownerDept: "Growth & Sales", parentCode: 'GLO-03', type: "OKR", progress: 54, status: "Active", weight: 20, confidence: 75, owner: "Elena Rossi" },
  { id: 'dep-4', code: 'DEP-04', title: "v4 UI Calibration Polish", level: "Department", ownerDept: "Product Strategy", parentCode: 'GLO-04', type: "OKR", progress: 92, status: "Active", weight: 15, confidence: 92, owner: "Sarah Chen" },
  { id: 'dep-5', code: 'DEP-05', title: "Auth-Layer Security Refactor", level: "Department", ownerDept: "Security Unit", parentCode: 'GLO-05', type: "SMART", progress: 40, status: "Active", weight: 10, confidence: 65, owner: "David Wright" },

  // Individual Level - Assigned to specific people
  { id: 'ind-1', code: 'IND-01', title: "Implement Semantic Layer for v4", level: "Individual", parentCode: 'DEP-01', type: "OKR", progress: 78, status: "Active", owner: "Sarah Chen", weight: 40, confidence: 85 },
  { id: 'ind-2', code: 'IND-02', title: "Docker Image Multi-Stage Refactor", level: "Individual", parentCode: 'DEP-02', type: "OKR", progress: 95, status: "Active", owner: "Marcus Vane", weight: 50, confidence: 98 },
  { id: 'ind-3', code: 'IND-03', title: "DACH Region Outreach Velocity", level: "Individual", parentCode: 'DEP-03', type: "KPI", progress: 33, status: "Active", owner: "Jordan Smith", weight: 30, confidence: 60 },
  { id: 'ind-4', code: 'IND-04', title: "Design Component Audit Q3", level: "Individual", parentCode: 'DEP-04', type: "OKR", progress: 85, status: "Active", owner: "Elena Rossi", weight: 25, confidence: 90 },
  { id: 'ind-5', code: 'IND-05', title: "Pen-Testing Feedback Loop v2", level: "Individual", parentCode: 'DEP-05', type: "OKR", progress: 20, status: "Active", owner: "David Wright", weight: 35, confidence: 55 },
  { id: 'ind-6', code: 'IND-06', title: "SDK Integration Documentation", level: "Individual", parentCode: 'DEP-01', type: "SMART", progress: 100, status: "Active", owner: "Sarah Chen", weight: 20, confidence: 100 },
  { id: 'ind-7', code: 'IND-07', title: "Cloud Cost Tagging Automation", level: "Individual", parentCode: 'DEP-02', type: "KPI", progress: 60, status: "Active", owner: "Marcus Vane", weight: 30, confidence: 80 }
];

const MOCK_EMPLOYEES_LIST = [
  { id: 'all', name: 'All Employees', avatar: null },
  { id: 'u1', name: "Sarah Chen", avatar: "https://picsum.photos/seed/sarah/100/100" },
  { id: 'u2', name: "Marcus Vane", avatar: "https://picsum.photos/seed/marcus/100/100" },
  { id: 'u3', name: "Jordan Smith", avatar: "https://picsum.photos/seed/jordan/100/100" },
  { id: 'u4', name: "Elena Rossi", avatar: "https://picsum.photos/seed/elena/100/100" },
  { id: 'u5', name: "David Wright", avatar: "https://picsum.photos/seed/david/100/100" },
];

const MOCK_DEPARTMENTS_LIST = [
  { id: 'all', name: 'All Departments' },
  { id: 'd1', name: 'Core Engineering' },
  { id: 'd2', name: 'Infrastructure' },
  { id: 'd3', name: 'Growth & Sales' },
  { id: 'd4', name: 'Product Strategy' },
  { id: 'd5', name: 'Security Unit' },
];

const MOCK_REVIEW_QUEUE = [
  { id: 'rev-1', name: "Marcus Vane", dept: "DevOps", items: 2, avatar: "https://picsum.photos/seed/marcus/100/100", goals: [
    { id: 'rg1', title: "Cloud Budget Automation", type: "OKR", progress: 0, krs: [{ title: "Reduce manual tagging by 80%", status: "Pending" }] },
    { id: 'rg2', title: "SLA Monitoring Upgrade", type: "KPI", progress: 0, krs: [{ title: "Zero downtime during v4 rollout", status: "Pending" }] }
  ]},
  { id: 'rev-2', name: "Sarah Chen", dept: "Product Engineering", items: 1, avatar: "https://picsum.photos/seed/sarah/100/100", goals: [
    { id: 'rg3', title: "Core Engine Refactor Phase 2", type: "OKR", progress: 0, krs: [{ title: "Maintain < 200ms latency", status: "Pending" }] }
  ]},
  { id: 'rev-3', name: "Elena Rossi", dept: "Product Design", items: 3, avatar: "https://picsum.photos/seed/elena/100/100", goals: [
    { id: 'rg4', title: "Unified Pattern Library", type: "OKR", progress: 0, krs: [] }
  ]},
];

interface ObjectivesPageProps {
  role: UserRole;
}

const ObjectivesPage: React.FC<ObjectivesPageProps> = ({ role }) => {
  const isEmployee = role === UserRole.EMPLOYEE;
  const isOrgAdmin = role === UserRole.ORG_ADMIN;
  
  // Initialize tab based on role
  const [activeTab, setActiveTab] = useState<'Individual' | 'Department' | 'Global'>(isEmployee ? 'Individual' : 'Individual');
  const [viewMode, setViewMode] = useState<'table' | 'tree' | 'chart'>('table');
  const [viewPending, setViewPending] = useState(false);
  const [selectedReviewMember, setSelectedReviewMember] = useState<any>(null);
  const [drillDownGoal, setDrillDownGoal] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Admin Talent Filter State (Individual)
  const [selectedEmployee, setSelectedEmployee] = useState<string>('All Employees');
  const [isTalentDropdownOpen, setIsTalentDropdownOpen] = useState(false);
  const [talentSearch, setTalentSearch] = useState('');
  const talentDropdownRef = useRef<HTMLDivElement>(null);

  // Admin Dept Filter State (Department)
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('All Departments');
  const [isDeptDropdownOpen, setIsDeptDropdownOpen] = useState(false);
  const [deptSearch, setDeptSearch] = useState('');
  const deptDropdownRef = useRef<HTMLDivElement>(null);

  // Define Objective State
  const [isDefineModalOpen, setIsDefineModalOpen] = useState(false);
  const [defineObjectiveType, setDefineObjectiveType] = useState<'Individual' | 'Department' | 'Global' | null>(null);
  const [isChoiceDropdownOpen, setIsChoiceDropdownOpen] = useState(false);

  // If role is employee, force activeTab to Individual whenever it renders
  useEffect(() => {
    if (isEmployee) {
      setActiveTab('Individual');
    }
  }, [isEmployee]);

  // Dropdown click outside logic
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (talentDropdownRef.current && !talentDropdownRef.current.contains(event.target as Node)) {
        setIsTalentDropdownOpen(false);
      }
      if (deptDropdownRef.current && !deptDropdownRef.current.contains(event.target as Node)) {
        setIsDeptDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isLeadership = [UserRole.ORG_ADMIN, UserRole.EXECUTIVE, UserRole.MANAGER].includes(role);
  const isHOD = [UserRole.ORG_ADMIN, UserRole.EXECUTIVE, UserRole.MANAGER, UserRole.HR].includes(role);

  const filteredGoals = useMemo(() => {
    let goals = MOCK_OBJECTIVES.filter(o => o.level === activeTab);
    
    // Individual filtering
    if (activeTab === 'Individual' && isOrgAdmin && selectedEmployee !== 'All Employees') {
      goals = goals.filter(g => g.owner === selectedEmployee);
    }
    
    // Department filtering
    if (activeTab === 'Department' && isOrgAdmin && selectedDeptFilter !== 'All Departments') {
      goals = goals.filter(g => g.ownerDept === selectedDeptFilter);
    }
    
    return goals;
  }, [activeTab, selectedEmployee, selectedDeptFilter, isOrgAdmin]);

  const paginatedGoals = useMemo(() => {
    return filteredGoals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredGoals, currentPage]);

  const filteredTalentList = useMemo(() => {
    return MOCK_EMPLOYEES_LIST.filter(t => 
      t.name.toLowerCase().includes(talentSearch.toLowerCase())
    );
  }, [talentSearch]);

  const filteredDeptList = useMemo(() => {
    return MOCK_DEPARTMENTS_LIST.filter(d => 
      d.name.toLowerCase().includes(deptSearch.toLowerCase())
    );
  }, [deptSearch]);

  const handleOpenGoalQuickView = (code: string) => {
    const goal = MOCK_OBJECTIVES.find(o => o.code === code);
    if (goal) setDrillDownGoal(goal);
  };

  const handleOpenReviewQueue = () => {
    setViewPending(true);
    setSelectedReviewMember(null);
  };

  const handleBackFromReviewDetail = () => {
    setSelectedReviewMember(null);
  };

  const handleDefineClick = () => {
    // Employees cannot choose scope; they only set individual objectives.
    if (isHOD) {
      setIsChoiceDropdownOpen(!isChoiceDropdownOpen);
    } else {
      setDefineObjectiveType('Individual');
      setIsDefineModalOpen(true);
    }
  };

  const selectDefineType = (type: 'Individual' | 'Department' | 'Global') => {
    setDefineObjectiveType(type);
    setIsDefineModalOpen(true);
    setIsChoiceDropdownOpen(false);
  };

  // Helper to build the hierarchy
  const hierarchy = useMemo(() => {
    const globals = MOCK_OBJECTIVES.filter(o => o.level === 'Global');
    return globals.map(global => ({
      ...global,
      children: MOCK_OBJECTIVES.filter(d => d.parentCode === global.code).map(dept => ({
        ...dept,
        children: MOCK_OBJECTIVES.filter(i => i.parentCode === dept.code)
      }))
    }));
  }, []);

  if (viewPending) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500 pb-20">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => {
              if (selectedReviewMember) handleBackFromReviewDetail();
              else setViewPending(false);
            }} 
            className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all text-slate-500 shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {selectedReviewMember ? `Review: ${selectedReviewMember.name}` : "Strategic Approval Queue"}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {selectedReviewMember ? `Authorizing proposed performance anchors for ${selectedReviewMember.dept}` : "Items requiring your authorization and calibration"}
            </p>
          </div>
        </div>

        {selectedReviewMember ? (
          <ReviewMemberDetail 
            member={selectedReviewMember} 
            onApprove={() => setSelectedReviewMember(null)}
          />
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden animate-in slide-in-from-right duration-400">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Team Member</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Items for Review</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_REVIEW_QUEUE.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-3">
                        <img src={member.avatar} className="w-9 h-9 rounded-full border-2 border-white shadow-sm" alt={member.name} />
                        <span className="text-sm font-bold text-slate-900">{member.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded">{member.dept}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold text-slate-700">{member.items} Objectives</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button 
                        onClick={() => setSelectedReviewMember(member)}
                        className="px-6 py-2 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                      >
                        Process
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight uppercase leading-none mb-1">
            {isEmployee ? 'My Objectives & Alignment' : 'Strategy & Objectives'}
          </h1>
          <p className="text-slate-500 text-sm">
            {isEmployee ? 'Manage your personal performance anchors and strategic alignment' : 'Manage institutional performance via level-based alignment tracking'}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
            <ViewToggle active={viewMode === 'table'} onClick={() => setViewMode('table')} icon={<TableIcon size={14} />} label="Table" />
            <ViewToggle active={viewMode === 'tree'} onClick={() => setViewMode('tree')} icon={<Layers size={14} />} label="Tree" />
            <ViewToggle active={viewMode === 'chart'} onClick={() => setViewMode('chart')} icon={<GitBranch size={14} />} label="Chart" />
          </div>
          
          <div className="relative">
            <button 
              onClick={handleDefineClick}
              className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
            >
              <Plus size={18} />
              <span>Define Objective</span>
            </button>
            
            {isChoiceDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsChoiceDropdownOpen(false)}></div>
                <div className="absolute right-0 mt-3 w-72 bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[2rem] z-20 p-3 animate-in fade-in zoom-in-95 duration-100">
                   <p className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-2">Scope Designation</p>
                   <button 
                    onClick={() => selectDefineType('Individual')}
                    className="w-full flex items-center space-x-4 px-4 py-4 hover:bg-slate-50 rounded-2xl transition-all text-left group"
                   >
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                         <UserPlus size={18} />
                      </div>
                      <div>
                         <p className="text-xs font-black text-slate-900 uppercase">Individual Goal</p>
                         <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mt-1">Personal performance anchors</p>
                      </div>
                   </button>
                   <button 
                    onClick={() => selectDefineType('Department')}
                    className="w-full flex items-center space-x-4 px-4 py-4 hover:bg-slate-50 rounded-2xl transition-all text-left group"
                   >
                      <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                         <Building2 size={18} />
                      </div>
                      <div>
                         <p className="text-xs font-black text-slate-900 uppercase">Departmental Goal</p>
                         <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mt-1">Unit level strategic cascading</p>
                      </div>
                   </button>
                   <button 
                    onClick={() => selectDefineType('Global')}
                    className="w-full flex items-center space-x-4 px-4 py-4 hover:bg-slate-50 rounded-2xl transition-all text-left group"
                   >
                      <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all shadow-inner">
                         <Target size={18} />
                      </div>
                      <div>
                         <p className="text-xs font-black text-slate-900 uppercase">Global Goal</p>
                         <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mt-1">Institutional North Star alignment</p>
                      </div>
                   </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {isLeadership && !isEmployee && (
        <div className="bg-indigo-50/80 border border-indigo-100 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between shadow-sm backdrop-blur-sm group">
           <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <Inbox size={22} />
              </div>
              <div>
                 <p className="text-sm font-black text-indigo-900 leading-tight uppercase tracking-tighter">Strategic Authorization Required</p>
                 <p className="text-[11px] text-indigo-600 font-bold mt-1 uppercase tracking-widest flex items-center">
                   <Activity size={10} className="mr-1.5" />
                   {MOCK_REVIEW_QUEUE.length} Items Pending Review
                 </p>
              </div>
           </div>
           <button 
            onClick={handleOpenReviewQueue}
            className="px-6 py-2.5 bg-white border border-indigo-100 text-indigo-600 rounded-xl text-xs font-black uppercase tracking-[0.1em] hover:bg-indigo-600 hover:text-white hover:shadow-xl transition-all flex items-center space-x-2"
           >
              <span>Process Review Queue</span>
              <ArrowRight size={14} />
           </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Only show Hierarchy Tabs for non-employees */}
        <aside className={`w-full lg:w-72 shrink-0 space-y-6 ${viewMode !== 'table' ? 'hidden lg:block' : ''}`}>
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm space-y-8 sticky top-6">
             {!isEmployee ? (
               <div className="space-y-6">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Performance Hierarchy</h3>
                  <div className="space-y-1">
                    <LevelTab label="Individual Goals" active={activeTab === 'Individual'} onClick={() => {setActiveTab('Individual'); setCurrentPage(1);}} icon={<UserPlus size={12}/>} />
                    <LevelTab label="Departmental Goals" active={activeTab === 'Department'} onClick={() => {setActiveTab('Department'); setCurrentPage(1);}} icon={<Briefcase size={12}/>} />
                    <LevelTab 
                      label={isOrgAdmin ? "Company Goals" : "Global Strategy"} 
                      active={activeTab === 'Global'} 
                      onClick={() => {setActiveTab('Global'); setCurrentPage(1);}} 
                      icon={<Target size={12}/>} 
                    />
                  </div>
               </div>
             ) : (
               <div className="space-y-6">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">My Performance Context</h3>
                  <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl space-y-4">
                     <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Average Attainment</p>
                        <p className="text-xl font-black text-slate-900">68%</p>
                     </div>
                     <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[68%]" />
                     </div>
                     <p className="text-[10px] text-slate-500 italic font-medium leading-relaxed">
                        Aligned with 4 Departmental success anchors.
                     </p>
                  </div>
               </div>
             )}
             <div className="p-6 bg-slate-900 rounded-[2.5rem] text-white space-y-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity"><ShieldCheck size={48} className="text-primary"/></div>
                <div className="flex items-center space-x-2 text-primary relative z-10">
                   <ShieldCheck size={16} />
                   <span className="text-[10px] font-black uppercase tracking-widest leading-none">Governance Active</span>
                </div>
                <p className="text-xs font-medium text-slate-300 leading-relaxed italic relative z-10">
                   Goal level overrides are locked during active cycles. Request calibration to modify.
                </p>
             </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {viewMode === 'table' && (
            <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col animate-in fade-in duration-300">
              <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                 <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest">
                    {isEmployee ? 'My Personalized Performance Anchors' : `${activeTab} Performance anchors`}
                 </h3>
                 
                 {/* SEARCH & SELECT TALENT (Org Admin Only) */}
                 <div className="flex items-center space-x-4">
                    {isOrgAdmin && activeTab === 'Individual' ? (
                       <div className="relative" ref={talentDropdownRef}>
                          <button 
                            onClick={() => setIsTalentDropdownOpen(!isTalentDropdownOpen)}
                            className="flex items-center space-x-3 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-700 shadow-sm hover:border-primary transition-all group min-w-[220px]"
                          >
                             <Users size={14} className="text-slate-400 group-hover:text-primary" />
                             <span className="flex-1 text-left truncate">{selectedEmployee}</span>
                             <ChevronDown size={14} className={`text-slate-400 transition-transform ${isTalentDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>

                          {isTalentDropdownOpen && (
                             <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl z-[100] p-2 animate-in zoom-in-95 duration-100">
                                <div className="relative mb-2">
                                   <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                                   <input 
                                      autoFocus
                                      value={talentSearch}
                                      onChange={(e) => setTalentSearch(e.target.value)}
                                      placeholder="Search institutional talent..."
                                      className="w-full bg-slate-50 border-none rounded-lg pl-9 pr-3 py-2 text-[10px] font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                   />
                                </div>
                                <div className="max-h-64 overflow-y-auto custom-scrollbar space-y-0.5">
                                   {filteredTalentList.map(talent => (
                                      <button 
                                        key={talent.id}
                                        onClick={() => {
                                           setSelectedEmployee(talent.name);
                                           setIsTalentDropdownOpen(false);
                                           setTalentSearch('');
                                           setCurrentPage(1);
                                        }}
                                        className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all text-left group ${selectedEmployee === talent.name ? 'bg-primary text-white' : 'hover:bg-slate-50'}`}
                                      >
                                         {talent.avatar ? (
                                           <img src={talent.avatar} className="w-6 h-6 rounded-full border border-white/20" alt={talent.name} />
                                         ) : (
                                           <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-black ${selectedEmployee === talent.name ? 'bg-white/20' : 'bg-slate-200 text-slate-500'}`}>ALL</div>
                                         )}
                                         <span className="text-[10px] font-black uppercase tracking-tight">{talent.name}</span>
                                      </button>
                                   ))}
                                   {filteredTalentList.length === 0 && (
                                      <div className="py-8 text-center text-slate-400 text-[10px] font-black uppercase italic">No matches found</div>
                                   )}
                                </div>
                             </div>
                          )}
                       </div>
                    ) : isOrgAdmin && activeTab === 'Department' ? (
                       <div className="relative" ref={deptDropdownRef}>
                          <button 
                            onClick={() => setIsDeptDropdownOpen(!isDeptDropdownOpen)}
                            className="flex items-center space-x-3 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-700 shadow-sm hover:border-primary transition-all group min-w-[220px]"
                          >
                             <Building2 size={14} className="text-slate-400 group-hover:text-primary" />
                             <span className="flex-1 text-left truncate">{selectedDeptFilter}</span>
                             <ChevronDown size={14} className={`text-slate-400 transition-transform ${isDeptDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>

                          {isDeptDropdownOpen && (
                             <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl z-[100] p-2 animate-in zoom-in-95 duration-100">
                                <div className="relative mb-3">
                                   <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                                   <input 
                                      autoFocus
                                      value={deptSearch}
                                      onChange={(e) => setDeptSearch(e.target.value)}
                                      placeholder="Search departments..."
                                      className="w-full bg-slate-50 border-none rounded-lg pl-9 pr-4 py-2 text-[10px] font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                   />
                                </div>
                                <div className="max-h-64 overflow-y-auto custom-scrollbar space-y-0.5">
                                   {filteredDeptList.map(dept => (
                                      <button 
                                        key={dept.id}
                                        onClick={() => {
                                           setSelectedDeptFilter(dept.name);
                                           setIsDeptDropdownOpen(false);
                                           setDeptSearch('');
                                           setCurrentPage(1);
                                        }}
                                        className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all text-left group ${selectedDeptFilter === dept.name ? 'bg-primary text-white' : 'hover:bg-slate-50'}`}
                                      >
                                         <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-black ${selectedDeptFilter === dept.name ? 'bg-white/20' : 'bg-slate-200 text-slate-500'}`}>
                                            {dept.name === 'All Departments' ? 'ALL' : dept.name.charAt(0)}
                                         </div>
                                         <span className="text-[10px] font-black uppercase tracking-tight">{dept.name}</span>
                                      </button>
                                   ))}
                                   {filteredDeptList.length === 0 && (
                                      <div className="py-8 text-center text-slate-400 text-[10px] font-black uppercase italic">No matches found</div>
                                   )}
                                </div>
                             </div>
                          )}
                       </div>
                    ) : (
                       <span className="text-[10px] font-black text-slate-400 uppercase bg-white border border-slate-100 px-3 py-1 rounded-full shadow-sm">
                          {filteredGoals.length} Items Total
                       </span>
                    )}
                 </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Objective</th>
                      {activeTab === 'Individual' && isOrgAdmin && selectedEmployee === 'All Employees' && <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Owner</th>}
                      {activeTab === 'Department' && isOrgAdmin && selectedDeptFilter === 'All Departments' && <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Owner Unit</th>}
                      {activeTab === 'Individual' && <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mapped Dept Goal</th>}
                      {activeTab === 'Department' && <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mapped Global Goal</th>}
                      {activeTab === 'Global' && <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Org Strategy</th>}
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Attainment</th>
                      <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedGoals.map(obj => (
                      <tr 
                        key={obj.id} 
                        onClick={() => handleOpenGoalQuickView(obj.code)}
                        className="hover:bg-slate-50/50 group transition-all cursor-pointer"
                      >
                        <td className="px-8 py-6">
                           <span className="text-[10px] font-black text-slate-400 font-mono tracking-tighter">{obj.code}</span>
                        </td>
                        <td className="px-8 py-6 min-w-[250px]">
                          <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors uppercase tracking-tight">{obj.title}</p>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 block">{obj.type} Framework</span>
                        </td>
                        {activeTab === 'Individual' && isOrgAdmin && selectedEmployee === 'All Employees' && (
                          <td className="px-8 py-6">
                            <div className="flex items-center space-x-2">
                               <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-400 uppercase">
                                  {obj.owner?.charAt(0)}
                               </div>
                               <span className="text-[11px] font-bold text-slate-700">{obj.owner}</span>
                            </div>
                          </td>
                        )}
                        {activeTab === 'Department' && isOrgAdmin && selectedDeptFilter === 'All Departments' && (
                          <td className="px-8 py-6">
                            <div className="flex items-center space-x-2 text-xs font-bold text-slate-600">
                               <Building2 size={12} className="text-slate-300" />
                               <span className="uppercase">{obj.ownerDept}</span>
                            </div>
                          </td>
                        )}
                        {(activeTab === 'Individual' || activeTab === 'Department') && (
                          <td className="px-8 py-6">
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleOpenGoalQuickView(obj.parentCode!); }}
                              className="flex items-center space-x-2 text-[10px] font-black text-primary bg-primary/5 px-3 py-1.5 rounded-xl border border-primary/10 hover:bg-primary hover:text-white transition-all shadow-sm"
                            >
                               <span>{obj.parentCode}</span>
                               <ExternalLink size={10} />
                            </button>
                          </td>
                        )}
                        {activeTab === 'Global' && (
                          <td className="px-8 py-6">
                             <span className="text-xs font-medium text-slate-500 italic">"{obj.mappedTo}"</span>
                          </td>
                        )}
                        <td className="px-8 py-6">
                          <div className="flex items-center justify-center space-x-4">
                             <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden shrink-0 shadow-inner">
                                <div className="h-full bg-primary" style={{ width: `${obj.progress}%` }}></div>
                             </div>
                             <span className="text-[11px] font-black text-slate-900">{obj.progress}%</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <StatusBadge status={obj.status} mini />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Pagination 
                  currentPage={currentPage} 
                  totalItems={filteredGoals.length} 
                  itemsPerPage={itemsPerPage} 
                  onPageChange={setCurrentPage} 
                />
              </div>
            </div>
          )}

          {viewMode === 'tree' && (
            <TreeView hierarchy={hierarchy} onOpenQuickView={handleOpenGoalQuickView} />
          )}

          {viewMode === 'chart' && (
            <ChartView hierarchy={hierarchy} onOpenQuickView={handleOpenGoalQuickView} />
          )}
        </div>
      </div>

      {/* --- MODALS --- */}

      {drillDownGoal && (
        <GoalQuickViewModal goal={drillDownGoal} onClose={() => setDrillDownGoal(null)} />
      )}

      {isDefineModalOpen && defineObjectiveType && (
        <DefineObjectiveWizard 
          type={defineObjectiveType} 
          onClose={() => setIsDefineModalOpen(false)} 
        />
      )}
    </div>
  );
};

/**
 * Enhanced Goal Quick View Modal Component
 */
const GoalQuickViewModal = ({ goal, onClose }: { goal: any, onClose: () => void }) => {
  // Generate dummy vectors for the comprehensive view
  const successVectors = [
    { title: "Optimize Throughput v4", progress: goal.progress, weight: 60, status: "Healthy" },
    { title: "Unit Maintenance SLOs", progress: Math.min(100, goal.progress + 5), weight: 40, status: "Active" }
  ];

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
       <div className="bg-white rounded-[3rem] w-full max-w-4xl shadow-2xl overflow-hidden border border-slate-200 border-t-[10px] border-t-primary flex flex-col max-h-[90vh]">
          {/* Header Section */}
          <div className="p-10 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
             <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20">
                   <Target size={32} />
                </div>
                <div>
                   <div className="flex items-center space-x-3 mb-2">
                      <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{goal.code} • Institutional Node</span>
                      <StatusBadge status={goal.status} mini />
                   </div>
                   <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">{goal.title}</h3>
                </div>
             </div>
             <button onClick={onClose} className="p-3 text-slate-300 hover:text-slate-600 transition-colors bg-white rounded-2xl shadow-sm border border-slate-100"><X size={24}/></button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-10">
             {/* Key Metrics Analytics Row */}
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <AnalyticMetric label="Horizon Progress" value={`${goal.progress}%`} icon={<Activity size={18} className="text-primary" />} />
                <AnalyticMetric label="Confidence" value={`${goal.confidence || 85}%`} icon={<BrainCircuit size={18} className="text-indigo-600" />} />
                <AnalyticMetric label="Inst. Weight" value={`${goal.weight || 20}%`} icon={<Scale size={18} className="text-slate-600" />} />
                <AnalyticMetric label="Unit Health" value="OPTIMAL" icon={<ShieldCheck size={18} className="text-green-600" />} />
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Success Vectors Column */}
                <div className="lg:col-span-8 space-y-6">
                   <div className="flex items-center justify-between px-1">
                      <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-l-4 border-primary pl-4">Child Performance Vectors</h4>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{successVectors.length} Key Results</span>
                   </div>
                   <div className="space-y-4">
                      {successVectors.map((v, i) => (
                         <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all">
                            <div className="flex items-center space-x-5">
                               <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-300 group-hover:text-primary shadow-sm transition-colors">
                                  <GitBranch size={20}/>
                               </div>
                               <div>
                                  <h5 className="text-sm font-black text-slate-800 uppercase tracking-tight">{v.title}</h5>
                                  <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Weight: {v.weight}% • Status: {v.status}</p>
                               </div>
                            </div>
                            <div className="flex items-center space-x-6">
                               <div className="text-right">
                                  <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Attainment</p>
                                  <span className="text-sm font-black text-slate-900">{v.progress}%</span>
                               </div>
                               <div className="h-10 w-[2px] bg-slate-200" />
                               <div className="p-2 bg-white rounded-lg text-slate-200 group-hover:text-primary transition-colors">
                                  <ChevronRight size={18}/>
                               </div>
                            </div>
                         </div>
                      ))}
                   </div>

                   {/* Strategic Context Panel */}
                   <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-6 opacity-5"><BrainCircuit size={120} className="text-primary" /></div>
                      <div className="relative z-10">
                         <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 flex items-center">
                            <Sparkles size={14} className="mr-2" /> Alignment Intelligence
                         </h4>
                         <p className="text-base font-medium text-slate-300 leading-relaxed italic">
                            "Performance anchor <span className="text-white font-bold">{goal.code}</span> demonstrates high tactical fidelity with the {goal.parentCode || 'Global'} Horizon. Cross-unit velocity indicates a stable delivery window."
                         </p>
                      </div>
                   </div>
                </div>

                {/* Ownership & Hierarchy Column */}
                <div className="lg:col-span-4 space-y-8">
                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Node Ownership</h4>
                      <div className="p-6 border border-slate-100 rounded-[2rem] bg-white shadow-sm flex items-center space-x-4">
                         <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                            <User size={24}/>
                         </div>
                         <div>
                            <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{goal.owner || "Strategic Unit"}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Custodian of Execution</p>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Cascade Strategy</h4>
                      <div className="p-6 border border-slate-100 rounded-[2rem] bg-white shadow-sm space-y-6">
                         <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase mb-2 tracking-widest">Parent Anchor</p>
                            <div className="flex items-center space-x-2 text-xs font-bold text-primary italic">
                               <LinkIcon size={12}/>
                               <span>{goal.parentCode || "Global Strategy"}</span>
                            </div>
                         </div>
                         <div className="pt-6 border-t border-slate-50">
                            <p className="text-[9px] font-black text-slate-400 uppercase mb-2 tracking-widest">Alignment Path</p>
                            <div className="flex flex-col space-y-1">
                               <span className="text-[10px] font-bold text-slate-700">Institutional Strategy Hub</span>
                               <ChevronDown size={10} className="text-slate-300 ml-2" />
                               <span className="text-[10px] font-bold text-primary uppercase">{goal.title}</span>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-[2rem] flex items-center justify-between group">
                      <div>
                         <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Audit Status</p>
                         <p className="text-xs font-bold text-indigo-900 mt-1 uppercase">Policy Verified</p>
                      </div>
                      <ShieldCheck size={24} className="text-indigo-400 group-hover:text-indigo-600 transition-colors" />
                   </div>
                </div>
             </div>
          </div>

          {/* Footer Actions */}
          <div className="p-10 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
             <button className="px-8 py-3 text-xs font-black text-slate-400 hover:text-slate-800 transition-colors uppercase tracking-widest">Download Full Brief</button>
             <button onClick={onClose} className="px-12 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all">Return to Registry</button>
          </div>
       </div>
    </div>
  );
};

const AnalyticMetric = ({ label, value, icon }: any) => (
  <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-3">
     <div className="flex items-center justify-between">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
        {icon}
     </div>
     <p className="text-2xl font-black text-slate-900 tracking-tight leading-none">{value}</p>
  </div>
);

/**
 * Define Objective Wizard Component
 */
const DefineObjectiveWizard = ({ type, onClose }: { type: 'Individual' | 'Department' | 'Global', onClose: () => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    framework: 'OKR',
    name: '',
    description: '',
    weight: 10,
    reviewPeriod: 'Q4 2024',
    parentGoal: ''
  });
  const [krs, setKrs] = useState<any[]>([
    { id: '1', title: '', weight: 0, tracking: 'Periodic Review', scoring: 'Percentage', start: 0, target: 100 }
  ]);

  // Dropdown states
  const [isParentDropdownOpen, setIsParentDropdownOpen] = useState(false);
  const [parentSearch, setParentSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const scoringMethods = ['Number', 'Percentage', '5-Point Scale', 'Star Rating'];
  
  // Dynamic Parent Selection Options based on type
  const parentOptions = type === 'Individual' 
    ? MOCK_OBJECTIVES.filter(o => o.level === 'Department')
    : type === 'Department'
      ? MOCK_OBJECTIVES.filter(o => o.level === 'Global')
      : [];

  const filteredParents = parentOptions.filter(p => 
    p.title.toLowerCase().includes(parentSearch.toLowerCase()) || 
    p.code.toLowerCase().includes(parentSearch.toLowerCase())
  );

  const selectedParentObj = parentOptions.find(p => p.code === formData.parentGoal);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsParentDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addKR = () => {
    setKrs([...krs, { id: Date.now().toString(), title: '', weight: 0, tracking: 'Periodic Review', scoring: 'Percentage', start: 0, target: 100 }]);
  };

  const removeKR = (id: string) => {
    if (krs.length === 1) return;
    setKrs(krs.filter(kr => kr.id !== id));
  };

  const updateKR = (id: string, field: string, value: any) => {
    setKrs(krs.map(kr => kr.id === id ? { ...kr, [field]: value } : kr));
  };

  const canGoToStep2 = formData.name && (type === 'Global' || formData.parentGoal);
  const canFinalize = krs.every(kr => kr.title && kr.weight > 0);

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] w-full max-w-4xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
           <div className="flex items-center space-x-6">
              <div className={`w-14 h-14 ${type === 'Individual' ? 'bg-indigo-600' : type === 'Global' ? 'bg-amber-500' : 'bg-primary'} text-white rounded-2xl flex items-center justify-center shadow-xl`}>
                 {type === 'Individual' ? <UserPlus size={28} /> : type === 'Global' ? <Target size={28} /> : <Building2 size={28} />}
              </div>
              <div>
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">Define {type} Objective</h3>
                 <div className="flex items-center space-x-3 mt-1.5">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-widest flex items-center">
                       Step {step} of 2 <span className="mx-2 opacity-30">•</span> {step === 1 ? 'Strategic Context' : 'Performance Vectors'}
                    </span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-[9px] font-black uppercase tracking-widest">
                       {formData.framework} Framework Deployed
                    </span>
                 </div>
              </div>
           </div>
           <button onClick={onClose} className="p-3 text-slate-400 hover:bg-white rounded-2xl transition-all shadow-sm hover:text-slate-600"><X size={28}/></button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar bg-white">
           {step === 1 && (
             <div className="space-y-12 animate-in slide-in-from-right duration-400">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Objective Designation</label>
                        <input 
                           value={formData.name}
                           onChange={e => setFormData({...formData, name: e.target.value})}
                           placeholder="e.g. Optimize Cloud Compute Latency"
                           className="w-full bg-white text-slate-900 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-lg outline-none focus:border-primary transition-all shadow-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Strategic Narrative (Optional)</label>
                        <textarea 
                           value={formData.description}
                           onChange={e => setFormData({...formData, description: e.target.value})}
                           placeholder="Provide context for this performance anchor..."
                           className="w-full bg-white text-slate-900 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:border-primary transition-all shadow-sm h-32 resize-none"
                        />
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Institutional Weight</label>
                            <div className="relative">
                               <input 
                                  type="number"
                                  value={formData.weight}
                                  onChange={e => setFormData({...formData, weight: parseInt(e.target.value) || 0})}
                                  className="w-full bg-white text-slate-900 border-2 border-slate-100 rounded-2xl px-6 py-4 font-black outline-none focus:border-primary transition-all shadow-sm"
                               />
                               <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-black text-slate-300 uppercase">%</span>
                            </div>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Review Cycle</label>
                            <select 
                               value={formData.reviewPeriod}
                               onChange={e => setFormData({...formData, reviewPeriod: e.target.value})}
                               className="w-full bg-white text-slate-900 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-sm outline-none focus:border-primary transition-all shadow-sm bg-white appearance-none"
                            >
                               <option>Q4 2024</option>
                               <option>Annual 2025</option>
                               <option>H1 2025</option>
                            </select>
                         </div>
                      </div>

                      {type !== 'Global' && (
                        <div className="space-y-3 relative" ref={dropdownRef}>
                           <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Vertical Alignment (Compulsory)</label>
                           <div 
                              onClick={() => setIsParentDropdownOpen(!isParentDropdownOpen)}
                              className={`w-full p-5 border-2 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${isParentDropdownOpen ? 'border-primary bg-white shadow-lg ring-4 ring-primary/5' : 'bg-slate-50 border-slate-100 hover:border-slate-300'}`}
                           >
                              {selectedParentObj ? (
                                <div className="flex items-center space-x-3">
                                   <div className="p-2 bg-primary text-white rounded-lg shadow-sm">
                                      <LinkIcon size={14} />
                                   </div>
                                   <div>
                                      <p className="text-[10px] font-black uppercase text-slate-900 leading-none">{selectedParentObj.code}</p>
                                      <p className="text-xs font-bold text-slate-700 mt-1 line-clamp-1">{selectedParentObj.title}</p>
                                   </div>
                                </div>
                              ) : (
                                <span className="text-sm font-bold text-slate-400">Select a parent anchor...</span>
                              )}
                              <ChevronDown size={18} className={`text-slate-400 transition-transform ${isParentDropdownOpen ? 'rotate-180' : ''}`} />
                           </div>

                           {isParentDropdownOpen && (
                             <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-3xl z-50 p-3 animate-in fade-in zoom-in-95 duration-100">
                                <div className="relative mb-3">
                                   <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                   <input 
                                      autoFocus
                                      value={parentSearch}
                                      onChange={e => setParentSearch(e.target.value)}
                                      placeholder="Search objective code or title..."
                                      className="w-full bg-slate-50 border-none rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                                   />
                                </div>
                                <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-1">
                                   {filteredParents.map(opt => (
                                     <button 
                                       key={opt.id}
                                       onClick={() => {
                                          setFormData({...formData, parentGoal: opt.code});
                                          setIsParentDropdownOpen(false);
                                       }}
                                       className={`w-full p-4 rounded-xl flex items-center justify-between transition-all text-left group ${formData.parentGoal === opt.code ? 'bg-primary text-white' : 'hover:bg-slate-50'}`}
                                     >
                                        <div className="flex items-center space-x-3">
                                           <span className={`text-[10px] font-mono font-black w-14 ${formData.parentGoal === opt.code ? 'text-white' : 'text-slate-400'}`}>{opt.code}</span>
                                           <span className="text-xs font-bold truncate pr-4">{opt.title}</span>
                                        </div>
                                        {formData.parentGoal === opt.code && <Check size={16} />}
                                     </button>
                                   ))}
                                   {filteredParents.length === 0 && (
                                     <div className="py-8 text-center text-slate-400 text-[10px] font-bold uppercase italic">No matches found</div>
                                   )}
                                </div>
                             </div>
                           )}
                        </div>
                      )}
                      
                      {type === 'Global' && (
                        <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2rem] space-y-4">
                           <div className="flex items-center space-x-3 text-amber-600">
                              <Target size={24} />
                              <span className="text-xs font-black uppercase tracking-widest">Tier 0: Strategic Root</span>
                           </div>
                           <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
                              Global objectives represent the ultimate institutional anchors. They do not require a parent for alignment but will act as parents for departmental cascades org-wide.
                           </p>
                        </div>
                      )}
                   </div>
                </div>
             </div>
           )}

           {step === 2 && (
             <div className="space-y-10 animate-in slide-in-from-right duration-400">
                <div className="flex items-center justify-between px-1">
                   <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-l-4 border-primary pl-4">Key Result Allocation</label>
                   <button 
                    onClick={addKR}
                    className="flex items-center space-x-2 text-xs font-black text-primary bg-primary/5 px-4 py-2 rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm"
                   >
                      <Plus size={16} />
                      <span className="uppercase">Add Vector</span>
                   </button>
                </div>

                <div className="space-y-6">
                   {krs.map((kr, idx) => (
                      <div key={kr.id} className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-8 space-y-8 relative group hover:bg-white hover:shadow-2xl transition-all">
                         <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => removeKR(kr.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={20}/></button>
                         </div>
                         
                         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            <div className="lg:col-span-8 space-y-6">
                               <div className="space-y-2">
                                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Key Result Narrative</label>
                                  <input 
                                     value={kr.title}
                                     onChange={e => updateKR(kr.id, 'title', e.target.value)}
                                     placeholder="e.g. Reduce average response time by 40ms"
                                     className="w-full bg-white text-slate-900 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-base outline-none focus:border-primary shadow-sm"
                                  />
                               </div>
                               
                               <div className="grid grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Scoring Framework</label>
                                     <select 
                                        value={kr.scoring}
                                        onChange={e => updateKR(kr.id, 'scoring', e.target.value)}
                                        className="w-full bg-white text-slate-900 border-2 border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:border-primary appearance-none"
                                     >
                                        {scoringMethods.map(m => <option key={m}>{m}</option>)}
                                     </select>
                                  </div>
                                  <div className="space-y-2">
                                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tracking Source</label>
                                     <select 
                                        value={kr.tracking}
                                        onChange={e => updateKR(kr.id, 'tracking', e.target.value)}
                                        className="w-full bg-white text-slate-900 border-2 border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:border-primary appearance-none"
                                     >
                                        <option>Periodic Review</option>
                                        <option>Real-time (RKT Integration)</option>
                                     </select>
                                  </div>
                               </div>
                            </div>

                            <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
                               <div className="space-y-2">
                                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Vector Weight (%)</label>
                                  <input 
                                     type="number"
                                     value={kr.weight}
                                     onChange={e => updateKR(kr.id, 'weight', parseInt(e.target.value) || 0)}
                                     className="w-full bg-white text-slate-900 border-2 border-slate-100 rounded-2xl px-6 py-4 font-black outline-none focus:border-primary text-center shadow-sm"
                                  />
                               </div>

                               <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Start</label>
                                     <input 
                                        type="number"
                                        value={kr.start}
                                        onChange={e => updateKR(kr.id, 'start', parseFloat(e.target.value) || 0)}
                                        className="w-full bg-white text-slate-900 border-2 border-slate-100 rounded-2xl px-4 py-3 font-bold outline-none focus:border-primary text-center shadow-sm"
                                     />
                                  </div>
                                  <div className="space-y-2">
                                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Target</label>
                                     <input 
                                        type="number"
                                        value={kr.target}
                                        onChange={e => updateKR(kr.id, 'target', parseFloat(e.target.value) || 0)}
                                        className="w-full bg-white text-slate-900 border-2 border-slate-100 rounded-2xl px-4 py-3 font-bold outline-none focus:border-primary text-center shadow-sm"
                                     />
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>

                <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white flex items-center justify-between shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity"><BrainCircuit size={100} className="text-primary" /></div>
                   <div className="relative z-10">
                      <h4 className="text-[11px] font-black text-primary uppercase tracking-[0.2em] mb-4 border-l-2 border-primary pl-4">Institutional Integrity Check</h4>
                      <div className="flex items-center space-x-8">
                         <div>
                            <p className="text-3xl font-black">{krs.reduce((acc, curr) => acc + (curr.weight || 0), 0)}%</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total Vector Weight</p>
                         </div>
                         <div className="w-[2px] h-10 bg-white/10" />
                         <div>
                            <p className="text-3xl font-black">{krs.length}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Defined Success Vectors</p>
                         </div>
                      </div>
                   </div>
                   <div className="text-right relative z-10">
                      {krs.reduce((acc, curr) => acc + (curr.weight || 0), 0) === 100 ? (
                        <div className="flex items-center space-x-2 text-green-400">
                           <CheckCircle2 size={24} />
                           <span className="text-[10px] font-black uppercase tracking-widest">Logic Balanced</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-amber-400">
                           <AlertTriangle size={24} />
                           <span className="text-[10px] font-black uppercase tracking-widest">Incomplete Weighting</span>
                        </div>
                      )}
                   </div>
                </div>
             </div>
           )}
        </div>

        {/* Footer Actions */}
        <div className="p-10 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
           <button 
            onClick={step === 1 ? onClose : () => setStep(1)} 
            className="px-8 py-4 text-xs font-black uppercase tracking-[0.2em] text-slate-500 hover:text-slate-800 transition-all flex items-center space-x-2"
           >
              {step === 1 ? <Minus size={18}/> : <ArrowLeft size={18}/>}
              <span>{step === 1 ? 'Discard' : 'Strategic Context'}</span>
           </button>
           
           <button 
            onClick={step === 1 ? () => setStep(2) : onClose}
            disabled={step === 1 ? !canGoToStep2 : !canFinalize}
            className={`px-12 py-4 rounded-2xl text-sm font-black uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center space-x-3 ${
              (step === 1 ? canGoToStep2 : canFinalize) 
                ? 'bg-primary text-white shadow-primary/20 hover:scale-[1.02] active:scale-95' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-50'
            }`}
           >
              <span>{step === 1 ? 'Performance Vectors' : 'Finalize Strategy'}</span>
              <ArrowRight size={18} />
           </button>
        </div>
      </div>
    </div>
  );
};

// --- Tree View Component ---
const TreeView = ({ hierarchy, onOpenQuickView }: { hierarchy: any[], onOpenQuickView: (code: string) => void }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm p-10 animate-in slide-in-from-right duration-400">
      <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50">
        <div>
          <h3 className="font-black text-slate-900 tracking-tight uppercase leading-none mb-1.5">Alignment Cascade</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Global → Departmental → Individual Hierarchy</p>
        </div>
        <div className="flex items-center space-x-4 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
           <div className="flex items-center space-x-2"><div className="w-2.5 h-2.5 rounded bg-primary" /><span>Global</span></div>
           <div className="flex items-center space-x-2"><div className="w-2.5 h-2.5 rounded bg-indigo-400" /><span>Dept</span></div>
           <div className="flex items-center space-x-2"><div className="w-2.5 h-2.5 rounded bg-slate-200" /><span>Indiv</span></div>
        </div>
      </div>
      <div className="space-y-6">
        {hierarchy.map(global => (
          <TreeItem key={global.id} item={global} level={0} onOpenQuickView={onOpenQuickView} />
        ))}
      </div>
    </div>
  );
};

const TreeItem: React.FC<{ item: any, level: number, onOpenQuickView: (code: string) => void, childKey?: string }> = ({ item, level, onOpenQuickView }) => {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div className="space-y-3">
      <div 
        className={`flex items-center p-4 rounded-3xl transition-all border group relative ${
          level === 0 ? 'bg-primary/5 border-primary/10' : 
          level === 1 ? 'bg-slate-50 border-slate-100 ml-10' : 
          'bg-white border-slate-50 ml-20 shadow-sm'
        }`}
      >
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2 mr-3 rounded-xl transition-all ${hasChildren ? 'hover:bg-white text-slate-500 shadow-sm' : 'opacity-0 cursor-default'}`}
        >
          {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        
        <div className="flex-1 min-w-0 flex items-center justify-between">
           <div className="flex items-center space-x-6">
              <span className={`text-[10px] font-black font-mono w-16 shrink-0 uppercase tracking-tighter ${level === 0 ? 'text-primary' : 'text-slate-400'}`}>{item.code}</span>
              <div className="min-w-0">
                 <p className={`text-sm font-bold truncate pr-6 uppercase tracking-tight ${level === 0 ? 'text-slate-900' : 'text-slate-700'}`}>{item.title}</p>
                 {item.ownerDept && <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">{item.ownerDept}</p>}
              </div>
           </div>
           
           <div className="flex items-center space-x-8 shrink-0">
              <div className="flex items-center space-x-3">
                 <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-primary" style={{ width: `${item.progress}%` }} />
                 </div>
                 <span className="text-[10px] font-black text-slate-500">{item.progress}%</span>
              </div>
              <StatusBadge status={item.status} mini />
              <button 
                onClick={() => onOpenQuickView(item.code)}
                className="p-2 text-slate-300 hover:text-primary transition-all group-hover:bg-white rounded-xl shadow-sm"
              >
                 <ExternalLink size={16} />
              </button>
           </div>
        </div>
      </div>
      
      {isOpen && hasChildren && (
        <div className="animate-in slide-in-from-top-2 duration-300">
          {item.children.map((child: any) => (
            <TreeItem key={child.id} childKey={child.id} item={child} level={level + 1} onOpenQuickView={onOpenQuickView} />
          ))}
        </div>
      )}
    </div>
  );
};

// --- Chart View Component ---
const ChartView = ({ hierarchy, onOpenQuickView }: { hierarchy: any[], onOpenQuickView: (code: string) => void }) => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-[3rem] shadow-inner p-12 overflow-x-auto custom-scrollbar animate-in zoom-in-95 duration-400">
      <div className="min-w-[1400px] flex flex-col items-center">
        {hierarchy.map((global, gIdx) => (
          <div key={global.id} className="mb-24 last:mb-0 flex flex-col items-center w-full">
            <ChartNode item={global} level={0} onOpenQuickView={onOpenQuickView} />
            
            {global.children && global.children.length > 0 && (
              <>
                <svg className="h-14 w-full" viewBox="0 0 1000 40">
                  <line x1="500" y1="0" x2="500" y2="25" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round" />
                  <line x1="150" y1="25" x2="850" y2="25" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round" />
                </svg>
                
                <div className="flex justify-around items-start w-full gap-10">
                  {global.children.map((dept: any) => (
                    <div key={dept.id} className="flex flex-col items-center flex-1">
                      <svg className="h-14 w-full" viewBox="0 0 100 40">
                        <line x1="50" y1="0" x2="50" y2="40" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      <ChartNode item={dept} level={1} onOpenQuickView={onOpenQuickView} />
                      
                      {dept.children && dept.children.length > 0 && (
                        <>
                          <svg className="h-14 w-full" viewBox="0 0 100 40">
                            <line x1="50" y1="0" x2="50" y2="40" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round" />
                          </svg>
                          <div className="flex flex-col items-center space-y-6 w-full">
                            {dept.children.map((indiv: any) => (
                              <ChartNode key={indiv.id} item={indiv} level={2} onOpenQuickView={onOpenQuickView} />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const ChartNode: React.FC<{ item: any, level: number, onOpenQuickView: (code: string) => void }> = ({ item, level, onOpenQuickView }) => {
  return (
    <div 
      onClick={() => onOpenQuickView(item.code)}
      className={`p-6 rounded-[2.5rem] border shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group shrink-0 relative overflow-hidden ${
        level === 0 ? 'bg-slate-900 text-white border-slate-800 w-[450px]' : 
        level === 1 ? 'bg-white text-slate-900 border-slate-200 w-[300px]' : 
        'bg-white text-slate-900 border-slate-100 w-[260px] shadow-lg'
      }`}
    >
      <div className={`absolute top-0 right-0 w-28 h-28 opacity-5 pointer-events-none ${level === 0 ? 'text-primary' : 'text-slate-300'}`}>
         {level === 0 ? <Target size={112} /> : level === 1 ? <Briefcase size={112} /> : <UserPlus size={112} />}
      </div>
      
      <div className="flex items-center justify-between mb-5 relative z-10">
         <span className={`text-[11px] font-black font-mono tracking-[0.2em] ${level === 0 ? 'text-primary' : 'text-slate-400'}`}>{item.code}</span>
         <StatusBadge status={item.status} mini />
      </div>
      
      <div className="relative z-10">
         <h4 className={`font-black leading-tight uppercase tracking-tight line-clamp-2 ${level === 0 ? 'text-xl' : 'text-sm'}`}>{item.title}</h4>
         {item.ownerDept && <p className="text-[10px] text-slate-400 font-black uppercase mt-3 tracking-[0.2em] border-l-2 border-primary/40 pl-3">{item.ownerDept}</p>}
      </div>
      
      <div className="mt-8 flex items-center justify-between relative z-10 border-t border-slate-100/10 pt-6">
         <div className="flex-1 mr-6">
            <div className="flex justify-between items-center mb-2">
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Attainment</span>
               <span className={`text-[11px] font-black ${level === 0 ? 'text-primary' : 'text-slate-900'}`}>{item.progress}%</span>
            </div>
            <div className={`h-2 w-full rounded-full overflow-hidden shadow-inner ${level === 0 ? 'bg-white/10' : 'bg-slate-50'}`}>
               <div className="h-full bg-primary shadow-[0_0_8px_rgba(22,89,230,0.5)]" style={{ width: `${item.progress}%` }} />
            </div>
         </div>
         <div className={`p-2.5 rounded-2xl transition-all ${level === 0 ? 'bg-white/10 text-white' : 'bg-slate-50 text-slate-300 group-hover:text-primary group-hover:bg-primary/5 group-hover:shadow-sm'}`}>
            <ArrowRight size={16} />
         </div>
      </div>
    </div>
  );
};

// --- View Component Helpers ---

const ReviewMemberDetail = ({ member, onApprove }: { member: any, onApprove: () => void }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-right duration-500">
       <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 flex items-center justify-between shadow-sm">
             <div className="flex items-center space-x-6">
                <img src={member.avatar} className="w-20 h-20 rounded-3xl border-4 border-slate-50 shadow-xl" alt={member.name} />
                <div>
                   <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">{member.name}</h3>
                   <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-xs">{member.dept} Unit</p>
                   <div className="flex items-center space-x-4 mt-4">
                      <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                         <Target size={12}/>
                         <span>{member.items} Objectives Pending</span>
                      </div>
                      <div className="w-1 h-1 bg-slate-200 rounded-full" />
                      <div className="flex items-center space-x-2 text-[10px] font-black text-indigo-600 uppercase">
                         <Clock size={12}/>
                         <span>Submitted 2h ago</span>
                      </div>
                   </div>
                </div>
             </div>
             <button 
              onClick={onApprove}
              className="px-10 py-4 bg-primary text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
             >
                Authorize Package
             </button>
          </div>

          <div className="space-y-4">
             {member.goals.map((goal: any) => (
               <div key={goal.id} className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm group hover:border-primary/20 transition-all">
                  <div className="flex items-start justify-between mb-8">
                     <div>
                        <div className="flex items-center space-x-3 mb-3">
                           <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-lg text-[8px] font-black uppercase tracking-widest">{goal.type} Framework</span>
                        </div>
                        <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase group-hover:text-primary transition-colors leading-tight">{goal.title}</h4>
                     </div>
                     <button className="p-3 bg-slate-50 rounded-2xl text-slate-300 hover:text-primary transition-all shadow-inner"><Edit3 size={20}/></button>
                  </div>
                  
                  <div className="space-y-4">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 border-l-4 border-primary pl-4">Child Performance Vectors</p>
                     {goal.krs.map((kr: any, i: number) => (
                        <div key={i} className="p-5 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-between group/kr hover:bg-white hover:shadow-lg transition-all">
                           <div className="flex items-center space-x-5">
                              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-indigo-600 group-hover/kr:bg-indigo-600 group-hover/kr:text-white transition-all">
                                 <GitBranch size={18}/>
                              </div>
                              <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">{kr.title}</span>
                           </div>
                           <span className="text-[9px] font-black uppercase text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100 shadow-sm">{kr.status}</span>
                        </div>
                     ))}
                     {goal.krs.length === 0 && <p className="py-10 text-center text-xs text-slate-400 italic font-bold uppercase tracking-widest border-2 border-dashed border-slate-100 rounded-3xl">No linked success vectors provided.</p>}
                  </div>
               </div>
             ))}
          </div>
       </div>

       <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden group border border-slate-800">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><BrainCircuit size={120} className="text-primary" /></div>
             <h3 className="text-[11px] font-black text-primary uppercase tracking-[0.2em] mb-8 border-l-2 border-primary pl-4">Review Intelligence</h3>
             <p className="text-sm text-slate-300 font-medium italic leading-relaxed mb-10 relative z-10">
               "Marcus's proposed goals show 92% alignment with Q3 Infrastructure resilience targets. Quantitative weights are balanced. Bias scan suggests a neutral self-assessment."
             </p>
             <button className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-3 transition-all relative z-10 shadow-xl">
                <MessageSquare size={16} />
                <span>Provide Qualitative Context</span>
             </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
             <h3 className="font-black text-[10px] text-slate-400 uppercase tracking-widest mb-8 flex items-center">
                <Activity size={14} className="mr-2" /> Unit Status Board
             </h3>
             <div className="p-6 bg-slate-50 border border-slate-100 rounded-[1.5rem] flex items-center justify-between shadow-inner">
                <div>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Unit Capacity</p>
                   <p className="text-xl font-black text-slate-900 mt-1">84% Load</p>
                </div>
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-300 shadow-sm">
                   <Activity size={24} />
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

const ViewToggle = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>
    {icon}
    <span>{label}</span>
  </button>
);

const LevelTab = ({ label, active, onClick, icon }: any) => (
  <div 
    onClick={onClick}
    className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border group ${active ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-[1.02]' : 'border-transparent text-slate-600 hover:bg-slate-50'}`}
  >
    <div className="flex items-center space-x-4">
       <div className={`p-2 rounded-xl transition-colors ${active ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-primary/10 group-hover:text-primary shadow-inner'}`}>
          {icon}
       </div>
       <span className="text-xs font-black uppercase tracking-tight">{label}</span>
    </div>
  </div>
);

const StatusBadge = ({ status, mini }: { status: string, mini?: boolean }) => {
  const styles: any = {
    'Active': 'bg-green-100 text-green-700 border-green-200',
    'Proposed': 'bg-indigo-100 text-indigo-700 animate-pulse border-indigo-200',
    'Revision Pending': 'bg-purple-100 text-purple-700 shadow-sm border border-purple-200',
    'Rejected': 'bg-red-100 text-red-700 border-red-200',
    'Reviewed': 'bg-blue-100 text-blue-700 border-blue-200',
  };
  return (
    <span className={`px-3 py-1 rounded-full ${mini ? 'text-[8px]' : 'text-[10px]'} font-black uppercase tracking-widest border shadow-sm ${styles[status] || 'bg-slate-100 text-slate-500 border-slate-200'}`}>
       {status}
    </span>
  );
};

export default ObjectivesPage;
