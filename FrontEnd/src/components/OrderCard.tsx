import { useState, useEffect } from "react";
import { OrderCardProps } from "../../lib/types/props/OrderCardProps";
import { ProductDataTypes } from "../../lib/types/ProductDataTypes";
import QuantityModal from "@/components/QuantityModal";
import Link from "next/link";

const OrderCard: React.FC<OrderCardProps> = ({
  cart,
  setCart,
  order,
  setOrder,
  menuData,
  quantityModalIsVisible,
  setQuantityModalVisibility,
  subtotal,
  setSubtotal,
  type,
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
    const newSubtotal = cart.reduce((acc, item) => {
      const { productID, quantity } = item;
      const product = menuData.find((p) => p.productID === productID);
      return acc + (product?.sellingPrice || 0) * quantity;
    }, 0);

    setSubtotal(newSubtotal || 0);
  }, [cart, menuData, setSubtotal]);

  return (
    <>
      <div className="rounded-lg mt-[25px]">
        <div className="w-[303.75px] rounded-md p-2 grid grid-cols-[1fr_2fr_1fr] bg-[#59988D] ">
          <div className="flex items-center justify-center">
            <span className="text-[11px] text-white font-semibold">
              Quantity
            </span>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-[11px] text-white font-semibold">Name</span>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-[11px] text-white font-semibold">
              Product Total
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          {cart.map((item, index) => {
            const { productID, quantity } = item;
            const product = menuData.find((p) => p.productID === productID);

            return (
              <div key={index}>
                <div className="grid grid-cols-[1fr_2fr_1fr] w-[303.75px] rounded-sm p-2 h-[50px]">
                  {type === "summary" ? (
                    <div className="flex items-center justify-center">
                      <button
                        className="w-[26.33px] h-[21.11px] border border-[#B2AB99] text-black text-sm bg-[#EDE9D8] hover:bg-gray-50 hover:text-gray-600"
                        onClick={() => {
                          if (product) {
                            setProductToAdd(product);
                            setQuantityModalVisibility(true);
                          } else {
                            console.warn(
                              "Product not found for ID:",
                              productID
                            );
                          }
                        }}
                      >
                        <span className="text-[11px]">{quantity}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="text-black text-sm flex items-center justify-center">
                      <span className="text-[11px]">{quantity}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-center text-sm italic text-[11px]">
                    <span className="text-[11px]">
                      {product?.productName || "Unknown"}
                    </span>
                  </div>
                  <div className="flex items-center justify-center text-sm text-[11px]">
                    <span className="text-[11px]">
                      {product ? product.sellingPrice * quantity : "N/A"}
                    </span>
                  </div>
                  <QuantityModal
                    productToAdd={productToAdd}
                    quantityModalIsVisible={quantityModalIsVisible}
                    setQuantityModalVisibility={setQuantityModalVisibility}
                    previousQuantity={quantity}
                    type="edit"
                    // cartState={cart}
                    // setCartState={setCart}
                  />
                </div>
                <div className="h-[1px] w-full bg-[#59988D]"></div>
              </div>
            );
          })}
        </div>
        {type === "summary" ? (
          <div className="grid grid-cols-[1fr_1fr_1fr] w-[303.75px] mt-[10px]">
            <Link href={"/"}>
              <div className="flex justify-center items-center">
                <span className="text-[11px] font-bold underline">
                  Add more items
                </span>
              </div>
            </Link>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default OrderCard;
