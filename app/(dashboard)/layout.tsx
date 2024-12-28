"use client";

import React, { useEffect } from "react";
import { useStores } from "@/hooks/use-store";
import { useRouter } from "next/navigation";
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { getUsers } from "@/hooks/get-users";
import { useUser } from "@clerk/nextjs";

const Layout = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) => {
  const { isLoading, stores } = useStores();
  const { isAdmin, currentUser, isLoading: isloadedUser } = getUsers();
  const { isLoaded: isUserLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isUserLoaded && !isLoading) {
      if (stores.length === 0) {
        router.push("/");
      } else if (isloadedUser && !isAdmin) {
        router.push("/waiting/access");
      }
    }
  }, [isLoading, stores, isAdmin, router, isUserLoaded]);

  return <AdminPanelLayout>{children}</AdminPanelLayout>;
};

export default Layout;
