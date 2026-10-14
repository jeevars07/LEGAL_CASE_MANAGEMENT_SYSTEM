import type { ActivityItem, Hearing, LegalDocument, Notification } from '../types';

export const hearings: Hearing[] = [
{
  id: 'HR-501',
  caseId: 'LC-1023',
  date: '2026-08-14',
  time: '09:30',
  court: 'Commercial Court, Chennai — Court 4',
  purpose: 'Application for expedited discovery',
  status: 'Scheduled',
  judge: 'Hon. Justice M. Sundar'
},
{
  id: 'HR-502',
  caseId: 'LC-1020',
  date: '2026-08-15',
  time: '11:00',
  court: 'Family Court, Chennai — Court 2',
  purpose: 'Interim custody directions',
  status: 'Scheduled',
  judge: 'Hon. Judge G. Chandrasekharan'
},
{
  id: 'HR-503',
  caseId: 'LC-1024',
  date: '2026-08-18',
  time: '10:15',
  court: 'Madras High Court, Chennai — Court 9',
  purpose: 'Exchange of expert valuations',
  status: 'Scheduled',
  judge: 'Hon. Justice N. Anand Venkatesh'
},
{
  id: 'HR-504',
  caseId: 'LC-1022',
  date: '2026-08-21',
  time: '14:00',
  court: 'Madras High Court, Chennai — Court 3',
  purpose: 'Case management conference',
  status: 'Scheduled',
  judge: 'Hon. Justice N. Anand Venkatesh'
},
{
  id: 'HR-505',
  caseId: 'LC-1019',
  date: '2026-08-27',
  time: '09:00',
  court: 'Labour Court & Industrial Tribunal, Chennai — Hall B',
  purpose: 'Conciliation review',
  status: 'Scheduled',
  judge: 'Conciliator K. Ramakrishnan'
},
{
  id: 'HR-506',
  caseId: 'LC-1021',
  date: '2026-09-02',
  time: '10:00',
  court: 'District & Sessions Court, Coimbatore — Court 6',
  purpose: 'Mediation directions',
  status: 'Scheduled',
  judge: 'Hon. Justice S. Vaidyanathan'
},
{
  id: 'HR-507',
  caseId: 'LC-1024',
  date: '2026-08-10',
  time: '10:00',
  court: 'Madras High Court, Chennai — Court 9',
  purpose: 'Interim injunction application',
  status: 'Completed',
  judge: 'Hon. Justice N. Anand Venkatesh'
},
{
  id: 'HR-508',
  caseId: 'LC-1023',
  date: '2026-07-24',
  time: '09:30',
  court: 'Commercial Court, Chennai — Court 4',
  purpose: 'First case conference',
  status: 'Completed',
  judge: 'Hon. Justice M. Sundar'
},
{
  id: 'HR-509',
  caseId: 'LC-1020',
  date: '2026-07-16',
  time: '11:30',
  court: 'Family Court, Chennai — Court 2',
  purpose: 'Mediation report',
  status: 'Adjourned',
  judge: 'Hon. Judge G. Chandrasekharan'
},
{
  id: 'HR-510',
  caseId: 'LC-1016',
  date: '2026-08-13',
  time: '15:30',
  court: 'Madras High Court, Chennai — Court 1',
  purpose: 'Charge review listing',
  status: 'Scheduled',
  judge: 'Hon. Justice R. Suresh Kumar'
},
{
  id: 'HR-511',
  caseId: 'LC-1019',
  date: '2026-08-13',
  time: '08:30',
  court: 'Labour Court & Industrial Tribunal, Chennai — Hall B',
  purpose: 'Rota records inspection',
  status: 'Scheduled',
  judge: 'Conciliator K. Ramakrishnan'
},
{
  id: 'HR-512',
  caseId: 'LC-1017',
  date: '2026-09-09',
  time: '13:00',
  court: 'Madras High Court, Chennai — Court 7',
  purpose: 'Pre-action review',
  status: 'Scheduled',
  judge: 'Hon. Justice R. Suresh Kumar'
}];


export const documents: LegalDocument[] = [
{
  id: 'DOC-9001',
  name: 'Petition — Mehta v. Northbay Property Trust.pdf',
  caseId: 'LC-1024',
  type: 'Petition',
  uploadedBy: 'Priya Raghunathan',
  uploadedOn: '2026-02-10',
  size: '1.8 MB',
  status: 'Verified'
},
{
  id: 'DOC-9002',
  name: 'Escrow Statement — Exhibit C.pdf',
  caseId: 'LC-1024',
  type: 'Evidence',
  uploadedBy: 'Priya Raghunathan',
  uploadedOn: '2026-08-05',
  size: '640 KB',
  status: 'Verified'
},
{
  id: 'DOC-9003',
  name: 'Interim Injunction Order — 10 Aug 2026.pdf',
  caseId: 'LC-1024',
  type: 'Court Order',
  uploadedBy: 'Adv. Daniel Reyes',
  uploadedOn: '2026-08-10',
  size: '312 KB',
  status: 'Verified'
},
{
  id: 'DOC-9004',
  name: 'Exclusive Supply Agreement (2023).pdf',
  caseId: 'LC-1023',
  type: 'Agreement',
  uploadedBy: 'Adv. Ingrid Sorensen',
  uploadedOn: '2026-01-28',
  size: '2.4 MB',
  status: 'Verified'
},
{
  id: 'DOC-9005',
  name: 'Defence and Counterclaim.pdf',
  caseId: 'LC-1023',
  type: 'Petition',
  uploadedBy: 'Priya Raghunathan',
  uploadedOn: '2026-07-19',
  size: '980 KB',
  status: 'Pending Review'
},
{
  id: 'DOC-9006',
  name: 'Store Margin Analysis 2024-2026.xlsx',
  caseId: 'LC-1023',
  type: 'Evidence',
  uploadedBy: 'Tobias Lind',
  uploadedOn: '2026-08-02',
  size: '1.1 MB',
  status: 'Pending Review'
},
{
  id: 'DOC-9007',
  name: 'Partnership Dissolution Deed.pdf',
  caseId: 'LC-1022',
  type: 'Agreement',
  uploadedBy: 'Adv. Daniel Reyes',
  uploadedOn: '2026-03-04',
  size: '760 KB',
  status: 'Verified'
},
{
  id: 'DOC-9008',
  name: 'Interim Maintenance Order.pdf',
  caseId: 'LC-1020',
  type: 'Court Order',
  uploadedBy: 'Adv. Leah Nakamura',
  uploadedOn: '2026-08-09',
  size: '288 KB',
  status: 'Verified'
},
{
  id: 'DOC-9009',
  name: 'Client Identity Verification — N. Adeyemi.pdf',
  caseId: 'LC-1020',
  type: 'Identity Document',
  uploadedBy: 'Priya Raghunathan',
  uploadedOn: '2026-06-08',
  size: '420 KB',
  status: 'Verified'
},
{
  id: 'DOC-9010',
  name: 'Depot 3 Rota Records (Q1–Q2).zip',
  caseId: 'LC-1019',
  type: 'Evidence',
  uploadedBy: 'Tobias Lind',
  uploadedOn: '2026-08-04',
  size: '14.6 MB',
  status: 'Pending Review'
},
{
  id: 'DOC-9011',
  name: 'Estate Valuation — Madurai Land.pdf',
  caseId: 'LC-1021',
  type: 'Evidence',
  uploadedBy: 'Tobias Lind',
  uploadedOn: '2026-07-28',
  size: '3.2 MB',
  status: 'Verified'
},
{
  id: 'DOC-9012',
  name: 'Indemnity Policy Schedule — Meridian.pdf',
  caseId: 'LC-1017',
  type: 'Agreement',
  uploadedBy: 'Priya Raghunathan',
  uploadedOn: '2026-07-01',
  size: '1.4 MB',
  status: 'Pending Review'
},
{
  id: 'DOC-9013',
  name: 'Charge Sheet — State v. R. Calloway.pdf',
  caseId: 'LC-1016',
  type: 'Court Order',
  uploadedBy: 'Adv. Marcus Aldridge',
  uploadedOn: '2026-06-25',
  size: '540 KB',
  status: 'Verified'
},
{
  id: 'DOC-9014',
  name: 'Settlement Terms — Castellanos.pdf',
  caseId: 'LC-1015',
  type: 'Agreement',
  uploadedBy: 'Adv. Daniel Reyes',
  uploadedOn: '2025-08-14',
  size: '410 KB',
  status: 'Verified'
},
{
  id: 'DOC-9015',
  name: 'Correspondence Bundle — Halden Studio.pdf',
  caseId: 'LC-1022',
  type: 'Other',
  uploadedBy: 'Priya Raghunathan',
  uploadedOn: '2026-08-06',
  size: '2.9 MB',
  status: 'Verified'
}];


export const activity: ActivityItem[] = [
{
  id: 'AC-1',
  type: 'hearing',
  message: 'Hearing scheduled for 18 Aug — Mehta v. Northbay Property Trust',
  actor: 'Priya Raghunathan',
  at: '2026-08-13T08:05:00',
  caseId: 'LC-1024'
},
{
  id: 'AC-2',
  type: 'document',
  message: 'Uploaded “Depot 3 Rota Records (Q1–Q2)” to Kestrel Logistics claim',
  actor: 'Tobias Lind',
  at: '2026-08-13T07:20:00',
  caseId: 'LC-1019'
},
{
  id: 'AC-3',
  type: 'case',
  message: 'Case status updated to Active — Petrova v. Halden Studio Partners',
  actor: 'Adv. Daniel Reyes',
  at: '2026-08-12T16:48:00',
  caseId: 'LC-1022'
},
{
  id: 'AC-4',
  type: 'billing',
  message: 'Payment of ₹1,84,000 received against INV-2041',
  actor: 'Accounts',
  at: '2026-08-12T14:02:00'
},
{
  id: 'AC-5',
  type: 'advocate',
  message: 'Adv. Clara Whitfield assigned to Kestrel Logistics — Depot 3 Collective Claim',
  actor: 'Miriam Okonjo',
  at: '2026-08-12T10:35:00',
  caseId: 'LC-1019'
},
{
  id: 'AC-6',
  type: 'client',
  message: 'New client registered — Rosalind Hayes (Hayes Clinic)',
  actor: 'Priya Raghunathan',
  at: '2026-08-11T15:12:00'
},
{
  id: 'AC-7',
  type: 'case',
  message: 'Interim maintenance order recorded — Adeyemi custody matter',
  actor: 'Adv. Leah Nakamura',
  at: '2026-08-09T12:40:00',
  caseId: 'LC-1020'
},
{
  id: 'AC-8',
  type: 'document',
  message: 'Verified “Interim Injunction Order — 10 Aug 2026”',
  actor: 'Miriam Okonjo',
  at: '2026-08-10T17:26:00',
  caseId: 'LC-1024'
}];


export const notifications: Notification[] = [
{
  id: 'NT-1',
  title: 'New hearing scheduled',
  body: 'A hearing has been listed for 18 Aug 2026 on Case #LC-1024.',
  at: '2026-08-13T08:05:00',
  read: false,
  kind: 'hearing',
  href: '/cases/LC-1024'
},
{
  id: 'NT-2',
  title: 'Document uploaded',
  body: 'Rota records were added to Case #LC-1019 and await review.',
  at: '2026-08-13T07:20:00',
  read: false,
  kind: 'document',
  href: '/cases/LC-1019'
},
{
  id: 'NT-3',
  title: 'Payment received',
  body: 'Payment of ₹1,84,000 recorded for Case #LC-1023 (INV-2041).',
  at: '2026-08-12T14:02:00',
  read: false,
  kind: 'billing',
  href: '/billing/invoices'
},
{
  id: 'NT-4',
  title: 'Case status updated',
  body: 'Case #LC-1022 moved to Active following close of pleadings.',
  at: '2026-08-12T16:48:00',
  read: true,
  kind: 'case',
  href: '/cases/LC-1022'
},
{
  id: 'NT-5',
  title: 'Invoice overdue',
  body: 'INV-2036 for Ferris Family Estate is 12 days past due.',
  at: '2026-08-11T09:00:00',
  read: true,
  kind: 'billing',
  href: '/billing/outstanding'
}];