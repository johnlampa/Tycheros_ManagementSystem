import Link from "next/link";
import { OrderDetailsSectionProps } from "../../../lib/types/props/OrderDetailsSectionProps";

const OrderDetailsSection: React.FC<OrderDetailsSectionProps> = ({
  orderID,
  date,
  subtotal,
}) => {
  return (
    <>
      <div className="flex flex-col w-[200px] mt-[20px]">
        <div className="flex justify-between">
          <span className="text-[10px] font-bold">Order ID:</span>
          <span className="text-[10px]">{orderID}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[10px] font-bold">Date:</span>
          <span className="text-[10px]">{date.substring(0, 10)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[10px] font-bold">Subtotal:</span>
          <span className="text-[10px]">{subtotal}</span>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsSection;
