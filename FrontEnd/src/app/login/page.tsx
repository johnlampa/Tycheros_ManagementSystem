"use client";
import React from "react";
import Header from "@/components/Header";
import Link from "next/link";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaArrowLeft } from "react-icons/fa";

export default function EmployeeHome() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());

    const employeeID = parseInt(formJson.employeeID as string);
    const password = formJson.password as string;

    console.log("employeeID: ", employeeID, "; password: ", password);

    //add api call
    //if successful, redirect to /employee-home
  };

  return (
    <>
      <div className="w-full flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center w-[360px] min-h-screen relative bg-white">
          <Header text="Admin Login" color="tealGreen" type="home">
            <div className="relative flex items-center justify-center font-bold text-2xl mb-5 mt-4 -ml-8 text-black">
              <Link href={"/"} className="absolute left-[-12px]">
                <button className="ml-3 border border-white rounded-full h-[40px] w-[40px] bg-white shadow-lg flex items-center justify-center overflow-hidden hover:bg-tealGreen group">
                  <FaArrowLeft className="text-tealGreen group-hover:text-white transition-colors duration-300" />
                </button>
              </Link>
            </div>
          </Header>

          <div className="mt-10">
            <form id="productForm" onSubmit={handleSubmit}>
              {/* Center content vertically */}
              <div className="flex flex-col justify-center flex-grow">
                <div className="border border-black w-[294px] p-5">
                  <label htmlFor="employeeID" className="block mb-2 text-black">
                    Employee ID
                  </label>
                  <input
                    type="string"
                    name="employeeID"
                    id="employeeID"
                    className="border border-gray-300 rounded w-full p-1 mb-4 text-black placeholder-gray-400"
                    onInput={(e) => {
                      const input = e.target as HTMLInputElement; // Typecast to HTMLInputElement
                    }}
                  />

                  <label htmlFor="password" className="block mb-2 text-black">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className="border border-gray-300 rounded w-full p-1 mb-4 text-black placeholder-gray-400"
                    defaultValue={""}
                    onInput={(e) => {
                      const input = e.target as HTMLInputElement; // Typecast to HTMLInputElement
                    }}
                  />

                  <div className="flex justify-between float-right font-semibold w-full shadow-xl">
                    <button
                      type="submit"
                      className="border border-black text-xs rounded w-full px-5 py-2 text-black bg-lightTealGreen hover:bg-tealGreen hover:text-white"
                    >
                      LOGIN
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
