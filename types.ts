
export enum UserRole {
  ORG_ADMIN = 'Organization admin',
  EXECUTIVE = 'Executives',
  HR = 'HR view',
  MANAGER = 'Manager view',
  EMPLOYEE = 'Employee view'
}

export interface User {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
  department: string;
  avatar?: string;
}

export type ObjectiveType = 'OKR' | 'KPI';
export type TrackingFrequency = 'Weekly' | 'Bi-weekly' | 'Monthly' | 'Real-time';

export interface Objective {
  id: string;
  title: string;
  description: string;
  type: ObjectiveType;
  ownerId: string;
  parentId?: string;
  weight: number;
  status: 'Draft' | 'Active' | 'Closed' | 'Archived' | 'Pending Approval';
  progress: number;
  confidence: number;
  keyResults: KeyResult[];
  trackingFrequency: TrackingFrequency;
  approvalWorkflow: string[]; // User IDs
  scoreContributions: {
    krWeight: number;
    objWeight: number;
    periodWeight: number;
  };
}

export interface KeyResult {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  source: 'Manual' | 'Integration';
  integrationId?: string;
  evidenceCount: number;
}

export interface Metric {
  id: string;
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  category: string;
}

export interface Integration {
  id: string;
  name: string;
  icon: string;
  status: 'Connected' | 'Disconnected' | 'Error';
  lastSync: string;
  mappedMetricsCount: number;
}

export interface Evaluation {
  id: string;
  objectiveId: string;
  selfScore: number;
  selfComment: string;
  managerScore?: number;
  managerComment?: string;
  peerInputs: {
    userId: string;
    score: number;
    comment: string;
  }[];
  aiInsight: string;
}
