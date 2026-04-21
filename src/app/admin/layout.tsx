"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ChefHat, 
  CalendarDays, 
  ReceiptText, 
  UtensilsCrossed,
  LogOut,
  Bell,
  Settings
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Inventory (CEO)', href: '/admin/inventory', icon: Package },
    { name: 'Menu Manager', href: '/admin/menu', icon: ChefHat },
    { name: 'Events & Bookings', href: '/admin/bookings', icon: CalendarDays },
    { name: 'Food Orders', href: '/admin/orders', icon: UtensilsCrossed },
    { name: 'Invoices', href: '/admin/invoices', icon: ReceiptText },
  ];

  return (
    <div className="flex h-screen bg-background text-white font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-72 bg-card border-r border-white/5 flex flex-col hidden lg:flex">
        <div className="h-20 flex items-center px-8 border-b border-white/5">
          <Link href="/" className="font-bold text-2xl tracking-tighter flex items-center gap-3">
            <img 
              src="/bristeen-logo.png" 
              alt="Bristeen Logo" 
              className="size-9 object-contain" 
            />
            Bristeen <span className="text-rose-500">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 py-8 px-4 flex flex-col gap-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} className="relative group">
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute inset-0 bg-rose-500/10 rounded-xl border border-rose-500/20"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-colors z-10 ${isActive ? 'text-rose-400 font-medium' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}>
                  <item.icon className={`size-5 ${isActive ? 'text-rose-400' : 'text-neutral-400 group-hover:text-white'}`} />
                  {item.name}
                </div>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
           <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
              <Settings className="size-5" />
              Settings
           </Link>
           <button className="w-full flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-colors mt-2">
              <LogOut className="size-5" />
              Sign Out
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-20 bg-background/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 z-10">
           <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
                Dashboard Portal
              </h2>
           </div>
           <div className="flex items-center gap-6">
              <button className="relative p-2 text-neutral-400 hover:text-white transition-colors">
                 <Bell className="size-5" />
                 <span className="absolute top-1.5 right-1.5 size-2 bg-rose-500 rounded-full border-2 border-neutral-900"></span>
              </button>
              <div className="flex items-center gap-3 border-l border-white/10 pl-6">
                 <div className="text-right hidden md:block">
                    <div className="text-sm font-medium">Hello, Admin</div>
                    <div className="text-xs text-rose-400">CEO / Manager</div>
                 </div>
                 <div className="size-10 rounded-full bg-gradient-to-tr from-rose-500 to-orange-400 border-2 border-neutral-800" />
              </div>
           </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
           {/* Subtle background glow */}
           <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
           {children}
        </div>
      </main>

    </div>
  );
}
