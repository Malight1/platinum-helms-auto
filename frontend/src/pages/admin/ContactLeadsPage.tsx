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

const statusVariant: Record<string, string> = {
  new: "bg-blue-100 text-blue-800 border-blue-200",
  responded: "bg-green-100 text-green-800 border-green-200",
  closed: "bg-gray-100 text-gray-600 border-gray-200",
};

function StatusBadge({ status }: { status?: string }) {
  const cls = statusVariant[(status || "").toLowerCase()] || "bg-gray-100 text-gray-600 border-gray-200";
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
          <h1 className="font-display text-2xl font-bold text-gray-900">Contact Leads</h1>
          <p className="text-sm text-gray-500">Messages and contact requests submitted from the public site.</p>
        </div>
        <Button onClick={exportContacts} className="bg-brand hover:bg-brand-strong text-white">
          <Download size={15} className="mr-1.5" /> Export Contacts
        </Button>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle size={15} className="mt-0.5 shrink-0" /> {error}
        </div>
      )}

      <Card className="overflow-hidden border-none shadow-sm">
        <div className="border-b border-gray-100 p-5">
          <Input
            className="md:max-w-sm"
            placeholder="Search contacts…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="font-semibold">Contact</TableHead>
                <TableHead className="font-semibold">Subject</TableHead>
                <TableHead className="font-semibold">Message</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center">
                    <Loader2 size={20} className="mx-auto animate-spin text-gray-400" />
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && contacts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                    No contact leads found.
                  </TableCell>
                </TableRow>
              )}
              {contacts.map((contact) => (
                <TableRow key={contact.id} className="hover:bg-gray-50/50">
                  <TableCell>
                    <div className="font-medium text-gray-900">{contact.name || "Unnamed contact"}</div>
                    <div className="text-sm text-gray-500">{contact.email}</div>
                    <div className="text-sm text-gray-500">{contact.phone || "N/A"}</div>
                  </TableCell>
                  <TableCell className="text-gray-700">{contact.subject}</TableCell>
                  <TableCell className="max-w-md text-sm text-gray-500">{contact.message}</TableCell>
                  <TableCell>
                    <StatusBadge status={contact.status} />
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">{formatDate(contact.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateStatus(contact.id, "responded")}
                        disabled={actionId === `${contact.id}-responded`}
                        title="Mark as responded"
                      >
                        {actionId === `${contact.id}-responded` ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : (
                          <CheckCircle size={15} className="text-green-600" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteContact(contact.id)}
                        disabled={actionId === `${contact.id}-delete`}
                        title="Delete"
                      >
                        {actionId === `${contact.id}-delete` ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : (
                          <Trash2 size={15} className="text-red-500" />
                        )}
                      </Button>
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
