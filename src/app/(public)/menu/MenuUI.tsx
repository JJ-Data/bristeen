"use client";

import { useState } from "react";
import { Plus, Minus, ShoppingBag, UtensilsCrossed, ArrowRight, X, ImageIcon, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { submitFoodOrder } from "@/actions/checkout";

type MenuItem = { id: string; name: string; description: string | null; price: number; imageUrl: string | null; orderDueDate: Date | null };
type CartItem = MenuItem & { quantity: number };

export default function MenuUI({ items }: { items: MenuItem[] }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cart operations
  const addToCart = (item: MenuItem) => {
     setCart(prev => {
        const existing = prev.find(i => i.id === item.id);
        if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
        return [...prev, { ...item, quantity: 1 }];
     });
  };

  const removeFromCart = (id: string) => {
     setCart(prev => {
        const existing = prev.find(i => i.id === id);
        if (existing && existing.quantity > 1) return prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i);
        return prev.filter(i => i.id !== id);
     });
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  async function handleCheckoutSubmit(e: React.FormEvent<HTMLFormElement>) {
     e.preventDefault();
     setIsSubmitting(true);
     
     const form = new FormData(e.currentTarget);
     const data = {
        name: form.get("name") as string,
        email: form.get("email") as string,
        phone: form.get("phone") as string,
        totalAmount: cartTotal,
        cart: cart.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity }))
     };

     try {
        const orderId = await submitFoodOrder(data);
        
        // Setup WhatsApp Forwarding
        // Using standard a wa.me link containing a generated text summary
        const waNumber = "2348000000000"; // Placeholder admin number
        let text = `*New Order Alert from Bristeen (#${orderId.slice(-6).toUpperCase()})*%0A%0A`;
        text += `*Client:* ${data.name}%0A`;
        text += `*Total Due:* ₦${cartTotal.toLocaleString()}%0A%0A`;
        text += `*Items Ordered:*%0A`;
        cart.forEach(item => {
           text += `- ${item.quantity}x ${item.name} (₦${(item.price * item.quantity).toLocaleString()})%0A`;
        });
        text += `%0A_I am ready to make payment!_`;

        window.open(`https://wa.me/${waNumber}?text=${text}`, "_blank");

        // Clear cart & close
        setCart([]);
        setCheckoutModalOpen(false);
     } catch (err) {
        console.error("Failed to checkout", err);
     } finally {
        setIsSubmitting(false);
     }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 relative">
      
      {/* Menu Area */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 h-fit">
         {items.map(item => {
            const inCart = cart.find(i => i.id === item.id);
            return (
               <div key={item.id} className="bg-neutral-900 border border-white/5 hover:border-white/20 transition-colors rounded-3xl p-6 flex flex-col group relative overflow-hidden">
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                     <div className="flex items-center gap-3">
                        <div className="size-12 rounded-xl bg-gradient-to-tr from-orange-500/20 to-rose-500/20 flex items-center justify-center text-orange-400 overflow-hidden border border-white/5">
                           {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                           ) : (
                              <UtensilsCrossed className="size-6" />
                           )}
                        </div>
                        {item.imageUrl && (
                           <a 
                              href={item.imageUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[10px] flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors uppercase font-bold tracking-wider"
                           >
                              <ImageIcon className="size-3" />
                              View Photo
                           </a>
                        )}
                     </div>
                     <div className="bg-black/40 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-white font-bold tracking-tight shrink-0">
                        ₦{item.price.toLocaleString()}
                     </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 relative z-10">{item.name}</h3>
                  <p className="text-sm text-neutral-400 mb-6 flex-1 relative z-10">{item.description}</p>

                  <div className="border-t border-white/5 pt-5 flex items-center justify-between relative z-10">
                     {inCart ? (
                        <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-full px-2 py-1">
                           <button onClick={() => removeFromCart(item.id)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                              <Minus className="size-4" />
                           </button>
                           <span className="font-bold text-white w-4 text-center">{inCart.quantity}</span>
                           <button onClick={() => addToCart(item)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                              <Plus className="size-4" />
                           </button>
                        </div>
                     ) : (
                        <button 
                           onClick={() => addToCart(item)}
                           className="w-full py-3 rounded-xl bg-orange-500/10 hover:bg-orange-500 hover:text-white border border-orange-500/20 text-orange-500 font-bold text-sm transition-all flex justify-center items-center gap-2"
                        >
                           <Plus className="size-4" /> Add to Order
                        </button>
                     )}
                  </div>
               </div>
            )
         })}

         {items.length === 0 && (
            <div className="col-span-full py-24 text-center border border-white/5 border-dashed rounded-3xl">
               <p className="text-neutral-500 text-lg">No menu items are currently available for ordering.</p>
            </div>
         )}
      </div>

      {/* Modern Sticky Cart Sidebar */}
      <div className="w-full lg:w-[400px]">
         <div className="sticky top-24 bg-neutral-900 border border-white/10 rounded-3xl flex flex-col max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-center gap-3 bg-white/[0.02]">
               <ShoppingBag className="text-white size-5" />
               <h2 className="text-xl font-bold text-white">Your Order</h2>
               <span className="ml-auto bg-rose-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {cartItemCount} item{cartItemCount !== 1 && 's'}
               </span>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
               <AnimatePresence>
                  {cart.length === 0 && (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-neutral-500 py-10 italic">
                        Your cart is empty. Add some delicious meals!
                     </motion.div>
                  )}
                  {cart.map(item => (
                     <motion.div 
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20, scale: 0.9 }}
                        key={item.id} className="flex justify-between items-center group"
                     >
                        <div className="flex-1 min-w-0 pr-4">
                           <div className="font-bold text-white truncate text-sm">{item.name}</div>
                           <div className="text-neutral-500 text-xs">₦{item.price.toLocaleString()} each</div>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="text-sm font-bold text-white w-14 text-right">₦{(item.price * item.quantity).toLocaleString()}</div>
                           <div className="flex flex-col items-center gap-1 bg-white/5 rounded-lg border border-white/10 p-0.5">
                              <button onClick={() => addToCart(item)} className="p-1 hover:bg-white/10 hover:text-white text-neutral-400 rounded"><Plus className="size-3" /></button>
                              <span className="text-xs font-bold text-white w-full text-center">{item.quantity}</span>
                              <button onClick={() => removeFromCart(item.id)} className="p-1 hover:bg-white/10 hover:text-white text-neutral-400 rounded"><Minus className="size-3" /></button>
                           </div>
                        </div>
                     </motion.div>
                  ))}
               </AnimatePresence>
            </div>

            <div className="p-6 border-t border-white/10 bg-black/40">
               <div className="flex justify-between items-center mb-6">
                  <span className="text-neutral-400">Total Due</span>
                  <span className="text-2xl font-bold text-white">₦{cartTotal.toLocaleString()}</span>
               </div>
               <button 
                  disabled={cart.length === 0}
                  onClick={() => setCheckoutModalOpen(true)}
                  className="w-full bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:hover:bg-rose-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
               >
                  Secure Checkout <ArrowRight className="size-5" />
               </button>
            </div>
         </div>
      </div>

      {/* Super Slick Checkout Modal */}
      <AnimatePresence>
         {isCheckoutModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm px-4">
               <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="bg-neutral-900 border border-white/10 rounded-[2rem] p-8 max-w-md w-full relative overflow-hidden shadow-2xl"
               >
                  {/* bg glow */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px] pointer-events-none rounded-full" />
                  
                  <button onClick={() => setCheckoutModalOpen(false)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors z-10">
                     <X className="size-5" />
                  </button>
                  
                  <h3 className="text-2xl font-bold mb-2">Almost yours!</h3>
                  <p className="text-neutral-400 text-sm mb-6">Please provide your details. Processing this order will forward you to our automated WhatsApp verification line.</p>
                  
                  <form onSubmit={handleCheckoutSubmit} className="space-y-4 relative z-10">
                     <div>
                        <label className="text-sm font-medium text-neutral-400 block mb-1">Full Name</label>
                        <input name="name" required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-rose-500 transition-colors" placeholder="e.g. Samuel Adeyemi" />
                     </div>
                     <div>
                        <label className="text-sm font-medium text-neutral-400 block mb-1">Email Address</label>
                        <input type="email" name="email" required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-rose-500 transition-colors" placeholder="samuel@example.com" />
                     </div>
                     <div>
                        <label className="text-sm font-medium text-neutral-400 block mb-1">WhatsApp Phone Number</label>
                        <input name="phone" required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-rose-500 transition-colors" placeholder="080..." />
                     </div>

                     <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between pb-2">
                        <span className="text-neutral-300 font-medium">To Pay:</span>
                        <span className="text-rose-500 font-bold text-xl">₦{cartTotal.toLocaleString()}</span>
                     </div>
                     
                     <button 
                        disabled={isSubmitting}
                        type="submit" 
                        className="w-full bg-white text-black hover:bg-neutral-200 disabled:opacity-50 text-base font-bold py-4 rounded-xl mt-4 transition-colors flex items-center justify-center gap-2"
                     >
                        {isSubmitting ? "Processing Database Request..." : "Pay via WhatsApp"} 
                        {!isSubmitting && <ArrowRight className="size-5" />}
                     </button>
                  </form>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

    </div>
  );
}
