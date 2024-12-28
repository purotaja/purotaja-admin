"use server";

import { prisma } from "@/lib/prisma";
import { Store } from "@prisma/client";

export async function getStore(storeId: string): Promise<Store> {
  try {
    const store = await prisma.store.findUnique({
      where: {
        value: storeId,
      },
    });

    if (!store) {
      throw new Error("Store not found");
    }
    
    return store;
  } catch (error) {
    throw new Error("Failed to fetch stores");
  }
}

export const addStore = async (data: any) => {
  if (!data) {
    throw new Error("Invalid data");
  }

  const result = await prisma.store.create({
    data: {
      label: data.label,
      value: data.value!,
    },
  });

  if (!result) {
    throw new Error("Failed to create store");
  }

  return result;
};

export async function updateStore(data: any) {
  if (!data) {
    throw new Error("Invalid data");
  }

  const store = await prisma.store.findUnique({ where: { id: data.id } });

  if (store) {
    const result = await prisma.store.update({
      where: { id: data.id },
      data: {
        label: data.label,
      },
    });

    if (!result) {
      throw new Error("Failed to update store");
    }

    return result;
  }
}

export async function deleteStore(id: string) {
  try {
    await prisma.store.delete({ where: { value: id } });

    return true;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to delete store");
  }
}
