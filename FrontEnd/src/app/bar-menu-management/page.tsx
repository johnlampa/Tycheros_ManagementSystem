"use client";
import React, { useState, useEffect } from "react";
import MenuManagementCard from "@/components/MenuManagementCard";
import { ProductDataTypes } from "../../../lib/types/ProductDataTypes";
import { InventoryDataTypes } from "../../../lib/types/InventoryDataTypes";
import { CategoriesDataTypes } from "../../../lib/types/CategoriesDataTypes";
import axios from "axios";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import Header from "@/components/Header";

export default function Page() {
  const [MenuData, setMenuData] = useState<ProductDataTypes[]>([]);
  const [menuProductHolder, setMenuProductHolder] =
    useState<ProductDataTypes | null>(null);
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
    axios
      .get("http://localhost:8081/menuManagement/getAllInventoryItems")
      .then((response) => {
        setInventoryData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching inventory data:", error);
      });

    // Fetch Menu Data (you might need to implement this endpoint)
    axios
      .get("http://localhost:8081/menuManagement/getProduct")
      .then((response) => {
        setMenuData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching menu data:", error);
      });
  }, []);

  return (
    <>
      <div className="flex justify-center items-center w-full pb-7 min-h-screen">
        <div className="w-[360px] flex flex-col items-center justify-center bg-white min-h-screen text-black">
          <Header text="Bar Menu" color={"tealGreen"} type={"orders"}>
            <Link href={"/menu-selection"} className="z-100">
              <button className="border border-white rounded-full h-[40px] w-[40px] bg-white text-white shadow-lg flex items-center justify-center overflow-hidden hover:bg-tealGreen group">
                <FaArrowLeft className="text-tealGreen group-hover:text-white transition-colors duration-300" />
              </button>
            </Link>
          </Header>

          <div className="mt-5">
            {categories.map((category) => (
              <div key={category.categoryName} className="mb-8">
                <p className="font-semibold text-lg mb-2">
                  {category.categoryName}
                </p>
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
        </div>
      </div>
    </>
  );
}
