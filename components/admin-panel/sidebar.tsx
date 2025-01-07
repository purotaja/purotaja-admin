"use client";

import { Menu } from "@/components/admin-panel/menu";
import { SidebarToggle } from "@/components/admin-panel/sidebar-toggle";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStores } from "@/hooks/use-store";
import { useStore } from "@/hooks/use-stores";
import { cn } from "@/lib/utils";
import { PanelsTopLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Sidebar() {
  const sidebar = useStore(useSidebar, (x) => x);

  const { stores } = useStores();

  if (!sidebar) return null;

  const { isOpen, toggleOpen, getOpenState, setIsHover, settings } = sidebar;

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300",
        !getOpenState() ? "w-[90px]" : "w-72",
        settings.disabled && "hidden"
      )}
    >
      <SidebarToggle isOpen={isOpen} setIsOpen={toggleOpen} />
      <div
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className="relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-zinc-800"
      >
        <Button
          className={cn(
            "transition-transform ease-in-out duration-300 mb-1",
            !getOpenState() ? "translate-x-1" : "translate-x-0"
          )}
          variant="link"
          asChild
        >
          <Link
            href={`/${stores[0]?.value}`}
            className="flex items-center gap-2"
          >
            <Image src="/logo.png" alt="Purotaja Logo" width={60} height={60} />
          </Link>
        </Button>
        <Menu isOpen={getOpenState()} />
      </div>
    </aside>
  );
}
