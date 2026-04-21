"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type EventBookingData = {
   name: string;
   email: string;
   phone: string;
   eventType: string;
   eventDate: Date;
   guestCount: number;
   notes: string;
};

export async function submitEventBooking(data: EventBookingData) {
   // 1. Find or Create User
   let user = await prisma.user.findUnique({ where: { email: data.email }});
   if (!user) {
      user = await prisma.user.create({
         data: { name: data.name, email: data.email, phone: data.phone }
      });
   } else if (data.phone && user.phone !== data.phone) {
      await prisma.user.update({ where: { id: user.id }, data: { phone: data.phone }});
   }

   // 2. Create the Booking
   const booking = await prisma.booking.create({
      data: {
         userId: user.id,
         eventType: data.eventType,
         eventDate: data.eventDate,
         guestCount: data.guestCount,
         notes: data.notes || null,
         status: "PENDING",
      }
   });

   revalidatePath("/admin/bookings");
   
   return booking.id;
}
