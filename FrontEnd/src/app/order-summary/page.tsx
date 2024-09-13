"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import OrderCard from "@/components/OrderCard";
import { Order } from "../../../lib/types/OrderDataTypes";
import { ProductDataTypes } from "../../../lib/types/ProductDataTypes";

function OrderSummaryPage() {
  const [menuData, setMenuData] = useState<ProductDataTypes[]>([]);
  const [order, setOrder] = useState<Order>({
    employeeID: 1,
    date: new Date().toISOString(),
    status: "Unpaid",
    orderItems: [],
  });
  const [subtotal, setSubtotal] = useState(0);
  const [quantityModalVisibility, setQuantityModalVisibility] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    fetch("http://localhost:8081/ordering/getCustomerMenu")
      .then((response) => response.json())
      .then((data) => setMenuData(data))
      .catch((error) => console.error("Error fetching menu data:", error));
  }, []);

  useEffect(() => {
    const cartParams = searchParams.get("cart");
    if (cartParams) {
      const cartHolder = JSON.parse(cartParams) as Order;
      setOrder(cartHolder);
    }
  }, [searchParams]);

  // Function to create an order by sending data to the backend
  const createOrder = async () => {
    try {
      const response = await fetch("http://localhost:8081/ordering/createOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderitems: order.orderItems }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Order created:", data);
        // Handle success (e.g., navigate to a success page, clear cart, etc.)
      } else {
        console.error("Failed to create order");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleClick = () => {
    createOrder(); // Call the function to create the order
  };

  useEffect(() => {
    console.log("Updated order: ", order);
  }, [order]);

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-[360px] flex flex-col justify-center items-center gap-3 py-3 border border-black">
        <div className="font-semibold text-2xl">Order Summary</div>
        <OrderCard
          cart={order}
          setCart={setOrder}
          setOrder={setOrder}
          menuData={menuData}
          quantityModalIsVisible={quantityModalVisibility}
          setQuantityModalVisibility={setQuantityModalVisibility}
          subtotal={subtotal}
          setSubtotal={setSubtotal}
        />
        <div className="flex gap-[168px] rounded-lg border border-black w-[320px] px-2">
          <div>Subtotal</div>
          <div>{subtotal}</div>
        </div>
        <button
          className="rounded-lg border border-black w-[320px] px-2"
          onClick={handleClick}
        >
          I AM READY TO ORDER!
        </button>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderSummaryPage />
    </Suspense>
  );
}
