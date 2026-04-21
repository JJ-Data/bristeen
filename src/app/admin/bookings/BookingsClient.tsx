"use client";

import { useState } from "react";
import { Search, CalendarDays, MapPin, Users, Phone, Mail, FileText, CheckCircle2, XCircle, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { updateBookingStatus, updateBookingAdminNotes } from "@/actions/bookings";

type Booking = {
   id: string;
   eventDate: Date;
   eventType: string;
   guestCount: number;
   notes: string | null;
   adminNotes: string | null;
   status: string;
   totalAmount: number | null;
   user: {
      name: string;
      email: string;
      phone: string | null;
   }
}

export default function BookingsClient({ bookings }: { bookings: Booking[] }) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [selectedNotesBooking, setSelectedNotesBooking] = useState<Booking | null>(null);

  const filteredBookings = bookings.filter(booking => {
     const matchesSearch = booking.user.name.toLowerCase().includes(search.toLowerCase()) || booking.eventType.toLowerCase().includes(search.toLowerCase());
     const matchesStatus = filterStatus === "ALL" || booking.status === filterStatus;
     return matchesSearch && matchesStatus;
  });

  async function handleNotesSubmit(e: React.FormEvent<HTMLFormElement>) {
     e.preventDefault();
     if (!selectedNotesBooking) return;
     const form = new FormData(e.currentTarget);
     const adminNotes = form.get("adminNotes") as string;
     await updateBookingAdminNotes(selectedNotesBooking.id, adminNotes);
     setSelectedNotesBooking(null);
  }

  const getStatusColor = (status: string) => {
     switch(status) {
        case "PENDING": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
        case "CONFIRMED": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
        case "CANCELLED": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
        case "COMPLETED": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
        default: return "bg-neutral-500/10 text-neutral-400 border-neutral-500/20";
     }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
       case "PENDING": return <Clock className="size-4" />;
       case "CONFIRMED": return <CheckCircle2 className="size-4" />;
       case "CANCELLED": return <XCircle className="size-4" />;
       case "COMPLETED": return <CheckCircle2 className="size-4" />;
       default: return null;
    }
 }

  return (
    <>
      <div className="flex flex-col md:flex-row items-center gap-4">
         <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-neutral-500" />
            <input 
               type="text"
               placeholder="Search by client name or event type..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full bg-neutral-900 border border-white/10 rounded-full py-3 pl-12 pr-6 text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500 transition-colors"
            />
         </div>
         <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map(status => (
               <button 
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filterStatus === status ? 'bg-white text-black' : 'bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white hover:border-white/20'}`}
               >
                  {status}
               </button>
            ))}
         </div>
      </div>

      <div className="flex flex-col gap-4">
         {filteredBookings.map((booking, i) => (
            <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.05 }}
               key={booking.id} 
               className="bg-neutral-900 border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row gap-6 p-6"
            >
               {/* Date & Status Block */}
               <div className="md:w-48 flex flex-col items-start border-b md:border-b-0 md:border-r border-white/5 pb-6 md:pb-0 md:pr-6 shrink-0">
                  <div className="text-rose-400 text-sm font-bold uppercase tracking-wider mb-1">
                     {new Date(booking.eventDate).toLocaleDateString(undefined, { month: 'short' })}
                  </div>
                  <div className="text-4xl font-extrabold text-white mb-2">
                     {new Date(booking.eventDate).getDate()}
                  </div>
                  <div className="text-neutral-500 text-sm mb-6">
                     {new Date(booking.eventDate).getFullYear()}
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold mt-auto ${getStatusColor(booking.status)}`}>
                     {getStatusIcon(booking.status)}
                     {booking.status}
                  </div>
               </div>

               {/* Event Details */}
               <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <h3 className="text-xl font-bold text-white mb-1">{booking.eventType}</h3>
                        <p className="text-neutral-400 text-sm flex items-center gap-2">
                           <Users className="size-4" /> {booking.guestCount} Guests expected
                        </p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm text-neutral-300 bg-black/20 p-4 rounded-2xl border border-white/5">
                     <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                           <span className="font-bold">{booking.user.name.charAt(0)}</span>
                        </div>
                        <div>
                           <div className="font-medium text-white">{booking.user.name}</div>
                           <div className="text-xs text-neutral-500">Client</div>
                        </div>
                     </div>
                     <div className="flex flex-col gap-1 justify-center">
                        <div className="flex items-center gap-2 text-neutral-400">
                           <Mail className="size-3.5" /> {booking.user.email}
                        </div>
                        {booking.user.phone && (
                           <div className="flex items-center gap-2 text-neutral-400">
                              <Phone className="size-3.5" /> {booking.user.phone}
                           </div>
                        )}
                     </div>
                  </div>

                  {booking.notes && (
                     <div className="mb-4">
                        <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Client Requests</p>
                        <p className="text-sm text-neutral-300 italic">"{booking.notes}"</p>
                     </div>
                  )}

                  {booking.adminNotes && (
                     <div className="mb-4 bg-orange-500/5 border border-orange-500/10 p-3 rounded-xl border-l-2 border-l-orange-500">
                        <p className="text-xs font-bold text-orange-500/80 uppercase tracking-wider mb-1 flex items-center gap-1"><FileText className="size-3" /> Booking Notes (Admin)</p>
                        <p className="text-sm text-orange-200">{booking.adminNotes}</p>
                     </div>
                  )}
               </div>

               {/* Actions column */}
               <div className="md:w-48 flex flex-col gap-2 shrink-0 md:pl-4 border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                  {booking.status === "PENDING" && (
                     <>
                        <button onClick={() => updateBookingStatus(booking.id, "CONFIRMED")} className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold transition-colors">
                           Confirm Booking
                        </button>
                        <button onClick={() => updateBookingStatus(booking.id, "CANCELLED")} className="w-full py-2.5 bg-white/5 hover:bg-rose-500/10 hover:text-rose-400 border border-white/10 text-neutral-300 rounded-xl text-sm font-bold transition-colors">
                           Deny / Cancel
                        </button>
                     </>
                  )}
                  {booking.status === "CONFIRMED" && (
                     <button onClick={() => updateBookingStatus(booking.id, "COMPLETED")} className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-colors">
                        Mark Completed
                     </button>
                  )}
                  
                  <div className="flex-1" />
                  
                  <button 
                     onClick={() => setSelectedNotesBooking(booking)}
                     className="w-full py-2.5 bg-black/40 hover:bg-black/60 border border-white/5 text-neutral-400 hover:text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 mt-2"
                  >
                     <FileText className="size-4" /> Edit Notes
                  </button>
               </div>
            </motion.div>
         ))}

         {filteredBookings.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center border border-white/5 border-dashed rounded-3xl">
               <CalendarDays className="size-12 text-neutral-600 mb-4" />
               <p className="text-neutral-400 font-medium tracking-tight">No bookings found for the selected criteria.</p>
            </div>
         )}
      </div>

      {/* Admin Notes Modal */}
      <AnimatePresence>
         {selectedNotesBooking && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
               <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-neutral-900 border border-white/10 rounded-3xl p-8 max-w-md w-full relative"
               >
                  <button onClick={() => setSelectedNotesBooking(null)} className="absolute top-6 right-6 text-neutral-400 hover:text-white">
                     <XCircle className="size-5" />
                  </button>
                  <h3 className="text-2xl font-bold mb-2">Admin Notes</h3>
                  <p className="text-neutral-400 text-sm mb-6">These notes are strictly for internal reference regarding <span className="text-white font-medium">{selectedNotesBooking.user.name}'s</span> booking.</p>
                  
                  <form onSubmit={handleNotesSubmit} className="space-y-4">
                     <textarea 
                        name="adminNotes" 
                        defaultValue={selectedNotesBooking.adminNotes || ""}
                        rows={6} 
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500" 
                        placeholder="Type any preparation notes, internal flags, or specifics to remember here..."
                     />
                     <button type="submit" className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-4 rounded-xl mt-4 transition-colors">
                        Save Notes
                     </button>
                  </form>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </>
  );
}
