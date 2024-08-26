"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

import OrderCard from "@/components/OrderCard";
import { Order } from "../../../lib/types/OrderDataTypes";
import { ProductDataTypes } from "../../../lib/types/ProductDataTypes";

function OrderSummaryPage() {
  const [menuData, setMenuData] = useState<ProductDataTypes[]>([]);

  useEffect(() => {
    fetch("http://localhost:8081/ordering/getCustomerMenu")
      .then((response) => response.json())
      .then((data) => setMenuData(data))
      .catch((error) => console.error("Error fetching menu data:", error));
  }, []);

  const [cart, setCart] = useState<Order>({
    employeeId: 1,
    date: new Date().toISOString(),
    status: "unpaid",
    orderItems: [],
  });

  const searchParams = useSearchParams();

  useEffect(() => {
    const cartParams = searchParams.get("cart");
    if (cartParams) {
      const cartHolder = JSON.parse(cartParams) as Order;
      setCart(cartHolder);
    }
  }, [searchParams]);

  const [quantityModalVisibility, setQuantityModalVisibility] = useState(false);
  const [subtotal, setSubtotal] = useState(0);

  const handleClick = () => {
    setOrder(cart);
  };

  const [order, setOrder] = useState<Order>(cart);

  useEffect(() => {
    console.log("Updated order: ", order);
  }, [order]);

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-[360px] flex flex-col justify-center items-center gap-3 py-3 border border-black">
        <div className="font-semibold text-2xl">Order Summary</div>
        <OrderCard
          cart={cart}
          setCart={setCart}
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
          I am Ready To Order
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
