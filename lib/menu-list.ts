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
  Stars,
  ShoppingBasket,
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
          href: "",
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
          href: "/subproducts",
          label: "Sub Products",
          icon: ShoppingBasket,
        },
        {
          href: "/orders",
          label: "Orders",
          icon: ShoppingBag,
        },
        {
          href: "/reviews",
          label: "Reviews",
          icon: Stars,
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
