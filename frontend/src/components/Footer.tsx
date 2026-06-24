import { Facebook, Instagram, MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import logoImage from "../assets/logo.png";

function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.02a8.23 8.23 0 004.82 1.55V7.12a4.85 4.85 0 01-1.05-.43z" />
    </svg>
  );
}

const socials = [
  { Icon: Facebook, label: "Facebook", href: "https://www.facebook.com/platinumhelmsautos" },
  { Icon: Instagram, label: "Instagram", href: "https://www.instagram.com/platinumhelmsautos" },
  { Icon: TikTokIcon, label: "TikTok", href: "https://www.tiktok.com/@platinumhelmsautos" },
];

const columns = [
  {
    title: "Explore",
    links: [
      { label: "Purchase a Vehicle", to: "/purchase" },
      { label: "Importation Service", to: "/importation" },
      { label: "Auto Financing", to: "/financing" },
      { label: "About Us", to: "/about" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", to: "/contact" },
      { label: "Book a Test Drive", to: "/contact" },
      { label: "Owner Support", to: "/contact" },
      { label: "Find a Dealer", to: "/contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-obsidian text-white">
      {/* subtle brand glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-brand/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-5">
            <img src={logoImage} alt="Platinum Helms" className="h-14 w-auto object-contain" />
            <p className="max-w-xs text-sm leading-relaxed text-white/60">
              Redefining the luxury automotive experience — premium vehicles, bespoke importation, and
              financing built around you.
            </p>
            <div className="space-y-2 text-sm text-white/60">
              <p className="flex items-center gap-2">
                <MapPin size={15} className="text-brand" /> Km 74 Ikota Lekki Expressway
              </p>
              <a href="tel:+2347043974796" className="flex items-center gap-2 transition-colors hover:text-white">
                <Phone size={15} className="text-brand" /> +234 7043974796
              </a>
              <a href="tel:+2348065779519" className="flex items-center gap-2 transition-colors hover:text-white">
                <Phone size={15} className="text-brand" /> +234 8065779519
              </a>
              <a href="mailto:info@platinumhelms.com" className="flex items-center gap-2 transition-colors hover:text-white">
                <Mail size={15} className="text-brand" /> info@platinumhelms.com
              </a>
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-5 font-sans text-sm font-semibold uppercase tracking-widest text-white/80">
                {col.title}
              </h3>
              <ul className="space-y-3 text-sm text-white/60">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="transition-colors hover:text-brand">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Connect */}
          <div>
            <h3 className="mb-5 font-sans text-sm font-semibold uppercase tracking-widest text-white/80">
              Connect
            </h3>
            <div className="flex gap-3">
              {socials.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all hover:border-brand hover:bg-brand hover:text-white"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm text-white/50">
            © {new Date().getFullYear()} Platinum Helms Autos. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-white/50">
            <a href="#" className="transition-colors hover:text-white">Privacy Policy</a>
            <a href="#" className="transition-colors hover:text-white">Terms of Service</a>
            <a href="#" className="transition-colors hover:text-white">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
