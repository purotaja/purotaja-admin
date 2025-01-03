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
import { deleteUploadthingFiles } from "@/lib/server/uploadthing";
import { useCategories } from "@/hooks/use-categories";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";

export const SubcategorySchema = z.object({
  name: z.string(),
  image: z.object({
    url: z.string(),
    key: z.string(),
  }),
});

interface Props {
  open: boolean;
  mode?: "create" | "edit";
  initialData?: any;
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
  const [uploadedImage, setUploadedImage] = useState<{
    url: string;
    key: string;
  } | null>(initialData?.image[0] || null);
  const [loading, setLoading] = useState(false);

  const pathname = usePathname();
  const { categories } = useCategories(pathname.split("/")[1]);

  const form = useForm<z.infer<typeof SubcategorySchema>>({
    resolver: zodResolver(SubcategorySchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          image: {
            url: initialData.image[0].url,
            key: initialData.image[0].key,
          },
        }
      : {
          name: "",
          image: { url: "", key: "" },
        },
  });

  const handleImageUpload = async (res: ClientUploadedFileData<any>[]) => {
    console.log("Files: ", res);
    const image = res[0];

    setUploadedImage({
      url: image.appUrl,
      key: image.key,
    });
    form.setValue("image", {
      url: image.appUrl,
      key: image.key,
    });

    toast.success("Upload Completed");
  };

  const handleImageDelete = async () => {
    setLoading(true);
    try {
      await deleteUploadthingFiles([uploadedImage?.key as string]);
      setUploadedImage(null);
      form.setValue("image", { url: "", key: "" });
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (body: z.infer<typeof SubcategorySchema>) => {
    setLoading(true);
    let updatedBody;
    if (mode !== "create") {
      updatedBody = {
        ...body,
        imageId: initialData.image[0].id,
      };
    }

    try {
      mode === "create"
        ? console.log("Create Category: ", body)
        : console.log("Edit Category: ", updatedBody);

      toast.success("Category created successfully");
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Failed to create category");
    } finally {
      setLoading(false);
      setOpen(false);
    }
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
              name="name"
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
            {uploadedImage && (
              <div className="relative w-32 object-cover rounded-md group">
                <img
                  src={uploadedImage.url}
                  alt="Category Image"
                  className="rounded-md"
                />
                {!loading ? (
                  <button
                    onClick={handleImageDelete}
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
            )}
          </div>
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit">{mode === "create" ? "Create" : "Edit"}</Button>
        </form>
      </Form>
    </section>
  );
};

export default SubproductsForm;