import { useState, useEffect } from "react";
import { OrderCardProps } from "../../lib/types/props/OrderCardProps";
import { ProductDataTypes } from "../../lib/types/ProductDataTypes";
import QuantityModal from "@/components/QuantityModal";

const OrderCard: React.FC<OrderCardProps> = ({
  cart,
  setCart,
  setOrder,
  menuData,
  quantityModalIsVisible,
  setQuantityModalVisibility,
  subtotal,
  setSubtotal,
}) => {
  const [productToAdd, setProductToAdd] = useState<ProductDataTypes>({
    productID: 1,
    productName: "Matcha",
    categoryName: "Milk Tea",
    sellingPrice: 90.0,
    imageUrl: "/assets/images/MilkTea.jpg",
  });

  // Update subtotal whenever cart or menuData changes
  useEffect(() => {
    const newSubtotal = cart.orderItems?.reduce((acc, item) => {
      // Ensure item is of type OrderItemDataTypes
      const { productID, quantity } = item;
      const product = menuData.find((p) => p.productID === productID);
      return acc + (product?.sellingPrice || 0) * quantity;
    }, 0);

    setSubtotal(newSubtotal || 0); // Ensure subtotal is always set correctly
  }, [cart, menuData, setSubtotal]); // Ensure useEffect re-runs when these dependencies change

  return (
    <>
      <div className="rounded-lg border border-black">
        <div className="w-[320px] rounded-sm p-2 grid grid-cols-[1fr_1fr_1fr_2fr]">
          <div className="flex items-center justify-center text-sm">
            Quantity
          </div>
          <div className="flex items-center justify-center text-sm">Name</div>
          <div className="flex items-center justify-center text-sm">Price</div>
          <div className="flex items-center justify-center text-sm">
            Product Total
          </div>
        </div>

        <div className="flex flex-col gap-3 items-center justify-center">
          {cart?.orderItems?.map((item, index) => {
            // Ensure item is of type OrderItemDataTypes
            const { productID, quantity } = item;
            const product = menuData.find((p) => p.productID === productID);

            return (
              <div
                key={index}
                className="grid grid-cols-[1fr_1fr_1fr_2fr] w-[320px] rounded-sm p-2"
              >
                <button
                  className="px-1 py-1 rounded-full border border-black text-gray-400 text-sm bg-white hover:bg-gray-50 hover:text-gray-600"
                  onClick={() => {
                    if (product) {
                      setProductToAdd(product);
                      setQuantityModalVisibility(true);
                    } else {
                      console.warn("Product not found for ID:", productID);
                    }
                  }}
                >
                  {quantity}
                </button>
                <div className="flex items-center justify-center text-sm">
                  {product?.productName || "Unknown"}
                </div>
                <div className="flex items-center justify-center text-sm">
                  {product?.sellingPrice || "Unknown"}
                </div>
                <div className="flex items-center justify-center text-sm">
                  {product ? product.sellingPrice * quantity : "N/A"}
                </div>
                <QuantityModal
                  productToAdd={productToAdd}
                  quantityModalIsVisible={quantityModalIsVisible}
                  setQuantityModalVisibility={setQuantityModalVisibility}
                  previousQuantity={quantity}
                  type="edit"
                  cartState={cart}
                  setCartState={setCart}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default OrderCard;
