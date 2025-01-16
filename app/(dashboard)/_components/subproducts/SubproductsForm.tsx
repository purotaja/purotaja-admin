import React, { useState } from "react";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/lib/utils";
import { ClientUploadedFileData } from "uploadthing/types";
import { toast } from "sonner";
import { LucideLoader, X } from "lucide-react";
import { deleteUploadthingFiles } from "@/lib/server/uploadthing";
import { useCategories } from "@/hooks/use-categories";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { useProduct } from "@/hooks/use-products";
import { SubproductType, useSubproduct } from "@/hooks/use-subproduct";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export const SubcategorySchema = z.object({
  name: z.string(),
  stock: z.string(),
  productId: z.string(),
  prices: z.array(z.string()),
  perunitprice: z.string(),
  inStock: z.boolean(),
  featured: z.boolean(),
  discount: z.string(),
  image: z.array(
    z.object({
      url: z.string(),
      key: z.string(),
    })
  ),
});

interface Props {
  open: boolean;
  mode?: "create" | "edit";
  initialData?: SubproductType;
  setInitialData: (data: any) => void;
  setOpen: (open: boolean) => void;
  setMode: (mode: "create" | "edit") => void;
}

const SubproductsForm = ({
  open,
  mode = "create",
  initialData,
  setInitialData,
  setOpen,
  setMode,
}: Props) => {
  const [uploadedImage, setUploadedImage] = useState<
    | {
        url: string;
        key: string;
      }[]
    | null
  >(initialData?.image || null);
  const [isLoading, setIsLoading] = useState(false);

  const pathname = usePathname();
  const { products } = useProduct({ storeId: pathname.split("/")[1] });
  const {
    subproducts,
    loading,
    updateSubproduct,
    createSubproduct,
    fetchSubproducts,
  } = useSubproduct(pathname.split("/")[1]);

  const prices = [
    {
      id: 1,
      value: "2.5",
      label: "250 grams",
    },
    {
      id: 2,
      value: "5",
      label: "500 grams",
    },
    {
      id: 3,
      value: "1",
      label: "100 grams",
    },
  ];

  const form = useForm<z.infer<typeof SubcategorySchema>>({
    resolver: zodResolver(SubcategorySchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          stock: initialData.stock.toString(),
          productId: initialData.productId || "",
          prices:
            (initialData.prices &&
              initialData.prices.map((price: any) => price?.value)) ||
            [],
          perunitprice: initialData.perunitprice.toString() || "",
          discount: initialData.discount.toString() || "",
          inStock: initialData.inStock,
          featured: initialData.featured,
          image: initialData.image
            ? initialData.image.map((img) => ({
                url: img.url,
                key: img.key,
              }))
            : [],
        }
      : {
          name: "",
          stock: "",
          perunitprice: "",
          discount: "",
          productId: "",
          inStock: true,
          featured: false,
          prices: [],
          image: [],
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
        form.getValues("image").filter((img) => img.key !== key) || []
      );
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (body: z.infer<typeof SubcategorySchema>) => {
    try {
      mode === "create"
        ? createSubproduct(body)
        : initialData && updateSubproduct(initialData.id, body);

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
      fetchSubproducts();
    }
    console.log(body);
  };

  return (
    <section className="flex flex-col">
      <div className="flex flex-row justify-between items-center py-4">
        <h1 className="text-xl font-semibold">
          {mode === "create" ? "Add" : "Update"} Subproduct
        </h1>
        <Button
          onClick={() => {
            setOpen(false);
            setMode("create");
            initialData && setInitialData(undefined);
          }}
        >
          Close
        </Button>
      </div>
      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col md:flex-row w-full gap-2">
            <FormField
              name="image"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <UploadDropzone
                      endpoint="imageUploader"
                      config={{ cn: twMerge }}
                      className="ut-button:bg-[#73549b] ut-label:text-[#73549b]"
                      onClientUploadComplete={handleImageUpload}
                      onUploadError={(error: Error) => {
                        console.log("Error: ", error);
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className=" flex flex-row flex-wrap gap-4 md:pt-8">
              {uploadedImage &&
                uploadedImage.map((image, index) => (
                  <div
                    className="relative object-cover rounded-md group"
                    key={index}
                  >
                    <img
                      src={image.url}
                      alt="Product Image"
                      className="rounded-md h-36"
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

          <div className="flex flex-col space-y-2 md:space-y-0 w-full">
            <div className="flex flex-col md:flex-row w-full md:gap-10">
              {/* Name */}
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Name</FormLabel>
                    <FormDescription>Enter name of product</FormDescription>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Product */}
              <FormField
                name="productId"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Product</FormLabel>
                    <FormDescription>Select a product</FormDescription>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {products.map(({ id, name, image }, idx) => (
                          <SelectItem
                            value={id}
                            key={idx}
                            className="capitalize"
                          >
                            <div className="flex gap-2 items-center" key={idx}>
                              {image &&
                                image
                                  .slice(0)
                                  .map((img) => (
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

              {/* Quantities */}
              <FormField
                name="prices"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Quantities</FormLabel>
                    <FormDescription>Select quantities</FormDescription>
                    <FormControl>
                      <MultiSelect
                        options={prices}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col md:flex-row w-full md:gap-10">
              {/* Stock */}
              <FormField
                name="stock"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Stock</FormLabel>
                    <FormDescription>
                      Enter stock count in grams
                    </FormDescription>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Price */}
              <FormField
                name="perunitprice"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Price</FormLabel>
                    <FormDescription>Enter price per 100 grams</FormDescription>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Discount */}
              <FormField
                name="discount"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Discount</FormLabel>
                    <FormDescription>Enter discount percentage</FormDescription>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row w-full space-y-2 md:space-y-0 md:gap-10">
            {/* Description */}
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col md:w-[500px]">
                  <FormLabel>Description</FormLabel>
                  <FormDescription>
                    Enter description of product
                  </FormDescription>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* In Stock */}
            <FormField
              name="inStock"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col border rounded-md p-4">
                  <FormLabel>In Stock</FormLabel>
                  <FormDescription>
                    Toggle if the product is in stock
                  </FormDescription>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Featured */}
            <FormField
              name="featured"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col border rounded-md p-4">
                  <FormLabel>Featured</FormLabel>
                  <FormDescription>
                    Toggle if the product should be featured
                  </FormDescription>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <Button type="submit">{mode === "create" ? "Create" : "Edit"}</Button>
        </form>
      </Form>
    </section>
  );
};

export default SubproductsForm;
