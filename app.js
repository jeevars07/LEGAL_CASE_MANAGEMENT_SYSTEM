// Legal Case Management System - Application Engine
// Author: JEEVA R S (Digital ID: 2512007)

import { initialData } from './mockData.js';

class LegalApp {
  constructor() {
    // Load state from localStorage if present, else initialData
    const saved = localStorage.getItem('lcms_data');
    this.data = saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(initialData));
    
    // UI State
    this.activeRole = 'Admin'; // Default selected role: 'Admin', 'Advocate', 'Clerk', 'Client'
    this.currentView = 'overview';
    this.searchQuery = '';
    this.statusFilter = 'All';
    this.showPassword = false;

    this.init();
  }

  saveState() {
    localStorage.setItem('lcms_data', JSON.stringify(this.data));
  }

  init() {
    this.startClock();
    this.render();
  }

  startClock() {
    setInterval(() => {
      const clockEl = document.getElementById('liveClock');
      if (clockEl) {
        const now = new Date();
        clockEl.innerText = now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        }) + ' | ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      }
    }, 1000);
  }

  // Helper role name mapper
  getNormalizedRole(roleKey) {
    if (roleKey === 'Admin' || roleKey === 'Administrator') return 'Administrator';
    if (roleKey === 'Advocate') return 'Advocate';
    if (roleKey === 'Clerk' || roleKey === 'Clerk / Paralegal') return 'Clerk / Paralegal';
    if (roleKey === 'Client') return 'Client';
    return 'Administrator';
  }

  loginAs(roleKey) {
    const fullRole = this.getNormalizedRole(roleKey);
    const user = this.data.users.find(u => u.role === fullRole) || this.data.users[0];
    this.data.currentUser = user;
    this.saveState();
    this.currentView = 'overview';
    this.render();
  }

  logout() {
    this.data.currentUser = null;
    this.saveState();
    this.render();
  }

  render() {
    const appEl = document.getElementById('app');
    if (!this.data.currentUser) {
      appEl.innerHTML = this.renderLoginScreen();
      this.bindLoginEvents();
    } else {
      appEl.innerHTML = this.renderDashboardLayout();
      this.bindDashboardEvents();
    }
  }

  /* ==========================================================================
     LOGIN SCREEN COMPONENT (MATCHING USER SCREENSHOT EXACTLY)
     ========================================================================== */
  renderLoginScreen() {
    return `
      <div class="login-page">
        <!-- Top Header Bar -->
        <header class="login-header-bar">
          <div class="login-brand-left">
            <div class="brand-badge-icon">⚖️</div>
            <div class="brand-text-group">
              <h1>LEGAL CASE MANAGEMENT SYSTEM</h1>
              <p>🛡️ Enterprise Edition v1.0</p>
            </div>
          </div>

          <div class="login-header-status">
            <span class="status-pill">
              <span style="display:inline-block; width:8px; height:8px; background:#10b981; border-radius:50%"></span>
              System Operational (99% Uptime)
            </span>
            <span class="status-pill-secondary">
              🗄️ MySQL + Tomcat Active
            </span>
          </div>
        </header>

        <!-- Floating Card Container -->
        <div class="login-card-container">
          <!-- Left Hero Card (CLEAN ENTERPRISE COPY) -->
          <div class="login-hero-card">
            <div class="practice-badge">
              <span>⚖️</span>
              <span>Practice Management Automation</span>
            </div>

            <h2>ENTERPRISE LEGAL OPERATIONS & CASE TRACKING</h2>

            <p>Streamline client management, hearing schedules, court proceedings, document archives, and billing in one secure environment.</p>
          </div>

          <!-- Right Authentication Form -->
          <div class="login-card-form">
            <div class="form-header-group">
              <h3>SYSTEM AUTHENTICATION</h3>
              <p>Select your authorized role and enter credentials to continue.</p>
            </div>

            <!-- Horizontal Role Selector Tabs -->
            <div class="role-tabs-strip">
              <button type="button" class="role-tab-btn ${this.activeRole === 'Admin' ? 'active' : ''}" data-role="Admin">
                <span class="role-icon">👨‍💼</span>
                <span>Admin</span>
              </button>

              <button type="button" class="role-tab-btn ${this.activeRole === 'Advocate' ? 'active' : ''}" data-role="Advocate">
                <span class="role-icon">⚖️</span>
                <span>Advocate</span>
              </button>

              <button type="button" class="role-tab-btn ${this.activeRole === 'Clerk' ? 'active' : ''}" data-role="Clerk">
                <span class="role-icon">📝</span>
                <span>Clerk</span>
              </button>

              <button type="button" class="role-tab-btn ${this.activeRole === 'Client' ? 'active' : ''}" data-role="Client">
                <span class="role-icon">👤</span>
                <span>Client</span>
              </button>
            </div>

            <form id="loginForm">
              <div class="form-input-block">
                <label>👤 Username / User ID</label>
                <div class="input-group-relative">
                  <span class="input-icon-left">👤</span>
                  <input 
                    type="text" 
                    id="loginEmail" 
                    class="input-control" 
                    placeholder="e.g. admin or advocate.smith" 
                    required 
                    value="${this.getRoleEmail(this.activeRole)}" 
                  />
                </div>
              </div>

              <div class="form-input-block">
                <label>🔑 Password</label>
                <div class="input-group-relative">
                  <span class="input-icon-left">🔒</span>
                  <input 
                    type="${this.showPassword ? 'text' : 'password'}" 
                    id="loginPassword" 
                    class="input-control" 
                    placeholder="Enter secure password" 
                    required 
                    value="••••••••••••" 
                  />
                  <span class="input-icon-right" id="togglePassword">👁️</span>
                </div>
              </div>

              <div class="form-options-row">
                <label class="remember-label">
                  <input type="checkbox" checked />
                  <span>Remember session</span>
                </label>
                <a href="#" class="forgot-link" onclick="alert('Password reset link sent to registered email.'); return false;">Forgot Password?</a>
              </div>

              <button type="submit" class="btn-login-main">
                <span>Log In to System</span>
              </button>
            </form>
          </div>
        </div>

        <footer style="text-align:center; color:var(--text-dim); font-size:0.8rem; margin-top:1rem">
          Legal Case Management System • Authorized Enterprise Portal Access Only
        </footer>
      </div>
    `;
  }

  getRoleEmail(roleKey) {
    switch (roleKey) {
      case 'Admin': return 'admin';
      case 'Advocate': return 'advocate.smith';
      case 'Clerk': return 'clerk.ramesh';
      case 'Client': return 'client.vikram';
      default: return 'admin';
    }
  }

  bindLoginEvents() {
    const roleBtns = document.querySelectorAll('.role-tab-btn');
    roleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const role = btn.getAttribute('data-role');
        this.activeRole = role;
        const emailInput = document.getElementById('loginEmail');
        if (emailInput) emailInput.value = this.getRoleEmail(role);
        roleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    const togglePasswordBtn = document.getElementById('togglePassword');
    if (togglePasswordBtn) {
      togglePasswordBtn.addEventListener('click', () => {
        this.showPassword = !this.showPassword;
        const passInput = document.getElementById('loginPassword');
        if (passInput) passInput.type = this.showPassword ? 'text' : 'password';
      });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.loginAs(this.activeRole);
      });
    }
  }

  /* ==========================================================================
     MAIN DASHBOARD LAYOUT & VIEWS
     ========================================================================== */
  renderDashboardLayout() {
    const user = this.data.currentUser;
    return `
      <div class="dashboard-layout">
        <!-- Sidebar -->
        <aside class="sidebar">
          <div>
            <div class="sidebar-header">
              <div class="brand-header">
                <div class="brand-icon" style="width:38px; height:38px; font-size:1.2rem">⚖️</div>
                <div>
                  <div class="brand-title" style="font-size:1.15rem">LEGAL SYSTEM</div>
                  <div class="brand-subtitle" style="font-size:0.65rem">ENTERPRISE PORTAL</div>
                </div>
              </div>
            </div>

            <ul class="nav-menu">
              <li>
                <button class="nav-item-btn ${this.currentView === 'overview' ? 'active' : ''}" data-view="overview">
                  <span>📊</span> <span>Dashboard Overview</span>
                </button>
              </li>
              <li>
                <button class="nav-item-btn ${this.currentView === 'cases' ? 'active' : ''}" data-view="cases">
                  <span>📁</span> <span>Case Management</span>
                  <span class="badge-count">${this.data.cases.length}</span>
                </button>
              </li>
              <li>
                <button class="nav-item-btn ${this.currentView === 'hearings' ? 'active' : ''}" data-view="hearings">
                  <span>🏛️</span> <span>Hearing Scheduler</span>
                  <span class="badge-count">${this.data.hearings.length}</span>
                </button>
              </li>
              ${user.role !== 'Client' ? `
              <li>
                <button class="nav-item-btn ${this.currentView === 'advocates' ? 'active' : ''}" data-view="advocates">
                  <span>⚖️</span> <span>Advocate Directory</span>
                </button>
              </li>
              <li>
                <button class="nav-item-btn ${this.currentView === 'clients' ? 'active' : ''}" data-view="clients">
                  <span>👥</span> <span>Client Records</span>
                </button>
              </li>
              ` : ''}
              <li>
                <button class="nav-item-btn ${this.currentView === 'documents' ? 'active' : ''}" data-view="documents">
                  <span>📄</span> <span>Document Vault</span>
                </button>
              </li>
              <li>
                <button class="nav-item-btn ${this.currentView === 'billing' ? 'active' : ''}" data-view="billing">
                  <span>💳</span> <span>Fee & Billing</span>
                </button>
              </li>
              <li>
                <button class="nav-item-btn ${this.currentView === 'sdlc-report' ? 'active' : ''}" data-view="sdlc-report">
                  <span>📘</span> <span>SDLC Plan & Metrics</span>
                </button>
              </li>
            </ul>
          </div>

          <div class="sidebar-footer">
            <div class="user-profile-chip">
              <div class="user-avatar">${user.avatar || '👤'}</div>
              <div class="user-meta">
                <strong>${user.name}</strong>
                <span>${user.role}</span>
              </div>
              <button class="btn-icon" id="btnLogout" title="Sign Out" style="margin-left:auto; width:30px; height:30px; font-size:0.8rem">
                🚪
              </button>
            </div>
          </div>
        </aside>

        <!-- Main Content Area -->
        <main class="main-wrapper">
          <!-- Topbar -->
          <header class="topbar">
            <div class="topbar-left">
              <div class="search-box">
                <span class="search-icon">🔍</span>
                <input type="text" id="globalSearchInput" placeholder="Search case #, client name, court..." value="${this.searchQuery}" />
              </div>
            </div>

            <div class="topbar-right">
              <div class="live-clock-badge">
                <span>🕒</span>
                <span id="liveClock">Loading court clock...</span>
              </div>

              <!-- Quick Role Switcher for Evaluation -->
              <select id="topbarRoleSelect" class="role-switcher-select" title="Switch Portal Role">
                <option value="Admin" ${user.role === 'Administrator' ? 'selected' : ''}>Role: Admin</option>
                <option value="Advocate" ${user.role === 'Advocate' ? 'selected' : ''}>Role: Advocate</option>
                <option value="Clerk" ${user.role === 'Clerk / Paralegal' ? 'selected' : ''}>Role: Clerk</option>
                <option value="Client" ${user.role === 'Client' ? 'selected' : ''}>Role: Client</option>
              </select>

              <button class="btn-icon" id="btnNotifications" title="Court Hearing Alerts" style="position:relative">
                <span>🔔</span>
                <span style="position:absolute; top:2px; right:2px; width:8px; height:8px; background:var(--primary); border-radius:50%"></span>
              </button>
            </div>
          </header>

          <!-- Dynamic Page View -->
          <div class="page-container">
            ${this.renderCurrentView()}
          </div>
        </main>
      </div>

      <!-- Global Modal Container -->
      <div id="modalOverlay" class="modal-overlay">
        <div id="modalContent" class="modal-container"></div>
      </div>
    `;
  }

  bindDashboardEvents() {
    // Navigation buttons
    document.querySelectorAll('.nav-item-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = btn.getAttribute('data-view');
        if (view) {
          this.currentView = view;
          this.render();
        }
      });
    });

    // Logout button
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) btnLogout.addEventListener('click', () => this.logout());

    // Role Switcher in Topbar
    const roleSelect = document.getElementById('topbarRoleSelect');
    if (roleSelect) {
      roleSelect.addEventListener('change', (e) => {
        this.loginAs(e.target.value);
      });
    }

    // Global Search
    const searchInput = document.getElementById('globalSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderViewOnly();
      });
    }

    // Bind page-specific buttons (modals, actions)
    this.bindPageActions();
  }

  // Re-renders only the page view section for fast UI updates
  renderViewOnly() {
    const container = document.querySelector('.page-container');
    if (container) {
      container.innerHTML = this.renderCurrentView();
      this.bindPageActions();
    }
  }

  renderCurrentView() {
    switch (this.currentView) {
      case 'overview': return this.renderOverviewView();
      case 'cases': return this.renderCasesView();
      case 'hearings': return this.renderHearingsView();
      case 'advocates': return this.renderAdvocatesView();
      case 'clients': return this.renderClientsView();
      case 'documents': return this.renderDocumentsView();
      case 'billing': return this.renderBillingView();
      case 'sdlc-report': return this.renderSDLCReportView();
      default: return this.renderOverviewView();
    }
  }

  /* ==========================================================================
     VIEW 1: OVERVIEW DASHBOARD (Role-Tailored Stats & Charts)
     ========================================================================== */
  renderOverviewView() {
    const user = this.data.currentUser;
    const filteredCases = this.filterCases(this.data.cases);
    const activeCasesCount = this.data.cases.filter(c => c.status !== 'Closed').length;
    const scheduledHearingsCount = this.data.hearings.filter(h => h.status === 'Scheduled').length;
    
    return `
      <!-- Page Header -->
      <div class="page-header">
        <div class="page-title">
          <h2>Welcome back, ${user.name}</h2>
          <p>Legal Management Console — ${user.role} Mode</p>
        </div>
        <div class="action-bar">
          ${user.role !== 'Client' ? `
          <button class="btn-primary" id="btnNewCaseModal">
            <span>➕</span> <span>Register New Case</span>
          </button>
          <button class="btn-secondary" id="btnScheduleHearingModal">
            <span>🏛️</span> <span>Schedule Hearing</span>
          </button>
          ` : `
          <button class="btn-primary" id="btnPayInvoiceQuick">
            <span>💳</span> <span>Pay Fee Balance</span>
          </button>
          `}
        </div>
      </div>

      <!-- KPI Summary Cards Grid -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-card-info">
            <small>Active Cases</small>
            <h3>${activeCasesCount}</h3>
            <span>▲ 2 registered this month</span>
          </div>
          <div class="kpi-icon-box">📁</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-card-info">
            <small>Upcoming Hearings</small>
            <h3>${scheduledHearingsCount}</h3>
            <span>🏛️ Courtroom 3 & Bench 2</span>
          </div>
          <div class="kpi-icon-box">⚖️</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-card-info">
            <small>Legal Documents</small>
            <h3>${this.data.documents.length}</h3>
            <span>🔒 Verified Pleadings</span>
          </div>
          <div class="kpi-icon-box">📄</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-card-info">
            <small>Billed Revenue</small>
            <h3>₹ 1,05,000</h3>
            <span>💳 Total Project Allocation</span>
          </div>
          <div class="kpi-icon-box">💰</div>
        </div>
      </div>

      <!-- Grid 2: Charts & Recent Activity -->
      <div class="dashboard-grid-2">
        <!-- Main Panel: Recent Registered Cases -->
        <div class="card-widget">
          <div class="widget-header">
            <h3>Active Legal Cases</h3>
            <button class="btn-secondary" style="padding:0.4rem 0.8rem; font-size:0.8rem" id="btnViewAllCases">View All</button>
          </div>
          
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Title</th>
                  <th>Client</th>
                  <th>Advocate</th>
                  <th>Next Hearing</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${filteredCases.slice(0, 5).map(c => `
                  <tr>
                    <td><strong>${c.id}</strong></td>
                    <td>${c.title}</td>
                    <td>${c.clientName}</td>
                    <td>${c.advocateName}</td>
                    <td><small style="color:var(--accent-gold)">${c.nextHearing}</small></td>
                    <td><span class="badge badge-${this.getStatusBadgeClass(c.status)}">${c.status}</span></td>
                    <td>
                      <button class="btn-secondary btn-view-case-detail" data-id="${c.id}" style="padding:0.25rem 0.6rem; font-size:0.75rem">
                        View
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Right Panel: Hearing Schedule Timeline -->
        <div class="card-widget">
          <div class="widget-header">
            <h3>Hearing Timeline</h3>
            <span style="font-size:0.8rem; color:var(--primary)">August 2026</span>
          </div>

          <div class="timeline-list">
            ${this.data.hearings.map(h => `
              <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                  <strong>${h.date} — ${h.time}</strong>
                  <p><strong>${h.caseTitle}</strong></p>
                  <small>${h.court} | ${h.judge}</small>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Case Distribution Analytics SVG Chart -->
      <div class="card-widget">
        <div class="widget-header">
          <h3>Case Distribution by Legal Specialty & Status</h3>
          <span style="font-size:0.8rem; color:var(--text-muted)">Live System Metrics</span>
        </div>
        <div class="svg-chart-container">
          <div class="chart-bar-group">
            <div class="chart-bar" style="height: 80%" data-value="Commercial (45%)"></div>
            <span class="chart-label">Commercial</span>
          </div>
          <div class="chart-bar-group">
            <div class="chart-bar" style="height: 60%" data-value="Corporate (30%)"></div>
            <span class="chart-label">Corporate</span>
          </div>
          <div class="chart-bar-group">
            <div class="chart-bar" style="height: 40%" data-value="IP Petition (20%)"></div>
            <span class="chart-label">IP Petitions</span>
          </div>
          <div class="chart-bar-group">
            <div class="chart-bar" style="height: 90%" data-value="Civil Property (50%)"></div>
            <span class="chart-label">Civil Law</span>
          </div>
        </div>
      </div>
    `;
  }

  /* ==========================================================================
     VIEW 2: CASE MANAGEMENT MODULE
     ========================================================================== */
  renderCasesView() {
    const user = this.data.currentUser;
    const cases = this.filterCases(this.data.cases);

    return `
      <div class="page-header">
        <div class="page-title">
          <h2>Case Management Registry</h2>
          <p>Register, track, update proceedings, and assign advocates to legal cases.</p>
        </div>
        <div class="action-bar">
          ${user.role !== 'Client' ? `
          <button class="btn-primary" id="btnNewCaseModal">
            <span>➕</span> <span>Register Case</span>
          </button>
          ` : ''}
        </div>
      </div>

      <div class="card-widget">
        <div class="widget-header">
          <div style="display:flex; gap:1rem; align-items:center">
            <span style="font-size:0.85rem; color:var(--text-muted)">Filter by Status:</span>
            <select id="caseStatusFilter" class="role-switcher-select" style="background:var(--bg-dark)">
              <option value="All" ${this.statusFilter === 'All' ? 'selected' : ''}>All Statuses</option>
              <option value="Hearing Scheduled" ${this.statusFilter === 'Hearing Scheduled' ? 'selected' : ''}>Hearing Scheduled</option>
              <option value="In Progress" ${this.statusFilter === 'In Progress' ? 'selected' : ''}>In Progress</option>
              <option value="Pending" ${this.statusFilter === 'Pending' ? 'selected' : ''}>Pending</option>
              <option value="Closed" ${this.statusFilter === 'Closed' ? 'selected' : ''}>Closed</option>
            </select>
          </div>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Title / Parties</th>
                <th>Category</th>
                <th>Court / Judge</th>
                <th>Advocate Assigned</th>
                <th>Claim Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${cases.map(c => `
                <tr>
                  <td><strong>${c.id}</strong></td>
                  <td>
                    <strong>${c.title}</strong><br/>
                    <small style="color:var(--text-muted)">Client: ${c.clientName}</small>
                  </td>
                  <td><span class="badge" style="background:var(--bg-dark); color:var(--text-main)">${c.caseType}</span></td>
                  <td>${c.court}<br/><small style="color:var(--text-dim)">${c.judge}</small></td>
                  <td>${c.advocateName}</td>
                  <td><strong>${c.claimAmount}</strong></td>
                  <td><span class="badge badge-${this.getStatusBadgeClass(c.status)}">${c.status}</span></td>
                  <td>
                    <button class="btn-secondary btn-view-case-detail" data-id="${c.id}" style="padding:0.3rem 0.6rem; font-size:0.8rem">
                      Details
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  /* ==========================================================================
     VIEW 3: HEARING SCHEDULER MODULE
     ========================================================================== */
  renderHearingsView() {
    const user = this.data.currentUser;
    return `
      <div class="page-header">
        <div class="page-title">
          <h2>Court Hearing Scheduler</h2>
          <p>Schedule hearings, track courtroom listings, and assign advocate appearance schedules.</p>
        </div>
        <div class="action-bar">
          ${user.role !== 'Client' ? `
          <button class="btn-primary" id="btnScheduleHearingModal">
            <span>🏛️</span> <span>Schedule New Hearing</span>
          </button>
          ` : ''}
        </div>
      </div>

      <div class="kpi-grid" style="margin-bottom:1.5rem">
        ${this.data.hearings.map(h => `
          <div class="kpi-card" style="flex-direction:column; align-items:flex-start; gap:0.75rem">
            <div style="display:flex; justify-style:space-between; width:100%; align-items:center">
              <span class="badge badge-scheduled">${h.status}</span>
              <small style="color:var(--primary); font-weight:700">${h.date} @ ${h.time}</small>
            </div>
            <div>
              <h4 style="font-family:var(--font-serif); font-size:1.05rem; margin-bottom:0.25rem">${h.caseTitle}</h4>
              <p style="font-size:0.82rem; color:var(--text-muted)">Purpose: ${h.purpose}</p>
            </div>
            <div style="border-top:1px solid var(--border-color); padding-top:0.5rem; width:100%; font-size:0.78rem; color:var(--text-dim)">
              <span>📍 ${h.court} | ${h.judge}</span><br/>
              <span>⚖️ Counsel: ${h.advocate}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  /* ==========================================================================
     VIEW 4: ADVOCATE DIRECTORY & ASSIGNMENTS
     ========================================================================== */
  renderAdvocatesView() {
    const advocates = this.data.users.filter(u => u.role === 'Advocate');
    return `
      <div class="page-header">
        <div class="page-title">
          <h2>Advocate Directory & Assignments</h2>
          <p>Manage firm advocates, legal specializations, and case load allocations.</p>
        </div>
      </div>

      <div class="kpi-grid">
        ${advocates.map(adv => {
          const assignedCases = this.data.cases.filter(c => c.advocateId === adv.id);
          return `
            <div class="card-widget">
              <div style="display:flex; gap:1rem; align-items:center">
                <div class="user-avatar" style="width:54px; height:54px; font-size:1.8rem">${adv.avatar}</div>
                <div>
                  <h3 style="font-family:var(--font-serif); font-size:1.2rem">${adv.name}</h3>
                  <p style="font-size:0.82rem; color:var(--primary); font-weight:600">${adv.specialization}</p>
                  <small style="color:var(--text-dim)">${adv.email}</small>
                </div>
              </div>

              <div style="border-top:1px solid var(--border-color); padding-top:1rem; margin-top:0.5rem">
                <span style="font-size:0.8rem; color:var(--text-muted); font-weight:600">Assigned Active Cases (${assignedCases.length})</span>
                <ul style="list-style:none; margin-top:0.5rem; display:flex; flex-direction:column; gap:0.4rem">
                  ${assignedCases.map(c => `
                    <li style="font-size:0.8rem; background:var(--bg-dark); padding:0.4rem 0.6rem; border-radius:6px">
                      📌 ${c.id}: <strong>${c.title}</strong>
                    </li>
                  `).join('')}
                </ul>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  /* ==========================================================================
     VIEW 5: CLIENT RECORDS
     ========================================================================== */
  renderClientsView() {
    const clients = this.data.users.filter(u => u.role === 'Client');
    return `
      <div class="page-header">
        <div class="page-title">
          <h2>Client Records & Management</h2>
          <p>View registered clients, corporate accounts, and active litigation profiles.</p>
        </div>
      </div>

      <div class="card-widget">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Company / Entity</th>
                <th>Contact Email</th>
                <th>Active Cases</th>
                <th>Total Billed</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${clients.map(cl => {
                const clientCases = this.data.cases.filter(c => c.clientId === cl.id);
                return `
                  <tr>
                    <td><strong>${cl.name}</strong></td>
                    <td>${cl.company || 'Individual'}</td>
                    <td>${cl.email}</td>
                    <td><span class="badge badge-progress">${clientCases.length} Active</span></td>
                    <td><strong>₹ 45,000</strong></td>
                    <td><span class="badge badge-paid">Verified Client</span></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  /* ==========================================================================
     VIEW 6: DOCUMENT VAULT
     ========================================================================== */
  renderDocumentsView() {
    return `
      <div class="page-header">
        <div class="page-title">
          <h2>Legal Document Vault</h2>
          <p>Encrypted document repository for pleadings, exhibits, court orders, and contracts.</p>
        </div>
        <div class="action-bar">
          <button class="btn-primary" id="btnUploadDocModal">
            <span>📤</span> <span>Upload Document</span>
          </button>
        </div>
      </div>

      <div class="document-grid">
        ${this.data.documents.map(doc => `
          <div class="doc-card">
            <div>
              <div class="doc-icon-header">
                <span class="doc-icon">${doc.category === 'Pleadings' ? '⚖️' : doc.category === 'Evidence' ? '📁' : '📜'}</span>
                <span class="badge badge-scheduled" style="font-size:0.7rem">${doc.category}</span>
              </div>
              <div class="doc-meta">
                <h4>${doc.title}</h4>
                <p>Case: <strong>${doc.caseId}</strong></p>
                <p style="font-size:0.75rem; color:var(--text-dim); margin-top:0.25rem">Size: ${doc.fileSize} • ${doc.fileType}</p>
              </div>
            </div>

            <div style="border-top:1px solid var(--border-color); padding-top:0.75rem; margin-top:1rem; display:flex; justify-style:space-between; align-items:center">
              <small style="color:var(--text-dim); font-size:0.72rem">Uploaded by ${doc.uploadedBy}</small>
              <button class="btn-secondary" style="padding:0.25rem 0.5rem; font-size:0.75rem" onclick="alert('Downloading ${doc.title}...')">
                ⬇️ Preview
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  /* ==========================================================================
     VIEW 7: FEE & BILLING MANAGEMENT
     ========================================================================== */
  renderBillingView() {
    return `
      <div class="page-header">
        <div class="page-title">
          <h2>Fee & Billing Management</h2>
          <p>Itemized legal retainer fee invoices, payment tracking, and receipt generation.</p>
        </div>
      </div>

      <div class="card-widget">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Case ID</th>
                <th>Client Name</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Payment Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${this.data.billing.map(inv => `
                <tr>
                  <td><strong>${inv.invoiceNo}</strong></td>
                  <td>${inv.caseId}</td>
                  <td>${inv.clientName}</td>
                  <td>${inv.description}</td>
                  <td><strong style="color:var(--accent-gold)">${inv.amount}</strong></td>
                  <td>${inv.dueDate}</td>
                  <td><span class="badge badge-${inv.status.toLowerCase()}">${inv.status}</span></td>
                  <td>
                    ${inv.status !== 'Paid' ? `
                    <button class="btn-primary btn-pay-inv" data-inv="${inv.invoiceNo}" style="padding:0.25rem 0.6rem; font-size:0.75rem">
                      💳 Pay Invoice
                    </button>
                    ` : `
                    <span style="color:var(--status-success); font-weight:600; font-size:0.8rem">✓ Settled</span>
                    `}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  /* ==========================================================================
     VIEW 8: SDLC PROJECT PLAN & METRICS
     ========================================================================== */
  renderSDLCReportView() {
    const m = this.data.sdlcMetrics;
    return `
      <div class="page-header">
        <div class="page-title">
          <h2>Software Project Plan (SPP) Metrics</h2>
          <p>System Specifications & Cost Allocation for <strong>${m.author}</strong></p>
        </div>
      </div>

      <!-- Cost Estimation Breakdown -->
      <div class="dashboard-grid-2">
        <div class="card-widget">
          <div class="widget-header">
            <h3>Cost Estimation (₹ 1,05,000)</h3>
            <span class="badge badge-paid">12-Week Budget</span>
          </div>

          <table class="data-table">
            <thead>
              <tr>
                <th>Item / Deliverable</th>
                <th>Cost (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${m.costEstimation.map(c => `
                <tr>
                  <td>${c.item}</td>
                  <td><strong>₹ ${c.cost.toLocaleString('en-IN')}</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Risk Matrix -->
        <div class="card-widget">
          <div class="widget-header">
            <h3>Risk Analysis & Mitigation</h3>
          </div>

          <table class="data-table">
            <thead>
              <tr>
                <th>Risk Factor</th>
                <th>Impact</th>
                <th>Mitigation Strategy</th>
              </tr>
            </thead>
            <tbody>
              ${m.riskAnalysis.map(r => `
                <tr>
                  <td><strong>${r.risk}</strong></td>
                  <td><span class="badge badge-overdue">${r.impact}</span></td>
                  <td><small>${r.mitigation}</small></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  /* ==========================================================================
     MODALS & ACTIONS
     ========================================================================== */
  bindPageActions() {
    const btnNewCase = document.getElementById('btnNewCaseModal');
    if (btnNewCase) btnNewCase.addEventListener('click', () => this.showNewCaseModal());

    const btnSchedule = document.getElementById('btnScheduleHearingModal');
    if (btnSchedule) btnSchedule.addEventListener('click', () => this.showScheduleHearingModal());

    const btnUpload = document.getElementById('btnUploadDocModal');
    if (btnUpload) btnUpload.addEventListener('click', () => this.showUploadDocModal());

    document.querySelectorAll('.btn-view-case-detail').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.showCaseDetailModal(id);
      });
    });

    document.querySelectorAll('.btn-pay-inv, #btnPayInvoiceQuick').forEach(btn => {
      btn.addEventListener('click', () => {
        const invNo = btn.getAttribute('data-inv') || 'INV-2026-092';
        this.payInvoice(invNo);
      });
    });

    const statusFilterEl = document.getElementById('caseStatusFilter');
    if (statusFilterEl) {
      statusFilterEl.addEventListener('change', (e) => {
        this.statusFilter = e.target.value;
        this.renderViewOnly();
      });
    }

    const btnViewAll = document.getElementById('btnViewAllCases');
    if (btnViewAll) {
      btnViewAll.addEventListener('click', () => {
        this.currentView = 'cases';
        this.render();
      });
    }
  }

  showNewCaseModal() {
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
      <div class="modal-header">
        <h3>Register New Legal Case</h3>
        <button class="btn-close" id="btnCloseModal">✕</button>
      </div>
      <form id="newCaseForm">
        <div class="form-group">
          <label>Case Title / Parties</label>
          <input type="text" id="caseTitle" class="input-field" placeholder="e.g. Acme Corp vs. City Council" required style="padding-left:1rem" />
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem">
          <div class="form-group">
            <label>Client Name</label>
            <input type="text" id="caseClient" class="input-field" value="Vikramaditya Verma" required style="padding-left:1rem" />
          </div>
          <div class="form-group">
            <label>Case Specialty</label>
            <select id="caseType" class="input-field" style="padding-left:1rem">
              <option value="Commercial Dispute">Commercial Dispute</option>
              <option value="Corporate Compliance">Corporate Compliance</option>
              <option value="Intellectual Property">Intellectual Property</option>
              <option value="Civil Property Law">Civil Property Law</option>
            </select>
          </div>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem">
          <div class="form-group">
            <label>Courtroom / Division</label>
            <input type="text" id="caseCourt" class="input-field" value="High Court - Bench 4" required style="padding-left:1rem" />
          </div>
          <div class="form-group">
            <label>Assigned Advocate</label>
            <select id="caseAdvocate" class="input-field" style="padding-left:1rem">
              <option value="Adv. Rajesh Kumar">Adv. Rajesh Kumar</option>
              <option value="Adv. Ananya Sharma">Adv. Ananya Sharma</option>
            </select>
          </div>
        </div>
        <button type="submit" class="btn-submit">Register Case into System</button>
      </form>
    `;

    this.openModal();

    document.getElementById('newCaseForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const newCase = {
        id: `CS-2026-00${this.data.cases.length + 1}`,
        title: document.getElementById('caseTitle').value,
        clientName: document.getElementById('caseClient').value,
        clientId: 'usr_client1',
        advocateName: document.getElementById('caseAdvocate').value,
        advocateId: 'usr_adv1',
        caseType: document.getElementById('caseType').value,
        court: document.getElementById('caseCourt').value,
        judge: 'Hon. Presiding Officer',
        status: 'Pending',
        filingDate: new Date().toISOString().split('T')[0],
        nextHearing: 'TBD',
        claimAmount: '₹ 50,00,000',
        description: 'Newly registered legal suit.',
        proceedings: [
          { date: new Date().toISOString().split('T')[0], summary: 'Case registered in system portal.' }
        ]
      };
      this.data.cases.unshift(newCase);
      this.saveState();
      this.closeModal();
      this.render();
    });
  }

  showScheduleHearingModal() {
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
      <div class="modal-header">
        <h3>Schedule Court Hearing</h3>
        <button class="btn-close" id="btnCloseModal">✕</button>
      </div>
      <form id="scheduleHearingForm">
        <div class="form-group">
          <label>Select Case</label>
          <select id="hearingCaseId" class="input-field" style="padding-left:1rem">
            ${this.data.cases.map(c => `<option value="${c.id}">${c.id}: ${c.title}</option>`).join('')}
          </select>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem">
          <div class="form-group">
            <label>Hearing Date</label>
            <input type="date" id="hearingDate" class="input-field" value="2026-08-20" required style="padding-left:1rem" />
          </div>
          <div class="form-group">
            <label>Hearing Time</label>
            <input type="text" id="hearingTime" class="input-field" value="11:00 AM" required style="padding-left:1rem" />
          </div>
        </div>
        <div class="form-group">
          <label>Purpose / Listing Stage</label>
          <input type="text" id="hearingPurpose" class="input-field" value="Framing of Issues & Witness Summons" required style="padding-left:1rem" />
        </div>
        <button type="submit" class="btn-submit">Confirm Hearing Booking</button>
      </form>
    `;

    this.openModal();

    document.getElementById('scheduleHearingForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const caseId = document.getElementById('hearingCaseId').value;
      const targetCase = this.data.cases.find(c => c.id === caseId);

      const newHearing = {
        id: `HR-${100 + this.data.hearings.length + 1}`,
        caseId: caseId,
        caseTitle: targetCase ? targetCase.title : 'Legal Case',
        court: targetCase ? targetCase.court : 'High Court',
        judge: targetCase ? targetCase.judge : 'Hon. Presiding Officer',
        date: document.getElementById('hearingDate').value,
        time: document.getElementById('hearingTime').value,
        advocate: targetCase ? targetCase.advocateName : 'Adv. Rajesh Kumar',
        client: targetCase ? targetCase.clientName : 'Client',
        purpose: document.getElementById('hearingPurpose').value,
        status: 'Scheduled'
      };

      if (targetCase) {
        targetCase.nextHearing = `${newHearing.date} ${newHearing.time}`;
        targetCase.status = 'Hearing Scheduled';
      }

      this.data.hearings.unshift(newHearing);
      this.saveState();
      this.closeModal();
      this.render();
    });
  }

  showUploadDocModal() {
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
      <div class="modal-header">
        <h3>Upload Document to Vault</h3>
        <button class="btn-close" id="btnCloseModal">✕</button>
      </div>
      <form id="uploadDocForm">
        <div class="form-group">
          <label>Document Title</label>
          <input type="text" id="docTitle" class="input-field" placeholder="e.g. Affidavit of Evidence" required style="padding-left:1rem" />
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem">
          <div class="form-group">
            <label>Case ID</label>
            <select id="docCaseId" class="input-field" style="padding-left:1rem">
              ${this.data.cases.map(c => `<option value="${c.id}">${c.id}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Category</label>
            <select id="docCategory" class="input-field" style="padding-left:1rem">
              <option value="Pleadings">Pleadings</option>
              <option value="Evidence">Evidence</option>
              <option value="Court Orders">Court Orders</option>
              <option value="Contracts">Contracts</option>
            </select>
          </div>
        </div>
        <button type="submit" class="btn-submit">Upload & Encrypt Document</button>
      </form>
    `;

    this.openModal();

    document.getElementById('uploadDocForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const newDoc = {
        id: `DOC-${500 + this.data.documents.length + 1}`,
        caseId: document.getElementById('docCaseId').value,
        title: document.getElementById('docTitle').value,
        category: document.getElementById('docCategory').value,
        fileSize: '3.4 MB',
        fileType: 'PDF Document',
        uploadedBy: this.data.currentUser.name,
        uploadDate: new Date().toISOString().split('T')[0],
        tags: ['Verified']
      };
      this.data.documents.unshift(newDoc);
      this.saveState();
      this.closeModal();
      this.render();
    });
  }

  showCaseDetailModal(caseId) {
    const c = this.data.cases.find(item => item.id === caseId);
    if (!c) return;

    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
      <div class="modal-header">
        <div>
          <h3>${c.id}: ${c.title}</h3>
          <span class="badge badge-${this.getStatusBadgeClass(c.status)}">${c.status}</span>
        </div>
        <button class="btn-close" id="btnCloseModal">✕</button>
      </div>

      <div style="display:flex; flex-direction:column; gap:1rem">
        <p style="font-size:0.9rem; color:var(--text-muted)">${c.description}</p>

        <div style="background:var(--bg-dark); padding:1rem; border-radius:8px; display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; font-size:0.85rem">
          <div>Client: <strong>${c.clientName}</strong></div>
          <div>Advocate: <strong>${c.advocateName}</strong></div>
          <div>Court: <strong>${c.court}</strong></div>
          <div>Judge: <strong>${c.judge}</strong></div>
          <div>Claim Amount: <strong style="color:var(--accent-gold)">${c.claimAmount}</strong></div>
          <div>Next Hearing: <strong>${c.nextHearing}</strong></div>
        </div>

        <h4 style="font-family:var(--font-serif); margin-top:0.5rem">Court Proceedings Log</h4>
        <div class="timeline-list">
          ${c.proceedings.map(p => `
            <div class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <small>${p.date}</small>
                <p style="font-size:0.85rem; color:var(--text-main)">${p.summary}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.openModal();
  }

  payInvoice(invoiceNo) {
    const inv = this.data.billing.find(b => b.invoiceNo === invoiceNo);
    if (inv) {
      inv.status = 'Paid';
      inv.paidDate = new Date().toISOString().split('T')[0];
      this.saveState();
      alert(`Payment for Invoice ${invoiceNo} (Amount: ${inv.amount}) processed successfully!`);
      this.render();
    }
  }

  openModal() {
    const overlay = document.getElementById('modalOverlay');
    overlay.classList.add('active');

    const closeBtn = document.getElementById('btnCloseModal');
    if (closeBtn) closeBtn.onclick = () => this.closeModal();

    overlay.onclick = (e) => {
      if (e.target === overlay) this.closeModal();
    };
  }

  closeModal() {
    const overlay = document.getElementById('modalOverlay');
    overlay.classList.remove('active');
  }

  /* Helpers */
  filterCases(cases) {
    return cases.filter(c => {
      const matchSearch = this.searchQuery === '' ||
        c.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        c.clientName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        c.advocateName.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchStatus = this.statusFilter === 'All' || c.status === this.statusFilter;

      return matchSearch && matchStatus;
    });
  }

  getStatusBadgeClass(status) {
    switch (status) {
      case 'Hearing Scheduled': return 'scheduled';
      case 'In Progress': return 'progress';
      case 'Pending': return 'pending';
      case 'Closed': return 'closed';
      default: return 'pending';
    }
  }
}

// Instantiate app on load
window.addEventListener('DOMContentLoaded', () => {
  window.app = new LegalApp();
});
