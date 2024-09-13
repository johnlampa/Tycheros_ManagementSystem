"use client";
import { Suspense, useEffect, useState } from "react";
import { Order } from "../../../lib/types/OrderDataTypes";
import { useSearchParams } from "next/navigation";
import { ProductDataTypes } from "../../../lib/types/ProductDataTypes";
import { useRouter } from "next/navigation";
import Link from "next/link";

function PaymentDetailsPage() {
  const [menuData, setMenuData] = useState<ProductDataTypes[]>([]);
  const [order, setOrder] = useState<Order>({
    employeeID: 1,
    date: new Date().toISOString(),
    status: "Unpaid",
    orderItems: [],
  });
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [discountType, setDiscountType] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:8081/ordering/getCustomerMenu")
      .then((response) => response.json())
      .then((data) => setMenuData(data))
      .catch((error) => console.error("Error fetching menu data:", error));
  }, []);

  useEffect(() => {
    const orderParams = searchParams.get("order");
    if (orderParams) {
      const orderHolder = JSON.parse(orderParams) as Order;
      setOrder(orderHolder);
    }
  }, [searchParams]);

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

  const handleCompleteOrder = async () => {
    const finalAmount = total - discountAmount;

    try {
      // Process payment
      const paymentResponse = await fetch("http://localhost:8081/orderManagement/processPayment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderID: order.orderID,
          amount: finalAmount,
          method: paymentMethod,
          referenceNumber,
          discount: discountType,
          discountAmount: discountAmount,
        }),
      });

      if (!paymentResponse.ok) {
        throw new Error("Failed to process payment");
      }

      // Update order status
      const statusResponse = await fetch("http://localhost:8081/orderManagement/updateOrderStatus", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderID: order.orderID,
          newStatus: "Pending", // Set new status as needed
        }),
      });

      if (!statusResponse.ok) {
        throw new Error("Failed to update order status");
      }

      alert("Payment processed and order status updated successfully");
      router.push("/order-management");

    } catch (error) {
      console.error("Error:", error);
      alert("Error processing payment or updating order status");
    }
  };

  return (
    <>
      <div className="w-full flex justify-center items-center">
        <div className="w-[360px] flex flex-col justify-center items-center gap-3 py-3 border border-white">
          <div className="text-2xl font-semibold mb-3">Payment</div>
          <div className="w-[320px] border border-black rounded-md flex flex-col justify-center items-center p-3">
            Vouchers and Discounts Type
            <input
              className="border border-black text-black"
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value)}
            />
            Amount
            <input
              className="border border-black text-black"
              value={discountAmount}
              onChange={(e) => setDiscountAmount(parseFloat(e.target.value))}
            />
          </div>

          <div className="w-[320px] border border-black rounded-md flex flex-col justify-center items-center p-3">
            Payment Method
            <div className="space-y-2">
              <div className="flex justify-center items-center">
                <input
                  type="radio"
                  id="gcash"
                  name="paymentMethod"
                  value="GCash"
                  className="mr-2 text-blue-600 border-gray-300 focus:ring-blue-500"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="gcash" className="text-gray-700">GCash</label>
              </div>

              <div className="flex justify-center items-center">
                <input
                  type="radio"
                  id="card"
                  name="paymentMethod"
                  value="Card"
                  className="mr-2 text-blue-600 border-gray-300 focus:ring-blue-500"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="card" className="text-gray-700">Card</label>
              </div>

              <div className="flex justify-center items-center">
                <input
                  type="radio"
                  id="cash"
                  name="paymentMethod"
                  value="Cash"
                  className="mr-2 text-blue-600 border-gray-300 focus:ring-blue-500"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="cash" className="text-gray-700">Cash</label>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col text-xs">
                  <div>Enter Reference Number:</div>
                  <div>(for GCash or Card)</div>
                </div>
                <input
                  className="w-[100px] border border-black text-black"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="w-[320px] flex flex-col justify-center items-center p-3">
            <div className="mb-3 font-semibold text-lg">Order Summary</div>
            <div className="w-[320px] border border-black rounded-md p-3">
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-2 font-semibold mb-3">
                <div className="flex items-center justify-center text-sm">Name</div>
                <div className="flex items-center justify-center text-sm">Price</div>
                <div className="flex items-center justify-center text-sm">Quantity</div>
                <div className="flex items-center justify-center text-sm">Subtotal</div>
              </div>

              {order.orderItems?.map(({ productID, quantity }, itemIndex) => {
                const product = menuData.find((item) => item.productID === productID);
                if (!product) return null;

                const subtotal = product.sellingPrice * quantity;

                return (
                  <div key={itemIndex} className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-2">
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
          </div>

          <button
            className="w-[320px] border border-white rounded-md p-3 flex justify-center items-center font-semibold"
            onClick={handleCompleteOrder}
          >
            Complete Payment
          </button>
        </div>
      </div>
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentDetailsPage />
    </Suspense>
  );
}
