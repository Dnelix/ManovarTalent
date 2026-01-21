
import React, { useState } from 'react';
import { 
  TrendingUp, 
  Plus, 
  Play, 
  Sparkles,
  ChevronRight,
  Users,
  Target,
  Zap,
  RefreshCw,
  Clock,
  Briefcase,
  Flame,
  BrainCircuit,
  Scale,
  ShieldCheck,
  AlertTriangle,
  BarChart3,
  Target as TargetIcon,
  Activity,
  History,
  Timer,
  X,
  Layers,
  ArrowRight
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Line, Bar, BarChart 
} from 'recharts';
import { UserRole } from '../types';

// Mock Data for Comparison Mode
const PERFORMANCE_DATA = [
  { name: 'M1', reality: 40, scenario: 40, realityRev: 1.0, scenarioRev: 1.0, realityStress: 20, scenarioStress: 20, realityVelocity: 60, scenarioVelocity: 60 },
  { name: 'M2', reality: 42, scenario: 48, realityRev: 1.1, scenarioRev: 1.2, realityStress: 22, scenarioStress: 25, realityVelocity: 62, scenarioVelocity: 68 },
  { name: 'M3', reality: 45, scenario: 58, realityRev: 1.2, scenarioRev: 1.5, realityStress: 25, scenarioStress: 40, realityVelocity: 65, scenarioVelocity: 78 },
  { name: 'M4', reality: 48, scenario: 72, realityRev: 1.3, scenarioRev: 1.9, realityStress: 28, scenarioStress: 55, realityVelocity: 68, scenarioVelocity: 92 },
  { name: 'M5', reality: 50, scenario: 85, realityRev: 1.4, scenarioRev: 2.4, realityStress: 30, scenarioStress: 72, realityVelocity: 70, scenarioVelocity: 105 },
  { name: 'M6', reality: 52, scenario: 94, realityRev: 1.5, scenarioRev: 3.0, realityStress: 32, scenarioStress: 88, realityVelocity: 72, scenarioVelocity: 115 },
];

const DIST_DATA = [
  { name: 'Poor', reality: 10, scenario: 5 },
  { name: 'Fair', reality: 20, scenario: 10 },
  { name: 'Good', reality: 40, scenario: 30 },
  { name: 'Great', reality: 20, scenario: 40 },
  { name: 'Elite', reality: 10, scenario: 15 },
];

interface PlanningPageProps {
  role: UserRole;
}

const PlanningPage: React.FC<PlanningPageProps> = ({ role }) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeScenarioId, setActiveScenarioId] = useState<string>('s3');

  // Simulation Controls
  const [headcount, setHeadcount] = useState(10);
  const [capacity, setCapacity] = useState(80);
  const [targetDelta, setTargetDelta] = useState(20);
  const [quota, setQuota] = useState(50);
  const [velocity, setVelocity] = useState(70);
  const [ratingIntensity, setRatingIntensity] = useState(40);
  const [cadence, setCadence] = useState('Quarterly');
  const [aiEnabled, setAiEnabled] = useState(true);
  const [riskThreshold, setRiskThreshold] = useState(30);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 1200);
  };

  if (role === UserRole.EMPLOYEE) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-500 bg-white rounded-2xl border border-slate-200 shadow-sm mx-4">
        <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 shadow-inner">
           <AlertTriangle size={40} />
        </div>
        <div>
           <h2 className="text-xl font-bold text-slate-900 tracking-tight">Access Restricted</h2>
           <p className="text-slate-500 mt-2 max-w-sm text-sm">Strategic planning and What-If simulations are reserved for leadership and management units.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">What-If Simulator</h1>
          <p className="text-slate-500 text-sm mt-1">Model performance outcomes based on capacity, goals, and logic variables</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
          >
            <Plus size={16} />
            <span>New Simulation</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Scenario Builder Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-8 sticky top-6">
            <h3 className="font-bold text-slate-800 text-sm tracking-tight mb-2">Scenario Builder</h3>
            
            <div className="space-y-6">
              {/* Group: People */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                  <Users size={12} className="mr-2" /> People & Capacity
                </label>
                <div className="space-y-4">
                  <SliderInput label="Headcount Delta" value={headcount} unit="%" onChange={setHeadcount} min={-20} max={50} />
                  <SliderInput label="Unit Capacity" value={capacity} unit="%" onChange={setCapacity} min={0} max={100} />
                </div>
              </div>

              {/* Group: Goals */}
              <div className="space-y-4 pt-4 border-t border-slate-50">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                  <Target size={12} className="mr-2" /> Target Changes
                </label>
                <div className="space-y-4">
                  <SliderInput label="OKR Aggression" value={targetDelta} unit="%" onChange={setTargetDelta} min={0} max={100} />
                  <SliderInput label="Sales Quotas" value={quota} unit="%" onChange={setQuota} min={0} max={100} />
                </div>
              </div>

              {/* Group: Performance Logic */}
              <div className="space-y-4 pt-4 border-t border-slate-50">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                  <Scale size={12} className="mr-2" /> Productivity & Policy
                </label>
                <div className="space-y-4">
                  <SliderInput label="Output Velocity" value={velocity} unit="v" onChange={setVelocity} min={40} max={120} />
                  <SliderInput label="Rating Intensity" value={ratingIntensity} unit="%" onChange={setRatingIntensity} min={0} max={100} />
                  <div className="space-y-2 px-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Review Cadence</span>
                    <select 
                      value={cadence}
                      onChange={(e) => setCadence(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 outline-none"
                    >
                      <option>Monthly</option>
                      <option>Quarterly</option>
                      <option>Bi-Annual</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Group: AI & Risk */}
              <div className="space-y-4 pt-4 border-t border-slate-50">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                  <BrainCircuit size={12} className="mr-2" /> AI Assistance & Risk
                </label>
                <div className="space-y-4">
                  <div 
                    onClick={() => setAiEnabled(!aiEnabled)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between shadow-sm ${
                      aiEnabled ? 'bg-slate-900 border-slate-900 text-white' : 'bg-slate-50 border-slate-100 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Sparkles size={14} className={aiEnabled ? 'text-secondary' : 'text-slate-400'} />
                      <span className="text-xs font-bold">AI Assistance</span>
                    </div>
                    <div className={`w-8 h-4 rounded-full relative transition-all ${aiEnabled ? 'bg-secondary' : 'bg-slate-200'}`}>
                      <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${aiEnabled ? 'right-0.5' : 'left-0.5'}`}></div>
                    </div>
                  </div>
                  <SliderInput label="Risk Threshold" value={riskThreshold} unit="%" onChange={setRiskThreshold} min={0} max={100} />
                </div>
              </div>
            </div>

            <button 
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="w-full py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary-600 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isSimulating ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} fill="currentColor" />}
              <span>{isSimulating ? 'Simulating...' : 'Run Analysis'}</span>
            </button>
          </div>
        </aside>

        {/* Main Analysis Results View */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-6">
             <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
                <div>
                   <h3 className="font-bold text-slate-900">Analysis Result</h3>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Reality vs Scenario Comparative Engine</p>
                </div>
                <div className="flex items-center space-x-6">
                   <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reality</span>
                   </div>
                   <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Scenario</span>
                   </div>
                </div>
             </div>

             {/* Consolidated Multi-Chart Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                {/* Chart 1: Goal Attainment % */}
                <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                     <TargetIcon size={12} className="mr-2" /> Goal Attainment %
                   </h4>
                   <div className="h-44">
                      <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={PERFORMANCE_DATA}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700, fill: '#64748B'}} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                            <Area type="monotone" name="Reality" dataKey="reality" stroke="#E2E8F0" fill="#F8FAFC" />
                            <Area type="monotone" name="Scenario" dataKey="scenario" stroke="#1659E6" strokeWidth={3} fill="#1659E6" fillOpacity={0.05} />
                         </AreaChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                {/* Chart 2: Revenue Forecast */}
                <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                     <TrendingUp size={12} className="mr-2" /> Revenue Forecast ($M)
                   </h4>
                   <div className="h-44">
                      <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={PERFORMANCE_DATA}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700, fill: '#64748B'}} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                            <Area type="monotone" name="Reality" dataKey="realityRev" stroke="#E2E8F0" fill="#F8FAFC" />
                            <Area type="monotone" name="Scenario" dataKey="scenarioRev" stroke="#30B7EE" strokeWidth={3} fill="#30B7EE" fillOpacity={0.05} />
                         </AreaChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                {/* Chart 3: Delivery Timelines / Velocity */}
                <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                     <Timer size={12} className="mr-2" /> Delivery Velocity
                   </h4>
                   <div className="h-44">
                      <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={PERFORMANCE_DATA}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700, fill: '#64748B'}} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                            <Area type="monotone" name="Reality" dataKey="realityVelocity" stroke="#E2E8F0" fill="#F8FAFC" />
                            <Area type="monotone" name="Scenario" dataKey="scenarioVelocity" stroke="#10B981" strokeWidth={3} fill="#10B981" fillOpacity={0.05} />
                         </AreaChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                {/* Chart 4: Burnout / Load Risk */}
                <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                     <Flame size={12} className="mr-2" /> Burnout & Load Risk
                   </h4>
                   <div className="h-44">
                      <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={PERFORMANCE_DATA}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700, fill: '#64748B'}} />
                            <Tooltip />
                            <Area type="monotone" name="Reality" dataKey="realityStress" stroke="#E2E8F0" fill="#F8FAFC" />
                            <Area type="monotone" name="Scenario" dataKey="scenarioStress" stroke="#EF4444" strokeWidth={3} fill="#EF4444" fillOpacity={0.05} />
                         </AreaChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                {/* Chart 5: Performance Distribution */}
                <div className="space-y-4 md:col-span-2 pt-6 border-t border-slate-50">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                     <BarChart3 size={12} className="mr-2" /> Rating Distribution Comparison
                   </h4>
                   <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={DIST_DATA} barGap={4}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700, fill: '#64748B'}} />
                            <Tooltip cursor={{fill: 'transparent'}} />
                            <Bar dataKey="reality" fill="#E2E8F0" radius={[2, 2, 0, 0]} barSize={40} />
                            <Bar dataKey="scenario" fill="#1659E6" radius={[2, 2, 0, 0]} barSize={40} />
                         </BarChart>
                      </ResponsiveContainer>
                   </div>
                </div>
             </div>
          </div>

          {/* Scenario Library */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
             <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Scenario Library</h3>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Archive Models</span>
             </div>
             <div className="divide-y divide-slate-100">
                <ScenarioListItem 
                  name="Aggressive Q4 Market Growth Expansion" 
                  delta="+32% Revenue" 
                  risk="Moderate"
                  date="Oct 12" 
                  active={activeScenarioId === 's1'}
                  onClick={() => setActiveScenarioId('s1')}
                  scoringFlow="Capacity (+10) → Goals (+25) → ROI (+32)"
                />
                <ScenarioListItem 
                  name="Global Hiring Freeze & Capacity Constraint" 
                  delta="-12% Delivery" 
                  risk="High"
                  date="Oct 08" 
                  active={activeScenarioId === 's2'}
                  onClick={() => setActiveScenarioId('s2')}
                  scoringFlow="Capacity (-15) → Goals (Stable) → Burnout (+22)"
                />
                <ScenarioListItem 
                  name="AI-Boosted Backend Efficiency Cycle" 
                  delta="+18% Velocity" 
                  risk="Low"
                  date="Today" 
                  active={activeScenarioId === 's3'}
                  onClick={() => setActiveScenarioId('s3')}
                  scoringFlow="Logic (AI: On) → Velocity (+25) → Efficiency (+18)"
                />
             </div>
             <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                <button className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">Compare All Historical Trends</button>
             </div>
          </div>
        </div>
      </div>

      {/* New Simulation Creation Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                  <Plus size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Configure New Scenario</h3>
                  <p className="text-xs text-slate-500">Define the core hypothesis for your What-If model</p>
                </div>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scenario Designation</label>
                <input type="text" placeholder="e.g. FY25 Engineering Scaling" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold" />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Base Template</label>
                <div className="grid grid-cols-2 gap-3">
                  <TemplateOption title="Hypergrowth" desc="Bias toward headcount & aggressive goals" icon={<TrendingUp size={16}/>} active />
                  <TemplateOption title="Efficiency Drive" desc="Bias toward velocity & capacity optimization" icon={<Zap size={16}/>} />
                  <TemplateOption title="Hiring Freeze" desc="Bias toward load risk & burnout modeling" icon={<Users size={16}/>} />
                  <TemplateOption title="AI Synthesis" desc="Model impacts of AI-assisted throughput" icon={<BrainCircuit size={16}/>} />
                </div>
              </div>

              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-start space-x-3">
                 <ShieldCheck size={18} className="text-primary mt-0.5" />
                 <div>
                    <p className="text-xs font-bold text-slate-900">Governance Sync</p>
                    <p className="text-[10px] text-slate-500 font-medium">This scenario will automatically inherit the 'Product & Engineering' policy from the Policy Studio.</p>
                 </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end space-x-3">
              <button onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">Cancel</button>
              <button 
                onClick={() => { setIsCreateModalOpen(false); handleRunSimulation(); }}
                className="px-8 py-2 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center space-x-2"
              >
                <span>Initialize Sandbox</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-components
const SliderInput = ({ label, value, unit, min, max, onChange }: any) => (
  <div className="space-y-2 px-1">
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{label}</span>
      <span className="text-[10px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded">{value}{unit}</span>
    </div>
    <input 
      type="range" min={min} max={max} value={value} 
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="w-full h-1 bg-slate-100 rounded-full appearance-none cursor-pointer accent-primary hover:accent-primary-600 transition-all" 
    />
  </div>
);

const ScenarioListItem = ({ name, delta, risk, date, active, onClick, scoringFlow }: any) => (
  <div 
    onClick={onClick}
    className={`p-6 group hover:bg-slate-50/50 transition-all cursor-pointer flex items-center justify-between ${active ? 'bg-primary/5 ring-1 ring-inset ring-primary/10' : ''}`}
  >
    <div className="flex-1">
      <div className="flex items-center space-x-2 mb-1">
         <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${delta.includes('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
           {delta}
         </span>
         <span className="text-[10px] font-bold text-slate-400 flex items-center">
           <Clock size={10} className="mr-1" /> Simulated {date}
         </span>
      </div>
      <h4 className={`font-bold text-slate-800 group-hover:text-primary transition-colors ${active ? 'text-primary' : ''}`}>{name}</h4>
      <div className="mt-2 flex items-center space-x-2">
         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Model Chain:</span>
         <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded flex items-center">
            {scoringFlow}
         </span>
      </div>
    </div>
    <div className="flex items-center space-x-8">
      <div className="text-right">
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Risk Profile</p>
         <div className="flex items-center justify-end space-x-1">
            <div className={`w-2 h-2 rounded-full ${risk === 'Low' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : risk === 'High' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]'}`}></div>
            <span className="text-xs font-bold text-slate-700">{risk}</span>
         </div>
      </div>
      <ChevronRight size={18} className={`text-slate-300 group-hover:text-primary transition-all ml-4 ${active ? 'text-primary' : ''}`} />
    </div>
  </div>
);

const TemplateOption = ({ title, desc, icon, active }: any) => (
  <div className={`p-4 rounded-xl border transition-all cursor-pointer text-left group ${
    active ? 'bg-primary/5 border-primary/20 ring-2 ring-primary/10 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-300'
  }`}>
     <div className={`p-2 rounded-lg w-fit mb-3 transition-colors ${active ? 'bg-primary text-white' : 'bg-slate-50 text-slate-400 group-hover:text-primary group-hover:bg-primary/5'}`}>
        {icon}
     </div>
     <h4 className={`text-xs font-bold ${active ? 'text-primary' : 'text-slate-800'}`}>{title}</h4>
     <p className={`text-[10px] mt-1 leading-relaxed ${active ? 'text-primary/70' : 'text-slate-400'}`}>{desc}</p>
  </div>
);

export default PlanningPage;
