import { cva, VariantProps } from "class-variance-authority";
import { FC, ReactNode } from "react";

const headerStyles = cva("w-full h-[90px] flex justify-center items-center", {
  variants: {
    color: {
      tealGreen: "bg-[#59988D] text-white",
      cream: "bg-[#EDE9D8] text-black",
    },
    type: {
      home: "text-3xl ml-[-25px]",
      order_summary: "text-3xl ml-[-25px]",
      checkout: "text-3xl ml-[40px]",
      orders: "",
      payment_details: "",
    },
  },
  defaultVariants: {
    color: "tealGreen",
  },
});

interface HeaderProps extends VariantProps<typeof headerStyles> {
  text: string;
  children?: ReactNode;
}

const Header: FC<HeaderProps> = ({ text, color, type, children }) => {
  const textContainerWidth = type === "home" ? "w-[200px] text-center" : "";

  return (
    <header className={headerStyles({ color })}>
      <div className="w-[80px] flex items-center p-[20px] z-100">
        <div className="rounded-full w-[40px] h-[40px] bg-black flex justify-center items-center z-10">
          {children}
        </div>
      </div>
      <div
        className={`w-[250px] flex items-center justify-center font-pattaya z-0 text-pretty`}
      >
        <div className={`${headerStyles({ type })} ${textContainerWidth}`}>
          <span className="drop-shadow-md">{text}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
