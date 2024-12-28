"use server";

import { randomBytes } from "crypto";
import { prisma } from "../prisma";

const generateOtp = () => {
  return randomBytes(3).toString("hex").toUpperCase();
};

const storeOtp = async (clientId: string) => {
  const otp = generateOtp();

  const store = await prisma.otp.create({
    data: {
      clientId,
      otp,
      createdAt: new Date(),
    },
  });

  if (store) {
    return { success: true, otp: store.otp };
  }

  return { success: false, otp: null };
};

const verifyOtp = async (clientId: string, otp: string) => {
  const record = await prisma.otp.findFirst({
    where: {
      clientId,
      otp,
    },
  });

  if (record) {
    await prisma.client.update({
      where: {
        id: clientId,
      },
      data: {
        isVerified: true,
      },
    });

    await prisma.otp.delete({
      where: {
        id: record.id,
      },
    });
    return true;
  }
  return false;
};

export { generateOtp, storeOtp, verifyOtp };
