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

  let pathname = usePathname();

  // Handle saving the product (either adding or editing)
  const handleSave = () => {
    if (productToAdd.productID) {
      const itemIndex = cart.findIndex(
        (item) => item.productID === productToAdd.productID
      );

      const updatedCart = [...cart];

      if (type === "edit") {
        if (quantity === 0) {
          // If quantity is 0 in edit mode, remove the product from the cart
          if (itemIndex !== -1) {
            updatedCart.splice(itemIndex, 1);
          }
        } else if (itemIndex !== -1) {
          // Update the product quantity in edit mode
          updatedCart[itemIndex].quantity = quantity;
        }
      } else {
        // Non-edit mode
        if (quantity > 0) {
          if (itemIndex !== -1) {
            // Add the new quantity to the existing product
            updatedCart[itemIndex].quantity += quantity;
          } else {
            // Add a new product if it doesn't exist in the cart
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
    setQuantity(0); // Reset the quantity after saving

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
        <div className="flex flex-col gap-3 justify-center items-center h-[40px] ">
          <div className="font-bold text-2xl text-black mt-20">
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
