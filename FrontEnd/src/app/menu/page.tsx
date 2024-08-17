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
  {
    productId: 1,
    productName: "Matcha",
    categoryName: "Shake",
    sellingPrice: 100.0,
    imageUrl: "/assets/images/MilkTea.jpg",
  },
  {
    productId: 1,
    productName: "Matcha",
    categoryName: "Milk Tea",
    sellingPrice: 110.0,
    imageUrl: "/assets/images/MilkTea.jpg",
  },
  {
    productId: 1,
    productName: "Matcha",
    categoryName: "Milk Tea",
    sellingPrice: 120.0,
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
      </div>
    </>
  );
}
