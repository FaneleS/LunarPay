import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://aofjukkniogrrdnszauk.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const auth = {
  signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
  signUp: (email, password) => supabase.auth.signUp({ email, password }),
  signOut: () => supabase.auth.signOut(),
  getSession: () => supabase.auth.getSession(),
  onAuthChange: (cb) => supabase.auth.onAuthStateChange(cb),
};

export async function logAction(companyId, action, target, category, metadata = {}) {
  const { data: { user } } = await supabase.auth.getUser();
  await supabase.from("audit_log").insert({
    company_id: companyId, user_id: user?.id, user_name: user?.email,
    action, target, category, metadata,
  });
}

export const companies = {
  list: async () => {
    const { data, error } = await supabase.from("companies").select("*").order("name");
    return { data, error };
  },
  get: async (id) => {
    const { data, error } = await supabase.from("companies").select("*").eq("id", id).single();
    return { data, error };
  },
  create: async (company) => {
    const { data, error } = await supabase.from("companies").insert(company).select().single();
    return { data, error };
  },
  update: async (id, updates) => {
    const { data, error } = await supabase.from("companies").update(updates).eq("id", id).select().single();
    return { data, error };
  },
};

export const employees = {
  list: async (companyId, { status = null, payPointId = null, payFrequencyId = null } = {}) => {
    let q = supabase
      .from("employees")
      .select("*, pay_frequencies(name, frequency), pay_points(name), employee_bank_accounts(*)")
      .eq("company_id", companyId)
      .order("last_name");
    if (status) q = q.eq("status", status);
    if (payPointId) q = q.eq("pay_point_id", payPointId);
    if (payFrequencyId) q = q.eq("pay_frequency_id", payFrequencyId);
    return await q;
  },
  get: async (id) => {
    return await supabase
      .from("employees")
      .select("*, pay_frequencies(name), pay_points(name), employee_bank_accounts(*), employee_working_hours(*)")
      .eq("id", id).single();
  },
  create: async (employee) => {
    const { data, error } = await supabase.from("employees").insert(employee).select().single();
    if (data) await logAction(employee.company_id, "Added employee", `${employee.last_name}, ${employee.first_names}`, "Employees");
    return { data, error };
  },
  update: async (id, updates, companyId) => {
    const { data, error } = await supabase.from("employees").update(updates).eq("id", id).select().single();
    if (data) await logAction(companyId, "Updated employee", `${data.last_name}, ${data.first_names}`, "Employees");
    return { data, error };
  },
  terminate: async (id, lastDay, uifCode, companyId) => {
    const { data, error } = await supabase
      .from("employees")
      .update({ last_day_of_service: lastDay, uif_status_code: uifCode, status: "Inactive" })
      .eq("id", id).select().single();
    if (data) await logAction(companyId, "Terminated employee", `${data.last_name}, ${data.first_names}`, "Employees");
    return { data, error };
  },
  bulkImport: async (companyId, rows) => {
    const prepared = rows.map(r => ({ ...r, company_id: companyId }));
    const { data, error } = await supabase.from("employees").insert(prepared).select();
    if (data) await logAction(companyId, "Bulk imported employees", `${data.length} employees`, "Employees");
    return { data, error };
  },
};

export const payslips = {
  list: async (companyId, { periodEnd = null, status = null } = {}) => {
    let q = supabase
      .from("payslips")
      .select("*, employees(first_names, last_name, employee_number), payslip_line_items(*)")
      .eq("company_id", companyId)
      .order("period_end", { ascending: false });
    if (periodEnd) q = q.eq("period_end", periodEnd);
    if (status) q = q.eq("status", status);
    return await q;
  },
  get: async (id) => {
    return await supabase.from("payslips").select("*, payslip_line_items(*), employees(*)").eq("id", id).single();
  },
  upsert: async (payslip) => {
    return await supabase.from("payslips").upsert(payslip, { onConflict: "employee_id,period_end" }).select().single();
  },
  finalise: async (id, companyId, empName) => {
    const { data, error } = await supabase
      .from("payslips").update({ status: "Finalised", finalised_at: new Date().toISOString() })
      .eq("id", id).select().single();
    if (data) await logAction(companyId, "Finalised payslip", empName, "Payroll");
    return { data, error };
  },
  unfinalise: async (id, companyId, empName) => {
    const { data, error } = await supabase
      .from("payslips").update({ status: "Pending", finalised_at: null })
      .eq("id", id).select().single();
    if (data) await logAction(companyId, "Unfinalised payslip", empName, "Payroll");
    return { data, error };
  },
  bulkFinalise: async (ids, companyId) => {
    const { data, error } = await supabase
      .from("payslips").update({ status: "Finalised", finalised_at: new Date().toISOString() })
      .in("id", ids).select();
    if (data) await logAction(companyId, "Bulk finalised payslips", `${ids.length} payslips`, "Payroll");
    return { data, error };
  },
  releaseToSS: async (companyId, periodEnd) => {
    const { data, error } = await supabase
      .from("payslips")
      .update({ released_to_ss: true, released_at: new Date().toISOString() })
      .eq("company_id", companyId).eq("period_end", periodEnd).eq("status", "Finalised").select();
    if (data) await logAction(companyId, "Released payslips to self-service", periodEnd, "Self-Service");
    return { data, error };
  },
  addLineItem: async (payslipId, companyId, item) => {
    return await supabase.from("payslip_line_items").insert({ ...item, payslip_id: payslipId, company_id: companyId }).select().single();
  },
  removeLineItem: async (id) => {
    return await supabase.from("payslip_line_items").delete().eq("id", id);
  },
};

export const payRuns = {
  list: async (companyId) => {
    return await supabase.from("pay_runs").select("*, pay_run_payslips(payslip_id)").eq("company_id", companyId).order("period_end", { ascending: false });
  },
  create: async (payRun, payslipIds, companyId) => {
    const { data: run, error } = await supabase.from("pay_runs").insert(payRun).select().single();
    if (error) return { data: null, error };
    await supabase.from("pay_run_payslips").insert(payslipIds.map(pid => ({ pay_run_id: run.id, payslip_id: pid })));
    await logAction(companyId, "Created pay run", run.label, "Payroll");
    return { data: run, error: null };
  },
  delete: async (id, companyId, label) => {
    const { error } = await supabase.from("pay_runs").delete().eq("id", id);
    if (!error) await logAction(companyId, "Deleted pay run", label, "Payroll");
    return { error };
  },
};

export const leave = {
  types: async () => supabase.from("leave_types").select("*").order("name"),
  policies: async (companyId) => supabase.from("leave_policies").select("*, leave_types(name)").eq("company_id", companyId),
  records: async (companyId, { employeeId = null, dateFrom = null, dateTo = null } = {}) => {
    let q = supabase.from("leave_records")
      .select("*, employees(first_names, last_name), leave_types(name)")
      .eq("company_id", companyId).order("date_from", { ascending: false });
    if (employeeId) q = q.eq("employee_id", employeeId);
    if (dateFrom) q = q.gte("date_from", dateFrom);
    if (dateTo) q = q.lte("date_to", dateTo);
    return await q;
  },
  record: async (companyId, record) => {
    const { data, error } = await supabase.from("leave_records").insert({ ...record, company_id: companyId }).select().single();
    if (data) await logAction(companyId, "Recorded leave", `${record.days} days`, "Leave");
    return { data, error };
  },
  adjustments: async (companyId, employeeId = null) => {
    let q = supabase.from("leave_adjustments").select("*").eq("company_id", companyId);
    if (employeeId) q = q.eq("employee_id", employeeId);
    return await q;
  },
  addAdjustment: async (companyId, adj) => {
    const { data, error } = await supabase.from("leave_adjustments").insert({ ...adj, company_id: companyId }).select().single();
    if (data) await logAction(companyId, "Added leave adjustment", `${adj.amount > 0 ? "+" : ""}${adj.amount} days`, "Leave");
    return { data, error };
  },
};

export const selfService = {
  requests: async (companyId, { status = null, employeeId = null } = {}) => {
    let q = supabase.from("ss_requests")
      .select("*, employees(first_names, last_name)")
      .eq("company_id", companyId).order("created_at", { ascending: false });
    if (status) q = q.eq("status", status);
    if (employeeId) q = q.eq("employee_id", employeeId);
    return await q;
  },
  submit: async (companyId, request) => {
    return await supabase.from("ss_requests").insert({ ...request, company_id: companyId }).select().single();
  },
  action: async (id, status, comment, companyId) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase.from("ss_requests")
      .update({ status, comment, actioned_by: user?.id, actioned_at: new Date().toISOString() })
      .eq("id", id).select().single();
    if (data) await logAction(companyId, `${status} request`, data.details, "Self-Service");
    return { data, error };
  },
};

export const reports = {
  transactionHistory: async (companyIds, { dateFrom, dateTo } = {}) => {
    let q = supabase.from("payslips")
      .select("*, employees(first_names, last_name, employee_number), payslip_line_items(*), companies(trading_name, name)")
      .in("company_id", companyIds).eq("status", "Finalised");
    if (dateFrom) q = q.gte("period_end", dateFrom);
    if (dateTo) q = q.lte("period_end", dateTo);
    return await q.order("period_end", { ascending: false });
  },
  employeeBasicInfo: async (companyIds) => {
    return await supabase.from("employees")
      .select("*, pay_frequencies(name), pay_points(name), employee_bank_accounts(*), companies(trading_name, name)")
      .in("company_id", companyIds).order("last_name");
  },
  leaveReport: async (companyIds, { dateFrom, dateTo } = {}) => {
    let q = supabase.from("leave_records")
      .select("*, employees(first_names, last_name), leave_types(name), companies(trading_name, name)")
      .in("company_id", companyIds);
    if (dateFrom) q = q.gte("date_from", dateFrom);
    if (dateTo) q = q.lte("date_to", dateTo);
    return await q.order("date_from", { ascending: false });
  },
};

export const users = {
  list: async (companyId) => supabase.from("user_profiles").select("*").eq("company_id", companyId).order("last_name"),
  add: async (companyId, profile) => {
    const { data, error } = await supabase.from("user_profiles").insert({ ...profile, company_id: companyId }).select().single();
    if (data) await logAction(companyId, "Added user", `${profile.first_name} ${profile.last_name}`, "Settings");
    return { data, error };
  },
  update: async (id, updates) => supabase.from("user_profiles").update(updates).eq("id", id).select().single(),
  remove: async (id, companyId, name) => {
    const { error } = await supabase.from("user_profiles").delete().eq("id", id);
    if (!error) await logAction(companyId, "Removed user", name, "Settings");
    return { error };
  },
};

export const auditLog = {
  list: async (companyId, { limit = 50, category = null } = {}) => {
    let q = supabase.from("audit_log").select("*").eq("company_id", companyId)
      .order("created_at", { ascending: false }).limit(limit);
    if (category) q = q.eq("category", category);
    return await q;
  },
};