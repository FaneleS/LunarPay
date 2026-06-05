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

const inp = { background: C.card, border: `1px solid ${C.cardBorder}`, color: C.ink, borderRadius: 8, padding: "9px 13px", fontSize: 13, width: "100%", fontFamily: FONT_BODY, outline: "none" };
const sel = { ...inp };

const fmt = (n) => `R ${Number(n).toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const EMPLOYEES = [
  { id: "0001", firstName: "Jane", lastName: "Brown", payPoint: "Finance", payFrequency: "Monthly", status: "Active", dob: "1988-04-12", idNumber: "8804120123456", email: "jane.brown@demo.co.za", bank: "ABSA", accountNumber: "****4521", taxNumber: "1234567890", dateOfAppointment: "2021-02-01", jobTitle: "Accountant", gender: "Female" },
  { id: "0002", firstName: "John", lastName: "Smith", payPoint: "Operations", payFrequency: "Monthly", status: "Active", dob: "1985-09-23", idNumber: "8509230123456", email: "john.smith@demo.co.za", bank: "FNB", accountNumber: "****8832", taxNumber: "9876543210", dateOfAppointment: "2020-05-15", jobTitle: "Operations Manager", gender: "Male" },
  { id: "0003", firstName: "Paige", lastName: "Turner", payPoint: "Marketing", payFrequency: "Monthly", status: "Active", dob: "1993-01-07", idNumber: "9301070123456", email: "paige.turner@demo.co.za", bank: "Standard Bank", accountNumber: "****2291", taxNumber: "1122334455", dateOfAppointment: "2022-01-10", jobTitle: "Marketing Lead", gender: "Female" },
  { id: "0004", firstName: "Gail", lastName: "Forcewind", payPoint: "Human Resources", payFrequency: "Weekly", status: "Active", dob: "1991-06-30", idNumber: "9106300123456", email: "gail.f@demo.co.za", bank: "Nedbank", accountNumber: "****6610", taxNumber: "5544332211", dateOfAppointment: "2019-08-20", jobTitle: "HR Specialist", gender: "Female" },
  { id: "0005", firstName: "Walter", lastName: "Melon", payPoint: "Operations", payFrequency: "Weekly", status: "Inactive", dob: "1979-11-15", idNumber: "7911150123456", email: "w.melon@demo.co.za", bank: "Capitec", accountNumber: "****9923", taxNumber: "6677889900", dateOfAppointment: "2018-03-01", jobTitle: "Driver", gender: "Male" },
  { id: "0006", firstName: "Celeste", lastName: "Fankomo", payPoint: "Operations", payFrequency: "Monthly", status: "Active", dob: "1995-08-22", idNumber: "9508220123456", email: "c.fankomo@demo.co.za", bank: "Capitec", accountNumber: "****3341", taxNumber: "1029384756", dateOfAppointment: "2023-03-01", jobTitle: "Project Coordinator", gender: "Female" },
];

const PAYSLIP_DATA = [
  { empId: "0001", period: "2025-05-31", basicSalary: 28000, commission: 2000, tax: 5400, uif: 177, nett: 24423 },
  { empId: "0002", period: "2025-05-31", basicSalary: 35000, commission: 0, tax: 7200, uif: 177, nett: 27623 },
  { empId: "0003", period: "2025-05-31", basicSalary: 22000, commission: 1500, tax: 4230, uif: 177, nett: 19093 },
  { empId: "0004", period: "2025-05-31", basicSalary: 18000, commission: 0, tax: 3060, uif: 177, nett: 14763 },
  { empId: "0005", period: "2025-05-31", basicSalary: 14000, commission: 0, tax: 2100, uif: 140, nett: 11760 },
  { empId: "0006", period: "2025-05-31", basicSalary: 26000, commission: 0, tax: 4940, uif: 177, nett: 20883 },
  { empId: "0001", period: "2025-04-30", basicSalary: 28000, commission: 0, tax: 5040, uif: 177, nett: 22783 },
  { empId: "0002", period: "2025-04-30", basicSalary: 35000, commission: 0, tax: 7200, uif: 177, nett: 27623 },
  { empId: "0003", period: "2025-04-30", basicSalary: 22000, commission: 0, tax: 3960, uif: 177, nett: 17863 },
  { empId: "0004", period: "2025-04-30", basicSalary: 18000, commission: 0, tax: 3060, uif: 177, nett: 14763 },
];

const LEAVE_BALANCES = [
  { empId: "0001", annual: 7.25, sick: 28, compassionate: 3, familyResp: 3 },
  { empId: "0002", annual: 5.50, sick: 30, compassionate: 2, familyResp: 3 },
  { empId: "0003", annual: 9.00, sick: 30, compassionate: 3, familyResp: 3 },
  { empId: "0004", annual: 12.75, sick: 27, compassionate: 3, familyResp: 2 },
  { empId: "0005", annual: 0, sick: 25, compassionate: 3, familyResp: 3 },
  { empId: "0006", annual: 4.25, sick: 30, compassionate: 3, familyResp: 3 },
];

const REPORT_TYPES = [
  { id: "employee-basic-info", label: "Employee Basic Info", icon: "ti-id", description: "General employee info — ID numbers, banking details and addresses.", category: "Employees" },
  { id: "leave-days", label: "Leave Days Report", icon: "ti-calendar-minus", description: "Leave days taken per employee for selected leave types.", category: "Leave" },
  { id: "leave-report", label: "Leave Report", icon: "ti-calendar-stats", description: "Accrued, taken, adjusted and balance per employee per leave type.", category: "Leave" },
  { id: "payslips-export", label: "Payslips Export", icon: "ti-file-download", description: "Download a ZIP of all payslips within a date range.", category: "Payroll" },
  { id: "transaction-history", label: "Transaction History", icon: "ti-receipt", description: "Breakdown of all payslip items per employee per period.", category: "Payroll" },
  { id: "variance-report", label: "Variance Report", icon: "ti-arrows-diff", description: "Differences in payslip amounts between two periods.", category: "Variance" },
  { id: "balances", label: "Balances — Loans & Savings", icon: "ti-piggy-bank", description: "Outstanding loan amounts and savings balances.", category: "Financial" },
  { id: "leave-liabilities", label: "Leave Liabilities", icon: "ti-calendar-dollar", description: "Amounts payable if employees were paid out their annual leave.", category: "Leave" },
];

const ADDITIONAL_FIELDS = ["Date of Birth", "Date of Appointment", "Identification Type", "ID Number", "Passport / Foreign ID No.", "Email", "Pay Point", "Number", "Job Title", "Last Day of Service", "Gender", "Income Tax Number", "Historic Pay Point"];
const INCOME_TYPES = ["Annual Bonus", "Basic Hourly Pay", "Basic Salary", "Commission", "Extra Pay", "Overtime", "Public Holiday — Not Worked", "Sunday Pay", "Travel Allowance"];
const DEDUCTION_TYPES = ["Medical Aid", "Pension Fund", "Loan Repayment", "Savings", "UIF — Employee", "PAYE Tax"];

const CATEGORY_COLORS = { Employees: { bg: C.infoBg, text: C.info }, Leave: { bg: C.activeBg, text: C.active }, Payroll: { bg: C.warningBg, text: C.warning }, Variance: { bg: "#F0EDE4", text: C.terra }, Financial: { bg: "#F5EAF0", text: "#7A3060" } };

const initials = (f, l) => `${f[0]}${l[0]}`.toUpperCase();
const AVATAR_COLORS = [
  { bg: "#E8F0E8", text: "#4A5240" }, { bg: "#F5EDE8", text: "#936639" },
  { bg: "#EAF1F8", text: "#2A5C8A" }, { bg: "#F0EDE4", text: "#656D4A" },
  { bg: "#F5EAF0", text: "#8A4A6A" }, { bg: "#EAF5ED", text: "#2D6B45" },
];
const getAvatarColor = (name) => { let h = 0; for (let c of name) h = c.charCodeAt(0) + ((h << 5) - h); return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]; };

// ─── Primitives ───────────────────────────────────────────────────────────────
const Btn = ({ children, onClick, variant = "primary", style: s = {}, disabled }) => {
  const base = { fontFamily: FONT_BODY, fontWeight: 500, fontSize: 13, borderRadius: 8, padding: "9px 18px", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, border: "none", display: "inline-flex", alignItems: "center", gap: 6, transition: "opacity 0.15s" };
  const v = { primary: { background: C.olive, color: "#F5F2EA" }, ghost: { background: "transparent", color: C.muted, border: `1px solid ${C.cardBorder}` }, accent: { background: C.wheat, color: C.ink, fontWeight: 600 }, success: { background: C.activeBg, color: C.active, border: `1px solid rgba(45,107,69,0.2)` } };
  return <button onClick={onClick} disabled={disabled} style={{ ...base, ...v[variant], ...s }}>{children}</button>;
};

const Badge = ({ children, color, bg }) => (
  <span style={{ background: bg, color, fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 20, whiteSpace: "nowrap" }}>{children}</span>
);

const Field = ({ label, children }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ display: "block", fontSize: 11, color: C.muted, marginBottom: 5, letterSpacing: "0.05em", textTransform: "uppercase", fontWeight: 500 }}>{label}</label>
    {children}
  </div>
);

const Divider = () => <div style={{ height: 1, background: C.cardBorder, margin: "16px 0" }} />;

const CheckItem = ({ checked, onChange, label }) => (
  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginBottom: 8, userSelect: "none" }}>
    <div onClick={onChange} style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${checked ? C.olive : C.cardBorder}`, background: checked ? C.olive : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
      {checked && <span style={{ color: "#fff", fontSize: 9, fontWeight: 700 }}>✓</span>}
    </div>
    <span style={{ fontSize: 13, color: C.ink }}>{label}</span>
  </label>
);

// ─── Report Preview Tables ────────────────────────────────────────────────────
function EmployeeBasicInfoTable({ employees, fields }) {
  const showField = (f) => fields.includes(f);
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ background: C.surface }}>
            {["#", "Last Name", "First Name", showField("Pay Point") && "Pay Point", showField("Job Title") && "Job Title", showField("ID Number") && "ID Number", showField("Email") && "Email", showField("Date of Appointment") && "Appointed", showField("Gender") && "Gender"].filter(Boolean).map(h => (
              <th key={h} style={{ padding: "9px 14px", textAlign: "left", fontSize: 11, color: C.sageMid, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, borderBottom: `1px solid ${C.cardBorder}`, whiteSpace: "nowrap" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employees.map((e, i) => {
            const av = getAvatarColor(e.firstName + e.lastName);
            return (
              <tr key={e.id} style={{ borderBottom: `1px solid ${C.cardBorder}` }}
                onMouseEnter={ev => ev.currentTarget.style.background = C.surface}
                onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "10px 14px" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: av.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: av.text }}>{initials(e.firstName, e.lastName)}</div>
                </td>
                <td style={{ padding: "10px 14px", color: C.ink, fontWeight: 500 }}>{e.lastName}</td>
                <td style={{ padding: "10px 14px", color: C.ink }}>{e.firstName}</td>
                {showField("Pay Point") && <td style={{ padding: "10px 14px", color: C.muted }}>{e.payPoint}</td>}
                {showField("Job Title") && <td style={{ padding: "10px 14px", color: C.muted }}>{e.jobTitle}</td>}
                {showField("ID Number") && <td style={{ padding: "10px 14px", color: C.muted, fontFamily: "monospace" }}>{e.idNumber}</td>}
                {showField("Email") && <td style={{ padding: "10px 14px", color: C.info }}>{e.email}</td>}
                {showField("Date of Appointment") && <td style={{ padding: "10px 14px", color: C.muted }}>{e.dateOfAppointment}</td>}
                {showField("Gender") && <td style={{ padding: "10px 14px", color: C.muted }}>{e.gender}</td>}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function TransactionHistoryTable({ employees, selectedTransactions }) {
  const periods = ["2025-05-31", "2025-04-30"];
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ background: C.surface }}>
            {["Employee", "Period", selectedTransactions.includes("Basic Salary") && "Basic Salary", selectedTransactions.includes("Commission") && "Commission", "PAYE Tax", "UIF", "Nett Pay"].filter(Boolean).map(h => (
              <th key={h} style={{ padding: "9px 14px", textAlign: "left", fontSize: 11, color: C.sageMid, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, borderBottom: `1px solid ${C.cardBorder}`, whiteSpace: "nowrap" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PAYSLIP_DATA.filter(p => periods.includes(p.period)).map((p, i) => {
            const emp = employees.find(e => e.id === p.empId);
            if (!emp) return null;
            return (
              <tr key={i} style={{ borderBottom: `1px solid ${C.cardBorder}` }}
                onMouseEnter={ev => ev.currentTarget.style.background = C.surface}
                onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "10px 14px", color: C.ink, fontWeight: 500 }}>{emp.lastName}, {emp.firstName}</td>
                <td style={{ padding: "10px 14px", color: C.muted }}>{p.period}</td>
                {selectedTransactions.includes("Basic Salary") && <td style={{ padding: "10px 14px", color: C.ink }}>{fmt(p.basicSalary)}</td>}
                {selectedTransactions.includes("Commission") && <td style={{ padding: "10px 14px", color: C.ink }}>{fmt(p.commission)}</td>}
                <td style={{ padding: "10px 14px", color: C.danger }}>{fmt(p.tax)}</td>
                <td style={{ padding: "10px 14px", color: C.danger }}>{fmt(p.uif)}</td>
                <td style={{ padding: "10px 14px", color: C.olive, fontWeight: 600 }}>{fmt(p.nett)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function VarianceTable({ employees }) {
  const may = PAYSLIP_DATA.filter(p => p.period === "2025-05-31");
  const apr = PAYSLIP_DATA.filter(p => p.period === "2025-04-30");
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ background: C.surface }}>
            {["Employee", "Item", "Apr 2025", "May 2025", "Variance", ""].map(h => (
              <th key={h} style={{ padding: "9px 14px", textAlign: "left", fontSize: 11, color: C.sageMid, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, borderBottom: `1px solid ${C.cardBorder}` }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {may.map((p, i) => {
            const emp = employees.find(e => e.id === p.empId);
            const prev = apr.find(a => a.empId === p.empId);
            if (!emp || !prev) return null;
            const diff = p.nett - prev.nett;
            return (
              <tr key={i} style={{ borderBottom: `1px solid ${C.cardBorder}` }}
                onMouseEnter={ev => ev.currentTarget.style.background = C.surface}
                onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "10px 14px", color: C.ink, fontWeight: 500 }}>{emp.lastName}, {emp.firstName}</td>
                <td style={{ padding: "10px 14px", color: C.muted }}>Nett Pay</td>
                <td style={{ padding: "10px 14px", color: C.ink }}>{fmt(prev.nett)}</td>
                <td style={{ padding: "10px 14px", color: C.ink }}>{fmt(p.nett)}</td>
                <td style={{ padding: "10px 14px", fontWeight: 600, color: diff > 0 ? C.active : diff < 0 ? C.danger : C.muted }}>
                  {diff > 0 ? "+" : ""}{fmt(diff)}
                </td>
                <td style={{ padding: "10px 14px" }}>
                  {diff !== 0 && <Badge color={diff > 0 ? C.active : C.danger} bg={diff > 0 ? C.activeBg : C.dangerBg}>{diff > 0 ? "↑ Increase" : "↓ Decrease"}</Badge>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function LeaveDaysTable({ employees }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ background: C.surface }}>
            {["Employee", "Pay Point", "Annual Taken", "Sick Taken", "Compassionate Taken", "Annual Balance"].map(h => (
              <th key={h} style={{ padding: "9px 14px", textAlign: "left", fontSize: 11, color: C.sageMid, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, borderBottom: `1px solid ${C.cardBorder}` }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employees.map((emp, i) => {
            const lb = LEAVE_BALANCES.find(l => l.empId === emp.id) || {};
            return (
              <tr key={i} style={{ borderBottom: `1px solid ${C.cardBorder}` }}
                onMouseEnter={ev => ev.currentTarget.style.background = C.surface}
                onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "10px 14px", color: C.ink, fontWeight: 500 }}>{emp.lastName}, {emp.firstName}</td>
                <td style={{ padding: "10px 14px", color: C.muted }}>{emp.payPoint}</td>
                <td style={{ padding: "10px 14px", color: C.info }}>{15 - (lb.annual || 0)} days</td>
                <td style={{ padding: "10px 14px", color: C.danger }}>{30 - (lb.sick || 0)} days</td>
                <td style={{ padding: "10px 14px", color: "#7A3060" }}>{3 - (lb.compassionate || 0)} days</td>
                <td style={{ padding: "10px 14px", fontWeight: 600, color: (lb.annual || 0) < 3 ? C.danger : C.active }}>{lb.annual || 0} days</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function LeaveLiabilitiesTable({ employees }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ background: C.surface }}>
            {["Employee", "Basic Salary", "Leave Balance (days)", "Daily Rate", "Leave Liability"].map(h => (
              <th key={h} style={{ padding: "9px 14px", textAlign: "left", fontSize: 11, color: C.sageMid, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, borderBottom: `1px solid ${C.cardBorder}` }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employees.map((emp, i) => {
            const ps = PAYSLIP_DATA.find(p => p.empId === emp.id && p.period === "2025-05-31");
            const lb = LEAVE_BALANCES.find(l => l.empId === emp.id);
            const salary = ps?.basicSalary || 0;
            const dailyRate = salary / 21.67;
            const liability = dailyRate * (lb?.annual || 0);
            return (
              <tr key={i} style={{ borderBottom: `1px solid ${C.cardBorder}` }}
                onMouseEnter={ev => ev.currentTarget.style.background = C.surface}
                onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "10px 14px", color: C.ink, fontWeight: 500 }}>{emp.lastName}, {emp.firstName}</td>
                <td style={{ padding: "10px 14px", color: C.ink }}>{fmt(salary)}</td>
                <td style={{ padding: "10px 14px", color: C.info }}>{lb?.annual || 0}</td>
                <td style={{ padding: "10px 14px", color: C.muted }}>{fmt(dailyRate.toFixed(2))}</td>
                <td style={{ padding: "10px 14px", fontWeight: 600, color: C.olive }}>{fmt(liability.toFixed(2))}</td>
              </tr>
            );
          })}
          <tr style={{ background: C.surface }}>
            <td colSpan={4} style={{ padding: "10px 14px", fontSize: 12, fontWeight: 700, color: C.ink }}>Total Leave Liability</td>
            <td style={{ padding: "10px 14px", fontWeight: 700, color: C.olive, fontSize: 14 }}>
              {fmt(employees.reduce((s, emp) => {
                const ps = PAYSLIP_DATA.find(p => p.empId === emp.id && p.period === "2025-05-31");
                const lb = LEAVE_BALANCES.find(l => l.empId === emp.id);
                return s + ((ps?.basicSalary || 0) / 21.67 * (lb?.annual || 0));
              }, 0).toFixed(2))}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ─── Report Builder ───────────────────────────────────────────────────────────
function ReportBuilder({ report, onBack }) {
  const [dateFrom, setDateFrom] = useState("2025-04-01");
  const [dateTo, setDateTo] = useState("2025-05-31");
  const [periodFrom, setPeriodFrom] = useState("2025-04-30");
  const [periodTo, setPeriodTo] = useState("2025-05-31");
  const [filterPayPoint, setFilterPayPoint] = useState("All");
  const [filterFreq, setFilterFreq] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [additionalFields, setAdditionalFields] = useState(["Pay Point", "Job Title", "Email"]);
  const [selectedTransactions, setSelectedTransactions] = useState(["Basic Salary", "Commission"]);
  const [passwordProtect, setPasswordProtect] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [exported, setExported] = useState(null);

  const toggleField = (f) => setAdditionalFields(p => p.includes(f) ? p.filter(x => x !== f) : [...p, f]);
  const toggleTxn = (t) => setSelectedTransactions(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);
  const allFields = () => setAdditionalFields([...ADDITIONAL_FIELDS]);
  const noneFields = () => setAdditionalFields([]);

  const filteredEmployees = EMPLOYEES.filter(e => {
    if (filterPayPoint !== "All" && e.payPoint !== filterPayPoint) return false;
    if (filterFreq !== "All" && e.payFrequency !== filterFreq) return false;
    if (filterStatus !== "All" && e.status !== filterStatus) return false;
    return true;
  });

  const payPoints = [...new Set(EMPLOYEES.map(e => e.payPoint))];

  const handleExport = (type) => {
    setExported(type);
    setTimeout(() => setExported(null), 3000);
  };

  const isVariance = report.id === "variance-report";
  const isTxn = report.id === "transaction-history";
  const isBasicInfo = report.id === "employee-basic-info";
  const isLeave = report.id === "leave-days" || report.id === "leave-report";
  const isLiability = report.id === "leave-liabilities";

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 13, marginBottom: 20, display: "flex", alignItems: "center", gap: 6, fontFamily: FONT_BODY, padding: 0 }}>
        ← Back to Reports
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 20, alignItems: "start" }}>

        {/* Left — Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Report info */}
          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <i className={`ti ${report.icon}`} style={{ fontSize: 20, color: C.olive }} aria-hidden="true" />
              <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 700, color: C.ink }}>{report.label}</h2>
            </div>
            <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{report.description}</p>
          </div>

          {/* Date Range */}
          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: "16px 18px" }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: C.ink, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Date Range</p>
            {isVariance ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Field label="Period 1 (From)"><input type="date" value={periodFrom} onChange={e => setPeriodFrom(e.target.value)} style={inp} /></Field>
                <Field label="Period 2 (To)"><input type="date" value={periodTo} onChange={e => setPeriodTo(e.target.value)} style={inp} /></Field>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Field label="From"><input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={inp} /></Field>
                <Field label="To"><input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={inp} /></Field>
              </div>
            )}
          </div>

          {/* Filters */}
          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: "16px 18px" }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: C.ink, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Filters</p>
            <Field label="Pay Point">
              <select value={filterPayPoint} onChange={e => setFilterPayPoint(e.target.value)} style={sel}>
                <option value="All">All Pay Points</option>
                {payPoints.map(p => <option key={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Pay Frequency">
              <select value={filterFreq} onChange={e => setFilterFreq(e.target.value)} style={sel}>
                <option value="All">All Frequencies</option>
                <option>Monthly</option><option>Weekly</option>
              </select>
            </Field>
            <Field label="Status">
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={sel}>
                <option value="All">All</option>
                <option>Active</option><option>Inactive</option>
              </select>
            </Field>
          </div>

          {/* Additional Fields */}
          {(isBasicInfo || isTxn) && (
            <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: "16px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: C.ink, textTransform: "uppercase", letterSpacing: "0.06em" }}>Additional Fields</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={allFields} style={{ background: "none", border: "none", fontSize: 11, color: C.olive, cursor: "pointer", fontFamily: FONT_BODY }}>All</button>
                  <span style={{ color: C.sageMid }}>·</span>
                  <button onClick={noneFields} style={{ background: "none", border: "none", fontSize: 11, color: C.muted, cursor: "pointer", fontFamily: FONT_BODY }}>None</button>
                </div>
              </div>
              <div style={{ maxHeight: 200, overflowY: "auto" }}>
                {ADDITIONAL_FIELDS.map(f => <CheckItem key={f} checked={additionalFields.includes(f)} onChange={() => toggleField(f)} label={f} />)}
              </div>
            </div>
          )}

          {/* Transactions */}
          {isTxn && (
            <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: "16px 18px" }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: C.ink, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Transactions</p>
              <p style={{ fontSize: 11, color: C.muted, marginBottom: 10 }}>Income</p>
              {INCOME_TYPES.map(t => <CheckItem key={t} checked={selectedTransactions.includes(t)} onChange={() => toggleTxn(t)} label={t} />)}
              <Divider />
              <p style={{ fontSize: 11, color: C.muted, marginBottom: 10 }}>Deductions</p>
              {DEDUCTION_TYPES.map(t => <CheckItem key={t} checked={selectedTransactions.includes(t)} onChange={() => toggleTxn(t)} label={t} />)}
            </div>
          )}

          {/* Export */}
          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: C.ink, userSelect: "none" }}>
                <div onClick={() => setPasswordProtect(!passwordProtect)} style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${passwordProtect ? C.olive : C.cardBorder}`, background: passwordProtect ? C.olive : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {passwordProtect && <span style={{ color: "#fff", fontSize: 9, fontWeight: 700 }}>✓</span>}
                </div>
                Password protect this report
              </label>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn onClick={() => { setShowPreview(true); handleExport("Excel"); }} style={{ flex: 1, justifyContent: "center" }}>
                <i className="ti ti-table" aria-hidden="true" /> Show Excel
              </Btn>
              <Btn variant="ghost" onClick={() => { setShowPreview(true); handleExport("PDF"); }} style={{ flex: 1, justifyContent: "center" }}>
                <i className="ti ti-file-type-pdf" aria-hidden="true" /> Show PDF
              </Btn>
            </div>
            {exported && (
              <div style={{ marginTop: 10, padding: "8px 12px", background: C.activeBg, borderRadius: 8, fontSize: 12, color: C.active, display: "flex", alignItems: "center", gap: 6 }}>
                <i className="ti ti-check" aria-hidden="true" />
                {exported} report generated for {filteredEmployees.length} employee{filteredEmployees.length !== 1 ? "s" : ""}
              </div>
            )}
          </div>
        </div>

        {/* Right — Preview */}
        <div>
          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", background: C.surface, borderBottom: `1px solid ${C.cardBorder}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>
                {showPreview ? `Preview — ${filteredEmployees.length} employee${filteredEmployees.length !== 1 ? "s" : ""}` : "Configure report settings to preview"}
              </span>
              {showPreview && <Badge color={C.olive} bg="rgba(101,109,74,0.1)">{filteredEmployees.length} rows</Badge>}
            </div>

            {!showPreview ? (
              <div style={{ padding: "60px 20px", textAlign: "center" }}>
                <i className="ti ti-chart-bar" aria-hidden="true" style={{ fontSize: 40, color: C.sage, display: "block", marginBottom: 12 }} />
                <p style={{ fontSize: 14, color: C.sageMid }}>Set your filters and click Show Excel or Show PDF to generate the report</p>
              </div>
            ) : (
              <>
                {isBasicInfo && <EmployeeBasicInfoTable employees={filteredEmployees} fields={additionalFields} />}
                {isTxn && <TransactionHistoryTable employees={filteredEmployees} selectedTransactions={selectedTransactions} />}
                {isVariance && <VarianceTable employees={filteredEmployees} />}
                {(isLeave || report.id === "leave-days") && <LeaveDaysTable employees={filteredEmployees} />}
                {isLiability && <LeaveLiabilitiesTable employees={filteredEmployees} />}
                {!isBasicInfo && !isTxn && !isVariance && !isLeave && !isLiability && (
                  <div style={{ padding: "40px 20px", textAlign: "center", color: C.sageMid, fontSize: 13 }}>
                    Preview for <strong style={{ color: C.ink }}>{report.label}</strong> — {filteredEmployees.length} employees selected
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Reports List ─────────────────────────────────────────────────────────────
export default function Reports() {
  const [activeReport, setActiveReport] = useState(null);
  const categories = [...new Set(REPORT_TYPES.map(r => r.category))];

  if (activeReport) return <ReportBuilder report={activeReport} onBack={() => setActiveReport(null)} />;

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px", ...DOTS_BG }}>
      <div style={{ marginBottom: 6 }}>
        <p style={{ fontSize: 13, color: C.muted }}>Only information from finalised payslips is included in reports. We recommend using the Excel format.</p>
      </div>
      {categories.map(cat => {
        const catColor = CATEGORY_COLORS[cat] || { bg: C.surface, text: C.muted };
        const catReports = REPORT_TYPES.filter(r => r.category === cat);
        return (
          <div key={cat} style={{ marginBottom: 28, marginTop: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 14, fontWeight: 700, color: C.ink }}>{cat}</h3>
              <Badge color={catColor.text} bg={catColor.bg}>{catReports.length}</Badge>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
              {catReports.map(report => (
                <div key={report.id} onClick={() => setActiveReport(report)} style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: "18px 20px", cursor: "pointer", transition: "all 0.15s" }}
                  onMouseEnter={ev => { ev.currentTarget.style.background = C.surface; ev.currentTarget.style.borderColor = C.sageMid; }}
                  onMouseLeave={ev => { ev.currentTarget.style.background = C.card; ev.currentTarget.style.borderColor = C.cardBorder; }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: catColor.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <i className={`ti ${report.icon}`} style={{ fontSize: 18, color: catColor.text }} aria-hidden="true" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, fontFamily: FONT_DISPLAY, marginBottom: 4 }}>{report.label}</div>
                      <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{report.description}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <span style={{ fontSize: 12, color: C.olive, fontWeight: 500 }}>Generate <i className="ti ti-arrow-right" aria-hidden="true" style={{ fontSize: 11 }} /></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}