"use client";

import { useState } from "react";
import { Product } from "@prisma/client";
import { useEffect } from "react";

interface Subcategories {
  id: string;
  name: string;
}

export interface ProductWithRelations extends Omit<Product, "subcategories"> {
  discounted_price?: number;
  subcategories?: Subcategories[];
  category?: any;
  image?: any[];
}

export interface ProductCreateUpdate extends Omit<Product, "subcategories"> {
  discounted_price?: number;
  subcategories?: string[];
  category?: any;
  image?: any[];
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
}

interface ProductFilters {
  page?: number;
  limit?: number;
  categoryId?: string;
  subcategoryId?: string;
  minPrice?: number;
  maxPrice?: number;
}

export function useProduct({ storeId }: { storeId: string }) {
  const [products, setProducts] = useState<ProductWithRelations[]>([]);
  const [product, setProduct] = useState<ProductWithRelations | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () =>
    // filters: ProductFilters = { page: 1, limit: 10 }
    {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/${storeId}/products`);

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data.products);
        setPagination(data.pagination);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

  const fetchProduct = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/${storeId}/products/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }

      const data = await response.json();
      setProduct(data);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: Partial<ProductCreateUpdate>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/${storeId}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      const newProduct = await response.json();
      setProducts((prev) => [newProduct, ...prev]);
      return newProduct;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (
    id: string,
    productData: Partial<ProductCreateUpdate>
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/${storeId}/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      const updatedProduct = await response.json();
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? updatedProduct : p))
      );
      if (product?.id === id) {
        setProduct(updatedProduct);
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/${storeId}/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      setProducts((prev) => prev.filter((p) => p.id !== id));
      if (product?.id === id) {
        setProduct(null);
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [products.length]);

  return {
    products,
    product,
    pagination,
    loading,
    error,
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    setProducts,
    setProduct,
  };
}
