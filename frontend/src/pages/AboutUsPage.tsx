import { ImageWithFallback } from "../components/ImageWithFallback";
import { Reveal } from "../components/motion/Reveal";
import { Button } from "../components/button";
import { Card } from "../components/card";
import { Users, Award, Globe, Heart, Target, Zap, Star } from "lucide-react";
import phblack from "../assets/phblack.png";
import mrugo from "../assets/mrugo.jpg";
import afolabigladys from "../assets/afolabigladys.PNG";

interface AboutUsPageProps {
  onNavigate: (page: string) => void;
}

const values = [
  { icon: Award, title: "Excellence", description: "We maintain the highest standards in every vehicle we offer and every service we provide." },
  { icon: Heart, title: "Passion", description: "Our love for luxury automobiles drives us to deliver exceptional experiences." },
  { icon: Users, title: "Customer First", description: "Your satisfaction and trust are at the center of everything we do." },
  { icon: Target, title: "Integrity", description: "Transparent, honest relationships built on trust and reliability." },
  { icon: Zap, title: "Innovation", description: "Embracing cutting-edge technology to enhance your automotive journey." },
  { icon: Globe, title: "Global Reach", description: "Access to the world's finest vehicles through our international network." },
];

const stats = [
  { number: "15+", label: "Years of Excellence" },
  { number: "10K+", label: "Happy Customers" },
  { number: "50+", label: "Premium Brands" },
  { number: "98%", label: "Satisfaction Rate" },
];

const team = [
  { name: "Ugochukwu Ifeanacho", role: "CEO", image: null },
  { name: "Mrs Afolabi Gladys .U.", role: "Director, Partnerships", image: afolabigladys },
];

const testimonials = [
  { quote: "I got my Honda Accord 2013 through Platinum Helms and the whole process was smooth from start to finish. No stress, no wahala — just my car delivered to my door.", name: "Chukwuemeka Obi", detail: "Purchased Honda Accord 2013" },
  { quote: "They imported my Lexus RX350 from Canada and handled everything — customs, documentation, shipping. I just paid and waited. Best decision I made.", name: "Funmilayo Adeyemi", detail: "Imported Lexus RX350 from Canada" },
  { quote: "Got a brand new Mercedes GLE350 on their financing plan. The terms were fair and they were very transparent. I've already referred three people.", name: "Tunde Bakare", detail: "Financed Mercedes-Benz GLE350" },
];

export function AboutUsPage({ onNavigate }: AboutUsPageProps) {
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-obsidian">
        <div className="absolute inset-0">
          <ImageWithFallback src={phblack} alt="About Platinum Helms" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/85 to-obsidian/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent" />
        </div>
        <div className="relative mx-auto w-full max-w-7xl px-4 pb-12 pt-32 sm:px-6 sm:pb-16 sm:pt-36 lg:px-8 lg:pt-40">
          <Reveal className="max-w-2xl">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand">
              Est. 2010 · Our Story
            </span>
            <h1 className="font-display text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl">
              Redefining Luxury<br className="hidden sm:block" /> Automotive Excellence
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
              For over 15 years, connecting discerning clients with the world's finest luxury vehicles.
            </p>
          </Reveal>
          {/* Stats embedded at bottom of hero */}
          <Reveal delay={0.1} className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="border-l border-white/20 pl-4">
                <div className="font-display text-2xl font-bold text-brand sm:text-3xl">{s.number}</div>
                <p className="mt-0.5 text-xs tracking-wide text-white/55 sm:text-sm">{s.label}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Story */}
      <section className="bg-background py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <h2 className="font-display text-4xl font-bold text-foreground sm:text-5xl">Our Story</h2>
            <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
              <p>Founded in 2010, Platinum Helms began with a simple vision: to make luxury automotive excellence accessible to those who appreciate the finer things in life.</p>
              <p>Our journey has been defined by an unwavering commitment to excellence, transparency, and personalized service. Purchasing a luxury vehicle is more than a transaction — it's an experience that should be as exceptional as the vehicle itself.</p>
              <p>Today, we serve clients nationally and internationally, offering an exclusive selection of the world's most prestigious automotive brands, backed by a team with decades of combined experience.</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative h-[520px] overflow-hidden rounded-3xl shadow-2xl">
              <ImageWithFallback src={mrugo} alt="Our facility" className="h-full w-full object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="bg-obsidian-soft py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold sm:text-4xl lg:text-5xl">Our Core Values</h2>
            <p className="mt-3 text-lg text-white/65">The principles that guide everything we do and define who we are.</p>
          </Reveal>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {values.map(({ icon: Icon, title, description }, i) => (
              <Reveal key={title} delay={i * 0.06}>
                <Card className="glass-dark h-full rounded-2xl border-white/10 p-8 text-center text-white transition-all hover:-translate-y-1">
                  <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-xl bg-brand text-white">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-display text-2xl font-semibold">{title}</h3>
                  <p className="mt-3 text-sm text-white/65">{description}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-background py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          <Reveal>
            <Card className="h-full rounded-2xl border-none bg-gradient-to-br from-obsidian to-slate-deep p-12 text-white">
              <Target className="mb-6 text-brand" size={40} />
              <h2 className="font-display text-3xl font-bold">Our Mission</h2>
              <p className="mt-4 leading-relaxed text-white/80">
                To provide an unparalleled luxury automotive experience by combining world-class vehicles, expert guidance, and personalized service that exceeds expectations at every touchpoint.
              </p>
            </Card>
          </Reveal>
          <Reveal delay={0.1}>
            <Card className="h-full rounded-2xl border-border bg-card p-12">
              <Zap className="mb-6 text-brand" size={40} />
              <h2 className="font-display text-3xl font-bold text-foreground">Our Vision</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                To be the most trusted and respected name in luxury automotive sales and service, setting new standards for excellence and innovation in the industry worldwide.
              </p>
            </Card>
          </Reveal>
        </div>
      </section>

      {/* Team */}
      <section className="bg-obsidian-soft py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-brand/80">The People Behind the Brand</p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Meet Our<br className="hidden xs:block sm:hidden" /> Leadership
            </h2>
            <div className="mx-auto mt-5 h-px w-10 bg-brand/40" />
            <p className="mt-5 text-base leading-relaxed text-white/55 sm:text-lg">
              Experienced professionals dedicated to delivering exceptional service.
            </p>
          </Reveal>
          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-8 sm:grid-cols-2">
            {team.map((member, i) => (
              <Reveal key={member.name} delay={i * 0.1}>
                <Card className="group overflow-hidden rounded-2xl border-white/[0.08] bg-white/[0.03]">
                  <div className="h-80 overflow-hidden bg-obsidian">
                    {member.image ? (
                      <ImageWithFallback
                        src={member.image}
                        alt={member.name}
                        className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-obsidian-soft to-obsidian">
                        <svg viewBox="0 0 100 100" className="h-28 w-28 text-white/15" fill="currentColor" aria-hidden="true">
                          <circle cx="50" cy="36" r="20" />
                          <path d="M8 88c0-23.2 18.8-42 42-42s42 18.8 42 42" />
                        </svg>
                        <p className="mt-4 text-xs uppercase tracking-widest text-white/20">Photo Coming Soon</p>
                      </div>
                    )}
                  </div>
                  <div className="p-7 text-center">
                    <h3 className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">{member.name}</h3>
                    <p className="mt-1.5 text-xs font-semibold uppercase tracking-widest text-brand/70">{member.role}</p>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="font-display text-4xl font-bold text-foreground sm:text-5xl">What Our Clients Say</h2>
            <p className="mt-3 text-lg text-muted-foreground">Don't just take our word for it — hear from satisfied clients.</p>
          </Reveal>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08}>
                <Card className="h-full rounded-2xl border-border p-8">
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: 5 }).map((_, k) => <Star key={k} size={16} className="fill-brand text-brand" />)}
                  </div>
                  <p className="italic text-muted-foreground">"{t.quote}"</p>
                  <div className="mt-6">
                    <p className="font-medium text-foreground">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.detail}</p>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-obsidian py-24 text-center text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold sm:text-4xl lg:text-5xl">Ready to Start Your Journey?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
            Experience the Platinum Helms difference. Let us help you find your perfect luxury vehicle.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button onClick={() => onNavigate("purchase")} size="lg" className="bg-brand px-8 shadow-luxe hover:bg-brand-strong">Browse Our Collection</Button>
            <Button onClick={() => onNavigate("contact")} size="lg" variant="outline" className="border-white/30 bg-white/5 px-8 text-white hover:bg-white/15 hover:text-white">Contact Us</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
