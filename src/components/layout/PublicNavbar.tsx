"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/menu", label: "Order Food" },
];

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl border-b border-white/5 bg-background/70">
      <div className="h-20 flex items-center justify-between px-6 md:px-12">
        <Link href="/" className="font-bold text-2xl tracking-tighter flex items-center gap-3" onClick={() => setOpen(false)}>
          <img
            src="/bristeen-logo.png"
            alt="Bristeen Logo"
            className="size-10 object-contain hover:scale-105 transition-transform"
          />
          Bristeen
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-300">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-white transition-colors">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/events" className="hidden sm:inline-flex bg-white text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-neutral-200 transition-colors">
            Book Now
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden size-10 flex items-center justify-center rounded-full border border-white/10 text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="md:hidden overflow-hidden border-b border-white/5 bg-background/95 backdrop-blur-xl"
          >
            <div className="flex flex-col px-6 py-4 gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="px-3 py-3 rounded-xl text-base font-medium text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/events"
                onClick={() => setOpen(false)}
                className="mt-2 bg-white text-black px-5 py-3 rounded-xl text-sm font-semibold text-center hover:bg-neutral-200 transition-colors"
              >
                Book Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
