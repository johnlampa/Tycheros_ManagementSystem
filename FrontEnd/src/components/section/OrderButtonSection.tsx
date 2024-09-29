import { OrderButtonSectionProps } from "../../../lib/types/props/OrderButtonSectionProps";

const OrderButtonSection: React.FC<OrderButtonSectionProps> = ({
  subtotal,
  handleClick,
}) => {
  return (
    <>
      <div className="w-[360px] h-[105px] mt-[50px] p-5 rounded-xl bg-cream drop-shadow-[0_-5px_3px_rgba(0,0,0,0.15)] drop">
        <div className="flex justify-between items-center w-[315px] ml-[2.5px] mb-2">
          <div>
            <span className="font-bold text-[14px]">Subtotal</span>
            <span className="text-[10px] ml-[3px] text-gray">(incl. tax)</span>
          </div>
          <div className="font-bold text-[14px]">Php {subtotal}</div>
        </div>
        <button
          className="w-[320px] h-[39px] bg-tealGreen rounded-md"
          onClick={handleClick}
        >
          <span className="font-pattaya text-[20px] text-white">
            I&apos;m Ready to Order
          </span>
        </button>
      </div>
    </>
  );
};

export default OrderButtonSection;
