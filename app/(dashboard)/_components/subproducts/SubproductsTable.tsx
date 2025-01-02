import React, { useState, useEffect } from "react";
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
import SubMenus from "@/components/SubMenus";
import { SubproductType, useSubproduct } from "@/hooks/use-subproduct";

interface Props {
  setOpen: (open: boolean) => void;
  setMode: (mode: "create" | "edit") => void;
  setInitialData: (data: any) => void;
}

const SubproductsTable = ({ setOpen, setMode, setInitialData }: Props) => {
  const pathname = usePathname();
  const { subproducts, loading } = useSubproduct(pathname.split("/")[1]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSubproducts, setFilteredSubproducts] = useState<
    SubproductType[]
  >([]);

  useEffect(() => {
    setFilteredSubproducts(
      subproducts.filter((subproduct) =>
        subproduct.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, subproducts]);

  if (loading) {
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
        className="w-1/2 md:w-1/6"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {filteredSubproducts.length !== 0 ? (
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
            {filteredSubproducts.map((subproduct) => (
              <TableRow key={subproduct.id}>
                <TableHead>{subproduct.id}</TableHead>
                <TableHead>
                  {subproduct.image.length > 0 && (
                    <img
                      src={subproduct.image[0].url}
                      alt={subproduct.image[0].id}
                      className="w-10 h-10 rounded-md"
                    />
                  )}
                </TableHead>
                <TableHead>{subproduct.name}</TableHead>
                <TableHead className="flex items-center gap-2">
                  <SubMenus>
                    <Button
                      variant={"ghost"}
                      onClick={() => {
                        setMode("edit");
                        setInitialData(subproduct);
                        setOpen(true);
                      }}
                    >
                      <Pen /> Update subproduct
                    </Button>
                    {/* <Button
                      variant={"ghost"}
                      onClick={() => deleteCategory(subproduct.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 /> Delete subproduct
                    </Button> */}
                  </SubMenus>
                </TableHead>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <TableBody className="flex items-center justify-center w-full">
          <h1 className="text-gray-400 mt-5 text-center">
            No sub-products found.
          </h1>
        </TableBody>
      )}
    </div>
  );
};

export default SubproductsTable;
