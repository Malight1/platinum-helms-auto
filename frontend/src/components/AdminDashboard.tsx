import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "@/lib/api";
import { Card } from "../components/card";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/table";
import {
  Car,
  FileText,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Package,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

type DashboardOverview = {
  totalCars: number;
  activeCars: number;
  soldCars: number;
  totalLeads: number;
  totalFinancingLeads: number;
  pendingFinancingLeads: number;
  approvedFinancingLeads: number;
  totalImportationLeads: number;
  pendingImportationLeads: number;
  totalContactMessages: number;
  newContactMessages: number;
};

type Vehicle = {
  id: number;
  name?: string;
  brand?: string;
  make?: string;
  model?: string;
  year?: number;
  vin?: string | null;
  price?: number;
  status?: string;
};

type FinancingLead = {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  status?: string;
  submissionDate?: string;
  initialDepositBudget?: number | string | null;
  selectedCar?: { name?: string; brand?: string; model?: string } | null;
};

type ContactMessage = {
  id: number;
  name?: string;
  email?: string;
  phone?: string | null;
  subject?: string;
  message?: string;
  status?: string;
  createdAt?: string;
};

const emptyOverview: DashboardOverview = {
  totalCars: 0,
  activeCars: 0,
  soldCars: 0,
  totalLeads: 0,
  totalFinancingLeads: 0,
  pendingFinancingLeads: 0,
  approvedFinancingLeads: 0,
  totalImportationLeads: 0,
  pendingImportationLeads: 0,
  totalContactMessages: 0,
  newContactMessages: 0,
};

const formatCurrency = (value?: number | string | null) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatDate = (value?: string) => {
  if (!value) return "N/A";
  return new Intl.DateTimeFormat("en-NG", { year: "numeric", month: "short", day: "numeric" }).format(
    new Date(value),
  );
};

const labelStatus = (status?: string) => {
  if (!status) return "Unknown";
  return status
    .split(/[_\s-]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const downloadCsv = (fileName: string, rows: Record<string, unknown>[]) => {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const escapeCell = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const csv = [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => escapeCell(row[h])).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};

const statusVariant: Record<string, string> = {
  available: "bg-green-100 text-green-800 border-green-200",
  reserved: "bg-amber-100 text-amber-800 border-amber-200",
  sold: "bg-gray-100 text-gray-700 border-gray-200",
  hidden: "bg-gray-100 text-gray-600 border-gray-200",
  approved: "bg-green-100 text-green-800 border-green-200",
  contacted: "bg-blue-100 text-blue-800 border-blue-200",
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
  closed: "bg-gray-100 text-gray-600 border-gray-200",
  new: "bg-blue-100 text-blue-800 border-blue-200",
  responded: "bg-green-100 text-green-800 border-green-200",
};

function StatusBadge({ status }: { status?: string }) {
  const cls = statusVariant[(status || "").toLowerCase()] || "bg-gray-100 text-gray-600 border-gray-200";
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {labelStatus(status)}
    </span>
  );
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("vehicles");
  const [searchTerm, setSearchTerm] = useState("");
  const [overview, setOverview] = useState<DashboardOverview>(emptyOverview);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [applications, setApplications] = useState<FinancingLead[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadDashboard = async (query = searchTerm, showRefreshing = false) => {
    if (showRefreshing) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError("");

    try {
      const filters = query.trim() ? { search: query.trim(), limit: 20 } : { limit: 20 };
      const [statsResponse, carsResponse, leadsResponse] = await Promise.all([
        api.stats.getDashboard(),
        api.cars.getAllAdmin(filters),
        api.leads.getAll(filters),
      ]);
      setOverview(statsResponse.data?.overview || emptyOverview);
      setVehicles(carsResponse.data || []);
      setApplications(leadsResponse.data?.financing?.leads || []);
      setContacts(leadsResponse.data?.contact?.messages || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to load dashboard data");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard("");
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => loadDashboard(searchTerm, true), 350);
    return () => window.clearTimeout(timeout);
  }, [searchTerm]);

  const totalInventoryValue = useMemo(
    () => vehicles.reduce((total, v) => total + Number(v.price || 0), 0),
    [vehicles],
  );

  const deleteVehicle = (id: number) => {
    toast("Delete this vehicle?", {
      description: "This will permanently remove it from inventory.",
      action: { label: "Delete", onClick: () => doDeleteVehicle(id) },
      cancel: { label: "Cancel", onClick: () => {} },
      duration: 8000,
    });
  };

  const doDeleteVehicle = async (id: number) => {
    setActionId(`vehicle-${id}`);
    try {
      await api.cars.delete(id);
      await loadDashboard(searchTerm, true);
      toast.success("Vehicle deleted.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to delete vehicle");
      toast.error("Failed to delete vehicle.");
    } finally {
      setActionId(null);
    }
  };

  const updateApplicationStatus = async (id: number, status: string) => {
    setActionId(`application-${id}-${status}`);
    try {
      await api.leads.updateStatus("financing", id, status);
      await loadDashboard(searchTerm, true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to update application");
    } finally {
      setActionId(null);
    }
  };

  const markContactResponded = async (id: number) => {
    setActionId(`contact-${id}-responded`);
    try {
      await api.leads.updateStatus("contact", id, "responded");
      await loadDashboard(searchTerm, true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to update contact");
    } finally {
      setActionId(null);
    }
  };

  const deleteContact = (id: number) => {
    toast("Delete this contact message?", {
      description: "This action cannot be undone.",
      action: { label: "Delete", onClick: () => doDeleteContact(id) },
      cancel: { label: "Cancel", onClick: () => {} },
      duration: 8000,
    });
  };

  const doDeleteContact = async (id: number) => {
    setActionId(`contact-${id}`);
    try {
      await api.leads.delete("contact", id);
      await loadDashboard(searchTerm, true);
      toast.success("Contact deleted.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to delete contact");
      toast.error("Failed to delete contact.");
    } finally {
      setActionId(null);
    }
  };

  const exportCurrentTab = () => {
    if (activeTab === "vehicles") {
      downloadCsv(
        "vehicles.csv",
        vehicles.map((v) => ({
          id: v.id,
          vehicle: v.name || `${v.brand || v.make || ""} ${v.model || ""}`.trim(),
          year: v.year,
          vin: v.vin,
          price: v.price,
          status: v.status,
        })),
      );
      return;
    }
    if (activeTab === "applications") {
      downloadCsv(
        "finance-applications.csv",
        applications.map((a) => ({
          id: a.id,
          name: `${a.firstName || ""} ${a.lastName || ""}`.trim(),
          email: a.email,
          vehicle: a.selectedCar?.name || "N/A",
          depositBudget: a.initialDepositBudget,
          status: a.status,
          date: a.submissionDate,
        })),
      );
      return;
    }
    downloadCsv(
      "contacts.csv",
      contacts.map((c) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        subject: c.subject,
        status: c.status,
        date: c.createdAt,
      })),
    );
  };

  const renderEmptyRow = (message: string, colSpan: number) => (
    <TableRow>
      <TableCell colSpan={colSpan} className="py-12 text-center text-muted-foreground">
        {message}
      </TableCell>
    </TableRow>
  );

  const statCards = [
    {
      icon: Car,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      value: overview.totalCars,
      label: "Total Vehicles",
      sub: `${overview.activeCars} active listings`,
      subColor: "text-green-600",
    },
    {
      icon: FileText,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      value: overview.totalFinancingLeads,
      label: "Finance Applications",
      sub: `${overview.pendingFinancingLeads} pending review`,
      subColor: "text-amber-600",
    },
    {
      icon: MessageSquare,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      value: overview.totalContactMessages,
      label: "Contact Messages",
      sub: `${overview.newContactMessages} new`,
      subColor: "text-blue-600",
    },
    {
      icon: DollarSign,
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
      value: formatCurrency(totalInventoryValue),
      label: "Inventory Value",
      sub: `${overview.soldCars} vehicles sold`,
      subColor: "text-green-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sub-header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500">Manage your automotive business operations</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadDashboard(searchTerm, true)}
                disabled={isRefreshing}
              >
                {isRefreshing ? (
                  <Loader2 size={14} className="mr-1.5 animate-spin" />
                ) : (
                  <RefreshCw size={14} className="mr-1.5" />
                )}
                Refresh
              </Button>
              <Button size="sm" className="bg-brand hover:bg-brand-strong text-white" onClick={exportCurrentTab}>
                <Download size={14} className="mr-1.5" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertTriangle size={15} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {/* Stat cards */}
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map(({ icon: Icon, iconBg, iconColor, value, label, sub, subColor }) => (
            <Card key={label} className="border-none p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className={`flex size-11 items-center justify-center rounded-xl ${iconBg}`}>
                  <Icon size={20} className={iconColor} />
                </div>
                <TrendingUp size={16} className="text-green-500" />
              </div>
              <p className="mb-0.5 font-display text-2xl font-bold text-gray-900">
                {isLoading ? <Loader2 size={20} className="animate-spin text-gray-400" /> : value}
              </p>
              <p className="text-sm text-gray-600">{label}</p>
              <p className={`mt-1.5 text-xs font-medium ${subColor}`}>{sub}</p>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-5">
          <TabsList className="border border-gray-200 bg-white">
            <TabsTrigger
              value="vehicles"
              className="data-[state=active]:bg-brand data-[state=active]:text-white"
            >
              <Car size={14} className="mr-1.5" /> Vehicles
            </TabsTrigger>
            <TabsTrigger
              value="applications"
              className="data-[state=active]:bg-brand data-[state=active]:text-white"
            >
              <FileText size={14} className="mr-1.5" /> Applications
            </TabsTrigger>
            <TabsTrigger
              value="contacts"
              className="data-[state=active]:bg-brand data-[state=active]:text-white"
            >
              <MessageSquare size={14} className="mr-1.5" /> Contacts
            </TabsTrigger>
          </TabsList>

          {/* Vehicles tab */}
          <TabsContent value="vehicles">
            <Card className="overflow-hidden border-none shadow-sm">
              <div className="border-b border-gray-100 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">Vehicle Inventory</h2>
                  <Button
                    size="sm"
                    className="bg-brand hover:bg-brand-strong text-white"
                    onClick={() => navigate("/admin/vehicles")}
                  >
                    <Package size={14} className="mr-1.5" /> Manage All
                  </Button>
                </div>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search vehicles…"
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    <Filter size={14} className="mr-1.5" /> Filter
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50">
                      <TableHead className="font-semibold">Vehicle</TableHead>
                      <TableHead className="font-semibold">Year</TableHead>
                      <TableHead className="font-semibold">VIN</TableHead>
                      <TableHead className="font-semibold">Price</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="text-right font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading && renderEmptyRow("Loading vehicles…", 6)}
                    {!isLoading && vehicles.length === 0 && renderEmptyRow("No vehicles found.", 6)}
                    {!isLoading &&
                      vehicles.map((vehicle) => (
                        <TableRow key={vehicle.id} className="hover:bg-gray-50/50">
                          <TableCell>
                            <div className="font-medium text-gray-900">
                              {vehicle.name || vehicle.brand || vehicle.make || "Unnamed"}
                            </div>
                            <div className="text-sm text-gray-500">{vehicle.model || "N/A"}</div>
                          </TableCell>
                          <TableCell className="text-gray-700">{vehicle.year || "N/A"}</TableCell>
                          <TableCell className="font-mono text-xs text-gray-500">
                            {vehicle.vin || "N/A"}
                          </TableCell>
                          <TableCell className="font-medium text-gray-900">
                            {formatCurrency(vehicle.price)}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={vehicle.status} />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="sm" disabled>
                                <Eye size={15} className="text-gray-400" />
                              </Button>
                              <Button variant="ghost" size="sm" disabled>
                                <Edit size={15} className="text-gray-400" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteVehicle(vehicle.id)}
                                disabled={actionId === `vehicle-${vehicle.id}`}
                              >
                                {actionId === `vehicle-${vehicle.id}` ? (
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
          </TabsContent>

          {/* Applications tab */}
          <TabsContent value="applications">
            <Card className="overflow-hidden border-none shadow-sm">
              <div className="border-b border-gray-100 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">Finance Applications</h2>
                  <div className="flex gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                      <CheckCircle size={12} /> {overview.approvedFinancingLeads} Approved
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                      <Clock size={12} /> {overview.pendingFinancingLeads} Pending
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search applications…"
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    <Filter size={14} className="mr-1.5" /> Filter
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50">
                      <TableHead className="font-semibold">Applicant</TableHead>
                      <TableHead className="font-semibold">Vehicle Interest</TableHead>
                      <TableHead className="font-semibold">Deposit Budget</TableHead>
                      <TableHead className="font-semibold">Date</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="text-right font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading && renderEmptyRow("Loading applications…", 6)}
                    {!isLoading && applications.length === 0 && renderEmptyRow("No applications found.", 6)}
                    {!isLoading &&
                      applications.map((app) => (
                        <TableRow key={app.id} className="hover:bg-gray-50/50">
                          <TableCell>
                            <div className="font-medium text-gray-900">
                              {`${app.firstName || ""} ${app.lastName || ""}`.trim() || "Unnamed"}
                            </div>
                            <div className="text-sm text-gray-500">{app.email || "N/A"}</div>
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {app.selectedCar?.name ||
                              `${app.selectedCar?.brand || ""} ${app.selectedCar?.model || ""}`.trim() ||
                              "N/A"}
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {formatCurrency(app.initialDepositBudget)}
                          </TableCell>
                          <TableCell className="text-gray-500">{formatDate(app.submissionDate)}</TableCell>
                          <TableCell>
                            <StatusBadge status={app.status} />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="sm" disabled>
                                <Eye size={15} className="text-gray-400" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateApplicationStatus(app.id, "approved")}
                                disabled={actionId === `application-${app.id}-approved`}
                              >
                                {actionId === `application-${app.id}-approved` ? (
                                  <Loader2 size={15} className="animate-spin" />
                                ) : (
                                  <CheckCircle size={15} className="text-green-600" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateApplicationStatus(app.id, "rejected")}
                                disabled={actionId === `application-${app.id}-rejected`}
                              >
                                {actionId === `application-${app.id}-rejected` ? (
                                  <Loader2 size={15} className="animate-spin" />
                                ) : (
                                  <XCircle size={15} className="text-red-500" />
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
          </TabsContent>

          {/* Contacts tab */}
          <TabsContent value="contacts">
            <Card className="overflow-hidden border-none shadow-sm">
              <div className="border-b border-gray-100 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">Contact Messages</h2>
                  <Button size="sm" className="bg-brand hover:bg-brand-strong text-white" onClick={exportCurrentTab}>
                    <Download size={14} className="mr-1.5" /> Export
                  </Button>
                </div>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search contacts…"
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    <Filter size={14} className="mr-1.5" /> Filter
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50">
                      <TableHead className="font-semibold">Contact</TableHead>
                      <TableHead className="font-semibold">Subject</TableHead>
                      <TableHead className="font-semibold">Message</TableHead>
                      <TableHead className="font-semibold">Date</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="text-right font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading && renderEmptyRow("Loading contacts…", 6)}
                    {!isLoading && contacts.length === 0 && renderEmptyRow("No contacts found.", 6)}
                    {!isLoading &&
                      contacts.map((contact) => (
                        <TableRow key={contact.id} className="hover:bg-gray-50/50">
                          <TableCell>
                            <div className="font-medium text-gray-900">{contact.name || "Unnamed"}</div>
                            <div className="text-sm text-gray-500">{contact.email || "N/A"}</div>
                            <div className="text-sm text-gray-500">{contact.phone || "N/A"}</div>
                          </TableCell>
                          <TableCell className="text-gray-700">{contact.subject || "N/A"}</TableCell>
                          <TableCell className="max-w-xs truncate text-sm text-gray-500">
                            {contact.message || "N/A"}
                          </TableCell>
                          <TableCell className="text-gray-500">{formatDate(contact.createdAt)}</TableCell>
                          <TableCell>
                            <StatusBadge status={contact.status} />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="sm" disabled>
                                <Eye size={15} className="text-gray-400" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markContactResponded(contact.id)}
                                disabled={actionId === `contact-${contact.id}-responded`}
                              >
                                {actionId === `contact-${contact.id}-responded` ? (
                                  <Loader2 size={15} className="animate-spin" />
                                ) : (
                                  <Edit size={15} className="text-blue-500" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteContact(contact.id)}
                                disabled={actionId === `contact-${contact.id}`}
                              >
                                {actionId === `contact-${contact.id}` ? (
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
