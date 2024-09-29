"use client";

import { useState, useEffect, Suspense } from "react";
import OrderCard from "@/components/OrderCard";
import { Order, OrderItemDataTypes } from "../../../lib/types/OrderDataTypes";
import { ProductDataTypes } from "../../../lib/types/ProductDataTypes";
import Header from "@/components/Header";
import Link from "next/link";
import OrderButtonSection from "@/components/section/OrderButtonSection";

function OrderSummaryPage() {
  const [quantityModalVisibility, setQuantityModalVisibility] = useState(false);

  const [menuData, setMenuData] = useState<ProductDataTypes[]>([]);
  const [order, setOrder] = useState<Order>({
    employeeID: 1,
    date: new Date().toISOString(),
    status: "Unpaid",
    orderItems: [],
  });
  const [subtotal, setSubtotal] = useState(0);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const cart: OrderItemDataTypes[] = order.orderItems || [];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "http://localhost:8081/orderManagement/getOrders"
        );
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        setOrders(data);

        // Retrieve orderID from localStorage
        const storedOrderID = localStorage.getItem("orderID");
        if (storedOrderID) {
          // Find the order with the matching orderID
          const matchingOrder = data.find(
            (order: Order) => order.orderID === parseInt(storedOrderID)
          );
          if (matchingOrder) {
            setOrder(matchingOrder); // Set the matching order in the state
          } else {
            console.warn("No order found with the given ID.");
            console.log(order.orderID);
          }
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Error fetching orders");
      } finally {
        setLoading(false);
      }
    };

    const fetchMenuData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8081/orderManagement/getMenuData"
        );
        if (!response.ok) throw new Error("Failed to fetch menu data");
        const data = await response.json();
        setMenuData(data);
      } catch (error) {
        console.error("Error fetching menu data:", error);
        setError("Error fetching menu data");
      }
    };

    fetchOrders();
    fetchMenuData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-[360px] flex flex-col justify-center items-center gap-3 bg-[#EDE9D8]">
        <Header text="Checkout" color={"tealGreen"} type={"checkout"}>
          <Link href={"/"}>
            <button>Back</button>
          </Link>
        </Header>
        <OrderCard
          cart={order.orderItems || cart}
          setOrder={setOrder}
          menuData={menuData}
          quantityModalIsVisible={quantityModalVisibility}
          setQuantityModalVisibility={setQuantityModalVisibility}
          subtotal={subtotal}
          setSubtotal={setSubtotal}
          type={"checkout"}
        />
        <div className="w-[360px] h-[105px] mt-[50px] p-5 rounded-xl bg-cream drop-shadow-[0_-5px_3px_rgba(0,0,0,0.15)] drop">
          <div className="flex justify-center items-center w-[315px] ml-[2.5px] mb-2">
            <span className="text-[20px] text-primaryBrown font-semibold text-center">
              Please proceed to counter to finalize payment
            </span>
          </div>
        </div>
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
