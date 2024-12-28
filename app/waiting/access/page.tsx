"use client";

import { getUsers } from "@/hooks/get-users";
import { LucideLoader } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
  const { currentUser, isAdmin } = getUsers();
  const router = useRouter();

  useEffect(() => {
    if (currentUser && isAdmin) {
      router.push("/");
    }
  }, [currentUser, isAdmin]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <LucideLoader className="w-6 h-6 mr-2 animate-spin" />
      <p className="text-xl font-bold">Waiting for approval</p>
    </div>
  );
};

export default Page;
