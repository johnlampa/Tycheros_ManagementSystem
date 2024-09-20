"use client"; // This ensures the component is a client component

import { useState, useEffect } from "react";
import { QuantityModalProps } from "../../lib/types/props/QuantityModalProps";
import Modal from "@/components/ui/Modal";
import { OrderItemDataTypes } from "../../lib/types/OrderDataTypes";

const QuantityModal: React.FC<QuantityModalProps> = ({
  productToAdd,
  quantityModalIsVisible,
  setQuantityModalVisibility,
  type,
}) => {
  const [cart, setCart] = useState<OrderItemDataTypes[]>([]);
  const [quantity, setQuantity] = useState(0);

  // Load cart from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      } else {
        localStorage.setItem("cart", JSON.stringify([])); // Initialize empty cart
      }
    }
  }, []);

  // Set quantity based on product being edited when modal is opened
  useEffect(() => {
    if (type === "edit" && quantityModalIsVisible && productToAdd.productID) {
      const item = cart.find(
        (item) => item.productID === productToAdd.productID
      );
      if (item) {
        setQuantity(item.quantity); // Set the quantity if the product is in the cart
      } else {
        setQuantity(0); // If the product is not in the cart, set to 0
      }
    } else if (type !== "edit") {
      setQuantity(0); // Reset quantity to 0 if adding a new product
    }
  }, [type, quantityModalIsVisible, productToAdd, cart]);

  // Handle saving the product (either adding or editing)
  const handleSave = () => {
    if (productToAdd.productID) {
      const itemIndex = cart.findIndex(
        (item) => item.productID === productToAdd.productID
      );

      const updatedCart = [...cart];

      if (itemIndex !== -1) {
        if (type === "edit") {
          updatedCart[itemIndex].quantity = quantity;
        } else {
          // If product exists in the cart, add the new quantity to the existing one
          updatedCart[itemIndex].quantity += quantity;
        }
      } else {
        // If product does not exist, add it to the cart
        const newOrderItem: OrderItemDataTypes = {
          productID: productToAdd.productID,
          quantity,
        };
        updatedCart.push(newOrderItem);
      }

      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }

    setQuantityModalVisibility(false);
    setQuantity(0); // Reset the quantity after saving
  };

  return (
    <div className="w-full">
      <Modal
        modalIsVisible={quantityModalIsVisible}
        setModalVisibility={setQuantityModalVisibility}
      >
        <div className="flex flex-col gap-3 justify-center items-center">
          <div className="font-bold text-2xl text-black">
            {productToAdd.productName}
          </div>
          <div className="text-black">Enter Quantity</div>
          <div className="flex justify-center items-center">
            <button
              className="px-3 py-1 rounded-full border border-black text-gray-400 text-sm bg-white hover:bg-gray-50 hover:text-gray-600"
              onClick={() => setQuantity((prev) => Math.max(prev - 1, 0))}
            >
              -
            </button>
            <div className="text-black flex flex-col items-center justify-center mx-3">
              {quantity}
            </div>
            <button
              className="px-3 py-1 rounded-full border border-black text-gray-400 text-sm bg-white hover:bg-gray-50 hover:text-gray-600"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>
          <button
            className="px-3 py-1 rounded-full border border-black text-black text-sm bg-white hover:bg-gray-100"
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
