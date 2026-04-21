"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type CheckoutData = {
   name: string;
   email: string;
   phone: string;
   totalAmount: number;
   cart: { id: string; name: string; price: number; quantity: number }[];
};

export async function submitFoodOrder(data: CheckoutData) {
  // 1. Find or Create the End-User dynamically
  let user = await prisma.user.findUnique({ where: { email: data.email } });
  
  if (!user) {
     user = await prisma.user.create({
        data: {
           name: data.name,
           email: data.email,
           phone: data.phone,
        }
     });
  } else {
     // Optionally update their phone if new
     if (data.phone && user.phone !== data.phone) {
        await prisma.user.update({ where: { id: user.id }, data: { phone: data.phone }});
     }
  }

  // 2. Create the Food Order & attach the items
  const order = await prisma.order.create({
     data: {
        userId: user.id,
        totalAmount: data.totalAmount,
        status: "PENDING",
        items: {
           create: data.cart.map(item => ({
              menuItemId: item.id,
              quantity: item.quantity,
              unitPrice: item.price
           }))
        }
     }
  });

  revalidatePath("/admin/orders");
  return order.id;
}
