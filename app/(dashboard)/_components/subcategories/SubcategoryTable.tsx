import React, { useState, useEffect } from "react";
import { useCategories } from "@/hooks/use-categories";
import { usePathname } from "next/navigation";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LucideLoader, Pen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSubCategories } from "@/hooks/use-subcategories";

interface Props {
  setOpen: (open: boolean) => void;
  setMode: (mode: "create" | "edit") => void;
  setInitialData: (data: any) => void;
}

const SubcategoryTable = ({ setOpen, setMode, setInitialData }: Props) => {
  const pathname = usePathname();
  const { subcategories, deleteCategory, isLoading, isUpdating, isDeleting } =
    useSubCategories(pathname.split("/")[1]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSubCategories, setFilteredSubCategories] =
    useState(subcategories);

  useEffect(() => {
    setFilteredSubCategories(
      subcategories.filter((subcategory) =>
        subcategory.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, subcategories]);

  if (isLoading || isUpdating || isDeleting) {
    return (
      <div className="flex items-center justify-center mt-10">
        <LucideLoader className="animate-spin w-6 h-6" />
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-5">
      <Input
        placeholder="Search"
        className="w-1/6"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {filteredSubCategories.length !== 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubCategories.map((subcategory) => (
              <TableRow key={subcategory.id}>
                <TableHead>{subcategory.id}</TableHead>
                <TableHead>
                  {subcategory.image.length > 0 && (
                    <img
                      src={subcategory.image[0].url}
                      alt={subcategory.image[0].id}
                      className="w-10 h-10 rounded-md"
                    />
                  )}
                </TableHead>
                <TableHead>{subcategory.name}</TableHead>
                <TableHead className="flex items-center gap-2">
                  <Button
                    size={"icon"}
                    onClick={() => {
                      setMode("edit");
                      setInitialData(subcategory);
                      setOpen(true);
                    }}
                  >
                    <Pen />
                  </Button>
                  <Button
                    variant={"destructive"}
                    size={"icon"}
                    onClick={() => deleteCategory(subcategory.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 />
                  </Button>
                </TableHead>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <TableBody className="flex items-center justify-center w-full">
          <h1 className="text-gray-400 mt-5 text-center">
            No sub-categories found.
          </h1>
        </TableBody>
      )}
    </div>
  );
};

export default SubcategoryTable;
