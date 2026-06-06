"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getInvoices() {
  return await prisma.invoice.findMany({
    orderBy: { createdAt: "desc" },
    include: { 
      user: true, 
      booking: true, 
      order: true 
    }
  });
}

export async function generateInvoiceForBooking(bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { user: true },
  });
  if (!booking) throw new Error("Booking not found");

  const existing = await prisma.invoice.findFirst({ where: { bookingId } });
  if (existing) return;

  await prisma.invoice.create({
    data: {
      amount: booking.totalAmount ?? 0,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
      userId: booking.userId,
      bookingId: booking.id,
    },
  });

  revalidatePath("/admin/bookings");
  revalidatePath("/admin/invoices");
}

export async function generateInvoiceForOrder(orderId: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error("Order not found");
  
  // Check if invoice already exists
  const existing = await prisma.invoice.findFirst({ where: { orderId } });
  if (existing) return;

  await prisma.invoice.create({
    data: {
      amount: order.totalAmount,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due in 7 days by default
      userId: order.userId,
      orderId: order.id
    }
  });
  
  revalidatePath("/admin/orders");
  revalidatePath("/admin/invoices");
}

export async function updateInvoiceStatus(id: string, status: string) {
  await prisma.invoice.update({
    where: { id },
    data: { status }
  });
  revalidatePath("/admin/invoices");
}
