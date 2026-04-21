"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CalendarDays, ChefHat, ReceiptText, Star, UtensilsCrossed } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden font-sans select-none selection:bg-rose-500 selection:text-white relative">
      <div className="absolute top-0 left-0 w-full h-full -z-20">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-600/10 blur-[120px] rounded-full animate-pulse" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>
      


      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center text-center">
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
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]"
        >
          Extraordinary Taste, <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">
            Unforgettable Events.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="max-w-2xl text-lg text-neutral-400 mb-10"
        >
          From intimate gatherings to grand celebrations, Bristeen ensures every moment is paired with exquisite culinary mastery. Book your events, order gourmet food, and manage your invoices seamlessly.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link href="/events/book" className="group flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all w-full sm:w-auto overflow-hidden relative">
            <span className="relative z-10">Book an Event</span>
            <ArrowRight className="size-5 relative z-10 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/menu" className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-full font-bold text-lg border border-white/10 transition-colors w-full sm:w-auto">
            <UtensilsCrossed className="size-5" />
            Order Food
          </Link>
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-6 md:px-12 relative overflow-hidden">
         <div className="absolute inset-0 bg-primary/5 skew-y-3 origin-center scale-110 -z-10" />
         <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything You Need</h2>
              <p className="text-neutral-400">A completely streamlined experience for our esteemed clients.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
               {[
                  {
                     title: "Event Booking",
                     description: "Check availability, reserve dates, and plan large scale catering for your events seamlessly.",
                     icon: CalendarDays,
                     url: "/events",
                     color: "text-blue-400",
                     bg: "bg-blue-400/10"
                  },
                  {
                     title: "Gourmet Orders",
                     description: "Craving a specific dish? Browse our available menu, see dynamic pricing, and place food orders instantly.",
                     icon: ChefHat,
                     url: "/menu",
                     color: "text-orange-400",
                     bg: "bg-orange-400/10"
                  }
               ].map((service, index) => (
                  <Link href={service.url} key={index}>
                    <motion.div 
                      whileHover={{ y: -5 }}
                      className="p-8 rounded-3xl bg-card/40 backdrop-blur-xl border border-white/10 hover:border-primary/30 transition-all cursor-pointer group h-full shadow-2xl"
                    >
                      <div className={`size-14 rounded-2xl ${service.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                        <service.icon className={`size-7 ${service.color}`} />
                      </div>
                      <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                      <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                        {service.description}
                      </p>
                      <div className="text-sm font-bold text-white flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                         Explore <ArrowRight className="size-4" />
                      </div>
                    </motion.div>
                  </Link>
               ))}
            </div>
         </div>
      </section>

    </div>
  );
}
