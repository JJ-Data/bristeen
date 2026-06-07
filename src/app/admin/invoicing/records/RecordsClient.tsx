"use client";

import { useState } from "react";
import { Search, ReceiptText, CheckCircle2, AlertCircle, FileText } from "lucide-react";
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

export default function RecordsClient({ invoices }: { invoices: Invoice[] }) {
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
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
               type="text"
               placeholder="Search by client or invoice ID..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full bg-white border border-gray-200 rounded-full py-3 pl-12 pr-6 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors shadow-sm"
            />
         </div>
         <div className="flex items-center gap-2">
            {["ALL", "UNPAID", "PARTIAL", "PAID"].map(status => (
               <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === status ? 'bg-amber-500 text-white' : 'bg-white border border-gray-200 text-gray-500 hover:text-gray-800 shadow-sm'}`}
               >
                  {status}
               </button>
            ))}
         </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden mt-4 shadow-sm">
         {/* Table Header */}
         <div className="grid grid-cols-12 gap-4 p-5 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50 hidden md:grid">
            <div className="col-span-3">Invoice Details</div>
            <div className="col-span-3">Client</div>
            <div className="col-span-2">Origin</div>
            <div className="col-span-2 text-right">Amount</div>
            <div className="col-span-2 text-center">Status / Actions</div>
         </div>

         {/* Table Body */}
         <div className="flex flex-col">
            {filteredInvoices.map((invoice) => (
               <div key={invoice.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-5 border-b border-gray-100 hover:bg-amber-50/40 transition-colors items-center group">

                  <div className="col-span-3 flex items-center gap-4">
                     <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 ${invoice.status === 'PAID' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-500'}`}>
                        <ReceiptText className="size-6" />
                     </div>
                     <div>
                        <div className="font-bold text-gray-800 mb-1 uppercase text-sm tracking-wider">#{invoice.id.slice(-8)}</div>
                        <div className="text-xs text-gray-400">Due: {new Date(invoice.dueDate).toLocaleDateString()}</div>
                     </div>
                  </div>

                  <div className="col-span-3">
                     <div className="font-medium text-gray-800">{invoice.user.name}</div>
                     <div className="text-sm text-gray-400">{invoice.user.email}</div>
                  </div>

                  <div className="col-span-2">
                     {invoice.orderId && (
                        <span className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-full text-xs font-medium text-gray-600 flex items-center w-fit gap-1.5">
                           Order <span className="opacity-50">| #{invoice.orderId.slice(-4).toUpperCase()}</span>
                        </span>
                     )}
                     {invoice.bookingId && (
                        <span className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-medium text-blue-600 flex items-center w-fit gap-1.5">
                           Event <span className="opacity-50">| #{invoice.bookingId.slice(-4).toUpperCase()}</span>
                        </span>
                     )}
                  </div>

                  <div className="col-span-2 md:text-right font-bold text-lg text-gray-800">
                     ₦{invoice.amount.toLocaleString()}
                  </div>

                  <div className="col-span-2 flex flex-col md:items-end gap-2">
                     {invoice.status === 'PAID' ? (
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200 text-xs font-bold w-fit">
                           <CheckCircle2 className="size-4" /> PAID
                        </span>
                     ) : (
                        <div className="flex items-center gap-2">
                           <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-100 text-rose-500 border border-rose-200 text-xs font-bold w-fit">
                              <AlertCircle className="size-4" /> {invoice.status}
                           </span>
                           <button
                              onClick={() => updateInvoiceStatus(invoice.id, 'PAID')}
                              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-all ml-2"
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
                  <FileText className="size-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-bold text-gray-700 mb-2">No Records Found</h3>
                  <p className="text-gray-400">There are no payment records matching your filters.</p>
               </div>
            )}
         </div>
      </div>
    </>
  );
}
