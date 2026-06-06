import {
  CalendarCheck,
  DollarSign,
  Package,
  TrendingUp,
  UtensilsCrossed,
  Users,
  Clock,
} from "lucide-react";
import { getDashboardData } from "@/actions/dashboard";
import RevenueChart from "@/components/dashboard/RevenueChart";

function fmt(n: number) {
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}m`;
  if (n >= 1_000) return `₦${(n / 1_000).toFixed(0)}k`;
  return `₦${n.toLocaleString()}`;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-orange-500/20 text-orange-400",
  CONFIRMED: "bg-emerald-500/20 text-emerald-400",
  COMPLETED: "bg-blue-500/20 text-blue-400",
  CANCELLED: "bg-rose-500/20 text-rose-400",
};

export default async function AdminDashboardPage() {
  const {
    totalRevenue,
    activeBookings,
    pendingOrders,
    lowStockCount,
    upcomingBookings,
    recentOrders,
    revenueChartData,
  } = await getDashboardData();

  const stats = [
    {
      title: "Total Revenue",
      value: fmt(totalRevenue),
      icon: DollarSign,
      sub: "from paid invoices",
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/20",
    },
    {
      title: "Active Bookings",
      value: String(activeBookings),
      icon: CalendarCheck,
      sub: "pending & confirmed",
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-blue-400/20",
    },
    {
      title: "Pending Orders",
      value: String(pendingOrders),
      icon: UtensilsCrossed,
      sub: pendingOrders > 0 ? "Requires attention" : "All clear",
      color: "text-orange-400",
      bg: "bg-orange-400/10",
      border: "border-orange-400/20",
    },
    {
      title: "Low Stock Items",
      value: String(lowStockCount),
      icon: Package,
      sub: lowStockCount > 0 ? "Inventory alert" : "Stock looks good",
      color: "text-rose-400",
      bg: "bg-rose-400/10",
      border: "border-rose-400/20",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold mb-2">Overview</h1>
        <p className="text-neutral-400">
          Welcome back. Here is what&apos;s happening at Bristeen today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`p-6 rounded-3xl bg-neutral-900 border ${stat.border} flex flex-col relative overflow-hidden group`}
          >
            <div
              className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${stat.bg}`}
            />
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg}`}>
                <stat.icon className={`size-6 ${stat.color}`} />
              </div>
            </div>
            <div>
              <div className="text-neutral-400 text-sm font-medium mb-1">
                {stat.title}
              </div>
              <div className="text-3xl font-bold tracking-tight text-white mb-2">
                {stat.value}
              </div>
              <div className="text-xs text-neutral-500 font-medium flex items-center gap-1.5">
                <TrendingUp className="size-3" />
                {stat.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-neutral-900 border border-white/5 rounded-3xl p-6">
        <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
          <DollarSign className="size-5 text-neutral-400" />
          Revenue (Last 6 Months)
        </h2>
        <p className="text-xs text-neutral-500 mb-6">
          Based on invoices marked as Paid
        </p>
        <div className="h-52">
          <RevenueChart data={revenueChartData} />
        </div>
      </div>

      {/* Lower Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[400px]">

        {/* Upcoming Events */}
        <div className="bg-neutral-900 border border-white/5 rounded-3xl p-6 lg:col-span-2 flex flex-col">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <CalendarCheck className="size-5 text-neutral-400" />
            Upcoming Events
          </h2>

          {upcomingBookings.length === 0 ? (
            <div className="flex-1 border border-white/5 bg-black/20 rounded-2xl flex items-center justify-center flex-col gap-3 text-neutral-500">
              <div className="size-16 rounded-full bg-white/5 flex items-center justify-center">
                <CalendarCheck className="size-8 opacity-20" />
              </div>
              <p className="text-sm">
                No upcoming events. Great time to review inventory!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-colors"
                >
                  {/* Date block */}
                  <div className="w-14 shrink-0 text-center">
                    <div className="text-rose-400 text-xs font-bold uppercase">
                      {new Date(booking.eventDate).toLocaleDateString(
                        undefined,
                        { month: "short" }
                      )}
                    </div>
                    <div className="text-2xl font-extrabold text-white leading-none">
                      {new Date(booking.eventDate).getDate()}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white truncate">
                      {booking.eventType}
                    </div>
                    <div className="text-xs text-neutral-400 flex items-center gap-1.5 mt-0.5">
                      <Users className="size-3" />
                      {booking.user.name} &middot; {booking.guestCount} guests
                    </div>
                  </div>

                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full shrink-0 ${STATUS_COLORS[booking.status] ?? "bg-neutral-500/20 text-neutral-400"}`}
                  >
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Food Orders */}
        <div className="bg-neutral-900 border border-white/5 rounded-3xl p-6 flex flex-col">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <UtensilsCrossed className="size-5 text-neutral-400" />
            Recent Food Orders
          </h2>

          {recentOrders.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-neutral-500 text-sm text-center">
              No food orders yet.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 hover:bg-white/10 transition-colors"
                >
                  <div className="size-10 rounded-full bg-gradient-to-tr from-rose-500/30 to-orange-400/30 flex items-center justify-center shrink-0 text-white font-bold text-sm">
                    {order.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white truncate">
                      {order.user.name}
                    </div>
                    <div className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                      <Clock className="size-3" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${STATUS_COLORS[order.status] ?? "bg-neutral-500/20 text-neutral-400"}`}
                  >
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
