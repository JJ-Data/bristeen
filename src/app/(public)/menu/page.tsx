import { prisma } from "@/lib/prisma";
import MenuUI from "./MenuUI";

export const dynamic = 'force-dynamic';

export default async function PublicMenuPage() {
  // Only fetch food items that the Admin has marked as Available! 
  // We also make sure the due date hasn't passed if one exists.
  const allItems = await prisma.menuItem.findMany({
     where: { isAvailable: true },
     orderBy: { createdAt: "desc" }
  });

  // Filter out expired due dates dynamically
  const activeItems = allItems.filter(item => {
     if (item.orderDueDate && new Date(item.orderDueDate) < new Date()) {
        return false;
     }
     return true;
  });

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-rose-500 selection:text-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
         {/* Heading Section */}
         <div className="text-center mb-16 relative">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
               Catering <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500">Menu</span>
            </h1>
            <p className="text-neutral-400 max-w-2xl mx-auto">
               Explore our hand-picked, gourmet dishes. Add your favorites to the cart and place your order directly.
            </p>
         </div>

         <MenuUI items={activeItems} />
      </div>
    </div>
  );
}
