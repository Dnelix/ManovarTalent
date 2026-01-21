
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import { User, UserRole } from '../../types';
import AIAssistant from '../ai/AIAssistant';

interface MainLayoutProps {
  children: React.ReactNode;
  user: User;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, user, activeRole, onRoleChange }) => {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <Sidebar activeRole={activeRole} />
      
      <div className="flex flex-col flex-1 relative min-w-0">
        <TopNav 
          user={user} 
          activeRole={activeRole} 
          onRoleChange={onRoleChange}
          onToggleAssistant={() => setIsAssistantOpen(!isAssistantOpen)}
        />
        
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <div className="max-w-7xl mx-auto space-y-6 pb-12">
            {children}
          </div>
        </main>

        {isAssistantOpen && (
          <AIAssistant onClose={() => setIsAssistantOpen(false)} />
        )}
      </div>
    </div>
  );
};

export default MainLayout;
