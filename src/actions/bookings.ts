"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
  revalidatePath("/admin/bookings");
}

export async function updateBookingAdminNotes(id: string, adminNotes: string) {
  await prisma.booking.update({
    where: { id },
    data: { adminNotes },
  });
  revalidatePath("/admin/bookings");
}
