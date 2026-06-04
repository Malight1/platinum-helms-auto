import { ImageWithFallback } from "../components/ImageWithFallback";
import { Button } from "../components/button";
import { Card } from "../components/card";
import { Users, Award, Globe, Heart, Target, Zap } from "lucide-react";
import phblack from "../assets/phblack.png";
import phred from "../assets/phred.png";
import phwhite from "../assets/phwhite.png";
import mrugo from "../assets/mrugo.jpg";

interface AboutUsPageProps {
  onNavigate: (page: string) => void;
}

export function AboutUsPage({ onNavigate }: AboutUsPageProps) {
  const values = [
    {
      icon: Award,
      title: "Excellence",
      description: "We maintain the highest standards in every vehicle we offer and every service we provide.",
    },
    {
      icon: Heart,
      title: "Passion",
      description: "Our love for luxury automobiles drives us to deliver exceptional experiences.",
    },
    {
      icon: Users,
      title: "Customer First",
      description: "Your satisfaction and trust are at the center of everything we do.",
    },
    {
      icon: Target,
      title: "Integrity",
      description: "Transparent, honest relationships built on trust and reliability.",
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Embracing cutting-edge technology to enhance your automotive journey.",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Access to the world's finest vehicles through our international network.",
    },
  ];

  const stats = [
    { number: "15+", label: "Years of Excellence" },
    { number: "10K+", label: "Happy Customers" },
    { number: "50+", label: "Premium Brands" },
    { number: "98%", label: "Satisfaction Rate" },
  ];

  const team = [
    {
      name: "Michael Chen",
      role: "Chief Executive Officer",
      image: phblack,
    },
    {
      name: "Sarah Williams",
      role: "Director of Operations",
      image: phred,
    },
    {
      name: "David Rodriguez",
      role: "Head of Customer Relations",
      image: phwhite,
    },
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <section className="relative h-[600px]">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={phblack}
            alt="About Platinum Helms"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
        </div>

        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl">
              <h1 className="text-white mb-6 text-[64px] font-bold font-[Roboto] tracking-tight leading-tight">Redefining Luxury Automotive Excellence</h1>
              <p className="text-white/90 text-xl leading-relaxed">
                For over 15 years, we've been connecting discerning clients with the
                world's finest luxury vehicles, delivering exceptional experiences at
                every turn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl mb-3">{stat.number}</div>
                <p className="text-white/70 tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Founded in 2010, Platinum Helms began with a simple vision: to make
                  luxury automotive excellence accessible to those who appreciate the
                  finer things in life. What started as a boutique dealership has
                  evolved into a premier destination for luxury vehicle acquisition.
                </p>
                <p>
                  Our journey has been defined by an unwavering commitment to
                  excellence, transparency, and personalized service. We've built our
                  reputation on understanding that purchasing a luxury vehicle is more
                  than a transaction•it's an experience that should be as exceptional
                  as the vehicle itself.
                </p>
                <p>
                  Today, we serve clients across the nation and internationally,
                  offering an exclusive selection of the world's most prestigious
                  automotive brands. Our team of specialists brings decades of
                  combined experience, ensuring every client receives expert guidance
                  throughout their journey.
                </p>
              </div>
            </div>

            <div className="relative h-[800px] rounded-lg overflow-hidden shadow-xl">
              <ImageWithFallback
                src={mrugo}
                alt="Our facility"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4">Our Core Values</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              The principles that guide everything we do and define who we are.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="p-8 border-none shadow-sm hover:shadow-md transition-shadow text-center">
                  <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Card className="p-12 bg-gradient-to-br from-gray-900 to-black text-white border-none">
              <Target className="mb-6" size={40} />
              <h2 className="text-white mb-6">Our Mission</h2>
              <p className="text-white/90 leading-relaxed">
                To provide an unparalleled luxury automotive experience by combining
                world-class vehicles, expert guidance, and personalized service that
                exceeds expectations at every touchpoint.
              </p>
            </Card>

            <Card className="p-12 bg-gradient-to-br from-gray-100 to-gray-50 border-none">
              <Zap className="mb-6 text-black" size={40} />
              <h2 className="mb-6">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                To be the most trusted and respected name in luxury automotive sales
                and services, setting new standards for excellence and innovation in
                the industry worldwide.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4">Meet Our Leadership</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Experienced professionals dedicated to delivering exceptional service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
                <div className="h-80 bg-gray-200">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="mb-2">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4">What Our Clients Say</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Don't just take our word for it•hear from satisfied clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 border-none shadow-sm">
              <div className="mb-6">
                <div className="flex text-yellow-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="text-gray-600 italic">
                  "The entire experience was exceptional. From selection to delivery,
                  the team made the process seamless and enjoyable."
                </p>
              </div>
              <div>
                <p>James Morrison</p>
                <p className="text-sm text-gray-500">Purchased S-Class</p>
              </div>
            </Card>

            <Card className="p-8 border-none shadow-sm">
              <div className="mb-6">
                <div className="flex text-yellow-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="text-gray-600 italic">
                  "Their import service exceeded my expectations. They handled
                  everything professionally and kept me informed throughout."
                </p>
              </div>
              <div>
                <p>Emily Richardson</p>
                <p className="text-sm text-gray-500">Imported from Europe</p>
              </div>
            </Card>

            <Card className="p-8 border-none shadow-sm">
              <div className="mb-6">
                <div className="flex text-yellow-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="text-gray-600 italic">
                  "Best financing experience I've had. Transparent, fair, and
                  incredibly helpful in finding the perfect terms."
                </p>
              </div>
              <div>
                <p>Robert Chen</p>
                <p className="text-sm text-gray-500">Financed AMG GT</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-white mb-6">Ready to Start Your Journey?</h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Experience the Platinum Helms difference. Let us help you find your perfect
            luxury vehicle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => onNavigate("purchase")}
              className="bg-white text-black hover:bg-gray-200"
              size="lg"
            >
              Browse Our Collection
            </Button>
            <Button
              variant="outline"
              className="bg-white text-black border-2 border-white"
              size="lg"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}