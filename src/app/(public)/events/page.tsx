"use client";

import { useState } from "react";
import { CalendarDays, Users, Mail, Phone, User, Settings2, Sparkles, AlertCircle, ArrowRight, PlayCircle, X, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { submitEventBooking } from "@/actions/eventBooking";
import Link from "next/link";

export default function EventsPage() {
   const [showBookingModal, setShowBookingModal] = useState(false);
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

   function closeModal() {
      setShowBookingModal(false);
      // Reset success state after the close animation finishes so the form is fresh next time
      setTimeout(() => setSuccessBookingId(null), 300);
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
                     <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 text-white">
                        An Unforgettable <span className="text-rose-500">Experience.</span>
                     </h1>
                     <p className="text-lg text-neutral-400 max-w-xl mb-10 leading-relaxed">
                        Whether it&apos;s an intimate wedding reception, a corporate gala, or an extravagant birthday, Bristeen&apos;s premium catering guarantees phenomenal service, bespoke dishes, and flawless delivery.
                     </p>

                     {/* Obvious, always-visible CTA */}
                     <div className="flex flex-wrap items-center gap-4 mb-12">
                        <button
                           onClick={() => setShowBookingModal(true)}
                           className="group inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-9 py-5 rounded-full font-bold text-lg transition-all shadow-xl shadow-rose-600/20"
                        >
                           <CalendarDays className="size-5" />
                           Book an Event
                           <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <a
                           href="https://wa.me/2348181120003"
                           target="_blank"
                           rel="noopener noreferrer"
                           className="group inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-7 py-5 rounded-full font-semibold text-base transition-all"
                        >
                           <MessageCircle className="size-5 text-emerald-400" />
                           Chat on WhatsApp
                        </a>
                     </div>

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

               {/* Bold Video Showcase */}
               <motion.div
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.15 }}
                  className="relative mx-auto w-full max-w-xs sm:max-w-sm shrink-0"
               >
                  <div className="absolute -inset-6 bg-gradient-to-tr from-rose-600/30 to-orange-500/20 blur-[80px] rounded-full -z-10" />
                  <div className="relative aspect-[9/16] rounded-[2.5rem] overflow-hidden border-4 border-white/10 shadow-2xl bg-neutral-900">
                     <video autoPlay muted loop playsInline className="w-full h-full object-cover">
                        <source src="/bristeen-event.mp4" type="video/mp4" />
                     </video>
                     <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                     <div className="absolute top-5 left-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white">
                        <PlayCircle className="size-4 text-rose-400" />
                        <span className="text-xs font-bold tracking-wide">Straight From the Floor</span>
                     </div>
                     <div className="absolute bottom-5 left-5 right-5 flex items-center gap-2 text-white">
                        <span className="size-2.5 rounded-full bg-rose-500 animate-pulse" />
                        <span className="text-sm font-bold tracking-wide">Live at a Bristeen Event</span>
                     </div>
                  </div>
               </motion.div>
            </div>
         </div>

         {/* ── Booking Modal ── */}
         <AnimatePresence>
            {showBookingModal && (
               <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
               >
                  <motion.div
                     initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                     onClick={closeModal}
                     className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                  />

                  <motion.div
                     initial={{ opacity: 0, y: 30, scale: 0.97 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: 20, scale: 0.97 }}
                     transition={{ duration: 0.3, ease: "easeOut" }}
                     className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-neutral-950 border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl"
                  >
                     <button
                        onClick={closeModal}
                        className="absolute top-6 right-6 size-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition-colors z-10"
                        aria-label="Close"
                     >
                        <X className="size-5" />
                     </button>

                     {successBookingId ? (
                        <div className="py-12 text-center flex flex-col items-center">
                           <div className="size-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mb-6">
                              <CalendarDays className="size-10" />
                           </div>
                           <h3 className="text-2xl font-bold text-white mb-3">Booking Requested!</h3>
                           <p className="text-neutral-400 mb-8 max-w-sm">Thank you for choosing Bristeen. Our team will review your application and contact you shortly.</p>

                           <Link href="/menu" onClick={closeModal} className="bg-white hover:bg-neutral-200 text-black px-8 py-4 rounded-xl font-bold transition-colors">
                              Explore the Food Menu
                           </Link>
                        </div>
                     ) : (
                        <>
                           <div className="mb-8 border-b border-white/10 pb-6 pr-12">
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
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   );
}
