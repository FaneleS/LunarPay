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
  const margin = 14;
  const cw = pw - margin * 2;
  let y = margin;

  const emp = payslip.employee;

  // Colour palette
  const ink    = [30, 30, 30];
  const muted  = [100, 100, 100];
  const light  = [230, 230, 230];
  const xlight = [245, 245, 245];
  const white  = [255, 255, 255];
  const olive  = [101, 109, 74];
  const forest = [58, 66, 50];
  const wheat  = [196, 180, 112];
  const danger = [180, 50, 30];
  const hdrBg  = [240, 240, 240];

  const setC  = (rgb) => doc.setTextColor(...rgb);
  const setF  = (rgb) => doc.setFillColor(...rgb);
  const setD  = (rgb) => doc.setDrawColor(...rgb);
  const bold  = () => doc.setFont("helvetica", "bold");
  const norm  = () => doc.setFont("helvetica", "normal");
  const sz    = (n) => doc.setFontSize(n);
  const line  = (x1, y1, x2, y2) => { setD(light); doc.setLineWidth(0.2); doc.line(x1, y1, x2, y2); };
  const hLine = (yy) => line(margin, yy, pw - margin, yy);
  const rect  = (x, yy, w, h, fill) => { setF(fill); doc.rect(x, yy, w, h, "F"); };

  // ── TEMPLATE: PROFESSIONAL (AGL-style) ────────────────────────────────────
  if (template === "professional") {
    const G1  = [248, 248, 248]; // lightest grey — alternating row bg
    const G2  = [238, 238, 238]; // section header bg
    const G3  = [220, 220, 220]; // sub-header / divider
    const NET = [40,  40,  40];  // net pay bar background
    const halfW = (cw - 4) / 2;
    const lX = margin;
    const rX = margin + halfW + 4;

    // helpers — all text in ink, no colour
    const th = (txt, x, yy, opts) => { bold(); sz(7); setC(muted); doc.text(txt, x, yy, opts || {}); };
    const tv = (txt, x, yy, opts) => { norm(); sz(8.5); setC(ink); doc.text(txt, x, yy, opts || {}); };
    const amt = (txt, x, yy) => { bold(); sz(8.5); setC(ink); doc.text(txt, x, yy, { align: "right" }); norm(); };
    const sHdr = (txt, x, yy, w) => { rect(x, yy, w, 5.5, G2); bold(); sz(8.5); setC(ink); doc.text(txt, x + 2, yy + 4); };
    const colHdr = (x, yy, w, labels) => {
      rect(x, yy, w, 4.5, G3);
      sz(7); norm(); setC(muted);
      labels.forEach(([t, ox, align]) => doc.text(t, x + ox, yy + 3.2, { align: align || "left" }));
    };

    // ── Logo & company header ──────────────────────────────────────────────
    if (logoDataUrl) {
      try { doc.addImage(logoDataUrl, "PNG", pw / 2 - 14, y, 28, 18); y += 21; }
      catch (e) {}
    }
    bold(); sz(12); setC(ink);
    doc.text(company.name || company.tradingName, pw / 2, y, { align: "center" });
    y += 5;
    norm(); sz(8); setC(muted);
    doc.text(
      [company.address, company.city, company.email].filter(Boolean).join("  ·  "),
      pw / 2, y, { align: "center" }
    );
    y += 6;
    setD(G3); doc.setLineWidth(0.3); doc.line(margin, y, pw - margin, y); y += 5;

    // ── Employee detail grid — 3 columns ──────────────────────────────────
    const col3 = cw / 3;
    const rows1 = [
      [["Emp. Code", emp.employeeNumber],         ["Emp. Name",  `${emp.firstName} ${emp.lastName}`], ["ID Number",      emp.idNumber]],
      [["Date Engaged", emp.dateOfAppointment],   ["Job Title",  emp.jobTitle],                        ["Income Tax No.", emp.taxNumber]],
      [["Pay Period", `${payslip.periodStart} - ${payslip.periodEnd}`], ["Co. Name", company.tradingName || company.name], ["PAYE Ref. No.", company.taxNumber || "—"]],
    ];
    rows1.forEach(row => {
      row.forEach(([label, value], ci) => {
        th(label, margin + ci * col3, y);
        tv(value || "—", margin + ci * col3, y + 4);
      });
      y += 10;
    });

    const rows2 = [
      [["Rate Per Hour", emp.ratePerHour || "—"],           ["Payment Type", emp.paymentMethod || "ACB"],     ["UIF Reg. No.", company.uifRef || "—"]],
      [["Hours Per Period", emp.hoursPerPeriod || "173.33"],["Account No.", emp.accountNumber || "—"],         ["Branch No.", emp.branchCode || "—"]],
    ];
    rows2.forEach(row => {
      row.forEach(([label, value], ci) => {
        th(label, margin + ci * col3, y);
        tv(value || "—", margin + ci * col3, y + 4);
      });
      y += 10;
    });

    setD(G3); doc.setLineWidth(0.3); doc.line(margin, y, pw - margin, y); y += 5;

    // ── Earnings | Deductions side by side ────────────────────────────────
    sHdr("Earnings",   lX, y, halfW);
    sHdr("Deductions", rX, y, halfW);
    y += 5.5;

    colHdr(lX, y, halfW, [["Description", 2], ["Units", halfW * 0.56], ["Amount", halfW - 2, "right"]]);
    colHdr(rX, y, halfW, [["Description", 2], ["Units", halfW * 0.56], ["Amount", halfW - 2, "right"]]);
    y += 4.5;

    const maxR = Math.max(payslip.incomes.length, payslip.deductions.length);
    for (let i = 0; i < maxR; i++) {
      const inc = payslip.incomes[i];
      const ded = payslip.deductions[i];
      const bg = i % 2 === 0 ? white : G1;
      rect(lX, y, halfW, 5.5, bg);
      rect(rX, y, halfW, 5.5, bg);
      if (inc) {
        tv(inc.name, lX + 2, y + 3.8);
        norm(); sz(8); setC(muted); doc.text("0.00", lX + halfW * 0.56, y + 3.8);
        amt(inc.amount.toLocaleString("en-ZA", { minimumFractionDigits: 2 }), lX + halfW - 2, y + 3.8);
      }
      if (ded) {
        tv(ded.name, rX + 2, y + 3.8);
        norm(); sz(8); setC(muted); doc.text("0.00", rX + halfW * 0.56, y + 3.8);
        amt(ded.amount.toLocaleString("en-ZA", { minimumFractionDigits: 2 }), rX + halfW - 2, y + 3.8);
      }
      y += 5.5;
    }

    // Totals row
    rect(lX, y, halfW, 5.5, G2); rect(rX, y, halfW, 5.5, G2);
    bold(); sz(8.5); setC(ink);
    doc.text("Total Earnings", lX + 2, y + 3.8);
    doc.text(payslip.grossIncome.toLocaleString("en-ZA", { minimumFractionDigits: 2 }), lX + halfW - 2, y + 3.8, { align: "right" });
    doc.text("Total Deductions", rX + 2, y + 3.8);
    doc.text(payslip.totalDeductions.toLocaleString("en-ZA", { minimumFractionDigits: 2 }), rX + halfW - 2, y + 3.8, { align: "right" });
    y += 5.5;

    // Net Pay — dark bar, white text, that's the only colour allowed
    rect(lX, y, cw + 4, 8, NET);
    setC(white); bold(); sz(10);
    doc.text("Net Pay", lX + 3, y + 5.5);
    sz(11);
    doc.text(payslip.nettPay.toLocaleString("en-ZA", { minimumFractionDigits: 2 }), pw - margin - 2, y + 5.5, { align: "right" });
    y += 12;

    // ── Company Contributions | YTD ───────────────────────────────────────
    const basicSalary = (payslip.incomes.find(i => i.name === "Basic Salary") || {}).amount || 0;
    const compContribs = [
      { name: "Skills Development Levy (SDL)", amount: Math.round(basicSalary * 0.01 * 100) / 100 },
      { name: "UIF — Employer",                amount: 177.12 },
      { name: "Pension (Employer)",            amount: Math.round(basicSalary * 0.12 * 100) / 100 },
    ];
    const totalCC = compContribs.reduce((s, i) => s + i.amount, 0);
    const ytdItems = [
      { name: "Tax Paid (YTD)",             amount: Math.round(payslip.totalDeductions * 0.5 * 3 * 100) / 100 },
      { name: "Taxable Earnings (YTD)",     amount: Math.round(payslip.grossIncome * 3 * 100) / 100 },
      { name: "Tax Deductible Deductions",  amount: Math.round(payslip.totalDeductions * 0.6 * 100) / 100 },
      { name: "Fringe Benefits (YTD)",      amount: Math.round(payslip.grossIncome * 0.1 * 100) / 100 },
    ];

    sHdr("Company Contributions", lX, y, halfW);
    sHdr("Year To Date Totals",   rX, y, halfW);
    y += 5.5;

    colHdr(lX, y, halfW, [["Description", 2], ["Amount", halfW - 2, "right"]]);
    colHdr(rX, y, halfW, [["Description", 2], ["Amount", halfW - 2, "right"]]);
    y += 4.5;

    const ccRows = Math.max(compContribs.length, ytdItems.length);
    for (let i = 0; i < ccRows; i++) {
      const cc = compContribs[i], ytd = ytdItems[i];
      const bg = i % 2 === 0 ? white : G1;
      rect(lX, y, halfW, 5.5, bg);
      rect(rX, y, halfW, 5.5, bg);
      if (cc) { tv(cc.name, lX + 2, y + 3.8); amt(cc.amount.toLocaleString("en-ZA", { minimumFractionDigits: 2 }), lX + halfW - 2, y + 3.8); }
      if (ytd) { tv(ytd.name, rX + 2, y + 3.8); amt(ytd.amount.toLocaleString("en-ZA", { minimumFractionDigits: 2 }), rX + halfW - 2, y + 3.8); }
      y += 5.5;
    }

    rect(lX, y, halfW, 5.5, G2);
    bold(); sz(8.5); setC(ink);
    doc.text("Total Company Contributions", lX + 2, y + 3.8);
    doc.text(totalCC.toLocaleString("en-ZA", { minimumFractionDigits: 2 }), lX + halfW - 2, y + 3.8, { align: "right" });
    y += 9;

    // ── Leave Balances — pushed to bottom of page ─────────────────────────
    if (payslip.leaveBalances?.length > 0) {
      // Calculate how much space leave table needs
      const leaveHeight = 5.5 + 4.5 + payslip.leaveBalances.length * 5.5 + 6;
      // Push y to bottom — leave gap above footer (14mm)
      const leaveY = Math.max(y, ph - leaveHeight - 14);
      y = leaveY;

      sHdr("Leave Balances", lX, y, cw + 4); y += 5.5;

      const lc = [0, 0.21, 0.36, 0.50, 0.64, 0.79]; // column x positions as fraction of cw
      const lHeaders = ["Description", "Entitlement", "Balance B/Fwd", "Accrued", "Taken", "Balance C/Fwd"];
      colHdr(lX, y, cw + 4, lHeaders.map((h, i) => [h, i === 0 ? 2 : lc[i] * cw + 2, i > 0 ? "right" : "left"]));
      y += 4.5;

      payslip.leaveBalances.forEach((lb, i) => {
        rect(lX, y, cw + 4, 5.5, i % 2 === 0 ? white : G1);
        norm(); sz(8.5); setC(ink);
        doc.text(lb.type + " Leave", lX + 2, y + 3.8);
        bold();
        const vals = [
          lb.entitlement || lb.accrued || 0,
          lb.balance || 0,
          lb.newAccrual ?? 0,
          lb.taken || 0,
          lb.balance || 0,
        ];
        vals.forEach((val, vi) => {
          doc.text(
            Number(val).toFixed(4),
            lX + lc[vi + 1] * cw + 2,
            y + 3.8,
            { align: "right" }
          );
        });
        norm(); y += 5.5;
      });
      y += 4;
    }

    // Footer
    setD(G3); doc.setLineWidth(0.3); doc.line(margin, ph - 10, pw - margin, ph - 10);
    sz(7); norm(); setC(muted);
    doc.text("This is a computer-generated payslip and does not require a signature.", margin, ph - 6);
    doc.text(
      `Printed on: ${new Date().toLocaleDateString("en-ZA")}; ${new Date().toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" })}`,
      pw - margin, ph - 6, { align: "right" }
    );
  }

  if (template === "detailed") {
    doc.setFillColor(...forest);
    doc.rect(0, 0, pw, 28, "F");
    if (logoDataUrl) {
      try { doc.addImage(logoDataUrl, "PNG", margin, 5, 18, 18); } catch (e) {}
    }
    const nameX = logoDataUrl ? margin + 22 : margin;
    setC(white); bold(); sz(14);
    doc.text(company.tradingName || company.name, nameX, 13);
    norm(); sz(8); setC([194, 197, 170]);
    doc.text("PAYSLIP", nameX, 20);
    setC(wheat); bold(); sz(10);
    doc.text(payslip.period, pw - margin, 13, { align: "right" });
    norm(); sz(8); setC([194, 197, 170]);
    doc.text(`${payslip.periodStart} to ${payslip.periodEnd}`, pw - margin, 20, { align: "right" });
    y = 36;

    sz(8); norm(); setC(muted);
    [`${company.name}`, `Reg: ${company.regNumber || "—"}   PAYE: ${company.taxNumber || "—"}   UIF: ${company.uifRef || "—"}`, `${company.address || ""}`, `${company.phone || ""}   ${company.email || ""}`].forEach(l => { doc.text(l, margin, y); y += 4.5; });
    y += 2; hLine(y); y += 6;

    rect(margin, y, cw, 24, light);
    const c1 = margin + 4, c2 = margin + cw / 2 + 4;
    let ey = y + 5;
    [[["Employee", `${emp.lastName}, ${emp.firstName}`], ["Employee No.", emp.employeeNumber]], [["ID Number", emp.idNumber], ["Tax Number", emp.taxNumber]], [["Job Title", emp.jobTitle], ["Pay Point", emp.payPoint]], [["Payment Method", emp.paymentMethod], ["Bank", emp.bank ? `${emp.bank} ${emp.accountNumber}` : "Cash"]]].forEach(([left, right]) => {
      sz(7); setC(muted); doc.text(left[0].toUpperCase(), c1, ey); doc.text(right[0].toUpperCase(), c2, ey);
      sz(8.5); setC(ink); bold(); doc.text(left[1] || "—", c1, ey + 3.5); doc.text(right[1] || "—", c2, ey + 3.5); norm(); ey += 8;
    });
    y += 30;

    const hfW = (cw - 4) / 2, rX = margin + hfW + 4;
    rect(margin, y, hfW, 6, olive); rect(rX, y, hfW, 6, forest);
    setC(white); bold(); sz(8);
    doc.text("INCOME", margin + 3, y + 4); doc.text("AMOUNT", margin + hfW - 3, y + 4, { align: "right" });
    doc.text("DEDUCTIONS", rX + 3, y + 4); doc.text("AMOUNT", rX + hfW - 3, y + 4, { align: "right" });
    y += 6;

    const maxR = Math.max(payslip.incomes.length, payslip.deductions.length);
    for (let i = 0; i < maxR; i++) {
      const inc = payslip.incomes[i], ded = payslip.deductions[i];
      const bg = i % 2 === 0 ? [253,250,244] : [245,242,234];
      rect(margin, y, hfW, 5.5, bg); rect(rX, y, hfW, 5.5, bg);
      sz(8); norm();
      if (inc) { setC(ink); doc.text(inc.name, margin + 3, y + 3.8); setC(muted); doc.text("0.00", margin + hfW * 0.6, y + 3.8); setC(ink); bold(); doc.text(inc.amount.toLocaleString("en-ZA", { minimumFractionDigits: 2 }), margin + hfW - 3, y + 3.8, { align: "right" }); norm(); }
      if (ded) { setC(ink); doc.text(ded.name, rX + 3, y + 3.8); setC(muted); doc.text("0.00", rX + hfW * 0.6, y + 3.8); setC(danger); bold(); doc.text(ded.amount.toLocaleString("en-ZA", { minimumFractionDigits: 2 }), rX + hfW - 3, y + 3.8, { align: "right" }); norm(); }
      y += 5.5;
    }
    rect(margin, y, hfW, 5.5, light); rect(rX, y, hfW, 5.5, light);
    bold(); sz(8); setC(ink); doc.text("Total Earnings", margin + 3, y + 3.8);
    doc.text(payslip.grossIncome.toLocaleString("en-ZA", { minimumFractionDigits: 2 }), margin + hfW - 3, y + 3.8, { align: "right" });
    doc.text("Total Deductions", rX + 3, y + 3.8); setC(danger);
    doc.text(payslip.totalDeductions.toLocaleString("en-ZA", { minimumFractionDigits: 2 }), rX + hfW - 3, y + 3.8, { align: "right" });
    y += 9;

    rect(margin, y, cw, 12, forest); setC(white); bold(); sz(10);
    doc.text("NETT PAY", margin + 4, y + 8); sz(14); setC(wheat);
    doc.text(payslip.nettPay.toLocaleString("en-ZA", { minimumFractionDigits: 2 }), pw - margin - 4, y + 8, { align: "right" });
    y += 17;

    if (payslip.leaveBalances?.length > 0) {
      bold(); sz(8); setC(olive); doc.text("LEAVE BALANCES", margin, y); y += 4;
      rect(margin, y, cw, 5, light); sz(7.5); bold(); setC(muted);
      const lhx = [margin+3, margin+cw*0.35, margin+cw*0.50, margin+cw*0.65, margin+cw*0.80];
      ["TYPE","ACCRUED","TAKEN","ADJUSTMENT","BALANCE"].forEach((h,i) => doc.text(h, lhx[i], y + 3.5));
      y += 5;
      payslip.leaveBalances.forEach((lb, i) => {
        rect(margin, y, cw, 5.5, i%2===0?[253,250,244]:[245,242,234]);
        norm(); sz(8.5); setC(ink); doc.text(lb.type, lhx[0], y + 3.8);
        setC(muted); doc.text(String(lb.accrued || 0), lhx[1], y+3.8); doc.text(String(lb.taken || 0), lhx[2], y+3.8); doc.text("0.00", lhx[3], y+3.8);
        const bc = lb.balance < 3 ? danger : olive; setC(bc); bold();
        doc.text(String(lb.balance), lhx[4], y+3.8); norm(); y += 5.5;
      });
      y += 4;
    }

    hLine(ph-10); sz(7); norm(); setC(muted);
    doc.text("Computer-generated payslip — no signature required.", margin, ph-6);
    doc.text(`Generated by LunarPay · ${new Date().toLocaleDateString("en-ZA")}`, pw-margin, ph-6, { align: "right" });
  }

  // ── TEMPLATE: MINIMAL ─────────────────────────────────────────────────────
  if (template === "minimal") {
    if (logoDataUrl) { try { doc.addImage(logoDataUrl, "PNG", pw-margin-24, y, 24, 24); } catch (e) {} }
    bold(); sz(16); setC(ink); doc.text(company.tradingName || company.name, margin, y+8);
    norm(); sz(8); setC(muted); doc.text([company.address, company.city, company.email].filter(Boolean).join("   "), margin, y+14);
    y += 32; hLine(y); y += 8;
    bold(); sz(20); setC(olive); doc.text("PAYSLIP", margin, y);
    norm(); sz(10); setC(muted); doc.text(payslip.period, pw-margin, y, { align: "right" }); y += 12;
    bold(); sz(13); setC(ink); doc.text(`${emp.firstName} ${emp.lastName}`, margin, y);
    norm(); sz(9); setC(muted); doc.text(`${emp.jobTitle} · ${emp.payPoint} · Emp #${emp.employeeNumber}`, margin, y+5);
    doc.text(`Period: ${payslip.periodStart} — ${payslip.periodEnd}`, margin, y+10); y += 20;
    hLine(y); y += 8;
    bold(); sz(8); setC(muted); doc.text("INCOME", margin, y); doc.text("AMOUNT", pw-margin, y, { align: "right" }); y += 5;
    payslip.incomes.forEach(item => { norm(); sz(9.5); setC(ink); doc.text(item.name, margin, y); bold(); doc.text(item.amount.toLocaleString("en-ZA",{minimumFractionDigits:2}), pw-margin, y, { align:"right" }); y += 6; });
    hLine(y); y += 4; bold(); sz(9); setC(ink); doc.text("Gross Income", margin, y); doc.text(payslip.grossIncome.toLocaleString("en-ZA",{minimumFractionDigits:2}), pw-margin, y, { align:"right" }); y += 10;
    bold(); sz(8); setC(muted); doc.text("DEDUCTIONS", margin, y); doc.text("AMOUNT", pw-margin, y, { align:"right" }); y += 5;
    payslip.deductions.forEach(item => { norm(); sz(9.5); setC(danger); doc.text(item.name, margin, y); bold(); doc.text(item.amount.toLocaleString("en-ZA",{minimumFractionDigits:2}), pw-margin, y, { align:"right" }); y += 6; });
    hLine(y); y += 4; bold(); sz(9); setC(danger); doc.text("Total Deductions", margin, y); doc.text(payslip.totalDeductions.toLocaleString("en-ZA",{minimumFractionDigits:2}), pw-margin, y, { align:"right" }); y += 12;
    setD(olive); doc.setLineWidth(0.5); doc.line(margin,y,pw-margin,y); y += 6;
    bold(); sz(13); setC(olive); doc.text("Nett Pay", margin, y); doc.text(payslip.nettPay.toLocaleString("en-ZA",{minimumFractionDigits:2}), pw-margin, y, { align:"right" });
    doc.setLineWidth(0.5); doc.line(margin,y+3,pw-margin,y+3); y += 12;
    if (payslip.leaveBalances?.length>0) {
      y += 4; bold(); sz(8); setC(muted); doc.text("LEAVE BALANCES", margin, y); y += 5;
      payslip.leaveBalances.forEach(lb => {
        norm(); sz(9); setC(ink); doc.text(`${lb.type} Leave`, margin, y);
        const bc = lb.balance < 3 ? danger : olive; setC(bc); bold();
        doc.text(`${lb.balance} days remaining`, pw-margin, y, { align:"right" }); y += 6;
      });
    }
    hLine(ph-10); sz(7); norm(); setC(muted);
    doc.text("Computer-generated payslip — no signature required.", margin, ph-6);
    doc.text(`Generated by LunarPay · ${new Date().toLocaleDateString("en-ZA")}`, pw-margin, ph-6, { align:"right" });
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
  const [template, setTemplate] = useState("professional");
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
                ["professional", "Standard", "Two-column layout, company contributions, YTD totals, leave B/Fwd & C/Fwd"],
                ["detailed", "Detailed", "LunarPay branded — colour bands, forest header, olive income section"],
                ["minimal", "Minimal", "Clean white, typography-led, understated and modern"],
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