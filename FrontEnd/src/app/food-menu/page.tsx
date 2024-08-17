import React from "react";
import MenuCard from "@/components/ui/MenuCard";

const MenuData = [
  {
    productId: 1,
    productName: "Fries",
    categoryName: "Appetizer",
    sellingPrice: 90.0,
    imageUrl: "/assets/images/MilkTea.jpg",
  },
];

export default function Page() {
  return (
    <>
      <div className="w-[362px] p-6">
        <div>Menu Page</div>
        <div>
          {" "}
          Appetizer
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {MenuData.filter((item) => item.categoryName === "Appetizer").map(
              (item, index) => (
                <div key={index}>
                  <MenuCard {...item} />
                </div>
              )
            )}
          </div>
        </div>

        <div>
          {" "}
          Entrees
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {MenuData.filter((item) => item.categoryName === "Entrees").map(
              (item, index) => (
                <div key={index}>
                  <MenuCard {...item} />
                </div>
              )
            )}
          </div>
        </div>

        <div>
          {" "}
          Snacks
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {MenuData.filter((item) => item.categoryName === "Snacks").map(
              (item, index) => (
                <div key={index}>
                  <MenuCard {...item} />
                </div>
              )
            )}
          </div>
        </div>

        <div>
          {" "}
          Combo Meals
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {MenuData.filter((item) => item.categoryName === "Combo Meals").map(
              (item, index) => (
                <div key={index}>
                  <MenuCard {...item} />
                </div>
              )
            )}
          </div>
        </div>

        <div>
          {" "}
          Wings
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {MenuData.filter((item) => item.categoryName === "Wings").map(
              (item, index) => (
                <div key={index}>
                  <MenuCard {...item} />
                </div>
              )
            )}
          </div>
        </div>

        <div>
          {" "}
          Salads
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {MenuData.filter((item) => item.categoryName === "Salads").map(
              (item, index) => (
                <div key={index}>
                  <MenuCard {...item} />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}
