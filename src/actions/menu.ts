"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getMenuItems() {
  return await prisma.menuItem.findMany({
    orderBy: { updatedAt: "desc" },
  });
}

export async function addMenuItem(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const orderDueDateStr = formData.get("orderDueDate") as string;
  const imageUrl = formData.get("imageUrl") as string;
  
  const orderDueDate = orderDueDateStr ? new Date(orderDueDateStr) : null;

  await prisma.menuItem.create({
    data: {
      name,
      description,
      price,
      imageUrl: imageUrl || null,
      orderDueDate,
      isAvailable: true,
    },
  });

  revalidatePath("/admin/menu");
}

export async function toggleMenuItemAvailability(id: string, currentStatus: boolean) {
  await prisma.menuItem.update({
    where: { id },
    data: { isAvailable: !currentStatus },
  });

  revalidatePath("/admin/menu");
}

export async function updateMenuItem(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const orderDueDateStr = formData.get("orderDueDate") as string;
  const imageUrl = formData.get("imageUrl") as string;
  
  const orderDueDate = orderDueDateStr ? new Date(orderDueDateStr) : null;

  await prisma.menuItem.update({
    where: { id },
    data: {
      name,
      description,
      price,
      imageUrl: imageUrl || null,
      orderDueDate,
    },
  });

  revalidatePath("/admin/menu");
}

export async function deleteMenuItem(id: string) {
  await prisma.menuItem.delete({
    where: { id },
  });

  revalidatePath("/admin/menu");
}
