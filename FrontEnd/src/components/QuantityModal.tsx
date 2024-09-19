import { useState } from "react";
import { useCartContext } from "../../lib/context/CartContext";
import { QuantityModalProps } from "../../lib/types/props/QuantityModalProps";
import Modal from "@/components/ui/Modal";
import { Order } from "../../lib/types/OrderDataTypes";
import { OrderItemDataTypes } from "../../lib/types/OrderDataTypes";
import { format } from "date-fns";

const QuantityModal: React.FC<QuantityModalProps> = ({
  productToAdd,
  quantityModalIsVisible,
  setQuantityModalVisibility,
  type,
}) => {
  const [cart, setCart] = useState<Order>({
    employeeID: 1,
    date: format(new Date(), "yyyy-MM-dd"),
    status: "Unpaid",
    orderItems: [],
  });
  //add a useEffect hook here to populate cart data. @adgramirez

  const [quantity, setQuantity] = useState(0);

  const handleSave = () => {
    if (type === "edit") {
      if (productToAdd.productID) {
        // Find the index of the order item with the same productID
        const itemIndex =
          cart?.orderItems?.findIndex(
            (item) => item.productID === productToAdd.productID
          ) || 0;

        setQuantity(cart.orderItems?.[itemIndex]?.quantity || 0);

        // If the item is found, update its quantity
        if (itemIndex !== undefined && itemIndex !== -1) {
          const updatedOrderItems = [...(cart?.orderItems || [])];
          if (quantity > 0) {
            updatedOrderItems[itemIndex].quantity = quantity; // Update the quantity
          } else {
            updatedOrderItems.splice(itemIndex, 1); // Remove the item if quantity is 0
          }

          setCart({ ...cart, orderItems: updatedOrderItems });
          console.log("Updated cart: ", {
            ...cart,
            orderItems: updatedOrderItems,
          });
        }
      }
    } else {
      if (quantity > 0 && productToAdd.productID) {
        const newOrderItem: OrderItemDataTypes = {
          productID: productToAdd.productID,
          quantity,
        };

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
          <div className="font-bold text-2xl text-black">
            {productToAdd.productName}
          </div>
          <div className="text-black">Enter Quantity</div>
          <div className="flex justify-center items-center">
            <button
              className="px-3 py-1 rounded-full border border-black text-gray-400 text-sm bg-white hover:bg-gray-50 hover:text-gray-600"
              onClick={() => {
                if (quantity > 0) setQuantity(quantity - 1);
              }}
            >
              -
            </button>
            <div className="text-black flex flex-col items-center justify-center mx-3">
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
