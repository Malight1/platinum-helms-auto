import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { CarRecord, formatCurrency, labelStatus, normalizeCar } from "@/lib/adminUtils";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Input } from "@/components/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog";
import { AlertTriangle, Package, Pencil, Plus, Search } from "lucide-react";

const TYPE_TABS = [
  { value: "all", label: "All" },
  { value: "purchase", label: "Purchase" },
  { value: "importation", label: "Importation" },
];

const statusColors: Record<string, string> = {
  available: "bg-green-100 text-green-800",
  reserved: "bg-amber-100 text-amber-800",
  sold: "bg-gray-200 text-gray-700",
  hidden: "bg-gray-200 text-gray-600",
};

export default function VehicleCatalogPage() {
  const navigate = useNavigate();
  const [cars, setCars] = useState<CarRecord[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<CarRecord | null>(null);

  const loadCars = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await api.cars.getAllAdmin({ limit: 200 });
      setCars((response.data || []).map(normalizeCar));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load vehicles");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCars();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return cars.filter((car) => {
      const matchesType = typeFilter === "all" || car.listingType === typeFilter;
      const matchesSearch =
        !q || [car.name, car.brand, car.model].some((s) => s.toLowerCase().includes(q));
      return matchesType && matchesSearch;
    });
  }, [cars, search, typeFilter]);

  const counts = useMemo(
    () => ({
      all: cars.length,
      purchase: cars.filter((c) => c.listingType === "purchase").length,
      importation: cars.filter((c) => c.listingType === "importation").length,
    }),
    [cars],
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-900">All Vehicles</h1>
            <p className="mt-0.5 text-sm text-gray-500">Your full vehicle catalog across purchase and importation.</p>
          </div>
          <Button className="bg-brand hover:bg-brand-strong text-white" onClick={() => navigate("/admin/vehicles")}>
            <Plus size={15} className="mr-1.5" /> Add / Manage Vehicles
          </Button>
        </div>

        {error && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span className="flex items-start gap-2"><AlertTriangle size={15} className="mt-0.5 shrink-0" /> {error}</span>
            <button onClick={loadCars} className="shrink-0 rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium hover:bg-red-100">Retry</button>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {TYPE_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setTypeFilter(tab.value)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                  typeFilter === tab.value
                    ? "border-brand bg-brand text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab.label}
                <span className={`ml-1.5 ${typeFilter === tab.value ? "text-white/70" : "text-gray-400"}`}>
                  {counts[tab.value as keyof typeof counts]}
                </span>
              </button>
            ))}
          </div>
          <div className="relative sm:w-72">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input className="pl-9" placeholder="Search vehicles…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-2xl bg-gray-200/70" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card className="flex flex-col items-center gap-2 border-none py-20 text-center shadow-sm">
            <Package size={28} className="text-gray-300" />
            <p className="text-sm text-gray-500">No vehicles found{typeFilter !== "all" ? ` in ${typeFilter}` : ""}.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((car) => (
              <Card
                key={car.id}
                onClick={() => setSelected(car)}
                className="group cursor-pointer overflow-hidden border-none p-0 shadow-sm transition hover:shadow-md"
              >
                <div className="relative h-44 overflow-hidden bg-gray-100">
                  <img src={car.image} alt={car.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                  <span className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${car.listingType === "importation" ? "bg-blue-600 text-white" : "bg-gray-900 text-white"}`}>
                    {car.listingType === "importation" ? "Importation" : "Purchase"}
                  </span>
                  <span className={`absolute right-3 top-3 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusColors[car.status || "available"] || "bg-gray-200 text-gray-700"}`}>
                    {labelStatus(car.status)}
                  </span>
                </div>
                <div className="p-4">
                  <div className="truncate font-semibold text-gray-900">{car.name}</div>
                  <div className="text-sm text-gray-500">{car.brand} {car.model} · {car.year}</div>
                  <div className="mt-1.5 font-display text-lg font-bold text-brand">{formatCurrency(car.price)}</div>
                  <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-2.5">
                    <span className="text-xs text-gray-400">{car.condition}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate("/admin/vehicles"); }}
                      className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-brand"
                    >
                      <Pencil size={12} /> Edit
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.name}</DialogTitle>
                <DialogDescription>
                  {selected.listingType === "importation" ? "Importation vehicle" : "Purchase vehicle"}
                </DialogDescription>
              </DialogHeader>
              <img src={selected.image} alt={selected.name} className="h-48 w-full rounded-xl object-cover" />
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
                <DetailRow label="Brand / Model" value={`${selected.brand} ${selected.model}`} />
                <DetailRow label="Year" value={selected.year} />
                <DetailRow label="Price" value={formatCurrency(selected.price)} />
                <DetailRow label="Condition" value={selected.condition} />
                <DetailRow label="Body / Fuel" value={`${selected.bodyType} · ${selected.fuelType}`} />
                <DetailRow label="Transmission" value={selected.transmission} />
                <DetailRow label="Mileage" value={`${selected.mileage.toLocaleString()} km`} />
                <DetailRow label="Status" value={labelStatus(selected.status)} />
              </dl>
              {selected.features.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selected.features.map((f) => (
                    <span key={f} className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{f}</span>
                  ))}
                </div>
              )}
              <Button className="w-full bg-brand hover:bg-brand-strong text-white" onClick={() => navigate("/admin/vehicles")}>
                Edit in Inventory
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div>
      <dt className="text-xs text-gray-400">{label}</dt>
      <dd className="font-medium text-gray-900">{value || "—"}</dd>
    </div>
  );
}
