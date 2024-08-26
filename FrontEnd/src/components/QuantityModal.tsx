import { useState } from "react";
import { useCartContext } from "../../lib/context/CartContext";

import { QuantityModalProps } from "../../lib/types/props/QuantityModalProps";

import Modal from "@/components/ui/Modal";

const QuantityModal: React.FC<QuantityModalProps> = ({
  productToAdd,
  quantityModalIsVisible,
  setQuantityModalVisibility,
  previousQuantity,
  type,
  cartState,
  setCartState,
}) => {
  const { cart, setCart } = useCartContext();

  const [quantity, setQuantity] = useState(0);

  const handleSave = () => {
    if (type === "edit") {
      if (productToAdd.productID) {
        // Find the index of the order item with the same productID
        const itemIndex = cartState?.orderItems?.findIndex(
          (item) => item[0] === productToAdd.productID // Access the productID directly
        );

        // If the item is found, update its quantity
        if (itemIndex !== undefined && itemIndex !== -1) {
          const updatedOrderItems = [...(cartState?.orderItems || [])];
          if (quantity > 0) {
            updatedOrderItems[itemIndex][1] = quantity; // Update the quantity
          } else {
            updatedOrderItems.splice(itemIndex, 1); // Remove the item if quantity is 0
          }

          if (setCartState) {
            setCartState({ ...cart, orderItems: updatedOrderItems });
            console.log("Updated cart: ", {
              ...cart,
              orderItems: updatedOrderItems,
            });
          }
        }
      }
    } else {
      if (quantity > 0 && productToAdd.productID) {
        const newOrderItem: [number, number] = [
          productToAdd.productID,
          quantity,
        ];

        // Ensure orderItems is always an array
        const updatedOrderItems = [...(cart.orderItems || []), newOrderItem];
        setCart({ ...cart, orderItems: updatedOrderItems });
        console.log("Updated cart: ", {
          ...cart,
          orderItems: updatedOrderItems,
        });
      }
    }

    // Close the modal after saving
    setQuantityModalVisibility(false);
    setQuantity(0);
  };

  return (
    <div className="w-full">
      <Modal
        modalIsVisible={quantityModalIsVisible}
        setModalVisibility={setQuantityModalVisibility}
      >
        <div className="flex flex-col gap-3 justify-center items-center">
          <div className="font-bold text-2xl">{productToAdd.productName}</div>
          <div>Enter Quantity</div>
          <div className="flex justify-center items-center">
            <button
              className="px-3 py-1 rounded-full border border-black text-gray-400 text-sm bg-white hover:bg-gray-50 hover:text-gray-600"
              onClick={() => {
                if (quantity > 0) setQuantity(quantity - 1);
              }}
            >
              -
            </button>
            <div className="flex flex-col items-center justify-center mx-3">
              {quantity}
            </div>
            <button
              className="px-3 py-1 rounded-full border border-black text-gray-400 text-sm bg-white hover:bg-gray-50 hover:text-gray-600"
              onClick={() => {
                setQuantity(quantity + 1);
              }}
            >
              +
            </button>
          </div>
          <button
            className="px-3 py-1 rounded-full border border-black text-gray-400 text-sm bg-white hover:bg-gray-50 hover:text-gray-600"
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
