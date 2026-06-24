import { useEffect, useState } from "react";
import api from "@/lib/api";
import { downloadCsv, formatCurrency, formatDate, labelStatus } from "@/lib/adminUtils";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { AlertTriangle, CheckCircle, Download, Loader2, XCircle } from "lucide-react";

type FinancingLead = {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  employmentStatus?: string;
  employer?: string;
  jobTitle?: string;
  monthlyIncome?: string;
  annualIncome?: string;
  preferredRepaymentDuration?: string;
  initialDepositBudget?: number | string | null;
  additionalNotes?: string;
  status?: string;
  submissionDate?: string;
  selectedCar?: { name?: string; brand?: string; model?: string } | null;
};

const statusColors: Record<string, string> = {
  approved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  pending: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  rejected: "bg-red-500/15 text-red-400 border-red-500/25",
  contacted: "bg-blue-500/15 text-blue-400 border-blue-500/25",
};

function StatusBadge({ status }: { status?: string }) {
  const cls = statusColors[(status || "").toLowerCase()] ?? "bg-white/10 text-white/40 border-white/15";
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${cls}`}>
      {labelStatus(status)}
    </span>
  );
}

export default function FinanceApplicationsPage() {
  const [applications, setApplications] = useState<FinancingLead[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadApplications = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await api.leads.getAll({ type: "financing", limit: 100, search });
      setApplications(response.data?.financing?.leads || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load applications");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeout = window.setTimeout(loadApplications, 250);
    return () => window.clearTimeout(timeout);
  }, [search]);

  const updateStatus = async (id: number, status: string) => {
    setActionId(`${id}-${status}`);
    try {
      await api.leads.updateStatus("financing", id, status);
      await loadApplications();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update status");
    } finally {
      setActionId(null);
    }
  };

  const exportApplications = () => {
    downloadCsv(
      "finance-applications.csv",
      applications.map((a) => ({
        id: a.id,
        name: `${a.firstName || ""} ${a.lastName || ""}`.trim(),
        email: a.email,
        phone: a.phone,
        selectedCar: a.selectedCar?.name,
        employmentStatus: a.employmentStatus,
        employer: a.employer,
        jobTitle: a.jobTitle,
        monthlyIncome: a.monthlyIncome,
        annualIncome: a.annualIncome,
        repaymentDuration: a.preferredRepaymentDuration,
        initialDepositBudget: a.initialDepositBudget,
        status: a.status,
        submissionDate: a.submissionDate,
        additionalNotes: a.additionalNotes,
      })),
    );
  };

  const cell = "bg-white/[0.035] px-4 py-3.5 align-top transition-colors first:rounded-l-xl last:rounded-r-xl group-hover:bg-white/[0.055]";

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Finance Applications</h1>
          <p className="mt-0.5 text-sm text-white/50">Review financing leads submitted from the public site.</p>
        </div>
        <Button onClick={exportApplications} className="bg-brand hover:bg-brand-strong text-white">
          <Download size={15} className="mr-1.5" /> Export Applications
        </Button>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <AlertTriangle size={15} className="mt-0.5 shrink-0" /> {error}
        </div>
      )}

      <div className="rounded-2xl border border-white/[0.08] bg-obsidian-soft">
        <div className="flex flex-col gap-4 border-b border-white/[0.06] p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-base font-semibold text-white">Applications</h2>
            <p className="mt-0.5 text-xs text-white/40">{applications.length} application{applications.length !== 1 ? "s" : ""}</p>
          </div>
          <Input
            className="border-white/[0.12] bg-white/[0.05] text-white placeholder:text-white/30 md:max-w-sm"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto px-4 pb-4 pt-2 sm:px-5">
          <table className="w-full border-separate" style={{ borderSpacing: "0 6px", minWidth: 800 }}>
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-white/25">Applicant</th>
                <th className="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-white/25">Vehicle</th>
                <th className="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-white/25">Employment</th>
                <th className="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-white/25">Financials</th>
                <th className="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-white/25">Status</th>
                <th className="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-white/25">Date</th>
                <th className="px-4 py-2 text-right text-[10px] font-semibold uppercase tracking-[0.12em] text-white/25">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading &&
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td className="first:rounded-l-xl last:rounded-r-xl bg-white/[0.03] px-4 py-3.5">
                      <div className="space-y-2">
                        <div className="h-3 w-32 animate-pulse rounded bg-white/[0.07]" />
                        <div className="h-2.5 w-40 animate-pulse rounded bg-white/[0.05]" />
                        <div className="h-2.5 w-24 animate-pulse rounded bg-white/[0.05]" />
                      </div>
                    </td>
                    <td className="first:rounded-l-xl last:rounded-r-xl bg-white/[0.03] px-4 py-3.5">
                      <div className="h-2.5 w-28 animate-pulse rounded bg-white/[0.07]" />
                    </td>
                    <td className="first:rounded-l-xl last:rounded-r-xl bg-white/[0.03] px-4 py-3.5">
                      <div className="space-y-2">
                        <div className="h-2.5 w-24 animate-pulse rounded bg-white/[0.07]" />
                        <div className="h-2.5 w-32 animate-pulse rounded bg-white/[0.05]" />
                      </div>
                    </td>
                    <td className="first:rounded-l-xl last:rounded-r-xl bg-white/[0.03] px-4 py-3.5">
                      <div className="space-y-2">
                        <div className="h-2.5 w-28 animate-pulse rounded bg-white/[0.07]" />
                        <div className="h-2.5 w-24 animate-pulse rounded bg-white/[0.05]" />
                        <div className="h-2.5 w-20 animate-pulse rounded bg-white/[0.05]" />
                      </div>
                    </td>
                    <td className="first:rounded-l-xl last:rounded-r-xl bg-white/[0.03] px-4 py-3.5">
                      <div className="h-5 w-16 animate-pulse rounded-full bg-white/[0.07]" />
                    </td>
                    <td className="first:rounded-l-xl last:rounded-r-xl bg-white/[0.03] px-4 py-3.5">
                      <div className="h-2.5 w-20 animate-pulse rounded bg-white/[0.07]" />
                    </td>
                    <td className="first:rounded-l-xl last:rounded-r-xl bg-white/[0.03] px-4 py-3.5">
                      <div className="ml-auto flex gap-1">
                        <div className="h-7 w-7 animate-pulse rounded-lg bg-white/[0.07]" />
                        <div className="h-7 w-7 animate-pulse rounded-lg bg-white/[0.05]" />
                      </div>
                    </td>
                  </tr>
                ))}

              {!isLoading && applications.length === 0 && (
                <tr>
                  <td colSpan={7} className="rounded-xl bg-white/[0.03] px-4 py-16 text-center text-sm text-white/30">
                    No finance applications yet.
                  </td>
                </tr>
              )}

              {!isLoading &&
                applications.map((app) => (
                  <tr key={app.id} className="group">
                    <td className={cell}>
                      <div className="min-w-[160px]">
                        <div className="text-sm font-medium text-white">
                          {`${app.firstName || ""} ${app.lastName || ""}`.trim() || "Unnamed applicant"}
                        </div>
                        <div className="mt-0.5 text-xs text-white/45">{app.email}</div>
                        <div className="text-xs text-white/35">{app.phone}</div>
                      </div>
                    </td>
                    <td className={cell}>
                      <span className="min-w-[120px] text-sm text-white/70">
                        {app.selectedCar?.name ||
                          `${app.selectedCar?.brand || ""} ${app.selectedCar?.model || ""}`.trim() ||
                          <span className="text-white/25">—</span>}
                      </span>
                    </td>
                    <td className={cell}>
                      <div className="min-w-[120px] space-y-0.5">
                        <div className="text-sm text-white/70">{labelStatus(app.employmentStatus)}</div>
                        <div className="text-xs text-white/45">{app.employer || "—"}</div>
                        <div className="text-xs text-white/35">{app.jobTitle || "—"}</div>
                      </div>
                    </td>
                    <td className={cell}>
                      <div className="min-w-[140px] space-y-0.5">
                        <div className="text-xs text-white/50">Monthly <span className="text-white/75">{app.monthlyIncome || "—"}</span></div>
                        <div className="text-xs text-white/50">Annual <span className="text-white/75">{app.annualIncome || "—"}</span></div>
                        <div className="text-xs text-white/50">Deposit <span className="font-medium text-brand">{formatCurrency(app.initialDepositBudget)}</span></div>
                      </div>
                    </td>
                    <td className={cell}>
                      <StatusBadge status={app.status} />
                    </td>
                    <td className={cell}>
                      <span className="text-xs text-white/35">{formatDate(app.submissionDate)}</span>
                    </td>
                    <td className={cell}>
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => updateStatus(app.id, "approved")}
                          disabled={actionId === `${app.id}-approved`}
                          title="Approve"
                          className="flex size-8 items-center justify-center rounded-lg transition hover:bg-emerald-500/10 disabled:opacity-50"
                        >
                          {actionId === `${app.id}-approved` ? (
                            <Loader2 size={14} className="animate-spin text-white/30" />
                          ) : (
                            <CheckCircle size={15} className="text-emerald-400" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => updateStatus(app.id, "rejected")}
                          disabled={actionId === `${app.id}-rejected`}
                          title="Reject"
                          className="flex size-8 items-center justify-center rounded-lg transition hover:bg-red-500/10 disabled:opacity-50"
                        >
                          {actionId === `${app.id}-rejected` ? (
                            <Loader2 size={14} className="animate-spin text-white/30" />
                          ) : (
                            <XCircle size={15} className="text-red-400" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
