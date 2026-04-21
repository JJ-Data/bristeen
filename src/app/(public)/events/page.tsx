"use client";

import { useState } from "react";
import { CalendarDays, Users, Mail, Phone, User, Settings2, Sparkles, AlertCircle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { submitEventBooking } from "@/actions/eventBooking";
import Link from "next/link";

export default function EventsPage() {
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [successBookingId, setSuccessBookingId] = useState<string | null>(null);

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      setIsSubmitting(true);

      const form = new FormData(e.currentTarget);
      const data = {
         name: form.get("name") as string,
         email: form.get("email") as string,
         phone: form.get("phone") as string,
         eventType: form.get("eventType") as string,
         eventDate: new Date(form.get("eventDate") as string),
         guestCount: parseInt(form.get("guestCount") as string),
         notes: form.get("notes") as string,
      };

      try {
         const bookingId = await submitEventBooking(data);
         setSuccessBookingId(bookingId);
      } catch (err) {
         console.error("Failed to book an event", err);
         alert("Something went wrong placing the booking. Please try again.");
      } finally {
         setIsSubmitting(false);
      }
   }

   return (
      <div className="min-h-screen bg-neutral-950 font-sans text-neutral-50 selection:bg-rose-500 selection:text-white pt-24 pb-20 relative overflow-hidden">
         {/* Background Decor */}
         <div className="absolute top-0 right-0 w-1/2 h-full bg-rose-500/5 blur-[150px] pointer-events-none -z-10" />

         <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
               
               {/* Impactful Brand Side */}
               <div className="flex-1 lg:py-20 z-10">
                  <motion.div 
                     initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
                  >
                     <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-rose-300 mb-8">
                        <Sparkles className="size-4" /> Exclusive Standard
                     </div>
                     <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
                        An <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500">Unforgettable</span><br/> Experience.
                     </h1>
                     <p className="text-lg text-neutral-400 max-w-xl mb-12 leading-relaxed">
                        Whether it's an intimate wedding reception, a corporate gala, or an extravagant birthday, Bristeen's premium catering guarantees phenomenal service, bespoke dishes, and flawless delivery. Let's make magic happen.
                     </p>

                     <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                           <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center text-rose-500 shrink-0 border border-white/10"><Users className="size-6" /></div>
                           <div>
                              <h4 className="font-bold text-white text-lg">Scalable for any crowd</h4>
                              <p className="text-sm text-neutral-500">From 20 guests to over 1,000.</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center text-orange-500 shrink-0 border border-white/10"><Settings2 className="size-6" /></div>
                           <div>
                              <h4 className="font-bold text-white text-lg">Fully Custom Menus</h4>
                              <p className="text-sm text-neutral-500">We align our creations perfectly to your theme.</p>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               </div>

               {/* Booking Form Side */}
               <div className="flex-1 w-full max-w-xl relative z-10">
                  <motion.div 
                     initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
                     className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
                  >
                     <div className="absolute top-0 right-0 p-32 bg-rose-500/10 blur-[100px] rounded-full -z-10" />

                     {successBookingId ? (
                        <div className="py-20 text-center flex flex-col items-center">
                           <div className="size-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mb-6">
                              <CalendarDays className="size-10" />
                           </div>
                           <h3 className="text-2xl font-bold text-white mb-3">Booking Requested!</h3>
                           <p className="text-neutral-400 mb-8 max-w-sm">Thank you for choosing Bristeen. Our team will review your application and contact you shortly.</p>
                           
                           <Link href="/menu" className="bg-white hover:bg-neutral-200 text-black px-8 py-4 rounded-xl font-bold transition-colors">
                              Explore the Food Menu
                           </Link>
                        </div>
                     ) : (
                        <>
                           <div className="mb-8 border-b border-white/10 pb-6">
                              <h3 className="text-2xl font-bold text-white mb-2">Request Event Catering</h3>
                              <p className="text-neutral-400 text-sm">Please provide details so we can best prepare for your day.</p>
                           </div>

                           <form onSubmit={handleSubmit} className="space-y-5">
                              {/* Contact Info Matrix */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                 <div className="relative">
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-2">Full Name</label>
                                    <div className="relative">
                                       <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
                                       <input name="name" required className="w-full bg-neutral-900 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white focus:outline-none focus:border-rose-500 transition-colors" placeholder="e.g. John Doe" />
                                    </div>
                                 </div>
                                 <div className="relative">
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-2">Phone</label>
                                    <div className="relative">
                                       <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
                                       <input name="phone" required className="w-full bg-neutral-900 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white focus:outline-none focus:border-rose-500 transition-colors" placeholder="080..." />
                                    </div>
                                 </div>
                              </div>
                              
                              <div className="relative">
                                 <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-2">Email Address</label>
                                 <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
                                    <input type="email" name="email" required className="w-full bg-neutral-900 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white focus:outline-none focus:border-rose-500 transition-colors" placeholder="hello@domain.com" />
                                 </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                 <div className="relative">
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-2">Event Date</label>
                                    <input type="datetime-local" name="eventDate" required className="w-full bg-neutral-900 border border-white/10 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-rose-500 transition-colors [color-scheme:dark]" />
                                 </div>
                                 <div className="relative">
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-2">Occasion Type</label>
                                    <select name="eventType" required className="w-full bg-neutral-900 border border-white/10 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-rose-500 transition-colors appearance-none">
                                       <option value="Wedding / Reception">Wedding / Reception</option>
                                       <option value="Corporate Event">Corporate Event</option>
                                       <option value="Birthday Party">Birthday Party</option>
                                       <option value="Casual Gathering">Casual Gathering</option>
                                       <option value="Other">Other / Unsure</option>
                                    </select>
                                 </div>
                              </div>

                              <div className="relative">
                                 <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-2 flex items-center justify-between">
                                    Guest Count <span className="opacity-50 font-normal normal-case">Estimate</span>
                                 </label>
                                 <div className="relative">
                                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
                                    <input type="number" name="guestCount" min="1" required className="w-full bg-neutral-900 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white focus:outline-none focus:border-rose-500 transition-colors" placeholder="e.g. 150" />
                                 </div>
                              </div>

                              <div className="relative">
                                 <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-2">Specific Details & Requests</label>
                                 <textarea name="notes" rows={4} className="w-full bg-neutral-900 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-rose-500 transition-colors" placeholder="Any dietary requirements? Location specifics? Let us know what you envision..."></textarea>
                              </div>

                              <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 flex gap-3 text-sm text-orange-200 mt-6">
                                 <AlertCircle className="size-5 shrink-0 text-orange-400 mt-0.5" />
                                 <div>All bookings are subject to review. Pricing will be discussed after reviewing your specific requirements.</div>
                              </div>

                              <button 
                                 type="submit"
                                 disabled={isSubmitting}
                                 className="w-full bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold py-5 rounded-xl transition-all flex items-center justify-center gap-2 mt-4 text-lg"
                              >
                                 {isSubmitting ? "Generating Request..." : "Request Booking"} <ArrowRight className="size-5" />
                              </button>
                           </form>
                        </>
                     )}
                  </motion.div>
               </div>
            </div>
         </div>
      </div>
   );
}
