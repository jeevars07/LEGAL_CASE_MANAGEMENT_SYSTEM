import type { LegalCase, Proceeding } from '../types';

export const caseTypes = [
  'Civil Suit',
  'Corporate Dispute',
  'Criminal Defence',
  'Family Law',
  'Property Dispute',
  'Employment Tribunal',
  'Contract Dispute'
];

export const courts = [
  'Madras High Court, Chennai',
  'Madras High Court (Madurai Bench)',
  'City Civil Court, Chennai',
  'District & Sessions Court, Coimbatore',
  'District Court, Madurai',
  'District Court, Tiruchirappalli',
  'District & Sessions Court, Salem',
  'Commercial Court, Chennai',
  'Supreme Court of India, New Delhi'
];

export const cases: LegalCase[] = [
{
  id: 'LC-1024',
  caseNumber: 'CIV/2026/00412',
  title: 'Mehta v. Northbay Property Trust',
  type: 'Property Dispute',
  description:
  'Claim for specific performance and damages arising from the failed transfer of a commercial leasehold at Anna Salai, Chennai. Client seeks enforcement of the sale agreement dated 14 January 2026 and recovery of deposit monies held in escrow.',
  clientId: 'CL-1001',
  advocateId: 'ADV-101',
  court: 'Madras High Court, Chennai',
  filedOn: '2026-02-10',
  status: 'Active',
  priority: 'High',
  nextHearing: '2026-08-18',
  stage: 'Evidence & Discovery'
},
{
  id: 'LC-1023',
  caseNumber: 'COM/2026/00287',
  title: 'Vaughn Retail Group v. Orenda Supply Co.',
  type: 'Contract Dispute',
  description:
  'Breach of a three-year exclusive supply agreement across Tamil Nadu outlets. Claim covers unrecovered advance payments, loss of margin across 14 stores, and injunctive relief restraining the defendant from supplying competitors.',
  clientId: 'CL-1002',
  advocateId: 'ADV-102',
  court: 'Commercial Court, Chennai',
  filedOn: '2026-01-28',
  status: 'Active',
  priority: 'High',
  nextHearing: '2026-08-14',
  stage: 'Interlocutory Applications'
},
{
  id: 'LC-1022',
  caseNumber: 'CIV/2026/00355',
  title: 'Petrova v. Halden Studio Partners',
  type: 'Contract Dispute',
  description:
  'Dispute over ownership of design IP and unpaid profit share following dissolution of a two-person studio partnership in Coimbatore.',
  clientId: 'CL-1003',
  advocateId: 'ADV-101',
  court: 'Madras High Court, Chennai',
  filedOn: '2026-03-04',
  status: 'Active',
  priority: 'Medium',
  nextHearing: '2026-08-21',
  stage: 'Pleadings Complete'
},
{
  id: 'LC-1021',
  caseNumber: 'PRO/2026/00119',
  title: 'In re Ferris Family Estate',
  type: 'Property Dispute',
  description:
  'Administration and partition of a four-property estate including contested valuation of agricultural land in Madurai.',
  clientId: 'CL-1004',
  advocateId: 'ADV-105',
  court: 'District & Sessions Court, Coimbatore',
  filedOn: '2025-11-19',
  status: 'Active',
  priority: 'Medium',
  nextHearing: '2026-09-02',
  stage: 'Valuation & Mediation'
},
{
  id: 'LC-1020',
  caseNumber: 'FAM/2026/00641',
  title: 'Adeyemi — Custody & Maintenance',
  type: 'Family Law',
  description:
  'Application for primary custody of two minors with an interim maintenance order and a supervised access schedule filed at Family Court, Chennai.',
  clientId: 'CL-1005',
  advocateId: 'ADV-104',
  court: 'Family Court, Chennai',
  filedOn: '2026-06-08',
  status: 'Active',
  priority: 'High',
  nextHearing: '2026-08-15',
  stage: 'Interim Orders'
},
{
  id: 'LC-1019',
  caseNumber: 'EMP/2026/00204',
  title: 'Kestrel Logistics — Depot 3 Collective Claim',
  type: 'Employment Tribunal',
  description:
  'Defence of a collective claim brought by 22 depot staff concerning overtime classification and rest-break compliance.',
  clientId: 'CL-1006',
  advocateId: 'ADV-106',
  court: 'Labour Court & Industrial Tribunal, Chennai',
  filedOn: '2026-04-22',
  status: 'Active',
  priority: 'Medium',
  nextHearing: '2026-08-27',
  stage: 'Conciliation'
},
{
  id: 'LC-1018',
  caseNumber: 'COM/2026/00301',
  title: 'Vaughn Retail Group — Lease Renegotiation, Harbor Plaza',
  type: 'Corporate Dispute',
  description:
  'Advisory and negotiation mandate covering the renewal of eleven retail leases in Tiruchirappalli with a single landlord group.',
  clientId: 'CL-1002',
  advocateId: 'ADV-102',
  court: 'District & Sessions Court, Coimbatore',
  filedOn: '2026-05-14',
  status: 'Pending',
  priority: 'Low',
  stage: 'Awaiting Filing Confirmation'
},
{
  id: 'LC-1017',
  caseNumber: 'CIV/2026/00398',
  title: 'Hayes Clinic v. Meridian Indemnity',
  type: 'Civil Suit',
  description:
  'Recovery action against an insurer that declined cover for a professional indemnity claim on notification grounds.',
  clientId: 'CL-1008',
  advocateId: 'ADV-102',
  court: 'Madras High Court, Chennai',
  filedOn: '2026-07-01',
  status: 'Pending',
  priority: 'Medium',
  stage: 'Pre-Action Correspondence'
},
{
  id: 'LC-1016',
  caseNumber: 'CRM/2026/00087',
  title: 'State v. R. Calloway',
  type: 'Criminal Defence',
  description:
  'Defence of a single count of aggravated fraud arising from a disputed vendor onboarding process.',
  clientId: 'CL-1001',
  advocateId: 'ADV-103',
  court: 'Madras High Court, Chennai',
  filedOn: '2026-06-25',
  status: 'Pending',
  priority: 'High',
  stage: 'Charge Review'
},
{
  id: 'LC-1015',
  caseNumber: 'CIV/2025/00922',
  title: 'Castellanos v. Ridgeline Motors',
  type: 'Civil Suit',
  description:
  'Consumer claim for rescission of a vehicle finance agreement. Settled at Lok Adalat / mediation on confidential terms.',
  clientId: 'CL-1007',
  advocateId: 'ADV-101',
  court: 'Madras High Court, Chennai',
  filedOn: '2025-03-12',
  status: 'Closed',
  priority: 'Low',
  stage: 'Settled — Closed'
},
{
  id: 'LC-1014',
  caseNumber: 'EMP/2025/00177',
  title: 'Kestrel Logistics — Waldron Grievance',
  type: 'Employment Tribunal',
  description: 'Individual unfair dismissal claim dismissed at preliminary hearing.',
  clientId: 'CL-1006',
  advocateId: 'ADV-106',
  court: 'Labour Court & Industrial Tribunal, Chennai',
  filedOn: '2025-05-30',
  status: 'Closed',
  priority: 'Low',
  stage: 'Dismissed — Closed'
},
{
  id: 'LC-1013',
  caseNumber: 'FAM/2025/00512',
  title: 'Adeyemi — Interim Support Application',
  type: 'Family Law',
  description: 'Interim support secured by consent order; matter folded into LC-1020.',
  clientId: 'CL-1005',
  advocateId: 'ADV-104',
  court: 'Family Court, Chennai',
  filedOn: '2025-09-15',
  status: 'Closed',
  priority: 'Low',
  stage: 'Consent Order — Closed'
},
{
  id: 'LC-1012',
  caseNumber: 'PRO/2025/00088',
  title: 'Ferris v. Coastline Surveyors',
  type: 'Property Dispute',
  description: 'Negligent survey claim resolved by pre-trial settlement and cost recovery.',
  clientId: 'CL-1004',
  advocateId: 'ADV-105',
  court: 'District & Sessions Court, Coimbatore',
  filedOn: '2025-01-20',
  status: 'Closed',
  priority: 'Medium',
  stage: 'Settled — Closed'
},
{
  id: 'LC-1011',
  caseNumber: 'CIV/2026/00366',
  title: 'Petrova — Trademark Opposition',
  type: 'Civil Suit',
  description:
  'Opposition to a competing mark filed in class 42; awaiting registry hearing date allocation.',
  clientId: 'CL-1003',
  advocateId: 'ADV-102',
  court: 'Commercial Court, Chennai',
  filedOn: '2026-07-18',
  status: 'Pending',
  priority: 'Low',
  stage: 'Awaiting Registry Date'
}];

export const proceedings: Proceeding[] = [
{
  id: 'PR-401',
  caseId: 'LC-1024',
  date: '2026-08-10',
  title: 'Hearing completed',
  detail:
  'Court heard the application for interim injunction. Directions given for exchange of expert valuations within 14 days.',
  updatedBy: 'Adv. Daniel Reyes'
},
{
  id: 'PR-402',
  caseId: 'LC-1024',
  date: '2026-08-05',
  title: 'Document uploaded',
  detail: 'Escrow statement and deposit receipts filed to the case bundle (Exhibit C).',
  updatedBy: 'Priya Raghunathan'
},
{
  id: 'PR-403',
  caseId: 'LC-1024',
  date: '2026-07-22',
  title: 'Written submissions filed',
  detail: 'Claimant submissions on specific performance served on the defendant’s counsel.',
  updatedBy: 'Adv. Daniel Reyes'
},
{
  id: 'PR-404',
  caseId: 'LC-1024',
  date: '2026-06-30',
  title: 'Advocate assigned',
  detail: 'Matter allocated to Adv. Daniel Reyes as lead counsel.',
  updatedBy: 'Miriam Okonjo'
},
{
  id: 'PR-405',
  caseId: 'LC-1024',
  date: '2026-02-10',
  title: 'Case registered',
  detail: 'Petition filed at the Madras High Court registry; case number CIV/2026/00412 allocated.',
  updatedBy: 'Priya Raghunathan'
},
{
  id: 'PR-406',
  caseId: 'LC-1023',
  date: '2026-08-11',
  title: 'Interlocutory application listed',
  detail: 'Application for expedited discovery listed for 14 August 2026.',
  updatedBy: 'Adv. Ingrid Sorensen'
},
{
  id: 'PR-407',
  caseId: 'LC-1023',
  date: '2026-07-19',
  title: 'Defence received',
  detail: 'Defendant filed defence and counterclaim for wrongful termination of supply.',
  updatedBy: 'Priya Raghunathan'
},
{
  id: 'PR-408',
  caseId: 'LC-1020',
  date: '2026-08-09',
  title: 'Interim order granted',
  detail: 'Interim maintenance of ₹24,000 per month ordered pending final determination.',
  updatedBy: 'Adv. Leah Nakamura'
},
{
  id: 'PR-409',
  caseId: 'LC-1020',
  date: '2026-07-02',
  title: 'Mediation attempted',
  detail: 'Court-directed mediation held; partial agreement reached on access schedule.',
  updatedBy: 'Adv. Leah Nakamura'
},
{
  id: 'PR-410',
  caseId: 'LC-1019',
  date: '2026-08-04',
  title: 'Conciliation meeting held',
  detail: 'Tribunal conciliator met both parties; further data on rota records requested.',
  updatedBy: 'Adv. Clara Whitfield'
},
{
  id: 'PR-411',
  caseId: 'LC-1022',
  date: '2026-08-06',
  title: 'Pleadings closed',
  detail: 'Reply to defence filed; matter ready for case management conference.',
  updatedBy: 'Adv. Daniel Reyes'
},
{
  id: 'PR-412',
  caseId: 'LC-1021',
  date: '2026-07-28',
  title: 'Valuation instruction issued',
  detail: 'Joint valuer instructed on the Madurai property holdings.',
  updatedBy: 'Tobias Lind'
}];