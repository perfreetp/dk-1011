export interface Area {
  id: string;
  name: string;
  type: 'available' | 'restricted' | 'forbidden';
  description: string;
  applicableTime: string;
  coordinates: string;
  status: string;
  applicationRequirements: string[];
  contactInfo: {
    phone: string;
    email: string;
  };
  nearbyRestrictions: string[];
  applicablePurposes: string[];
}

export interface Application {
  id: string;
  applicationNo: string;
  status: 'submitted' | 'accepted' | 'correction' | 'reviewing' | 'approved' | 'rejected';
  statusText: string;
  submitTime: string;
  updateTime: string;
  areaName: string;
  applicant: string;
  progressSteps: ProgressStep[];
  statusChanges: StatusChange[];
  correctionMaterials?: string[];
  approvalDocUrl?: string;
}

export interface ProgressStep {
  title: string;
  status: 'completed' | 'current' | 'pending';
  time?: string;
  description?: string;
}

export interface StatusChange {
  status: string;
  time: string;
  operator?: string;
  remark?: string;
}

export interface Rule {
  id: string;
  category: string;
  materials: string[];
  advanceDays: number;
  restrictions: string[];
  examples: string[];
}

export interface Consultation {
  id: string;
  question: string;
  category: string;
  submitTime: string;
  reply?: string;
  replyTime?: string;
  status: 'pending' | 'replied';
}

export interface Feedback {
  id: string;
  rating: number;
  comment: string;
  screenshot?: string;
  submitTime: string;
}

export interface ErrorReport {
  id: string;
  errorType: string;
  errorDetails: string;
  areaId?: string;
  areaName?: string;
  submitTime: string;
  status: 'pending' | 'processing' | 'resolved';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface QuickEntry {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
}

export interface TemplateFile {
  name: string;
  size: string;
  url: string;
}
