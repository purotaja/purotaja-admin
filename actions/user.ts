import { prisma } from "@/lib/prisma";

export const addUser = async (userData: any) => {
  const user = await prisma.user.create({
    data: userData,
  });

  return user;
};
