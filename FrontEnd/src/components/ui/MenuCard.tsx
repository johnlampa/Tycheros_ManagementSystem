
import Image from "next/image";
import React from "react";

import { MenuCardProps } from "../../../lib/types/props/MenuCardProps";

const MenuCard: React.FC<MenuCardProps> = ({
  product,
  setProductToAdd,
  setQuantityModalVisibility,
}) => {
  return (
    <div className="flex flex-col bg-white border border-gray-300 rounded-md shadow-md overflow-hidden h-[300px]">
      {/* Image Section */}
      <div className="w-full h-[150px] relative">
        <Image
          draggable={false}
          fill
          src={product.imageUrl}
          className="object-cover"
          alt={product.productName}
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-col p-3 flex-1">
        <p className="text-sm font-extrabold">{product.productName}</p>
        <p className="text-sm text-gray-500">₱{product.sellingPrice}</p>

        {/* Button at the bottom */}
        <button
          className="mt-auto bg-[#3E7363] text-white py-2 rounded-md hover:bg-[#30594f] duration-200"
          onClick={() => {
            setQuantityModalVisibility(true);
            setProductToAdd(product);
            console.log("product to add: ", product);
          }}
        >
          Add Item
        </button>
      </div>
    </div>
  );
};

export default MenuCard;
