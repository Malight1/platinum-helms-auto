import { Menu, X, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "./ui/utils";
import logoImage from "../assets/logo.png";

const navItems = [
  { id: "/home", label: "Home" },
  { id: "/purchase", label: "Purchase" },
  { id: "/importation", label: "Importation" },
  { id: "/financing", label: "Financing" },
  { id: "/about", label: "About Us" },
  { id: "/contact", label: "Contact" },
];

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes
  useEffect(() => setIsMobileMenuOpen(false), [location.pathname]);

  const handleLogoClick = () => {
    const next = logoClickCount + 1;
    setLogoClickCount(next);
    if (next >= 5) {
      navigate("/admin");
      setLogoClickCount(0);
    } else {
      navigate("/home");
    }
  };

  const isActive = (path: string) =>
    location.pathname === path || (path === "/home" && location.pathname === "/");

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "glass-dark border-b border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
          : "border-b border-transparent bg-gradient-to-b from-black/70 to-transparent",
      )}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button
          onClick={handleLogoClick}
          aria-label="Platinum Helms — home"
          className="flex shrink-0 items-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <img src={logoImage} alt="Platinum Helms" className="h-12 w-auto object-contain sm:h-14" />
        </button>

        {/* Desktop links */}
        <div className="hidden items-center gap-9 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.id}
              className={cn(
                "relative text-sm tracking-wide transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-px after:bg-brand after:transition-all after:duration-300",
                isActive(item.id)
                  ? "font-semibold text-white after:w-full"
                  : "font-medium text-white/65 hover:text-white after:w-0 hover:after:w-full",
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/coming-soon"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2 text-sm font-medium tracking-wide text-white shadow-luxe transition-colors hover:bg-brand-strong"
          >
            <Sparkles size={14} />
            Coming Soon
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="rounded-md p-2 text-white outline-none focus-visible:ring-2 focus-visible:ring-brand md:hidden"
          onClick={() => setIsMobileMenuOpen((v) => !v)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden glass-dark md:hidden"
          >
            <div className="space-y-1 px-4 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.id}
                  className={cn(
                    "block rounded-lg px-4 py-3 text-sm tracking-wide transition-colors",
                    isActive(item.id)
                      ? "bg-white/10 text-white"
                      : "text-white/70 hover:bg-white/5 hover:text-white",
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/coming-soon"
                className="mt-2 flex items-center justify-center gap-2 rounded-full bg-brand px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-strong"
              >
                <Sparkles size={14} />
                Coming Soon
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
