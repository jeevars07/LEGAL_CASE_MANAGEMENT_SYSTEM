import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  CheckCircle2Icon,
  EyeIcon,
  EyeOffIcon,
  FileTextIcon,
  LockIcon,
  ScaleIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserIcon,
  UserPlusIcon,
  XCircleIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { Field, Input, Select } from '../components/ui/Field';
import { Modal } from '../components/ui/Modal';
import { LogoMark } from '../components/layout/Logo';
import { useApp } from '../contexts/AppContext';
import type { Role, User } from '../types';
import { cn } from '../utils/format';

/* ── Role configurations for quick switching ── */
const roleConfigs: Record<
  Role,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    defaultEmail: string;
    defaultPassword: string;
    userName: string;
  }
> = {
  admin: {
    label: 'Administrator',
    icon: ShieldCheckIcon,
    title: 'Firm Administrator',
    description: 'Full practice control, billing reports, and user administration',
    defaultEmail: 'm.okonjo@harborlaw.example',
    defaultPassword: 'Admin@123',
    userName: 'Miriam Okonjo'
  },
  advocate: {
    label: 'Advocate',
    icon: ScaleIcon,
    title: 'Legal Counsel',
    description: 'Matter management, court appearances, and filings',
    defaultEmail: 'd.reyes@harborlaw.example',
    defaultPassword: 'Advocate@123',
    userName: 'Adv. Daniel Reyes'
  },
  clerk: {
    label: 'Clerk',
    icon: FileTextIcon,
    title: 'Court Clerk / Paralegal',
    description: 'Registry filing, cause list management, and document review',
    defaultEmail: 'p.raghunathan@harborlaw.example',
    defaultPassword: 'Clerk@123',
    userName: 'Priya Raghunathan'
  },
  client: {
    label: 'Client',
    icon: UserIcon,
    title: 'Client Portal',
    description: 'Track matters, view hearing dates, and pay legal fees',
    defaultEmail: 'helena.vaughn@vaughnretail.example',
    defaultPassword: 'Client@123',
    userName: 'Helena Vaughn'
  }
};

/* ── Validation helpers ── */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[6-9]\d{9}$/; // 10-digit Indian mobile number

function passwordStrength(p: string): { score: number; label: string; color: string } {
  let score = 0;
  if (p.length >= 6) score++;
  if (p.length >= 10) score++;
  if (/[A-Z]/.test(p)) score++;
  if (/[0-9]/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  const map: Array<{ label: string; color: string }> = [
    { label: 'Very weak', color: '#ef4444' },
    { label: 'Weak', color: '#f97316' },
    { label: 'Fair', color: '#eab308' },
    { label: 'Good', color: '#22c55e' },
    { label: 'Strong', color: '#16a34a' },
    { label: 'Very strong', color: '#15803d' }
  ];
  return { score, ...map[Math.min(score, 5)] };
}

export function Login() {
  const { login, registerClient, users, clients, advocates } = useApp();
  const navigate = useNavigate();

  const [isRegistering, setIsRegistering] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSending, setForgotSending] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  /* ── Sign-in state ── */
  const [role, setRole] = useState<Role>('admin');
  const [email, setEmail] = useState(roleConfigs.admin.defaultEmail);
  const [password, setPassword] = useState(roleConfigs.admin.defaultPassword);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [signInErrors, setSignInErrors] = useState<Record<string, string>>({});

  /* ── Client Register state ── */
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regGender, setRegGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [regDob, setRegDob] = useState('1992-06-15');
  const [regAddress, setRegAddress] = useState('');
  const [regCity, setRegCity] = useState('Chennai');
  const [regState, setRegState] = useState('Tamil Nadu');
  const [regPostalCode, setRegPostalCode] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showReg, setShowReg] = useState(false);
  const [showRegC, setShowRegC] = useState(false);
  const [regErrors, setRegErrors] = useState<Record<string, string>>({});

  const strength = passwordStrength(regPassword);

  /* ── Select Role and Auto-fill ── */
  const handleSelectRole = (newRole: Role) => {
    setRole(newRole);
    setEmail(roleConfigs[newRole].defaultEmail);
    setPassword(roleConfigs[newRole].defaultPassword);
    setSignInErrors({});
  };

  /* ══════════════════════════════════════
     Sign In Validation & Submission
  ══════════════════════════════════════ */
  const submitSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    const cleanEmail = email.trim();

    // 1. Email field validation
    if (!cleanEmail) {
      errs.email = 'Email address is required.';
    } else if (!EMAIL_RE.test(cleanEmail)) {
      errs.email = 'Please enter a valid email address (e.g. name@domain.com).';
    }

    // 2. Password field validation
    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    if (Object.keys(errs).length > 0) {
      setSignInErrors(errs);
      return;
    }

    // 3. User account existence lookup
    const emailLc = cleanEmail.toLowerCase();
    const matchedUser: User | undefined = users.find((u) => u.email.toLowerCase() === emailLc);
    const matchedClient = clients.find((c) => c.email.toLowerCase() === emailLc);
    const matchedAdvocate = advocates.find((a) => a.email.toLowerCase() === emailLc);

    const accountFound = matchedUser || matchedClient || matchedAdvocate;

    // Check if demo account
    const isKnownDemo = Object.values(roleConfigs).some(
      (c) => c.defaultEmail.toLowerCase() === emailLc
    );

    if (!accountFound && !isKnownDemo) {
      setSignInErrors({
        email: 'No account found with this email address. Please check spelling or register below.'
      });
      return;
    }

    // 4. Check for suspended or inactive accounts
    if (matchedUser && matchedUser.status === 'Suspended') {
      setSignInErrors({
        email: `This account (${matchedUser.name}) is suspended. Please contact the system administrator.`
      });
      return;
    }
    if (matchedClient && matchedClient.status === 'Inactive') {
      setSignInErrors({
        email: `This client account (${matchedClient.name}) is currently inactive. Please contact the law firm.`
      });
      return;
    }
    if (matchedAdvocate && matchedAdvocate.status === 'On Leave') {
      setSignInErrors({
        email: `Advocate account (${matchedAdvocate.name}) is currently marked on leave.`
      });
      return;
    }

    // 5. Strict Database Password Validation
    let databasePassword = matchedUser?.password;

    // Check custom registered password if stored in localStorage database
    try {
      const storedPasswordsStr = window.localStorage.getItem('lcm_user_passwords');
      if (storedPasswordsStr) {
        const storedPasswords = JSON.parse(storedPasswordsStr);
        if (storedPasswords[emailLc]) {
          databasePassword = storedPasswords[emailLc];
        }
      }
    } catch {
      // Continue if parsing fails
    }

    // Fallback for seed users from roleConfigs
    if (!databasePassword) {
      const demoCfg = Object.values(roleConfigs).find((c) => c.defaultEmail.toLowerCase() === emailLc);
      if (demoCfg) {
        databasePassword = demoCfg.defaultPassword;
      } else if (matchedAdvocate) {
        databasePassword = 'Advocate@123';
      } else if (matchedClient) {
        databasePassword = 'Client@123';
      }
    }

    // STRICT CHECK: Password must match the password stored in the database
    if (!databasePassword || password !== databasePassword) {
      setSignInErrors({
        password: 'Incorrect password. The password must match the password stored in the database.'
      });
      return;
    }

    // 6. Role auto-alignment if needed
    let effectiveRole = role;
    if (matchedClient && role !== 'client') {
      effectiveRole = 'client';
    } else if (matchedAdvocate && role !== 'advocate') {
      effectiveRole = 'advocate';
    } else if (matchedUser && matchedUser.role !== role) {
      effectiveRole = matchedUser.role;
    }

    setSignInErrors({});
    setLoading(true);

    window.setTimeout(() => {
      login(effectiveRole, cleanEmail);
      toast.success(
        `Welcome, ${accountFound ? (accountFound as any).name : roleConfigs[effectiveRole].userName}!`,
        {
          description: `Signed in as ${roleConfigs[effectiveRole].title}.`
        }
      );
      setLoading(false);
      navigate('/');
    }, 750);
  };

  /* ══════════════════════════════════════
     Client Registration Submission
  ══════════════════════════════════════ */
  const submitRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    // 1. Name validation
    if (!regName.trim()) {
      errs.regName = 'Full name is required.';
    } else if (regName.trim().split(/\s+/).length < 2) {
      errs.regName = 'Please enter your full legal name (first and last name).';
    }

    // 2. Email validation + Duplicate check
    const cleanEmail = regEmail.trim().toLowerCase();
    if (!cleanEmail) {
      errs.regEmail = 'Email address is required.';
    } else if (!EMAIL_RE.test(cleanEmail)) {
      errs.regEmail = 'Please enter a valid email address (e.g. name@example.com).';
    } else {
      const isTaken =
        users.some((u) => u.email.toLowerCase() === cleanEmail) ||
        clients.some((c) => c.email.toLowerCase() === cleanEmail) ||
        advocates.some((a) => a.email.toLowerCase() === cleanEmail);
      if (isTaken) {
        errs.regEmail = 'This email is already registered. Please sign in instead.';
      }
    }

    // 3. Indian Phone Number validation
    const rawPhone = regPhone.replace(/[\s-]/g, '');
    if (!rawPhone) {
      errs.regPhone = 'Mobile number is required.';
    } else if (!PHONE_RE.test(rawPhone)) {
      errs.regPhone = 'Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9).';
    }

    // 4. DOB age check (must be 18+)
    if (!regDob) {
      errs.regDob = 'Date of birth is required.';
    } else {
      const birthDate = new Date(regDob);
      const ageDiffMs = Date.now() - birthDate.getTime();
      const ageDate = new Date(ageDiffMs);
      const age = Math.abs(ageDate.getUTCFullYear() - 1970);
      if (age < 18) {
        errs.regDob = 'Client must be at least 18 years of age to register.';
      }
    }

    // 5. Address validation
    if (!regAddress.trim()) {
      errs.regAddress = 'Street address is required.';
    }
    if (!regCity.trim()) {
      errs.regCity = 'City is required.';
    }
    if (!regPostalCode.trim()) {
      errs.regPostalCode = 'Postal code is required.';
    } else if (!/^\d{6}$/.test(regPostalCode.trim())) {
      errs.regPostalCode = 'Enter a valid 6-digit Indian PIN code (e.g. 600001).';
    }

    // 6. Password strength & confirmation
    if (!regPassword) {
      errs.regPassword = 'Password is required.';
    } else if (regPassword.length < 6) {
      errs.regPassword = 'Password must be at least 6 characters long.';
    } else if (strength.score < 2) {
      errs.regPassword = 'Password is too weak. Include capital letters, numbers, or symbols.';
    }

    if (!regConfirmPassword) {
      errs.regConfirmPassword = 'Confirm your password.';
    } else if (regPassword !== regConfirmPassword) {
      errs.regConfirmPassword = 'Passwords do not match.';
    }

    setRegErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);

    window.setTimeout(() => {
      // Register client in context with database password
      const newClient = registerClient(
        {
          name: regName.trim(),
          email: cleanEmail,
          phone: rawPhone,
          gender: regGender,
          dob: regDob,
          address: regAddress.trim(),
          city: regCity.trim(),
          state: regState.trim() || 'Tamil Nadu',
          postalCode: regPostalCode.trim(),
          notes: 'Self-registered through client portal.'
        },
        regPassword
      );

      // Save password into localStorage for subsequent logins
      try {
        const storedPasswordsStr = window.localStorage.getItem('lcm_user_passwords') || '{}';
        const storedPasswords = JSON.parse(storedPasswordsStr);
        storedPasswords[cleanEmail] = regPassword;
        window.localStorage.setItem('lcm_user_passwords', JSON.stringify(storedPasswords));
      } catch {
        // Fallback
      }

      toast.success(`Account created successfully!`, {
        description: `Welcome to Harbor Law, ${newClient.name}. You are now signed in.`
      });

      setLoading(false);
      navigate('/');
    }, 850);
  };

  /* ══════════════════════════════════════
     Forgot Password Handler
  ══════════════════════════════════════ */
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !EMAIL_RE.test(forgotEmail.trim())) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setForgotSending(true);
    window.setTimeout(() => {
      setForgotSending(false);
      setForgotSent(true);
      toast.success('Password reset instructions sent!', {
        description: `Check your inbox at ${forgotEmail.trim()} for instructions.`
      });
    }, 900);
  };

  const clearSignIn = (field: string) => setSignInErrors((e) => ({ ...e, [field]: '' }));
  const clearReg = (field: string) => setRegErrors((e) => ({ ...e, [field]: '' }));

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[1.1fr_1fr]">
      {/* Brand Panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-navy-950 p-10 lg:flex xl:p-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
            backgroundSize: '48px 48px'
          }}
        />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <LogoMark />
          <div>
            <p className="text-base font-bold text-white tracking-wide">Harbor Law</p>
            <p className="text-[10px] uppercase tracking-[0.16em] text-navy-400">
              Legal Practice Management
            </p>
          </div>
        </div>

        {/* Hero Copy */}
        <div className="relative max-w-lg space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-300"
          >
            <SparklesIcon className="h-3.5 w-3.5" />
            <span>Integrated High Court & District Practice Portal</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="text-[36px] font-bold leading-[1.18] tracking-[-0.025em] text-white xl:text-[42px]"
          >
            Streamlined Legal Case Management & Fee Billing
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.16 }}
            className="text-[15px] leading-relaxed text-navy-300"
          >
            Connect advocates, clerks, and clients with real-time case tracking, cause lists,
            document verification, and flexible full or partial fee settlements.
          </motion.p>

          <ul className="space-y-3 pt-2">
            {[
              'Role-based security for Partners, Advocates, Clerks, and Clients',
              'Indian judicial cause lists with Madras High Court jurisdiction',
              'Flexible client billing with partial installment and full fee options',
              'End-to-end document verification and audit trails'
            ].map((line, i) => (
              <motion.li
                key={line}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.22 + i * 0.06 }}
                className="flex items-center gap-2.5 text-[13px] text-navy-200"
              >
                <CheckCircle2Icon className="h-4 w-4 shrink-0 text-brand-400" aria-hidden />
                <span>{line}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Footer badges */}
        <div className="relative flex items-center gap-6 border-t border-white/10 pt-6 text-[11px] text-navy-400">
          <span>256-Bit SSL Encrypted</span>
          <span>Bar Council Compliant</span>
          <span>Escrow Trust Accounting</span>
        </div>
      </div>

      {/* Main Login / Register Card */}
      <div className="flex items-center justify-center bg-slate-50 px-5 py-8 sm:px-10 overflow-y-auto">
        <motion.div
          key={isRegistering ? 'register' : 'signin'}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-[480px] rounded-2xl border border-navy-200/80 bg-white p-6 shadow-sm sm:p-8"
        >
          {/* Mobile Header */}
          <div className="mb-6 flex items-center gap-2.5 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900">
              <LockIcon className="h-4 w-4 text-white" aria-hidden />
            </span>
            <div>
              <p className="text-base font-bold text-navy-900">Harbor Law</p>
              <p className="text-[10px] uppercase tracking-wider text-navy-400">
                Case Management System
              </p>
            </div>
          </div>

          {!isRegistering ? (
            /* ════════════════════════════
               SIGN IN FORM
            ════════════════════════════ */
            <>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-navy-900">Sign in to Harbor Law</h2>
                <p className="mt-1 text-xs text-navy-500">
                  Select your practice role or enter your registered credentials.
                </p>
              </div>

              {/* Role Selection Tabs */}
              <div className="mt-5 space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-navy-500">
                  Select User Role
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {(['admin', 'advocate', 'clerk', 'client'] as Role[]).map((r) => {
                    const cfg = roleConfigs[r];
                    const Icon = cfg.icon;
                    const isSelected = role === r;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => handleSelectRole(r)}
                        className={cn(
                          'flex flex-col items-center justify-center gap-1.5 rounded-xl border p-2.5 text-center transition-all',
                          isSelected
                            ? 'border-brand-600 bg-brand-50/70 text-brand-900 ring-2 ring-brand-500/20 shadow-sm font-semibold'
                            : 'border-navy-200 bg-white text-navy-600 hover:border-navy-300 hover:bg-navy-50/40'
                        )}
                      >
                        <Icon className={cn('h-4 w-4', isSelected ? 'text-brand-600' : 'text-navy-400')} />
                        <span className="text-xs">{cfg.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Role Indicator Callout */}
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-navy-100 bg-navy-50/60 px-3.5 py-2.5 text-xs text-navy-600">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                    <span>
                      Logging in as: <strong className="text-navy-900">{roleConfigs[role].title}</strong>
                    </span>
                  </div>
                  <p className="text-[11px] text-navy-500 pl-4">
                    Stored DB Password: <code className="font-mono font-semibold text-brand-700 bg-navy-100/80 px-1.5 py-0.5 rounded">{roleConfigs[role].defaultPassword}</code>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEmail(roleConfigs[role].defaultEmail);
                    setPassword(roleConfigs[role].defaultPassword);
                    setSignInErrors({});
                    toast.info(`Filled credentials for ${roleConfigs[role].userName}`);
                  }}
                  className="font-semibold text-brand-600 hover:text-brand-700 hover:underline shrink-0 text-left sm:text-right"
                >
                  Fill Demo
                </button>
              </div>

              {/* Form */}
              <form onSubmit={submitSignIn} className="mt-5 space-y-4" noValidate>
                <Field label="Email Address" htmlFor="login-email" required error={signInErrors.email}>
                  <Input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    invalid={Boolean(signInErrors.email)}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearSignIn('email');
                    }}
                    placeholder="name@firm.example"
                  />
                </Field>

                <Field label="Password" htmlFor="login-password" required error={signInErrors.password}>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={password}
                      invalid={Boolean(signInErrors.password)}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        clearSignIn('password');
                      }}
                      className="pr-10"
                      placeholder="Enter account password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-navy-400 hover:bg-navy-100 hover:text-navy-700 transition-colors"
                    >
                      {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    </button>
                  </div>
                </Field>

                <div className="flex items-center justify-between pt-0.5">
                  <label className="flex cursor-pointer items-center gap-2 text-xs text-navy-600">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="h-4 w-4 rounded border-navy-300 text-brand-600 focus:ring-brand-500/20"
                    />
                    Remember my credentials
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      setForgotSent(false);
                      setForgotOpen(true);
                    }}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full shadow-sm">
                  {loading ? 'Authenticating…' : `Sign in as ${roleConfigs[role].label}`}
                </Button>
              </form>

              {/* Client Registration CTA */}
              <div className="mt-6 rounded-xl border border-navy-200/80 bg-navy-50/50 p-4 text-center">
                <p className="text-xs text-navy-600 font-medium">New Client? Register to manage your cases & fees.</p>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setIsRegistering(true);
                    setSignInErrors({});
                  }}
                  className="mt-2.5 w-full bg-white text-navy-800 border-navy-200 hover:bg-navy-50"
                  icon={<UserPlusIcon className="h-3.5 w-3.5 text-brand-600" />}
                >
                  Create Client Account
                </Button>
              </div>
            </>
          ) : (
            /* ════════════════════════════
               CLIENT REGISTRATION FORM
            ════════════════════════════ */
            <>
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(false);
                  setRegErrors({});
                }}
                className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-navy-500 hover:text-navy-900 transition-colors"
              >
                <ArrowLeftIcon className="h-3.5 w-3.5" />
                Back to Sign In
              </button>

              <div>
                <h2 className="text-2xl font-bold tracking-tight text-navy-900">Client Registration</h2>
                <p className="mt-1 text-xs text-navy-500">
                  Register with Harbor Law to view your case timeline, documents, and settle fee invoices.
                </p>
              </div>

              <form onSubmit={submitRegister} className="mt-5 space-y-3.5" noValidate>
                {/* Full Name */}
                <Field
                  label="Full Legal Name"
                  htmlFor="reg-name"
                  required
                  error={regErrors.regName}
                  hint="First and last name"
                >
                  <Input
                    id="reg-name"
                    value={regName}
                    invalid={Boolean(regErrors.regName)}
                    onChange={(e) => {
                      setRegName(e.target.value);
                      clearReg('regName');
                    }}
                    placeholder="e.g. Suresh Chandran"
                  />
                </Field>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Email Address" htmlFor="reg-email" required error={regErrors.regEmail}>
                    <Input
                      id="reg-email"
                      type="email"
                      value={regEmail}
                      invalid={Boolean(regErrors.regEmail)}
                      onChange={(e) => {
                        setRegEmail(e.target.value);
                        clearReg('regEmail');
                      }}
                      placeholder="client@example.com"
                    />
                  </Field>

                  <Field
                    label="Mobile Number"
                    htmlFor="reg-phone"
                    required
                    error={regErrors.regPhone}
                    hint="10-digit Indian number"
                  >
                    <Input
                      id="reg-phone"
                      type="tel"
                      value={regPhone}
                      invalid={Boolean(regErrors.regPhone)}
                      onChange={(e) => {
                        setRegPhone(e.target.value);
                        clearReg('regPhone');
                      }}
                      placeholder="98765 43210"
                    />
                  </Field>
                </div>

                {/* Gender & DOB */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Gender" htmlFor="reg-gender">
                    <Select
                      id="reg-gender"
                      value={regGender}
                      onChange={(e) => setRegGender(e.target.value as any)}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Select>
                  </Field>

                  <Field
                    label="Date of Birth"
                    htmlFor="reg-dob"
                    required
                    error={regErrors.regDob}
                    hint="Must be 18+ years"
                  >
                    <Input
                      id="reg-dob"
                      type="date"
                      value={regDob}
                      invalid={Boolean(regErrors.regDob)}
                      onChange={(e) => {
                        setRegDob(e.target.value);
                        clearReg('regDob');
                      }}
                    />
                  </Field>
                </div>

                {/* Street Address */}
                <Field
                  label="Permanent / Residential Address"
                  htmlFor="reg-address"
                  required
                  error={regErrors.regAddress}
                >
                  <Input
                    id="reg-address"
                    value={regAddress}
                    invalid={Boolean(regErrors.regAddress)}
                    onChange={(e) => {
                      setRegAddress(e.target.value);
                      clearReg('regAddress');
                    }}
                    placeholder="Flat / Door No., Street, Area"
                  />
                </Field>

                {/* City, State, PIN */}
                <div className="grid grid-cols-3 gap-2">
                  <Field label="City" htmlFor="reg-city" error={regErrors.regCity}>
                    <Input
                      id="reg-city"
                      value={regCity}
                      invalid={Boolean(regErrors.regCity)}
                      onChange={(e) => {
                        setRegCity(e.target.value);
                        clearReg('regCity');
                      }}
                      placeholder="Chennai"
                    />
                  </Field>
                  <Field label="State" htmlFor="reg-state">
                    <Input
                      id="reg-state"
                      value={regState}
                      onChange={(e) => setRegState(e.target.value)}
                      placeholder="Tamil Nadu"
                    />
                  </Field>
                  <Field label="PIN Code" htmlFor="reg-pin" error={regErrors.regPostalCode}>
                    <Input
                      id="reg-pin"
                      maxLength={6}
                      value={regPostalCode}
                      invalid={Boolean(regErrors.regPostalCode)}
                      onChange={(e) => {
                        setRegPostalCode(e.target.value);
                        clearReg('regPostalCode');
                      }}
                      placeholder="600001"
                    />
                  </Field>
                </div>

                {/* Passwords with Strength & Match */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-1">
                  <div>
                    <Field label="Set Password" htmlFor="reg-password" required error={regErrors.regPassword}>
                      <div className="relative">
                        <Input
                          id="reg-password"
                          type={showReg ? 'text' : 'password'}
                          value={regPassword}
                          invalid={Boolean(regErrors.regPassword)}
                          onChange={(e) => {
                            setRegPassword(e.target.value);
                            clearReg('regPassword');
                          }}
                          placeholder="Min. 6 chars"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowReg((s) => !s)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-navy-400 hover:text-navy-700"
                        >
                          {showReg ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                        </button>
                      </div>
                    </Field>

                    {/* Password Strength Meter */}
                    {regPassword.length > 0 && (
                      <div className="mt-1.5 space-y-1">
                        <div className="flex h-1 gap-1">
                          {[0, 1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className="flex-1 rounded-full transition-all duration-300"
                              style={{
                                background: i < strength.score ? strength.color : '#e2e8f0'
                              }}
                            />
                          ))}
                        </div>
                        <p className="text-[10px] font-semibold" style={{ color: strength.color }}>
                          Strength: {strength.label}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <Field
                      label="Confirm Password"
                      htmlFor="reg-confirm-password"
                      required
                      error={regErrors.regConfirmPassword}
                    >
                      <div className="relative">
                        <Input
                          id="reg-confirm-password"
                          type={showRegC ? 'text' : 'password'}
                          value={regConfirmPassword}
                          invalid={Boolean(regErrors.regConfirmPassword)}
                          onChange={(e) => {
                            setRegConfirmPassword(e.target.value);
                            clearReg('regConfirmPassword');
                          }}
                          placeholder="Re-enter password"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegC((s) => !s)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-navy-400 hover:text-navy-700"
                        >
                          {showRegC ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                        </button>
                      </div>
                    </Field>

                    {/* Password Match Status */}
                    {regConfirmPassword.length > 0 && (
                      <p
                        className={cn(
                          'mt-1.5 flex items-center gap-1 text-[11px] font-medium',
                          regPassword === regConfirmPassword ? 'text-emerald-600' : 'text-red-500'
                        )}
                      >
                        {regPassword === regConfirmPassword ? (
                          <>
                            <CheckCircle2Icon className="h-3 w-3" /> Passwords match
                          </>
                        ) : (
                          <>
                            <XCircleIcon className="h-3 w-3" /> Passwords do not match
                          </>
                        )}
                      </p>
                    )}
                  </div>
                </div>

                {/* Error Summary Banner */}
                {Object.keys(regErrors).length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700"
                  >
                    <div className="flex items-center gap-1.5 font-bold mb-1">
                      <AlertCircleIcon className="h-4 w-4 shrink-0 text-red-600" />
                      Please correct the following:
                    </div>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] text-red-600">
                      {Object.values(regErrors).map((msg, i) => (
                        <li key={i}>{msg}</li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-2 shadow-sm">
                  {loading ? 'Creating Account…' : 'Register & Enter Client Portal'}
                </Button>
              </form>
            </>
          )}

          <div className="mt-6 flex items-center justify-center gap-2 border-t border-navy-100 pt-4 text-center text-xs text-navy-400">
            <ShieldCheckIcon className="h-4 w-4 text-emerald-600" />
            <span>Protected by secure authentication & role-based permissions</span>
          </div>
        </motion.div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        open={forgotOpen}
        onClose={() => setForgotOpen(false)}
        title="Reset Account Password"
        description="Enter your registered email address to receive password recovery instructions."
        footer={
          <>
            <Button variant="secondary" onClick={() => setForgotOpen(false)}>
              Close
            </Button>
            {!forgotSent && (
              <Button variant="primary" loading={forgotSending} onClick={handleForgotSubmit}>
                Send Instructions
              </Button>
            )}
          </>
        }
      >
        <div className="space-y-4">
          {!forgotSent ? (
            <form onSubmit={handleForgotSubmit} className="space-y-3">
              <Field label="Registered Email Address" htmlFor="forgot-email" required>
                <Input
                  id="forgot-email"
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@firm.example"
                />
              </Field>
              <p className="text-xs text-navy-500">
                A secure verification code will be sent to this email address to reset your password.
              </p>
            </form>
          ) : (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-center space-y-2">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <CheckCircle2Icon className="h-6 w-6" />
              </div>
              <h4 className="text-sm font-bold text-navy-900">Recovery Instructions Sent!</h4>
              <p className="text-xs text-navy-600">
                We sent a password reset link to <strong className="text-navy-900">{forgotEmail}</strong>.
              </p>
              <div className="pt-2">
                <p className="text-[11px] text-navy-400">
                  For this demo environment, your default password is{' '}
                  <code className="rounded bg-navy-100 px-1 py-0.5 text-navy-800 font-mono">demo1234</code>.
                </p>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}