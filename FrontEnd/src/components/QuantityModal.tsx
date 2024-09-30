"use client"; // This ensures the component is a client component

import { useState, useEffect } from "react";
import { QuantityModalProps } from "../../lib/types/props/QuantityModalProps";
import Modal from "@/components/ui/Modal";
import { OrderItemDataTypes } from "../../lib/types/OrderDataTypes";
import { usePathname } from "next/navigation";

const QuantityModal: React.FC<QuantityModalProps> = ({
  productToAdd,
  quantityModalIsVisible,
  setQuantityModalVisibility,
  type,
}) => {
  const [cart, setCart] = useState<OrderItemDataTypes[]>([]);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      } else {
        localStorage.setItem("cart", JSON.stringify([]));
      }
    }
  }, []);

  useEffect(() => {
    if (type === "edit" && quantityModalIsVisible && productToAdd.productID) {
      const item = cart.find((item) => item.productID === productToAdd.productID);
      if (item) {
        setQuantity(item.quantity);
      } else {
        setQuantity(0);
      }
    } else if (type !== "edit") {
      setQuantity(0);
    }
  }, [type, quantityModalIsVisible, productToAdd, cart]);

  let pathname = usePathname();

  const handleSave = () => {
    if (productToAdd.productID) {
      const itemIndex = cart.findIndex(
        (item) => item.productID === productToAdd.productID
      );

      const updatedCart = [...cart];

      if (type === "edit") {
        if (quantity === 0) {
          if (itemIndex !== -1) {
            updatedCart.splice(itemIndex, 1);
          }
        } else if (itemIndex !== -1) {
          updatedCart[itemIndex].quantity = quantity;
        }
      } else {
        if (quantity > 0) {
          if (itemIndex !== -1) {
            updatedCart[itemIndex].quantity += quantity;
          } else {
            const newOrderItem: OrderItemDataTypes = {
              productID: productToAdd.productID,
              quantity,
            };
            updatedCart.push(newOrderItem);
          }
        }
      }

      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }

    setQuantityModalVisibility(false);
    setQuantity(0);

    if (pathname === "/order-summary") {
      window.location.reload();
    }
  };

  return (
    <div className="w-full">
  <Modal
    modalIsVisible={quantityModalIsVisible}
    setModalVisibility={setQuantityModalVisibility}
  >
    {/* Adjust the modal content to remove extra space */}
    <div className="flex flex-col gap-3 justify-center items-center w-[250px] p-5 bg-white rounded-md shadow-lg m-0 border-black">
      {/* Product Name */}
      <div className="font-bold text-2xl text-black text-center">
        {productToAdd.productName}
      </div>

      {/* Quantity Input */}
      <div className="text-black text-center">Enter Quantity</div>
      <div className="flex justify-center items-center">
        <button
          className="px-3 py-1 rounded-full border border-black text-black text-sm bg-white hover:bg-gray-50 hover:text-gray-600"
          onClick={() => setQuantity((prev) => Math.max(prev - 1, 0))}
        >
          -
        </button>
        <div className="text-black flex flex-col items-center justify-center mx-3">
          {quantity}
        </div>
        <button
          className="px-3 py-1 rounded-full border border-black text-black text-sm bg-white hover:bg-gray-50 hover:text-gray-600"
          onClick={() => setQuantity(quantity + 1)}
        >
          +
        </button>
      </div>

      {/* Confirm Button */}
      <button
        className="px-4 py-2 mt-3 rounded-full border border-black text-black text-sm bg-tealGreen hover:bg-gray-500"
        onClick={handleSave}
      >
        Confirm
      </button>
    </div>
  </Modal>
</div>

  );
};

export default QuantityModal;
