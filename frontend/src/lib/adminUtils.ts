export type CarImage = {
  id: number;
  url: string;
  publicId?: string;
  isPrimary?: boolean;
  order?: number;
};

export type CarRecord = {
  id: number;
  name: string;
  brand: string;
  model: string;
  category: string;
  bodyType: string;
  year: number;
  condition: string;
  listingType: string;
  price: number;
  transmission: string;
  fuelType: string;
  mileage: number;
  vin?: string | null;
  description?: string | null;
  country?: string | null;
  status?: string;
  visibility?: boolean;
  views?: number;
  tags: string[];
  features: string[];
  image: string;
  images: CarImage[];
  dateAdded?: string;
  createdAt?: string;
};

export const fallbackCarImage =
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

export const normalizeCar = (car: any): CarRecord => {
  const images = Array.isArray(car.images) ? car.images : [];
  const primaryImage = images.find((image: CarImage) => image.isPrimary) || images[0];

  return {
    id: Number(car.id),
    name: car.name || "Unnamed vehicle",
    brand: car.brand || car.make || "",
    model: car.model || "",
    category: car.category || "sedan",
    bodyType: car.bodyType || "Sedan",
    year: Number(car.year || new Date().getFullYear()),
    condition: car.condition || "Foreign Used",
    listingType: car.listingType || "purchase",
    price: Number(car.price || 0),
    transmission: car.transmission || "Automatic",
    fuelType: car.fuelType || "Petrol",
    mileage: Number(car.mileage || 0),
    vin: car.vin || null,
    description: car.description || "",
    country: car.country || "",
    status: car.status || "available",
    visibility: car.visibility ?? true,
    views: Number(car.views || 0),
    tags: Array.isArray(car.tags) ? car.tags : [],
    features: Array.isArray(car.features) ? car.features : [],
    image: car.image || primaryImage?.url || fallbackCarImage,
    images,
    dateAdded: car.createdAt || car.updatedAt || new Date().toISOString(),
    createdAt: car.createdAt,
  };
};

export const formatCurrency = (value?: number | string | null) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export const formatDate = (value?: string) => {
  if (!value) return "N/A";

  return new Intl.DateTimeFormat("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
};

export const labelStatus = (status?: string) => {
  if (!status) return "Unknown";

  return status
    .split(/[_\s-]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

export const downloadCsv = (fileName: string, rows: Record<string, unknown>[]) => {
  if (rows.length === 0) return;

  const headers = Object.keys(rows[0]);
  const escapeCell = (value: unknown) =>
    `"${String(value ?? "").replace(/"/g, '""')}"`;
  const csv = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => escapeCell(row[header])).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};
