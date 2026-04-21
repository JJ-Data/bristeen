"use client";

import { useState } from "react";
import { Search, ChefHat, Receipt, AlertCircle, FileText, UtensilsCrossed } from "lucide-react";
import { motion } from "framer-motion";
import { updateOrderStatus } from "@/actions/orders";
import { generateInvoiceForOrder } from "@/actions/invoices";

type OrderItem = { id: string; quantity: number; unitPrice: number; menuItem: { name: string } };
type Order = {
   id: string;
   status: string;
   totalAmount: number;
   createdAt: Date;
   user: { name: string; email: string };
   items: OrderItem[];
   invoice: any;
}

export default function OrdersClient({ orders }: { orders: Order[] }) {
  const [search, setSearch] = useState("");

  const filteredOrders = orders.filter(order => 
     order.user.name.toLowerCase().includes(search.toLowerCase()) || 
     order.id.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
     switch(status) {
        case "PENDING": return "bg-neutral-500/10 text-neutral-400";
        case "PROCESSING": return "bg-blue-500/10 text-blue-400";
        case "READY": return "bg-orange-500/10 text-orange-400";
        case "DELIVERED": return "bg-emerald-500/10 text-emerald-400";
        case "CANCELLED": return "bg-rose-500/10 text-rose-400";
        default: return "bg-neutral-500/10 text-neutral-400";
     }
  }

  return (
    <>
      <div className="relative w-full max-w-md mb-4 mt-2">
         <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-neutral-500" />
         <input 
            type="text"
            placeholder="Search by client or Order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-neutral-900 border border-white/10 rounded-full py-3 pl-12 pr-6 text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500"
         />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
         {filteredOrders.map(order => (
            <motion.div key={order.id} className="bg-neutral-900 border border-white/5 rounded-3xl overflow-hidden flex flex-col h-full hover:border-white/10 transition-colors">
               
               {/* Order Header */}
               <div className="p-6 border-b border-white/5 flex justify-between items-start bg-white/[0.02]">
                  <div>
                     <div className="text-xs text-neutral-500 mb-1 font-mono tracking-wider">#{order.id.slice(-8).toUpperCase()}</div>
                     <div className="font-bold text-lg text-white mb-1">{order.user.name}</div>
                     <div className="text-sm text-neutral-400">{new Date(order.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</div>
                  </div>
                  <div className="text-right">
                     <div className="text-xl font-bold text-white mb-2">₦{order.totalAmount.toLocaleString()}</div>
                     <div className={`text-xs font-bold px-3 py-1.5 rounded-full inline-flex items-center ${getStatusColor(order.status)}`}>
                        {order.status}
                     </div>
                  </div>
               </div>

               {/* Items List */}
               <div className="p-6 flex-1 bg-black/20">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-4 flex items-center gap-2">
                     <UtensilsCrossed className="size-4" /> Ordered Items
                  </h4>
                  <ul className="space-y-3">
                     {order.items.map(item => (
                        <li key={item.id} className="flex justify-between items-center text-sm">
                           <div className="flex items-center gap-3">
                              <span className="font-medium text-neutral-300 px-2 py-0.5 rounded bg-white/5">{item.quantity}x</span>
                              <span className="text-white">{item.menuItem.name}</span>
                           </div>
                           <span className="text-neutral-400">₦{(item.quantity * item.unitPrice).toLocaleString()}</span>
                        </li>
                     ))}
                  </ul>
               </div>

               {/* Action Footer */}
               <div className="p-6 border-t border-white/5 flex flex-wrap gap-3 mt-auto">
                  
                  {/* Status Dropdown / Action */}
                  <div className="flex-1 min-w-[200px] flex gap-2">
                     <select 
                        value={order.status} 
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="flex-1 bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                     >
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing (Cooking)</option>
                        <option value="READY">Ready</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                     </select>
                  </div>

                  {/* Invoice action */}
                  {order.invoice ? (
                     <div className="px-4 py-2.5 flex items-center gap-2 bg-emerald-500/10 text-emerald-400 text-sm font-bold rounded-xl border border-emerald-500/20">
                        <FileText className="size-4" /> Invoice Generated
                     </div>
                  ) : (
                     <button
                        disabled={order.status === "CANCELLED"}
                        onClick={() => generateInvoiceForOrder(order.id)}
                        className="px-4 py-2.5 flex items-center gap-2 bg-white text-black hover:bg-neutral-200 text-sm font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                        <Receipt className="size-4" /> Generate Invoice
                     </button>
                  )}
               </div>
            </motion.div>
         ))}

         {filteredOrders.length === 0 && (
            <div className="col-span-full py-32 flex flex-col items-center justify-center text-center">
               <div className="size-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <UtensilsCrossed className="size-10 text-neutral-600" />
               </div>
               <h3 className="text-xl font-bold text-white mb-2">No Food Orders</h3>
               <p className="text-neutral-400">There are no food orders matching your search.</p>
            </div>
         )}
      </div>
    </>
  );
}
