"use client";

import React from "react";
import { BookMinusIcon, HomeIcon, Settings, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useStores } from "@/hooks/use-store";

const data = [
  {
    title: "Dashboard",
    icon: HomeIcon,
    href: "",
  },
  {
    title: "Categories",
    icon: BookMinusIcon,
    href: "/categories",
  },
  {
    title: "Items",
    icon: ShoppingCart,
    href: "/calendar",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

const MenuBar = () => {
  const pathname = usePathname();
  const { stores } = useStores();
  
  return (
    <div className="flex flex-col gap-2 w-full mt-5">
      {data.map((item, index) => (
        <Link
          href={`/${stores[0]?.value}/${item.href}`}
          key={index}
          className={cn(
            "flex items-center w-full px-2 py-2 hover:bg-white/30 rounded-md",
            pathname.endsWith("/"+pathname.split("/")[1]+item.href) ? "bg-white" : ""
          )}
        >
          <item.icon size={20} />
          <span className="ml-3">{item.title}</span>
        </Link>
      ))}
    </div>
  );
};

export default MenuBar;
