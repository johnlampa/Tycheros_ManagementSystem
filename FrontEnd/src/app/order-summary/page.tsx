"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import OrderCard from "@/components/OrderCard";
import { Order, OrderItemDataTypes } from "../../../lib/types/OrderDataTypes";
import { ProductDataTypes, SubitemDataTypes } from "../../../lib/types/ProductDataTypes";
import Header from "@/components/Header";
import Link from "next/link";
import OrderButtonSection from "@/components/section/OrderButtonSection";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";

function OrderSummaryPage() {
  const [menuData, setMenuData] = useState<ProductDataTypes[]>([]);
  const date = new Date();
  const time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  const dateTime = date.toISOString() + " " + time;

  const [order, setOrder] = useState<Order>({
    employeeID: 1,
    date: dateTime,
    status: "Unpaid",
    orderItems: [],
  });
  const [subtotal, setSubtotal] = useState(0);
  const [quantityModalVisibility, setQuantityModalVisibility] = useState(false);
  const [previousPage, setPreviousPage] = useState("/");
  const searchParams = useSearchParams();
  const [orderID, setOrderID] = useState(-1);
  const [cart, setCart] = useState<OrderItemDataTypes[]>([]);
  const [subitems, setSubitems] = useState<SubitemDataTypes[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch("http://localhost:8081/ordering/getCustomerMenu")
      .then((response) => response.json())
      .then((data) => setMenuData(data))
      .catch((error) => console.error("Error fetching menu data:", error));
  }, []);

  // Load cart and previous page from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart");
      const storedPreviousPage = localStorage.getItem("previousPage");

      if (savedCart) {
        setCart(JSON.parse(savedCart));
      } else {
        localStorage.setItem("cart", JSON.stringify([]));
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
        setOrderID(data.orderID);

        if (typeof window !== "undefined") {
          localStorage.setItem("orderID", data.orderID.toString());
        }
      } else {
        console.error("Failed to create order");
      }
    } catch (error) {
      console.error("Error:", error);
    }

    localStorage.removeItem("cart");
  };

  // Define the type for an update
  type UpdateType = {
    subinventoryID: number;
    quantityToReduce: number;
  };

  // Function to update inventory quantities after placing the order
  const updateInventoryAfterOrder = async (subitems: SubitemDataTypes[]) => {
    try {
      // Explicitly type the updates array
      let updates: UpdateType[] = [];

      // Iterate through each unique inventoryID to determine the correct quantity to reduce
      subitems.forEach((subitem) => {
        let quantityNeeded = subitem.quantityNeeded;

        // Filter all relevant subinventory entries for the given inventoryID in ascending order of expiryDate
        const relevantSubinventories = subitems
          .filter(
            (s) => s.inventoryID === subitem.inventoryID && s.quantityRemaining > 0
          )
          .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());

        // Iterate through subinventory items until the quantityNeeded is fulfilled
        for (let sub of relevantSubinventories) {
          if (quantityNeeded <= 0) break;

          // Determine how much we can deduct from the current subinventory
          const quantityToDeduct = Math.min(sub.quantityRemaining, quantityNeeded);

          // Push the deduction to the updates array
          updates.push({
            subinventoryID: sub.subinventoryID,
            quantityToReduce: quantityToDeduct,
          });

          // Log the deduction
          console.log(`Deducting ${quantityToDeduct} from subinventoryID ${sub.subinventoryID}`);

          // Update quantity needed for the next subinventory
          quantityNeeded -= quantityToDeduct;
        }
      });

      console.log("Final updates to be sent to backend:", updates);

      const response = await fetch(
        "http://localhost:8081/inventoryManagement/updateMultipleSubitemQuantities",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ updates }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update inventory quantities");
      }

      console.log("Inventory updated successfully");
    } catch (error) {
      console.error("Error updating inventory quantities:", error);
    }
  };


  const handleClick = async () => {
    await createOrder(); // Place the order
  
    // After creating the order, fetch the subitems and update inventory
    if (cart.length > 0) {
      try {
        const productIDs = cart.map((product) => product.productID);
        
        // Fetch all subinventory details for products in cart in one API call
        const response = await axios.post(
          "http://localhost:8081/inventoryManagement/getSubinventoryDetails",
          { productIDs }
        );

        const allSubitems: SubitemDataTypes[] = response.data;

        console.log("Fetched subitems for inventory update:", allSubitems);

        await updateInventoryAfterOrder(allSubitems); // Update inventory quantities
      } catch (error) {
        console.error("Error updating inventory after order:", error);
      }
    }

    // Remove the cart after the order is created
    localStorage.removeItem("cart");
  };

  useEffect(() => {
    console.log("Updated order: ", order);
  }, [order]);

  return (
    <div className="w-full flex justify-center items-center min-h-screen">
      <div className="w-[360px] flex flex-col items-center gap-3 bg-white min-h-screen">
        <Header text="Order Summary" color={"tealGreen"} type={"order_summary"}>
          <Link href={previousPage}>
            <button className="mr-3 border border-white rounded-full h-[40px] w-[40px] bg-white text-white shadow-lg flex items-center justify-center overflow-hidden hover:bg-tealGreen group">
              <FaArrowLeft className="text-tealGreen group-hover:text-white transition-colors duration-300" />
            </button>
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
          type={"summary"}
        />
        <div className="fixed bottom-0">
          <OrderButtonSection
            subtotal={subtotal}
            handleClick={handleClick}
          ></OrderButtonSection>
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
