import { CalendarCheck, DollarSign, Package, TrendingUp, UtensilsCrossed } from "lucide-react";

export default function AdminDashboardPage() {
  const stats = [
    { title: "Total Revenue", value: "₦12.4m", icon: DollarSign, trend: "+14% this month", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
    { title: "Active Bookings", value: "8", icon: CalendarCheck, trend: "3 this week", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
    { title: "Pending Orders", value: "24", icon: UtensilsCrossed, trend: "Requires attention", color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20" },
    { title: "Low Stock Items", value: "5", icon: Package, trend: "Inventory alert", color: "text-rose-400", bg: "bg-rose-400/10", border: "border-rose-400/20" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold mb-2">Overview</h1>
        <p className="text-neutral-400">Welcome back. Here is what's happening at Bristeen today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className={`p-6 rounded-3xl bg-neutral-900 border ${stat.border} flex flex-col relative overflow-hidden group`}>
            {/* Hover Gradient */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${stat.bg}`} />
            
            <div className="flex items-start justify-between mb-4">
               <div className={`p-3 rounded-2xl ${stat.bg}`}>
                  <stat.icon className={`size-6 ${stat.color}`} />
               </div>
               <div className="px-2.5 py-1 rounded-full bg-white/5 text-xs font-medium text-neutral-300">
                 Today
               </div>
            </div>
            
            <div>
               <div className="text-neutral-400 text-sm font-medium mb-1">{stat.title}</div>
               <div className="text-3xl font-bold tracking-tight text-white mb-2">{stat.value}</div>
               <div className="text-xs text-neutral-500 font-medium flex items-center gap-1.5">
                  <TrendingUp className="size-3" />
                  {stat.trend}
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lower Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[400px]">
         
         <div className="bg-neutral-900 border border-white/5 rounded-3xl p-6 lg:col-span-2 flex flex-col">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
               <CalendarCheck className="size-5 text-neutral-400" />
               Upcoming Events
            </h2>
            <div className="flex-1 border border-white/5 bg-black/20 rounded-2xl flex items-center justify-center flex-col gap-3 text-neutral-500">
               {/* Placeholder until we fetch Prisma Data */}
               <div className="size-16 rounded-full bg-white/5 flex items-center justify-center">
                 <CalendarCheck className="size-8 opacity-20" />
               </div>
               <p className="text-sm">No upcoming events this week. Great time to review inventory!</p>
            </div>
         </div>

         <div className="bg-neutral-900 border border-white/5 rounded-3xl p-6 flex flex-col">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
               <UtensilsCrossed className="size-5 text-neutral-400" />
               Recent Food Orders
            </h2>
            <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2">
               {/* Skeleton items */}
               {[1, 2, 3, 4].map((i) => (
                 <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 hover:bg-white/10 transition-colors cursor-pointer">
                    <div className="size-10 rounded-full bg-white/10 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                       <div className="h-4 w-24 bg-white/10 rounded mb-2" />
                       <div className="h-3 w-16 bg-white/5 rounded" />
                    </div>
                    <div className="h-6 w-16 rounded-full bg-orange-500/20 border border-orange-500/30 flex-shrink-0" />
                 </div>
               ))}
            </div>
         </div>

      </div>
    </div>
  );
}
