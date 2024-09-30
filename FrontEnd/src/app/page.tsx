import React from "react";
import Header from "@/components/Header";
import Link from "next/link";
import { GiHamburgerMenu } from "react-icons/gi";

export default function Home() {
  return (
    <>
      <div className="w-full flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center w-[360px] h-screen relative bg-cream">
          <Header
            text="Tycheros World Cafe and Bar"
            color={"tealGreen"}
            type={"home"}
          > 
            <button className="mr-5 mb-8 flex items-center justify-center overflow-hidden">
              <GiHamburgerMenu style={{ color: 'tealGreen', fontSize: '30vh' }} />
            </button>
          </Header>
          <div className="w-[360px] h-[203px] bg-black rounded-full mt-[20px] mb-[30px]"></div>
          <Link href={"/food-menu"}>
            <div className="w-[220px] h-[100px] rounded-3xl border border-2 flex justify-center items-center mb-[15px]">
              Food Menu
            </div>
          </Link>
          <Link href={"/bar-menu"}>
            <div className="w-[220px] h-[100px] rounded-3xl border border-2 flex justify-center items-center">
              Bar Menu
            </div>
          </Link>

          <Link
            href={{
              pathname: "/order-summary",
            }}
          >
            <div className="absolute bottom-4 mr-5 ml-auto right-0 w-min h-min">
              <button className="border border-black rounded-full h-[62px] w-[62px] bg-blue-500 text-white shadow-lg hover:bg-blue-600 flex items-center justify-center overflow-hidden">
                <img
                  src="/assets/images/CheckOrder.png"  // Replace with your image path
                  alt="Check Order"
                  className="h-full w-full object-cover"  // Image fully covers the button without overflow
                />
              </button>
              <div className="mt-[3px] flex justify-center items-center">
                <span className="text-[10px] font-semibold text-white">Check Order</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
