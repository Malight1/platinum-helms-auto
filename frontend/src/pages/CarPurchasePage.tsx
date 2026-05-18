import { useEffect, useState } from "react";
import api from "@/lib/api";
import { formatCurrency, normalizeCar } from "@/lib/adminUtils";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { Button } from "../components/button";
import { Card } from "../components/card";
import { Input } from "../components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/select";
import { Badge } from "../components/badge";
import { Slider } from "../components/slider";
import {
  ArrowRight,
  Filter,
  // Heart,
  TrendingUp,
  Search,
  Zap,
  Tag,
  ArrowUpDown,
  Hammer,
  Sparkles,
} from "lucide-react";
import { VehicleDetailsDialog } from "../components/VehicleDetailsDialog";

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

export function CarPurchasePage({ onNavigate }: CarPurchasePageProps) {
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedModel, setSelectedModel] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [selectedTransmission, setSelectedTransmission] = useState("all");
  const [selectedFuelType, setSelectedFuelType] = useState("all");
  const [selectedBodyType, setSelectedBodyType] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 250000]);
  const [mileageRange, setMileageRange] = useState([0, 200000]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(true);

  const fallbackVehicles: Vehicle[] = [
    {
      id: 1,
      name: "S-Class Premium",
      brand: "Mercedes-Benz",
      model: "S-Class",
      category: "luxury",
      bodyType: "Sedan",
      year: 2025,
      condition: "New",
      price: 95000,
      transmission: "Automatic",
      fuelType: "Petrol",
      mileage: 0,
      image:
        "https://images.unsplash.com/photo-1666067313311-de0a3760d884?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBmcm9udHxlbnwxfHx8fDE3NjE2NjA4MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      features: [
        "Adaptive Cruise Control",
        "Premium Sound System",
        "Leather Interior",
      ],
      tags: ["popular", "searched"],
      views: 1245,
      dateAdded: "2025-11-01",
    },
    {
      id: 2,
      name: "GLE Sport",
      brand: "Mercedes-Benz",
      model: "GLE",
      category: "suv",
      bodyType: "SUV",
      year: 2025,
      condition: "New",
      price: 78000,
      transmission: "Automatic",
      fuelType: "Petrol",
      mileage: 0,
      image:
        "https://images.unsplash.com/photo-1700884520248-92092bd21e63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBTVVZ8ZW58MXx8fHwxNzYxNjU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      features: ["All-Wheel Drive", "Panoramic Sunroof", "Third Row Seating"],
      tags: ["popular", "hotDeal"],
      views: 980,
      dateAdded: "2025-10-28",
    },
    {
      id: 3,
      name: "Camry LE",
      brand: "Toyota",
      model: "Camry",
      category: "sedan",
      bodyType: "Sedan",
      year: 2024,
      condition: "Foreign Used",
      price: 35000,
      transmission: "Automatic",
      fuelType: "Hybrid",
      mileage: 15000,
      image:
        "https://images.unsplash.com/photo-1707407772603-274cc5cf18f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzZWRhbiUyMGRyaXZpbmd8ZW58MXx8fHwxNzYxNjk4NjE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      features: ["Hybrid Engine", "Fuel Efficient", "Spacious Interior"],
      tags: ["popular", "searched"],
      views: 2100,
      dateAdded: "2025-11-02",
    },
    {
      id: 4,
      name: "Accord Sport",
      brand: "Honda",
      model: "Accord",
      category: "sedan",
      bodyType: "Sedan",
      year: 2023,
      condition: "Foreign Used",
      price: 32000,
      transmission: "Automatic",
      fuelType: "Petrol",
      mileage: 22000,
      image:
        "https://images.unsplash.com/photo-1666067313311-de0a3760d884?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBmcm9udHxlbnwxfHx8fDE3NjE2NjA4MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      features: ["Turbo Engine", "Sport Package", "Apple CarPlay"],
      tags: ["hotDeal"],
      views: 856,
      dateAdded: "2025-10-30",
    },
    {
      id: 5,
      name: "X5 M Sport",
      brand: "BMW",
      model: "X5",
      category: "suv",
      bodyType: "SUV",
      year: 2024,
      condition: "Foreign Used",
      price: 72000,
      transmission: "Automatic",
      fuelType: "Diesel",
      mileage: 18000,
      image:
        "https://images.unsplash.com/photo-1700884520248-92092bd21e63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBTVVZ8ZW58MXx8fHwxNzYxNjU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      features: ["M Sport Package", "Premium Audio", "Night Vision"],
      tags: ["popular"],
      views: 1340,
      dateAdded: "2025-10-25",
    },
    {
      id: 6,
      name: "Corolla Cross",
      brand: "Toyota",
      model: "Corolla Cross",
      category: "suv",
      bodyType: "SUV",
      year: 2025,
      condition: "New",
      price: 38000,
      transmission: "Automatic",
      fuelType: "Hybrid",
      mileage: 0,
      image:
        "https://images.unsplash.com/photo-1700884520248-92092bd21e63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBTVVZ8ZW58MXx8fHwxNzYxNjU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      features: ["Toyota Safety Sense", "Hybrid System", "AWD"],
      tags: ["promo", "searched"],
      views: 1890,
      dateAdded: "2025-11-03",
    },
    {
      id: 7,
      name: "Tucson Hybrid",
      brand: "Hyundai",
      model: "Tucson",
      category: "suv",
      bodyType: "SUV",
      year: 2024,
      condition: "New",
      price: 42000,
      transmission: "Automatic",
      fuelType: "Hybrid",
      mileage: 0,
      image:
        "https://images.unsplash.com/photo-1700884520248-92092bd21e63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBTVVZ8ZW58MXx8fHwxNzYxNjU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      features: ["Panoramic Sunroof", "Wireless Charging", "360 Camera"],
      tags: ["hotDeal"],
      views: 724,
      dateAdded: "2025-10-29",
    },
    {
      id: 8,
      name: "Sportage GT-Line",
      brand: "Kia",
      model: "Sportage",
      category: "suv",
      bodyType: "SUV",
      year: 2024,
      condition: "Nigerian Used",
      price: 28000,
      transmission: "Automatic",
      fuelType: "Petrol",
      mileage: 35000,
      image:
        "https://images.unsplash.com/photo-1700884520248-92092bd21e63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBTVVZ8ZW58MXx8fHwxNzYxNjU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      features: ["Digital Cockpit", "Smart Key", "LED Headlights"],
      tags: [],
      views: 542,
      dateAdded: "2025-10-20",
    },
    {
      id: 9,
      name: "F-150 Raptor",
      brand: "Ford",
      model: "F-150",
      category: "truck",
      bodyType: "Truck",
      year: 2025,
      condition: "New",
      price: 88000,
      transmission: "Automatic",
      fuelType: "Petrol",
      mileage: 0,
      image:
        "https://images.unsplash.com/photo-1565450469107-f51a6d66e9d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cnVja3xlbnwxfHx8fDE3NjE2OTg2MTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      features: ["V8 Engine", "Off-Road Package", "Terrain Management"],
      tags: ["popular"],
      views: 1120,
      dateAdded: "2025-10-31",
    },
    {
      id: 10,
      name: "A4 Premium",
      brand: "Audi",
      model: "A4",
      category: "sedan",
      bodyType: "Sedan",
      year: 2023,
      condition: "Foreign Used",
      price: 45000,
      transmission: "Automatic",
      fuelType: "Petrol",
      mileage: 28000,
      image:
        "https://images.unsplash.com/photo-1707407772603-274cc5cf18f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzZWRhbiUyMGRyaXZpbmd8ZW58MXx8fHwxNzYxNjk4NjE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      features: ["Quattro AWD", "Virtual Cockpit", "Premium Plus"],
      tags: ["searched"],
      views: 892,
      dateAdded: "2025-10-27",
    },
  ];

  const [databaseVehicles, setDatabaseVehicles] = useState<Vehicle[]>([]);
  const vehicles = databaseVehicles.length > 0 ? databaseVehicles : fallbackVehicles;

  useEffect(() => {
    api.cars
      .getAll({ limit: 100 })
      .then((response) => setDatabaseVehicles((response.data || []).map(normalizeCar)))
      .catch(() => setDatabaseVehicles([]))
      .finally(() => setIsLoadingVehicles(false));
  }, []);

  // Get unique brands for dropdown
  const brands = Array.from(new Set(vehicles.map((v) => v.brand))).sort();

  // Get models based on selected brand
  const availableModels =
    selectedBrand === "all"
      ? Array.from(new Set(vehicles.map((v) => v.model))).sort()
      : Array.from(
          new Set(
            vehicles
              .filter((v) => v.brand === selectedBrand)
              .map((v) => v.model)
          )
        ).sort();

  // Filtering logic
  let filteredVehicles = vehicles.filter((vehicle) => {
    const matchesCategory =
      selectedCategory === "all" || vehicle.category === selectedCategory;
    const matchesBrand =
      selectedBrand === "all" || vehicle.brand === selectedBrand;
    const matchesModel =
      selectedModel === "all" || vehicle.model === selectedModel;
    const matchesYear =
      selectedYear === "all" || vehicle.year.toString() === selectedYear;
    const matchesCondition =
      selectedCondition === "all" || vehicle.condition === selectedCondition;
    const matchesTransmission =
      selectedTransmission === "all" ||
      vehicle.transmission === selectedTransmission;
    const matchesFuelType =
      selectedFuelType === "all" || vehicle.fuelType === selectedFuelType;
    const matchesBodyType =
      selectedBodyType === "all" || vehicle.bodyType === selectedBodyType;
    const matchesPrice =
      vehicle.price >= priceRange[0] && vehicle.price <= priceRange[1];
    const matchesMileage =
      vehicle.mileage >= mileageRange[0] && vehicle.mileage <= mileageRange[1];
    const matchesSearch =
      searchQuery === "" ||
      vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase());

    return (
      matchesCategory &&
      matchesBrand &&
      matchesModel &&
      matchesYear &&
      matchesCondition &&
      matchesTransmission &&
      matchesFuelType &&
      matchesBodyType &&
      matchesPrice &&
      matchesMileage &&
      matchesSearch
    );
  });

  // Sorting logic
  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    switch (sortBy) {
      case "priceLow":
        return a.price - b.price;
      case "priceHigh":
        return b.price - a.price;
      case "yearNew":
        return b.year - a.year;
      case "yearOld":
        return a.year - b.year;
      case "popular":
        return b.views - a.views;
      case "recent":
      default:
        return (
          new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        );
    }
  });

  const clearAllFilters = () => {
    setSelectedCategory("all");
    setSelectedBrand("all");
    setSelectedModel("all");
    setSelectedYear("all");
    setSelectedCondition("all");
    setSelectedTransmission("all");
    setSelectedFuelType("all");
    setSelectedBodyType("all");
    setPriceRange([0, 250000]);
    setMileageRange([0, 200000]);
    setSearchQuery("");
  };

  const getTagIcon = (tag: string) => {
    switch (tag) {
      case "popular":
        return <TrendingUp size={12} />;
      case "searched":
        return <Search size={12} />;
      case "hotDeal":
        return <Zap size={12} />;
      case "promo":
        return <Tag size={12} />;
      default:
        return null;
    }
  };

  const getTagLabel = (tag: string) => {
    switch (tag) {
      case "popular":
        return "Popular";
      case "searched":
        return "Most Searched";
      case "hotDeal":
        return "Hot Deal";
      case "promo":
        return "On Promo";
      default:
        return tag;
    }
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <section className="relative h-[400px]">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBzaG93cm9vbXxlbnwxfHx8fDE3NjE2OTg2MTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Car showroom"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
        </div>

        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl">
              <h1 className="text-white mb-6 text-[64px] font-bold font-[Roboto] tracking-tight leading-tight">
                Premium Vehicle Collection
              </h1>
              <p className="text-white/90 leading-relaxed text-[24px] italic">
                Discover luxury vehicles with advanced filtering and
                comprehensive details.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Inventory Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="mb-2">Browse Our Inventory</h2>
              <p className="text-gray-600">
                Find your perfect vehicle with our advanced search
              </p>
            </div>
          </div>

          {/* Enhanced Filters */}
          <Card className="p-6 mb-8 border-none shadow-lg shadow-red-600/20 hover:shadow-xl hover:shadow-red-600/30 transition-all">
            <div className="flex items-center gap-2 mb-6">
              <Filter className="text-red-600" size={20} />
              <h3 className="text-black">Filters & Search</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Brand Filter */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Brand / Make
                </label>
                <Select
                  value={selectedBrand}
                  onValueChange={(value) => {
                    setSelectedBrand(value);
                    setSelectedModel("all"); // Reset model when brand changes
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Brands" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Model Filter */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Model
                </label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Models" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Models</SelectItem>
                    {availableModels.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Year Filter */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">Year</label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2021">2021</SelectItem>
                    <SelectItem value="2020">2020</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Condition Filter */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Condition
                </label>
                <Select
                  value={selectedCondition}
                  onValueChange={setSelectedCondition}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Conditions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Conditions</SelectItem>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Foreign Used">
                      Foreign Used (Tokunbo)
                    </SelectItem>
                    <SelectItem value="Nigerian Used">Nigerian Used</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Body Type Filter */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Body Type
                </label>
                <Select
                  value={selectedBodyType}
                  onValueChange={setSelectedBodyType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Sedan">Sedan</SelectItem>
                    <SelectItem value="SUV">SUV</SelectItem>
                    <SelectItem value="Coupe">Coupe</SelectItem>
                    <SelectItem value="Hatchback">Hatchback</SelectItem>
                    <SelectItem value="Truck">Truck</SelectItem>
                    <SelectItem value="Van">Van</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Transmission Filter */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Transmission
                </label>
                <Select
                  value={selectedTransmission}
                  onValueChange={setSelectedTransmission}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Automatic">Automatic</SelectItem>
                    <SelectItem value="Manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Fuel Type Filter */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Fuel Type
                </label>
                <Select
                  value={selectedFuelType}
                  onValueChange={setSelectedFuelType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Fuel Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Fuel Types</SelectItem>
                    <SelectItem value="Petrol">Petrol</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Electric">Electric</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Category
                </label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="sedan">Sedan</SelectItem>
                    <SelectItem value="suv">SUV</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="truck">Truck</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-3">
                Price Range: {formatCurrency(priceRange[0])} -{" "}
                {formatCurrency(priceRange[1])}
              </label>
              <Slider
                min={0}
                max={5000000000}
                step={5000}
                value={priceRange}
                onValueChange={setPriceRange}
                className="w-full"
              />
            </div>

            {/* Mileage Range Slider */}
            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-3">
                Mileage: {mileageRange[0].toLocaleString()} km -{" "}
                {mileageRange[1].toLocaleString()} km
              </label>
              <Slider
                min={0}
                max={200000}
                step={5000}
                value={mileageRange}
                onValueChange={setMileageRange}
                className="w-full"
              />
            </div>

            {/* Search Input */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">Search</label>
              <Input
                placeholder="Search by model, brand, or keyword..."
                className="w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </Card>

          {/* Results Header with Sorting */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="text-sm text-gray-600">
              {isLoadingVehicles ? "Loading" : sortedVehicles.length} vehicle
              {sortedVehicles.length !== 1 ? "s" : ""} found
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <ArrowUpDown size={16} className="text-gray-600" />
                <label className="text-sm text-gray-700">Sort By:</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Recently Added</SelectItem>
                    <SelectItem value="priceLow">Price: Low to High</SelectItem>
                    <SelectItem value="priceHigh">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="yearNew">Year: Newest First</SelectItem>
                    <SelectItem value="yearOld">Year: Oldest First</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="text-black border-gray-300 hover:bg-gray-100 font-medium"
              >
                Clear All Filters
              </Button>
            </div>
          </div>

          {/* Vehicle Grid */}
          {sortedVehicles.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 mb-4">
                No vehicles match your search criteria.
              </p>
              <Button
                onClick={clearAllFilters}
                variant="outline"
                className="text-black border-gray-300 hover:bg-gray-100 font-medium"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedVehicles.map((vehicle) => (
                <Card
                  key={vehicle.id}
                  className="group overflow-hidden border-none shadow-lg shadow-red-600/20 hover:shadow-xl hover:shadow-red-600/30 transition-all"
                >
                  <div className="relative h-64 overflow-hidden">
                    <ImageWithFallback
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Year and Condition Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <div className="bg-black/80 px-3 py-1 rounded-full">
                        <span className="text-white text-sm">
                          {vehicle.year}
                        </span>
                      </div>
                      {vehicle.condition === "New" && (
                        <div className="bg-red-600 px-3 py-1 rounded-full">
                          <span className="text-white text-sm">New</span>
                        </div>
                      )}
                    </div>

                    {/* Special Tags */}
                    {vehicle.tags.length > 0 && (
                      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                        {vehicle.tags.map((tag) => (
                          <Badge
                            key={tag}
                            className="bg-red-600 hover:bg-red-700 text-white border-none flex items-center gap-1"
                          >
                            {getTagIcon(tag)}
                            <span className="text-xs">{getTagLabel(tag)}</span>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <p className="text-gray-500 text-sm mb-1 tracking-wider">
                      {vehicle.brand}
                    </p>
                    <h3 className="text-black mb-2">{vehicle.name}</h3>
                    <p className="text-gray-900 mb-2">
                      {formatCurrency(vehicle.price)}
                    </p>

                    {/* Vehicle Specs */}
                    <div className="flex flex-wrap gap-3 mb-4 text-xs text-gray-600">
                      <span>{vehicle.transmission}</span>
                      <span>&#8226;</span>
                      <span>{vehicle.fuelType}</span>
                      <span>&#8226;</span>
                      <span>{vehicle.mileage.toLocaleString()} km</span>
                    </div>

                    <div className="space-y-2 mb-4">
                      {vehicle.features.slice(0, 3).map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center text-sm text-gray-600"
                        >
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-black hover:bg-gray-800 text-white font-medium"
                        onClick={() => {
                          setSelectedVehicle(vehicle);
                          setIsDialogOpen(true);
                        }}
                      >
                        View Details
                        <ArrowRight className="ml-2" size={18} />
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 text-black border-gray-300 hover:bg-gray-100 font-medium"
                      >
                        Test Drive
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section - Custom Orders & Auctions */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-[32px]">Explore More Options</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Can't find what you're looking for? Discover our custom
              importation service or bid on premium auction vehicles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Custom Importation Orders Card */}
            <Card className="overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all group">
              <div className="relative h-80">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1759831766683-b0d6a0c41dc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjdXN0b20lMjBjYXIlMjBkZXNpZ258ZW58MXx8fHwxNzY2MTgwOTU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Custom car importation"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <Badge className="bg-red-600 hover:bg-red-700 text-white border-none px-3 py-1 mb-4 w-fit">
                    <Sparkles size={14} className="mr-2" />
                    BESPOKE SERVICE
                  </Badge>
                  <h3 className="text-white mb-3 text-[28px]">
                    Custom Importation Orders
                  </h3>
                  <p className="text-white/90 mb-6 leading-relaxed">
                    Source your dream vehicle from anywhere in the world. We
                    handle everything from finding the perfect spec to delivery
                    at your doorstep.
                  </p>
                  <Button
                    onClick={() => onNavigate("importation")}
                    className="bg-white text-black hover:bg-gray-200 font-medium w-full sm:w-auto"
                    size="lg"
                  >
                    Start Custom Order
                    <ArrowRight className="ml-2" size={18} />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Auction Vehicles Card */}
            <Card className="overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all group">
              <div className="relative h-80">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1541348263662-e068662d82af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBjYXIlMjBmcm9udHxlbnwxfHx8fDE3NjE2MzczODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Auction vehicles"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <Badge className="bg-red-600 hover:bg-red-700 text-white border-none px-3 py-1 mb-4 w-fit">
                    <Hammer size={14} className="mr-2" />
                    LIVE AUCTIONS
                  </Badge>
                  <h3 className="text-white mb-3 text-[28px]">
                    Premium Vehicle Auctions
                  </h3>
                  <p className="text-white/90 mb-6 leading-relaxed">
                    Bid on exclusive luxury vehicles with full transparency on
                    condition, history, and importation included in your winning
                    bid.
                  </p>
                  <Button
                    onClick={() => onNavigate("importation")}
                    className="bg-white text-black hover:bg-gray-200 font-medium w-full sm:w-auto"
                    size="lg"
                  >
                    Browse Auctions
                    <ArrowRight className="ml-2" size={18} />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Additional Info */}
          <div className="mt-12 p-8 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl mb-2">500+</div>
                <p className="text-sm text-gray-600">
                  Vehicles Imported Annually
                </p>
              </div>
              <div>
                <div className="text-3xl mb-2">40+</div>
                <p className="text-sm text-gray-600">
                  Countries We Source From
                </p>
              </div>
              <div>
                <div className="text-3xl mb-2">98%</div>
                <p className="text-sm text-gray-600">Customer Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle Details Dialog */}
      {selectedVehicle && (
        <VehicleDetailsDialog
          vehicle={selectedVehicle}
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedVehicle(null);
          }}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}
