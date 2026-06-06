"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { generateInvoiceForBooking } from "@/actions/invoices";

export async function getBookings() {
  return await prisma.booking.findMany({
    orderBy: { eventDate: "asc" },
    include: { user: true },
  });
}

export async function updateBookingStatus(id: string, status: string) {
  await prisma.booking.update({
    where: { id },
    data: { status },
  });

  // Auto-generate invoice when a booking is confirmed
  if (status === "CONFIRMED") {
    await generateInvoiceForBooking(id);
  }

  revalidatePath("/admin/bookings");
  revalidatePath("/admin/dashboard");
}

export async function updateBookingAdminNotes(id: string, adminNotes: string) {
  await prisma.booking.update({
    where: { id },
    data: { adminNotes },
  });
  revalidatePath("/admin/bookings");
}
