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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";
import {
  AlertTriangle,
  CheckCircle,
  CheckCircle2,
  Download,
  ImagePlus,
  Loader2,
  Star,
  Trash2,
  Upload,
} from "lucide-react";

const initialCarForm = {
  name: "",
  brand: "",
  model: "",
  year: String(new Date().getFullYear()),
  vin: "",
  category: "sedan",
  bodyType: "Sedan",
  condition: "Foreign Used",
  price: "",
  transmission: "Automatic",
  fuelType: "Petrol",
  mileage: "0",
  country: "",
  description: "",
  features: "",
  tags: "",
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
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${cls}`}>
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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
    features: form.features.split(",").map((f) => f.trim()).filter(Boolean),
    tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
  });

  const createCar = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    try {
      const response = await api.cars.create(carPayload());
      const carId = response.data?.id;
      if (carId && files && files.length > 0) {
        await api.cars.uploadImages(carId, files);
      }
      setForm(initialCarForm);
      setFiles(null);
      setNewImagePreviews([]);
      setMessage("Vehicle uploaded successfully.");
      await loadCars();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create vehicle");
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

      {/* Upload form */}
      <Card className="rounded-2xl border border-white/[0.08] bg-obsidian-soft p-6 shadow-none">
        <h2 className="mb-1 font-display text-base font-semibold text-white">Upload New Vehicle</h2>
        <p className="mb-6 text-xs text-white/40">Fill out the details below to list a new vehicle in inventory.</p>
        <form onSubmit={createCar} className="space-y-6">
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
                <Input value={form.country} onChange={(e) => setField("country", e.target.value)} placeholder="e.g. Japan, USA" className="border-white/[0.12] bg-white/[0.05] text-white placeholder:text-white/25 focus:border-brand/50" />
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
                  <SelectContent>
                    {["luxury", "sedan", "suv", "sports", "coupe", "hatchback", "truck", "van"].map((v) => (
                      <SelectItem key={v} value={v}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-white/70">Body Type</Label>
                <Select value={form.bodyType} onValueChange={(v) => setField("bodyType", v)}>
                  <SelectTrigger className="border-white/[0.12] bg-white/[0.05] text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Sedan", "SUV", "Coupe", "Hatchback", "Truck", "Van", "Wagon", "Convertible"].map((v) => (
                      <SelectItem key={v} value={v}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-white/70">Condition</Label>
                <Select value={form.condition} onValueChange={(v) => setField("condition", v)}>
                  <SelectTrigger className="border-white/[0.12] bg-white/[0.05] text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["New", "Foreign Used", "Nigerian Used"].map((v) => (
                      <SelectItem key={v} value={v}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-white/70">Transmission</Label>
                <Select value={form.transmission} onValueChange={(v) => setField("transmission", v)}>
                  <SelectTrigger className="border-white/[0.12] bg-white/[0.05] text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Automatic">Automatic</SelectItem>
                    <SelectItem value="Manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-white/70">Fuel Type</Label>
                <Select value={form.fuelType} onValueChange={(v) => setField("fuelType", v)}>
                  <SelectTrigger className="border-white/[0.12] bg-white/[0.05] text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Petrol", "Diesel", "Hybrid", "Electric"].map((v) => (
                      <SelectItem key={v} value={v}>{v}</SelectItem>
                    ))}
                  </SelectContent>
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
                  <SelectContent>
                    {["available", "reserved", "sold", "hidden"].map((v) => (
                      <SelectItem key={v} value={v}>{labelStatus(v)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-3 pt-6">
                <Switch
                  checked={form.visibility}
                  onCheckedChange={(checked) => setField("visibility", checked)}
                />
                <Label className="text-white/70">Visible on public site</Label>
              </div>
            </div>
          </div>

          <div className="border-t border-white/[0.06]" />

          {/* Media */}
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
              <Input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => updateNewFiles(e.target.files)}
              />
            </label>
            {newImagePreviews.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {newImagePreviews.map((preview, index) => (
                  <img
                    key={preview}
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="h-20 w-28 rounded-lg border border-white/10 object-cover"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-white/[0.06]" />

          {/* Details */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">Details</p>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-white/70">Features <span className="text-white/30">(comma-separated)</span></Label>
                <Input
                  placeholder="e.g. Leather seats, Sunroof, Navigation"
                  value={form.features}
                  onChange={(e) => setField("features", e.target.value)}
                  className="border-white/[0.12] bg-white/[0.05] text-white placeholder:text-white/25 focus:border-brand/50"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-white/70">Tags <span className="text-white/30">(comma-separated)</span></Label>
                <Input
                  placeholder="popular, hotDeal, promo, searched"
                  value={form.tags}
                  onChange={(e) => setField("tags", e.target.value)}
                  className="border-white/[0.12] bg-white/[0.05] text-white placeholder:text-white/25 focus:border-brand/50"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-white/70">Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                  rows={4}
                  className="border-white/[0.12] bg-white/[0.05] text-white placeholder:text-white/25 focus:border-brand/50"
                />
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

      {/* Featured cars */}
      <Card className="rounded-2xl border border-white/[0.08] bg-obsidian-soft p-6 shadow-none">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-base font-semibold text-white">Featured Collection</h2>
            <p className="mt-0.5 text-xs text-white/40">Cars marked featured appear on the homepage.</p>
          </div>
          <span className="inline-flex items-center rounded-full bg-brand/15 px-2.5 py-0.5 text-xs font-semibold text-brand">
            {featuredCars.length} featured
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {featuredCars.length === 0 ? (
            <p className="text-sm text-white/30">No cars are currently featured.</p>
          ) : (
            featuredCars.map((car) => (
              <span
                key={car.id}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-white/[0.05] px-3 py-1 text-sm text-white/70"
              >
                <Star size={11} className="text-brand" />
                {car.brand} {car.model}
              </span>
            ))
          )}
        </div>
      </Card>

      {/* Vehicles table */}
      <Card className="overflow-hidden rounded-2xl border border-white/[0.08] bg-obsidian-soft shadow-none">
        <div className="flex flex-col gap-4 border-b border-white/[0.06] p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-base font-semibold text-white">All Vehicles</h2>
            <p className="mt-0.5 text-xs text-white/40">{cars.length} vehicle{cars.length !== 1 ? "s" : ""} in inventory</p>
          </div>
          <Input
            className="border-white/[0.12] bg-white/[0.05] text-white placeholder:text-white/30 md:max-w-sm"
            placeholder="Search vehicles…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.02]">
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-white/40">Vehicle</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-white/40">Details</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-white/40">Images</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-white/40">Visible</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-white/40">Featured</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-white/40">Date</TableHead>
                <TableHead className="text-right text-xs font-semibold uppercase tracking-wider text-white/40">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow className="border-white/[0.06]">
                  <TableCell colSpan={7} className="py-16 text-center">
                    <Loader2 size={20} className="mx-auto animate-spin text-white/30" />
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && cars.length === 0 && (
                <TableRow className="border-white/[0.06]">
                  <TableCell colSpan={7} className="py-16 text-center text-sm text-white/30">
                    No vehicles found.
                  </TableCell>
                </TableRow>
              )}
              {cars.map((car) => (
                <TableRow key={car.id} className="border-white/[0.06] hover:bg-white/[0.025]">
                  <TableCell>
                    <div className="flex min-w-[220px] items-center gap-3">
                      <img
                        src={car.image}
                        alt={car.name}
                        className="h-14 w-20 shrink-0 rounded-xl bg-white/[0.06] object-cover"
                      />
                      <div>
                        <div className="font-medium text-white">{car.name}</div>
                        <div className="text-xs text-white/45">{car.brand} {car.model}</div>
                        <div className="mt-0.5 text-sm font-semibold text-brand">{formatCurrency(car.price)}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-white/70">{car.year} · {car.condition} · {car.bodyType}</div>
                    <div className="text-xs text-white/40">{car.transmission} · {car.fuelType} · {car.mileage.toLocaleString()} km</div>
                    <div className="mt-1.5">
                      <StatusBadge status={car.status} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5" style={{ maxWidth: 240 }}>
                      {car.images.map((image) => (
                        <div key={image.id} className="group relative">
                          <img
                            src={image.url}
                            alt={car.name}
                            className="h-14 w-20 rounded-lg object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => deleteImage(car.id, image.id)}
                            disabled={actionId === `image-${image.id}`}
                            aria-label="Delete image"
                            className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/65 opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-50"
                          >
                            {actionId === `image-${image.id}` ? (
                              <Loader2 size={14} className="animate-spin text-white" />
                            ) : (
                              <Trash2 size={14} className="text-white" />
                            )}
                          </button>
                        </div>
                      ))}
                      <label className="flex h-14 w-20 cursor-pointer items-center justify-center rounded-lg border border-dashed border-white/[0.15] transition hover:border-brand/50 hover:bg-brand/[0.05]">
                        <ImagePlus size={16} className="text-white/30" />
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => updateExistingFiles(car.id, e.target.files)}
                        />
                      </label>
                      {existingImagePreviews[car.id]?.map((preview, index) => (
                        <img
                          key={preview}
                          src={preview}
                          alt={`Pending ${index + 1}`}
                          className="h-14 w-20 rounded-lg border border-emerald-500/40 object-cover"
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={!!car.visibility}
                      onCheckedChange={(checked) => updateCar(car, { visibility: checked } as Partial<CarRecord>)}
                      disabled={actionId === `car-${car.id}`}
                    />
                  </TableCell>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => toggleFeatured(car)}
                      title="Toggle featured"
                      className="flex size-8 items-center justify-center rounded-lg transition hover:bg-white/[0.06]"
                    >
                      {car.tags.includes("popular") ? (
                        <CheckCircle size={16} className="text-emerald-400" />
                      ) : (
                        <Star size={16} className="text-white/25" />
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="text-xs text-white/40">{formatDate(car.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <button
                      type="button"
                      onClick={() => deleteCar(car.id)}
                      disabled={actionId === `delete-${car.id}`}
                      className="flex size-8 items-center justify-center rounded-lg transition hover:bg-red-500/10 disabled:opacity-50 ml-auto"
                    >
                      {actionId === `delete-${car.id}` ? (
                        <Loader2 size={14} className="animate-spin text-white/40" />
                      ) : (
                        <Trash2 size={14} className="text-red-400" />
                      )}
                    </button>
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
