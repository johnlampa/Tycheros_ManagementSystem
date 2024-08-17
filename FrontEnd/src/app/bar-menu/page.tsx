import React from "react";
import MenuCard from "@/components/ui/MenuCard";

const MenuData = [
  {
    productId: 1,
    productName: "Matcha",
    categoryName: "Milk Tea",
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
          Milk Tea
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {MenuData.filter((item) => item.categoryName === "Milk Tea").map(
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
          Beer
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {MenuData.filter((item) => item.categoryName === "Beer").map(
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
          Coffee
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {MenuData.filter((item) => item.categoryName === "Coffee").map(
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
          Whiskey
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {MenuData.filter((item) => item.categoryName === "Whiskey").map(
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
          Frappe
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {MenuData.filter((item) => item.categoryName === "Frappe").map(
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
          Tea
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {MenuData.filter((item) => item.categoryName === "Tea").map(
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
