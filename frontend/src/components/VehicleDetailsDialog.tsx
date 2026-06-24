import { useState } from "react";
import { formatCurrency } from "@/lib/adminUtils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/dialog";
import { Button } from "../components/button";
import { Badge } from "../components/badge";
import { Separator } from "../components/separator";
import { ImageWithFallback } from "../components/ImageWithFallback";
import {
  Calendar,
  Gauge,
  Fuel,
  Settings,
  Award,
  CreditCard,
  Calculator,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  X,
  MessageCircle,
  Phone,
  CheckCircle2,
} from "lucide-react";

interface Vehicle {
  id: number;
  name: string;
  brand: string;
  category: string;
  year: number;
  condition: string;
  price: number;
  image: string;
  images?: Array<{ url: string }>;
  features: string[];
  tags?: string[];
  country?: string;
}

interface VehicleDetailsDialogProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

const WA_NUMBER = "2348123456789";

export function VehicleDetailsDialog({ vehicle, isOpen, onClose, onNavigate }: VehicleDetailsDialogProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);

  if (!vehicle) return null;

  const vehicleImages =
    vehicle.images && vehicle.images.length > 0
      ? vehicle.images.map((img) => img.url)
      : [vehicle.image];

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % vehicleImages.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + vehicleImages.length) % vehicleImages.length);

  const vehicleLabel = `${vehicle.year} ${vehicle.brand} ${vehicle.name}`;

  const whatsappPurchase = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    `Hello Platinum Helms! I'd like to purchase the ${vehicleLabel} priced at ${formatCurrency(vehicle.price)}. Please guide me on the next steps.`
  )}`;

  const whatsappEnquiry = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    `Hello! I'm interested in the ${vehicleLabel}. Could you provide more details?`
  )}`;

  const whatsappTestDrive = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    `Hi! I'd like to schedule a test drive for the ${vehicleLabel}. When is the earliest available?`
  )}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: vehicleLabel, text: `Check out this ${vehicleLabel} at Platinum Helms Autos!` });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const specs = [
    { icon: Gauge, label: "Engine", value: "Twin-Turbo V8" },
    { icon: Settings, label: "Transmission", value: "9-Speed Auto" },
    { icon: Fuel, label: "Fuel Type", value: "Premium Gasoline" },
    { icon: Calendar, label: "Mileage", value: vehicle.condition === "new" ? "0 km" : "12,450 km" },
  ];

  const estMonthly = Math.round(vehicle.price * 0.02);
  const estDownPayment = Math.round(vehicle.price * 0.2);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[96vw] max-w-5xl overflow-hidden rounded-2xl border-border p-0 max-h-[92vh] [&>button.absolute]:hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>{vehicleLabel}</DialogTitle>
          <DialogDescription>
            {vehicle.year} {vehicle.brand} {vehicle.name} — {formatCurrency(vehicle.price)}
          </DialogDescription>
        </DialogHeader>

        <div className="flex h-full flex-col lg:flex-row" style={{ maxHeight: "92vh" }}>

          {/* ── LEFT: Image panel ── */}
          <div className="relative shrink-0 lg:w-[46%] h-64 sm:h-80 lg:h-auto lg:self-stretch">
            {/* Images */}
            {vehicleImages.map((src, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-opacity duration-500 ${i === currentImageIndex ? "opacity-100" : "opacity-0"}`}
              >
                <ImageWithFallback
                  src={src}
                  alt={`${vehicle.name} — view ${i + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30 pointer-events-none" />

            {/* Top row: badges + controls */}
            <div className="absolute top-4 left-4 right-4 z-10 flex items-start justify-between">
              <div className="flex flex-col gap-1.5">
                <Badge className="w-fit border-none bg-black/70 text-white backdrop-blur-sm">{vehicle.year}</Badge>
                {vehicle.condition === "new" && (
                  <Badge className="w-fit border-none bg-brand text-white">Brand New</Badge>
                )}
                {vehicle.country && (
                  <Badge className="w-fit border-none bg-white/90 text-foreground">{vehicle.country}</Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLiked((v) => !v)}
                  className={`flex size-9 items-center justify-center rounded-full backdrop-blur-sm transition-colors ${liked ? "bg-brand text-white" : "bg-black/50 text-white hover:bg-black/70"}`}
                  aria-label="Wishlist"
                >
                  <Heart size={16} fill={liked ? "currentColor" : "none"} />
                </button>
                <button
                  onClick={handleShare}
                  className="flex size-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                  aria-label="Share"
                >
                  <Share2 size={16} />
                </button>
                <button
                  onClick={onClose}
                  className="flex size-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Prev/Next arrows */}
            {vehicleImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}

            {/* Bottom: vehicle title + dot indicators */}
            <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
              {vehicleImages.length > 1 && (
                <div className="mb-3 flex gap-1.5">
                  {vehicleImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImageIndex(i)}
                      className={`h-1 rounded-full transition-all ${i === currentImageIndex ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60"}`}
                    />
                  ))}
                </div>
              )}
              <p className="text-xs font-medium uppercase tracking-widest text-white/60">{vehicle.brand}</p>
              <h2 className="font-display text-xl font-bold leading-tight text-white sm:text-2xl">{vehicle.name}</h2>
              <p className="mt-1 font-display text-lg font-semibold text-brand">{formatCurrency(vehicle.price)}</p>
            </div>

            {/* Thumbnail strip */}
            {vehicleImages.length > 1 && (
              <div className="absolute bottom-0 right-0 hidden flex-col gap-1.5 p-3 lg:flex">
                {vehicleImages.slice(0, 4).map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={`size-12 overflow-hidden rounded-lg border-2 transition-all ${i === currentImageIndex ? "border-brand" : "border-white/30 opacity-60 hover:opacity-100"}`}
                  >
                    <ImageWithFallback src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Details panel ── */}
          <div className="flex min-h-0 flex-1 flex-col">

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 lg:px-7">

              {/* Mobile-only title (hidden on lg since image panel shows it) */}
              <div className="mb-5 lg:hidden">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{vehicle.brand}</p>
                <h2 className="font-display text-2xl font-bold text-foreground">{vehicle.name}</h2>
                <p className="mt-1 font-display text-2xl font-semibold text-brand">{formatCurrency(vehicle.price)}</p>
              </div>

              {/* Desktop-only title */}
              <div className="mb-5 hidden lg:block">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{vehicle.brand}</p>
                <h2 className="font-display text-2xl font-bold leading-tight text-foreground">{vehicle.name}</h2>
                <p className="mt-1.5 font-display text-3xl font-bold text-brand">{formatCurrency(vehicle.price)}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground capitalize">{vehicle.category}</span>
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground capitalize">{vehicle.condition}</span>
                  {vehicle.tags?.map((t) => (
                    <span key={t} className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand capitalize">{t}</span>
                  ))}
                </div>
              </div>

              {/* Specs */}
              <div className="mb-6 grid grid-cols-2 gap-2.5">
                {specs.map((s) => (
                  <div key={s.label} className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3">
                    <s.icon size={18} className="shrink-0 text-brand" />
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{s.label}</p>
                      <p className="text-sm font-semibold text-foreground">{s.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Key Features */}
              {vehicle.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-3 flex items-center gap-2 font-display text-base font-semibold text-foreground">
                    <Award size={16} className="text-brand" /> Key Features
                  </h3>
                  <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                    {vehicle.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-brand" />
                        <span className="text-sm text-foreground">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator className="my-5" />

              {/* Financing mini-card */}
              <div className="mb-2 rounded-2xl bg-gradient-to-br from-obsidian to-slate-deep p-5 text-white">
                <h3 className="mb-1 flex items-center gap-2 font-display text-sm font-semibold">
                  <CreditCard size={15} className="text-brand" /> Financing Available
                </h3>
                <p className="mb-4 text-xs text-white/60">From 3.9% APR — pre-approved in minutes</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white/8 p-3">
                    <p className="mb-0.5 text-[10px] text-white/50">Est. Monthly</p>
                    <p className="font-display text-base font-bold text-brand">{formatCurrency(estMonthly)}/mo</p>
                    <p className="text-[10px] text-white/40">60 months @ 4.9% APR</p>
                  </div>
                  <div className="rounded-xl bg-white/8 p-3">
                    <p className="mb-0.5 text-[10px] text-white/50">Down Payment</p>
                    <p className="font-display text-base font-bold text-brand">{formatCurrency(estDownPayment)}</p>
                    <p className="text-[10px] text-white/40">20% recommended</p>
                  </div>
                </div>
                <button
                  onClick={() => { onNavigate("financing"); onClose(); }}
                  className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/15 py-2 text-xs font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <Calculator size={13} /> Calculate my payments
                </button>
              </div>

              <p className="mt-3 text-center text-[10px] text-muted-foreground/60">
                *Estimates for illustration only. Subject to credit approval.
              </p>
            </div>

            {/* ── Sticky CTA footer ── */}
            <div className="shrink-0 border-t border-border bg-white px-6 py-4 lg:px-7">
              {/* Primary: Purchase via WhatsApp */}
              <a href={whatsappPurchase} target="_blank" rel="noopener noreferrer" className="block">
                <Button
                  size="lg"
                  className="w-full gap-2 bg-[#25D366] text-white shadow-md shadow-[#25D366]/20 hover:bg-[#1dbb58]"
                >
                  <svg viewBox="0 0 24 24" className="size-5 fill-current">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Purchase via WhatsApp
                </Button>
              </a>

              {/* Secondary actions */}
              <div className="mt-2.5 grid grid-cols-2 gap-2">
                <a href={whatsappEnquiry} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
                    <MessageCircle size={14} /> Enquire
                  </Button>
                </a>
                <a href={whatsappTestDrive} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
                    <Phone size={14} /> Test Drive
                  </Button>
                </a>
              </div>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
