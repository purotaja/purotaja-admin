"use client";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { Orders } from "@prisma/client";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function todayDate() {
  const week = new Date().toLocaleString("default", { weekday: "long" });
  const month = new Date().toLocaleString("default", { month: "long" });
  return `${week}, ${month} ${new Date().getDate()}, ${new Date().getFullYear()}`;
}

export function getDate(date: Date, type?: "date" | "time") {
  if (type === "date") {
    return date.toString().split("T")[0];
  } else if (type === "time") {
    return date.toString().split("T")[1].split(".")[0];
  }

  return (
    date.toString().split("T")[0] +
    " " +
    date.toString().split("T")[1].split(".")[0]
  );
}

export function getMonth(date: Date) {
  const month = date.toLocaleString("default", { month: "long" });
  return month;
}

export function getMonthlyOrders(orders: Orders[]) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const initialData = months.map((month) => ({
    month,
    revenue: 0,
    mobile: 0,
  }));

  const data = orders.reduce((acc, order) => {
    const month = getMonth(new Date(order.createdAt));
    const amount = parseFloat(order.amount);
    const isComplete = order.status === "DELIVERED";

    const monthData = acc.find((item) => item.month === month && isComplete);
    if (monthData) {
      monthData.revenue += amount;
      monthData.mobile += amount;
    }
    return acc;
  }, initialData);

  return data;
}
