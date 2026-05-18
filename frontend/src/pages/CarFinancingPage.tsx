import { useState } from "react";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { Button } from "../components/button";
import { Card } from "../components/card";
import { Input } from "../components/input";
import { Slider } from "../components/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/select";
import { Calculator, CreditCard, FileText, CheckCircle2, TrendingDown } from "lucide-react";
import { FinancialApplicationForm } from "../components/FinancialApplicationForm";
import { FinancingEligibilityForm } from "../components/FinancingEligibilityForm";
import { formatCurrency } from "@/lib/adminUtils";

interface CarFinancingPageProps {
  onNavigate: (page: string) => void;
}

export function CarFinancingPage({ onNavigate }: CarFinancingPageProps) {
  const [vehiclePrice, setVehiclePrice] = useState(80000);
  const [downPayment, setDownPayment] = useState(16000);
  const [loanTerm, setLoanTerm] = useState(60);
  const [interestRate] = useState(4.5);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [isEligibilityFormOpen, setIsEligibilityFormOpen] = useState(false);

  const calculateMonthlyPayment = () => {
    const principal = vehiclePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const payment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) /
      (Math.pow(1 + monthlyRate, loanTerm) - 1);
    return payment;
  };

  const monthlyPayment = calculateMonthlyPayment();
  const totalAmount = monthlyPayment * loanTerm;
  const totalInterest = totalAmount - (vehiclePrice - downPayment);

  const financingOptions = [
    {
      icon: CreditCard,
      title: "Standard Financing",
      rate: "From 4.5% APR",
      term: "Up to 72 months",
      description: "Traditional auto loan with competitive rates and flexible terms.",
      features: [
        "No prepayment penalties",
        "Fixed interest rates",
        "Quick approval process",
      ],
    },
    {
      icon: TrendingDown,
      title: "Lease Programs",
      rate: "Low monthly payments",
      term: "24, 36, or 48 months",
      description: "Drive a new luxury vehicle every few years with lower monthly costs.",
      features: [
        "Lower monthly payments",
        "Warranty coverage included",
        "Option to purchase at end",
      ],
    },
    {
      icon: FileText,
      title: "Cash Purchase",
      rate: "No interest",
      term: "Immediate ownership",
      description: "Own your vehicle outright with no monthly payments or interest.",
      features: [
        "Exclusive cash discounts",
        "Full ownership immediately",
        "No credit check required",
      ],
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Pre-Qualification",
      description: "Get pre-qualified in minutes without impacting your credit score.",
    },
    {
      number: "02",
      title: "Choose Your Vehicle",
      description: "Select your dream vehicle from our luxury inventory.",
    },
    {
      number: "03",
      title: "Finalize Terms",
      description: "Review and customize your financing terms with our specialists.",
    },
    {
      number: "04",
      title: "Drive Away",
      description: "Complete paperwork and take delivery of your new vehicle.",
    },
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <section className="relative h-[400px]">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1574023240744-64c47c8c0676?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBkZWFsZXJzaGlwfGVufDF8fHx8MTc2MTYzNTcwNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Financing"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
        </div>

        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl">
              <h1 className="text-white mb-6 text-[64px] font-bold font-[Roboto] tracking-tight leading-tight">Flexible Financing Solutions</h1>
              <p className="text-white/90 text-xl leading-relaxed italic">
                Make your luxury vehicle dreams a reality with our tailored
                financing options and competitive rates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calculator className="text-white" size={28} />
            </div>
            <h2 className="mb-4 text-[20px] font-bold">Finance Calculator</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Estimate your monthly payments and explore different financing scenarios.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Calculator Inputs */}
            <Card className="p-8 border-none shadow-lg shadow-red-600/20 hover:shadow-xl hover:shadow-red-600/30 transition-all">
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between mb-3">
                    <label className="text-sm">Vehicle Price</label>
                    <span className="text-sm">{formatCurrency(vehiclePrice)}</span>
                  </div>
                  <Slider
                    value={[vehiclePrice]}
                    onValueChange={(value) => setVehiclePrice(value[0])}
                    min={50000000}
                    max={7000000000}
                    step={5000}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{formatCurrency(50000000)}</span>
                    <span>{formatCurrency(7000000000)}</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-3">
                    <label className="text-sm">Down Payment ({((downPayment / vehiclePrice) * 100).toFixed(0)}%)</label>
                    <span className="text-sm">{formatCurrency(downPayment)}</span>
                  </div>
                  <Slider
                    value={[downPayment]}
                    onValueChange={(value) => setDownPayment(value[0])}
                    min={0}
                    max={vehiclePrice * 0.5}
                    step={1000}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{formatCurrency(0)}</span>
                    <span>{formatCurrency(vehiclePrice * 0.5)}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-3">Loan Term</label>
                  <Select
                    value={loanTerm.toString()}
                    onValueChange={(value) => setLoanTerm(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="36">36 months (3 years)</SelectItem>
                      <SelectItem value="48">48 months (4 years)</SelectItem>
                      <SelectItem value="60">60 months (5 years)</SelectItem>
                      <SelectItem value="72">72 months (6 years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm mb-3">Interest Rate (APR)</label>
                  <Input value={`${interestRate}%`} disabled />
                  <p className="text-xs text-gray-500 mt-2">
                    Rate shown is estimated. Actual rate may vary based on credit.
                  </p>
                </div>
              </div>
              <div className="mt-6 rounded-lg overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1673902219551-6e6de00d2e13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJnbyUyMHNoaXAlMjBvY2VhbnxlbnwxfHx8fDE3NjIwMjY0Njh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Cargo ship on ocean"
                  className="w-full h-48 object-cover"
                />
              </div>
            </Card>

            {/* Calculator Results */}
            <div className="space-y-6">
              <Card className="p-8 bg-black text-white border-none">
                <h3 className="text-white mb-8">Estimated Monthly Payment</h3>
                <div className="text-5xl mb-8">
                  {formatCurrency(monthlyPayment)}
                  <span className="text-2xl text-white/60">/mo</span>
                </div>
                <div className="space-y-3">
                  <Button
                    onClick={() => setIsEligibilityFormOpen(true)}
                    className="w-full bg-white text-black hover:bg-gray-200 font-medium"
                    size="lg"
                  >
                    Check Eligibility
                  </Button>
                  <Button
                    onClick={() => setIsApplicationOpen(true)}
                    variant="outline"
                    className="w-full bg-white text-black border-2 border-white font-medium"
                    size="lg"
                  >
                    Full Application
                  </Button>
                </div>
              </Card>

              <Card className="p-8 border-none shadow-sm">
                <h3 className="mb-6">Loan Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-gray-600">Vehicle Price</span>
                    <span>{formatCurrency(vehiclePrice)}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-gray-600">Down Payment</span>
                    <span>{formatCurrency(downPayment)}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-gray-600">Amount Financed</span>
                    <span>{formatCurrency(vehiclePrice - downPayment)}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-gray-600">Loan Term</span>
                    <span>{loanTerm} months</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-gray-600">Interest Rate</span>
                    <span>{interestRate}% APR</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-gray-600">Total Interest</span>
                    <span>{formatCurrency(totalInterest)}</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span>Total Amount</span>
                    <span>{formatCurrency(totalAmount)}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Financing Options */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-[20px] font-bold">Choose Your Financing Path</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Select the financing option that best fits your lifestyle and budget.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {financingOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <Card key={index} className="p-8 border-none shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center mb-6">
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="mb-2 font-bold">{option.title}</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm text-gray-900">{option.rate}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{option.term}</span>
                  </div>
                  <p className="text-gray-600 mb-6">{option.description}</p>
                  <ul className="space-y-3 mb-6">
                    {option.features.map((feature, i) => (
                      <li key={i} className="flex items-start text-sm text-gray-600">
                        <CheckCircle2 size={16} className="mr-2 text-red-600 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full text-black border-gray-300 hover:bg-gray-100 font-medium">
                    Learn More
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-[20px] font-bold">Simple Financing Process</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Get approved and drive your dream vehicle in four easy steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                  {step.number}
                </div>
                <h3 className="mb-3">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              onClick={() => setIsApplicationOpen(true)}
              className="bg-black hover:bg-gray-800" 
              size="lg"
            >
              Get Pre-Qualified Now
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              Won't affect your credit score • Takes less than 2 minutes
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4 font-bold">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-6">
            <Card className="p-6 border-none shadow-sm">
              <h3 className="mb-2">What credit score do I need?</h3>
              <p className="text-gray-600">
                We work with a range of credit profiles. While higher credit scores
                typically qualify for better rates, we have programs for various
                credit situations starting from 620.
              </p>
            </Card>

            <Card className="p-6 border-none shadow-sm">
              <h3 className="mb-2">Can I trade in my current vehicle?</h3>
              <p className="text-gray-600">
                Yes! We accept trade-ins and can apply the value toward your down
                payment. Get an instant trade-in estimate from our specialists.
              </p>
            </Card>

            <Card className="p-6 border-none shadow-sm">
              <h3 className="mb-2">How long does approval take?</h3>
              <p className="text-gray-600">
                Pre-qualification takes just minutes online. Full approval typically
                takes 24-48 hours with all required documentation.
              </p>
            </Card>

            <Card className="p-6 border-none shadow-sm">
              <h3 className="mb-2">Are there any hidden fees?</h3>
              <p className="text-gray-600">
                We believe in transparent pricing. All fees are clearly disclosed
                upfront with no surprises. Our team will review all costs with you
                before finalizing.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-white mb-6 text-[20px] font-bold">Ready to Get Started?</h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Our financing specialists are here to help you find the perfect solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setIsEligibilityFormOpen(true)}
              className="bg-white text-black hover:bg-gray-200 font-medium"
              size="lg"
            >
              Check Eligibility
            </Button>
            <Button
              onClick={() => onNavigate("purchase")}
              variant="outline"
              className="bg-white text-black border-2 border-white font-medium"
              size="lg"
            >
              Browse Vehicles
            </Button>
          </div>
        </div>
      </section>

      {/* Financing Eligibility Form */}
      <FinancingEligibilityForm
        isOpen={isEligibilityFormOpen}
        onClose={() => setIsEligibilityFormOpen(false)}
      />

      {/* Financial Application Form Dialog */}
      <FinancialApplicationForm
        isOpen={isApplicationOpen}
        onClose={() => setIsApplicationOpen(false)}
        vehiclePrice={vehiclePrice}
      />
    </div>
  );
}
