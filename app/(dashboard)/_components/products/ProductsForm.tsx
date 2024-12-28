import React, { useState } from "react";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/lib/utils";
import { ClientUploadedFileData } from "uploadthing/types";
import { toast } from "sonner";
import { LucideLoader, X } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { deleteUploadthingFiles } from "@/lib/server/uploadthing";
import { usePathname } from "next/navigation";
import { useCategories } from "@/hooks/use-categories";
import { useSubCategories } from "@/hooks/use-subcategories";
import { useProduct } from "@/hooks/use-products";
import { MultiSelect } from "@/components/ui/multi-select";
import { Cat, Dog, Fish, Rabbit, Turtle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Subcategory } from "@prisma/client";

export const ProductsSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  price: z.number().min(1),
  stock: z.number().min(1),
  discount: z.number().min(0),
  categoryId: z.string(),
  subcategories: z.array(z.string()).optional(),
  image: z.array(
    z.object({
      url: z.string(),
      key: z.string(),
    })
  ),
});

export interface InitialDataType {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  discount: number | null;
  categoryId: string;
  subcategories: any[];
  createdAt: Date;
  updatedAt: Date;
  image: {
    id: string;
    url: string;
    key: string;
  }[];
}

interface Props {
  mode?: "create" | "edit";
  initialData?: InitialDataType;
  setOpen: (open: boolean) => void;
}

const ProductsForm = ({ mode = "create", initialData, setOpen }: Props) => {
  const [subcategory, setSubcategory] = useState<string[]>(
    initialData ? initialData.subcategories.map((scat) => scat.id) : []
  );
  const [uploadedImage, setUploadedImage] = useState<
    | {
        url: string;
        key: string;
      }[]
    | null
  >(initialData?.image || null);
  const [isLoading, setIsLoading] = useState(false);

  const pathname = usePathname();
  const { categories, isLoading: catloading } = useCategories(
    pathname.split("/")[1]
  );
  const { subcategories, isLoading: subcatloading } = useSubCategories(
    pathname.split("/")[1]
  );
  const { createProduct, updateProduct, fetchProducts } = useProduct({
    storeId: pathname.split("/")[1],
  });

  const frameworksList = subcategories.map((sub) => {
    return { value: sub.id, label: sub.name };
  });

  const form = useForm<z.infer<typeof ProductsSchema>>({
    resolver: zodResolver(ProductsSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          description: initialData.description,
          price: initialData.price,
          stock: initialData.stock,
          discount: initialData.discount || 0,
          categoryId: initialData.categoryId,
          subcategories: initialData.subcategories
            ? initialData.subcategories.map((scat) => scat.id)
            : [],
          image: initialData.image
            ? initialData.image.map((img) => ({
                url: img.url,
                key: img.key,
              }))
            : [],
        }
      : {
          name: "",
          description: "",
          price: 0,
          stock: 0,
          discount: 0,
          categoryId: "",
          subcategories: [],
          image: [{ url: "", key: "" }],
        },
  });

  const handleImageUpload = async (res: ClientUploadedFileData<any>[]) => {
    const image = res;

    setUploadedImage((prev) => [
      ...(prev || []),
      ...image.map((img) => ({
        url: img.appUrl,
        key: img.key,
      })),
    ]);

    form.setValue("image", [
      ...form.getValues("image"),
      ...image.map((img) => ({
        url: img.appUrl,
        key: img.key,
      })),
    ]);

    toast.success("Upload Completed");
  };

  const handleImageDelete = async (key: string) => {
    setIsLoading(true);
    try {
      await deleteUploadthingFiles([key as string]);
      setUploadedImage((prev) => prev?.filter((img) => img.key !== key) || []);
      form.setValue(
        "image",
        form.getValues("image").filter((img) => img.key !== key)
      );
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (body: z.infer<typeof ProductsSchema>) => {
    body = {
      ...body,
      subcategories: subcategory,
    };

    try {
      mode === "create"
        ? await createProduct(body)
        : initialData && (await updateProduct(initialData.id, body));

      const message =
        mode === "create"
          ? "Product created successfully."
          : "Product updated successfully.";
      toast.success(message);
    } catch (error) {
      console.log("Error: ", error);
      toast.error("An error occurred while creating the product.");
    } finally {
      setOpen(false);
      fetchProducts();
    }
  };

  if (catloading || subcatloading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LucideLoader size={32} className="animate-spin" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
      >
        {/* Image Upload */}
        <div className="flex flex-row w-full gap-2">
          <FormField
            name="image"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <UploadDropzone
                    endpoint="imageUploader"
                    onClientUploadComplete={handleImageUpload}
                    onUploadError={(error: Error) => {
                      console.log("Error: ", error);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex gap-4">
            {uploadedImage &&
              uploadedImage.map((image, index) => (
                <div
                  className="relative w-32 object-cover rounded-md group"
                  key={index}
                >
                  <img
                    src={image.url}
                    alt="Product Image"
                    className="rounded-md"
                  />
                  {!isLoading ? (
                    <button
                      type="button"
                      onClick={() => handleImageDelete(image.key)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    >
                      <X size={16} />
                    </button>
                  ) : (
                    <div className="absolute top-1 right-1 bg-primary p-1 text-white rounded-full">
                      <LucideLoader size={16} className="animate-spin" />
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>

        <div className="flex flex-row gap-10 w-full">
          <div className="w-full">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product description" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Price Field */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter price"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Category Selection */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(({ id, name, image }, idx) => (
                        <SelectItem value={id} key={idx} className="capitalize">
                          <div className="flex gap-2 items-center" key={idx}>
                            {image.slice(0).map((img) => (
                              <img
                                src={img.url}
                                alt={img.key}
                                key={img.key}
                                className="w-8 h-8 rounded-md"
                              />
                            ))}
                            {name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <div className="w-full">
            {/* Stock Field */}
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter stock quantity"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Discount Field */}
            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter discount percentage"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Subcategory Selection */}
            <div>
              <Label>Subcategory</Label>
              <MultiSelect
                options={frameworksList}
                onValueChange={setSubcategory}
                defaultValue={subcategory}
                placeholder="Select subcategories"
                variant="inverted"
                animation={2}
                maxCount={3}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-row">
          <Button type="submit" className="flex">
            Submit Product
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductsForm;
