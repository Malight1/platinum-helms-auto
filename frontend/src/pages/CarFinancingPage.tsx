import { useState } from "react";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { Reveal } from "../components/motion/Reveal";
import { Button } from "../components/button";
import { Card } from "../components/card";
import { Label } from "../components/label";
import { Calculator, CreditCard, FileText, CheckCircle2, TrendingDown } from "lucide-react";
import { FinancialApplicationForm } from "../components/FinancialApplicationForm";
import { FinancingEligibilityForm } from "../components/FinancingEligibilityForm";
import { formatCurrency } from "@/lib/adminUtils";

interface CarFinancingPageProps {
  onNavigate: (page: string) => void;
}

const financingOptions = [
  { icon: CreditCard, title: "Standard Financing", rate: "From 4.5% APR", term: "Up to 72 months", description: "Traditional auto loan with competitive rates and flexible terms.", features: ["No prepayment penalties", "Fixed interest rates", "Quick approval process"] },
  { icon: TrendingDown, title: "Lease Programs", rate: "Low monthly payments", term: "24, 36, or 48 months", description: "Drive a new luxury vehicle every few years with lower monthly costs.", features: ["Lower monthly payments", "Warranty coverage included", "Option to purchase at end"] },
  { icon: FileText, title: "Cash Purchase", rate: "No interest", term: "Immediate ownership", description: "Own your vehicle outright with no monthly payments or interest.", features: ["Exclusive cash discounts", "Full ownership immediately", "No credit check required"] },
];

const steps = [
  { number: "01", title: "Pre-Qualification", description: "Get pre-qualified in minutes without impacting your credit score." },
  { number: "02", title: "Choose Your Vehicle", description: "Select your dream vehicle from our luxury inventory." },
  { number: "03", title: "Finalize Terms", description: "Review and customize your financing terms with our specialists." },
  { number: "04", title: "Drive Away", description: "Complete paperwork and take delivery of your new vehicle." },
];

const faqs = [
  { q: "What credit score do I need?", a: "We work with a range of credit profiles. Higher scores typically qualify for better rates, but we have programs for various situations." },
  { q: "Can I trade in my current vehicle?", a: "Yes — we accept trade-ins and can apply the value toward your down payment. Get an instant estimate from our specialists." },
  { q: "How long does approval take?", a: "Pre-qualification takes minutes online. Full approval typically takes 24–48 hours with all required documentation." },
  { q: "Are there any hidden fees?", a: "We believe in transparent pricing. All fees are disclosed upfront with no surprises before finalizing." },
];

const PRICE_PRESETS = [5_000_000, 10_000_000, 25_000_000, 50_000_000, 100_000_000, 150_000_000, 200_000_000, 250_000_000];
const DOWN_PCT_PRESETS = [10, 15, 20, 25, 30];
const LOAN_TERMS = [24, 36, 48, 60, 72];

function parseMoney(raw: string) {
  const n = Number(raw.replace(/[^0-9]/g, ""));
  return isNaN(n) ? 0 : n;
}

function shortLabel(n: number) {
  if (n >= 1_000_000_000) return `₦${(n / 1_000_000_000).toFixed(0)}B`;
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(0)}M`;
  return `₦${(n / 1_000).toFixed(0)}K`;
}

export function CarFinancingPage({ onNavigate }: CarFinancingPageProps) {
  const [vehiclePrice, setVehiclePrice] = useState(25_000_000);
  const [priceDigits, setPriceDigits] = useState("25000000");
  const [downPct, setDownPct] = useState(20);
  const [customDown, setCustomDown] = useState<string>("");
  const [loanTerm, setLoanTerm] = useState(60);
  const interestRate = 4.5;
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [isEligibilityFormOpen, setIsEligibilityFormOpen] = useState(false);

  const downPayment = customDown !== "" ? parseMoney(customDown) : Math.round(vehiclePrice * (downPct / 100));
  const principal = Math.max(0, vehiclePrice - downPayment);
  const monthlyRate = interestRate / 100 / 12;
  const monthlyPayment = principal > 0 && monthlyRate > 0
    ? (principal * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1)
    : 0;
  const totalAmount = monthlyPayment * loanTerm;
  const totalInterest = totalAmount - principal;

  function handlePricePreset(p: number) {
    setVehiclePrice(p);
    setPriceDigits(String(p));
    setCustomDown("");
  }

  function handlePriceInput(val: string) {
    const digits = val.replace(/[^0-9]/g, "");
    setPriceDigits(digits);
    const n = Number(digits);
    if (n > 0) setVehiclePrice(n);
    setCustomDown("");
  }

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-obsidian">
        <div className="absolute inset-0">
          <ImageWithFallback src="https://images.unsplash.com/photo-1574023240744-64c47c8c0676?auto=format&fit=crop&q=80&w=1600" alt="Financing" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/85 to-obsidian/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 via-transparent to-transparent" />
        </div>
        <div className="relative mx-auto w-full max-w-7xl px-4 pb-12 pt-32 sm:px-6 sm:pb-14 sm:pt-36 lg:px-8 lg:pt-40">
          <Reveal className="max-w-2xl">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand">
              Flexible Financing
            </span>
            <h1 className="font-display text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl">
              Zero Compromise.<br className="hidden sm:block" /> Drive Your Dream.
            </h1>
            <p className="mt-5 max-w-xl text-base text-white/75 sm:text-lg">
              Competitive rates, flexible terms, and rapid approvals — tailored to your life.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-4 sm:gap-6">
            {[
              { label: "From 4.5%", sub: "APR" },
              { label: "Up to 72mo", sub: "Terms" },
              { label: "24–48 hrs", sub: "Approval" },
            ].map(({ label, sub }) => (
              <div key={sub} className="border-l border-white/20 pl-4">
                <div className="font-display text-lg font-bold text-white sm:text-xl">{label}</div>
                <div className="text-xs text-white/50 uppercase tracking-widest">{sub}</div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Calculator */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-12 text-center">
            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-brand text-white"><Calculator size={28} /></div>
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">Finance Calculator</h2>
            <p className="mt-3 text-lg text-muted-foreground">Estimate your monthly payments and explore different scenarios.</p>
          </Reveal>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <Card className="rounded-2xl border-border p-8 shadow-sm">
              <div className="space-y-8">

                {/* Vehicle Price */}
                <div>
                  <Label className="mb-3 block text-sm font-medium">Vehicle Price</Label>
                  <div className="flex items-center rounded-xl border border-border bg-muted/30 px-4 py-3 focus-within:border-brand focus-within:ring-1 focus-within:ring-brand/30">
                    <span className="mr-2 text-sm font-semibold text-muted-foreground">₦</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={priceDigits ? Number(priceDigits).toLocaleString("en-NG") : ""}
                      onChange={(e) => handlePriceInput(e.target.value)}
                      className="flex-1 bg-transparent text-sm font-semibold text-foreground outline-none"
                      placeholder="Enter vehicle price"
                    />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {PRICE_PRESETS.map((p) => (
                      <button
                        key={p}
                        onClick={() => handlePricePreset(p)}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                          vehiclePrice === p
                            ? "border-brand bg-brand/10 text-brand"
                            : "border-border text-muted-foreground hover:border-brand/50 hover:text-foreground"
                        }`}
                      >
                        {shortLabel(p)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Down Payment */}
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <Label className="text-sm font-medium">Down Payment</Label>
                    <span className="text-sm font-semibold text-brand">{formatCurrency(downPayment)}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {DOWN_PCT_PRESETS.map((pct) => (
                      <button
                        key={pct}
                        onClick={() => { setDownPct(pct); setCustomDown(""); }}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                          customDown === "" && downPct === pct
                            ? "border-brand bg-brand/10 text-brand"
                            : "border-border text-muted-foreground hover:border-brand/50 hover:text-foreground"
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                    <div className={`flex items-center rounded-full border px-3 py-1 transition-colors ${
                      customDown !== "" ? "border-brand bg-brand/10" : "border-border"
                    }`}>
                      <span className="text-xs text-muted-foreground">₦</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Custom"
                        value={customDown}
                        onChange={(e) => setCustomDown(e.target.value.replace(/[^0-9]/g, ""))}
                        className="w-20 bg-transparent text-xs font-medium text-foreground outline-none placeholder:text-muted-foreground/60"
                      />
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {customDown === "" ? `${downPct}% of vehicle price` : `Custom amount`}
                  </p>
                </div>

                {/* Loan Term */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Loan Term</Label>
                  <div className="flex flex-wrap gap-2">
                    {LOAN_TERMS.map((m) => (
                      <button
                        key={m}
                        onClick={() => setLoanTerm(m)}
                        className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                          loanTerm === m
                            ? "border-brand bg-brand/10 text-brand"
                            : "border-border text-muted-foreground hover:border-brand/50 hover:text-foreground"
                        }`}
                      >
                        {m}mo
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">{loanTerm} months · {(loanTerm / 12).toFixed(1).replace(".0", "")} years</p>
                </div>

                {/* Interest Rate */}
                <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">Interest Rate (APR)</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Estimated — varies by credit profile</p>
                  </div>
                  <span className="font-display text-2xl font-bold text-brand">{interestRate}%</span>
                </div>

              </div>
            </Card>

            <div className="space-y-6">
              <Card className="rounded-2xl border-none bg-gradient-to-br from-obsidian to-slate-deep p-8 text-white">
                <h3 className="font-sans text-base text-white/70">Estimated Monthly Payment</h3>
                <div className="mt-4 font-display text-5xl font-bold text-brand">
                  {formatCurrency(monthlyPayment)}<span className="font-sans text-xl text-white/50">/mo</span>
                </div>
                <div className="mt-8 space-y-3">
                  <Button onClick={() => setIsEligibilityFormOpen(true)} size="lg" className="w-full bg-brand hover:bg-brand-strong">Check Eligibility</Button>
                  <Button onClick={() => setIsApplicationOpen(true)} size="lg" variant="outline" className="w-full border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white">Full Application</Button>
                </div>
              </Card>

              <Card className="rounded-2xl border-border p-8">
                <h3 className="font-display text-2xl font-semibold text-foreground">Loan Summary</h3>
                <div className="mt-4">
                  {[
                    ["Vehicle Price", formatCurrency(vehiclePrice)],
                    ["Down Payment", formatCurrency(downPayment)],
                    ["Amount Financed", formatCurrency(principal)],
                    ["Loan Term", `${loanTerm} months`],
                    ["Interest Rate", `${interestRate}% APR`],
                    ["Total Interest", formatCurrency(totalInterest)],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-border py-3 text-sm">
                      <span className="text-muted-foreground">{k}</span><span className="font-medium text-foreground">{v}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-3"><span className="font-semibold text-foreground">Total Amount</span><span className="font-semibold text-brand">{formatCurrency(totalAmount)}</span></div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Options */}
      <section className="bg-obsidian-soft py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold sm:text-4xl lg:text-5xl">Choose Your Financing Path</h2>
            <p className="mt-3 text-lg text-white/65">Select the option that best fits your lifestyle and budget.</p>
          </Reveal>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {financingOptions.map(({ icon: Icon, title, rate, term, description, features }, i) => (
              <Reveal key={title} delay={i * 0.08}>
                <Card className="glass-dark flex h-full flex-col rounded-2xl border-white/10 p-8 text-white">
                  <div className="mb-6 flex size-14 items-center justify-center rounded-xl bg-brand text-white"><Icon size={24} /></div>
                  <h3 className="font-display text-2xl font-semibold">{title}</h3>
                  <div className="mt-2 flex items-center gap-3 text-sm text-white/60"><span className="text-brand">{rate}</span><span>•</span><span>{term}</span></div>
                  <p className="mt-4 text-sm text-white/70">{description}</p>
                  <ul className="mt-6 flex-1 space-y-3">
                    {features.map((f) => (
                      <li key={f} className="flex items-start text-sm text-white/70"><CheckCircle2 size={16} className="mr-2 mt-0.5 shrink-0 text-brand" />{f}</li>
                    ))}
                  </ul>
                  <Button variant="outline" className="mt-6 w-full border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white" onClick={() => onNavigate("contact")}>Learn More</Button>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">Simple Financing Process</h2>
            <p className="mt-3 text-lg text-muted-foreground">Get approved and drive your dream vehicle in four easy steps.</p>
          </Reveal>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <Reveal key={step.number} delay={i * 0.08} className="text-center">
                <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-strong font-display text-2xl font-bold text-white">{step.number}</div>
                <h3 className="font-display text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button onClick={() => setIsApplicationOpen(true)} size="lg" className="bg-brand px-8 shadow-luxe hover:bg-brand-strong">Get Pre-Qualified Now</Button>
            <p className="mt-4 text-sm text-muted-foreground">Won't affect your credit score • Takes less than 2 minutes</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-obsidian-soft py-24 text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold sm:text-4xl lg:text-5xl">Frequently Asked Questions</h2>
          </Reveal>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <Reveal key={f.q} delay={i * 0.05}>
                <Card className="glass-dark rounded-2xl border-white/10 p-6 text-white">
                  <h3 className="font-sans text-base font-semibold">{f.q}</h3>
                  <p className="mt-2 text-sm text-white/65">{f.a}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-obsidian py-16 text-center text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold sm:text-4xl lg:text-5xl">Ready to Get Started?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">Our financing specialists are here to help you find the perfect solution.</p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button onClick={() => setIsEligibilityFormOpen(true)} size="lg" className="bg-brand px-8 shadow-luxe hover:bg-brand-strong">Check Eligibility</Button>
            <Button onClick={() => onNavigate("purchase")} size="lg" variant="outline" className="border-white/30 bg-white/5 px-8 text-white hover:bg-white/15 hover:text-white">Browse Vehicles</Button>
          </div>
        </div>
      </section>

      <FinancingEligibilityForm isOpen={isEligibilityFormOpen} onClose={() => setIsEligibilityFormOpen(false)} />
      <FinancialApplicationForm isOpen={isApplicationOpen} onClose={() => setIsApplicationOpen(false)} vehiclePrice={vehiclePrice} />
    </div>
  );
}
