"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EllipsisVerticalIcon, LucideLoader, Pen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useOrders from "@/hooks/use-orders";
import { getDate } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  setOpen: (open: boolean) => void;
  setMode: (mode: "create" | "edit") => void;
  setInitialData: (data: any) => void;
}

const OrdersTable = ({ setOpen, setMode, setInitialData }: Props) => {
  const pathname = usePathname();
  const { orders, fetchOrders, deleteOrder, loading } = useOrders(
    pathname.split("/")[1]
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredorders, setFilteredorders] = useState(orders);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredorders(orders);
    } else {
      setFilteredorders(
        orders.filter((order) =>
          order.id.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, orders]);

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
      {filteredorders.length !== 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredorders.map((order) => (
              <TableRow key={order.id}>
                <TableHead>{order.id}</TableHead>
                <TableHead>{order.products.length}</TableHead>
                <TableHead>₹ {order.amount}</TableHead>
                <TableHead className="capitalize">{order.status}</TableHead>
                <TableHead>{getDate(order.createdAt)}</TableHead>
                <TableHead>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <EllipsisVerticalIcon />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="flex flex-col">
                      <Button
                        variant={"ghost"}
                        className="flex flex-row w-full justify-between"
                        onClick={() => {
                          setMode("edit");
                          setInitialData(order);
                          setOpen(true);
                        }}
                      >
                        <Pen /> Update Status
                      </Button>
                      <Button
                        variant={"ghost"}
                        className="flex flex-row w-full justify-between"
                        onClick={() => deleteOrder(order.id)}
                        disabled={loading}
                      >
                        <Trash2 /> Delete Order
                      </Button>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableHead>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <TableBody className="flex items-center justify-center w-full">
          <h1 className="text-gray-400 mt-5 text-center">No Orders found.</h1>
        </TableBody>
      )}
    </div>
  );
};

export default OrdersTable;
