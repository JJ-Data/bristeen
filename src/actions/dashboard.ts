"use server";

import { prisma } from "@/lib/prisma";

export async function getDashboardData() {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [
    revenueAgg,
    activeBookingsCount,
    pendingOrdersCount,
    allInventoryItems,
    upcomingBookings,
    recentOrders,
    paidInvoicesForChart,
  ] = await Promise.all([
    prisma.invoice.aggregate({
      where: { status: "PAID" },
      _sum: { amount: true },
    }),
    prisma.booking.count({
      where: { status: { in: ["PENDING", "CONFIRMED"] } },
    }),
    prisma.order.count({
      where: { status: "PENDING" },
    }),
    prisma.inventoryItem.findMany({
      select: { quantity: true, minStock: true },
    }),
    prisma.booking.findMany({
      where: {
        eventDate: { gte: now },
        status: { in: ["PENDING", "CONFIRMED"] },
      },
      orderBy: { eventDate: "asc" },
      take: 5,
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
      include: { user: { select: { name: true } } },
    }),
    prisma.invoice.findMany({
      where: {
        status: "PAID",
        createdAt: { gte: sixMonthsAgo },
      },
      select: { amount: true, createdAt: true },
    }),
  ]);

  const lowStockCount = allInventoryItems.filter(
    (i) => i.quantity <= i.minStock
  ).length;

  // Group paid invoices by month for the chart
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyMap = new Map<string, number>();

  // Pre-populate the last 6 months with 0
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthlyMap.set(monthNames[d.getMonth()], 0);
  }

  for (const inv of paidInvoicesForChart) {
    const key = monthNames[new Date(inv.createdAt).getMonth()];
    if (monthlyMap.has(key)) {
      monthlyMap.set(key, (monthlyMap.get(key) ?? 0) + inv.amount);
    }
  }

  const revenueChartData = Array.from(monthlyMap.entries()).map(([month, revenue]) => ({
    month,
    revenue,
  }));

  return {
    totalRevenue: revenueAgg._sum.amount ?? 0,
    activeBookings: activeBookingsCount,
    pendingOrders: pendingOrdersCount,
    lowStockCount,
    upcomingBookings,
    recentOrders,
    revenueChartData,
  };
}
