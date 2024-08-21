"use client";
import React, { useState } from "react";
import MenuManagementCard from "@/components/ui/MenuManagementCard";
import { ProductDataTypes } from "../../../lib/types/ProductDataTypes";
import { InventoryDataTypes } from "../../../lib/types/InventoryDataTypes";

export default function Page() {
  const [MenuData, setMenuData] = useState<ProductDataTypes[]>([
    {
      productId: 1,
      productName: "Matcha",
      categoryName: "Milk Tea",
      sellingPrice: 90.0,
      imageUrl: "/assets/images/MilkTea.jpg",
      subitems: [
        [3, 50],
        [1, 80],
      ],
    },
    {
      productId: 1,
      productName: "Chocolate",
      categoryName: "Milk Tea",
      sellingPrice: 90.0,
      imageUrl: "/assets/images/MilkTea.jpg",
      subitems: [
        [3, 50],
        [2, 80],
      ],
    },
  ]);

  const [InventoryData, setInventoryData] = useState<InventoryDataTypes[]>([
    {
      inventoryId: 1,
      inventoryName: "Matcha Powder",
      unitOfMeasure: "grams",
      reorderPoint: 500,
    },
    {
      inventoryId: 2,
      inventoryName: "Chocolate Powder",
      unitOfMeasure: "grams",
      reorderPoint: 500,
    },
    {
      inventoryId: 3,
      inventoryName: "Milk",
      unitOfMeasure: "ml",
      reorderPoint: 1000,
    },
  ]);

  return (
    <>
      <div className="w-[362px] p-6 border mx-auto">
        <div>Menu Page</div>
        <div>
          {" "}
          Milk Tea
          <div>
            <MenuManagementCard
              menuData={MenuData}
              setMenuData={setMenuData}
              categoryName="Milk Tea"
              inventoryData={InventoryData}
              setInventoryData={setInventoryData}
            />
          </div>
        </div>
      </div>
    </>
  );
}
