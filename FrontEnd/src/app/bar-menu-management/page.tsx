"use client";
import React, { useState } from "react";
import MenuManagementCard from "@/components/MenuManagementCard";
import { ProductDataTypes } from "../../../lib/types/ProductDataTypes";
import { InventoryDataTypes } from "../../../lib/types/InventoryDataTypes";
import { CategoriesDataTypes } from "../../../lib/types/CategoriesDataTypes";

import { useEffect } from "react";

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
      productId: 2,
      productName: "Chocolate",
      categoryName: "Milk Tea",
      sellingPrice: 90.0,
      imageUrl: "/assets/images/MilkTea.jpg",
      subitems: [
        [3, 50],
        [2, 80],
      ],
    },
    {
      productId: 3,
      productName: "San Mig",
      categoryName: "Beer",
      sellingPrice: 90.0,
      imageUrl: "/assets/images/MilkTea.jpg",
      subitems: [
        [3, 50],
        [2, 80],
      ],
    },
  ]);

  const [menuProductHolder, setMenuProductHolder] = useState<ProductDataTypes>({
    productId: 3,
    productName: "Strawberry",
    categoryName: "Milk Tea",
    sellingPrice: 90.0,
    imageUrl: "/assets/images/MilkTea.jpg",
    subitems: [
      [3, 50],
      [2, 80],
    ],
  });

  useEffect(() => {
    console.log("new/edited:", menuProductHolder);
  }, [menuProductHolder]); // This effect runs whenever menuProductHolder changes

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

  const categories: CategoriesDataTypes[] = [
    {
      categoryId: 1,
      categoryName: "Milk Tea",
    },
    {
      categoryId: 2,
      categoryName: "Beer",
    },
    {
      categoryId: 3,
      categoryName: "Coffee",
    },
    {
      categoryId: 4,
      categoryName: "Whiskey",
    },
    {
      categoryId: 5,
      categoryName: "Frappe",
    },
    {
      categoryId: 6,
      categoryName: "Tea",
    },
  ];

  return (
    <>
      <div className="w-[362px] p-6 border mx-auto">
        <div className="flex items-center justify-center font-bold text-2xl mb-5">
          Bar Menu
        </div>

        {categories.map((category) => (
          <div key={category.categoryName} className="mb-8">
            <p className="font-semibold text-lg">{category.categoryName}</p>
            <div>
              <MenuManagementCard
                categoryName={category.categoryName}
                menuData={MenuData}
                setMenuData={setMenuData}
                inventoryData={InventoryData}
                setInventoryData={setInventoryData}
                menuProductHolder={menuProductHolder}
                setMenuProductHolder={setMenuProductHolder}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
