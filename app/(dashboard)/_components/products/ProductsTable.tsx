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
import { ProductWithRelations, useProduct } from "@/hooks/use-products";
import { toast } from "sonner";

interface Props {
  setOpen: (open: boolean) => void;
  setMode: (mode: "create" | "edit") => void;
  setInitialData: (data: any) => void;
}

const ProductsTable = ({ setOpen, setMode, setInitialData }: Props) => {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const { fetchProducts, products, deleteProduct, loading } = useProduct({
    storeId: pathname.split("/")[1],
  });
  const [filteredProducts, setfilteredProducts] =
    useState<ProductWithRelations[]>(products);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setfilteredProducts(
      products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, products]);

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
        className="w-1/6"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {filteredProducts.length !== 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Subcategory</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableHead>{product.id}</TableHead>
                <TableHead>
                  {product.image && product.image?.length > 0 ? (
                    <img
                      src={product.image[0].url}
                      alt={product.image[0].url}
                      className="w-10 h-10 rounded-md"
                    />
                  ) : (
                    <p>No image</p>
                  )}
                </TableHead>
                <TableHead>{product.name}</TableHead>
                <TableHead>{product.category.name}</TableHead>
                <TableHead>
                  {product.subcategories &&
                    product.subcategories.map((scat) => scat.name).join(", ")}
                </TableHead>
                <TableHead className="flex items-center gap-2">
                  <Button
                    size={"icon"}
                    onClick={() => {
                      setMode("edit");
                      setInitialData(product);
                      setOpen(true);
                    }}
                  >
                    <Pen />
                  </Button>
                  <Button
                    variant={"destructive"}
                    size={"icon"}
                    onClick={() => {
                      deleteProduct(product.id);
                      toast.success("Product deleted successfully.");
                    }}
                    disabled={loading}
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
          <h1 className="text-gray-400 mt-5 text-center">No products found.</h1>
        </TableBody>
      )}
    </div>
  );
};

export default ProductsTable;
