import React from "react";

interface Props {
  datas: {
    id: string;
    amount: number;
    status: string;
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
    <div className="grid grid-cols-8 py-4">
      <div className="col-span-1">{index + 1}.</div>
      <div className="col-span-3">{data.id}</div>
      <div className="col-span-2">₹ {data.amount}</div>
      <div className="col-span-1">{data.status}</div>
    </div>
  ));
};

export default SalesCard;
