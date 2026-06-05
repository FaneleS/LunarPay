import { useState } from "react";

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
  warning: "#7A5C1E",
  warningBg: "#FDF3E3",
};

const FONT_DISPLAY = "'Syne', sans-serif";
const FONT_BODY = "'DM Sans', sans-serif";
const DOTS_BG = {
  backgroundImage: `radial-gradient(circle, rgba(101,109,74,0.07) 1px, transparent 1px)`,
  backgroundSize: "16px 16px",
  backgroundColor: C.pageBg,
};

// ─── Sample Data ──────────────────────────────────────────────────────────────
const SAMPLE_EMPLOYEES = [
  { id: "0001", firstName: "Jane", lastName: "Brown", payFrequency: "Monthly", payPoint: "Finance", basicSalary: 28000, status: "Active" },
  { id: "0002", firstName: "John", lastName: "Smith", payFrequency: "Monthly", payPoint: "Operations", basicSalary: 35000, status: "Active" },
  { id: "0003", firstName: "Paige", lastName: "Turner", payFrequency: "Monthly", payPoint: "Marketing", basicSalary: 22000, status: "Active" },
  { id: "0004", firstName: "Gail", lastName: "Forcewind", payFrequency: "Weekly", payPoint: "Human Resources", basicSalary: 18000, status: "Active" },
  { id: "0005", firstName: "Walter", lastName: "Melon", payFrequency: "Weekly", payPoint: "Operations", basicSalary: 14000, status: "Active" },
  { id: "0006", firstName: "Celeste", lastName: "Fankomo", payFrequency: "Monthly", payPoint: "Operations", basicSalary: 26000, status: "Active" },
];

const TAX_RATE = 0.18;
const UIF_RATE = 0.01;

const calcNett = (gross) => {
  const tax = gross * TAX_RATE;
  const uif = Math.min(gross * UIF_RATE, 177.12);
  return { gross, tax: Math.round(tax), uif: Math.round(uif), nett: Math.round(gross - tax - uif) };
};

const INITIAL_PAYSLIPS = SAMPLE_EMPLOYEES.map(e => ({
  empId: e.id,
  period: "2025-05-31",
  status: "Pending",
  inputs: [{ id: 1, type: "Income", name: "Basic Salary", amount: e.basicSalary, isRegular: true }],
  notes: [],
  ...calcNett(e.basicSalary),
}));

const INITIAL_PAY_RUNS = [
  {
    id: "PR-001",
    period: "2025-04-30",
    label: "Monthly — April 2025",
    frequency: "Monthly",
    payslipCount: 4,
    totalNett: 89420,
    status: "Completed",
    createdAt: "2025-04-30",
  },
];

const INCOME_TYPES = ["Basic Salary", "Commission", "Overtime", "Annual Bonus", "Extra Pay", "Travel Allowance", "Housing Allowance", "Sunday Pay", "Public Holiday Pay"];
const DEDUCTION_TYPES = ["Loan Repayment", "Savings", "Medical Aid", "Pension Fund", "Union Fees"];

const fmt = (n) => `R ${Number(n).toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const initials = (f, l) => `${f[0]}${l[0]}`.toUpperCase();

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

// ─── Primitives ───────────────────────────────────────────────────────────────
const Badge = ({ children, color, bg }) => (
  <span style={{ background: bg, color, fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 20, whiteSpace: "nowrap", fontFamily: FONT_BODY }}>{children}</span>
);

const Btn = ({ children, onClick, variant = "primary", style: s = {}, disabled }) => {
  const base = { fontFamily: FONT_BODY, fontWeight: 500, fontSize: 13, borderRadius: 8, padding: "9px 18px", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, border: "none", transition: "opacity 0.15s", display: "inline-flex", alignItems: "center", gap: 6 };
  const variants = {
    primary: { background: C.olive, color: "#F5F2EA" },
    ghost: { background: "transparent", color: C.muted, border: `1px solid ${C.cardBorder}` },
    accent: { background: C.wheat, color: C.ink, fontWeight: 600 },
    danger: { background: "transparent", color: C.danger, border: `1px solid rgba(139,58,30,0.3)` },
    success: { background: C.activeBg, color: C.active, border: `1px solid rgba(45,107,69,0.2)` },
  };
  return <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant], ...s }}>{children}</button>;
};

const Divider = () => <div style={{ height: 1, background: C.cardBorder, margin: "16px 0" }} />;

const StatCard = ({ label, value, sub, color }) => (
  <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 10, padding: "16px 18px" }}>
    <div style={{ fontSize: 11, color: C.sageMid, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 500, marginBottom: 6 }}>{label}</div>
    <div style={{ fontSize: 22, fontWeight: 700, fontFamily: FONT_DISPLAY, color: color || C.ink }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>{sub}</div>}
  </div>
);

// ─── Payslip Detail ───────────────────────────────────────────────────────────
function PayslipDetail({ employee, payslip, onBack, onUpdate }) {
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [showAddDeduction, setShowAddDeduction] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", amount: "", isRegular: false });
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteItem, setNoteItem] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [confirmFinalise, setConfirmFinalise] = useState(false);

  const av = getAvatarColor(employee.firstName + employee.lastName);
  const incomes = payslip.inputs.filter(i => i.type === "Income");
  const deductions = payslip.inputs.filter(i => i.type === "Deduction");
  const totalIncome = incomes.reduce((s, i) => s + Number(i.amount), 0);
  const totalDeductions = deductions.reduce((s, i) => s + Number(i.amount), 0);
  const { tax, uif } = calcNett(totalIncome);
  const nett = Math.round(totalIncome - totalDeductions - tax - uif);

  const addItem = (type) => {
    if (!newItem.name || !newItem.amount) return;
    const updated = {
      ...payslip,
      inputs: [...payslip.inputs, { id: Date.now(), type, name: newItem.name, amount: Number(newItem.amount), isRegular: newItem.isRegular }],
    };
    onUpdate(updated);
    setNewItem({ name: "", amount: "", isRegular: false });
    setShowAddIncome(false);
    setShowAddDeduction(false);
  };

  const removeItem = (id) => {
    onUpdate({ ...payslip, inputs: payslip.inputs.filter(i => i.id !== id) });
  };

  const toggleFinalise = () => {
    onUpdate({ ...payslip, status: payslip.status === "Finalised" ? "Pending" : "Finalised", nett, gross: totalIncome });
    setConfirmFinalise(false);
  };

  const saveNote = () => {
    const updated = { ...payslip, notes: [...(payslip.notes || []), { itemId: noteItem.id, itemName: noteItem.name, text: noteText }] };
    onUpdate(updated);
    setShowNoteModal(false);
    setNoteText("");
    setNoteItem(null);
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 13, marginBottom: 20, display: "flex", alignItems: "center", gap: 6, fontFamily: FONT_BODY, padding: 0 }}>
        ← Back to Pay Runs
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>

        {/* Left — Inputs */}
        <div>
          {/* Employee header */}
          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 14, padding: "20px 24px", marginBottom: 16, display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: av.bg, border: `2px solid ${C.cardBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: av.text, fontFamily: FONT_DISPLAY }}>
              {initials(employee.firstName, employee.lastName)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 700, color: C.ink }}>{employee.lastName}, {employee.firstName}</div>
              <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>Period ending {payslip.period} · {employee.payFrequency} · {employee.payPoint}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {payslip.status === "Finalised"
                ? <Badge color={C.active} bg={C.activeBg}>Finalised</Badge>
                : <Badge color={C.warning} bg={C.warningBg}>Pending</Badge>}
            </div>
          </div>

          {/* Income */}
          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, marginBottom: 16, overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", background: C.surface, borderBottom: `1px solid ${C.cardBorder}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>Income</span>
              {payslip.status !== "Finalised" && (
                <Btn variant="ghost" style={{ padding: "5px 12px", fontSize: 12 }} onClick={() => { setShowAddIncome(true); setShowAddDeduction(false); }}>
                  <i className="ti ti-plus" aria-hidden="true" style={{ fontSize: 13 }} /> Add
                </Btn>
              )}
            </div>
            {incomes.map(item => (
              <div key={item.id} style={{ display: "flex", alignItems: "center", padding: "12px 20px", borderBottom: `1px solid ${C.cardBorder}` }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: C.ink }}>{item.name}
                    {item.isRegular && <span style={{ fontSize: 10, color: C.sageMid, marginLeft: 8, background: C.surface, padding: "1px 6px", borderRadius: 4 }}>Regular</span>}
                  </div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 500, color: C.ink, marginRight: 16 }}>{fmt(item.amount)}</div>
                {payslip.status !== "Finalised" && (
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => { setNoteItem(item); setShowNoteModal(true); }} style={{ background: "none", border: "none", color: C.sageMid, cursor: "pointer", fontSize: 13, padding: 4 }} title="Add note">
                      <i className="ti ti-note" aria-hidden="true" />
                    </button>
                    {!item.isRegular && (
                      <button onClick={() => removeItem(item.id)} style={{ background: "none", border: "none", color: C.danger, cursor: "pointer", fontSize: 13, padding: 4 }} title="Remove">
                        <i className="ti ti-trash" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
            {showAddIncome && (
              <div style={{ padding: "14px 20px", background: C.surface, borderTop: `1px solid ${C.cardBorder}` }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 10, alignItems: "end" }}>
                  <div>
                    <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>Item</label>
                    <select value={newItem.name} onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))} style={{ background: C.card, border: `1px solid ${C.cardBorder}`, color: C.ink, borderRadius: 8, padding: "8px 12px", fontSize: 13, width: "100%", fontFamily: FONT_BODY }}>
                      <option value="">Select income type</option>
                      {INCOME_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>Amount (R)</label>
                    <input type="number" value={newItem.amount} onChange={e => setNewItem(p => ({ ...p, amount: e.target.value }))} placeholder="0.00" style={{ background: C.card, border: `1px solid ${C.cardBorder}`, color: C.ink, borderRadius: 8, padding: "8px 12px", fontSize: 13, width: "100%", fontFamily: FONT_BODY, outline: "none" }} />
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn onClick={() => addItem("Income")} disabled={!newItem.name || !newItem.amount}>Add</Btn>
                    <Btn variant="ghost" onClick={() => setShowAddIncome(false)}>Cancel</Btn>
                  </div>
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, cursor: "pointer", fontSize: 13, color: C.muted }}>
                  <input type="checkbox" checked={newItem.isRegular} onChange={e => setNewItem(p => ({ ...p, isRegular: e.target.checked }))} style={{ width: "auto" }} />
                  Regular input (carries over to next payslip)
                </label>
              </div>
            )}
            <div style={{ padding: "12px 20px", display: "flex", justifyContent: "space-between", background: C.surface }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>Total Income</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>{fmt(totalIncome)}</span>
            </div>
          </div>

          {/* Deductions */}
          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, marginBottom: 16, overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", background: C.surface, borderBottom: `1px solid ${C.cardBorder}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>Deductions</span>
              {payslip.status !== "Finalised" && (
                <Btn variant="ghost" style={{ padding: "5px 12px", fontSize: 12 }} onClick={() => { setShowAddDeduction(true); setShowAddIncome(false); }}>
                  <i className="ti ti-plus" aria-hidden="true" style={{ fontSize: 13 }} /> Add
                </Btn>
              )}
            </div>
            <div style={{ padding: "12px 20px", borderBottom: `1px solid ${C.cardBorder}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, color: C.ink }}>PAYE Tax <span style={{ fontSize: 11, color: C.sageMid }}>(estimated)</span></span>
              <span style={{ fontSize: 14, fontWeight: 500, color: C.ink }}>{fmt(tax)}</span>
            </div>
            <div style={{ padding: "12px 20px", borderBottom: deductions.length > 0 || showAddDeduction ? `1px solid ${C.cardBorder}` : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, color: C.ink }}>UIF — Employee</span>
              <span style={{ fontSize: 14, fontWeight: 500, color: C.ink }}>{fmt(uif)}</span>
            </div>
            {deductions.map(item => (
              <div key={item.id} style={{ display: "flex", alignItems: "center", padding: "12px 20px", borderBottom: `1px solid ${C.cardBorder}` }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: C.ink }}>{item.name}</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 500, color: C.ink, marginRight: 16 }}>{fmt(item.amount)}</div>
                {payslip.status !== "Finalised" && (
                  <button onClick={() => removeItem(item.id)} style={{ background: "none", border: "none", color: C.danger, cursor: "pointer", fontSize: 13, padding: 4 }}>
                    <i className="ti ti-trash" aria-hidden="true" />
                  </button>
                )}
              </div>
            ))}
            {showAddDeduction && (
              <div style={{ padding: "14px 20px", background: C.surface, borderTop: `1px solid ${C.cardBorder}` }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 10, alignItems: "end" }}>
                  <div>
                    <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>Item</label>
                    <select value={newItem.name} onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))} style={{ background: C.card, border: `1px solid ${C.cardBorder}`, color: C.ink, borderRadius: 8, padding: "8px 12px", fontSize: 13, width: "100%", fontFamily: FONT_BODY }}>
                      <option value="">Select deduction type</option>
                      {DEDUCTION_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>Amount (R)</label>
                    <input type="number" value={newItem.amount} onChange={e => setNewItem(p => ({ ...p, amount: e.target.value }))} placeholder="0.00" style={{ background: C.card, border: `1px solid ${C.cardBorder}`, color: C.ink, borderRadius: 8, padding: "8px 12px", fontSize: 13, width: "100%", fontFamily: FONT_BODY, outline: "none" }} />
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn onClick={() => addItem("Deduction")} disabled={!newItem.name || !newItem.amount}>Add</Btn>
                    <Btn variant="ghost" onClick={() => setShowAddDeduction(false)}>Cancel</Btn>
                  </div>
                </div>
              </div>
            )}
            <div style={{ padding: "12px 20px", display: "flex", justifyContent: "space-between", background: C.surface }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>Total Deductions</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.danger }}>{fmt(totalDeductions + tax + uif)}</span>
            </div>
          </div>

          {/* Notes */}
          {payslip.notes && payslip.notes.length > 0 && (
            <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: "16px 20px", marginBottom: 16 }}>
              <p style={{ fontSize: 12, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Payslip Notes</p>
              {payslip.notes.map((n, i) => (
                <div key={i} style={{ fontSize: 13, color: C.ink, padding: "8px 0", borderBottom: i < payslip.notes.length - 1 ? `1px solid ${C.cardBorder}` : "none" }}>
                  <span style={{ fontWeight: 500 }}>{i + 1}. {n.itemName}:</span> {n.text}
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: 10 }}>
            {payslip.status === "Finalised"
              ? <Btn variant="ghost" onClick={toggleFinalise}><i className="ti ti-lock-open" aria-hidden="true" /> Unfinalise</Btn>
              : <Btn variant="accent" onClick={() => setConfirmFinalise(true)}><i className="ti ti-check" aria-hidden="true" /> Finalise Payslip</Btn>
            }
          </div>
        </div>

        {/* Right — Payslip Preview */}
        <div style={{ position: "sticky", top: 0 }}>
          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, overflow: "hidden" }}>
            <div style={{ background: C.forest, padding: "16px 20px" }}>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 14, fontWeight: 700, color: "#E8E4D8" }}>LunarPay</div>
              <div style={{ fontSize: 11, color: C.sageMid, marginTop: 1 }}>Payslip Preview</div>
            </div>
            <div style={{ padding: "16px 20px" }}>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{employee.firstName} {employee.lastName}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Period: {payslip.period}</div>
                <div style={{ fontSize: 12, color: C.muted }}>Employee #: {employee.id}</div>
              </div>
              <Divider />
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Income</div>
                {incomes.map(item => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: C.ink, marginBottom: 5 }}>
                    <span>{item.name}{payslip.notes?.find(n => n.itemId === item.id) ? ` (${payslip.notes.findIndex(n => n.itemId === item.id) + 1})` : ""}</span>
                    <span>{fmt(item.amount)}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, color: C.ink, borderTop: `1px solid ${C.cardBorder}`, paddingTop: 6, marginTop: 4 }}>
                  <span>Total</span><span>{fmt(totalIncome)}</span>
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Deductions</div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: C.ink, marginBottom: 5 }}><span>PAYE Tax</span><span>{fmt(tax)}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: C.ink, marginBottom: 5 }}><span>UIF</span><span>{fmt(uif)}</span></div>
                {deductions.map(item => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: C.ink, marginBottom: 5 }}>
                    <span>{item.name}</span><span>{fmt(item.amount)}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, color: C.danger, borderTop: `1px solid ${C.cardBorder}`, paddingTop: 6, marginTop: 4 }}>
                  <span>Total</span><span>{fmt(totalDeductions + tax + uif)}</span>
                </div>
              </div>
              <div style={{ background: C.forest, borderRadius: 8, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#E8E4D8" }}>Nett Pay</span>
                <span style={{ fontSize: 18, fontWeight: 700, fontFamily: FONT_DISPLAY, color: C.wheat }}>{fmt(nett)}</span>
              </div>
              {payslip.notes && payslip.notes.length > 0 && (
                <div style={{ marginTop: 12, borderTop: `1px solid ${C.cardBorder}`, paddingTop: 10 }}>
                  <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginBottom: 6 }}>Notes</div>
                  {payslip.notes.map((n, i) => (
                    <div key={i} style={{ fontSize: 11, color: C.muted, marginBottom: 3 }}>{i + 1}. {n.text}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Finalise */}
      {confirmFinalise && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(51,61,41,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300 }}>
          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 14, padding: 28, width: 420, boxShadow: "0 20px 50px rgba(51,61,41,0.2)" }}>
            <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 700, color: C.ink, marginBottom: 10 }}>Finalise Payslip?</h3>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, marginBottom: 20 }}>Once finalised, this payslip will be locked. You can unfinalise it later if changes are needed. Nett pay: <strong style={{ color: C.ink }}>{fmt(nett)}</strong></p>
            <div style={{ display: "flex", gap: 10 }}>
              <Btn variant="accent" onClick={toggleFinalise}><i className="ti ti-check" aria-hidden="true" /> Confirm Finalise</Btn>
              <Btn variant="ghost" onClick={() => setConfirmFinalise(false)}>Cancel</Btn>
            </div>
          </div>
        </div>
      )}

      {/* Note Modal */}
      {showNoteModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(51,61,41,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300 }}>
          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 14, padding: 28, width: 420 }}>
            <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 700, color: C.ink, marginBottom: 6 }}>Add Note</h3>
            <p style={{ fontSize: 13, color: C.muted, marginBottom: 14 }}>Adding note to: <strong style={{ color: C.ink }}>{noteItem?.name}</strong></p>
            <textarea value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="e.g. 100 units × R20 commission per unit" rows={3} style={{ background: C.surface, border: `1px solid ${C.cardBorder}`, color: C.ink, borderRadius: 8, padding: "10px 13px", fontSize: 13, width: "100%", fontFamily: FONT_BODY, outline: "none", resize: "vertical", marginBottom: 16 }} />
            <div style={{ display: "flex", gap: 10 }}>
              <Btn onClick={saveNote} disabled={!noteText.trim()}>Save Note</Btn>
              <Btn variant="ghost" onClick={() => { setShowNoteModal(false); setNoteText(""); }}>Cancel</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Bulk Finalise ────────────────────────────────────────────────────────────
function BulkFinalise({ employees, payslips, period, onBack, onFinalise }) {
  const [selected, setSelected] = useState([]);
  const pendingPayslips = payslips.filter(p => p.period === period && p.status === "Pending");
  const toggle = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleAll = () => setSelected(selected.length === pendingPayslips.length ? [] : pendingPayslips.map(p => p.empId));

  const handleFinalise = () => {
    onFinalise(selected);
    onBack();
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 13, marginBottom: 20, display: "flex", alignItems: "center", gap: 6, fontFamily: FONT_BODY, padding: 0 }}>
        ← Back to Pay Runs
      </button>
      <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", background: C.surface, borderBottom: `1px solid ${C.cardBorder}` }}>
          <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 700, color: C.ink }}>Bulk Finalisation</h2>
          <p style={{ fontSize: 13, color: C.muted, marginTop: 3 }}>Period ending {period} · {pendingPayslips.length} payslips ready</p>
        </div>
        <div style={{ padding: "14px 24px", background: C.surface, borderBottom: `1px solid ${C.cardBorder}`, display: "flex", alignItems: "center", gap: 12 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: C.muted }}>
            <input type="checkbox" checked={selected.length === pendingPayslips.length} onChange={toggleAll} style={{ width: "auto" }} />
            Select all
          </label>
          <span style={{ fontSize: 13, color: C.sageMid }}>{selected.length} selected</span>
        </div>
        {pendingPayslips.map((ps, i) => {
          const emp = employees.find(e => e.id === ps.empId);
          if (!emp) return null;
          const av = getAvatarColor(emp.firstName + emp.lastName);
          const { nett } = calcNett(ps.inputs.reduce((s, x) => s + x.amount, 0));
          return (
            <div key={ps.empId} onClick={() => toggle(ps.empId)} style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr 1fr", gap: 16, alignItems: "center", padding: "14px 24px", borderBottom: i < pendingPayslips.length - 1 ? `1px solid ${C.cardBorder}` : "none", cursor: "pointer", background: selected.includes(ps.empId) ? "rgba(101,109,74,0.05)" : "transparent", transition: "background 0.12s" }}>
              <input type="checkbox" checked={selected.includes(ps.empId)} onChange={() => {}} style={{ width: "auto", cursor: "pointer" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: av.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: av.text }}>{initials(emp.firstName, emp.lastName)}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: C.ink }}>{emp.lastName}, {emp.firstName}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>{emp.payPoint}</div>
                </div>
              </div>
              <div style={{ fontSize: 13, color: C.muted }}>{emp.payFrequency}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, textAlign: "right" }}>{fmt(nett)}</div>
            </div>
          );
        })}
        <div style={{ padding: "16px 24px", background: C.surface, borderTop: `1px solid ${C.cardBorder}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>
            Total Nett: {fmt(pendingPayslips.filter(p => selected.includes(p.empId)).reduce((s, p) => { const { nett } = calcNett(p.inputs.reduce((x, i) => x + i.amount, 0)); return s + nett; }, 0))}
          </div>
          <Btn variant="accent" onClick={handleFinalise} disabled={selected.length === 0}>
            <i className="ti ti-check" aria-hidden="true" /> Finalise {selected.length} Payslip{selected.length !== 1 ? "s" : ""}
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ─── Pay Run Detail ───────────────────────────────────────────────────────────
function PayRunDetail({ payRun, employees, payslips, onBack, onDelete }) {
  const runPayslips = payslips.filter(p => p.period === payRun.period && p.status === "Finalised");
  const totalNett = runPayslips.reduce((s, p) => { const { nett } = calcNett(p.inputs.reduce((x, i) => x + i.amount, 0)); return s + nett; }, 0);
  const totalGross = runPayslips.reduce((s, p) => s + p.inputs.reduce((x, i) => x + i.amount, 0), 0);
  const payPoints = [...new Set(runPayslips.map(p => employees.find(e => e.id === p.empId)?.payPoint).filter(Boolean))];

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 13, marginBottom: 20, display: "flex", alignItems: "center", gap: 6, fontFamily: FONT_BODY, padding: 0 }}>
        ← Back to Pay Runs
      </button>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 700, color: C.ink }}>{payRun.label}</h2>
          <p style={{ fontSize: 13, color: C.muted, marginTop: 3 }}>{runPayslips.length} payslips · Created {payRun.createdAt}</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="ghost" style={{ fontSize: 12, padding: "7px 14px" }}><i className="ti ti-download" aria-hidden="true" /> EFT Export</Btn>
          <Btn variant="ghost" style={{ fontSize: 12, padding: "7px 14px" }}><i className="ti ti-file-text" aria-hidden="true" /> Accounting Report</Btn>
          <Btn variant="danger" style={{ fontSize: 12, padding: "7px 14px" }} onClick={onDelete}><i className="ti ti-trash" aria-hidden="true" /> Delete Run</Btn>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        <StatCard label="Total Nett Pay" value={fmt(totalNett)} color={C.olive} />
        <StatCard label="Total Gross" value={fmt(totalGross)} />
        <StatCard label="Payslips" value={runPayslips.length} sub={`${payPoints.length} pay point${payPoints.length !== 1 ? "s" : ""}`} />
        <StatCard label="Status" value="Completed" color={C.active} />
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", background: C.surface, borderBottom: `1px solid ${C.cardBorder}` }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>Payslip Summary</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "10px 20px", borderBottom: `1px solid ${C.cardBorder}`, background: C.surface }}>
          {["Employee", "Pay Point", "Gross", "Deductions", "Nett Pay"].map(h => (
            <span key={h} style={{ fontSize: 11, color: C.sageMid, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>{h}</span>
          ))}
        </div>
        {runPayslips.map((ps, i) => {
          const emp = employees.find(e => e.id === ps.empId);
          if (!emp) return null;
          const gross = ps.inputs.reduce((s, x) => s + x.amount, 0);
          const { tax, uif, nett } = calcNett(gross);
          const deductions = ps.inputs.filter(x => x.type === "Deduction").reduce((s, x) => s + x.amount, 0);
          const av = getAvatarColor(emp.firstName + emp.lastName);
          return (
            <div key={ps.empId} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "13px 20px", borderBottom: i < runPayslips.length - 1 ? `1px solid ${C.cardBorder}` : "none", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: av.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: av.text }}>{initials(emp.firstName, emp.lastName)}</div>
                <span style={{ fontSize: 13, fontWeight: 500, color: C.ink }}>{emp.lastName}, {emp.firstName}</span>
              </div>
              <span style={{ fontSize: 13, color: C.muted }}>{emp.payPoint}</span>
              <span style={{ fontSize: 13, color: C.ink }}>{fmt(gross)}</span>
              <span style={{ fontSize: 13, color: C.danger }}>{fmt(deductions + tax + uif)}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{fmt(nett)}</span>
            </div>
          );
        })}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "13px 20px", background: C.surface, borderTop: `1px solid ${C.cardBorder}` }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>Total</span>
          <span />
          <span style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{fmt(totalGross)}</span>
          <span />
          <span style={{ fontSize: 13, fontWeight: 700, color: C.olive }}>{fmt(totalNett)}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main PayRuns Component ───────────────────────────────────────────────────
export default function PayRuns() {
  const [payslips, setPayslips] = useState(INITIAL_PAYSLIPS);
  const [payRuns, setPayRuns] = useState(INITIAL_PAY_RUNS);
  const [view, setView] = useState("list");
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [selectedRun, setSelectedRun] = useState(null);
  const [bulkPeriod, setBulkPeriod] = useState(null);

  const currentPeriod = "2025-05-31";
  const currentLabel = "Monthly — May 2025";

  const currentPayslips = payslips.filter(p => p.period === currentPeriod);
  const finalisedCount = currentPayslips.filter(p => p.status === "Finalised").length;
  const pendingCount = currentPayslips.filter(p => p.status === "Pending").length;
  const totalNett = currentPayslips.filter(p => p.status === "Finalised").reduce((s, p) => { const { nett } = calcNett(p.inputs.reduce((x, i) => x + i.amount, 0)); return s + nett; }, 0);

  const updatePayslip = (updated) => {
    setPayslips(prev => prev.map(p => p.empId === updated.empId && p.period === updated.period ? updated : p));
  };

  const bulkFinalise = (empIds) => {
    setPayslips(prev => prev.map(p =>
      empIds.includes(p.empId) && p.period === currentPeriod
        ? { ...p, status: "Finalised", ...calcNett(p.inputs.reduce((s, i) => s + i.amount, 0)) }
        : p
    ));
  };

  const createPayRun = () => {
    const finalised = payslips.filter(p => p.period === currentPeriod && p.status === "Finalised");
    if (finalised.length === 0) return;
    const nett = finalised.reduce((s, p) => { const { nett } = calcNett(p.inputs.reduce((x, i) => x + i.amount, 0)); return s + nett; }, 0);
    const newRun = {
      id: `PR-${String(payRuns.length + 1).padStart(3, "0")}`,
      period: currentPeriod,
      label: currentLabel,
      frequency: "Monthly",
      payslipCount: finalised.length,
      totalNett: nett,
      status: "Completed",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setPayRuns(prev => [...prev, newRun]);
  };

  const deletePayRun = (id) => {
    setPayRuns(prev => prev.filter(r => r.id !== id));
    setView("list");
    setSelectedRun(null);
  };

  if (view === "payslip" && selectedEmp) {
    const ps = payslips.find(p => p.empId === selectedEmp.id && p.period === currentPeriod);
    return <PayslipDetail employee={selectedEmp} payslip={ps} onBack={() => setView("list")} onUpdate={updatePayslip} />;
  }

  if (view === "bulk") {
    return <BulkFinalise employees={SAMPLE_EMPLOYEES} payslips={payslips} period={currentPeriod} onBack={() => setView("list")} onFinalise={bulkFinalise} />;
  }

  if (view === "rundetail" && selectedRun) {
    return <PayRunDetail payRun={selectedRun} employees={SAMPLE_EMPLOYEES} payslips={payslips} onBack={() => setView("list")} onDelete={() => deletePayRun(selectedRun.id)} />;
  }

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
        <StatCard label="Current Period" value={currentLabel} sub="May 2025" />
        <StatCard label="Finalised" value={finalisedCount} sub={`of ${currentPayslips.length} payslips`} color={C.active} />
        <StatCard label="Pending" value={pendingCount} sub="awaiting finalisation" color={pendingCount > 0 ? C.warning : C.muted} />
        <StatCard label="Total Nett Pay" value={fmt(totalNett)} sub="finalised only" color={C.olive} />
      </div>

      {/* Pending Pay Runs */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 15, fontWeight: 700, color: C.ink }}>Pending Pay Runs</h3>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "18px 24px", borderBottom: `1px solid ${C.cardBorder}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 15, fontWeight: 600, color: C.ink }}>{currentLabel}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>Period ending {currentPeriod}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 700, fontFamily: FONT_DISPLAY, color: C.ink }}>{currentPayslips.length}</div>
                <div style={{ fontSize: 11, color: C.sageMid, textTransform: "uppercase", letterSpacing: "0.06em" }}>Total</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 700, fontFamily: FONT_DISPLAY, color: C.active }}>{finalisedCount}</div>
                <div style={{ fontSize: 11, color: C.sageMid, textTransform: "uppercase", letterSpacing: "0.06em" }}>Finalised</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 700, fontFamily: FONT_DISPLAY, color: C.warning }}>{pendingCount}</div>
                <div style={{ fontSize: 11, color: C.sageMid, textTransform: "uppercase", letterSpacing: "0.06em" }}>Pending</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn variant="ghost" style={{ fontSize: 12, padding: "7px 14px" }} onClick={() => setView("bulk")}>
                  <i className="ti ti-eye" aria-hidden="true" /> Preview
                </Btn>
                <Btn variant="ghost" style={{ fontSize: 12, padding: "7px 14px" }} onClick={() => setView("bulk")}>
                  <i className="ti ti-check" aria-hidden="true" /> Finalise
                </Btn>
                {finalisedCount > 0 && !payRuns.find(r => r.period === currentPeriod) && (
                  <Btn variant="accent" style={{ fontSize: 12, padding: "7px 14px" }} onClick={createPayRun}>
                    <i className="ti ti-player-play" aria-hidden="true" /> Create Pay Run
                  </Btn>
                )}
              </div>
            </div>
          </div>

          {/* Individual payslip rows */}
          <div style={{ padding: "12px 24px 4px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "8px 0", borderBottom: `1px solid ${C.cardBorder}`, marginBottom: 4 }}>
              {["Employee", "Pay Point", "Gross", "Nett Pay", "Status"].map(h => (
                <span key={h} style={{ fontSize: 11, color: C.sageMid, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>{h}</span>
              ))}
            </div>
            {currentPayslips.map((ps, i) => {
              const emp = SAMPLE_EMPLOYEES.find(e => e.id === ps.empId);
              if (!emp) return null;
              const gross = ps.inputs.reduce((s, x) => s + x.amount, 0);
              const { nett } = calcNett(gross);
              const av = getAvatarColor(emp.firstName + emp.lastName);
              return (
                <div key={ps.empId}
                  onClick={() => { setSelectedEmp(emp); setView("payslip"); }}
                  style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "11px 0", borderBottom: i < currentPayslips.length - 1 ? `1px solid ${C.cardBorder}` : "none", cursor: "pointer", alignItems: "center", transition: "background 0.1s", borderRadius: 6 }}
                  onMouseEnter={ev => ev.currentTarget.style.background = C.surface}
                  onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: av.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: av.text }}>{initials(emp.firstName, emp.lastName)}</div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: C.ink }}>{emp.lastName}, {emp.firstName}</span>
                  </div>
                  <span style={{ fontSize: 13, color: C.muted }}>{emp.payPoint}</span>
                  <span style={{ fontSize: 13, color: C.ink }}>{fmt(gross)}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{fmt(nett)}</span>
                  <div>
                    {ps.status === "Finalised"
                      ? <Badge color={C.active} bg={C.activeBg}>Finalised</Badge>
                      : <Badge color={C.warning} bg={C.warningBg}>Pending</Badge>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Completed Pay Runs */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 15, fontWeight: 700, color: C.ink }}>Completed Pay Runs</h3>
        </div>
        {payRuns.length === 0 ? (
          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: "40px 24px", textAlign: "center", color: C.sageMid, fontSize: 13 }}>
            No completed pay runs yet. Finalise payslips and create a pay run above.
          </div>
        ) : (
          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "10px 24px", borderBottom: `1px solid ${C.cardBorder}`, background: C.surface }}>
              {["Pay Run", "Frequency", "Payslips", "Total Nett", ""].map((h, i) => (
                <span key={i} style={{ fontSize: 11, color: C.sageMid, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>{h}</span>
              ))}
            </div>
            {payRuns.map((run, i) => (
              <div key={run.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "14px 24px", borderBottom: i < payRuns.length - 1 ? `1px solid ${C.cardBorder}` : "none", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: C.ink }}>{run.label}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Created {run.createdAt}</div>
                </div>
                <span style={{ fontSize: 13, color: C.muted }}>{run.frequency}</span>
                <span style={{ fontSize: 13, color: C.ink }}>{run.payslipCount}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: C.olive }}>{fmt(run.totalNett)}</span>
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  <Btn variant="ghost" style={{ fontSize: 12, padding: "6px 12px" }} onClick={() => { setSelectedRun(run); setView("rundetail"); }}>
                    View <i className="ti ti-arrow-right" aria-hidden="true" />
                  </Btn>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}