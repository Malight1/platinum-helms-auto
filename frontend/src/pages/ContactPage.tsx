import { useState } from "react";
import { toast } from "sonner";
import api, { ApiError } from "@/lib/api";
import { Reveal } from "../components/motion/Reveal";
import { Button } from "../components/button";
import { Card } from "../components/card";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { Textarea } from "../components/textarea";
import { Spinner } from "../components/feedback/StateViews";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

const initialForm = { name: "", email: "", phone: "", subject: "", message: "" };

const contactCards = [
  { Icon: Phone, title: "Phone / WhatsApp", lines: ["+1 (780) 884-0893"] },
  { Icon: Mail, title: "Email", lines: ["info@platinumhelms.com", "sales@platinumhelms.com"] },
  { Icon: MapPin, title: "Address", lines: ["Km 74 Ikota Lekki Expressway"] },
  { Icon: Clock, title: "Business Hours", lines: ["Mon – Fri: 9am – 7pm", "Sat: 10am – 6pm · Sun: Closed"] },
];

export function ContactPage() {
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const phoneNumber = "17808840893";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    "Hello! I have a question about Platinum Helms.",
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      await api.leads.submitContact(formData);
      setIsSubmitted(true);
      setFormData(initialForm);
      toast.success("Message sent — we'll be in touch shortly.");
    } catch (err) {
      const message = err instanceof ApiError || err instanceof Error ? err.message : "Unable to send message";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-obsidian py-24 pt-32 sm:py-28 sm:pt-36 lg:pt-40">
        <div className="absolute inset-0 bg-gradient-to-br from-obsidian via-obsidian to-slate-deep" />
        <div className="pointer-events-none absolute -top-20 left-1/4 h-80 w-96 -translate-x-1/2 rounded-full bg-brand/10 blur-3xl" />
        <div className="pointer-events-none absolute right-1/4 top-0 h-64 w-80 rounded-full bg-brand/8 blur-3xl" />
        {/* Subtle grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.4) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <Reveal className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand">
            Get In Touch
          </span>
          <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl">
            Let's Start a Conversation
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-white/70 sm:text-lg">
            Our team of automotive experts is ready to help you find, finance, or import your dream vehicle.
          </p>
          {/* Quick contact chips */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="tel:+17808840893" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:border-white/40 hover:bg-white/10">
              <Phone className="size-3.5" /> +1 (780) 884-0893
            </a>
            <a href="mailto:info@platinumhelms.com" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:border-white/40 hover:bg-white/10">
              <Mail className="size-3.5" /> info@platinumhelms.com
            </a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#25D366]/30 bg-[#25D366]/10 px-4 py-2 text-sm text-[#25D366] transition hover:bg-[#25D366]/20">
              <MessageCircle className="size-3.5" /> WhatsApp
            </a>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Info */}
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground">Get In Touch</h2>
            <p className="mt-3 max-w-md text-muted-foreground">
              Whether you're looking to purchase, import, or finance your dream vehicle, our team is here to help.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {contactCards.map(({ Icon, title, lines }) => (
                <Card key={title} className="rounded-2xl border-border p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand text-white">
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-sans text-sm font-semibold text-foreground">{title}</h3>
                      <div className="mt-0.5 space-y-0.5">
                        {lines.map((l) => (
                          <p key={l} className="break-words text-sm text-muted-foreground">{l}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Form */}
          <Card className="rounded-2xl border-border p-8">
            <h2 className="font-display text-3xl font-bold text-foreground">Send Us a Message</h2>
            {isSubmitted ? (
              <div className="py-10 text-center">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <CheckCircle2 className="size-8" />
                </div>
                <h3 className="font-display text-2xl font-semibold text-foreground">Message Sent!</h3>
                <p className="mt-2 text-muted-foreground">Thank you for reaching out. We'll get back to you shortly.</p>
                <div className="mt-6">
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <Button className="gap-2 bg-[#25D366] text-white hover:bg-[#20BA5A]">
                      <MessageCircle className="size-4" /> Chat on WhatsApp
                    </Button>
                  </a>
                </div>
                <Button variant="ghost" className="mt-3" onClick={() => setIsSubmitted(false)}>
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                {error && (
                  <div role="alert" className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" name="name" required value={formData.name} onChange={handleChange} placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="john@example.com" />
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+1 (780) 884-0893" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input id="subject" name="subject" required value={formData.subject} onChange={handleChange} placeholder="How can we help?" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea id="message" name="message" required rows={5} value={formData.message} onChange={handleChange} placeholder="Tell us more about your inquiry…" />
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full gap-2 bg-brand hover:bg-brand-strong">
                  {isSubmitting ? <><Spinner size={16} className="text-white" /> Sending…</> : <><Send className="size-4" /> Send Message</>}
                </Button>

                <div className="relative py-1 text-center">
                  <span className="bg-card px-3 text-sm text-muted-foreground">or</span>
                  <div className="absolute inset-x-0 top-1/2 -z-10 border-t border-border" />
                </div>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block">
                  <Button type="button" className="w-full gap-2 bg-[#25D366] text-white hover:bg-[#20BA5A]">
                    <MessageCircle className="size-4" /> Chat on WhatsApp
                  </Button>
                </a>
              </form>
            )}
          </Card>
        </div>
      </section>

      {/* Map */}
      <section className="bg-obsidian-soft py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-8 text-center">
            <h2 className="font-display text-3xl font-bold text-white">Visit Our Showroom</h2>
          </Reveal>
          <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
            <iframe
              title="Platinum Helms showroom location"
              src="https://www.google.com/maps?q=Ikota+Lekki+Expressway+Lagos&output=embed"
              className="h-96 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
