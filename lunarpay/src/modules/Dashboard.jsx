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
const fmtShort = (n) => {
  if (n >= 1000000) return `R ${(n / 1000000).toFixed(2)}m`;
  if (n >= 1000) return `R ${(n / 1000).toFixed(1)}k`;
  return fmt(n);
};

const EMPLOYEES = [
  { id: "0001", firstName: "Jane", lastName: "Brown", payPoint: "Finance", payFrequency: "Monthly", dateOfAppointment: "2021-02-01", basicSalary: 28000 },
  { id: "0002", firstName: "John", lastName: "Smith", payPoint: "Operations", payFrequency: "Monthly", dateOfAppointment: "2020-05-15", basicSalary: 35000 },
  { id: "0003", firstName: "Paige", lastName: "Turner", payPoint: "Marketing", payFrequency: "Monthly", dateOfAppointment: "2022-01-10", basicSalary: 22000 },
  { id: "0004", firstName: "Gail", lastName: "Forcewind", payPoint: "Human Resources", payFrequency: "Weekly", dateOfAppointment: "2019-08-20", basicSalary: 18000 },
  { id: "0005", firstName: "Walter", lastName: "Melon", payPoint: "Operations", payFrequency: "Weekly", dateOfAppointment: "2018-03-01", basicSalary: 14000 },
  { id: "0006", firstName: "Celeste", lastName: "Fankomo", payPoint: "Operations", payFrequency: "Monthly", dateOfAppointment: "2023-03-01", basicSalary: 26000 },
];

const PAYSLIP_STATUS = [
  { empId: "0001", status: "Finalised", nett: 24423 },
  { empId: "0002", status: "Finalised", nett: 27623 },
  { empId: "0003", status: "Pending", nett: 19093 },
  { empId: "0004", status: "Finalised", nett: 14763 },
  { empId: "0005", status: "Pending", nett: 11760 },
  { empId: "0006", status: "Finalised", nett: 20883 },
];

const LEAVE_ON = [
  { empId: "0002", type: "Annual", from: "2025-05-19", to: "2025-05-23", days: 5 },
  { empId: "0003", type: "Annual", from: "2025-05-05", to: "2025-05-07", days: 3 },
];

const UPCOMING_LEAVE = [
  { empId: "0001", type: "Annual", from: "2025-06-16", to: "2025-06-20", days: 5 },
  { empId: "0004", type: "Annual", from: "2025-07-07", to: "2025-07-11", days: 5 },
];

const RECENT_ACTIVITY = [
  { id: 1, user: "Brandon Louw", action: "Finalised payslip", target: "Brown, Jane", time: "Today 14:32", category: "Payroll", icon: "ti-check" },
  { id: 2, user: "Brandon Louw", action: "Created pay run", target: "Monthly — May 2025", time: "Today 14:35", category: "Payroll", icon: "ti-player-play" },
  { id: 3, user: "Anna Heart", action: "Added employee", target: "Fankomo, Celeste", time: "Yesterday 09:12", category: "Employees", icon: "ti-user-plus" },
  { id: 4, user: "Mike Dlamini", action: "Approved leave", target: "Smith, John", time: "Yesterday 16:44", category: "Leave", icon: "ti-calendar-check" },
  { id: 5, user: "Brandon Louw", action: "Released payslips", target: "April 2025", time: "30 Apr 17:01", category: "Self-Service", icon: "ti-send" },
];

const ALERTS = [
  { id: 1, type: "warning", icon: "ti-alert-triangle", title: "2 payslips pending finalisation", desc: "Turner, Paige and Melon, Walter — May 2025", action: "Finalise now" },
  { id: 2, type: "info", icon: "ti-calendar-event", title: "Leave request awaiting approval", desc: "Brown, Jane — Annual Leave: 16–20 June 2025", action: "Review request" },
  { id: 3, type: "success", icon: "ti-check", title: "Pay run created for April 2025", desc: "4 payslips · Total nett R 87,592.00", action: null },
];

const MONTHLY_PAYROLL = [
  { month: "Dec", amount: 118000 },
  { month: "Jan", amount: 121000 },
  { month: "Feb", amount: 119500 },
  { month: "Mar", amount: 123000 },
  { month: "Apr", amount: 120000 },
  { month: "May", amount: 118542 },
];

const LEAVE_BALANCES = [
  { empId: "0001", annual: 7.25 },
  { empId: "0002", annual: 5.50 },
  { empId: "0003", annual: 9.00 },
  { empId: "0004", annual: 12.75 },
  { empId: "0005", annual: 0.5 },
  { empId: "0006", annual: 4.25 },
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

const LEAVE_TYPE_COLORS = {
  Annual: "#378ADD", Sick: "#B85C38", Compassionate: "#C45A9A",
  "Family Responsibility": "#4A8C5C", Unpaid: "#936639",
};

// ─── Primitives ───────────────────────────────────────────────────────────────
const Btn = ({ children, onClick, variant = "primary", style: s = {}, small }) => {
  const base = { fontFamily: FONT_BODY, fontWeight: 500, fontSize: small ? 12 : 13, borderRadius: 8, padding: small ? "6px 14px" : "9px 18px", cursor: "pointer", border: "none", display: "inline-flex", alignItems: "center", gap: 5, transition: "opacity 0.15s" };
  const v = { primary: { background: C.olive, color: "#F5F2EA" }, ghost: { background: "transparent", color: C.muted, border: `1px solid ${C.cardBorder}` }, accent: { background: C.wheat, color: C.ink, fontWeight: 600 } };
  return <button onClick={onClick} style={{ ...base, ...v[variant], ...s }}>{children}</button>;
};

const Badge = ({ children, color, bg }) => (
  <span style={{ background: bg, color, fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 20, whiteSpace: "nowrap" }}>{children}</span>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, sub, color, bg, trend, onClick }) => (
  <div onClick={onClick} style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: "18px 20px", cursor: onClick ? "pointer" : "default", transition: "border-color 0.15s" }}
    onMouseEnter={ev => onClick && (ev.currentTarget.style.borderColor = C.sageMid)}
    onMouseLeave={ev => onClick && (ev.currentTarget.style.borderColor = C.cardBorder)}>
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: bg || C.surface, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <i className={`ti ${icon}`} aria-hidden="true" style={{ fontSize: 18, color: color || C.muted }} />
      </div>
      {trend !== undefined && (
        <span style={{ fontSize: 11, color: trend >= 0 ? C.active : C.danger, fontWeight: 600, background: trend >= 0 ? C.activeBg : C.dangerBg, padding: "2px 8px", borderRadius: 20 }}>
          {trend >= 0 ? "+" : ""}{trend}%
        </span>
      )}
    </div>
    <div style={{ fontSize: 24, fontWeight: 700, fontFamily: FONT_DISPLAY, color: color || C.ink, lineHeight: 1.1, marginBottom: 4 }}>{value}</div>
    <div style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>{label}</div>
    {sub && <div style={{ fontSize: 11, color: C.sageMid, marginTop: 3 }}>{sub}</div>}
  </div>
);

// ─── Mini Bar Chart ───────────────────────────────────────────────────────────
const MiniBarChart = ({ data }) => {
  const max = Math.max(...data.map(d => d.amount));
  const current = data[data.length - 1];
  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80, marginBottom: 8 }}>
        {data.map((d, i) => {
          const isLast = i === data.length - 1;
          const pct = (d.amount / max) * 100;
          return (
            <div key={d.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ width: "100%", height: `${pct}%`, borderRadius: "4px 4px 0 0", background: isLast ? C.olive : C.sage, transition: "height 0.3s", position: "relative" }}>
                {isLast && (
                  <div style={{ position: "absolute", top: -22, left: "50%", transform: "translateX(-50%)", fontSize: 10, color: C.olive, fontWeight: 700, whiteSpace: "nowrap" }}>
                    {fmtShort(d.amount)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {data.map((d, i) => (
          <div key={d.month} style={{ flex: 1, textAlign: "center", fontSize: 10, color: i === data.length - 1 ? C.olive : C.sageMid, fontWeight: i === data.length - 1 ? 600 : 400 }}>{d.month}</div>
        ))}
      </div>
    </div>
  );
};

// ─── Payroll Progress ─────────────────────────────────────────────────────────
const PayrollProgress = ({ payslips, onNavigate }) => {
  const finalised = payslips.filter(p => p.status === "Finalised").length;
  const total = payslips.length;
  const pct = Math.round((finalised / total) * 100);
  const totalNett = payslips.filter(p => p.status === "Finalised").reduce((s, p) => s + p.nett, 0);

  return (
    <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: "20px", height: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 2 }}>May 2025 Payroll</h3>
          <p style={{ fontSize: 12, color: C.muted }}>Period ending 31 May 2025</p>
        </div>
        <Badge color={pct === 100 ? C.active : C.warning} bg={pct === 100 ? C.activeBg : C.warningBg}>
          {pct === 100 ? "Complete" : "In Progress"}
        </Badge>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: C.muted }}>{finalised} of {total} payslips finalised</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: pct === 100 ? C.active : C.warning }}>{pct}%</span>
        </div>
        <div style={{ height: 8, background: C.surface, borderRadius: 4, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? C.active : C.wheat, borderRadius: 4, transition: "width 0.4s ease" }} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
        {payslips.map(ps => {
          const emp = EMPLOYEES.find(e => e.id === ps.empId);
          if (!emp) return null;
          const av = getAvatarColor(emp.firstName + emp.lastName);
          return (
            <div key={ps.empId} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: C.surface, borderRadius: 8, border: `1px solid ${C.cardBorder}` }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: av.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: av.text, flexShrink: 0 }}>{initials(emp.firstName, emp.lastName)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 500, color: C.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{emp.lastName}</div>
                <div style={{ fontSize: 10, color: C.muted }}>{fmt(ps.nett)}</div>
              </div>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: ps.status === "Finalised" ? C.active : C.wheat, flexShrink: 0 }} title={ps.status} />
            </div>
          );
        })}
      </div>

      <div style={{ borderTop: `1px solid ${C.cardBorder}`, paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Finalised Nett Total</div>
          <div style={{ fontSize: 18, fontWeight: 700, fontFamily: FONT_DISPLAY, color: C.olive }}>{fmt(totalNett)}</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {finalised < total && <Btn small onClick={() => onNavigate("payruns")}><i className="ti ti-check" aria-hidden="true" /> Finalise</Btn>}
          {finalised === total && <Btn small variant="accent" onClick={() => onNavigate("payruns")}><i className="ti ti-player-play" aria-hidden="true" /> Create Pay Run</Btn>}
        </div>
      </div>
    </div>
  );
};

// ─── Leave This Week ──────────────────────────────────────────────────────────
const LeaveThisWeek = ({ onLeave, upcoming }) => (
  <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: "20px" }}>
    <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 14 }}>Leave Overview</h3>
    {onLeave.length > 0 && (
      <div style={{ marginBottom: 14 }}>
        <p style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: 8 }}>Currently on leave</p>
        {onLeave.map((rec, i) => {
          const emp = EMPLOYEES.find(e => e.id === rec.empId);
          if (!emp) return null;
          const av = getAvatarColor(emp.firstName + emp.lastName);
          const dotColor = LEAVE_TYPE_COLORS[rec.type] || C.sageMid;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, padding: "8px 10px", background: C.surface, borderRadius: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: av.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: av.text, flexShrink: 0 }}>{initials(emp.firstName, emp.lastName)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: C.ink }}>{emp.firstName} {emp.lastName}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{rec.from} → {rec.to}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: dotColor }} />
                <span style={{ fontSize: 10, color: C.muted }}>{rec.type}</span>
              </div>
            </div>
          );
        })}
      </div>
    )}
    {onLeave.length === 0 && (
      <div style={{ padding: "12px 0", color: C.sageMid, fontSize: 13, marginBottom: 14 }}>No one is currently on leave</div>
    )}
    <p style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: 8 }}>Upcoming leave</p>
    {upcoming.map((rec, i) => {
      const emp = EMPLOYEES.find(e => e.id === rec.empId);
      if (!emp) return null;
      const av = getAvatarColor(emp.firstName + emp.lastName);
      return (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, padding: "8px 10px", background: C.surface, borderRadius: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: av.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: av.text, flexShrink: 0 }}>{initials(emp.firstName, emp.lastName)}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: C.ink }}>{emp.firstName} {emp.lastName}</div>
            <div style={{ fontSize: 11, color: C.muted }}>{rec.from} · {rec.days} days</div>
          </div>
          <span style={{ fontSize: 10, color: C.sageMid, background: C.surface, border: `1px solid ${C.cardBorder}`, padding: "2px 7px", borderRadius: 20 }}>Pending</span>
        </div>
      );
    })}
  </div>
);

// ─── Alerts ───────────────────────────────────────────────────────────────────
const AlertsCard = ({ alerts, onNavigate }) => {
  const [dismissed, setDismissed] = useState([]);
  const visible = alerts.filter(a => !dismissed.includes(a.id));
  const styleMap = {
    warning: { icon: C.warning, bg: C.warningBg, border: "rgba(122,92,30,0.2)" },
    info: { icon: C.info, bg: C.infoBg, border: "rgba(42,92,138,0.2)" },
    success: { icon: C.active, bg: C.activeBg, border: "rgba(45,107,69,0.2)" },
    danger: { icon: C.danger, bg: C.dangerBg, border: "rgba(139,58,30,0.2)" },
  };

  if (visible.length === 0) return (
    <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: "20px", display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.activeBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <i className="ti ti-check" aria-hidden="true" style={{ fontSize: 18, color: C.active }} />
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>All clear</div>
        <div style={{ fontSize: 12, color: C.muted }}>No alerts or actions required</div>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {visible.map(alert => {
        const s = styleMap[alert.type] || styleMap.info;
        return (
          <div key={alert.id} style={{ background: C.card, border: `1px solid ${s.border}`, borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <i className={`ti ${alert.icon}`} aria-hidden="true" style={{ fontSize: 16, color: s.icon }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 2 }}>{alert.title}</div>
              <div style={{ fontSize: 12, color: C.muted }}>{alert.desc}</div>
              {alert.action && (
                <button onClick={() => onNavigate("payruns")} style={{ background: "none", border: "none", color: s.icon, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FONT_BODY, padding: "6px 0 0", display: "flex", alignItems: "center", gap: 4 }}>
                  {alert.action} <i className="ti ti-arrow-right" aria-hidden="true" style={{ fontSize: 11 }} />
                </button>
              )}
            </div>
            <button onClick={() => setDismissed(p => [...p, alert.id])} style={{ background: "none", border: "none", color: C.sageMid, cursor: "pointer", fontSize: 14, padding: 2, flexShrink: 0 }}>✕</button>
          </div>
        );
      })}
    </div>
  );
};

// ─── Activity Feed ────────────────────────────────────────────────────────────
const ActivityFeed = () => {
  const catColors = {
    Payroll: C.warning, Employees: C.active, Leave: C.info,
    "Self-Service": "#7A3060", Settings: C.terra,
  };
  return (
    <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", background: C.surface, borderBottom: `1px solid ${C.cardBorder}` }}>
        <span style={{ fontFamily: FONT_DISPLAY, fontSize: 14, fontWeight: 700, color: C.ink }}>Recent Activity</span>
      </div>
      {RECENT_ACTIVITY.map((item, i) => {
        const catColor = catColors[item.category] || C.muted;
        return (
          <div key={item.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 18px", borderBottom: i < RECENT_ACTIVITY.length - 1 ? `1px solid ${C.cardBorder}` : "none" }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: C.surface, border: `1px solid ${C.cardBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
              <i className={`ti ${item.icon}`} aria-hidden="true" style={{ fontSize: 13, color: catColor }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, color: C.ink }}>
                <span style={{ fontWeight: 500 }}>{item.user}</span>
                <span style={{ color: C.muted }}> {item.action} </span>
                <span style={{ fontWeight: 500 }}>{item.target}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
                <span style={{ fontSize: 11, color: C.sageMid }}>{item.time}</span>
                <span style={{ width: 3, height: 3, borderRadius: "50%", background: C.sageMid, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: catColor, fontWeight: 500 }}>{item.category}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Low Leave Balances ───────────────────────────────────────────────────────
const LowLeaveBalances = () => {
  const low = LEAVE_BALANCES.filter(l => l.annual < 3);
  if (low.length === 0) return null;
  return (
    <div style={{ background: C.card, border: `1px solid rgba(139,58,30,0.2)`, borderRadius: 12, overflow: "hidden" }}>
      <div style={{ padding: "12px 18px", background: C.dangerBg, borderBottom: `1px solid rgba(139,58,30,0.15)`, display: "flex", alignItems: "center", gap: 8 }}>
        <i className="ti ti-alert-triangle" aria-hidden="true" style={{ fontSize: 14, color: C.danger }} />
        <span style={{ fontFamily: FONT_DISPLAY, fontSize: 13, fontWeight: 700, color: C.danger }}>Low Leave Balances</span>
      </div>
      {low.map((lb, i) => {
        const emp = EMPLOYEES.find(e => e.id === lb.empId);
        if (!emp) return null;
        const av = getAvatarColor(emp.firstName + emp.lastName);
        return (
          <div key={lb.empId} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 18px", borderBottom: i < low.length - 1 ? `1px solid ${C.cardBorder}` : "none" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: av.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: av.text }}>{initials(emp.firstName, emp.lastName)}</div>
            <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: C.ink }}>{emp.firstName} {emp.lastName}</span>
            <span style={{ fontSize: 12, color: C.danger, fontWeight: 700 }}>{lb.annual} days left</span>
          </div>
        );
      })}
    </div>
  );
};

// ─── Quick Actions ────────────────────────────────────────────────────────────
const QuickActions = ({ onNavigate }) => {
  const actions = [
    { label: "Add Employee", icon: "ti-user-plus", nav: "employees", color: C.active, bg: C.activeBg },
    { label: "Record Leave", icon: "ti-calendar-plus", nav: "leave", color: C.info, bg: C.infoBg },
    { label: "Run Payroll", icon: "ti-cash", nav: "payruns", color: C.warning, bg: C.warningBg },
    { label: "View Reports", icon: "ti-chart-bar", nav: "reports", color: C.terra, bg: "#F0EDE4" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
      {actions.map(a => (
        <div key={a.label} onClick={() => onNavigate(a.nav)} style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: "16px 14px", cursor: "pointer", textAlign: "center", transition: "all 0.15s" }}
          onMouseEnter={ev => { ev.currentTarget.style.borderColor = a.color; ev.currentTarget.style.background = a.bg; }}
          onMouseLeave={ev => { ev.currentTarget.style.borderColor = C.cardBorder; ev.currentTarget.style.background = C.card; }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: a.bg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
            <i className={`ti ${a.icon}`} aria-hidden="true" style={{ fontSize: 20, color: a.color }} />
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.ink }}>{a.label}</div>
        </div>
      ))}
    </div>
  );
};

// ─── Payroll Trend Chart ──────────────────────────────────────────────────────
const PayrollTrend = () => (
  <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: "20px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
      <div>
        <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 2 }}>Payroll Trend</h3>
        <p style={{ fontSize: 12, color: C.muted }}>Total nett pay — last 6 months</p>
      </div>
      <span style={{ fontSize: 18, fontWeight: 700, fontFamily: FONT_DISPLAY, color: C.olive }}>{fmtShort(MONTHLY_PAYROLL[MONTHLY_PAYROLL.length - 1].amount)}</span>
    </div>
    <MiniBarChart data={MONTHLY_PAYROLL} />
  </div>
);

// ─── Pay Point Breakdown ──────────────────────────────────────────────────────
const PayPointBreakdown = () => {
  const payPoints = [...new Set(EMPLOYEES.map(e => e.payPoint))];
  const total = EMPLOYEES.length;
  const dotColors = [C.info, C.active, C.warning, "#7A3060", C.terra];
  return (
    <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: "20px" }}>
      <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 14 }}>Headcount by Pay Point</h3>
      {payPoints.map((pp, i) => {
        const count = EMPLOYEES.filter(e => e.payPoint === pp).length;
        const pct = Math.round((count / total) * 100);
        const color = dotColors[i % dotColors.length];
        return (
          <div key={pp} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
                <span style={{ fontSize: 12, color: C.ink, fontWeight: 500 }}>{pp}</span>
              </div>
              <span style={{ fontSize: 12, color: C.muted }}>{count} · {pct}%</span>
            </div>
            <div style={{ height: 6, background: C.surface, borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 3, opacity: 0.7 }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard({ onNavigate }) {
  const finalisedCount = PAYSLIP_STATUS.filter(p => p.status === "Finalised").length;
  const pendingCount = PAYSLIP_STATUS.filter(p => p.status === "Pending").length;
  const totalNett = PAYSLIP_STATUS.reduce((s, p) => s + p.nett, 0);
  const totalPayroll = MONTHLY_PAYROLL[MONTHLY_PAYROLL.length - 1].amount;
  const prevPayroll = MONTHLY_PAYROLL[MONTHLY_PAYROLL.length - 2].amount;
  const trend = Math.round(((totalPayroll - prevPayroll) / prevPayroll) * 100);
  const pendingRequests = 1;

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px", ...DOTS_BG }}>

      {/* Greeting */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 700, color: C.ink, marginBottom: 2 }}>Good morning, Brandon 👋</h2>
        <p style={{ fontSize: 13, color: C.muted }}>Here's what needs your attention today — 31 May 2025</p>
      </div>

      {/* Alerts */}
      <div style={{ marginBottom: 20 }}>
        <AlertsCard alerts={ALERTS} onNavigate={onNavigate} />
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        <StatCard icon="ti-users" label="Active Employees" value={EMPLOYEES.length} sub="1 inactive" color={C.olive} bg="rgba(101,109,74,0.1)" onClick={() => onNavigate("employees")} />
        <StatCard icon="ti-cash" label="May Nett Payroll" value={fmtShort(totalNett)} sub={`${finalisedCount} payslips finalised`} color={C.info} bg={C.infoBg} trend={trend} onClick={() => onNavigate("payruns")} />
        <StatCard icon="ti-clock" label="Pending Payslips" value={pendingCount} sub="Need finalisation" color={pendingCount > 0 ? C.warning : C.active} bg={pendingCount > 0 ? C.warningBg : C.activeBg} onClick={() => onNavigate("payruns")} />
        <StatCard icon="ti-inbox" label="Pending Requests" value={pendingRequests} sub="Leave & info updates" color={pendingRequests > 0 ? C.danger : C.active} bg={pendingRequests > 0 ? C.dangerBg : C.activeBg} onClick={() => onNavigate("filing")} />
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: 20 }}>
        <QuickActions onNavigate={onNavigate} />
      </div>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
        <PayrollProgress payslips={PAYSLIP_STATUS} onNavigate={onNavigate} />
        <PayrollTrend />
        <LeaveThisWeek onLeave={LEAVE_ON} upcoming={UPCOMING_LEAVE} />
      </div>

      {/* Bottom grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        <ActivityFeed />
        <PayPointBreakdown />
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <LowLeaveBalances />
          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: "16px 18px" }}>
            <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 12 }}>Work Anniversaries — June</h3>
            {EMPLOYEES.filter(e => {
              const month = new Date(e.dateOfAppointment).getMonth();
              return month === 5;
            }).map((emp, i) => {
              const av = getAvatarColor(emp.firstName + emp.lastName);
              const years = new Date().getFullYear() - new Date(emp.dateOfAppointment).getFullYear();
              return (
                <div key={emp.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < 2 ? 8 : 0 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: av.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: av.text }}>{initials(emp.firstName, emp.lastName)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: C.ink }}>{emp.firstName} {emp.lastName}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{years} year{years !== 1 ? "s" : ""} on {new Date(emp.dateOfAppointment).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}</div>
                  </div>
                  <i className="ti ti-award" aria-hidden="true" style={{ fontSize: 16, color: C.wheat }} />
                </div>
              );
            })}
            {EMPLOYEES.filter(e => new Date(e.dateOfAppointment).getMonth() === 5).length === 0 && (
              <p style={{ fontSize: 12, color: C.sageMid }}>No anniversaries this month</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}