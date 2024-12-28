import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon,
  ShoppingBag,
  BookCopyIcon,
  ShoppingCart,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/",
          label: "Dashboard",
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Contents",
      menus: [
        {
          href: "/categories",
          label: "Categories",
          icon: Bookmark,
        },
        {
          href: "/subcategories",
          label: "Sub Categories",
          icon: BookCopyIcon,
        },
        {
          href: "/products",
          label: "Products",
          icon: ShoppingCart,
        },
        {
          href: "/orders",
          label: "Orders",
          icon: ShoppingBag,
        },
      ],
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/users",
          label: "Users",
          icon: Users,
        },
        {
          href: "/settings",
          label: "Settings",
          icon: Settings,
        },
      ],
    },
  ];
}
