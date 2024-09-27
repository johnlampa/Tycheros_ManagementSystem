"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import OrderCard from "@/components/OrderCard";
import { Order, OrderItemDataTypes } from "../../../lib/types/OrderDataTypes";
import { ProductDataTypes } from "../../../lib/types/ProductDataTypes";
import { format } from "date-fns";
import Header from "@/components/Header";
import Link from "next/link";

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
  const [previousPage, setPreviousPage] = useState("/order-management"); // Default to root in case there's no previous page

  const searchParams = useSearchParams();

  useEffect(() => {
    fetch("http://localhost:8081/ordering/getCustomerMenu")
      .then((response) => response.json())
      .then((data) => setMenuData(data))
      .catch((error) => console.error("Error fetching menu data:", error));
  }, []);

  const [cart, setCart] = useState<OrderItemDataTypes[]>([]);

  // Load cart and previous page from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart");
      const storedPreviousPage = localStorage.getItem("previousPage");

      if (savedCart) {
        setCart(JSON.parse(savedCart));
      } else {
        localStorage.setItem("cart", JSON.stringify([])); // Initialize empty cart
      }

      if (storedPreviousPage) {
        setPreviousPage(storedPreviousPage);
      }
    }
  }, []);

  // Function to create an order by sending data to the backend
  const createOrder = async () => {
    try {
      const response = await fetch(
        "http://localhost:8081/ordering/createOrder",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderitems: cart }),
        }
      );

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

    localStorage.removeItem("cart");
  };

  const handleClick = () => {
    createOrder(); // Call the function to create the order
  };

  useEffect(() => {
    console.log("Updated order: ", order);
  }, [order]);

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-[360px] flex flex-col justify-center items-center gap-3 pb-3 border border-black bg-[#EDE9D8]">
        <Header text="Order Summary" color={"tealGreen"} type={"order_summary"}>
          <Link href={previousPage}>
            <button>Back</button>
          </Link>
        </Header>
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
