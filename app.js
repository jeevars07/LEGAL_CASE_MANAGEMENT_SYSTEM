// Legal Case Management System – Application Engine
// Author: JEEVA R S (Digital ID: 2512007)
// Modules: Login & User Management | Client Management | Case Management

import { initialData } from './mockData.js';

class LegalApp {
  constructor() {
    const saved = localStorage.getItem('lcms_data');
    if (saved) {
      this.data = JSON.parse(saved);
      this._migrateOldData();
    } else {
      this.data = JSON.parse(JSON.stringify(initialData));
      this._initializePasswords();
    }

    // UI State
    this.currentView    = 'overview';
    this.searchQuery    = '';
    this.statusFilter   = 'All';
    this.clientSearch   = '';
    this.userSearch     = '';
    this.showPassword   = false;
    this.activeRole     = 'Admin';

    this.init();
  }

  /* ──────────────────────────────────────────────────────────────────────────
     UTILITIES: PASSWORD HASHING
     djb2 hash – demo purposes only; use bcrypt on a real server.
  ─────────────────────────────────────────────────────────────────────────── */
  simpleHash(str) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
      hash = hash & hash;
    }
    return (hash >>> 0).toString(16);
  }

  _initializePasswords() {
    this.data.users.forEach(u => {
      if (u.plainPassword) {
        u.passwordHash = this.simpleHash(u.plainPassword);
        delete u.plainPassword;
      }
    });
    this.saveState();
  }

  _migrateOldData() {
    let modified = false;

    // Ensure clients array exists
    if (!this.data.clients) {
      this.data.clients = JSON.parse(JSON.stringify(initialData.clients));
      modified = true;
    }

    // Ensure users have username and passwordHash
    this.data.users.forEach(u => {
      const initialUser = initialData.users.find(iu => iu.id === u.id);
      if (initialUser) {
        if (!u.username) {
          u.username = initialUser.username;
          modified = true;
        }
        if (!u.passwordHash && !u.plainPassword) {
          u.plainPassword = initialUser.plainPassword;
          modified = true;
        }
      }
    });

    // Hash any plainPasswords that were set during migration
    this.data.users.forEach(u => {
      if (u.plainPassword) {
        u.passwordHash = this.simpleHash(u.plainPassword);
        delete u.plainPassword;
        modified = true;
      }
    });

    if (modified) {
      this.saveState();
    }
  }

  saveState() {
    localStorage.setItem('lcms_data', JSON.stringify(this.data));
  }

  generateId(prefix) {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  }

  generateClientId() {
    const year = new Date().getFullYear();
    const seq  = (this.data.clients.length + 1).toString().padStart(3, '0');
    return `CL-${year}-${seq}`;
  }

  generateCaseNumber() {
    const year = new Date().getFullYear();
    const seq  = (this.data.cases.length + 1).toString().padStart(3, '0');
    return `CS-${year}-${seq}`;
  }

  /* ──────────────────────────────────────────────────────────────────────────
     INIT & CLOCK
  ─────────────────────────────────────────────────────────────────────────── */
  init() {
    this.startClock();
    this.render();
  }

  startClock() {
    setInterval(() => {
      const el = document.getElementById('liveClock');
      if (el) {
        const now = new Date();
        el.innerText = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
          + ' | ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      }
    }, 1000);
  }

  /* ──────────────────────────────────────────────────────────────────────────
     AUTHENTICATION
  ─────────────────────────────────────────────────────────────────────────── */
  login(username, password) {
    if (!username || !password) return { success: false, error: 'Please enter both username and password.' };

    const hashedInput = this.simpleHash(password);
    const user = this.data.users.find(u =>
      u.username === username.trim() && u.passwordHash === hashedInput
    );

    if (!user) {
      const exists = this.data.users.find(u => u.username === username.trim());
      if (!exists) return { success: false, error: 'Username not found. Please check your credentials.' };
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    if (user.status === 'Inactive') {
      return { success: false, error: 'Your account has been deactivated. Contact the administrator.' };
    }

    this.data.currentUser = { ...user };
    this.saveState();
    this.currentView = 'overview';
    this.render();
    return { success: true };
  }

  // Legacy: role-switcher in topbar (for demo/evaluation)
  loginAs(roleKey) {
    const fullRole = this.getNormalizedRole(roleKey);
    const user = this.data.users.find(u => u.role === fullRole) || this.data.users[0];
    this.data.currentUser = { ...user };
    this.saveState();
    this.currentView = 'overview';
    this.render();
  }

  logout() {
    this.data.currentUser = null;
    this.activeRole = 'Admin';
    this.saveState();
    this.render();
  }

  getNormalizedRole(k) {
    if (k === 'Admin' || k === 'Administrator') return 'Administrator';
    if (k === 'Advocate') return 'Advocate';
    if (k === 'Clerk' || k === 'Clerk / Paralegal') return 'Clerk / Paralegal';
    if (k === 'Client') return 'Client';
    return 'Administrator';
  }

  /* ──────────────────────────────────────────────────────────────────────────
     CORE RENDER
  ─────────────────────────────────────────────────────────────────────────── */
  render() {
    const app = document.getElementById('app');
    if (!this.data.currentUser) {
      app.innerHTML = this.renderLoginScreen();
      this.bindLoginEvents();
    } else {
      app.innerHTML = this.renderDashboardLayout();
      this.bindDashboardEvents();
    }
  }

  renderViewOnly() {
    const container = document.querySelector('.page-container');
    if (container) {
      container.innerHTML = this.renderCurrentView();
      this.bindPageActions();
    }
  }

  renderCurrentView() {
    const role = this.data.currentUser?.role;

    // Access control guard
    if (this.currentView === 'users' && role !== 'Administrator') this.currentView = 'overview';
    if (this.currentView === 'clients' && role === 'Advocate') this.currentView = 'overview';

    switch (this.currentView) {
      case 'overview':    return this.renderOverviewView();
      case 'users':       return role === 'Administrator' ? this.renderUsersView() : this.renderAccessDenied();
      case 'cases':       return this.renderCasesView();
      case 'hearings':    return this.renderHearingsView();
      case 'advocates':   return role !== 'Client' ? this.renderAdvocatesView() : this.renderAccessDenied();
      case 'clients':     return (role === 'Administrator' || role === 'Clerk / Paralegal' || role === 'Client') ? this.renderClientsView() : this.renderAccessDenied();
      case 'documents':   return this.renderDocumentsView();
      case 'billing':     return this.renderBillingView();
      case 'sdlc-report': return this.renderSDLCReportView();
      default:            return this.renderOverviewView();
    }
  }

  renderAccessDenied() {
    return `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:60vh;text-align:center;gap:1rem">
        <div style="font-size:4rem">🚫</div>
        <h2 style="font-family:var(--font-serif)">Access Denied</h2>
        <p style="color:var(--text-muted)">You do not have permission to view this page.</p>
      </div>`;
  }

  /* ──────────────────────────────────────────────────────────────────────────
     LOGIN SCREEN
  ─────────────────────────────────────────────────────────────────────────── */
  renderLoginScreen() {
    const cred = this.getRoleCredential(this.activeRole);
    return `
      <div class="login-page">
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
              <span style="display:inline-block;width:8px;height:8px;background:#10b981;border-radius:50%"></span>
              System Operational (99% Uptime)
            </span>
            <span class="status-pill-secondary">🗄️ Secured Local Storage Active</span>
          </div>
        </header>

        <div class="login-card-container">
          <div class="login-hero-card">
            <div class="practice-badge">
              <span>⚖️</span><span>Practice Management Automation</span>
            </div>
            <h2>ENTERPRISE LEGAL OPERATIONS &amp; CASE TRACKING</h2>
            <p>Streamline client management, hearing schedules, court proceedings, document archives, and billing in one secure environment.</p>

            <div class="login-features-list">
              <div class="login-feature-item"><span>✅</span><span>Role-Based Access Control</span></div>
              <div class="login-feature-item"><span>✅</span><span>Client &amp; Case CRUD Management</span></div>
              <div class="login-feature-item"><span>✅</span><span>Hearing Scheduler &amp; Document Vault</span></div>
              <div class="login-feature-item"><span>✅</span><span>Secure Authentication with Password Hashing</span></div>
            </div>
          </div>

          <div class="login-card-form">
            <div class="form-header-group">
              <h3>SYSTEM AUTHENTICATION</h3>
              <p>Select your role and enter credentials to continue.</p>
            </div>

            <div class="role-tabs-strip">
              ${['Admin','Advocate','Clerk','Client'].map(r => `
                <button type="button" class="role-tab-btn ${this.activeRole === r ? 'active' : ''}" data-role="${r}">
                  <span class="role-icon">${r==='Admin'?'👨‍💼':r==='Advocate'?'⚖️':r==='Clerk'?'📝':'👤'}</span>
                  <span>${r}</span>
                </button>`).join('')}
            </div>

            <form id="loginForm">
              <div class="form-input-block">
                <label>👤 Username</label>
                <div class="input-group-relative">
                  <span class="input-icon-left">👤</span>
                  <input type="text" id="loginUsername" class="input-control"
                    placeholder="Enter your username" required
                    value="${cred.username}" />
                </div>
              </div>

              <div class="form-input-block">
                <label>🔑 Password</label>
                <div class="input-group-relative">
                  <span class="input-icon-left">🔒</span>
                  <input type="password" id="loginPassword" class="input-control"
                    placeholder="Enter your password" required />
                  <span class="input-icon-right" id="togglePassword" style="cursor:pointer">👁️</span>
                </div>
              </div>

              <div id="loginError" class="login-error-msg" style="display:none"></div>

              <div class="form-options-row">
                <label class="remember-label">
                  <input type="checkbox" checked /><span>Remember session</span>
                </label>
                <a href="#" class="forgot-link" onclick="alert('Contact administrator to reset password.'); return false;">Forgot Password?</a>
              </div>

              <button type="submit" class="btn-login-main" id="btnLoginSubmit">
                <span id="btnLoginText">Log In to System</span>
              </button>

              <div class="login-hint-box">
                <strong>Demo Credentials:</strong> ${cred.username} / ${cred.hint}
              </div>
            </form>
          </div>
        </div>

        <footer style="text-align:center;color:var(--text-dim);font-size:0.8rem;margin-top:1rem">
          Legal Case Management System • Authorized Enterprise Portal Access Only
        </footer>
      </div>`;
  }

  getRoleCredential(role) {
    const map = {
      'Admin':    { username: 'admin',          hint: 'Admin@123'  },
      'Advocate': { username: 'advocate.smith', hint: 'Adv@1234'   },
      'Clerk':    { username: 'clerk.ramesh',   hint: 'Clerk@123'  },
      'Client':   { username: 'client.vikram',  hint: 'Client@1'   }
    };
    return map[role] || map['Admin'];
  }

  bindLoginEvents() {
    document.querySelectorAll('.role-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const role = btn.getAttribute('data-role');
        this.activeRole = role;
        const cred = this.getRoleCredential(role);
        const usernameEl = document.getElementById('loginUsername');
        if (usernameEl) usernameEl.value = cred.username;
        document.querySelectorAll('.role-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const hint = document.querySelector('.login-hint-box');
        if (hint) hint.innerHTML = `<strong>Demo Credentials:</strong> ${cred.username} / ${cred.hint}`;
        const errEl = document.getElementById('loginError');
        if (errEl) errEl.style.display = 'none';
      });
    });

    const toggleBtn = document.getElementById('togglePassword');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const passEl = document.getElementById('loginPassword');
        if (passEl) passEl.type = passEl.type === 'password' ? 'text' : 'password';
      });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;
        const errEl    = document.getElementById('loginError');
        const btnText  = document.getElementById('btnLoginText');
        const submitBtn = document.getElementById('btnLoginSubmit');

        errEl.style.display = 'none';
        submitBtn.disabled = true;
        btnText.textContent = 'Authenticating...';

        setTimeout(() => {
          const result = this.login(username, password);
          if (!result.success) {
            errEl.textContent = result.error;
            errEl.style.display = 'block';
            submitBtn.disabled = false;
            btnText.textContent = 'Log In to System';
          }
        }, 500);
      });
    }
  }

  /* ──────────────────────────────────────────────────────────────────────────
     DASHBOARD LAYOUT
  ─────────────────────────────────────────────────────────────────────────── */
  renderDashboardLayout() {
    const user     = this.data.currentUser;
    const navItems = this.getSidebarNavItems();

    return `
      <div class="dashboard-layout">
        <aside class="sidebar">
          <div>
            <div class="sidebar-header">
              <div class="brand-header">
                <div class="brand-icon" style="width:38px;height:38px;font-size:1.2rem">⚖️</div>
                <div>
                  <div class="brand-title" style="font-size:1.15rem">LEGAL SYSTEM</div>
                  <div class="brand-subtitle" style="font-size:0.65rem">ENTERPRISE PORTAL</div>
                </div>
              </div>
            </div>

            <ul class="nav-menu">
              ${navItems.map(item => `
                <li>
                  <button class="nav-item-btn ${this.currentView === item.view ? 'active' : ''}" data-view="${item.view}">
                    <span>${item.icon}</span>
                    <span>${item.label}</span>
                    ${item.badge !== undefined ? `<span class="badge-count">${item.badge}</span>` : ''}
                  </button>
                </li>`).join('')}
            </ul>
          </div>

          <div class="sidebar-footer">
            <div class="user-profile-chip">
              <div class="user-avatar">${user.avatar || '👤'}</div>
              <div class="user-meta">
                <strong>${user.name}</strong>
                <span>${user.role}</span>
              </div>
              <button class="btn-icon" id="btnLogout" title="Sign Out" style="margin-left:auto;width:30px;height:30px;font-size:0.8rem">🚪</button>
            </div>
          </div>
        </aside>

        <main class="main-wrapper">
          <header class="topbar">
            <div class="topbar-left">
              <div class="search-box">
                <span class="search-icon">🔍</span>
                <input type="text" id="globalSearchInput" placeholder="Search case #, client name, court..." value="${this.searchQuery}" />
              </div>
            </div>
            <div class="topbar-right">
              <div class="live-clock-badge">
                <span>🕒</span><span id="liveClock">Loading...</span>
              </div>
              <select id="topbarRoleSelect" class="role-switcher-select" title="Switch Portal Role (Demo)">
                <option value="Admin"     ${user.role === 'Administrator'    ? 'selected' : ''}>Role: Admin</option>
                <option value="Advocate"  ${user.role === 'Advocate'         ? 'selected' : ''}>Role: Advocate</option>
                <option value="Clerk"     ${user.role === 'Clerk / Paralegal' ? 'selected' : ''}>Role: Clerk</option>
                <option value="Client"    ${user.role === 'Client'           ? 'selected' : ''}>Role: Client</option>
              </select>
              <button class="btn-icon" id="btnNotifications" title="Alerts" style="position:relative">
                <span>🔔</span>
                <span style="position:absolute;top:2px;right:2px;width:8px;height:8px;background:var(--primary);border-radius:50%"></span>
              </button>
            </div>
          </header>

          <div class="page-container">
            ${this.renderCurrentView()}
          </div>
        </main>
      </div>

      <div id="modalOverlay" class="modal-overlay">
        <div id="modalContent" class="modal-container"></div>
      </div>

      <div id="toastContainer" class="toast-container"></div>`;
  }

  getSidebarNavItems() {
    const user  = this.data.currentUser;
    const role  = user.role;
    const items = [];

    items.push({ view: 'overview', icon: '📊', label: 'Dashboard Overview' });

    if (role === 'Administrator') {
      items.push({ view: 'users', icon: '👤', label: 'User Management', badge: this.data.users.length });
    }

    const myCases = this.filterCasesForRole(this.data.cases);
    items.push({ view: 'cases', icon: '📁', label: 'Case Management', badge: myCases.length });

    if (role === 'Client') {
      items.push({ view: 'hearings', icon: '🏛️', label: 'My Hearings' });
      items.push({ view: 'clients', icon: '🧾', label: 'My Profile' });
      items.push({ view: 'billing', icon: '💳', label: 'My Fee Details' });
    } else {
      items.push({ view: 'hearings', icon: '🏛️', label: 'Hearing Scheduler', badge: this.data.hearings.length });
      if (role === 'Administrator' || role === 'Clerk / Paralegal') {
        items.push({ view: 'clients', icon: '🤝', label: 'Client Management', badge: this.data.clients.length });
      }
      items.push({ view: 'advocates', icon: '⚖️', label: 'Advocate Directory' });
      items.push({ view: 'documents', icon: '📄', label: 'Document Vault' });
      items.push({ view: 'billing', icon: '💳', label: 'Fee & Billing' });
    }

    items.push({ view: 'sdlc-report', icon: '📘', label: 'SDLC Plan & Metrics' });
    return items;
  }

  bindDashboardEvents() {
    document.querySelectorAll('.nav-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-view');
        if (view) { this.currentView = view; this.render(); }
      });
    });

    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) btnLogout.addEventListener('click', () => this.logout());

    const roleSelect = document.getElementById('topbarRoleSelect');
    if (roleSelect) roleSelect.addEventListener('change', e => this.loginAs(e.target.value));

    const searchInput = document.getElementById('globalSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', e => {
        this.searchQuery = e.target.value;
        this.renderViewOnly();
      });
    }

    this.bindPageActions();
  }

  /* ──────────────────────────────────────────────────────────────────────────
     PAGE ACTIONS BINDING (re-runs after every renderViewOnly())
  ─────────────────────────────────────────────────────────────────────────── */
  bindPageActions() {
    // ── Overview Buttons ──
    const btnNewCaseOverview = document.getElementById('btnNewCaseModal');
    if (btnNewCaseOverview) btnNewCaseOverview.addEventListener('click', () => this.showCaseModal(null));

    const btnScheduleOverview = document.getElementById('btnScheduleHearingModal');
    if (btnScheduleOverview) btnScheduleOverview.addEventListener('click', () => this.showScheduleHearingModal());

    const btnViewAll = document.getElementById('btnViewAllCases');
    if (btnViewAll) btnViewAll.addEventListener('click', () => { this.currentView = 'cases'; this.render(); });

    // ── User Management ──
    const btnAddUser = document.getElementById('btnAddUserModal');
    if (btnAddUser) btnAddUser.addEventListener('click', () => this.showUserModal(null));

    document.querySelectorAll('.btn-edit-user').forEach(btn => {
      btn.addEventListener('click', () => this.showUserModal(btn.getAttribute('data-id')));
    });

    document.querySelectorAll('.btn-delete-user').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (id === this.data.currentUser.id) { this.showToast('You cannot delete your own account.', 'error'); return; }
        const u = this.data.users.find(u => u.id === id);
        this.showConfirmDialog(`Delete user "<strong>${u?.name}</strong>"? This cannot be undone.`, () => {
          this.data.users = this.data.users.filter(u => u.id !== id);
          // Unlink any client records
          this.data.clients.forEach(c => { if (c.userId === id) c.userId = null; });
          this.saveState();
          this.showToast(`User deleted successfully.`, 'success');
          this.renderViewOnly();
        });
      });
    });

    const userSearchEl = document.getElementById('userSearchInput');
    if (userSearchEl) {
      userSearchEl.addEventListener('input', e => { this.userSearch = e.target.value; this.renderViewOnly(); });
    }

    // ── Client Management ──
    const btnAddClient = document.getElementById('btnAddClientModal');
    if (btnAddClient) btnAddClient.addEventListener('click', () => this.showClientModal(null));

    document.querySelectorAll('.btn-view-client').forEach(btn => {
      btn.addEventListener('click', () => this.showClientDetailModal(btn.getAttribute('data-id')));
    });

    document.querySelectorAll('.btn-edit-client').forEach(btn => {
      btn.addEventListener('click', () => this.showClientModal(btn.getAttribute('data-id')));
    });

    document.querySelectorAll('.btn-delete-client').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const cl = this.data.clients.find(c => c.id === id);
        this.showConfirmDialog(`Delete client "<strong>${cl?.fullName}</strong>"? Their user account will also be removed.`, () => {
          if (cl.userId) this.data.users = this.data.users.filter(u => u.id !== cl.userId);
          this.data.clients = this.data.clients.filter(c => c.id !== id);
          this.saveState();
          this.showToast(`Client deleted.`, 'success');
          this.renderViewOnly();
        });
      });
    });

    const clientSearchEl = document.getElementById('clientSearchInput');
    if (clientSearchEl) {
      clientSearchEl.addEventListener('input', e => { this.clientSearch = e.target.value; this.renderViewOnly(); });
    }

    // ── Case Management ──
    const btnNewCase = document.getElementById('btnNewCaseMgmt');
    if (btnNewCase) btnNewCase.addEventListener('click', () => this.showCaseModal(null));

    document.querySelectorAll('.btn-view-case-detail').forEach(btn => {
      btn.addEventListener('click', () => this.showCaseDetailModal(btn.getAttribute('data-id')));
    });

    document.querySelectorAll('.btn-edit-case').forEach(btn => {
      btn.addEventListener('click', () => this.showCaseModal(btn.getAttribute('data-id')));
    });

    document.querySelectorAll('.btn-delete-case').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const c = this.data.cases.find(c => c.id === id);
        this.showConfirmDialog(`Delete case "<strong>${c?.caseNumber}: ${c?.title}</strong>"? This cannot be undone.`, () => {
          this.data.cases = this.data.cases.filter(c => c.id !== id);
          this.saveState();
          this.showToast(`Case deleted.`, 'success');
          this.renderViewOnly();
        });
      });
    });

    const statusFilterEl = document.getElementById('caseStatusFilter');
    if (statusFilterEl) {
      statusFilterEl.addEventListener('change', e => { this.statusFilter = e.target.value; this.renderViewOnly(); });
    }

    // ── Document / Billing ──
    const btnUpload = document.getElementById('btnUploadDocModal');
    if (btnUpload) btnUpload.addEventListener('click', () => this.showUploadDocModal());

    document.querySelectorAll('.btn-pay-inv, #btnPayInvoiceQuick').forEach(btn => {
      btn.addEventListener('click', () => {
        const invNo = btn.getAttribute('data-inv') || 'INV-2026-092';
        this.payInvoice(invNo);
      });
    });
  }

  /* ──────────────────────────────────────────────────────────────────────────
     VIEW: OVERVIEW DASHBOARD
  ─────────────────────────────────────────────────────────────────────────── */
  renderOverviewView() {
    const user   = this.data.currentUser;
    const myCases = this.filterCasesForRole(this.data.cases);
    const active  = myCases.filter(c => c.status === 'Active').length;
    const pending = myCases.filter(c => c.status === 'Pending').length;
    const closed  = myCases.filter(c => c.status === 'Closed').length;
    const scheduledHearings = this.data.hearings.filter(h => h.status === 'Scheduled').length;
    const filteredCases = this.filterCases(myCases).slice(0, 5);

    return `
      <div class="page-header">
        <div class="page-title">
          <h2>Welcome back, ${user.name}</h2>
          <p>Legal Management Console — ${user.role} Mode</p>
        </div>
        <div class="action-bar">
          ${user.role !== 'Client' ? `
            <button class="btn-primary" id="btnNewCaseModal"><span>➕</span> <span>Register New Case</span></button>
            <button class="btn-secondary" id="btnScheduleHearingModal"><span>🏛️</span> <span>Schedule Hearing</span></button>
          ` : `
            <button class="btn-primary" id="btnPayInvoiceQuick"><span>💳</span> <span>Pay Fee Balance</span></button>
          `}
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-card-info">
            <small>Total Cases</small>
            <h3>${myCases.length}</h3>
            <span>All registered cases</span>
          </div>
          <div class="kpi-icon-box">📁</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-card-info">
            <small>Active Cases</small>
            <h3>${active}</h3>
            <span>Currently in progress</span>
          </div>
          <div class="kpi-icon-box">⚖️</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-card-info">
            <small>Pending Cases</small>
            <h3>${pending}</h3>
            <span>Awaiting proceedings</span>
          </div>
          <div class="kpi-icon-box">⏳</div>
        </div>
        ${(user.role === 'Administrator' || user.role === 'Clerk / Paralegal') ? `
        <div class="kpi-card">
          <div class="kpi-card-info">
            <small>Total Clients</small>
            <h3>${this.data.clients.length}</h3>
            <span>Registered client records</span>
          </div>
          <div class="kpi-icon-box">👥</div>
        </div>` : `
        <div class="kpi-card">
          <div class="kpi-card-info">
            <small>Closed Cases</small>
            <h3>${closed}</h3>
            <span>Successfully resolved</span>
          </div>
          <div class="kpi-icon-box">✅</div>
        </div>`}
      </div>

      <div class="dashboard-grid-2">
        <div class="card-widget">
          <div class="widget-header">
            <h3>Recent Cases</h3>
            <button class="btn-secondary" style="padding:0.4rem 0.8rem;font-size:0.8rem" id="btnViewAllCases">View All</button>
          </div>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Case No.</th><th>Title</th><th>Client</th><th>Status</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${filteredCases.length === 0 ? `
                  <tr><td colspan="5" style="text-align:center;padding:2rem;color:var(--text-dim)">No cases found.</td></tr>
                ` : filteredCases.map(c => `
                  <tr>
                    <td><strong style="color:var(--primary)">${c.caseNumber}</strong></td>
                    <td>${c.title}</td>
                    <td>${c.clientName}</td>
                    <td><span class="badge badge-${this.getStatusBadgeClass(c.status)}">${c.status}</span></td>
                    <td>
                      <button class="btn-secondary btn-view-case-detail" data-id="${c.id}"
                        style="padding:0.25rem 0.6rem;font-size:0.75rem">View</button>
                    </td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="card-widget">
          <div class="widget-header">
            <h3>Hearing Timeline</h3>
            <span style="font-size:0.8rem;color:var(--primary)">Upcoming</span>
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
              </div>`).join('')}
          </div>
        </div>
      </div>

      <div class="card-widget">
        <div class="widget-header">
          <h3>Case Distribution by Legal Specialty &amp; Status</h3>
          <span style="font-size:0.8rem;color:var(--text-muted)">Live System Metrics</span>
        </div>
        <div class="svg-chart-container">
          <div class="chart-bar-group">
            <div class="chart-bar" style="height:80%" data-value="Commercial (45%)"></div>
            <span class="chart-label">Commercial</span>
          </div>
          <div class="chart-bar-group">
            <div class="chart-bar" style="height:60%" data-value="Corporate (30%)"></div>
            <span class="chart-label">Corporate</span>
          </div>
          <div class="chart-bar-group">
            <div class="chart-bar" style="height:40%" data-value="IP Petition (20%)"></div>
            <span class="chart-label">IP Petitions</span>
          </div>
          <div class="chart-bar-group">
            <div class="chart-bar" style="height:90%" data-value="Civil Property (50%)"></div>
            <span class="chart-label">Civil Law</span>
          </div>
        </div>
      </div>`;
  }

  /* ──────────────────────────────────────────────────────────────────────────
     MODULE 1: USER MANAGEMENT (Admin Only)
  ─────────────────────────────────────────────────────────────────────────── */
  renderUsersView() {
    const q = (this.userSearch || '').toLowerCase();
    const users = this.data.users.filter(u =>
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );

    const roleBadgeMap = {
      'Administrator':    'role-admin',
      'Advocate':         'role-advocate',
      'Clerk / Paralegal':'role-clerk',
      'Client':           'role-client'
    };

    return `
      <div class="page-header">
        <div class="page-title">
          <h2>User Management</h2>
          <p>Manage system users, assign roles, and control access permissions.</p>
        </div>
        <div class="action-bar">
          <button class="btn-primary" id="btnAddUserModal">
            <span>➕</span> <span>Add New User</span>
          </button>
        </div>
      </div>

      <div class="card-widget">
        <div class="widget-header" style="flex-wrap:wrap;gap:0.75rem">
          <input type="text" id="userSearchInput" class="search-input-inline"
            placeholder="🔍 Search by name, username, role, email..."
            value="${this.userSearch || ''}" />
          <span style="color:var(--text-muted);font-size:0.85rem">${users.length} user(s)</span>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Username</th>
                <th>Role</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${users.length === 0 ? `
                <tr><td colspan="8">
                  <div class="empty-state"><div class="empty-state-icon">👤</div><p>No users found.</p></div>
                </td></tr>
              ` : users.map(u => `
                <tr>
                  <td>
                    <div style="display:flex;align-items:center;gap:0.6rem">
                      <div class="user-avatar" style="width:32px;height:32px;font-size:1rem">${u.avatar || '👤'}</div>
                      <div>
                        <strong>${u.name}</strong><br/>
                        <small style="color:var(--text-dim)">${u.designation || u.specialization || ''}</small>
                      </div>
                    </div>
                  </td>
                  <td><code class="username-code">${u.username}</code></td>
                  <td><span class="role-badge ${roleBadgeMap[u.role] || ''}">${u.role}</span></td>
                  <td>${u.email}</td>
                  <td>${u.phone || '—'}</td>
                  <td>
                    <span class="badge ${u.status === 'Active' ? 'badge-paid' : 'badge-closed'}">
                      ${u.status}
                    </span>
                  </td>
                  <td><small style="color:var(--text-dim)">${u.createdAt || '—'}</small></td>
                  <td>
                    <div class="action-buttons">
                      <button class="btn-icon-sm btn-edit-user" data-id="${u.id}" title="Edit User">✏️</button>
                      ${u.id !== 'usr_admin' ? `
                        <button class="btn-icon-sm btn-icon-danger btn-delete-user" data-id="${u.id}" title="Delete User">🗑️</button>
                      ` : '<span title="Admin account cannot be deleted" style="font-size:0.75rem;color:var(--text-dim)">🔒</span>'}
                    </div>
                  </td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>`;
  }

  /* ──────────────────────────────────────────────────────────────────────────
     MODULE 2: CLIENT MANAGEMENT
  ─────────────────────────────────────────────────────────────────────────── */
  renderClientsView() {
    const user = this.data.currentUser;

    // Client role: show only their own profile
    if (user.role === 'Client') {
      const myClient = this.data.clients.find(c => c.userId === user.id);
      if (!myClient) {
        return `
          <div class="page-header">
            <div class="page-title"><h2>My Profile</h2><p>Your registered client information.</p></div>
          </div>
          <div class="empty-state">
            <div class="empty-state-icon">🧾</div>
            <p>Your client profile has not been set up yet. Please contact the administrator.</p>
          </div>`;
      }
      return this.renderClientOwnProfile(myClient);
    }

    const canEdit   = user.role === 'Administrator' || user.role === 'Clerk / Paralegal';
    const canDelete = user.role === 'Administrator';
    const q = (this.clientSearch || '').toLowerCase();

    const clients = this.data.clients.filter(c =>
      !q ||
      c.fullName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.clientId.toLowerCase().includes(q) ||
      (c.phone && c.phone.includes(q)) ||
      (c.company && c.company.toLowerCase().includes(q))
    );

    return `
      <div class="page-header">
        <div class="page-title">
          <h2>Client Management</h2>
          <p>Register, search, view, and manage all client records.</p>
        </div>
        <div class="action-bar">
          ${canEdit ? `
            <button class="btn-primary" id="btnAddClientModal">
              <span>➕</span> <span>Add Client</span>
            </button>` : ''}
        </div>
      </div>

      <div class="card-widget">
        <div class="widget-header" style="flex-wrap:wrap;gap:0.75rem">
          <input type="text" id="clientSearchInput" class="search-input-inline"
            placeholder="🔍 Search by name, email, ID, phone..."
            value="${this.clientSearch || ''}" />
          <span style="color:var(--text-muted);font-size:0.85rem">${clients.length} client(s)</span>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Client ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Gender</th>
                <th>Reg. Date</th>
                <th>Cases</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${clients.length === 0 ? `
                <tr><td colspan="8">
                  <div class="empty-state">
                    <div class="empty-state-icon">🤝</div>
                    <p>No clients found.${canEdit ? ' Add your first client!' : ''}</p>
                  </div>
                </td></tr>
              ` : clients.map(cl => {
                const clientCases = this.data.cases.filter(c => c.clientId === cl.id);
                return `
                  <tr>
                    <td><strong style="color:var(--primary)">${cl.clientId}</strong></td>
                    <td>
                      <div style="display:flex;align-items:center;gap:0.5rem">
                        <div style="width:28px;height:28px;border-radius:50%;background:var(--primary-light);display:flex;align-items:center;justify-content:center;font-size:0.85rem">
                          ${cl.gender === 'Female' ? '👩' : '👤'}
                        </div>
                        <div>
                          <strong>${cl.fullName}</strong><br/>
                          <small style="color:var(--text-dim)">${cl.company || 'Individual'}</small>
                        </div>
                      </div>
                    </td>
                    <td>${cl.email}</td>
                    <td>${cl.phone}</td>
                    <td>${cl.gender}</td>
                    <td><small>${cl.registrationDate}</small></td>
                    <td>
                      <span class="badge ${clientCases.length > 0 ? 'badge-progress' : 'badge-pending'}">
                        ${clientCases.length} case(s)
                      </span>
                    </td>
                    <td>
                      <div class="action-buttons">
                        <button class="btn-icon-sm btn-view-client" data-id="${cl.id}" title="View Details">👁️</button>
                        ${canEdit ? `<button class="btn-icon-sm btn-edit-client" data-id="${cl.id}" title="Edit">✏️</button>` : ''}
                        ${canDelete ? `<button class="btn-icon-sm btn-icon-danger btn-delete-client" data-id="${cl.id}" title="Delete">🗑️</button>` : ''}
                      </div>
                    </td>
                  </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>`;
  }

  renderClientOwnProfile(cl) {
    const clientCases = this.filterCasesForRole(this.data.cases);
    return `
      <div class="page-header">
        <div class="page-title"><h2>My Profile</h2><p>Your registered client information.</p></div>
      </div>
      <div class="dashboard-grid-2">
        <div class="card-widget">
          <div class="widget-header"><h3>Personal Information</h3></div>
          <div class="profile-details-grid">
            <div class="profile-detail-item"><span>Client ID</span><strong>${cl.clientId}</strong></div>
            <div class="profile-detail-item"><span>Full Name</span><strong>${cl.fullName}</strong></div>
            <div class="profile-detail-item"><span>Email</span><strong>${cl.email}</strong></div>
            <div class="profile-detail-item"><span>Phone</span><strong>${cl.phone}</strong></div>
            <div class="profile-detail-item"><span>Gender</span><strong>${cl.gender}</strong></div>
            <div class="profile-detail-item"><span>Date of Birth</span><strong>${cl.dateOfBirth || '—'}</strong></div>
            <div class="profile-detail-item"><span>Company</span><strong>${cl.company || 'Individual'}</strong></div>
            <div class="profile-detail-item"><span>Registered</span><strong>${cl.registrationDate}</strong></div>
            <div class="profile-detail-item" style="grid-column:span 2"><span>Address</span><strong>${cl.address}</strong></div>
          </div>
        </div>
        <div class="card-widget">
          <div class="widget-header"><h3>My Cases (${clientCases.length})</h3></div>
          ${clientCases.length === 0 ? '<p style="color:var(--text-dim);font-size:0.85rem;padding:1rem">No cases registered.</p>' : `
          <div class="table-responsive">
            <table class="data-table" style="font-size:0.83rem">
              <thead><tr><th>Case No.</th><th>Title</th><th>Status</th></tr></thead>
              <tbody>
                ${clientCases.map(c => `
                  <tr>
                    <td><strong>${c.caseNumber}</strong></td>
                    <td>${c.title}</td>
                    <td><span class="badge badge-${this.getStatusBadgeClass(c.status)}">${c.status}</span></td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>`}
        </div>
      </div>`;
  }

  /* ──────────────────────────────────────────────────────────────────────────
     MODULE 3: CASE MANAGEMENT
  ─────────────────────────────────────────────────────────────────────────── */
  renderCasesView() {
    const user     = this.data.currentUser;
    const role     = user.role;
    const allCases = this.filterCasesForRole(this.data.cases);
    const cases    = this.filterCases(allCases);

    const canCreate = role === 'Administrator' || role === 'Clerk / Paralegal';
    const canEdit   = role === 'Administrator' || role === 'Clerk / Paralegal' || role === 'Advocate';
    const canDelete = role === 'Administrator';

    return `
      <div class="page-header">
        <div class="page-title">
          <h2>Case Management Registry</h2>
          <p>
            ${role === 'Advocate' ? 'Cases assigned to you.' :
              role === 'Client'   ? 'Your registered legal cases.' :
              'Register, track, update, and assign legal cases.'}
          </p>
        </div>
        <div class="action-bar">
          ${canCreate ? `
            <button class="btn-primary" id="btnNewCaseMgmt">
              <span>➕</span> <span>Register Case</span>
            </button>` : ''}
        </div>
      </div>

      <div class="card-widget">
        <div class="widget-header" style="flex-wrap:wrap;gap:0.75rem">
          <select id="caseStatusFilter" class="role-switcher-select" style="background:var(--bg-dark)">
            <option value="All"     ${this.statusFilter === 'All'     ? 'selected' : ''}>All Statuses</option>
            <option value="Active"  ${this.statusFilter === 'Active'  ? 'selected' : ''}>Active</option>
            <option value="Pending" ${this.statusFilter === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Closed"  ${this.statusFilter === 'Closed'  ? 'selected' : ''}>Closed</option>
          </select>
          <span style="color:var(--text-muted);font-size:0.85rem">${cases.length} case(s)</span>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Case No.</th>
                <th>Title / Court</th>
                <th>Type</th>
                <th>Client</th>
                <th>Advocate</th>
                <th>Filing Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${cases.length === 0 ? `
                <tr><td colspan="8">
                  <div class="empty-state">
                    <div class="empty-state-icon">📁</div>
                    <p>No cases found${role === 'Client' ? ' for your account' : role === 'Advocate' ? ' assigned to you' : ''}.</p>
                    ${canCreate ? '<p style="font-size:0.82rem;color:var(--text-dim)">Click "Register Case" to add one.</p>' : ''}
                  </div>
                </td></tr>
              ` : cases.map(c => `
                <tr>
                  <td><strong style="color:var(--primary)">${c.caseNumber}</strong></td>
                  <td>
                    <strong>${c.title}</strong><br/>
                    <small style="color:var(--text-dim)">${c.courtName}</small>
                  </td>
                  <td><span class="badge" style="background:var(--bg-dark);color:var(--text-main)">${c.caseType}</span></td>
                  <td>${c.clientName}</td>
                  <td>${c.advocateName}</td>
                  <td><small>${c.filingDate}</small></td>
                  <td><span class="badge badge-${this.getStatusBadgeClass(c.status)}">${c.status}</span></td>
                  <td>
                    <div class="action-buttons">
                      <button class="btn-icon-sm btn-view-case-detail" data-id="${c.id}" title="View Details">👁️</button>
                      ${canEdit   ? `<button class="btn-icon-sm btn-edit-case" data-id="${c.id}" title="Edit">✏️</button>` : ''}
                      ${canDelete ? `<button class="btn-icon-sm btn-icon-danger btn-delete-case" data-id="${c.id}" title="Delete">🗑️</button>` : ''}
                    </div>
                  </td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>`;
  }

  /* ──────────────────────────────────────────────────────────────────────────
     EXISTING VIEWS (unchanged from original, updated field names)
  ─────────────────────────────────────────────────────────────────────────── */
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
            </button>` : ''}
        </div>
      </div>

      <div class="kpi-grid" style="margin-bottom:1.5rem">
        ${this.data.hearings.map(h => `
          <div class="kpi-card" style="flex-direction:column;align-items:flex-start;gap:0.75rem">
            <div style="display:flex;justify-content:space-between;width:100%;align-items:center">
              <span class="badge badge-scheduled">${h.status}</span>
              <small style="color:var(--primary);font-weight:700">${h.date} @ ${h.time}</small>
            </div>
            <div>
              <h4 style="font-family:var(--font-serif);font-size:1.05rem;margin-bottom:0.25rem">${h.caseTitle}</h4>
              <p style="font-size:0.82rem;color:var(--text-muted)">Purpose: ${h.purpose}</p>
            </div>
            <div style="border-top:1px solid var(--border-color);padding-top:0.5rem;width:100%;font-size:0.78rem;color:var(--text-dim)">
              <span>📍 ${h.court} | ${h.judge}</span><br/>
              <span>⚖️ Counsel: ${h.advocate}</span>
            </div>
          </div>`).join('')}
      </div>`;
  }

  renderAdvocatesView() {
    const advocates = this.data.users.filter(u => u.role === 'Advocate');
    return `
      <div class="page-header">
        <div class="page-title">
          <h2>Advocate Directory &amp; Assignments</h2>
          <p>Manage firm advocates, legal specializations, and case load allocations.</p>
        </div>
      </div>

      <div class="kpi-grid">
        ${advocates.map(adv => {
          const assignedCases = this.data.cases.filter(c => c.advocateId === adv.id);
          return `
            <div class="card-widget">
              <div style="display:flex;gap:1rem;align-items:center">
                <div class="user-avatar" style="width:54px;height:54px;font-size:1.8rem">${adv.avatar}</div>
                <div>
                  <h3 style="font-family:var(--font-serif);font-size:1.2rem">${adv.name}</h3>
                  <p style="font-size:0.82rem;color:var(--primary);font-weight:600">${adv.specialization}</p>
                  <small style="color:var(--text-dim)">${adv.email}</small>
                </div>
              </div>
              <div style="border-top:1px solid var(--border-color);padding-top:1rem;margin-top:0.5rem">
                <span style="font-size:0.8rem;color:var(--text-muted);font-weight:600">
                  Assigned Cases (${assignedCases.length})
                </span>
                <ul style="list-style:none;margin-top:0.5rem;display:flex;flex-direction:column;gap:0.4rem">
                  ${assignedCases.map(c => `
                    <li style="font-size:0.8rem;background:var(--bg-dark);padding:0.4rem 0.6rem;border-radius:6px">
                      📌 ${c.caseNumber}: <strong>${c.title}</strong>
                    </li>`).join('')}
                  ${assignedCases.length === 0 ? '<li style="font-size:0.8rem;color:var(--text-dim)">No cases assigned.</li>' : ''}
                </ul>
              </div>
            </div>`;
        }).join('')}
      </div>`;
  }

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
                <p style="font-size:0.75rem;color:var(--text-dim);margin-top:0.25rem">Size: ${doc.fileSize} • ${doc.fileType}</p>
              </div>
            </div>
            <div style="border-top:1px solid var(--border-color);padding-top:0.75rem;margin-top:1rem;display:flex;justify-content:space-between;align-items:center">
              <small style="color:var(--text-dim);font-size:0.72rem">Uploaded by ${doc.uploadedBy}</small>
              <button class="btn-secondary" style="padding:0.25rem 0.5rem;font-size:0.75rem"
                onclick="alert('Downloading ${doc.title}...')">⬇️ Preview</button>
            </div>
          </div>`).join('')}
      </div>`;
  }

  renderBillingView() {
    const user = this.data.currentUser;
    let billingData = this.data.billing;
    if (user.role === 'Client') {
      const myClient = this.data.clients.find(c => c.userId === user.id);
      if (myClient) billingData = billingData.filter(b => b.clientName === myClient.fullName);
    }

    return `
      <div class="page-header">
        <div class="page-title">
          <h2>Fee &amp; Billing Management</h2>
          <p>Itemized legal retainer fee invoices, payment tracking, and receipt generation.</p>
        </div>
      </div>

      <div class="card-widget">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Invoice #</th><th>Case ID</th><th>Client</th><th>Description</th>
                <th>Amount</th><th>Due Date</th><th>Status</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${billingData.map(inv => `
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
                      <button class="btn-primary btn-pay-inv" data-inv="${inv.invoiceNo}"
                        style="padding:0.25rem 0.6rem;font-size:0.75rem">💳 Pay</button>
                    ` : `
                      <span style="color:var(--status-success);font-weight:600;font-size:0.8rem">✓ Settled</span>
                    `}
                  </td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>`;
  }

  renderSDLCReportView() {
    const m = this.data.sdlcMetrics;
    return `
      <div class="page-header">
        <div class="page-title">
          <h2>Software Project Plan (SPP) Metrics</h2>
          <p>System Specifications &amp; Cost Allocation for <strong>${m.author}</strong></p>
        </div>
      </div>

      <div class="dashboard-grid-2">
        <div class="card-widget">
          <div class="widget-header">
            <h3>Cost Estimation (₹ 1,05,000)</h3>
            <span class="badge badge-paid">12-Week Budget</span>
          </div>
          <table class="data-table">
            <thead><tr><th>Item / Deliverable</th><th>Cost (₹)</th></tr></thead>
            <tbody>
              ${m.costEstimation.map(c => `
                <tr>
                  <td>${c.item}</td>
                  <td><strong>₹ ${c.cost.toLocaleString('en-IN')}</strong></td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>

        <div class="card-widget">
          <div class="widget-header"><h3>Risk Analysis &amp; Mitigation</h3></div>
          <table class="data-table">
            <thead><tr><th>Risk Factor</th><th>Impact</th><th>Mitigation</th></tr></thead>
            <tbody>
              ${m.riskAnalysis.map(r => `
                <tr>
                  <td><strong>${r.risk}</strong></td>
                  <td><span class="badge badge-overdue">${r.impact}</span></td>
                  <td><small>${r.mitigation}</small></td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>`;
  }

  /* ──────────────────────────────────────────────────────────────────────────
     MODAL: ADD / EDIT USER
  ─────────────────────────────────────────────────────────────────────────── */
  showUserModal(userId) {
    const editUser = userId ? this.data.users.find(u => u.id === userId) : null;
    const isEdit   = !!editUser;

    document.getElementById('modalContent').innerHTML = `
      <div class="modal-header">
        <h3>${isEdit ? '✏️ Edit User' : '➕ Add New User'}</h3>
        <button class="btn-close" id="btnCloseModal">✕</button>
      </div>
      <form id="userForm">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
          <div class="form-group">
            <label>Full Name *</label>
            <input type="text" id="uName" class="input-field" required
              value="${editUser?.name || ''}" placeholder="Full name" style="padding-left:1rem" />
          </div>
          <div class="form-group">
            <label>Username *</label>
            <input type="text" id="uUsername" class="input-field" required
              value="${editUser?.username || ''}" placeholder="username"
              style="padding-left:1rem" ${isEdit ? 'readonly' : ''} />
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
          <div class="form-group">
            <label>Email *</label>
            <input type="email" id="uEmail" class="input-field" required
              value="${editUser?.email || ''}" placeholder="email@domain.com" style="padding-left:1rem" />
          </div>
          <div class="form-group">
            <label>Phone</label>
            <input type="tel" id="uPhone" class="input-field"
              value="${editUser?.phone || ''}" placeholder="10-digit phone" style="padding-left:1rem" />
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
          <div class="form-group">
            <label>Role *</label>
            <select id="uRole" class="input-field" style="padding-left:1rem">
              <option value="Administrator"    ${editUser?.role === 'Administrator'    ? 'selected' : ''}>Administrator</option>
              <option value="Advocate"         ${editUser?.role === 'Advocate'         ? 'selected' : ''}>Advocate</option>
              <option value="Clerk / Paralegal"${editUser?.role === 'Clerk / Paralegal'? 'selected' : ''}>Clerk / Paralegal</option>
              <option value="Client"           ${editUser?.role === 'Client'           ? 'selected' : ''}>Client</option>
            </select>
          </div>
          <div class="form-group">
            <label>Status</label>
            <select id="uStatus" class="input-field" style="padding-left:1rem">
              <option value="Active"   ${editUser?.status !== 'Inactive' ? 'selected' : ''}>Active</option>
              <option value="Inactive" ${editUser?.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label>${isEdit ? 'New Password' : 'Password *'} ${isEdit ? '<small style="color:var(--text-dim)">(leave blank to keep current)</small>' : ''}</label>
          <input type="password" id="uPassword" class="input-field"
            placeholder="${isEdit ? 'Enter new password (optional)' : 'Minimum 6 characters'}"
            style="padding-left:1rem" ${!isEdit ? 'required' : ''} />
        </div>
        <div class="form-group">
          <label>Designation / Specialization</label>
          <input type="text" id="uDesignation" class="input-field"
            value="${editUser?.designation || editUser?.specialization || ''}"
            placeholder="e.g. Senior Advocate" style="padding-left:1rem" />
        </div>
        <div id="userFormError" class="form-error-msg" style="display:none"></div>
        <button type="submit" class="btn-submit">${isEdit ? 'Update User' : 'Create User'}</button>
      </form>`;

    this.openModal();

    document.getElementById('userForm').addEventListener('submit', e => {
      e.preventDefault();
      const name        = document.getElementById('uName').value.trim();
      const username    = document.getElementById('uUsername').value.trim();
      const email       = document.getElementById('uEmail').value.trim();
      const phone       = document.getElementById('uPhone').value.trim();
      const role        = document.getElementById('uRole').value;
      const status      = document.getElementById('uStatus').value;
      const password    = document.getElementById('uPassword').value;
      const designation = document.getElementById('uDesignation').value.trim();
      const errEl       = document.getElementById('userFormError');

      const showErr = msg => { errEl.textContent = msg; errEl.style.display = 'block'; };

      if (!name || !username || !email) return showErr('Name, username, and email are required.');
      if (!isEdit && !password) return showErr('Password is required for new users.');
      if (password && password.length < 6) return showErr('Password must be at least 6 characters.');

      const dupUser  = this.data.users.find(u => u.username === username && u.id !== userId);
      const dupEmail = this.data.users.find(u => u.email === email && u.id !== userId);
      if (dupUser)  return showErr('Username already exists. Choose a different username.');
      if (dupEmail) return showErr('Email already registered to another user.');

      const avatarMap = { 'Administrator':'👨‍💼', 'Advocate':'⚖️', 'Clerk / Paralegal':'📝', 'Client':'👤' };

      if (isEdit) {
        const u = this.data.users.find(u => u.id === userId);
        Object.assign(u, {
          name, email, phone, role, status,
          designation: role !== 'Advocate' ? designation : u.designation,
          specialization: role === 'Advocate' ? designation : u.specialization
        });
        if (password) u.passwordHash = this.simpleHash(password);
        this.showToast(`User "${name}" updated successfully.`, 'success');
      } else {
        this.data.users.push({
          id: this.generateId('usr'),
          name, username, email, phone, role, status,
          passwordHash: this.simpleHash(password),
          avatar: avatarMap[role] || '👤',
          designation: role !== 'Advocate' ? designation : undefined,
          specialization: role === 'Advocate' ? designation : undefined,
          createdAt: new Date().toISOString().split('T')[0]
        });
        this.showToast(`User "${name}" created successfully.`, 'success');
      }

      this.saveState();
      this.closeModal();
      this.renderViewOnly();
    });
  }

  /* ──────────────────────────────────────────────────────────────────────────
     MODAL: ADD / EDIT CLIENT
  ─────────────────────────────────────────────────────────────────────────── */
  showClientModal(clientId) {
    const editClient = clientId ? this.data.clients.find(c => c.id === clientId) : null;
    const isEdit     = !!editClient;

    document.getElementById('modalContent').innerHTML = `
      <div class="modal-header">
        <h3>${isEdit ? '✏️ Edit Client' : '➕ Register New Client'}</h3>
        <button class="btn-close" id="btnCloseModal">✕</button>
      </div>
      <form id="clientForm">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
          <div class="form-group">
            <label>Full Name *</label>
            <input type="text" id="cFullName" class="input-field" required
              value="${editClient?.fullName || ''}" placeholder="Full name" style="padding-left:1rem" />
          </div>
          <div class="form-group">
            <label>Gender *</label>
            <select id="cGender" class="input-field" style="padding-left:1rem">
              <option value="Male"   ${editClient?.gender === 'Male'   ? 'selected' : ''}>Male</option>
              <option value="Female" ${editClient?.gender === 'Female' ? 'selected' : ''}>Female</option>
              <option value="Other"  ${editClient?.gender === 'Other'  ? 'selected' : ''}>Other</option>
            </select>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
          <div class="form-group">
            <label>Email *</label>
            <input type="email" id="cEmail" class="input-field" required
              value="${editClient?.email || ''}" placeholder="email@domain.com" style="padding-left:1rem" />
          </div>
          <div class="form-group">
            <label>Phone * (10 digits)</label>
            <input type="tel" id="cPhone" class="input-field" required
              value="${editClient?.phone || ''}" placeholder="9876543210"
              maxlength="10" style="padding-left:1rem" />
          </div>
        </div>
        <div class="form-group">
          <label>Address *</label>
          <textarea id="cAddress" class="input-field" rows="2" required
            placeholder="Full address"
            style="padding-left:1rem;padding-top:0.5rem;resize:vertical">${editClient?.address || ''}</textarea>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
          <div class="form-group">
            <label>Date of Birth</label>
            <input type="date" id="cDob" class="input-field"
              value="${editClient?.dateOfBirth || ''}" style="padding-left:1rem" />
          </div>
          <div class="form-group">
            <label>Company / Entity</label>
            <input type="text" id="cCompany" class="input-field"
              value="${editClient?.company || ''}" placeholder="Optional" style="padding-left:1rem" />
          </div>
        </div>

        ${!isEdit ? `
        <div class="modal-section-divider">
          <span>🔐 Login Account for this Client (optional)</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
          <div class="form-group">
            <label>Username</label>
            <input type="text" id="cUsername" class="input-field"
              placeholder="client.username" style="padding-left:1rem" />
          </div>
          <div class="form-group">
            <label>Password (min 6 chars)</label>
            <input type="password" id="cPassword" class="input-field"
              placeholder="Enter password" style="padding-left:1rem" />
          </div>
        </div>
        ` : ''}

        <div id="clientFormError" class="form-error-msg" style="display:none"></div>
        <button type="submit" class="btn-submit">${isEdit ? 'Update Client' : 'Register Client'}</button>
      </form>`;

    this.openModal();

    document.getElementById('clientForm').addEventListener('submit', e => {
      e.preventDefault();
      const fullName    = document.getElementById('cFullName').value.trim();
      const gender      = document.getElementById('cGender').value;
      const email       = document.getElementById('cEmail').value.trim();
      const phone       = document.getElementById('cPhone').value.trim();
      const address     = document.getElementById('cAddress').value.trim();
      const dateOfBirth = document.getElementById('cDob').value;
      const company     = document.getElementById('cCompany').value.trim();
      const errEl       = document.getElementById('clientFormError');

      const showErr = msg => { errEl.textContent = msg; errEl.style.display = 'block'; };

      if (!fullName || !email || !phone || !address) return showErr('Full Name, Email, Phone, and Address are required.');
      if (!/^\d{10}$/.test(phone)) return showErr('Phone must be exactly 10 digits.');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showErr('Please enter a valid email address.');

      if (isEdit) {
        const cl = this.data.clients.find(c => c.id === clientId);
        Object.assign(cl, { fullName, gender, email, phone, address, dateOfBirth, company });
        if (cl.userId) {
          const linkedUser = this.data.users.find(u => u.id === cl.userId);
          if (linkedUser) Object.assign(linkedUser, { name: fullName, email, phone });
        }
        this.showToast(`Client "${fullName}" updated.`, 'success');
      } else {
        const dupEmail = this.data.clients.find(c => c.email === email);
        if (dupEmail) return showErr('A client with this email already exists.');

        const clientUsername = document.getElementById('cUsername')?.value.trim();
        const clientPassword = document.getElementById('cPassword')?.value;
        let userId = null;

        if (clientUsername && clientPassword) {
          if (clientPassword.length < 6) return showErr('Password must be at least 6 characters.');
          if (this.data.users.find(u => u.username === clientUsername)) return showErr('Username already taken.');
          userId = this.generateId('usr');
          this.data.users.push({
            id: userId, name: fullName, username: clientUsername,
            passwordHash: this.simpleHash(clientPassword),
            role: 'Client', email, phone,
            avatar: gender === 'Female' ? '👩' : '👤',
            designation: 'Client', status: 'Active',
            createdAt: new Date().toISOString().split('T')[0]
          });
        }

        this.data.clients.push({
          id: this.generateId('cl'),
          clientId: this.generateClientId(),
          fullName, gender, email, phone, address, dateOfBirth, company, userId,
          registrationDate: new Date().toISOString().split('T')[0]
        });
        this.showToast(`Client "${fullName}" registered successfully.`, 'success');
      }

      this.saveState();
      this.closeModal();
      this.renderViewOnly();
    });
  }

  /* ──────────────────────────────────────────────────────────────────────────
     MODAL: CLIENT DETAIL VIEW
  ─────────────────────────────────────────────────────────────────────────── */
  showClientDetailModal(clientId) {
    const cl = this.data.clients.find(c => c.id === clientId);
    if (!cl) return;
    const clientCases = this.data.cases.filter(c => c.clientId === cl.id);

    document.getElementById('modalContent').innerHTML = `
      <div class="modal-header">
        <div>
          <h3>${cl.fullName}</h3>
          <span class="badge badge-paid">${cl.clientId}</span>
        </div>
        <button class="btn-close" id="btnCloseModal">✕</button>
      </div>

      <div style="display:flex;flex-direction:column;gap:1rem">
        <div style="background:var(--bg-dark);padding:1rem;border-radius:8px;display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;font-size:0.87rem">
          <div><span style="color:var(--text-muted)">Gender: </span><strong>${cl.gender}</strong></div>
          <div><span style="color:var(--text-muted)">DOB: </span><strong>${cl.dateOfBirth || '—'}</strong></div>
          <div><span style="color:var(--text-muted)">Email: </span><strong>${cl.email}</strong></div>
          <div><span style="color:var(--text-muted)">Phone: </span><strong>${cl.phone}</strong></div>
          <div><span style="color:var(--text-muted)">Company: </span><strong>${cl.company || 'Individual'}</strong></div>
          <div><span style="color:var(--text-muted)">Registered: </span><strong>${cl.registrationDate}</strong></div>
          <div style="grid-column:span 2"><span style="color:var(--text-muted)">Address: </span><strong>${cl.address}</strong></div>
          <div><span style="color:var(--text-muted)">Login Account: </span>
            <span class="badge ${cl.userId ? 'badge-paid' : 'badge-pending'}">${cl.userId ? 'Active' : 'No Account'}</span>
          </div>
        </div>

        <h4 style="font-family:var(--font-serif)">Associated Cases (${clientCases.length})</h4>
        ${clientCases.length === 0 ? '<p style="color:var(--text-dim);font-size:0.85rem">No cases registered for this client.</p>' : `
        <div class="table-responsive">
          <table class="data-table" style="font-size:0.83rem">
            <thead><tr><th>Case No.</th><th>Title</th><th>Type</th><th>Advocate</th><th>Status</th></tr></thead>
            <tbody>
              ${clientCases.map(c => `
                <tr>
                  <td><strong>${c.caseNumber}</strong></td>
                  <td>${c.title}</td>
                  <td>${c.caseType}</td>
                  <td>${c.advocateName}</td>
                  <td><span class="badge badge-${this.getStatusBadgeClass(c.status)}">${c.status}</span></td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>`}
      </div>`;

    this.openModal();
  }

  /* ──────────────────────────────────────────────────────────────────────────
     MODAL: ADD / EDIT CASE
  ─────────────────────────────────────────────────────────────────────────── */
  showCaseModal(caseId) {
    const editCase = caseId ? this.data.cases.find(c => c.id === caseId) : null;
    const isEdit   = !!editCase;
    const advocates = this.data.users.filter(u => u.role === 'Advocate');
    const clients   = this.data.clients;

    document.getElementById('modalContent').innerHTML = `
      <div class="modal-header">
        <h3>${isEdit ? '✏️ Edit Case' : '➕ Register New Case'}</h3>
        <button class="btn-close" id="btnCloseModal">✕</button>
      </div>
      <form id="caseForm">
        <div class="form-group">
          <label>Case Title *</label>
          <input type="text" id="csTitle" class="input-field" required
            value="${editCase?.title || ''}" placeholder="e.g. Verma Enterprises vs. Apex Logistics"
            style="padding-left:1rem" />
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
          <div class="form-group">
            <label>Case Type *</label>
            <select id="csType" class="input-field" style="padding-left:1rem">
              ${['Commercial Dispute','Corporate Compliance','Intellectual Property',
                 'Civil Property Law','Criminal Law','Family Law','Labour Law'].map(t => `
                <option value="${t}" ${editCase?.caseType === t ? 'selected' : ''}>${t}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Status *</label>
            <select id="csStatus" class="input-field" style="padding-left:1rem">
              <option value="Pending" ${editCase?.status === 'Pending' ? 'selected' : ''}>Pending</option>
              <option value="Active"  ${editCase?.status === 'Active'  ? 'selected' : ''}>Active</option>
              <option value="Closed"  ${editCase?.status === 'Closed'  ? 'selected' : ''}>Closed</option>
            </select>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
          <div class="form-group">
            <label>Assign Client *</label>
            <select id="csClientId" class="input-field" style="padding-left:1rem">
              ${clients.length === 0 ? '<option value="">— No clients registered —</option>' :
                clients.map(cl => `
                  <option value="${cl.id}" ${editCase?.clientId === cl.id ? 'selected' : ''}>${cl.clientId}: ${cl.fullName}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Assign Advocate *</label>
            <select id="csAdvocateId" class="input-field" style="padding-left:1rem">
              ${advocates.length === 0 ? '<option value="">— No advocates —</option>' :
                advocates.map(adv => `
                  <option value="${adv.id}" ${editCase?.advocateId === adv.id ? 'selected' : ''}>${adv.name}</option>`).join('')}
            </select>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
          <div class="form-group">
            <label>Court Name *</label>
            <input type="text" id="csCourtName" class="input-field" required
              value="${editCase?.courtName || ''}" placeholder="e.g. High Court - Bench 4"
              style="padding-left:1rem" />
          </div>
          <div class="form-group">
            <label>Filing Date</label>
            <input type="date" id="csFilingDate" class="input-field"
              value="${editCase?.filingDate || new Date().toISOString().split('T')[0]}"
              style="padding-left:1rem" />
          </div>
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea id="csDescription" class="input-field" rows="3"
            placeholder="Brief case description..."
            style="padding-left:1rem;padding-top:0.5rem;resize:vertical">${editCase?.description || ''}</textarea>
        </div>
        <div id="caseFormError" class="form-error-msg" style="display:none"></div>
        <button type="submit" class="btn-submit">${isEdit ? 'Update Case' : 'Register Case'}</button>
      </form>`;

    this.openModal();

    document.getElementById('caseForm').addEventListener('submit', e => {
      e.preventDefault();
      const title       = document.getElementById('csTitle').value.trim();
      const caseType    = document.getElementById('csType').value;
      const status      = document.getElementById('csStatus').value;
      const clientId    = document.getElementById('csClientId').value;
      const advocateId  = document.getElementById('csAdvocateId').value;
      const courtName   = document.getElementById('csCourtName').value.trim();
      const filingDate  = document.getElementById('csFilingDate').value;
      const description = document.getElementById('csDescription').value.trim();
      const errEl       = document.getElementById('caseFormError');

      const showErr = msg => { errEl.textContent = msg; errEl.style.display = 'block'; };

      if (!title)     return showErr('Case title is required.');
      if (!courtName) return showErr('Court name is required.');
      if (!clientId)  return showErr('Please assign a client to this case.');
      if (!advocateId) return showErr('Please assign an advocate to this case.');

      const client   = this.data.clients.find(c => c.id === clientId);
      const advocate = this.data.users.find(u => u.id === advocateId);

      if (isEdit) {
        const c = this.data.cases.find(c => c.id === caseId);
        Object.assign(c, {
          title, caseType, status, clientId, advocateId, courtName, filingDate, description,
          clientName:  client   ? client.fullName : c.clientName,
          advocateName: advocate ? advocate.name  : c.advocateName
        });
        this.showToast(`Case "${c.caseNumber}" updated successfully.`, 'success');
      } else {
        const newCaseNumber = this.generateCaseNumber();
        this.data.cases.unshift({
          id: this.generateId('cs'),
          caseNumber: newCaseNumber,
          title, caseType, description,
          clientId, clientName:   client   ? client.fullName : '',
          advocateId, advocateName: advocate ? advocate.name  : '',
          filingDate, status, courtName,
          judge: 'To Be Assigned',
          nextHearing: 'TBD',
          claimAmount: 'TBD',
          proceedings: [{ date: new Date().toISOString().split('T')[0], summary: 'Case registered in the system portal.' }]
        });
        this.showToast(`Case "${newCaseNumber}" registered successfully.`, 'success');
      }

      this.saveState();
      this.closeModal();
      this.renderViewOnly();
    });
  }

  /* ──────────────────────────────────────────────────────────────────────────
     MODAL: CASE DETAIL
  ─────────────────────────────────────────────────────────────────────────── */
  showCaseDetailModal(caseId) {
    const c = this.data.cases.find(item => item.id === caseId);
    if (!c) return;

    document.getElementById('modalContent').innerHTML = `
      <div class="modal-header">
        <div>
          <h3>${c.caseNumber}: ${c.title}</h3>
          <span class="badge badge-${this.getStatusBadgeClass(c.status)}">${c.status}</span>
        </div>
        <button class="btn-close" id="btnCloseModal">✕</button>
      </div>

      <div style="display:flex;flex-direction:column;gap:1rem">
        <p style="font-size:0.9rem;color:var(--text-muted)">${c.description || 'No description provided.'}</p>

        <div style="background:var(--bg-dark);padding:1rem;border-radius:8px;display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;font-size:0.85rem">
          <div>Client: <strong>${c.clientName}</strong></div>
          <div>Advocate: <strong>${c.advocateName}</strong></div>
          <div>Court: <strong>${c.courtName}</strong></div>
          <div>Judge: <strong>${c.judge}</strong></div>
          <div>Case Type: <strong>${c.caseType}</strong></div>
          <div>Filing Date: <strong>${c.filingDate}</strong></div>
          <div>Next Hearing: <strong style="color:var(--accent-gold)">${c.nextHearing}</strong></div>
          <div>Claim Amount: <strong style="color:var(--accent-gold)">${c.claimAmount}</strong></div>
        </div>

        <h4 style="font-family:var(--font-serif);margin-top:0.5rem">Court Proceedings Log</h4>
        <div class="timeline-list">
          ${c.proceedings.map(p => `
            <div class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <small>${p.date}</small>
                <p style="font-size:0.85rem;color:var(--text-main)">${p.summary}</p>
              </div>
            </div>`).join('')}
        </div>
      </div>`;

    this.openModal();
  }

  /* ──────────────────────────────────────────────────────────────────────────
     MODAL: SCHEDULE HEARING
  ─────────────────────────────────────────────────────────────────────────── */
  showScheduleHearingModal() {
    document.getElementById('modalContent').innerHTML = `
      <div class="modal-header">
        <h3>🏛️ Schedule Court Hearing</h3>
        <button class="btn-close" id="btnCloseModal">✕</button>
      </div>
      <form id="scheduleHearingForm">
        <div class="form-group">
          <label>Select Case</label>
          <select id="hearingCaseId" class="input-field" style="padding-left:1rem">
            ${this.data.cases.map(c => `<option value="${c.id}">${c.caseNumber}: ${c.title}</option>`).join('')}
          </select>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
          <div class="form-group">
            <label>Hearing Date</label>
            <input type="date" id="hearingDate" class="input-field"
              value="${new Date().toISOString().split('T')[0]}" required style="padding-left:1rem" />
          </div>
          <div class="form-group">
            <label>Hearing Time</label>
            <input type="text" id="hearingTime" class="input-field"
              value="10:30 AM" required style="padding-left:1rem" />
          </div>
        </div>
        <div class="form-group">
          <label>Purpose / Listing Stage</label>
          <input type="text" id="hearingPurpose" class="input-field"
            value="Framing of Issues" required style="padding-left:1rem" />
        </div>
        <button type="submit" class="btn-submit">Confirm Hearing Booking</button>
      </form>`;

    this.openModal();

    document.getElementById('scheduleHearingForm').addEventListener('submit', e => {
      e.preventDefault();
      const caseId = document.getElementById('hearingCaseId').value;
      const targetCase = this.data.cases.find(c => c.id === caseId);

      const newHearing = {
        id: `HR-${100 + this.data.hearings.length + 1}`,
        caseId,
        caseTitle: targetCase?.title || 'Legal Case',
        court: targetCase?.courtName || 'High Court',
        judge: targetCase?.judge || 'Hon. Presiding Officer',
        date: document.getElementById('hearingDate').value,
        time: document.getElementById('hearingTime').value,
        advocate: targetCase?.advocateName || 'Assigned Advocate',
        client: targetCase?.clientName || 'Client',
        purpose: document.getElementById('hearingPurpose').value,
        status: 'Scheduled'
      };

      if (targetCase) {
        targetCase.nextHearing = `${newHearing.date} ${newHearing.time}`;
        targetCase.status = 'Active';
      }

      this.data.hearings.unshift(newHearing);
      this.saveState();
      this.closeModal();
      this.showToast('Hearing scheduled successfully.', 'success');
      this.render();
    });
  }

  /* ──────────────────────────────────────────────────────────────────────────
     MODAL: UPLOAD DOCUMENT
  ─────────────────────────────────────────────────────────────────────────── */
  showUploadDocModal() {
    document.getElementById('modalContent').innerHTML = `
      <div class="modal-header">
        <h3>📤 Upload Document to Vault</h3>
        <button class="btn-close" id="btnCloseModal">✕</button>
      </div>
      <form id="uploadDocForm">
        <div class="form-group">
          <label>Document Title *</label>
          <input type="text" id="docTitle" class="input-field"
            placeholder="e.g. Affidavit of Evidence" required style="padding-left:1rem" />
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
          <div class="form-group">
            <label>Linked Case</label>
            <select id="docCaseId" class="input-field" style="padding-left:1rem">
              ${this.data.cases.map(c => `<option value="${c.id}">${c.caseNumber}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Category</label>
            <select id="docCategory" class="input-field" style="padding-left:1rem">
              <option>Pleadings</option><option>Evidence</option>
              <option>Court Orders</option><option>Contracts</option>
            </select>
          </div>
        </div>
        <button type="submit" class="btn-submit">Upload &amp; Encrypt Document</button>
      </form>`;

    this.openModal();

    document.getElementById('uploadDocForm').addEventListener('submit', e => {
      e.preventDefault();
      this.data.documents.unshift({
        id: `DOC-${500 + this.data.documents.length + 1}`,
        caseId: document.getElementById('docCaseId').value,
        title: document.getElementById('docTitle').value,
        category: document.getElementById('docCategory').value,
        fileSize: '2.4 MB', fileType: 'PDF Document',
        uploadedBy: this.data.currentUser.name,
        uploadDate: new Date().toISOString().split('T')[0],
        tags: ['Uploaded']
      });
      this.saveState();
      this.closeModal();
      this.showToast('Document uploaded successfully.', 'success');
      this.render();
    });
  }

  /* ──────────────────────────────────────────────────────────────────────────
     MODAL: CONFIRM DIALOG
  ─────────────────────────────────────────────────────────────────────────── */
  showConfirmDialog(message, onConfirm) {
    document.getElementById('modalContent').innerHTML = `
      <div class="modal-header">
        <h3>⚠️ Confirm Action</h3>
        <button class="btn-close" id="btnCloseModal">✕</button>
      </div>
      <div style="text-align:center;padding:1.5rem 0">
        <div style="font-size:3.5rem;margin-bottom:1rem">🗑️</div>
        <p style="color:var(--text-main);font-size:1rem;margin-bottom:1.5rem;line-height:1.6">${message}</p>
        <p style="color:var(--text-dim);font-size:0.82rem;margin-bottom:1.5rem">This action cannot be undone.</p>
        <div style="display:flex;gap:1rem;justify-content:center">
          <button class="btn-secondary" id="btnConfirmCancel" style="min-width:120px">Cancel</button>
          <button class="btn-danger" id="btnConfirmOk" style="min-width:120px">🗑️ Delete</button>
        </div>
      </div>`;

    this.openModal();
    document.getElementById('btnConfirmCancel').onclick = () => this.closeModal();
    document.getElementById('btnConfirmOk').onclick = () => { this.closeModal(); onConfirm(); };
  }

  /* ──────────────────────────────────────────────────────────────────────────
     MODAL HELPERS
  ─────────────────────────────────────────────────────────────────────────── */
  openModal() {
    const overlay = document.getElementById('modalOverlay');
    overlay.classList.add('active');
    const closeBtn = document.getElementById('btnCloseModal');
    if (closeBtn) closeBtn.onclick = () => this.closeModal();
    overlay.onclick = e => { if (e.target === overlay) this.closeModal(); };
  }

  closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
  }

  /* ──────────────────────────────────────────────────────────────────────────
     TOAST NOTIFICATIONS
  ─────────────────────────────────────────────────────────────────────────── */
  showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const icons = { success: '✅', error: '❌', warning: '⚠️' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${icons[type] || '✅'}</span><span>${message}</span>`;
    container.appendChild(toast);

    requestAnimationFrame(() => { requestAnimationFrame(() => { toast.classList.add('toast-visible'); }); });

    setTimeout(() => {
      toast.classList.remove('toast-visible');
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  /* ──────────────────────────────────────────────────────────────────────────
     DATA HELPERS
  ─────────────────────────────────────────────────────────────────────────── */
  filterCasesForRole(cases) {
    const user = this.data.currentUser;
    if (!user) return cases;
    const role = user.role;
    if (role === 'Administrator' || role === 'Clerk / Paralegal') return cases;
    if (role === 'Advocate') return cases.filter(c => c.advocateId === user.id);
    if (role === 'Client') {
      const myClient = this.data.clients.find(c => c.userId === user.id);
      return myClient ? cases.filter(c => c.clientId === myClient.id) : [];
    }
    return cases;
  }

  filterCases(cases) {
    const q = this.searchQuery.toLowerCase();
    return cases.filter(c => {
      const matchSearch = !q ||
        c.title.toLowerCase().includes(q) ||
        (c.caseNumber && c.caseNumber.toLowerCase().includes(q)) ||
        c.clientName.toLowerCase().includes(q) ||
        c.advocateName.toLowerCase().includes(q) ||
        (c.courtName && c.courtName.toLowerCase().includes(q));
      const matchStatus = this.statusFilter === 'All' || c.status === this.statusFilter;
      return matchSearch && matchStatus;
    });
  }

  getStatusBadgeClass(status) {
    switch (status) {
      case 'Active':           return 'progress';
      case 'Pending':          return 'pending';
      case 'Closed':           return 'closed';
      case 'Hearing Scheduled':return 'scheduled';
      case 'In Progress':      return 'progress';
      default:                 return 'pending';
    }
  }

  payInvoice(invoiceNo) {
    const inv = this.data.billing.find(b => b.invoiceNo === invoiceNo);
    if (inv) {
      inv.status = 'Paid';
      inv.paidDate = new Date().toISOString().split('T')[0];
      this.saveState();
      this.showToast(`Invoice ${invoiceNo} (${inv.amount}) marked as Paid.`, 'success');
      this.renderViewOnly();
    }
  }
}

// Boot the application
window.addEventListener('DOMContentLoaded', () => {
  window.app = new LegalApp();
});
