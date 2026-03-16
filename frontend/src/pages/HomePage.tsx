import { ImageWithFallback } from "../components/ImageWithFallback";
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
  Play,
  Quote,
  // Car,
  Hammer,
} from "lucide-react";
import { Button } from "../components/button";
import { Card } from "../components/card";
import { Badge } from "../components/badge";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const featuredVehicles = [
    {
      id: 1,
      name: "LUX S-Class",
      brand: "Mercedes-Benz",
      category: "Luxury Sedan",
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
    },
    {
      id: 2,
      name: "LUX GLE",
      brand: "Mercedes-Benz",
      category: "Luxury SUV",
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
    },
    {
      id: 3,
      name: "LUX AMG GT",
      brand: "Mercedes-Benz",
      category: "Sports Car",
      year: 2025,
      condition: "New",
      price: 125000,
      transmission: "Automatic",
      fuelType: "Petrol",
      mileage: 0,
      image:
        "https://images.unsplash.com/photo-1541348263662-e068662d82af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBjYXIlMjBmcm9udHxlbnwxfHx8fDE3NjE2MzczODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      features: ["Twin-Turbo V8", "Carbon Fiber Interior", "Sport Exhaust"],
      tags: ["searched"],
    },
  ];

  const getTagIcon = (tag: string) => {
    switch (tag) {
      case "hotDeal":
        return <Tag size={12} />;
      case "popular":
        return <TrendingUp size={12} />;
      case "searched":
        return <Heart size={12} />;
      default:
        return null;
    }
  };

  const getTagLabel = (tag: string) => {
    switch (tag) {
      case "hotDeal":
        return "Hot Deal";
      case "popular":
        return "Popular";
      case "searched":
        return "Most Searched";
      default:
        return tag;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Enhanced */}
      <section className="relative h-screen">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1707407772603-274cc5cf18f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzZWRhbiUyMGRyaXZpbmd8ZW58MXx8fHwxNzYxNjk4NjE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Luxury vehicle"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
        </div>

        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              <div className="inline-block mb-4">
                <Badge className="bg-red-600 hover:bg-red-700 text-white border-none px-4 py-2 mt-24">
                  <Sparkles size={14} className="mr-2" />
                  Welcome to the Future of Luxury
                </Badge>
              </div>
              <h1 className="text-[rgb(255,255,255)] mb-6 tracking-tight text-[64px] font-bold font-[Roboto] leading-tight">
                Find Your Dream Car Today
              </h1>
              <p className="text-white/90 text-2xl mb-4 leading-relaxed italic">
                Your journey to automotive excellence starts here. Experience
                the perfect fusion of luxury, innovation, and performance.
              </p>
              <p className="text-white/80 mb-10 leading-relaxed text-[15px] italic">
                Join thousands of satisfied drivers who've discovered their
                dream vehicle at Platinum Helms • where every drive is an
                occasion, and every vehicle tells a story.
              </p>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-6 mb-10">
                <div className="text-white">
                  <div className="text-3xl mb-1">5,000+</div>
                  <div className="text-white/70 text-sm">Happy Owners</div>
                </div>
                <div className="text-white">
                  <div className="text-3xl mb-1">98%</div>
                  <div className="text-white/70 text-sm">Satisfaction Rate</div>
                </div>
                <div className="text-white">
                  <div className="text-3xl mb-1">500+</div>
                  <div className="text-white/70 text-sm">Premium Models</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => onNavigate("purchase")}
                  className="bg-red-600 text-white hover:bg-red-700 px-8 py-6 font-medium shadow-lg shadow-red-600/50"
                  size="lg"
                >
                  Explore Collection
                  <ArrowRight className="ml-2" size={20} />
                </Button>
                <Button
                  onClick={() => onNavigate("financing")}
                  variant="outline"
                  className="bg-white text-black hover:bg-gray-100 border-2 border-white px-8 py-6 font-medium"
                  size="lg"
                >
                  Get Pre-Approved
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"></div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-gradient-to-br from-black via-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <CheckCircle className="text-red-600 mb-3" size={32} />
              <div className="text-xl mb-1">Certified Quality</div>
              <div className="text-white/60 text-sm">
                Every Vehicle Inspected
              </div>
            </div>
            <div className="flex flex-col items-center">
              <Shield className="text-red-600 mb-3" size={32} />
              <div className="text-xl mb-1">Warranty Included</div>
              <div className="text-white/60 text-sm">
                Comprehensive Coverage
              </div>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="text-red-600 mb-3" size={32} />
              <div className="text-xl mb-1">24/7 Support</div>
              <div className="text-white/60 text-sm">Always Here for You</div>
            </div>
            <div className="flex flex-col items-center">
              <Star className="text-red-600 mb-3" size={32} />
              <div className="text-xl mb-1">5-Star Rated</div>
              <div className="text-white/60 text-sm">Customer Favorite</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-red-600 hover:bg-red-700 text-white border-none px-4 py-2 mb-4">
              The Platinum Helms Difference
            </Badge>
            <h2 className="mb-4 font-bold text-[20px]">
              Why Choose Platinum Helms
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              We're not just selling cars • we're crafting experiences,
              building relationships, and making automotive dreams come true,
              one exceptional vehicle at a time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 border-none shadow-lg shadow-red-600/20 hover:shadow-xl hover:shadow-red-600/30 transition-all bg-white">
              <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center mb-6">
                <Zap className="text-white" size={24} />
              </div>
              <h3 className="mb-3">Cutting-Edge Performance</h3>
              <p className="text-gray-600">
                Experience the thrill of advanced engineering that delivers
                exceptional power, precision, and efficiency in every journey
                you take.
              </p>
            </Card>

            <Card className="p-8 border-none shadow-lg shadow-red-600/20 hover:shadow-xl hover:shadow-red-600/30 transition-all bg-white">
              <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center mb-6">
                <Shield className="text-white" size={24} />
              </div>
              <h3 className="mb-3">Ultimate Safety</h3>
              <p className="text-gray-600">
                State-of-the-art safety systems and smart technology work
                together to protect you and your loved ones on every adventure.
              </p>
            </Card>

            <Card className="p-8 border-none shadow-lg shadow-red-600/20 hover:shadow-xl hover:shadow-red-600/30 transition-all bg-white">
              <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center mb-6">
                <Award className="text-white" size={24} />
              </div>
              <h3 className="mb-3">Premium Quality</h3>
              <p className="text-gray-600">
                Meticulous craftsmanship, luxury materials, and attention to
                detail define every aspect of our curated collection.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology & Innovation Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="bg-red-600 hover:bg-red-700 text-white border-none px-4 py-2 mb-4">
                Innovation First
              </Badge>
              <h2 className="mb-6 text-[20px] font-bold">The Future is Now</h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Step into tomorrow with cutting-edge technology that transforms
                every drive into an intelligent, connected experience. From
                AI-powered assistance to seamless smartphone integration, we're
                redefining what's possible.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="text-red-600" size={24} />
                  </div>
                  <div>
                    <h4 className="mb-1">AI-Powered Assistance</h4>
                    <p className="text-gray-600">
                      Intelligent systems that learn and adapt to your driving
                      style
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="text-red-600" size={24} />
                  </div>
                  <div>
                    <h4 className="mb-1">Electric & Hybrid Options</h4>
                    <p className="text-gray-600">
                      Sustainable performance without compromising luxury
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="text-red-600" size={24} />
                  </div>
                  <div>
                    <h4 className="mb-1">Advanced Safety Suite</h4>
                    <p className="text-gray-600">
                      360Â° protection with predictive collision avoidance
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => onNavigate("purchase")}
                className="mt-8 bg-red-600 text-white hover:bg-red-700 font-medium"
                size="lg"
              >
                Explore Technology
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </div>

            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758411897888-3ca658535fdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjB0ZWNobm9sb2d5JTIwZGFzaGJvYXJkfGVufDF8fHx8MTc2MjQ0MzkwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Advanced technology dashboard"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-red-600 hover:bg-red-700 text-white border-none px-4 py-2 mb-4">
              Handpicked Excellence
            </Badge>
            <h2 className="mb-4 text-[20px] font-bold">Featured Collection</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Explore our most sought-after models, each carefully selected to
              deliver an extraordinary driving experience that exceeds
              expectations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredVehicles.map((vehicle) => (
              <Card
                key={vehicle.id}
                className="group overflow-hidden border-none shadow-lg shadow-red-600/20 hover:shadow-xl hover:shadow-red-600/30 transition-all cursor-pointer bg-white"
                onClick={() => onNavigate("purchase")}
              >
                <div className="relative h-64 overflow-hidden">
                  <ImageWithFallback
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Year and Condition Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <div className="bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-white text-sm">{vehicle.year}</span>
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
                  <p className="text-gray-500 text-sm mb-1 tracking-wider uppercase">
                    {vehicle.brand}
                  </p>
                  <h3 className="text-black mb-2">{vehicle.name}</h3>
                  <p className="text-black mb-2 text-2xl">
                    ${vehicle.price.toLocaleString()}
                  </p>

                  {/* Vehicle Specs */}
                  <div className="flex flex-wrap gap-3 mb-4 text-xs text-gray-600">
                    <span>{vehicle.transmission}</span>
                    <span>•</span>
                    <span>{vehicle.fuelType}</span>
                    <span>•</span>
                    <span>{vehicle.mileage.toLocaleString()} mi</span>
                  </div>

                  {/* Features */}
                  <div className="mb-4 space-y-1">
                    {vehicle.features.slice(0, 3).map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center text-xs text-gray-600"
                      >
                        <CheckCircle size={12} className="mr-2 text-red-600" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    className="w-full bg-white text-black border-gray-300 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors font-medium"
                  >
                    View Details
                    <ArrowRight className="ml-2" size={18} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              onClick={() => onNavigate("purchase")}
              variant="outline"
              className="bg-white text-black border-2 border-black hover:bg-black hover:text-white transition-colors font-medium px-8 py-6"
              size="lg"
            >
              View Full Collection
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl order-2 lg:order-1">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHZlaGljbGUlMjBjaGFyZ2luZ3xlbnwxfHx8fDE3NjI0MTcwMTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Electric vehicle charging"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="order-1 lg:order-2">
              <Badge className="bg-red-600 hover:bg-red-700 text-white border-none px-4 py-2 mb-4">
                <Leaf size={14} className="mr-2" />
                Sustainable Luxury
              </Badge>
              <h2 className="mb-6 text-[20px] font-bold">
                Driving Towards a Greener Future
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Luxury doesn't have to cost the Earth. Our growing collection of
                electric and hybrid vehicles proves you can enjoy premium
                performance while reducing your environmental impact.
              </p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="text-3xl mb-2 text-red-600">50+</div>
                  <div className="text-gray-600">Electric & Hybrid Models</div>
                </div>
                <div>
                  <div className="text-3xl mb-2 text-red-600">Zero</div>
                  <div className="text-gray-600">Emissions Options</div>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle
                    className="text-red-600 flex-shrink-0"
                    size={20}
                  />
                  <span className="text-gray-700">
                    Fast charging infrastructure support
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle
                    className="text-red-600 flex-shrink-0"
                    size={20}
                  />
                  <span className="text-gray-700">
                    Government incentives and tax credits
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle
                    className="text-red-600 flex-shrink-0"
                    size={20}
                  />
                  <span className="text-gray-700">
                    Lower running costs and maintenance
                  </span>
                </div>
              </div>

              <Button
                onClick={() => onNavigate("purchase")}
                className="bg-red-600 text-white hover:bg-red-700 font-medium"
                size="lg"
              >
                Explore Eco-Friendly Options
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-red-600 hover:bg-red-700 text-white border-none px-4 py-2 mb-4">
              <Users size={14} className="mr-2" />
              Customer Stories
            </Badge>
            <h2 className="mb-4 font-bold text-[20px]">What Our Clients Say</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Don't just take our word for it • hear from the thousands of
              satisfied drivers who've found their perfect match.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 border-none shadow-lg shadow-red-600/20 hover:shadow-xl hover:shadow-red-600/30 transition-all bg-white">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="text-red-600 fill-red-600"
                    size={18}
                  />
                ))}
              </div>
              <Quote className="text-red-600 mb-4" size={32} />
              <p className="text-gray-700 mb-6 italic">
                "The entire experience was seamless. From browsing to financing
                to driving away in my dream car • Platinum Helms made it
                effortless. Absolutely exceptional service!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600">SJ</span>
                </div>
                <div>
                  <div className="text-sm">Sarah Johnson</div>
                  <div className="text-xs text-gray-500">
                    Mercedes-Benz S-Class Owner
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-none shadow-lg shadow-red-600/20 hover:shadow-xl hover:shadow-red-600/30 transition-all bg-white">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="text-red-600 fill-red-600"
                    size={18}
                  />
                ))}
              </div>
              <Quote className="text-red-600 mb-4" size={32} />
              <p className="text-gray-700 mb-6 italic">
                "I've purchased luxury vehicles before, but Platinum Helms sets
                a new standard. The attention to detail and customer care is
                unmatched. Highly recommend!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600">MC</span>
                </div>
                <div>
                  <div className="text-sm">Michael Chen</div>
                  <div className="text-xs text-gray-500">BMW X7 Owner</div>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-none shadow-lg shadow-red-600/20 hover:shadow-xl hover:shadow-red-600/30 transition-all bg-white">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="text-red-600 fill-red-600"
                    size={18}
                  />
                ))}
              </div>
              <Quote className="text-red-600 mb-4" size={32} />
              <p className="text-gray-700 mb-6 italic">
                "As a first-time luxury car buyer, I was nervous. The team
                walked me through everything with patience and expertise. I
                couldn't be happier with my choice!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600">EP</span>
                </div>
                <div>
                  <div className="text-sm">Emily Parker</div>
                  <div className="text-xs text-gray-500">Audi Q5 Owner</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Lifestyle Gallery Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-red-600 hover:bg-red-700 text-white border-none px-4 py-2 mb-4">
              The Platinum Lifestyle
            </Badge>
            <h2 className="mb-4 font-bold text-[20px]">
              More Than a Car, It's a Lifestyle
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Join our community of discerning drivers living their best lives
              behind the wheel.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="relative h-64 rounded-lg overflow-hidden group cursor-pointer">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1638885930125-85350348d266?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBsaWZlc3R5bGV8ZW58MXx8fHwxNzYyNTE2MjI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Lifestyle"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden group cursor-pointer">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1567722949028-bd65dec5148f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBzdW5zZXR8ZW58MXx8fHwxNzYyNTE2MjI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Lifestyle"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden group cursor-pointer">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1705747401901-28363172fe7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzaG93cm9vbXxlbnwxfHx8fDE3NjI1MTYyMjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Showroom"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden group cursor-pointer">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1666981690385-476d59af2183?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGN1c3RvbWVyJTIwY2FyfGVufDF8fHx8MTc2MjQ4NzY0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Happy customer"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">
              Follow us for daily inspiration
            </p>
            <div className="flex gap-4 justify-center">
              <Badge
                variant="outline"
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                @platinumhelms
              </Badge>
              <Badge
                variant="outline"
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                #PlatinumLifestyle
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Interior Showcase */}
      <section className="relative h-[600px]">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1599912027667-755b68b4dd3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjE2OTg2MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Luxury interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
        </div>

        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-xl text-white">
              <Badge className="bg-red-600 hover:bg-red-700 text-white border-none px-4 py-2 mb-4">
                Craftsmanship
              </Badge>
              <h2 className="mb-6 text-white text-[20px] font-bold">
                Where Artistry Meets Engineering
              </h2>
              <p className="text-white/90 text-lg mb-8 leading-relaxed">
                Every surface, every stitch, every detail meticulously designed
                and crafted to create an interior that transcends ordinary
                expectations. This is luxury redefined.
              </p>
              <Button
                onClick={() => onNavigate("about")}
                className="bg-white text-black hover:bg-gray-200 font-medium"
                size="lg"
              >
                Discover Our Story
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </div>
          </div>
        </div>

        {/* Play button overlay for video effect */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity pointer-events-auto cursor-pointer">
            <Play className="text-white ml-1" size={32} />
          </div>
        </div>
      </section>

      {/* Custom Orders & Auctions CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-red-600 hover:bg-red-700 text-white border-none px-4 py-2 mb-4">
              Exclusive Services
            </Badge>
            <h2 className="mb-4 text-[32px]">Beyond Our Inventory</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Looking for something special? Explore our custom importation
              service or bid on exclusive auction vehicles.
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
                    Can't find it in our inventory? We'll source your dream
                    vehicle from anywhere in the world and handle everything
                    from purchase to delivery.
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
                    Bid on exclusive luxury vehicles with complete transparency
                    on condition, history, and full importation services
                    included.
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
                <div className="text-3xl mb-2">Live</div>
                <p className="text-sm text-gray-600">Active Auctions Now</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Badge className="bg-red-600 hover:bg-red-700 text-white border-none px-4 py-2 mb-6">
            Start Your Journey
          </Badge>
          <h2 className="text-white mb-6 text-[20px] font-bold">
            Ready to Experience True Luxury?
          </h2>
          <p className="text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed italic text-[16px]">
            Your dream vehicle is waiting. Schedule a personalized test drive,
            explore our exclusive inventory, or speak with our luxury automotive
            specialists today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => onNavigate("purchase")}
              className="bg-red-600 text-white hover:bg-red-700 font-medium shadow-lg shadow-red-600/30"
              size="lg"
            >
              Browse Inventory
              <ArrowRight className="ml-2" size={20} />
            </Button>
            <Button
              onClick={() => onNavigate("contact")}
              variant="outline"
              className="bg-white text-black hover:bg-gray-100 border-2 border-white font-medium"
              size="lg"
            >
              Schedule Test Drive
            </Button>
            <Button
              onClick={() => onNavigate("financing")}
              variant="outline"
              className="bg-transparent text-white hover:bg-white hover:text-black border-2 border-white font-medium"
              size="lg"
            >
              Get Pre-Approved
            </Button>
          </div>

          {/* Trust badges */}
          <div className="mt-16 pt-16 border-t border-white/10">
            <p className="text-white/60 text-sm mb-6">
              Trusted by thousands of luxury car enthusiasts
            </p>
            <div className="flex flex-wrap gap-8 justify-center items-center opacity-60">
              <div className="text-white/80">BBB A+ Rated</div>
              <div className="text-white/40">•</div>
              <div className="text-white/80">5-Star Reviews</div>
              <div className="text-white/40">•</div>
              <div className="text-white/80">Certified Dealers</div>
              <div className="text-white/40">•</div>
              <div className="text-white/80">Nationwide Delivery</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
