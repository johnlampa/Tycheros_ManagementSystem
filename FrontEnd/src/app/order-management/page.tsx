"use client";

import { useEffect, useState } from "react";
import OrderManagementCard from "@/components/ui/OrderManagementCard";
import { Order } from "../../../lib/types/OrderDataTypes";
import { ProductDataTypes } from "../../../lib/types/ProductDataTypes";
import Header from "@/components/Header";
import Link from "next/link";

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
    <div className="flex justify-center items-center w-full pb-7">
      <div className="w-[360px] flex flex-col justify-center items-center bg-white">
        <Header text="Orders" color={"cream"} type={"orders"}></Header>
        <div className="h-[68px] w-full border-x-0 border-y-[1px] border-primaryBrown bg-tealGreen flex justify-center items-center">
          <div className="w-max grid grid-cols-3 gap-x-5 gap-y-2">
            {/* edit href */}
            <Link href={"/order-management/unpaid"}>
              <div
                className={`w-[88px] h-[25px] rounded-sm border border-white flex justify-center items-center font-pattaya text-white`}
              >
                Unpaid
              </div>
            </Link>
            <Link href={"/order-management/pending"}>
              <div
                className={`w-[88px] h-[25px] rounded-sm border border-white flex justify-center items-center font-pattaya text-white`}
              >
                Pending
              </div>
            </Link>
            <Link href={"/order-management/completed"}>
              <div
                className={`w-[88px] h-[25px] rounded-sm border border-white flex justify-center items-center font-pattaya text-white`}
              >
                Completed
              </div>
            </Link>
          </div>
        </div>
        {orders.toReversed().map((order, orderIndex) => (
          <div key={orderIndex} className="mt-7">
            <OrderManagementCard
              order={order}
              menuData={menuData}
              orders={orders}
              setOrders={setOrders}
              type={"management"}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
