import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { EllipsisVerticalIcon, Pen, Trash2 } from "lucide-react";

interface Props {
  children?: React.ReactNode;
}

const SubMenus = ({ children }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <EllipsisVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col space-y-1">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SubMenus;
