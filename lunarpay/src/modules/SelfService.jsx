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

const initials = (f, l) => `${f[0]}${l[0]}`.toUpperCase();
const AVATAR_COLORS = [
  { bg: "#E8F0E8", text: "#4A5240" }, { bg: "#F5EDE8", text: "#936639" },
  { bg: "#EAF1F8", text: "#2A5C8A" }, { bg: "#F0EDE4", text: "#656D4A" },
  { bg: "#F5EAF0", text: "#8A4A6A" }, { bg: "#EAF5ED", text: "#2D6B45" },
];
const getAvatarColor = (name) => { let h = 0; for (let c of name) h = c.charCodeAt(0) + ((h << 5) - h); return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]; };

const EMPLOYEES = [
  { id: "0001", firstName: "Jane", lastName: "Brown", payPoint: "Finance", email: "jane.brown@demo.co.za", payFrequency: "Monthly" },
  { id: "0002", firstName: "John", lastName: "Smith", payPoint: "Operations", email: "john.smith@demo.co.za", payFrequency: "Monthly" },
  { id: "0003", firstName: "Paige", lastName: "Turner", payPoint: "Marketing", email: "paige.turner@demo.co.za", payFrequency: "Monthly" },
  { id: "0004", firstName: "Gail", lastName: "Forcewind", payPoint: "Human Resources", email: "gail.f@demo.co.za", payFrequency: "Weekly" },
  { id: "0005", firstName: "Walter", lastName: "Melon", payPoint: "Operations", email: "w.melon@demo.co.za", payFrequency: "Weekly" },
  { id: "0006", firstName: "Celeste", lastName: "Fankomo", payPoint: "Operations", email: "c.fankomo@demo.co.za", payFrequency: "Monthly" },
];

const PAYSLIPS = [
  { id: "PS001", empId: "0001", period: "May 2025", date: "2025-05-31", nett: 24423, released: true },
  { id: "PS002", empId: "0001", period: "April 2025", date: "2025-04-30", nett: 22783, released: true },
  { id: "PS003", empId: "0001", period: "March 2025", date: "2025-03-31", nett: 22783, released: false },
  { id: "PS004", empId: "0002", period: "May 2025", date: "2025-05-31", nett: 27623, released: true },
  { id: "PS005", empId: "0002", period: "April 2025", date: "2025-04-30", nett: 27623, released: true },
  { id: "PS006", empId: "0003", period: "May 2025", date: "2025-05-31", nett: 19093, released: true },
  { id: "PS007", empId: "0004", period: "May 2025", date: "2025-05-31", nett: 14763, released: false },
  { id: "PS008", empId: "0005", period: "May 2025", date: "2025-05-31", nett: 11760, released: false },
  { id: "PS009", empId: "0006", period: "May 2025", date: "2025-05-31", nett: 20883, released: true },
];

const INITIAL_REQUESTS = [
  { id: "REQ001", empId: "0001", type: "Leave", date: "2025-05-20", details: "Annual Leave: June 16–20 2025 (5 working days)", status: "Pending", comment: "" },
  { id: "REQ002", empId: "0002", type: "Info Update", date: "2025-05-18", details: "Banking details update — new Capitec account", status: "Approved", comment: "Verified with HR" },
  { id: "REQ003", empId: "0003", type: "Leave", date: "2025-05-15", details: "Sick Leave: May 28 2025 (1 day)", status: "Denied", comment: "Medical certificate required" },
  { id: "REQ004", empId: "0004", type: "Leave", date: "2025-05-22", details: "Annual Leave: July 7–11 2025 (5 working days)", status: "Pending", comment: "" },
];

const INITIAL_SS_SETTINGS = {
  attachPayslips: true, allowTaxCerts: false,
  disableLeaveRequests: false, disableInfoUpdates: false,
};

const INITIAL_LEAVE_SETTINGS = {
  approverCanSeeAll: "All Employees", employeesCanSeeAll: "No Employees",
  showAnnual: true, showSick: false, showCompassionate: true, showUnpaid: true,
};

const INITIAL_ENABLED = { "0001": true, "0002": true, "0003": false, "0004": true, "0005": false, "0006": true };

const INITIAL_APPROVAL_GROUPS = [
  { id: 1, type: "Leave", approvalMode: "single approver", approvers: ["Admin (admin@demo.co.za)"], submitters: ["All Employees"] },
];

const fmt = (n) => `R ${Number(n).toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// ─── Primitives ───────────────────────────────────────────────────────────────
const Btn = ({ children, onClick, variant = "primary", style: s = {}, disabled }) => {
  const base = { fontFamily: FONT_BODY, fontWeight: 500, fontSize: 13, borderRadius: 8, padding: "9px 18px", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, border: "none", display: "inline-flex", alignItems: "center", gap: 6, transition: "opacity 0.15s" };
  const v = { primary: { background: C.olive, color: "#F5F2EA" }, ghost: { background: "transparent", color: C.muted, border: `1px solid ${C.cardBorder}` }, accent: { background: C.wheat, color: C.ink, fontWeight: 600 }, danger: { background: "transparent", color: C.danger, border: `1px solid rgba(139,58,30,0.3)` }, success: { background: C.activeBg, color: C.active, border: `1px solid rgba(45,107,69,0.2)` } };
  return <button onClick={onClick} disabled={disabled} style={{ ...base, ...v[variant], ...s }}>{children}</button>;
};

const Badge = ({ children, color, bg }) => (
  <span style={{ background: bg, color, fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 20, whiteSpace: "nowrap" }}>{children}</span>
);

const Toggle = ({ checked, onChange }) => (
  <div onClick={onChange} style={{ width: 40, height: 22, borderRadius: 11, background: checked ? C.olive : C.cardBorder, cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
    <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: checked ? 21 : 3, transition: "left 0.2s" }} />
  </div>
);

const Checkbox = ({ checked, onChange, label }) => (
  <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", userSelect: "none" }}>
    <div onClick={onChange} style={{ width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${checked ? C.olive : C.cardBorder}`, background: checked ? C.olive : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
      {checked && <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>✓</span>}
    </div>
    {label && <span style={{ fontSize: 14, color: C.ink }}>{label}</span>}
  </label>
);

const Field = ({ label, children }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ display: "block", fontSize: 11, color: C.muted, marginBottom: 5, letterSpacing: "0.05em", textTransform: "uppercase", fontWeight: 500 }}>{label}</label>
    {children}
  </div>
);

const Divider = () => <div style={{ height: 1, background: C.cardBorder, margin: "16px 0" }} />;

const SectionCard = ({ title, children }) => (
  <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
    <div style={{ padding: "14px 20px", background: C.surface, borderBottom: `1px solid ${C.cardBorder}` }}>
      <span style={{ fontFamily: FONT_DISPLAY, fontSize: 14, fontWeight: 700, color: C.ink }}>{title}</span>
    </div>
    <div style={{ padding: "18px 20px" }}>{children}</div>
  </div>
);

const StatusBadge = ({ status }) => {
  const map = { Pending: { color: C.warning, bg: C.warningBg }, Approved: { color: C.active, bg: C.activeBg }, Denied: { color: C.danger, bg: C.dangerBg } };
  const s = map[status] || map.Pending;
  return <Badge color={s.color} bg={s.bg}>{status}</Badge>;
};

// ─── Employee Portal ──────────────────────────────────────────────────────────
function EmployeePortal({ employee, payslips, requests, onClose, onSubmitRequest }) {
  const [portalTab, setPortalTab] = useState("payslips");
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [showInfoForm, setShowInfoForm] = useState(false);
  const [leaveForm, setLeaveForm] = useState({ type: "Annual", from: "", to: "", notes: "" });
  const [infoForm, setInfoForm] = useState({ field: "Banking Details", details: "" });

  const av = getAvatarColor(employee.firstName + employee.lastName);
  const empPayslips = payslips.filter(p => p.empId === employee.id && p.released);
  const empRequests = requests.filter(r => r.empId === employee.id);

  const tabs = [
    { id: "payslips", label: "Payslips", icon: "ti-file-text" },
    { id: "requests", label: "Requests", icon: "ti-send" },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(51,61,41,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, backdropFilter: "blur(3px)" }}>
      <div style={{ width: 680, maxHeight: "88vh", display: "flex", flexDirection: "column", borderRadius: 16, overflow: "hidden", border: `1px solid ${C.cardBorder}`, boxShadow: "0 32px 80px rgba(51,61,41,0.25)" }}>

        {/* Portal header */}
        <div style={{ background: C.forest, padding: "16px 24px", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(194,197,170,0.2)", border: "1.5px solid rgba(194,197,170,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: C.sage, flexShrink: 0 }}>
            {initials(employee.firstName, employee.lastName)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 700, color: "#E8E4D8" }}>{employee.firstName} {employee.lastName}</div>
            <div style={{ fontSize: 12, color: C.sageMid }}>{employee.payPoint} · Self-Service Portal</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ fontSize: 11, color: C.sageMid, background: "rgba(194,197,170,0.1)", padding: "4px 10px", borderRadius: 20 }}>Employee view</div>
            <button onClick={onClose} style={{ background: "none", border: "none", color: C.sageMid, cursor: "pointer", fontSize: 18, padding: 4 }}>✕</button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ background: "#2e3a28", display: "flex", padding: "0 24px", borderBottom: "1px solid rgba(74,82,64,0.5)" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setPortalTab(t.id)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "12px 16px", border: "none", background: "none", borderBottom: portalTab === t.id ? `2px solid ${C.wheat}` : "2px solid transparent", color: portalTab === t.id ? C.wheat : C.sageMid, cursor: "pointer", fontSize: 13, fontWeight: portalTab === t.id ? 600 : 400, fontFamily: FONT_BODY }}>
              <i className={`ti ${t.icon}`} aria-hidden="true" style={{ fontSize: 14 }} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", background: C.pageBg, ...DOTS_BG }}>

          {/* Payslips tab */}
          {portalTab === "payslips" && (
            <div style={{ padding: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
                {[["Available Payslips", empPayslips.length, C.info], ["Latest Nett Pay", fmt(empPayslips[0]?.nett || 0), C.olive], ["Last Period", empPayslips[0]?.period || "—", C.muted]].map(([label, val, color]) => (
                  <div key={label} style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 10, padding: "14px 16px" }}>
                    <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{label}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, fontFamily: FONT_DISPLAY, color }}>{val}</div>
                  </div>
                ))}
              </div>
              {empPayslips.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: C.sageMid, fontSize: 13 }}>No payslips have been released yet</div>
              ) : (
                <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, overflow: "hidden" }}>
                  {empPayslips.map((ps, i) => (
                    <div key={ps.id} style={{ display: "flex", alignItems: "center", padding: "14px 18px", borderBottom: i < empPayslips.length - 1 ? `1px solid ${C.cardBorder}` : "none", cursor: "pointer", transition: "background 0.12s" }}
                      onMouseEnter={ev => ev.currentTarget.style.background = C.surface}
                      onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: C.infoBg, display: "flex", alignItems: "center", justifyContent: "center", marginRight: 14, flexShrink: 0 }}>
                        <i className="ti ti-file-text" style={{ fontSize: 16, color: C.info }} aria-hidden="true" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 500, color: C.ink }}>Payslip — {ps.period}</div>
                        <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{ps.date}</div>
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: C.olive, marginRight: 16 }}>{fmt(ps.nett)}</div>
                      <Btn variant="ghost" style={{ padding: "6px 12px", fontSize: 12 }}>
                        <i className="ti ti-download" aria-hidden="true" style={{ fontSize: 12 }} /> Download
                      </Btn>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Requests tab */}
          {portalTab === "requests" && (
            <div style={{ padding: 20 }}>
              {!showLeaveForm && !showInfoForm && (
                <>
                  <div style={{ marginBottom: 18 }}>
                    <p style={{ fontSize: 12, color: C.muted, marginBottom: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Submit a new request</p>
                    <div style={{ display: "flex", gap: 10 }}>
                      <div onClick={() => setShowLeaveForm(true)} style={{ flex: 1, background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: "16px", cursor: "pointer", transition: "all 0.15s" }}
                        onMouseEnter={ev => { ev.currentTarget.style.borderColor = C.olive; ev.currentTarget.style.background = C.surface; }}
                        onMouseLeave={ev => { ev.currentTarget.style.borderColor = C.cardBorder; ev.currentTarget.style.background = C.card; }}>
                        <i className="ti ti-calendar-event" aria-hidden="true" style={{ fontSize: 24, color: C.olive, display: "block", marginBottom: 8 }} />
                        <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 4 }}>Leave Request</div>
                        <div style={{ fontSize: 12, color: C.muted }}>Request annual, sick or other leave</div>
                      </div>
                      <div onClick={() => setShowInfoForm(true)} style={{ flex: 1, background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: "16px", cursor: "pointer", transition: "all 0.15s" }}
                        onMouseEnter={ev => { ev.currentTarget.style.borderColor = C.olive; ev.currentTarget.style.background = C.surface; }}
                        onMouseLeave={ev => { ev.currentTarget.style.borderColor = C.cardBorder; ev.currentTarget.style.background = C.card; }}>
                        <i className="ti ti-user-edit" aria-hidden="true" style={{ fontSize: 24, color: C.info, display: "block", marginBottom: 8 }} />
                        <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 4 }}>Info Update Request</div>
                        <div style={{ fontSize: 12, color: C.muted }}>Update banking, address or personal info</div>
                      </div>
                    </div>
                  </div>
                  <Divider />
                  <p style={{ fontSize: 12, color: C.muted, marginBottom: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Request history</p>
                  {empRequests.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "32px 0", color: C.sageMid, fontSize: 13 }}>No requests submitted yet</div>
                  ) : (
                    <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, overflow: "hidden" }}>
                      {empRequests.map((req, i) => (
                        <div key={req.id} style={{ padding: "14px 18px", borderBottom: i < empRequests.length - 1 ? `1px solid ${C.cardBorder}` : "none" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                            <Badge color={C.info} bg={C.infoBg}>{req.type}</Badge>
                            <StatusBadge status={req.status} />
                            <span style={{ fontSize: 12, color: C.muted, marginLeft: "auto" }}>{req.date}</span>
                          </div>
                          <div style={{ fontSize: 13, color: C.ink, marginTop: 4 }}>{req.details}</div>
                          {req.comment && <div style={{ fontSize: 12, color: C.muted, marginTop: 4, fontStyle: "italic" }}>"{req.comment}"</div>}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Leave request form */}
              {showLeaveForm && (
                <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: "20px" }}>
                  <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 700, color: C.ink, marginBottom: 16 }}>Leave Request</h3>
                  <Field label="Leave type">
                    <select value={leaveForm.type} onChange={e => setLeaveForm(p => ({ ...p, type: e.target.value }))} style={sel}>
                      <option>Annual</option><option>Sick</option><option>Compassionate</option><option>Family Responsibility</option><option>Unpaid</option>
                    </select>
                  </Field>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <Field label="From"><input type="date" value={leaveForm.from} onChange={e => setLeaveForm(p => ({ ...p, from: e.target.value }))} style={inp} /></Field>
                    <Field label="To"><input type="date" value={leaveForm.to} min={leaveForm.from} onChange={e => setLeaveForm(p => ({ ...p, to: e.target.value }))} style={inp} /></Field>
                  </div>
                  <Field label="Notes (optional)">
                    <textarea value={leaveForm.notes} onChange={e => setLeaveForm(p => ({ ...p, notes: e.target.value }))} rows={3} placeholder="Any additional details for the approver..." style={{ ...inp, resize: "vertical" }} />
                  </Field>
                  <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                    <Btn onClick={() => { onSubmitRequest({ id: `REQ${Date.now()}`, empId: employee.id, type: "Leave", date: new Date().toISOString().split("T")[0], details: `${leaveForm.type} Leave: ${leaveForm.from} to ${leaveForm.to}`, status: "Pending", comment: "" }); setShowLeaveForm(false); setLeaveForm({ type: "Annual", from: "", to: "", notes: "" }); }} disabled={!leaveForm.from || !leaveForm.to}>
                      <i className="ti ti-send" aria-hidden="true" /> Submit Request
                    </Btn>
                    <Btn variant="ghost" onClick={() => setShowLeaveForm(false)}>Cancel</Btn>
                  </div>
                </div>
              )}

              {/* Info update form */}
              {showInfoForm && (
                <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: "20px" }}>
                  <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 700, color: C.ink, marginBottom: 16 }}>Info Update Request</h3>
                  <Field label="What would you like to update?">
                    <select value={infoForm.field} onChange={e => setInfoForm(p => ({ ...p, field: e.target.value }))} style={sel}>
                      <option>Banking Details</option><option>Residential Address</option><option>Contact Number</option><option>Emergency Contact</option><option>Tax Number</option>
                    </select>
                  </Field>
                  <Field label="Details of change">
                    <textarea value={infoForm.details} onChange={e => setInfoForm(p => ({ ...p, details: e.target.value }))} rows={4} placeholder="Provide the new details clearly..." style={{ ...inp, resize: "vertical" }} />
                  </Field>
                  <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                    <Btn onClick={() => { onSubmitRequest({ id: `REQ${Date.now()}`, empId: employee.id, type: "Info Update", date: new Date().toISOString().split("T")[0], details: `${infoForm.field}: ${infoForm.details}`, status: "Pending", comment: "" }); setShowInfoForm(false); setInfoForm({ field: "Banking Details", details: "" }); }} disabled={!infoForm.details.trim()}>
                      <i className="ti ti-send" aria-hidden="true" /> Submit Request
                    </Btn>
                    <Btn variant="ghost" onClick={() => setShowInfoForm(false)}>Cancel</Btn>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Approval Modal ────────────────────────────────────────────────────────────
function ApprovalModal({ request, employee, onClose, onAction }) {
  const [decision, setDecision] = useState("Approve");
  const [comment, setComment] = useState("");
  const av = getAvatarColor(employee.firstName + employee.lastName);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(51,61,41,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, backdropFilter: "blur(2px)" }}>
      <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16, width: 480, overflow: "hidden", boxShadow: "0 24px 60px rgba(51,61,41,0.2)" }}>
        <div style={{ padding: "20px 24px", background: C.surface, borderBottom: `1px solid ${C.cardBorder}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 700, color: C.ink }}>Review Request</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 18 }}>✕</button>
        </div>
        <div style={{ padding: "20px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, background: C.surface, borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: av.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: av.text }}>{initials(employee.firstName, employee.lastName)}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: C.ink }}>{employee.firstName} {employee.lastName}</div>
              <div style={{ fontSize: 12, color: C.muted }}>{request.date}</div>
            </div>
            <Badge color={C.info} bg={C.infoBg} style={{ marginLeft: "auto" }}>{request.type}</Badge>
          </div>
          <div style={{ background: C.surface, borderRadius: 8, padding: "12px 14px", marginBottom: 16, fontSize: 13, color: C.ink, lineHeight: 1.6 }}>{request.details}</div>
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10, fontWeight: 500 }}>Decision</p>
            <div style={{ display: "flex", gap: 8 }}>
              {["Approve", "Deny", "No Decision"].map(d => (
                <label key={d} onClick={() => setDecision(d)} style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer", padding: "8px 14px", borderRadius: 8, border: `1px solid ${decision === d ? C.olive : C.cardBorder}`, background: decision === d ? "rgba(101,109,74,0.08)" : "transparent", fontSize: 13, color: decision === d ? C.olive : C.muted, userSelect: "none", transition: "all 0.12s" }}>
                  <div style={{ width: 14, height: 14, borderRadius: "50%", border: `2px solid ${decision === d ? C.olive : C.cardBorder}`, background: decision === d ? C.olive : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {decision === d && <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff" }} />}
                  </div>
                  {d}
                </label>
              ))}
            </div>
          </div>
          <Field label="Comment (optional)">
            <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} placeholder="Add a note for the employee..." style={{ ...inp, resize: "vertical" }} />
          </Field>
        </div>
        <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.cardBorder}`, background: C.surface, display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn variant={decision === "Approve" ? "accent" : decision === "Deny" ? "danger" : "ghost"} onClick={() => { onAction(request.id, decision === "Approve" ? "Approved" : decision === "Deny" ? "Denied" : "Pending", comment); onClose(); }}>
            <i className={`ti ${decision === "Approve" ? "ti-check" : decision === "Deny" ? "ti-x" : "ti-minus"}`} aria-hidden="true" />
            {decision === "No Decision" ? "Save" : decision}
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ─── Main Self-Service Component ──────────────────────────────────────────────
export default function SelfService() {
  const [tab, setTab] = useState("users");
  const [enabled, setEnabled] = useState(INITIAL_ENABLED);
  const [emails, setEmails] = useState(Object.fromEntries(EMPLOYEES.map(e => [e.id, e.email])));
  const [ssSettings, setSsSettings] = useState(INITIAL_SS_SETTINGS);
  const [leaveSettings, setLeaveSettings] = useState(INITIAL_LEAVE_SETTINGS);
  const [approvalGroups, setApprovalGroups] = useState(INITIAL_APPROVAL_GROUPS);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [payslips, setPayslips] = useState(PAYSLIPS);
  const [portalEmp, setPortalEmp] = useState(null);
  const [approvalModal, setApprovalModal] = useState(null);
  const [saved, setSaved] = useState(false);
  const [releasedPeriod, setReleasedPeriod] = useState(null);

  const pendingRequests = requests.filter(r => r.status === "Pending");

  const handleApprovalAction = (reqId, status, comment) => {
    setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status, comment } : r));
  };

  const handleSubmitRequest = (req) => {
    setRequests(prev => [...prev, req]);
  };

  const handleRelease = (period) => {
    setPayslips(prev => prev.map(p => p.period === period ? { ...p, released: true } : p));
    setReleasedPeriod(period);
    setTimeout(() => setReleasedPeriod(null), 3000);
  };

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const tabs = [
    { id: "users", label: "Employee Users", icon: "ti-users" },
    { id: "settings", label: "Settings", icon: "ti-settings" },
    { id: "approvals", label: "Approval Groups", icon: "ti-checks" },
    { id: "requests", label: "Requests", icon: "ti-inbox", badge: pendingRequests.length },
    { id: "release", label: "Release Payslips", icon: "ti-send" },
  ];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", ...DOTS_BG }}>

      {/* Sub-tabs */}
      <div style={{ padding: "0 32px", borderBottom: `1px solid ${C.cardBorder}`, background: "rgba(245,242,234,0.92)", display: "flex", gap: 0, flexShrink: 0 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "13px 18px", border: "none", background: "none", borderBottom: tab === t.id ? `2px solid ${C.olive}` : "2px solid transparent", color: tab === t.id ? C.olive : C.muted, cursor: "pointer", fontSize: 13, fontWeight: tab === t.id ? 600 : 400, fontFamily: FONT_BODY, transition: "color 0.15s", position: "relative" }}>
            <i className={`ti ${t.icon}`} aria-hidden="true" style={{ fontSize: 15 }} />
            {t.label}
            {t.badge > 0 && <span style={{ background: C.danger, color: "#fff", fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 10, marginLeft: 2 }}>{t.badge}</span>}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>

        {/* Employee Users */}
        {tab === "users" && (
          <div style={{ padding: "28px 32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 15, fontWeight: 700, color: C.ink, marginBottom: 4 }}>Employee Self-Service Users</h3>
                <p style={{ fontSize: 13, color: C.muted }}>Enable employees to access payslips and submit requests. They will receive an email invitation to create their account.</p>
              </div>
              <Btn onClick={save} variant={saved ? "success" : "primary"}>
                {saved ? <><i className="ti ti-check" aria-hidden="true" /> Saved</> : "Save Changes"}
              </Btn>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr", padding: "10px 20px", background: C.surface, borderBottom: `1px solid ${C.cardBorder}` }}>
                {["Employee", "Email", "Enabled", "Preview"].map(h => (
                  <span key={h} style={{ fontSize: 11, color: C.sageMid, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>{h}</span>
                ))}
              </div>
              {EMPLOYEES.map((emp, i) => {
                const av = getAvatarColor(emp.firstName + emp.lastName);
                const isEnabled = enabled[emp.id];
                return (
                  <div key={emp.id} style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr", padding: "14px 20px", borderBottom: i < EMPLOYEES.length - 1 ? `1px solid ${C.cardBorder}` : "none", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: av.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: av.text }}>{initials(emp.firstName, emp.lastName)}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: C.ink }}>{emp.lastName}, {emp.firstName}</div>
                        <div style={{ fontSize: 11, color: C.muted }}>{emp.payPoint}</div>
                      </div>
                    </div>
                    <div style={{ paddingRight: 16 }}>
                      <input value={emails[emp.id] || ""} onChange={e => setEmails(p => ({ ...p, [emp.id]: e.target.value }))} style={{ ...inp, fontSize: 12, padding: "7px 11px" }} placeholder="email@company.co.za" />
                    </div>
                    <div>
                      <Toggle checked={isEnabled} onChange={() => setEnabled(p => ({ ...p, [emp.id]: !p[emp.id] }))} />
                    </div>
                    <div>
                      {isEnabled && (
                        <Btn variant="ghost" style={{ padding: "5px 12px", fontSize: 11 }} onClick={() => setPortalEmp(emp)}>
                          <i className="ti ti-eye" aria-hidden="true" style={{ fontSize: 12 }} /> Portal
                        </Btn>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <p style={{ fontSize: 12, color: C.sageMid, marginTop: 12 }}>{Object.values(enabled).filter(Boolean).length} of {EMPLOYEES.length} employees have self-service enabled</p>
          </div>
        )}

        {/* Settings */}
        {tab === "settings" && (
          <div style={{ padding: "28px 32px", maxWidth: 640 }}>
            <SectionCard title="General Settings">
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  ["attachPayslips", "Attach payslips to emails on self-service release", "Employees receive a PDF of their payslip when released"],
                  ["allowTaxCerts", "Allow tax certificates to be released to self-service", "For companies with historic tax certificates"],
                ].map(([key, label, sub]) => (
                  <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.cardBorder}` }}>
                    <div>
                      <div style={{ fontSize: 14, color: C.ink, fontWeight: 500 }}>{label}</div>
                      <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{sub}</div>
                    </div>
                    <Toggle checked={ssSettings[key]} onChange={() => setSsSettings(p => ({ ...p, [key]: !p[key] }))} />
                  </div>
                ))}
                <div style={{ marginTop: 4 }}>
                  <p style={{ fontSize: 12, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Disable Request Types</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 14, color: C.ink }}>Disable leave requests</span>
                      <Toggle checked={ssSettings.disableLeaveRequests} onChange={() => setSsSettings(p => ({ ...p, disableLeaveRequests: !p.disableLeaveRequests }))} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 14, color: C.ink }}>Disable info update requests</span>
                      <Toggle checked={ssSettings.disableInfoUpdates} onChange={() => setSsSettings(p => ({ ...p, disableInfoUpdates: !p.disableInfoUpdates }))} />
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 18 }}><Btn onClick={save} variant={saved ? "success" : "primary"}>{saved ? <><i className="ti ti-check" aria-hidden="true" /> Saved</> : "Save Settings"}</Btn></div>
            </SectionCard>

            <SectionCard title="Leave Settings">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                <Field label="Approvers can see overview for">
                  <select value={leaveSettings.approverCanSeeAll} onChange={e => setLeaveSettings(p => ({ ...p, approverCanSeeAll: e.target.value }))} style={sel}>
                    <option>No Employees</option><option>All Employees</option><option>Pay Point Only</option>
                  </select>
                </Field>
                <Field label="Employees can see overview for">
                  <select value={leaveSettings.employeesCanSeeAll} onChange={e => setLeaveSettings(p => ({ ...p, employeesCanSeeAll: e.target.value }))} style={sel}>
                    <option>No Employees</option><option>All Employees</option><option>Pay Point Only</option>
                  </select>
                </Field>
              </div>
              <p style={{ fontSize: 12, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Display leave balances to employees</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[["showAnnual", "Annual Leave"], ["showSick", "Sick Leave"], ["showCompassionate", "Compassionate Leave"], ["showUnpaid", "Unpaid Leave"]].map(([key, label]) => (
                  <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: C.surface, borderRadius: 8, padding: "10px 14px" }}>
                    <span style={{ fontSize: 13, color: C.ink }}>{label}</span>
                    <Toggle checked={leaveSettings[key]} onChange={() => setLeaveSettings(p => ({ ...p, [key]: !p[key] }))} />
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16 }}><Btn onClick={save} variant={saved ? "success" : "primary"}>{saved ? <><i className="ti ti-check" aria-hidden="true" /> Saved</> : "Save Settings"}</Btn></div>
            </SectionCard>
          </div>
        )}

        {/* Approval Groups */}
        {tab === "approvals" && (
          <div style={{ padding: "28px 32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 15, fontWeight: 700, color: C.ink, marginBottom: 4 }}>Approval Groups</h3>
                <p style={{ fontSize: 13, color: C.muted }}>Define who approves leave and info update requests. Multiple groups can be created for different teams.</p>
              </div>
              <Btn onClick={() => setApprovalGroups(p => [...p, { id: Date.now(), type: "Leave", approvalMode: "single approver", approvers: [], submitters: [] }])}>
                <i className="ti ti-plus" aria-hidden="true" /> Add Group
              </Btn>
            </div>
            {approvalGroups.map((group, i) => (
              <div key={group.id} style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: "20px", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <Badge color={C.info} bg={C.infoBg}>{group.type}</Badge>
                  <span style={{ fontSize: 13, color: C.muted }}>Approval Group {i + 1}</span>
                  <button onClick={() => setApprovalGroups(p => p.filter(g => g.id !== group.id))} style={{ marginLeft: "auto", background: "none", border: "none", color: C.danger, cursor: "pointer", fontSize: 12, fontFamily: FONT_BODY }}>
                    <i className="ti ti-trash" aria-hidden="true" /> Remove
                  </button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <Field label="Request type">
                    <select value={group.type} onChange={e => setApprovalGroups(p => p.map(g => g.id === group.id ? { ...g, type: e.target.value } : g))} style={sel}>
                      <option>Leave</option><option>Info Updates</option>
                    </select>
                  </Field>
                  <Field label="Requests will be approved by">
                    <select value={group.approvalMode} onChange={e => setApprovalGroups(p => p.map(g => g.id === group.id ? { ...g, approvalMode: e.target.value } : g))} style={sel}>
                      <option>single approver</option>
                      <option>any of</option>
                      <option>all of</option>
                      <option>all in order</option>
                    </select>
                  </Field>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <p style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8, fontWeight: 500 }}>Approvers</p>
                    <div style={{ background: C.surface, borderRadius: 8, padding: "10px 12px", minHeight: 60, fontSize: 13, color: C.ink }}>
                      {group.approvers.length === 0 ? <span style={{ color: C.sageMid }}>No approvers added</span> : group.approvers.map((a, ai) => <div key={ai} style={{ marginBottom: 4 }}>· {a}</div>)}
                    </div>
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8, fontWeight: 500 }}>Submitters</p>
                    <div style={{ background: C.surface, borderRadius: 8, padding: "10px 12px", minHeight: 60, fontSize: 13, color: C.ink }}>
                      {group.submitters.length === 0 ? <span style={{ color: C.sageMid }}>No submitters assigned</span> : group.submitters.map((s, si) => <div key={si} style={{ marginBottom: 4 }}>· {s}</div>)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {approvalGroups.length === 0 && (
              <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: "40px", textAlign: "center", color: C.sageMid, fontSize: 13 }}>
                No approval groups yet. Click Add Group to create one.
              </div>
            )}
          </div>
        )}

        {/* Requests */}
        {tab === "requests" && (
          <div style={{ padding: "28px 32px" }}>
            <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
              {[["Pending", pendingRequests.length, C.warning, C.warningBg], ["Approved", requests.filter(r => r.status === "Approved").length, C.active, C.activeBg], ["Denied", requests.filter(r => r.status === "Denied").length, C.danger, C.dangerBg]].map(([label, count, color, bg]) => (
                <div key={label} style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 10, padding: "14px 20px", flex: 1 }}>
                  <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{label}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, fontFamily: FONT_DISPLAY, color }}>{count}</div>
                </div>
              ))}
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 2fr 1fr 1fr", padding: "10px 20px", background: C.surface, borderBottom: `1px solid ${C.cardBorder}` }}>
                {["Employee", "Type", "Date", "Details", "Status", ""].map(h => (
                  <span key={h} style={{ fontSize: 11, color: C.sageMid, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>{h}</span>
                ))}
              </div>
              {requests.map((req, i) => {
                const emp = EMPLOYEES.find(e => e.id === req.empId);
                if (!emp) return null;
                const av = getAvatarColor(emp.firstName + emp.lastName);
                return (
                  <div key={req.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 2fr 1fr 1fr", padding: "13px 20px", borderBottom: i < requests.length - 1 ? `1px solid ${C.cardBorder}` : "none", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: av.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: av.text }}>{initials(emp.firstName, emp.lastName)}</div>
                      <span style={{ fontSize: 13, fontWeight: 500, color: C.ink }}>{emp.firstName} {emp.lastName}</span>
                    </div>
                    <Badge color={C.info} bg={C.infoBg}>{req.type}</Badge>
                    <span style={{ fontSize: 12, color: C.muted }}>{req.date}</span>
                    <span style={{ fontSize: 12, color: C.ink, paddingRight: 8 }}>{req.details}</span>
                    <StatusBadge status={req.status} />
                    <div>
                      {req.status === "Pending" && (
                        <Btn variant="ghost" style={{ padding: "5px 12px", fontSize: 11 }} onClick={() => setApprovalModal({ request: req, employee: emp })}>
                          Review <i className="ti ti-arrow-right" aria-hidden="true" style={{ fontSize: 11 }} />
                        </Btn>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Release Payslips */}
        {tab === "release" && (
          <div style={{ padding: "28px 32px" }}>
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 15, fontWeight: 700, color: C.ink, marginBottom: 4 }}>Release Payslips to Self-Service</h3>
              <p style={{ fontSize: 13, color: C.muted }}>Only released payslips are visible to employees in their self-service portal.</p>
            </div>
            {releasedPeriod && (
              <div style={{ background: C.activeBg, border: `1px solid rgba(45,107,69,0.2)`, borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: C.active, display: "flex", alignItems: "center", gap: 8 }}>
                <i className="ti ti-check" aria-hidden="true" />
                Payslips for <strong>{releasedPeriod}</strong> released to self-service. Employees will receive an email notification.
              </div>
            )}
            {["May 2025", "April 2025", "March 2025"].map(period => {
              const periodPayslips = payslips.filter(p => p.period === period);
              const releasedCount = periodPayslips.filter(p => p.released).length;
              const allReleased = releasedCount === periodPayslips.length;
              return (
                <div key={period} style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: "18px 20px", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontFamily: FONT_DISPLAY, fontSize: 15, fontWeight: 600, color: C.ink }}>{period}</div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>{periodPayslips.length} payslips · {releasedCount} released</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ display: "flex", gap: 3 }}>
                      {periodPayslips.map(ps => (
                        <div key={ps.id} style={{ width: 8, height: 8, borderRadius: "50%", background: ps.released ? C.active : C.cardBorder }} title={ps.released ? "Released" : "Not released"} />
                      ))}
                    </div>
                    {allReleased
                      ? <Badge color={C.active} bg={C.activeBg}>All Released</Badge>
                      : <Btn variant="accent" style={{ fontSize: 12, padding: "7px 14px" }} onClick={() => handleRelease(period)}>
                          <i className="ti ti-send" aria-hidden="true" /> Release to Self-Service
                        </Btn>
                    }
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {portalEmp && (
        <EmployeePortal
          employee={portalEmp}
          payslips={payslips}
          requests={requests.filter(r => r.empId === portalEmp.id)}
          onClose={() => setPortalEmp(null)}
          onSubmitRequest={handleSubmitRequest}
        />
      )}

      {approvalModal && (
        <ApprovalModal
          request={approvalModal.request}
          employee={approvalModal.employee}
          onClose={() => setApprovalModal(null)}
          onAction={handleApprovalAction}
        />
      )}
    </div>
  );
}