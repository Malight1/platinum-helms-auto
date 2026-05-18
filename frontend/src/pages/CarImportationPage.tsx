import { useEffect, useState } from "react";
import api from "@/lib/api";
import { formatCurrency, normalizeCar } from "@/lib/adminUtils";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { Button } from "../components/button";
import { Card } from "../components/card";
import { Input } from "../components/input";
// import { Textarea } from "../components/textarea";
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
  // ArrowUpDown,
  CarFront,
  Star,
  Sparkles,
  Hammer,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { VehicleDetailsDialog } from "../components/VehicleDetailsDialog";
import { ImportationRequestForm } from "../components/ImportationRequestForm";
import { AuctionCountdown } from "../components/AuctionCountdown";

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

interface AuctionVehicle extends Omit<ImportVehicle, "price"> {
  currentBid: number;
  startingBid: number;
  bidCount: number;
  auctionEndTime: string;
  vehicleStatus: "clean" | "accidented" | "withIssues";
  issueDescription?: string;
  reservePrice: number;
  reserveMet: boolean;
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
  const [priceRange, setPriceRange] = useState([0, 300000]);
  const [mileageRange, setMileageRange] = useState([0, 200000]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy] = useState("recent");
  const [selectedVehicle, setSelectedVehicle] = useState<ImportVehicle | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImportFormOpen, setIsImportFormOpen] = useState(false);

  // Auction filters
  const [auctionVehicleStatus, setAuctionVehicleStatus] = useState("all");
  const [auctionSearchQuery, setAuctionSearchQuery] = useState("");
  const [auctionBidRange, setAuctionBidRange] = useState([0, 500000]);
  const [auctionSortBy, setAuctionSortBy] = useState("ending");
  const [databaseImportVehicles, setDatabaseImportVehicles] = useState<ImportVehicle[]>([]);
  const [databaseAuctionVehicles, setDatabaseAuctionVehicles] = useState<AuctionVehicle[]>([]);

  const importProcess = [
    {
      step: "01",
      title: "Vehicle Selection",
      description:
        "Choose your dream vehicle from international markets with our expert guidance.",
    },
    {
      step: "02",
      title: "Documentation",
      description:
        "We handle all paperwork, customs documentation, and import regulations.",
    },
    {
      step: "03",
      title: "Shipping & Logistics",
      description:
        "Secure international shipping with full tracking and insurance coverage.",
    },
    {
      step: "04",
      title: "Customs Clearance",
      description:
        "Expert customs clearance ensuring compliance with all local regulations.",
    },
    {
      step: "05",
      title: "Final Inspection",
      description:
        "Comprehensive inspection and preparation before delivery to you.",
    },
    {
      step: "06",
      title: "Delivery",
      description:
        "White-glove delivery service directly to your preferred location.",
    },
  ];

  const benefits = [
    {
      icon: Globe,
      title: "Global Access",
      description:
        "Source vehicles from premium markets worldwide including Europe, Japan, and Dubai.",
    },
    {
      icon: Shield,
      title: "Full Protection",
      description:
        "Comprehensive insurance coverage throughout the entire import process.",
    },
    {
      icon: Clock,
      title: "Time Efficient",
      description: "Streamlined process typically completed within 6-8 weeks.",
    },
    {
      icon: Package,
      title: "Complete Service",
      description:
        "End-to-end handling from purchase to delivery at your doorstep.",
    },
  ];

  const importVehicles: ImportVehicle[] = [
    {
      id: 1,
      name: "S-Class Maybach",
      brand: "Mercedes-Benz",
      model: "S-Class Maybach",
      category: "sedan",
      bodyType: "Sedan",
      year: 2025,
      condition: "New",
      country: "Germany",
      price: 185000,
      transmission: "Automatic",
      fuelType: "Petrol",
      mileage: 0,
      image:
        "https://images.unsplash.com/photo-1666067313311-de0a3760d884?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBmcm9udHxlbnwxfHx8fDE3NjE2NjA4MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      features: [
        "Executive Rear Seats",
        "Champagne Flutes",
        "Chauffeur Package",
      ],
      tags: ["popular", "searched"],
      views: 1850,
      dateAdded: "2025-11-01",
    },
    {
      id: 2,
      name: "G-Class AMG",
      brand: "Mercedes-Benz",
      model: "G-Class",
      category: "suv",
      bodyType: "SUV",
      year: 2025,
      condition: "New",
      country: "Germany",
      price: 165000,
      transmission: "Automatic",
      fuelType: "Petrol",
      mileage: 0,
      image:
        "https://images.unsplash.com/photo-1700884520248-92092bd21e63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBTVVZ8ZW58MXx8fHwxNzYxNjU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      features: ["V8 Biturbo", "Off-Road Package", "AMG Performance"],
      tags: ["popular", "hotDeal"],
      views: 2100,
      dateAdded: "2025-11-02",
    },
    {
      id: 3,
      name: "911 Turbo S",
      brand: "Porsche",
      model: "911",
      category: "sports",
      bodyType: "Coupe",
      year: 2025,
      condition: "New",
      country: "Germany",
      price: 230000,
      transmission: "Automatic",
      fuelType: "Petrol",
      mileage: 0,
      image:
        "https://images.unsplash.com/photo-1541348263662-e068662d82af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBjYXIlMjBmcm9udHxlbnwxfHx8fDE3NjE2MzczODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      features: ["640 HP", "Sport Chrono", "Carbon Ceramic Brakes"],
      tags: ["searched", "promo"],
      views: 1680,
      dateAdded: "2025-10-30",
    },
    {
      id: 4,
      name: "Skyline GT-R R34",
      brand: "Nissan",
      model: "Skyline GT-R",
      category: "sports",
      bodyType: "Coupe",
      year: 1999,
      condition: "Foreign Used",
      country: "Japan",
      price: 195000,
      transmission: "Manual",
      fuelType: "Petrol",
      mileage: 45000,
      image:
        "https://images.unsplash.com/photo-1541348263662-e068662d82af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBjYXIlMjBmcm9udHxlbnwxfHx8fDE3NjE2MzczODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      features: ["RB26DETT", "AWD", "JDM Legend"],
      tags: ["popular", "searched", "hotDeal"],
      views: 3200,
      dateAdded: "2025-11-03",
    },
    {
      id: 5,
      name: "Land Cruiser 300",
      brand: "Toyota",
      model: "Land Cruiser",
      category: "suv",
      bodyType: "SUV",
      year: 2025,
      condition: "New",
      country: "Japan",
      price: 95000,
      transmission: "Automatic",
      fuelType: "Diesel",
      mileage: 0,
      image:
        "https://images.unsplash.com/photo-1700884520248-92092bd21e63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBTVVZ8ZW58MXx8fHwxNzYxNjU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      features: ["V6 Twin-Turbo", "Full-Time 4WD", "Off-Road Tech"],
      tags: ["popular", "promo"],
      views: 1920,
      dateAdded: "2025-10-28",
    },
    {
      id: 6,
      name: "LX 600",
      brand: "Lexus",
      model: "LX",
      category: "suv",
      bodyType: "SUV",
      year: 2025,
      condition: "New",
      country: "Japan",
      price: 125000,
      transmission: "Automatic",
      fuelType: "Petrol",
      mileage: 0,
      image:
        "https://images.unsplash.com/photo-1700884520248-92092bd21e63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBTVVZ8ZW58MXx8fHwxNzYxNjU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      features: ["Luxury Interior", "Mark Levinson", "Multi-Terrain"],
      tags: ["searched"],
      views: 1540,
      dateAdded: "2025-10-27",
    },
    {
      id: 7,
      name: "Range Rover SV",
      brand: "Land Rover",
      model: "Range Rover",
      category: "suv",
      bodyType: "SUV",
      year: 2025,
      condition: "New",
      country: "United Kingdom",
      price: 215000,
      transmission: "Automatic",
      fuelType: "Petrol",
      mileage: 0,
      image:
        "https://images.unsplash.com/photo-1700884520248-92092bd21e63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBTVVZ8ZW58MXx8fHwxNzYxNjU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      features: ["SV Bespoke", "Air Suspension", "Meridian Audio"],
      tags: ["popular", "hotDeal"],
      views: 1780,
      dateAdded: "2025-10-29",
    },
    {
      id: 8,
      name: "Continental GT",
      brand: "Bentley",
      model: "Continental GT",
      category: "sports",
      bodyType: "Coupe",
      year: 2025,
      condition: "New",
      country: "United Kingdom",
      price: 245000,
      transmission: "Automatic",
      fuelType: "Petrol",
      mileage: 0,
      image:
        "https://images.unsplash.com/photo-1541348263662-e068662d82af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBjYXIlMjBmcm9udHxlbnwxfHx8fDE3NjE2MzczODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      features: ["W12 Engine", "Handcrafted Interior", "Rotating Display"],
      tags: ["searched", "promo"],
      views: 1450,
      dateAdded: "2025-10-26",
    },
    {
      id: 9,
      name: "812 Competizione",
      brand: "Ferrari",
      model: "812",
      category: "sports",
      bodyType: "Coupe",
      year: 2024,
      condition: "New",
      country: "Italy",
      price: 595000,
      transmission: "Automatic",
      fuelType: "Petrol",
      mileage: 0,
      image:
        "https://images.unsplash.com/photo-1541348263662-e068662d82af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBjYXIlMjBmcm9udHxlbnwxfHx8fDE3NjE2MzczODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      features: ["V12 830 HP", "Limited Edition", "Track Performance"],
      tags: ["popular", "searched"],
      views: 2850,
      dateAdded: "2025-11-04",
    },
    {
      id: 10,
      name: "Urus Performante",
      brand: "Lamborghini",
      model: "Urus",
      category: "suv",
      bodyType: "SUV",
      year: 2025,
      condition: "New",
      country: "Italy",
      price: 265000,
      transmission: "Automatic",
      fuelType: "Petrol",
      mileage: 0,
      image:
        "https://images.unsplash.com/photo-1700884520248-92092bd21e63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBTVVZ8ZW58MXx8fHwxNzYxNjU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      features: ["V8 666 HP", "Carbon Fiber", "Rally Mode"],
      tags: ["popular", "hotDeal"],
      views: 2340,
      dateAdded: "2025-10-31",
    },
    {
      id: 11,
      name: "G63 Edition 1",
      brand: "Mercedes-Benz",
      model: "G-Class",
      category: "suv",
      bodyType: "SUV",
      year: 2025,
      condition: "New",
      country: "UAE",
      price: 195000,
      transmission: "Automatic",
      fuelType: "Petrol",
      mileage: 0,
      image:
        "https://images.unsplash.com/photo-1700884520248-92092bd21e63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBTVVZ8ZW58MXx8fHwxNzYxNjU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      features: ["Desert Edition", "Gold Accents", "Premium Package"],
      tags: ["searched", "promo"],
      views: 1650,
      dateAdded: "2025-10-25",
    },
    {
      id: 12,
      name: "Aventador SVJ",
      brand: "Lamborghini",
      model: "Aventador",
      category: "sports",
      bodyType: "Coupe",
      year: 2024,
      condition: "Foreign Used",
      country: "UAE",
      price: 485000,
      transmission: "Automatic",
      fuelType: "Petrol",
      mileage: 8000,
      image:
        "https://images.unsplash.com/photo-1541348263662-e068662d82af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBjYXIlMjBmcm9udHxlbnwxfHx8fDE3NjE2MzczODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      features: ["V12 770 HP", "Aerodinamica", "Rare Spec"],
      tags: ["popular", "hotDeal"],
      views: 2950,
      dateAdded: "2025-11-02",
    },
  ];

  // Auction vehicles data
  const auctionVehicles: AuctionVehicle[] = [
    {
      id: 101,
      name: "E63 AMG S",
      brand: "Mercedes-Benz",
      model: "E-Class",
      category: "sedan",
      bodyType: "Sedan",
      year: 2023,
      condition: "Foreign Used",
      country: "Germany",
      currentBid: 72000,
      startingBid: 65000,
      bidCount: 23,
      auctionEndTime: "2025-12-20T18:30:00",
      transmission: "Automatic",
      fuelType: "Petrol",
      mileage: 15000,
      image:
        "https://images.unsplash.com/photo-1666067313311-de0a3760d884?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBmcm9udHxlbnwxfHx8fDE3NjE2NjA4MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      features: ["AMG Performance", "Carbon Fiber Trim", "Dynamic Seats"],
      tags: ["popular"],
      views: 890,
      dateAdded: "2025-12-15",
      vehicleStatus: "clean",
      reservePrice: 75000,
      reserveMet: false,
    },
    {
      id: 102,
      name: "Cayenne Turbo",
      brand: "Porsche",
      model: "Cayenne",
      category: "suv",
      bodyType: "SUV",
      year: 2022,
      condition: "Foreign Used",
      country: "Germany",
      currentBid: 58000,
      startingBid: 50000,
      bidCount: 31,
      auctionEndTime: "2025-12-19T22:00:00",
      transmission: "Automatic",
      fuelType: "Petrol",
      mileage: 28000,
      image:
        "https://images.unsplash.com/photo-1700884520248-92092bd21e63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBTVVZ8ZW58MXx8fHwxNzYxNjU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      features: ["Turbo Engine", "Sport Chrono", "Panoramic Roof"],
      tags: ["hotDeal"],
      views: 1245,
      dateAdded: "2025-12-14",
      vehicleStatus: "withIssues",
      issueDescription:
        "Minor scratches on rear bumper, needs paint correction",
      reservePrice: 60000,
      reserveMet: false,
    },
    {
      id: 103,
      name: "M5 Competition",
      brand: "BMW",
      model: "M5",
      category: "sedan",
      bodyType: "Sedan",
      year: 2021,
      condition: "Foreign Used",
      country: "Germany",
      currentBid: 48500,
      startingBid: 42000,
      bidCount: 18,
      auctionEndTime: "2025-12-21T16:00:00",
      transmission: "Automatic",
      fuelType: "Petrol",
      mileage: 35000,
      image:
        "https://images.unsplash.com/photo-1666067313311-de0a3760d884?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBmcm9udHxlbnwxfHx8fDE3NjE2NjA4MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      features: ["625 HP", "M xDrive", "Carbon Roof"],
      tags: ["searched"],
      views: 756,
      dateAdded: "2025-12-13",
      vehicleStatus: "accidented",
      issueDescription:
        "Front-end collision repair in 2023, fully restored with OEM parts",
      reservePrice: 50000,
      reserveMet: false,
    },
    {
      id: 104,
      name: "LC 500",
      brand: "Lexus",
      model: "LC",
      category: "sports",
      bodyType: "Coupe",
      year: 2024,
      condition: "Foreign Used",
      country: "Japan",
      currentBid: 68000,
      startingBid: 60000,
      bidCount: 27,
      auctionEndTime: "2025-12-20T14:45:00",
      transmission: "Automatic",
      fuelType: "Petrol",
      mileage: 8500,
      image:
        "https://images.unsplash.com/photo-1541348263662-e068662d82af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBjYXIlMjBmcm9udHxlbnwxfHx8fDE3NjE2MzczODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      features: ["V8 Engine", "Mark Levinson Audio", "Performance Package"],
      tags: ["popular", "searched"],
      views: 1120,
      dateAdded: "2025-12-16",
      vehicleStatus: "clean",
      reservePrice: 70000,
      reserveMet: false,
    },
    {
      id: 105,
      name: "Range Rover Sport",
      brand: "Land Rover",
      model: "Range Rover Sport",
      category: "suv",
      bodyType: "SUV",
      year: 2023,
      condition: "Foreign Used",
      country: "United Kingdom",
      currentBid: 55000,
      startingBid: 48000,
      bidCount: 15,
      auctionEndTime: "2025-12-22T20:15:00",
      transmission: "Automatic",
      fuelType: "Diesel",
      mileage: 22000,
      image:
        "https://images.unsplash.com/photo-1700884520248-92092bd21e63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBTVVZ8ZW58MXx8fHwxNzYxNjU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      features: [
        "Dynamic Handling",
        "Meridian Sound",
        "All-Terrain Progress Control",
      ],
      tags: [],
      views: 645,
      dateAdded: "2025-12-12",
      vehicleStatus: "withIssues",
      issueDescription:
        "Sunroof mechanism needs servicing, interior wear on driver seat",
      reservePrice: 58000,
      reserveMet: false,
    },
    {
      id: 106,
      name: "AMG GT 63 S",
      brand: "Mercedes-Benz",
      model: "AMG GT",
      category: "sports",
      bodyType: "Coupe",
      year: 2024,
      condition: "Foreign Used",
      country: "UAE",
      currentBid: 125000,
      startingBid: 110000,
      bidCount: 42,
      auctionEndTime: "2025-12-20T12:00:00",
      transmission: "Automatic",
      fuelType: "Petrol",
      mileage: 5200,
      image:
        "https://images.unsplash.com/photo-1541348263662-e068662d82af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBjYXIlMjBmcm9udHxlbnwxfHx8fDE3NjE2MzczODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      features: ["630 HP", "Drift Mode", "Carbon Ceramic Brakes"],
      tags: ["popular", "hotDeal"],
      views: 1876,
      dateAdded: "2025-12-17",
      vehicleStatus: "clean",
      reservePrice: 120000,
      reserveMet: true,
    },
  ];

  useEffect(() => {
    api.cars
      .getAll({ limit: 100 })
      .then((response) => {
        const cars = (response.data || []).map(normalizeCar);
        setDatabaseImportVehicles(cars);
        setDatabaseAuctionVehicles(
          cars
            .filter((car: any) => car.tags.includes("auction"))
            .map((car: any) => ({
              ...car,
              currentBid: car.price,
              startingBid: Math.round(car.price * 0.8),
              reservePrice: Math.round(car.price * 0.95),
              bidCount: 0,
              reserveMet: false,
              auctionEndTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
              vehicleStatus: "clean",
            })),
        );
      })
      .catch(() => {
        setDatabaseImportVehicles([]);
        setDatabaseAuctionVehicles([]);
      });
  }, []);

  const displayedImportVehicles =
    databaseImportVehicles.length > 0 ? databaseImportVehicles : importVehicles;
  const displayedAuctionVehicles =
    databaseAuctionVehicles.length > 0 ? databaseAuctionVehicles : auctionVehicles;

  // Get unique brands for dropdown

  // Get models based on selected brand
  const availableModels =
    selectedBrand === "all"
      ? Array.from(new Set(displayedImportVehicles.map((v) => v.model))).sort()
      : Array.from(
          new Set(
            displayedImportVehicles
              .filter((v) => v.brand === selectedBrand)
              .map((v) => v.model)
          )
        ).sort();

  // Filtering logic
  let filteredVehicles = displayedImportVehicles.filter((vehicle) => {
    const countryMatch =
      selectedCountry === "all" || vehicle.country === selectedCountry;
    const brandMatch =
      selectedBrand === "all" || vehicle.brand === selectedBrand;
    const modelMatch =
      selectedModel === "all" || vehicle.model === selectedModel;
    const categoryMatch =
      selectedCategory === "all" || vehicle.category === selectedCategory;
    const yearMatch =
      selectedYear === "all" || vehicle.year.toString() === selectedYear;
    const conditionMatch =
      selectedCondition === "all" || vehicle.condition === selectedCondition;
    const transmissionMatch =
      selectedTransmission === "all" ||
      vehicle.transmission === selectedTransmission;
    const fuelTypeMatch =
      selectedFuelType === "all" || vehicle.fuelType === selectedFuelType;
    const bodyTypeMatch =
      selectedBodyType === "all" || vehicle.bodyType === selectedBodyType;
    const priceMatch =
      vehicle.price >= priceRange[0] && vehicle.price <= priceRange[1];
    const mileageMatch =
      vehicle.mileage >= mileageRange[0] && vehicle.mileage <= mileageRange[1];

    const searchMatch =
      searchQuery === "" ||
      vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.country.toLowerCase().includes(searchQuery.toLowerCase());

    return (
      countryMatch &&
      brandMatch &&
      modelMatch &&
      categoryMatch &&
      yearMatch &&
      conditionMatch &&
      transmissionMatch &&
      fuelTypeMatch &&
      bodyTypeMatch &&
      priceMatch &&
      mileageMatch &&
      searchMatch
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

  // Filter auction vehicles
  const filteredAuctionVehicles = displayedAuctionVehicles.filter((vehicle) => {
    const statusMatch =
      auctionVehicleStatus === "all" ||
      vehicle.vehicleStatus === auctionVehicleStatus;
    const bidMatch =
      vehicle.currentBid >= auctionBidRange[0] &&
      vehicle.currentBid <= auctionBidRange[1];
    const searchMatch =
      auctionSearchQuery === "" ||
      vehicle.name.toLowerCase().includes(auctionSearchQuery.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(auctionSearchQuery.toLowerCase());

    return statusMatch && bidMatch && searchMatch;
  });

  // Sort auction vehicles
  const sortedAuctionVehicles = [...filteredAuctionVehicles].sort((a, b) => {
    switch (auctionSortBy) {
      case "ending":
        return (
          new Date(a.auctionEndTime).getTime() -
          new Date(b.auctionEndTime).getTime()
        );
      case "bidLow":
        return a.currentBid - b.currentBid;
      case "bidHigh":
        return b.currentBid - a.currentBid;
      case "mostBids":
        return b.bidCount - a.bidCount;
      default:
        return 0;
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
    setPriceRange([0, 300000]);
    setMileageRange([0, 200000]);
    setSearchQuery("");
  };

  const clearAuctionFilters = () => {
    setAuctionVehicleStatus("all");
    setAuctionSearchQuery("");
    setAuctionBidRange([0, 500000]);
  };

  const getTagIcon = (tag: string) => {
    switch (tag) {
      case "popular":
        return <TrendingUp size={14} />;
      case "searched":
        return <Search size={14} />;
      case "hotDeal":
        return <Zap size={14} />;
      case "promo":
        return <Tag size={14} />;
      default:
        return null;
    }
  };

  const getTagLabel = (tag: string) => {
    switch (tag) {
      case "popular":
        return "Most Popular";
      case "searched":
        return "Most Searched";
      case "hotDeal":
        return "Hot Deal";
      case "promo":
        return "Promo";
      default:
        return tag;
    }
  };

  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      Germany: "🇩🇪",
      Japan: "🇯🇵",
      "United Kingdom": "🇬🇧",
      Italy: "🇮🇹",
      UAE: "🇦🇪",
      USA: "🇺🇸",
    };
    return flags[country] || "ðŸŒ";
  };

  const getVehicleStatusBadge = (
    status: "clean" | "accidented" | "withIssues"
  ) => {
    switch (status) {
      case "clean":
        return (
          <Badge className="bg-green-600 hover:bg-green-700 text-white border-none flex items-center gap-1">
            <CheckCircle size={14} />
            <span className="text-xs">Clean History</span>
          </Badge>
        );
      case "accidented":
        return (
          <Badge className="bg-red-600 hover:bg-red-700 text-white border-none flex items-center gap-1">
            <AlertTriangle size={14} />
            <span className="text-xs">Accident History</span>
          </Badge>
        );
      case "withIssues":
        return (
          <Badge className="bg-amber-600 hover:bg-amber-700 text-white border-none flex items-center gap-1">
            <AlertTriangle size={14} />
            <span className="text-xs">Minor Issues</span>
          </Badge>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <section className="relative h-[500px]">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1567789884554-0b844b597180?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBtYW51ZmFjdHVyaW5nfGVufDF8fHx8MTc2MTY5ODYxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Car importation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
        </div>

        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl">
              <h1 className="text-white mb-6 text-[64px] font-bold font-[Roboto] tracking-tight leading-tight">
                Global Vehicle Importation
              </h1>
              <p className="text-white/90 mb-8 leading-relaxed text-[24px] text-left italic">
                Access the world's finest vehicles. We handle every aspect of
                international car importation with expertise and precision.
              </p>
              <Button
                onClick={() => setIsImportFormOpen(true)}
                className="bg-white text-black hover:bg-gray-200 font-medium"
                size="lg"
              >
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
            <h2 className="mb-4 text-[20px] font-bold">
              Why Import With Platinum Helms
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Experience seamless international vehicle acquisition with our
              comprehensive importation services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card
                  key={index}
                  className="p-6 border-none shadow-sm hover:shadow-md transition-shadow text-center"
                >
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
            <h2 className="mb-4 text-[20px] font-bold">Our Import Process</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              A transparent, efficient process from selection to delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {importProcess.map((item, index) => (
              <Card
                key={index}
                className="p-8 border-none shadow-sm hover:shadow-md transition-shadow"
              >
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
            {/* Left Side - Image */}
            <div className="relative h-[500px] lg:h-[600px] rounded-lg overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1759831766683-b0d6a0c41dc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjdXN0b20lMjBjYXIlMjBkZXNpZ258ZW58MXx8fHwxNzY2MTgwOTU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Custom vehicle importation"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <Badge className="bg-red-600 hover:bg-red-700 text-white border-none px-4 py-2 mb-4">
                  <Sparkles size={16} className="mr-2" />
                  Bespoke Service
                </Badge>
              </div>
            </div>

            {/* Right Side - Content */}
            <div>
              <div className="mb-6">
                <Badge className="bg-black text-white hover:bg-gray-800 border-none px-3 py-1 mb-4">
                  CUSTOM ORDERS
                </Badge>
                <h2 className="mb-6 text-[40px] font-bold font-[Roboto] tracking-tight leading-tight">
                  Can't Find What You're Looking For?
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  Our custom importation service allows you to specify exactly
                  what you want. From rare collector's items to specific
                  configurations unavailable in local markets, we'll source and
                  import your perfect vehicle.
                </p>
              </div>

              {/* Key Features */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <CarFront className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="mb-2">Personalized Vehicle Sourcing</h3>
                    <p className="text-gray-600">
                      Tell us your dream specifications and we'll find it
                      anywhere in the world
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Star className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="mb-2">Exclusive Access</h3>
                    <p className="text-gray-600">
                      Access to private sales, dealer networks, and exclusive
                      markets worldwide
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="mb-2">Pre-Import Inspection</h3>
                    <p className="text-gray-600">
                      Comprehensive third-party inspection before purchase to
                      ensure quality
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => setIsImportFormOpen(true)}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium"
                  size="lg"
                >
                  Request Custom Import
                  <ArrowRight className="ml-2" size={18} />
                </Button>
                <Button
                  onClick={() => onNavigate("contact")}
                  variant="outline"
                  className="text-black border-gray-300 hover:bg-gray-100 font-medium"
                  size="lg"
                >
                  Speak to a Specialist
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-10 pt-10 border-t border-gray-200">
                <div>
                  <div className="text-3xl mb-2">500+</div>
                  <p className="text-sm text-gray-600">
                    Custom Imports Completed
                  </p>
                </div>
                <div>
                  <div className="text-3xl mb-2">40+</div>
                  <p className="text-sm text-gray-600">Countries Sourced</p>
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

      {/* Auction Vehicles Section */}
      <section className="py-24 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-red-600 hover:bg-red-700 text-white border-none px-3 py-1 mb-4">
              <Hammer size={16} className="mr-2" />
              LIVE AUCTIONS
            </Badge>
            <h2 className="text-white mb-4 text-[40px] tracking-tight leading-tight">
              Premium Vehicle Auctions
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Bid on exclusive luxury vehicles with full transparency on
              condition and history.
            </p>
          </div>

          {/* Auction Filters */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Filter size={20} className="text-white" />
              <span className="text-sm tracking-wider text-white">
                AUCTION FILTERS:
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Vehicle Status Filter */}
              <Select
                value={auctionVehicleStatus}
                onValueChange={setAuctionVehicleStatus}
              >
                <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Vehicle Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Conditions</SelectItem>
                  <SelectItem value="clean">Clean History</SelectItem>
                  <SelectItem value="withIssues">Minor Issues</SelectItem>
                  <SelectItem value="accidented">Accident History</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort By */}
              <Select value={auctionSortBy} onValueChange={setAuctionSortBy}>
                <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ending">Ending Soon</SelectItem>
                  <SelectItem value="bidLow">Lowest Bid</SelectItem>
                  <SelectItem value="bidHigh">Highest Bid</SelectItem>
                  <SelectItem value="mostBids">Most Bids</SelectItem>
                </SelectContent>
              </Select>

              {/* Search */}
              <div className="lg:col-span-2">
                <Input
                  placeholder="Search auction vehicles..."
                  className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  value={auctionSearchQuery}
                  onChange={(e) => setAuctionSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Bid Range Slider */}
            <div className="mb-4">
              <label className="block text-sm text-white mb-3">
                Current Bid Range: {formatCurrency(auctionBidRange[0])} -{" "}
                {formatCurrency(auctionBidRange[1])}
              </label>
              <Slider
                min={0}
                max={7000000000}
                step={5000}
                value={auctionBidRange}
                onValueChange={setAuctionBidRange}
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-white/80">
                {sortedAuctionVehicles.length} vehicle
                {sortedAuctionVehicles.length !== 1 ? "s" : ""} in auction
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAuctionFilters}
                className="text-white border-white/30 hover:bg-white/10 font-medium"
              >
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Auction Vehicle Grid */}
          {sortedAuctionVehicles.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-white/70 text-lg mb-4">
                No auction vehicles match your criteria.
              </p>
              <Button
                onClick={clearAuctionFilters}
                variant="outline"
                className="text-white border-white/30 hover:bg-white/10 font-medium"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedAuctionVehicles.map((vehicle) => (
                <Card
                  key={vehicle.id}
                  className="group overflow-hidden border-none shadow-lg bg-white"
                >
                  <div className="relative h-64 overflow-hidden">
                    <ImageWithFallback
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-red-600 hover:bg-red-700 text-white border-none flex items-center gap-1">
                        <Hammer size={14} />
                        <span className="text-xs">Live Auction</span>
                      </Badge>
                    </div>

                    {/* Country Badge */}
                    <div className="absolute top-4 left-4">
                      <div className="bg-black/80 px-3 py-1 rounded-full flex items-center gap-2">
                        <span className="text-lg">
                          {getCountryFlag(vehicle.country)}
                        </span>
                        <span className="text-white text-sm">
                          {vehicle.country}
                        </span>
                      </div>
                    </div>

                    {/* Vehicle Status Badge */}
                    <div className="absolute bottom-4 left-4">
                      {getVehicleStatusBadge(vehicle.vehicleStatus)}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-4">
                      <p className="text-sm text-gray-500">{vehicle.brand}</p>
                      <h3 className="mb-1">{vehicle.name}</h3>
                      <p className="text-sm text-gray-600">
                        {vehicle.year} Â· {vehicle.mileage.toLocaleString()} km
                      </p>
                    </div>

                    {/* Issue Description */}
                    {vehicle.issueDescription && (
                      <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded">
                        <p className="text-xs text-amber-800">
                          <AlertTriangle size={12} className="inline mr-1" />
                          {vehicle.issueDescription}
                        </p>
                      </div>
                    )}

                    {/* Countdown Timer */}
                    <div className="mb-4 p-4 bg-gray-50 rounded">
                      <p className="text-xs text-gray-500 mb-2">
                        Auction Ends In:
                      </p>
                      <AuctionCountdown endTime={vehicle.auctionEndTime} />
                    </div>

                    {/* Bid Information */}
                    <div className="mb-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Current Bid:
                        </span>
                        <span className="text-lg text-gray-900">
                          {formatCurrency(vehicle.currentBid)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          Starting Bid:
                        </span>
                        <span className="text-xs text-gray-600">
                          {formatCurrency(vehicle.startingBid)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          Total Bids:
                        </span>
                        <span className="text-xs text-gray-900">
                          {vehicle.bidCount} bids
                        </span>
                      </div>
                      {vehicle.reserveMet ? (
                        <div className="flex items-center gap-1 text-green-600 text-xs">
                          <CheckCircle size={12} />
                          <span>Reserve Met</span>
                        </div>
                      ) : (
                        <div className="text-xs text-amber-600">
                          Reserve: {formatCurrency(vehicle.reservePrice)}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 mb-6">
                      {vehicle.features.slice(0, 2).map((feature, index) => (
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
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium"
                        onClick={() => alert("Bidding system coming soon!")}
                      >
                        Place Bid
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 text-black border-gray-300 hover:bg-gray-100 font-medium"
                        onClick={() => {
                          setSelectedVehicle({
                            ...vehicle,
                            price: vehicle.currentBid,
                          });
                          setIsDialogOpen(true);
                        }}
                      >
                        Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Auction Info */}
          <div className="mt-12 p-8 bg-white/5 border border-white/10 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-white mb-2">How Auctions Work</h3>
                <p className="text-white/70 text-sm">
                  Place bids on premium vehicles with full transparency. All
                  vehicles come with detailed history reports.
                </p>
              </div>
              <div>
                <h3 className="text-white mb-2">Buyer Protection</h3>
                <p className="text-white/70 text-sm">
                  Every auction includes a comprehensive inspection report and
                  money-back guarantee if description doesn't match.
                </p>
              </div>
              <div>
                <h3 className="text-white mb-2">Import Included</h3>
                <p className="text-white/70 text-sm">
                  Winning bids include full importation services, customs
                  clearance, and delivery to your location.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Import Vehicles */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-[20px] font-bold">
              Available Import Vehicles
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Browse our curated selection of premium vehicles ready for import
              from around the world.
            </p>
          </div>

          {/* Filters Section */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Filter size={20} className="text-gray-600" />
              <span className="text-sm tracking-wider text-gray-900">
                FILTER BY:
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Country Filter */}
              <Select
                value={selectedCountry}
                onValueChange={setSelectedCountry}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Country of Origin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  <SelectItem value="Germany">ðŸ‡©ðŸ‡ª Germany</SelectItem>
                  <SelectItem value="Japan">ðŸ‡¯ðŸ‡µ Japan</SelectItem>
                  <SelectItem value="United Kingdom">
                    ðŸ‡¬ðŸ‡§ United Kingdom
                  </SelectItem>
                  <SelectItem value="Italy">ðŸ‡®ðŸ‡¹ Italy</SelectItem>
                  <SelectItem value="UAE">ðŸ‡¦ðŸ‡ª UAE</SelectItem>
                  <SelectItem value="USA">ðŸ‡ºðŸ‡¸ USA</SelectItem>
                </SelectContent>
              </Select>

              {/* Brand Filter */}
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Brand / Make" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  <SelectItem value="Mercedes-Benz">Mercedes-Benz</SelectItem>
                  <SelectItem value="BMW">BMW</SelectItem>
                  <SelectItem value="Audi">Audi</SelectItem>
                  <SelectItem value="Porsche">Porsche</SelectItem>
                  <SelectItem value="Ferrari">Ferrari</SelectItem>
                  <SelectItem value="Lamborghini">Lamborghini</SelectItem>
                  <SelectItem value="Bentley">Bentley</SelectItem>
                  <SelectItem value="Land Rover">Land Rover</SelectItem>
                  <SelectItem value="Toyota">Toyota</SelectItem>
                  <SelectItem value="Lexus">Lexus</SelectItem>
                  <SelectItem value="Nissan">Nissan</SelectItem>
                </SelectContent>
              </Select>

              {/* Category Filter */}
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="sedan">Sedan</SelectItem>
                  <SelectItem value="suv">SUV</SelectItem>
                  <SelectItem value="sports">Sports Car</SelectItem>
                </SelectContent>
              </Select>

              {/* Year Filter */}
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="1999">1999 (Classic)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Condition Filter */}
              <Select
                value={selectedCondition}
                onValueChange={setSelectedCondition}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Conditions</SelectItem>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Foreign Used">Foreign Used</SelectItem>
                  <SelectItem value="Nigerian Used">Nigerian Used</SelectItem>
                </SelectContent>
              </Select>

              {/* Model Filter */}
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Model" />
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

              {/* Transmission Filter */}
              <Select
                value={selectedTransmission}
                onValueChange={setSelectedTransmission}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Transmission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Automatic">Automatic</SelectItem>
                  <SelectItem value="Manual">Manual</SelectItem>
                </SelectContent>
              </Select>

              {/* Fuel Type Filter */}
              <Select
                value={selectedFuelType}
                onValueChange={setSelectedFuelType}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Fuel Type" />
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

            {/* Price Range Slider */}
            <div className="mt-4">
              <label className="block text-sm text-gray-700 mb-3">
                Price Range: {formatCurrency(priceRange[0])} -{" "}
                {formatCurrency(priceRange[1])}
              </label>
              <Slider
                min={0}
                max={600000}
                step={10000}
                value={priceRange}
                onValueChange={setPriceRange}
                className="w-full"
              />
            </div>

            {/* Search Input */}
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
                {sortedVehicles.length} vehicle
                {sortedVehicles.length !== 1 ? "s" : ""} available for import
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
              <p className="text-gray-500 text-lg mb-4">
                No vehicles match your search criteria.
              </p>
              <Button
                onClick={clearAllFilters}
                variant="outline"
                className="text-black border-gray-300 hover:bg-gray-100 font-medium"
              >
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedVehicles.map((vehicle) => (
                <Card
                  key={vehicle.id}
                  className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="relative h-64 overflow-hidden">
                    <ImageWithFallback
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                      <Heart size={20} className="text-black" />
                    </button>

                    {/* Country and Year Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <div className="bg-black/80 px-3 py-1 rounded-full flex items-center gap-2">
                        <span className="text-lg">
                          {getCountryFlag(vehicle.country)}
                        </span>
                        <span className="text-white text-sm">
                          {vehicle.country}
                        </span>
                      </div>
                      <div className="bg-black/80 px-3 py-1 rounded-full">
                        <span className="text-white text-sm">
                          {vehicle.year}
                        </span>
                      </div>
                      {vehicle.condition === "new" && (
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
                    <div className="mb-2">
                      <p className="text-sm text-gray-500">{vehicle.brand}</p>
                      <h3>{vehicle.name}</h3>
                    </div>
                    <p className="text-gray-900 mb-4">
                      {formatCurrency(vehicle.price)}
                    </p>

                    <div className="space-y-2 mb-6">
                      {vehicle.features.map((feature, index) => (
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
            <h2 className="mb-4 text-[20px] font-bold">
              Popular Import Markets
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We specialize in importing from the world's premier automotive
              markets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="overflow-hidden border-none shadow-lg shadow-red-600/20 hover:shadow-xl hover:shadow-red-600/30 transition-all">
              <div className="h-48 bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center">
                <div className="text-center text-white">
                  <Globe size={48} className="mx-auto mb-4" />
                  <h3 className="text-white">Europe</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  German engineering, Italian design, British luxury - access
                  Europe's finest manufacturers.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle2 size={16} className="mr-2 text-red-600" />
                    Germany
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 size={16} className="mr-2 text-red-600" />
                    United Kingdom
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 size={16} className="mr-2 text-red-600" />
                    Italy
                  </li>
                </ul>
              </div>
            </Card>

            <Card className="overflow-hidden border-none shadow-lg shadow-red-600/20 hover:shadow-xl hover:shadow-red-600/30 transition-all">
              <div className="h-48 bg-gradient-to-br from-red-900 to-red-700 flex items-center justify-center">
                <div className="text-center text-white">
                  <Globe size={48} className="mx-auto mb-4" />
                  <h3 className="text-white">Japan</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  JDM legends and cutting-edge technology from Japan's
                  automotive excellence.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle2 size={16} className="mr-2 text-red-600" />
                    Tokyo
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 size={16} className="mr-2 text-red-600" />
                    Osaka
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 size={16} className="mr-2 text-red-600" />
                    Yokohama
                  </li>
                </ul>
              </div>
            </Card>

            <Card className="overflow-hidden border-none shadow-lg shadow-red-600/20 hover:shadow-xl hover:shadow-red-600/30 transition-all">
              <div className="h-48 bg-gradient-to-br from-amber-900 to-amber-700 flex items-center justify-center">
                <div className="text-center text-white">
                  <Globe size={48} className="mx-auto mb-4" />
                  <h3 className="text-white">Middle East</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Rare configurations and exclusive models from the luxury
                  markets of Dubai and beyond.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle2 size={16} className="mr-2 text-red-600" />
                    Dubai
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 size={16} className="mr-2 text-red-600" />
                    Abu Dhabi
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 size={16} className="mr-2 text-red-600" />
                    Riyadh
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mb-4 text-[20px] font-bold">
            Request an Import Quote
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Tell us about the vehicle you'd like to import, and we'll provide a
            detailed quote with delivery timelines and costs.
          </p>
          <Button
            onClick={() => setIsImportFormOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-12"
            size="lg"
          >
            Start Import Request
          </Button>
          <p className="text-sm text-gray-500 mt-6">
            Our importation specialist will contact you within 24 hours
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-white mb-6 text-[20px] font-bold">
            Questions About Importing?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Our import specialists are available to discuss your specific needs
            and answer any questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setIsImportFormOpen(true)}
              className="bg-white text-black hover:bg-gray-200 font-medium"
              size="lg"
            >
              Schedule Consultation
            </Button>
            <Button
              onClick={() => onNavigate("financing")}
              variant="outline"
              className="bg-white text-black border-2 border-white font-medium"
              size="lg"
            >
              View Financing Options
            </Button>
          </div>
        </div>
      </section>

      {/* Importation Request Form */}
      <ImportationRequestForm
        isOpen={isImportFormOpen}
        onClose={() => setIsImportFormOpen(false)}
      />

      {/* Vehicle Details Dialog */}
      <VehicleDetailsDialog
        vehicle={selectedVehicle}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onNavigate={onNavigate}
      />
    </div>
  );
}
