import { useMemo, useState } from "react";
import api from "@/lib/api";
import { CarRecord, formatCurrency, normalizeCar } from "@/lib/adminUtils";
import { useAsync } from "@/hooks/useAsync";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { Reveal } from "../components/motion/Reveal";
import { Button } from "../components/button";
import { Card } from "../components/card";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { Skeleton } from "../components/skeleton";
import { ErrorState, EmptyState } from "../components/feedback/StateViews";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/select";
import { Badge } from "../components/badge";
import { Slider } from "../components/slider";
import { ArrowRight, Filter, TrendingUp, Search, Zap, Tag, ArrowUpDown, Hammer, Sparkles, Car, Clock } from "lucide-react";
import { VehicleDetailsDialog } from "../components/VehicleDetailsDialog";
import phblack from "../assets/phblack.png";
import phred from "../assets/phred.png";

interface CarPurchasePageProps {
  onNavigate: (page: string) => void;
}

interface Vehicle {
  id: number;
  name: string;
  brand: string;
  model: string;
  category: string;
  year: number;
  condition: string;
  price: number;
  image: string;
  features: string[];
  tags: string[];
  transmission: string;
  fuelType: string;
  mileage: number;
  bodyType: string;
  views: number;
  dateAdded: string;
}

const tagMeta: Record<string, { label: string; icon: typeof Tag }> = {
  popular: { label: "Popular", icon: TrendingUp },
  searched: { label: "Most Searched", icon: Search },
  hotDeal: { label: "Hot Deal", icon: Zap },
  promo: { label: "On Promo", icon: Tag },
};

const PRICE_MAX = 250000000;
const MILEAGE_MAX = 200000;

const fallbackVehicles: Vehicle[] = [
  { id: 1, name: "S-Class Premium", brand: "Mercedes-Benz", model: "S-Class", category: "luxury", bodyType: "Sedan", year: 2025, condition: "New", price: 95000000, transmission: "Automatic", fuelType: "Petrol", mileage: 0, image: "https://images.unsplash.com/photo-1666067313311-de0a3760d884?auto=format&fit=crop&q=80&w=1080", features: ["Adaptive Cruise Control", "Premium Sound System", "Leather Interior"], tags: ["popular", "searched"], views: 1245, dateAdded: "2025-11-01" },
  { id: 2, name: "GLE Sport", brand: "Mercedes-Benz", model: "GLE", category: "suv", bodyType: "SUV", year: 2025, condition: "New", price: 78000000, transmission: "Automatic", fuelType: "Petrol", mileage: 0, image: "https://images.unsplash.com/photo-1700884520248-92092bd21e63?auto=format&fit=crop&q=80&w=1080", features: ["All-Wheel Drive", "Panoramic Sunroof", "Third Row Seating"], tags: ["popular", "hotDeal"], views: 980, dateAdded: "2025-10-28" },
  { id: 3, name: "Camry LE", brand: "Toyota", model: "Camry", category: "sedan", bodyType: "Sedan", year: 2024, condition: "Foreign Used", price: 35000000, transmission: "Automatic", fuelType: "Hybrid", mileage: 15000, image: "https://images.unsplash.com/photo-1707407772603-274cc5cf18f4?auto=format&fit=crop&q=80&w=1080", features: ["Hybrid Engine", "Fuel Efficient", "Spacious Interior"], tags: ["popular", "searched"], views: 2100, dateAdded: "2025-11-02" },
  { id: 4, name: "Accord Sport", brand: "Honda", model: "Accord", category: "sedan", bodyType: "Sedan", year: 2023, condition: "Foreign Used", price: 32000000, transmission: "Automatic", fuelType: "Petrol", mileage: 22000, image: "https://images.unsplash.com/photo-1666067313311-de0a3760d884?auto=format&fit=crop&q=80&w=1080", features: ["Turbo Engine", "Sport Package", "Apple CarPlay"], tags: ["hotDeal"], views: 856, dateAdded: "2025-10-30" },
  { id: 5, name: "X5 M Sport", brand: "BMW", model: "X5", category: "suv", bodyType: "SUV", year: 2024, condition: "Foreign Used", price: 72000000, transmission: "Automatic", fuelType: "Diesel", mileage: 18000, image: "https://images.unsplash.com/photo-1700884520248-92092bd21e63?auto=format&fit=crop&q=80&w=1080", features: ["M Sport Package", "Premium Audio", "Night Vision"], tags: ["popular"], views: 1340, dateAdded: "2025-10-25" },
  { id: 6, name: "Corolla Cross", brand: "Toyota", model: "Corolla Cross", category: "suv", bodyType: "SUV", year: 2025, condition: "New", price: 38000000, transmission: "Automatic", fuelType: "Hybrid", mileage: 0, image: "https://images.unsplash.com/photo-1700884520248-92092bd21e63?auto=format&fit=crop&q=80&w=1080", features: ["Toyota Safety Sense", "Hybrid System", "AWD"], tags: ["promo", "searched"], views: 1890, dateAdded: "2025-11-03" },
];

export function CarPurchasePage({ onNavigate }: CarPurchasePageProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedModel, setSelectedModel] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [selectedTransmission, setSelectedTransmission] = useState("all");
  const [selectedFuelType, setSelectedFuelType] = useState("all");
  const [selectedBodyType, setSelectedBodyType] = useState("all");
  const [priceRange, setPriceRange] = useState([0, PRICE_MAX]);
  const [mileageRange, setMileageRange] = useState([0, MILEAGE_MAX]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, error, refetch } = useAsync<Vehicle[]>(async () => {
    const response = await api.cars.getAll({ limit: 100 });
    const cars = (response.data || [])
      .map(normalizeCar)
      .filter((c: CarRecord) => c.listingType !== "importation") as unknown as Vehicle[];
    return cars.length > 0 ? cars : fallbackVehicles;
  }, []);

  const vehicles = data ?? fallbackVehicles;

  const brands = useMemo(() => Array.from(new Set(vehicles.map((v) => v.brand))).sort(), [vehicles]);
  const availableModels = useMemo(
    () =>
      Array.from(
        new Set(
          (selectedBrand === "all" ? vehicles : vehicles.filter((v) => v.brand === selectedBrand)).map((v) => v.model),
        ),
      ).sort(),
    [vehicles, selectedBrand],
  );

  const sortedVehicles = useMemo(() => {
    const filtered = vehicles.filter((v) => {
      const inSearch =
        searchQuery === "" ||
        [v.name, v.brand, v.model].some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return (
        (selectedCategory === "all" || v.category === selectedCategory) &&
        (selectedBrand === "all" || v.brand === selectedBrand) &&
        (selectedModel === "all" || v.model === selectedModel) &&
        (selectedYear === "all" || v.year.toString() === selectedYear) &&
        (selectedCondition === "all" || v.condition === selectedCondition) &&
        (selectedTransmission === "all" || v.transmission === selectedTransmission) &&
        (selectedFuelType === "all" || v.fuelType === selectedFuelType) &&
        (selectedBodyType === "all" || v.bodyType === selectedBodyType) &&
        v.price >= priceRange[0] && v.price <= priceRange[1] &&
        v.mileage >= mileageRange[0] && v.mileage <= mileageRange[1] &&
        inSearch
      );
    });
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "priceLow": return a.price - b.price;
        case "priceHigh": return b.price - a.price;
        case "yearNew": return b.year - a.year;
        case "yearOld": return a.year - b.year;
        case "popular": return b.views - a.views;
        default: return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      }
    });
  }, [vehicles, selectedCategory, selectedBrand, selectedModel, selectedYear, selectedCondition, selectedTransmission, selectedFuelType, selectedBodyType, priceRange, mileageRange, searchQuery, sortBy]);

  const clearAllFilters = () => {
    setSelectedCategory("all"); setSelectedBrand("all"); setSelectedModel("all"); setSelectedYear("all");
    setSelectedCondition("all"); setSelectedTransmission("all"); setSelectedFuelType("all"); setSelectedBodyType("all");
    setPriceRange([0, PRICE_MAX]); setMileageRange([0, MILEAGE_MAX]); setSearchQuery("");
  };

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-obsidian">
        <div className="absolute inset-0">
          <ImageWithFallback src={phred} alt="Luxury car showroom" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/85 to-obsidian/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 via-transparent to-transparent" />
        </div>
        <div className="relative mx-auto w-full max-w-7xl px-4 pb-12 pt-32 sm:px-6 sm:pb-14 sm:pt-36 lg:px-8 lg:pt-40">
          <Reveal className="max-w-2xl">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand">
              Explore Inventory
            </span>
            <h1 className="font-display text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl">
              Find Your Perfect<br className="hidden sm:block" /> Luxury Vehicle
            </h1>
            <p className="mt-5 max-w-xl text-base text-white/75 sm:text-lg">
              Filter by brand, price, condition and more across our full luxury inventory.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Inventory */}
      <section className="bg-background py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Browse Our Inventory</h2>
            <p className="mt-2 text-muted-foreground">Find your perfect vehicle with our advanced search.</p>
          </div>

          <div className="mb-8 flex justify-center">
            <Button onClick={() => setShowFilters((p) => !p)} className="gap-2 rounded-full bg-obsidian px-7 py-6 text-white hover:bg-obsidian-soft">
              <Filter size={18} />
              {showFilters ? "Hide Filters" : "Reveal Filters for Enhanced Search"}
            </Button>
          </div>

          {/* Filters */}
          <div className={`overflow-hidden transition-all duration-500 ${showFilters ? "mb-8 max-h-[2500px] opacity-100" : "max-h-0 opacity-0"}`}>
            <Card className="rounded-2xl border-border p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-2">
                <Filter className="text-brand" size={20} />
                <h3 className="font-sans text-lg font-semibold text-foreground">Filters & Search</h3>
              </div>
              <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Field label="Brand / Make">
                  <Select value={selectedBrand} onValueChange={(v) => { setSelectedBrand(v); setSelectedModel("all"); }}>
                    <SelectTrigger><SelectValue placeholder="All Brands" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Brands</SelectItem>
                      {brands.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Model">
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger><SelectValue placeholder="All Models" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Models</SelectItem>
                      {availableModels.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Year">
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger><SelectValue placeholder="All Years" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      {["2025", "2024", "2023", "2022", "2021", "2020"].map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Condition">
                  <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                    <SelectTrigger><SelectValue placeholder="All Conditions" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Conditions</SelectItem>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Foreign Used">Foreign Used (Tokunbo)</SelectItem>
                      <SelectItem value="Nigerian Used">Nigerian Used</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Body Type">
                  <Select value={selectedBodyType} onValueChange={setSelectedBodyType}>
                    <SelectTrigger><SelectValue placeholder="All Types" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {["Sedan", "SUV", "Coupe", "Hatchback", "Truck", "Van"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Transmission">
                  <Select value={selectedTransmission} onValueChange={setSelectedTransmission}>
                    <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="Automatic">Automatic</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Fuel Type">
                  <Select value={selectedFuelType} onValueChange={setSelectedFuelType}>
                    <SelectTrigger><SelectValue placeholder="All Fuel Types" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Fuel Types</SelectItem>
                      {["Petrol", "Diesel", "Hybrid", "Electric"].map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Category">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger><SelectValue placeholder="All Categories" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {["sedan", "suv", "luxury", "sports", "truck"].map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <div className="mb-4">
                <Label className="mb-3 block text-sm">Price Range: {formatCurrency(priceRange[0])} – {formatCurrency(priceRange[1])}</Label>
                <Slider min={0} max={PRICE_MAX} step={1000000} value={priceRange} onValueChange={setPriceRange} />
              </div>
              <div className="mb-4">
                <Label className="mb-3 block text-sm">Mileage: {mileageRange[0].toLocaleString()} km – {mileageRange[1].toLocaleString()} km</Label>
                <Slider min={0} max={MILEAGE_MAX} step={5000} value={mileageRange} onValueChange={setMileageRange} />
              </div>
              <Field label="Search">
                <Input placeholder="Search by model, brand, or keyword…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </Field>
            </Card>
          </div>

          {/* Results header */}
          <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="text-sm text-muted-foreground">
              {isLoading ? "Loading…" : `${sortedVehicles.length} vehicle${sortedVehicles.length !== 1 ? "s" : ""} found`}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <ArrowUpDown size={16} className="text-muted-foreground" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Recently Added</SelectItem>
                    <SelectItem value="priceLow">Price: Low to High</SelectItem>
                    <SelectItem value="priceHigh">Price: High to Low</SelectItem>
                    <SelectItem value="yearNew">Year: Newest First</SelectItem>
                    <SelectItem value="yearOld">Year: Oldest First</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" size="sm" onClick={clearAllFilters}>Clear All Filters</Button>
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden rounded-2xl border-border">
                  <Skeleton className="h-64 w-full rounded-none" />
                  <div className="space-y-3 p-6"><Skeleton className="h-3 w-24" /><Skeleton className="h-6 w-40" /><Skeleton className="h-6 w-28" /><Skeleton className="h-10 w-full" /></div>
                </Card>
              ))}
            </div>
          ) : error ? (
            <ErrorState message={error} onRetry={refetch} />
          ) : sortedVehicles.length === 0 ? (
            <EmptyState icon={<Car size={24} />} title="No vehicles match your search" message="Try adjusting or clearing your filters to see more results." action={<Button variant="outline" onClick={clearAllFilters}>Clear Filters</Button>} />
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {sortedVehicles.map((vehicle) => (
                <Card key={vehicle.id} className="group overflow-hidden rounded-2xl border-border bg-card transition-all hover:-translate-y-1 hover:shadow-luxe">
                  <div className="relative h-64 overflow-hidden">
                    <ImageWithFallback src={vehicle.image} alt={vehicle.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute left-4 top-4 flex flex-col gap-2">
                      <span className="rounded-full bg-obsidian/80 px-3 py-1 text-sm text-white backdrop-blur">{vehicle.year}</span>
                      {vehicle.condition === "New" && <span className="rounded-full bg-brand px-3 py-1 text-sm text-white">New</span>}
                    </div>
                    {vehicle.tags.length > 0 && (
                      <div className="absolute inset-x-4 bottom-4 flex flex-wrap gap-2">
                        {vehicle.tags.map((tag) => {
                          const meta = tagMeta[tag];
                          if (!meta) return null;
                          const Icon = meta.icon;
                          return <Badge key={tag} className="gap-1 border-none bg-brand text-white"><Icon size={12} /> {meta.label}</Badge>;
                        })}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">{vehicle.brand}</p>
                    <h3 className="mt-1 font-display text-2xl font-semibold text-foreground">{vehicle.name}</h3>
                    <p className="mt-1 text-xl font-semibold text-brand">{formatCurrency(vehicle.price)}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span>{vehicle.transmission}</span><span>•</span><span>{vehicle.fuelType}</span><span>•</span><span>{vehicle.mileage.toLocaleString()} km</span>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button className="flex-1 gap-2 bg-obsidian text-white hover:bg-obsidian-soft" onClick={() => { setSelectedVehicle(vehicle); setIsDialogOpen(true); }}>
                        View Details <ArrowRight size={16} />
                      </Button>
                      <Button variant="outline" className="flex-1" onClick={() => onNavigate("contact")}>Test Drive</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-obsidian-soft py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="font-display text-4xl font-bold text-white">Explore More Options</h2>
            <p className="mt-3 text-lg text-white/65">Can't find what you're looking for? Discover our importation service or explore what's coming next.</p>
          </Reveal>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {[
              { img: phblack, Icon: Sparkles, badge: "Bespoke Service", title: "Custom Importation Orders", body: "Source your dream vehicle from anywhere in the world — we handle everything to your doorstep.", cta: "Start Custom Order", comingSoon: false },
              { img: phred, Icon: Hammer, badge: "Coming Soon", title: "Premium Vehicle Auctions", body: "Our exclusive auction platform is launching soon — bid on premium vehicles with full transparency on condition and history.", cta: "", comingSoon: true },
            ].map(({ img, Icon, badge, title, body, cta, comingSoon }, i) => (
              <Reveal key={title} delay={i * 0.08}>
                <Card className="group relative h-80 overflow-hidden rounded-2xl border-none">
                  <ImageWithFallback src={img} alt={title} className={`h-full w-full object-cover transition-transform duration-700 ${comingSoon ? "" : "group-hover:scale-105"}`} />
                  <div className={`absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/50 to-transparent ${comingSoon ? "bg-obsidian/40" : ""}`} />
                  {comingSoon && <div className="absolute inset-0 bg-obsidian/40" />}
                  <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                    <Badge className={`mb-3 w-fit gap-2 border-none uppercase tracking-wide text-white ${comingSoon ? "bg-white/15" : "bg-brand"}`}><Icon size={14} /> {badge}</Badge>
                    <h3 className="font-display text-2xl font-semibold">{title}</h3>
                    <p className="mt-2 max-w-md text-sm text-white/80">{body}</p>
                    {comingSoon ? (
                      <span className="mt-5 inline-flex w-fit cursor-default items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/50">
                        <Clock size={14} /> Launching Soon
                      </span>
                    ) : (
                      <Button onClick={() => onNavigate("importation")} className="mt-5 w-fit gap-2 bg-white text-obsidian hover:bg-white/90">{cta} <ArrowRight size={16} /></Button>
                    )}
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {selectedVehicle && (
        <VehicleDetailsDialog
          vehicle={selectedVehicle}
          isOpen={isDialogOpen}
          onClose={() => { setIsDialogOpen(false); setSelectedVehicle(null); }}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
