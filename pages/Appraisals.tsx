import React, { useState, useMemo } from 'react';
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
  BarChart3
} from 'lucide-react';
import { UserRole } from '../types';
import { GoogleGenAI } from "@google/genai";

// --- MOCK DATA ---

const MOCK_FEEDBACKS_RECEIVED = [
  { id: 'fb1', from: 'Marcus Vane', role: 'Manager', relationship: 'Superior', date: 'Oct 12, 2024', content: 'Excellent work on the v4 release cycle. Your focus on system reliability helped the unit exceed our uptime targets significantly.', sentiment: 'Positive', avatar: 'https://picsum.photos/seed/marcus/100/100', attachments: [{ name: 'performance_summary_q3.pdf', size: '1.2MB' }] },
  { id: 'fb2', from: 'Sarah Chen', role: 'Sr. Product Manager', relationship: 'Peer', date: 'Oct 10, 2024', content: 'Alex is a great collaborator. They provided crucial feedback on the API specs that saved us weeks of refactoring.', sentiment: 'Positive', avatar: 'https://picsum.photos/seed/sarah/100/100', attachments: [] },
  { id: 'fb3', from: 'Elena Rossi', role: 'Product Designer', relationship: 'Peer', date: 'Oct 05, 2024', content: 'Strategic alignment on the design system migration could have been tighter. Looking for more proactive syncs in Q4.', sentiment: 'Neutral', avatar: 'https://picsum.photos/seed/elena/100/100', attachments: [{ name: 'design_sync_notes.docx', size: '450KB' }] },
];

const MOCK_FEEDBACK_REQUESTS = [
  { id: 'req1', from: 'Jordan Smith', role: 'Staff Engineer', relationship: 'Peer', date: 'Oct 15, 2024', content: 'Seeking technical feedback on the new load balancer implementation I proposed.', avatar: 'https://picsum.photos/seed/jordan/100/100' },
  { id: 'req2', from: 'David Wright', role: 'Security Lead', relationship: 'Superior', date: 'Oct 14, 2024', content: 'Requesting calibration on the recent security audit for the Core Platform.', avatar: 'https://picsum.photos/seed/david/100/100' },
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
        managerScore: 185,
        evidence: [{ id: 'e1', name: 'Latency_Metrics_Q3.pdf', type: 'file' }]
      },
      { 
        id: 'kr-2', 
        title: "Scale to 50k concurrent requests", 
        target: 50000, 
        current: 42000, 
        unit: 'req', 
        type: 'numeric', 
        selfScore: 42000, 
        selfComment: 'Cluster optimization handled the bulk of the traffic increase.',
        managerScore: 45000,
        evidence: []
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
        managerScore: 35,
        evidence: [{ id: 'e3', name: 'v3.5_Design_System_Figma', type: 'link' }]
      }
    ]
  },
];

const MOCK_TEAM_REPORTS = [
  { id: 'tr1', name: 'Marcus Vane', role: 'DevOps Lead', selfProgress: 100, managerProgress: null, status: 'Needs Review', avatar: 'https://picsum.photos/seed/marcus/100/100', okrCount: 3 },
  { id: 'tr2', name: 'Sarah Chen', role: 'Sr. Product Manager', selfProgress: 45, managerProgress: null, status: 'Draft', avatar: 'https://picsum.photos/seed/sarah/100/100', okrCount: 4 },
  { id: 'tr3', name: 'Jordan Smith', role: 'Staff Engineer', selfProgress: 100, managerProgress: 92, status: 'Completed', avatar: 'https://picsum.photos/seed/jordan/100/100', okrCount: 2 },
  { id: 'tr4', name: 'Lila Ray', role: 'Product Analyst', selfProgress: 100, managerProgress: 42, status: 'Completed', avatar: 'https://picsum.photos/seed/lila/100/100', okrCount: 5 },
  { id: 'tr5', name: 'David Wright', role: 'Security Lead', selfProgress: 15, managerProgress: null, status: 'Draft', avatar: 'https://picsum.photos/seed/david/100/100', okrCount: 3 },
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
  
  // New States for requested features
  const [isUploadScoreModalOpen, setIsUploadScoreModalOpen] = useState(false);
  const [viewingSummaryReport, setViewingSummaryReport] = useState<any>(null);

  // Modals & States
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isTakeAppraisalOpen, setIsTakeAppraisalOpen] = useState(false);
  const [isSigningModalOpen, setIsSigningModalOpen] = useState(false);
  const [respondingToRequest, setRespondingToRequest] = useState<any>(null);

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

  const isEmployee = role === UserRole.EMPLOYEE;

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
          <button 
            onClick={() => setViewingSummaryReport(null)} 
            className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all text-slate-500 shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight uppercase leading-none">Appraisal Summary View</h1>
            <p className="text-slate-500 text-sm mt-2">Comprehensive performance comparison for {viewingSummaryReport.name}</p>
          </div>
        </div>
        <AppraisalSummaryView report={viewingSummaryReport} objectives={INITIAL_MY_OBJECTIVES} />
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight uppercase leading-none">Appraisals & Performance</h1>
            <p className="text-slate-500 text-sm mt-2">Manage unified OKRs, RKT (Real-time KPIs), and multi-stage evaluations</p>
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

      {/* Tabs Navigation */}
      {!activeReviewReport && !activePeerReview && (
        <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-slate-200 w-fit shadow-sm overflow-x-auto no-scrollbar max-w-full">
          <TabButton active={activeTab === 'my'} onClick={() => setActiveTab('my')} icon={<Target size={14}/>} label="My Performance" />
          <TabButton active={activeTab === 'feedbacks'} onClick={() => setActiveTab('feedbacks')} icon={<MessageCircle size={14}/>} label="Feedbacks" />
          <TabButton active={activeTab === 'peer'} onClick={() => setActiveTab('peer')} icon={<Award size={14}/>} label="Peer Review" />
          {!isEmployee && <TabButton active={activeTab === 'team'} onClick={() => setActiveTab('team')} icon={<Users size={14}/>} label="Team Reviews" />}
        </div>
      )}

      {/* Tab Content: Feedbacks */}
      {activeTab === 'feedbacks' && (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden animate-in fade-in flex flex-col min-h-[600px]">
          <div className="p-8 border-b border-slate-100 bg-slate-50/50 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-slate-200 shadow-sm w-fit">
                <button 
                  onClick={() => { setFeedbackSubTab('received'); setFeedbackSearch(''); }}
                  className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${feedbackSubTab === 'received' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  Feedback Received
                </button>
                <button 
                  onClick={() => { setFeedbackSubTab('requests'); setFeedbackSearch(''); }}
                  className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${feedbackSubTab === 'requests' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
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
              <h3 className="font-bold text-slate-900 tracking-tight uppercase">
                {feedbackSubTab === 'received' ? 'INSTITUTIONAL INPUT ARCHIVE' : 'INCOMING FEEDBACK PIPELINE'}
              </h3>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">
                {feedbackSubTab === 'received' ? 'QUALITATIVE FEEDBACK RECEIVED FROM THE ORGANIZATION' : 'PROVIDE FEEDBACK TO PEERS, SUBORDINATES, AND SUPERIORS'}
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

      {activeTab === 'peer' && (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8 text-center py-20">
          <Award size={48} className="mx-auto text-slate-200 mb-4" />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Peer Review Module Active</p>
        </div>
      )}

      {activeTab === 'team' && !isEmployee && (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden animate-in fade-in">
          <div className="p-8 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 tracking-tight uppercase">Unit Calibration Queue</h3>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Process and calibrate completed appraisals from your direct reports</p>
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

      {isUploadScoreModalOpen && activeReviewReport && (
        <UploadFinalScoreModal 
          report={activeReviewReport} 
          onClose={() => {
            setIsUploadScoreModalOpen(false);
            setActiveReviewReport(null);
          }} 
        />
      )}

      {respondingToRequest && (
        <RespondToRequestModal 
          request={respondingToRequest} 
          onClose={() => setRespondingToRequest(null)} 
        />
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
 * Upload Final Score Modal with Supporting Artifacts
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
                <span className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-300 font-black text-2xl uppercase">%</span>
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
                <div 
                  onClick={handleFileUpload}
                  className="py-12 border-2 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-300 hover:text-indigo-600 hover:border-indigo-600/20 transition-all cursor-pointer bg-slate-50/50 group"
                >
                  <Upload size={32} className="mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Upload Supporting Evidence</p>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 bg-amber-50 border border-amber-100 rounded-[2rem] flex items-start space-x-4">
             <AlertCircle size={20} className="text-amber-600 mt-0.5 shrink-0" />
             <div>
                <p className="text-xs font-black text-amber-900 uppercase tracking-tight">Governance Override Notice</p>
                <p className="text-[10px] text-amber-700 leading-relaxed font-medium mt-1">
                   Submitting a final score will override all system-calculated OKR/KPI data. This score becomes the ultimate record for compensation and promotion cycles.
                </p>
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
         <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
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
               <p className="text-3xl font-black text-primary">{report.managerProgress}%</p>
            </div>
         </div>
      </div>

      {/* Main Content Grid */}
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
               <div className="flex items-center px-4 mb-4">
                  <div className="flex-1"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Key Result Vector</span></div>
                  <div className="w-48 text-center"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Self Rating</span></div>
                  <div className="w-48 text-center"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mgr Rating</span></div>
                  <div className="w-32 text-right"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Delta</span></div>
               </div>
               
               <div className="space-y-4">
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
          </div>
        ))}
      </div>

      {/* Narrative Summary Analysis */}
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
               "Performance calibration for <span className="text-white font-bold">{report.name}</span> across the Q3 horizon demonstrates a 12% positive delta between self-appraisal and line-manager assessment. Strong strategic alignment in Engineering throughput (v4.0 engine refactor) has significantly de-risked the v4 GA roadmap. Sentiment signal from peer feedback remains top-decile."
            </p>
            <div className="flex items-center space-x-4">
               <button className="px-8 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Download Signed Analysis</button>
               <button className="px-8 py-3 text-[10px] font-black text-slate-400 hover:text-white transition-colors uppercase tracking-widest">Verify Assessment Signature</button>
            </div>
         </div>
      </div>
    </div>
  );
};

const TeamReviewItem = ({ name, role, selfProgress, managerProgress, status, avatar, okrCount, onReview, onViewSummary, onUploadScore }: any) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isCompleted = status === 'Completed';
  const performanceThreshold = 50; 
  const isLowPerformer = managerProgress !== null && managerProgress < performanceThreshold;

  return (
    <div className="p-8 flex items-center justify-between hover:bg-slate-50/30 transition-all group relative">
      <div className="flex items-center space-x-6">
        <img src={avatar} alt={name} className="w-14 h-14 rounded-2xl border-2 border-white shadow-xl group-hover:scale-105 transition-all object-cover" />
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
        <div className="flex items-center space-x-8">
           <div className="text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Self-Appraisal</p>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-50">
                  <div className={`h-full ${selfProgress === 100 ? 'bg-primary shadow-[0_0_10px_rgba(22,89,230,0.5)]' : 'bg-slate-300'}`} style={{ width: `${selfProgress}%` }}></div>
                </div>
                <span className="text-[11px] font-black text-slate-900">{selfProgress}%</span>
              </div>
           </div>

           {isCompleted && (
             <div className="text-right border-l border-slate-100 pl-8">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Manager Appraisal</p>
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-50">
                    <div className={`h-full ${managerProgress >= 90 ? 'bg-green-500' : managerProgress >= 50 ? 'bg-indigo-500' : 'bg-red-500'}`} style={{ width: `${managerProgress}%` }}></div>
                  </div>
                  <span className="text-[11px] font-black text-slate-900">{managerProgress}%</span>
                </div>
             </div>
           )}
        </div>

        <div className="relative">
          {!isCompleted ? (
            <button 
              onClick={(e) => { e.stopPropagation(); onReview(); }}
              className="px-10 py-3 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Review
            </button>
          ) : (
            <>
              <button 
                onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
                className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-primary rounded-xl hover:bg-slate-50 transition-all shadow-sm"
              >
                <MoreVertical size={20} />
              </button>
              
              {isMenuOpen && (
                <>
                  <div className="fixed inset-0 z-[10]" onClick={() => setIsMenuOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl z-20 p-2 animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); onViewSummary(); }}
                      className="w-full flex items-center space-x-3 px-3 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-all text-left"
                    >
                       <Eye size={16} className="text-slate-400" />
                       <span>View Appraisal Summary</span>
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); onUploadScore(); }}
                      className="w-full flex items-center space-x-3 px-3 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-all text-left"
                    >
                       <Upload size={16} className="text-slate-400" />
                       <span>Upload Final Score</span>
                    </button>
                    {isLowPerformer && (
                       <button className="w-full flex items-center space-x-3 px-3 py-3 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all text-left border-t border-slate-50 mt-1">
                          <ShieldAlert size={16} />
                          <span>Initiate Performance Plan</span>
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
        {attachments && attachments.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {attachments.map((file: any, i: number) => (
              <div key={i} className="flex items-center space-x-2 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-500 hover:text-primary hover:border-primary/20 transition-all cursor-pointer group/file shadow-sm">
                <Paperclip size={12} className="text-slate-300 group-hover/file:text-primary transition-colors" />
                <span>{file.name}</span>
                <span className="text-[8px] opacity-40 font-bold">({file.size})</span>
              </div>
            ))}
          </div>
        )}
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
          <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors uppercase tracking-tight">{from}</h4>
          <span className="text-[9px] font-black uppercase text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{relationship}</span>
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{role} • Requested {date}</p>
        <p className="text-xs text-slate-500 mt-2 italic line-clamp-1 leading-relaxed">"{content}"</p>
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <button 
        onClick={onRespond}
        className="px-8 py-3 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center space-x-2"
      >
        <PenTool size={16} />
        <span>Give Feedback</span>
      </button>
    </div>
  </div>
);

const RespondToRequestModal = ({ request, onClose }: any) => {
  const [feedback, setFeedback] = useState('');
  const [files, setFiles] = useState<any[]>([]);
  const [isAiDrafting, setIsAiDrafting] = useState(false);

  const handleFileUpload = () => {
    const newFile = { id: Date.now(), name: `evidence_${Date.now()}.pdf`, size: '1.4MB' };
    setFiles([...files, newFile]);
  };

  const handleAiDraft = async () => {
    setIsAiDrafting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Draft professional performance feedback for ${request.from}, who is my ${request.relationship} and works as a ${request.role}. Focus on strategic impact and collaboration based on common engineering/product patterns.`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { systemInstruction: 'You are a professional HR performance context assistant. Provide concise, data-driven, and supportive feedback drafts.' }
      });
      setFeedback(response.text || '');
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiDrafting(false);
    }
  };

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
        <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar bg-white">
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Calibration Narrative</label>
              <button onClick={handleAiDraft} disabled={isAiDrafting} className="flex items-center space-x-1.5 text-primary hover:underline text-[9px] font-black uppercase">
                {isAiDrafting ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                <span>AI Context Draft</span>
              </button>
            </div>
            <textarea 
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              placeholder="Document specific behaviors, achievements, and focus areas..."
              className="w-full bg-slate-50 border-none rounded-[2rem] p-8 text-sm font-medium outline-none focus:ring-4 focus:ring-primary/5 transition-all h-56 resize-none shadow-inner" 
            />
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between px-1">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Supporting Artifacts (Optional)</label>
              <button 
                onClick={handleFileUpload}
                className="flex items-center space-x-1.5 text-xs font-bold text-primary hover:underline"
              >
                <Plus size={14} />
                <span>Add Evidence</span>
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3">
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
                <div 
                  onClick={handleFileUpload}
                  className="py-12 border-2 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-300 hover:text-primary hover:border-primary/20 transition-all cursor-pointer bg-slate-50/50 group"
                >
                  <Upload size={32} className="mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Upload Files / Performance Evidence</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="p-10 border-t border-slate-100 bg-slate-50 flex items-center justify-end space-x-6">
           <button onClick={onClose} className="px-8 py-3 text-sm font-black text-slate-400 hover:text-slate-800 transition-colors uppercase tracking-widest">Discard</button>
           <button 
            onClick={onClose} 
            disabled={!feedback}
            className="px-14 py-4 bg-primary text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30"
           >
             Submit Response
           </button>
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
  <div className="space-y-4">
    {objectives.map(obj => (
      <div key={obj.id} className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm space-y-6">
        <h4 className="text-xl font-bold text-slate-900 uppercase">{obj.title}</h4>
        <div className="text-2xl font-black text-slate-900">{obj.progress}% Attainment</div>
      </div>
    ))}
  </div>
);

const KPIDetailView = ({ objectives }: { objectives: any[] }) => (
  <div className="space-y-4">
    {objectives.map(obj => (
      <div key={obj.id} className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm flex items-center justify-between">
        <h4 className="text-lg font-bold text-slate-900 uppercase">{obj.title}</h4>
        <div className="text-xl font-black text-slate-800">{obj.progress}% Velocity</div>
      </div>
    ))}
  </div>
);

const IDPDetailView = ({ goals }: { goals: any[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {goals.map(goal => (
      <div key={goal.id} className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
        <h4 className="font-bold text-slate-900 uppercase">{goal.title}</h4>
        <div className="text-slate-900 font-black mt-2">{goal.progress}%</div>
      </div>
    ))}
  </div>
);

const PersistentAcknowledgmentSection = ({ signOff, onSign }: { signOff: any, onSign: () => void }) => (
  <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col h-fit">
     <div className="p-6 bg-[#6366F1] text-white flex items-center space-x-3">
        <Fingerprint size={24} />
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest leading-none">INSTITUTIONAL SIGN-OFF</h3>
          <p className="text-[9px] opacity-70 font-bold uppercase mt-1 tracking-widest">COMPLIANCE LEDGER ARCHIVE</p>
        </div>
     </div>
     <div className="p-8 space-y-6">
        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{signOff.name}</h4>
        <button onClick={onSign} className="w-full py-4 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">SIGN & VERIFY CYCLE</button>
     </div>
  </div>
);

const CycleSignatureModal = ({ cycleName, onClose, onConfirm }: any) => (
  <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
     <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl p-12 text-center">
        <h3 className="text-2xl font-black mb-8 uppercase tracking-tight">Institutional Signature for {cycleName}</h3>
        <button onClick={onClose} className="px-10 py-3 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-xs">Verify & Close</button>
     </div>
  </div>
);

const RequestFeedbackModal = ({ onClose, objectives }: any) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] w-full max-w-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-white">
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
        <div className="p-8 text-center text-slate-400">Request UI Logic goes here...</div>
        <div className="p-8 bg-slate-50 flex justify-end"><button onClick={onClose} className="px-10 py-3 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-xs">Close</button></div>
      </div>
    </div>
  );
};

const TakeAppraisalWorkspace = ({ onClose, objectives }: any) => {
  return (
    <div className="fixed inset-0 z-[250] bg-slate-50/95 backdrop-blur-xl flex flex-col p-20 items-center justify-center">
       <div className="text-2xl font-black text-slate-900 mb-8 uppercase">Appraisal Workspace active</div>
       <button onClick={onClose} className="px-10 py-3 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest text-xs">Return to Dashboard</button>
    </div>
  );
};

export default AppraisalsPage;