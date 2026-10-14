import type { Advocate, Client, User } from '../types';

export const users: User[] = [
{
  id: 'U-001',
  name: 'Miriam Okonjo',
  email: 'm.okonjo@harborlaw.example',
  password: 'Admin@123',
  role: 'admin',
  title: 'Managing Partner',
  status: 'Active',
  lastActive: '2026-08-13T08:10:00'
},
{
  id: 'U-002',
  name: 'Adv. Daniel Reyes',
  email: 'd.reyes@harborlaw.example',
  password: 'Advocate@123',
  role: 'advocate',
  title: 'Senior Advocate — Litigation',
  status: 'Active',
  lastActive: '2026-08-13T07:42:00',
  linkedId: 'ADV-101'
},
{
  id: 'U-003',
  name: 'Priya Raghunathan',
  email: 'p.raghunathan@harborlaw.example',
  password: 'Clerk@123',
  role: 'clerk',
  title: 'Senior Paralegal',
  status: 'Active',
  lastActive: '2026-08-12T18:20:00'
},
{
  id: 'U-004',
  name: 'Helena Vaughn',
  email: 'helena.vaughn@vaughnretail.example',
  password: 'Client@123',
  role: 'client',
  title: 'Client — Vaughn Retail Group',
  status: 'Active',
  lastActive: '2026-08-11T14:05:00',
  linkedId: 'CL-1002'
},
{
  id: 'U-005',
  name: 'Adv. Ingrid Sorensen',
  email: 'i.sorensen@harborlaw.example',
  password: 'Advocate@123',
  role: 'advocate',
  title: 'Advocate — Corporate',
  status: 'Active',
  lastActive: '2026-08-13T06:55:00',
  linkedId: 'ADV-102'
},
{
  id: 'U-006',
  name: 'Tobias Lind',
  email: 't.lind@harborlaw.example',
  password: 'Clerk@123',
  role: 'clerk',
  title: 'Records Clerk',
  status: 'Suspended',
  lastActive: '2026-07-29T11:30:00'
}];


export const advocates: Advocate[] = [
{
  id: 'ADV-101',
  name: 'Adv. Daniel Reyes',
  email: 'd.reyes@harborlaw.example',
  phone: '+91 98401 22088',
  specialization: 'Civil Litigation',
  barNumber: 'BAR-TN-48210/2012',
  yearsExperience: 14,
  status: 'Active'
},
{
  id: 'ADV-102',
  name: 'Adv. Ingrid Sorensen',
  email: 'i.sorensen@harborlaw.example',
  phone: '+91 98402 22088',
  specialization: 'Corporate & M&A',
  barNumber: 'BAR-TN-51677/2015',
  yearsExperience: 11,
  status: 'Active'
},
{
  id: 'ADV-103',
  name: 'Adv. Marcus Aldridge',
  email: 'm.aldridge@harborlaw.example',
  phone: '+91 98403 22088',
  specialization: 'Criminal Defence',
  barNumber: 'BAR-TN-39044/2008',
  yearsExperience: 18,
  status: 'Active'
},
{
  id: 'ADV-104',
  name: 'Adv. Leah Nakamura',
  email: 'l.nakamura@harborlaw.example',
  phone: '+91 98404 22088',
  specialization: 'Family Law',
  barNumber: 'BAR-TN-60218/2018',
  yearsExperience: 8,
  status: 'Active'
},
{
  id: 'ADV-105',
  name: 'Adv. Samuel Ofori',
  email: 's.ofori@harborlaw.example',
  phone: '+91 98405 22088',
  specialization: 'Property & Land',
  barNumber: 'BAR-TN-44190/2010',
  yearsExperience: 16,
  status: 'On Leave'
},
{
  id: 'ADV-106',
  name: 'Adv. Clara Whitfield',
  email: 'c.whitfield@harborlaw.example',
  phone: '+91 98406 22088',
  specialization: 'Employment & Labour',
  barNumber: 'BAR-TN-57303/2017',
  yearsExperience: 9,
  status: 'Active'
}];


export const clients: Client[] = [
{
  id: 'CL-1001',
  name: 'Arjun Mehta',
  email: 'arjun.mehta@northbay.example',
  phone: '+91 98410 55501',
  gender: 'Male',
  dob: '1984-03-12',
  address: '418 Anna Salai, Mount Road, Suite 6',
  city: 'Chennai',
  state: 'Tamil Nadu',
  postalCode: '600002',
  notes: 'Prefers email correspondence. Signed retainer covers all civil matters.',
  registeredOn: '2024-11-04',
  status: 'Active'
},
{
  id: 'CL-1002',
  name: 'Vaughn Retail Group',
  email: 'legal@vaughnretail.example',
  phone: '+91 98420 55501',
  gender: 'Other',
  dob: '2009-06-01',
  address: '2200 Avinashi Road, Peelamedu',
  city: 'Coimbatore',
  state: 'Tamil Nadu',
  postalCode: '641004',
  notes: 'Corporate account. All invoices routed to accounts payable with 30-day terms.',
  registeredOn: '2023-02-18',
  status: 'Active'
},
{
  id: 'CL-1003',
  name: 'Elena Petrova',
  email: 'e.petrova@petrovadesign.example',
  phone: '+91 98430 55501',
  gender: 'Female',
  dob: '1991-09-27',
  address: '77 K.K. Nagar Main Road',
  city: 'Madurai',
  state: 'Tamil Nadu',
  postalCode: '625020',
  notes: 'Contract disputes with former studio partner. Sensitive matter.',
  registeredOn: '2025-01-22',
  status: 'Active'
},
{
  id: 'CL-1004',
  name: 'Harold Ferris',
  email: 'h.ferris@ferrisholdings.example',
  phone: '+91 98440 55501',
  gender: 'Male',
  dob: '1966-12-02',
  address: '9 Thillai Nagar, 10th Cross',
  city: 'Tiruchirappalli',
  state: 'Tamil Nadu',
  postalCode: '620018',
  notes: 'Estate and property portfolio; requires quarterly status summaries.',
  registeredOn: '2022-08-09',
  status: 'Active'
},
{
  id: 'CL-1005',
  name: 'Naomi Adeyemi',
  email: 'naomi.adeyemi@example.com',
  phone: '+91 98450 55501',
  gender: 'Female',
  dob: '1988-05-19',
  address: '1450 Fairlands Main Road, Apt 3C',
  city: 'Salem',
  state: 'Tamil Nadu',
  postalCode: '636016',
  notes: 'Family law matter. Contact only on mobile after 5pm.',
  registeredOn: '2025-06-30',
  status: 'Active'
},
{
  id: 'CL-1006',
  name: 'Kestrel Logistics LLC',
  email: 'counsel@kestrellogistics.example',
  phone: '+91 98460 55501',
  gender: 'Other',
  dob: '2015-04-14',
  address: '55 High Grounds Road',
  city: 'Tirunelveli',
  state: 'Tamil Nadu',
  postalCode: '627002',
  notes: 'Ongoing employment tribunal matters across three depots.',
  registeredOn: '2024-03-11',
  status: 'Active'
},
{
  id: 'CL-1007',
  name: 'Julian Castellanos',
  email: 'j.castellanos@example.com',
  phone: '+91 98470 55501',
  gender: 'Male',
  dob: '1979-07-08',
  address: '310 Brough Road',
  city: 'Erode',
  state: 'Tamil Nadu',
  postalCode: '638001',
  notes: 'Matter concluded in 2025; retained for future advisory work.',
  registeredOn: '2023-10-02',
  status: 'Inactive'
},
{
  id: 'CL-1008',
  name: 'Rosalind Hayes',
  email: 'r.hayes@hayesclinic.example',
  phone: '+91 98480 55501',
  gender: 'Female',
  dob: '1974-02-25',
  address: '88 Katpadi Main Road',
  city: 'Vellore',
  state: 'Tamil Nadu',
  postalCode: '632006',
  notes: 'Medical practice; professional indemnity dispute.',
  registeredOn: '2025-04-17',
  status: 'Active'
}];