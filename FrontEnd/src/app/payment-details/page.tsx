"use client";
import { Suspense, useEffect, useState } from "react";
import { Order } from "../../../lib/types/OrderDataTypes";
import { useSearchParams } from "next/navigation";
import { ProductDataTypes } from "../../../lib/types/ProductDataTypes";
import Link from "next/link";

function PaymentDetailsPage() {
  const [menuData, setMenuData] = useState<ProductDataTypes[]>([]);

  useEffect(() => {
    fetch("http://localhost:8081/ordering/getCustomerMenu")
      .then((response) => response.json())
      .then((data) => setMenuData(data))
      .catch((error) => console.error("Error fetching menu data:", error));
  }, []);

  const [order, setOrder] = useState<Order>({
    employeeID: 1,
    date: new Date().toISOString(),
    status: "Unpaid",
    orderItems: [],
  });

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

  const searchParams = useSearchParams();

  useEffect(() => {
    const orderParams = searchParams.get("order");
    if (orderParams) {
      const orderHolder = JSON.parse(orderParams) as Order;
      setOrder(orderHolder);
    }
  }, [searchParams]);

  return (
    <>
      <div className="w-full flex justify-center items-center">
        <div className="w-[360px] flex flex-col justify-center items-center gap-3 py-3 border border-black">
          <div className="text-2xl font-semibold mb-3">Payment</div>
          <div className="w-[320px] border border-black rounded-md flex flex-col justify-center items-center p-3">
            Vouchers and Discounts
            <input className="border border-black"></input>
          </div>

          <div className="w-[320px] border border-black rounded-md flex flex-col justify-center items-center p-3">
            Payment Method
            <div className="space-y-2">
              <div className="flex justify-center items-center">
                <input
                  type="radio"
                  id="option1"
                  name="options"
                  value="option1"
                  className="mr-2 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="option1" className="text-gray-700">
                  GCash
                </label>
              </div>

              <div className="flex justify-center items-center">
                <input
                  type="radio"
                  id="option2"
                  name="options"
                  value="option2"
                  className="mr-2 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="option2" className="text-gray-700">
                  Card
                </label>
              </div>

              <div className="flex justify-center items-center">
                <input
                  type="radio"
                  id="option3"
                  name="options"
                  value="option3"
                  className="mr-2 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="option3" className="text-gray-700">
                  Cash
                </label>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col text-xs">
                  <div>Enter Reference Number:</div>
                  <div>(for GCash or Card)</div>
                </div>
                <input className="w-[100px] border border-black"></input>
              </div>
            </div>
          </div>

          <div className="w-[320px] flex flex-col justify-center items-center p-3">
            <div className="mb-3 font-semibold text-lg">Order Summary</div>
            <div className="w-[320px] border border-black rounded-md p-3">
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-2 font-semibold mb-3">
                <div className="flex items-center justify-center text-sm">
                  Name
                </div>
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
          </div>

          <Link href="/order-management">
            <button className="w-[320px] border border-black rounded-md p-3 flex justify-center items-center font-semibold">
              Complete Payment
            </button>
          </Link>
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
