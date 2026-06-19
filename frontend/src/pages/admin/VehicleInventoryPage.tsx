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
    features: form.features
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean),
    tags: form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
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
          <h1 className="font-display text-2xl font-bold text-gray-900">Vehicle Inventory</h1>
          <p className="text-sm text-gray-500">Upload, organise, feature, and publish cars across the site.</p>
        </div>
        <Button onClick={exportVehicles} className="bg-brand hover:bg-brand-strong text-white">
          <Download size={15} className="mr-1.5" /> Export Vehicles
        </Button>
      </div>

      {/* Feedback banners */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle size={15} className="mt-0.5 shrink-0" /> {error}
        </div>
      )}
      {message && (
        <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle2 size={15} className="mt-0.5 shrink-0" /> {message}
        </div>
      )}

      {/* Upload form */}
      <Card className="border-none p-6 shadow-sm">
        <h2 className="mb-5 font-semibold text-gray-900">Upload New Vehicle</h2>
        <form onSubmit={createCar} className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Name *</Label>
            <Input required value={form.name} onChange={(e) => setField("name", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Brand *</Label>
            <Input required value={form.brand} onChange={(e) => setField("brand", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Model *</Label>
            <Input required value={form.model} onChange={(e) => setField("model", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Year *</Label>
            <Input required type="number" value={form.year} onChange={(e) => setField("year", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Price (₦) *</Label>
            <Input required type="number" value={form.price} onChange={(e) => setField("price", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Mileage (km)</Label>
            <Input type="number" value={form.mileage} onChange={(e) => setField("mileage", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => setField("category", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["luxury", "sedan", "suv", "sports", "coupe", "hatchback", "truck", "van"].map((v) => (
                  <SelectItem key={v} value={v}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Body Type</Label>
            <Select value={form.bodyType} onValueChange={(v) => setField("bodyType", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Sedan", "SUV", "Coupe", "Hatchback", "Truck", "Van", "Wagon", "Convertible"].map((v) => (
                  <SelectItem key={v} value={v}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Condition</Label>
            <Select value={form.condition} onValueChange={(v) => setField("condition", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["New", "Foreign Used", "Nigerian Used"].map((v) => (
                  <SelectItem key={v} value={v}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Transmission</Label>
            <Select value={form.transmission} onValueChange={(v) => setField("transmission", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Automatic">Automatic</SelectItem>
                <SelectItem value="Manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Fuel Type</Label>
            <Select value={form.fuelType} onValueChange={(v) => setField("fuelType", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Petrol", "Diesel", "Hybrid", "Electric"].map((v) => (
                  <SelectItem key={v} value={v}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => setField("status", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["available", "reserved", "sold", "hidden"].map((v) => (
                  <SelectItem key={v} value={v}>{labelStatus(v)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>VIN</Label>
            <Input value={form.vin} onChange={(e) => setField("vin", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Country of Origin</Label>
            <Input value={form.country} onChange={(e) => setField("country", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Images</Label>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => updateNewFiles(e.target.files)}
            />
          </div>
          {newImagePreviews.length > 0 && (
            <div className="flex flex-wrap gap-2 md:col-span-3">
              {newImagePreviews.map((preview, index) => (
                <img
                  key={preview}
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="h-20 w-28 rounded-lg border border-border object-cover"
                />
              ))}
            </div>
          )}
          <div className="space-y-2 md:col-span-3">
            <Label>Features (comma-separated)</Label>
            <Input
              placeholder="e.g. Leather seats, Sunroof, Navigation"
              value={form.features}
              onChange={(e) => setField("features", e.target.value)}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Tags (comma-separated)</Label>
            <Input
              placeholder="popular, hotDeal, promo, searched"
              value={form.tags}
              onChange={(e) => setField("tags", e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 pt-7">
            <Switch
              checked={form.visibility}
              onCheckedChange={(checked) => setField("visibility", checked)}
            />
            <Label>Visible on public site</Label>
          </div>
          <div className="space-y-2 md:col-span-3">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
            />
          </div>
          <div className="md:col-span-3">
            <Button type="submit" disabled={isSaving} className="bg-brand hover:bg-brand-strong text-white">
              {isSaving ? (
                <Loader2 size={15} className="mr-2 animate-spin" />
              ) : (
                <Upload size={15} className="mr-2" />
              )}
              Upload Vehicle
            </Button>
          </div>
        </form>
      </Card>

      {/* Featured cars */}
      <Card className="border-none p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">Featured Collection</h2>
            <p className="text-sm text-gray-500">Cars marked featured appear on the homepage.</p>
          </div>
          <span className="inline-flex items-center rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand">
            {featuredCars.length} featured
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {featuredCars.length === 0 ? (
            <p className="text-sm text-gray-400">No cars are currently featured.</p>
          ) : (
            featuredCars.map((car) => (
              <span
                key={car.id}
                className="inline-flex items-center rounded-full border border-border bg-muted/40 px-3 py-1 text-sm text-gray-700"
              >
                {car.brand} {car.model}
              </span>
            ))
          )}
        </div>
      </Card>

      {/* Vehicles table */}
      <Card className="overflow-hidden border-none shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 md:flex-row md:items-center md:justify-between">
          <h2 className="font-semibold text-gray-900">All Vehicles</h2>
          <Input
            className="md:max-w-sm"
            placeholder="Search vehicles…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="font-semibold">Vehicle</TableHead>
                <TableHead className="font-semibold">Details</TableHead>
                <TableHead className="font-semibold">Images</TableHead>
                <TableHead className="font-semibold">Visible</TableHead>
                <TableHead className="font-semibold">Featured</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center">
                    <Loader2 size={20} className="mx-auto animate-spin text-gray-400" />
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && cars.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                    No vehicles found.
                  </TableCell>
                </TableRow>
              )}
              {cars.map((car) => (
                <TableRow key={car.id} className="hover:bg-gray-50/50">
                  <TableCell>
                    <div className="flex min-w-[220px] items-center gap-3">
                      <img
                        src={car.image}
                        alt={car.name}
                        className="h-14 w-20 rounded-lg bg-gray-100 object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{car.name}</div>
                        <div className="text-sm text-gray-500">
                          {car.brand} {car.model}
                        </div>
                        <div className="text-sm font-medium text-brand">{formatCurrency(car.price)}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    <div>
                      {car.year} · {car.condition} · {car.bodyType}
                    </div>
                    <div>
                      {car.transmission} · {car.fuelType} · {car.mileage.toLocaleString()} km
                    </div>
                    <div className="mt-0.5">
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                        {labelStatus(car.status)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5 max-w-[220px]">
                      {car.images.map((image) => (
                        <div key={image.id} className="relative">
                          <img
                            src={image.url}
                            alt={car.name}
                            className="h-12 w-16 rounded-lg object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => deleteImage(car.id, image.id)}
                            className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-red-600 text-white shadow"
                            disabled={actionId === `image-${image.id}`}
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      ))}
                      <label className="flex h-12 w-16 cursor-pointer items-center justify-center rounded-lg border border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50">
                        <ImagePlus size={16} className="text-gray-400" />
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
                          className="h-12 w-16 rounded-lg border border-green-300 object-cover"
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={!!car.visibility}
                      onCheckedChange={(checked) =>
                        updateCar(car, { visibility: checked } as Partial<CarRecord>)
                      }
                      disabled={actionId === `car-${car.id}`}
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => toggleFeatured(car)} title="Toggle featured">
                      {car.tags.includes("popular") ? (
                        <CheckCircle size={16} className="text-green-600" />
                      ) : (
                        <Star size={16} className="text-gray-400" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">{formatDate(car.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteCar(car.id)}
                      disabled={actionId === `delete-${car.id}`}
                    >
                      {actionId === `delete-${car.id}` ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Trash2 size={15} className="text-red-500" />
                      )}
                    </Button>
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
