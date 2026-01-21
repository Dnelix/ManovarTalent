import React, { useState } from 'react';
import { 
  Puzzle, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Plus,
  ArrowRight,
  Shield,
  Zap,
  X,
  Search,
  ExternalLink,
  Settings,
  Database,
  Lock,
  Workflow,
  Trash2,
  Fingerprint,
  Info,
  GraduationCap
} from 'lucide-react';
import { UserRole } from '../types';

const AVAILABLE_TOOLS = [
  { id: 'slack', name: 'Slack', category: 'Communication', logo: 'https://cdn-icons-png.flaticon.com/512/5968/5968929.png', desc: 'Notification feeds and interactive performance summaries.' },
  { id: 'jira', name: 'Jira', category: 'Project Management', logo: 'https://cdn-icons-png.flaticon.com/512/5968/5968812.png', desc: 'SLA compliance, ticket resolution time and project velocity.' },
  { id: 'github', name: 'GitHub', category: 'Development', logo: 'https://cdn-icons-png.flaticon.com/512/25/25231.png', desc: 'Repo activity, PR velocity, and code quality metrics.' },
  { id: 'salesforce', name: 'Salesforce', category: 'CRM', logo: 'https://cdn-icons-png.flaticon.com/512/5968/5968914.png', desc: 'Pipeline value, win rates, and quota attainment.' },
  { id: 'cornerstone', name: 'Cornerstone', category: 'LMS', logo: 'https://www.cornerstoneondemand.com/favicon.ico', desc: 'Sync training progress and suggest courses for IDPs.' },
  { id: 'udemy', name: 'Udemy Business', category: 'LMS', logo: 'https://www.udemy.com/static/images/favicon.ico', desc: 'Enterprise-grade course library mapping for skills growth.' },
  { id: 'hubspot', name: 'HubSpot', category: 'CRM', logo: 'https://cdn-icons-png.flaticon.com/512/5968/5968872.png', desc: 'Marketing attribution and lead conversion performance.' },
  { id: 'notion', name: 'Notion', category: 'Knowledge', logo: 'https://cdn-icons-png.flaticon.com/512/5968/5968936.png', desc: 'Doc engagement and knowledge base contribution metrics.' },
];

const INITIAL_ACTIVE = [
  { 
    id: 'github', 
    name: 'GitHub', 
    desc: 'Repo activity, PR velocity, code quality metrics', 
    status: 'Connected', 
    lastSync: '2 mins ago', 
    mappedCount: 14, 
    logo: 'https://cdn-icons-png.flaticon.com/512/25/25231.png',
    permissions: 'Read-only (Repos, PRs)',
    freshness: 'High (Webhooks)',
    mappings: [
      { label: 'PR Throughput', field: 'pull_requests.closed' },
      { label: 'Review Lead Time', field: 'reviews.duration_avg' },
      { label: 'Deploy Frequency', field: 'actions.workflow_success' }
    ]
  },
  { 
    id: 'salesforce', 
    name: 'Salesforce', 
    desc: 'Pipeline value, win rates, quota attainment', 
    status: 'Connected', 
    lastSync: '1 hour ago', 
    mappedCount: 8, 
    logo: 'https://cdn-icons-png.flaticon.com/512/5968/5968914.png',
    permissions: 'Read (Opportunities, Quotas)',
    freshness: 'Stable (Polling)',
    mappings: [
      { label: 'Pipeline Velocity', field: 'opportunity.stage_velocity' },
      { label: 'Quota Hit Rate', field: 'user.quota_attainment' }
    ]
  }
];

interface IntegrationsPageProps {
  role?: UserRole;
}

const IntegrationsPage: React.FC<IntegrationsPageProps> = ({ role = UserRole.ORG_ADMIN }) => {
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);
  const [activeIntegrations, setActiveIntegrations] = useState(INITIAL_ACTIVE);
  const [configIntegration, setConfigIntegration] = useState<any>(null);
  const [syncingAll, setSyncingAll] = useState(false);
  const [isUpdatingScopes, setIsUpdatingScopes] = useState(false);

  const canManage = role === UserRole.ORG_ADMIN;

  const handleSyncAll = () => {
    setSyncingAll(true);
    setTimeout(() => {
      setActiveIntegrations(prev => prev.map(item => ({ ...item, lastSync: 'Just now' })));
      setSyncingAll(false);
    }, 2000);
  };

  const handleConnectTool = (tool: any) => {
    if (activeIntegrations.find(a => a.id === tool.id)) {
      setIsMarketplaceOpen(false);
      return;
    }

    const newIntegration = {
      ...tool,
      status: 'Connected',
      lastSync: 'Just now',
      mappedCount: 0,
      permissions: 'Standard Access',
      freshness: 'Syncing...',
      mappings: []
    };

    setActiveIntegrations([newIntegration, ...activeIntegrations]);
    setIsMarketplaceOpen(false);
    setConfigIntegration(newIntegration);
  };

  const handleUpdateScopes = () => {
    setIsUpdatingScopes(true);
    setTimeout(() => {
      setIsUpdatingScopes(false);
      if (configIntegration) {
        const updated = { ...configIntegration, permissions: 'Enhanced Access (Extended)' };
        setConfigIntegration(updated);
        setActiveIntegrations(prev => prev.map(a => a.id === updated.id ? updated : a));
      }
    }, 1500);
  };

  const handleAddMapping = () => {
    if (!configIntegration) return;
    const newMapping = { label: 'New Metric', field: 'unmapped.field_key' };
    const updated = {
      ...configIntegration,
      mappings: [...(configIntegration.mappings || []), newMapping],
      mappedCount: (configIntegration.mappings || []).length + 1
    };
    setConfigIntegration(updated);
    setActiveIntegrations(prev => prev.map(a => a.id === updated.id ? updated : a));
  };

  const handleDeleteMapping = (index: number) => {
    if (!configIntegration) return;
    const updatedMappings = [...configIntegration.mappings];
    updatedMappings.splice(index, 1);
    const updated = {
      ...configIntegration,
      mappings: updatedMappings,
      mappedCount: updatedMappings.length
    };
    setConfigIntegration(updated);
    setActiveIntegrations(prev => prev.map(a => a.id === updated.id ? updated : a));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Data Integrations</h1>
          <p className="text-slate-500 text-sm mt-1">Power your Real-Time KPI Tracking (RKT) with live data streams</p>
        </div>
        {canManage && (
          <button 
            onClick={() => setIsMarketplaceOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
          >
            <Plus size={16} />
            <span>New Integration</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsTile label="Connected Tools" value={activeIntegrations.length.toString()} icon={<Puzzle className="text-primary" />} />
        <StatsTile label="Live Metrics" value={activeIntegrations.reduce((acc, curr) => acc + curr.mappedCount, 0).toString()} icon={<Zap className="text-secondary" />} />
        <StatsTile label="Data Health" value="99.8%" icon={<Shield className="text-green-600" />} />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h3 className="font-bold text-slate-900">Active Connections</h3>
          <div className="flex space-x-2">
             <button 
               onClick={handleSyncAll}
               disabled={syncingAll}
               className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all flex items-center space-x-2 disabled:opacity-50"
             >
                <RefreshCw size={14} className={syncingAll ? 'animate-spin' : ''} />
                <span>{syncingAll ? 'Syncing...' : 'Force Global Refresh'}</span>
             </button>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {activeIntegrations.map((item) => (
            <IntegrationItem 
              key={item.id}
              {...item}
              onConfigure={() => setConfigIntegration(item)}
              canManage={canManage}
            />
          ))}
          {activeIntegrations.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center">
              <Puzzle size={48} className="text-slate-200 mb-4" />
              <p className="text-slate-400 font-bold">No active integrations found.</p>
              <button onClick={() => setIsMarketplaceOpen(true)} className="mt-4 text-primary font-bold text-sm underline">Browse Marketplace</button>
            </div>
          )}
        </div>
      </div>

      {/* Integration Marketplace Modal */}
      {isMarketplaceOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
                  <Puzzle size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Integration Marketplace</h3>
                  <p className="text-xs text-slate-500">Connect your stack to Manovar performance intelligence</p>
                </div>
              </div>
              <button onClick={() => setIsMarketplaceOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-all">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 border-b border-slate-100 bg-white">
               <div className="relative">
                 <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                 <input type="text" placeholder="Search tools (e.g. Jira, Hubspot, Udemy)..." className="w-full bg-slate-100 border-none rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-4 focus:ring-primary/10 transition-all" />
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 md:grid-cols-3 gap-6 custom-scrollbar bg-slate-50/30">
               {AVAILABLE_TOOLS.map((tool) => {
                 const isActive = activeIntegrations.find(a => a.id === tool.id);
                 return (
                  <div key={tool.id} className={`bg-white border p-6 rounded-3xl hover:border-primary/40 hover:shadow-lg transition-all flex flex-col items-center text-center relative ${isActive ? 'border-primary/10 opacity-70' : 'border-slate-200'}`}>
                    {isActive && (
                      <div className="absolute top-4 right-4 text-green-500">
                        <CheckCircle2 size={20} />
                      </div>
                    )}
                    <div className="w-16 h-16 rounded-2xl border border-slate-100 p-3 bg-white mb-4 shadow-sm group-hover:scale-110 transition-transform overflow-hidden">
                      <img src={tool.logo} alt={tool.name} className="w-full h-full object-contain" />
                    </div>
                    <h4 className="font-bold text-slate-900">{tool.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 mb-3">{tool.category}</p>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-6 px-2">{tool.desc}</p>
                    <button 
                      onClick={() => !isActive && handleConnectTool(tool)}
                      disabled={!!isActive}
                      className={`mt-auto w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isActive ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-600 shadow-md'
                      }`}
                    >
                      {isActive ? 'Already Connected' : 'Connect Tool'}
                    </button>
                  </div>
                 );
               })}
            </div>
          </div>
        </div>
      )}

      {/* Configuration Modal */}
      {configIntegration && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
               <div className="flex items-center space-x-3">
                 <div className="p-2 border border-slate-100 rounded-xl">
                   <img src={configIntegration.logo} className="w-8 h-8 object-contain" />
                 </div>
                 <div>
                   <h3 className="text-lg font-bold text-slate-900">Manage {configIntegration.name}</h3>
                   <div className="flex items-center space-x-2">
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{configIntegration.freshness}</span>
                     <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                     <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">{configIntegration.status}</span>
                   </div>
                 </div>
               </div>
               <button onClick={() => setConfigIntegration(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
               <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-slate-400">
                        <Fingerprint size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Active Permissions</span>
                    </div>
                    <button 
                      onClick={handleUpdateScopes}
                      disabled={isUpdatingScopes}
                      className="text-xs font-bold text-primary flex items-center space-x-1.5 hover:underline disabled:opacity-50"
                    >
                      {isUpdatingScopes ? <RefreshCw size={12} className="animate-spin" /> : <Settings size={12} />}
                      <span>{isUpdatingScopes ? 'Updating...' : 'Update Scopes'}</span>
                    </button>
                 </div>
                 <div className="p-4 border border-green-100 bg-green-50/50 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                       <CheckCircle2 size={20} className="text-green-600" />
                       <div>
                          <p className="text-sm font-bold text-green-900">{configIntegration.permissions}</p>
                          <p className="text-[10px] text-green-700 font-medium">Authentication token refreshed 4h ago</p>
                       </div>
                    </div>
                    <div className="px-2 py-1 bg-white rounded border border-green-100 text-[9px] font-black text-green-600 uppercase">Secure</div>
                 </div>
               </div>

               <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-slate-400">
                        <Workflow size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Performance Metric Mappings ({configIntegration.mappings?.length || 0})</span>
                    </div>
                    <button 
                      onClick={handleAddMapping}
                      className="text-xs font-bold text-primary flex items-center space-x-1 p-2 bg-primary/5 rounded-lg hover:bg-primary/10 transition-all"
                    >
                       <Plus size={14} />
                       <span>Add Mapping</span>
                    </button>
                 </div>
                 <div className="space-y-2">
                    {configIntegration.mappings?.length > 0 ? (
                      configIntegration.mappings.map((mapping: any, idx: number) => (
                        <MappingRow 
                          key={idx} 
                          label={mapping.label} 
                          field={mapping.field} 
                          onDelete={() => handleDeleteMapping(idx)}
                        />
                      ))
                    ) : (
                      <div className="p-8 border-2 border-dashed border-slate-100 rounded-2xl text-center text-slate-400">
                         <p className="text-xs font-bold">No active mappings yet. Use "Add Mapping" to start tracking.</p>
                      </div>
                    )}
                 </div>
               </div>

               <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex items-start space-x-3">
                  <Info size={18} className="text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-700">Automation Trigger</h5>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Manovar Intelligence automatically pulls data from {configIntegration.name} every 15 minutes. High-priority RKT streams use real-time Webhooks where supported.
                    </p>
                  </div>
               </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between sticky bottom-0">
               <button 
                onClick={() => {
                  setActiveIntegrations(prev => prev.filter(a => a.id !== configIntegration.id));
                  setConfigIntegration(null);
                }}
                className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center space-x-2"
               >
                  <Trash2 size={14} />
                  <span>Disconnect</span>
               </button>
               <div className="flex space-x-3">
                  <button onClick={() => setConfigIntegration(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Dismiss</button>
                  <button onClick={() => setConfigIntegration(null)} className="px-8 py-2 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20">Apply Configuration</button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MappingRow = ({ label, field, onDelete }: any) => (
  <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl group hover:border-primary/20 transition-all shadow-sm">
    <div className="flex flex-col">
      <span className="text-xs font-bold text-slate-900">{label}</span>
      <code className="text-[9px] mt-1 text-slate-400 font-mono">{field}</code>
    </div>
    <div className="flex items-center space-x-2">
       <button className="p-2 text-slate-300 hover:text-primary transition-all rounded-lg hover:bg-slate-50">
          <Settings size={14} />
       </button>
       <button 
        onClick={onDelete}
        className="p-2 text-slate-300 hover:text-red-500 transition-all rounded-lg hover:bg-red-50"
       >
          <Trash2 size={14} />
       </button>
    </div>
  </div>
);

const StatsTile = ({ label, value, icon }: any) => (
  <div className="bg-white border border-slate-200 p-6 rounded-3xl flex items-center space-x-4 shadow-sm">
    <div className="p-3.5 bg-slate-50 rounded-2xl">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{label}</p>
      <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-none">{value}</h4>
    </div>
  </div>
);

const IntegrationItem = ({ name, desc, status, lastSync, mappedCount, logo, onConfigure, canManage, permissions, freshness }: any) => (
  <div className="p-6 flex items-center justify-between group hover:bg-slate-50/50 transition-all">
    <div className="flex items-center space-x-5 flex-1">
      <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 p-3 shadow-sm group-hover:scale-105 transition-all overflow-hidden">
         <img src={logo} alt={name} className={`w-full h-full object-contain transition-all ${status === 'Error' ? 'grayscale' : ''}`} />
      </div>
      <div className="max-w-md">
        <h4 className="font-bold text-slate-800 flex items-center">
          {name}
          <span className={`ml-3 px-2 py-0.5 rounded text-[8px] font-black uppercase flex items-center space-x-1 ${
            status === 'Connected' ? 'bg-green-100 text-green-700' : 
            status === 'Error' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
          }`}>
            {status === 'Connected' && <CheckCircle2 size={8} />}
            {status === 'Error' && <AlertCircle size={8} />}
            <span>{status}</span>
          </span>
        </h4>
        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{desc}</p>
        <div className="flex items-center space-x-3 mt-2">
          <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-tight">
            <Fingerprint size={10} className="mr-1" /> {permissions}
          </div>
          <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
          <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-tight">
            <RefreshCw size={10} className="mr-1" /> {freshness}
          </div>
        </div>
      </div>
    </div>

    <div className="flex items-center space-x-10">
      <div className="text-right hidden sm:block">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Metrics</p>
        <div className="flex items-center justify-end space-x-1.5">
          <Zap size={12} className="text-secondary" />
          <span className="text-sm font-black text-slate-800">{mappedCount}</span>
        </div>
      </div>
      <div className="text-right hidden md:block">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Data Freshness</p>
        <span className="text-xs font-bold text-slate-700">{lastSync}</span>
      </div>
      <div className="flex space-x-2">
        <button 
          onClick={onConfigure}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            status === 'Error' ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100' : 'bg-white border border-slate-200 text-slate-700 hover:border-primary hover:text-primary'
          }`}
        >
          <span>{canManage ? 'Configure' : 'View Hub'}</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  </div>
);

export default IntegrationsPage;