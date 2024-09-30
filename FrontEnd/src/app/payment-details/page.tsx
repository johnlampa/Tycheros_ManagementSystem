"use client";
import { Suspense, useEffect, useState } from "react";
import { Order } from "../../../lib/types/OrderDataTypes";
import { useSearchParams } from "next/navigation";
import { ProductDataTypes } from "../../../lib/types/ProductDataTypes";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import OrderCard from "@/components/OrderCard";
import OrderManagementCard from "@/components/ui/OrderManagementCard";
import { FaArrowLeft } from "react-icons/fa";

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

  const [orders, setOrders] = useState<Order[]>([]); //for component purposes. to remove when OrderManagementCard is refactored

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

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
      const paymentResponse = await fetch(
        "http://localhost:8081/orderManagement/processPayment",
        {
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
        }
      );

      if (!paymentResponse.ok) {
        throw new Error("Failed to process payment");
      }

      // Update order status
      const statusResponse = await fetch(
        "http://localhost:8081/orderManagement/updateOrderStatus",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderID: order.orderID,
            newStatus: "Pending", // Set new status as needed
          }),
        }
      );

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
        <div className="w-[360px] flex flex-col justify-center items-center gap-3 pb-3 border bg-white">
          <Header
            text="Payment Details"
            color={"tealGreen"}
            type={"payment_details"}
          >
            <Link href={"/order-management"} className="z-100">
              <button className="mr-3 border border-white rounded-full h-[40px] w-[40px] bg-white text-white shadow-lg flex items-center justify-center overflow-hidden hover:bg-tealGreen group">
                <FaArrowLeft className="text-tealGreen group-hover:text-white transition-colors duration-300" />
              </button>
            </Link>

          </Header>
          <div className="w-[320px] text-black">
            <div className="w-full bg-cream rounded-md p-3 mb-4">
              <p className="font-semibold">Vouchers and Discounts</p>
              <div className="flex justify-center items-center ">
                <input
                  className="text-black rounded-md w-full my-1 text-xs py-1 px-2"
                  placeholder="Enter Voucher or Discount Code Here"
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full bg-cream rounded-md p-3 mb-7">
              <p className="font-semibold">Payment Method</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <input
                      type="radio"
                      id="gcash"
                      name="paymentMethod"
                      value="GCash"
                      className="mr-2 text-blue-600 border-gray-300 focus:ring-blue-500"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label htmlFor="gcash" className="text-gray-700">
                      GCash
                    </label>
                  </div>
                  <div>
                    <span>Php </span>
                    {total}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <input
                      type="radio"
                      id="card"
                      name="paymentMethod"
                      value="Card"
                      className="mr-2 text-blue-600 border-gray-300 focus:ring-blue-500"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label htmlFor="card" className="text-gray-700">
                      Card
                    </label>
                  </div>
                  <div>
                    <span>Php </span>
                    {total}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <input
                      type="radio"
                      id="cash"
                      name="paymentMethod"
                      value="Cash"
                      className="mr-2 text-blue-600 border-gray-300 focus:ring-blue-500"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label htmlFor="cash" className="text-gray-700">
                      Cash
                    </label>
                  </div>
                  <div>
                    <span>Php </span>
                    {total}
                  </div>
                </div>

                <div className="flex gap-3 mt-3">
                  <div className="flex flex-col ">
                    <div className="text-xs font-semibold w-max">
                      Enter Reference Number:
                    </div>
                    <div className="text-xs">(for GCash or Card)</div>
                  </div>
                  <input
                    className="text-black rounded-md w-full my-1 text-xs py-1 px-2"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    placeholder="Reference"
                  />
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col">
              <div className="mb-3 font-semibold text-[25px]">Order Summary</div>
              <OrderManagementCard
                menuData={menuData}
                order={order}
                orders={orders}
                setOrders={setOrders}
                type={"payment"}
                discountAmount={discountAmount}
              ></OrderManagementCard>
            </div>

            <div className="mt-5">
              <Link href={"order-management"}>
                <button
                  className="w-full h-[39px] bg-tealGreen rounded-md p-3 flex justify-center items-center"
                  onClick={handleCompleteOrder}
                >
                  <span className="font-pattaya text-[20px] text-white">
                    Confirm Payment
                  </span>
                </button>
              </Link>
            </div>
          </div>
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
