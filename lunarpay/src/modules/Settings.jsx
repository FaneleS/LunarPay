import { useState } from "react";

const C = {
  pageBg: "#F5F2EA", surface: "#EDE8DC", card: "#FDFAF4", cardBorder: "#D8D4C8",
  olive: "#656D4A", forest: "#3A4232", sage: "#C2C5AA", sageMid: "#A4AC86",
  ink: "#333D29", wheat: "#C4B470", terra: "#936639", muted: "#7F7455",
  active: "#2D6B45", activeBg: "#EDF5F0", danger: "#8B3A1E", dangerBg: "#F5EDE8",
  info: "#2A5C8A", infoBg: "#EAF1F8", warning: "#7A5C1E", warningBg: "#FDF3E3",
};
const FONT_DISPLAY = "'Syne', sans-serif";
const FONT_BODY = "'DM Sans', sans-serif";
const DOTS_BG = {
  backgroundImage: `radial-gradient(circle, rgba(101,109,74,0.07) 1px, transparent 1px)`,
  backgroundSize: "16px 16px", backgroundColor: C.pageBg,
};

const inp = { background: C.card, border: `1px solid ${C.cardBorder}`, color: C.ink, borderRadius: 8, padding: "9px 13px", fontSize: 13, width: "100%", fontFamily: FONT_BODY, outline: "none" };
const sel = { ...inp };

const initials = (f, l) => `${f[0]}${l[0]}`.toUpperCase();
const AVATAR_COLORS = [
  { bg: "#E8F0E8", text: "#4A5240" }, { bg: "#F5EDE8", text: "#936639" },
  { bg: "#EAF1F8", text: "#2A5C8A" }, { bg: "#F0EDE4", text: "#656D4A" },
  { bg: "#F5EAF0", text: "#8A4A6A" }, { bg: "#EAF5ED", text: "#2D6B45" },
];
const getAvatarColor = (name) => {
  let h = 0; for (let c of name) h = c.charCodeAt(0) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
};

const PERMISSION_ROLES = [
  { id: "admin", label: "Admin", desc: "Full access including user management and billing", color: C.danger, bg: C.dangerBg },
  { id: "full", label: "Full Access", desc: "Full payroll access, no user/billing management", color: C.olive, bg: "rgba(101,109,74,0.1)" },
  { id: "readonly", label: "Read Only", desc: "Can view but not edit any payroll data", color: C.info, bg: C.infoBg },
  { id: "approver", label: "Approver Only", desc: "Can only action self-service approval requests", color: C.warning, bg: C.warningBg },
];

const PAY_POINTS = ["Finance", "Operations", "Marketing", "Human Resources"];
const PAY_FREQUENCIES = ["Monthly", "Weekly", "Bi-Weekly"];

const INITIAL_USERS = [
  { id: 1, firstName: "Brandon", lastName: "Louw", email: "brandon@demo.co.za", role: "admin", company: "All", payFrequency: null, payPoint: null, lastActive: "2025-05-31", status: "Active" },
  { id: 2, firstName: "Anna", lastName: "Heart", email: "anna@demo.co.za", role: "full", company: "Demo Company", payFrequency: null, payPoint: null, lastActive: "2025-05-28", status: "Active" },
  { id: 3, firstName: "Sarah", lastName: "Nkosi", email: "sarah@demo.co.za", role: "readonly", company: "Demo Company", payFrequency: "Monthly", payPoint: "Finance", lastActive: "2025-05-20", status: "Active" },
  { id: 4, firstName: "Mike", lastName: "Dlamini", email: "mike@demo.co.za", role: "approver", company: "Demo Company", payFrequency: null, payPoint: "Human Resources", lastActive: "2025-04-15", status: "Active" },
];

const INITIAL_BILLING = {
  billingEmails: ["brandon@demo.co.za"],
  additionalEmails: "",
  billingMethod: "Monthly Debit Order",
  separateInvoices: false,
  billingName: "Demo Company (Pty) Ltd",
  vatNumber: "4123456789",
  address: "12 Oak Street, Sandton, Johannesburg, 2196",
  mandateStatus: "Active",
};

const AUDIT_LOG = [
  { id: 1, user: "Brandon Louw", action: "Finalised payslip", target: "Brown, Jane — May 2025", time: "2025-05-31 14:32", category: "Payroll" },
  { id: 2, user: "Brandon Louw", action: "Created pay run", target: "Monthly — May 2025", time: "2025-05-31 14:35", category: "Payroll" },
  { id: 3, user: "Anna Heart", action: "Added employee", target: "Fankomo, Celeste", time: "2025-05-28 09:12", category: "Employees" },
  { id: 4, user: "Brandon Louw", action: "Approved leave request", target: "Smith, John — Annual Leave", time: "2025-05-27 16:44", category: "Leave" },
  { id: 5, user: "Sarah Nkosi", action: "Viewed report", target: "Transaction History — May 2025", time: "2025-05-26 11:20", category: "Reports" },
  { id: 6, user: "Brandon Louw", action: "Updated billing preferences", target: "Billing method changed to Debit Order", time: "2025-05-20 10:05", category: "Settings" },
  { id: 7, user: "Anna Heart", action: "Unfinalised payslip", target: "Turner, Paige — April 2025", time: "2025-05-15 13:48", category: "Payroll" },
  { id: 8, user: "Brandon Louw", action: "Released payslips", target: "April 2025 — 4 employees", time: "2025-04-30 17:01", category: "Self-Service" },
  { id: 9, user: "Mike Dlamini", action: "Denied leave request", target: "Turner, Paige — Sick Leave", time: "2025-05-15 10:30", category: "Leave" },
  { id: 10, user: "Brandon Louw", action: "Added user", target: "Sarah Nkosi (Read Only)", time: "2025-03-01 09:00", category: "Settings" },
];

const INVOICES = [
  { id: "INV-0024", date: "2025-05-01", period: "May 2025", amount: 299.00, status: "Paid", employees: 6 },
  { id: "INV-0023", date: "2025-04-01", period: "April 2025", amount: 299.00, status: "Paid", employees: 6 },
  { id: "INV-0022", date: "2025-03-01", period: "March 2025", amount: 249.00, status: "Paid", employees: 5 },
  { id: "INV-0021", date: "2025-02-01", period: "February 2025", amount: 249.00, status: "Paid", employees: 5 },
];

const fmt = (n) => `R ${Number(n).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}`;

// ─── Primitives ───────────────────────────────────────────────────────────────
const Btn = ({ children, onClick, variant = "primary", style: s = {}, disabled }) => {
  const base = { fontFamily: FONT_BODY, fontWeight: 500, fontSize: 13, borderRadius: 8, padding: "9px 18px", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, border: "none", display: "inline-flex", alignItems: "center", gap: 6, transition: "opacity 0.15s" };
  const v = {
    primary: { background: C.olive, color: "#F5F2EA" },
    ghost: { background: "transparent", color: C.muted, border: `1px solid ${C.cardBorder}` },
    accent: { background: C.wheat, color: C.ink, fontWeight: 600 },
    danger: { background: "transparent", color: C.danger, border: `1px solid rgba(139,58,30,0.3)` },
    success: { background: C.activeBg, color: C.active, border: `1px solid rgba(45,107,69,0.2)` },
  };
  return <button onClick={onClick} disabled={disabled} style={{ ...base, ...v[variant], ...s }}>{children}</button>;
};

const Badge = ({ children, color, bg }) => (
  <span style={{ background: bg, color, fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 20, whiteSpace: "nowrap" }}>{children}</span>
);

const Field = ({ label, children, half }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ display: "block", fontSize: 11, color: C.muted, marginBottom: 5, letterSpacing: "0.05em", textTransform: "uppercase", fontWeight: 500 }}>{label}</label>
    {children}
  </div>
);

const Divider = () => <div style={{ height: 1, background: C.cardBorder, margin: "16px 0" }} />;

const Checkbox = ({ checked, onChange, label }) => (
  <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", userSelect: "none" }}>
    <div onClick={onChange} style={{ width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${checked ? C.olive : C.cardBorder}`, background: checked ? C.olive : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
      {checked && <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>✓</span>}
    </div>
    {label && <span style={{ fontSize: 14, color: C.ink }}>{label}</span>}
  </label>
);

const SectionCard = ({ title, subtitle, children }) => (
  <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
    <div style={{ padding: "14px 20px", background: C.surface, borderBottom: `1px solid ${C.cardBorder}` }}>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 14, fontWeight: 700, color: C.ink }}>{title}</div>
      {subtitle && <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{subtitle}</div>}
    </div>
    <div style={{ padding: "18px 20px" }}>{children}</div>
  </div>
);

const CATEGORY_COLORS = {
  Payroll: { color: C.warning, bg: C.warningBg },
  Employees: { color: C.active, bg: C.activeBg },
  Leave: { color: C.info, bg: C.infoBg },
  Reports: { color: C.muted, bg: C.surface },
  "Self-Service": { color: "#7A3060", bg: "#F5EAF0" },
  Settings: { color: C.terra, bg: "#F0EDE4" },
};

// ─── Add / Edit User Modal ────────────────────────────────────────────────────
function UserModal({ user, onClose, onSave }) {
  const [form, setForm] = useState(user || {
    firstName: "", lastName: "", email: "", role: "full",
    company: "All", payFrequency: null, payPoint: null, status: "Active",
  });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const role = PERMISSION_ROLES.find(r => r.id === form.role);
  const canSave = form.firstName.trim() && form.lastName.trim() && form.email.trim();

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(51,61,41,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, backdropFilter: "blur(2px)" }}>
      <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16, width: 560, maxHeight: "88vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 24px 60px rgba(51,61,41,0.2)" }}>
        <div style={{ padding: "22px 28px", background: C.surface, borderBottom: `1px solid ${C.cardBorder}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 700, color: C.ink }}>{user ? "Edit User" : "Add User"}</h2>
            <p style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Each user gets their own login — never share passwords.</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 18 }}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <Field label="First name">
              <input value={form.firstName} onChange={e => set("firstName", e.target.value)} placeholder="First name" style={inp} />
            </Field>
            <Field label="Last name">
              <input value={form.lastName} onChange={e => set("lastName", e.target.value)} placeholder="Last name" style={inp} />
            </Field>
          </div>
          <Field label="Email address">
            <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="user@company.co.za" style={inp} />
          </Field>
          <Divider />
          <p style={{ fontSize: 12, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Permission Role</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            {PERMISSION_ROLES.map(r => (
              <div key={r.id} onClick={() => set("role", r.id)} style={{ padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${form.role === r.id ? C.olive : C.cardBorder}`, background: form.role === r.id ? "rgba(101,109,74,0.08)" : C.surface, cursor: "pointer", transition: "all 0.12s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: form.role === r.id ? C.olive : C.cardBorder, transition: "background 0.12s" }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: form.role === r.id ? C.olive : C.ink }}>{r.label}</span>
                </div>
                <p style={{ fontSize: 11, color: C.muted, lineHeight: 1.4, paddingLeft: 16 }}>{r.desc}</p>
              </div>
            ))}
          </div>
          <Divider />
          <p style={{ fontSize: 12, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Access Restrictions</p>
          <Field label="Company access">
            <select value={form.company || "All"} onChange={e => set("company", e.target.value)} style={sel}>
              <option value="All">All Companies</option>
              <option value="Demo Company">Demo Company</option>
            </select>
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <Field label="Restrict to pay frequency">
              <select value={form.payFrequency || ""} onChange={e => set("payFrequency", e.target.value || null)} style={sel}>
                <option value="">No restriction</option>
                {PAY_FREQUENCIES.map(f => <option key={f}>{f}</option>)}
              </select>
            </Field>
            <Field label="Restrict to pay point">
              <select value={form.payPoint || ""} onChange={e => set("payPoint", e.target.value || null)} style={sel}>
                <option value="">No restriction</option>
                {PAY_POINTS.map(p => <option key={p}>{p}</option>)}
              </select>
            </Field>
          </div>
        </div>
        <div style={{ padding: "16px 28px", borderTop: `1px solid ${C.cardBorder}`, background: C.surface, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn onClick={() => { onSave({ ...form, id: user?.id || Date.now(), lastActive: new Date().toISOString().split("T")[0] }); onClose(); }} disabled={!canSave}>
            {user ? "Save Changes" : "Add User"}
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ─── Users Tab ────────────────────────────────────────────────────────────────
function UsersTab({ users, setUsers }) {
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleSave = (user) => {
    if (editUser) setUsers(prev => prev.map(u => u.id === user.id ? user : u));
    else setUsers(prev => [...prev, user]);
    setEditUser(null);
  };

  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 15, fontWeight: 700, color: C.ink, marginBottom: 4 }}>Manage Users</h3>
          <p style={{ fontSize: 13, color: C.muted, maxWidth: 520 }}>Add colleagues or external accountants as separate users. Never share your password — separate accounts keep everyone accountable through the audit log.</p>
        </div>
        <Btn onClick={() => { setEditUser(null); setShowModal(true); }}>
          <i className="ti ti-plus" aria-hidden="true" /> Add User
        </Btn>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 24 }}>
        {PERMISSION_ROLES.map(role => {
          const count = users.filter(u => u.role === role.id).length;
          return (
            <div key={role.id} style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{role.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, fontFamily: FONT_DISPLAY, color: count > 0 ? C.ink : C.sage }}>{count}</div>
            </div>
          );
        })}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2.5fr 2fr 1.2fr 1.2fr 1fr 1fr", padding: "10px 20px", background: C.surface, borderBottom: `1px solid ${C.cardBorder}` }}>
          {["User", "Email", "Role", "Access", "Last Active", ""].map(h => (
            <span key={h} style={{ fontSize: 11, color: C.sageMid, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>{h}</span>
          ))}
        </div>
        {users.map((user, i) => {
          const av = getAvatarColor(user.firstName + user.lastName);
          const role = PERMISSION_ROLES.find(r => r.id === user.role);
          const isCurrentUser = user.role === "admin" && i === 0;
          return (
            <div key={user.id} style={{ display: "grid", gridTemplateColumns: "2.5fr 2fr 1.2fr 1.2fr 1fr 1fr", padding: "13px 20px", borderBottom: i < users.length - 1 ? `1px solid ${C.cardBorder}` : "none", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: av.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: av.text, flexShrink: 0 }}>
                  {initials(user.firstName, user.lastName)}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.ink }}>{user.firstName} {user.lastName}</div>
                  {isCurrentUser && <div style={{ fontSize: 10, color: C.sageMid }}>Current user</div>}
                </div>
              </div>
              <span style={{ fontSize: 12, color: C.muted }}>{user.email}</span>
              <div>{role && <Badge color={role.color} bg={role.bg}>{role.label}</Badge>}</div>
              <div style={{ fontSize: 12, color: C.muted }}>
                {user.payPoint ? user.payPoint : user.payFrequency ? user.payFrequency : <span style={{ color: C.sageMid }}>All</span>}
              </div>
              <span style={{ fontSize: 12, color: C.muted }}>{user.lastActive}</span>
              <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                <button onClick={() => { setEditUser(user); setShowModal(true); }} style={{ background: "none", border: `1px solid ${C.cardBorder}`, borderRadius: 6, padding: "5px 10px", cursor: "pointer", color: C.muted, fontSize: 12, fontFamily: FONT_BODY }}>
                  <i className="ti ti-edit" aria-hidden="true" />
                </button>
                {!isCurrentUser && (
                  <button onClick={() => setConfirmDelete(user)} style={{ background: "none", border: `1px solid rgba(139,58,30,0.2)`, borderRadius: 6, padding: "5px 10px", cursor: "pointer", color: C.danger, fontSize: 12 }}>
                    <i className="ti ti-trash" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <UserModal user={editUser} onClose={() => { setShowModal(false); setEditUser(null); }} onSave={handleSave} />
      )}

      {confirmDelete && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(51,61,41,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300 }}>
          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 14, padding: 28, width: 400, boxShadow: "0 20px 50px rgba(51,61,41,0.2)" }}>
            <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 700, color: C.ink, marginBottom: 8 }}>Remove User?</h3>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, marginBottom: 20 }}>
              This will remove <strong style={{ color: C.ink }}>{confirmDelete.firstName} {confirmDelete.lastName}</strong> and revoke their access immediately. This cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <Btn variant="danger" onClick={() => { setUsers(prev => prev.filter(u => u.id !== confirmDelete.id)); setConfirmDelete(null); }}>
                <i className="ti ti-trash" aria-hidden="true" /> Remove User
              </Btn>
              <Btn variant="ghost" onClick={() => setConfirmDelete(null)}>Cancel</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Billing Tab ──────────────────────────────────────────────────────────────
function BillingTab() {
  const [billing, setBilling] = useState(INITIAL_BILLING);
  const [saved, setSaved] = useState(false);
  const set = (k, v) => setBilling(p => ({ ...p, [k]: v }));

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <div style={{ padding: "28px 32px", maxWidth: 720 }}>

      <SectionCard title="Billing Preferences" subtitle="Manage how and where invoices are sent">
        <Field label="Invoice recipients">
          <div style={{ background: C.surface, borderRadius: 8, padding: "10px 14px", marginBottom: 10 }}>
            {billing.billingEmails.map((email, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: i < billing.billingEmails.length - 1 ? 6 : 0 }}>
                <i className="ti ti-mail" aria-hidden="true" style={{ fontSize: 14, color: C.sageMid }} />
                <span style={{ fontSize: 13, color: C.ink }}>{email}</span>
                <Badge color={C.active} bg={C.activeBg}>Full Access</Badge>
              </div>
            ))}
          </div>
        </Field>
        <Field label="Additional billing emails">
          <input value={billing.additionalEmails} onChange={e => set("additionalEmails", e.target.value)} placeholder="Separate multiple addresses with commas" style={inp} />
        </Field>
        <Divider />
        <Field label="Billing method">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {["Monthly Debit Order", "EFT (Manual)", "Credit Card"].map(method => (
              <label key={method} onClick={() => set("billingMethod", method)} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${billing.billingMethod === method ? C.olive : C.cardBorder}`, background: billing.billingMethod === method ? "rgba(101,109,74,0.07)" : C.surface, cursor: "pointer", transition: "all 0.12s", userSelect: "none" }}>
                <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${billing.billingMethod === method ? C.olive : C.cardBorder}`, background: billing.billingMethod === method ? C.olive : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                  {billing.billingMethod === method && <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff" }} />}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: billing.billingMethod === method ? C.olive : C.ink }}>{method}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
                    {method === "Monthly Debit Order" ? "Invoice sent monthly — amount debited automatically on billing date" :
                     method === "EFT (Manual)" ? "Invoice sent monthly — you make the payment manually before due date" :
                     "Invoice sent monthly — card charged automatically on billing date"}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </Field>

        {billing.billingMethod === "Monthly Debit Order" && (
          <div style={{ background: C.surface, border: `1px solid ${C.cardBorder}`, borderRadius: 10, padding: "14px 16px", marginTop: 8 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: C.ink, marginBottom: 3 }}>Debit Order Mandate</div>
                <div style={{ fontSize: 12, color: C.muted }}>Status: <span style={{ color: billing.mandateStatus === "Active" ? C.active : C.warning, fontWeight: 500 }}>{billing.mandateStatus}</span></div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn variant="ghost" style={{ fontSize: 12, padding: "6px 12px" }}>
                  <i className="ti ti-download" aria-hidden="true" /> Download
                </Btn>
                {billing.mandateStatus !== "Active" && (
                  <Btn variant="accent" style={{ fontSize: 12, padding: "6px 12px" }} onClick={() => set("mandateStatus", "Active")}>
                    <i className="ti ti-upload" aria-hidden="true" /> Upload Signed
                  </Btn>
                )}
              </div>
            </div>
          </div>
        )}

        <Divider />

        <div style={{ marginBottom: 16 }}>
          <Checkbox checked={billing.separateInvoices} onChange={() => set("separateInvoices", !billing.separateInvoices)} label="Issue a separate invoice for each company in my profile" />
          <p style={{ fontSize: 12, color: C.muted, marginTop: 4, marginLeft: 28 }}>All invoices will be sent to the billing email addresses above</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field label="Billing name">
            <input value={billing.billingName} onChange={e => set("billingName", e.target.value)} style={inp} />
          </Field>
          <Field label="VAT number">
            <input value={billing.vatNumber} onChange={e => set("vatNumber", e.target.value)} placeholder="Leave blank if not VAT registered" style={inp} />
          </Field>
        </div>
        <Field label="Billing address">
          <input value={billing.address} onChange={e => set("address", e.target.value)} placeholder="Optional — shown on invoices" style={inp} />
        </Field>

        <div style={{ marginTop: 8 }}>
          <Btn onClick={save} variant={saved ? "success" : "primary"}>
            {saved ? <><i className="ti ti-check" aria-hidden="true" /> Saved</> : "Save Billing Preferences"}
          </Btn>
        </div>
      </SectionCard>

      <SectionCard title="Invoice History" subtitle="Your recent LunarPay invoices">
        <div style={{ background: C.surface, borderRadius: 10, overflow: "hidden", border: `1px solid ${C.cardBorder}` }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", padding: "9px 16px", borderBottom: `1px solid ${C.cardBorder}` }}>
            {["Invoice", "Date", "Period", "Employees", "Amount"].map(h => (
              <span key={h} style={{ fontSize: 11, color: C.sageMid, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{h}</span>
            ))}
          </div>
          {INVOICES.map((inv, i) => (
            <div key={inv.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", padding: "12px 16px", borderBottom: i < INVOICES.length - 1 ? `1px solid ${C.cardBorder}` : "none", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <i className="ti ti-file-invoice" aria-hidden="true" style={{ fontSize: 14, color: C.sageMid }} />
                <span style={{ fontSize: 13, color: C.info, cursor: "pointer" }}>{inv.id}</span>
              </div>
              <span style={{ fontSize: 13, color: C.muted }}>{inv.date}</span>
              <span style={{ fontSize: 13, color: C.ink }}>{inv.period}</span>
              <span style={{ fontSize: 13, color: C.muted }}>{inv.employees}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{fmt(inv.amount)}</span>
                <Badge color={C.active} bg={C.activeBg}>{inv.status}</Badge>
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: C.muted, marginTop: 10 }}>
          Current plan: <strong style={{ color: C.ink }}>R{(INVOICES[0].amount / INVOICES[0].employees).toFixed(2)}</strong> per employee per month
        </p>
      </SectionCard>
    </div>
  );
}

// ─── Audit Log Tab ────────────────────────────────────────────────────────────
function AuditLogTab() {
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterUser, setFilterUser] = useState("All");
  const [search, setSearch] = useState("");

  const users = [...new Set(AUDIT_LOG.map(a => a.user))];
  const categories = ["All", ...Object.keys(CATEGORY_COLORS)];

  const filtered = AUDIT_LOG.filter(log => {
    const matchCat = filterCategory === "All" || log.category === filterCategory;
    const matchUser = filterUser === "All" || log.user === filterUser;
    const matchSearch = !search || `${log.action} ${log.target} ${log.user}`.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchUser && matchSearch;
  });

  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 15, fontWeight: 700, color: C.ink, marginBottom: 4 }}>Audit Log</h3>
          <p style={{ fontSize: 13, color: C.muted }}>A complete record of all actions taken in LunarPay. Use this to track changes and maintain accountability.</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search actions…" style={{ ...inp, paddingLeft: 36 }} />
          <i className="ti ti-search" aria-hidden="true" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.sageMid, fontSize: 14, pointerEvents: "none" }} />
        </div>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{ ...sel, width: 160 }}>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={filterUser} onChange={e => setFilterUser(e.target.value)} style={{ ...sel, width: 180 }}>
          <option value="All">All Users</option>
          {users.map(u => <option key={u}>{u}</option>)}
        </select>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1.5fr 2fr 1fr 1.2fr", padding: "10px 20px", background: C.surface, borderBottom: `1px solid ${C.cardBorder}` }}>
          {["User", "Action", "Details", "Category", "Time"].map(h => (
            <span key={h} style={{ fontSize: 11, color: C.sageMid, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>{h}</span>
          ))}
        </div>
        {filtered.map((log, i) => {
          const av = getAvatarColor(log.user);
          const userInitials = log.user.split(" ").map(n => n[0]).join("").toUpperCase();
          const catStyle = CATEGORY_COLORS[log.category] || { color: C.muted, bg: C.surface };
          return (
            <div key={log.id} style={{ display: "grid", gridTemplateColumns: "1.5fr 1.5fr 2fr 1fr 1.2fr", padding: "12px 20px", borderBottom: i < filtered.length - 1 ? `1px solid ${C.cardBorder}` : "none", alignItems: "center" }}
              onMouseEnter={ev => ev.currentTarget.style.background = C.surface}
              onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: av.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: av.text, flexShrink: 0 }}>{userInitials}</div>
                <span style={{ fontSize: 12, color: C.ink, fontWeight: 500 }}>{log.user}</span>
              </div>
              <span style={{ fontSize: 13, color: C.ink }}>{log.action}</span>
              <span style={{ fontSize: 12, color: C.muted, paddingRight: 8 }}>{log.target}</span>
              <div><Badge color={catStyle.color} bg={catStyle.bg}>{log.category}</Badge></div>
              <span style={{ fontSize: 11, color: C.muted, fontFamily: "monospace" }}>{log.time}</span>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ padding: "40px 20px", textAlign: "center", color: C.sageMid, fontSize: 13 }}>No audit entries match your filters</div>
        )}
      </div>
      <p style={{ fontSize: 12, color: C.sageMid, marginTop: 10 }}>Showing {filtered.length} of {AUDIT_LOG.length} entries</p>
    </div>
  );
}

// ─── Company Profile Tab ──────────────────────────────────────────────────────
function CompanyTab() {
  const [form, setForm] = useState({
    companyName: "Demo Company (Pty) Ltd",
    tradingName: "Demo Company",
    regNumber: "2018/123456/07",
    taxNumber: "9876543210",
    uifRefNumber: "U123456789",
    sdlNumber: "L123456789",
    address: "12 Oak Street",
    suburb: "Sandton",
    city: "Johannesburg",
    province: "Gauteng",
    code: "2196",
    phone: "+27 11 555 0100",
    email: "payroll@demo.co.za",
    payrollContact: "Brandon Louw",
  });
  const [saved, setSaved] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div style={{ padding: "28px 32px", maxWidth: 680 }}>
      <SectionCard title="Company Details" subtitle="Registered and contact information">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field label="Registered company name">
            <input value={form.companyName} onChange={e => set("companyName", e.target.value)} style={inp} />
          </Field>
          <Field label="Trading name">
            <input value={form.tradingName} onChange={e => set("tradingName", e.target.value)} style={inp} />
          </Field>
          <Field label="Company registration number">
            <input value={form.regNumber} onChange={e => set("regNumber", e.target.value)} style={inp} />
          </Field>
          <Field label="Income tax number (PAYE)">
            <input value={form.taxNumber} onChange={e => set("taxNumber", e.target.value)} style={inp} />
          </Field>
          <Field label="UIF reference number">
            <input value={form.uifRefNumber} onChange={e => set("uifRefNumber", e.target.value)} style={inp} />
          </Field>
          <Field label="SDL number">
            <input value={form.sdlNumber} onChange={e => set("sdlNumber", e.target.value)} style={inp} />
          </Field>
        </div>
        <Divider />
        <p style={{ fontSize: 12, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Address & Contact</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field label="Street address">
            <input value={form.address} onChange={e => set("address", e.target.value)} style={inp} />
          </Field>
          <Field label="Suburb / District">
            <input value={form.suburb} onChange={e => set("suburb", e.target.value)} style={inp} />
          </Field>
          <Field label="City / Town">
            <input value={form.city} onChange={e => set("city", e.target.value)} style={inp} />
          </Field>
          <Field label="Province">
            <select value={form.province} onChange={e => set("province", e.target.value)} style={sel}>
              {["Gauteng","Western Cape","KwaZulu-Natal","Eastern Cape","Limpopo","Mpumalanga","North West","Free State","Northern Cape"].map(p => <option key={p}>{p}</option>)}
            </select>
          </Field>
          <Field label="Postal code">
            <input value={form.code} onChange={e => set("code", e.target.value)} style={{ ...inp, width: 120 }} />
          </Field>
        </div>
        <Divider />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field label="Payroll contact person">
            <input value={form.payrollContact} onChange={e => set("payrollContact", e.target.value)} style={inp} />
          </Field>
          <Field label="Payroll email">
            <input type="email" value={form.email} onChange={e => set("email", e.target.value)} style={inp} />
          </Field>
          <Field label="Phone number">
            <input value={form.phone} onChange={e => set("phone", e.target.value)} style={inp} />
          </Field>
        </div>
        <div style={{ marginTop: 8 }}>
          <Btn onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500); }} variant={saved ? "success" : "primary"}>
            {saved ? <><i className="ti ti-check" aria-hidden="true" /> Saved</> : "Save Company Details"}
          </Btn>
        </div>
      </SectionCard>
    </div>
  );
}

// ─── Main Settings Component ──────────────────────────────────────────────────
export default function Settings() {
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState(INITIAL_USERS);

  const tabs = [
    { id: "users", label: "Users", icon: "ti-users" },
    { id: "company", label: "Company", icon: "ti-building" },
    { id: "billing", label: "Billing", icon: "ti-credit-card" },
    { id: "audit", label: "Audit Log", icon: "ti-list-search" },
  ];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", ...DOTS_BG }}>
      <div style={{ padding: "0 32px", borderBottom: `1px solid ${C.cardBorder}`, background: "rgba(245,242,234,0.92)", display: "flex", gap: 0, flexShrink: 0 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "13px 18px", border: "none", background: "none", borderBottom: tab === t.id ? `2px solid ${C.olive}` : "2px solid transparent", color: tab === t.id ? C.olive : C.muted, cursor: "pointer", fontSize: 13, fontWeight: tab === t.id ? 600 : 400, fontFamily: FONT_BODY, transition: "color 0.15s" }}>
            <i className={`ti ${t.icon}`} aria-hidden="true" style={{ fontSize: 15 }} />
            {t.label}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {tab === "users" && <UsersTab users={users} setUsers={setUsers} />}
        {tab === "company" && <CompanyTab />}
        {tab === "billing" && <BillingTab />}
        {tab === "audit" && <AuditLogTab />}
      </div>
    </div>
  );
}