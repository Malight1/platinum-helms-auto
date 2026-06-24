import { useEffect, useState } from "react";
import api from "@/lib/api";
import { CarRecord, formatCurrency, normalizeCar } from "@/lib/adminUtils";
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
import { Slider } from "../components/slider";
import { Badge } from "../components/badge";
import {
  Globe,
  Package,
  Shield,
  Clock,
  CheckCircle2,
  Filter,
  Heart,
  ArrowRight,
  TrendingUp,
  Search,
  Zap,
  Tag,
  CarFront,
  Star,
  Sparkles,
} from "lucide-react";
import { VehicleDetailsDialog } from "../components/VehicleDetailsDialog";
import { ImportationRequestForm } from "../components/ImportationRequestForm";
import phblack from "../assets/phblack.png";

interface CarImportationPageProps {
  onNavigate: (page: string) => void;
}

interface ImportVehicle {
  id: number;
  name: string;
  brand: string;
  model: string;
  category: string;
  year: number;
  condition: string;
  country: string;
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

export function CarImportationPage({ onNavigate }: CarImportationPageProps) {
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedModel, setSelectedModel] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [selectedTransmission, setSelectedTransmission] = useState("all");
  const [selectedFuelType, setSelectedFuelType] = useState("all");
  const [selectedBodyType, setSelectedBodyType] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 250000000]);
  const [mileageRange, setMileageRange] = useState([0, 200000]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy] = useState("recent");
  const [selectedVehicle, setSelectedVehicle] = useState<ImportVehicle | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImportFormOpen, setIsImportFormOpen] = useState(false);
  const [databaseImportVehicles, setDatabaseImportVehicles] = useState<ImportVehicle[]>([]);

  const importProcess = [
    { step: "01", title: "Vehicle Selection", description: "Choose your dream vehicle from international markets with our expert guidance." },
    { step: "02", title: "Documentation", description: "We handle all paperwork, customs documentation, and import regulations." },
    { step: "03", title: "Shipping & Logistics", description: "Secure international shipping with full tracking and insurance coverage." },
    { step: "04", title: "Customs Clearance", description: "Expert customs clearance ensuring compliance with all local regulations." },
    { step: "05", title: "Final Inspection", description: "Comprehensive inspection and preparation before delivery to you." },
    { step: "06", title: "Delivery", description: "White-glove delivery service directly to your preferred location." },
  ];

  const benefits = [
    { icon: Globe, title: "Global Access", description: "Source vehicles from premium markets worldwide including Canada, USA, and Dubai." },
    { icon: Shield, title: "Full Protection", description: "Comprehensive insurance coverage throughout the entire import process." },
    { icon: Clock, title: "Time Efficient", description: "Streamlined process typically completed within 6-8 weeks." },
    { icon: Package, title: "Complete Service", description: "End-to-end handling from purchase to delivery at your doorstep." },
  ];

  const importVehicles: ImportVehicle[] = [
    {
      id: 1, name: "Accord Sedan", brand: "Honda", model: "Accord",
      category: "sedan", bodyType: "Sedan", year: 2013, condition: "Foreign Used", country: "Canada",
      price: 8500000, transmission: "Automatic", fuelType: "Petrol", mileage: 72000,
      image: "https://images.unsplash.com/photo-1666067313311-de0a3760d884?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBmcm9udHxlbnwxfHx8fDE3NjE2NjA4MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      features: ["Bluetooth", "Backup Camera", "Heated Seats", "Push Start"],
      tags: ["popular", "hotDeal"], views: 3200, dateAdded: "2025-11-01",
    },
    {
      id: 2, name: "RX 350 AWD", brand: "Lexus", model: "RX 350",
      category: "suv", bodyType: "SUV", year: 2020, condition: "Foreign Used", country: "Canada",
      price: 22000000, transmission: "Automatic", fuelType: "Petrol", mileage: 38000,
      image: "https://images.unsplash.com/photo-1700884520248-92092bd21e63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBTVVZ8ZW58MXx8fHwxNzYxNjU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      features: ["Premium Sound", "Navigation", "Panoramic Roof", "Leather Seats"],
      tags: ["popular", "searched"], views: 2850, dateAdded: "2025-11-03",
    },
    {
      id: 3, name: "4Runner SR5", brand: "Toyota", model: "4Runner",
      category: "suv", bodyType: "SUV", year: 2019, condition: "Foreign Used", country: "Canada",
      price: 18500000, transmission: "Automatic", fuelType: "Petrol", mileage: 55000,
      image: "https://images.unsplash.com/photo-1700884520248-92092bd21e63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBTVVZ8ZW58MXx8fHwxNzYxNjU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      features: ["4WD", "Crawl Control", "Blind Spot Monitor"],
      tags: ["hotDeal"], views: 1780, dateAdded: "2025-10-28",
    },
    {
      id: 4, name: "CR-V EX-L", brand: "Honda", model: "CR-V",
      category: "suv", bodyType: "SUV", year: 2018, condition: "Foreign Used", country: "Canada",
      price: 12000000, transmission: "Automatic", fuelType: "Petrol", mileage: 62000,
      image: "https://images.unsplash.com/photo-1700884520248-92092bd21e63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBTVVZ8ZW58MXx8fHwxNzYxNjU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      features: ["Apple CarPlay", "Heated Seats", "Lane Watch", "Sunroof"],
      tags: ["promo"], views: 1540, dateAdded: "2025-10-26",
    },
    {
      id: 5, name: "Camry SE", brand: "Toyota", model: "Camry",
      category: "sedan", bodyType: "Sedan", year: 2018, condition: "Foreign Used", country: "United States",
      price: 11000000, transmission: "Automatic", fuelType: "Petrol", mileage: 68000,
      image: "https://images.unsplash.com/photo-1666067313311-de0a3760d884?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBmcm9udHxlbnwxfHx8fDE3NjE2NjA4MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      features: ["Apple CarPlay", "Lane Assist", "Backup Camera", "Bluetooth"],
      tags: ["popular", "hotDeal"], views: 2950, dateAdded: "2025-11-04",
    },
    {
      id: 6, name: "GLE 350 4MATIC", brand: "Mercedes-Benz", model: "GLE",
      category: "suv", bodyType: "SUV", year: 2021, condition: "Foreign Used", country: "United States",
      price: 32000000, transmission: "Automatic", fuelType: "Petrol", mileage: 28000,
      image: "https://images.unsplash.com/photo-1700884520248-92092bd21e63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBTVVZ8ZW58MXx8fHwxNzYxNjU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      features: ["MBUX System", "Air Suspension", "Burmester Sound", "Panoramic Roof"],
      tags: ["popular", "searched"], views: 2340, dateAdded: "2025-10-31",
    },
    {
      id: 7, name: "Explorer XLT", brand: "Ford", model: "Explorer",
      category: "suv", bodyType: "SUV", year: 2020, condition: "Foreign Used", country: "United States",
      price: 15000000, transmission: "Automatic", fuelType: "Petrol", mileage: 44000,
      image: "https://images.unsplash.com/photo-1700884520248-92092bd21e63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBTVVZ8ZW58MXx8fHwxNzYxNjU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      features: ["Third Row Seats", "Navigation", "Reverse Camera", "Ford Co-Pilot"],
      tags: ["promo"], views: 1650, dateAdded: "2025-10-25",
    },
    {
      id: 8, name: "Tahoe LT", brand: "Chevrolet", model: "Tahoe",
      category: "suv", bodyType: "SUV", year: 2020, condition: "Foreign Used", country: "United States",
      price: 22000000, transmission: "Automatic", fuelType: "Petrol", mileage: 40000,
      image: "https://images.unsplash.com/photo-1700884520248-92092bd21e63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBTVVZ8ZW58MXx8fHwxNzYxNjU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      features: ["8-Seater", "Bose Sound", "Wireless Charging", "Heated Seats"],
      tags: ["searched"], views: 1920, dateAdded: "2025-10-27",
    },
    {
      id: 9, name: "G63 AMG Edition 1", brand: "Mercedes-Benz", model: "G-Class",
      category: "suv", bodyType: "SUV", year: 2022, condition: "Foreign Used", country: "Dubai",
      price: 85000000, transmission: "Automatic", fuelType: "Petrol", mileage: 12000,
      image: "https://images.unsplash.com/photo-1700884520248-92092bd21e63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBTVVZ8ZW58MXx8fHwxNzYxNjU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      features: ["V8 Biturbo", "Gold Accents", "AMG Performance", "Premium Package"],
      tags: ["popular", "searched"], views: 2100, dateAdded: "2025-11-02",
    },
    {
      id: 10, name: "Land Cruiser LC200", brand: "Toyota", model: "Land Cruiser",
      category: "suv", bodyType: "SUV", year: 2021, condition: "Foreign Used", country: "Dubai",
      price: 48000000, transmission: "Automatic", fuelType: "Diesel", mileage: 18000,
      image: "https://images.unsplash.com/photo-1700884520248-92092bd21e63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBTVVZ8ZW58MXx8fHwxNzYxNjU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      features: ["V8 Diesel", "Multi-Terrain", "Mark Levinson", "Full-Time 4WD"],
      tags: ["popular", "hotDeal"], views: 1850, dateAdded: "2025-11-01",
    },
    {
      id: 11, name: "RX 350 F Sport", brand: "Lexus", model: "RX 350",
      category: "suv", bodyType: "SUV", year: 2022, condition: "Foreign Used", country: "Dubai",
      price: 28000000, transmission: "Automatic", fuelType: "Petrol", mileage: 22000,
      image: "https://images.unsplash.com/photo-1700884520248-92092bd21e63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBTVVZ8ZW58MXx8fHwxNzYxNjU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      features: ["F Sport Package", "Mark Levinson", "HUD", "Adaptive Cruise"],
      tags: ["searched", "promo"], views: 1680, dateAdded: "2025-10-30",
    },
    {
      id: 12, name: "Accord Sport 2.0T", brand: "Honda", model: "Accord",
      category: "sedan", bodyType: "Sedan", year: 2020, condition: "Foreign Used", country: "Dubai",
      price: 16500000, transmission: "Automatic", fuelType: "Petrol", mileage: 31000,
      image: "https://images.unsplash.com/photo-1666067313311-de0a3760d884?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBmcm9udHxlbnwxfHx8fDE3NjE2NjA4MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      features: ["Turbocharged", "Sport Mode", "Apple CarPlay", "Wireless Charging"],
      tags: ["hotDeal"], views: 1450, dateAdded: "2025-10-29",
    },
  ];

  useEffect(() => {
    api.cars
      .getAll({ limit: 100 })
      .then((response) => {
        const cars = (response.data || [])
          .map(normalizeCar)
          .filter((c: CarRecord) => c.listingType === "importation");
        setDatabaseImportVehicles(cars);
      })
      .catch(() => {
        setDatabaseImportVehicles([]);
      });
  }, []);

  const displayedImportVehicles =
    databaseImportVehicles.length > 0 ? databaseImportVehicles : importVehicles;

  const availableModels =
    selectedBrand === "all"
      ? Array.from(new Set(displayedImportVehicles.map((v) => v.model))).sort()
      : Array.from(new Set(displayedImportVehicles.filter((v) => v.brand === selectedBrand).map((v) => v.model))).sort();

  let filteredVehicles = displayedImportVehicles.filter((vehicle) => {
    const countryMatch = selectedCountry === "all" || vehicle.country === selectedCountry;
    const brandMatch = selectedBrand === "all" || vehicle.brand === selectedBrand;
    const modelMatch = selectedModel === "all" || vehicle.model === selectedModel;
    const categoryMatch = selectedCategory === "all" || vehicle.category === selectedCategory;
    const yearMatch = selectedYear === "all" || vehicle.year.toString() === selectedYear;
    const conditionMatch = selectedCondition === "all" || vehicle.condition === selectedCondition;
    const transmissionMatch = selectedTransmission === "all" || vehicle.transmission === selectedTransmission;
    const fuelTypeMatch = selectedFuelType === "all" || vehicle.fuelType === selectedFuelType;
    const bodyTypeMatch = selectedBodyType === "all" || vehicle.bodyType === selectedBodyType;
    const priceMatch = vehicle.price >= priceRange[0] && vehicle.price <= priceRange[1];
    const mileageMatch = vehicle.mileage >= mileageRange[0] && vehicle.mileage <= mileageRange[1];
    const searchMatch =
      searchQuery === "" ||
      vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.country.toLowerCase().includes(searchQuery.toLowerCase());
    return countryMatch && brandMatch && modelMatch && categoryMatch && yearMatch &&
      conditionMatch && transmissionMatch && fuelTypeMatch && bodyTypeMatch &&
      priceMatch && mileageMatch && searchMatch;
  });

  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    switch (sortBy) {
      case "priceLow": return a.price - b.price;
      case "priceHigh": return b.price - a.price;
      case "yearNew": return b.year - a.year;
      case "yearOld": return a.year - b.year;
      case "popular": return b.views - a.views;
      case "recent":
      default: return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
    }
  });

  const clearAllFilters = () => {
    setSelectedCountry("all");
    setSelectedBrand("all");
    setSelectedModel("all");
    setSelectedCategory("all");
    setSelectedYear("all");
    setSelectedCondition("all");
    setSelectedTransmission("all");
    setSelectedFuelType("all");
    setSelectedBodyType("all");
    setPriceRange([0, 250000000]);
    setMileageRange([0, 200000]);
    setSearchQuery("");
  };

  const getTagIcon = (tag: string) => {
    switch (tag) {
      case "popular": return <TrendingUp size={14} />;
      case "searched": return <Search size={14} />;
      case "hotDeal": return <Zap size={14} />;
      case "promo": return <Tag size={14} />;
      default: return null;
    }
  };

  const getTagLabel = (tag: string) => {
    switch (tag) {
      case "popular": return "Most Popular";
      case "searched": return "Most Searched";
      case "hotDeal": return "Hot Deal";
      case "promo": return "Promo";
      default: return tag;
    }
  };

  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      Canada: "🇨🇦", "United States": "🇺🇸", Dubai: "🇦🇪", UAE: "🇦🇪",
    };
    return flags[country] || "🌍";
  };

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-obsidian">
        <div className="absolute inset-0">
          <ImageWithFallback src={phblack} alt="Car importation" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/85 to-obsidian/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 via-transparent to-transparent" />
        </div>
        <div className="relative mx-auto w-full max-w-7xl px-4 pb-12 pt-32 sm:px-6 sm:pb-16 sm:pt-36 lg:px-8 lg:pt-40">
          <div className="max-w-2xl">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand">
              Global Reach
            </span>
            <h1 className="font-display text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl">
              World-Class Vehicle<br className="hidden sm:block" /> Importation
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
              We source and import quality vehicles from Canada, USA, and Dubai — handling every step with expertise and precision.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["🇨🇦 Canada", "🇺🇸 United States", "🇦🇪 Dubai"].map((c) => (
                <span key={c} className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
                  {c}
                </span>
              ))}
            </div>
            <div className="mt-8">
              <Button onClick={() => setIsImportFormOpen(true)} className="bg-brand text-white hover:bg-brand-strong shadow-luxe" size="lg">
                Start Your Import Request
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4 font-display text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              Why Import With Platinum Helms
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Experience seamless international vehicle acquisition with our comprehensive importation services.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="p-6 border-none shadow-sm hover:shadow-md transition-shadow text-center">
                  <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="mb-3">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Import Process */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4 font-display text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">Our Import Process</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              A transparent, efficient process from selection to delivery.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {importProcess.map((item, index) => (
              <Card key={index} className="p-8 border-none shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-4xl text-gray-300">{item.step}</span>
                  <CheckCircle2 className="text-red-600 mt-2" size={24} />
                </div>
                <h3 className="mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Importation Orders Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[500px] lg:h-[600px] rounded-lg overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Vehicle in Canada ready for import"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <Badge className="bg-red-600 hover:bg-red-700 text-white border-none px-4 py-2 mb-3">
                  <Sparkles size={16} className="mr-2" />
                  Sourced from Canada
                </Badge>
                <p className="text-white/80 text-sm">Thousands of quality vehicles inspected and ready for import directly from Canadian dealerships and auctions.</p>
              </div>
            </div>
            <div>
              <div className="mb-6">
                <Badge className="bg-black text-white hover:bg-gray-800 border-none px-3 py-1 mb-4">
                  CUSTOM ORDERS
                </Badge>
                <h2 className="mb-6 font-display text-4xl font-bold tracking-tight leading-tight">
                  Can't Find What You're Looking For?
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  Our custom importation service allows you to specify exactly what you want. From popular everyday cars to
                  specific configurations unavailable locally, we'll source and import your perfect vehicle from Canada, USA, or Dubai.
                </p>
              </div>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <CarFront className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="mb-2">Personalized Vehicle Sourcing</h3>
                    <p className="text-gray-600">Tell us your dream specifications and we'll find it from Canada, USA, or Dubai</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Star className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="mb-2">Exclusive Access</h3>
                    <p className="text-gray-600">Access to private sales, dealer networks, and exclusive auctions in our key markets</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="mb-2">Pre-Import Inspection</h3>
                    <p className="text-gray-600">Comprehensive third-party inspection before purchase to ensure quality</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={() => setIsImportFormOpen(true)} className="bg-red-600 hover:bg-red-700 text-white font-medium" size="lg">
                  Request Custom Import <ArrowRight className="ml-2" size={18} />
                </Button>
                <Button onClick={() => onNavigate("contact")} variant="outline" className="text-black border-gray-300 hover:bg-gray-100 font-medium" size="lg">
                  Speak to a Specialist
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-6 mt-10 pt-10 border-t border-gray-200">
                <div>
                  <div className="text-3xl mb-2">500+</div>
                  <p className="text-sm text-gray-600">Custom Imports Completed</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">3</div>
                  <p className="text-sm text-gray-600">Key Markets: CA · US · AE</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">98%</div>
                  <p className="text-sm text-gray-600">Client Satisfaction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Import Vehicles */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4 font-display text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              Available Import Vehicles
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Browse our curated selection of quality vehicles ready for import from Canada, USA, and Dubai.
            </p>
          </div>

          {/* Filters Section */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Filter size={20} className="text-gray-600" />
              <span className="text-sm tracking-wider text-gray-900">FILTER BY:</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Country of Origin" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  <SelectItem value="Canada">🇨🇦 Canada</SelectItem>
                  <SelectItem value="United States">🇺🇸 United States</SelectItem>
                  <SelectItem value="Dubai">🇦🇪 Dubai</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Brand / Make" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  <SelectItem value="Toyota">Toyota</SelectItem>
                  <SelectItem value="Honda">Honda</SelectItem>
                  <SelectItem value="Lexus">Lexus</SelectItem>
                  <SelectItem value="Mercedes-Benz">Mercedes-Benz</SelectItem>
                  <SelectItem value="Ford">Ford</SelectItem>
                  <SelectItem value="Chevrolet">Chevrolet</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="sedan">Sedan</SelectItem>
                  <SelectItem value="suv">SUV</SelectItem>
                  <SelectItem value="sports">Sports Car</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Year" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                  <SelectItem value="2020">2020</SelectItem>
                  <SelectItem value="2019">2019</SelectItem>
                  <SelectItem value="2018">2018</SelectItem>
                  <SelectItem value="2013">2013</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Condition" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Conditions</SelectItem>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Foreign Used">Foreign Used</SelectItem>
                  <SelectItem value="Nigerian Used">Nigerian Used</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Model" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Models</SelectItem>
                  {availableModels.map((model) => (
                    <SelectItem key={model} value={model}>{model}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedTransmission} onValueChange={setSelectedTransmission}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Transmission" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Automatic">Automatic</SelectItem>
                  <SelectItem value="Manual">Manual</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedFuelType} onValueChange={setSelectedFuelType}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Fuel Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fuel Types</SelectItem>
                  <SelectItem value="Petrol">Petrol</SelectItem>
                  <SelectItem value="Diesel">Diesel</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                  <SelectItem value="Electric">Electric</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4">
              <label className="block text-sm text-gray-700 mb-3">
                Price Range: {formatCurrency(priceRange[0])} – {formatCurrency(priceRange[1])}
              </label>
              <Slider min={0} max={9000000000} step={10000} value={priceRange} onValueChange={setPriceRange} className="w-full" />
            </div>
            <div className="mt-4">
              <Input
                placeholder="Search by model, brand, or country..."
                className="w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {sortedVehicles.length} vehicle{sortedVehicles.length !== 1 ? "s" : ""} available for import
              </div>
              <Button variant="outline" size="sm" onClick={clearAllFilters} className="text-black border-gray-300 hover:bg-gray-100 font-medium">
                Clear All Filters
              </Button>
            </div>
          </div>

          {/* Vehicle Grid */}
          {sortedVehicles.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg mb-4">No vehicles match your search criteria.</p>
              <Button onClick={clearAllFilters} variant="outline" className="text-black border-gray-300 hover:bg-gray-100 font-medium">
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedVehicles.map((vehicle) => (
                <Card key={vehicle.id} className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all">
                  <div className="relative h-64 overflow-hidden">
                    <ImageWithFallback
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                      <Heart size={20} className="text-black" />
                    </button>
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <div className="bg-black/80 px-3 py-1 rounded-full flex items-center gap-2">
                        <span className="text-lg">{getCountryFlag(vehicle.country)}</span>
                        <span className="text-white text-sm">{vehicle.country}</span>
                      </div>
                      <div className="bg-black/80 px-3 py-1 rounded-full">
                        <span className="text-white text-sm">{vehicle.year}</span>
                      </div>
                    </div>
                    {vehicle.tags.length > 0 && (
                      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                        {vehicle.tags.map((tag) => (
                          <Badge key={tag} className="bg-red-600 hover:bg-red-700 text-white border-none flex items-center gap-1">
                            {getTagIcon(tag)}
                            <span className="text-xs">{getTagLabel(tag)}</span>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="mb-2">
                      <p className="text-sm text-gray-500">{vehicle.brand}</p>
                      <h3>{vehicle.name}</h3>
                    </div>
                    <p className="text-gray-900 mb-4">{formatCurrency(vehicle.price)}</p>
                    <div className="space-y-2 mb-6">
                      {vehicle.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-black hover:bg-gray-800 text-white font-medium"
                        onClick={() => { setSelectedVehicle(vehicle); setIsDialogOpen(true); }}
                      >
                        View Details <ArrowRight className="ml-2" size={18} />
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 text-black border-gray-300 hover:bg-gray-100 font-medium"
                        onClick={() => setIsImportFormOpen(true)}
                      >
                        Request Import
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Markets */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4 font-display text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">Our Import Markets</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We specialize in importing from three premier automotive markets trusted by Nigerians.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="overflow-hidden border-none shadow-lg shadow-red-600/20 hover:shadow-xl hover:shadow-red-600/30 transition-all">
              <div className="h-48 bg-gradient-to-br from-red-900 to-red-700 flex items-center justify-center">
                <div className="text-center text-white">
                  <span className="text-5xl block mb-3">🇨🇦</span>
                  <h3 className="text-white">Canada</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">Clean-title Tokunbo vehicles at competitive prices — Accord, Camry, Lexus RX, and more sourced directly from Canadian auctions and dealers.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  {["Ontario", "Alberta", "British Columbia"].map((c) => (
                    <li key={c} className="flex items-center"><CheckCircle2 size={16} className="mr-2 text-red-600" />{c}</li>
                  ))}
                </ul>
              </div>
            </Card>
            <Card className="overflow-hidden border-none shadow-lg shadow-red-600/20 hover:shadow-xl hover:shadow-red-600/30 transition-all">
              <div className="h-48 bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center">
                <div className="text-center text-white">
                  <span className="text-5xl block mb-3">🇺🇸</span>
                  <h3 className="text-white">United States</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">Wide selection of American-market SUVs, sedans, and trucks — Toyota Camry, Mercedes GLE, Ford Explorer and more at great value.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  {["Texas", "Georgia", "New Jersey"].map((c) => (
                    <li key={c} className="flex items-center"><CheckCircle2 size={16} className="mr-2 text-red-600" />{c}</li>
                  ))}
                </ul>
              </div>
            </Card>
            <Card className="overflow-hidden border-none shadow-lg shadow-red-600/20 hover:shadow-xl hover:shadow-red-600/30 transition-all">
              <div className="h-48 bg-gradient-to-br from-amber-900 to-amber-700 flex items-center justify-center">
                <div className="text-center text-white">
                  <span className="text-5xl block mb-3">🇦🇪</span>
                  <h3 className="text-white">Dubai</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">Rare configurations and luxury models from the premium markets of Dubai — GLC, G-Wagon, Land Cruiser and exclusive specs.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  {["Dubai", "Abu Dhabi", "Sharjah"].map((c) => (
                    <li key={c} className="flex items-center"><CheckCircle2 size={16} className="mr-2 text-red-600" />{c}</li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mb-4 font-display text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Request an Import Quote
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Tell us about the vehicle you'd like to import, and we'll provide a detailed quote with delivery timelines and costs.
          </p>
          <Button onClick={() => setIsImportFormOpen(true)} className="bg-red-600 hover:bg-red-700 text-white font-medium px-12" size="lg">
            Start Import Request
          </Button>
          <p className="text-sm text-gray-500 mt-6">Our importation specialist will contact you within 24 hours</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-white mb-6 font-display text-4xl font-bold">Questions About Importing?</h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Our import specialists are available to discuss your specific needs and answer any questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => setIsImportFormOpen(true)} className="bg-white text-black hover:bg-gray-200 font-medium" size="lg">
              Schedule Consultation
            </Button>
            <Button onClick={() => onNavigate("financing")} variant="outline" className="bg-white text-black border-2 border-white font-medium" size="lg">
              View Financing Options
            </Button>
          </div>
        </div>
      </section>

      <ImportationRequestForm isOpen={isImportFormOpen} onClose={() => setIsImportFormOpen(false)} />
      <VehicleDetailsDialog vehicle={selectedVehicle} isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} onNavigate={onNavigate} />
    </div>
  );
}
