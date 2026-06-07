"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ChefHat,
  Star,
  UtensilsCrossed,
  Quote,
  Instagram,
  Facebook,
  Twitter,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

const STATS = [
  { value: "50+", label: "Events Catered" },
  { value: "6", label: "Years of Excellence" },
  { value: "60+", label: "Signature Dishes" },
  { value: "95%", label: "Client Satisfaction" },
];

const FOOD_GALLERY = [
  {
    src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80&auto=format&fit=crop",
    label: "Gourmet Platters",
  },
  {
    src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80&auto=format&fit=crop",
    label: "Fine Dining Setup",
  },
  {
    src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80&auto=format&fit=crop",
    label: "Event Catering",
  },
  {
    src: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80&auto=format&fit=crop",
    label: "Artisan Cuisine",
  },
  {
    src: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80&auto=format&fit=crop",
    label: "Fresh Ingredients",
  },
  {
    src: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80&auto=format&fit=crop",
    label: "Signature Dishes",
  },
];

const TESTIMONIALS = [
  {
    name: "Amaka O.",
    role: "Wedding Client",
    quote:
      "Bristeen transformed our reception into a culinary masterpiece. Every guest was raving about the food all night!",
    avatar: "A",
  },
  {
    name: "Tunde B.",
    role: "Corporate Events",
    quote:
      "Professional, punctual, and absolutely delicious. Our annual gala has never been the same since we found Bristeen.",
    avatar: "T",
  },
  {
    name: "Chisom N.",
    role: "Birthday Party",
    quote:
      "The online booking made planning so easy. The catering team arrived fully prepared and exceeded every expectation.",
    avatar: "C",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden font-sans select-none selection:bg-rose-500 selection:text-white relative">
      {/* ── Hero Section ── */}
      <section className="relative isolate pt-44 pb-28 px-6 md:px-12 flex flex-col items-center text-center overflow-hidden">
        {/* Background: looping event footage, with the photo as a poster while it loads */}
        <div className="absolute inset-0 -z-10">
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80&auto=format&fit=crop"
            className="w-full h-full object-cover"
          >
            <source src="/bristeen-event.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/65" />
        </div>

        <div className="max-w-7xl mx-auto flex flex-col items-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-rose-300 mb-8"
          >
            <Star className="size-4 fill-rose-500 text-rose-500" />
            <span className="font-medium">Premium Catering Services</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] text-white"
          >
            Extraordinary Taste, <br className="hidden md:block" />
            Unforgettable <span className="text-rose-500">Events.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="max-w-2xl text-lg text-neutral-400 mb-10"
          >
            From intimate gatherings to grand celebrations, Bristeen ensures
            every moment is paired with exquisite culinary mastery. Book your
            events, order gourmet food, and manage your invoices seamlessly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link
              href="/events"
              className="group flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all w-full sm:w-auto"
            >
              <span>Book an Event</span>
              <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/menu"
              className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-full font-bold text-lg border border-white/10 transition-colors w-full sm:w-auto"
            >
              <UtensilsCrossed className="size-5" />
              Order Food
            </Link>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="mt-20 flex items-stretch divide-x divide-white/10 w-full max-w-3xl"
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="flex-1 flex flex-col items-center px-2 md:px-4">
                <span className="text-2xl md:text-4xl font-bold text-white tracking-tight">
                  {stat.value}
                </span>
                <span className="mt-1.5 text-[11px] md:text-xs text-neutral-400 text-center uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Food Gallery Strip ── */}
      <section className="py-16 overflow-hidden">
        <div className="flex gap-4 animate-none">
          <motion.div
            className="flex gap-4 shrink-0"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          >
            {[...FOOD_GALLERY, ...FOOD_GALLERY].map((img, i) => (
              <div
                key={i}
                className="relative w-72 h-52 rounded-3xl overflow-hidden shrink-0 group border border-white/5"
              >
                <img
                  src={img.src}
                  alt={img.label}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-white text-sm font-bold">
                    {img.label}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Services Section ── */}
      <section className="py-24 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 skew-y-3 origin-center scale-110 -z-10" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-neutral-400">
              A completely streamlined experience for our esteemed clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                title: "Event Booking",
                description:
                  "Check availability, reserve dates, and plan large scale catering for your events seamlessly.",
                icon: CalendarDays,
                url: "/events",
                color: "text-blue-400",
                bg: "bg-blue-400/10",
                image:
                  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80&auto=format&fit=crop",
              },
              {
                title: "Gourmet Orders",
                description:
                  "Craving a specific dish? Browse our available menu, see dynamic pricing, and place food orders instantly.",
                icon: ChefHat,
                url: "/menu",
                color: "text-orange-400",
                bg: "bg-orange-400/10",
                image:
                  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80&auto=format&fit=crop",
              },
            ].map((service, index) => (
              <Link href={service.url} key={index}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="rounded-3xl bg-card/40 backdrop-blur-xl border border-white/10 hover:border-primary/30 transition-all cursor-pointer group h-full shadow-2xl overflow-hidden"
                >
                  {/* Image header */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                  </div>
                  {/* Content */}
                  <div className="p-8">
                    <div
                      className={`size-14 rounded-2xl ${service.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <service.icon className={`size-7 ${service.color}`} />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                    <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                      {service.description}
                    </p>
                    <div className="text-sm font-bold text-white flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      Explore <ArrowRight className="size-4" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Loved by Our Clients
          </h2>
          <p className="text-neutral-400">
            Real stories from the people we serve.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="bg-neutral-900 border border-white/5 rounded-3xl p-8 flex flex-col gap-6"
            >
              <Quote className="size-8 text-rose-500/50" />
              <p className="text-neutral-300 leading-relaxed flex-1 italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-gradient-to-tr from-rose-500 to-orange-400 flex items-center justify-center font-bold text-white">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{t.name}</div>
                  <div className="text-xs text-neutral-500">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-24 px-6 md:px-12 relative overflow-hidden">
        <div className="relative max-w-4xl mx-auto rounded-[2.5rem] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1555244162-803834f70033?w=1400&q=80&auto=format&fit=crop"
            alt="Catering event"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-rose-600/80 to-orange-600/60" />
          <div className="relative z-10 p-16 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
              Ready to create something memorable?
            </h2>
            <p className="text-white/80 mb-10 max-w-lg mx-auto text-lg">
              Let Bristeen handle the food so you can focus on the moments that
              matter.
            </p>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 bg-white text-black hover:bg-neutral-100 px-10 py-5 rounded-full font-bold text-lg transition-colors"
            >
              Start Planning <ArrowRight className="size-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 px-6 md:px-12 py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="font-bold text-2xl tracking-tighter mb-3">
              Bristeen <span className="text-rose-500">Catering</span>
            </div>
            <p className="text-neutral-400 text-sm max-w-sm leading-relaxed mb-6">
              Premium catering for weddings, corporate events, and private
              celebrations — crafted with passion, served with precision.
            </p>
            <div className="flex items-center gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="size-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">
              Explore
            </h4>
            <div className="flex flex-col gap-3 text-sm text-neutral-400">
              <Link
                href="/menu"
                className="hover:text-white transition-colors w-fit"
              >
                Menu
              </Link>
              <Link
                href="/events"
                className="hover:text-white transition-colors w-fit"
              >
                Events & Booking
              </Link>
              <Link
                href="/login"
                className="hover:text-white transition-colors w-fit"
              >
                Admin
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">
              Get in Touch
            </h4>
            <div className="flex flex-col gap-3 text-sm text-neutral-400">
              <div className="flex items-center gap-2.5">
                <MapPin className="size-4 text-rose-400 shrink-0" />
                <span>Lagos, Nigeria</span>
              </div>
              <a
                href="https://wa.me/2348181120003"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-white transition-colors w-fit"
              >
                <Phone className="size-4 text-rose-400 shrink-0" />
                <span>Event Bookings — +234 818 112 0003</span>
              </a>
              <a
                href="https://wa.me/2349069973777"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-white transition-colors w-fit"
              >
                <Phone className="size-4 text-rose-400 shrink-0" />
                <span>Food Orders — +234 906 997 3777</span>
              </a>
              <div className="flex items-center gap-2.5">
                <Mail className="size-4 text-rose-400 shrink-0" />
                <span>hello@bristeencatering.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center text-xs text-neutral-500">
          © {new Date().getFullYear()} Bristeen Catering. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
