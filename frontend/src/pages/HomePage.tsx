import { ImageWithFallback } from "../components/ImageWithFallback";
import api from "@/lib/api";
import { CarRecord, formatCurrency, normalizeCar } from "@/lib/adminUtils";
import { useAsync } from "@/hooks/useAsync";
import { Reveal } from "../components/motion/Reveal";
import { Skeleton } from "../components/skeleton";
import {
  ArrowRight,
  Zap,
  Shield,
  Award,
  TrendingUp,
  Tag,
  Heart,
  Users,
  Star,
  Leaf,
  Sparkles,
  Clock,
  CheckCircle,
  Quote,
  Hammer,
} from "lucide-react";
import { Button } from "../components/button";
import { Card } from "../components/card";
import { Badge } from "../components/badge";
import phblack from "../assets/phblack.png";
import phred from "../assets/phred.png";
import phwhite from "../assets/phwhite.png";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

type FeaturedVehicle = Pick<
  CarRecord,
  "id" | "name" | "brand" | "category" | "year" | "condition" | "price" | "image" | "features" | "tags" | "transmission" | "fuelType" | "mileage"
>;

const fallbackFeaturedVehicles: FeaturedVehicle[] = [
  {
    id: 1,
    name: "LUX S-Class",
    brand: "Mercedes-Benz",
    category: "Luxury Sedan",
    year: 2025,
    condition: "New",
    price: 95000000,
    transmission: "Automatic",
    fuelType: "Petrol",
    mileage: 0,
    image:
      "https://images.unsplash.com/photo-1666067313311-de0a3760d884?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    features: ["Adaptive Cruise Control", "Premium Sound System", "Leather Interior"],
    tags: ["popular", "searched"],
  },
  {
    id: 2,
    name: "LUX GLE",
    brand: "Mercedes-Benz",
    category: "Luxury SUV",
    year: 2025,
    condition: "New",
    price: 78000000,
    transmission: "Automatic",
    fuelType: "Petrol",
    mileage: 0,
    image:
      "https://images.unsplash.com/photo-1700884520248-92092bd21e63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    features: ["All-Wheel Drive", "Panoramic Sunroof", "Third Row Seating"],
    tags: ["popular", "hotDeal"],
  },
  {
    id: 3,
    name: "LUX AMG GT",
    brand: "Mercedes-Benz",
    category: "Sports Car",
    year: 2025,
    condition: "New",
    price: 125000000,
    transmission: "Automatic",
    fuelType: "Petrol",
    mileage: 0,
    image:
      "https://images.unsplash.com/photo-1541348263662-e068662d82af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    features: ["Twin-Turbo V8", "Carbon Fiber Interior", "Sport Exhaust"],
    tags: ["searched"],
  },
];

const tagMeta: Record<string, { label: string; icon: typeof Tag }> = {
  hotDeal: { label: "Hot Deal", icon: Tag },
  popular: { label: "Popular", icon: TrendingUp },
  searched: { label: "Most Searched", icon: Heart },
};

const stats = [
  { value: "5,000+", label: "Happy Owners" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "500+", label: "Premium Models" },
];

const trustItems = [
  { Icon: CheckCircle, title: "Certified Quality", sub: "Every Vehicle Inspected" },
  { Icon: Shield, title: "Warranty Included", sub: "Comprehensive Coverage" },
  { Icon: Clock, title: "24/7 Support", sub: "Always Here for You" },
  { Icon: Star, title: "5-Star Rated", sub: "Customer Favorite" },
];

const features = [
  { Icon: Zap, title: "Cutting-Edge Performance", body: "Advanced engineering that delivers exceptional power, precision, and efficiency in every journey." },
  { Icon: Shield, title: "Ultimate Safety", body: "State-of-the-art safety systems and smart technology protect you and your loved ones on every drive." },
  { Icon: Award, title: "Premium Quality", body: "Meticulous craftsmanship, luxury materials, and attention to detail define every vehicle we curate." },
];

const testimonials = [
  { initials: "SJ", name: "Sarah Johnson", role: "Mercedes-Benz S-Class Owner", quote: "The entire experience was seamless — from browsing to financing to driving away in my dream car. Absolutely exceptional service." },
  { initials: "MC", name: "Michael Chen", role: "BMW X7 Owner", quote: "I've purchased luxury vehicles before, but Platinum Helms sets a new standard. The attention to detail and care is unmatched." },
  { initials: "EP", name: "Emily Parker", role: "Audi Q5 Owner", quote: "As a first-time luxury buyer, I was nervous. The team walked me through everything with patience and expertise." },
];

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand">
    {children}
  </span>
);

export function HomePage({ onNavigate }: HomePageProps) {
  const { data, isLoading } = useAsync<FeaturedVehicle[]>(async () => {
    const response = await api.cars.getAll({ limit: 6, sortBy: "popular" });
    const cars = (response.data || []).map(normalizeCar);
    const popular = cars.filter((car: CarRecord) => car.tags.includes("popular")).slice(0, 3);
    return popular.length > 0 ? popular : fallbackFeaturedVehicles;
  }, []);

  const featuredVehicles = data ?? fallbackFeaturedVehicles;

  return (
    <div className="bg-background">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative flex min-h-screen items-center overflow-hidden bg-obsidian">
        <div className="absolute inset-0">
          <ImageWithFallback src={phblack} alt="Luxury vehicle on display" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/75 to-obsidian/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 via-transparent to-transparent" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-4 pt-28 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Reveal>
              <Eyebrow>
                <Sparkles size={14} /> Welcome to the Future of Luxury
              </Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Find Your <span className="text-brand">Dream Car</span> Today
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">
                Your journey to automotive excellence starts here — the perfect fusion of luxury,
                innovation, and performance.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-10 grid max-w-lg grid-cols-3 gap-6">
                {stats.map((s) => (
                  <div key={s.label}>
                    <div className="font-display text-3xl font-semibold text-white sm:text-4xl">{s.value}</div>
                    <div className="mt-1 text-xs text-white/60 sm:text-sm">{s.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button
                  onClick={() => onNavigate("purchase")}
                  size="lg"
                  className="h-12 gap-2 bg-brand px-8 text-base shadow-luxe hover:bg-brand-strong"
                >
                  Explore Collection <ArrowRight size={18} />
                </Button>
                <Button
                  onClick={() => onNavigate("financing")}
                  size="lg"
                  variant="outline"
                  className="h-12 border-white/30 bg-white/5 px-8 text-base text-white backdrop-blur hover:bg-white/15 hover:text-white"
                >
                  Get Pre-Approved
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Trust strip ──────────────────────────────────── */}
      <section className="border-y border-white/[0.07] bg-obsidian-soft py-10 text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/[0.07] px-4 sm:px-6 md:grid-cols-4 lg:px-8">
          {trustItems.map(({ Icon, title, sub }) => (
            <div key={title} className="flex flex-col items-center gap-2 px-4 py-2 text-center first:pl-0 last:pr-0">
              <div className="flex size-11 items-center justify-center rounded-xl bg-brand/10">
                <Icon className="text-brand" size={22} />
              </div>
              <div className="font-display text-sm font-semibold tracking-wide">{title}</div>
              <div className="text-xs text-white/45">{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why choose ───────────────────────────────────── */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto mb-16 max-w-3xl text-center">
            <Eyebrow>The Platinum Helms Difference</Eyebrow>
            <h2 className="font-display text-4xl font-bold text-foreground sm:text-5xl">Why Choose Platinum Helms</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We're not just selling cars — we're crafting experiences and making automotive dreams come
              true, one exceptional vehicle at a time.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {features.map(({ Icon, title, body }, i) => (
              <Reveal key={title} delay={i * 0.08}>
                <Card className="group h-full rounded-2xl border-border bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-luxe">
                  <div className="mb-6 flex size-14 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-strong text-white">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-foreground">{title}</h3>
                  <p className="mt-3 text-muted-foreground">{body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Technology split ─────────────────────────────── */}
      <section className="bg-obsidian py-24 text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <Eyebrow>Innovation First</Eyebrow>
            <h2 className="font-display text-4xl font-bold sm:text-5xl">The Future is Now</h2>
            <p className="mt-6 text-lg leading-relaxed text-white/70">
              Step into tomorrow with technology that transforms every drive into an intelligent,
              connected experience — from AI-powered assistance to seamless smartphone integration.
            </p>
            <div className="mt-8 space-y-5">
              {[
                { Icon: Sparkles, title: "AI-Powered Assistance", body: "Systems that learn and adapt to your driving style." },
                { Icon: Zap, title: "Electric & Hybrid Options", body: "Sustainable performance without compromising luxury." },
                { Icon: Shield, title: "Advanced Safety Suite", body: "360° protection with predictive collision avoidance." },
              ].map(({ Icon, title, body }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand">
                    <Icon size={22} />
                  </div>
                  <div>
                    <h4 className="font-sans text-base font-semibold">{title}</h4>
                    <p className="text-sm text-white/60">{body}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={() => onNavigate("purchase")} size="lg" className="mt-8 gap-2 bg-brand hover:bg-brand-strong">
              Explore Technology <ArrowRight size={18} />
            </Button>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative h-[460px] overflow-hidden rounded-3xl shadow-2xl">
              <ImageWithFallback src={phwhite} alt="Advanced vehicle technology" className="h-full w-full object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Featured collection ──────────────────────────── */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto mb-16 max-w-3xl text-center">
            <Eyebrow>Handpicked Excellence</Eyebrow>
            <h2 className="font-display text-4xl font-bold text-foreground sm:text-5xl">Featured Collection</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our most sought-after models, each selected to deliver an extraordinary driving experience.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden rounded-2xl border-border">
                    <Skeleton className="h-64 w-full rounded-none" />
                    <div className="space-y-3 p-6">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-6 w-40" />
                      <Skeleton className="h-7 w-32" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </Card>
                ))
              : featuredVehicles.map((vehicle, i) => (
                  <Reveal key={vehicle.id} delay={i * 0.08}>
                    <Card
                      onClick={() => onNavigate("purchase")}
                      className="group h-full cursor-pointer overflow-hidden rounded-2xl border-border bg-card transition-all hover:-translate-y-1 hover:shadow-luxe"
                    >
                      <div className="relative h-64 overflow-hidden">
                        <ImageWithFallback
                          src={vehicle.image}
                          alt={vehicle.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute left-4 top-4 flex flex-col gap-2">
                          <span className="rounded-full bg-obsidian/80 px-3 py-1 text-sm text-white backdrop-blur">{vehicle.year}</span>
                          {vehicle.condition === "New" && (
                            <span className="rounded-full bg-brand px-3 py-1 text-sm text-white">New</span>
                          )}
                        </div>
                        {vehicle.tags.length > 0 && (
                          <div className="absolute inset-x-4 bottom-4 flex flex-wrap gap-2">
                            {vehicle.tags.map((tag) => {
                              const meta = tagMeta[tag];
                              if (!meta) return null;
                              const Icon = meta.icon;
                              return (
                                <Badge key={tag} className="gap-1 border-none bg-brand text-white">
                                  <Icon size={12} /> {meta.label}
                                </Badge>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground">{vehicle.brand}</p>
                        <h3 className="mt-1 font-display text-2xl font-semibold text-foreground">{vehicle.name}</h3>
                        <p className="mt-1 text-2xl font-semibold text-brand">{formatCurrency(vehicle.price)}</p>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                          <span>{vehicle.transmission}</span><span>·</span>
                          <span>{vehicle.fuelType}</span><span>·</span>
                          <span>{vehicle.mileage > 0 ? `${vehicle.mileage.toLocaleString()} km` : "Brand New"}</span>
                        </div>
                        <div className="mt-4 space-y-1">
                          {vehicle.features.slice(0, 3).map((feature) => (
                            <div key={feature} className="flex items-center text-xs text-muted-foreground">
                              <CheckCircle size={12} className="mr-2 text-brand" />
                              {feature}
                            </div>
                          ))}
                        </div>
                        <Button variant="outline" className="mt-5 w-full gap-2 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                          View Details <ArrowRight size={16} />
                        </Button>
                      </div>
                    </Card>
                  </Reveal>
                ))}
          </div>

          <div className="mt-12 text-center">
            <Button onClick={() => onNavigate("purchase")} size="lg" variant="outline" className="gap-2 px-8">
              View Full Collection <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </section>

      {/* ── Sustainability split ─────────────────────────── */}
      <section className="bg-background py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal className="order-2 lg:order-1">
            <div className="relative h-[460px] overflow-hidden rounded-3xl shadow-2xl">
              <ImageWithFallback src={phred} alt="Electric vehicle" className="h-full w-full object-cover" />
            </div>
          </Reveal>
          <Reveal delay={0.1} className="order-1 lg:order-2">
            <Eyebrow><Leaf size={14} /> Sustainable Luxury</Eyebrow>
            <h2 className="font-display text-4xl font-bold text-foreground sm:text-5xl">Driving Towards a Greener Future</h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Luxury doesn't have to cost the Earth. Our growing collection of electric and hybrid
              vehicles proves you can enjoy premium performance while reducing your impact.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-6">
              <div>
                <div className="font-display text-4xl font-bold text-brand">50+</div>
                <div className="text-muted-foreground">Electric & Hybrid Models</div>
              </div>
              <div>
                <div className="font-display text-4xl font-bold text-brand">Zero</div>
                <div className="text-muted-foreground">Emissions Options</div>
              </div>
            </div>
            <Button onClick={() => onNavigate("purchase")} size="lg" className="mt-8 gap-2 bg-brand hover:bg-brand-strong">
              Explore Eco-Friendly Options <ArrowRight size={18} />
            </Button>
          </Reveal>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────── */}
      <section className="bg-obsidian-soft py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto mb-16 max-w-2xl text-center">
            <Eyebrow><Users size={14} /> Customer Stories</Eyebrow>
            <h2 className="font-display text-4xl font-bold sm:text-5xl">What Our Clients Say</h2>
            <p className="mt-4 text-lg text-white/65">Hear from the thousands of drivers who found their perfect match.</p>
          </Reveal>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08}>
                <Card className="glass-dark h-full rounded-2xl border-white/10 p-8 text-white">
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: 5 }).map((_, k) => (
                      <Star key={k} size={18} className="fill-brand text-brand" />
                    ))}
                  </div>
                  <Quote className="mb-4 text-brand" size={30} />
                  <p className="italic text-white/80">"{t.quote}"</p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-full bg-brand/20 font-medium text-white">{t.initials}</div>
                    <div>
                      <div className="text-sm">{t.name}</div>
                      <div className="text-xs text-white/50">{t.role}</div>
                    </div>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services CTA ─────────────────────────────────── */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto mb-12 max-w-2xl text-center">
            <Eyebrow>Exclusive Services</Eyebrow>
            <h2 className="font-display text-4xl font-bold text-foreground sm:text-5xl">Beyond Our Inventory</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Looking for something special? Explore our custom importation service or stay tuned for what's coming next.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {[
              { img: phblack, badge: "Bespoke Service", Icon: Sparkles, title: "Custom Importation Orders", body: "Can't find it in our inventory? We'll source your dream vehicle from anywhere in the world.", cta: "Start Custom Order", to: "importation", comingSoon: false },
              { img: phred, badge: "Coming Soon", Icon: Hammer, title: "Premium Vehicle Auctions", body: "Our exclusive auction platform is launching soon — bid on premium vehicles with full transparency on condition and history.", cta: "", to: "", comingSoon: true },
            ].map(({ img, badge, Icon, title, body, cta, to, comingSoon }, i) => (
              <Reveal key={title} delay={i * 0.08}>
                <Card className="group relative h-80 overflow-hidden rounded-2xl border-none">
                  <ImageWithFallback src={img} alt={title} className={`h-full w-full object-cover transition-transform duration-700 ${comingSoon ? "" : "group-hover:scale-105"}`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/50 to-transparent" />
                  {comingSoon && <div className="absolute inset-0 bg-obsidian/40" />}
                  <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                    <Badge className={`mb-3 w-fit gap-2 border-none uppercase tracking-wide text-white ${comingSoon ? "bg-white/15" : "bg-brand"}`}>
                      <Icon size={14} /> {badge}
                    </Badge>
                    <h3 className="font-display text-2xl font-semibold">{title}</h3>
                    <p className="mt-2 max-w-md text-sm text-white/80">{body}</p>
                    {comingSoon ? (
                      <span className="mt-5 inline-flex w-fit cursor-default items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/50">
                        <Clock size={14} /> Launching Soon
                      </span>
                    ) : (
                      <Button onClick={() => onNavigate(to)} className="mt-5 w-fit gap-2 bg-white text-obsidian hover:bg-white/90">
                        {cta} <ArrowRight size={16} />
                      </Button>
                    )}
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-obsidian py-24 text-white">
        <div className="pointer-events-none absolute -right-24 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-brand/20 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Eyebrow>Start Your Journey</Eyebrow>
          <h2 className="font-display text-4xl font-bold sm:text-5xl">Ready to Experience True Luxury?</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/70">
            Your dream vehicle is waiting. Browse our exclusive inventory, schedule a test drive, or speak
            with our specialists today.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Button onClick={() => onNavigate("purchase")} size="lg" className="gap-2 bg-brand px-8 shadow-luxe hover:bg-brand-strong">
              Browse Inventory <ArrowRight size={18} />
            </Button>
            <Button onClick={() => onNavigate("contact")} size="lg" variant="outline" className="border-white/30 bg-white/5 px-8 text-white hover:bg-white/15 hover:text-white">
              Schedule Test Drive
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
