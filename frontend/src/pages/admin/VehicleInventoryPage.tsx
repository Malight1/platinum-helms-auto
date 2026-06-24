import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import {
  CarRecord,
  downloadCsv,
  formatCurrency,
  formatDate,
  labelStatus,
  normalizeCar,
} from "@/lib/adminUtils";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select";
import { Textarea } from "@/components/textarea";
import { Switch } from "@/components/switch";
import { MultiTagInput } from "@/components/MultiTagInput";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog";
import {
  AlertTriangle,
  CheckCircle,
  CheckCircle2,
  Download,
  ImagePlus,
  Loader2,
  Pencil,
  Star,
  Trash2,
  Upload,
} from "lucide-react";

// Curated starting points; merged with values already used in inventory.
const FEATURE_PRESETS = [
  "Leather Seats", "Sunroof", "Panoramic Roof", "Navigation System", "Bluetooth",
  "Backup Camera", "360 Camera", "Parking Sensors", "Heated Seats", "Ventilated Seats",
  "Keyless Entry", "Push Start", "Cruise Control", "Adaptive Cruise Control",
  "Lane Assist", "Blind Spot Monitor", "Apple CarPlay", "Android Auto",
  "Premium Sound System", "Alloy Wheels", "LED Headlights", "Third Row Seats",
  "Power Tailgate", "Wireless Charging", "Ambient Lighting",
];
const TAG_PRESETS = ["popular", "hotDeal", "promo", "searched"];

const initialCarForm = {
  name: "",
  brand: "",
  model: "",
  year: String(new Date().getFullYear()),
  vin: "",
  listingType: "purchase",
  category: "sedan",
  bodyType: "Sedan",
  condition: "Foreign Used",
  price: "",
  transmission: "Automatic",
  fuelType: "Petrol",
  mileage: "0",
  country: "",
  description: "",
  features: [] as string[],
  tags: [] as string[],
  status: "available",
  visibility: true,
};

const statusColors: Record<string, string> = {
  available: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  reserved: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  sold: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  hidden: "bg-white/10 text-white/40 border-white/15",
};

function StatusBadge({ status }: { status?: string }) {
  const cls = statusColors[(status || "").toLowerCase()] ?? "bg-white/10 text-white/40 border-white/15";
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${cls}`}>
      {labelStatus(status)}
    </span>
  );
}

export default function VehicleInventoryPage() {
  const [cars, setCars] = useState<CarRecord[]>([]);
  const [form, setForm] = useState(initialCarForm);
  const [files, setFiles] = useState<FileList | null>(null);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [existingImagePreviews, setExistingImagePreviews] = useState<Record<number, string[]>>({});
  const [search, setSearch] = useState("");
  const [tableTab, setTableTab] = useState<"all" | "purchase" | "importation">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [featureOptions, setFeatureOptions] = useState<string[]>([]);
  const [tagOptions, setTagOptions] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Merge curated presets with values already used across inventory.
  const mergeUnique = (presets: string[], used: string[]) => {
    const seen = new Set<string>();
    return [...presets, ...used].filter((v) => {
      const key = v.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };
  const featureSuggestions = mergeUnique(FEATURE_PRESETS, featureOptions);
  const tagSuggestions = mergeUnique(TAG_PRESETS, tagOptions);

  const loadMeta = async () => {
    try {
      const response = await api.cars.getMeta();
      setFeatureOptions(response.data?.features || []);
      setTagOptions(response.data?.tags || []);
    } catch {
      // Suggestions are a nicety — fall back to presets only.
    }
  };

  useEffect(() => {
    loadMeta();
  }, []);

  const loadCars = async () => {
    setIsLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await api.cars.getAllAdmin({ limit: 100, search });
      setCars((response.data || []).map(normalizeCar));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load cars");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeout = window.setTimeout(loadCars, 250);
    return () => window.clearTimeout(timeout);
  }, [search]);

  const featuredCars = useMemo(() => cars.filter((car) => car.tags.includes("popular")), [cars]);

  const setField = (field: keyof typeof initialCarForm, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const carPayload = () => ({
    ...form,
    year: Number(form.year),
    price: Number(form.price),
    mileage: Number(form.mileage || 0),
    vin: form.vin || undefined,
    country: form.country || undefined,
    features: form.features,
    tags: form.tags,
  });

  const resetForm = () => {
    setForm(initialCarForm);
    setFiles(null);
    setNewImagePreviews([]);
    setEditingId(null);
    setEditDialogOpen(false);
    setError("");
  };

  const startEdit = (car: CarRecord) => {
    setEditingId(car.id);
    setForm({
      name: car.name,
      brand: car.brand,
      model: car.model,
      year: String(car.year),
      vin: car.vin || "",
      listingType: car.listingType || "purchase",
      category: car.category,
      bodyType: car.bodyType,
      condition: car.condition,
      price: String(car.price),
      transmission: car.transmission,
      fuelType: car.fuelType,
      mileage: String(car.mileage),
      country: car.country || "",
      description: car.description || "",
      features: car.features,
      tags: car.tags,
      status: car.status || "available",
      visibility: car.visibility ?? true,
    });
    setFiles(null);
    setNewImagePreviews([]);
    setError("");
    setEditDialogOpen(true);
  };

  const submitCar = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    try {
      let carId = editingId;
      if (editingId) {
        await api.cars.update(editingId, carPayload());
      } else {
        const response = await api.cars.create(carPayload());
        carId = response.data?.id ?? null;
      }
      if (carId && files && files.length > 0) {
        await api.cars.uploadImages(carId, files);
      }
      setMessage(editingId ? "Vehicle updated successfully." : "Vehicle uploaded successfully.");
      resetForm();
      await loadCars();
      loadMeta();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save vehicle");
    } finally {
      setIsSaving(false);
    }
  };

  const updateNewFiles = (fileList: FileList | null) => {
    setFiles(fileList);
    setNewImagePreviews(
      fileList ? Array.from(fileList).map((file) => URL.createObjectURL(file)) : [],
    );
  };

  const updateExistingFiles = (carId: number, fileList: FileList | null) => {
    setExistingImagePreviews((current) => ({
      ...current,
      [carId]: fileList ? Array.from(fileList).map((file) => URL.createObjectURL(file)) : [],
    }));
    uploadImages(carId, fileList);
  };

  const uploadImages = async (carId: number, imageFiles: FileList | null) => {
    if (!imageFiles || imageFiles.length === 0) return;
    setActionId(`upload-${carId}`);
    setMessage("");
    try {
      await api.cars.uploadImages(carId, imageFiles);
      setExistingImagePreviews((current) => ({ ...current, [carId]: [] }));
      setMessage("Images uploaded successfully.");
      await loadCars();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to upload images");
    } finally {
      setActionId(null);
    }
  };

  const deleteImage = (carId: number, imageId: number) => {
    toast("Delete this image?", {
      description: "This cannot be undone.",
      action: { label: "Delete", onClick: () => doDeleteImage(carId, imageId) },
      cancel: { label: "Cancel", onClick: () => {} },
      duration: 8000,
    });
  };

  const doDeleteImage = async (carId: number, imageId: number) => {
    setActionId(`image-${imageId}`);
    try {
      await api.cars.deleteImage(carId, imageId);
      await loadCars();
      toast.success("Image deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete image");
      toast.error("Failed to delete image.");
    } finally {
      setActionId(null);
    }
  };

  const updateCar = async (car: CarRecord, data: Partial<CarRecord>) => {
    setActionId(`car-${car.id}`);
    try {
      await api.cars.update(car.id, data);
      await loadCars();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update vehicle");
    } finally {
      setActionId(null);
    }
  };

  const toggleFeatured = (car: CarRecord) => {
    const nextTags = car.tags.includes("popular")
      ? car.tags.filter((tag) => tag !== "popular")
      : [...car.tags, "popular"];
    updateCar(car, { tags: nextTags } as Partial<CarRecord>);
  };

  const deleteCar = (carId: number) => {
    toast("Delete this vehicle?", {
      description: "This will remove the vehicle and all attached images permanently.",
      action: { label: "Delete", onClick: () => doDeleteCar(carId) },
      cancel: { label: "Cancel", onClick: () => {} },
      duration: 8000,
    });
  };

  const doDeleteCar = async (carId: number) => {
    setActionId(`delete-${carId}`);
    try {
      await api.cars.delete(carId);
      await loadCars();
      toast.success("Vehicle deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete vehicle");
      toast.error("Failed to delete vehicle.");
    } finally {
      setActionId(null);
    }
  };

  const exportVehicles = () => {
    downloadCsv(
      "vehicle-inventory.csv",
      cars.map((car) => ({
        id: car.id,
        name: car.name,
        brand: car.brand,
        model: car.model,
        year: car.year,
        vin: car.vin,
        category: car.category,
        bodyType: car.bodyType,
        condition: car.condition,
        price: car.price,
        mileage: car.mileage,
        status: car.status,
        visibility: car.visibility,
        featured: car.tags.includes("popular"),
        images: car.images.length,
        createdAt: car.createdAt,
      })),
    );
  };

  const cell = "bg-white/[0.035] px-4 py-3.5 align-middle transition-colors first:rounded-l-xl last:rounded-r-xl group-hover:bg-white/[0.055]";

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Vehicle Inventory</h1>
          <p className="mt-0.5 text-sm text-white/50">Upload, organise, feature, and publish cars across the site.</p>
        </div>
        <Button onClick={exportVehicles} className="bg-brand hover:bg-brand-strong text-white">
          <Download size={15} className="mr-1.5" /> Export Vehicles
        </Button>
      </div>

      {/* Feedback banners */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <AlertTriangle size={15} className="mt-0.5 shrink-0" /> {error}
        </div>
      )}
      {message && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          <CheckCircle2 size={15} className="mt-0.5 shrink-0" /> {message}
        </div>
      )}

      {/* Upload form — new vehicles only */}
      <Card className="rounded-2xl border border-white/[0.08] bg-obsidian-soft p-6 shadow-none">
        <div className="mb-6">
          <h2 className="mb-1 font-display text-base font-semibold text-white">Upload New Vehicle</h2>
          <p className="text-xs text-white/40">Fill out the details below to list a new vehicle in inventory.</p>
        </div>
        <form onSubmit={submitCar} className="space-y-6">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">Listing Type</p>
            <div className="grid grid-cols-2 gap-3 sm:max-w-md">
              <button
                type="button"
                onClick={() => setField("listingType", "purchase")}
                className={`rounded-xl border px-4 py-3 text-left transition ${form.listingType === "purchase" ? "border-brand bg-brand/10" : "border-white/[0.12] bg-white/[0.03] hover:border-white/25"}`}
              >
                <span className="block text-sm font-semibold text-white">Purchase</span>
                <span className="block text-xs text-white/40">In-country, ready to buy</span>
              </button>
              <button
                type="button"
                onClick={() => setField("listingType", "importation")}
                className={`rounded-xl border px-4 py-3 text-left transition ${form.listingType === "importation" ? "border-brand bg-brand/10" : "border-white/[0.12] bg-white/[0.03] hover:border-white/25"}`}
              >
                <span className="block text-sm font-semibold text-white">Importation</span>
                <span className="block text-xs text-white/40">To be imported on request</span>
              </button>
            </div>
          </div>
          <div className="border-t border-white/[0.06]" />
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">Identity</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-1.5">
                <Label className="text-white/70">Name *</Label>
                <Input required value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="e.g. Mercedes-Benz GLE 450" className="border-white/[0.12] bg-white/[0.05] text-white placeholder:text-white/25 focus:border-brand/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-white/70">Brand *</Label>
                <Input required value={form.brand} onChange={(e) => setField("brand", e.target.value)} placeholder="e.g. Mercedes-Benz" className="border-white/[0.12] bg-white/[0.05] text-white placeholder:text-white/25 focus:border-brand/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-white/70">Model *</Label>
                <Input required value={form.model} onChange={(e) => setField("model", e.target.value)} placeholder="e.g. GLE 450" className="border-white/[0.12] bg-white/[0.05] text-white placeholder:text-white/25 focus:border-brand/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-white/70">Year *</Label>
                <Input required type="number" value={form.year} onChange={(e) => setField("year", e.target.value)} className="border-white/[0.12] bg-white/[0.05] text-white focus:border-brand/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-white/70">VIN</Label>
                <Input value={form.vin} onChange={(e) => setField("vin", e.target.value)} placeholder="Vehicle Identification Number" className="border-white/[0.12] bg-white/[0.05] text-white placeholder:text-white/25 focus:border-brand/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-white/70">Country of Origin</Label>
                <Input value={form.country} onChange={(e) => setField("country", e.target.value)} placeholder="e.g. Japan, USA" className="border-white/[0.12] bg-white/[0.05] text-white placeholder:text-white/25 focus:border-brand/50" />
              </div>
            </div>
          </div>
          <div className="border-t border-white/[0.06]" />
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">Specifications</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-1.5">
                <Label className="text-white/70">Category</Label>
                <Select value={form.category} onValueChange={(v) => setField("category", v)}>
                  <SelectTrigger className="border-white/[0.12] bg-white/[0.05] text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>{["luxury","sedan","suv","sports","coupe","hatchback","truck","van"].map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-white/70">Body Type</Label>
                <Select value={form.bodyType} onValueChange={(v) => setField("bodyType", v)}>
                  <SelectTrigger className="border-white/[0.12] bg-white/[0.05] text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>{["Sedan","SUV","Coupe","Hatchback","Truck","Van","Wagon","Convertible"].map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-white/70">Condition</Label>
                <Select value={form.condition} onValueChange={(v) => setField("condition", v)}>
                  <SelectTrigger className="border-white/[0.12] bg-white/[0.05] text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>{["New","Foreign Used","Nigerian Used"].map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-white/70">Transmission</Label>
                <Select value={form.transmission} onValueChange={(v) => setField("transmission", v)}>
                  <SelectTrigger className="border-white/[0.12] bg-white/[0.05] text-white"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Automatic">Automatic</SelectItem><SelectItem value="Manual">Manual</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-white/70">Fuel Type</Label>
                <Select value={form.fuelType} onValueChange={(v) => setField("fuelType", v)}>
                  <SelectTrigger className="border-white/[0.12] bg-white/[0.05] text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>{["Petrol","Diesel","Hybrid","Electric"].map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-white/70">Mileage (km)</Label>
                <Input type="number" value={form.mileage} onChange={(e) => setField("mileage", e.target.value)} className="border-white/[0.12] bg-white/[0.05] text-white focus:border-brand/50" />
              </div>
            </div>
          </div>
          <div className="border-t border-white/[0.06]" />
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">Pricing & Status</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-1.5">
                <Label className="text-white/70">Price (₦) *</Label>
                <Input required type="number" value={form.price} onChange={(e) => setField("price", e.target.value)} placeholder="0" className="border-white/[0.12] bg-white/[0.05] text-white placeholder:text-white/25 focus:border-brand/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-white/70">Status</Label>
                <Select value={form.status} onValueChange={(v) => setField("status", v)}>
                  <SelectTrigger className="border-white/[0.12] bg-white/[0.05] text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>{["available","reserved","sold","hidden"].map((v) => <SelectItem key={v} value={v}>{labelStatus(v)}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-3 pt-6">
                <Switch checked={form.visibility} onCheckedChange={(checked) => setField("visibility", checked)} />
                <Label className="text-white/70">Visible on public site</Label>
              </div>
            </div>
          </div>
          <div className="border-t border-white/[0.06]" />
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">Media</p>
            <label className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border border-dashed border-white/[0.15] bg-white/[0.02] px-6 py-8 text-center transition hover:border-brand/40 hover:bg-brand/[0.03]">
              <div className="flex size-12 items-center justify-center rounded-xl bg-white/[0.06]">
                <ImagePlus size={22} className="text-white/40" />
              </div>
              <div>
                <p className="text-sm font-medium text-white/70">Click to select vehicle images</p>
                <p className="mt-0.5 text-xs text-white/30">PNG, JPG, WebP — multiple files supported</p>
              </div>
              <Input type="file" multiple accept="image/*" className="hidden" onChange={(e) => updateNewFiles(e.target.files)} />
            </label>
            {newImagePreviews.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {newImagePreviews.map((preview, index) => (
                  <img key={preview} src={preview} alt={`Preview ${index + 1}`} className="h-20 w-28 rounded-lg border border-white/10 object-cover" />
                ))}
              </div>
            )}
          </div>
          <div className="border-t border-white/[0.06]" />
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">Details</p>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-white/70">Features <span className="text-white/30">(select or type, press Enter)</span></Label>
                <MultiTagInput
                  value={form.features}
                  onChange={(next) => setForm((current) => ({ ...current, features: next }))}
                  suggestions={featureSuggestions}
                  placeholder="e.g. Leather Seats, Sunroof, Navigation…"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-white/70">Tags <span className="text-white/30">(select or type, press Enter)</span></Label>
                <MultiTagInput
                  value={form.tags}
                  onChange={(next) => setForm((current) => ({ ...current, tags: next }))}
                  suggestions={tagSuggestions}
                  placeholder="e.g. popular, hotDeal, promo…"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-white/70">Description</Label>
                <Textarea value={form.description} onChange={(e) => setField("description", e.target.value)} rows={4} className="border-white/[0.12] bg-white/[0.05] text-white placeholder:text-white/25 focus:border-brand/50" />
              </div>
            </div>
          </div>
          <Button type="submit" disabled={isSaving} className="bg-brand hover:bg-brand-strong w-full gap-2 text-white sm:w-auto">
            {isSaving ? (
              <><Loader2 size={15} className="animate-spin" /> Uploading Vehicle…</>
            ) : (
              <><Upload size={15} /> Upload Vehicle</>
            )}
          </Button>
        </form>
      </Card>

      {/* Tag collection overview */}
      <Card className="rounded-2xl border border-white/[0.08] bg-obsidian-soft p-6 shadow-none">
        <div className="mb-4">
          <h2 className="font-display text-base font-semibold text-white">Collection Overview</h2>
          <p className="mt-0.5 text-xs text-white/40">Tag your vehicles to highlight them on the site.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { tag: "popular", label: "Popular", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
            { tag: "hotDeal", label: "Hot Deal", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
            { tag: "promo", label: "Promo", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
            { tag: "searched", label: "Most Searched", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
          ].map(({ tag, label, color, bg }) => {
            const count = cars.filter((c) => c.tags.includes(tag)).length;
            return (
              <div key={tag} className={`rounded-xl border px-4 py-3 ${bg}`}>
                <p className={`text-xs font-semibold uppercase tracking-wide ${color}`}>{label}</p>
                <p className="mt-1 text-2xl font-bold text-white">{count}</p>
                <p className="text-[10px] text-white/30">vehicle{count !== 1 ? "s" : ""}</p>
              </div>
            );
          })}
        </div>
        {featuredCars.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 border-t border-white/[0.06] pt-4">
            {featuredCars.map((car) => (
              <span key={car.id} className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-white/[0.05] px-3 py-1 text-sm text-white/70">
                <Star size={11} className="text-brand" />
                {car.brand} {car.model}
              </span>
            ))}
          </div>
        )}
      </Card>

      {/* Vehicles table */}
      <div className="rounded-2xl border border-white/[0.08] bg-obsidian-soft">
        <div className="flex flex-col gap-4 border-b border-white/[0.06] p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <h2 className="font-display text-base font-semibold text-white">Vehicle Inventory</h2>
              <p className="mt-0.5 text-xs text-white/40">{cars.length} vehicle{cars.length !== 1 ? "s" : ""} total</p>
            </div>
            <div className="flex gap-1.5 rounded-xl border border-white/[0.1] bg-white/[0.04] p-1">
              {(["all", "purchase", "importation"] as const).map((tab) => {
                const count = tab === "all" ? cars.length : cars.filter((c) => c.listingType === tab).length;
                return (
                  <button
                    key={tab}
                    onClick={() => setTableTab(tab)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition ${
                      tableTab === tab
                        ? "bg-brand text-white shadow"
                        : "text-white/50 hover:text-white/80"
                    }`}
                  >
                    {tab === "all" ? "All" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                    <span className={`ml-1.5 ${tableTab === tab ? "text-white/70" : "text-white/25"}`}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <Input
            className="border-white/[0.12] bg-white/[0.05] text-white placeholder:text-white/30 md:max-w-sm"
            placeholder="Search vehicles…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto px-4 pb-4 pt-2 sm:px-5">
          <table className="w-full border-separate" style={{ borderSpacing: "0 6px", minWidth: 860 }}>
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-white/25">Vehicle</th>
                <th className="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-white/25">Details</th>
                <th className="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-white/25">Images</th>
                <th className="px-4 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-white/25">Visible</th>
                <th className="px-4 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-white/25">Featured</th>
                <th className="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-white/25">Added</th>
                <th className="px-4 py-2 text-right text-[10px] font-semibold uppercase tracking-[0.12em] text-white/25">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="first:rounded-l-xl last:rounded-r-xl bg-white/[0.03] px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-16 shrink-0 animate-pulse rounded-lg bg-white/[0.07]" />
                        <div className="space-y-2">
                          <div className="h-3 w-32 animate-pulse rounded bg-white/[0.07]" />
                          <div className="h-2.5 w-24 animate-pulse rounded bg-white/[0.05]" />
                          <div className="h-2.5 w-16 animate-pulse rounded bg-white/[0.05]" />
                        </div>
                      </div>
                    </td>
                    <td className="first:rounded-l-xl last:rounded-r-xl bg-white/[0.03] px-4 py-3.5">
                      <div className="space-y-2">
                        <div className="h-2.5 w-28 animate-pulse rounded bg-white/[0.07]" />
                        <div className="h-2.5 w-20 animate-pulse rounded bg-white/[0.05]" />
                        <div className="mt-1.5 h-5 w-16 animate-pulse rounded-full bg-white/[0.05]" />
                      </div>
                    </td>
                    <td className="first:rounded-l-xl last:rounded-r-xl bg-white/[0.03] px-4 py-3.5">
                      <div className="flex gap-1.5">
                        {[0, 1, 2].map((j) => <div key={j} className="h-10 w-14 animate-pulse rounded-md bg-white/[0.07]" />)}
                      </div>
                    </td>
                    <td className="first:rounded-l-xl last:rounded-r-xl bg-white/[0.03] px-4 py-3.5 text-center">
                      <div className="mx-auto h-5 w-9 animate-pulse rounded-full bg-white/[0.07]" />
                    </td>
                    <td className="first:rounded-l-xl last:rounded-r-xl bg-white/[0.03] px-4 py-3.5 text-center">
                      <div className="mx-auto h-5 w-5 animate-pulse rounded-full bg-white/[0.07]" />
                    </td>
                    <td className="first:rounded-l-xl last:rounded-r-xl bg-white/[0.03] px-4 py-3.5">
                      <div className="h-2.5 w-20 animate-pulse rounded bg-white/[0.07]" />
                    </td>
                    <td className="first:rounded-l-xl last:rounded-r-xl bg-white/[0.03] px-4 py-3.5">
                      <div className="ml-auto h-7 w-7 animate-pulse rounded-lg bg-white/[0.07]" />
                    </td>
                  </tr>
                ))}

              {!isLoading && cars.length === 0 && (
                <tr>
                  <td colSpan={7} className="rounded-xl bg-white/[0.03] px-4 py-16 text-center text-sm text-white/30">
                    No vehicles in inventory. Upload one above to get started.
                  </td>
                </tr>
              )}

              {!isLoading &&
                cars
                .filter((car) => tableTab === "all" || car.listingType === tableTab)
                .map((car) => (
                  <tr key={car.id} className="group">
                    <td className={cell}>
                      <div className="flex min-w-[200px] items-center gap-3">
                        <img src={car.image} alt={car.name} className="h-12 w-16 shrink-0 rounded-lg bg-white/[0.06] object-cover" />
                        <div>
                          <div className="text-sm font-medium leading-snug text-white">{car.name}</div>
                          <div className="text-xs text-white/40">{car.brand} {car.model}</div>
                          <div className="mt-0.5 text-[13px] font-semibold text-brand">{formatCurrency(car.price)}</div>
                        </div>
                      </div>
                    </td>
                    <td className={cell}>
                      <div className="min-w-[130px] space-y-0.5">
                        <div className="text-xs text-white/60">{car.year} · {car.condition}</div>
                        <div className="text-xs text-white/40">{car.bodyType} · {car.transmission}</div>
                        <div className="pt-1.5"><StatusBadge status={car.status} /></div>
                      </div>
                    </td>
                    <td className={cell}>
                      <div className="flex min-w-[160px] items-center gap-1.5">
                        {car.images.slice(0, 3).map((image) => (
                          <div key={image.id} className="group/img relative shrink-0">
                            <img src={image.url} alt={car.name} className="h-10 w-14 rounded-md object-cover" />
                            <button
                              type="button"
                              onClick={() => deleteImage(car.id, image.id)}
                              disabled={actionId === `image-${image.id}`}
                              className="absolute inset-0 flex items-center justify-center rounded-md bg-black/65 opacity-0 transition-opacity group-hover/img:opacity-100 disabled:opacity-50"
                              aria-label="Delete image"
                            >
                              {actionId === `image-${image.id}` ? (
                                <Loader2 size={11} className="animate-spin text-white" />
                              ) : (
                                <Trash2 size={11} className="text-white" />
                              )}
                            </button>
                          </div>
                        ))}
                        {car.images.length > 3 && (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white/[0.06] text-[10px] font-medium text-white/50">
                            +{car.images.length - 3}
                          </div>
                        )}
                        <label className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-md border border-dashed border-white/[0.15] transition hover:border-brand/50 hover:bg-brand/[0.04]">
                          <ImagePlus size={13} className="text-white/30" />
                          <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => updateExistingFiles(car.id, e.target.files)} />
                        </label>
                        {existingImagePreviews[car.id]?.map((preview, index) => (
                          <img key={preview} src={preview} alt={`Pending ${index + 1}`} className="h-10 w-14 shrink-0 rounded-md border border-emerald-500/40 object-cover" />
                        ))}
                      </div>
                    </td>
                    <td className={`${cell} text-center`}>
                      <Switch
                        checked={!!car.visibility}
                        onCheckedChange={(checked) => updateCar(car, { visibility: checked } as Partial<CarRecord>)}
                        disabled={actionId === `car-${car.id}`}
                      />
                    </td>
                    <td className={`${cell} text-center`}>
                      <button
                        type="button"
                        onClick={() => toggleFeatured(car)}
                        title="Toggle featured"
                        className="mx-auto flex size-8 items-center justify-center rounded-lg transition hover:bg-white/[0.08]"
                      >
                        {car.tags.includes("popular") ? (
                          <CheckCircle size={15} className="text-emerald-400" />
                        ) : (
                          <Star size={15} className="text-white/20" />
                        )}
                      </button>
                    </td>
                    <td className={cell}>
                      <span className="text-xs text-white/35">{formatDate(car.createdAt)}</span>
                    </td>
                    <td className={cell}>
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => startEdit(car)}
                          title="Edit vehicle"
                          className="flex size-8 items-center justify-center rounded-lg transition hover:bg-white/[0.08]"
                        >
                          <Pencil size={13} className="text-white/50" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteCar(car.id)}
                          disabled={actionId === `delete-${car.id}`}
                          title="Delete vehicle"
                          className="flex size-8 items-center justify-center rounded-lg transition hover:bg-red-500/10 disabled:opacity-50"
                        >
                          {actionId === `delete-${car.id}` ? (
                            <Loader2 size={13} className="animate-spin text-white/30" />
                          ) : (
                            <Trash2 size={13} className="text-red-400" />
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

      {/* ── Edit Dialog ── */}
      <Dialog open={editDialogOpen} onOpenChange={(open) => { if (!open) resetForm(); }}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto bg-obsidian-soft text-white">
          <DialogHeader>
            <DialogTitle className="font-display text-lg text-white">
              Edit Vehicle
            </DialogTitle>
            <p className="text-xs text-white/40">
              {form.name || "—"} · Update the details and save your changes.
            </p>
          </DialogHeader>

          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              <AlertTriangle size={15} className="mt-0.5 shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={submitCar} className="space-y-6 pt-2">
            {/* Listing type */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">Listing Type</p>
              <div className="grid grid-cols-2 gap-3 sm:max-w-sm">
                <button type="button" onClick={() => setField("listingType", "purchase")}
                  className={`rounded-xl border px-4 py-3 text-left transition ${form.listingType === "purchase" ? "border-brand bg-brand/10" : "border-white/[0.12] bg-white/[0.03] hover:border-white/25"}`}>
                  <span className="block text-sm font-semibold text-white">Purchase</span>
                  <span className="block text-xs text-white/40">In-country, ready to buy</span>
                </button>
                <button type="button" onClick={() => setField("listingType", "importation")}
                  className={`rounded-xl border px-4 py-3 text-left transition ${form.listingType === "importation" ? "border-brand bg-brand/10" : "border-white/[0.12] bg-white/[0.03] hover:border-white/25"}`}>
                  <span className="block text-sm font-semibold text-white">Importation</span>
                  <span className="block text-xs text-white/40">To be imported on request</span>
                </button>
              </div>
            </div>

            <div className="border-t border-white/[0.06]" />

            {/* Identity */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">Identity</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1.5">
                  <Label className="text-white/70">Name *</Label>
                  <Input required value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="e.g. Mercedes-Benz GLE 450" className="border-white/[0.12] bg-white/[0.05] text-white placeholder:text-white/25 focus:border-brand/50" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white/70">Brand *</Label>
                  <Input required value={form.brand} onChange={(e) => setField("brand", e.target.value)} placeholder="e.g. Mercedes-Benz" className="border-white/[0.12] bg-white/[0.05] text-white placeholder:text-white/25 focus:border-brand/50" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white/70">Model *</Label>
                  <Input required value={form.model} onChange={(e) => setField("model", e.target.value)} placeholder="e.g. GLE 450" className="border-white/[0.12] bg-white/[0.05] text-white placeholder:text-white/25 focus:border-brand/50" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white/70">Year *</Label>
                  <Input required type="number" value={form.year} onChange={(e) => setField("year", e.target.value)} className="border-white/[0.12] bg-white/[0.05] text-white focus:border-brand/50" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white/70">VIN</Label>
                  <Input value={form.vin} onChange={(e) => setField("vin", e.target.value)} placeholder="Vehicle Identification Number" className="border-white/[0.12] bg-white/[0.05] text-white placeholder:text-white/25 focus:border-brand/50" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white/70">Country of Origin</Label>
                  <Input value={form.country} onChange={(e) => setField("country", e.target.value)} placeholder="e.g. Canada, USA" className="border-white/[0.12] bg-white/[0.05] text-white placeholder:text-white/25 focus:border-brand/50" />
                </div>
              </div>
            </div>

            <div className="border-t border-white/[0.06]" />

            {/* Specifications */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">Specifications</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1.5">
                  <Label className="text-white/70">Category</Label>
                  <Select value={form.category} onValueChange={(v) => setField("category", v)}>
                    <SelectTrigger className="border-white/[0.12] bg-white/[0.05] text-white"><SelectValue /></SelectTrigger>
                    <SelectContent>{["luxury","sedan","suv","sports","coupe","hatchback","truck","van"].map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white/70">Body Type</Label>
                  <Select value={form.bodyType} onValueChange={(v) => setField("bodyType", v)}>
                    <SelectTrigger className="border-white/[0.12] bg-white/[0.05] text-white"><SelectValue /></SelectTrigger>
                    <SelectContent>{["Sedan","SUV","Coupe","Hatchback","Truck","Van","Wagon","Convertible"].map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white/70">Condition</Label>
                  <Select value={form.condition} onValueChange={(v) => setField("condition", v)}>
                    <SelectTrigger className="border-white/[0.12] bg-white/[0.05] text-white"><SelectValue /></SelectTrigger>
                    <SelectContent>{["New","Foreign Used","Nigerian Used"].map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white/70">Transmission</Label>
                  <Select value={form.transmission} onValueChange={(v) => setField("transmission", v)}>
                    <SelectTrigger className="border-white/[0.12] bg-white/[0.05] text-white"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Automatic">Automatic</SelectItem><SelectItem value="Manual">Manual</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white/70">Fuel Type</Label>
                  <Select value={form.fuelType} onValueChange={(v) => setField("fuelType", v)}>
                    <SelectTrigger className="border-white/[0.12] bg-white/[0.05] text-white"><SelectValue /></SelectTrigger>
                    <SelectContent>{["Petrol","Diesel","Hybrid","Electric"].map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white/70">Mileage (km)</Label>
                  <Input type="number" value={form.mileage} onChange={(e) => setField("mileage", e.target.value)} className="border-white/[0.12] bg-white/[0.05] text-white focus:border-brand/50" />
                </div>
              </div>
            </div>

            <div className="border-t border-white/[0.06]" />

            {/* Pricing & Status */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">Pricing & Status</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1.5">
                  <Label className="text-white/70">Price (₦) *</Label>
                  <Input required type="number" value={form.price} onChange={(e) => setField("price", e.target.value)} placeholder="0" className="border-white/[0.12] bg-white/[0.05] text-white placeholder:text-white/25 focus:border-brand/50" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white/70">Status</Label>
                  <Select value={form.status} onValueChange={(v) => setField("status", v)}>
                    <SelectTrigger className="border-white/[0.12] bg-white/[0.05] text-white"><SelectValue /></SelectTrigger>
                    <SelectContent>{["available","reserved","sold","hidden"].map((v) => <SelectItem key={v} value={v}>{labelStatus(v)}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <Switch checked={form.visibility} onCheckedChange={(checked) => setField("visibility", checked)} />
                  <Label className="text-white/70">Visible on public site</Label>
                </div>
              </div>
            </div>

            <div className="border-t border-white/[0.06]" />

            {/* Details */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">Details</p>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-white/70">Features <span className="text-white/30">(select or type, press Enter)</span></Label>
                  <MultiTagInput value={form.features} onChange={(next) => setForm((c) => ({ ...c, features: next }))} suggestions={featureSuggestions} placeholder="e.g. Leather Seats, Sunroof…" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white/70">Tags <span className="text-white/30">(select or type, press Enter)</span></Label>
                  <MultiTagInput value={form.tags} onChange={(next) => setForm((c) => ({ ...c, tags: next }))} suggestions={tagSuggestions} placeholder="e.g. popular, hotDeal…" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white/70">Description</Label>
                  <Textarea value={form.description} onChange={(e) => setField("description", e.target.value)} rows={3} className="border-white/[0.12] bg-white/[0.05] text-white placeholder:text-white/25 focus:border-brand/50" />
                </div>
              </div>
            </div>

            {/* Media */}
            <div className="border-t border-white/[0.06]" />
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">Add / Replace Images</p>
              <label className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border border-dashed border-white/[0.15] bg-white/[0.02] px-6 py-6 text-center transition hover:border-brand/40 hover:bg-brand/[0.03]">
                <ImagePlus size={20} className="text-white/40" />
                <div>
                  <p className="text-sm font-medium text-white/70">Click to add new images</p>
                  <p className="mt-0.5 text-xs text-white/30">PNG, JPG, WebP — multiple files supported</p>
                </div>
                <Input type="file" multiple accept="image/*" className="hidden" onChange={(e) => updateNewFiles(e.target.files)} />
              </label>
              {newImagePreviews.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {newImagePreviews.map((preview, index) => (
                    <img key={preview} src={preview} alt={`Preview ${index + 1}`} className="h-16 w-24 rounded-lg border border-white/10 object-cover" />
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 border-t border-white/[0.06] pt-4">
              <Button type="submit" disabled={isSaving} className="bg-brand hover:bg-brand-strong flex-1 gap-2 text-white sm:flex-none sm:px-8">
                {isSaving ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : <><CheckCircle2 size={15} /> Save Changes</>}
              </Button>
              <Button type="button" variant="ghost" onClick={resetForm} className="text-white/50 hover:bg-white/[0.06] hover:text-white">
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
