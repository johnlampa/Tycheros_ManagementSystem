"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import OrderCard from "@/components/OrderCard";
import { Order } from "../../../lib/types/OrderDataTypes";

export default function Page() {
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

  const [cart, setCart] = useState<Order>({
    employeeId: 1,
    date: new Date().toISOString(),
    status: "unpaid",
    orderItems: [],
  });
  const [order, setOrder] = useState<Order>({
    employeeId: 1,
    date: new Date().toISOString(),
    status: "unpaid",
    orderItems: [],
  });
  const searchParams = useSearchParams();

  useEffect(() => {
    const cartParams = searchParams.get("cart");
    let cartHolder: Order | null = null;

    if (cartParams) {
      cartHolder = JSON.parse(cartParams) as Order;
      setCart(cartHolder);
    } else {
      // Handle the case where the cart parameter is not present
      console.warn("No cart data found in the search parameters.");
    }

    console.log("cartholder: ", cartHolder);
  }, []); // Add searchParams as a dependency

  console.log("After use effect: ", cart);

  const [quantityModalVisibility, setQuantityModalVisibility] = useState(false);

  return (
    <>
      <div className="w-full flex justify-center items-center">
        <div className="w-[360px] flex flex-col justify-center items-center gap-3 border border-black">
          <div className="font-semibold text-2xl">Order Summary</div>
          <OrderCard
            cart={cart}
            setCart={setCart}
            setOrder={setOrder}
            menuData={MenuData}
            quantityModalIsVisible={quantityModalVisibility}
            setQuantityModalVisibility={setQuantityModalVisibility}
          />
        </div>
      </div>
    </>
  );
}
