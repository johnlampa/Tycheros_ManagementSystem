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
      checkout: "text-3xl ml-[-60px]",
      orders: "text-4xl ml-[-60px]",
      payment_details: "text-3xl ml-[-25px]",
      menu: "text-5xl ml-[-25px]",
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
  const textContainerWidth = type === "home" ? "w-[190px] text-center" : "";
  const fontFamily = type === "menu" ? "font-pacifico" : "font-pattaya";

  return (
    <header className={headerStyles({ color })}>
      <div className="w-[80px] flex items-center p-[20px] z-100">
        <div className="rounded-full w-[40px] h-[40px] bg-black flex justify-center items-center z-10">
          {children}
        </div>
      </div>
      <div
        className={`w-[250px] flex items-center justify-center z-0 text-pretty ${fontFamily}`}
      >
        <div
          className={`${headerStyles({ type, color })} ${textContainerWidth}`}
        >
          <span className="drop-shadow-md">{text}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
