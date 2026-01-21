import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  ChevronRight, 
  MessageSquare, 
  Calendar,
  Zap,
  Target,
  FileText, 
  CheckCircle2,
  Clock,
  X,
  Upload,
  Link as LinkIcon,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  Users,
  User,
  AlertCircle,
  Settings,
  ArrowRight,
  Filter,
  Search,
  MoreVertical,
  Scale,
  Activity,
  UserPlus,
  BarChart3,
  Maximize2,
  PieChart as PieChartIcon,
  AlertTriangle,
  ArrowLeft,
  ChevronDown,
  Trash2,
  Check,
  Database,
  History,
  Quote,
  Star,
  MessageCircle,
  UserCircle,
  PenTool,
  Send,
  Sparkle,
  RefreshCw,
  Info,
  Briefcase,
  BrainCircuit,
  Paperclip,
  ImageIcon,
  Hash,
  ToggleLeft,
  Percent,
  Signature,
  Fingerprint,
  Lock,
  ClipboardCheck,
  FileUp,
  Award,
  Layers,
  ArrowUpRight,
  RotateCcw,
  Compass,
  GraduationCap,
  BookOpen,
  ShieldAlert as PipIcon,
  FileSearch,
  ClipboardList,
  MessageSquarePlus,
  MoreHorizontal,
  Flame,
  Shield,
  Download,
  BellRing,
  Timer,
  ThumbsUp,
  ThumbsDown,
  Save,
  CheckCircle,
  Bell,
  Eye,
  GitBranch,
  SearchCode,
  Loader2,
  FileBadge
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { UserRole } from '../types';
import { GoogleGenAI } from "@google/genai";

// --- MOCK DATA ---

const MOCK_FEEDBACKS = [
  { id: 'fb1', from: 'Marcus Vane', role: 'Manager', date: 'Oct 12, 2024', content: 'Excellent work on the v4 release cycle. Your focus on system reliability helped the unit exceed our uptime targets significantly.', sentiment: 'Positive', avatar: 'https://picsum.photos/seed/marcus/100/100' },
  { id: 'fb2', from: 'Sarah Chen', role: 'Peer', date: 'Oct 10, 2024', content: 'Alex is a great collaborator. They provided crucial feedback on the API specs that saved us weeks of refactoring.', sentiment: 'Positive', avatar: 'https://picsum.photos/seed/sarah/100/100' },
  { id: 'fb3', from: 'Elena Rossi', role: 'Peer', date: 'Oct 05, 2024', content: 'Strategic alignment on the design system migration could have been tighter. Looking for more proactive syncs in Q4.', sentiment: 'Neutral', avatar: 'https://picsum.photos/seed/elena/100/100' },
];

const MOCK_PEER_REVIEWS = [
  { 
    id: 'pr1', 
    name: 'Jordan Smith', 
    role: 'Staff Engineer', 
    deadline: 'Oct 20', 
    status: 'Pending', 
    avatar: 'https://picsum.photos/seed/jordan/100/100' 
  },
  { 
    id: 'pr2', 
    name: 'Lila Ray', 
    role: 'Product Analyst', 
    deadline: 'Oct 22', 
    status: 'Submitted', 
    avatar: 'https://picsum.photos/seed/lila/100/100',
    feedback: {
      submittedAt: 'Oct 12, 14:30',
      summary: "Alex is consistently the most reliable technical partner I've worked with this horizon. Their ability to bridge the gap between complex engineering requirements and product feasibility is exceptional.",
      ratings: [
        { label: 'Technical Impact', value: 5, desc: 'Consistently provides high-quality code and architecture feedback.' },
        { label: 'Collaboration', value: 4, desc: 'Proactive in syncs, though sometimes delayed on Slack responses.' },
        { label: 'Strategic Alignment', value: 5, desc: 'Clearly understands the Q3/Q4 north stars.' }
      ],
      objectiveComments: [
        { title: 'Optimize API Response Throughput', comment: 'Alex contributed the core load-balancing logic that enabled our 182ms average. Their work was the single biggest factor in this KR success.' },
        { title: 'Deliver v3.5 Strategic Roadmap', comment: 'Provided great early feedback on the technical feasibility of the roadmap items.' }
      ]
    }
  },
  { 
    id: 'pr3', 
    name: 'David Wright', 
    role: 'Security Lead', 
    deadline: 'Oct 20', 
    status: 'Pending', 
    avatar: 'https://picsum.photos/seed/david/100/100' 
  },
];

const MOCK_TEAM_REPORTS = [
  { id: 'tr1', name: 'Marcus Vane', role: 'DevOps Lead', progress: 100, status: 'Needs Review', avatar: 'https://picsum.photos/seed/marcus/100/100', okrCount: 3 },
  { id: 'tr2', name: 'Sarah Chen', role: 'Sr. Product Manager', progress: 45, status: 'Draft', avatar: 'https://picsum.photos/seed/sarah/100/100', okrCount: 4 },
  { id: 'tr3', name: 'Jordan Smith', role: 'Staff Engineer', progress: 100, status: 'Needs Review', avatar: 'https://picsum.photos/seed/jordan/100/100', okrCount: 2 },
  { id: 'tr4', name: 'Lila Ray', role: 'Product Analyst', progress: 100, status: 'Needs Review', avatar: 'https://picsum.photos/seed/lila/100/100', okrCount: 5 },
  { id: 'tr5', name: 'David Wright', role: 'Security Lead', progress: 15, status: 'Draft', avatar: 'https://picsum.photos/seed/david/100/100', okrCount: 3 },
];

const INITIAL_MY_OBJECTIVES = [
  { 
    id: 'obj-1', 
    title: "Optimize API Response Throughput", 
    type: "KPI", 
    source: "GitHub Integration", 
    progress: 74, 
    confidence: 88,
    status: "Active",
    krs: [
      { 
        id: 'kr-1', 
        title: "Maintain < 200ms latency on /v1/calibrate", 
        target: 200, 
        current: 182, 
        unit: 'ms', 
        type: 'numeric', 
        selfScore: 182, 
        selfComment: 'Latency is consistently within range despite increased load.',
        evidence: [{ id: 'e1', name: 'Latency_Metrics_Q3.pdf', type: 'file' }]
      },
      { 
        id: 'kr-2', 
        title: "Zero service downtime during deployment", 
        target: 0, 
        current: 0, 
        unit: 'incidents', 
        type: 'numeric', 
        selfScore: 0, 
        selfComment: 'All deployments were seamless.',
        evidence: [{ id: 'e2', name: 'Incident_Report_Log.xlsx', type: 'file' }]
      }
    ]
  },
  { 
    id: 'obj-2', 
    title: "Deliver v3.5 Strategic Roadmap", 
    type: "OKR", 
    source: "Manual Update", 
    progress: 42, 
    confidence: 45,
    status: "Active",
    krs: [
      { 
        id: 'kr-3', 
        title: "Finalize all v3.5 UI specs", 
        target: 100, 
        current: 42, 
        unit: '%', 
        type: 'percentage', 
        selfScore: 42, 
        selfComment: 'Phase 1 and 2 specs are locked. Phase 3 in research.',
        evidence: [{ id: 'e3', name: 'v3.5_Design_System_Figma', type: 'link' }]
      },
      { 
        id: 'kr-4', 
        title: "Stakeholder alignment score", 
        target: 5, 
        current: 4, 
        unit: '/ 5', 
        type: 'rating', 
        selfScore: 4, 
        selfComment: 'Mostly positive sentiment, looking for better buy-in from Infra team.',
        evidence: []
      }
    ]
  },
];

const MOCK_IDP_GOALS = [
  { id: 'idp1', title: "Advanced System Architecture", type: "Certification", status: "In Progress", progress: 65, provider: "AWS" }
];

// --- MAIN PAGE COMPONENT ---

const AppraisalsPage: React.FC<{ role: UserRole }> = ({ role }) => {
  const [activeTab, setActiveTab] = useState<'my' | 'feedbacks' | 'peer' | 'team'>('my');
  const [activeGroup, setActiveGroup] = useState<'okr' | 'kpi' | 'idp' | null>(null);
  const [activeReviewReport, setActiveReviewReport] = useState<any>(null);
  const [activePeerReview, setActivePeerReview] = useState<any>(null);
  
  // Modals & States
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isTakeAppraisalOpen, setIsTakeAppraisalOpen] = useState(false);
  const [isSigningModalOpen, setIsSigningModalOpen] = useState(false);
  const [nudgedPeers, setNudgedPeers] = useState<string[]>([]);

  // Cycle Sign-off State
  const [cycleSignOff, setCycleSignOff] = useState({
    id: 'cycle-q3-2024',
    name: 'Q3 2024 Strategic Horizon',
    employeeSigned: false,
    managerSigned: true, 
    comment: '',
    signature: '',
    timestamp: null as string | null
  });

  const handleSignCycle = (comment: string, signature: string) => {
    setCycleSignOff(prev => ({
      ...prev,
      employeeSigned: true,
      comment,
      signature,
      timestamp: new Date().toLocaleString()
    }));
    setIsSigningModalOpen(false);
  };

  const handleNudge = (id: string) => {
    setNudgedPeers([...nudgedPeers, id]);
  };

  const isEmployee = role === UserRole.EMPLOYEE;

  const handleBack = () => {
    setActiveGroup(null); 
    setActiveReviewReport(null); 
    setActivePeerReview(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {(activeGroup || activeReviewReport || activePeerReview) && (
            <button 
              onClick={handleBack} 
              className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all text-slate-500 shadow-sm"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">Appraisals & Performance</h1>
            <p className="text-slate-500 text-sm mt-1">Manage unified OKRs, RKT (Real-time KPIs), and multi-stage evaluations</p>
          </div>
        </div>
        {!activeReviewReport && !activePeerReview && (
          <div className="flex space-x-3">
            <button 
              onClick={() => setIsRequestModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all"
            >
              <UserPlus size={16} />
              <span>Request Feedback</span>
            </button>
            <button 
              onClick={() => setIsTakeAppraisalOpen(true)}
              className="flex items-center space-x-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-black shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
            >
              <ClipboardCheck size={18} />
              <span>Take Appraisal</span>
            </button>
          </div>
        )}
      </div>

      {/* Tabs Navigation - Hide when in deep review */}
      {!activeReviewReport && !activePeerReview && (
        <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-slate-200 w-fit shadow-sm overflow-x-auto no-scrollbar max-w-full">
          <TabButton active={activeTab === 'my'} onClick={() => setActiveTab('my')} icon={<Target size={14}/>} label="My Performance" />
          <TabButton active={activeTab === 'feedbacks'} onClick={() => setActiveTab('feedbacks')} icon={<MessageCircle size={14}/>} label="My feedbacks" />
          <TabButton active={activeTab === 'peer'} onClick={() => setActiveTab('peer')} icon={<Star size={14}/>} label="Peer Review" />
          {!isEmployee && <TabButton active={activeTab === 'team'} onClick={() => setActiveTab('team')} icon={<Users size={14}/>} label="Team Reviews" />}
        </div>
      )}

      {/* Conditional Content by Tab */}
      {activeTab === 'my' && (
        <div className="space-y-6">
          {!activeGroup ? (
            <>
              {/* Summary Cards Row - Full Width */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <SummaryCard label="MY OKR ATTAINMENT" value="74%" trend="+4%" icon={<Target size={20} className="text-primary" />} />
                <SummaryCard label="MY KPI VELOCITY" value="92%" trend="Stable" icon={<Zap size={20} className="text-secondary" />} />
                <SummaryCard label="GOAL PROGRESS" value="52%" trend="+8%" icon={<Award size={20} className="text-amber-500" />} />
                <SummaryCard label="LAST UPDATED" value="Oct 16, 10:45" trend="Live" icon={<Activity size={20} className="text-green-600" />} />
                <SummaryCard label="APPRAISAL STATUS" value="Awaiting Review" icon={<AlertCircle size={20} className="text-indigo-500" />} />
              </div>

              {/* Main content + Side panel grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                  <AnchorGroup 
                    title="PERIODIC OKRS" 
                    desc="Strategic objectives and child key results tracked for the horizon." 
                    icon={<Target className="text-primary" />} 
                    onClick={() => setActiveGroup('okr')} 
                    count={1} 
                  />
                  <AnchorGroup 
                    title="REAL-TIME KPIS" 
                    desc="Automated operational metrics feeding directly from system integrations." 
                    icon={<Zap className="text-secondary" />} 
                    onClick={() => setActiveGroup('kpi')} 
                    count={1} 
                  />
                  <AnchorGroup 
                    title="INDIVIDUAL DEVELOPMENT GOALS" 
                    desc="Personal growth targets and IDP items for skill maturity." 
                    icon={<GraduationCap className="text-amber-500" />} 
                    onClick={() => setActiveGroup('idp')} 
                    count={2} 
                  />
                </div>
                <div className="lg:col-span-4 shrink-0">
                  <div className="sticky top-6">
                    <PersistentAcknowledgmentSection signOff={cycleSignOff} onSign={() => setIsSigningModalOpen(true)} />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
               <div className="lg:col-span-8 animate-in fade-in duration-300">
                  {activeGroup === 'okr' && <OKRDetailView objectives={INITIAL_MY_OBJECTIVES.filter(o => o.type === 'OKR')} />}
                  {activeGroup === 'kpi' && <KPIDetailView objectives={INITIAL_MY_OBJECTIVES.filter(o => o.type === 'KPI')} />}
                  {activeGroup === 'idp' && <IDPDetailView goals={MOCK_IDP_GOALS} />}
               </div>
               <div className="lg:col-span-4 shrink-0">
                  <div className="sticky top-6">
                    <PersistentAcknowledgmentSection signOff={cycleSignOff} onSign={() => setIsSigningModalOpen(true)} />
                  </div>
                </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'feedbacks' && (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden animate-in fade-in">
          <div className="p-8 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 tracking-tight uppercase">Institutional Input Archive</h3>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Qualitative feedback received from the organization</p>
          </div>
          <div className="divide-y divide-slate-100">
            {MOCK_FEEDBACKS.map(fb => (
              <FeedbackItem key={fb.id} {...fb} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'peer' && (
        <div className="animate-in fade-in">
          {!activePeerReview ? (
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 tracking-tight uppercase">Peer Review Pipeline</h3>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Manage reviews requested by your colleagues</p>
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {MOCK_PEER_REVIEWS.map(pr => (
                  <PeerReviewRow 
                    key={pr.id} 
                    {...pr} 
                    nudged={nudgedPeers.includes(pr.id)} 
                    onNudge={() => handleNudge(pr.id)} 
                    onView={() => setActivePeerReview(pr)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <PeerReviewDetailView 
              review={activePeerReview} 
              onClose={() => setActivePeerReview(null)} 
            />
          )}
        </div>
      )}

      {activeTab === 'team' && (
        <div className="animate-in fade-in">
          {!activeReviewReport ? (
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-900 tracking-tight uppercase">Unit Calibration Queue</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Process and calibrate completed appraisals from your direct reports</p>
              </div>
              <div className="divide-y divide-slate-100">
                {MOCK_TEAM_REPORTS.map(report => (
                  <TeamReviewItem key={report.id} {...report} onReview={() => setActiveReviewReport(report)} />
                ))}
              </div>
            </div>
          ) : (
            <TeamMemberReviewWorkspace 
              report={activeReviewReport} 
              onClose={() => setActiveReviewReport(null)} 
              objectives={INITIAL_MY_OBJECTIVES} 
            />
          )}
        </div>
      )}

      {/* --- MODALS --- */}

      {isRequestModalOpen && (
        <RequestFeedbackModal onClose={() => setIsRequestModalOpen(false)} objectives={INITIAL_MY_OBJECTIVES} />
      )}

      {isTakeAppraisalOpen && (
        <TakeAppraisalWorkspace onClose={() => setIsTakeAppraisalOpen(false)} objectives={INITIAL_MY_OBJECTIVES} />
      )}

      {isSigningModalOpen && (
        <CycleSignatureModal cycleName={cycleSignOff.name} onClose={() => setIsSigningModalOpen(false)} onConfirm={handleSignCycle} />
      )}
    </div>
  );
};

// --- SUB-COMPONENTS ---

/**
 * Detailed Peer Review View
 */
const PeerReviewDetailView = ({ review, onClose }: { review: any, onClose: () => void }) => {
  if (!review.feedback) {
    return (
      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-12 text-center space-y-6 animate-in zoom-in-95">
        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mx-auto shadow-inner">
          <Clock size={40} />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900 uppercase">Review Pending</h3>
          <p className="text-slate-500 mt-2 font-medium max-w-sm mx-auto">This peer feedback loop is currently active. Access to responses is restricted until submission is finalized.</p>
        </div>
        <button onClick={onClose} className="px-8 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest">Return to Pipeline</button>
      </div>
    );
  }

  const { feedback } = review;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-right duration-500 pb-12">
      <div className="lg:col-span-8 space-y-6">
        {/* Reviewer Header */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <img src={review.avatar} className="w-20 h-20 rounded-3xl border-4 border-slate-50 shadow-xl" alt={review.name} />
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[9px] font-black uppercase tracking-widest">Peer Evaluator</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center"><Clock size={12} className="mr-1.5" /> Filed: {feedback.submittedAt}</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">{review.name}</h2>
              <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-xs">{review.role}</p>
            </div>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center space-x-4">
             <div className="text-right">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Signal Confidence</p>
                <p className="text-xl font-black text-indigo-600">High</p>
             </div>
             <ShieldCheck size={24} className="text-indigo-600 opacity-20" />
          </div>
        </div>

        {/* Narrative Summary */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-all"><Quote size={120} className="text-primary" /></div>
           <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 border-l-4 border-primary pl-4">Qualitative Synthesis</h3>
           <p className="text-xl font-medium text-slate-700 leading-relaxed italic relative z-10">"{feedback.summary}"</p>
        </div>

        {/* Objective Specific Comments */}
        <div className="space-y-4">
           <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Institutional Anchor feedback</h3>
           {feedback.objectiveComments.map((obj: any, i: number) => (
             <div key={i} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm group hover:border-primary/20 transition-all">
                <div className="flex items-center space-x-3 mb-4">
                   <Target size={18} className="text-primary" />
                   <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{obj.title}</h4>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">"{obj.comment}"</p>
             </div>
           ))}
        </div>
      </div>

      <div className="lg:col-span-4 space-y-6">
        {/* Scoreboard */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl">
           <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-8 border-l-2 border-primary pl-4">Competency Scorecard</h3>
           <div className="space-y-8">
              {feedback.ratings.map((rate: any, i: number) => (
                <div key={i} className="space-y-3">
                   <div className="flex justify-between items-end">
                      <div>
                         <p className="text-[10px] font-black text-white uppercase tracking-tight">{rate.label}</p>
                         <p className="text-[9px] text-slate-500 font-medium italic mt-1 leading-snug">{rate.desc}</p>
                      </div>
                      <span className="text-2xl font-black text-primary">{rate.value}<span className="text-xs text-slate-700 ml-1">/5</span></span>
                   </div>
                   <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${(rate.value / 5) * 100}%` }} />
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* AI Calibration Suggestion */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-5"><BrainCircuit size={80} className="text-primary" /></div>
           <h3 className="text-[10px] font-black text-primary uppercase tracking-widest mb-6 flex items-center"><Sparkles size={14} className="mr-2" /> AI Bias Audit</h3>
           <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
              "Peer input from {review.name.split(' ')[0]} shows high linguistic consistency with system metrics. Qualitative feedback has a <span className="text-indigo-600 font-black">Proactive Bias</span> of 12%, aligning with high-velocity benchmarks."
           </p>
           <button className="w-full mt-8 py-3 bg-slate-50 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-100">
              Cross-Verify with KPI Streams
           </button>
        </div>

        {/* Action Button */}
        <button 
          onClick={onClose}
          className="w-full py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center space-x-2"
        >
          <ArrowLeft size={16} />
          <span>Back to pipeline</span>
        </button>
      </div>
    </div>
  );
};

const TeamMemberReviewWorkspace = ({ report, onClose, objectives }: any) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const activeObj = objectives[currentIdx];

  const handleNext = () => {
    if (currentIdx < objectives.length - 1) setCurrentIdx(currentIdx + 1);
    else onClose();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col min-h-[70vh] animate-in slide-in-from-right duration-500">
      {/* Header */}
      <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center space-x-6">
          <img src={report.avatar} className="w-14 h-14 rounded-2xl border-2 border-white shadow-lg" alt={report.name} />
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase leading-none">Reviewing: {report.name}</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">{report.role} • Performance Calibration</p>
          </div>
        </div>
        <div className="flex items-center space-x-8">
           <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black text-slate-400 uppercase">Review Progress</span>
              <div className="w-48 h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                 <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${((currentIdx + 1) / objectives.length) * 100}%` }} />
              </div>
              <span className="text-[10px] font-black text-primary">{currentIdx + 1} / {objectives.length}</span>
           </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
           <div className="max-w-4xl mx-auto space-y-12">
              <div className="animate-in slide-in-from-bottom-4 duration-500">
                 <div className="flex items-center space-x-3 mb-4">
                    <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-lg text-[9px] font-black uppercase">{activeObj.type} Objective</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center"><Hash size={12} className="mr-1.5" /> ID: {activeObj.id}</span>
                 </div>
                 <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight uppercase">{activeObj.title}</h2>
              </div>

              <div className="space-y-10">
                 <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-l-4 border-primary pl-4">Key Result Review Queue</p>
                 <div className="space-y-8">
                    {activeObj.krs.map((kr: any) => (
                      <ManagerKREvaluationCard key={kr.id} {...kr} />
                    ))}
                 </div>
              </div>

              <div className="pt-12 border-t border-slate-100 flex items-center justify-between">
                 <button 
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx(currentIdx - 1)}
                  className="px-8 py-4 border border-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all disabled:opacity-30"
                 >
                    Previous Objective
                 </button>
                 <button 
                  onClick={handleNext}
                  className="px-12 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center space-x-3"
                 >
                    <span>{currentIdx < objectives.length - 1 ? 'Next Objective' : 'Submit Final Calibration'}</span>
                    <ArrowRight size={18} />
                 </button>
              </div>
           </div>
        </div>

        {/* AI/Contextual Sidebar */}
        <div className="w-80 bg-slate-50 border-l border-slate-100 p-8 shrink-0 flex flex-col space-y-8 hidden xl:flex">
           <div className="p-6 bg-slate-900 rounded-[2rem] text-white relative overflow-hidden group shadow-xl">
              <div className="absolute top-0 right-0 p-4 opacity-10"><BrainCircuit size={80} className="text-primary" /></div>
              <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 border-l-2 border-primary pl-4">Review Insight</h4>
              <p className="text-xs text-slate-300 font-medium italic leading-relaxed">
                 "{report.name.split(' ')[0]}'s self-appraisal is in the 92nd percentile for honesty based on system-captured evidence. Calibration bias is low."
              </p>
           </div>
           
           <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Unit Context</h4>
              <div className="p-5 bg-white border border-slate-100 rounded-2xl space-y-4 shadow-sm">
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Cohort Mean</span>
                    <span className="font-bold text-slate-800">4.1 / 5</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Evidence Coverage</span>
                    <span className="px-1.5 py-0.5 bg-green-50 text-green-700 rounded text-[9px] font-black uppercase tracking-widest">High</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const ManagerKREvaluationCard = ({ title, target, current, unit, type, selfScore, selfComment, evidence }: any) => {
  const [managerScore, setManagerScore] = useState<any>(null);
  const [managerComment, setManagerComment] = useState('');
  const [isAiDrafting, setIsAiDrafting] = useState(false);
  const [managerEvidence, setManagerEvidence] = useState<any[]>([]);

  const handleAiDraft = async () => {
    setIsAiDrafting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Write a short, professional managerial performance review comment for the following Key Result:
      KR: ${title}
      Target: ${target} ${unit}
      Employee Actual: ${current} ${unit}
      Employee Self-Score: ${selfScore}
      Employee Self-Comment: "${selfComment}"
      Make it objective and data-driven. Focus on providing constructive calibration.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: 'You are an expert HR calibrated manager assistant. Generate concise, professional, and performance-driven narratives.',
        }
      });
      setManagerComment(response.text || '');
    } catch (e) {
      console.error(e);
      setManagerComment('Unable to generate AI draft at this time.');
    } finally {
      setIsAiDrafting(false);
    }
  };

  const addManagerEvidence = () => {
    const newEv = { id: Date.now(), name: 'Manager_Calibration_Note.pdf', type: 'file' };
    setManagerEvidence([...managerEvidence, newEv]);
  };

  return (
    <div className="p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm space-y-8 group hover:border-indigo-200 transition-all">
       <div className="space-y-2">
          <h4 className="text-xl font-bold text-slate-900 tracking-tight leading-snug">{title}</h4>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">SYSTEM TARGET OUTCOME: <span className="text-slate-900">{current} / {target} {unit}</span></p>
       </div>

       {/* Self Assessment Side-by-Side */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6 p-6 bg-slate-50 border border-slate-100 rounded-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-3 opacity-5"><UserCircle size={48} /></div>
             <div>
                <div className="flex items-center space-x-2 text-slate-400 mb-4">
                    <User size={12} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Self-Assessment</span>
                </div>
                <div className="flex items-baseline space-x-2 mb-4">
                    <span className="text-2xl font-black text-slate-900">{selfScore}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{unit}</span>
                </div>
                <p className="text-xs text-slate-500 font-medium italic leading-relaxed mb-6">"{selfComment}"</p>
             </div>

             {/* Employee Evidence */}
             <div className="space-y-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Employee Evidence</p>
                <div className="flex flex-wrap gap-2">
                   {evidence && evidence.length > 0 ? evidence.map((ev: any) => (
                      <div key={ev.id} className="flex items-center space-x-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-slate-600 hover:text-primary transition-all cursor-pointer">
                         {ev.type === 'file' ? <Paperclip size={10} /> : <LinkIcon size={10} />}
                         <span>{ev.name}</span>
                      </div>
                   )) : <p className="text-[9px] text-slate-400 italic px-1">No artifacts provided.</p>}
                </div>
             </div>
          </div>

          <div className="space-y-6">
             <div className="flex items-center space-x-2 text-indigo-600 mb-2">
                <ShieldCheck size={12} />
                <span className="text-[9px] font-black uppercase tracking-widest">Manager Calibration</span>
             </div>
             
             {/* Score Input based on type */}
             <div className="space-y-3">
               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Assessed Performance</label>
               {type === 'rating' ? (
                 <div className="flex items-center space-x-1">
                   {[1, 2, 3, 4, 5].map(s => (
                     <button 
                      key={s} 
                      onClick={() => setManagerScore(s)}
                      className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${managerScore === s ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600'}`}
                     >
                        {s}
                     </button>
                   ))}
                 </div>
               ) : (
                 <div className="relative group">
                    <input 
                      type="number" 
                      value={managerScore || ''} 
                      onChange={e => setManagerScore(e.target.value)}
                      placeholder={`Enter ${unit}`}
                      className="w-full bg-slate-100 border-none rounded-xl px-4 py-3 text-sm font-black outline-none focus:ring-2 focus:ring-indigo-200 transition-all uppercase"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase">{unit}</div>
                 </div>
               )}
             </div>

             <div className="space-y-3">
                <div className="flex items-center justify-between">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Managerial Narrative</label>
                   <button 
                    onClick={handleAiDraft}
                    disabled={isAiDrafting}
                    className="flex items-center space-x-1.5 text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded-lg transition-all"
                   >
                      {isAiDrafting ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                      <span className="text-[8px] font-black uppercase">AI DRAFT</span>
                   </button>
                </div>
                <textarea 
                  value={managerComment}
                  onChange={e => setManagerComment(e.target.value)}
                  placeholder="Justify this calibration score..."
                  className="w-full bg-white text-slate-900 border-2 border-slate-100 rounded-2xl p-4 text-xs font-medium outline-none focus:border-indigo-600 transition-all h-24 resize-none shadow-inner" 
                />
             </div>

             {/* Manager Evidence Upload */}
             <div className="space-y-3">
                <div className="flex items-center justify-between">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Calibration Evidence</label>
                   <button 
                     onClick={addManagerEvidence}
                     className="text-[8px] font-black text-indigo-600 hover:underline uppercase"
                   >
                     Attach Proof
                   </button>
                </div>
                <div className="flex flex-wrap gap-2">
                   {managerEvidence.map(ev => (
                      <div key={ev.id} className="flex items-center space-x-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-xl text-[10px] font-bold text-indigo-700 animate-in zoom-in-95">
                         <Paperclip size={10} />
                         <span>{ev.name}</span>
                         <X size={10} className="cursor-pointer hover:text-red-500" onClick={() => setManagerEvidence(prev => prev.filter(x => x.id !== ev.id))} />
                      </div>
                   ))}
                   {managerEvidence.length === 0 && (
                      <div className="w-full py-4 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center text-slate-300 hover:text-indigo-400 hover:border-indigo-100 transition-all cursor-pointer" onClick={addManagerEvidence}>
                         <Upload size={14} className="mr-2" />
                         <span className="text-[9px] font-black uppercase tracking-widest">Drop calibration artifacts</span>
                      </div>
                   )}
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

const FeedbackItem = ({ from, role, date, content, sentiment, avatar }: any) => (
  <div className="p-8 hover:bg-slate-50/50 transition-all group">
    <div className="flex items-start space-x-6">
      <img src={avatar} className="w-12 h-12 rounded-2xl border-2 border-white shadow-lg" alt={from} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{from}</span>
            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[8px] font-black uppercase tracking-widest">{role}</span>
          </div>
          <span className="text-[10px] font-bold text-slate-400">{date}</span>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed font-medium">"{content}"</p>
        <div className="mt-4 flex items-center space-x-3">
          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${sentiment === 'Positive' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
            {sentiment} Signal
          </span>
        </div>
      </div>
    </div>
  </div>
);

const PeerReviewRow = ({ id, name, role, deadline, status, avatar, nudged, onNudge, onView }: any) => (
  <div className="p-8 flex items-center justify-between hover:bg-slate-50/30 transition-all group">
    <div className="flex items-center space-x-5">
      <img src={avatar} className="w-12 h-12 rounded-2xl border-2 border-white shadow-md group-hover:scale-105 transition-all" alt={name} />
      <div>
        <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors uppercase tracking-tight">{name}</h4>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{role}</p>
      </div>
    </div>
    <div className="flex items-center space-x-12">
      <div className="text-right">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
        <span className={`text-xs font-black uppercase tracking-tighter ${status === 'Submitted' ? 'text-green-600' : 'text-amber-600 animate-pulse'}`}>{status}</span>
      </div>
      <div className="text-right">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Deadline</p>
        <span className="text-xs font-black text-slate-700">{deadline}</span>
      </div>
      {status !== 'Submitted' && (
        <button 
          onClick={onNudge}
          disabled={nudged}
          className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center space-x-2 ${nudged ? 'bg-slate-100 text-slate-400 border border-slate-200' : 'bg-white border border-slate-200 text-slate-700 hover:border-primary hover:text-primary shadow-sm'}`}
        >
          <Bell size={14} />
          <span>{nudged ? 'Nudged' : 'Nudge'}</span>
        </button>
      )}
      {status === 'Submitted' && (
        <button 
          onClick={onView}
          className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-black transition-all flex items-center space-x-2"
        >
          <Eye size={14} />
          <span>View</span>
        </button>
      )}
    </div>
  </div>
);

const TeamReviewItem = ({ name, role, progress, status, avatar, okrCount, onReview }: any) => (
  <div className="p-8 flex items-center justify-between hover:bg-slate-50/30 transition-all cursor-pointer group">
    <div className="flex items-center space-x-6">
      <img src={avatar} alt={name} className="w-14 h-14 rounded-2xl border-2 border-white shadow-xl group-hover:scale-105 transition-all" />
      <div>
        <h4 className="font-bold text-lg text-slate-900 group-hover:text-primary transition-colors tracking-tight uppercase">{name}</h4>
        <div className="flex items-center space-x-3 mt-1.5">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{role}</span>
          <span className="w-1 h-1 bg-slate-200 rounded-full" />
          <span className="text-[10px] font-black text-slate-400 uppercase">{okrCount} Objectives</span>
        </div>
      </div>
    </div>
    <div className="flex items-center space-x-12">
      <div className="text-right">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Self-Appraisal</p>
        <div className="flex items-center space-x-3">
          <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-50">
            <div className={`h-full ${progress === 100 ? 'bg-primary shadow-[0_0_10px_rgba(22,89,230,0.5)]' : 'bg-slate-300'}`} style={{ width: `${progress}%` }}></div>
          </div>
          <span className="text-[11px] font-black text-slate-900">{progress}%</span>
        </div>
      </div>
      <button 
        onClick={(e) => { e.stopPropagation(); onReview(); }}
        className="px-10 py-3 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
      >
        Review
      </button>
    </div>
  </div>
);

const RequestFeedbackModal = ({ onClose, objectives }: any) => {
  const [selectedColleagues, setSelectedColleagues] = useState<string[]>([]);
  const [selectedObjs, setSelectedObjs] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const colleagues = [
    { id: 'c1', name: 'Sarah Chen', role: 'Sr. Product Manager', avatar: 'https://picsum.photos/seed/sarah/100/100' },
    { id: 'c2', name: 'Jordan Smith', role: 'Staff Engineer', avatar: 'https://picsum.photos/seed/jordan/100/100' },
    { id: 'c3', name: 'Elena Rossi', role: 'Product Designer', avatar: 'https://picsum.photos/seed/elena/100/100' },
    { id: 'c4', name: 'Marcus Vane', role: 'DevOps Lead', avatar: 'https://picsum.photos/seed/marcus/100/100' },
    { id: 'c5', name: 'Lila Ray', role: 'Customer Success', avatar: 'https://picsum.photos/seed/lila/100/100' },
  ];

  const filteredColleagues = colleagues.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleColleague = (id: string) => {
    setSelectedColleagues(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleObj = (id: string) => {
    setSelectedObjs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-[3rem] w-full max-w-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-5">
            <div className="w-14 h-14 bg-primary text-white rounded-[1.25rem] flex items-center justify-center shadow-xl shadow-primary/20">
              <UserPlus size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">Request Calibration</h3>
              <p className="text-sm text-slate-500 font-medium mt-1">Gather qualitative input on your horizon performance</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-600 transition-all"><X size={28}/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar bg-white">
           <div className="space-y-6">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Select Colleagues</label>
              <div className="relative group">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by name or functional role..." 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold outline-none focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all" 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {filteredColleagues.map(c => (
                   <div 
                    key={c.id} 
                    onClick={() => toggleColleague(c.id)} 
                    className={`p-5 border-2 rounded-3xl flex items-center space-x-4 cursor-pointer transition-all ${
                      selectedColleagues.includes(c.id) 
                        ? 'bg-primary/5 border-primary shadow-sm ring-1 ring-primary/10' 
                        : 'bg-white border-slate-100 hover:border-slate-300'
                    }`}
                   >
                      <img src={c.avatar} className="w-10 h-10 rounded-2xl object-cover shadow-sm" alt={c.name} />
                      <div className="min-w-0">
                         <p className="text-sm font-black text-slate-900 truncate">{c.name}</p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase truncate tracking-tight">{c.role}</p>
                      </div>
                      {selectedColleagues.includes(c.id) && <CheckCircle2 size={18} className="text-primary ml-auto animate-in zoom-in-95" />}
                   </div>
                 ))}
                 {filteredColleagues.length === 0 && (
                   <div className="col-span-2 py-10 text-center text-slate-400 font-bold italic">No colleagues found matching "{searchQuery}"</div>
                 )}
              </div>
           </div>

           <div className="space-y-6">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Focus Objectives</label>
              <div className="space-y-3">
                 {objectives.map((obj: any) => (
                    <div 
                      key={obj.id} 
                      onClick={() => toggleObj(obj.id)} 
                      className={`p-5 border-2 rounded-[1.5rem] flex items-center justify-between cursor-pointer transition-all ${
                        selectedObjs.includes(obj.id) 
                          ? 'bg-primary/5 border-primary shadow-sm' 
                          : 'bg-white border-slate-100 hover:border-slate-300'
                      }`}
                    >
                       <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-full border-2 transition-all ${selectedObjs.includes(obj.id) ? 'bg-primary border-primary text-white' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
                             <Target size={18} />
                          </div>
                          <span className="text-sm font-bold text-slate-700 tracking-tight">{obj.title}</span>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="space-y-6">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Contextual Message</label>
              <div className="relative group">
                <textarea 
                  placeholder="e.g. Seeking specific feedback on my strategic contributions to the API project..." 
                  className="w-full bg-white text-slate-900 border border-slate-200 rounded-[2rem] p-8 text-sm font-medium outline-none focus:ring-4 focus:ring-primary/20 transition-all h-48 resize-none shadow-inner placeholder:text-slate-400" 
                />
                <div className="absolute bottom-6 right-6 opacity-30 group-focus-within:opacity-100 transition-opacity">
                   <Sparkles size={20} className="text-primary" />
                </div>
              </div>
           </div>
        </div>

        <div className="p-10 border-t border-slate-100 bg-white flex items-center justify-end space-x-6">
           <button onClick={onClose} className="px-8 py-3 text-sm font-black text-slate-400 hover:text-slate-800 transition-colors uppercase tracking-widest">Discard</button>
           <button 
            onClick={onClose} 
            disabled={selectedColleagues.length === 0} 
            className="px-14 py-4 bg-primary/20 text-primary border border-primary/10 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/5 hover:bg-primary hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
           >
             Send Request
           </button>
        </div>
      </div>
    </div>
  );
};

const TakeAppraisalWorkspace = ({ onClose, objectives }: any) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const activeObj = objectives[currentIdx];

  const handleNext = () => {
    if (currentIdx < objectives.length - 1) setCurrentIdx(currentIdx + 1);
    else onClose();
  };

  return (
    <div className="fixed inset-0 z-[250] bg-slate-50/95 backdrop-blur-xl animate-in zoom-in-95 duration-300 flex flex-col">
       <div className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-4">
             <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center"><PenTool size={20}/></div>
             <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight uppercase leading-none">Self-Appraisal Workspace</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Horizon Performance Calibration</p>
             </div>
          </div>
          <div className="flex items-center space-x-8">
             <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black text-slate-400 uppercase">Progress</span>
                <div className="w-48 h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                   <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${((currentIdx + 1) / objectives.length) * 100}%` }} />
                </div>
                <span className="text-[10px] font-black text-primary">{currentIdx + 1} / {objectives.length}</span>
             </div>
             <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-all"><X size={24}/></button>
          </div>
       </div>

       <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
             <div className="max-w-4xl mx-auto space-y-12">
                <div className="animate-in slide-in-from-bottom-4 duration-500">
                   <div className="flex items-center space-x-3 mb-4">
                      <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-lg text-[9px] font-black uppercase">{activeObj.type}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center"><Hash size={12} className="mr-1.5" /> ID: {activeObj.id}</span>
                   </div>
                   <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-4 uppercase">{activeObj.title}</h2>
                </div>

                <div className="space-y-10">
                   <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-l-4 border-primary pl-4">Key Result Evaluation</p>
                   <div className="space-y-8">
                      {activeObj.krs.map((kr: any) => (
                        <KREvaluationCard key={kr.id} {...kr} />
                      ))}
                   </div>
                </div>

                <div className="pt-12 border-t border-slate-100 flex items-center justify-between">
                   <button 
                    disabled={currentIdx === 0}
                    onClick={() => setCurrentIdx(currentIdx - 1)}
                    className="px-8 py-4 border border-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all disabled:opacity-30"
                   >
                      Previous Objective
                   </button>
                   <button 
                    onClick={handleNext}
                    className="px-12 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center space-x-3"
                   >
                      <span>{currentIdx < objectives.length - 1 ? 'Next Objective' : 'Submit Final Appraisal'}</span>
                      <ArrowRight size={18} />
                   </button>
                </div>
             </div>
          </div>

          {/* AI Sidebar */}
          <div className="w-96 bg-white border-l border-slate-200 p-8 shrink-0 flex flex-col space-y-8">
             <div className="p-6 bg-slate-900 rounded-[2rem] text-white relative overflow-hidden group shadow-xl">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><BrainCircuit size={80} className="text-primary" /></div>
                <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 border-l-2 border-primary pl-4">Contextual Guide</h4>
                <p className="text-xs text-slate-300 font-medium italic leading-relaxed">
                   "Your throughput for '{activeObj.title}' is in the 88th percentile of the organization. Align your scoring with quantitative evidence from GitHub and Jira."
                </p>
             </div>
             
             <div className="space-y-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Institutional Benchmarks</h4>
                <div className="p-5 border border-slate-100 rounded-3xl space-y-4">
                   <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">Unit Mean Score</span>
                      <span className="font-bold text-slate-800">4.2 / 5</span>
                   </div>
                   <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">Data Freshness</span>
                      <span className="px-1.5 py-0.5 bg-green-50 text-green-700 rounded text-[9px] font-black uppercase tracking-widest">Real-time</span>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

const KREvaluationCard = ({ title, target, current, unit }: any) => {
  const [score, setScore] = useState<number | null>(null);
  const [comment, setComment] = useState('');

  return (
    <div className="p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm space-y-8 group hover:border-primary/20 transition-all">
       <div className="flex justify-between items-start">
          <div className="flex-1">
             <h4 className="text-xl font-bold text-slate-900 tracking-tight leading-snug">{title}</h4>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Target Outcome: <span className="text-slate-900">{current} / {target} {unit}</span></p>
          </div>
          <div className="flex items-center space-x-1">
             {[1, 2, 3, 4, 5].map(s => (
               <button 
                key={s} 
                onClick={() => setScore(s)}
                className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${score === s ? 'bg-primary text-white shadow-lg' : 'bg-slate-50 text-slate-300 hover:bg-primary/5 hover:text-primary'}`}
               >
                  {s}
               </button>
             ))}
          </div>
       </div>

       <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Qualitative Context & Evidence</label>
             <div className="flex items-center space-x-1 text-slate-400 cursor-pointer hover:text-primary transition-colors">
                <Paperclip size={10} />
                <span className="text-[9px] font-black uppercase">Attach Work</span>
             </div>
          </div>
          <textarea 
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Document the primary actions taken to achieve this outcome. Mention blockers or pivot justifications..."
            className="w-full bg-white text-slate-900 border-2 border-slate-100 rounded-2xl p-5 text-sm font-medium outline-none focus:border-primary transition-all h-28 resize-none shadow-inner" 
          />
       </div>
    </div>
  );
};

// -- Helpers --

const AnchorGroup = ({ title, desc, icon, onClick, count }: any) => (
  <div onClick={onClick} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-md hover:border-primary/20 transition-all cursor-pointer group flex items-center justify-between">
    <div className="flex items-center space-x-6">
      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-inner">
        {React.cloneElement(icon, { size: 32 })}
      </div>
      <div>
        <h3 className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors tracking-tight uppercase leading-none">{title}</h3>
        <p className="text-slate-500 text-sm mt-1.5 font-medium">{desc}</p>
        <div className="mt-3">
          <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">{count} ACTIVE ITEMS</span>
        </div>
      </div>
    </div>
    <div className="p-3 bg-slate-50 rounded-xl text-slate-300 group-hover:text-primary group-hover:bg-primary/5 transition-all">
      <ChevronRight size={24} />
    </div>
  </div>
);

const SummaryCard = ({ label, value, trend, icon }: any) => (
  <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm h-full flex flex-col justify-between group hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2.5 bg-slate-50 rounded-xl group-hover:scale-105 transition-transform">{icon}</div>
      {trend && <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full">{trend}</span>}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">{label}</p>
      <h4 className="text-xl font-black text-slate-900 tracking-tight leading-none truncate">{value}</h4>
    </div>
  </div>
);

const TabButton = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 ${active ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}>
    {icon}
    <span>{label}</span>
  </button>
);

const PersistentAcknowledgmentSection = ({ signOff, onSign }: { signOff: any, onSign: () => void }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col h-fit animate-in slide-in-from-right duration-400">
       {/* Purple Header */}
       <div className="p-6 bg-[#6366F1] text-white flex items-center space-x-3">
          <Fingerprint size={24} />
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest leading-none">INSTITUTIONAL SIGN-OFF</h3>
            <p className="text-[9px] opacity-70 font-bold uppercase mt-1 tracking-widest">COMPLIANCE LEDGER ARCHIVE</p>
          </div>
       </div>
       
       <div className="p-8 space-y-8">
          <div className="space-y-1">
             <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{signOff.name}</h4>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">GLOBAL CYCLE VERIFICATION</p>
          </div>

          <div className="grid grid-cols-2 gap-4 pb-6">
             <SignatureStatusBadge label="MANAGER" signed={signOff.managerSigned} />
             <SignatureStatusBadge label="EMPLOYEE" signed={signOff.employeeSigned} />
          </div>

          <div className="space-y-4">
             {signOff.employeeSigned ? (
               <div className="p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center justify-center space-x-2 text-green-600 shadow-sm animate-in fade-in zoom-in-95">
                  <CheckCircle2 size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">VERIFIED RECORD</span>
               </div>
             ) : (
               <>
                 <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start space-x-3 text-amber-800">
                    <Info size={18} className="shrink-0 mt-0.5" />
                    <p className="text-[10px] font-bold uppercase leading-relaxed tracking-tight">
                       YOUR SIGNATURE IS REQUIRED TO ARCHIVE THIS CYCLE'S PERFORMANCE RECORDS.
                    </p>
                 </div>
                 <button onClick={onSign} className="w-full py-4 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-3">
                    <Fingerprint size={18} />
                    <span>SIGN & VERIFY CYCLE</span>
                 </button>
               </>
             )}
          </div>
       </div>
    </div>
  );
};

const SignatureStatusBadge = ({ label, signed }: { label: string, signed: boolean }) => (
  <div className="flex flex-col items-center space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
     <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${signed ? 'bg-green-100 border-green-200 text-green-600 shadow-lg shadow-green-100' : 'bg-white border-slate-200 text-slate-200'}`}>
        {signed ? <Activity size={18} /> : <UserCircle size={18} />}
     </div>
     <span className={`text-[8px] font-black uppercase tracking-tighter ${signed ? 'text-green-600' : 'text-slate-400'}`}>{label} {signed ? 'VERIFIED' : 'PENDING'}</span>
  </div>
);

const CycleSignatureModal = ({ cycleName, onClose, onConfirm }: { cycleName: string, onClose: () => void, onConfirm: (comment: string, sig: string) => void }) => {
  const [comment, setComment] = useState('');
  const [signature, setSignature] = useState('');
  const [hasFile, setHasFile] = useState(false);

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col">
        <div className="p-8 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
           <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                 <Fingerprint size={24} />
              </div>
              <div>
                 <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase leading-none">Global Verification</h3>
                 <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-widest">Institutional Sign-off: {cycleName}</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><X size={24}/></button>
        </div>

        <div className="p-10 space-y-8 overflow-y-auto custom-scrollbar">
           <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Acknowledgment Comments</label>
              <textarea 
                 value={comment}
                 onChange={e => setComment(e.target.value)}
                 placeholder="Provide any qualitative context for the overall cycle performance..."
                 className="w-full bg-white text-slate-900 border-2 border-slate-100 rounded-2xl p-5 text-sm font-medium outline-none focus:border-indigo-600 transition-all h-32 resize-none shadow-inner"
              />
           </div>

           <div className="space-y-6 pt-4 border-t border-slate-50">
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Electronic Signature</label>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">Option A: Type Legal Name</p>
                       <input 
                         type="text" 
                         value={signature}
                         onChange={e => setSignature(e.target.value)}
                         placeholder="Full Legal Name" 
                         className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-black outline-none focus:border-indigo-600 transition-all bg-slate-50 shadow-inner"
                       />
                    </div>
                    <div className="space-y-2">
                       <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">Option B: Document Upload</p>
                       <button 
                         onClick={() => { setHasFile(!hasFile); if(!hasFile) setSignature(''); }}
                         className={`w-full h-12 border-2 border-dashed rounded-xl flex items-center justify-center space-x-2 transition-all ${hasFile ? 'bg-green-50 border-green-200 text-green-600' : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-indigo-400'}`}
                       >
                          {hasFile ? <CheckCircle2 size={16}/> : <FileUp size={16}/>}
                          <span className="text-[10px] font-black uppercase">{hasFile ? 'Image Verified' : 'Select Sig.png'}</span>
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="p-8 border-t border-slate-100 bg-slate-50 flex items-center justify-end space-x-4">
           <button onClick={onClose} className="px-6 py-2.5 text-xs font-black uppercase text-slate-500">Cancel</button>
           <button 
             disabled={!signature && !hasFile}
             onClick={() => onConfirm(comment, signature)}
             className="px-12 py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-900/40 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 flex items-center space-x-2"
           >
              <CheckCircle2 size={18} />
              <span>Complete Acknowledgment</span>
           </button>
        </div>
      </div>
    </div>
  );
};

const OKRDetailView = ({ objectives }: { objectives: any[] }) => (
  <div className="space-y-4">
    {objectives.map(obj => (
      <div key={obj.id} className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-[9px] font-black uppercase">OKR</span>
              <StatusBadge status={obj.status || 'Active'} mini />
            </div>
            <h4 className="text-xl font-bold text-slate-900 tracking-tight uppercase">{obj.title}</h4>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Attainment</p>
            <span className="text-2xl font-black text-slate-900">{obj.progress}%</span>
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 border-l-2 border-primary ml-1 pl-3">Key Results</p>
          <div className="grid grid-cols-1 gap-2">
            {obj.krs.map((kr: any) => (
              <div key={kr.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                  <span className="text-xs font-bold text-slate-700">{kr.title}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase">{kr.current} / {kr.target} {kr.unit}</span>
                  <div className="h-1.5 w-20 bg-white border border-slate-100 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-primary" style={{ width: `${(kr.current / kr.target) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
);

const KPIDetailView = ({ objectives }: { objectives: any[] }) => (
  <div className="space-y-4">
    {objectives.map(obj => (
      <div key={obj.id} className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm flex items-center justify-between group hover:border-secondary/30 transition-all">
        <div className="flex items-center space-x-6">
          <div className="w-14 h-14 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center shadow-inner">
            <Zap size={28} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 bg-secondary/10 text-secondary rounded text-[9px] font-black uppercase">KPI</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase flex items-center"><LinkIcon size={10} className="mr-1" /> {obj.source}</span>
            </div>
            <h4 className="text-lg font-bold text-slate-900 mt-1 tracking-tight uppercase">{obj.title}</h4>
            <div className="flex items-center space-x-4 mt-2">
               <span className="text-[10px] font-black text-green-600 uppercase">Live Refresh active</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-12">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Target Velocity</p>
            <span className="text-xl font-black text-slate-800">{obj.progress}%</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl text-slate-300 group-hover:text-secondary transition-all">
            <Activity size={20} />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const IDPDetailView = ({ goals }: { goals: any[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {goals.map(goal => (
      <div key={goal.id} className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm flex flex-col space-y-6 hover:shadow-md transition-all">
        <div className="flex justify-between items-start">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl shadow-inner">
            <Award size={20} />
          </div>
          <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100 uppercase">{goal.status}</span>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 tracking-tight uppercase">{goal.title}</h4>
          <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-widest">{goal.provider} • IDP Target</p>
        </div>
        <div className="space-y-2">
           <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase">
              <span>Progress</span>
              <span className="text-slate-900">{goal.progress}%</span>
           </div>
           <div className="h-2 w-full bg-slate-50 border border-slate-100 rounded-full overflow-hidden shadow-inner">
              <div className="h-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)] transition-all duration-1000" style={{ width: `${goal.progress}%` }} />
           </div>
        </div>
      </div>
    ))}
  </div>
);

const StatusBadge = ({ status, mini }: { status: string, mini?: boolean }) => {
  const styles: any = {
    'Active': 'bg-blue-100 text-blue-700',
    'Pending Review': 'bg-amber-100 text-amber-700 animate-pulse',
    'Reviewed': 'bg-green-100 text-green-700',
    'Completed': 'bg-green-100 text-green-700',
    'Draft': 'bg-slate-100 text-slate-500',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full ${mini ? 'text-[7px]' : 'text-[9px]'} font-black uppercase tracking-widest shadow-sm ${styles[status] || 'bg-slate-100 text-slate-500'}`}>
       {status}
    </span>
  );
};

export default AppraisalsPage;