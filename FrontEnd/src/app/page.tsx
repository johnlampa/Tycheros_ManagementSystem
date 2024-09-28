import React from "react";
import Header from "@/components/Header";

export default function Home() {
  return (
    <>
      <div className="w-full flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center w-[360px] h-screen">
          <Header
            text="Tycheros World Cafe and Bar"
            color={"tealGreen"}
            type={"home"}
          ></Header>
          <div></div>
        </div>
      </div>
    </>
  );
}
