"use client";

import React, { useEffect } from "react";
import { useStores } from "@/hooks/use-store";
import { useRouter } from "next/navigation";
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { getUsers } from "@/hooks/get-users";
import { useUser } from "@clerk/nextjs";
import { NotificationProvider } from "@/components/NotificationProvider";

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
      } else if (!isloadedUser && !isAdmin) {
        router.push("/waiting/access");
      }
    }
  }, [isLoading, stores, isAdmin, router, isUserLoaded]);

  if (isLoading || !isUserLoaded) {
    return null;
  }

  return (
    <AdminPanelLayout>
      <NotificationProvider storeId={stores[0].value}>
        {children}
      </NotificationProvider>
    </AdminPanelLayout>
  );
};

export default Layout;
