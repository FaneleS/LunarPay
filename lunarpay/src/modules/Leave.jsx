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
const DOTS_BG = { backgroundImage: `radial-gradient(circle, rgba(101,109,74,0.07) 1px, transparent 1px)`, backgroundSize: "16px 16px", backgroundColor: C.pageBg };

const EMPLOYEES = [
  { id: "0001", firstName: "Jane", lastName: "Brown", payPoint: "Finance", dateOfAppointment: "2021-02-01" },
  { id: "0002", firstName: "John", lastName: "Smith", payPoint: "Operations", dateOfAppointment: "2020-05-15" },
  { id: "0003", firstName: "Paige", lastName: "Turner", payPoint: "Marketing", dateOfAppointment: "2022-01-10" },
  { id: "0004", firstName: "Gail", lastName: "Forcewind", payPoint: "Human Resources", dateOfAppointment: "2019-08-20" },
  { id: "0005", firstName: "Walter", lastName: "Melon", payPoint: "Operations", dateOfAppointment: "2018-03-01" },
  { id: "0006", firstName: "Celeste", lastName: "Fankomo", payPoint: "Operations", dateOfAppointment: "2023-03-01" },
];

const LEAVE_TYPE_COLORS = {
  Annual: { bg: "#EAF1F8", text: "#2A5C8A", dot: "#378ADD" },
  Sick: { bg: "#F5EDE8", text: "#8B3A1E", dot: "#B85C38" },
  Compassionate: { bg: "#F5EAF0", text: "#7A3060", dot: "#C45A9A" },
  "Family Responsibility": { bg: "#EDF5F0", text: "#2D6B45", dot: "#4A8C5C" },
  Unpaid: { bg: "#F0EDE4", text: "#5A4A32", dot: "#936639" },
};

const INITIAL_LEAVE_TYPES = [
  { id: 1, name: "Annual", cycleLength: 12, cycleStart: "Appointment Date", unpaid: false, showOnPayslip: true, minBalance: false },
  { id: 2, name: "Sick", cycleLength: 36, cycleStart: "Appointment Date", unpaid: false, showOnPayslip: false, minBalance: false },
  { id: 3, name: "Compassionate", cycleLength: 12, cycleStart: "Appointment Date", unpaid: false, showOnPayslip: false, minBalance: false },
  { id: 4, name: "Family Responsibility", cycleLength: 12, cycleStart: "Appointment Date", unpaid: false, showOnPayslip: false, minBalance: false },
  { id: 5, name: "Unpaid", cycleLength: 12, cycleStart: "Appointment Date", unpaid: true, showOnPayslip: false, minBalance: false },
];

const INITIAL_POLICIES = [
  { id: 1, leaveTypeId: 1, name: "Standard Annual (15 days)", days: 15, upfront: false, carryForward: true, carryExpiry: "", carryLimit: "", hoursAccrual: false },
  { id: 2, leaveTypeId: 1, name: "Management Annual (20 days)", days: 20, upfront: false, carryForward: true, carryExpiry: "6", carryLimit: "10", hoursAccrual: false },
  { id: 3, leaveTypeId: 2, name: "BCEA Sick Leave", days: 30, upfront: false, carryForward: false, carryExpiry: "", carryLimit: "", hoursAccrual: false },
  { id: 4, leaveTypeId: 3, name: "Compassionate (3 days)", days: 3, upfront: true, carryForward: false, carryExpiry: "", carryLimit: "", hoursAccrual: false },
  { id: 5, leaveTypeId: 4, name: "Family Responsibility (3 days)", days: 3, upfront: true, carryForward: false, carryExpiry: "", carryLimit: "", hoursAccrual: false },
];

const INITIAL_RECORDS = [
  { id: 1, empId: "0001", leaveTypeId: 1, from: "2025-03-10", to: "2025-03-14", days: 5, partial: false, partialHours: 0, status: "Approved" },
  { id: 2, empId: "0001", leaveTypeId: 2, from: "2025-04-02", to: "2025-04-02", days: 1, partial: false, partialHours: 0, status: "Approved" },
  { id: 3, empId: "0002", leaveTypeId: 1, from: "2025-02-17", to: "2025-02-21", days: 5, partial: false, partialHours: 0, status: "Approved" },
  { id: 4, empId: "0003", leaveTypeId: 1, from: "2025-05-05", to: "2025-05-07", days: 3, partial: false, partialHours: 0, status: "Approved" },
  { id: 5, empId: "0004", leaveTypeId: 2, from: "2025-04-15", to: "2025-04-15", days: 1, partial: true, partialHours: 4, status: "Approved" },
  { id: 6, empId: "0002", leaveTypeId: 1, from: "2025-05-19", to: "2025-05-23", days: 5, partial: false, partialHours: 0, status: "Approved" },
];

const INITIAL_ADJUSTMENTS = [
  { id: 1, empId: "0001", leaveTypeId: 1, date: "2025-01-01", amount: 3, description: "Opening balance carry-over" },
  { id: 2, empId: "0002", leaveTypeId: 2, date: "2025-01-01", amount: -2, description: "Correction from previous system" },
];

const calcBalance = (empId, leaveTypeId, records, adjustments) => {
  const policy = INITIAL_POLICIES.find(p => p.leaveTypeId === leaveTypeId);
  const accrued = policy ? (policy.days / 12) * 5 : 0;
  const taken = records.filter(r => r.empId === empId && r.leaveTypeId === leaveTypeId).reduce((s, r) => s + r.days, 0);
  const adj = adjustments.filter(a => a.empId === empId && a.leaveTypeId === leaveTypeId).reduce((s, a) => s + a.amount, 0);
  return Math.max(0, parseFloat((accrued + adj - taken).toFixed(2)));
};

const initials = (f, l) => `${f[0]}${l[0]}`.toUpperCase();
const AVATAR_COLORS = [
  { bg: "#E8F0E8", text: "#4A5240" }, { bg: "#F5EDE8", text: "#936639" },
  { bg: "#EAF1F8", text: "#2A5C8A" }, { bg: "#F0EDE4", text: "#656D4A" },
  { bg: "#F5EAF0", text: "#8A4A6A" }, { bg: "#EAF5ED", text: "#2D6B45" },
];
const getAvatarColor = (name) => { let h = 0; for (let c of name) h = c.charCodeAt(0) + ((h << 5) - h); return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]; };

// ─── Primitives ───────────────────────────────────────────────────────────────
const Btn = ({ children, onClick, variant = "primary", style: s = {}, disabled }) => {
  const base = { fontFamily: FONT_BODY, fontWeight: 500, fontSize: 13, borderRadius: 8, padding: "9px 18px", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, border: "none", display: "inline-flex", alignItems: "center", gap: 6 };
  const v = { primary: { background: C.olive, color: "#F5F2EA" }, ghost: { background: "transparent", color: C.muted, border: `1px solid ${C.cardBorder}` }, accent: { background: C.wheat, color: C.ink, fontWeight: 600 }, danger: { background: "transparent", color: C.danger, border: `1px solid rgba(139,58,30,0.3)` } };
  return <button onClick={onClick} disabled={disabled} style={{ ...base, ...v[variant], ...s }}>{children}</button>;
};

const Badge = ({ children, color, bg }) => (
  <span style={{ background: bg, color, fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 20, whiteSpace: "nowrap" }}>{children}</span>
);

const Field = ({ label, required, children }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ display: "block", fontSize: 11, color: C.muted, marginBottom: 5, letterSpacing: "0.05em", textTransform: "uppercase", fontWeight: 500 }}>
      {label}{required && <span style={{ color: C.terra, marginLeft: 2 }}>*</span>}
    </label>
    {children}
  </div>
);

const SectionHeader = ({ title, action }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
    <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 15, fontWeight: 700, color: C.ink }}>{title}</h3>
    {action}
  </div>
);

const Divider = () => <div style={{ height: 1, background: C.cardBorder, margin: "16px 0" }} />;

const Checkbox = ({ checked, onChange, label, small }) => (
  <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", userSelect: "none" }}>
    <div onClick={onChange} style={{ width: small ? 16 : 18, height: small ? 16 : 18, borderRadius: 4, border: `1.5px solid ${checked ? C.olive : C.cardBorder}`, background: checked ? C.olive : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
      {checked && <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>✓</span>}
    </div>
    {label && <span style={{ fontSize: small ? 12 : 14, color: C.ink }}>{label}</span>}
  </label>
);

const inp = { background: C.card, border: `1px solid ${C.cardBorder}`, color: C.ink, borderRadius: 8, padding: "9px 13px", fontSize: 13, width: "100%", fontFamily: FONT_BODY, outline: "none" };
const sel = { ...inp };

// ─── Mini Calendar ─────────────────────────────────────────────────────────────
function MiniCalendar({ year, month, records, leaveTypes, employees, onDayClick, selectedRange, highlightEmpId }) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const getRecordsForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return records.filter(r => dateStr >= r.from && dateStr <= r.to);
  };

  const isInSelected = (day) => {
    if (!selectedRange.from) return false;
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    if (selectedRange.to) return dateStr >= selectedRange.from && dateStr <= selectedRange.to;
    return dateStr === selectedRange.from;
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 4 }}>
        {days.map(d => <div key={d} style={{ fontSize: 10, color: C.sageMid, textAlign: "center", fontWeight: 600, padding: "4px 0" }}>{d}</div>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const dayRecords = getRecordsForDay(day);
          const highlighted = isInSelected(day);
          const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;
          const dots = dayRecords.slice(0, 3);
          return (
            <div key={i} onClick={() => onDayClick && onDayClick(day)} style={{ borderRadius: 6, padding: "4px 2px", background: highlighted ? "rgba(101,109,74,0.15)" : "transparent", border: highlighted ? `1px solid ${C.olive}` : isToday ? `1px solid ${C.wheat}` : "1px solid transparent", cursor: onDayClick ? "pointer" : "default", minHeight: 36, display: "flex", flexDirection: "column", alignItems: "center", transition: "background 0.1s" }}>
              <span style={{ fontSize: 12, color: highlighted ? C.olive : isToday ? C.terra : C.ink, fontWeight: isToday || highlighted ? 600 : 400 }}>{day}</span>
              <div style={{ display: "flex", gap: 2, marginTop: 2 }}>
                {dots.map((r, ri) => {
                  const lt = leaveTypes.find(t => t.id === r.leaveTypeId);
                  const col = LEAVE_TYPE_COLORS[lt?.name] || { dot: C.sageMid };
                  return <div key={ri} style={{ width: 4, height: 4, borderRadius: "50%", background: col.dot }} />;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Leave Overview Calendar ───────────────────────────────────────────────────
function LeaveOverviewCalendar({ records, leaveTypes, employees }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selected, setSelected] = useState(null);
  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const getEmpRecords = (empId) => records.filter(r => {
    const from = new Date(r.from); const to = new Date(r.to);
    return r.empId === empId && ((from.getMonth() === month && from.getFullYear() === year) || (to.getMonth() === month && to.getFullYear() === year));
  });

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  return (
    <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", background: C.surface, borderBottom: `1px solid ${C.cardBorder}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: FONT_DISPLAY, fontSize: 15, fontWeight: 700, color: C.ink }}>{MONTHS[month]} {year}</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); }} style={{ background: "none", border: `1px solid ${C.cardBorder}`, borderRadius: 6, padding: "4px 10px", cursor: "pointer", color: C.muted, fontFamily: FONT_BODY, fontSize: 13 }}>←</button>
          <button onClick={() => { setMonth(now.getMonth()); setYear(now.getFullYear()); }} style={{ background: "none", border: `1px solid ${C.cardBorder}`, borderRadius: 6, padding: "4px 10px", cursor: "pointer", color: C.muted, fontFamily: FONT_BODY, fontSize: 12 }}>Today</button>
          <button onClick={() => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); }} style={{ background: "none", border: `1px solid ${C.cardBorder}`, borderRadius: 6, padding: "4px 10px", cursor: "pointer", color: C.muted, fontFamily: FONT_BODY, fontSize: 13 }}>→</button>
        </div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
          <thead>
            <tr style={{ background: C.surface }}>
              <th style={{ padding: "8px 16px", fontSize: 11, color: C.sageMid, textAlign: "left", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", width: 140, borderBottom: `1px solid ${C.cardBorder}` }}>Employee</th>
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
                const dow = new Date(year, month, d).getDay();
                const isWeekend = dow === 0 || dow === 6;
                const isToday = d === now.getDate() && month === now.getMonth() && year === now.getFullYear();
                return (
                  <th key={d} style={{ padding: "6px 2px", fontSize: 10, color: isToday ? C.wheat : isWeekend ? C.sage : C.sageMid, textAlign: "center", fontWeight: isToday ? 700 : 500, borderBottom: `1px solid ${C.cardBorder}`, borderLeft: isToday ? `1px solid ${C.wheat}` : "none", background: isWeekend ? "rgba(194,197,170,0.1)" : "transparent", minWidth: 24 }}>{d}</th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, ei) => {
              const empRecords = getEmpRecords(emp.id);
              const av = getAvatarColor(emp.firstName + emp.lastName);
              return (
                <tr key={emp.id} style={{ borderBottom: ei < employees.length - 1 ? `1px solid ${C.cardBorder}` : "none" }}
                  onMouseEnter={ev => ev.currentTarget.style.background = C.surface}
                  onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "8px 16px", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: av.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: av.text, flexShrink: 0 }}>{initials(emp.firstName, emp.lastName)}</div>
                    <span style={{ fontSize: 12, color: C.ink, fontWeight: 500 }}>{emp.firstName} {emp.lastName}</span>
                  </td>
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
                    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                    const rec = empRecords.find(r => dateStr >= r.from && dateStr <= r.to);
                    const dow = new Date(year, month, d).getDay();
                    const isWeekend = dow === 0 || dow === 6;
                    const lt = rec ? leaveTypes.find(t => t.id === rec.leaveTypeId) : null;
                    const col = lt ? LEAVE_TYPE_COLORS[lt.name] : null;
                    const isToday = d === now.getDate() && month === now.getMonth() && year === now.getFullYear();
                    return (
                      <td key={d} onClick={() => rec && setSelected({ emp, rec, lt })} style={{ padding: "4px 2px", textAlign: "center", background: col ? col.bg : isWeekend ? "rgba(194,197,170,0.05)" : "transparent", borderLeft: isToday ? `1px solid ${C.wheat}` : "none", cursor: rec ? "pointer" : "default" }}>
                        {col && <div style={{ height: 16, borderRadius: 3, background: col.dot, opacity: 0.7, margin: "0 1px" }} />}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {selected && (
        <div style={{ padding: "14px 20px", borderTop: `1px solid ${C.cardBorder}`, background: C.surface, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: LEAVE_TYPE_COLORS[selected.lt?.name]?.dot || C.sageMid }} />
          <div>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{selected.emp.firstName} {selected.emp.lastName}</span>
            <span style={{ fontSize: 13, color: C.muted, marginLeft: 8 }}>{selected.rec.from} → {selected.rec.to} · {selected.lt?.name} · {selected.rec.days} day{selected.rec.days !== 1 ? "s" : ""}</span>
          </div>
          <button onClick={() => setSelected(null)} style={{ marginLeft: "auto", background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>
      )}
      <div style={{ padding: "12px 20px", borderTop: `1px solid ${C.cardBorder}`, display: "flex", gap: 16, flexWrap: "wrap" }}>
        {Object.entries(LEAVE_TYPE_COLORS).map(([name, col]) => (
          <div key={name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: col.dot }} />
            <span style={{ fontSize: 11, color: C.muted }}>{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Record Leave Modal ────────────────────────────────────────────────────────
function RecordLeaveModal({ employees, leaveTypes, onClose, onSave }) {
  const [form, setForm] = useState({ empId: "", leaveTypeId: "", from: "", to: "", partial: false, partialHours: 4 });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const workdays = (from, to) => {
    if (!from || !to) return 0;
    let count = 0; let d = new Date(from);
    while (d <= new Date(to)) { const dow = d.getDay(); if (dow !== 0 && dow !== 6) count++; d.setDate(d.getDate() + 1); }
    return count;
  };
  const days = form.partial ? 0.5 : workdays(form.from, form.to);
  const canSave = form.empId && form.leaveTypeId && form.from && form.to;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(51,61,41,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, backdropFilter: "blur(2px)" }}>
      <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16, width: 520, boxShadow: "0 24px 60px rgba(51,61,41,0.2)", overflow: "hidden" }}>
        <div style={{ padding: "22px 28px", background: C.surface, borderBottom: `1px solid ${C.cardBorder}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 700, color: C.ink }}>Record Leave Taken</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 18 }}>✕</button>
        </div>
        <div style={{ padding: "24px 28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Employee" required>
              <select value={form.empId} onChange={e => set("empId", e.target.value)} style={sel}>
                <option value="">Select employee</option>
                {employees.map(e => <option key={e.id} value={e.id}>{e.lastName}, {e.firstName}</option>)}
              </select>
            </Field>
            <Field label="Leave type" required>
              <select value={form.leaveTypeId} onChange={e => set("leaveTypeId", Number(e.target.value))} style={sel}>
                <option value="">Select type</option>
                {leaveTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </Field>
            <Field label="From" required>
              <input type="date" value={form.from} onChange={e => set("from", e.target.value)} style={inp} />
            </Field>
            <Field label="To" required>
              <input type="date" value={form.to} min={form.from} onChange={e => set("to", e.target.value)} style={inp} />
            </Field>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 4, marginBottom: 16 }}>
            <Checkbox checked={form.partial} onChange={() => set("partial", !form.partial)} label="Partial day" />
            {form.partial && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input type="number" value={form.partialHours} onChange={e => set("partialHours", e.target.value)} min={1} max={7} style={{ ...inp, width: 70 }} />
                <span style={{ fontSize: 13, color: C.muted }}>hours</span>
              </div>
            )}
          </div>
          {form.from && form.to && (
            <div style={{ background: C.surface, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.ink, marginBottom: 16 }}>
              <i className="ti ti-info-circle" aria-hidden="true" style={{ color: C.sageMid, marginRight: 6 }} />
              {form.partial ? `${form.partialHours} hours` : `${days} working day${days !== 1 ? "s" : ""}`} of leave
            </div>
          )}
        </div>
        <div style={{ padding: "16px 28px", borderTop: `1px solid ${C.cardBorder}`, background: C.surface, display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn onClick={() => { onSave({ id: Date.now(), empId: form.empId, leaveTypeId: form.leaveTypeId, from: form.from, to: form.to, days, partial: form.partial, partialHours: form.partialHours, status: "Approved" }); onClose(); }} disabled={!canSave}>
            <i className="ti ti-check" aria-hidden="true" /> Confirm & Save
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ─── Leave Activity (per employee) ────────────────────────────────────────────
function LeaveActivity({ employee, leaveTypes, records, adjustments, onBack, onAddAdjustment }) {
  const [showAdjModal, setShowAdjModal] = useState(false);
  const [adjForm, setAdjForm] = useState({ leaveTypeId: "", amount: "", description: "" });
  const av = getAvatarColor(employee.firstName + employee.lastName);

  const saveAdj = () => {
    onAddAdjustment({ id: Date.now(), empId: employee.id, leaveTypeId: Number(adjForm.leaveTypeId), date: new Date().toISOString().split("T")[0], amount: Number(adjForm.amount), description: adjForm.description });
    setShowAdjModal(false);
    setAdjForm({ leaveTypeId: "", amount: "", description: "" });
  };

  const empRecords = records.filter(r => r.empId === employee.id);
  const empAdj = adjustments.filter(a => a.empId === employee.id);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 13, marginBottom: 20, display: "flex", alignItems: "center", gap: 6, fontFamily: FONT_BODY, padding: 0 }}>← Back to Leave</button>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: av.bg, border: `2px solid ${C.cardBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: av.text, fontFamily: FONT_DISPLAY }}>{initials(employee.firstName, employee.lastName)}</div>
        <div>
          <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 700, color: C.ink }}>{employee.lastName}, {employee.firstName}</h2>
          <p style={{ fontSize: 13, color: C.muted }}>{employee.payPoint} · Appointed {employee.dateOfAppointment}</p>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <Btn variant="ghost" style={{ fontSize: 12, padding: "7px 14px" }} onClick={() => setShowAdjModal(true)}>
            <i className="ti ti-adjustments" aria-hidden="true" /> Add Adjustment
          </Btn>
        </div>
      </div>

      {/* Balance cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 24 }}>
        {leaveTypes.map(lt => {
          const balance = calcBalance(employee.id, lt.id, records, adjustments);
          const taken = empRecords.filter(r => r.leaveTypeId === lt.id).reduce((s, r) => s + r.days, 0);
          const col = LEAVE_TYPE_COLORS[lt.name] || { bg: C.surface, text: C.muted, dot: C.sageMid };
          return (
            <div key={lt.id} style={{ background: col.bg, border: `1px solid ${C.cardBorder}`, borderRadius: 10, padding: "14px 14px" }}>
              <div style={{ fontSize: 11, color: col.text, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>{lt.name}</div>
              <div style={{ fontSize: 22, fontWeight: 700, fontFamily: FONT_DISPLAY, color: col.text }}>{balance}</div>
              <div style={{ fontSize: 11, color: col.text, opacity: 0.7, marginTop: 4 }}>{taken} taken</div>
            </div>
          );
        })}
      </div>

      {/* Activity table */}
      <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ padding: "14px 20px", background: C.surface, borderBottom: `1px solid ${C.cardBorder}` }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>Leave Activity</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", padding: "10px 20px", borderBottom: `1px solid ${C.cardBorder}`, background: C.surface }}>
          {["Date", "Type", "Description", "Movement", "Balance"].map(h => (
            <span key={h} style={{ fontSize: 11, color: C.sageMid, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>{h}</span>
          ))}
        </div>
        {[...empRecords.map(r => ({ date: r.from, typeId: r.leaveTypeId, desc: `Leave taken (${r.from} to ${r.to})`, movement: -r.days, type: "taken" })),
          ...empAdj.map(a => ({ date: a.date, typeId: a.leaveTypeId, desc: a.description, movement: a.amount, type: "adjustment" }))
        ].sort((a, b) => a.date.localeCompare(b.date)).map((row, i, arr) => {
          const lt = leaveTypes.find(t => t.id === row.typeId);
          const col = LEAVE_TYPE_COLORS[lt?.name] || { dot: C.sageMid };
          return (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", padding: "12px 20px", borderBottom: i < arr.length - 1 ? `1px solid ${C.cardBorder}` : "none", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: C.muted }}>{row.date}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: col.dot }} />
                <span style={{ fontSize: 13, color: C.ink }}>{lt?.name}</span>
              </div>
              <span style={{ fontSize: 12, color: C.muted }}>{row.desc}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: row.movement < 0 ? C.danger : C.active }}>{row.movement > 0 ? "+" : ""}{row.movement}</span>
              <span style={{ fontSize: 13, color: C.ink }}>—</span>
            </div>
          );
        })}
        {empRecords.length === 0 && empAdj.length === 0 && (
          <div style={{ padding: "32px 20px", textAlign: "center", color: C.sageMid, fontSize: 13 }}>No leave activity recorded</div>
        )}
      </div>

      {showAdjModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(51,61,41,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300 }}>
          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 14, padding: 28, width: 440 }}>
            <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 700, color: C.ink, marginBottom: 20 }}>Add Leave Adjustment</h3>
            <Field label="Leave type" required>
              <select value={adjForm.leaveTypeId} onChange={e => setAdjForm(p => ({ ...p, leaveTypeId: e.target.value }))} style={sel}>
                <option value="">Select type</option>
                {leaveTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </Field>
            <Field label="Amount (+ increase / − decrease)" required>
              <input type="number" value={adjForm.amount} onChange={e => setAdjForm(p => ({ ...p, amount: e.target.value }))} placeholder="e.g. 3 or -2" style={inp} />
            </Field>
            <Field label="Description" required>
              <input value={adjForm.description} onChange={e => setAdjForm(p => ({ ...p, description: e.target.value }))} placeholder="Reason for adjustment" style={inp} />
            </Field>
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <Btn onClick={saveAdj} disabled={!adjForm.leaveTypeId || !adjForm.amount || !adjForm.description}>Save Adjustment</Btn>
              <Btn variant="ghost" onClick={() => setShowAdjModal(false)}>Cancel</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Policy Modal ─────────────────────────────────────────────────────────────
function PolicyModal({ leaveType, policy, onClose, onSave }) {
  const [form, setForm] = useState(policy || { name: "", days: 15, upfront: false, carryForward: true, carryExpiry: "", carryLimit: "", hoursAccrual: false, hoursRatio: 10, leaveTypeId: leaveType.id });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(51,61,41,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, backdropFilter: "blur(2px)" }}>
      <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16, width: 500, maxHeight: "85vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "22px 28px", background: C.surface, borderBottom: `1px solid ${C.cardBorder}`, display: "flex", justifyContent: "space-between" }}>
          <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 700, color: C.ink }}>{policy ? "Edit Policy" : "New Entitlement Policy"}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 18 }}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
          <Field label="Policy name">
            <input value={form.name} onChange={e => set("name", e.target.value)} placeholder={`e.g. Standard ${leaveType.name} (15 days)`} style={inp} />
          </Field>
          <Divider />
          <Checkbox checked={form.hoursAccrual} onChange={() => set("hoursAccrual", !form.hoursAccrual)} label="Use hours worked for accrual (casual staff)" />
          {form.hoursAccrual ? (
            <div style={{ marginTop: 14 }}>
              <Field label="Hours worked per 1 hour of leave">
                <input type="number" value={form.hoursRatio} onChange={e => set("hoursRatio", e.target.value)} style={{ ...inp, width: 120 }} />
              </Field>
            </div>
          ) : (
            <Field label="Default entitlement (days per cycle)">
              <input type="number" value={form.days} onChange={e => set("days", Number(e.target.value))} style={{ ...inp, width: 120 }} min={0} />
            </Field>
          )}
          <Divider />
          <div style={{ marginBottom: 14 }}>
            <Checkbox checked={form.upfront} onChange={() => set("upfront", !form.upfront)} label="Use upfront accrual (all days granted at start of cycle)" />
          </div>
          <div style={{ marginBottom: 14 }}>
            <Checkbox checked={form.carryForward} onChange={() => set("carryForward", !form.carryForward)} label="Allow leave to be carried forward to next cycle" />
          </div>
          {form.carryForward && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 12, padding: 14, background: C.surface, borderRadius: 8, border: `1px solid ${C.cardBorder}` }}>
              <Field label="Carried leave expires after (months)">
                <input type="number" value={form.carryExpiry} onChange={e => set("carryExpiry", e.target.value)} placeholder="Leave blank if never" style={inp} />
              </Field>
              <Field label="Carry-forward limit (days)">
                <input type="number" value={form.carryLimit} onChange={e => set("carryLimit", e.target.value)} placeholder="Leave blank for no limit" style={inp} />
              </Field>
            </div>
          )}
        </div>
        <div style={{ padding: "16px 28px", borderTop: `1px solid ${C.cardBorder}`, background: C.surface, display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn onClick={() => { onSave({ ...form, id: policy?.id || Date.now() }); onClose(); }} disabled={!form.name && !form.days}>Save Policy</Btn>
        </div>
      </div>
    </div>
  );
}

// ─── Leave Setup Tab ──────────────────────────────────────────────────────────
function LeaveSetup({ leaveTypes, setLeaveTypes, policies, setPolicies }) {
  const [expandedType, setExpandedType] = useState(1);
  const [policyModal, setPolicyModal] = useState(null);
  const [editTypeId, setEditTypeId] = useState(null);
  const [editTypeForm, setEditTypeForm] = useState({});

  const typePolicies = (typeId) => policies.filter(p => p.leaveTypeId === typeId);

  return (
    <div style={{ padding: "28px 32px", overflowY: "auto", flex: 1 }}>
      <SectionHeader title="Leave Types & Entitlement Policies" action={
        <Btn variant="ghost" style={{ fontSize: 12, padding: "7px 14px" }} onClick={() => setLeaveTypes(prev => [...prev, { id: Date.now(), name: "Custom Leave", cycleLength: 12, cycleStart: "Appointment Date", unpaid: false, showOnPayslip: false, minBalance: false }])}>
          <i className="ti ti-plus" aria-hidden="true" /> Add Leave Type
        </Btn>
      } />

      {leaveTypes.map(lt => {
        const col = LEAVE_TYPE_COLORS[lt.name] || { bg: C.surface, text: C.muted, dot: C.sageMid };
        const isExpanded = expandedType === lt.id;
        const isEditing = editTypeId === lt.id;
        return (
          <div key={lt.id} style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, marginBottom: 12, overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", background: C.surface, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => setExpandedType(isExpanded ? null : lt.id)}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: col.dot, flexShrink: 0 }} />
              <span style={{ fontFamily: FONT_DISPLAY, fontSize: 14, fontWeight: 700, color: C.ink, flex: 1 }}>{lt.name}</span>
              <Badge color={col.text} bg={col.bg}>{lt.cycleLength} month cycle</Badge>
              {lt.unpaid && <Badge color={C.warning} bg={C.warningBg}>Unpaid</Badge>}
              <div style={{ display: "flex", gap: 4 }} onClick={e => e.stopPropagation()}>
                <button onClick={() => { setEditTypeId(lt.id); setEditTypeForm({ ...lt }); }} style={{ background: "none", border: "none", color: C.sageMid, cursor: "pointer", padding: "4px 8px", fontSize: 13 }}>
                  <i className="ti ti-edit" aria-hidden="true" />
                </button>
              </div>
              <span style={{ color: C.sageMid, fontSize: 14 }}>{isExpanded ? "▲" : "▼"}</span>
            </div>

            {isExpanded && (
              <div style={{ padding: "16px 20px" }}>
                {isEditing ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                    <Field label="Cycle length (months)">
                      <input type="number" value={editTypeForm.cycleLength} onChange={e => setEditTypeForm(p => ({ ...p, cycleLength: Number(e.target.value) }))} style={{ ...inp, width: "100%" }} />
                    </Field>
                    <Field label="Cycle start date">
                      <select value={editTypeForm.cycleStart} onChange={e => setEditTypeForm(p => ({ ...p, cycleStart: e.target.value }))} style={sel}>
                        <option>Appointment Date</option>
                        <option>January 1</option>
                        <option>March 1 (Tax Year)</option>
                      </select>
                    </Field>
                    <div style={{ gridColumn: "span 2", display: "flex", gap: 16 }}>
                      <Checkbox checked={editTypeForm.unpaid} onChange={() => setEditTypeForm(p => ({ ...p, unpaid: !p.unpaid }))} label="Unpaid leave" />
                      <Checkbox checked={editTypeForm.showOnPayslip} onChange={() => setEditTypeForm(p => ({ ...p, showOnPayslip: !p.showOnPayslip }))} label="Show balance on payslip" />
                      <Checkbox checked={editTypeForm.minBalance} onChange={() => setEditTypeForm(p => ({ ...p, minBalance: !p.minBalance }))} label="Set minimum balance rule" />
                    </div>
                    <div style={{ gridColumn: "span 2", display: "flex", gap: 10 }}>
                      <Btn onClick={() => { setLeaveTypes(prev => prev.map(t => t.id === lt.id ? editTypeForm : t)); setEditTypeId(null); }}>Save</Btn>
                      <Btn variant="ghost" onClick={() => setEditTypeId(null)}>Cancel</Btn>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 20, marginBottom: 16, fontSize: 13, color: C.muted }}>
                    <span>Cycle: {lt.cycleLength} months</span>
                    <span>Start: {lt.cycleStart}</span>
                    <span>Show on payslip: {lt.showOnPayslip ? "Yes" : "No"}</span>
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 12, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Entitlement Policies</span>
                  <Btn variant="ghost" style={{ fontSize: 11, padding: "5px 10px" }} onClick={() => setPolicyModal({ leaveType: lt, policy: null })}>
                    <i className="ti ti-plus" aria-hidden="true" /> Create Policy
                  </Btn>
                </div>
                {typePolicies(lt.id).length === 0 ? (
                  <div style={{ padding: "16px", textAlign: "center", color: C.sageMid, fontSize: 12, background: C.surface, borderRadius: 8 }}>No policies yet. The system default will apply.</div>
                ) : (
                  typePolicies(lt.id).map(pol => (
                    <div key={pol.id} style={{ display: "flex", alignItems: "center", padding: "10px 14px", background: C.surface, borderRadius: 8, marginBottom: 6, border: `1px solid ${C.cardBorder}` }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: C.ink, flex: 1 }}>{pol.name}</span>
                      <span style={{ fontSize: 12, color: C.muted, marginRight: 16 }}>{pol.days} days · {pol.upfront ? "Upfront" : "Progressive"} · {pol.carryForward ? "Carry-forward ✓" : "No carry-forward"}</span>
                      <button onClick={() => setPolicyModal({ leaveType: lt, policy: pol })} style={{ background: "none", border: "none", color: C.sageMid, cursor: "pointer", fontSize: 13 }}>
                        <i className="ti ti-edit" aria-hidden="true" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        );
      })}

      {policyModal && (
        <PolicyModal
          leaveType={policyModal.leaveType}
          policy={policyModal.policy}
          onClose={() => setPolicyModal(null)}
          onSave={(pol) => {
            if (policyModal.policy) setPolicies(prev => prev.map(p => p.id === pol.id ? pol : p));
            else setPolicies(prev => [...prev, pol]);
          }}
        />
      )}
    </div>
  );
}

// ─── Leave Processing Tab ──────────────────────────────────────────────────────
function LeaveProcessing({ leaveTypes, records, setRecords, adjustments, setAdjustments, employees }) {
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [activityEmp, setActivityEmp] = useState(null);

  if (activityEmp) {
    return (
      <LeaveActivity
        employee={activityEmp}
        leaveTypes={leaveTypes}
        records={records}
        adjustments={adjustments}
        onBack={() => setActivityEmp(null)}
        onAddAdjustment={(adj) => setAdjustments(prev => [...prev, adj])}
      />
    );
  }

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
      <SectionHeader title="Employee Leave Balances" action={
        <Btn onClick={() => setShowRecordModal(true)}>
          <i className="ti ti-plus" aria-hidden="true" /> Record Leave
        </Btn>
      } />

      <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, overflow: "hidden", marginBottom: 28 }}>
        <div style={{ display: "grid", gridTemplateColumns: `200px repeat(${leaveTypes.length}, 1fr) 80px`, padding: "10px 20px", borderBottom: `1px solid ${C.cardBorder}`, background: C.surface }}>
          <span style={{ fontSize: 11, color: C.sageMid, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>Employee</span>
          {leaveTypes.map(lt => {
            const col = LEAVE_TYPE_COLORS[lt.name] || { dot: C.sageMid };
            return (
              <div key={lt.id} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: col.dot }} />
                <span style={{ fontSize: 11, color: C.sageMid, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{lt.name}</span>
              </div>
            );
          })}
          <span style={{ fontSize: 11, color: C.sageMid, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}></span>
        </div>
        {employees.map((emp, i) => {
          const av = getAvatarColor(emp.firstName + emp.lastName);
          return (
            <div key={emp.id} style={{ display: "grid", gridTemplateColumns: `200px repeat(${leaveTypes.length}, 1fr) 80px`, padding: "13px 20px", borderBottom: i < employees.length - 1 ? `1px solid ${C.cardBorder}` : "none", alignItems: "center" }}
              onMouseEnter={ev => ev.currentTarget.style.background = C.surface}
              onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: av.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: av.text }}>{initials(emp.firstName, emp.lastName)}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.ink }}>{emp.lastName}, {emp.firstName}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{emp.payPoint}</div>
                </div>
              </div>
              {leaveTypes.map(lt => {
                const balance = calcBalance(emp.id, lt.id, records, adjustments);
                const col = LEAVE_TYPE_COLORS[lt.name] || { text: C.muted };
                return (
                  <div key={lt.id} style={{ fontSize: 14, fontWeight: 600, color: balance < 2 ? C.danger : col.text || C.ink }}>
                    {balance} <span style={{ fontSize: 11, fontWeight: 400, color: C.muted }}>days</span>
                  </div>
                );
              })}
              <button onClick={() => setActivityEmp(emp)} style={{ background: "none", border: `1px solid ${C.cardBorder}`, borderRadius: 6, padding: "5px 10px", cursor: "pointer", color: C.muted, fontSize: 12, fontFamily: FONT_BODY }}>
                View <i className="ti ti-arrow-right" aria-hidden="true" style={{ fontSize: 11 }} />
              </button>
            </div>
          );
        })}
      </div>

      {showRecordModal && (
        <RecordLeaveModal
          employees={employees}
          leaveTypes={leaveTypes}
          onClose={() => setShowRecordModal(false)}
          onSave={(rec) => setRecords(prev => [...prev, rec])}
        />
      )}
    </div>
  );
}

// ─── Main Leave Component ─────────────────────────────────────────────────────
export default function Leave() {
  const [tab, setTab] = useState("processing");
  const [leaveTypes, setLeaveTypes] = useState(INITIAL_LEAVE_TYPES);
  const [policies, setPolicies] = useState(INITIAL_POLICIES);
  const [records, setRecords] = useState(INITIAL_RECORDS);
  const [adjustments, setAdjustments] = useState(INITIAL_ADJUSTMENTS);

  const tabs = [
    { id: "processing", label: "Processing", icon: "ti-calendar-event" },
    { id: "overview", label: "Overview Calendar", icon: "ti-layout-grid" },
    { id: "setup", label: "Leave Setup", icon: "ti-settings" },
  ];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", ...DOTS_BG }}>
      <div style={{ padding: "0 32px", borderBottom: `1px solid ${C.cardBorder}`, background: "rgba(245,242,234,0.9)", display: "flex", gap: 4, flexShrink: 0 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "14px 18px", border: "none", background: "none", borderBottom: tab === t.id ? `2px solid ${C.olive}` : "2px solid transparent", color: tab === t.id ? C.olive : C.muted, cursor: "pointer", fontSize: 13, fontWeight: tab === t.id ? 600 : 400, fontFamily: FONT_BODY, transition: "color 0.15s" }}>
            <i className={`ti ${t.icon}`} aria-hidden="true" style={{ fontSize: 15 }} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "processing" && (
        <LeaveProcessing
          leaveTypes={leaveTypes}
          records={records}
          setRecords={setRecords}
          adjustments={adjustments}
          setAdjustments={setAdjustments}
          employees={EMPLOYEES}
        />
      )}

      {tab === "overview" && (
        <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
          <SectionHeader title="Leave Overview Calendar" />
          <LeaveOverviewCalendar records={records} leaveTypes={leaveTypes} employees={EMPLOYEES} />
        </div>
      )}

      {tab === "setup" && (
        <LeaveSetup leaveTypes={leaveTypes} setLeaveTypes={setLeaveTypes} policies={policies} setPolicies={setPolicies} />
      )}
    </div>
  );
}