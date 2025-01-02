"use client";

import { Image, Subproduct } from "@prisma/client";
import { useState, useEffect } from "react";

interface SubproductsWithImage extends Subproduct {
  image: Image[];
}

interface UseSubProductsReturnTypes {
  subproducts: SubproductsWithImage[];
  loading: boolean;
}

export type SubproductType = SubproductsWithImage;

export const useSubproduct = (storeId: string): UseSubProductsReturnTypes => {
  const [subproducts, setSubproducts] = useState<SubproductsWithImage[]>([]);
  const [loading, setLoading] = useState(true);

  //create subproduct api

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

  useEffect(() => {
    fetchSubproducts();
  }, []);

  return {
    subproducts,
    loading,
  };
};
