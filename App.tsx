// Removed redundant and malformed UserRole definition and incorrect import
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserRole, User } from './types';
import MainLayout from './components/layout/MainLayout';
import DashboardPage from './pages/Dashboard';
import OrganizationPage from './pages/Organization';
import ObjectivesPage from './pages/Objectives';
import AppraisalsPage from './pages/Appraisals';
import PlanningPage from './pages/Planning';
import PeoplePage from './pages/People';
import IntegrationsPage from './pages/Integrations';
import ReportsPage from './pages/Reports';
import SettingsPage from './pages/Settings';
import PolicyStudioPage from './pages/PolicyStudio';
import AuditLogPage from './pages/AuditLog';
import InitiatePIPPage from './pages/InitiatePIP';

const mockUser: User = {
  id: 'u1',
  name: 'Alex Rivera',
  email: 'alex@manovar.ai',
  roles: [
    UserRole.ORG_ADMIN, 
    UserRole.EXECUTIVE, 
    UserRole.MANAGER, 
    UserRole.HR, 
    UserRole.EMPLOYEE
  ],
  department: 'Product Strategy',
  avatar: 'https://picsum.photos/seed/alex/100/100'
};

const App: React.FC = () => {
  const [activeRole, setActiveRole] = useState<UserRole>(UserRole.ORG_ADMIN);

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
  };

  return (
    <HashRouter>
      <MainLayout 
        user={mockUser} 
        activeRole={activeRole} 
        onRoleChange={handleRoleChange}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage role={activeRole} />} />
          <Route path="/organization" element={<OrganizationPage role={activeRole} />} />
          <Route path="/objectives" element={<ObjectivesPage role={activeRole} />} />
          <Route path="/appraisals" element={<AppraisalsPage role={activeRole} />} />
          <Route path="/policy-studio" element={<PolicyStudioPage />} />
          <Route path="/planning" element={<PlanningPage role={activeRole} />} />
          <Route path="/people" element={<PeoplePage role={activeRole} />} />
          <Route path="/integrations" element={<IntegrationsPage role={activeRole} />} />
          <Route path="/reports" element={<ReportsPage role={activeRole} />} />
          <Route path="/audit-log" element={<AuditLogPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/initiate-pip/:id" element={<InitiatePIPPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </MainLayout>
    </HashRouter>
  );
};

export default App;