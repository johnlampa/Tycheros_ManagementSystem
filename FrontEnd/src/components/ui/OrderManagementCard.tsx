"use client";
import { useEffect, useState } from "react";
import { OrderManagementCardProps } from "../../../lib/types/props/OrderManagementCardProps";
import Link from "next/link";
import { Order } from "../../../lib/types/OrderDataTypes";

const OrderManagementCard: React.FC<OrderManagementCardProps> = ({
  order,
  menuData,
  orders,
  setOrders,
}) => {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const calculatedTotal = order.orderItems?.reduce(
      (acc, { productID, quantity }) => {
        const product = menuData.find((item) => item.productID === productID);
        return product ? acc + product.sellingPrice * quantity : acc;
      },
      0
    );
    setTotal(calculatedTotal || 0);
  }, [order, menuData]);

  const handleConfirmPayment = () => {
    // Update the order status
    const updatedOrder: Order = {
      ...order,
      status: "pending",
    };

    // Update the orders array
    const updatedOrders: Order[] = orders.map((o) =>
      o.orderId === order.orderId ? updatedOrder : o
    );

    // Update the state
    if (setOrders) {
      setOrders(updatedOrders);
    }
  };

  const handleCompleteOrder = () => {
    // Update the order status
    const updatedOrder: Order = {
      ...order,
      status: "completed",
    };

    // Update the orders array
    const updatedOrders: Order[] = orders.map((o) =>
      o.orderId === order.orderId ? updatedOrder : o
    );

    // Update the state
    if (setOrders) {
      setOrders(updatedOrders);
    }
  };

  return (
    <>
      <div className="w-[320px] border border-black rounded-md p-3">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-2 font-semibold mb-3">
          <div className="flex items-center justify-center text-sm">Name</div>
          <div className="flex items-center justify-center text-sm">Price</div>
          <div className="flex items-center justify-center text-sm">
            Quantity
          </div>
          <div className="flex items-center justify-center text-sm">
            Subtotal
          </div>
        </div>

        {order.orderItems?.map(({ productID, quantity }, itemIndex) => {
          const product = menuData.find((item) => item.productID === productID);
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
              <div className="flex justify-center items-center">{quantity}</div>
              <div className="flex justify-center items-center">{subtotal}</div>
            </div>
          );
        })}
      </div>
      <div className="w-[320px] border border-black rounded-md p-1 mt-1 flex pl-10 gap-[185px]">
        <div>Total</div>
        <div>{total}</div>
      </div>

      {order.status === "unpaid" && (
        <div className="ml-[190.57px]">
          <Link
            href={{
              pathname: "/payment-details",
              query: { order: JSON.stringify(order) },
            }}
          >
            <button
              className="border border-black px-2 py-1 rounded-md mt-1 text-sm"
              onClick={(e) => {
                handleConfirmPayment();
              }}
            >
              Confirm Payment
            </button>
          </Link>
        </div>
      )}

      {order.status === "pending" && (
        <div className="ml-[198.77px]">
          <button
            className="border border-black px-2 py-1 rounded-md mt-1 text-sm"
            onClick={(e) => {
              e.preventDefault(); // Prevent navigation
              handleCompleteOrder();
            }}
          >
            Complete Order
          </button>
        </div>
      )}

      {order.status === "completed" && (
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
};

export default OrderManagementCard;
