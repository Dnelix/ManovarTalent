
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Workflow, 
  Award, 
  TrendingUp, 
  Users, 
  Puzzle, 
  FileText, 
  Settings,
  Gavel,
  History
} from 'lucide-react';
import { UserRole } from '../../types';

interface SidebarProps {
  activeRole: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ activeRole }) => {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { 
      name: 'Organization', 
      icon: Building2, 
      path: '/organization', 
      roles: [UserRole.ORG_ADMIN, UserRole.EXECUTIVE, UserRole.HR] 
    },
    { 
      name: 'Objectives', 
      icon: Workflow, 
      path: '/objectives' 
    },
    { 
      name: 'Appraisals', 
      icon: Award, 
      path: '/appraisals' 
    },
    { 
      name: 'Policy Studio', 
      icon: Gavel, 
      path: '/policy-studio',
      roles: [UserRole.ORG_ADMIN, UserRole.HR]
    },
    { 
      name: 'Planning', 
      icon: TrendingUp, 
      path: '/planning', 
      roles: [UserRole.EXECUTIVE, UserRole.ORG_ADMIN, UserRole.HR, UserRole.MANAGER] 
    },
    { 
      name: 'People', 
      icon: Users, 
      path: '/people', 
      roles: [UserRole.ORG_ADMIN, UserRole.HR, UserRole.MANAGER] 
    },
    { 
      name: 'Integrations', 
      icon: Puzzle, 
      path: '/integrations', 
      roles: [UserRole.ORG_ADMIN] 
    },
    { 
      name: 'Reports', 
      icon: FileText, 
      path: '/reports',
      roles: [UserRole.ORG_ADMIN, UserRole.EXECUTIVE, UserRole.HR, UserRole.MANAGER, UserRole.EMPLOYEE]
    },
    { 
      name: 'Audit Log', 
      icon: History, 
      path: '/audit-log',
      roles: [UserRole.ORG_ADMIN, UserRole.HR]
    },
    { 
      name: 'Settings', 
      icon: Settings, 
      path: '/settings', 
      roles: [UserRole.ORG_ADMIN] 
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800 shrink-0">
      <div className="p-6 flex items-center space-x-3">
        <div className="w-8 h-8 bg-primary rounded flex items-center justify-center font-bold text-white">M</div>
        <span className="text-xl font-bold text-white tracking-tight">Manovar</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          if (item.roles && !item.roles.includes(activeRole)) return null;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
                ${isActive 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'hover:bg-slate-800 hover:text-white'}
              `}
            >
              <item.icon size={20} className="shrink-0" />
              <span className="font-medium text-sm">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
          <p className="text-xs text-slate-500 font-semibold mb-2 uppercase tracking-wider">Storage Usage</p>
          <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-secondary w-3/4 rounded-full"></div>
          </div>
          <p className="text-[10px] text-slate-400">7.2GB / 10GB Used</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
