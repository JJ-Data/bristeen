"use client";

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
} from "lucide-react";
import { motion } from "framer-motion";

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

  async function handleSignOut() {
    await signOut({ redirect: false });
    router.push("/login");
    router.refresh();
  }

  return (
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
  );
}
