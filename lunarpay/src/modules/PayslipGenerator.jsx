import { useState, useRef } from "react";

const C = {
  pageBg: "#F5F2EA", surface: "#EDE8DC", card: "#FDFAF4", cardBorder: "#D8D4C8",
  olive: "#656D4A", forest: "#3A4232", sage: "#C2C5AA", sageMid: "#A4AC86",
  ink: "#333D29", wheat: "#C4B470", terra: "#936639", muted: "#7F7455",
  active: "#2D6B45", activeBg: "#EDF5F0", danger: "#8B3A1E", dangerBg: "#F5EDE8",
  info: "#2A5C8A", infoBg: "#EAF1F8", warning: "#7A5C1E", warningBg: "#FDF3E3",
};
const FONT_DISPLAY = "'Syne', sans-serif";
const FONT_BODY = "'DM Sans', sans-serif";

const fmt = (n) => `R ${Number(n).toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// ─── Sample Data ──────────────────────────────────────────────────────────────
const SAMPLE_COMPANY = {
  name: "Demo Company (Pty) Ltd",
  tradingName: "Demo Company",
  regNumber: "2018/123456/07",
  taxNumber: "9876543210",
  uifRef: "U123456789",
  address: "12 Oak Street, Sandton",
  city: "Johannesburg",
  province: "Gauteng",
  postalCode: "2196",
  phone: "+27 11 555 0100",
  email: "payroll@demo.co.za",
};

const SAMPLE_PAYSLIPS = [
  {
    id: "PS001", empId: "0001", period: "May 2025", periodStart: "2025-05-01", periodEnd: "2025-05-31",
    employee: { firstName: "Jane", lastName: "Brown", idNumber: "8804120123456", taxNumber: "1234567890", jobTitle: "Accountant", payPoint: "Finance", employeeNumber: "0001", dateOfAppointment: "2021-02-01", paymentMethod: "EFT", bank: "ABSA", accountNumber: "****4521" },
    incomes: [{ name: "Basic Salary", amount: 28000, sarsCode: "3601" }, { name: "Commission", amount: 2000, sarsCode: "3606", note: "100 units × R20/unit" }],
    deductions: [{ name: "PAYE Tax", amount: 5400 }, { name: "UIF — Employee", amount: 177.12 }, { name: "Medical Aid", amount: 1200 }],
    leaveBalances: [{ type: "Annual", balance: 7.25, taken: 5, accrued: 12.25 }, { type: "Sick", balance: 28, taken: 2, accrued: 30 }],
    grossIncome: 30000, totalDeductions: 6777.12, nettPay: 23222.88,
  },
  {
    id: "PS002", empId: "0002", period: "May 2025", periodStart: "2025-05-01", periodEnd: "2025-05-31",
    employee: { firstName: "John", lastName: "Smith", idNumber: "8509230123456", taxNumber: "9876543210", jobTitle: "Operations Manager", payPoint: "Operations", employeeNumber: "0002", dateOfAppointment: "2020-05-15", paymentMethod: "EFT", bank: "FNB", accountNumber: "****8832" },
    incomes: [{ name: "Basic Salary", amount: 35000, sarsCode: "3601" }],
    deductions: [{ name: "PAYE Tax", amount: 7200 }, { name: "UIF — Employee", amount: 177.12 }, { name: "Pension Fund", amount: 1750 }],
    leaveBalances: [{ type: "Annual", balance: 5.5, taken: 9.5, accrued: 15 }, { type: "Sick", balance: 30, taken: 0, accrued: 30 }],
    grossIncome: 35000, totalDeductions: 9127.12, nettPay: 25872.88,
  },
  {
    id: "PS003", empId: "0003", period: "May 2025", periodStart: "2025-05-01", periodEnd: "2025-05-31",
    employee: { firstName: "Paige", lastName: "Turner", idNumber: "9301070123456", taxNumber: "1122334455", jobTitle: "Marketing Lead", payPoint: "Marketing", employeeNumber: "0003", dateOfAppointment: "2022-01-10", paymentMethod: "Cash", bank: "", accountNumber: "" },
    incomes: [{ name: "Basic Salary", amount: 22000, sarsCode: "3601" }, { name: "Travel Allowance", amount: 1500, sarsCode: "3701" }],
    deductions: [{ name: "PAYE Tax", amount: 4230 }, { name: "UIF — Employee", amount: 177.12 }],
    leaveBalances: [{ type: "Annual", balance: 9, taken: 3, accrued: 12 }, { type: "Sick", balance: 30, taken: 0, accrued: 30 }],
    grossIncome: 23500, totalDeductions: 4407.12, nettPay: 19092.88,
  },
];

// ─── PDF Generator ────────────────────────────────────────────────────────────
async function generatePayslipPDF(payslip, company, template, logoDataUrl) {
  const { jsPDF } = await import("jspdf");
  await import("jspdf-autotable");

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pw - margin * 2;
  let y = margin;

  const emp = payslip.employee;
  const olive = [101, 109, 74];
  const forest = [58, 66, 50];
  const ink = [51, 61, 41];
  const muted = [127, 116, 85];
  const light = [237, 232, 220];
  const white = [255, 255, 255];
  const wheat = [196, 180, 112];
  const danger = [139, 58, 30];

  // ── TEMPLATE: DETAILED ────────────────────────────────────────────────────
  if (template === "detailed") {
    // Header bar
    doc.setFillColor(...forest);
    doc.rect(0, 0, pw, 28, "F");

    // Logo
    if (logoDataUrl) {
      try { doc.addImage(logoDataUrl, "PNG", margin, 5, 18, 18); } catch (e) {}
    }

    // Company name in header
    const nameX = logoDataUrl ? margin + 22 : margin;
    doc.setTextColor(...white);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(company.tradingName || company.name, nameX, 13);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(194, 197, 170);
    doc.text("PAYSLIP", nameX, 20);

    // Period top right
    doc.setTextColor(...wheat);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(payslip.period, pw - margin, 13, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(194, 197, 170);
    doc.text(`${payslip.periodStart} to ${payslip.periodEnd}`, pw - margin, 20, { align: "right" });

    y = 36;

    // Company details row
    doc.setFontSize(8);
    doc.setTextColor(...muted);
    const companyLines = [
      company.name,
      `Reg: ${company.regNumber || "—"}   PAYE: ${company.taxNumber || "—"}   UIF: ${company.uifRef || "—"}`,
      `${company.address}, ${company.city}, ${company.province} ${company.postalCode}`,
      `${company.phone}   ${company.email}`,
    ];
    companyLines.forEach(line => {
      doc.text(line, margin, y);
      y += 4.5;
    });

    // Divider
    y += 2;
    doc.setDrawColor(...light);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pw - margin, y);
    y += 6;

    // Employee details grid
    doc.setFillColor(...light);
    doc.roundedRect(margin, y, contentWidth, 24, 2, 2, "F");

    const col1 = margin + 4;
    const col2 = margin + contentWidth / 2 + 4;
    const labelColor = muted;
    const valColor = ink;

    const empFields = [
      [["Employee", `${emp.lastName}, ${emp.firstName}`], ["Employee No.", emp.employeeNumber]],
      [["ID Number", emp.idNumber], ["Tax Number", emp.taxNumber]],
      [["Job Title", emp.jobTitle], ["Pay Point", emp.payPoint]],
      [["Payment Method", emp.paymentMethod], ["Bank", emp.bank ? `${emp.bank} ${emp.accountNumber}` : "Cash"]],
    ];

    let ey = y + 5;
    empFields.forEach(([left, right]) => {
      doc.setFontSize(7);
      doc.setTextColor(...labelColor);
      doc.text(left[0].toUpperCase(), col1, ey);
      doc.text(right[0].toUpperCase(), col2, ey);
      doc.setFontSize(8.5);
      doc.setTextColor(...valColor);
      doc.setFont("helvetica", "bold");
      doc.text(left[1] || "—", col1, ey + 3.5);
      doc.text(right[1] || "—", col2, ey + 3.5);
      doc.setFont("helvetica", "normal");
      ey += 8;
    });

    y += 28;
    y += 6;

    // Income table
    doc.setFillColor(...olive);
    doc.rect(margin, y, contentWidth, 6, "F");
    doc.setTextColor(...white);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("INCOME", margin + 3, y + 4);
    doc.text("AMOUNT", pw - margin - 3, y + 4, { align: "right" });
    y += 6;

    payslip.incomes.forEach((item, i) => {
      doc.setFillColor(i % 2 === 0 ? 253 : 245, i % 2 === 0 ? 250 : 242, i % 2 === 0 ? 244 : 234);
      doc.rect(margin, y, contentWidth, 6, "F");
      doc.setTextColor(...ink);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.text(item.name + (item.sarsCode ? ` (${item.sarsCode})` : ""), margin + 3, y + 4);
      doc.text(fmt(item.amount), pw - margin - 3, y + 4, { align: "right" });
      y += 6;
    });

    // Income total
    doc.setFillColor(...light);
    doc.rect(margin, y, contentWidth, 6, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...ink);
    doc.text("Total Income", margin + 3, y + 4);
    doc.text(fmt(payslip.grossIncome), pw - margin - 3, y + 4, { align: "right" });
    y += 10;

    // Deductions table
    doc.setFillColor(...forest);
    doc.rect(margin, y, contentWidth, 6, "F");
    doc.setTextColor(...white);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("DEDUCTIONS", margin + 3, y + 4);
    doc.text("AMOUNT", pw - margin - 3, y + 4, { align: "right" });
    y += 6;

    payslip.deductions.forEach((item, i) => {
      doc.setFillColor(i % 2 === 0 ? 253 : 245, i % 2 === 0 ? 250 : 242, i % 2 === 0 ? 244 : 234);
      doc.rect(margin, y, contentWidth, 6, "F");
      doc.setTextColor(...danger);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.text(item.name, margin + 3, y + 4);
      doc.text(fmt(item.amount), pw - margin - 3, y + 4, { align: "right" });
      y += 6;
    });

    // Deductions total
    doc.setFillColor(...light);
    doc.rect(margin, y, contentWidth, 6, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...danger);
    doc.text("Total Deductions", margin + 3, y + 4);
    doc.text(fmt(payslip.totalDeductions), pw - margin - 3, y + 4, { align: "right" });
    y += 10;

    // Nett pay box
    doc.setFillColor(...olive);
    doc.roundedRect(margin, y, contentWidth, 12, 2, 2, "F");
    doc.setTextColor(...white);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("NETT PAY", margin + 4, y + 8);
    doc.setFontSize(14);
    doc.setTextColor(...wheat);
    doc.text(fmt(payslip.nettPay), pw - margin - 4, y + 8, { align: "right" });
    y += 18;

    // Leave balances
    if (payslip.leaveBalances && payslip.leaveBalances.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...olive);
      doc.text("LEAVE BALANCES", margin, y);
      y += 4;

      doc.setFillColor(...light);
      doc.rect(margin, y, contentWidth, 6, "F");
      doc.setTextColor(...muted);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      const leaveCols = ["TYPE", "ACCRUED", "TAKEN", "BALANCE"];
      const leaveColX = [margin + 3, margin + contentWidth * 0.35, margin + contentWidth * 0.55, margin + contentWidth * 0.75];
      leaveCols.forEach((h, i) => doc.text(h, leaveColX[i], y + 4));
      y += 6;

      payslip.leaveBalances.forEach((lb, i) => {
        doc.setFillColor(i % 2 === 0 ? 253 : 245, i % 2 === 0 ? 250 : 242, i % 2 === 0 ? 244 : 234);
        doc.rect(margin, y, contentWidth, 6, "F");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(...ink);
        doc.text(lb.type, leaveColX[0], y + 4);
        doc.text(String(lb.accrued), leaveColX[1], y + 4);
        doc.text(String(lb.taken), leaveColX[2], y + 4);
        doc.setFont("helvetica", "bold");
        const balColor = lb.balance < 3 ? danger : olive;
        doc.setTextColor(balColor[0], balColor[1], balColor[2]);
        doc.text(String(lb.balance), leaveColX[3], y + 4);
        y += 6;
      });
      y += 6;
    }

    // Notes
    const notes = payslip.incomes.filter(i => i.note);
    if (notes.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...muted);
      doc.text("NOTES", margin, y);
      y += 5;
      notes.forEach((item, i) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...muted);
        doc.text(`${i + 1}. ${item.name}: ${item.note}`, margin, y);
        y += 4.5;
      });
    }

    // Footer
    doc.setDrawColor(...light);
    doc.setLineWidth(0.3);
    doc.line(margin, ph - 14, pw - margin, ph - 14);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...muted);
    doc.text("This is a computer-generated payslip and does not require a signature.", margin, ph - 9);
    doc.text(`Generated by LunarPay · ${new Date().toLocaleDateString("en-ZA")}`, pw - margin, ph - 9, { align: "right" });
  }

  // ── TEMPLATE: MINIMAL ─────────────────────────────────────────────────────
  if (template === "minimal") {
    // Logo top right
    if (logoDataUrl) {
      try { doc.addImage(logoDataUrl, "PNG", pw - margin - 24, y, 24, 24); } catch (e) {}
    }

    // Company name top left
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...ink);
    doc.text(company.tradingName || company.name, margin, y + 8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...muted);
    doc.text(`${company.address}, ${company.city}   ${company.email}`, margin, y + 14);

    y += 32;

    // Thin divider
    doc.setDrawColor(...light);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pw - margin, y);
    y += 8;

    // PAYSLIP heading + period
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(...olive);
    doc.text("PAYSLIP", margin, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...muted);
    doc.text(payslip.period, pw - margin, y, { align: "right" });
    y += 12;

    // Employee name + details
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...ink);
    doc.text(`${emp.firstName} ${emp.lastName}`, margin, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...muted);
    doc.text(`${emp.jobTitle} · ${emp.payPoint} · Emp #${emp.employeeNumber}`, margin, y + 5);
    doc.text(`Period: ${payslip.periodStart} — ${payslip.periodEnd}`, margin, y + 10);
    y += 20;

    doc.setDrawColor(...light);
    doc.line(margin, y, pw - margin, y);
    y += 8;

    // Income
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...muted);
    doc.text("INCOME", margin, y);
    doc.text("AMOUNT", pw - margin, y, { align: "right" });
    y += 5;

    payslip.incomes.forEach(item => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(...ink);
      doc.text(item.name, margin, y);
      doc.text(fmt(item.amount), pw - margin, y, { align: "right" });
      y += 6;
    });

    // Subtotal line
    doc.setDrawColor(...light);
    doc.line(pw - margin - 40, y, pw - margin, y);
    y += 4;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...ink);
    doc.text("Gross Income", margin, y);
    doc.text(fmt(payslip.grossIncome), pw - margin, y, { align: "right" });
    y += 10;

    // Deductions
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...muted);
    doc.text("DEDUCTIONS", margin, y);
    doc.text("AMOUNT", pw - margin, y, { align: "right" });
    y += 5;

    payslip.deductions.forEach(item => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(...danger);
      doc.text(item.name, margin, y);
      doc.text(fmt(item.amount), pw - margin, y, { align: "right" });
      y += 6;
    });

    doc.setDrawColor(...light);
    doc.line(pw - margin - 40, y, pw - margin, y);
    y += 4;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...danger);
    doc.text("Total Deductions", margin, y);
    doc.text(fmt(payslip.totalDeductions), pw - margin, y, { align: "right" });
    y += 12;

    // Nett pay
    doc.setDrawColor(...olive);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pw - margin, y);
    y += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...olive);
    doc.text("Nett Pay", margin, y);
    doc.text(fmt(payslip.nettPay), pw - margin, y, { align: "right" });
    doc.setLineWidth(0.5);
    doc.line(margin, y + 3, pw - margin, y + 3);
    y += 12;

    // Leave balances
    if (payslip.leaveBalances?.length > 0) {
      y += 4;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...muted);
      doc.text("LEAVE BALANCES", margin, y);
      y += 5;

      payslip.leaveBalances.forEach(lb => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...ink);
        doc.text(`${lb.type} Leave`, margin, y);
        doc.setFont("helvetica", "bold");
        const balCol = lb.balance < 3 ? danger : olive;
        doc.setTextColor(balCol[0], balCol[1], balCol[2]);
        doc.text(`${lb.balance} days remaining`, pw - margin, y, { align: "right" });
        y += 6;
      });
    }

    // Notes
    const notes = payslip.incomes.filter(i => i.note);
    if (notes.length > 0) {
      y += 6;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...muted);
      doc.text("NOTES", margin, y);
      y += 5;
      notes.forEach((item, i) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text(`${i + 1}. ${item.name}: ${item.note}`, margin, y);
        y += 4.5;
      });
    }

    // Footer
    doc.setDrawColor(...light);
    doc.setLineWidth(0.3);
    doc.line(margin, ph - 14, pw - margin, ph - 14);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...muted);
    doc.text("This is a computer-generated payslip and does not require a signature.", margin, ph - 9);
    doc.text(`Generated by LunarPay · ${new Date().toLocaleDateString("en-ZA")}`, pw - margin, ph - 9, { align: "right" });
  }

  return doc;
}

// ─── Logo Uploader ────────────────────────────────────────────────────────────
function LogoUploader({ logo, onLogoChange }) {
  const fileRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (ev) => onLogoChange(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 11, color: C.muted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 500 }}>Company Logo</label>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          onClick={() => fileRef.current.click()}
          style={{ width: 80, height: 80, borderRadius: 12, border: `2px dashed ${logo ? C.olive : C.cardBorder}`, background: C.surface, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden", transition: "border-color 0.15s", flexShrink: 0 }}
          onMouseEnter={ev => ev.currentTarget.style.borderColor = C.olive}
          onMouseLeave={ev => ev.currentTarget.style.borderColor = logo ? C.olive : C.cardBorder}>
          {logo
            ? <img src={logo} alt="Company logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            : <i className="ti ti-photo-up" aria-hidden="true" style={{ fontSize: 24, color: C.sageMid }} />}
        </div>
        <div>
          <button onClick={() => fileRef.current.click()} style={{ background: "transparent", border: `1px solid ${C.cardBorder}`, color: C.muted, padding: "7px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontFamily: FONT_BODY, display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <i className="ti ti-upload" aria-hidden="true" style={{ fontSize: 13 }} />
            {logo ? "Change logo" : "Upload logo"}
          </button>
          {logo && (
            <button onClick={() => onLogoChange(null)} style={{ background: "none", border: "none", color: C.danger, fontSize: 12, cursor: "pointer", fontFamily: FONT_BODY, padding: 0 }}>
              Remove
            </button>
          )}
          <p style={{ fontSize: 11, color: C.sageMid, marginTop: logo ? 0 : 4 }}>PNG, JPG or SVG · Max 2MB</p>
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
    </div>
  );
}

// ─── Payslip Preview Card ─────────────────────────────────────────────────────
function PayslipPreviewCard({ payslip, selected, onToggle, onDownload, loading }) {
  const emp = payslip.employee;
  return (
    <div style={{ background: C.card, border: `1.5px solid ${selected ? C.olive : C.cardBorder}`, borderRadius: 12, padding: "14px 16px", transition: "border-color 0.15s" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div onClick={onToggle} style={{ width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${selected ? C.olive : C.cardBorder}`, background: selected ? C.olive : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer", marginTop: 2, transition: "all 0.15s" }}>
          {selected && <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>✓</span>}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 2 }}>{emp.lastName}, {emp.firstName}</div>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>{emp.jobTitle} · {emp.payPoint} · #{emp.employeeNumber}</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, color: C.active, background: C.activeBg, padding: "2px 8px", borderRadius: 20, fontWeight: 500 }}>{payslip.period}</span>
            <span style={{ fontSize: 11, color: C.muted, background: C.surface, padding: "2px 8px", borderRadius: 20 }}>Gross: {fmt(payslip.grossIncome)}</span>
            <span style={{ fontSize: 12, color: C.olive, fontWeight: 600, background: "rgba(101,109,74,0.1)", padding: "2px 8px", borderRadius: 20 }}>Nett: {fmt(payslip.nettPay)}</span>
          </div>
        </div>
        <button
          onClick={onDownload}
          disabled={loading}
          style={{ background: C.olive, color: "#F5F2EA", border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 12, cursor: loading ? "wait" : "pointer", fontFamily: FONT_BODY, fontWeight: 500, display: "flex", alignItems: "center", gap: 6, flexShrink: 0, opacity: loading ? 0.6 : 1 }}>
          <i className="ti ti-download" aria-hidden="true" style={{ fontSize: 13 }} />
          PDF
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PayslipGenerator({ company = SAMPLE_COMPANY, payslips = SAMPLE_PAYSLIPS }) {
  const [template, setTemplate] = useState("detailed");
  const [logo, setLogo] = useState(null);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [period, setPeriod] = useState("May 2025");
  const [success, setSuccess] = useState("");

  const periods = [...new Set(payslips.map(p => p.period))];
  const filtered = payslips.filter(p => p.period === period);

  const toggleSelect = (id) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map(p => p.id));

  const showSuccess = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(""), 3000); };

  const downloadSingle = async (payslip) => {
    setLoading(payslip.id);
    try {
      const doc = await generatePayslipPDF(payslip, company, template, logo);
      doc.save(`Payslip_${payslip.employee.lastName}_${payslip.employee.firstName}_${payslip.period.replace(" ", "_")}.pdf`);
      showSuccess(`Payslip downloaded for ${payslip.employee.firstName} ${payslip.employee.lastName}`);
    } catch (e) {
      console.error(e);
    }
    setLoading(null);
  };

  const downloadBulk = async () => {
    if (selected.length === 0) return;
    setBulkLoading(true);
    try {
      const { default: JSZip } = await import("jszip");
      const { saveAs } = await import("file-saver");
      const zip = new JSZip();

      for (const id of selected) {
        const payslip = payslips.find(p => p.id === id);
        if (!payslip) continue;
        const doc = await generatePayslipPDF(payslip, company, template, logo);
        const pdfBlob = doc.output("blob");
        zip.file(`Payslip_${payslip.employee.lastName}_${payslip.employee.firstName}_${payslip.period.replace(" ", "_")}.pdf`, pdfBlob);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, `LunarPay_Payslips_${period.replace(" ", "_")}.zip`);
      showSuccess(`${selected.length} payslips downloaded as ZIP`);
      setSelected([]);
    } catch (e) {
      console.error(e);
    }
    setBulkLoading(false);
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px", backgroundColor: C.pageBg, backgroundImage: "radial-gradient(circle, rgba(101,109,74,0.07) 1px, transparent 1px)", backgroundSize: "16px 16px" }}>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20, alignItems: "start" }}>

        {/* Left — Settings */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Logo upload */}
          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: "18px 20px" }}>
            <LogoUploader logo={logo} onLogoChange={setLogo} />
          </div>

          {/* Template selector */}
          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: "18px 20px" }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: C.ink, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Template</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                ["detailed", "Detailed", "Full company info, colour bands, employee grid, leave table"],
                ["minimal", "Minimal", "Clean white layout, typography-led, modern feel"],
              ].map(([id, label, desc]) => (
                <div key={id} onClick={() => setTemplate(id)} style={{ padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${template === id ? C.olive : C.cardBorder}`, background: template === id ? "rgba(101,109,74,0.07)" : C.surface, cursor: "pointer", transition: "all 0.12s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: template === id ? C.olive : C.cardBorder, transition: "background 0.12s" }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: template === id ? C.olive : C.ink }}>{label}</span>
                  </div>
                  <p style={{ fontSize: 11, color: C.muted, lineHeight: 1.4, paddingLeft: 16 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Period selector */}
          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: "18px 20px" }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: C.ink, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Period</p>
            <select value={period} onChange={e => { setPeriod(e.target.value); setSelected([]); }} style={{ background: C.card, border: `1px solid ${C.cardBorder}`, color: C.ink, borderRadius: 8, padding: "9px 13px", fontSize: 13, width: "100%", fontFamily: FONT_BODY, outline: "none" }}>
              {periods.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>

          {/* Bulk download */}
          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: "18px 20px" }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: C.ink, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Bulk Export</p>
            <p style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>Select payslips below then download as a ZIP file.</p>
            <button
              onClick={downloadBulk}
              disabled={selected.length === 0 || bulkLoading}
              style={{ width: "100%", background: selected.length > 0 ? C.wheat : C.surface, color: selected.length > 0 ? C.ink : C.sageMid, border: `1px solid ${selected.length > 0 ? "transparent" : C.cardBorder}`, borderRadius: 8, padding: "10px", fontSize: 13, fontFamily: FONT_BODY, fontWeight: 600, cursor: selected.length > 0 && !bulkLoading ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.15s" }}>
              <i className={`ti ${bulkLoading ? "ti-loader-2" : "ti-package"}`} aria-hidden="true" style={{ fontSize: 15, animation: bulkLoading ? "spin 1s linear infinite" : "none" }} />
              {bulkLoading ? "Generating ZIP…" : selected.length > 0 ? `Download ${selected.length} as ZIP` : "Select payslips first"}
            </button>
          </div>
        </div>

        {/* Right — Payslip list */}
        <div>
          {success && (
            <div style={{ background: C.activeBg, border: `1px solid rgba(45,107,69,0.2)`, borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: C.active, display: "flex", alignItems: "center", gap: 8 }}>
              <i className="ti ti-check" aria-hidden="true" />
              {success}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 15, fontWeight: 700, color: C.ink }}>{period} — {filtered.length} payslip{filtered.length !== 1 ? "s" : ""}</h3>
              <p style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Template: <span style={{ color: C.olive, fontWeight: 500, textTransform: "capitalize" }}>{template}</span> · {logo ? "Logo attached" : "No logo"}</p>
            </div>
            <label onClick={toggleAll} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: C.muted, userSelect: "none" }}>
              <div style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${selected.length === filtered.length && filtered.length > 0 ? C.olive : C.cardBorder}`, background: selected.length === filtered.length && filtered.length > 0 ? C.olive : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
                {selected.length === filtered.length && filtered.length > 0 && <span style={{ color: "#fff", fontSize: 9, fontWeight: 700 }}>✓</span>}
              </div>
              Select all
            </label>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map(ps => (
              <PayslipPreviewCard
                key={ps.id}
                payslip={ps}
                selected={selected.includes(ps.id)}
                onToggle={() => toggleSelect(ps.id)}
                onDownload={() => downloadSingle(ps)}
                loading={loading === ps.id}
              />
            ))}
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "48px 0", color: C.sageMid, fontSize: 13 }}>No payslips for this period</div>
            )}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}