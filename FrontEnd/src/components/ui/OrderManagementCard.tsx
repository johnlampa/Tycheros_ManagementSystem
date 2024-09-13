"use client";
import React, { useEffect, useState, useCallback } from "react";
import { OrderManagementCardProps } from "../../../lib/types/props/OrderManagementCardProps";
import Link from "next/link";
import { Order } from "../../../lib/types/OrderDataTypes";

const OrderManagementCard: React.FC<OrderManagementCardProps> = React.memo(
  ({ order, menuData, orders, setOrders }) => {
    const [total, setTotal] = useState(0);

    useEffect(() => {
      // Calculate total price
      const calculatedTotal = order.orderItems?.reduce(
        (acc, { productID, quantity }) => {
          const product = menuData.find((item) => item.productID === productID);
          return product ? acc + product.sellingPrice * quantity : acc;
        },
        0
      );
      setTotal(calculatedTotal || 0);
    }, [order, menuData]);

    const updateOrderStatus = async (newStatus: string) => {
      try {
        const response = await fetch(
          "http://localhost:8081/orderManagement/updateOrderStatus",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              orderID: order.orderID,
              newStatus,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update order status");
        }

        alert(`Order status updated to ${newStatus}`);
      } catch (error) {
        console.error("Error updating order status:", error);
        alert("Error updating order status");
      }
    };

    const handleConfirmPayment = useCallback(() => {
      const updatedOrder: Order = {
        ...order,
        status: "Pending",
      };

      setOrders?.(
        orders.map((o) => (o.orderID === order.orderID ? updatedOrder : o))
      );
    }, [order, orders, setOrders]);

    const handleCompleteOrder = useCallback(() => {
      const updatedOrder: Order = {
        ...order,
        status: "Completed",
      };

      setOrders?.(
        orders.map((o) => (o.orderID === order.orderID ? updatedOrder : o))
      );
      updateOrderStatus("Completed");
    }, [order, orders, setOrders]);

    return (
      <>
        <div className="w-[320px] border border-black rounded-md p-3">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-2 font-semibold mb-3">
            <div className="flex items-center justify-center text-sm">Name</div>
            <div className="flex items-center justify-center text-sm">
              Price
            </div>
            <div className="flex items-center justify-center text-sm">
              Quantity
            </div>
            <div className="flex items-center justify-center text-sm">
              Subtotal
            </div>
          </div>

          {order.orderItems?.map(({ productID, quantity }, itemIndex) => {
            const product = menuData.find(
              (item) => item.productID === productID
            );
            if (!product) return null;

            const subtotal = product.sellingPrice * quantity;

            return (
              <div
                key={itemIndex}
                className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-2"
              >
                <div className="flex justify-center items-center text-sm">
                  {product.productName}
                </div>
                <div className="flex justify-center items-center">
                  {product.sellingPrice}
                </div>
                <div className="flex justify-center items-center">
                  {quantity}
                </div>
                <div className="flex justify-center items-center">
                  {subtotal}
                </div>
              </div>
            );
          })}
        </div>
        <div className="w-[320px] border border-black rounded-md p-1 mt-1 flex pl-10 gap-[185px]">
          <div>Total</div>
          <div>{total}</div>
        </div>

        {order.status === "Unpaid" && (
          <div className="ml-[190.57px]">
            <Link
              href={{
                pathname: "/payment-details",
                query: { order: JSON.stringify(order) },
              }}
            >
              <button
                className="border border-black px-2 py-1 rounded-md mt-1 text-sm"
                onClick={handleConfirmPayment}
              >
                Confirm Payment
              </button>
            </Link>
          </div>
        )}

        {order.status === "Pending" && (
          <div className="ml-[198.77px]">
            <button
              className="border border-black px-2 py-1 rounded-md mt-1 text-sm"
              onClick={handleCompleteOrder}
            >
              Complete Order
            </button>
          </div>
        )}

        {order.status === "Completed" && (
          <div className="ml-[231.21px]">
            <button
              className="border border-black px-2 py-1 rounded-md mt-1 text-sm"
              disabled
            >
              Completed
            </button>
          </div>
        )}
      </>
    );
  }
);

OrderManagementCard.displayName = "OrderManagementCard";

export default OrderManagementCard;
