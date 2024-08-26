"use client";
import React, { useEffect, useState } from "react";
import { useCartContext } from "../../../lib/context/CartContext";

import MenuCard from "@/components/ui/MenuCard";
import QuantityModal from "@/components/QuantityModal";

import { CategoriesDataTypes } from "../../../lib/types/CategoriesDataTypes";
import { Order } from "../../../lib/types/OrderDataTypes";
import { ProductDataTypes } from "../../../lib/types/ProductDataTypes";
import Link from "next/link";

const categories: CategoriesDataTypes[] = [
  {
    categoryId: 7,
    categoryName: "Milk Tea",
  },
  {
    categoryId: 8,
    categoryName: "Beer",
  },
  {
    categoryId: 9,
    categoryName: "Coffee",
  },
  {
    categoryId: 10,
    categoryName: "Whiskey",
  },
  {
    categoryId: 11,
    categoryName: "Frappe",
  },
  {
    categoryId: 12,
    categoryName: "Tea",
  },
];

export default function Page() {
  const [menuData, setMenuData] = useState<ProductDataTypes[]>([]);

  useEffect(() => {
    fetch("http://localhost:8081/ordering/getCustomerMenu")
      .then((response) => response.json())
      .then((data) => setMenuData(data))
      .catch((error) => console.error("Error fetching menu data:", error));
  }, []);

  const [productToAdd, setProductToAdd] = useState<ProductDataTypes>({
    productID: 1,
    productName: "Matcha",
    categoryName: "Milk Tea",
    sellingPrice: 90.0,
    imageUrl: "/assets/images/MilkTea.jpg",
  });

  const { cart, setCart } = useCartContext();

  const [quantityModalVisibility, setQuantityModalVisibility] = useState(false);

  return (
    <>
      <div className="w-[362px] min-h-screen p-6 border mx-auto relative">
        <div className="flex items-center justify-center font-bold text-2xl mb-5">
          Bar Menu
        </div>

        <Link
          href={{
            pathname: "/order-summary",
            query: { cart: JSON.stringify(cart) }, // Pass cart items as a query parameter
          }}
        >
          <button className="absolute bottom-4 right-4 bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-600">
            Check Order
          </button>
        </Link>

        {categories.map((category) => (
          <div key={category.categoryName} className="mb-8">
            <p className="font-semibold text-lg">{category.categoryName}</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {menuData
                .filter((item) => item.categoryName === category.categoryName)
                .map((item, index) => (
                  <div key={index}>
                    <MenuCard
                      product={item}
                      setProductToAdd={setProductToAdd}
                      quantityModalIsVisible={quantityModalVisibility}
                      setQuantityModalVisibility={setQuantityModalVisibility}
                    />
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
      <div className="w-[312px] p-4">
        <QuantityModal
          productToAdd={productToAdd}
          quantityModalIsVisible={quantityModalVisibility}
          setQuantityModalVisibility={setQuantityModalVisibility}
        ></QuantityModal>
      </div>
    </>
  );
}
