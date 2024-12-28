"use client";

import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { Address, Orders } from "@prisma/client";

interface OrderUpdate {
  status?: string;
  address?: Partial<Address>;
}

interface UseOrdersReturn {
  orders: Orders[];
  currentOrder: Orders | null;
  loading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  fetchOrder: (orderId: string) => Promise<void>;
  updateOrder: (orderId: string, orderData: OrderUpdate) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  clearError: () => void;
}

const useOrders = (storeId: string): UseOrdersReturn => {
  const [orders, setOrders] = useState<Orders[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Orders | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch all orders
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/${storeId}/orders`);
      setOrders(response.data.orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch orders");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single order
  const fetchOrder = useCallback(async (orderId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/${storeId}/orders/${orderId}`);
      setCurrentOrder(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch order");
      console.error("Error fetching order:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update order
  const updateOrder = useCallback(
    async (orderId: string, orderData: OrderUpdate) => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.patch(
          `/api/${storeId}/orders/${orderId}`,
          orderData
        );

        // Update current order if it's the one being modified
        if (currentOrder?.id === orderId) {
          setCurrentOrder(response.data);
        }

        // Update orders list if the modified order is in it
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? response.data : order
          )
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update order");
        console.error("Error updating order:", err);
      } finally {
        setLoading(false);
      }
    },
    [currentOrder]
  );

  // Delete order
  const deleteOrder = useCallback(
    async (orderId: string) => {
      try {
        setLoading(true);
        setError(null);
        await axios.delete(`/api/${storeId}/orders/${orderId}`);

        // Remove from orders list
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.id !== orderId)
        );

        // Clear current order if it's the one being deleted
        if (currentOrder?.id === orderId) {
          setCurrentOrder(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete order");
        console.error("Error deleting order:", err);
      } finally {
        setLoading(false);
      }
    },
    [currentOrder]
  );

  return {
    orders,
    currentOrder,
    loading,
    error,
    fetchOrders,
    fetchOrder,
    updateOrder,
    deleteOrder,
    clearError,
  };
};

export default useOrders;
