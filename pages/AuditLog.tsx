
import React, { useState, useMemo } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  ChevronRight, 
  ShieldCheck, 
  Fingerprint, 
  ShieldAlert, 
  Activity, 
  User, 
  Calendar,
  X,
  Database,
  RefreshCw,
  Terminal,
  Globe,
  Lock,
  Cpu,
  ArrowUpRight,
  Info,
  MoreVertical,
  ChevronDown
} from 'lucide-react';
import Pagination from '../components/common/Pagination';

// --- MOCK DATA ---

const MOCK_AUDIT_DATA = [
  { id: 'ev-101', timestamp: '2024-10-15 14:22:11', actor: 'Alex Rivera', role: 'Org Admin', action: 'RBAC Policy Update', target: 'Manager Roles', category: 'Security', severity: 'Medium', ip: '192.168.1.1', status: 'Success' },
  { id: 'ev-102', timestamp: '2024-10-15 13:45:04', actor: 'HR System', role: 'Automation', action: 'Cycle Initiation', target: 'FY24 Q4 Calibration', category: 'System', severity: 'Low', ip: 'Internal', status: 'Success' },
  { id: 'ev-103', timestamp: '2024-10-15 11:12:30', actor: 'Marcus Vane', role: 'Manager', action: 'Rating Override', target: 'Sarah Chen (u45)', category: 'Performance', severity: 'High', ip: '45.12.33.102', status: 'Flagged' },
  { id: 'ev-104', timestamp: '2024-10-14 23:58:12', actor: 'System Auth', role: 'Service', action: 'Token Rotation', target: 'API Gateway', category: 'Security', severity: 'Low', ip: 'Internal', status: 'Success' },
  { id: 'ev-105', timestamp: '2024-10-14 16:20:45', actor: 'Elena Rossi', role: 'Manager', action: 'Objective Archive', target: 'DEP-04 Strategy', category: 'Governance', severity: 'Medium', ip: '82.112.5.4', status: 'Success' },
  { id: 'ev-106', timestamp: '2024-10-14 09:05:00', actor: 'Alex Rivera', role: 'Org Admin', action: 'Emergency System Lock', target: 'Tenant: Manovar Enterprise', category: 'Security', severity: 'Critical', ip: '192.168.1.1', status: 'Success' },
  { id: 'ev-107', timestamp: '2024-10-13 19:30:22', actor: 'GitHub Sync', role: 'Integration', action: 'Metric Sync Failure', target: 'Repo: core-engine', category: 'Integration', severity: 'Medium', ip: 'GitHub Hook', status: 'Error' },
  { id: 'ev-108', timestamp: '2024-10-13 14:15:10', actor: 'Sarah Chen', role: 'Employee', action: 'Self-Appraisal Submit', target: 'Cycle: Q3 Pulse', category: 'Performance', severity: 'Low', ip: '102.14.55.2', status: 'Success' },
  { id: 'ev-109', timestamp: '2024-10-12 11:00:00', actor: 'David Wright', role: 'HR view', action: 'Export Dataset', target: 'Compensation: Engineering', category: 'Governance', severity: 'High', ip: '12.4.5.99', status: 'Success' },
];

const AuditLogPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  
  const itemsPerPage = 8;

  const filteredLogs = useMemo(() => {
    return MOCK_AUDIT_DATA.filter(log => {
      const matchesSearch = log.actor.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.target.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'All' || log.category === filterCategory;
      const matchesSeverity = filterSeverity === 'All' || log.severity === filterSeverity;
      return matchesSearch && matchesCategory && matchesSeverity;
    });
  }, [searchTerm, filterCategory, filterSeverity]);

  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => setIsExporting(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight uppercase leading-none">Institutional Audit Trail</h1>
          <p className="text-slate-500 text-sm mt-2">Immutable historical ledger of system, performance, and security events</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all disabled:opacity-50"
          >
            {isExporting ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
            <span>{isExporting ? 'Packaging...' : 'Export Audit Log'}</span>
          </button>
          <div className="h-10 w-[1px] bg-slate-200 mx-1"></div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 border border-green-100 text-green-700 rounded-xl">
             <ShieldCheck size={16} />
             <span className="text-[10px] font-black uppercase tracking-widest leading-none mt-0.5">Integrity Verified</span>
          </div>
        </div>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AuditStatCard label="Total Events (24h)" value="1,422" delta="+12%" icon={<Activity size={20} className="text-primary"/>} />
        <AuditStatCard label="Security Flags" value="03" delta="Stable" icon={<ShieldAlert size={20} className="text-red-500"/>} />
        <AuditStatCard label="Active Admins" value="02" delta="Alex R., HR" icon={<Lock size={20} className="text-indigo-600"/>} />
        <AuditStatCard label="Chain Integrity" value="99.9%" delta="Verified" icon={<Fingerprint size={20} className="text-green-600"/>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Filter Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
           <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-8 sticky top-6">
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center">
                    <Search size={12} className="mr-2" /> Global Search
                 </label>
                 <div className="relative group">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="text" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Actor, ID, or action..." 
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-4 py-2.5 text-xs font-bold outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all" 
                    />
                 </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-50">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Event Category</label>
                 <div className="space-y-1">
                    {['All', 'Security', 'Performance', 'Governance', 'Integration', 'System'].map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                          filterCategory === cat ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                         <span>{cat}</span>
                         {filterCategory === cat && <ChevronRight size={14} />}
                      </button>
                    ))}
                 </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-50">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Severity Filter</label>
                 <div className="flex flex-wrap gap-2">
                    {['All', 'Low', 'Medium', 'High', 'Critical'].map(sev => (
                       <button 
                         key={sev}
                         onClick={() => setFilterSeverity(sev)}
                         className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${
                           filterSeverity === sev ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'
                         }`}
                       >
                          {sev}
                       </button>
                    ))}
                 </div>
              </div>

              <div className="p-4 bg-slate-900 rounded-[2rem] text-white relative overflow-hidden group shadow-xl">
                 <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity"><Cpu size={48} className="text-primary"/></div>
                 <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-3 border-l-2 border-primary pl-4">System Node</h4>
                 <p className="text-xs text-slate-400 font-medium leading-relaxed italic">
                    All administrative actions are signed with ephemeral hardware keys. Encryption layer active.
                 </p>
              </div>
           </div>
        </aside>

        {/* Audit Log Table Area */}
        <div className="lg:col-span-9 space-y-6">
           <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col min-h-[600px]">
              <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                 <div className="flex items-center space-x-3">
                    <Terminal size={18} className="text-slate-400" />
                    <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest">Active Ledger Stream</h3>
                 </div>
                 <div className="flex items-center space-x-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase bg-white border border-slate-100 px-3 py-1 rounded-full shadow-sm">{filteredLogs.length} Events Total</span>
                    <button className="p-2 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-xl transition-all"><RefreshCw size={14}/></button>
                 </div>
              </div>

              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-slate-50/30 border-b border-slate-100">
                       <tr>
                          <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Time & Metadata</th>
                          <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actor Context</th>
                          <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action Vector</th>
                          <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Severity</th>
                          <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Detail</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {paginatedLogs.map(log => (
                         <tr 
                          key={log.id} 
                          onClick={() => setSelectedEvent(log)}
                          className="hover:bg-slate-50/50 group transition-all cursor-pointer"
                         >
                            <td className="px-8 py-6">
                               <div className="flex flex-col space-y-1">
                                  <span className="text-[10px] font-black text-slate-800 font-mono tracking-tighter uppercase">{log.timestamp}</span>
                                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                                     <Globe size={10} className="mr-1" /> {log.ip}
                                  </span>
                               </div>
                            </td>
                            <td className="px-8 py-6">
                               <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shadow-inner group-hover:bg-white transition-all">
                                     <User size={14} />
                                  </div>
                                  <div>
                                     <p className="text-xs font-black text-slate-900 group-hover:text-primary transition-colors">{log.actor}</p>
                                     <p className="text-[9px] font-bold text-slate-400 uppercase">{log.role}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="px-8 py-6">
                               <p className="text-sm font-bold text-slate-800 tracking-tight uppercase">{log.action}</p>
                               <div className="flex items-center space-x-2 mt-1">
                                  <span className="text-[9px] font-black text-slate-400 uppercase">Target:</span>
                                  <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{log.target}</span>
                               </div>
                            </td>
                            <td className="px-8 py-6">
                               <div className="flex justify-center">
                                  <SeverityBadge severity={log.severity} />
                               </div>
                            </td>
                            <td className="px-8 py-6 text-right">
                               <button className="p-2 text-slate-300 hover:text-primary transition-all group-hover:bg-white rounded-xl shadow-sm">
                                  <ChevronRight size={18} />
                               </button>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
                 {filteredLogs.length === 0 && (
                   <div className="py-32 text-center flex flex-col items-center justify-center space-y-4">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 shadow-inner">
                        <History size={40} />
                      </div>
                      <div>
                        <p className="text-slate-900 font-black uppercase tracking-widest text-sm leading-none">No records matched</p>
                        <p className="text-slate-400 text-xs font-medium mt-2">Try adjusting your filters or search term.</p>
                      </div>
                   </div>
                 )}
              </div>
              <div className="mt-auto">
                <Pagination 
                  currentPage={currentPage} 
                  totalItems={filteredLogs.length} 
                  itemsPerPage={itemsPerPage} 
                  onPageChange={setCurrentPage} 
                />
              </div>
           </div>
        </div>
      </div>

      {/* Detail Slide-over */}
      {selectedEvent && (
        <>
          <div className="fixed inset-0 z-[150] bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedEvent(null)}></div>
          <div className="fixed top-0 right-0 bottom-0 w-full sm:w-[500px] bg-white z-[160] shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden">
             <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center space-x-4">
                   <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg"><Terminal size={24}/></div>
                   <div>
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-none uppercase">Event Metadata</h3>
                      <p className="text-xs text-slate-500 mt-1 font-bold uppercase tracking-widest">ID: {selectedEvent.id}</p>
                   </div>
                </div>
                <button onClick={() => setSelectedEvent(null)} className="p-2 text-slate-400 hover:bg-slate-200 rounded-lg transition-all"><X size={24}/></button>
             </div>

             <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Institutional Signature</h4>
                   <div className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] space-y-6 shadow-inner">
                      <div className="grid grid-cols-2 gap-6">
                         <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase">Actor ID</p>
                            <p className="text-sm font-bold text-slate-900">{selectedEvent.actor}</p>
                         </div>
                         <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase">Auth Level</p>
                            <p className="text-sm font-bold text-slate-900">{selectedEvent.role}</p>
                         </div>
                      </div>
                      <div className="pt-4 border-t border-slate-200">
                         <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Immutable Hash</p>
                         <code className="text-[10px] font-mono bg-white p-2 rounded-lg border border-slate-100 block break-all text-slate-600 uppercase">
                            0x7f4a2b9c1d8e3f5a6b7c8d9e0f1a2b3c4d5e6f7a
                         </code>
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Raw Trace Data</h4>
                   <div className="p-6 bg-slate-900 rounded-[2rem] text-primary shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5"><Database size={100} /></div>
                      <pre className="text-[10px] font-mono leading-relaxed whitespace-pre-wrap relative z-10 opacity-90">
{`{
  "event_id": "${selectedEvent.id}",
  "type": "ADMIN_OVERRIDE",
  "actor_type": "USER_ID_742",
  "resource": "${selectedEvent.target}",
  "metadata": {
    "action_vector": "${selectedEvent.action}",
    "prev_state": "VERIFIED",
    "new_state": "MODIFIED",
    "logic_checksum": "SHA-256_7A2B"
  },
  "audit_version": "4.2.1"
}`}
                      </pre>
                   </div>
                </div>

                <div className="p-6 bg-amber-50 border-2 border-amber-100 rounded-[2rem] flex items-start space-x-4">
                   <Info size={20} className="text-amber-600 mt-0.5 shrink-0" />
                   <div>
                      <p className="text-xs font-black text-amber-900 uppercase tracking-tight leading-none mb-1.5">Compliance Note</p>
                      <p className="text-[10px] text-amber-700 leading-relaxed font-medium">
                         This event is stored in the cold-storage ledger for 7 years as per SOC-2 Policy v2.4. Unauthorized modification attempts trigger global lock.
                      </p>
                   </div>
                </div>
             </div>

             <div className="p-8 border-t border-slate-100 bg-slate-50 flex flex-col space-y-3">
                <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/40 hover:bg-black transition-all flex items-center justify-center space-x-2">
                   <Download size={14} />
                   <span>Download Signed Proof</span>
                </button>
                <button className="w-full py-4 border-2 border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Verify Chain Consistency</button>
             </div>
          </div>
        </>
      )}
    </div>
  );
};

// --- View Helpers ---

const AuditStatCard = ({ label, value, delta, icon }: any) => (
  <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all group cursor-default">
    <div className="flex justify-between items-start mb-6">
      <div className="p-3 bg-slate-50 rounded-2xl group-hover:scale-105 transition-transform shadow-inner">{icon}</div>
      <div className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
        delta === 'Stable' ? 'bg-slate-100 text-slate-500' : 'bg-green-50 text-green-600 border border-green-100'
      }`}>
        {delta !== 'Stable' && delta !== 'Verified' && <ArrowUpRight size={10} />}
        <span>{delta}</span>
      </div>
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{label}</p>
    <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-none">{value}</h4>
  </div>
);

const SeverityBadge = ({ severity }: { severity: string }) => {
  const styles: any = {
    'Critical': 'bg-red-900 text-white border-red-900 shadow-lg shadow-red-200',
    'High': 'bg-red-50 text-red-600 border-red-100',
    'Medium': 'bg-amber-50 text-amber-600 border-amber-100',
    'Low': 'bg-green-50 text-green-600 border-green-100',
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${styles[severity] || 'bg-slate-50 text-slate-500 border-slate-200'}`}>
       {severity}
    </span>
  );
};

export default AuditLogPage;
