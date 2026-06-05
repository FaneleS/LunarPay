import { useState } from "react";

const C = {
  pageBg: "#F5F2EA", surface: "#EDE8DC", card: "#FDFAF4", cardBorder: "#D8D4C8",
  olive: "#656D4A", forest: "#3A4232", sage: "#C2C5AA", sageMid: "#A4AC86",
  ink: "#333D29", wheat: "#C4B470", terra: "#936639", muted: "#7F7455",
  active: "#2D6B45", activeBg: "#EDF5F0", danger: "#8B3A1E", dangerBg: "#F5EDE8",
  info: "#2A5C8A", infoBg: "#EAF1F8",
};
const FONT_DISPLAY = "'Syne', sans-serif";
const FONT_BODY = "'DM Sans', sans-serif";

const inp = {
  background: "#2e3a28", border: `1px solid rgba(194,197,170,0.2)`,
  color: "#E8E4D8", borderRadius: 8, padding: "9px 13px", fontSize: 13,
  width: "100%", fontFamily: FONT_BODY, outline: "none",
};

const COMPANY_COLORS = [
  { bg: "rgba(196,180,112,0.2)", text: "#C4B470" },
  { bg: "rgba(90,138,92,0.2)", text: "#7ABD7E" },
  { bg: "rgba(90,120,180,0.2)", text: "#7AA0E0" },
  { bg: "rgba(180,90,90,0.2)", text: "#E09090" },
  { bg: "rgba(150,90,180,0.2)", text: "#C090E0" },
];

const getCompanyColor = (name) => {
  let h = 0; for (let c of name) h = c.charCodeAt(0) + ((h << 5) - h);
  return COMPANY_COLORS[Math.abs(h) % COMPANY_COLORS.length];
};

const companyInitials = (name) => {
  const words = name.trim().split(" ").filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

// ─── Add Company Modal ─────────────────────────────────────────────────────────
function AddCompanyModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name: "", tradingName: "", regNumber: "",
    taxNumber: "", uifRef: "", industry: "General",
    payrollContact: "", email: "",
  });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const canSave = form.name.trim() && form.email.trim();

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(51,61,41,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 400, backdropFilter: "blur(3px)" }}>
      <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16, width: 520, maxHeight: "88vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 28px 70px rgba(51,61,41,0.25)" }}>
        <div style={{ padding: "22px 28px", background: C.surface, borderBottom: `1px solid ${C.cardBorder}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 700, color: C.ink }}>Add Company</h2>
            <p style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Each company has its own employees, payroll and settings.</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 18 }}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            {[
              ["Registered company name", "name", true, "Pty Ltd or CC name"],
              ["Trading name", "tradingName", false, "Optional"],
              ["Company registration number", "regNumber", false, "e.g. 2020/123456/07"],
              ["PAYE tax number", "taxNumber", false, "e.g. 9876543210"],
              ["UIF reference number", "uifRef", false, "e.g. U123456789"],
              ["Industry", "industry", false, null],
              ["Payroll contact person", "payrollContact", false, "Name of person responsible"],
              ["Payroll email", "email", true, "Used for billing and notifications"],
            ].map(([label, key, required, placeholder]) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 11, color: C.muted, marginBottom: 5, letterSpacing: "0.05em", textTransform: "uppercase", fontWeight: 500 }}>
                  {label}{required && <span style={{ color: C.terra, marginLeft: 2 }}>*</span>}
                </label>
                {key === "industry" ? (
                  <select value={form[key]} onChange={e => set(key, e.target.value)} style={{ background: C.card, border: `1px solid ${C.cardBorder}`, color: C.ink, borderRadius: 8, padding: "9px 13px", fontSize: 13, width: "100%", fontFamily: FONT_BODY, outline: "none" }}>
                    {["General", "Retail", "Manufacturing", "Financial Services", "Construction", "Healthcare", "Education", "Hospitality", "Technology", "Agriculture"].map(i => <option key={i}>{i}</option>)}
                  </select>
                ) : (
                  <input
                    type={key === "email" ? "email" : "text"}
                    value={form[key]}
                    onChange={e => set(key, e.target.value)}
                    placeholder={placeholder || ""}
                    style={{ background: C.card, border: `1px solid ${C.cardBorder}`, color: C.ink, borderRadius: 8, padding: "9px 13px", fontSize: 13, width: "100%", fontFamily: FONT_BODY, outline: "none" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: "16px 28px", borderTop: `1px solid ${C.cardBorder}`, background: C.surface, display: "flex", justifyContent: "space-between" }}>
          <button onClick={onClose} style={{ background: "transparent", color: C.muted, border: `1px solid ${C.cardBorder}`, padding: "9px 18px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontFamily: FONT_BODY }}>Cancel</button>
          <button
            onClick={() => { onAdd({ ...form, id: `co-${Date.now()}`, employeeCount: 0, createdAt: new Date().toISOString().split("T")[0], status: "Active" }); onClose(); }}
            disabled={!canSave}
            style={{ background: canSave ? C.olive : C.sage, color: canSave ? "#F5F2EA" : C.muted, border: "none", padding: "9px 18px", borderRadius: 8, cursor: canSave ? "pointer" : "not-allowed", fontSize: 13, fontFamily: FONT_BODY, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
            <i className="ti ti-plus" aria-hidden="true" /> Add Company
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Company Switcher Dropdown ─────────────────────────────────────────────────
export function CompanySwitcher({ companies, activeCompany, onSwitch, onAdd }) {
  const [open, setOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = companies.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.tradingName || "").toLowerCase().includes(search.toLowerCase())
  );

  const active = companies.find(c => c.id === activeCompany);
  const col = active ? getCompanyColor(active.name) : COMPANY_COLORS[0];

  return (
    <>
      {/* Trigger */}
      <div
        onClick={() => setOpen(p => !p)}
        style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, background: open ? "rgba(194,197,170,0.12)" : "rgba(194,197,170,0.06)", border: `1px solid ${open ? "rgba(194,197,170,0.3)" : "rgba(194,197,170,0.12)"}`, cursor: "pointer", transition: "all 0.15s", userSelect: "none" }}>
        <div style={{ width: 28, height: 28, borderRadius: 7, background: col.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: col.text, flexShrink: 0 }}>
          {active ? companyInitials(active.name) : "?"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#E8E4D8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", lineHeight: 1.2 }}>
            {active?.tradingName || active?.name || "Select company"}
          </div>
          <div style={{ fontSize: 10, color: C.sageMid, marginTop: 1 }}>
            {active ? `${active.employeeCount} employees` : "—"}
          </div>
        </div>
        <i className={`ti ti-chevron-${open ? "up" : "down"}`} aria-hidden="true" style={{ fontSize: 13, color: C.sageMid, flexShrink: 0 }} />
      </div>

      {/* Dropdown */}
      {open && (
        <div style={{ position: "absolute", top: "100%", left: 10, right: 10, background: "#2a3426", border: "1px solid rgba(194,197,170,0.2)", borderRadius: 12, zIndex: 500, boxShadow: "0 16px 40px rgba(20,26,18,0.4)", overflow: "hidden", marginTop: 4 }}>
          {/* Search */}
          <div style={{ padding: "10px 12px", borderBottom: "1px solid rgba(194,197,170,0.1)" }}>
            <div style={{ position: "relative" }}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search companies…"
                style={{ ...inp, paddingLeft: 32, fontSize: 12 }}
                autoFocus
              />
              <i className="ti ti-search" aria-hidden="true" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: C.sageMid, fontSize: 13, pointerEvents: "none" }} />
            </div>
          </div>

          {/* Company list */}
          <div style={{ maxHeight: 240, overflowY: "auto" }}>
            {filtered.length === 0 && (
              <div style={{ padding: "16px 14px", fontSize: 12, color: C.sageMid, textAlign: "center" }}>No companies found</div>
            )}
            {filtered.map(company => {
              const isActive = company.id === activeCompany;
              const cCol = getCompanyColor(company.name);
              return (
                <div
                  key={company.id}
                  onClick={() => { onSwitch(company.id); setOpen(false); setSearch(""); }}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", cursor: "pointer", background: isActive ? "rgba(194,197,170,0.1)" : "transparent", borderBottom: "1px solid rgba(194,197,170,0.06)", transition: "background 0.1s" }}
                  onMouseEnter={ev => !isActive && (ev.currentTarget.style.background = "rgba(194,197,170,0.06)")}
                  onMouseLeave={ev => !isActive && (ev.currentTarget.style.background = "transparent")}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: cCol.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: cCol.text, flexShrink: 0 }}>
                    {companyInitials(company.name)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, color: isActive ? "#E8E4D8" : "#C2C5AA", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {company.tradingName || company.name}
                    </div>
                    <div style={{ fontSize: 10, color: C.sageMid, marginTop: 1 }}>
                      {company.employeeCount} employees · {company.industry || "General"}
                    </div>
                  </div>
                  {isActive && <i className="ti ti-check" aria-hidden="true" style={{ fontSize: 14, color: C.wheat, flexShrink: 0 }} />}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div style={{ padding: "10px 12px", borderTop: "1px solid rgba(194,197,170,0.1)" }}>
            <button
              onClick={() => { setOpen(false); setShowAddModal(true); }}
              style={{ width: "100%", background: "rgba(196,180,112,0.1)", border: "1px solid rgba(196,180,112,0.2)", color: C.wheat, borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontSize: 12, fontFamily: FONT_BODY, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <i className="ti ti-plus" aria-hidden="true" style={{ fontSize: 14 }} />
              Add New Company
            </button>
          </div>
        </div>
      )}

      {showAddModal && (
        <AddCompanyModal
          onClose={() => setShowAddModal(false)}
          onAdd={(company) => { onAdd(company); onSwitch(company.id); }}
        />
      )}

      {/* Backdrop */}
      {open && <div onClick={() => { setOpen(false); setSearch(""); }} style={{ position: "fixed", inset: 0, zIndex: 499 }} />}
    </>
  );
}

// ─── Company Context Store ─────────────────────────────────────────────────────
export const INITIAL_COMPANIES = [
  {
    id: "co-001",
    name: "Demo Company (Pty) Ltd",
    tradingName: "Demo Company",
    regNumber: "2018/123456/07",
    taxNumber: "9876543210",
    uifRef: "U123456789",
    industry: "General",
    payrollContact: "Brandon Louw",
    email: "payroll@demo.co.za",
    employeeCount: 6,
    createdAt: "2021-01-01",
    status: "Active",
  },
  {
    id: "co-002",
    name: "Sunrise Retail (Pty) Ltd",
    tradingName: "Sunrise Retail",
    regNumber: "2019/654321/07",
    taxNumber: "1234567890",
    uifRef: "U987654321",
    industry: "Retail",
    payrollContact: "Thandi Mokoena",
    email: "payroll@sunrise.co.za",
    employeeCount: 14,
    createdAt: "2022-03-15",
    status: "Active",
  },
  {
    id: "co-003",
    name: "Khumalo Construction CC",
    tradingName: "Khumalo Construction",
    regNumber: "2015/987654/23",
    taxNumber: "5566778899",
    uifRef: "U112233445",
    industry: "Construction",
    payrollContact: "Sipho Khumalo",
    email: "payroll@khumalo.co.za",
    employeeCount: 23,
    createdAt: "2020-07-01",
    status: "Active",
  },
];

export default CompanySwitcher;