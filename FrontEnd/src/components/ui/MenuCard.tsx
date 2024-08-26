import Image from "next/image";
import React from "react";

import { MenuCardProps } from "../../../lib/types/props/MenuCardProps";
import { ProductDataTypes } from "../../../lib/types/ProductDataTypes";

const MenuCard: React.FC<MenuCardProps> = ({
  product,
  setProductToAdd,
  quantityModalIsVisible,
  setQuantityModalVisibility,
}) => {
  return (
    <>
      <div className="flex flex-col bg-[#D1C198] py-3">
        <div className="w-[135px] h-[98px] rounded-sm relative overflow-hidden mx-auto">
          <Image
            draggable={false}
            fill
            src={product.imageUrl}
            className="rounded-card object-cover object-center"
            alt="/"
          />
        </div>
        <div className="ml-5 my-2">
          <p>{product.productName}</p>
          <p>{product.sellingPrice}</p>
        </div>
        <button
          className="bg-[#5A3714] border-[#5A3714] border text-white mx-1 rounded-md hover:bg-white hover:border-[#5A3714] hover:text-[#5A3714] duration-200"
          onClick={() => {
            setQuantityModalVisibility(true);
            setProductToAdd(product);
            console.log("product to add: ", product);
          }}
        >
          Add Item
        </button>
      </div>
    </>
  );
};

export default MenuCard;
