import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import { downloadCsv, formatDate, labelStatus } from "@/lib/adminUtils";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { AlertTriangle, CheckCircle, Download, Loader2, Trash2 } from "lucide-react";

type ContactLead = {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  status?: string;
  createdAt?: string;
};

const statusColors: Record<string, string> = {
  new: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  responded: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  closed: "bg-white/10 text-white/40 border-white/15",
};

function StatusBadge({ status }: { status?: string }) {
  const cls = statusColors[(status || "").toLowerCase()] ?? "bg-white/10 text-white/40 border-white/15";
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${cls}`}>
      {labelStatus(status)}
    </span>
  );
}

export default function ContactLeadsPage() {
  const [contacts, setContacts] = useState<ContactLead[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadContacts = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await api.leads.getAll({ type: "contact", limit: 100, search });
      setContacts(response.data?.contact?.messages || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load contacts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeout = window.setTimeout(loadContacts, 250);
    return () => window.clearTimeout(timeout);
  }, [search]);

  const updateStatus = async (id: number, status: string) => {
    setActionId(`${id}-${status}`);
    try {
      await api.leads.updateStatus("contact", id, status);
      await loadContacts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update contact");
    } finally {
      setActionId(null);
    }
  };

  const deleteContact = (id: number) => {
    toast("Delete this contact lead?", {
      description: "This action cannot be undone.",
      action: { label: "Delete", onClick: () => doDeleteContact(id) },
      cancel: { label: "Cancel", onClick: () => {} },
      duration: 8000,
    });
  };

  const doDeleteContact = async (id: number) => {
    setActionId(`${id}-delete`);
    try {
      await api.leads.delete("contact", id);
      await loadContacts();
      toast.success("Contact deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete contact");
      toast.error("Failed to delete contact.");
    } finally {
      setActionId(null);
    }
  };

  const exportContacts = () => {
    downloadCsv(
      "contact-leads.csv",
      contacts.map((c) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        subject: c.subject,
        message: c.message,
        status: c.status,
        createdAt: c.createdAt,
      })),
    );
  };

  const cell = "bg-white/[0.035] px-4 py-3.5 align-top transition-colors first:rounded-l-xl last:rounded-r-xl group-hover:bg-white/[0.055]";

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Contact Leads</h1>
          <p className="mt-0.5 text-sm text-white/50">Messages and contact requests submitted from the public site.</p>
        </div>
        <Button onClick={exportContacts} className="bg-brand hover:bg-brand-strong text-white">
          <Download size={15} className="mr-1.5" /> Export Contacts
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
            <h2 className="font-display text-base font-semibold text-white">Contact Messages</h2>
            <p className="mt-0.5 text-xs text-white/40">{contacts.length} message{contacts.length !== 1 ? "s" : ""}</p>
          </div>
          <Input
            className="border-white/[0.12] bg-white/[0.05] text-white placeholder:text-white/30 md:max-w-sm"
            placeholder="Search contacts…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto px-4 pb-4 pt-2 sm:px-5">
          <table className="w-full border-separate" style={{ borderSpacing: "0 6px", minWidth: 720 }}>
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-white/25">Contact</th>
                <th className="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-white/25">Subject</th>
                <th className="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-white/25">Message</th>
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
                        <div className="h-3 w-28 animate-pulse rounded bg-white/[0.07]" />
                        <div className="h-2.5 w-36 animate-pulse rounded bg-white/[0.05]" />
                        <div className="h-2.5 w-20 animate-pulse rounded bg-white/[0.05]" />
                      </div>
                    </td>
                    <td className="first:rounded-l-xl last:rounded-r-xl bg-white/[0.03] px-4 py-3.5">
                      <div className="h-2.5 w-32 animate-pulse rounded bg-white/[0.07]" />
                    </td>
                    <td className="first:rounded-l-xl last:rounded-r-xl bg-white/[0.03] px-4 py-3.5">
                      <div className="space-y-1.5">
                        <div className="h-2.5 w-full max-w-[260px] animate-pulse rounded bg-white/[0.07]" />
                        <div className="h-2.5 w-3/4 max-w-[200px] animate-pulse rounded bg-white/[0.05]" />
                      </div>
                    </td>
                    <td className="first:rounded-l-xl last:rounded-r-xl bg-white/[0.03] px-4 py-3.5">
                      <div className="h-5 w-14 animate-pulse rounded-full bg-white/[0.07]" />
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

              {!isLoading && contacts.length === 0 && (
                <tr>
                  <td colSpan={6} className="rounded-xl bg-white/[0.03] px-4 py-16 text-center text-sm text-white/30">
                    No contact leads yet.
                  </td>
                </tr>
              )}

              {!isLoading &&
                contacts.map((contact) => (
                  <tr key={contact.id} className="group">
                    <td className={cell}>
                      <div className="min-w-[150px]">
                        <div className="text-sm font-medium text-white">{contact.name || "Unnamed"}</div>
                        <div className="mt-0.5 text-xs text-white/45">{contact.email}</div>
                        <div className="text-xs text-white/35">{contact.phone || "—"}</div>
                      </div>
                    </td>
                    <td className={cell}>
                      <span className="min-w-[140px] text-sm text-white/70">{contact.subject}</span>
                    </td>
                    <td className={cell}>
                      <p className="line-clamp-2 max-w-xs text-sm leading-relaxed text-white/45">{contact.message}</p>
                    </td>
                    <td className={cell}>
                      <StatusBadge status={contact.status} />
                    </td>
                    <td className={cell}>
                      <span className="text-xs text-white/35">{formatDate(contact.createdAt)}</span>
                    </td>
                    <td className={cell}>
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => updateStatus(contact.id, "responded")}
                          disabled={actionId === `${contact.id}-responded`}
                          title="Mark as responded"
                          className="flex size-8 items-center justify-center rounded-lg transition hover:bg-emerald-500/10 disabled:opacity-50"
                        >
                          {actionId === `${contact.id}-responded` ? (
                            <Loader2 size={14} className="animate-spin text-white/30" />
                          ) : (
                            <CheckCircle size={15} className="text-emerald-400" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteContact(contact.id)}
                          disabled={actionId === `${contact.id}-delete`}
                          title="Delete"
                          className="flex size-8 items-center justify-center rounded-lg transition hover:bg-red-500/10 disabled:opacity-50"
                        >
                          {actionId === `${contact.id}-delete` ? (
                            <Loader2 size={14} className="animate-spin text-white/30" />
                          ) : (
                            <Trash2 size={14} className="text-red-400" />
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
