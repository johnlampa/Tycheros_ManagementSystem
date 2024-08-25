import { OrderCardProps } from "../../lib/types/props/OrderCardProps";

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  menuData,
  quantityModalIsVisible,
  setQuantityModalVisibility,
}) => {
  return (
    <>
      <div className="w-[320px] rounded-sm p-2 grid grid-cols-[1fr_1fr_1fr_2fr]">
        <div className="flex items-center justify-center text-sm">Quantity</div>
        <div className="flex items-center justify-center text-sm">Name</div>
        <div className="flex items-center justify-center text-sm">Price</div>
        <div className="flex items-center justify-center text-sm">
          Product Total
        </div>
      </div>

      <div className="flex flex-col gap-3 items-center justify-center">
        {order?.orderItems?.map(([productId, quantity], index) => {
          const product = menuData.find((p) => p.productId === productId);

          return (
            <div key={index} className="grid grid-cols-[1fr_1fr_1fr_2fr]">
              <div className="flex items-center justify-center text-sm">
                {quantity}
              </div>
              <div className="flex items-center justify-center text-sm">
                {product?.productName || "Unknown"}
              </div>
              <div className="flex items-center justify-center text-sm">
                {product?.sellingPrice || "Unknown"}
              </div>
              <div className="flex items-center justify-center text-sm">
                {product ? product.sellingPrice * quantity : "N/A"}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default OrderCard;
