import { cva, VariantProps } from "class-variance-authority";
import { FC } from "react";

const headerStyles = cva("w-full h-[90px] flex justify-center items-center", {
  variants: {
    bgColor: {
      tealGreen: "bg-blue-500 text-white",
      cream: "bg-gray-300 text-black",
    },
    textColor: {
      white: "text-sm",
      brown: "text-lg",
    },
    textSize: {
      md: "text-3xl",
      lg: "text-4xl",
    },
  },
  defaultVariants: {
    bgColor: "tealGreen",
    textColor: "white",
  },
});

interface HeaderProps extends VariantProps<typeof headerStyles> {
  text: string;
}

const Header: FC<HeaderProps> = ({ text, bgColor, textColor }) => {
  return (
    <header className={headerStyles({ bgColor, textColor })}>
      <div className="">{text}</div>
    </header>
  );
};

//put children bec u need to insert a button inside the header.
//header is a flexbox so allot a div where to put the button then format it to a size
//since all buttons will have the same size

export default Header;
