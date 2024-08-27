"use client";
import { useEffect, useState } from "react";

import { Order } from "../../../lib/types/OrderDataTypes";
import { ProductDataTypes } from "../../../lib/types/ProductDataTypes";

import OrderManagementCard from "@/components/ui/OrderManagementCard";

export default function Page() {
  const [orders, setOrders] = useState<Order[]>([
    {
      orderID: 1,
      employeeID: 1,
      date: new Date().toISOString(),
      status: "unpaid",
      amount: 400,
      orderItems: [
        {
          productID: 1,
          quantity: 1,
        },
      ],
    },
    {
      orderID: 2,
      employeeID: 1,
      date: new Date().toISOString(),
      status: "unpaid",
      amount: 800,
      orderItems: [
        {
          productID: 1,
          quantity: 2,
        },
      ],
    },
    {
      orderID: 3,
      employeeID: 1,
      date: new Date().toISOString(),
      status: "unpaid",
      amount: 1200,
      orderItems: [
        {
          productID: 1,
          quantity: 3,
        },
      ],
    },
  ]);

  const [menuData, setMenuData] = useState<ProductDataTypes[]>([]);

  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("http://localhost:8081/ordering/getCustomerMenu")
      .then((response) => response.json())
      .then((data) => setMenuData(data))
      .catch((error) => console.error("Error fetching menu data:", error));
  }, []);

  return (
    <>
      <div className="flex justify-center items-center w-full">
        <div className="w-[360px] flex flex-col gap-3 justify-center items-center">
          <div className="flex justify-center items-center text-2xl font-semibold">
            Orders
          </div>
          {orders.map((order, orderIndex) => (
            <div key={orderIndex} className="mb-7">
              <OrderManagementCard
                order={order}
                menuData={menuData}
                orders={orders}
                setOrders={setOrders}
              ></OrderManagementCard>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
