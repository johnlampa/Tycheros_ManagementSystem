"use client";
import React, { useState, useEffect } from "react";
import MenuManagementCard from "@/components/MenuManagementCard";
import { ProductDataTypes } from "../../../lib/types/ProductDataTypes";
import { InventoryDataTypes } from "../../../lib/types/InventoryDataTypes";
import { CategoriesDataTypes } from "../../../lib/types/CategoriesDataTypes";
import axios from 'axios';

export default function Page() {
  const [MenuData, setMenuData] = useState<ProductDataTypes[]>([]);
  const [menuProductHolder, setMenuProductHolder] = useState<ProductDataTypes | null>(null);
  const [InventoryData, setInventoryData] = useState<InventoryDataTypes[]>([]);
  const [categories, setCategories] = useState<CategoriesDataTypes[]>([
    { categoryID: 7, categoryName: "Milk Tea" },
    { categoryID: 8, categoryName: "Beer" },
    { categoryID: 9, categoryName: "Coffee" },
    { categoryID: 10, categoryName: "Whiskey" },
    { categoryID: 11, categoryName: "Frappe" },
    { categoryID: 12, categoryName: "Tea" },
  ]);

  useEffect(() => {
    // Fetch Inventory Data
    axios.get('http://localhost:8081/menuManagement/getAllSubitems')
      .then(response => {
        setInventoryData(response.data);
      })
      .catch(error => {
        console.error("Error fetching inventory data:", error);
      });

    // Fetch Menu Data (you might need to implement this endpoint)
    axios.get('http://localhost:8081/menuManagement/getProduct')
      .then(response => {
        setMenuData(response.data);
      })
      .catch(error => {
        console.error("Error fetching menu data:", error);
      });
  }, []);

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
