export type Role = 'admin' | 'advocate' | 'clerk' | 'client';

export type CaseStatus = 'Active' | 'Pending' | 'Closed';
export type Priority = 'High' | 'Medium' | 'Low';
export type HearingStatus = 'Scheduled' | 'Completed' | 'Adjourned' | 'Cancelled';
export type InvoiceStatus = 'Paid' | 'Partially Paid' | 'Pending' | 'Overdue';
export type DocumentType =
'Petition' |
'Evidence' |
'Court Order' |
'Agreement' |
'Identity Document' |
'Other';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  title: string;
  status: 'Active' | 'Suspended';
  lastActive: string;
  /** links a client user to their client record, or an advocate user to their advocate record */
  linkedId?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  notes: string;
  registeredOn: string;
  status: 'Active' | 'Inactive';
}

export interface Advocate {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  barNumber: string;
  yearsExperience: number;
  status: 'Active' | 'On Leave';
}

export interface LegalCase {
  id: string;
  caseNumber: string;
  title: string;
  type: string;
  description: string;
  clientId: string;
  advocateId: string;
  court: string;
  filedOn: string;
  status: CaseStatus;
  priority: Priority;
  nextHearing?: string;
  stage: string;
}

export interface Hearing {
  id: string;
  caseId: string;
  date: string;
  time: string;
  court: string;
  purpose: string;
  status: HearingStatus;
  judge: string;
}

export interface LegalDocument {
  id: string;
  name: string;
  caseId: string;
  type: DocumentType;
  uploadedBy: string;
  uploadedOn: string;
  size: string;
  status: 'Verified' | 'Pending Review' | 'Rejected';
  verifiedBy?: string;
  verifiedOn?: string;
  remarks?: string;
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
  method: string;
  note?: string;
  paidBy?: string;
}

export interface Invoice {
  id: string;
  clientId: string;
  caseId: string;
  description: string;
  amount: number;
  tax: number;
  issuedOn: string;
  dueOn: string;
  status: InvoiceStatus;
  paidOn?: string;
  method?: string;
  paidAmount?: number;
  payments?: Payment[];
}

export interface Proceeding {
  id: string;
  caseId: string;
  date: string;
  title: string;
  detail: string;
  updatedBy: string;
}

export interface ActivityItem {
  id: string;
  type: 'case' | 'client' | 'document' | 'hearing' | 'advocate' | 'billing';
  message: string;
  actor: string;
  at: string;
  caseId?: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  at: string;
  read: boolean;
  kind: 'hearing' | 'document' | 'billing' | 'case';
  href?: string;
}