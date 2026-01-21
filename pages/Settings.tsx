
import React, { useState } from 'react';
import { 
  Palette, 
  Shield, 
  Layout, 
  Terminal, 
  Check,
  Lock,
  Users,
  Bell,
  MessageSquare,
  History,
  Activity,
  ArrowRight,
  Database,
  Fingerprint,
  RefreshCw,
  Clock,
  ChevronRight,
  Plus,
  Search,
  Filter,
  Eye,
  ShieldCheck,
  AlertTriangle,
  X,
  Mail,
  Zap,
  MoreVertical,
  CheckCircle2,
  // Fix: Import missing Download icon
  Download
} from 'lucide-react';

const MOCK_SYSTEM_AUDIT = [
  { id: 'l1', user: 'Alex Rivera', role: 'Org Admin', event: 'Modified RBAC', target: 'Manager Roles', time: 'Oct 15, 14:22', category: 'Security', severity: 'Medium' },
  { id: 'l2', user: 'HR System', role: 'Automation', event: 'Cycle Trigger', target: 'FY24 Year-End', time: 'Oct 15, 09:12', category: 'Cycle', severity: 'Low' },
  { id: 'l3', user: 'Marcus Vane', role: 'Manager', event: 'Rating Override', target: 'Sarah Chen', time: 'Oct 14, 16:45', category: 'Appraisal', severity: 'High' },
  { id: 'l4', user: 'Alex Rivera', role: 'Org Admin', event: 'Policy Change', target: 'Rating Scales', time: 'Oct 14, 11:30', category: 'Governance', severity: 'Medium' },
  { id: 'l5', user: 'System Auth', role: 'Security', event: 'New Key Generated', target: 'API_GATEWAY', time: 'Oct 13, 23:10', category: 'Security', severity: 'High' },
];

const SettingsPage: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'security' | 'comm' | 'branding' | 'logs'>('security');
  const [editingRole, setEditingRole] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Enterprise Console</h1>
          <p className="text-slate-500 text-sm mt-1">Configure global institutional security, automation, and observability</p>
        </div>
        <div className="flex items-center space-x-2">
           <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all flex items-center space-x-2">
              {/* Fix: Use imported Download icon */}
              <Download size={14} />
              <span>Export Config</span>
           </button>
           <button className="px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-black shadow-lg hover:bg-black transition-all flex items-center space-x-2">
              <RefreshCw size={16} />
              <span>Sync Nodes</span>
           </button>
        </div>
      </div>

      <div className="flex items-center space-x-1 border-b border-slate-200 pb-px overflow-x-auto no-scrollbar">
         <SettingsTab active={activeSubTab === 'security'} onClick={() => setActiveSubTab('security')} label="RBAC & Security" icon={<Lock size={14}/>} />
         <SettingsTab active={activeSubTab === 'comm'} onClick={() => setActiveSubTab('comm')} label="Notification Engine" icon={<Bell size={14}/>} />
         <SettingsTab active={activeSubTab === 'branding'} onClick={() => setActiveSubTab('branding')} label="Institutional Branding" icon={<Palette size={14}/>} />
         <SettingsTab active={activeSubTab === 'logs'} onClick={() => setActiveSubTab('logs')} label="Audit Logs" icon={<History size={14}/>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 space-y-6">
            {activeSubTab === 'security' && (
               <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-10 animate-in slide-in-from-left duration-300">
                  <SectionHeader title="Role-Based Access Control (RBAC)" desc="Manage granular permissions for all institutional user tiers." />
                  
                  <div className="space-y-4">
                     <RBACCard 
                        role="Executives" 
                        permissions={['Cross-Unit Visibility', 'Global Calibration Overrides', 'Strategic Planning Builder']} 
                        active 
                        onEdit={() => setEditingRole('Executives')}
                     />
                     <RBACCard 
                        role="HR Administrators" 
                        permissions={['Policy Designer', 'Cycle Management', 'Audit Trail Exports', 'Salary/Comms Access']} 
                        active 
                        onEdit={() => setEditingRole('HR')}
                     />
                     <RBACCard 
                        role="Unit Managers" 
                        permissions={['Direct Report Analytics', 'Performance Override (Active Cycles)', 'Peer Review Requests']} 
                        onEdit={() => setEditingRole('Managers')}
                     />
                     <RBACCard 
                        role="Standard Employees" 
                        permissions={['Self-Evaluation Hub', 'Individual Alignment View', 'Personal IDP Management']} 
                        onEdit={() => setEditingRole('Employees')}
                     />
                  </div>
                  
                  <div className="p-6 bg-slate-900 rounded-3xl text-white flex items-center justify-between">
                     <div className="flex items-center space-x-4">
                        <div className="p-3 bg-white/10 rounded-2xl"><Shield size={24} className="text-primary"/></div>
                        <div>
                           <p className="text-sm font-bold">Privacy Encryption Layer</p>
                           <p className="text-[10px] text-slate-400 uppercase font-black">Standard: AES-256 GCM • Rotation: Monthly</p>
                        </div>
                     </div>
                     <button className="px-5 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Configure Keys</button>
                  </div>
               </div>
            )}

            {activeSubTab === 'comm' && (
               <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-10 animate-in slide-in-from-left duration-300">
                  <SectionHeader title="Triggered Reminders & Comms" desc="Schedule automated institutional notifications for performance events." />
                  <div className="space-y-3">
                     <TriggerRow label="Cycle Enrollment Launch" trigger="Cycle Start" channel="Slack + Email" active />
                     <TriggerRow label="Deadline Proximity Warning" trigger="72h Before Lock" channel="Push Notification" active />
                     <TriggerRow label="Manager Finalization Request" trigger="Status: Self-Appraisal Complete" channel="Slack DM" active />
                     <TriggerRow label="Strategic Pivot Alert" trigger="Manual Trigger" channel="Global In-app Toast" />
                  </div>
                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                     <p className="text-[10px] text-slate-400 font-medium">Currently serving 4 active automation workflows across 2 channels.</p>
                     <button className="flex items-center space-x-2 px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
                        <Plus size={16} />
                        <span>Add Workflow</span>
                     </button>
                  </div>
               </div>
            )}

            {activeSubTab === 'logs' && (
               <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden animate-in slide-in-from-left duration-300">
                  <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                     <div>
                        <h3 className="font-bold text-slate-900 tracking-tight">Institutional Audit Trail</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Immutable ledger of administrative and performance actions</p>
                     </div>
                     <div className="flex items-center space-x-2">
                        <div className="relative">
                           <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                           <input placeholder="Search audit logs..." className="bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-[10px] font-bold outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                        <button className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50"><Filter size={14} /></button>
                     </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead className="bg-slate-50/30 border-b border-slate-100">
                          <tr>
                             <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Time & Action</th>
                             <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Actor</th>
                             <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                             <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Severity</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                          {MOCK_SYSTEM_AUDIT.map(log => (
                             <tr key={log.id} className="hover:bg-slate-50/50 transition-all group">
                                <td className="px-8 py-5">
                                   <div className="flex items-start space-x-4">
                                      <div className={`p-2 rounded-lg ${log.severity === 'High' ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400'} group-hover:bg-white transition-colors`}>
                                         <Fingerprint size={16} />
                                      </div>
                                      <div>
                                         <p className="text-xs font-bold text-slate-900 group-hover:text-primary transition-colors">{log.event}</p>
                                         <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{log.target}</p>
                                      </div>
                                   </div>
                                </td>
                                <td className="px-8 py-5">
                                   <div className="flex items-center space-x-2">
                                      <div className="w-5 h-5 rounded-full bg-slate-200 border border-white shadow-sm" />
                                      <p className="text-[11px] font-bold text-slate-700">{log.user}</p>
                                   </div>
                                </td>
                                <td className="px-8 py-5">
                                   <span className="text-[9px] font-black text-slate-400 border border-slate-100 bg-slate-50 px-2 py-0.5 rounded uppercase">{log.category}</span>
                                </td>
                                <td className="px-8 py-5 text-right">
                                   <span className={`text-[9px] font-black uppercase ${log.severity === 'High' ? 'text-red-500' : log.severity === 'Medium' ? 'text-amber-500' : 'text-slate-400'}`}>
                                      {log.severity}
                                   </span>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                  </div>
                  <div className="p-4 bg-slate-50/50 border-t border-slate-100 text-center">
                     <button className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">Load Archived Dataset (30+ Days)</button>
                  </div>
               </div>
            )}

            {activeSubTab === 'branding' && (
               <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-10 animate-in slide-in-from-left duration-300">
                  <SectionHeader title="Tenant Visual Identity" desc="Customize the look and feel for your organizational instance." />
                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Primary Institutional Color</label>
                        <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                           <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 rounded-2xl bg-primary shadow-xl ring-4 ring-white" />
                              <span className="font-mono text-sm font-bold text-slate-700">#1659E6</span>
                           </div>
                           <button className="text-xs font-bold text-primary hover:underline">Change</button>
                        </div>
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Institutional Logo Hub</label>
                        <div className="p-6 bg-slate-50 border border-slate-100 border-dashed rounded-2xl flex flex-col items-center justify-center space-y-2">
                           <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-300"><Layout size={20}/></div>
                           <span className="text-[10px] font-bold text-slate-400 uppercase">SVG / PNG Hub</span>
                        </div>
                     </div>
                  </div>
               </div>
            )}
         </div>

         <div className="lg:col-span-4 space-y-6">
            <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8">
               <div className="flex items-center space-x-3 mb-8 text-primary">
                  <ShieldCheck size={20} />
                  <h3 className="font-bold text-xs tracking-[0.2em] uppercase">Security Health</h3>
               </div>
               <div className="space-y-5">
                  <SnapshotMetric label="Auth Integrity" value="Hardened" />
                  <SnapshotMetric label="Audit Retention" value="7 Years" />
                  <SnapshotMetric label="Data Residency" value="US-East-1" />
                  <SnapshotMetric label="RBAC Level" value="v4.2" />
               </div>
               <button className="w-full mt-10 py-3 bg-white border border-primary/20 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">Download Safety Certificate</button>
            </div>
            
            <div className="p-8 bg-slate-900 rounded-3xl text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Zap size={80} className="text-secondary" /></div>
               <h3 className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-6 border-l-2 border-secondary pl-4">Automation Hub</h3>
               <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold">
                     <span className="text-slate-400">Scheduled Actions</span>
                     <span>12 / Day</span>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full bg-secondary w-3/4" />
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">"Next cycle trigger: Dec 01. 1,400 notification packets scheduled."</p>
               </div>
            </div>
         </div>
      </div>

      {/* RBAC Edit Sidebar Simulation */}
      {editingRole && (
        <>
          <div className="fixed inset-0 z-[150] bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setEditingRole(null)}></div>
          <div className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-white z-[160] shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
             <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center space-x-4">
                   <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg"><Lock size={24}/></div>
                   <div>
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight">Permissions: {editingRole}</h3>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Global Role Strategy</p>
                   </div>
                </div>
                <button onClick={() => setEditingRole(null)} className="p-2 text-slate-400 hover:bg-slate-200 rounded-lg transition-all"><X size={24}/></button>
             </div>
             
             <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                <section className="space-y-6">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Institutional Data Access</h4>
                   <div className="space-y-3">
                      <PermissionToggle label="View Compensation Benchmarks" desc="Allow users to see cohort pay ranges." />
                      <PermissionToggle label="Access Bias Audits" desc="Allow viewing of AI fairness reporting." active />
                      <PermissionToggle label="Export Strategic Datasets" desc="Allow bulk CSV/PDF downloads." active />
                   </div>
                </section>
                
                <section className="space-y-6">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Functional Controls</h4>
                   <div className="space-y-3">
                      <PermissionToggle label="Manual Rating Overrides" desc="Ability to change system-generated scores." active />
                      <PermissionToggle label="Mid-Cycle Objective Creation" desc="Ability to add goals during active windows." active />
                      <PermissionToggle label="Force System Refresh" desc="Trigger global node synchronization." />
                   </div>
                </section>
             </div>
             
             <div className="p-8 border-t border-slate-100 bg-slate-50 flex items-center justify-end space-x-3">
                <button onClick={() => setEditingRole(null)} className="px-6 py-2.5 text-sm font-bold text-slate-500">Cancel</button>
                <button onClick={() => setEditingRole(null)} className="px-10 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20">Apply Changes</button>
             </div>
          </div>
        </>
      )}
    </div>
  );
};

const SettingsTab = ({ active, onClick, label, icon }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center space-x-2 px-6 py-4 text-xs font-bold transition-all relative whitespace-nowrap shrink-0 ${
      active ? 'text-primary' : 'text-slate-500 hover:text-slate-800'
    }`}
  >
    {icon}
    <span>{label}</span>
    {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-in fade-in duration-300" />}
  </button>
);

const SectionHeader = ({ title, desc }: any) => (
  <div>
    <h3 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h3>
    <p className="text-slate-500 text-sm mt-1 font-medium leading-relaxed">{desc}</p>
  </div>
);

const SnapshotMetric = ({ label, value }: any) => (
  <div className="flex justify-between items-center">
     <span className="text-[11px] font-medium text-slate-600">{label}</span>
     <span className="text-[10px] font-black text-primary uppercase tracking-widest">{value}</span>
  </div>
);

const RBACCard = ({ role, permissions, active, onEdit }: any) => (
  <div onClick={onEdit} className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-center justify-between group hover:bg-white hover:border-primary/20 transition-all cursor-pointer shadow-sm">
     <div className="flex-1 pr-6">
        <h4 className="text-base font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">{role}</h4>
        <div className="flex flex-wrap gap-2">
           {permissions.map(p => (
              <span key={p} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{p}</span>
           ))}
        </div>
     </div>
     <div className="p-3 bg-white rounded-2xl text-slate-300 group-hover:text-primary group-hover:shadow-md transition-all">
        <ChevronRight size={18} />
     </div>
  </div>
);

const TriggerRow = ({ label, trigger, channel, active }: any) => (
  <div className="p-5 border border-slate-100 rounded-2xl flex items-center justify-between group hover:bg-slate-50/50 transition-all">
     <div className="flex items-center space-x-5">
        <div className={`p-3 rounded-xl transition-all ${active ? 'bg-primary/5 text-primary' : 'bg-slate-100 text-slate-400'}`}>
           <Activity size={20} />
        </div>
        <div>
           <p className="text-sm font-bold text-slate-900">{label}</p>
           <div className="flex items-center space-x-3 mt-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{trigger}</span>
              <span className="w-1 h-1 bg-slate-200 rounded-full" />
              <div className="flex items-center space-x-1.5 text-primary">
                 <Mail size={12} />
                 <span className="text-[10px] font-bold uppercase">{channel}</span>
              </div>
           </div>
        </div>
     </div>
     <div className={`w-10 h-5 rounded-full relative transition-all cursor-pointer ${active ? 'bg-primary' : 'bg-slate-200'}`}>
        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${active ? 'right-0.5' : 'left-0.5'}`} />
     </div>
  </div>
);

const PermissionToggle = ({ label, desc, active }: any) => (
   <div className="p-4 border border-slate-100 rounded-2xl flex items-center justify-between hover:bg-slate-50/50 transition-all cursor-pointer group">
      <div>
         <p className="text-xs font-bold text-slate-900">{label}</p>
         <p className="text-[10px] text-slate-400 font-medium mt-0.5">{desc}</p>
      </div>
      <div className={`w-8 h-4 rounded-full relative transition-all ${active ? 'bg-primary' : 'bg-slate-200'}`}>
         <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${active ? 'right-0.5' : 'left-0.5'}`} />
      </div>
   </div>
);

export default SettingsPage;
