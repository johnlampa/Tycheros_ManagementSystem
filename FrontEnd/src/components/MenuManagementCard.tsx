import Image from "next/image";
import React, { useState } from "react";
import ProductModal from "@/components/ProductModal";

import type { ProductDataTypes } from "../../lib/types/ProductDataTypes";
import type { InventoryDataTypes } from "../../lib/types/InventoryDataTypes";
import { MenuManagementCardProps } from "../../lib/types/MenuManagementCardProps";

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

  const toggleEdit = (index: number) => {
    setModalType("edit");
    setModalTitle("Edit Product");

    setProductModalVisibility(!productModalIsVisible);

    const menuProduct = menuData[index];
    setMenuProductToEdit(menuProduct);
  };

  const toggleAdd = () => {
    setModalType("add");
    setModalTitle("Add Product");
    setProductModalVisibility(true);
  };

  return (
    <>
      <div className="border border-black dark:border-white rounded-md p-4">
        <div className="grid grid-cols-3 gap-2 text-lg font-semibold mb-3">
          <p className="flex justify-center items-center">Name</p>
          <p className="flex justify-center items-center">Price</p>
          <p></p>
        </div>
        {menuData
          .filter((item) => item.categoryName === categoryName)
          .map((item, index) => (
            <div key={index} className="grid grid-cols-3 gap-2 mb-3">
              <p className="flex justify-center items-center">
                {item.productName}
              </p>
              <p className="flex justify-center items-center">
                {item.sellingPrice}
              </p>
              <button
                onClick={() => toggleEdit(index)}
                className="px-1 py-1 rounded-full border border-black text-gray-400 text-sm bg-white hover:bg-gray-50 hover:text-gray-600"
              >
                Edit
              </button>
            </div>
          ))}
        <div>
          <button
            className="ml-4 mt-3 px-3 py-1 rounded-full border border-black text-gray-400 text-sm bg-white hover:bg-gray-50 hover:text-gray-600"
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
