import { useState } from "react";
import { CompanySwitcher, INITIAL_COMPANIES } from "./modules/CompanySwitcher.jsx";
import Dashboard from "./modules/Dashboard.jsx";
import PayRuns from "./modules/PayRuns.jsx";
import Leave from "./modules/Leave.jsx";
import Reports from "./modules/Reports.jsx";
import SelfService from "./modules/SelfService.jsx";
import Settings from "./modules/Settings.jsx";

const C = {
  pageBg: "#F5F2EA",
  surface: "#EDE8DC",
  card: "#FDFAF4",
  cardBorder: "#D8D4C8",
  sidebar: "#3A4232",
  sidebarBorder: "#4A5240",
  header: "#4A5240",
  olive: "#656D4A",
  forest: "#3A4232",
  sage: "#C2C5AA",
  sageMid: "#A4AC86",
  ink: "#333D29",
  wheat: "#C4B470",
  terra: "#936639",
  muted: "#7F7455",
  mutedLight: "#A4AC86",
  active: "#2D6B45",
  activeBg: "#EDF5F0",
  danger: "#8B3A1E",
  dangerBg: "#F5EDE8",
  info: "#2A5C8A",
  infoBg: "#EAF1F8",
};

const FONT_DISPLAY = "'Syne', sans-serif";
const FONT_BODY = "'DM Sans', sans-serif";

const GOOGLE_FONTS = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
@import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css');`;

const GLOBAL_CSS = `
${GOOGLE_FONTS}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { background: ${C.pageBg}; color: ${C.ink}; font-family: ${FONT_BODY}; }
input, select, textarea {
  background: ${C.card};
  border: 1px solid ${C.cardBorder};
  color: ${C.ink};
  border-radius: 8px;
  padding: 9px 13px;
  font-family: ${FONT_BODY};
  font-size: 14px;
  width: 100%;
  outline: none;
  transition: border-color 0.18s;
}
input::placeholder { color: ${C.sageMid}; }
input:focus, select:focus, textarea:focus { border-color: ${C.olive}; box-shadow: 0 0 0 3px rgba(101,109,74,0.1); }
select option { background: ${C.card}; color: ${C.ink}; }
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: ${C.sage}; border-radius: 4px; }
* { scrollbar-width: thin; scrollbar-color: ${C.sage} transparent; }
`;

const DOTS_BG = {
  backgroundImage: `radial-gradient(circle, rgba(101,109,74,0.07) 1px, transparent 1px)`,
  backgroundSize: "16px 16px",
  backgroundColor: C.pageBg,
};

const SAMPLE_EMPLOYEES = [
  { id: "0001", firstName: "Jane", lastName: "Brown", payFrequency: "Monthly", payPoint: "Finance", status: "Active", jobTitle: "Accountant", email: "jane.brown@demo.co.za", dateOfAppointment: "2021-02-01", paymentMethod: "EFT", bank: "ABSA" },
  { id: "0002", firstName: "John", lastName: "Smith", payFrequency: "Monthly", payPoint: "Operations", status: "Active", jobTitle: "Operations Manager", email: "john.smith@demo.co.za", dateOfAppointment: "2020-05-15", paymentMethod: "EFT", bank: "FNB" },
  { id: "0003", firstName: "Paige", lastName: "Turner", payFrequency: "Monthly", payPoint: "Marketing", status: "Active", jobTitle: "Marketing Lead", email: "paige.turner@demo.co.za", dateOfAppointment: "2022-01-10", paymentMethod: "Cash", bank: "" },
  { id: "0004", firstName: "Gail", lastName: "Forcewind", payFrequency: "Weekly", payPoint: "Human Resources", status: "Active", jobTitle: "HR Specialist", email: "gail.f@demo.co.za", dateOfAppointment: "2019-08-20", paymentMethod: "EFT", bank: "Nedbank" },
  { id: "0005", firstName: "Walter", lastName: "Melon", payFrequency: "Weekly", payPoint: "Operations", status: "Inactive", jobTitle: "Driver", email: "w.melon@demo.co.za", dateOfAppointment: "2018-03-01", paymentMethod: "Cash", bank: "" },
  { id: "0006", firstName: "Celeste", lastName: "Fankomo", payFrequency: "Monthly", payPoint: "Operations", status: "Active", jobTitle: "Project Coordinator", email: "c.fankomo@demo.co.za", dateOfAppointment: "2023-03-01", paymentMethod: "EFT", bank: "Capitec" },
];

const AVATAR_COLORS = [
  { bg: "#E8F0E8", text: "#4A5240" },
  { bg: "#F5EDE8", text: "#936639" },
  { bg: "#EAF1F8", text: "#2A5C8A" },
  { bg: "#F0EDE4", text: "#656D4A" },
  { bg: "#F5EAF0", text: "#8A4A6A" },
  { bg: "#EAF5ED", text: "#2D6B45" },
];

const getAvatarColor = (name) => {
  let h = 0;
  for (let c of name) h = c.charCodeAt(0) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
};

const initials = (f, l) => `${f[0]}${l[0]}`.toUpperCase();

// ─── Logo ────────────────────────────────────────────────────────────────────
const OrbitalLogo = ({ size = 28, light = false }) => {
  const stroke = light ? "#C2C5AA" : "#656D4A";
  const core = light ? "#C4B470" : "#C4B470";
  const dot = light ? "#A4AC86" : "#656D4A";
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="9" stroke={stroke} strokeWidth="1.4" />
      <circle cx="14" cy="14" r="4" fill={core} />
      <circle cx="23" cy="7" r="2.2" fill={dot} />
    </svg>
  );
};

// ─── Primitives ───────────────────────────────────────────────────────────────
const Badge = ({ children, color, bg }) => (
  <span style={{ background: bg, color, fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 20, whiteSpace: "nowrap", fontFamily: FONT_BODY }}>
    {children}
  </span>
);

const StatusBadge = ({ status }) =>
  status === "Active"
    ? <Badge color={C.active} bg={C.activeBg}>Active</Badge>
    : <Badge color={C.danger} bg={C.dangerBg}>Inactive</Badge>;

const PaymentBadge = ({ method }) =>
  method === "EFT"
    ? <Badge color={C.info} bg={C.infoBg}>EFT</Badge>
    : <Badge color={C.muted} bg={C.surface}>Cash</Badge>;

const Btn = ({ children, onClick, variant = "primary", style: s = {}, disabled, type = "button" }) => {
  const base = { fontFamily: FONT_BODY, fontWeight: 500, fontSize: 13, borderRadius: 8, padding: "9px 18px", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, border: "none", transition: "opacity 0.15s, transform 0.1s", display: "inline-flex", alignItems: "center", gap: 6 };
  const variants = {
    primary: { background: C.olive, color: "#F5F2EA" },
    ghost: { background: "transparent", color: C.muted, border: `1px solid ${C.cardBorder}` },
    accent: { background: C.wheat, color: C.ink, fontWeight: 600 },
    danger: { background: "transparent", color: C.danger, border: `1px solid ${C.dangerBg}` },
  };
  return <button type={type} onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant], ...s }}>{children}</button>;
};

const Field = ({ label, required, children, half }) => (
  <div style={{ marginBottom: 16, gridColumn: half ? "span 1" : "span 2" }}>
    <label style={{ display: "block", fontSize: 11, color: C.muted, marginBottom: 6, letterSpacing: "0.05em", textTransform: "uppercase", fontWeight: 500 }}>
      {label}{required && <span style={{ color: C.terra, marginLeft: 2 }}>*</span>}
    </label>
    {children}
  </div>
);

const Divider = () => <div style={{ height: 1, background: C.cardBorder, margin: "4px 0 20px" }} />;

// ─── Stepper ──────────────────────────────────────────────────────────────────
const STEPS = ["Classification", "Basic Info", "Working Hours"];

const Stepper = ({ current, onGo }) => (
  <div style={{ display: "flex", padding: "0 28px", borderBottom: `1px solid ${C.cardBorder}`, background: C.card }}>
    {STEPS.map((s, i) => {
      const done = i < current;
      const active = i === current;
      return (
        <button key={s} onClick={() => done && onGo(i)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 18px", border: "none", background: "none", borderBottom: active ? `2px solid ${C.olive}` : "2px solid transparent", cursor: done ? "pointer" : "default", fontFamily: FONT_BODY, marginBottom: -1 }}>
          <div style={{ width: 22, height: 22, borderRadius: "50%", background: done ? C.olive : active ? "rgba(101,109,74,0.12)" : C.surface, border: active ? `1.5px solid ${C.olive}` : done ? "none" : `1.5px solid ${C.cardBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: done ? "#F5F2EA" : active ? C.olive : C.sageMid, flexShrink: 0 }}>
            {done ? "✓" : i + 1}
          </div>
          <span style={{ fontSize: 13, color: active ? C.ink : C.muted, fontWeight: active ? 500 : 400, whiteSpace: "nowrap" }}>{s}</span>
        </button>
      );
    })}
  </div>
);

// ─── Checkbox ─────────────────────────────────────────────────────────────────
const Checkbox = ({ checked, onChange, label }) => (
  <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", marginBottom: 14, userSelect: "none" }}>
    <div onClick={onChange} style={{ width: 18, height: 18, borderRadius: 5, border: `1.5px solid ${checked ? C.olive : C.cardBorder}`, background: checked ? C.olive : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
      {checked && <span style={{ color: "#fff", fontSize: 11, fontWeight: 700, lineHeight: 1 }}>✓</span>}
    </div>
    <span style={{ fontSize: 14, color: C.ink }}>{label}</span>
  </label>
);

// ─── Day Selector ─────────────────────────────────────────────────────────────
const DaySelector = ({ days, onChange }) => {
  const all = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {all.map(d => {
        const on = days.includes(d);
        return (
          <div key={d} onClick={() => onChange(d)} style={{ padding: "7px 13px", borderRadius: 8, border: `1px solid ${on ? C.olive : C.cardBorder}`, background: on ? "rgba(101,109,74,0.1)" : "transparent", color: on ? C.olive : C.muted, fontSize: 13, cursor: "pointer", fontWeight: on ? 500 : 400, transition: "all 0.15s", userSelect: "none" }}>
            {d}
          </div>
        );
      })}
    </div>
  );
};

// ─── Add Employee Modal ───────────────────────────────────────────────────────
const EMPTY_FORM = {
  isDirector: false, workHours: "Full time", isContractor: false, uifExempt: false,
  firstName: "", lastName: "", dob: "", dateOfAppointment: "",
  idType: "RSA ID", idNumber: "", email: "", payFrequency: "Monthly",
  payPoint: "", number: "", paymentMethod: "EFT",
  bank: "", accountNumber: "", branchCode: "", accountType: "Cheque", holderRelationship: "Own",
  jobTitle: "", incomeTaxNumber: "",
  hourlyPaid: false, hoursPerDay: "8", schedule: "Fixed",
  days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
};

function AddEmployeeModal({ onClose, onSave }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(EMPTY_FORM);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const toggleDay = (d) => setForm(p => ({ ...p, days: p.days.includes(d) ? p.days.filter(x => x !== d) : [...p.days, d] }));
  const canNext = step === 1 ? (form.firstName.trim() && form.lastName.trim() && form.dateOfAppointment && form.payFrequency) : true;

  const handleSave = () => {
    onSave({
      id: String(Math.floor(Math.random() * 8999 + 1000)),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      payFrequency: form.payFrequency,
      payPoint: form.payPoint.trim() || "General",
      status: "Active",
      jobTitle: form.jobTitle.trim() || "—",
      email: form.email.trim(),
      dateOfAppointment: form.dateOfAppointment,
      paymentMethod: form.paymentMethod,
      bank: form.bank,
    });
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(51,61,41,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, backdropFilter: "blur(2px)" }}>
      <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16, width: 580, maxHeight: "88vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 24px 60px rgba(51,61,41,0.2)" }}>

        {/* Header */}
        <div style={{ padding: "22px 28px 0", background: C.card, borderBottom: `1px solid ${C.cardBorder}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
            <div>
              <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 700, color: C.ink }}>Add New Employee</h2>
              <p style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>Complete all three steps to create the employee record</p>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 18, padding: 4, lineHeight: 1 }}>✕</button>
          </div>
          <Stepper current={step} onGo={setStep} />
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>

          {/* Step 0 — Classification */}
          {step === 0 && (
            <div>
              <p style={{ fontSize: 13, color: C.muted, marginBottom: 20, lineHeight: 1.6 }}>For most employees the defaults apply. Only adjust if the employee has a special classification.</p>
              <Divider />
              <Checkbox checked={form.isDirector} onChange={() => set("isDirector", !form.isDirector)} label="Director of the company / member of the CC" />
              <Checkbox checked={form.isContractor} onChange={() => set("isContractor", !form.isContractor)} label="Independent Contractor (subject to PAYE & SDL, exempt from UIF)" />
              <Checkbox checked={form.uifExempt} onChange={() => set("uifExempt", !form.uifExempt)} label="UIF Exempt" />
              <div style={{ marginTop: 8 }}>
                <Field label="Working hours" half>
                  <select value={form.workHours} onChange={e => set("workHours", e.target.value)} style={{ width: "100%" }}>
                    <option>Full time</option>
                    <option>Less than 22 hours per week</option>
                  </select>
                </Field>
              </div>
            </div>
          )}

          {/* Step 1 — Basic Info */}
          {step === 1 && (
            <div>
              <p style={{ fontSize: 12, color: C.muted, marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Essential details</p>
              <Divider />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                <Field label="First names" required half><input value={form.firstName} onChange={e => set("firstName", e.target.value)} placeholder="As on ID document" /></Field>
                <Field label="Last name" required half><input value={form.lastName} onChange={e => set("lastName", e.target.value)} placeholder="As on ID document" /></Field>
                <Field label="Date of birth" half><input type="date" value={form.dob} onChange={e => set("dob", e.target.value)} /></Field>
                <Field label="Date of appointment" required half><input type="date" value={form.dateOfAppointment} onChange={e => set("dateOfAppointment", e.target.value)} /></Field>
                <Field label="Identification type" half>
                  <select value={form.idType} onChange={e => set("idType", e.target.value)}>
                    <option>RSA ID</option><option>Passport</option><option>Foreign ID</option><option>None</option>
                  </select>
                </Field>
                <Field label="ID / Passport number" half><input value={form.idNumber} onChange={e => set("idNumber", e.target.value)} /></Field>
                <Field label="Email address" half><input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="For self-service access" /></Field>
                <Field label="Job title" half><input value={form.jobTitle} onChange={e => set("jobTitle", e.target.value)} /></Field>
                <Field label="Pay frequency" required half>
                  <select value={form.payFrequency} onChange={e => set("payFrequency", e.target.value)}>
                    <option>Monthly</option><option>Weekly</option><option>Bi-Weekly</option><option>Bi-Monthly</option>
                  </select>
                </Field>
                <Field label="Pay point" half><input value={form.payPoint} onChange={e => set("payPoint", e.target.value)} placeholder="e.g. Finance, Operations" /></Field>
                <Field label="Payment method" required half>
                  <select value={form.paymentMethod} onChange={e => set("paymentMethod", e.target.value)}>
                    <option>EFT</option><option>Cash</option>
                  </select>
                </Field>
                <Field label="Employee number" half><input value={form.number} onChange={e => set("number", e.target.value)} placeholder="Leave blank for auto" /></Field>
                <Field label="Income tax number" half><input value={form.incomeTaxNumber} onChange={e => set("incomeTaxNumber", e.target.value)} /></Field>
              </div>

              {form.paymentMethod === "EFT" && (
                <div>
                  <p style={{ fontSize: 12, color: C.muted, marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 8 }}>Bank account details</p>
                  <Divider />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                    <Field label="Bank" half>
                      <select value={form.bank} onChange={e => set("bank", e.target.value)}>
                        <option value="">Select bank</option>
                        <option>ABSA</option><option>Standard Bank</option><option>FNB</option><option>Nedbank</option><option>Capitec</option><option>Investec</option><option>African Bank</option>
                      </select>
                    </Field>
                    <Field label="Account number" half><input value={form.accountNumber} onChange={e => set("accountNumber", e.target.value)} /></Field>
                    <Field label="Branch code" half><input value={form.branchCode} onChange={e => set("branchCode", e.target.value)} /></Field>
                    <Field label="Account type" half>
                      <select value={form.accountType} onChange={e => set("accountType", e.target.value)}>
                        <option>Cheque</option><option>Savings</option><option>Transmission</option>
                      </select>
                    </Field>
                    <Field label="Account holder relationship" half>
                      <select value={form.holderRelationship} onChange={e => set("holderRelationship", e.target.value)}>
                        <option>Own</option><option>Third Party</option>
                      </select>
                    </Field>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2 — Working Hours */}
          {step === 2 && (
            <div>
              <p style={{ fontSize: 13, color: C.muted, marginBottom: 20, lineHeight: 1.6 }}>Working hours affect the employee's hourly rate calculation and leave entitlement accrual.</p>
              <Divider />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                <Field label="Schedule" half>
                  <select value={form.schedule} onChange={e => set("schedule", e.target.value)}>
                    <option>Fixed</option>
                    <option>Casual / Temp</option>
                  </select>
                </Field>
                <Field label="Hours per day" half>
                  <input type="number" value={form.hoursPerDay} onChange={e => set("hoursPerDay", e.target.value)} min={1} max={24} step={0.5} />
                </Field>
              </div>
              <Checkbox checked={form.hourlyPaid} onChange={() => set("hourlyPaid", !form.hourlyPaid)} label="Hourly paid employee" />
              <div style={{ marginTop: 12 }}>
                <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 500 }}>Regular working days</label>
                <DaySelector days={form.days} onChange={toggleDay} />
                <p style={{ fontSize: 12, color: C.sageMid, marginTop: 10 }}>{form.days.length} day{form.days.length !== 1 ? "s" : ""} selected · {(parseFloat(form.hoursPerDay) * form.days.length).toFixed(1)} hrs / week</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 28px", borderTop: `1px solid ${C.cardBorder}`, background: C.surface, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Btn variant="ghost" onClick={step === 0 ? onClose : () => setStep(s => s - 1)}>
            {step === 0 ? "Cancel" : "← Back"}
          </Btn>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, color: C.sageMid }}>Step {step + 1} of {STEPS.length}</span>
            {step < 2
              ? <Btn onClick={() => setStep(s => s + 1)} disabled={!canNext}>Continue →</Btn>
              : <Btn onClick={handleSave}>Save Employee</Btn>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Employee Profile ─────────────────────────────────────────────────────────
function EmployeeProfile({ employee, onBack, onTerminate }) {
  const [tab, setTab] = useState("payroll");
  const av = getAvatarColor(employee.firstName + employee.lastName);
  const tabs = [
    { id: "payroll", label: "Payroll" },
    { id: "editinfo", label: "Edit Info" },
    { id: "leave", label: "Leave" },
    { id: "endservice", label: "End Service" },
    { id: "notes", label: "Notes" },
  ];

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 13, marginBottom: 20, display: "flex", alignItems: "center", gap: 6, fontFamily: FONT_BODY, padding: 0 }}>
        ← Back to Employees
      </button>

      <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 14, overflow: "hidden" }}>
        {/* Profile header */}
        <div style={{ padding: "24px 28px", borderBottom: `1px solid ${C.cardBorder}`, display: "flex", alignItems: "center", gap: 18, background: C.surface }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: av.bg, border: `2px solid ${C.cardBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: av.text, fontFamily: FONT_DISPLAY, flexShrink: 0 }}>
            {initials(employee.firstName, employee.lastName)}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 700, color: C.ink }}>{employee.lastName}, {employee.firstName}</h2>
            <p style={{ fontSize: 13, color: C.muted, marginTop: 3 }}>{employee.jobTitle} <span style={{ color: C.sage, margin: "0 6px" }}>·</span> <span style={{ color: C.olive }}>{employee.payPoint}</span></p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <StatusBadge status={employee.status} />
            <Badge color={C.muted} bg={C.surface}>{employee.payFrequency}</Badge>
            <PaymentBadge method={employee.paymentMethod} />
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: `1px solid ${C.cardBorder}`, padding: "0 28px", background: C.card }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ background: "none", border: "none", borderBottom: tab === t.id ? `2px solid ${C.olive}` : "2px solid transparent", color: tab === t.id ? C.olive : C.muted, padding: "12px 16px", cursor: "pointer", fontSize: 13, fontWeight: tab === t.id ? 600 : 400, fontFamily: FONT_BODY, transition: "color 0.15s", marginBottom: -1 }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ padding: 28 }}>
          {tab === "payroll" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
                {[["Pay Frequency", employee.payFrequency], ["Payment", employee.paymentMethod], ["Employee No.", employee.id], ["Pay Point", employee.payPoint]].map(([k, v]) => (
                  <div key={k} style={{ background: C.surface, borderRadius: 10, padding: "14px 16px", border: `1px solid ${C.cardBorder}` }}>
                    <div style={{ fontSize: 11, color: C.sageMid, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6, fontWeight: 500 }}>{k}</div>
                    <div style={{ fontSize: 15, color: C.ink, fontWeight: 600 }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 12, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Regular Inputs</span>
                <Btn variant="ghost" style={{ padding: "6px 14px", fontSize: 12 }}>+ Add</Btn>
              </div>
              <div style={{ background: C.surface, borderRadius: 10, border: `1px solid ${C.cardBorder}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${C.cardBorder}` }}>
                  <span style={{ fontSize: 14, color: C.ink, fontWeight: 500 }}>Basic Salary</span>
                  <span style={{ fontSize: 13, color: C.muted }}>Fixed Amount</span>
                </div>
                <div style={{ padding: "32px 16px", textAlign: "center", color: C.sageMid, fontSize: 13 }}>No payslip-specific inputs for this period</div>
              </div>
            </div>
          )}

          {tab === "editinfo" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                <Field label="First names" half><input defaultValue={employee.firstName} /></Field>
                <Field label="Last name" half><input defaultValue={employee.lastName} /></Field>
                <Field label="Email" half><input defaultValue={employee.email} /></Field>
                <Field label="Job title" half><input defaultValue={employee.jobTitle} /></Field>
                <Field label="Date of appointment" half><input type="date" defaultValue={employee.dateOfAppointment} /></Field>
                <Field label="Pay point" half><input defaultValue={employee.payPoint} /></Field>
                <Field label="Payment method" half>
                  <select defaultValue={employee.paymentMethod}><option>EFT</option><option>Cash</option></select>
                </Field>
                <Field label="Pay frequency" half>
                  <select defaultValue={employee.payFrequency}><option>Monthly</option><option>Weekly</option><option>Bi-Weekly</option></select>
                </Field>
              </div>
              <Btn style={{ marginTop: 8 }}>Save Changes</Btn>
            </div>
          )}

          {tab === "leave" && (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <OrbitalLogo size={40} />
              <p style={{ marginTop: 16, color: C.muted, fontSize: 14 }}>Leave module coming in the next build</p>
            </div>
          )}

          {tab === "endservice" && (
            <div>
              <div style={{ background: C.dangerBg, border: `1px solid rgba(139,58,30,0.2)`, borderRadius: 10, padding: "12px 16px", marginBottom: 24, fontSize: 13, color: C.danger, lineHeight: 1.6 }}>
                Set the termination date before finalising the employee's last payslip. Once finalised, the employee will move to the inactive list.
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                <Field label="Last day of service" required half><input type="date" /></Field>
                <Field label="UIF status code" required half>
                  <select>
                    <option value="">Select reason</option>
                    <option>Resigned</option>
                    <option>Dismissed</option>
                    <option>Retrenchment</option>
                    <option>Retirement</option>
                    <option>Maternity / Adoption</option>
                    <option>Death</option>
                    <option>Contract Expired</option>
                  </select>
                </Field>
              </div>
              <Btn variant="danger" onClick={onTerminate}>Record Termination</Btn>
            </div>
          )}

          {tab === "notes" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <p style={{ fontSize: 13, color: C.muted }}>Record performance notes, disciplinary actions, or general documentation.</p>
                </div>
                <Btn variant="ghost" style={{ padding: "7px 14px", fontSize: 12 }}>+ New Note</Btn>
              </div>
              <div style={{ background: C.surface, borderRadius: 10, border: `1px solid ${C.cardBorder}`, padding: "40px 16px", textAlign: "center", color: C.sageMid, fontSize: 13 }}>
                No notes recorded for this employee
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "ti-layout-dashboard" },
    { id: "employees", label: "Employees", icon: "ti-users" },
    { id: "payruns", label: "Pay Runs", icon: "ti-cash" },
    { id: "leave", label: "Leave", icon: "ti-calendar-event" },
    { id: "filing", label: "Self-Service", icon: "ti-device-mobile" },
    { id: "reports", label: "Reports", icon: "ti-chart-bar" },
    { id: "settings", label: "Settings", icon: "ti-settings" },
  ];

function Sidebar({ active, onNav, companies, activeCompany, onCompanySwitch, onAddCompany }) {
  return (
    <div style={{ width: 224, background: C.sidebar, borderRight: `1px solid ${C.sidebarBorder}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ padding: "18px 14px 14px", borderBottom: `1px solid ${C.sidebarBorder}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, paddingLeft: 2 }}>
          <OrbitalLogo size={26} light />
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 700, color: "#E8E4D8", letterSpacing: "-0.02em" }}>LunarPay</div>
        </div>
        <div style={{ position: "relative" }}>
          <CompanySwitcher
            companies={companies}
            activeCompany={activeCompany}
            onSwitch={(id) => { onCompanySwitch(id); }}
            onAdd={(company) => { onAddCompany(company); }}
          />
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "14px 10px" }}>
        {navItems.map(n => {
          const isActive = active === n.id;
          return (
            <button key={n.id} onClick={() => onNav(n.id)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 12px", borderRadius: 8, background: isActive ? "rgba(194,197,170,0.15)" : "transparent", border: "none", color: isActive ? "#C2C5AA" : C.sageMid, cursor: "pointer", fontSize: 13, fontFamily: FONT_BODY, fontWeight: isActive ? 500 : 400, marginBottom: 1, textAlign: "left", transition: "all 0.15s" }}>
              <i className={`ti ${n.icon}`} style={{ fontSize: 16, opacity: isActive ? 1 : 0.7, width: 18, textAlign: "center" }} aria-hidden="true" />
              {n.label}
              {isActive && <div style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: C.wheat }} />}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding: "14px 16px", borderTop: `1px solid ${C.sidebarBorder}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(196,180,112,0.2)", border: `1px solid rgba(196,180,112,0.3)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.wheat, flexShrink: 0 }}>A</div>
          <div>
            <div style={{ fontSize: 13, color: "#C2C5AA", fontWeight: 500 }}>Admin</div>
            <div style={{ fontSize: 11, color: C.sageMid }}>Administrator</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Employee List ────────────────────────────────────────────────────────────
function EmployeeList({ employees, onSelect }) {
  const groups = employees.reduce((acc, e) => {
    if (!acc[e.payFrequency]) acc[e.payFrequency] = [];
    acc[e.payFrequency].push(e);
    return acc;
  }, {});

  return (
    <div>
      {Object.entries(groups).map(([freq, emps]) => (
        <div key={freq} style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 14, fontWeight: 700, color: C.ink }}>{freq}</h3>
            <span style={{ fontSize: 11, color: C.muted, background: C.surface, padding: "2px 9px", borderRadius: 20, border: `1px solid ${C.cardBorder}`, fontWeight: 500 }}>{emps.length} employees</span>
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, overflow: "hidden" }}>
            {/* Table header */}
            <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1.3fr 1fr 1fr 1fr", padding: "10px 20px", borderBottom: `1px solid ${C.cardBorder}`, background: C.surface }}>
              {["Employee", "Pay Point", "Number", "Payment", "Status"].map(h => (
                <span key={h} style={{ fontSize: 11, color: C.sageMid, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>{h}</span>
              ))}
            </div>
            {/* Rows */}
            {emps.map((e, i) => {
              const av = getAvatarColor(e.firstName + e.lastName);
              return (
                <div key={e.id}
                  onClick={() => onSelect(e)}
                  style={{ display: "grid", gridTemplateColumns: "2.2fr 1.3fr 1fr 1fr 1fr", padding: "14px 20px", borderBottom: i < emps.length - 1 ? `1px solid ${C.cardBorder}` : "none", cursor: "pointer", transition: "background 0.12s" }}
                  onMouseEnter={ev => ev.currentTarget.style.background = C.surface}
                  onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: av.bg, border: `1.5px solid ${C.cardBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: av.text, flexShrink: 0 }}>
                      {initials(e.firstName, e.lastName)}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, color: C.ink, fontWeight: 500 }}>{e.lastName}, {e.firstName}</div>
                      <div style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>{e.jobTitle}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", fontSize: 13, color: C.muted }}>{e.payPoint}</div>
                  <div style={{ display: "flex", alignItems: "center", fontSize: 13, color: C.muted, fontFamily: "monospace" }}>{e.id}</div>
                  <div style={{ display: "flex", alignItems: "center" }}><PaymentBadge method={e.paymentMethod} /></div>
                  <div style={{ display: "flex", alignItems: "center" }}><StatusBadge status={e.status} /></div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function LunarPay() {
  const [companies, setCompanies] = useState(INITIAL_COMPANIES);
  const [activeCompany, setActiveCompany] = useState("co-001");
  const activeCompanyData = companies.find(c => c.id === activeCompany);
  const [employees, setEmployees] = useState(SAMPLE_EMPLOYEES);
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeNav, setActiveNav] = useState("dashboard");

  const filtered = employees.filter(e => {
    const q = search.toLowerCase();
    const matchSearch = !q || `${e.firstName} ${e.lastName} ${e.id} ${e.payPoint}`.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All" || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleSave = (emp) => { setEmployees(p => [...p, emp]); setShowAdd(false); };
  const handleTerminate = () => {
    setEmployees(p => p.map(e => e.id === selected.id ? { ...e, status: "Inactive" } : e));
    setSelected(prev => ({ ...prev, status: "Inactive" }));
  };

  const activeCount = employees.filter(e => e.status === "Active").length;
  const inactiveCount = employees.filter(e => e.status === "Inactive").length;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: FONT_BODY }}>
      <style>{GLOBAL_CSS}</style>
      <Sidebar
        active={activeNav}
        onNav={setActiveNav}
        companies={companies}
        activeCompany={activeCompany}
        onCompanySwitch={(id) => { setActiveCompany(id); setSelected(null); }}
        onAddCompany={(company) => setCompanies(p => [...p, company])}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", ...DOTS_BG }}>
        {/* Top bar */}
        <div style={{ padding: "18px 32px", borderBottom: `1px solid ${C.cardBorder}`, background: "rgba(245,242,234,0.9)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 700, color: C.ink, lineHeight: 1.1 }}>
              {activeNav === "dashboard" ? "Dashboard" : activeNav === "payruns" ? "Pay Runs" : activeNav === "leave" ? "Leave" : activeNav === "reports" ? "Reports" : activeNav === "filing" ? "Self-Service" : activeNav === "settings" ? "Settings" : selected ? `${selected.lastName}, ${selected.firstName}` : "Employees"}
            </h1>
            <p style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>
              {activeNav === "dashboard" ? `${activeCompanyData?.tradingName || activeCompanyData?.name || "Company"} · May 2025` : activeNav === "payruns" ? "Process and manage payroll runs" : activeNav === "leave" ? "Manage leave types, balances and processing" : activeNav === "reports" ? "Generate and export payroll reports" : activeNav === "filing" ? "Employee portal, approvals and payslip release" : activeNav === "settings" ? "Users, company profile, billing and audit log" : selected ? `${selected.jobTitle} · ${selected.payPoint}` : `${activeCount} active · ${inactiveCount} inactive`}
            </p>
          </div>
          {!selected && activeNav === "employees" && (
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ position: "relative" }}>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employees…" style={{ width: 230, paddingLeft: 36, height: 38, fontSize: 13 }} />
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.sageMid, fontSize: 14, pointerEvents: "none" }}>⌕</span>
              </div>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: 120, height: 38, fontSize: 13 }}>
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <Btn onClick={() => setShowAdd(true)}>+ Add Employee</Btn>
            </div>
          )}
        </div>

        {/* Main content */}
        {activeNav === "dashboard" ? (
          <Dashboard onNavigate={setActiveNav} />
        ) : activeNav === "payruns" ? (
          <PayRuns />
        ) : activeNav === "leave" ? (
          <Leave />
        ) : activeNav === "reports" ? (
          <Reports companies={companies} activeCompany={activeCompany} />
        ) : activeNav === "filing" ? (
          <SelfService />
        ) : activeNav === "settings" ? (
          <Settings />
        ) : selected ? (
          <EmployeeProfile employee={selected} onBack={() => setSelected(null)} onTerminate={handleTerminate} />
        ) : (
          <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <OrbitalLogo size={44} />
                <p style={{ marginTop: 16, color: C.muted, fontSize: 14 }}>No employees found</p>
              </div>
            ) : (
              <EmployeeList employees={filtered} onSelect={setSelected} />
            )}
          </div>
        )}
      </div>

      {showAdd && <AddEmployeeModal onClose={() => setShowAdd(false)} onSave={handleSave} />}
    </div>
  );
}