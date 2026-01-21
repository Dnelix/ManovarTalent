import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Scale, 
  CalendarClock, 
  Brain, 
  Layers, 
  Users2, 
  Save, 
  History, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Plus, 
  ChevronRight,
  ShieldCheck,
  Settings2,
  Zap,
  Lock,
  X,
  FileText,
  Rocket, 
  LineChart,
  UserCog,
  Search,
  Filter,
  MoreHorizontal,
  MoreVertical,
  Trash2,
  Download,
  Target,
  Trophy,
  Activity,
  ArrowRight,
  Clock,
  Briefcase,
  Copy,
  Calendar,
  ChevronDown,
  Layout,
  Check,
  BarChart3,
  UserPlus,
  ArrowLeft,
  Gavel,
  Shield,
  FileCheck2,
  Loader2,
  Fingerprint,
  MessageSquare,
  AlertCircle,
  RefreshCw,
  Sparkles,
  ClipboardList,
  Palette,
  Flag,
  ListTodo,
  ShieldAlert as PipIcon,
  PieChart,
  CalendarDays,
  Target as TargetIcon,
  SlidersHorizontal,
  Waypoints,
  GitMerge,
  UserCheck,
  MoveDown
} from 'lucide-react';

type CycleStatus = 'Upcoming' | 'Active' | 'Closed';

interface PerformanceCycle {
  id: string;
  name: string;
  status: CycleStatus;
  start: string;
  end: string;
  participants: number;
  template: string;
  progress?: number; 
  completionRate?: number; 
  description: string;
}

interface TemplateComponent {
  id: string;
  name: string;
  weight: number;
  type: 'OKR' | 'KPI' | 'Competency' | 'Feedback';
}

interface RatingTemplate {
  id: string;
  name: string;
  desc: string;
  usage: string;
  components: string[];
  logicDetails?: TemplateComponent[];
}

interface RatingBucket {
  id: string;
  score: string;
  label: string;
  color: string;
}

interface PIPTemplate {
  id: string;
  name: string;
  desc: string;
  sections: { id: string; type: string; label: string; required: boolean }[];
}

interface WorkflowStep {
  id: string;
  label: string;
  actor: string;
  duration: number;
  type: 'Input' | 'Review' | 'Approval' | 'Acknowledgment';
  isMandatory: boolean;
}

interface ReviewWorkflow {
  id: string;
  name: string;
  desc: string;
  isDefault: boolean;
  steps: WorkflowStep[];
}

const INITIAL_PIP_TEMPLATES: PIPTemplate[] = [
  {
    id: 'pip1',
    name: 'Standard Operational PIP',
    desc: 'Focuses on core throughput, reliability, and behavioral alignment.',
    sections: [
      { id: 's1', type: 'gaps', label: 'Performance Gaps Identified', required: true },
      { id: 's2', type: 'smart', label: '30-60-90 Day SMART Goals', required: true },
      { id: 's3', type: 'actions', label: 'Required Action Items', required: true },
      { id: 's4', type: 'resources', label: 'Institutional Support Resources', required: false }
    ]
  }
];

const INITIAL_WORKFLOWS: ReviewWorkflow[] = [
  {
    id: 'w1',
    name: 'Standard Individual Contributor',
    desc: 'The default three-stage loop for standard staff and senior engineers.',
    isDefault: true,
    steps: [
      { id: 'ws1', label: 'Self-Appraisal Phase', actor: 'Employee', duration: 7, type: 'Input', isMandatory: true },
      { id: 'ws2', label: 'Line Manager Review', actor: 'Manager', duration: 10, type: 'Review', isMandatory: true },
      { id: 'ws3', label: 'Institutional Sign-off', actor: 'Employee', duration: 3, type: 'Acknowledgment', isMandatory: true },
    ]
  },
  {
    id: 'w2',
    name: 'Executive & Strategic Unit',
    desc: 'Enhanced calibration for leadership tiers requiring multi-stakeholder approval.',
    isDefault: false,
    steps: [
      { id: 'ws4', label: 'Self-Appraisal', actor: 'Employee', duration: 5, type: 'Input', isMandatory: true },
      { id: 'ws5', label: 'Manager Alignment', actor: 'Manager', duration: 7, type: 'Review', isMandatory: true },
      { id: 'ws6', label: 'HR Calibration Audit', actor: 'HR View', duration: 5, type: 'Approval', isMandatory: true },
      { id: 'ws7', label: 'Board Level Visibility', actor: 'Executives', duration: 5, type: 'Review', isMandatory: false },
      { id: 'ws8', label: 'Final Acknowledgment', actor: 'Employee', duration: 3, type: 'Acknowledgment', isMandatory: true },
    ]
  }
];

const INITIAL_PERFORMANCE_CYCLES: PerformanceCycle[] = [
  { 
    id: 'c1', 
    name: 'FY24 Year-End Calibration', 
    status: 'Upcoming', 
    start: 'Dec 01, 2024', 
    end: 'Jan 15, 2025', 
    participants: 182, 
    template: 'Standard Executive',
    description: 'Final institutional performance review for FY24 focusing on strategic OKR attainment and bonus calibration.'
  },
  { 
    id: 'c2', 
    name: 'Q4 Mid-Quarter Pulse', 
    status: 'Active', 
    start: 'Oct 15, 2024', 
    end: 'Oct 30, 2024', 
    participants: 450, 
    template: 'Velocity Pulse',
    progress: 64,
    description: 'Bi-quarterly check-in to ensure execution alignment and identify throughput blockers across all units.'
  },
  { 
    id: 'c3', 
    name: 'Q3 Strategic Review', 
    status: 'Closed', 
    start: 'Jul 01, 2024', 
    end: 'Aug 15, 2024', 
    participants: 442, 
    template: 'Standard Executive',
    completionRate: 98,
    description: 'Quarterly review cycle covering the summer performance horizon. Results finalized and archives locked.'
  },
];

const INITIAL_RATING_TEMPLATES: RatingTemplate[] = [
  { 
    id: 't1', 
    name: 'Standard Executive (5-Point)', 
    desc: 'Balanced OKR/Behavioral model used for general management and individual leadership.', 
    usage: '85%', 
    components: ['OKRs', 'Competencies', 'Peer Feedback'],
    logicDetails: [
      { id: 'l1', name: 'Strategic Objectives', weight: 40, type: 'OKR' },
      { id: 'l2', name: 'Core Competencies', weight: 30, type: 'Competency' },
      { id: 'l3', name: '360° Peer Signal', weight: 30, type: 'Feedback' },
    ]
  },
  { 
    id: 't2', 
    name: 'Sales Attainment (100-Point)', 
    desc: 'Strict quantitative metric focus for revenue-generating roles.', 
    usage: '12%', 
    components: ['KPIs', 'Quota Metrics'],
    logicDetails: [
      { id: 'l4', name: 'Quota Attainment', weight: 70, type: 'KPI' },
      { id: 'l5', name: 'Pipeline Velocity', weight: 30, type: 'KPI' },
    ]
  },
  { 
    id: 't3', 
    name: 'Binary Engineering Pass/Fail', 
    desc: 'Critical systems performance model focusing on uptime and reliability SLAs.', 
    usage: '3%', 
    components: ['System Stability', 'Ticket SLAs'],
    logicDetails: [
      { id: 'l6', name: 'Uptime (SLO)', weight: 80, type: 'KPI' },
      { id: 'l7', name: 'Bug Resolution', weight: 20, type: 'KPI' },
    ]
  },
];

const INITIAL_BUCKETS: Record<string, RatingBucket[]> = {
  '5-Point Standard': [
    { id: 'b1', score: "5.0", label: "Exceptional Performance", color: "bg-primary" },
    { id: 'b2', score: "4.0", label: "Exceeds Expectations", color: "bg-secondary" },
    { id: 'b3', score: "3.0", label: "Consistently Meets", color: "bg-green-500" },
    { id: 'b4', score: "2.0", label: "Needs Improvement", color: "bg-amber-500" },
    { id: 'b5', score: "1.0", label: "Unsatisfactory", color: "bg-red-500" },
  ],
  '10-Point Velocity': [
    { id: 'b6', score: "10", label: "Hyper-Velocity", color: "bg-primary" },
    { id: 'b7', score: "5", label: "Standard Velocity", color: "bg-green-500" },
    { id: 'b8', score: "1", label: "Stagnant", color: "bg-red-500" },
  ],
  'Custom Likert': [
    { id: 'b9', score: "S", label: "Strong", color: "bg-primary" },
    { id: 'b10', score: "M", label: "Meets", color: "bg-green-500" },
    { id: 'b11', score: "W", label: "Weak", color: "bg-amber-500" },
  ]
};

const PolicyStudioPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cycles' | 'templates' | 'scales' | 'pip' | 'workflows' | 'governance'>('cycles');
  const [isDirty, setIsDirty] = useState(false);
  const [isCycleModalOpen, setIsCycleModalOpen] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState<PerformanceCycle | null>(null);
  const [cycles, setCycles] = useState<PerformanceCycle[]>(INITIAL_PERFORMANCE_CYCLES);
  const [templates, setTemplates] = useState<RatingTemplate[]>(INITIAL_RATING_TEMPLATES);
  const [pipTemplates, setPipTemplates] = useState<PIPTemplate[]>(INITIAL_PIP_TEMPLATES);
  const [workflows, setWorkflows] = useState<ReviewWorkflow[]>(INITIAL_WORKFLOWS);

  // New Flows States
  const [isAuditDrawerOpen, setIsAuditDrawerOpen] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<RatingTemplate | null>(null);
  const [isBuildTemplateModalOpen, setIsBuildTemplateModalOpen] = useState(false);
  const [isPipModalOpen, setIsPipModalOpen] = useState(false);
  const [isWorkflowDesignerOpen, setIsWorkflowDesignerOpen] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<ReviewWorkflow | null>(null);

  // Rating Scale States
  const [selectedScale, setSelectedScale] = useState('5-Point Standard');
  const [scaleBuckets, setScaleBuckets] = useState(INITIAL_BUCKETS);
  const [isAddBucketModalOpen, setIsAddBucketModalOpen] = useState(false);

  const handleAddCycle = (newCycle: PerformanceCycle) => {
    setCycles([newCycle, ...cycles]);
    setIsCycleModalOpen(false);
    setIsDirty(true);
  };

  const handleAddTemplate = (newTemplate: RatingTemplate) => {
    setTemplates([...templates, newTemplate]);
    setIsBuildTemplateModalOpen(false);
    setIsDirty(true);
  };

  const handleAddPipTemplate = (newPip: PIPTemplate) => {
    setPipTemplates([...pipTemplates, newPip]);
    setIsPipModalOpen(false);
    setIsDirty(true);
  };

  const handleAddWorkflow = (newWorkflow: ReviewWorkflow) => {
    setWorkflows([...workflows, newWorkflow]);
    setIsWorkflowDesignerOpen(false);
    setIsDirty(true);
  };

  const handleUpdateWorkflow = (updated: ReviewWorkflow) => {
    setWorkflows(workflows.map(w => w.id === updated.id ? updated : w));
    setEditingWorkflow(null);
    setIsDirty(true);
  };

  const handleAddBucket = (newBucket: Omit<RatingBucket, 'id'>) => {
    const bucketWithId = { ...newBucket, id: `b-${Date.now()}` };
    setScaleBuckets(prev => ({
      ...prev,
      [selectedScale]: [bucketWithId, ...(prev[selectedScale] || [])]
    }));
    setIsAddBucketModalOpen(false);
    setIsDirty(true);
  };

  const handleRemoveBucket = (id: string) => {
    setScaleBuckets(prev => ({
      ...prev,
      [selectedScale]: prev[selectedScale].filter(b => b.id !== id)
    }));
    setIsDirty(true);
  };

  const handleDeploy = () => {
    setIsDeployModalOpen(false);
    setIsDirty(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">Policy & Governance Studio</h1>
          <p className="text-slate-500 text-sm mt-1">Configure institutional performance logic, cycles, and rating frameworks</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsAuditDrawerOpen(true)}
            className="flex items-center space-x-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
          >
            <History size={16} />
            <span>Policy Audit</span>
          </button>
          <button 
            disabled={!isDirty}
            onClick={() => setIsDeployModalOpen(true)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg ${isDirty ? 'bg-primary text-white shadow-primary/20 hover:scale-[1.02]' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
          >
            <Save size={16} />
            <span>Deploy Framework</span>
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-1 bg-white border border-slate-200 p-1 rounded-xl w-fit shadow-sm overflow-x-auto no-scrollbar">
        <TabButton active={activeTab === 'cycles'} onClick={() => setActiveTab('cycles')} icon={<CalendarClock size={14}/>} label="Cycle Scheduler" />
        <TabButton active={activeTab === 'templates'} onClick={() => setActiveTab('templates')} icon={<Layout size={14}/>} label="Template Designer" />
        <TabButton active={activeTab === 'scales'} onClick={() => setActiveTab('scales')} icon={<Scale size={14}/>} label="Rating Scales" />
        <TabButton active={activeTab === 'pip'} onClick={() => setActiveTab('pip')} icon={<PipIcon size={14}/>} label="PIP Frameworks" />
        <TabButton active={activeTab === 'workflows'} onClick={() => setActiveTab('workflows')} icon={<Waypoints size={14}/>} label="Workflow Engine" />
        <TabButton active={activeTab === 'governance'} onClick={() => setActiveTab('governance')} icon={<ShieldCheck size={14}/>} label="AI Safety Hub" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          {activeTab === 'cycles' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-2">
              <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <SectionHeader title="Active & Planned Cycles" desc="Define performance windows, review deadlines, and participant pools." />
                  <button onClick={() => setIsCycleModalOpen(true)} className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg hover:scale-105 transition-all">
                    <Plus size={14} />
                    <span>Create New Cycle</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {cycles.map(cycle => (
                    <div key={cycle.id} onClick={() => setSelectedCycle(cycle)} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between group hover:bg-white hover:shadow-md transition-all cursor-pointer">
                      <div className="flex items-center space-x-6">
                        <div className={`p-3 rounded-xl ${cycle.status === 'Active' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-slate-400 border border-slate-100'} transition-all`}>
                          <Calendar size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{cycle.name}</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Logic: {cycle.template} • {cycle.participants} Enrollments</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-8">
                         <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Duration</p>
                            <span className="text-xs font-bold text-slate-700">{cycle.start} — {cycle.end}</span>
                         </div>
                         <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                           cycle.status === 'Active' ? 'bg-green-100 text-green-700 shadow-sm border border-green-200' : 
                           cycle.status === 'Closed' ? 'bg-slate-200 text-slate-600' :
                           'bg-blue-100 text-blue-700 border border-blue-200'
                         }`}>{cycle.status}</span>
                         <button className="p-2 text-slate-300 group-hover:text-primary transition-all"><Settings2 size={18} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-2">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {templates.map(template => (
                    <div key={template.id} className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm hover:border-primary/20 transition-all group flex flex-col h-full border-b-4 border-b-slate-100 hover:border-b-primary/40">
                       <div className="flex items-start justify-between mb-6">
                          <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-primary/5 group-hover:text-primary transition-colors shadow-inner">
                             <FileText size={24} />
                          </div>
                          <div className="flex items-center space-x-1">
                             <button className="p-2 text-slate-300 hover:text-slate-600"><Copy size={16} /></button>
                             <button className="p-2 text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
                          </div>
                       </div>
                       <h4 className="text-lg font-bold text-slate-900 mb-2 uppercase tracking-tight">{template.name}</h4>
                       <p className="text-xs text-slate-500 leading-relaxed font-medium mb-6 flex-1 italic">"{template.desc}"</p>
                       
                       <div className="space-y-4 pt-6 border-t border-slate-50">
                          <div className="flex flex-wrap gap-2">
                             {template.components.map(comp => (
                               <span key={comp} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[8px] font-black uppercase tracking-widest">{comp}</span>
                             ))}
                          </div>
                          <button onClick={() => setEditingTemplate(template)} className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all shadow-lg">Configure Scoring Logic</button>
                       </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => setIsBuildTemplateModalOpen(true)}
                    className="border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-all bg-slate-50/30 group min-h-[300px]"
                  >
                     <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Plus size={24} /></div>
                     <span className="text-[10px] font-black uppercase tracking-[0.2em]">Build Custom Template</span>
                  </button>
               </div>
            </div>
          )}

          {activeTab === 'scales' && (
             <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm animate-in slide-in-from-bottom-2 space-y-10">
                <SectionHeader title="Global Rating Engine" desc="Configure numeric or qualitative scales used across all appraisal templates." />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <ScaleCard label="Standard 5-Point" active={selectedScale === '5-Point Standard'} onClick={() => {setSelectedScale('5-Point Standard');}} points={['1', '2', '3', '4', '5']} />
                   <ScaleCard label="10-Point Velocity" active={selectedScale === '10-Point Velocity'} onClick={() => {setSelectedScale('10-Point Velocity');}} points={['1', '...', '10']} />
                   <ScaleCard label="Custom Likert" active={selectedScale === 'Custom Likert'} onClick={() => {setSelectedScale('Custom Likert');}} points={['Weak', 'Meets', 'Strong']} />
                </div>

                <div className="p-8 bg-slate-50 border border-slate-100 rounded-3xl space-y-8 shadow-inner">
                   <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Label Configuration: {selectedScale}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{scaleBuckets[selectedScale]?.length || 0} Levels Defined</p>
                   </div>
                   <div className="space-y-4">
                      {scaleBuckets[selectedScale]?.map((bucket) => (
                         <LabelRow 
                            key={bucket.id}
                            score={bucket.score} 
                            label={bucket.label} 
                            color={bucket.color} 
                            onDelete={() => handleRemoveBucket(bucket.id)}
                         />
                      ))}
                   </div>
                   <button 
                    onClick={() => setIsAddBucketModalOpen(true)}
                    className="text-xs font-bold text-primary flex items-center space-x-2 hover:underline transition-all group p-2 bg-white rounded-xl border border-slate-200 shadow-sm w-fit"
                   >
                     <Plus size={14} className="group-hover:rotate-90 transition-transform" /> 
                     <span>Add Achievement Bucket</span>
                   </button>
                </div>
             </div>
          )}

          {activeTab === 'pip' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-2">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pipTemplates.map(template => (
                    <div key={template.id} className="bg-white border-2 border-indigo-100 p-8 rounded-3xl shadow-sm hover:border-indigo-400 transition-all group flex flex-col h-full ring-4 ring-indigo-50/30">
                       <div className="flex items-start justify-between mb-6">
                          <div className="p-4 bg-indigo-50 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                             <PipIcon size={24} className="text-indigo-600 group-hover:text-white" />
                          </div>
                          <div className="flex items-center space-x-1 text-slate-300">
                             <button className="p-2 hover:text-indigo-600"><Copy size={16} /></button>
                             <button className="p-2 hover:text-red-500"><Trash2 size={16} /></button>
                          </div>
                       </div>
                       <h4 className="text-lg font-bold text-slate-900 mb-2 uppercase tracking-tight">{template.name}</h4>
                       <p className="text-xs text-slate-500 leading-relaxed font-medium mb-6 flex-1 italic">"{template.desc}"</p>
                       
                       <div className="space-y-4 pt-6 border-t border-indigo-50">
                          <div className="flex flex-wrap gap-2">
                             {template.sections.map(sec => (
                               <span key={sec.id} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[8px] font-black uppercase tracking-widest">{sec.type}</span>
                             ))}
                          </div>
                          <button className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-900 transition-all shadow-lg">Manage PIP Framework</button>
                       </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => setIsPipModalOpen(true)}
                    className="border-2 border-dashed border-indigo-200 rounded-3xl p-8 flex flex-col items-center justify-center text-indigo-400 hover:border-indigo-600 hover:text-indigo-600 transition-all bg-indigo-50/10 group min-h-[300px]"
                  >
                     <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ring-4 ring-indigo-50"><Plus size={24} /></div>
                     <span className="text-[10px] font-black uppercase tracking-[0.2em]">Define Institutional PIP Template</span>
                  </button>
               </div>
            </div>
          )}

          {activeTab === 'workflows' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-2">
               <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                     <SectionHeader title="Workflow Engine" desc="Design custom appraisal approval and review pathways for different business units." />
                     <button 
                      onClick={() => setIsWorkflowDesignerOpen(true)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg hover:bg-indigo-700 transition-all"
                     >
                        <GitMerge size={14} />
                        <span>Define Workflow</span>
                     </button>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                     {workflows.map(workflow => (
                        <div key={workflow.id} className="bg-slate-50 border border-slate-100 rounded-[2rem] p-8 hover:bg-white hover:shadow-xl hover:border-indigo-100 transition-all group">
                           <div className="flex justify-between items-start mb-8">
                              <div className="flex items-center space-x-4">
                                 <div className={`p-3 rounded-2xl ${workflow.isDefault ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-400 border border-slate-100 shadow-sm'}`}>
                                    <Waypoints size={20} />
                                 </div>
                                 <div>
                                    <div className="flex items-center space-x-2 mb-1">
                                       <h4 className="text-lg font-bold text-slate-900 tracking-tight">{workflow.name}</h4>
                                       {workflow.isDefault && <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[8px] font-black uppercase tracking-widest">Default</span>}
                                    </div>
                                    <p className="text-xs text-slate-500 italic">"{workflow.desc}"</p>
                                 </div>
                              </div>
                              <button 
                                onClick={() => setEditingWorkflow(workflow)}
                                className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 rounded-xl transition-all shadow-sm"
                              >
                                 <Settings2 size={18}/>
                              </button>
                           </div>

                           <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between relative">
                              {workflow.steps.map((step, idx) => (
                                 <React.Fragment key={step.id}>
                                    <div className="flex flex-col items-center text-center space-y-3 relative z-10 w-full max-w-[140px]">
                                       <div className={`w-10 h-10 rounded-full border-4 flex items-center justify-center text-[10px] font-black transition-all ${
                                          step.type === 'Input' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                                          step.type === 'Review' ? 'bg-amber-50 border-amber-100 text-amber-600' :
                                          step.type === 'Approval' ? 'bg-purple-50 border-purple-100 text-purple-600' :
                                          'bg-green-50 border-green-100 text-green-600'
                                       }`}>
                                          {idx + 1}
                                       </div>
                                       <div>
                                          <p className="text-[10px] font-black text-slate-900 uppercase leading-none">{step.label}</p>
                                          <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 flex items-center justify-center">
                                             <UserCheck size={8} className="mr-1" /> {step.actor}
                                          </p>
                                       </div>
                                       <div className="px-2 py-0.5 bg-white border border-slate-100 rounded text-[8px] font-bold text-slate-400">
                                          {step.duration}d Window
                                       </div>
                                    </div>
                                    {idx < workflow.steps.length - 1 && (
                                       <div className="flex-1 h-[2px] bg-slate-100 mt-5 mx-2 hidden sm:block self-start relative">
                                          <div className="absolute right-0 -top-[3px] border-t-[4px] border-b-[4px] border-l-[6px] border-transparent border-l-slate-200" />
                                       </div>
                                    )}
                                 </React.Fragment>
                              ))}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'governance' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-8 animate-in slide-in-from-bottom-2">
              <SectionHeader title="AI Safety & Decision Guardrails" desc="Configure human-in-the-loop requirements for AI-assisted performance." />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <GovernanceToggle label="Auto-Drafting Narratives" desc="Allow AI to propose feedback text based on metrics." active onChange={() => setIsDirty(true)} />
                 <GovernanceToggle label="Bias Identification Engine" desc="Scan all manager feedback for linguistic bias." active onChange={() => setIsDirty(true)} />
                 <GovernanceToggle label="Raw Score Proposals" desc="Enable AI to suggest scores based on KR attainment." onChange={() => setIsDirty(true)} />
                 <GovernanceToggle label="Executive Calibration View" desc="Allow Cross-Unit comparisons for HR/Exex only." active onChange={() => setIsDirty(true)} />
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group border border-slate-800">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Brain size={80} className="text-primary" /></div>
              <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-8 border-l-2 border-primary pl-4">Governance Snapshot</h3>
              <div className="space-y-6">
                 <div>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2">Audit Compliance</p>
                    <div className="flex items-center space-x-2">
                       <ShieldCheck size={16} className="text-green-500" />
                       <span className="text-sm font-bold tracking-tight uppercase">Standard SOC-2 Active</span>
                    </div>
                 </div>
                 <div className="pt-6 border-t border-white/10">
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-3">Institutional Policy Health</p>
                    <div className="flex justify-between items-center text-xs font-black mb-2">
                       <span className="text-slate-400 uppercase tracking-tighter">Policy Coverage</span>
                       <span className="text-primary">92%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-primary w-[92%]" />
                    </div>
                 </div>
                 <button className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Download Protocol PDF</button>
              </div>
           </div>

           <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="font-bold text-[10px] text-slate-400 uppercase tracking-widest flex items-center"><History size={14} className="mr-2"/> System Change Log</h3>
                 <span className="text-[9px] font-bold text-primary hover:underline cursor-pointer uppercase" onClick={() => setIsAuditDrawerOpen(true)}>Audit All</span>
              </div>
              <div className="space-y-4">
                 <ChangeItem user="Alex R." action="Modified 5-Point Scale" time="2h ago" />
                 <ChangeItem user="HR System" action="Cycle FY24 Launch" time="5h ago" />
                 <ChangeItem user="Marcus V." action="New PIP Policy Created" time="1d ago" />
              </div>
           </div>
        </div>
      </div>

      {/* Workflow Designer Modal */}
      {(isWorkflowDesignerOpen || editingWorkflow) && (
         <WorkflowDesignerWizard 
            workflow={editingWorkflow} 
            onClose={() => { setIsWorkflowDesignerOpen(false); setEditingWorkflow(null); }} 
            onSave={editingWorkflow ? handleUpdateWorkflow : handleAddWorkflow} 
         />
      )}

      {/* Slide-over: Cycle Details */}
      {selectedCycle && (
        <CycleDetailDrawer cycle={selectedCycle} onClose={() => setSelectedCycle(null)} />
      )}

      {/* Modal: Create Cycle Wizard */}
      {isCycleModalOpen && (
        <CreateCycleWizard 
          onAdd={handleAddCycle} 
          onClose={() => setIsCycleModalOpen(false)} 
          templates={templates}
        />
      )}

      {/* Modal: Template Logic Designer */}
      {editingTemplate && (
        <TemplateLogicDesigner 
          template={editingTemplate} 
          onSave={(updated) => { 
            setTemplates(templates.map(t => t.id === editingTemplate.id ? { ...t, logicDetails: updated } : t));
            setEditingTemplate(null); 
            setIsDirty(true); 
          }} 
          onClose={() => setEditingTemplate(null)} 
        />
      )}

      {/* Modal: Build Template Wizard */}
      {isBuildTemplateModalOpen && (
        <BuildTemplateWizard onAdd={handleAddTemplate} onClose={() => setIsBuildTemplateModalOpen(false)} />
      )}

      {/* Modal: Build PIP Template Wizard */}
      {isPipModalOpen && (
        <BuildPipTemplateWizard onAdd={handleAddPipTemplate} onClose={() => setIsPipModalOpen(false)} />
      )}

      {/* Modal: Add Bucket Modal */}
      {isAddBucketModalOpen && (
        <AddBucketModal onAdd={handleAddBucket} onClose={() => setIsAddBucketModalOpen(false)} scaleName={selectedScale} />
      )}

      {/* Slide-over: Policy Audit Trail */}
      {isAuditDrawerOpen && (
        <PolicyAuditDrawer onClose={() => setIsAuditDrawerOpen(false)} />
      )}

      {/* Modal: Deployment Confirmation */}
      {isDeployModalOpen && (
        <DeployFrameworkModal 
          onConfirm={handleDeploy} 
          onClose={() => setIsDeployModalOpen(false)} 
        />
      )}
    </div>
  );
};

/**
 * Workflow Designer Wizard
 */
const WorkflowDesignerWizard = ({ workflow, onSave, onClose }: { workflow: ReviewWorkflow | null, onSave: (w: ReviewWorkflow) => void, onClose: () => void }) => {
   const [formData, setFormData] = useState({
      id: workflow?.id || `w-${Date.now()}`,
      name: workflow?.name || '',
      desc: workflow?.desc || '',
      isDefault: workflow?.isDefault || false,
      steps: workflow?.steps || [
         { id: '1', label: 'Self-Appraisal', actor: 'Employee', duration: 7, type: 'Input', isMandatory: true }
      ]
   });

   const addStep = () => {
      setFormData({
         ...formData,
         steps: [...formData.steps, { id: `ws-${Date.now()}`, label: 'New Stage', actor: 'Manager', duration: 5, type: 'Review', isMandatory: true }]
      });
   };

   const removeStep = (id: string) => {
      if (formData.steps.length === 1) return;
      setFormData({
         ...formData,
         steps: formData.steps.filter(s => s.id !== id)
      });
   };

   const updateStep = (id: string, field: string, value: any) => {
      setFormData({
         ...formData,
         steps: formData.steps.map(s => s.id === id ? { ...s, [field]: value } : s)
      });
   };

   return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
         <div className="bg-white rounded-[2.5rem] w-full max-w-4xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
               <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                     <Waypoints size={24}/>
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase leading-none">{workflow ? 'Edit Pipeline' : 'Workflow Architect'}</h3>
                     <p className="text-xs text-slate-500 mt-1">Institutional Review & Approval Logic</p>
                  </div>
               </div>
               <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><X size={24}/></button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12 border-b border-slate-100">
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Logic Designation</label>
                     <input 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        placeholder="e.g. Sales Unit Q3 Pipeline"
                        className="w-full border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-lg outline-none focus:border-indigo-600 transition-all shadow-inner"
                     />
                     <textarea 
                        value={formData.desc}
                        onChange={e => setFormData({...formData, desc: e.target.value})}
                        placeholder="Strategic context for this workflow..."
                        className="w-full border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm outline-none focus:border-indigo-600 transition-all shadow-inner resize-none h-24"
                     />
                  </div>
                  <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-4 opacity-10"><Brain size={60} className="text-indigo-400" /></div>
                     <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Architect Insight</h4>
                     <p className="text-xs text-slate-400 leading-relaxed font-medium italic">
                        "Workflows ensure compliance with SOC-2 standards by enforcing temporal locks and specific actor authorizations at each milestone."
                     </p>
                     <div className="mt-8 flex items-center space-x-3">
                        <input 
                           type="checkbox" 
                           id="isDefault" 
                           checked={formData.isDefault} 
                           onChange={e => setFormData({...formData, isDefault: e.target.checked})}
                           className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500" 
                        />
                        <label htmlFor="isDefault" className="text-[10px] font-black uppercase tracking-widest text-slate-300">Set as Global Default</label>
                     </div>
                  </div>
               </div>

               <div className="space-y-8">
                  <div className="flex items-center justify-between">
                     <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Pipeline Visualization ({formData.steps.length} Stages)</h4>
                     <button 
                        onClick={addStep}
                        className="text-xs font-bold text-indigo-600 flex items-center space-x-1.5 p-2 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-all"
                     >
                        <Plus size={14} />
                        <span>Inject Stage</span>
                     </button>
                  </div>

                  <div className="space-y-4">
                     {formData.steps.map((step, idx) => (
                        <div key={step.id} className="relative">
                           {idx > 0 && <div className="flex justify-center my-2 text-slate-200"><MoveDown size={20} /></div>}
                           <div className="p-6 bg-white border-2 border-slate-100 rounded-3xl flex flex-col md:flex-row items-center gap-6 group hover:border-indigo-600 transition-all shadow-sm">
                              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 font-black group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner shrink-0">
                                 {idx + 1}
                              </div>
                              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
                                 <div className="space-y-1.5">
                                    <label className="text-[8px] font-black text-slate-400 uppercase">Stage Label</label>
                                    <input 
                                       value={step.label}
                                       onChange={e => updateStep(step.id, 'label', e.target.value)}
                                       className="w-full bg-slate-50 border-none rounded-lg px-3 py-1.5 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-200"
                                    />
                                 </div>
                                 <div className="space-y-1.5">
                                    <label className="text-[8px] font-black text-slate-400 uppercase">Assignee Tier</label>
                                    <select 
                                       value={step.actor}
                                       onChange={e => updateStep(step.id, 'actor', e.target.value)}
                                       className="w-full bg-slate-50 border-none rounded-lg px-3 py-1.5 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-200"
                                    >
                                       <option>Employee</option>
                                       <option>Manager</option>
                                       <option>HR View</option>
                                       <option>Executives</option>
                                    </select>
                                 </div>
                                 <div className="space-y-1.5">
                                    <label className="text-[8px] font-black text-slate-400 uppercase">Stage Type</label>
                                    <select 
                                       value={step.type}
                                       onChange={e => updateStep(step.id, 'type', e.target.value)}
                                       className="w-full bg-slate-50 border-none rounded-lg px-3 py-1.5 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-200"
                                    >
                                       <option>Input</option>
                                       <option>Review</option>
                                       <option>Approval</option>
                                       <option>Acknowledgment</option>
                                    </select>
                                 </div>
                                 <div className="space-y-1.5">
                                    <label className="text-[8px] font-black text-slate-400 uppercase">Lockout Delay (Days)</label>
                                    <input 
                                       type="number"
                                       value={step.duration}
                                       onChange={e => updateStep(step.id, 'duration', parseInt(e.target.value) || 0)}
                                       className="w-full bg-slate-50 border-none rounded-lg px-3 py-1.5 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-200"
                                    />
                                 </div>
                              </div>
                              <button 
                                 onClick={() => removeStep(step.id)}
                                 className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                              >
                                 <Trash2 size={18} />
                              </button>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="p-8 border-t border-slate-100 bg-slate-50 flex items-center justify-end space-x-3">
               <button onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-slate-500">Discard</button>
               <button 
                  disabled={!formData.name}
                  onClick={() => onSave(formData as any)}
                  className="px-10 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-indigo-200 hover:scale-[1.02] active:scale-95 transition-all"
               >
                  Authorize Workflow
               </button>
            </div>
         </div>
      </div>
   );
};

/**
 * Create Performance Cycle Wizard
 */
const CreateCycleWizard = ({ onAdd, onClose, templates }: { onAdd: (c: PerformanceCycle) => void, onClose: () => void, templates: RatingTemplate[] }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    template: templates[0]?.name || '',
    start: '',
    end: '',
    participants: 150
  });

  const handleSubmit = () => {
    onAdd({
      id: `c${Date.now()}`,
      ...formData,
      status: 'Upcoming',
    });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
              <CalendarClock size={24}/>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase leading-none">Cycle Scheduler</h3>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Step {step} of 3</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><X size={24}/></button>
        </div>

        <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
           {step === 1 && (
             <div className="space-y-6 animate-in slide-in-from-right duration-300">
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Cycle Designation</label>
                  <input 
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Q4 Growth Calibration"
                    className="w-full bg-white text-slate-900 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-lg outline-none focus:border-primary transition-all shadow-inner"
                  />
               </div>
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Institutional Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide the purpose and context for this performance window..."
                    className="w-full bg-white text-slate-900 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:border-primary transition-all shadow-inner resize-none h-24"
                  />
               </div>
             </div>
           )}

           {step === 2 && (
             <div className="space-y-6 animate-in slide-in-from-right duration-300">
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Execution Template</label>
                  <div className="grid grid-cols-1 gap-3">
                     {templates.map(t => (
                        <button 
                          key={t.id}
                          onClick={() => setFormData({ ...formData, template: t.name })}
                          className={`p-5 rounded-2xl border-2 transition-all text-left flex items-center justify-between ${
                            formData.template === t.name ? 'bg-primary/5 border-primary shadow-sm' : 'bg-white border-slate-100 hover:border-slate-300'
                          }`}
                        >
                           <div>
                              <p className={`text-sm font-bold ${formData.template === t.name ? 'text-primary' : 'text-slate-800'}`}>{t.name}</p>
                              <p className="text-[10px] text-slate-400 mt-1 font-medium">{t.usage} utilization across org</p>
                           </div>
                           {formData.template === t.name && <CheckCircle2 size={20} className="text-primary" />}
                        </button>
                     ))}
                  </div>
               </div>
             </div>
           )}

           {step === 3 && (
             <div className="space-y-6 animate-in slide-in-from-right duration-300">
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Start Date</label>
                    <input type="date" value={formData.start} onChange={e => setFormData({...formData, start: e.target.value})} className="w-full bg-white text-slate-900 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold outline-none focus:border-primary" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">End Date</label>
                    <input type="date" value={formData.end} onChange={e => setFormData({...formData, end: e.target.value})} className="w-full bg-white text-slate-900 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold outline-none focus:border-primary" />
                  </div>
               </div>
               <div className="p-6 bg-slate-900 rounded-[2rem] text-white space-y-4">
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">Enrollment Estimate</p>
                  <div className="flex items-center justify-between">
                     <span className="text-2xl font-black">{formData.participants} Users</span>
                     <button className="text-xs font-bold text-slate-400 hover:text-white underline">Edit Groups</button>
                  </div>
               </div>
             </div>
           )}
        </div>

        <div className="p-8 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
           <button onClick={() => step > 1 ? setStep(step - 1) : onClose()} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-widest text-[11px]">
              {step === 1 ? 'Cancel' : 'Previous'}
           </button>
           <button 
            disabled={step === 1 && !formData.name}
            onClick={() => step < 3 ? setStep(step + 1) : handleSubmit()}
            className="px-10 py-3 bg-primary text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30"
           >
              {step === 3 ? 'Deploy Cycle' : 'Next Step'}
           </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Cycle Detail Drawer
 */
const CycleDetailDrawer = ({ cycle, onClose }: { cycle: PerformanceCycle, onClose: () => void }) => {
  const [isLaunching, setIsLaunching] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  const handleLaunch = () => {
    setIsLaunching(true);
    setTimeout(() => {
      setIsLaunching(false);
      onClose();
    }, 1500);
  };

  return (
    <>
      <div className="fixed inset-0 z-[150] bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="fixed top-0 right-0 bottom-0 w-full sm:w-[550px] bg-white z-[160] shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden">
         <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center space-x-4">
               <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shadow-inner"><Calendar size={24}/></div>
               <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-none uppercase">{cycle.name}</h3>
                  <span className="inline-block mt-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-white border border-slate-100 shadow-sm text-slate-600">{cycle.status}</span>
               </div>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 rounded-lg transition-all"><X size={24}/></button>
         </div>
         
         <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
            <div className="space-y-4">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Institutional Context</label>
               <p className="text-sm text-slate-600 font-medium leading-relaxed italic">"{cycle.description}"</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] shadow-sm">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Participant Pool</p>
                  <p className="text-lg font-black text-slate-900">{cycle.participants} Users</p>
               </div>
               <div className="p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] shadow-sm">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Framework Logic</p>
                  <p className="text-lg font-black text-slate-900 truncate">{cycle.template}</p>
               </div>
            </div>

            <div className="space-y-6">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Cycle Health & Progress</h4>
               <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group border border-slate-800">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Activity size={80} className="text-primary" />
                  </div>
                  <div className="relative z-10 space-y-8">
                     <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global Completion</span>
                        <span className="text-2xl font-black text-primary">{cycle.progress || cycle.completionRate || 0}%</span>
                     </div>
                     <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-primary shadow-[0_0_12px_rgba(22,89,230,0.5)] transition-all duration-1000" style={{ width: `${cycle.progress || cycle.completionRate || 0}%` }} />
                     </div>
                     <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate-500">Timeline: {cycle.start}</span>
                        <span className="text-slate-500">Deadline: {cycle.end}</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="space-y-4">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Administrative Actions</h4>
               <div className="space-y-2">
                  <button className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-primary transition-all group">
                     <span className="text-xs font-bold text-slate-700 group-hover:text-primary transition-colors uppercase tracking-tight">Sync Unit Progress Data</span>
                     <RefreshCw size={14} className="text-slate-300 group-hover:text-primary transition-colors" />
                  </button>
                  <button className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-primary transition-all group">
                     <span className="text-xs font-bold text-slate-700 group-hover:text-primary transition-colors uppercase tracking-tight">Export Calibration Audit</span>
                     <Download size={14} className="text-slate-300 group-hover:text-primary transition-colors" />
                  </button>
               </div>
            </div>

            {showPreferences && (
              <div className="p-6 bg-primary/5 border border-primary/20 rounded-3xl animate-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">Cycle Overrides</h4>
                  <button onClick={() => setShowPreferences(false)}><X size={14} className="text-primary" /></button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-600">Anonymous Peer Reviews</span>
                    <div className="w-8 h-4 bg-primary rounded-full relative"><div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full" /></div>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-600">Manual Grading Override</span>
                    <div className="w-8 h-4 bg-slate-200 rounded-full relative"><div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full" /></div>
                  </div>
                </div>
              </div>
            )}
         </div>
         
         <div className="p-8 border-t border-slate-100 bg-slate-50 flex items-center space-x-3">
            {cycle.status === 'Active' ? (
              <button className="flex-1 py-4 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-200 hover:scale-[1.02] transition-all">Force Cycle Lock</button>
            ) : cycle.status === 'Upcoming' ? (
              <button 
                onClick={handleLaunch}
                disabled={isLaunching}
                className="flex-1 py-4 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center space-x-2"
              >
                {isLaunching ? <Loader2 size={16} className="animate-spin" /> : <span>Trigger Manual Launch</span>}
              </button>
            ) : (
              <button className="flex-1 py-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all">Download Closed Summary</button>
            )}
            <button 
              onClick={() => setShowPreferences(!showPreferences)}
              className={`p-4 rounded-xl border transition-all ${showPreferences ? 'bg-primary text-white border-primary shadow-lg' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'}`}
            >
              <SlidersHorizontal size={18}/>
            </button>
         </div>
      </div>
    </>
  );
};

/**
 * Template Logic Designer - Configure Weights
 */
const TemplateLogicDesigner = ({ template, onSave, onClose }: { template: RatingTemplate, onSave: (details: TemplateComponent[]) => void, onClose: () => void }) => {
  const [logic, setLogic] = useState<TemplateComponent[]>(template.logicDetails || []);

  const totalWeight = logic.reduce((acc, curr) => acc + curr.weight, 0);

  const handleWeightChange = (id: string, weight: number) => {
    setLogic(logic.map(l => l.id === id ? { ...l, weight } : l));
  };

  const redistributeWeights = () => {
    const equalWeight = Math.floor(100 / logic.length);
    setLogic(logic.map((l, idx) => ({ 
      ...l, 
      weight: idx === logic.length - 1 ? 100 - (equalWeight * (logic.length - 1)) : equalWeight 
    })));
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
              <Zap size={24}/>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase leading-none">Scoring Architecture</h3>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">{template.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><X size={24}/></button>
        </div>

        <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
           <div className="flex items-center justify-between px-1">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Weight Distribution Strategy</h4>
              <button onClick={redistributeWeights} className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest flex items-center space-x-1">
                 <RefreshCw size={10} />
                 <span>Apply Equal Weight</span>
              </button>
           </div>

           <div className="space-y-4">
              {logic.map(comp => (
                <div key={comp.id} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl space-y-6 shadow-inner">
                   <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                         <div className={`p-2 rounded-xl bg-white shadow-sm ${comp.type === 'OKR' ? 'text-primary' : comp.type === 'KPI' ? 'text-secondary' : 'text-slate-400'}`}>
                            {comp.type === 'OKR' ? <Target size={16}/> : comp.type === 'KPI' ? <Zap size={16}/> : <MessageSquare size={16}/>}
                         </div>
                         <div>
                            <p className="text-xs font-black uppercase tracking-tight text-slate-800">{comp.name}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase">{comp.type} Based logic</p>
                         </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                           type="number" 
                           value={comp.weight} 
                           onChange={e => handleWeightChange(comp.id, parseInt(e.target.value) || 0)}
                           className="w-16 bg-white border border-slate-200 rounded-lg px-2 py-1 text-sm font-black text-center outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        <span className="text-xs font-bold text-slate-400">%</span>
                      </div>
                   </div>
                   <input 
                    type="range" 
                    min="0" max="100" 
                    value={comp.weight} 
                    onChange={e => handleWeightChange(comp.id, parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white rounded-full appearance-none cursor-pointer accent-primary" 
                   />
                </div>
              ))}
           </div>

           <div className={`p-6 rounded-3xl flex items-center justify-between transition-all ${totalWeight === 100 ? 'bg-green-50 border-2 border-green-100 text-green-700' : 'bg-red-50 border-2 border-red-100 text-red-700'}`}>
              <div className="flex items-center space-x-3">
                 {totalWeight === 100 ? <CheckCircle2 size={24}/> : <AlertTriangle size={24}/>}
                 <p className="text-sm font-black uppercase tracking-tight">Integrity Check</p>
              </div>
              <div className="text-right">
                 <p className="text-xl font-black">{totalWeight}% / 100%</p>
                 <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">{totalWeight === 100 ? 'Logic Balanced' : 'Weight imbalance detected'}</p>
              </div>
           </div>
        </div>

        <div className="p-8 border-t border-slate-100 bg-slate-50 flex items-center justify-end space-x-3">
           <button onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-widest text-[11px]">Discard Changes</button>
           <button 
            disabled={totalWeight !== 100}
            onClick={() => onSave(logic)}
            className="px-10 py-3 bg-slate-900 text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all disabled:opacity-30"
           >
              Deploy Scoring Model
           </button>
        </div>
      </div>
    </div>
  );
};

const BuildPipTemplateWizard = ({ onAdd, onClose }: { onAdd: (t: PIPTemplate) => void, onClose: () => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    desc: '',
    sections: [
      { id: '1', type: 'gaps', label: 'Performance Gaps Identified', required: true },
      { id: '2', type: 'smart', label: 'SMART Goals (Mini-OKRs)', required: true },
      { id: '3', type: 'actions', label: 'Required Daily Actions', required: true },
      { id: '4', type: 'resources', label: 'Institutional Support Resources', required: false }
    ]
  });

  const toggleRequired = (id: string) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === id ? { ...s, required: !s.required } : s)
    }));
  };

  const handleSubmit = () => {
    onAdd({
      id: `pip-${Date.now()}`,
      name: formData.name || 'New PIP Framework',
      desc: formData.desc || 'Institutional PIP guidelines.',
      sections: formData.sections
    });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-indigo-50/50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <PipIcon size={24}/>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase">PIP Architect</h3>
              <p className="text-xs text-slate-500 mt-1">Define institutional escalation standards</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><X size={24}/></button>
        </div>

        <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
           <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Framework Designation</label>
              <input 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Sales Unit Escalation Policy"
                className="w-full border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-lg outline-none focus:border-indigo-600 transition-all shadow-inner uppercase tracking-tight"
              />
           </div>

           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Mandatory Policy Sections</label>
              <div className="space-y-2">
                 {formData.sections.map((sec) => (
                    <div key={sec.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between group hover:bg-white transition-all shadow-sm">
                       <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                             {sec.type === 'gaps' ? <AlertCircle size={18}/> : sec.type === 'smart' ? <TargetIcon size={18}/> : sec.type === 'actions' ? <ListTodo size={18}/> : <Info size={18}/>}
                          </div>
                          <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">{sec.label}</span>
                       </div>
                       <div className="flex items-center space-x-3">
                          <span className="text-[9px] font-black uppercase text-slate-400">Required</span>
                          <div 
                            onClick={() => toggleRequired(sec.id)}
                            className={`w-8 h-4 rounded-full relative transition-all cursor-pointer ${sec.required ? 'bg-indigo-600' : 'bg-slate-200'}`}
                          >
                             <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${sec.required ? 'right-0.5' : 'left-0.5'}`} />
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="p-8 border-t border-slate-100 bg-slate-50 flex items-center justify-end space-x-3">
           <button onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-widest text-[11px]">Cancel Architect</button>
           <button 
            disabled={!formData.name}
            onClick={handleSubmit}
            className="px-10 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-indigo-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30"
           >
              Register PIP Policy
           </button>
        </div>
      </div>
    </div>
  );
};

const BuildTemplateWizard = ({ onAdd, onClose }: { onAdd: (t: RatingTemplate) => void, onClose: () => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    desc: '',
    components: [] as string[]
  });

  const COMPONENT_OPTIONS = ['OKRs', 'KPIs', 'Competencies', 'Peer Feedback', 'Self-Appraisal', 'Manager Score'];

  const toggleComponent = (comp: string) => {
    setFormData(prev => ({
      ...prev,
      components: prev.components.includes(comp) 
        ? prev.components.filter(c => c !== comp) 
        : [...prev.components, comp]
    }));
  };

  const handleSubmit = () => {
    onAdd({
      id: `t${Date.now()}`,
      name: formData.name || 'Custom Template',
      desc: formData.desc || 'Custom logic defined via Policy Studio.',
      usage: '0%',
      components: formData.components,
      logicDetails: formData.components.map((c, i) => ({
        id: `l-${i}-${Date.now()}`,
        name: c,
        weight: Math.floor(100 / formData.components.length),
        type: c.includes('OKR') ? 'OKR' : c.includes('KPI') ? 'KPI' : 'Competency'
      }))
    });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
              <Plus size={24}/>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase leading-none">Template Architect</h3>
              <p className="text-xs text-slate-500 mt-1">Design a new performance evaluation framework</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><X size={24}/></button>
        </div>

        <div className="p-8 space-y-8 overflow-y-auto max-h-[60vh] custom-scrollbar">
           <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Template Name</label>
              <input 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Lead Engineer Evaluation"
                className="w-full border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-lg outline-none focus:border-primary transition-all shadow-inner uppercase tracking-tight"
              />
           </div>

           <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Philosophy Statement</label>
              <textarea 
                value={formData.desc}
                onChange={e => setFormData({ ...formData, desc: e.target.value })}
                placeholder="Describe the performance philosophy behind this template..."
                className="w-full border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:border-primary transition-all shadow-inner resize-none h-24"
              />
           </div>

           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Institutional Components</label>
              <div className="grid grid-cols-2 gap-3">
                 {COMPONENT_OPTIONS.map((comp) => (
                    <button 
                       key={comp}
                       onClick={() => toggleComponent(comp)}
                       className={`p-4 rounded-2xl border-2 transition-all text-left flex items-center justify-between group ${
                         formData.components.includes(comp) ? 'bg-primary/5 border-primary text-primary shadow-sm' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
                       }`}
                    >
                       <span className="text-[10px] font-black uppercase tracking-tight">{comp}</span>
                       {formData.components.includes(comp) && <CheckCircle2 size={16} />}
                    </button>
                 ))}
              </div>
           </div>
        </div>

        <div className="p-8 border-t border-slate-100 bg-slate-50 flex items-center justify-end space-x-3">
           <button onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-widest text-[11px]">Discard</button>
           <button 
            disabled={!formData.name || formData.components.length === 0}
            onClick={handleSubmit}
            className="px-10 py-3 bg-primary text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30"
           >
              Finalize & Deploy
           </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Add Rating Bucket Modal
 */
const AddBucketModal = ({ onAdd, onClose, scaleName }: { onAdd: (b: Omit<RatingBucket, 'id'>) => void, onClose: () => void, scaleName: string }) => {
  const [formData, setFormData] = useState({
    score: '',
    label: '',
    color: 'bg-primary'
  });

  const PRESET_COLORS = [
    'bg-primary', 'bg-secondary', 'bg-green-500', 'bg-amber-500', 'bg-red-500', 
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-slate-900', 'bg-slate-400'
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200 flex flex-col">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Palette size={24}/>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase leading-none">New Rating Level</h3>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Scale: {scaleName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><X size={24}/></button>
        </div>

        <div className="p-8 space-y-8">
           <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Institutional Value</label>
                 <input 
                   value={formData.score}
                   onChange={e => setFormData({ ...formData, score: e.target.value })}
                   placeholder="e.g. 5.0"
                   className="w-full bg-white text-slate-900 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-lg outline-none focus:border-primary transition-all shadow-inner"
                 />
              </div>
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Qualitative Bucket</label>
                 <input 
                   value={formData.label}
                   onChange={e => setFormData({ ...formData, label: e.target.value })}
                   placeholder="e.g. Mastery"
                   className="w-full bg-white text-slate-900 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-lg outline-none focus:border-primary transition-all shadow-inner"
                 />
              </div>
           </div>

           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Institutional Visual Indicator</label>
              <div className="flex flex-wrap gap-3">
                 {PRESET_COLORS.map((c) => (
                    <button 
                       key={c}
                       onClick={() => setFormData({ ...formData, color: c })}
                       className={`w-12 h-12 rounded-2xl transition-all border-4 ${
                         formData.color === c ? 'border-primary ring-4 ring-primary/10 scale-110 shadow-lg' : 'border-white hover:scale-105'
                       } ${c}`}
                    />
                 ))}
              </div>
           </div>

           <div className="p-6 bg-slate-900 rounded-[2rem] flex items-center justify-between text-white shadow-xl">
              <div className="flex items-center space-x-4">
                 <div className={`w-6 h-6 rounded-full border-2 border-white/20 ${formData.color}`} />
                 <div>
                    <p className="text-sm font-black uppercase tracking-tight">{formData.label || 'New Bucket'}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Score: {formData.score || '--'}</p>
                 </div>
              </div>
              <ShieldCheck size={24} className="text-primary" />
           </div>
        </div>

        <div className="p-8 border-t border-slate-100 bg-slate-50 flex items-center justify-end space-x-3">
           <button onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-widest text-[11px]">Discard</button>
           <button 
            disabled={!formData.score || !formData.label}
            onClick={() => onAdd(formData)}
            className="px-10 py-3 bg-primary text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30"
           >
              Create Bucket
           </button>
        </div>
      </div>
    </div>
  );
};

// -- Helpers --
const TabButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center space-x-2 px-6 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
      active ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const SectionHeader = ({ title, desc }: any) => (
  <div>
    <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase">{title}</h3>
    <p className="text-slate-500 text-sm mt-1 font-medium leading-relaxed italic">"{desc}"</p>
  </div>
);

const GovernanceToggle = ({ label, desc, active, onChange }: any) => (
  <div onClick={onChange} className="p-5 border-2 border-slate-100 rounded-3xl flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer group hover:border-primary/20">
     <div>
        <p className="text-xs font-bold text-slate-900 group-hover:text-primary transition-colors uppercase tracking-tight">{label}</p>
        <p className="text-[10px] text-slate-400 mt-1 font-medium italic">{desc}</p>
     </div>
     <div className={`w-10 h-5 rounded-full relative transition-all ${active ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-slate-200'}`}>
        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${active ? 'right-0.5' : 'left-0.5'}`} />
     </div>
  </div>
);

const ScaleCard = ({ label, points, active, onClick }: any) => (
  <div onClick={onClick} className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer text-center group ${active ? 'bg-primary/5 border-primary shadow-xl ring-4 ring-primary/5' : 'bg-white border-slate-100 hover:border-slate-300'}`}>
     <p className={`text-[10px] font-black uppercase mb-4 tracking-widest ${active ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600'}`}>{label}</p>
     <div className="flex justify-center -space-x-1.5">
        {points.map((p, i) => (
          <div key={i} className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black border-2 transition-all ${active ? 'bg-primary text-white border-white scale-110 shadow-lg' : 'bg-slate-50 text-slate-300 border-white'}`}>{p}</div>
        ))}
     </div>
  </div>
);

const LabelRow = ({ score, label, color, onDelete }: any) => (
  <div className="flex items-center space-x-6 p-5 bg-white border border-slate-200 rounded-[1.5rem] group hover:border-primary/40 transition-all shadow-sm">
     <div className="w-16 text-center border-r border-slate-100">
        <span className="text-sm font-black text-slate-900 tracking-tighter">{score}</span>
     </div>
     <div className="flex-1 flex items-center space-x-4">
        <div className={`w-4 h-4 rounded-full shadow-inner ${color}`} />
        <input defaultValue={label} className="text-xs font-bold text-slate-700 bg-transparent border-none focus:ring-0 w-full uppercase tracking-tight" />
     </div>
     <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onDelete} className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={16}/></button>
        <button className="p-2.5 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"><MoreVertical size={16}/></button>
     </div>
  </div>
);

const ChangeItem = ({ user, action, time }: any) => (
  <div className="flex items-start space-x-3 group cursor-default">
     <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 group-hover:bg-primary transition-all shadow-sm" />
     <div>
        <p className="text-[11px] font-bold text-slate-800 group-hover:text-primary transition-colors">{action}</p>
        <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5 tracking-tighter">{user} • {time}</p>
     </div>
  </div>
);

// Modular Sub-components
const PolicyAuditDrawer = ({ onClose }: any) => (
  <>
    <div className="fixed inset-0 z-[150] bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
    <div className="fixed top-0 right-0 bottom-0 w-full sm:w-[500px] bg-white z-[160] shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden">
       <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-4">
             <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg"><History size={24}/></div>
             <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-none uppercase">Governance Audit</h3>
                <p className="text-xs text-slate-500 mt-1 font-bold uppercase tracking-widest">Policy Lifecycle Ledger</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 rounded-lg transition-all"><X size={24}/></button>
       </div>
       <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
          {[
            { user: 'Alex Rivera', role: 'Org Admin', action: 'Scale modified (Custom Likert)', time: '2h ago' },
            { user: 'Alex Rivera', role: 'Org Admin', action: 'Deployed Standard Executive Template', time: '1d ago' },
            { user: 'David Wright', role: 'HR Legal', action: 'Policy Override (FY24 Calibration)', time: '2d ago' },
            { user: 'Alex Rivera', role: 'Org Admin', action: 'Initial Framework Deployment', time: '5d ago' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-start space-x-4 p-4 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100">
               <div className="w-10 h-10 rounded-full bg-slate-100 border border-white shadow-sm flex items-center justify-center shrink-0">
                  <UserPlus size={16} className="text-slate-400" />
               </div>
               <div>
                  <p className="text-sm font-bold text-slate-900 leading-tight">{item.action}</p>
                  <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-widest">{item.user} • {item.role} • {item.time}</p>
               </div>
            </div>
          ))}
       </div>
    </div>
  </>
);

const DeployFrameworkModal = ({ onConfirm, onClose }: any) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
    <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden border border-slate-200">
      <div className="p-8 text-center space-y-6">
        <div className="w-20 h-20 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mx-auto shadow-inner">
           <Rocket size={40} />
        </div>
        <div>
           <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none mb-3">Deploy Framework?</h3>
           <p className="text-slate-500 text-sm font-medium leading-relaxed">This will commit all changes to the institutional performance ledger and update active templates org-wide.</p>
        </div>
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start space-x-3 text-left">
           <AlertTriangle size={18} className="text-amber-600 mt-0.5 shrink-0" />
           <p className="text-[10px] text-amber-700 font-bold uppercase tracking-tight">Active cycles using these templates will be synchronized immediately.</p>
        </div>
      </div>
      <div className="p-8 border-t border-slate-100 bg-slate-50 flex space-x-3">
         <button onClick={onClose} className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Cancel</button>
         <button onClick={onConfirm} className="flex-1 py-4 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">Commit & Deploy</button>
      </div>
    </div>
  </div>
);

export default PolicyStudioPage;