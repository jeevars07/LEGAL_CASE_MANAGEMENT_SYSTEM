import type { Invoice } from '../types';

export const invoices: Invoice[] = [
{
  id: 'INV-2041',
  clientId: 'CL-1002',
  caseId: 'LC-1023',
  description: 'Interlocutory application, discovery preparation and counsel fees — July 2026',
  amount: 18400,
  tax: 1472,
  issuedOn: '2026-07-31',
  dueOn: '2026-08-30',
  status: 'Paid',
  paidOn: '2026-08-12',
  method: 'Bank transfer'
},
{
  id: 'INV-2040',
  clientId: 'CL-1001',
  caseId: 'LC-1024',
  description: 'Injunction application, court attendance and expert liaison — July 2026',
  amount: 12750,
  tax: 1020,
  issuedOn: '2026-07-31',
  dueOn: '2026-08-30',
  status: 'Pending'
},
{
  id: 'INV-2039',
  clientId: 'CL-1006',
  caseId: 'LC-1019',
  description: 'Conciliation attendance and records review — July 2026',
  amount: 9600,
  tax: 768,
  issuedOn: '2026-07-28',
  dueOn: '2026-08-27',
  status: 'Pending'
},
{
  id: 'INV-2038',
  clientId: 'CL-1005',
  caseId: 'LC-1020',
  description: 'Interim custody application and mediation attendance',
  amount: 6200,
  tax: 496,
  issuedOn: '2026-07-20',
  dueOn: '2026-08-19',
  status: 'Pending'
},
{
  id: 'INV-2037',
  clientId: 'CL-1003',
  caseId: 'LC-1022',
  description: 'Pleadings, reply to defence and correspondence bundle',
  amount: 7450,
  tax: 596,
  issuedOn: '2026-07-10',
  dueOn: '2026-08-09',
  status: 'Overdue'
},
{
  id: 'INV-2036',
  clientId: 'CL-1004',
  caseId: 'LC-1021',
  description: 'Estate valuation instruction and mediation preparation',
  amount: 14300,
  tax: 1144,
  issuedOn: '2026-07-01',
  dueOn: '2026-08-01',
  status: 'Overdue'
},
{
  id: 'INV-2035',
  clientId: 'CL-1002',
  caseId: 'LC-1018',
  description: 'Lease renegotiation advisory — eleven retail units',
  amount: 21000,
  tax: 1680,
  issuedOn: '2026-06-30',
  dueOn: '2026-07-30',
  status: 'Paid',
  paidOn: '2026-07-24',
  method: 'Bank transfer'
},
{
  id: 'INV-2034',
  clientId: 'CL-1008',
  caseId: 'LC-1017',
  description: 'Pre-action correspondence and policy review',
  amount: 4800,
  tax: 384,
  issuedOn: '2026-07-05',
  dueOn: '2026-08-04',
  status: 'Pending'
},
{
  id: 'INV-2033',
  clientId: 'CL-1001',
  caseId: 'LC-1016',
  description: 'Charge review, initial defence strategy and conference',
  amount: 8900,
  tax: 712,
  issuedOn: '2026-06-28',
  dueOn: '2026-07-28',
  status: 'Paid',
  paidOn: '2026-07-19',
  method: 'Card'
},
{
  id: 'INV-2032',
  clientId: 'CL-1007',
  caseId: 'LC-1015',
  description: 'Mediation and settlement documentation — final invoice',
  amount: 5600,
  tax: 448,
  issuedOn: '2025-08-20',
  dueOn: '2025-09-19',
  status: 'Paid',
  paidOn: '2025-09-02',
  method: 'Bank transfer'
},
{
  id: 'INV-2031',
  clientId: 'CL-1006',
  caseId: 'LC-1014',
  description: 'Preliminary hearing representation — Waldron grievance',
  amount: 3400,
  tax: 272,
  issuedOn: '2025-07-14',
  dueOn: '2025-08-13',
  status: 'Paid',
  paidOn: '2025-08-01',
  method: 'Bank transfer'
},
{
  id: 'INV-2030',
  clientId: 'CL-1004',
  caseId: 'LC-1012',
  description: 'Negligent survey claim — settlement and cost recovery',
  amount: 11200,
  tax: 896,
  issuedOn: '2025-06-30',
  dueOn: '2025-07-30',
  status: 'Paid',
  paidOn: '2025-07-15',
  method: 'Cheque'
}];


export const revenueByMonth = [
{ month: 'Feb', billed: 42000, collected: 38500 },
{ month: 'Mar', billed: 51000, collected: 46200 },
{ month: 'Apr', billed: 47500, collected: 45800 },
{ month: 'May', billed: 62000, collected: 54300 },
{ month: 'Jun', billed: 58400, collected: 55100 },
{ month: 'Jul', billed: 73000, collected: 61400 },
{ month: 'Aug', billed: 31200, collected: 18400 }];


export const caseflowByMonth = [
{ month: 'Feb', opened: 4, closed: 1 },
{ month: 'Mar', opened: 3, closed: 2 },
{ month: 'Apr', opened: 2, closed: 1 },
{ month: 'May', opened: 3, closed: 0 },
{ month: 'Jun', opened: 5, closed: 2 },
{ month: 'Jul', opened: 4, closed: 3 },
{ month: 'Aug', opened: 2, closed: 1 }];