import Image from "next/image";
import React, { useState } from "react";
import ProductModal from "@/components/ProductModal";

import type { ProductDataTypes } from "../../lib/types/ProductDataTypes";
import type { InventoryDataTypes } from "../../lib/types/InventoryDataTypes";
import { MenuManagementCardProps } from "../../lib/types/props/MenuManagementCardProps";

const MenuManagementCard: React.FC<MenuManagementCardProps> = ({
  menuData,
  setMenuData,
  categoryName,
  menuProductHolder,
  setMenuProductHolder,
  inventoryData,
  setInventoryData,
}) => {
  const [modalType, setModalType] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [productModalIsVisible, setProductModalVisibility] = useState(false);
  const [menuProductToEdit, setMenuProductToEdit] =
    useState<ProductDataTypes>();

  const toggleEdit = (productID?: number) => {
    if (productID === undefined) {
      console.error("Product ID is undefined");
      return; // Early return or handle the case where productID is undefined
    }

    setModalType("edit");
    setModalTitle("Edit Product");

    setProductModalVisibility(!productModalIsVisible);

    const menuProduct = menuData.find((product) => product.productID === productID);
    setMenuProductToEdit(menuProduct);
  };


  const toggleAdd = () => {
    setModalType("add");
    setModalTitle("Add Product");
    setProductModalVisibility(true);
  };

  return (
    <>
      <div className="border border-black dark:border-black rounded-md p-4 bg-cream">
        <div className="grid grid-cols-3 gap-2 text-lg font-semibold mb-3">
          <p className="justify-normal items-center text-black">Name</p>
          <p className="flex justify-center items-center text-black">Price</p>
          <p></p>
        </div>
        {menuData
          .filter((item) => item.categoryName === categoryName)
          .map((item) => (
            <div key={item.productID} className="grid grid-cols-3 gap-2 mb-3">
              <p className="justify-normal items-center text-black truncate">
                {item.productName}
              </p>
              <p className="flex justify-center items-center text-black">
                {item.sellingPrice}
              </p>
              <button
                onClick={() => toggleEdit(item.productID)}
                className="px-1 py-1 rounded-full border border-black text-black text-sm bg-lightTealGreen hover:bg-gray-50 hover:bg-tealGreen"
              >
                Edit
              </button>
            </div>
          ))}
        <div>
          <button
            className="mt-3 px-3 py-1 rounded-full border border-black text-black text-sm bg-lightTealGreen hover:bg-gray-50 hover:bg-tealGreen"
            onClick={toggleAdd}
          >
            Add
          </button>
        </div>
      </div>
      {productModalIsVisible && (
        <ProductModal
          productModalIsVisible={productModalIsVisible}
          setProductModalVisibility={setProductModalVisibility}
          modalTitle={modalTitle}
          setMenuProductHolder={setMenuProductHolder}
          inventoryData={inventoryData}
          menuProductToEdit={menuProductToEdit}
          type={modalType}
          categoryName={categoryName}
          menuData={menuData}
          setMenuData={setMenuData}
        ></ProductModal>
      )}
    </>
  );
};

export default MenuManagementCard;
