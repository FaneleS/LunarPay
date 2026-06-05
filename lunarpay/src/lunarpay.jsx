import { useState } from "react";

const COLORS = {
  bg: "#0f1117",
  sidebar: "#161b27",
  card: "#1c2333",
  cardHover: "#212a3e",
  border: "#2a3349",
  accent: "#c9a84c",
  accentDim: "#a8873a",
  accentSoft: "rgba(201,168,76,0.12)",
  text: "#e8eaf0",
  textMuted: "#7a8499",
  textDim: "#4a5168",
  success: "#3ecf8e",
  danger: "#e05c5c",
  info: "#5b8dee",
  badgeBg: "rgba(201,168,76,0.15)",
};

const FONTS = {
  display: "'Syne', sans-serif",
  body: "'DM Sans', sans-serif",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${COLORS.bg}; color: ${COLORS.text}; font-family: ${FONTS.body}; }
  input, select, textarea {
    background: ${COLORS.bg};
    border: 1px solid ${COLORS.border};
    color: ${COLORS.text};
    border-radius: 8px;
    padding: 10px 14px;
    font-family: ${FONTS.body};
    font-size: 14px;
    width: 100%;
    outline: none;
    transition: border-color 0.2s;
  }
  input:focus, select:focus, textarea:focus { border-color: ${COLORS.accent}; }
  select option { background: ${COLORS.card}; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 4px; }
`;

const SAMPLE_EMPLOYEES = [
  { id: "0001", firstName: "Jane", lastName: "Brown", payFrequency: "Monthly", payPoint: "Finance", status: "Active", jobTitle: "Accountant", email: "jane.brown@demo.co.za", dateOfAppointment: "2021-02-01", paymentMethod: "EFT" },
  { id: "0002", firstName: "John", lastName: "Smith", payFrequency: "Monthly", payPoint: "Operations", status: "Active", jobTitle: "Operations Manager", email: "john.smith@demo.co.za", dateOfAppointment: "2020-05-15", paymentMethod: "EFT" },
  { id: "0003", firstName: "Paige", lastName: "Turner", payFrequency: "Monthly", payPoint: "Marketing", status: "Active", jobTitle: "Marketing Lead", email: "paige.turner@demo.co.za", dateOfAppointment: "2022-01-10", paymentMethod: "Cash" },
  { id: "0004", firstName: "Gail", lastName: "Forcewind", payFrequency: "Weekly", payPoint: "Human Resources", status: "Active", jobTitle: "HR Specialist", email: "gail.f@demo.co.za", dateOfAppointment: "2019-08-20", paymentMethod: "EFT" },
  { id: "0005", firstName: "Walter", lastName: "Melon", payFrequency: "Weekly", payPoint: "Operations", status: "Inactive", jobTitle: "Driver", email: "w.melon@demo.co.za", dateOfAppointment: "2018-03-01", paymentMethod: "Cash" },
];

const initials = (f, l) => `${f[0]}${l[0]}`.toUpperCase();
const avatarColor = (name) => {
  const colors = ["#5b8dee","#3ecf8e","#c9a84c","#e05c5c","#9b7fe8","#4db6ac"];
  let h = 0; for (let c of name) h = c.charCodeAt(0) + ((h << 5) - h);
  return colors[Math.abs(h) % colors.length];
};

const Badge = ({ children, color = COLORS.accent }) => (
  <span style={{ background: `${color}22`, color, fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 20, letterSpacing: "0.02em" }}>{children}</span>
);

const Btn = ({ children, onClick, variant = "primary", style = {}, disabled }) => {
  const styles = {
    primary: { background: COLORS.accent, color: "#0f1117", border: "none" },
    ghost: { background: "transparent", color: COLORS.textMuted, border: `1px solid ${COLORS.border}` },
    danger: { background: "transparent", color: COLORS.danger, border: `1px solid ${COLORS.danger}33` },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...styles[variant], padding: "9px 18px", borderRadius: 8, fontFamily: FONTS.body, fontWeight: 500, fontSize: 13, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, transition: "opacity 0.2s", ...style }}>
      {children}
    </button>
  );
};

const Field = ({ label, children, required }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: "block", fontSize: 12, color: COLORS.textMuted, marginBottom: 6, letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}{required && <span style={{ color: COLORS.accent }}> *</span>}</label>
    {children}
  </div>
);

const STEPS = ["Classification", "Basic Info", "Working Hours"];

function AddEmployeeModal({ onClose, onSave }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    isDirector: false, workHours: "Full time", isContractor: false, uifExempt: false,
    firstName: "", lastName: "", dateOfBirth: "", dateOfAppointment: "", idType: "RSA ID", idNumber: "",
    email: "", payFrequency: "Monthly", payPoint: "", number: "", paymentMethod: "EFT",
    bank: "", accountNumber: "", branchCode: "", accountType: "Cheque",
    jobTitle: "", incomeTaxNumber: "",
    hourlyPaid: false, hoursPerDay: "8", schedule: "Fixed",
    mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false,
  });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const days = ["mon","tue","wed","thu","fri","sat","sun"];

  const handleSave = () => {
    const emp = {
      id: String(Math.floor(Math.random() * 9000 + 1000)),
      firstName: form.firstName, lastName: form.lastName,
      payFrequency: form.payFrequency, payPoint: form.payPoint || "General",
      status: "Active", jobTitle: form.jobTitle, email: form.email,
      dateOfAppointment: form.dateOfAppointment, paymentMethod: form.paymentMethod,
    };
    onSave(emp);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, width: 560, maxHeight: "85vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "24px 28px 0", borderBottom: `1px solid ${COLORS.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <span style={{ fontFamily: FONTS.display, fontSize: 18, fontWeight: 600, color: COLORS.text }}>Add New Employee</span>
            <button onClick={onClose} style={{ background: "none", border: "none", color: COLORS.textMuted, cursor: "pointer", fontSize: 20 }}>✕</button>
          </div>
          <div style={{ display: "flex", gap: 0, marginBottom: -1 }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderBottom: i === step ? `2px solid ${COLORS.accent}` : "2px solid transparent", cursor: "pointer" }} onClick={() => i < step && setStep(i)}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: i < step ? COLORS.accent : i === step ? COLORS.accentSoft : COLORS.border, border: i === step ? `1px solid ${COLORS.accent}` : "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: i < step ? "#0f1117" : i === step ? COLORS.accent : COLORS.textDim }}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: 13, color: i === step ? COLORS.text : COLORS.textMuted, fontWeight: i === step ? 500 : 400 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
          {step === 0 && (
            <div>
              <p style={{ color: COLORS.textMuted, fontSize: 13, marginBottom: 20 }}>For most employees, default settings apply. Adjust only if needed.</p>
              {[
                ["isDirector", "Director of the company / member of the CC"],
                ["isContractor", "Independent Contractor"],
                ["uifExempt", "UIF Exempt"],
              ].map(([k, label]) => (
                <label key={k} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, cursor: "pointer" }}>
                  <div onClick={() => set(k, !form[k])} style={{ width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${form[k] ? COLORS.accent : COLORS.border}`, background: form[k] ? COLORS.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {form[k] && <span style={{ color: "#0f1117", fontSize: 11, fontWeight: 700 }}>✓</span>}
                  </div>
                  <span style={{ fontSize: 14, color: COLORS.text }}>{label}</span>
                </label>
              ))}
              <Field label="Working Hours">
                <select value={form.workHours} onChange={e => set("workHours", e.target.value)}>
                  <option>Full time</option>
                  <option>Less than 22 hours per week</option>
                </select>
              </Field>
            </div>
          )}
          {step === 1 && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Field label="First Names" required><input value={form.firstName} onChange={e => set("firstName", e.target.value)} placeholder="As on ID document" /></Field>
                <Field label="Last Name" required><input value={form.lastName} onChange={e => set("lastName", e.target.value)} placeholder="As on ID document" /></Field>
                <Field label="Date of Birth" required><input type="date" value={form.dateOfBirth} onChange={e => set("dateOfBirth", e.target.value)} /></Field>
                <Field label="Date of Appointment" required><input type="date" value={form.dateOfAppointment} onChange={e => set("dateOfAppointment", e.target.value)} /></Field>
                <Field label="Pay Frequency" required>
                  <select value={form.payFrequency} onChange={e => set("payFrequency", e.target.value)}>
                    <option>Monthly</option><option>Weekly</option><option>Bi-Weekly</option><option>Bi-Monthly</option>
                  </select>
                </Field>
                <Field label="Payment Method" required>
                  <select value={form.paymentMethod} onChange={e => set("paymentMethod", e.target.value)}>
                    <option>EFT</option><option>Cash</option>
                  </select>
                </Field>
                <Field label="Identification Type">
                  <select value={form.idType} onChange={e => set("idType", e.target.value)}>
                    <option>RSA ID</option><option>Passport</option><option>None</option>
                  </select>
                </Field>
                <Field label="ID Number"><input value={form.idNumber} onChange={e => set("idNumber", e.target.value)} /></Field>
                <Field label="Email"><input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="For self-service access" /></Field>
                <Field label="Job Title"><input value={form.jobTitle} onChange={e => set("jobTitle", e.target.value)} /></Field>
                <Field label="Pay Point"><input value={form.payPoint} onChange={e => set("payPoint", e.target.value)} placeholder="e.g. Finance, Operations" /></Field>
                <Field label="Employee Number"><input value={form.number} onChange={e => set("number", e.target.value)} placeholder="Leave blank for auto" /></Field>
              </div>
              {form.paymentMethod === "EFT" && (
                <div style={{ marginTop: 8, padding: 16, background: COLORS.bg, borderRadius: 10, border: `1px solid ${COLORS.border}` }}>
                  <p style={{ fontSize: 12, color: COLORS.accent, marginBottom: 12, fontWeight: 500 }}>Bank Account Details</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <Field label="Bank"><select value={form.bank} onChange={e => set("bank", e.target.value)}><option value="">Select bank</option><option>ABSA</option><option>Standard Bank</option><option>FNB</option><option>Nedbank</option><option>Capitec</option></select></Field>
                    <Field label="Account Number"><input value={form.accountNumber} onChange={e => set("accountNumber", e.target.value)} /></Field>
                    <Field label="Branch Code"><input value={form.branchCode} onChange={e => set("branchCode", e.target.value)} /></Field>
                    <Field label="Account Type"><select value={form.accountType} onChange={e => set("accountType", e.target.value)}><option>Cheque</option><option>Savings</option><option>Transmission</option></select></Field>
                  </div>
                </div>
              )}
            </div>
          )}
          {step === 2 && (
            <div>
              <p style={{ color: COLORS.textMuted, fontSize: 13, marginBottom: 20 }}>Set working hours — this affects hourly rate and leave entitlement calculations.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                <Field label="Schedule">
                  <select value={form.schedule} onChange={e => set("schedule", e.target.value)}>
                    <option>Fixed</option><option>Casual / Temp</option>
                  </select>
                </Field>
                <Field label="Hours Per Day">
                  <input type="number" value={form.hoursPerDay} onChange={e => set("hoursPerDay", e.target.value)} min={1} max={24} />
                </Field>
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, cursor: "pointer" }}>
                <div onClick={() => set("hourlyPaid", !form.hourlyPaid)} style={{ width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${form.hourlyPaid ? COLORS.accent : COLORS.border}`, background: form.hourlyPaid ? COLORS.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {form.hourlyPaid && <span style={{ color: "#0f1117", fontSize: 11, fontWeight: 700 }}>✓</span>}
                </div>
                <span style={{ fontSize: 14, color: COLORS.text }}>Hourly paid employee</span>
              </label>
              <p style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.04em" }}>Regular Working Days</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {days.map(d => (
                  <div key={d} onClick={() => set(d, !form[d])} style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${form[d] ? COLORS.accent : COLORS.border}`, background: form[d] ? COLORS.accentSoft : "transparent", color: form[d] ? COLORS.accent : COLORS.textMuted, fontSize: 13, cursor: "pointer", fontWeight: 500, textTransform: "capitalize", userSelect: "none", transition: "all 0.15s" }}>
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div style={{ padding: "16px 28px", borderTop: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between" }}>
          <Btn variant="ghost" onClick={step === 0 ? onClose : () => setStep(s => s - 1)}>{step === 0 ? "Cancel" : "← Back"}</Btn>
          {step < 2
            ? <Btn onClick={() => setStep(s => s + 1)} disabled={step === 1 && (!form.firstName || !form.lastName)}>Continue →</Btn>
            : <Btn onClick={handleSave}>Save Employee</Btn>}
        </div>
      </div>
    </div>
  );
}

function EmployeeProfile({ employee, onBack, onTerminate }) {
  const [tab, setTab] = useState("payroll");
  const tabs = ["payroll", "edit info", "leave", "end service", "notes"];
  const color = avatarColor(employee.firstName + employee.lastName);

  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: COLORS.textMuted, cursor: "pointer", fontSize: 13, marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>← Back to Employees</button>
      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: "24px 28px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: `${color}22`, border: `2px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 600, color, fontFamily: FONTS.display }}>
            {initials(employee.firstName, employee.lastName)}
          </div>
          <div>
            <div style={{ fontFamily: FONTS.display, fontSize: 20, fontWeight: 600, color: COLORS.text }}>{employee.lastName}, {employee.firstName}</div>
            <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 3 }}>{employee.jobTitle} · <span style={{ color: COLORS.accent }}>{employee.payPoint}</span></div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <Badge color={employee.status === "Active" ? COLORS.success : COLORS.textMuted}>{employee.status}</Badge>
            <Badge color={COLORS.info}>{employee.payFrequency}</Badge>
          </div>
        </div>
        <div style={{ display: "flex", borderBottom: `1px solid ${COLORS.border}`, padding: "0 28px" }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ background: "none", border: "none", borderBottom: tab === t ? `2px solid ${COLORS.accent}` : "2px solid transparent", color: tab === t ? COLORS.accent : COLORS.textMuted, padding: "12px 16px", cursor: "pointer", fontSize: 13, fontWeight: tab === t ? 500 : 400, textTransform: "capitalize", fontFamily: FONTS.body, transition: "color 0.15s" }}>
              {t}
            </button>
          ))}
        </div>
        <div style={{ padding: "28px" }}>
          {tab === "payroll" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                {[
                  ["Pay Frequency", employee.payFrequency],
                  ["Payment Method", employee.paymentMethod],
                  ["Employee Number", employee.id],
                  ["Pay Point", employee.payPoint || "—"],
                ].map(([k, v]) => (
                  <div key={k} style={{ background: COLORS.bg, borderRadius: 10, padding: "14px 16px", border: `1px solid ${COLORS.border}` }}>
                    <div style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{k}</div>
                    <div style={{ fontSize: 15, color: COLORS.text, fontWeight: 500 }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: COLORS.textMuted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>Regular Inputs</span>
                <Btn variant="ghost" style={{ padding: "6px 14px", fontSize: 12 }}>+ Add</Btn>
              </div>
              <div style={{ background: COLORS.bg, borderRadius: 10, border: `1px solid ${COLORS.border}`, overflow: "hidden" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", borderBottom: `1px solid ${COLORS.border}` }}>
                  <span style={{ fontSize: 14, color: COLORS.text }}>Basic Salary</span>
                  <span style={{ fontSize: 14, color: COLORS.textMuted }}>Fixed Amount</span>
                </div>
                <div style={{ padding: "24px 16px", textAlign: "center", color: COLORS.textDim, fontSize: 13 }}>No payslip inputs for this period</div>
              </div>
            </div>
          )}
          {tab === "edit info" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  ["First Names", employee.firstName], ["Last Name", employee.lastName],
                  ["Email", employee.email], ["Job Title", employee.jobTitle || "—"],
                  ["Date of Appointment", employee.dateOfAppointment], ["Pay Point", employee.payPoint],
                ].map(([k, v]) => (
                  <Field key={k} label={k}><input defaultValue={v} /></Field>
                ))}
              </div>
              <Btn style={{ marginTop: 8 }}>Save Changes</Btn>
            </div>
          )}
          {tab === "leave" && (
            <div style={{ color: COLORS.textMuted, textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🌙</div>
              <div style={{ fontSize: 14 }}>Leave module coming soon</div>
            </div>
          )}
          {tab === "end service" && (
            <div>
              <p style={{ color: COLORS.textMuted, fontSize: 14, marginBottom: 24 }}>Record termination details. Set the termination date before finalising the employee's last payslip.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Field label="Last Day of Service" required><input type="date" /></Field>
                <Field label="UIF Status Code" required>
                  <select><option value="">Select reason</option><option>Resigned</option><option>Dismissed</option><option>Retrenchment</option><option>Retirement</option><option>Maternity / Adoption</option><option>Death</option></select>
                </Field>
              </div>
              <Btn variant="danger" style={{ marginTop: 8 }} onClick={onTerminate}>Record Termination</Btn>
            </div>
          )}
          {tab === "notes" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontSize: 13, color: COLORS.textMuted }}>Employee notes</span>
                <Btn variant="ghost" style={{ padding: "6px 14px", fontSize: 12 }}>+ New Note</Btn>
              </div>
              <div style={{ color: COLORS.textDim, textAlign: "center", padding: "40px 0", fontSize: 13 }}>No notes recorded for this employee</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LunarPay() {
  const [employees, setEmployees] = useState(SAMPLE_EMPLOYEES);
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [activeNav, setActiveNav] = useState("employees");

  const navItems = [
    { id: "employees", icon: "👥", label: "Employees" },
    { id: "payruns", icon: "💸", label: "Pay Runs" },
    { id: "leave", icon: "📅", label: "Leave" },
    { id: "reports", icon: "📊", label: "Reports" },
    { id: "settings", icon: "⚙️", label: "Settings" },
  ];

  const filtered = employees.filter(e => {
    const matchSearch = `${e.firstName} ${e.lastName} ${e.id}`.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || e.status === filter || e.payFrequency === filter;
    return matchSearch && matchFilter;
  });

  const groups = filtered.reduce((acc, e) => {
    const key = e.payFrequency;
    if (!acc[key]) acc[key] = [];
    acc[key].push(e);
    return acc;
  }, {});

  const handleSave = (emp) => { setEmployees(p => [...p, emp]); setShowAdd(false); };
  const handleTerminate = () => { setEmployees(p => p.map(e => e.id === selected.id ? { ...e, status: "Inactive" } : e)); setSelected(null); };

  return (
    <div style={{ display: "flex", height: "100vh", background: COLORS.bg, fontFamily: FONTS.body }}>
      <style>{css}</style>
      <div style={{ width: 220, background: COLORS.sidebar, borderRight: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "24px 20px 20px", borderBottom: `1px solid ${COLORS.border}` }}>
          <div style={{ fontFamily: FONTS.display, fontSize: 20, fontWeight: 700, color: COLORS.accent, letterSpacing: "-0.02em" }}>🌙 LunarPay</div>
          <div style={{ fontSize: 11, color: COLORS.textDim, marginTop: 4 }}>Demo Company</div>
        </div>
        <nav style={{ flex: 1, padding: "16px 12px" }}>
          {navItems.map(n => (
            <button key={n.id} onClick={() => setActiveNav(n.id)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, background: activeNav === n.id ? COLORS.accentSoft : "transparent", border: "none", color: activeNav === n.id ? COLORS.accent : COLORS.textMuted, cursor: "pointer", fontSize: 13, fontFamily: FONTS.body, fontWeight: activeNav === n.id ? 500 : 400, marginBottom: 2, textAlign: "left", transition: "all 0.15s" }}>
              <span style={{ fontSize: 16 }}>{n.icon}</span>{n.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: "16px 20px", borderTop: `1px solid ${COLORS.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: COLORS.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: COLORS.accent }}>A</div>
            <div>
              <div style={{ fontSize: 13, color: COLORS.text, fontWeight: 500 }}>Admin</div>
              <div style={{ fontSize: 11, color: COLORS.textDim }}>Administrator</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "20px 32px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: COLORS.sidebar }}>
          <div>
            <h1 style={{ fontFamily: FONTS.display, fontSize: 20, fontWeight: 600, color: COLORS.text }}>Employees</h1>
            <p style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 2 }}>{employees.filter(e => e.status === "Active").length} active · {employees.filter(e => e.status === "Inactive").length} inactive</p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employees..." style={{ width: 220, height: 38, fontSize: 13 }} />
            <select value={filter} onChange={e => setFilter(e.target.value)} style={{ width: 130, height: 38, fontSize: 13 }}>
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Monthly">Monthly</option>
              <option value="Weekly">Weekly</option>
            </select>
            <Btn onClick={() => setShowAdd(true)}>+ Add Employee</Btn>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
          {selected ? (
            <EmployeeProfile employee={selected} onBack={() => setSelected(null)} onTerminate={handleTerminate} />
          ) : (
            <div>
              {Object.entries(groups).map(([freq, emps]) => (
                <div key={freq} style={{ marginBottom: 32 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <span style={{ fontFamily: FONTS.display, fontSize: 15, fontWeight: 600, color: COLORS.text }}>{freq}</span>
                    <span style={{ fontSize: 12, color: COLORS.textDim, background: COLORS.card, padding: "2px 8px", borderRadius: 20, border: `1px solid ${COLORS.border}` }}>{emps.length}</span>
                  </div>
                  <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: "hidden" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1.2fr 1fr", padding: "10px 20px", borderBottom: `1px solid ${COLORS.border}` }}>
                      {["Employee", "Pay Point", "Number", "Payment", "Status"].map(h => (
                        <span key={h} style={{ fontSize: 11, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 }}>{h}</span>
                      ))}
                    </div>
                    {emps.map((e, i) => {
                      const color = avatarColor(e.firstName + e.lastName);
                      return (
                        <div key={e.id} onClick={() => setSelected(e)} style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1.2fr 1fr", padding: "14px 20px", borderBottom: i < emps.length - 1 ? `1px solid ${COLORS.border}` : "none", cursor: "pointer", transition: "background 0.15s" }}
                          onMouseEnter={ev => ev.currentTarget.style.background = COLORS.cardHover}
                          onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 34, height: 34, borderRadius: "50%", background: `${color}22`, border: `1.5px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color, flexShrink: 0 }}>{initials(e.firstName, e.lastName)}</div>
                            <div>
                              <div style={{ fontSize: 14, color: COLORS.text, fontWeight: 500 }}>{e.lastName}, {e.firstName}</div>
                              <div style={{ fontSize: 12, color: COLORS.textMuted }}>{e.jobTitle}</div>
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", fontSize: 14, color: COLORS.textMuted }}>{e.payPoint}</div>
                          <div style={{ display: "flex", alignItems: "center", fontSize: 14, color: COLORS.textMuted }}>{e.id}</div>
                          <div style={{ display: "flex", alignItems: "center" }}><Badge color={e.paymentMethod === "EFT" ? COLORS.info : COLORS.textMuted}>{e.paymentMethod}</Badge></div>
                          <div style={{ display: "flex", alignItems: "center" }}><Badge color={e.status === "Active" ? COLORS.success : COLORS.textMuted}>{e.status}</Badge></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div style={{ textAlign: "center", padding: "60px 0", color: COLORS.textMuted }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>🌙</div>
                  <div>No employees found</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showAdd && <AddEmployeeModal onClose={() => setShowAdd(false)} onSave={handleSave} />}
    </div>
  );
}