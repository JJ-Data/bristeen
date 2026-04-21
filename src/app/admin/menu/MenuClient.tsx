"use client";

import { useState } from "react";
import { Plus, Search, ChefHat, CalendarClock, Eye, EyeOff, X, ImageIcon, Pencil, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { addMenuItem, toggleMenuItemAvailability, updateMenuItem, deleteMenuItem } from "@/actions/menu";

type MenuItem = {
   id: string;
   name: string;
   description: string | null;
   price: number;
   imageUrl: string | null;
   isAvailable: boolean;
   orderDueDate: Date | null;
}

export default function MenuClient({ items }: { items: MenuItem[] }) {
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const filteredItems = items.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));

  // Handlers
  async function handleAddSubmit(e: React.FormEvent<HTMLFormElement>) {
     e.preventDefault();
     const form = new FormData(e.currentTarget);
     await addMenuItem(form);
     setIsAddModalOpen(false);
  }

  async function handleEditSubmit(e: React.FormEvent<HTMLFormElement>) {
     e.preventDefault();
     if (!editingItem) return;
     const form = new FormData(e.currentTarget);
     await updateMenuItem(editingItem.id, form);
     setEditingItem(null);
  }

  async function handleDelete(id: string) {
     if (confirm("Are you sure you want to delete this menu item?")) {
        await deleteMenuItem(id);
     }
  }

  return (
    <>
      <div className="flex items-center gap-4">
         {/* Search Bar */}
         <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-neutral-500" />
            <input 
               type="text"
               placeholder="Search menu items..."
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
            Add Menu Item
         </button>
      </div>

      {/* Grid of Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filteredItems.map(item => {
            const isDue = item.orderDueDate && new Date(item.orderDueDate) < new Date();
            
            return (
               <div key={item.id} className={`p-6 rounded-3xl bg-neutral-900 border flex flex-col relative overflow-hidden group ${!item.isAvailable ? 'opacity-60 border-neutral-800' : 'border-white/5 hover:border-white/20'}`}>
                  
                  <div className="flex items-start justify-between mb-4">
                     <div className="flex flex-wrap items-center gap-3">
                        {item.imageUrl ? (
                           <img src={item.imageUrl} alt={item.name} className="size-12 rounded-full object-cover border border-white/10 shrink-0" />
                        ) : (
                           <div className="size-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
                              <ChefHat className="size-6" />
                           </div>
                        )}
                        {item.imageUrl && (
                           <a href={item.imageUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-blue-400 border border-blue-500/20 bg-blue-500/10 hover:bg-blue-500/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors">
                              <ImageIcon className="size-3" />
                              View
                           </a>
                        )}
                     </div>
                     <div className="text-xl font-bold tracking-tight text-white shrink-0 ml-2">
                        ₦{item.price.toLocaleString()}
                     </div>
                  </div>

                  <h3 className="font-bold text-xl text-white mb-2">{item.name}</h3>
                  <p className="text-sm text-neutral-400 mb-6 flex-1 line-clamp-2">
                     {item.description || "No description provided."}
                  </p>

                  {item.orderDueDate && (
                     <div className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg w-fit mb-4 ${isDue ? 'bg-rose-500/10 text-rose-400' : 'bg-blue-500/10 text-blue-400'}`}>
                        <CalendarClock className="size-4" />
                        {isDue ? 'Ordering Closed' : `Due: ${new Date(item.orderDueDate).toLocaleDateString()}`}
                     </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-auto pt-4 border-t border-white/5">
                     <button 
                        onClick={() => toggleMenuItemAvailability(item.id, item.isAvailable)}
                        className={`flex-1 flex justify-center items-center gap-2 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${item.isAvailable ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'}`}
                     >
                        {item.isAvailable ? <><EyeOff className="size-4" /> Hide</> : <><Eye className="size-4" /> Show</>}
                     </button>
                     <button 
                        onClick={() => setEditingItem(item)}
                        className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors"
                        title="Edit"
                     >
                        <Pencil className="size-4" />
                     </button>
                     <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                        title="Delete"
                     >
                        <Trash2 className="size-4" />
                     </button>
                  </div>
               </div>
            )
         })}
         
         {filteredItems.length === 0 && (
            <div className="col-span-full py-20 text-center flex flex-col items-center border border-white/5 border-dashed rounded-3xl">
               <ChefHat className="size-12 text-neutral-600 mb-4" />
               <p className="text-neutral-400 font-medium z-10">No food items added to the menu yet.</p>
            </div>
         )}
      </div>

      {/* Add Menu Item Modal */}
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
                  <h3 className="text-2xl font-bold mb-6">Add New Food</h3>
                  
                  <form onSubmit={handleAddSubmit} className="space-y-4">
                     <div>
                        <label className="text-sm font-medium text-neutral-400 block mb-1">Food Name</label>
                        <input name="name" required className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500" placeholder="e.g. Jollof Rice & Chicken" />
                     </div>
                     <div>
                        <label className="text-sm font-medium text-neutral-400 block mb-1">Description</label>
                        <textarea name="description" rows={3} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500" placeholder="Delicious spicy rice paired with grilled chicken..."></textarea>
                     </div>
                     <div>
                        <label className="text-sm font-medium text-neutral-400 block mb-1">Image URL (Optional)</label>
                        <input type="url" name="imageUrl" className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500" placeholder="https://example.com/image.jpg" />
                     </div>
                     <div>
                        <label className="text-sm font-medium text-neutral-400 block mb-1">Price (₦)</label>
                        <input type="number" name="price" required min="0" className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500" placeholder="5000" />
                     </div>
                     <div>
                        <label className="text-sm font-medium text-neutral-400 block mb-1">Ordering Due Date (Optional)</label>
                        <input type="datetime-local" name="orderDueDate" className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 [color-scheme:dark]" />
                     </div>
                     <button type="submit" className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-4 rounded-xl mt-4 transition-colors">
                        Add to Menu
                     </button>
                  </form>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
       {/* Edit Menu Item Modal */}
       <AnimatePresence>
          {editingItem && (
             <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div 
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.95 }}
                   className="bg-neutral-900 border border-white/10 rounded-3xl p-8 max-w-md w-full relative"
                >
                   <button onClick={() => setEditingItem(null)} className="absolute top-6 right-6 text-neutral-400 hover:text-white">
                      <X className="size-5" />
                   </button>
                   <h3 className="text-2xl font-bold mb-6">Edit Food Item</h3>
                   
                   <form onSubmit={handleEditSubmit} className="space-y-4">
                      <div>
                         <label className="text-sm font-medium text-neutral-400 block mb-1">Food Name</label>
                         <input name="name" defaultValue={editingItem.name} required className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500" placeholder="e.g. Jollof Rice & Chicken" />
                      </div>
                      <div>
                         <label className="text-sm font-medium text-neutral-400 block mb-1">Description</label>
                         <textarea name="description" defaultValue={editingItem.description || ""} rows={3} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500" placeholder="Delicious spicy rice paired with grilled chicken..."></textarea>
                      </div>
                      <div>
                         <label className="text-sm font-medium text-neutral-400 block mb-1">Image URL (Optional)</label>
                         <input type="url" name="imageUrl" defaultValue={editingItem.imageUrl || ""} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500" placeholder="https://example.com/image.jpg" />
                      </div>
                      <div>
                         <label className="text-sm font-medium text-neutral-400 block mb-1">Price (₦)</label>
                         <input type="number" name="price" defaultValue={editingItem.price} required min="0" className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500" placeholder="5000" />
                      </div>
                      <div>
                         <label className="text-sm font-medium text-neutral-400 block mb-1">Ordering Due Date (Optional)</label>
                         <input 
                            type="datetime-local" 
                            name="orderDueDate" 
                            defaultValue={editingItem.orderDueDate ? new Date(editingItem.orderDueDate).toISOString().slice(0, 16) : ""}
                            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 [color-scheme:dark]" 
                         />
                      </div>
                      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl mt-4 transition-colors">
                         Save Changes
                      </button>
                   </form>
                </motion.div>
             </div>
          )}
       </AnimatePresence>
    </>
  );
}
