'use client'

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowDown, ArrowUpRight, Check, Loader2, Mail, MapPin, Menu, MessageCircle, Phone, Quote, X, AlertCircle,
} from "lucide-react";

/* Setup notes
 * - Add to index.html: <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400&family=Instrument+Sans:wght@400;500&display=swap" rel="stylesheet">
 * - tailwind.config: fontFamily { serif: ['Fraunces', 'serif'], sans: ['Instrument Sans', 'sans-serif'] }
 * - Palette used: bone #F3EFE8, charcoal #24221F, stone #8C857A, sand #D9CFC0, clay-umber #7A5C45
 * - Images are Unsplash URLs; swap for your own optimized files (WebP/AVIF) in production.
 */

const STUDIO = { name: "Studio Vantage", phone: "+91 9029294040", wa: "9029294040", email: "ar.vrutikagohil@gmail.com", address: "Sector-7, Shantinagar, Mira Road East, Maharashtra, India, Mumbai 401107." };
const img = (id: string, w = 1600) => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=75&w=${w}`;

const IMAGES = {
  hero: "/hero.jpeg",
  p1: img("photo-1600596542815-ffad4c1539a9"),
  p2: img("photo-1486406146926-c627a92ad1ab"),
  p3: img("photo-1618221195710-dd6b41faaea6"),
  p4: img("photo-1613490493576-7fde63acd811"),
  p5: img("photo-1600607687939-ce8a6c25118c"),
};

// const NAV = [["Projects", "#projects"], ["Services", "#services"], ["Approach", "#approach"], ["Voices", "#voices"], ["Contact", "#contact"]] as const;
const NAV = [["Contact", "#contact"]] as const;

const PROJECTS = [
  { title: "House of Terraces", place: "Alibaug", cat: "Residential", src: IMAGES.p1, cls: "md:col-span-7 aspect-[4/3]" },
  { title: "Meridian Works HQ", place: "Bengaluru", cat: "Commercial", src: IMAGES.p2, cls: "md:col-span-5 aspect-[4/5] md:mt-24" },
  { title: "Linen Residence", place: "Mumbai", cat: "Interiors", src: IMAGES.p3, cls: "md:col-span-5 aspect-[4/5]" },
  { title: "Courtyard Villa Renewal", place: "Goa", cat: "Renovation", src: IMAGES.p4, cls: "md:col-span-7 aspect-[4/3] md:mt-24" },
];

const SERVICES = [
  ["Architectural design", "Concept to construction drawings, shaped around light, climate and site."],
  ["Residential architecture", "Private homes and villas planned around how a family actually lives."],
  ["Commercial architecture", "Offices, retail and hospitality that carry a brand through space."],
  ["Interior design", "Materials, joinery and furniture detailed as one composed whole."],
  ["Space planning", "Layouts that make every square metre work harder."],
  ["3D visualization", "Photoreal renders and walkthroughs before a single brick is laid."],
  ["Renovation and remodeling", "Honest upgrades that respect what a building already does well."],
  ["Project consultation", "Feasibility, budgeting and design review for early-stage ideas."],
];

const REASONS = [
  ["One studio, start to finish", "Architecture, interiors and visualization sit under one roof, so nothing is lost between disciplines."],
  ["Drawn before it's built", "You see the finished space in detail before construction begins, which keeps changes cheap."],
  ["Honest about cost", "Budgets are tested at every stage and reported in plain language."],
];

const TESTIMONIALS = [
  ["They listened for weeks before drawing a line. The house feels like it was always meant to sit on that hill.", "Meera & Rohan Kapoor", "House of Terraces"],
  ["Our team moved in on schedule and the space still gets compliments from every client who visits.", "Daniel Fernandes", "Meridian Works HQ"],
  ["Calm, precise and generous with ideas. The renovation gave our family home a second life.", "Aisha Rahman", "Courtyard Villa Renewal"],
];

const MILESTONES = [["18", "years of practice"], ["240+", "completed projects"], ["31", "design awards"], ["12", "architects and designers"]];

/* ---------- reusable pieces ---------- */

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setShown(true);
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setShown(true), io.disconnect()), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, shown] as const;
}

function Photo({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");
  return (
    <div className={`relative overflow-hidden bg-[#D9CFC0] ${className}`}>
      {state !== "error" && (
        <img
          src={src} alt={alt} loading="lazy" decoding="async"
          onLoad={() => setState("ok")} onError={() => setState("error")}
          className={`h-full w-full object-cover transition duration-[1200ms] ease-out group-hover:scale-[1.04] ${state === "ok" ? "opacity-100" : "opacity-0"}`}
        />
      )}
      {state === "loading" && <div className="absolute inset-0 animate-pulse bg-[#D9CFC0]" />}
      {state === "error" && <div className="absolute inset-0 grid place-items-center text-sm text-[#8C857A]">Image unavailable</div>}
    </div>
  );
}

function Section({ id, children, className = "" }: { id?: string; children: ReactNode; className?: string }) {
  return <section id={id} className={`scroll-mt-20 px-6 py-24 md:px-12 md:py-36 ${className}`}>{children}</section>;
}

/* ---------- page ---------- */

export default function Home() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [filter, setFilter] = useState("All");
  const [heroIn, setHeroIn] = useState(false);
  // Fixed value for the prerender, updated to the real year on the client after mount.
  const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
    document.documentElement.style.scrollBehavior = "smooth";
    document.title = `${STUDIO.name} | Architecture and Interior Design Studio`;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const t = setTimeout(() => setHeroIn(true), 60);
    return () => { window.removeEventListener("scroll", onScroll); clearTimeout(t); };
  }, []);

  const shown = PROJECTS.filter((p) => filter === "All" || p.cat === filter);
  const [projRef, projIn] = useReveal<HTMLDivElement>();

  return (
    <div className="bg-[#F3EFE8] font-sans text-[#24221F] antialiased selection:bg-[#24221F] selection:text-[#F3EFE8]">
      {/* Header */}
      <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${scrolled || open ? "bg-[#F3EFE8]/90 text-[#24221F] backdrop-blur" : "text-white"}`}>
        <nav className="flex h-16 items-center justify-between px-6 md:px-12" aria-label="Main">
          <a href="#top" className="font-serif text-xl tracking-tight">{STUDIO.name}</a>
          <ul className="hidden gap-10 text-sm md:flex">
            {NAV.map(([l, h]) => <li key={h}><a href={h} className="underline-offset-8 hover:underline">{l}</a></li>)}
          </ul>
          <button className="md:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"}>
            {open ? <X /> : <Menu />}
          </button>
        </nav>
        {open && (
          <ul className="space-y-1 border-t border-[#24221F]/10 px-6 pb-8 pt-4 md:hidden">
            {NAV.map(([l, h]) => (
              <li key={h}><a href={h} onClick={() => setOpen(false)} className="block py-3 font-serif text-3xl font-light">{l}</a></li>
            ))}
          </ul>
        )}
      </header>

      <main id="top">
        {/* Hero */}
        <div className="relative flex min-h-[100svh] items-end overflow-hidden bg-[#24221F] text-white">
          <img
            src={IMAGES.hero} alt="Concrete and glass facade photographed at dusk"
            className={`absolute inset-0 h-full w-full object-cover transition-[transform,opacity] duration-[2400ms] ease-out ${heroIn ? "scale-100 opacity-70" : "scale-110 opacity-0"}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#24221F] via-[#24221F]/30 to-[#24221F]/40" />
          <div className="relative w-full px-6 pb-16 md:px-12 md:pb-24">
            <h1 className={`max-w-5xl font-serif text-[clamp(2.75rem,8vw,7.5rem)] font-light leading-[0.98] tracking-tight transition-all duration-1000 delay-300 ${heroIn ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
              Designing Spaces.<br />Creating Experiences.
            </h1>
            <div className="mt-10 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
              <p className="max-w-md text-base leading-relaxed text-white/80">
                {STUDIO.name} is an architecture and interior studio in Mumbai. We design homes, workplaces and public spaces that are rooted in their place and built to last.
              </p>
              <div className="flex flex-wrap gap-3">
                {/* <a href="#projects" className="bg-[#F3EFE8] px-7 py-4 text-sm font-medium text-[#24221F] transition hover:bg-white">Explore our projects</a> */}
                <a href="#projects" className="bg-[#F3EFE8] px-7 py-4 text-sm font-medium text-[#24221F] transition hover:bg-white">Coming Soon</a>
                <a href="#contact" className="border border-white/50 px-7 py-4 text-sm font-medium transition hover:bg-white hover:text-[#24221F]">Discuss your project</a>
              </div>
            </div>
          </div>
          <ArrowDown className="absolute right-6 top-1/2 hidden animate-bounce text-white/60 md:right-12 md:block" size={20} aria-hidden />
        </div>

        {/* Milestones */}
        {/* <div className="grid grid-cols-2 gap-y-10 border-b border-[#24221F]/15 px-6 py-14 md:grid-cols-4 md:px-12">
          {MILESTONES.map(([n, l]) => (
            <div key={l}><p className="font-serif text-5xl font-light">{n}</p><p className="mt-1 text-sm text-[#8C857A]">{l}</p></div>
          ))}
        </div> */}

        {/* Projects */}
        {/* <Section id="projects">
          <div className="mb-14 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-xl font-serif text-4xl font-light leading-tight md:text-6xl">Selected work</h2>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm" role="tablist" aria-label="Filter projects">
              {["All", "Residential", "Commercial", "Interiors", "Renovation"].map((c) => (
                <button key={c} role="tab" aria-selected={filter === c} onClick={() => setFilter(c)}
                  className={`border-b pb-1 transition ${filter === c ? "border-[#24221F]" : "border-transparent text-[#8C857A] hover:text-[#24221F]"}`}>{c}</button>
              ))}
            </div>
          </div>
          <div ref={projRef} className={`grid gap-x-8 gap-y-14 transition-opacity duration-1000 md:grid-cols-12 ${projIn ? "opacity-100" : "opacity-0"}`}>
            {shown.length === 0 && <p className="col-span-12 text-[#8C857A]">No projects in this category yet.</p>}
            {shown.map((p) => (
              <a key={p.title} href={`#project-${p.title.toLowerCase().replace(/\s+/g, "-")}`} className={`group block ${p.cls.split(" ").filter((c) => c.startsWith("md:col") || c.startsWith("md:mt")).join(" ")}`}>
                <Photo src={p.src} alt={`${p.title}, ${p.cat.toLowerCase()} project in ${p.place}`} className={p.cls.split(" ").find((c) => c.startsWith("aspect")) ?? ""} />
                <div className="mt-4 flex items-start justify-between">
                  <div><h3 className="font-serif text-2xl font-light">{p.title}</h3><p className="text-sm text-[#8C857A]">{p.cat}, {p.place}</p></div>
                  <ArrowUpRight className="mt-1 transition group-hover:-translate-y-1 group-hover:translate-x-1" size={20} />
                </div>
              </a>
            ))}
          </div>
        </Section> */}

        {/* Services */}
        {/* <Section id="services" className="bg-[#24221F] text-[#F3EFE8]">
          <div className="grid gap-16 md:grid-cols-12">
            <h2 className="font-serif text-4xl font-light leading-tight md:col-span-4 md:text-6xl">What we do</h2>
            <ul className="divide-y divide-white/15 md:col-span-8">
              {SERVICES.map(([t, d]) => (
                <li key={t}>
                  <a href="#contact" className="group grid gap-2 py-6 md:grid-cols-[1fr_1.2fr_auto] md:items-center md:gap-8">
                    <h3 className="font-serif text-2xl font-light">{t}</h3>
                    <p className="text-sm leading-relaxed text-white/60">{d}</p>
                    <span className="flex items-center gap-1 text-sm text-[#D9CFC0] opacity-70 transition group-hover:opacity-100">Enquire <ArrowUpRight size={16} /></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Section> */}

        {/* Approach */}
        {/* <Section id="approach">
          <div className="grid items-center gap-16 md:grid-cols-2">
            <Photo src={IMAGES.p5} alt="Sunlit interior with timber and stone finishes" className="group aspect-[4/5]" />
            <div>
              <h2 className="font-serif text-4xl font-light leading-tight md:text-6xl">Why people choose us</h2>
              <dl className="mt-12 space-y-10">
                {REASONS.map(([t, d]) => (
                  <div key={t} className="border-t border-[#24221F]/20 pt-6"><dt className="font-serif text-2xl font-light">{t}</dt><dd className="mt-2 max-w-md leading-relaxed text-[#5E584F]">{d}</dd></div>
                ))}
              </dl>
            </div>
          </div>
        </Section> */}

        {/* Testimonials */}
        {/* <Section id="voices" className="bg-[#E7DFD2]">
          <h2 className="mb-14 font-serif text-4xl font-light md:text-6xl">In our clients' words</h2>
          <div className="grid gap-12 md:grid-cols-3">
            {TESTIMONIALS.map(([q, n, p]) => (
              <figure key={n}>
                <Quote className="mb-4 text-[#7A5C45]" size={24} aria-hidden />
                <blockquote className="font-serif text-xl font-light leading-relaxed">{q}</blockquote>
                <figcaption className="mt-6 text-sm"><span className="font-medium">{n}</span><br /><span className="text-[#8C857A]">{p}</span></figcaption>
              </figure>
            ))}
          </div>
        </Section> */}

        {/* Contact */}
        <Section id="contact">
          <div className="grid gap-16 md:grid-cols-12">
            <div className="md:col-span-5">
              <h2 className="font-serif text-4xl font-light leading-tight md:text-6xl">Let's talk about your site.</h2>
              <ul className="mt-10 space-y-4 text-[#5E584F]">
                <li className="flex gap-3"><Phone size={18} className="mt-1 shrink-0" /><a href={`tel:${STUDIO.phone.replace(/\s/g, "")}`} className="hover:text-[#24221F]">{STUDIO.phone}</a></li>
                <li className="flex gap-3"><Mail size={18} className="mt-1 shrink-0" /><a href={`mailto:${STUDIO.email}`} className="hover:text-[#24221F]">{STUDIO.email}</a></li>
                <li className="flex gap-3"><MapPin size={18} className="mt-1 shrink-0" />{STUDIO.address}</li>
              </ul>
              <a href={`https://wa.me/${STUDIO.wa}?text=${encodeURIComponent("Hello, I'd like to discuss an architecture project.")}`} target="_blank" rel="noopener noreferrer"
                className="mt-10 inline-flex items-center gap-2 border border-[#24221F] px-6 py-3 text-sm transition hover:bg-[#24221F] hover:text-[#F3EFE8]">
                <MessageCircle size={18} /> Chat on WhatsApp
              </a>
              <iframe title="Studio location" loading="lazy" className="mt-10 h-56 w-full grayscale"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(STUDIO.address)}&output=embed`} />
            </div>
            <div className="md:col-span-7"><EnquiryForm /></div>
          </div>
        </Section>
      </main>

      <footer className="flex flex-col gap-4 bg-[#24221F] px-6 py-10 text-sm text-white/60 md:flex-row md:justify-between md:px-12">
        <p className="font-serif text-lg text-white">{STUDIO.name}</p>
        <p>&copy; {year} {STUDIO.name}. All rights reserved.</p>
      </footer>
    </div>
  );
}

/* ---------- enquiry form ---------- */

type Status = "idle" | "sending" | "sent" | "error";

function EnquiryForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const v = Object.fromEntries(f) as Record<string, string>;
    const errs: Record<string, string> = {};
    if (!v.name?.trim()) errs.name = "Enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(v.email ?? "")) errs.email = "Enter a valid email address.";
    if (v.phone && !/^[+\d][\d\s-]{6,}$/.test(v.phone)) errs.phone = "Enter a valid phone number.";
    if (!v.message?.trim() || v.message.trim().length < 10) errs.message = "Tell us a little about the project (10+ characters).";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setStatus("sending");
    try {
      // Replace with your endpoint (Formspree, Resend, your API route...)
      const res = await fetch("/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(v) });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent")
    return (
      <div role="status" className="flex h-full min-h-[24rem] flex-col items-start justify-center border border-[#24221F]/20 p-10">
        <Check className="mb-4 text-[#7A5C45]" size={32} />
        <h3 className="font-serif text-3xl font-light">Enquiry sent</h3>
        <p className="mt-2 max-w-sm text-[#5E584F]">Thank you. A member of our studio will reply within two working days.</p>
        <button onClick={() => setStatus("idle")} className="mt-6 text-sm underline underline-offset-4">Send another enquiry</button>
      </div>
    );

  const field = "w-full border-0 border-b border-[#24221F]/30 bg-transparent py-3 outline-none transition focus:border-[#24221F]";
  const Err = ({ k }: { k: string }) => (errors[k] ? <p className="mt-1 text-sm text-[#9B3B2E]">{errors[k]}</p> : null);

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-8 md:grid-cols-2">
      <label className="block text-sm">Name<input name="name" autoComplete="name" className={field} /><Err k="name" /></label>
      <label className="block text-sm">Email<input name="email" type="email" autoComplete="email" className={field} /><Err k="email" /></label>
      <label className="block text-sm">Phone<input name="phone" type="tel" autoComplete="tel" className={field} /><Err k="phone" /></label>
      <label className="block text-sm">Service required
        <select name="service" defaultValue="" className={field}>
          <option value="" disabled>Select a service</option>
          {SERVICES.map(([t]) => <option key={t}>{t}</option>)}
        </select>
      </label>
      <label className="block text-sm md:col-span-2">Project description
        <textarea name="message" rows={5} className={field} placeholder="Location, size, timeline and budget range help us respond well." /><Err k="message" />
      </label>
      {status === "error" && (
        <p role="alert" className="flex items-start gap-2 text-sm text-[#9B3B2E] md:col-span-2">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          We couldn't send your enquiry. Check your connection and try again, or reach us on WhatsApp or by email.
        </p>
      )}
      <div className="md:col-span-2">
        <button disabled={status === "sending"} className="inline-flex items-center gap-2 bg-[#24221F] px-8 py-4 text-sm font-medium text-[#F3EFE8] transition hover:bg-[#3a3631] disabled:opacity-60">
          {status === "sending" && <Loader2 className="animate-spin" size={16} />}
          {status === "sending" ? "Sending" : "Send enquiry"}
        </button>
      </div>
    </form>
  );
}
