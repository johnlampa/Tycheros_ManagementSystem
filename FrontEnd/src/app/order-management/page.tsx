"use client";

import { useEffect, useState } from "react";
import OrderManagementCard from "@/components/ui/OrderManagementCard";
import { Order } from "../../../lib/types/OrderDataTypes";
import { ProductDataTypes } from "../../../lib/types/ProductDataTypes";
import Header from "@/components/Header";

export default function Page() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuData, setMenuData] = useState<ProductDataTypes[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "http://localhost:8081/orderManagement/getOrders"
        );
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        setOrders(data);
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
    <div className="flex justify-center items-center w-full">
      <div className="w-[360px] flex flex-col gap-3 justify-center items-center">
        <Header text="Orders" color={"tealGreen"} type={"orders"}></Header>
        {orders.map((order, orderIndex) => (
          <div key={orderIndex} className="mb-7">
            <OrderManagementCard
              order={order}
              menuData={menuData}
              orders={orders}
              setOrders={setOrders}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
