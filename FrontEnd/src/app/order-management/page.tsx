"use client";

import { useEffect, useState } from "react";
import OrderManagementCard from "@/components/ui/OrderManagementCard";
import { Order } from "../../../lib/types/OrderDataTypes";
import { ProductDataTypes } from "../../../lib/types/ProductDataTypes";
import Header from "@/components/Header";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

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
      <div className="w-[360px] l-[100px] flex flex-col justify-center items-center bg-white ">
        <Header text="Orders" color={"tealGreen"} type={"orders"}>
        <Link href={"/"} className="z-100">
            <button className="mr-3 border border-white rounded-full h-[40px] w-[40px] bg-white text-white shadow-lg flex items-center justify-center overflow-hidden hover:bg-tealGreen group">
              <FaArrowLeft className="text-tealGreen group-hover:text-white transition-colors duration-300" />
            </button>
          </Link>
        </Header>
        <div className="h-[50px] w-full bg-tealGreen flex justify-center items-center">
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
