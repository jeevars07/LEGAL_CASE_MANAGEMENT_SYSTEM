# Legal Case Management System (Enterprise Edition v1.0)

A modern, responsive, role-based Legal Case Management System web application developed according to the **Software Project Plan (SPP) and SRS specification by JEEVA R S (Digital ID: 2512007)**.

![Legal System Interface](https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200)

---

## 🌟 Key Features

- **Multi-Role Authentication**:
  - **Administrator** (`admin`): Full system administration, advocate assignment, and cost analytics.
  - **Advocate** (`advocate.smith`): Assigned cases, hearing schedules, and proceedings logger.
  - **Clerk / Paralegal** (`clerk.ramesh`): Case registration, client intake, hearing booking.
  - **Client** (`client.vikram`): Active case status timeline, document viewer, invoice payment portal.

- **Integrated Functional Modules**:
  - **Dashboard Overview**: KPI summary metrics, live court clock, case distribution SVG bar chart.
  - **Case Management**: Register new cases, search/filter by status, view detailed proceeding logs.
  - **Hearing Scheduler**: Book court hearings with courtroom, judge, date, time, and listing purpose.
  - **Legal Document Vault**: Filterable repository (*Pleadings*, *Evidence*, *Court Orders*, *Contracts*) with simulated encryption.
  - **Fee & Billing Management**: Itemized fee invoices with online payment settlement.
  - **SDLC Metrics**: Project cost breakdown (₹1,05,000 budget) and risk matrix.

---

## 🚀 How to Run Locally

### Option 1: Python HTTP Server (Built-in)
```bash
python -m http.server 8080
```
Open your browser and navigate to **`http://localhost:8080`**.

### Option 2: Direct Browser Opening
Simply double-click or open `index.html` in Chrome, Edge, Firefox, or Safari.

---

## 📤 How to Push to GitHub

1. Install **Git** on your machine if not already installed:
   - Download Git from: [https://git-scm.com/downloads](https://git-scm.com/downloads)
   - Or install via Windows Terminal:
     ```powershell
     winget install --id Git.Git -e --source winget
     ```

2. Initialize Git and commit files in this project directory (`c:\Users\jeeva\srs`):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Legal Case Management System v1.0"
   ```

3. Connect your GitHub repository and push:
   ```bash
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```
