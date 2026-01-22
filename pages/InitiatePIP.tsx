
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  ArrowLeft, 
  User, 
  Briefcase, 
  Calendar, 
  Target, 
  ListTodo, 
  Info, 
  Plus, 
  Trash2, 
  Upload, 
  Paperclip, 
  ShieldCheck, 
  CheckCircle2, 
  Users, 
  Clock, 
  Sparkles,
  AlertTriangle,
  ChevronRight,
  FileText,
  X,
  RefreshCw,
  Bell,
  BrainCircuit
} from 'lucide-react';

// Unified data pool matching the IDs provided by the Appraisals team review list
const MOCK_PEOPLE_POOL = [
  { id: 'tr1', name: "Marcus Vane", title: "DevOps Lead", dept: "Infrastructure", avatar: "https://picsum.photos/seed/marcus/100/100" },
  { id: 'tr2', name: "Sarah Chen", title: "Sr. Product Manager", dept: "Core Platform", avatar: "https://picsum.photos/seed/sarah/100/100" },
  { id: 'tr3', name: "Jordan Smith", title: "Staff Engineer", dept: "Core Platform", avatar: "https://picsum.photos/seed/jordan/100/100" },
  { id: 'tr4', name: "Lila Ray", title: "Product Analyst", dept: "Product Strategy", avatar: "https://picsum.photos/seed/lila/100/100" },
  { id: 'tr5', name: "David Wright", title: "Security Lead", dept: "Legal & Compliance", avatar: "https://picsum.photos/seed/david/100/100" },
];

const InitiatePIPPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [gaps, setGaps] = useState('');
  const [smartGoals, setSmartGoals] = useState([{ id: '1', title: '', targetDate: '', metric: '' }]);
  const [actions, setActions] = useState([{ id: '1', task: '', frequency: 'Weekly' }]);
  const [resources, setResources] = useState([{ id: '1', item: '', type: 'Training' }]);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [isCollaborative, setIsCollaborative] = useState(true);
  const [managerApproval, setManagerApproval] = useState(false);
  const [hrRepresentative, setHrRepresentative] = useState('Sarah Carter (HRBP)');

  useEffect(() => {
    // Attempt to locate the employee in the unified organizational pool
    const found = MOCK_PEOPLE_POOL.find(p => p.id === id);
    if (found) {
      setPerson(found);
    } else {
      // Fallback for safety, though IDs are now aligned with the Appraisals page
      setPerson({ 
        name: "Unidentified Personnel", 
        title: "Team Member", 
        dept: "Unassigned Unit", 
        avatar: "https://picsum.photos/seed/unknown/100/100" 
      });
    }
    setIsLoading(false);
  }, [id]);

  const addGoal = () => setSmartGoals([...smartGoals, { id: Date.now().toString(), title: '', targetDate: '', metric: '' }]);
  const removeGoal = (id: string) => setSmartGoals(smartGoals.filter(g => g.id !== id));
  
  const addAction = () => setActions([...actions, { id: Date.now().toString(), task: '', frequency: 'Weekly' }]);
  const removeAction = (id: string) => setActions(actions.filter(a => a.id !== id));

  const addResource = () => setResources([...resources, { id: Date.now().toString(), item: '', type: 'Training' }]);
  const removeResource = (id: string) => setResources(resources.filter(r => r.id !== id));

  const handleFileUpload = () => {
    const newFile = { id: Date.now(), name: `supporting_doc_${Date.now()}.pdf`, size: '1.2 MB' };
    setAttachments([...attachments, newFile]);
  };

  const handleInitiate = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate('/audit-log');
    }, 1500);
  };

  if (isLoading || !person) return <div className="h-screen flex items-center justify-center bg-slate-50"><RefreshCw className="animate-spin text-primary" /></div>;

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto space-y-8 pb-32">
      {/* Navigation Header */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-500 shadow-sm"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">Formal PIP Initiation</h1>
          <p className="text-slate-500 text-sm mt-1.5 font-medium uppercase tracking-widest">Institutional Calibration Workspace</p>
        </div>
      </div>

      {/* Target Personnel Identity Hub */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
            <ShieldAlert size={160} className="text-indigo-600" />
         </div>
         <div className="flex items-center space-x-8 relative z-10">
            <div className="relative">
              <img src={person.avatar} className="w-24 h-24 rounded-4xl border-4 border-white shadow-2xl object-cover" alt={person.name} />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-indigo-600 rounded-2xl flex items-center justify-center text-white border-4 border-white shadow-lg">
                <ShieldCheck size={14} />
              </div>
            </div>
            <div>
               <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-sm">Escalation Protocol Active</span>
               </div>
               <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">{person.name}</h3>
               <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-sm">{person.title} <span className="mx-2 text-slate-200">•</span> {person.dept}</p>
               <div className="flex items-center space-x-4 mt-5">
                  <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                     <Clock size={12}/>
                     <span>Docket Initiated: {new Date().toLocaleDateString()}</span>
                  </div>
               </div>
            </div>
         </div>
         <div className="text-right relative z-10 px-10 border-l border-slate-100 hidden lg:block">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Compliance Custodian</p>
            <p className="text-base font-bold text-slate-700">{hrRepresentative}</p>
            <div className="flex justify-end mt-2">
               <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded text-[8px] font-black uppercase border border-green-100">Audit Ready</span>
            </div>
         </div>
      </div>

      {/* Structured Initiation Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3 space-y-2">
          <StepButton index={1} active={step === 1} onClick={() => setStep(1)} label="Performance Gaps" icon={<AlertTriangle size={16}/>} />
          <StepButton index={2} active={step === 2} onClick={() => setStep(2)} label="SMART Success Goals" icon={<Target size={16}/>} />
          <StepButton index={3} active={step === 3} onClick={() => setStep(3)} label="Required Actions" icon={<ListTodo size={16}/>} />
          <StepButton index={4} active={step === 4} onClick={() => setStep(4)} label="Support Resources" icon={<Users size={16}/>} />
          <StepButton index={5} active={step === 5} onClick={() => setStep(5)} label="Finalize & Initiate" icon={<CheckCircle2 size={16}/>} />
        </aside>

        <main className="lg:col-span-9">
          {/* Step 1: Performance Gaps */}
          {step === 1 && (
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm space-y-8 animate-in slide-in-from-right duration-400">
               <SectionTitle title="Identified Performance Gaps" desc="Document specific behavioral or quantitative deficiencies requiring remediation." />
               <textarea 
                  value={gaps}
                  onChange={(e) => setGaps(e.target.value)}
                  placeholder="Provide detailed context on observed performance gaps..."
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl p-8 text-sm font-medium outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all h-64 resize-none shadow-inner"
               />
               <div className="p-6 bg-amber-50 border-2 border-amber-100 rounded-[1.5rem] flex items-start space-x-4">
                  <Info size={20} className="text-amber-600 mt-1 shrink-0" />
                  <p className="text-[11px] text-amber-700 font-medium leading-relaxed uppercase tracking-tight">
                    Information provided here must align with historical performance nodes documented in the 'Appraisals' module for institutional consistency.
                  </p>
               </div>
            </div>
          )}

          {/* Step 2: SMART Goals */}
          {step === 2 && (
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm space-y-8 animate-in slide-in-from-right duration-400">
               <div className="flex items-center justify-between">
                  <SectionTitle title="SMART Success Criteria" desc="Define high-fidelity, measurable outcomes for successful plan exit." />
                  <div className="flex items-center space-x-3 bg-slate-50 p-1 rounded-xl border border-slate-200">
                     <button 
                      onClick={() => setIsCollaborative(true)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${isCollaborative ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
                     >Collaborative</button>
                     <button 
                      onClick={() => setIsCollaborative(false)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${!isCollaborative ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
                     >Mandatory</button>
                  </div>
               </div>

               <div className="space-y-4">
                  {smartGoals.map((goal, idx) => (
                    <div key={goal.id} className="p-8 bg-slate-50 border border-slate-100 rounded-[2rem] space-y-8 relative group hover:bg-white hover:shadow-xl transition-all">
                       <div className="flex items-center justify-between border-b border-slate-200/50 pb-4">
                          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center">
                             <Target size={12} className="mr-2" /> Success Vector {idx + 1}
                          </span>
                          <button onClick={() => removeGoal(goal.id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                       </div>
                       <input 
                        placeholder="Goal Title (e.g. Optimize Throughput by 20%)"
                        className="w-full bg-white border border-slate-100 rounded-xl px-4 py-4 text-sm font-bold shadow-sm focus:border-indigo-600 outline-none"
                       />
                       <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Calibration Deadline</label>
                             <input type="date" className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3.5 text-xs font-bold shadow-sm outline-none focus:border-indigo-600" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Performance Metric (Unit)</label>
                             <input placeholder="e.g. Velocity Index" className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3.5 text-xs font-bold shadow-sm outline-none focus:border-indigo-600" />
                          </div>
                       </div>
                    </div>
                  ))}
                  <button 
                    onClick={addGoal}
                    className="w-full py-6 border-2 border-dashed border-slate-200 rounded-[2rem] flex items-center justify-center space-x-3 text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all group bg-slate-50/20"
                  >
                     <Plus size={20} className="group-hover:scale-110 transition-transform" />
                     <span className="text-[11px] font-black uppercase tracking-widest">Append Performance Anchor</span>
                  </button>
               </div>
            </div>
          )}

          {/* Step 3: Required Actions */}
          {step === 3 && (
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm space-y-8 animate-in slide-in-from-right duration-300">
               <SectionTitle title="Required Action Items" desc="Designate specific daily/weekly activities required to maintain status." />
               <div className="space-y-3">
                  {actions.map((action, idx) => (
                    <div key={action.id} className="flex items-center space-x-4 animate-in slide-in-from-bottom-1">
                       <input 
                        placeholder="e.g. Daily Standup contribution on backend architecture..."
                        className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-medium shadow-inner outline-none focus:bg-white focus:border-indigo-600 transition-all"
                       />
                       <select className="bg-white border border-slate-200 rounded-xl px-4 py-4 text-[10px] font-black uppercase tracking-widest outline-none shadow-sm appearance-none min-w-[120px] text-center">
                          <option>Daily</option>
                          <option>Weekly</option>
                          <option>Monthly</option>
                       </select>
                       <button onClick={() => removeAction(action.id)} className="p-3 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                    </div>
                  ))}
                  <button 
                    onClick={addAction}
                    className="flex items-center space-x-2 text-[10px] font-black text-indigo-600 bg-indigo-50 px-6 py-2.5 rounded-xl border border-indigo-100 shadow-sm mt-6 hover:bg-indigo-600 hover:text-white transition-all uppercase"
                  >
                    <Plus size={14}/>
                    <span>Add Vector Requirement</span>
                  </button>
               </div>
            </div>
          )}

          {/* Step 4: Support Resources */}
          {step === 4 && (
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm space-y-8 animate-in slide-in-from-right duration-300">
               <SectionTitle title="Institutional Support Matrix" desc="Designate tools, mentoring, or training sessions to facilitate success." />
               <div className="space-y-4">
                  {resources.map(res => (
                    <div key={res.id} className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-center justify-between group hover:bg-white hover:shadow-lg transition-all">
                       <div className="flex items-center space-x-6 flex-1 pr-8">
                          <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all"><Users size={20}/></div>
                          <input 
                            placeholder="Resource/Support Item (e.g. Senior Mentor Pairing)"
                            className="flex-1 bg-transparent border-none p-0 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-300"
                          />
                       </div>
                       <div className="flex items-center space-x-4">
                          <select className="bg-white border border-slate-200 rounded-xl px-6 py-2.5 text-[10px] font-black uppercase tracking-widest outline-none shadow-sm appearance-none min-w-[140px] text-center">
                            <option>Mentorship</option>
                            <option>Institutional Tool</option>
                            <option>Formal Training</option>
                            <option>Capacity Shift</option>
                          </select>
                          <button onClick={() => removeResource(res.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><X size={16}/></button>
                       </div>
                    </div>
                  ))}
                  <button onClick={addResource} className="w-full py-5 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 hover:border-indigo-400 transition-all">Assign New Success Catalyst</button>
               </div>
            </div>
          )}

          {/* Step 5: Finalize & Initiate */}
          {step === 5 && (
            <div className="space-y-8 animate-in slide-in-from-right duration-300">
               <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm space-y-10">
                  <SectionTitle title="Institutional Finalization" desc="Verify all strategic vectors before formal policy deployment." />
                  
                  <div className="space-y-6">
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center">
                        <Paperclip size={12} className="mr-2" /> Supporting Performance Artifacts
                     </h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {attachments.map(file => (
                          <div key={file.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between shadow-sm group">
                             <div className="flex items-center space-x-3">
                                <FileText size={16} className="text-slate-400" />
                                <span className="text-xs font-bold text-slate-700">{file.name}</span>
                             </div>
                             <button onClick={() => setAttachments(attachments.filter(a => a.id !== file.id))} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                          </div>
                        ))}
                        <button 
                          onClick={handleFileUpload}
                          className="p-8 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center space-y-2 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group"
                        >
                           <Upload size={20} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-600 transition-colors">Attach Performance Trace</span>
                        </button>
                     </div>
                  </div>

                  <div className="p-10 bg-slate-900 rounded-[3rem] text-white space-y-10 relative overflow-hidden group border border-slate-800 shadow-2xl">
                     <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-all duration-1000">
                        <BrainCircuit size={180} className="text-primary" />
                     </div>
                     <div className="relative z-10 space-y-8">
                        <div className="flex items-center space-x-4">
                           <div className="w-12 h-12 bg-primary/20 text-primary border border-primary/20 rounded-2xl flex items-center justify-center shadow-lg">
                              <Sparkles size={24} />
                           </div>
                           <h4 className="text-[11px] font-black text-primary uppercase tracking-[0.3em] border-l-2 border-primary pl-4">Governance Verification Check</h4>
                        </div>
                        
                        <div className="space-y-4">
                           <button 
                              onClick={() => setManagerApproval(!managerApproval)}
                              className={`w-full p-8 rounded-[2.5rem] border-2 transition-all flex items-center justify-between ${managerApproval ? 'bg-primary border-primary shadow-2xl shadow-primary/20' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                           >
                              <div className="flex items-center space-x-6">
                                 <div className={`p-4 rounded-2xl shadow-sm ${managerApproval ? 'bg-white text-primary' : 'bg-white/10 text-slate-400'}`}>
                                    <ShieldCheck size={28} />
                                 </div>
                                 <div className="text-left">
                                    <p className={`text-base font-black uppercase tracking-tight ${managerApproval ? 'text-white' : 'text-slate-200'}`}>Formal Manager Authorization</p>
                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">I attest to the performance gaps and success vectors defined.</p>
                                 </div>
                              </div>
                              {managerApproval && <CheckCircle2 size={28} className="text-white animate-in zoom-in" />}
                           </button>
                        </div>

                        <div className="flex items-start space-x-4 text-slate-400 bg-white/5 p-6 rounded-3xl border border-white/10">
                           <Bell size={18} className="mt-0.5 shrink-0 text-primary" />
                           <p className="text-xs font-medium leading-relaxed italic">
                              Initiation triggers automated institutional alerting for: <span className="text-white font-bold">{person.name}</span>, <span className="text-white font-bold">Alex Rivera (Unit Manager)</span>, and <span className="text-white font-bold">{hrRepresentative}</span>. All changes are indexed in the cold-storage audit trail.
                           </p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="flex items-center justify-between pt-4">
                  <button onClick={() => navigate(-1)} className="px-10 py-4 text-xs font-black text-slate-400 hover:text-slate-800 transition-colors uppercase tracking-widest">Discard PIP Docket</button>
                  <button 
                    disabled={!managerApproval}
                    onClick={handleInitiate}
                    className="px-16 py-5 bg-indigo-600 text-white rounded-[2rem] text-sm font-black uppercase tracking-widest shadow-2xl shadow-indigo-900/40 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 flex items-center space-x-4"
                  >
                     <ShieldCheck size={24}/>
                     <span>Commit & Activate Escalation</span>
                  </button>
               </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// --- Sub-Components ---

const StepButton = ({ index, active, onClick, label, icon }: any) => (
  <button 
    onClick={onClick}
    className={`w-full p-5 rounded-[2rem] flex items-center justify-between transition-all border group ${
      active ? 'bg-white border-indigo-200 shadow-xl ring-8 ring-indigo-50/30 scale-[1.03]' : 'bg-transparent border-transparent text-slate-400 hover:bg-white hover:border-slate-200'
    }`}
  >
     <div className="flex items-center space-x-4">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm transition-all ${active ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-slate-50 text-slate-400 group-hover:bg-white'}`}>
           {icon}
        </div>
        <span className={`text-xs font-black uppercase tracking-tight ${active ? 'text-slate-900' : 'text-slate-500'}`}>{label}</span>
     </div>
     {active && <ChevronRight size={18} className="text-indigo-600" />}
  </button>
);

const SectionTitle = ({ title, desc }: any) => (
  <div>
    <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">{title}</h3>
    <p className="text-slate-500 text-[11px] font-bold uppercase tracking-[0.2em] mt-3 border-l-4 border-indigo-600 pl-4">{desc}</p>
  </div>
);

export default InitiatePIPPage;
