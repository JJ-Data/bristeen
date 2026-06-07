"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  ChefHat,
  CalendarDays,
  UtensilsCrossed,
  LogOut,
  Settings,
  FileText,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Inventory (CEO)", href: "/admin/inventory", icon: Package },
  { name: "Menu Manager", href: "/admin/menu", icon: ChefHat },
  { name: "Events & Bookings", href: "/admin/bookings", icon: CalendarDays },
  { name: "Food Orders", href: "/admin/orders", icon: UtensilsCrossed },
  { name: "Invoicing", href: "/admin/invoicing", icon: FileText },
];

export default function AdminSidebar({ userName }: { userName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleSignOut() {
    setMobileOpen(false);
    await signOut({ redirect: false });
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      {/* Mobile/tablet floating nav trigger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 size-14 flex items-center justify-center rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-xl shadow-black/40 transition-colors"
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </button>

      {/* Mobile/tablet slide-in drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="lg:hidden fixed inset-y-0 right-0 z-50 w-72 max-w-[85vw] bg-card border-l border-white/5 flex flex-col"
            >
              <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="font-bold text-xl tracking-tighter flex items-center gap-2.5"
                >
                  <img src="/bristeen-logo.png" alt="Bristeen Logo" className="size-8 object-contain" />
                  Bristeen <span className="text-rose-500">Admin</span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="size-10 flex items-center justify-center rounded-full border border-white/10 text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="size-5" />
                </button>
              </div>

              <nav className="flex-1 py-6 px-4 flex flex-col gap-1 overflow-y-auto">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                        isActive
                          ? "bg-rose-500/10 border border-rose-500/20 text-rose-400 font-medium"
                          : "text-neutral-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <item.icon
                        className={`size-5 ${isActive ? "text-rose-400" : "text-neutral-400"}`}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-white/5">
                <Link
                  href="/settings"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  <Settings className="size-5" />
                  Settings
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-colors mt-2"
                >
                  <LogOut className="size-5" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="w-72 bg-card border-r border-white/5 flex-col hidden lg:flex">
        <div className="h-20 flex items-center px-8 border-b border-white/5">
          <Link href="/" className="font-bold text-2xl tracking-tighter flex items-center gap-3">
            <img src="/bristeen-logo.png" alt="Bristeen Logo" className="size-9 object-contain" />
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
                <div
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-colors z-10 ${
                    isActive
                      ? "text-rose-400 font-medium"
                      : "text-neutral-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon
                    className={`size-5 ${
                      isActive ? "text-rose-400" : "text-neutral-400 group-hover:text-white"
                    }`}
                  />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
          >
            <Settings className="size-5" />
            Settings
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-colors mt-2"
          >
            <LogOut className="size-5" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
