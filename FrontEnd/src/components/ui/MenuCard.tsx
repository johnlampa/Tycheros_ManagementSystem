import Image from "next/image";
import React from "react";

import type { ProductDataTypes } from "../../../lib/types/ProductDataTypes";

const MenuCard: React.FC<ProductDataTypes> = ({
  productId,
  productName,
  categoryName,
  sellingPrice,
  imageUrl,
}) => {
  return (
    <>
      <div className="flex flex-col bg-[#D1C198] py-3">
        <div className="w-[135px] h-[98px] rounded-sm relative overflow-hidden mx-auto">
          <Image
            draggable={false}
            fill
            src={imageUrl}
            className="rounded-card object-cover object-center"
            alt="/"
          />
        </div>

        <div className="ml-5 my-2">
          <p>{productName}</p>
          <p>{sellingPrice}</p>
        </div>

        <button className="border bg-[#5A3714] text-white mx-2">
          Add Item
        </button>
      </div>
    </>
  );
};

export default MenuCard;
