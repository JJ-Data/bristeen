"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getInventoryItems() {
  return await prisma.inventoryItem.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
       logs: {
          orderBy: { createdAt: "desc" },
          take: 5
       }
    }
  });
}

export async function addInventoryItem(formData: FormData) {
  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const quantity = parseInt(formData.get("quantity") as string);
  const unit = formData.get("unit") as string;
  const minStock = parseInt(formData.get("minStock") as string);

  await prisma.inventoryItem.create({
    data: {
      name,
      category,
      quantity,
      unit,
      minStock,
      logs: {
         create: {
            action: "INITIAL_STOCK",
            quantityChanged: quantity,
            newQuantity: quantity,
            notes: "Item added to inventory"
         }
      }
    },
  });

  revalidatePath("/admin/inventory");
}

export async function updateStockLevel(itemId: string, amountToChange: number, actionType: "RESTOCK" | "USED", notes: string) {
   const item = await prisma.inventoryItem.findUnique({ where: { id: itemId }});
   if (!item) throw new Error("Item not found");

   const newQuantity = item.quantity + (actionType === "USED" ? -Math.abs(amountToChange) : Math.abs(amountToChange));

   await prisma.inventoryItem.update({
      where: { id: itemId },
      data: {
         quantity: newQuantity,
         logs: {
            create: {
               action: actionType,
               quantityChanged: amountToChange,
               newQuantity,
               notes
            }
         }
      }
   });

   revalidatePath("/admin/inventory");
}
