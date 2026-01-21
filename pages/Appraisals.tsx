import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Plus, 
  ChevronRight, 
  MessageSquare, 
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
  Users,
  User,
  UserPlus,
  ClipboardCheck,
  AlertCircle,
  Search,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  Trash2,
  Check,
  MessageCircle,
  UserCircle,
  PenTool,
  BrainCircuit,
  Paperclip,
  Hash,
  Fingerprint,
  Info,
  Award,
  Bell,
  Eye,
  Loader2,
  File as FileIcon,
  MoreVertical,
  Scale,
  ClipboardList,
  ShieldAlert,
  ArrowUpRight,
  GitBranch,
  BarChart3,
  Activity,
  BellRing,
  Quote,
  MapPin,
  Calendar,
  Monitor,
  Star,
  ChevronLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { GoogleGenAI } from "@google/genai";

// --- MOCK DATA ---

const MOCK_PEOPLE = [
  { id: 'u1', name: 'Sarah Chen', role: 'Sr. Product Manager', avatar: 'https://picsum.photos/seed/sarah/100/100', dept: 'Core Platform' },
  { id: 'u2', name: 'Marcus Vane', role: 'DevOps Lead', avatar: 'https://picsum.photos/seed/marcus/100/100', dept: 'Infrastructure' },
  { id: 'u3', name: 'Jordan Smith', role: 'Staff Engineer', avatar: 'https://picsum.photos/seed/jordan/100/100', dept: 'Core Platform' },
  { id: 'u4', name: 'Elena Rossi', role: 'Product Designer', avatar: 'https://picsum.photos/seed/elena/100/100', dept: 'Creative' },
  { id: 'u5', name: 'David Wright', role: 'Security Lead', avatar: 'https://picsum.photos/seed/david/100/100', dept: 'Security Unit' },
  { id: 'u6', name: 'Lila Ray', role: 'Product Analyst', avatar: 'https://picsum.photos/seed/lila/100/100', dept: 'Product Strategy' },
];

const MOCK_FEEDBACKS_RECEIVED = [
  { id: 'fb1', from: 'Marcus Vane', role: 'Manager', relationship: 'Superior', date: 'Oct 12, 2024', content: 'Excellent work on the v4 release cycle. Your focus on system reliability helped the unit exceed our uptime targets significantly.', sentiment: 'Positive', avatar: 'https://picsum.photos/seed/marcus/100/100', attachments: [{ name: 'performance_summary_q3.pdf', size: '1.2MB' }] },
  { id: 'fb2', from: 'Sarah Chen', role: 'Sr. Product Manager', relationship: 'Peer', date: 'Oct 10, 2024', content: 'Alex is a great collaborator. They provided crucial feedback on the API specs that saved us weeks of refactoring.', sentiment: 'Positive', avatar: 'https://picsum.photos/seed/sarah/100/100', attachments: [] },
  { id: 'fb3', from: 'Elena Rossi', role: 'Product Designer', relationship: 'Peer', date: 'Oct 05, 2024', content: 'Strategic alignment on the design system migration could have been tighter. Looking for more proactive syncs in Q4.', sentiment: 'Neutral', avatar: 'https://picsum.photos/seed/elena/100/100', attachments: [{ name: 'design_sync_notes.docx', size: '450KB' }] },
];

const MOCK_FEEDBACK_REQUESTS = [
  { 
    id: 'req1', 
    from: 'Jordan Smith', 
    role: 'Staff Engineer', 
    relationship: 'Peer', 
    date: 'Oct 15, 2024', 
    content: 'Seeking technical feedback on the new load balancer implementation I proposed.', 
    avatar: 'https://picsum.photos/seed/jordan/100/100',
    mode: 'in-app',
    note: 'Focus specifically on the edge cases we discussed during the standup.'
  },
  { 
    id: 'req2', 
    from: 'David Wright', 
    role: 'Security Lead', 
    relationship: 'Superior', 
    date: 'Oct 14, 2024', 
    content: 'Requesting calibration on the recent security audit for the Core Platform.', 
    avatar: 'https://picsum.photos/seed/david/100/100',
    mode: 'session',
    sessionDate: '2024-10-25',
    sessionTime: '14:30',
    location: 'Meeting Room A / Virtual Sync',
    note: 'I want to walk through the penetration test results together before final submission.'
  },
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
      { id: 'kr-1', title: "Maintain < 200ms latency on /v1/calibrate", target: 200, current: 182, unit: 'ms', type: 'numeric', selfScore: 0, selfComment: '', evidence: [] },
      { id: 'kr-2', title: "Scale to 50k concurrent requests", target: 50000, current: 42000, unit: 'req', type: 'percentage', selfScore: 0, selfComment: '', evidence: [] }
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
      { id: 'kr-3', title: "Finalize all v3.5 UI specs", target: 100, current: 42, unit: '%', type: 'star', selfScore: 0, selfComment: '', evidence: [] },
      { id: 'kr-4', title: "Strategic Design Alignment", target: 5, current: 3, unit: 'score', type: '5-scale', selfScore: 0, selfComment: '', evidence: [] }
    ]
  },
];

const MOCK_PEER_REVIEWS = [
  { id: 'pr1', name: 'JORDAN SMITH', role: 'STAFF ENGINEER', status: 'PENDING', deadline: 'Oct 20', avatar: 'https://picsum.photos/seed/jordan/100/100', objectives: [] },
  { 
    id: 'pr2', 
    name: 'LILA RAY', 
    role: 'PRODUCT ANALYST', 
    status: 'SUBMITTED', 
    deadline: 'Oct 22', 
    avatar: 'https://picsum.photos/seed/lila/100/100',
    objectives: [
      { id: 'obj-1', title: "Optimize API Response Throughput", score: 95, comment: "Lila demonstrated exceptional technical foresight." },
      { id: 'obj-2', title: "Deliver v3.5 Strategic Roadmap", score: 88, comment: "Strong alignment with cross-functional partners." }
    ]
  },
  { id: 'pr3', name: 'DAVID WRIGHT', role: 'SECURITY LEAD', status: 'PENDING', deadline: 'Oct 20', avatar: 'https://picsum.photos/seed/david/100/100', objectives: [] },
];

const MOCK_TEAM_REPORTS = [
  { id: 'tr1', name: 'MARCUS VANE', role: 'DEVOPS LEAD', selfProgress: 100, managerProgress: null, status: 'Needs Review', avatar: 'https://picsum.photos/seed/marcus/100/100', okrCount: 3 },
  { id: 'tr2', name: 'SARAH CHEN', role: 'SR. PRODUCT MANAGER', selfProgress: 45, managerProgress: null, status: 'Draft', avatar: 'https://picsum.photos/seed/sarah/100/100', okrCount: 4 },
  { id: 'tr3', name: 'JORDAN SMITH', role: 'STAFF ENGINEER', selfProgress: 100, managerProgress: 92, status: 'Completed', avatar: 'https://picsum.photos/seed/jordan/100/100', okrCount: 2 },
  { id: 'tr4', name: 'LILA RAY', role: 'PRODUCT ANALYST', selfProgress: 100, managerProgress: 42, status: 'Completed', avatar: 'https://picsum.photos/seed/lila/100/100', okrCount: 5 },
  { id: 'tr5', name: 'DAVID WRIGHT', role: 'SECURITY LEAD', selfProgress: 15, managerProgress: 25, status: 'Completed', avatar: 'https://picsum.photos/seed/david/100/100', okrCount: 3 },
];

const MOCK_IDP_GOALS = [
  { id: 'idp1', title: "Advanced System Architecture", type: "Certification", status: "In Progress", progress: 65, provider: "AWS" }
];

const AppraisalsPage: React.FC<{ role: UserRole }> = ({ role }) => {
  const [activeTab, setActiveTab] = useState<'my' | 'feedbacks' | 'peer' | 'team'>('my');
  const [feedbackSubTab, setFeedbackSubTab] = useState<'received' | 'requests'>('received');
  const [activeGroup, setActiveGroup] = useState<'okr' | 'kpi' | 'idp' | null>(null);
  const [activeReviewReport, setActiveReviewReport] = useState<any>(null);
  const [activePeerReview, setActivePeerReview] = useState<any>(null);
  const [feedbackSearch, setFeedbackSearch] = useState('');
  const [nudgedIds, setNudgedIds] = useState<Set<string>>(new Set());
  
  const [isUploadScoreModalOpen, setIsUploadScoreModalOpen] = useState(false);
  const [viewingSummaryReport, setViewingSummaryReport] = useState<any>(null);

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isTakeAppraisalOpen, setIsTakeAppraisalOpen] = useState(false);
  const [isSigningModalOpen, setIsSigningModalOpen] = useState(false);
  const [respondingToRequest, setRespondingToRequest] = useState<any>(null);

  const [cycleSignOff, setCycleSignOff] = useState({
    id: 'cycle-q3-2024',
    name: 'Q3 2024 STRATEGIC HORIZON',
    employeeSigned: false,
    managerSigned: true, 
    comment: '',
    signature: '',
    timestamp: null as string | null
  });

  const isEmployee = role === UserRole.EMPLOYEE;

  const handleNudge = (id: string) => {
    setNudgedIds(prev => new Set(prev).add(id));
  };

  const filteredFeedbacks = useMemo(() => {
    const list = feedbackSubTab === 'received' ? MOCK_FEEDBACKS_RECEIVED : MOCK_FEEDBACK_REQUESTS;
    return list.filter((fb: any) => 
      (fb.from || fb.name)?.toLowerCase().includes(feedbackSearch.toLowerCase()) || 
      fb.content?.toLowerCase().includes(feedbackSearch.toLowerCase()) ||
      fb.role?.toLowerCase().includes(feedbackSearch.toLowerCase())
    );
  }, [feedbackSubTab, feedbackSearch]);

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

  const handleBack = () => {
    setActiveGroup(null); 
    setActiveReviewReport(null); 
    setActivePeerReview(null);
    setViewingSummaryReport(null);
  };

  if (viewingSummaryReport) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500 pb-12">
        <div className="flex items-center space-x-4">
          <button onClick={handleBack} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all text-slate-500 shadow-sm"><ArrowLeft size={18} /></button>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight uppercase leading-none">Appraisal Summary View</h1>
        </div>
        <AppraisalSummaryView report={viewingSummaryReport} objectives={INITIAL_MY_OBJECTIVES} />
      </div>
    );
  }

  if (activePeerReview) {
    return (
      <div className="space-y-6 animate-in slide-in-from-right duration-500 pb-12">
        <div className="flex items-center space-x-4">
          <button onClick={handleBack} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all text-slate-500 shadow-sm"><ArrowLeft size={18} /></button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight uppercase leading-none">Peer Review Insight</h1>
            <p className="text-slate-500 text-sm mt-2">Performance feedback submitted by {activePeerReview.name}</p>
          </div>
        </div>
        <PeerReviewDetailView review={activePeerReview} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {activeGroup && (
            <button onClick={handleBack} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all text-slate-500 shadow-sm"><ArrowLeft size={18} /></button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight uppercase leading-none">Appraisals & Performance</h1>
            <p className="text-slate-500 text-sm mt-2">Manage unified OKRs, RKT (Real-time KPIs), and multi-stage evaluations</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => setIsRequestModalOpen(true)} className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all">
            <UserPlus size={16} />
            <span>Request Feedback</span>
          </button>
          <button onClick={() => setIsTakeAppraisalOpen(true)} className="flex items-center space-x-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-black shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
            <ClipboardCheck size={18} />
            <span>Take Appraisal</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-slate-200 w-fit shadow-sm overflow-x-auto no-scrollbar max-w-full">
        <TabButton active={activeTab === 'my'} onClick={() => setActiveTab('my')} icon={<Target size={14}/>} label="My Performance" />
        <TabButton active={activeTab === 'feedbacks'} onClick={() => setActiveTab('feedbacks')} icon={<MessageCircle size={14}/>} label="My feedbacks" />
        <TabButton active={activeTab === 'peer'} onClick={() => setActiveTab('peer')} icon={<Award size={14}/>} label="Peer Review" />
        {!isEmployee && <TabButton active={activeTab === 'team'} onClick={() => setActiveTab('team')} icon={<Users size={14}/>} label="Team Reviews" />}
      </div>

      {activeTab === 'my' && (
        <div className="space-y-6">
          {!activeGroup ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <SummaryCard label="MY OKR ATTAINMENT" value="74%" trend="+4%" icon={<Target size={20} className="text-primary" />} />
                <SummaryCard label="MY KPI VELOCITY" value="92%" trend="Stable" icon={<Zap size={20} className="text-secondary" />} />
                <SummaryCard label="GOAL PROGRESS" value="52%" trend="+8%" icon={<Award size={20} className="text-amber-500" />} />
                <SummaryCard label="LAST UPDATED" value="Oct 16, 10:45" trend="Live" icon={<Clock size={20} className="text-green-600" />} />
                <SummaryCard label="APPRAISAL STATUS" value="Awaiting Review" icon={<AlertCircle size={20} className="text-indigo-500" />} />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-6">
                  <AnchorGroup title="PERIODIC OKRS" desc="Strategic objectives and child key results tracked for the horizon." icon={<Target className="text-primary" />} onClick={() => setActiveGroup('okr')} count={1} />
                  <AnchorGroup title="REAL-TIME KPIS" desc="Automated operational metrics feeding directly from system integrations." icon={<Zap className="text-secondary" />} onClick={() => setActiveGroup('kpi')} count={1} />
                  <AnchorGroup title="INDIVIDUAL DEVELOPMENT GOALS" desc="Personal growth targets and IDP items for skill maturity." icon={<Users className="text-amber-500" />} onClick={() => setActiveGroup('idp')} count={2} />
                </div>
                <div className="lg:col-span-4 shrink-0">
                  <PersistentAcknowledgmentSection signOff={cycleSignOff} onSign={() => setIsSigningModalOpen(true)} />
                </div>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
               <div className="lg:col-span-8">
                  {activeGroup === 'okr' && <OKRDetailView objectives={INITIAL_MY_OBJECTIVES.filter(o => o.type === 'OKR')} />}
                  {activeGroup === 'kpi' && <KPIDetailView objectives={INITIAL_MY_OBJECTIVES.filter(o => o.type === 'KPI')} />}
                  {activeGroup === 'idp' && <IDPDetailView goals={MOCK_IDP_GOALS} />}
               </div>
               <div className="lg:col-span-4 shrink-0">
                  <PersistentAcknowledgmentSection signOff={cycleSignOff} onSign={() => setIsSigningModalOpen(true)} />
               </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'feedbacks' && (
        <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden animate-in fade-in flex flex-col min-h-[600px]">
          <div className="p-8 border-b border-slate-100 bg-slate-50/50 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-slate-200 shadow-sm w-fit">
                <button 
                  onClick={() => { setFeedbackSubTab('received'); setFeedbackSearch(''); }}
                  className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${feedbackSubTab === 'received' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  Feedback Received
                </button>
                <button 
                  onClick={() => { setFeedbackSubTab('requests'); setFeedbackSearch(''); }}
                  className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${feedbackSubTab === 'requests' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  Feedback Requests
                </button>
              </div>
              <div className="relative group w-full md:w-80">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  value={feedbackSearch}
                  onChange={(e) => setFeedbackSearch(e.target.value)}
                  placeholder={feedbackSubTab === 'received' ? "Search archive..." : "Search requests..."}
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all shadow-sm" 
                />
              </div>
            </div>
            <div>
              <h3 className="font-black text-slate-900 tracking-tight uppercase leading-none">
                {feedbackSubTab === 'received' ? 'Institutional Input Archive' : 'Incoming Feedback Pipeline'}
              </h3>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1.5">
                {feedbackSubTab === 'received' ? 'Qualitative feedback received from the organization' : 'Provide feedback to peers, subordinates, and superiors'}
              </p>
            </div>
          </div>
          <div className="divide-y divide-slate-100 flex-1 bg-white">
            {filteredFeedbacks.length > 0 ? (
              filteredFeedbacks.map((item: any) => (
                feedbackSubTab === 'received' ? (
                  <FeedbackReceivedItem key={item.id} {...item} />
                ) : (
                  <FeedbackRequestRow key={item.id} {...item} onRespond={() => setRespondingToRequest(item)} />
                )
              ))
            ) : (
              <div className="py-32 text-center flex flex-col items-center justify-center space-y-4">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 shadow-inner">
                  <MessageSquare size={40} />
                </div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">No matching feedback records found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'peer' && (
        <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden animate-in fade-in duration-300">
           <div className="p-10 border-b border-slate-100">
              <h3 className="font-black text-slate-900 tracking-tight uppercase text-lg leading-none">Peer Review Pipeline</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Manage reviews requested by your colleagues</p>
           </div>
           <div className="divide-y divide-slate-100">
              {MOCK_PEER_REVIEWS.map((review) => {
                const isNudged = nudgedIds.has(review.id);
                return (
                  <div key={review.id} className="p-8 flex items-center justify-between hover:bg-slate-50/50 transition-all group">
                     <div className="flex items-center space-x-6">
                        <img src={review.avatar} className="w-14 h-14 rounded-[1.25rem] border-2 border-white shadow-md object-cover" alt={review.name} />
                        <div>
                           <h4 className="font-black text-slate-900 group-hover:text-primary transition-colors tracking-tight uppercase text-base leading-none">{review.name}</h4>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5">{review.role}</p>
                        </div>
                     </div>

                     <div className="flex items-center space-x-16">
                        <div className="text-center">
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Status</p>
                           <span className={`text-[10px] font-black uppercase tracking-tighter ${review.status === 'PENDING' ? 'text-amber-600' : 'text-green-600'}`}>{review.status}</span>
                        </div>
                        <div className="text-center">
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Deadline</p>
                           <span className="text-[11px] font-black text-slate-900 uppercase">{review.deadline}</span>
                        </div>
                        <div className="w-32 flex justify-end">
                           {review.status === 'PENDING' ? (
                             <button 
                                disabled={isNudged}
                                onClick={() => handleNudge(review.id)}
                                className={`flex items-center space-x-2 px-6 py-2.5 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${isNudged ? 'bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed' : 'text-slate-700 bg-white hover:border-primary hover:text-primary'}`}
                             >
                                {isNudged ? <Check size={14} /> : <BellRing size={14} />}
                                <span>{isNudged ? 'Nudged' : 'Nudge'}</span>
                             </button>
                           ) : (
                             <button 
                                onClick={() => setActivePeerReview(review)}
                                className="flex items-center space-x-2 px-8 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-slate-200"
                             >
                                <Eye size={14} />
                                <span>View</span>
                             </button>
                           )}
                        </div>
                     </div>
                  </div>
                );
              })}
           </div>
        </div>
      )}

      {activeTab === 'team' && !isEmployee && (
        <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden animate-in fade-in">
          <div className="p-8 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-black text-slate-900 tracking-tight uppercase leading-none">Unit Calibration Queue</h3>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1.5">Process and calibrate completed appraisals from your direct reports</p>
          </div>
          <div className="divide-y divide-slate-100">
            {MOCK_TEAM_REPORTS.map(report => (
              <TeamReviewItem 
                key={report.id} 
                {...report} 
                onReview={() => setActiveReviewReport(report)}
                onViewSummary={() => setViewingSummaryReport(report)}
                onUploadScore={() => {
                  setActiveReviewReport(report);
                  setIsUploadScoreModalOpen(true);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* --- MODALS --- */}

      {respondingToRequest && (
        <RespondToRequestModal request={respondingToRequest} onClose={() => setRespondingToRequest(null)} />
      )}

      {isUploadScoreModalOpen && activeReviewReport && (
        <UploadFinalScoreModal report={activeReviewReport} onClose={() => { setIsUploadScoreModalOpen(false); setActiveReviewReport(null); }} />
      )}

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
 * Peer Review Detail View Component
 */
const PeerReviewDetailView = ({ review }: { review: any }) => {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      {/* Profile Header */}
      <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm flex items-center justify-between overflow-hidden relative">
         <div className="absolute top-0 right-0 p-10 opacity-5">
            <Award size={160} className="text-primary" />
         </div>
         <div className="flex items-center space-x-8 relative z-10">
            <img src={review.avatar} className="w-24 h-24 rounded-[2rem] border-4 border-slate-50 shadow-2xl object-cover" alt={review.name} />
            <div>
               <div className="flex items-center space-x-3 mb-2">
                  <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm">Verified Peer Input</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Submitted {review.deadline}</span>
               </div>
               <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none uppercase">{review.name}</h2>
               <p className="text-slate-500 font-bold mt-2 flex items-center uppercase text-sm">
                 {review.role} <span className="mx-3 text-slate-200">•</span> PEER CALIBRATOR
               </p>
            </div>
         </div>
         <div className="flex items-center space-x-6 px-10 border-l border-slate-100 relative z-10">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
               <ShieldCheck size={28} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed max-w-[120px]">
               Review is locked and verified by organization governance.
            </p>
         </div>
      </div>

      {/* Review Comments & Scores per Objective */}
      <div className="grid grid-cols-1 gap-6">
         {review.objectives.length > 0 ? review.objectives.map((obj: any, idx: number) => (
           <div key={obj.id} className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm animate-in slide-in-from-bottom-2" style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-50">
                 <div className="flex items-center space-x-5">
                    <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-600 shadow-inner">
                       <Target size={24} />
                    </div>
                    <div>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Horizon Objective</span>
                       <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-tight mt-1">{obj.title}</h3>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Colleague Rating</p>
                    <div className="flex items-center space-x-3">
                       <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-600" style={{ width: `${obj.score}%` }}></div>
                       </div>
                       <span className="text-3xl font-black text-indigo-600">{obj.score}%</span>
                    </div>
                 </div>
              </div>

              <div className="relative">
                 <div className="absolute -top-4 -left-4 p-2 bg-indigo-50/50 rounded-full text-indigo-600 opacity-30">
                    <Quote size={20} fill="currentColor" />
                 </div>
                 <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-8 text-sm font-medium text-slate-600 leading-relaxed italic shadow-inner">
                    "{obj.comment}"
                 </div>
              </div>
           </div>
         )) : (
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-20 text-center">
               <AlertCircle size={48} className="mx-auto text-slate-100 mb-4" />
               <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No granular objective feedback available for this cycle.</p>
            </div>
         )}
      </div>

      {/* Institutional Calibration Summary */}
      <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden group border border-slate-800">
         <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
            <BrainCircuit size={180} className="text-primary" />
         </div>
         <div className="relative z-10 max-w-4xl">
            <div className="flex items-center space-x-4 mb-8">
               <div className="w-12 h-12 bg-primary/20 text-primary border border-primary/30 rounded-2xl flex items-center justify-center">
                  <Sparkles size={28} />
               </div>
               <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] border-l-2 border-primary pl-4">PEER SENTIMENT ANALYSIS</h3>
            </div>
            <p className="text-xl font-medium text-slate-300 leading-relaxed italic mb-10">
               "{review.name.split(' ')[0]}'s feedback signals deep tactical alignment with unit OKRs. The narrative highlights strong <span className="text-white font-bold">collaborative throughput</span> particularly during the engine refactor phase. Bias-scan detected zero linguistic anomaly."
            </p>
            <div className="flex items-center space-x-4">
               <button className="px-8 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Download Audit Record</button>
               <button className="px-8 py-3 text-[10px] font-black text-slate-400 hover:text-white transition-colors uppercase tracking-widest">Flag for HR Calibration</button>
            </div>
         </div>
      </div>
    </div>
  );
};

/**
 * Institutional Sign-off Card Section
 */
const PersistentAcknowledgmentSection = ({ signOff, onSign }: { signOff: any, onSign: () => void }) => (
  <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col h-fit">
     <div className="p-6 bg-[#6366F1] text-white flex items-center space-x-3">
        <Fingerprint size={24} />
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-widest leading-none">INSTITUTIONAL SIGN-OFF</h3>
          <p className="text-[8px] opacity-70 font-bold uppercase mt-1 tracking-widest">COMPLIANCE LEDGER ARCHIVE</p>
        </div>
     </div>
     <div className="p-8 space-y-8">
        <div>
          <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none">{signOff.name}</h4>
          <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-widest">GLOBAL CYCLE VERIFICATION</p>
        </div>

        {/* Verification Widgets Grid */}
        <div className="grid grid-cols-2 gap-3">
           <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center space-y-3">
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-500">
                 <Activity size={20} />
              </div>
              <span className="text-[8px] font-black text-green-600 uppercase tracking-widest">MANAGER VERIFIED</span>
           </div>
           <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center space-y-3">
              <div className="w-10 h-10 bg-slate-200/50 rounded-full flex items-center justify-center text-slate-300">
                 <UserCircle size={22} />
              </div>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">EMPLOYEE PENDING</span>
           </div>
        </div>

        {/* Governance Info Box */}
        <div className="p-5 bg-amber-50 border border-amber-100 rounded-[1.5rem] flex items-start space-x-3">
           <Info size={16} className="text-amber-500 shrink-0 mt-0.5" />
           <p className="text-[9px] text-amber-700 font-black leading-relaxed uppercase tracking-widest">
              YOUR SIGNATURE IS REQUIRED TO ARCHIVE THIS CYCLE'S PERFORMANCE RECORDS.
           </p>
        </div>

        <button 
          onClick={onSign} 
          className="w-full py-4 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-3"
        >
          <Fingerprint size={18} />
          <span>SIGN & VERIFY CYCLE</span>
        </button>
     </div>
  </div>
);

/**
 * Global Verification Modal
 */
const CycleSignatureModal = ({ cycleName, onClose, onConfirm }: any) => {
  const [comments, setComments] = useState('');
  const [legalName, setLegalName] = useState('');

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
       <div className="bg-white rounded-[3.5rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200">
          <div className="p-10 border-b border-slate-100 flex items-center justify-between">
             <div className="flex items-center space-x-5">
                <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-200">
                   <Fingerprint size={32} />
                </div>
                <div>
                   <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">Global Verification</h3>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em] mt-1.5">
                      Institutional Sign-off: {cycleName}
                   </p>
                </div>
             </div>
             <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-600 transition-all"><X size={32}/></button>
          </div>

          <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar bg-white">
             <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Acknowledgment Comments</label>
                <textarea 
                  value={comments}
                  onChange={e => setComments(e.target.value)}
                  placeholder="Provide any qualitative context for the overall cycle performance..."
                  className="w-full bg-white border-2 border-slate-100 rounded-[2rem] p-8 text-sm font-medium outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all h-48 resize-none shadow-sm" 
                />
             </div>

             <div className="space-y-6">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Electronic Signature</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Option A: Type Legal Name</p>
                      <input 
                        type="text"
                        value={legalName}
                        onChange={e => setLegalName(e.target.value)}
                        placeholder="Full Legal Name"
                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-sm outline-none focus:ring-4 focus:ring-indigo-600/5 transition-all shadow-inner"
                      />
                   </div>
                   <div className="space-y-2">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Option B: Document Upload</p>
                      <button className="w-full h-full min-h-[52px] border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center space-x-3 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 transition-all group">
                         <Upload size={16} className="text-slate-400 group-hover:text-indigo-600" />
                         <span className="text-[10px] font-black uppercase text-slate-400 group-hover:text-indigo-600">Select SIG.PNG</span>
                      </button>
                   </div>
                </div>
             </div>
          </div>

          <div className="p-10 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between">
             <button onClick={onClose} className="px-8 py-3 text-xs font-black text-slate-400 hover:text-slate-800 transition-colors uppercase tracking-widest">Cancel</button>
             <button 
              disabled={!legalName}
              onClick={() => onConfirm(comments, legalName)}
              className="px-14 py-4 bg-[#C7D2FE] text-white rounded-[2rem] text-xs font-black uppercase tracking-widest shadow-xl transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-95 flex items-center space-x-3"
              style={{ background: legalName ? 'linear-gradient(135deg, #6366F1 0%, #1659E6 100%)' : '#C7D2FE' }}
             >
                <CheckCircle2 size={18} />
                <span>Complete Acknowledgment</span>
             </button>
          </div>
       </div>
    </div>
  );
};

/**
 * Upload Final Score Modal
 */
const UploadFinalScoreModal = ({ report, onClose }: any) => {
  const [feedback, setFeedback] = useState('');
  const [finalScore, setFinalScore] = useState<string>('');
  const [files, setFiles] = useState<any[]>([]);

  const handleFileUpload = () => {
    const newFile = { id: Date.now(), name: `calibration_proof_${Date.now()}.pdf`, size: '2.1MB' };
    setFiles([...files, newFile]);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200">
        <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-5">
            <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-200">
              <Scale size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">Final Calibration Adjustment</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">Official override for {report.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-600 transition-all"><X size={28}/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-12 space-y-10 custom-scrollbar bg-white">
          <div className="space-y-4">
             <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Calibration Session Feedback</label>
             <textarea 
               value={feedback}
               onChange={e => setFeedback(e.target.value)}
               placeholder="Document the justification for this final override score. This record will be immutable once submitted."
               className="w-full bg-slate-50 border-none rounded-[2rem] p-8 text-sm font-medium outline-none focus:ring-4 focus:ring-indigo-600/5 transition-all h-48 resize-none shadow-inner" 
             />
          </div>
          <div className="space-y-4">
             <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Final Authorization Score (0-100%)</label>
             <div className="relative group">
                <input 
                  type="number" 
                  value={finalScore}
                  onChange={e => setFinalScore(e.target.value)}
                  placeholder="Enter final calibrated attainment..."
                  className="w-full bg-slate-50 border-none rounded-2xl px-8 py-5 font-black text-2xl outline-none focus:ring-4 focus:ring-indigo-600/5 transition-all shadow-inner"
                />
                <span className="absolute right-8 top-1/2 -translate-y-1/2 text-xs font-black text-slate-300 uppercase">%</span>
             </div>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between px-1">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Supporting Artifacts</label>
              <button 
                onClick={handleFileUpload}
                className="flex items-center space-x-1.5 text-xs font-bold text-indigo-600 hover:underline"
              >
                <Plus size={14} />
                <span>Add Evidence</span>
              </button>
            </div>
            <div className="space-y-3">
              {files.map((f) => (
                <div key={f.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl animate-in slide-in-from-top-2">
                  <div className="flex items-center space-x-3">
                    <FileIcon size={16} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-700">{f.name}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">({f.size})</span>
                  </div>
                  <button onClick={() => setFiles(files.filter((x) => x.id !== f.id))} className="p-2 text-slate-300 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {files.length === 0 && (
                <div onClick={handleFileUpload} className="py-12 border-2 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-300 hover:text-indigo-600 hover:border-indigo-600/20 transition-all cursor-pointer bg-slate-50/50 group">
                  <Upload size={32} className="mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Upload Supporting Evidence</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-10 border-t border-slate-100 bg-slate-50 flex items-center justify-end space-x-6">
           <button onClick={onClose} className="px-8 py-3 text-sm font-black text-slate-400 hover:text-slate-800 transition-colors uppercase tracking-widest">Discard</button>
           <button 
            onClick={onClose} 
            disabled={!feedback || !finalScore}
            className="px-14 py-4 bg-indigo-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 flex items-center space-x-3"
           >
             <CheckCircle2 size={18} />
             <span>Authorize Final Score</span>
           </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Appraisal Summary View Page
 */
const AppraisalSummaryView = ({ report, objectives }: { report: any, objectives: any[] }) => {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      {/* Summary Profile Header */}
      <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm flex items-center justify-between overflow-hidden relative">
         <div className="absolute top-0 right-0 p-10 opacity-5">
            <BarChart3 size={160} className="text-primary" />
         </div>
         <div className="flex items-center space-x-8 relative z-10">
            <img src={report.avatar} className="w-24 h-24 rounded-3xl border-4 border-slate-50 shadow-2xl object-cover" alt={report.name} />
            <div>
               <div className="flex items-center space-x-3 mb-2">
                  <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm">Completed Record</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Q3 Strategic Horizon</span>
               </div>
               <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none uppercase">{report.name}</h2>
               <p className="text-slate-500 font-bold mt-2 flex items-center uppercase text-sm">
                 {report.role} <span className="mx-3 text-slate-200">•</span> {report.okrCount} Strategic Objectives
               </p>
            </div>
         </div>
         <div className="flex items-center space-x-12 px-12 border-l border-slate-100 relative z-10">
            <div className="text-center">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Self Score</p>
               <p className="text-3xl font-black text-slate-900">{report.selfProgress}%</p>
            </div>
            <div className="text-center">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Mgr Score</p>
               <p className="text-3xl font-black text-primary">{report.managerProgress || 'N/A'}%</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {objectives.map((obj, idx) => (
          <div key={obj.id} className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm animate-in slide-in-from-bottom-2" style={{ animationDelay: `${idx * 100}ms` }}>
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50">
               <div className="flex items-center space-x-5">
                  <div className={`p-4 rounded-2xl ${obj.type === 'KPI' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>
                    {obj.type === 'KPI' ? <Zap size={24} /> : <Target size={24} />}
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{obj.type} Objective</span>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-tight mt-1">{obj.title}</h3>
                  </div>
               </div>
               <div className="flex items-center space-x-6 bg-slate-50 px-8 py-4 rounded-2xl border border-slate-100">
                  <div className="text-center">
                     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Confidence</p>
                     <p className="text-sm font-black text-slate-800">{obj.confidence}%</p>
                  </div>
                  <div className="w-1 h-8 bg-slate-200 rounded-full" />
                  <div className="text-center">
                     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Attainment</p>
                     <p className="text-sm font-black text-primary">{obj.progress}%</p>
                  </div>
               </div>
            </div>
            <div className="space-y-6">
                 {obj.krs.map((kr: any) => {
                    const delta = (kr.managerScore || 0) - (kr.selfScore || 0);
                    return (
                      <div key={kr.id} className="p-6 bg-slate-50/50 border border-slate-100 rounded-3xl flex items-center hover:bg-white hover:shadow-lg transition-all group">
                         <div className="flex-1 min-w-0 pr-12">
                            <div className="flex items-center space-x-3 mb-1.5">
                               <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                                  <GitBranch size={16} />
                               </div>
                               <h4 className="text-sm font-bold text-slate-800 uppercase tracking-tight truncate">{kr.title}</h4>
                            </div>
                            <p className="text-[10px] font-medium text-slate-400 italic pl-11">"{kr.selfComment}"</p>
                         </div>
                         <div className="w-48 flex justify-center">
                            <div className="px-5 py-2.5 bg-white border border-slate-100 rounded-xl shadow-sm">
                               <span className="text-sm font-black text-slate-900">{kr.selfScore}{kr.unit}</span>
                            </div>
                         </div>
                         <div className="w-48 flex justify-center">
                            <div className="px-5 py-2.5 bg-indigo-50 border border-indigo-100 rounded-xl shadow-sm">
                               <span className="text-sm font-black text-indigo-600">{kr.managerScore}{kr.unit}</span>
                            </div>
                         </div>
                         <div className="w-32 flex justify-end items-center">
                            <span className={`flex items-center font-black text-xs space-x-1 ${delta === 0 ? 'text-slate-400' : delta > 0 ? 'text-green-600' : 'text-red-500'}`}>
                               {delta > 0 && <ArrowUpRight size={14} />}
                               <span>{delta === 0 ? 'CALIBRATED' : `${delta > 0 ? '+' : ''}${delta}${kr.unit}`}</span>
                            </span>
                         </div>
                      </div>
                    );
                 })}
            </div>
          </div>
        ))}
      </div>

      {/* Institutional Calibration Summary */}
      <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden group border border-slate-800">
         <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
            <BrainCircuit size={180} className="text-primary" />
         </div>
         <div className="relative z-10 max-w-4xl">
            <div className="flex items-center space-x-4 mb-8">
               <div className="w-12 h-12 bg-primary/20 text-primary border border-primary/30 rounded-2xl flex items-center justify-center">
                  <Sparkles size={28} />
               </div>
               <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] border-l-2 border-primary pl-4">Institutional AI Analysis</h3>
            </div>
            <p className="text-xl font-medium text-slate-300 leading-relaxed italic mb-10">
               "Performance calibration for this record across the Q3 horizon demonstrates deep strategic alignment. Unit throughput targets have been exceeded consistently. Sentiment signal from peer feedback remains top-decile."
            </p>
         </div>
      </div>
    </div>
  );
};

const TeamReviewItem = ({ id, name, role, selfProgress, managerProgress, status, avatar, okrCount, onReview, onViewSummary, onUploadScore }: any) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isCompleted = status === 'Completed';
  const threshold = 50;
  const isSelfLow = selfProgress < threshold;
  const isMgrLow = managerProgress !== null && managerProgress < threshold;
  const navigate = useNavigate();

  return (
    <div className="p-8 flex items-center justify-between hover:bg-slate-50/30 transition-all group relative">
      <div className="flex items-center space-x-6">
        <img src={avatar} alt={name} className="w-14 h-14 rounded-2xl border-2 border-white shadow-xl group-hover:scale-105 transition-all object-cover" />
        <div>
          <h4 className="font-black text-lg text-slate-900 group-hover:text-primary transition-colors tracking-tight uppercase leading-none">{name}</h4>
          <div className="flex items-center space-x-3 mt-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{role}</span>
            <span className="w-1 h-1 bg-slate-200 rounded-full" />
            <span className="text-[10px] font-black text-slate-400 uppercase">{okrCount} Objectives</span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-12">
        <div className="flex items-center space-x-8">
           <div className="text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">SELF-APPRAISAL</p>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div className={`h-full ${isSelfLow ? 'bg-red-500' : 'bg-primary'}`} style={{ width: `${selfProgress}%` }}></div>
                </div>
                <span className={`text-[11px] font-black ${isSelfLow ? 'text-red-500' : 'text-slate-900'}`}>{selfProgress}%</span>
              </div>
           </div>
           {isCompleted && (
             <div className="text-right border-l border-slate-100 pl-8">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">MANAGER APPRAISAL</p>
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                    <div className={`h-full ${isMgrLow ? 'bg-red-500' : 'bg-indigo-600'}`} style={{ width: `${managerProgress}%` }}></div>
                  </div>
                  <span className={`text-[11px] font-black ${isMgrLow ? 'text-red-500' : 'text-slate-900'}`}>{managerProgress}%</span>
                </div>
             </div>
           )}
        </div>
        <div className="relative">
          {!isCompleted ? (
            <button onClick={(e) => { e.stopPropagation(); onReview(); }} className="px-10 py-3 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">Review</button>
          ) : (
            <>
              <button onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }} className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-primary rounded-xl hover:bg-slate-50 transition-all shadow-sm">
                <MoreVertical size={20} />
              </button>
              {isMenuOpen && (
                <>
                  <div className="fixed inset-0 z-[10]" onClick={() => setIsMenuOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-100 shadow-2xl rounded-2xl z-20 p-2 animate-in fade-in zoom-in-95 duration-100">
                    <button onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); onViewSummary(); }} className="w-full flex items-center space-x-3 px-3 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-all text-left">
                       <Eye size={16} className="text-slate-400" />
                       <span>View Appraisal Summary</span>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); onUploadScore(); }} className="w-full flex items-center space-x-3 px-3 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-all text-left">
                       <Upload size={16} className="text-slate-400" />
                       <span>Upload Final Score</span>
                    </button>
                    {isMgrLow && (
                       <button onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); navigate(`/initiate-pip/${id}`); }} className="w-full flex items-center space-x-3 px-3 py-3 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all text-left border-t border-slate-50 mt-1">
                          <ShieldAlert size={16} />
                          <span>Initiate PIP</span>
                       </button>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const FeedbackReceivedItem = ({ from, role, relationship, date, content, sentiment, avatar, attachments }: any) => (
  <div className="p-8 hover:bg-slate-50/50 transition-all group">
    <div className="flex items-start space-x-6">
      <img src={avatar} className="w-14 h-14 rounded-2xl border-2 border-white shadow-lg shrink-0 object-cover" alt={from} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{from}</span>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-black uppercase tracking-widest">{role}</span>
            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${relationship === 'Superior' ? 'bg-indigo-50 text-indigo-600' : relationship === 'Subordinate' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-600'}`}>
              {relationship}
            </span>
          </div>
          <span className="text-[10px] font-bold text-slate-400">{date}</span>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed font-medium">"{content}"</p>
        <div className="mt-6 flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${sentiment === 'Positive' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
            {sentiment} SIGNAL
          </span>
        </div>
      </div>
    </div>
  </div>
);

const FeedbackRequestRow = ({ from, role, relationship, date, content, avatar, onRespond }: any) => (
  <div className="p-8 flex items-center justify-between hover:bg-slate-50/30 transition-all group">
    <div className="flex items-center space-x-5 flex-1">
      <img src={avatar} className="w-14 h-14 rounded-2xl border-2 border-white shadow-md shrink-0 object-cover" alt={from} />
      <div className="min-w-0 pr-8">
        <div className="flex items-center space-x-3 mb-1">
          <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors uppercase tracking-tight leading-none">{from}</h4>
          <span className="text-[9px] font-black uppercase text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{relationship}</span>
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{role} • Requested {date}</p>
        <p className="text-xs text-slate-500 mt-2 italic line-clamp-1 leading-relaxed">"{content}"</p>
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <button onClick={onRespond} className="px-8 py-3 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center space-x-2">
        <PenTool size={16} />
        <span>Give Feedback</span>
      </button>
    </div>
  </div>
);

const RespondToRequestModal = ({ request, onClose }: any) => {
  const [feedback, setFeedback] = useState('');
  const isSession = request.mode === 'session';

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center space-x-5">
            <img src={request.avatar} className="w-14 h-14 rounded-2xl border-2 border-slate-50 shadow-xl object-cover" alt={request.from} />
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase leading-none">Response for: {request.from}</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">{request.role} • {request.relationship}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-600 transition-all"><X size={28}/></button>
        </div>
        <div className="p-12 space-y-8">
            {request.note && (
              <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-[1.5rem] relative">
                 <div className="absolute -top-3 left-6 px-3 py-1 bg-indigo-600 text-white rounded-full text-[8px] font-black uppercase tracking-widest">Requester's Note</div>
                 <p className="text-sm text-indigo-900 font-medium italic italic leading-relaxed">"{request.note}"</p>
              </div>
            )}

            {isSession ? (
              <div className="space-y-6">
                 <div className="p-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center text-center space-y-6">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm border border-slate-100">
                       <Calendar size={32} />
                    </div>
                    <div>
                       <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Scheduled Check-in Session</h4>
                       <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-widest">In-person calibration requested</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 w-full">
                       <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Date & Time</span>
                          <span className="text-sm font-bold text-slate-800">{request.sessionDate} @ {request.sessionTime}</span>
                       </div>
                       <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Location</span>
                          <span className="text-sm font-bold text-slate-800">{request.location}</span>
                       </div>
                    </div>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Meeting Prep Notes (Optional)</label>
                    <textarea value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Any points you wish to discuss during the session..." className="w-full bg-slate-50 border-none rounded-[1.5rem] p-6 text-sm font-medium outline-none focus:ring-4 focus:ring-primary/5 transition-all h-32 resize-none shadow-inner" />
                 </div>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Qualitative Feedback Context</label>
                <textarea value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Provide qualitative context..." className="w-full bg-slate-50 border-none rounded-[2rem] p-8 text-sm font-medium outline-none focus:ring-4 focus:ring-primary/5 transition-all h-56 resize-none shadow-inner" />
              </div>
            )}

            <div className="mt-8 flex justify-end space-x-4">
                <button onClick={onClose} className="px-8 py-3 text-sm font-black text-slate-400 hover:text-slate-800 transition-colors uppercase tracking-widest">Discard</button>
                <button onClick={onClose} disabled={!isSession && !feedback} className="px-14 py-4 bg-primary text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30">
                  {isSession ? 'Confirm Session' : 'Submit Response'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

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

const OKRDetailView = ({ objectives }: { objectives: any[] }) => (
  <div className="space-y-4 animate-in slide-in-from-bottom-2">
    {objectives.map(obj => (
      <div key={obj.id} className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm space-y-6">
        <h4 className="text-xl font-bold text-slate-900 uppercase tracking-tight">{obj.title}</h4>
        <div className="text-2xl font-black text-primary">{obj.progress}% Attainment</div>
        <div className="space-y-3">
            {obj.krs.map((kr: any) => (
                <div key={kr.id} className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">{kr.title}</span>
                    <span className="text-[10px] font-black text-slate-400">{kr.selfScore}{kr.unit}</span>
                </div>
            ))}
        </div>
      </div>
    ))}
  </div>
);

const KPIDetailView = ({ objectives }: { objectives: any[] }) => (
  <div className="space-y-4 animate-in slide-in-from-bottom-2">
    {objectives.map(obj => (
      <div key={obj.id} className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm flex items-center justify-between">
        <h4 className="text-lg font-bold text-slate-900 uppercase tracking-tight">{obj.title}</h4>
        <div className="text-xl font-black text-secondary">{obj.progress}% Velocity</div>
      </div>
    ))}
  </div>
);

const IDPDetailView = ({ goals }: { goals: any[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-bottom-2">
    {goals.map(goal => (
      <div key={goal.id} className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
        <h4 className="font-bold text-slate-900 uppercase tracking-tight">{goal.title}</h4>
        <div className="text-slate-900 font-black mt-2 text-2xl">{goal.progress}%</div>
      </div>
    ))}
  </div>
);

/**
 * Request Feedback Modal Component
 */
const RequestFeedbackModal = ({ onClose, objectives }: any) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColleagues, setSelectedColleagues] = useState<any[]>([]);
  const [feedbackMode, setFeedbackMode] = useState<'in-app' | 'session'>('in-app');
  const [note, setNote] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Session details
  const [sessionDate, setSessionDate] = useState('');
  const [sessionTime, setSessionTime] = useState('');
  const [location, setLocation] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredColleagues = useMemo(() => {
    if (!searchTerm) return [];
    return MOCK_PEOPLE.filter(p => 
      (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       p.role.toLowerCase().includes(searchTerm.toLowerCase())) &&
      !selectedColleagues.find(sc => sc.id === p.id)
    );
  }, [searchTerm, selectedColleagues]);

  const addColleague = (person: any) => {
    setSelectedColleagues([...selectedColleagues, person]);
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  const removeColleague = (id: string) => {
    setSelectedColleagues(selectedColleagues.filter(c => c.id !== id));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] w-full max-w-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center space-x-5">
            <div className="w-14 h-14 bg-primary text-white rounded-[1.25rem] flex items-center justify-center shadow-xl shadow-primary/20">
              <UserPlus size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">Request Feedback</h3>
              <p className="text-sm text-slate-500 font-medium mt-1">Gather qualitative input on your horizon performance</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-600 transition-all"><X size={28}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar bg-white">
            {/* Search & Select Colleagues */}
            <div className="space-y-4">
               <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Identify Calibration Partners</label>
               <div className="relative" ref={dropdownRef}>
                  <div className="relative group">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="text"
                      value={searchTerm}
                      onChange={(e) => { setSearchTerm(e.target.value); setIsDropdownOpen(true); }}
                      onFocus={() => setIsDropdownOpen(true)}
                      placeholder="Search colleagues by name or role..."
                      className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all shadow-inner" 
                    />
                  </div>

                  {isDropdownOpen && filteredColleagues.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[2rem] z-50 p-3 animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
                       <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-1">
                          {filteredColleagues.map(p => (
                            <button 
                              key={p.id}
                              onClick={() => addColleague(p)}
                              className="w-full flex items-center space-x-4 p-3 hover:bg-slate-50 rounded-xl transition-all text-left group"
                            >
                               <img src={p.avatar} className="w-10 h-10 rounded-full border border-slate-100 shadow-sm" />
                               <div>
                                  <p className="text-xs font-black text-slate-900 uppercase">{p.name}</p>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{p.role}</p>
                               </div>
                            </button>
                          ))}
                       </div>
                    </div>
                  )}
               </div>

               {selectedColleagues.length > 0 ? (
                 <div className="flex flex-wrap gap-3 animate-in slide-in-from-top-2">
                    {selectedColleagues.map(c => (
                      <div key={c.id} className="flex items-center space-x-3 bg-primary/5 border border-primary/10 rounded-2xl pl-2 pr-4 py-2 shadow-sm group hover:border-primary/30 transition-all">
                         <img src={c.avatar} className="w-8 h-8 rounded-full border border-white shadow-sm" />
                         <div>
                            <p className="text-[10px] font-black text-slate-900 uppercase leading-none">{c.name}</p>
                            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tight mt-1">{c.role}</p>
                         </div>
                         <button onClick={() => removeColleague(c.id)} className="ml-2 p-1 text-slate-300 hover:text-red-500 transition-colors">
                            <X size={14} />
                         </button>
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="p-8 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-center space-y-3 bg-slate-50/50">
                    <Users size={32} className="text-slate-200" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No colleagues selected yet</p>
                 </div>
               )}
            </div>

            {/* Feedback Mode */}
            <div className="space-y-6">
               <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Engagement Framework</label>
               <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setFeedbackMode('in-app')}
                    className={`p-6 rounded-[2rem] border-2 transition-all text-left flex flex-col items-start space-y-4 ${feedbackMode === 'in-app' ? 'bg-primary/5 border-primary shadow-xl ring-4 ring-primary/5' : 'bg-white border-slate-100 hover:border-slate-200'}`}
                  >
                     <div className={`p-3 rounded-2xl ${feedbackMode === 'in-app' ? 'bg-primary text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}>
                        <Monitor size={20} />
                     </div>
                     <div>
                        <h4 className={`text-sm font-black uppercase tracking-tight ${feedbackMode === 'in-app' ? 'text-primary' : 'text-slate-900'}`}>Standard In-App</h4>
                        <p className="text-[10px] text-slate-500 font-medium italic mt-1 leading-relaxed">Qualitative text response provided through the platform portal.</p>
                     </div>
                  </button>
                  <button 
                    onClick={() => setFeedbackMode('session')}
                    className={`p-6 rounded-[2rem] border-2 transition-all text-left flex flex-col items-start space-y-4 ${feedbackMode === 'session' ? 'bg-primary/5 border-primary shadow-xl ring-4 ring-primary/5' : 'bg-white border-slate-100 hover:border-slate-200'}`}
                  >
                     <div className={`p-3 rounded-2xl ${feedbackMode === 'session' ? 'bg-primary text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}>
                        <Calendar size={20} />
                     </div>
                     <div>
                        <h4 className={`text-sm font-black uppercase tracking-tight ${feedbackMode === 'session' ? 'text-primary' : 'text-slate-900'}`}>Scheduled Session</h4>
                        <p className="text-[10px] text-slate-500 font-medium italic mt-1 leading-relaxed">Face-to-face or virtual calibration meeting for deeper context.</p>
                     </div>
                  </button>
               </div>
            </div>

            {/* Conditional Session Inputs */}
            {feedbackMode === 'session' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-400">
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Proposed Date</label>
                       <div className="relative">
                          <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input 
                            type="date" 
                            value={sessionDate}
                            onChange={e => setSessionDate(e.target.value)}
                            className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-10 pr-4 py-3.5 text-xs font-bold outline-none focus:bg-white focus:border-primary shadow-inner" 
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Proposed Time</label>
                       <div className="relative">
                          <Clock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input 
                            type="time" 
                            value={sessionTime}
                            onChange={e => setSessionTime(e.target.value)}
                            className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-10 pr-4 py-3.5 text-xs font-bold outline-none focus:bg-white focus:border-primary shadow-inner" 
                          />
                       </div>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Meeting Location / Link</label>
                    <div className="relative">
                       <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                       <input 
                        type="text" 
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        placeholder="e.g. Meeting Room 4 / Zoom Link / Coffee Shop" 
                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-10 pr-4 py-3.5 text-xs font-bold outline-none focus:bg-white focus:border-primary shadow-inner" 
                       />
                    </div>
                 </div>
              </div>
            )}

            {/* Context Note */}
            <div className="space-y-4">
               <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Strategic Note to Responder</label>
               <textarea 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Provide qualitative context or specific areas of focus for this feedback request..."
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-[2rem] p-8 text-sm font-medium outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all h-40 resize-none shadow-inner"
               />
            </div>
        </div>

        <div className="p-10 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between sticky bottom-0 z-10 backdrop-blur-md">
           <button onClick={onClose} className="px-8 py-3 text-xs font-black text-slate-400 hover:text-slate-800 transition-colors uppercase tracking-widest">Discard</button>
           <button 
              onClick={onClose}
              disabled={selectedColleagues.length === 0 || (feedbackMode === 'session' && (!sessionDate || !sessionTime || !location))}
              className="px-14 py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30"
           >
              Deploy Feedback Request
           </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Take Appraisal Workspace - High Fidelity Implementation
 */
const TakeAppraisalWorkspace = ({ onClose, objectives }: { onClose: () => void, objectives: any[] }) => {
  const [activeObjIndex, setActiveObjIndex] = useState(0);
  const [scores, setScores] = useState<Record<string, { score: number, comment: string, evidence: any[] }>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeObj = objectives[activeObjIndex];

  const handleUpdateScore = (krId: string, val: number) => {
    setScores(prev => ({
      ...prev,
      [krId]: { ...prev[krId], score: val }
    }));
  };

  const handleUpdateComment = (krId: string, val: string) => {
    setScores(prev => ({
      ...prev,
      [krId]: { ...prev[krId], comment: val }
    }));
  };

  const handleAttach = (krId: string) => {
    const file = { id: Date.now(), name: `evidence_snapshot_${Date.now()}.png` };
    setScores(prev => ({
      ...prev,
      [krId]: { ...prev[krId], evidence: [...(prev[krId]?.evidence || []), file] }
    }));
  };

  const calculateObjProgress = (obj: any) => {
    const relevantKrs = obj.krs;
    if (relevantKrs.length === 0) return 0;
    const total = relevantKrs.reduce((acc: number, kr: any) => acc + (scores[kr.id]?.score || 0), 0);
    return Math.round(total / relevantKrs.length);
  };

  const allDone = objectives.every(obj => obj.krs.every((kr: any) => (scores[kr.id]?.score || 0) > 0));

  if (isSubmitting) {
    return (
      <div className="fixed inset-0 z-[500] bg-white flex flex-col items-center justify-center p-12 text-center space-y-8 animate-in fade-in duration-500">
         <div className="w-24 h-24 bg-green-50 text-green-500 rounded-[2rem] flex items-center justify-center shadow-xl shadow-green-100 border-2 border-green-100 animate-bounce">
            <CheckCircle2 size={48} />
         </div>
         <div className="space-y-3">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight leading-none">Self-Appraisal Deployed</h2>
            <p className="text-slate-500 font-medium">Your record has been locked and dispatched to line management for calibration.</p>
         </div>
         <div className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] w-full max-w-sm text-[10px] font-black uppercase text-slate-400 tracking-widest leading-relaxed">
            Record Hash: 0x48f2...e931<br/>Timestamp: {new Date().toLocaleString()}
         </div>
         <button onClick={onClose} className="px-10 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">Exit Workspace</button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[250] bg-slate-50 flex flex-col animate-in slide-in-from-bottom duration-500">
       {/* Workspace Header */}
       <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 shrink-0 shadow-sm z-10">
          <div className="flex items-center space-x-6">
             <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <ClipboardList size={20} />
             </div>
             <div>
                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none">Performance Calibration Workspace</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1.5 tracking-widest">Q3 Horizon • Alex Rivera (Staff)</p>
             </div>
          </div>
          <div className="flex items-center space-x-6">
             <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Workspace Integrity</span>
                <span className="text-[10px] font-bold text-green-600 uppercase flex items-center"><ShieldCheck size={12} className="mr-1"/> Logic Verified</span>
             </div>
             <button onClick={onClose} className="p-3 text-slate-400 hover:bg-slate-100 rounded-xl transition-all"><X size={24}/></button>
          </div>
       </header>

       <div className="flex-1 flex overflow-hidden">
          {/* Navigation Sidebar */}
          <aside className="w-80 border-r border-slate-100 bg-white flex flex-col shrink-0">
             <div className="p-8 border-b border-slate-50 bg-slate-50/30">
                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-4">Alignment Steps</h3>
                <div className="space-y-2">
                   {objectives.map((obj, i) => {
                     const progress = calculateObjProgress(obj);
                     const isActive = activeObjIndex === i;
                     return (
                       <button 
                        key={obj.id} 
                        onClick={() => setActiveObjIndex(i)}
                        className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between group ${isActive ? 'bg-primary border-primary text-white shadow-xl shadow-primary/10' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300'}`}
                       >
                          <div className="flex items-center space-x-3 min-w-0">
                             <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isActive ? 'bg-white/20' : 'bg-slate-50 text-slate-400'}`}>
                                {i + 1}
                             </div>
                             <span className="text-[11px] font-black uppercase tracking-tight truncate pr-2">{obj.title}</span>
                          </div>
                          {progress > 0 && <Check size={16} className={isActive ? 'text-white' : 'text-green-500'} />}
                       </button>
                     );
                   })}
                </div>
             </div>
             
             <div className="mt-auto p-8 border-t border-slate-50 space-y-6">
                <div className="space-y-2">
                   <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <span>Total Completion</span>
                      <span>{Math.round((objectives.filter(obj => calculateObjProgress(obj) > 0).length / objectives.length) * 100)}%</span>
                   </div>
                   <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-primary" style={{ width: `${(objectives.filter(obj => calculateObjProgress(obj) > 0).length / objectives.length) * 100}%` }} />
                   </div>
                </div>
                <button 
                  disabled={!allDone}
                  onClick={() => setIsSubmitting(true)}
                  className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl transition-all ${allDone ? 'bg-slate-900 text-white shadow-slate-200 hover:scale-105 active:scale-95' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                >
                   Finalize Record
                </button>
             </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto custom-scrollbar p-12 bg-white">
             <div className="max-w-4xl mx-auto space-y-12">
                {/* Objective Header */}
                <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                   <div className="flex items-center space-x-4">
                      <div className={`p-4 rounded-2xl ${activeObj.type === 'KPI' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>
                        {activeObj.type === 'KPI' ? <Zap size={32} /> : <Target size={32} />}
                      </div>
                      <div>
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Calibrating Objective {activeObjIndex + 1} of {objectives.length}</span>
                         <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight leading-none mt-1">{activeObj.title}</h1>
                      </div>
                   </div>
                   <div className="p-6 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-center justify-between shadow-inner">
                      <p className="text-sm font-medium text-slate-500 italic max-w-xl leading-relaxed">
                        Assess your performance across the specific Key Results defined for this objective. Be prepared to provide qualitative artifacts as evidence.
                      </p>
                      <div className="text-right">
                         <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Calculated Score</p>
                         <p className="text-3xl font-black text-primary">{calculateObjProgress(activeObj)}%</p>
                      </div>
                   </div>
                </div>

                {/* Key Results Inputs */}
                <div className="space-y-8 pb-20">
                   {activeObj.krs.map((kr: any, idx: number) => (
                     <div key={kr.id} className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm space-y-10 group hover:border-primary/20 transition-all duration-500">
                        <div className="flex items-start justify-between border-b border-slate-50 pb-6">
                           <div className="flex items-center space-x-5">
                              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                                 <GitBranch size={20} />
                              </div>
                              <div>
                                 <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight group-hover:text-primary transition-colors">{kr.title}</h3>
                                 <p className="text-[10px] font-black text-slate-400 uppercase mt-1 tracking-widest">Logic: {kr.type} • Target: {kr.target}{kr.unit}</p>
                              </div>
                           </div>
                           <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-xl text-[9px] font-black text-slate-400 uppercase">Vector {idx + 1}</div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                           <div className="lg:col-span-4 space-y-6">
                              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Calibration Score</label>
                              <KRScoreInput type={kr.type} value={scores[kr.id]?.score || 0} onChange={(v) => handleUpdateScore(kr.id, v)} />
                           </div>

                           <div className="lg:col-span-8 space-y-8">
                              <div className="space-y-4">
                                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Institutional Context (Narrative)</label>
                                 <textarea 
                                    value={scores[kr.id]?.comment || ''}
                                    onChange={(e) => handleUpdateComment(kr.id, e.target.value)}
                                    placeholder="Provide qualitative justification for this rating..."
                                    className="w-full bg-slate-50 border-none rounded-[2rem] p-6 text-sm font-medium outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all h-32 resize-none shadow-inner"
                                 />
                              </div>

                              <div className="space-y-4">
                                 <div className="flex items-center justify-between px-1">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Evidence Artifacts</label>
                                    <button onClick={() => handleAttach(kr.id)} className="text-[10px] font-bold text-primary hover:underline uppercase flex items-center space-x-1">
                                       <Paperclip size={10} />
                                       <span>Attach Record</span>
                                    </button>
                                 </div>
                                 <div className="flex flex-wrap gap-2">
                                    {(scores[kr.id]?.evidence || []).map((file: any) => (
                                       <div key={file.id} className="flex items-center space-x-3 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl animate-in zoom-in-95">
                                          <FileIcon size={12} className="text-slate-400" />
                                          <span className="text-[10px] font-bold text-slate-600 truncate max-w-[120px]">{file.name}</span>
                                          <button className="text-slate-300 hover:text-red-500"><X size={12}/></button>
                                       </div>
                                    ))}
                                    {(scores[kr.id]?.evidence || []).length === 0 && (
                                       <button onClick={() => handleAttach(kr.id)} className="w-full border-2 border-dashed border-slate-100 rounded-2xl py-6 flex flex-col items-center justify-center text-slate-300 hover:text-primary hover:border-primary/30 transition-all group/up">
                                          <Upload size={18} className="mb-1 group-hover/up:scale-110 transition-transform" />
                                          <span className="text-[9px] font-black uppercase tracking-widest">Drop Artifacts Here</span>
                                       </button>
                                    )}
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                   ))}

                   <div className="flex items-center justify-between pt-12">
                      <button 
                        disabled={activeObjIndex === 0}
                        onClick={() => setActiveObjIndex(activeObjIndex - 1)}
                        className="flex items-center space-x-2 px-8 py-4 border border-slate-200 bg-white text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all disabled:opacity-30 shadow-sm"
                      >
                         <ChevronLeft size={16} />
                         <span>Previous Pillar</span>
                      </button>
                      <button 
                        disabled={activeObjIndex === objectives.length - 1}
                        onClick={() => setActiveObjIndex(activeObjIndex + 1)}
                        className="flex items-center space-x-2 px-12 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30"
                      >
                         <span>Next Strategic Anchor</span>
                         <ChevronRight size={16} />
                      </button>
                   </div>
                </div>
             </div>
          </main>
       </div>
    </div>
  );
};

/**
 * Dynamic Scoring Input Component
 */
const KRScoreInput = ({ type, value, onChange }: { type: string, value: number, onChange: (v: number) => void }) => {
  if (type === 'star') {
    return (
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4, 5].map(s => (
          <button key={s} onClick={() => onChange(s * 20)} className={`p-1 transition-all ${value >= s * 20 ? 'text-amber-500' : 'text-slate-200 hover:text-amber-200'}`}>
            <Star size={28} fill={value >= s * 20 ? 'currentColor' : 'none'} />
          </button>
        ))}
      </div>
    );
  }

  if (type === '5-scale') {
    return (
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map(s => (
          <button key={s} onClick={() => onChange(s * 20)} className={`h-12 rounded-xl text-[10px] font-black transition-all border-2 ${value === s * 20 ? 'bg-primary border-primary text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-primary/30'}`}>
            {s}
          </button>
        ))}
      </div>
    );
  }

  if (type === 'percentage' || type === 'numeric') {
    return (
      <div className="relative group">
         <input 
            type="number" 
            value={value || ''} 
            onChange={(e) => onChange(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
            placeholder="Score..."
            className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black text-2xl outline-none focus:ring-4 focus:ring-primary/5 transition-all shadow-inner" 
         />
         <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-black text-xl">%</span>
      </div>
    );
  }

  return null;
};

const TakeAppraisalWorkspaceOld = ({ onClose, objectives }: any) => {
  return (
    <div className="fixed inset-0 z-[250] bg-slate-50/95 backdrop-blur-xl flex flex-col p-20 items-center justify-center">
       <div className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-widest">Appraisal Workspace active</div>
       <button onClick={onClose} className="px-10 py-3 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-2xl">Return to Dashboard</button>
    </div>
  );
};

export default AppraisalsPage;