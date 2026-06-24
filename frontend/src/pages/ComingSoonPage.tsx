import { useState, useEffect } from "react";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Card } from "../components/card";
import { Badge } from "../components/badge";
import { 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Bell, 
  CheckCircle, 
  Star,
  Users,
  Gift,
  Rocket,
  Mail
} from "lucide-react";
import { motion } from "framer-motion";

interface ComingSoonPageProps {
  onNavigate: (page: string) => void;
}

export function ComingSoonPage({ onNavigate }: ComingSoonPageProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 45,
    hours: 12,
    minutes: 34,
    seconds: 56
  });
  const [particlePositions, setParticlePositions] = useState<{x: number, y: number, delay: number}[]>([]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              hours = 23;
              if (days > 0) {
                days--;
              }
            }
          }
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Generate floating particles
  useEffect(() => {
    const particles = Array.from({ length: 20 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5
    }));
    setParticlePositions(particles);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  const benefits = [
    { icon: Gift, title: "Exclusive Early Access", desc: "Be the first to experience our new features" },
    { icon: Star, title: "VIP Member Perks", desc: "Special pricing and premium benefits" },
    { icon: Zap, title: "Priority Support", desc: "Direct line to our expert team" },
    { icon: Users, title: "Community Access", desc: "Join our exclusive members club" }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1707407772603-274cc5cf18f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzZWRhbiUyMGRyaXZpbmd8ZW58MXx8fHwxNzYxNjk4NjE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Coming soon background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
      </div>

      {/* Floating Particles */}
      {particlePositions.map((particle, index) => (
        <motion.div
          key={index}
          className="absolute w-1 h-1 bg-red-600 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(239, 68, 68, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(239, 68, 68, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="cursor-pointer"
              onClick={() => onNavigate("home")}
            >
              <h1 className="text-3xl tracking-wider">PLATINUM HELMS</h1>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="bg-red-600 hover:bg-red-700 text-white border-none px-4 py-2">
                <Rocket size={14} className="mr-2" />
                Coming Soon
              </Badge>
            </motion.div>
          </div>
        </header>

        {/* Main Content */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            {/* Animated Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block mb-8"
            >
              <Badge className="bg-red-600/20 border-red-600 text-red-400 px-6 py-3 text-sm">
                <Sparkles size={16} className="mr-2" />
                SOMETHING EXTRAORDINARY IS COMING
              </Badge>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-7xl"
            >
              <span className="bg-gradient-to-r from-white via-gray-200 to-red-600 bg-clip-text text-transparent">
                The Future
              </span>
              <br />
              <span className="text-white">of Luxury Awaits</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mb-12 max-w-3xl mx-auto text-base leading-relaxed text-gray-400 sm:text-lg md:text-xl"
            >
              We're crafting an unprecedented automotive experience. Join the waitlist for exclusive early access and VIP benefits.
            </motion.p>

            {/* Countdown Timer */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mb-16"
            >
              <p className="text-gray-500 uppercase tracking-widest text-sm mb-6">Launch Countdown</p>
              <div className="grid grid-cols-4 gap-4 md:gap-8 max-w-3xl mx-auto">
                {[
                  { label: "Days", value: timeLeft.days },
                  { label: "Hours", value: timeLeft.hours },
                  { label: "Minutes", value: timeLeft.minutes },
                  { label: "Seconds", value: timeLeft.seconds }
                ].map((item) => (
                  <motion.div
                    key={item.label}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="relative"
                  >
                    <div className="bg-gradient-to-b from-gray-900 to-black border border-red-600/30 rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg shadow-red-600/20">
                      <div className="text-3xl sm:text-4xl md:text-6xl mb-1 sm:mb-2 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent font-bold">
                        {String(item.value).padStart(2, '0')}
                      </div>
                      <div className="text-[10px] sm:text-xs md:text-sm text-gray-500 uppercase tracking-wider">
                        {item.label}
                      </div>
                    </div>
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-red-600/20 blur-xl rounded-2xl opacity-50" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Waitlist Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="max-w-2xl mx-auto mb-16"
            >
              {!submitted ? (
                <Card className="bg-gradient-to-b from-gray-900 to-black border-red-600/30 p-8 md:p-12">
                  <div className="mb-6">
                    <h3 className="text-2xl md:text-3xl mb-3 text-white">Join the Exclusive Waitlist</h3>
                    <p className="text-gray-400">Be among the first 1,000 to get VIP access and special launch pricing</p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="flex-1 bg-black border-gray-800 text-white placeholder:text-gray-600 focus:border-red-600 h-14 text-lg px-6"
                      />
                      <Button
                        type="submit"
                        className="bg-red-600 hover:bg-red-700 text-white h-14 px-8 shadow-lg shadow-red-600/50 hover:shadow-red-600/70 transition-all"
                        size="lg"
                      >
                        <Bell className="mr-2" size={20} />
                        Notify Me
                        <ArrowRight className="ml-2" size={20} />
                      </Button>
                    </div>
                  </form>

                  {/* Social Proof */}
                  <div className="mt-6 flex items-center justify-center gap-2 text-gray-500 text-sm">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-red-800 border-2 border-black flex items-center justify-center text-xs">
                          {String.fromCharCode(65 + i)}
                        </div>
                      ))}
                    </div>
                    <span>Join <strong className="text-white">2,847</strong> others on the waitlist</span>
                  </div>
                </Card>
              ) : (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="bg-gradient-to-b from-gray-900 to-black border-red-600/30 p-8 md:p-12">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                      <CheckCircle size={40} className="text-white" />
                    </motion.div>
                    <h3 className="text-3xl mb-3 text-white">You're On The List!</h3>
                    <p className="text-gray-400 text-lg mb-6">
                      Get ready for something extraordinary. We'll notify you as soon as we launch.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        onClick={() => onNavigate("home")}
                        variant="outline"
                        className="bg-transparent text-white border-red-600 hover:bg-red-600 hover:text-white"
                        size="lg"
                      >
                        Explore Current Collection
                        <ArrowRight className="ml-2" size={18} />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )}
            </motion.div>

            {/* Benefits Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <h3 className="text-2xl mb-8 text-gray-400">Why Join Early?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <Card className="bg-gradient-to-b from-gray-900 to-black border-gray-800 hover:border-red-600/50 p-6 h-full transition-all">
                      <div className="w-12 h-12 bg-red-600/20 rounded-xl flex items-center justify-center mb-4">
                        <benefit.icon className="text-red-600" size={24} />
                      </div>
                      <h4 className="mb-2 text-white">{benefit.title}</h4>
                      <p className="text-gray-500 text-sm">{benefit.desc}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Interactive Teaser Cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6 }}
              className="mt-20"
            >
              <h3 className="text-2xl mb-8 text-gray-400">What to Expect</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Revolutionary Platform",
                    desc: "Experience luxury car shopping reimagined with AI-powered recommendations",
                    image: "https://images.unsplash.com/photo-1666067313311-de0a3760d884?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBmcm9udHxlbnwxfHx8fDE3NjE2NjA4MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  },
                  {
                    title: "Exclusive Collection",
                    desc: "Access to rare and limited-edition vehicles you won't find anywhere else",
                    image: "https://images.unsplash.com/photo-1541348263662-e068662d82af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBjYXIlMjBmcm9udHxlbnwxfHx8fDE3NjE2MzczODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  },
                  {
                    title: "White Glove Service",
                    desc: "Personalized concierge service from browsing to delivery and beyond",
                    image: "https://images.unsplash.com/photo-1599912027667-755b68b4dd3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjE2OTg2MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  }
                ].map((teaser, index) => (
                  <motion.div
                    key={teaser.title}
                    whileHover={{ scale: 1.03 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8 + index * 0.1 }}
                  >
                    <Card className="overflow-hidden border-none group cursor-pointer">
                      <div className="relative h-48 overflow-hidden">
                        <ImageWithFallback
                          src={teaser.image}
                          alt={teaser.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                        <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/20 transition-colors" />
                      </div>
                      <div className="p-6 bg-gradient-to-b from-gray-900 to-black">
                        <h4 className="mb-2 text-white">{teaser.title}</h4>
                        <p className="text-gray-500 text-sm">{teaser.desc}</p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Newsletter Subscribe Alternative */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 2 }}
              className="mt-20 p-8 border border-red-600/30 rounded-2xl bg-gradient-to-b from-red-600/10 to-transparent"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="text-red-600" size={24} />
                    <h3 className="text-xl text-white">Stay in the Loop</h3>
                  </div>
                  <p className="text-gray-400">
                    Get exclusive updates, sneak peeks, and behind-the-scenes content
                  </p>
                </div>
                <Button
                  onClick={() => !submitted && document.querySelector<HTMLFormElement>('form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/50 whitespace-nowrap"
                  size="lg"
                >
                  Join Waitlist
                  <ArrowRight className="ml-2" size={18} />
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-gray-500 text-sm">
                Â© 2025 Platinum Helms. All rights reserved.
              </div>
              <div className="flex gap-6">
                <Button
                  variant="ghost"
                  className="text-gray-500 hover:text-white"
                  onClick={() => onNavigate("home")}
                >
                  Back to Home
                </Button>
                <Button
                  variant="ghost"
                  className="text-gray-500 hover:text-white"
                  onClick={() => onNavigate("about")}
                >
                  About Us
                </Button>
                <Button
                  variant="ghost"
                  className="text-gray-500 hover:text-white"
                  onClick={() => onNavigate("contact")}
                >
                  Contact
                </Button>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Animated Corner Accents */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-red-600/20 blur-[100px] rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/20 blur-[100px] rounded-full"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}
