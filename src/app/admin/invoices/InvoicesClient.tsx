"use client";

import { useState } from "react";
import { Search, ReceiptText, CheckCircle2, AlertCircle, Download, FileText } from "lucide-react";
import { updateInvoiceStatus } from "@/actions/invoices";

type Invoice = {
   id: string;
   amount: number;
   status: string;
   dueDate: Date;
   createdAt: Date;
   user: { name: string; email: string };
   orderId: string | null;
   bookingId: string | null;
}

export default function InvoicesClient({ invoices }: { invoices: Invoice[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const filteredInvoices = invoices.filter(inv => {
     const matchesSearch = inv.id.toLowerCase().includes(search.toLowerCase()) || inv.user.name.toLowerCase().includes(search.toLowerCase());
     const matchesFilter = filter === "ALL" || inv.status === filter;
     return matchesSearch && matchesFilter;
  });

  return (
    <>
      <div className="flex flex-col md:flex-row items-center gap-4">
         <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-neutral-500" />
            <input 
               type="text"
               placeholder="Search by client or Invoice ID..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full bg-neutral-900 border border-white/10 rounded-full py-3 pl-12 pr-6 text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500 transition-colors"
            />
         </div>
         <div className="flex items-center gap-2">
            {["ALL", "UNPAID", "PARTIAL", "PAID"].map(status => (
               <button 
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === status ? 'bg-white text-black' : 'bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white'}`}
               >
                  {status}
               </button>
            ))}
         </div>
      </div>

      <div className="bg-neutral-900 border border-white/5 rounded-3xl overflow-hidden mt-2">
         {/* Table Header */}
         <div className="grid grid-cols-12 gap-4 p-6 border-b border-white/5 text-sm font-bold text-neutral-500 uppercase tracking-wider bg-black/20 hidden md:grid">
            <div className="col-span-3">Invoice Details</div>
            <div className="col-span-3">Client</div>
            <div className="col-span-2">Origin</div>
            <div className="col-span-2 text-right">Amount</div>
            <div className="col-span-2 text-center">Status / Actions</div>
         </div>

         {/* Table Body */}
         <div className="flex flex-col">
            {filteredInvoices.map((invoice) => (
               <div key={invoice.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 border-b border-white/5 hover:bg-white/[0.02] transition-colors items-center group">
                  
                  <div className="col-span-3 flex items-center gap-4">
                     <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 ${invoice.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                        <ReceiptText className="size-6" />
                     </div>
                     <div>
                        <div className="font-bold text-white mb-1 uppercase text-sm tracking-wider">#{invoice.id.slice(-8)}</div>
                        <div className="text-xs text-neutral-400">Due: {new Date(invoice.dueDate).toLocaleDateString()}</div>
                     </div>
                  </div>

                  <div className="col-span-3">
                     <div className="font-medium text-white">{invoice.user.name}</div>
                     <div className="text-sm text-neutral-500">{invoice.user.email}</div>
                  </div>

                  <div className="col-span-2">
                     {invoice.orderId && (
                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-neutral-300 flex items-center w-fit gap-1.5">
                           Order <span className="opacity-50">| #{invoice.orderId.slice(-4).toUpperCase()}</span>
                        </span>
                     )}
                     {invoice.bookingId && (
                        <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs font-medium text-blue-300 flex items-center w-fit gap-1.5">
                           Event <span className="opacity-50">| #{invoice.bookingId.slice(-4).toUpperCase()}</span>
                        </span>
                     )}
                  </div>

                  <div className="col-span-2 md:text-right font-bold text-lg text-white">
                     ₦{invoice.amount.toLocaleString()}
                  </div>

                  <div className="col-span-2 flex flex-col md:items-end gap-2">
                     {invoice.status === 'PAID' ? (
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold w-fit">
                           <CheckCircle2 className="size-4" /> PAID
                        </span>
                     ) : (
                        <div className="flex items-center gap-2">
                           <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold w-fit">
                              <AlertCircle className="size-4" /> {invoice.status}
                           </span>
                           <button 
                              onClick={() => updateInvoiceStatus(invoice.id, 'PAID')}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all ml-2"
                           >
                              Mark Paid
                           </button>
                        </div>
                     )}
                  </div>
               </div>
            ))}

            {filteredInvoices.length === 0 && (
               <div className="py-24 flex flex-col items-center justify-center text-center">
                  <FileText className="size-16 text-neutral-600 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No Invoices Found</h3>
                  <p className="text-neutral-400">There are no invoices matching your filters.</p>
               </div>
            )}
         </div>
      </div>
    </>
  );
}
