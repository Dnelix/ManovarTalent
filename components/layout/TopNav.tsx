
import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  ChevronDown, 
  MessageSquareCode,
  Globe,
  Building,
  LayoutGrid,
  Play,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '../../types';

interface TopNavProps {
  user: User;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onToggleAssistant: () => void;
}

const TopNav: React.FC<TopNavProps> = ({ user, activeRole, onRoleChange, onToggleAssistant }) => {
  const [workspace, setWorkspace] = useState('Manovar Enterprise');
  const navigate = useNavigate();

  const handleNewSimulation = () => {
    navigate('/planning');
    // In a real app, we might use a global state or search params to trigger the modal immediately
  };

  const isLeadership = [UserRole.ORG_ADMIN, UserRole.EXECUTIVE, UserRole.MANAGER].includes(activeRole);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-30 shadow-sm">
      <div className="flex items-center space-x-6 flex-1">
        {/* Workspace/Tenant Selector */}
        <div className="flex items-center space-x-3 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group">
          <div className="w-6 h-6 bg-slate-900 text-white rounded-lg flex items-center justify-center">
            <Building size={14} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase leading-none mb-0.5">Workspace</span>
            <div className="flex items-center space-x-1">
              <span className="text-xs font-bold text-slate-800">{workspace}</span>
              <ChevronDown size={12} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
            </div>
          </div>
        </div>

        <div className="h-6 w-[1px] bg-slate-200"></div>

        <div className="relative w-80 max-w-full group">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search objectives, people, or metrics..."
            className="w-full bg-slate-50 border border-transparent focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 rounded-xl pl-10 pr-4 py-2 text-xs outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {isLeadership && (
          <button 
            onClick={handleNewSimulation}
            className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
          >
            <Play size={12} fill="currentColor" />
            <span>New Simulation</span>
          </button>
        )}

        {/* Role Switcher */}
        <div className="relative flex items-center">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
             <LayoutGrid size={14} />
          </div>
          <select 
            value={activeRole}
            onChange={(e) => onRoleChange(e.target.value as UserRole)}
            className="appearance-none bg-white border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs font-bold text-slate-700 hover:border-slate-300 transition-colors cursor-pointer outline-none min-w-[160px] shadow-sm"
          >
            <option value={UserRole.ORG_ADMIN}>Organization admin</option>
            <option value={UserRole.EXECUTIVE}>Executives</option>
            <option value={UserRole.MANAGER}>Manager view</option>
            <option value={UserRole.HR}>HR view</option>
            <option value={UserRole.EMPLOYEE}>Employee view</option>
          </select>
          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={onToggleAssistant}
            className="p-2 text-slate-600 hover:bg-slate-100 hover:text-primary rounded-xl transition-all relative group"
            title="AI Assistant"
          >
            <MessageSquareCode size={20} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-secondary rounded-full border-2 border-white"></span>
          </button>

          <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
            <Globe size={20} />
          </button>

          <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>

        <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>

        <div className="flex items-center space-x-3 hover:bg-slate-50 px-2 py-1 rounded-xl cursor-pointer transition-colors group">
          <div className="text-right">
            <p className="text-xs font-black text-slate-800 leading-none">{user.name}</p>
            <p className="text-[9px] text-slate-400 font-black uppercase mt-1 tracking-wider">{user.department}</p>
          </div>
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-9 h-9 rounded-xl border-2 border-white shadow-sm ring-1 ring-slate-200 group-hover:ring-primary/30 transition-all"
          />
        </div>
      </div>
    </header>
  );
};

export default TopNav;
