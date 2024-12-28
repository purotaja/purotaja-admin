"use client";

import { Category, Image, Subcategory } from "@prisma/client";
import { useState, useEffect } from "react";
import { string } from "zod";

interface SubcategoryWithData extends Subcategory {
  image: Image[];
}

interface SubcategoryResponse {
  subcategories: SubcategoryWithData[];
}

interface UseSubCategories {
  subcategories: SubcategoryWithData[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  createCategory: (data: {
    name: string;
    image: { url: string; key: string };
  }) => Promise<void>;
  updateCategory: (
    categoryId: string,
    data: SubCategoryUpdateData
  ) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
  isUpdating: boolean;
  isDeleting: boolean;
}

interface SubCategoryUpdateData {
  name?: string;
  categoryId?: string;
  imageId?: string;
  image?: {
    url: string;
    key: string;
  };
}

export const useSubCategories = (storeId: string): UseSubCategories => {
  const [subcategories, setSubCategories] = useState<SubcategoryWithData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/${storeId}/subcategories`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SubcategoryResponse = await response.json();
      setSubCategories(data.subcategories);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch categories")
      );
      console.error("Error fetching categories:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const createCategory = async (data: {
    name: string;
    image: { url: string; key: string };
  }) => {
    try {
      setError(null);
      const response = await fetch(`/api/${storeId}/subcategories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create category");
      }

      // Refetch categories after successful creation
      await fetchCategories();
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to create category")
      );
      console.error("Error creating category:", err);
      throw err;
    }
  };

  const updateCategory = async (
    subcategoryId: string,
    data: SubCategoryUpdateData
  ) => {
    try {
      setIsUpdating(true);
      setError(null);

      const response = await fetch(
        `/api/${storeId}/subcategories/${subcategoryId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update category");
      }

      const { subcategory } = await response.json();
      
      // Update the local state with the updated category
      setSubCategories((prev) =>
        prev.map((cat) =>
          cat.id === subcategoryId ? { ...cat, ...subcategory } : cat
        )
      );
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to update category")
      );
      console.error("Error updating category:", err);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteCategory = async (subcategoryId: string) => {
    try {
      setIsDeleting(true);
      setError(null);

      const response = await fetch(
        `/api/${storeId}/subcategories/${subcategoryId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete category");
      }

      // Update the local state by removing the deleted category
      setSubCategories((prev) =>
        prev.filter((cat) => cat.id !== subcategoryId)
      );
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to delete category")
      );
      console.error("Error deleting category:", err);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (storeId) {
      fetchCategories();
    }
  }, [storeId]);

  return {
    subcategories,
    isLoading,
    isUpdating,
    isDeleting,
    error,
    refetch: fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
