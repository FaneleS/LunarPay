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

const fmt = (n) => `R ${Number(n).toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const EMPLOYEES = [
  { id: "0001", firstName: "Jane", lastName: "Brown", payFrequency: "Monthly", payPoint: "Finance", status: "Active",
    regularInputs: [{ name: "Basic Salary", amount: 28000, category: "Income", isRegular: true }, { name: "Medical Aid", amount: 1200, category: "Deduction", isRegular: true }] },
  { id: "0002", firstName: "John", lastName: "Smith", payFrequency: "Monthly", payPoint: "Operations", status: "Active",
    regularInputs: [{ name: "Basic Salary", amount: 35000, category: "Income", isRegular: true }, { name: "Pension Fund", amount: 1750, category: "Deduction", isRegular: true }] },
  { id: "0003", firstName: "Paige", lastName: "Turner", payFrequency: "Monthly", payPoint: "Marketing", status: "Active",
    regularInputs: [{ name: "Basic Salary", amount: 22000, category: "Income", isRegular: true }, { name: "Travel Allowance", amount: 1500, category: "Income", isRegular: true }] },
  { id: "0004", firstName: "Gail", lastName: "Forcewind", payFrequency: "Weekly", payPoint: "Human Resources", status: "Active",
    regularInputs: [{ name: "Basic Salary", amount: 18000, category: "Income", isRegular: true }] },
  { id: "0005", firstName: "Walter", lastName: "Melon", payFrequency: "Weekly", payPoint: "Operations", status: "Active",
    regularInputs: [{ name: "Basic Salary", amount: 14000, category: "Income", isRegular: true }] },
  { id: "0006", firstName: "Celeste", lastName: "Fankomo", payFrequency: "Monthly", payPoint: "Operations", status: "Active",
    regularInputs: [{ name: "Basic Salary", amount: 26000, category: "Income", isRegular: true }, { name: "Savings", amount: 500, category: "Deduction", isRegular: true }] },
];

const LEAVE_TYPES = [
  { id: 1, name: "Annual", cycleMonths: 12, carryForward: true, carryLimit: 10, carryExpiry: 6 },
  { id: 2, name: "Sick", cycleMonths: 36, carryForward: false, carryLimit: null, carryExpiry: null },
  { id: 3, name: "Compassionate", cycleMonths: 12, carryForward: false, carryLimit: null, carryExpiry: null },
  { id: 4, name: "Family Responsibility", cycleMonths: 12, carryForward: false, carryLimit: null, carryExpiry: null },
];

const LEAVE_BALANCES = [
  { empId: "0001", typeId: 1, balance: 7.25, cycleStart: "2025-02-01", cycleEnd: "2026-01-31" },
  { empId: "0001", typeId: 2, balance: 28, cycleStart: "2021-02-01", cycleEnd: "2024-01-31" },
  { empId: "0002", typeId: 1, balance: 5.5,  cycleStart: "2025-05-01", cycleEnd: "2026-04-30" },
  { empId: "0002", typeId: 2, balance: 30,   cycleStart: "2020-05-01", cycleEnd: "2023-04-30" },
  { empId: "0003", typeId: 1, balance: 9,    cycleStart: "2026-01-01", cycleEnd: "2026-12-31" },
  { empId: "0003", typeId: 2, balance: 30,   cycleStart: "2022-01-01", cycleEnd: "2024-12-31" },
  { empId: "0004", typeId: 1, balance: 12.75,cycleStart: "2024-08-01", cycleEnd: "2025-07-31" },
  { empId: "0005", typeId: 1, balance: 0.5,  cycleStart: "2024-03-01", cycleEnd: "2025-02-28" },
  { empId: "0006", typeId: 1, balance: 4.25, cycleStart: "2025-03-01", cycleEnd: "2026-02-28" },
];

const PERIODS = [
  { label: "May 2025", end: "2025-05-31", next: { label: "June 2025", start: "2025-06-01", end: "2025-06-30" } },
  { label: "June 2025", end: "2025-06-30", next: { label: "July 2025", start: "2025-07-01", end: "2025-07-31" } },
];

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

// ─── Primitives ───────────────────────────────────────────────────────────────
const Btn = ({ children, onClick, variant = "primary", style: s = {}, disabled }) => {
  const base = { fontFamily: FONT_BODY, fontWeight: 500, fontSize: 13, borderRadius: 8, padding: "9px 18px", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, border: "none", display: "inline-flex", alignItems: "center", gap: 6, transition: "all 0.15s" };
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

const StepIndicator = ({ steps, current }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 28 }}>
    {steps.map((step, i) => (
      <div key={step} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: i < current ? C.olive : i === current ? "rgba(101,109,74,0.15)" : C.surface, border: i === current ? `2px solid ${C.olive}` : i < current ? "none" : `1.5px solid ${C.cardBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: i < current ? "#fff" : i === current ? C.olive : C.sageMid, flexShrink: 0 }}>
            {i < current ? "✓" : i + 1}
          </div>
          <span style={{ fontSize: 13, color: i === current ? C.ink : i < current ? C.olive : C.muted, fontWeight: i === current ? 600 : 400, whiteSpace: "nowrap" }}>{step}</span>
        </div>
        {i < steps.length - 1 && <div style={{ flex: 1, height: 1.5, background: i < current ? C.olive : C.cardBorder, margin: "0 12px", minWidth: 20 }} />}
      </div>
    ))}
  </div>
);

// ─── Period Rollover ──────────────────────────────────────────────────────────
function PeriodRollover() {
  const [step, setStep] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState(PERIODS[0]);
  const [frequency, setFrequency] = useState("Monthly");
  const [previewPayslips, setPreviewPayslips] = useState([]);
  const [rolledOver, setRolledOver] = useState(false);
  const [rolling, setRolling] = useState(false);

  const activeEmps = EMPLOYEES.filter(e => e.status === "Active" && e.payFrequency === frequency);

  const generatePreview = () => {
    const preview = activeEmps.map(emp => {
      const grossIncome = emp.regularInputs.filter(i => i.category === "Income").reduce((s, i) => s + i.amount, 0);
      return {
        empId: emp.id,
        employee: emp,
        period: selectedPeriod.next.label,
        periodStart: selectedPeriod.next.start,
        periodEnd: selectedPeriod.next.end,
        regularInputs: emp.regularInputs,
        grossIncome,
        status: "Draft",
      };
    });
    setPreviewPayslips(preview);
    setStep(1);
  };

  const executeRollover = async () => {
    setRolling(true);
    await new Promise(r => setTimeout(r, 1800));
    setRolling(false);
    setRolledOver(true);
    setStep(2);
  };

  const STEPS = ["Select Period", "Preview Payslips", "Confirm Rollover"];

  if (rolledOver && step === 2) {
    return (
      <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 14, padding: 32, textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.activeBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <i className="ti ti-check" aria-hidden="true" style={{ fontSize: 24, color: C.active }} />
        </div>
        <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 700, color: C.ink, marginBottom: 8 }}>Rollover Complete</h3>
        <p style={{ fontSize: 14, color: C.muted, marginBottom: 4 }}>
          <strong style={{ color: C.ink }}>{previewPayslips.length} payslips</strong> created for <strong style={{ color: C.ink }}>{selectedPeriod.next.label}</strong>
        </p>
        <p style={{ fontSize: 13, color: C.sageMid, marginBottom: 24 }}>Regular inputs have been carried over. Payslips are in Draft status and ready for processing.</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <Btn variant="accent" onClick={() => { setStep(0); setRolledOver(false); setPreviewPayslips([]); }}>
            <i className="ti ti-refresh" aria-hidden="true" /> Roll Over Another Period
          </Btn>
        </div>
      </div>
    );
  }

  return (
    <div>
      <StepIndicator steps={STEPS} current={step} />

      {step === 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: 20 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: C.ink, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>Current Period to Close</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {PERIODS.map(p => (
                <div key={p.label} onClick={() => setSelectedPeriod(p)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${selectedPeriod.label === p.label ? C.olive : C.cardBorder}`, background: selectedPeriod.label === p.label ? "rgba(101,109,74,0.07)" : C.surface, cursor: "pointer", transition: "all 0.12s" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: selectedPeriod.label === p.label ? C.olive : C.cardBorder }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: C.ink }}>{p.label}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>Period ending {p.end}</div>
                  </div>
                  <div style={{ marginLeft: "auto" }}>
                    <Badge color={C.active} bg={C.activeBg}>Finalised</Badge>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <p style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8, fontWeight: 500 }}>Pay Frequency</p>
              <div style={{ display: "flex", gap: 8 }}>
                {["Monthly", "Weekly"].map(f => (
                  <div key={f} onClick={() => setFrequency(f)} style={{ padding: "7px 16px", borderRadius: 8, border: `1px solid ${frequency === f ? C.olive : C.cardBorder}`, background: frequency === f ? "rgba(101,109,74,0.1)" : "transparent", color: frequency === f ? C.olive : C.muted, fontSize: 13, cursor: "pointer", fontWeight: frequency === f ? 500 : 400, transition: "all 0.12s" }}>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: 20 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: C.ink, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>Next Period to Open</p>
            <div style={{ background: C.surface, borderRadius: 10, padding: "14px 16px", marginBottom: 16, border: `1px solid ${C.cardBorder}` }}>
              <div style={{ fontSize: 18, fontWeight: 700, fontFamily: FONT_DISPLAY, color: C.olive, marginBottom: 4 }}>{selectedPeriod.next.label}</div>
              <div style={{ fontSize: 12, color: C.muted }}>{selectedPeriod.next.start} → {selectedPeriod.next.end}</div>
            </div>
            <p style={{ fontSize: 12, fontWeight: 600, color: C.ink, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>What gets carried over</p>
            {[
              ["ti-check", C.active, C.activeBg, "Regular inputs (basic salary, medical aid, etc.)"],
              ["ti-check", C.active, C.activeBg, "Employee payment details"],
              ["ti-check", C.active, C.activeBg, "Leave accruals for new period"],
              ["ti-x", C.danger, C.dangerBg, "Once-off payslip inputs (bonuses, overtime)"],
              ["ti-x", C.danger, C.dangerBg, "Payslip notes from previous period"],
            ].map(([icon, color, bg, label]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <i className={`ti ${icon}`} aria-hidden="true" style={{ fontSize: 11, color }} />
                </div>
                <span style={{ fontSize: 12, color: C.muted }}>{label}</span>
              </div>
            ))}
            <div style={{ marginTop: 16 }}>
              <Btn onClick={generatePreview} disabled={activeEmps.length === 0}>
                Preview {activeEmps.length} Payslip{activeEmps.length !== 1 ? "s" : ""} →
              </Btn>
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <div style={{ background: C.infoBg, border: `1px solid rgba(42,92,138,0.2)`, borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: C.info, display: "flex", alignItems: "center", gap: 8 }}>
            <i className="ti ti-info-circle" aria-hidden="true" />
            Review the payslips that will be created for <strong>{selectedPeriod.next.label}</strong>. Regular inputs have been carried over from {selectedPeriod.label}.
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 2fr 1fr", padding: "10px 20px", background: C.surface, borderBottom: `1px solid ${C.cardBorder}` }}>
              {["Employee", "Period", "Pay Point", "Regular Inputs", "Gross"].map(h => (
                <span key={h} style={{ fontSize: 11, color: C.sageMid, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>{h}</span>
              ))}
            </div>
            {previewPayslips.map((ps, i) => {
              const av = getAvatarColor(ps.employee.firstName + ps.employee.lastName);
              return (
                <div key={ps.empId} style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 2fr 1fr", padding: "13px 20px", borderBottom: i < previewPayslips.length - 1 ? `1px solid ${C.cardBorder}` : "none", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: av.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: av.text }}>{initials(ps.employee.firstName, ps.employee.lastName)}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: C.ink }}>{ps.employee.lastName}, {ps.employee.firstName}</div>
                      <div style={{ fontSize: 11, color: C.muted }}>{ps.employee.payFrequency}</div>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, color: C.ink }}>{ps.period}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{ps.periodStart} → {ps.periodEnd}</div>
                  </div>
                  <span style={{ fontSize: 13, color: C.muted }}>{ps.employee.payPoint}</span>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {ps.regularInputs.map(inp => (
                      <div key={inp.name} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: inp.category === "Income" ? C.active : C.warning, flexShrink: 0 }} />
                        <span style={{ fontSize: 11, color: C.muted }}>{inp.name}: {fmt(inp.amount)}</span>
                      </div>
                    ))}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{fmt(ps.grossIncome)}</span>
                </div>
              );
            })}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 2fr 1fr", padding: "12px 20px", background: C.surface, borderTop: `1px solid ${C.cardBorder}` }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.ink, gridColumn: "span 4" }}>{previewPayslips.length} payslips ready to create</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.olive }}>{fmt(previewPayslips.reduce((s, p) => s + p.grossIncome, 0))}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="ghost" onClick={() => setStep(0)}>← Back</Btn>
            <Btn variant="accent" onClick={() => setStep(2)}>Confirm & Roll Over →</Btn>
          </div>
        </div>
      )}

      {step === 2 && !rolledOver && (
        <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 14, padding: 28 }}>
          <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 700, color: C.ink, marginBottom: 8 }}>Confirm Period Rollover</h3>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 20 }}>
            This will close <strong style={{ color: C.ink }}>{selectedPeriod.label}</strong> and create <strong style={{ color: C.ink }}>{previewPayslips.length} new Draft payslips</strong> for <strong style={{ color: C.ink }}>{selectedPeriod.next.label}</strong>. Regular inputs will be carried over automatically.
          </p>
          <div style={{ background: C.warningBg, border: `1px solid rgba(122,92,30,0.2)`, borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: C.warning, display: "flex", alignItems: "flex-start", gap: 8 }}>
            <i className="ti ti-alert-triangle" aria-hidden="true" style={{ marginTop: 1, flexShrink: 0 }} />
            <span>Make sure all payslips for <strong>{selectedPeriod.label}</strong> are finalised and a pay run has been created before rolling over.</span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="ghost" onClick={() => setStep(1)}>← Back</Btn>
            <Btn variant="accent" onClick={executeRollover} disabled={rolling}>
              {rolling
                ? <><i className="ti ti-loader-2" aria-hidden="true" style={{ animation: "spin 1s linear infinite" }} /> Rolling over…</>
                : <><i className="ti ti-player-play" aria-hidden="true" /> Execute Rollover</>}
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Leave Cycle Rollover ─────────────────────────────────────────────────────
function LeaveCycleRollover() {
  const [selectedType, setSelectedType] = useState(null);
  const [step, setStep] = useState(0);
  const [preview, setPreview] = useState([]);
  const [rolling, setRolling] = useState(false);
  const [done, setDone] = useState(false);

  const STEPS = ["Select Leave Type", "Preview Balances", "Confirm Rollover"];

  const calcCarryForward = (balance, leaveType) => {
    if (!leaveType.carryForward) return 0;
    if (leaveType.carryLimit !== null) return Math.min(balance, leaveType.carryLimit);
    return balance;
  };

  const generatePreview = () => {
    if (!selectedType) return;
    const lt = LEAVE_TYPES.find(t => t.id === selectedType);
    const balances = LEAVE_BALANCES.filter(b => b.typeId === selectedType);
    const prev = EMPLOYEES.map(emp => {
      const bal = balances.find(b => b.empId === emp.id);
      const currentBalance = bal?.balance ?? 0;
      const carryForward = calcCarryForward(currentBalance, lt);
      const forfeited = currentBalance - carryForward;
      const newAccrual = (15 / 12);
      const newOpeningBalance = carryForward + newAccrual;
      return { emp, currentBalance, carryForward, forfeited, newAccrual, newOpeningBalance };
    });
    setPreview(prev);
    setStep(1);
  };

  const executeRollover = async () => {
    setRolling(true);
    await new Promise(r => setTimeout(r, 1600));
    setRolling(false);
    setDone(true);
    setStep(2);
  };

  const lt = LEAVE_TYPES.find(t => t.id === selectedType);

  if (done && step === 2) {
    return (
      <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 14, padding: 32, textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.activeBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <i className="ti ti-check" aria-hidden="true" style={{ fontSize: 24, color: C.active }} />
        </div>
        <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 700, color: C.ink, marginBottom: 8 }}>Leave Cycle Rolled Over</h3>
        <p style={{ fontSize: 14, color: C.muted, marginBottom: 4 }}>
          <strong style={{ color: C.ink }}>{lt?.name} Leave</strong> cycle has been closed and new cycles opened for all employees.
        </p>
        <p style={{ fontSize: 13, color: C.sageMid, marginBottom: 24 }}>Carry-forward balances have been applied according to each employee's entitlement policy.</p>
        <Btn variant="accent" onClick={() => { setStep(0); setDone(false); setPreview([]); setSelectedType(null); }}>
          <i className="ti ti-refresh" aria-hidden="true" /> Roll Over Another Leave Type
        </Btn>
      </div>
    );
  }

  return (
    <div>
      <StepIndicator steps={STEPS} current={step} />

      {step === 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: 20 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: C.ink, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>Select Leave Type</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {LEAVE_TYPES.map(lt => (
                <div key={lt.id} onClick={() => setSelectedType(lt.id)} style={{ padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${selectedType === lt.id ? C.olive : C.cardBorder}`, background: selectedType === lt.id ? "rgba(101,109,74,0.07)" : C.surface, cursor: "pointer", transition: "all 0.12s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: selectedType === lt.id ? C.olive : C.cardBorder }} />
                    <span style={{ fontSize: 14, fontWeight: 500, color: selectedType === lt.id ? C.olive : C.ink }}>{lt.name} Leave</span>
                  </div>
                  <div style={{ paddingLeft: 16, fontSize: 11, color: C.muted }}>
                    {lt.cycleMonths} month cycle · {lt.carryForward ? `Carry forward up to ${lt.carryLimit ?? "unlimited"} days` : "No carry forward"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedType && (
            <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: 20 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: C.ink, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>Rollover Rules</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  ["Cycle length", `${lt.cycleMonths} months`],
                  ["Carry forward", lt.carryForward ? "Yes" : "No — balance expires"],
                  ["Carry-forward limit", lt.carryLimit !== null ? `${lt.carryLimit} days max` : "No limit"],
                  ["Carry-forward expiry", lt.carryExpiry !== null ? `${lt.carryExpiry} months` : "Never expires"],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.cardBorder}` }}>
                    <span style={{ fontSize: 13, color: C.muted }}>{label}</span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: C.ink }}>{value}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16 }}>
                <Btn onClick={generatePreview}>Preview Rollover →</Btn>
              </div>
            </div>
          )}
        </div>
      )}

      {step === 1 && (
        <div>
          <div style={{ background: C.infoBg, border: `1px solid rgba(42,92,138,0.2)`, borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: C.info, display: "flex", alignItems: "center", gap: 8 }}>
            <i className="ti ti-info-circle" aria-hidden="true" />
            Showing how <strong>{lt?.name} Leave</strong> balances will roll over. Forfeited days will be lost.
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr", padding: "10px 20px", background: C.surface, borderBottom: `1px solid ${C.cardBorder}` }}>
              {["Employee", "Current Balance", "Carry Forward", "Forfeited", "New Accrual", "Opening Balance"].map(h => (
                <span key={h} style={{ fontSize: 10, color: C.sageMid, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{h}</span>
              ))}
            </div>
            {preview.map((row, i) => {
              const av = getAvatarColor(row.emp.firstName + row.emp.lastName);
              return (
                <div key={row.emp.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr", padding: "13px 20px", borderBottom: i < preview.length - 1 ? `1px solid ${C.cardBorder}` : "none", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: av.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: av.text }}>{initials(row.emp.firstName, row.emp.lastName)}</div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: C.ink }}>{row.emp.lastName}, {row.emp.firstName}</span>
                  </div>
                  <span style={{ fontSize: 13, color: C.ink, fontWeight: 500 }}>{row.currentBalance}</span>
                  <span style={{ fontSize: 13, color: C.active, fontWeight: 500 }}>{row.carryForward}</span>
                  <span style={{ fontSize: 13, color: row.forfeited > 0 ? C.danger : C.sageMid, fontWeight: row.forfeited > 0 ? 600 : 400 }}>{row.forfeited > 0 ? `-${row.forfeited}` : "—"}</span>
                  <span style={{ fontSize: 13, color: C.info }}>{row.newAccrual.toFixed(2)}</span>
                  <span style={{ fontSize: 13, color: C.olive, fontWeight: 700 }}>{row.newOpeningBalance.toFixed(2)}</span>
                </div>
              );
            })}
          </div>
          {preview.some(r => r.forfeited > 0) && (
            <div style={{ background: C.dangerBg, border: `1px solid rgba(139,58,30,0.2)`, borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: C.danger, display: "flex", alignItems: "center", gap: 8 }}>
              <i className="ti ti-alert-triangle" aria-hidden="true" />
              {preview.filter(r => r.forfeited > 0).length} employee{preview.filter(r => r.forfeited > 0).length !== 1 ? "s" : ""} will forfeit leave days due to carry-forward limits.
            </div>
          )}
          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="ghost" onClick={() => setStep(0)}>← Back</Btn>
            <Btn variant="accent" onClick={() => setStep(2)}>Confirm Rollover →</Btn>
          </div>
        </div>
      )}

      {step === 2 && !done && (
        <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 14, padding: 28 }}>
          <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 700, color: C.ink, marginBottom: 8 }}>Confirm Leave Cycle Rollover</h3>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 20 }}>
            This will close the current <strong style={{ color: C.ink }}>{lt?.name} Leave</strong> cycle and open new cycles for all <strong style={{ color: C.ink }}>{EMPLOYEES.length} employees</strong>. Carry-forward balances will be applied and forfeited days removed.
          </p>
          <div style={{ background: C.warningBg, border: `1px solid rgba(122,92,30,0.2)`, borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: C.warning, display: "flex", alignItems: "flex-start", gap: 8 }}>
            <i className="ti ti-alert-triangle" aria-hidden="true" style={{ marginTop: 1, flexShrink: 0 }} />
            <span>This action cannot be undone. Forfeited leave balances will be permanently removed.</span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="ghost" onClick={() => setStep(1)}>← Back</Btn>
            <Btn variant="danger" onClick={executeRollover} disabled={rolling}>
              {rolling
                ? <><i className="ti ti-loader-2" aria-hidden="true" style={{ animation: "spin 1s linear infinite" }} /> Processing…</>
                : <><i className="ti ti-player-play" aria-hidden="true" /> Execute Leave Rollover</>}
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Rollover Component ──────────────────────────────────────────────────
export default function Rollover() {
  const [tab, setTab] = useState("period");

  const tabs = [
    { id: "period", label: "Period Rollover", icon: "ti-calendar-plus", desc: "Close current period and open next month's payslips" },
    { id: "leave", label: "Leave Cycle Rollover", icon: "ti-refresh", desc: "Close leave cycles and apply carry-forward balances" },
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
      <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
        {tab === "period" && <PeriodRollover />}
        {tab === "leave" && <LeaveCycleRollover />}
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}