"use client";

import { Image, Subproduct } from "@prisma/client";
import { useState, useEffect } from "react";

interface createSubproductType {
  name: string;
  stock: string;
  perunitprice: string;
  prices: string[];
  productId: string;
  discount: string;
  image: any[];
}

interface UpdateSubproductType {
  name?: string;
  stock?: string;
  productId?: string;
  perunitprice?: string;
  inStock?: boolean;
  featured?: boolean;
  discount?: string;
  prices?: string[];
  image?: any[];
}

interface SubproductsWithImage extends Subproduct {
  image: Image[];
}

interface UseSubProductsReturnTypes {
  subproducts: SubproductsWithImage[];
  loading: boolean;
  fetchSubproducts: () => void;
  createSubproduct: (subproduct: createSubproductType) => void;
  updateSubproduct: (id: string, subproduct: UpdateSubproductType) => void;
  deleteSubproduct: (subproductId: string) => void;
}

export type SubproductType = SubproductsWithImage;

export const useSubproduct = (storeId: string): UseSubProductsReturnTypes => {
  const [subproducts, setSubproducts] = useState<SubproductsWithImage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubproducts = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/${storeId}/subproducts`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setSubproducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createSubproduct = async (subproduct: createSubproductType) => {
    setLoading(true);

    try {
      const response = await fetch(`/api/${storeId}/subproducts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subproduct),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      fetchSubproducts();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateSubproduct = async (
    id: string,
    subproduct: UpdateSubproductType
  ) => {
    setLoading(true);

    try {
      const response = await fetch(`/api/${storeId}/subproducts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subproduct),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      fetchSubproducts();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSubproduct = async (subproductId: string) => {
    setLoading(true);

    try {
      const response = await fetch(
        `/api/${storeId}/subproducts/${subproductId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      fetchSubproducts();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubproducts();
  }, []);

  return {
    subproducts,
    loading,
    fetchSubproducts,
    createSubproduct,
    updateSubproduct,
    deleteSubproduct,
  };
};
