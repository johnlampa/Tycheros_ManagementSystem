"use client";  // This directive makes the component a client component

import React, { useEffect, useState } from "react";
import MenuCard from "@/components/ui/MenuCard";

// Define the structure of a menu item
interface MenuItem {
  productID: number;
  productName: string;
  categoryName: string;
  sellingPrice: number;
  imageUrl: string;
}

export default function Page() {
  const [menuData, setMenuData] = useState<MenuItem[]>([]);

  useEffect(() => {
    fetch('http://localhost:8081/menu')
      .then(response => response.json())
      .then(data => setMenuData(data))
      .catch(error => console.error('Error fetching menu data:', error));
  }, []);

  return (
    <div className="w-[362px] p-6">
      <div>Menu Page</div>

      <div>
        Appetizer
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          {menuData.filter(item => item.categoryName === "Appetizer").map(
            (item, index) => (
              <div key={index}>
                <MenuCard 
                  productId={item.productID}  // Map productID to productId
                  productName={item.productName}
                  categoryName={item.categoryName}
                  sellingPrice={item.sellingPrice}
                  imageUrl={item.imageUrl}
                />
              </div>
            )
          )}
        </div>
      </div>

      <div>
        Entrees
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          {menuData.filter(item => item.categoryName === "Entrees").map(
            (item, index) => (
              <div key={index}>
                <MenuCard 
                  productId={item.productID}  // Map productID to productId
                  productName={item.productName}
                  categoryName={item.categoryName}
                  sellingPrice={item.sellingPrice}
                  imageUrl={item.imageUrl}
                />
              </div>
            )
          )}
        </div>
      </div>
      

      {/* Repeat for other categories... */}
    </div>
  );
}
