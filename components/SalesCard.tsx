import { getDate } from "@/lib/utils";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Props {
  datas: {
    id: string;
    amount: string;
    status: string;
    createdAt: Date;
  }[];
}

const SalesCard = ({ datas }: Props) => {
  if (datas.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-4">
        No data found
      </div>
    );
  }

  return (
    <Table>
      <TableCaption>Recent Orders</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Order Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {datas.map((data, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{index + 1}.</TableCell>
            <TableCell>{getDate(data.createdAt, "date")}</TableCell>
            <TableCell>₹ {data.amount}</TableCell>
            <TableCell>{data.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SalesCard;
