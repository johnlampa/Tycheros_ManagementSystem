"use client";
import React, { useEffect, useState, useCallback } from "react";
import { OrderManagementCardProps } from "../../../lib/types/props/OrderManagementCardProps";
import Link from "next/link";
import { Order } from "../../../lib/types/OrderDataTypes";

const OrderManagementCard: React.FC<OrderManagementCardProps> = React.memo(
  ({ order, menuData, orders, setOrders, type, discountAmount }) => {
    const [total, setTotal] = useState(0);

    useEffect(() => {
      // Calculate total price
      const calculatedTotal = order.orderItems?.reduce(
        (acc, { productID, quantity }) => {
          const product = menuData.find((item) => item.productID === productID);
          if (discountAmount) {
            return product
              ? acc + product.sellingPrice * quantity - discountAmount
              : acc;
          } else {
            return product ? acc + product.sellingPrice * quantity : acc;
          }
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
        <div className="w-[320px]">
          <div className="flex justify-between p-1 text-sm">
            <div>
              <span className="font-semibold">Order ID: </span>
              <span>{order.orderID}</span>
            </div>
            <div>
              <span className="font-semibold">Date: </span>
              <span>{order.date.substring(0, 10)}</span>
            </div>
          </div>
          <div className="rounded-md p-3 bg-cream">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-2 font-semibold mb-3">
              <div className="text-xs">Name</div>
              <div className="flex items-center justify-center text-xs">
                Price
              </div>
              <div className="flex items-center justify-center text-xs">
                Quantity
              </div>
              <div className="flex items-center justify-center text-xs">
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
                  <div className="text-sm truncate">{product.productName}</div>
                  <div className="flex justify-center items-center text-sm">
                    {product.sellingPrice}
                  </div>
                  <div className="flex justify-center items-center text-sm">
                    {quantity}
                  </div>
                  <div className="flex justify-center items-center text-sm">
                    {subtotal}
                  </div>
                </div>
              );
            })}
          </div>

          {type === "payment" && (
            <div className="w-[320px] bg-cream rounded-md mt-1 px-3 py-1 grid grid-cols-[2fr_1fr_1fr_1fr] gap-2">
              <div className="text-sm">Discount</div>
              <div></div>
              <div></div>
              <div className="flex justify-center items-center text-sm">
                {discountAmount}
              </div>
            </div>
          )}

          <div className="w-[320px] bg-cream rounded-md mt-1 px-3 py-1 grid grid-cols-[2fr_1fr_1fr_1fr] gap-2">
            <div className="text-sm">Total</div>
            <div></div>
            <div></div>
            <div className="flex justify-center items-center text-sm">
              {total}
            </div>
          </div>

          {type === "management" && (
            <>
              {order.status === "Unpaid" && (
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-2">
                  <div></div>
                  <div></div>
                  <div></div>
                  <Link
                    href={{
                      pathname: "/payment-details",
                      query: { order: JSON.stringify(order) },
                    }}
                  >
                    <button
                      className="px-2 py-1 rounded-md mt-1 text-xs w-[130px] font-semibold bg-tealGreen text-white"
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
                    className="border border-black px-2 py-1 rounded-md mt-1 text-xs"
                    onClick={handleCompleteOrder}
                  >
                    Complete Order
                  </button>
                </div>
              )}

              {order.status === "Completed" && (
                <div className="ml-[231.21px]">
                  <button
                    className="border border-black px-2 py-1 rounded-md mt-1 text-xs"
                    disabled
                  >
                    Completed
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </>
    );
  }
);

OrderManagementCard.displayName = "OrderManagementCard";

export default OrderManagementCard;
