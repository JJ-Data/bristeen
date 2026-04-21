"use client";

import { useState } from "react";
import { Plus, Search, AlertTriangle, Package, History, ArrowDownToLine, ArrowUpToLine, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { addInventoryItem, updateStockLevel } from "@/actions/inventory";

type InventoryItem = {
   id: string;
   name: string;
   category: string;
   quantity: number;
   unit: string;
   minStock: number;
   logs: any[];
}

export default function InventoryClient({ items }: { items: InventoryItem[] }) {
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStockUpdate, setSelectedStockUpdate] = useState<{ id: string, name: string, type: "RESTOCK" | "USED" } | null>(null);

  const filteredItems = items.filter(item => item.name.toLowerCase().includes(search.toLowerCase()) || item.category.toLowerCase().includes(search.toLowerCase()));

  // Handlers
  async function handleAddSubmit(e: React.FormEvent<HTMLFormElement>) {
     e.preventDefault();
     const form = new FormData(e.currentTarget);
     await addInventoryItem(form);
     setIsAddModalOpen(false);
  }

  async function handleStockUpdateSubmit(e: React.FormEvent<HTMLFormElement>) {
     e.preventDefault();
     if (!selectedStockUpdate) return;
     const form = new FormData(e.currentTarget);
     const amount = parseInt(form.get("amount") as string);
     const notes = form.get("notes") as string || "";
     
     await updateStockLevel(selectedStockUpdate.id, amount, selectedStockUpdate.type, notes);
     setSelectedStockUpdate(null);
  }

  return (
    <>
      <div className="flex items-center gap-4">
         {/* Search Bar */}
         <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-neutral-500" />
            <input 
               type="text"
               placeholder="Search by name or category..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full bg-neutral-900 border border-white/10 rounded-full py-3 pl-12 pr-6 text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500 transition-colors"
            />
         </div>
         <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-6 py-3 rounded-full font-bold transition-all ml-auto"
         >
            <Plus className="size-5" />
            Add New Item
         </button>
      </div>

      {/* Grid of Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filteredItems.map(item => {
            const isLow = item.quantity <= item.minStock;
            return (
               <div key={item.id} className={`p-6 rounded-3xl bg-neutral-900 border flex flex-col relative overflow-hidden group ${isLow ? 'border-rose-500/30' : 'border-white/5'}`}>
                  {isLow && <div className="absolute top-0 right-0 p-4"><AlertTriangle className="size-5 text-rose-500 animate-pulse" /></div>}
                  
                  <div className="flex items-start gap-4 mb-6">
                     <div className={`p-4 rounded-2xl ${isLow ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                        <Package className="size-6" />
                     </div>
                     <div>
                        <h3 className="font-bold text-lg text-white">{item.name}</h3>
                        <p className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 inline-block mt-1">
                           {item.category}
                        </p>
                     </div>
                  </div>

                  <div className="flex justify-between items-end mb-6">
                     <div>
                        <p className="text-neutral-500 text-sm mb-1">Stock Level</p>
                        <div className="text-3xl font-bold tracking-tight text-white flex items-baseline gap-1">
                           {item.quantity} <span className="text-base font-medium text-neutral-400">{item.unit}</span>
                        </div>
                     </div>
                     <div className="text-xs text-neutral-500 text-right">
                        Min. Stock: {item.minStock} {item.unit}
                     </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-auto pt-4 border-t border-white/5">
                     <button 
                        onClick={() => setSelectedStockUpdate({ id: item.id, name: item.name, type: "RESTOCK" })}
                        className="flex-1 flex justify-center items-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-400 text-sm font-semibold transition-colors"
                     >
                        <ArrowUpToLine className="size-4" /> Restock
                     </button>
                     <button 
                        onClick={() => setSelectedStockUpdate({ id: item.id, name: item.name, type: "USED" })}
                        className="flex-1 flex justify-center items-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-rose-400 text-sm font-semibold transition-colors"
                     >
                        <ArrowDownToLine className="size-4" /> Record Used
                     </button>
                  </div>
               </div>
            )
         })}
         
         {filteredItems.length === 0 && (
            <div className="col-span-full py-20 text-center flex flex-col items-center border border-white/5 border-dashed rounded-3xl">
               <Package className="size-12 text-neutral-600 mb-4" />
               <p className="text-neutral-400 font-medium z-10">No inventory items found.</p>
            </div>
         )}
      </div>

      {/* Add New Item Modal */}
      <AnimatePresence>
         {isAddModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
               <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-neutral-900 border border-white/10 rounded-3xl p-8 max-w-md w-full relative"
               >
                  <button onClick={() => setIsAddModalOpen(false)} className="absolute top-6 right-6 text-neutral-400 hover:text-white">
                     <X className="size-5" />
                  </button>
                  <h3 className="text-2xl font-bold mb-6">Add New Item</h3>
                  
                  <form onSubmit={handleAddSubmit} className="space-y-4">
                     <div>
                        <label className="text-sm font-medium text-neutral-400 block mb-1">Item Name</label>
                        <input name="name" required className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500" placeholder="e.g. Basmati Rice" />
                     </div>
                     <div>
                        <label className="text-sm font-medium text-neutral-400 block mb-1">Category</label>
                        <select name="category" required className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500">
                           <option value="Raw Materials">Raw Materials</option>
                           <option value="Equipment">Equipment</option>
                           <option value="Packaging">Packaging</option>
                        </select>
                     </div>
                     <div className="flex gap-4">
                        <div className="flex-1">
                           <label className="text-sm font-medium text-neutral-400 block mb-1">Initial Qty</label>
                           <input type="number" name="quantity" required min="0" className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500" placeholder="0" />
                        </div>
                        <div className="flex-1">
                           <label className="text-sm font-medium text-neutral-400 block mb-1">Unit</label>
                           <input name="unit" required className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500" placeholder="e.g. Kg, Bags" />
                        </div>
                     </div>
                     <div>
                        <label className="text-sm font-medium text-neutral-400 block mb-1">Min Stock Alert Level</label>
                        <input type="number" name="minStock" required min="0" className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500" placeholder="10" />
                     </div>
                     <button type="submit" className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-4 rounded-xl mt-4 transition-colors">
                        Add to Inventory
                     </button>
                  </form>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

      {/* Update Stock Modal */}
      <AnimatePresence>
         {selectedStockUpdate && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
               <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-neutral-900 border border-white/10 rounded-3xl p-8 max-w-sm w-full relative"
               >
                  <button onClick={() => setSelectedStockUpdate(null)} className="absolute top-6 right-6 text-neutral-400 hover:text-white">
                     <X className="size-5" />
                  </button>
                  <h3 className="text-2xl font-bold mb-6">
                     {selectedStockUpdate.type === "RESTOCK" ? "Restock" : "Record Usage"}
                  </h3>
                  <p className="text-neutral-400 text-sm mb-6">
                     {selectedStockUpdate.type === "RESTOCK" ? `Adding stock to ${selectedStockUpdate.name}.` : `Logging usage for ${selectedStockUpdate.name}.`}
                  </p>
                  
                  <form onSubmit={handleStockUpdateSubmit} className="space-y-4">
                     <div>
                        <label className="text-sm font-medium text-neutral-400 block mb-1">Amount {selectedStockUpdate.type === "RESTOCK" ? "Added" : "Used"}</label>
                        <input type="number" name="amount" required min="1" className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500" placeholder="e.g. 5" />
                     </div>
                     <div>
                        <label className="text-sm font-medium text-neutral-400 block mb-1">Notes (Optional)</label>
                        <input name="notes" className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500" placeholder="e.g. Bought from market / Cooked for wedding" />
                     </div>
                     
                     <button 
                        type="submit" 
                        className={`w-full text-white font-bold py-4 rounded-xl mt-4 transition-colors ${selectedStockUpdate.type === "RESTOCK" ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'}`}
                     >
                        Confirm {selectedStockUpdate.type === "RESTOCK" ? "Restock" : "Usage"}
                     </button>
                  </form>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

    </>
  );
}
