// Mock Database for Legal Case Management System
// Author: JEEVA R S (Digital ID: 2512007)

export const initialData = {
  currentUser: null, // Will be set on login
  
  users: [
    { id: 'usr_admin', name: 'Jeeva R S (Admin)', role: 'Administrator', email: 'admin@lexis.law', avatar: '👨‍💼', designation: 'System Administrator' },
    { id: 'usr_adv1', name: 'Adv. Rajesh Kumar', role: 'Advocate', email: 'rajesh.k@lexis.law', avatar: '⚖️', specialization: 'Criminal & Constitutional Law' },
    { id: 'usr_adv2', name: 'Adv. Ananya Sharma', role: 'Advocate', email: 'ananya.s@lexis.law', avatar: '👩‍⚖️', specialization: 'Corporate & Commercial Disputes' },
    { id: 'usr_clerk', name: 'Ramesh Patel', role: 'Clerk / Paralegal', email: 'clerk@lexis.law', avatar: '📝', designation: 'Senior Legal Clerk' },
    { id: 'usr_client1', name: 'Vikramaditya Verma', role: 'Client', email: 'client.vikram@gmail.com', avatar: '👤', company: 'Verma Enterprises' },
    { id: 'usr_client2', name: 'Priya Sundaram', role: 'Client', email: 'priya.s@techcorp.in', avatar: '👩', company: 'TechCorp Pvt Ltd' }
  ],

  cases: [
    {
      id: 'CS-2026-001',
      title: 'Verma Enterprises vs. Apex Logistics Ltd.',
      clientName: 'Vikramaditya Verma',
      clientId: 'usr_client1',
      advocateName: 'Adv. Rajesh Kumar',
      advocateId: 'usr_adv1',
      caseType: 'Commercial Dispute',
      court: 'High Court - Courtroom 3',
      judge: 'Hon. Justice M. K. Rao',
      status: 'Hearing Scheduled',
      filingDate: '2026-01-15',
      nextHearing: '2026-08-12 10:30 AM',
      claimAmount: '₹ 45,00,000',
      description: 'Breach of contract suit regarding delayed freight shipping and damaged inventory.',
      proceedings: [
        { date: '2026-01-15', summary: 'Plaint filed and registered under commercial suit provisions.' },
        { date: '2026-02-10', summary: 'Summons issued to defendant Apex Logistics Ltd.' },
        { date: '2026-04-05', summary: 'Written statement submitted by defense counsel.' },
        { date: '2026-06-20', summary: 'Framing of issues completed. List of witnesses exchanged.' }
      ]
    },
    {
      id: 'CS-2026-002',
      title: 'State vs. Mehra Infrastructure Corp',
      clientName: 'Priya Sundaram',
      clientId: 'usr_client2',
      advocateName: 'Adv. Ananya Sharma',
      advocateId: 'usr_adv2',
      caseType: 'Corporate Compliance',
      court: 'District Court - Division 2',
      judge: 'Hon. Magistrate S. Gupta',
      status: 'In Progress',
      filingDate: '2026-02-28',
      nextHearing: '2026-08-18 02:00 PM',
      claimAmount: '₹ 1,20,00,000',
      description: 'Regulatory compliance review and environmental standard petition.',
      proceedings: [
        { date: '2026-02-28', summary: 'Initial petition for interim relief filed.' },
        { date: '2026-03-14', summary: 'Interim stay granted on penalty order.' },
        { date: '2026-05-30', summary: 'Environmental audit report submitted as Exhibit A.' }
      ]
    },
    {
      id: 'CS-2026-003',
      title: 'Sundaram IP Infringement Petition',
      clientName: 'Priya Sundaram',
      clientId: 'usr_client2',
      advocateName: 'Adv. Ananya Sharma',
      advocateId: 'usr_adv2',
      caseType: 'Intellectual Property',
      court: 'High Court - Patent Bench',
      judge: 'Hon. Justice R. N. Pillai',
      status: 'Pending',
      filingDate: '2026-05-10',
      nextHearing: '2026-08-25 11:15 AM',
      claimAmount: '₹ 85,00,000',
      description: 'Trademark infringement suit seeking permanent injunction against unauthorized software duplication.',
      proceedings: [
        { date: '2026-05-10', summary: 'Trademark registration certificates filed.' },
        { date: '2026-07-02', summary: 'Ex-parte ad-interim injunction application argued.' }
      ]
    },
    {
      id: 'CS-2026-004',
      title: 'Verma Estate Property Succession',
      clientName: 'Vikramaditya Verma',
      clientId: 'usr_client1',
      advocateName: 'Adv. Rajesh Kumar',
      advocateId: 'usr_adv1',
      caseType: 'Civil Property Law',
      court: 'Civil Court - Senior Division',
      judge: 'Hon. Judge V. K. Nair',
      status: 'Closed',
      filingDate: '2025-08-14',
      nextHearing: 'Completed',
      claimAmount: '₹ 2,10,00,000',
      description: 'Succession certificate application and partition deed registration.',
      proceedings: [
        { date: '2025-08-14', summary: 'Petition for probate certificate filed.' },
        { date: '2025-11-20', summary: 'Public notice published without objections.' },
        { date: '2026-03-11', summary: 'Final decree passed in favor of petitioner.' }
      ]
    }
  ],

  hearings: [
    {
      id: 'HR-101',
      caseId: 'CS-2026-001',
      caseTitle: 'Verma Enterprises vs. Apex Logistics Ltd.',
      court: 'High Court - Courtroom 3',
      judge: 'Hon. Justice M. K. Rao',
      date: '2026-08-12',
      time: '10:30 AM',
      advocate: 'Adv. Rajesh Kumar',
      client: 'Vikramaditya Verma',
      purpose: 'Cross-examination of Claimant Witness #1',
      status: 'Scheduled'
    },
    {
      id: 'HR-102',
      caseId: 'CS-2026-002',
      caseTitle: 'State vs. Mehra Infrastructure Corp',
      court: 'District Court - Division 2',
      judge: 'Hon. Magistrate S. Gupta',
      date: '2026-08-18',
      time: '02:00 PM',
      advocate: 'Adv. Ananya Sharma',
      client: 'Priya Sundaram',
      purpose: 'Arguments on Rejoinder Application',
      status: 'Scheduled'
    },
    {
      id: 'HR-103',
      caseId: 'CS-2026-003',
      caseTitle: 'Sundaram IP Infringement Petition',
      court: 'High Court - Patent Bench',
      judge: 'Hon. Justice R. N. Pillai',
      date: '2026-08-25',
      time: '11:15 AM',
      advocate: 'Adv. Ananya Sharma',
      client: 'Priya Sundaram',
      purpose: 'Admission & Notice Return',
      status: 'Upcoming'
    }
  ],

  documents: [
    {
      id: 'DOC-501',
      caseId: 'CS-2026-001',
      title: 'Plaint & Annexures (Verified)',
      category: 'Pleadings',
      fileSize: '4.2 MB',
      fileType: 'PDF Document',
      uploadedBy: 'Ramesh Patel (Clerk)',
      uploadDate: '2026-01-16',
      tags: ['Verified', 'Plaint', 'High Court']
    },
    {
      id: 'DOC-502',
      caseId: 'CS-2026-001',
      title: 'Bill of Lading & Freight Receipts',
      category: 'Evidence',
      fileSize: '12.8 MB',
      fileType: 'PDF Portfolio',
      uploadedBy: 'Adv. Rajesh Kumar',
      uploadDate: '2026-02-02',
      tags: ['Evidence', 'Receipts']
    },
    {
      id: 'DOC-503',
      caseId: 'CS-2026-002',
      title: 'Environmental Audit Certificate 2025',
      category: 'Court Orders',
      fileSize: '2.1 MB',
      fileType: 'PDF Document',
      uploadedBy: 'Adv. Ananya Sharma',
      uploadDate: '2026-03-15',
      tags: ['Audit', 'Compliance']
    },
    {
      id: 'DOC-504',
      caseId: 'CS-2026-003',
      title: 'Trademark Registration No. TM-884920',
      category: 'Contracts',
      fileSize: '1.5 MB',
      fileType: 'PDF Document',
      uploadedBy: 'Ramesh Patel (Clerk)',
      uploadDate: '2026-05-11',
      tags: ['IP', 'Trademark']
    }
  ],

  billing: [
    {
      invoiceNo: 'INV-2026-089',
      caseId: 'CS-2026-001',
      clientName: 'Vikramaditya Verma',
      amount: '₹ 45,000',
      status: 'Paid',
      dueDate: '2026-07-31',
      paidDate: '2026-07-28',
      description: 'Court Fee & Counsel Appearance (Drafting + High Court Hearing #2)',
      items: [
        { desc: 'High Court Stamp Duty & Court Fee', cost: '₹ 15,000' },
        { desc: 'Counsel Senior Retainer Fee', cost: '₹ 25,000' },
        { desc: 'Clerkage & Process Service', cost: '₹ 5,000' }
      ]
    },
    {
      invoiceNo: 'INV-2026-092',
      caseId: 'CS-2026-002',
      clientName: 'Priya Sundaram',
      amount: '₹ 35,000',
      status: 'Pending',
      dueDate: '2026-08-15',
      paidDate: null,
      description: 'Interim Stay Application & Environmental Auditor Consultation Fee',
      items: [
        { desc: 'Interim Motion Application Fee', cost: '₹ 10,000' },
        { desc: 'Expert Witness Retainer', cost: '₹ 20,000' },
        { desc: 'Documentation & Photocopying', cost: '₹ 5,000' }
      ]
    },
    {
      invoiceNo: 'INV-2026-095',
      caseId: 'CS-2026-003',
      clientName: 'Priya Sundaram',
      amount: '₹ 25,000',
      status: 'Overdue',
      dueDate: '2026-07-10',
      paidDate: null,
      description: 'Patent Office Search & Trademark Notice Preparation',
      items: [
        { desc: 'Patent Office Registry Search', cost: '₹ 8,000' },
        { desc: 'Legal Cease & Desist Notice Drafting', cost: '₹ 17,000' }
      ]
    }
  ],

  sdlcMetrics: {
    author: 'JEEVA R S',
    digitalId: '2512007',
    sdlcModel: 'Waterfall Model',
    timelineWeeks: 12,
    costEstimation: [
      { item: 'Software Development', cost: 60000 },
      { item: 'Hardware Requirements', cost: 25000 },
      { item: 'Database License / Backup', cost: 10000 },
      { item: 'Testing & QA', cost: 5000 },
      { item: 'Documentation & Manuals', cost: 5000 }
    ],
    riskAnalysis: [
      { risk: 'Requirement Changes', impact: 'High', mitigation: 'Freeze requirements before development' },
      { risk: 'Database Failure', impact: 'High', mitigation: 'Automated daily backup & recovery plan' },
      { risk: 'Software Bugs', impact: 'High', mitigation: 'Frequent unit and integration testing' },
      { risk: 'Schedule Delay', impact: 'Medium', mitigation: 'Weekly progress review milestones' },
      { risk: 'Data Loss', impact: 'High', mitigation: 'Encrypted offsite backup strategy' }
    ]
  }
};
