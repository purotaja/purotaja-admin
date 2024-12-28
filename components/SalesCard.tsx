import React from "react";

interface Props {
  datas: {
    name: string;
    img?: string;
    email: string;
    price: number;
  }[];
}

const SalesCard = ({ datas }: Props) => {
  if (datas.length === 0) {
    return <div className="text-center text-muted-foreground py-4">No data found</div>;
  }

  return datas.map((data) => (
    <div className="grid grid-cols-8 py-4">
      <div className="col-span-1">{data.name}</div>
      <div className="col-span-5">{data.email}</div>
      <div className="col-span-2">{data.price}</div>
    </div>
  ));
};

export default SalesCard;
