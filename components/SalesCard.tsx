import { getDate } from "@/lib/utils";
import React from "react";

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

  return datas.map((data, index) => (
    <div className="grid grid-cols-8 py-4" key={index}>
      <div className="col-span-1">{index + 1}.</div>
      <div className="col-span-3">{getDate(data.createdAt, "date")}</div>
      <div className="col-span-2">₹ {data.amount}</div>
      <div className="col-span-1">{data.status}</div>
    </div>
  ));
};

export default SalesCard;
