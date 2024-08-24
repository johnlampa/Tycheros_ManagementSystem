import { useState } from "react";
import { QuantityModalProps } from "../../lib/types/props/QuantityModalProps";
import Modal from "@/components/ui/Modal";

const QuantityModal: React.FC<QuantityModalProps> = ({
  productToAdd,
  cart,
  setCart,
  quantityModalIsVisible,
  setQuantityModalVisibility,
}) => {
  const [quantity, setQuantity] = useState(0);

  const handleSave = () => {
    let newOrderItem: [number, number] | null = null;

    if (productToAdd.productId) {
      newOrderItem = [productToAdd.productId, quantity];
    }

    if (cart.orderItems && newOrderItem) {
      cart.orderItems = [...cart.orderItems, newOrderItem];
    }

    // Close the modal after saving
    setQuantityModalVisibility(false);

    setQuantity(0);

    console.log(cart);
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
