import Image from "next/image";
import React from "react";

import type { MenuCardDataTypes } from "../../../lib/types/MenuCardDataTypes";

const MenuCard: React.FC<MenuCardDataTypes> = ({
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

      {/* <div className="relative w-[14.125rem] h-[20.125rem] rounded-[0.9375rem] overflow-hidden">
        <Image
          draggable={false}
          fill
          src={imageUrl}
          className="object-cover object-center"
          alt="/"
        />
        <div className="absolute bottom-0 left-0 px-5 pb-7 pl-5 z-10 font-poppins text-[#473d3d]">
          <h3 className="text-2xl font-semibold ">{productName}</h3>
          <span className="text-sm font-medium ">{sellingPrice}</span>
        </div>
      </div> */}
    </>
  );
};

export default MenuCard;
