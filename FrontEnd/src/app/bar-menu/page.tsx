"use client";
import React, { useState } from "react";
import { useCartContext } from "../../../lib/context/CartContext";

import MenuCard from "@/components/ui/MenuCard";
import QuantityModal from "@/components/QuantityModal";

import { CategoriesDataTypes } from "../../../lib/types/CategoriesDataTypes";
import { Order } from "../../../lib/types/OrderDataTypes";
import { ProductDataTypes } from "../../../lib/types/ProductDataTypes";
import Link from "next/link";

const MenuData = [
  {
    productId: 1,
    productName: "Matcha",
    categoryName: "Milk Tea",
    sellingPrice: 90.0,
    imageUrl: "/assets/images/MilkTea.jpg",
  },
  {
    productId: 2,
    productName: "Match",
    categoryName: "Milk Tea",
    sellingPrice: 90.0,
    imageUrl: "/assets/images/MilkTea.jpg",
  },
  {
    productId: 3,
    productName: "Matc",
    categoryName: "Milk Tea",
    sellingPrice: 90.0,
    imageUrl: "/assets/images/MilkTea.jpg",
  },
];

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

export default function Page() {
  const [productToAdd, setProductToAdd] = useState<ProductDataTypes>({
    productId: 1,
    productName: "Matcha",
    categoryName: "Milk Tea",
    sellingPrice: 90.0,
    imageUrl: "/assets/images/MilkTea.jpg",
  });

  const { cart, setCart } = useCartContext();

  // const [cart, setCart] = useState<Order>({
  //   employeeId: 1,
  //   date: Date(),
  //   status: "unpaid",
  //   orderItems: [],
  // });

  const [confirmedOrder, setConfirmedOrder] = useState<Order>({
    employeeId: 1,
    date: Date(),
    status: "unpaid",
    orderItems: [],
  });

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
              {MenuData.filter(
                (item) => item.categoryName === category.categoryName
              ).map((item, index) => (
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
