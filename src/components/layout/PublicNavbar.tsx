import Link from "next/link";
import { ChefHat } from "lucide-react";

export default function PublicNavbar() {
  return (
    <nav className="fixed top-0 inset-x-0 h-20 items-center justify-between flex px-6 md:px-12 backdrop-blur-xl border-b border-white/5 z-50 bg-background/70">
      <Link href="/" className="font-bold text-2xl tracking-tighter flex items-center gap-2">
        <div className="size-8 rounded-full bg-rose-600 flex items-center justify-center">
            <ChefHat className="text-white size-4" />
        </div>
        Bristeen 
      </Link>
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-300">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <Link href="/events" className="hover:text-white transition-colors">Events</Link>
        <Link href="/menu" className="hover:text-white transition-colors">Order Food</Link>
      </div>
      <div className="flex items-center gap-4">
          <Link href="/admin" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors">Admin Portal</Link>
          <Link href="/events" className="bg-white text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-neutral-200 transition-colors">
            Book Now
          </Link>
      </div>
    </nav>
  );
}
