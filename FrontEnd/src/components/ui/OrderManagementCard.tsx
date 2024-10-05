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

    const handleCancelUnpaidOrder = useCallback(() => {
      const updatedOrder: Order = {
        ...order,
        status: "Cancelled",
      };

      setOrders?.(
        orders.map((o) => (o.orderID === order.orderID ? updatedOrder : o))
      );
      updateOrderStatus("Cancelled");
    }, [order, orders, setOrders]);

    return (
      <>
        <div className="w-[320px]">
          <div className="flex justify-between p-1 text-sm text-black">
            <div>
              <span className="font-semibold">Order ID: </span>
              <span>{order.orderID}</span>
            </div>
            <div>
              <span className="font-semibold">Date: </span>
              <span>{order.date.substring(0, 10)}</span>
            </div>
          </div>
          <div className="rounded-md p-3 bg-cream text-black">
            <div className="grid grid-cols-[3fr_1fr_1fr_2fr] gap-2 font-semibold mb-3">
              <div className="text-[15px] text-black">Name</div>
              <div className="flex items-center justify-center text-[15px]">
                Price
              </div>
              <div className="flex items-center justify-center text-[15px]">
                Qty
              </div>
              <div className="text-right text-[15px]">Subtotal</div>
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
                  className="grid grid-cols-[3fr_1fr_1fr_2fr] gap-2"
                >
                  <div className="text-sm truncate">{product.productName}</div>
                  <div className="flex justify-center items-center text-[12px]">
                    {product.sellingPrice}
                  </div>
                  <div className="flex justify-center items-center text-[12px]">
                    {quantity}
                  </div>
                  <div className="text-right text-[12px] font-bold">
                    &#8369; {subtotal.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>

          {type === "payment" && (
            <div className="w-[320px] bg-cream rounded-md mt-1 px-3 py-1 grid grid-cols-[3fr_1fr_1fr_2fr] gap-2 text-black">
              <div className="text-sm">Discount </div>
              <div></div>
              <div></div>
              <div className="text-right text-[12px]">
                &#8369; {discountAmount?.toFixed(2)}
              </div>
            </div>
          )}

          <div className="w-[320px] bg-cream rounded-md mt-1 px-3 py-1 grid grid-cols-[3fr_1fr_1fr_2fr] gap-2 text-black">
            <div className="text-sm">Total</div>
            <div></div>
            <div></div>
            <div className="text-right text-[12px] font-bold">
              &#8369; {total.toFixed(2)}
            </div>
          </div>

          {type === "management" && (
            <>
              {order.status === "Unpaid" && (
                <div className="flex flex-col">
                  <div>
                    <Link
                      href={{
                        pathname: "/payment-details",
                        query: { order: JSON.stringify(order) },
                      }}
                    >
                      <button
                        className="px-2 py-1 rounded-md mt-1 float-right text-xs w-[130px] h-[28px] font-semibold bg-tealGreen text-white hover:text-tealGreen hover:bg-white hover:border hover:border-tealGreen duration-200"
                        onClick={handleConfirmPayment}
                      >
                        Confirm Payment
                      </button>
                    </Link>
                  </div>
                  <div>
                    <button
                      className="px-2 py-1 rounded-md mt-1 mb-5 float-right text-xs w-[130px] h-[28px] font-semibold border border-red bg-white text-red hover:text-white hover:bg-red hover:border duration-200"
                      onClick={handleCancelUnpaidOrder}
                    >
                      Cancel Order
                    </button>
                  </div>
                </div>
              )}

              {order.status === "Pending" && (
                <div className="ml-[198.77px]">
                  <button
                    className="px-2 py-1 rounded-md mt-1 mb-5 float-right text-xs w-[130px] h-[28px] font-semibold bg-tealGreen text-white"
                    onClick={handleCompleteOrder}
                  >
                    Complete Order
                  </button>
                </div>
              )}

              {(order.status === "Completed" ||
                order.status === "Cancelled") && (
                <div className="ml-[231.21px]">
                  <button
                    className="px-2 py-1 rounded-md mt-1 mb-5 float-right text-xs w-[130px] h-[28px] font-semibold bg-gray text-white justify-right"
                    disabled
                  >
                    {order.status}
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
