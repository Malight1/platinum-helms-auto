import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import { downloadCsv, formatDate, labelStatus } from "@/lib/adminUtils";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Input } from "@/components/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";
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
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${cls}`}>
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

      <Card className="overflow-hidden rounded-2xl border border-white/[0.08] bg-obsidian-soft shadow-none">
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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.02]">
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-white/40">Contact</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-white/40">Subject</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-white/40">Message</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-white/40">Status</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-white/40">Date</TableHead>
                <TableHead className="text-right text-xs font-semibold uppercase tracking-wider text-white/40">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow className="border-white/[0.06]">
                  <TableCell colSpan={6} className="py-16 text-center">
                    <Loader2 size={20} className="mx-auto animate-spin text-white/30" />
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && contacts.length === 0 && (
                <TableRow className="border-white/[0.06]">
                  <TableCell colSpan={6} className="py-16 text-center text-sm text-white/30">
                    No contact leads found.
                  </TableCell>
                </TableRow>
              )}
              {contacts.map((contact) => (
                <TableRow key={contact.id} className="border-white/[0.06] hover:bg-white/[0.025]">
                  <TableCell>
                    <div className="font-medium text-white">{contact.name || "Unnamed contact"}</div>
                    <div className="text-xs text-white/45">{contact.email}</div>
                    <div className="text-xs text-white/40">{contact.phone || "—"}</div>
                  </TableCell>
                  <TableCell className="text-sm text-white/70">{contact.subject}</TableCell>
                  <TableCell className="max-w-xs">
                    <p className="line-clamp-2 text-sm text-white/50">{contact.message}</p>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={contact.status} />
                  </TableCell>
                  <TableCell className="text-xs text-white/40">{formatDate(contact.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => updateStatus(contact.id, "responded")}
                        disabled={actionId === `${contact.id}-responded`}
                        title="Mark as responded"
                        className="flex size-8 items-center justify-center rounded-lg transition hover:bg-emerald-500/10 disabled:opacity-50"
                      >
                        {actionId === `${contact.id}-responded` ? (
                          <Loader2 size={14} className="animate-spin text-white/40" />
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
                          <Loader2 size={14} className="animate-spin text-white/40" />
                        ) : (
                          <Trash2 size={14} className="text-red-400" />
                        )}
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
