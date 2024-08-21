import Image from "next/image";
import React, { useState } from "react";
import ProductModal from "@/components/ProductModal";

import type { ProductDataTypes } from "../../../lib/types/ProductDataTypes";
import type { InventoryDataTypes } from "../../../lib/types/InventoryDataTypes";

type MenuManagementCardProps = {
  menuData: ProductDataTypes[];
  setMenuData: React.Dispatch<React.SetStateAction<ProductDataTypes[]>>;
  categoryName: string;
  inventoryData: InventoryDataTypes[];
  setInventoryData: React.Dispatch<React.SetStateAction<InventoryDataTypes[]>>;
};

const MenuManagementCard: React.FC<MenuManagementCardProps> = ({
  menuData,
  setMenuData,
  categoryName,
  inventoryData,
  setInventoryData,
}) => {
  const [modalType, setModalType] = useState("");
  const [productModalIsVisible, setProductModalVisibility] = useState(false);
  const [menuProductToEdit, setMenuProductToEdit] =
    useState<ProductDataTypes>();

  const toggleEdit = (index: number) => {
    setModalType("edit");

    setProductModalVisibility(!productModalIsVisible);

    const menuProduct = menuData[index];
    setMenuProductToEdit(menuProduct);
  };

  return (
    <>
      <div className="border rounded-e-md">
        <div className="grid grid-cols-3 gap-2">
          <p>Name</p>
          <p>Price</p>
          <p></p>
        </div>
        {menuData
          .filter((item) => item.categoryName === categoryName)
          .map((item, index) => (
            <div key={index} className="grid grid-cols-3 gap-2">
              <p>{item.productName}</p>
              <p>{item.sellingPrice}</p>
              <button onClick={() => toggleEdit(index)}>Edit</button>
            </div>
          ))}
      </div>
      {productModalIsVisible && (
        <ProductModal
          productModalIsVisible={productModalIsVisible}
          setProductModalVisibility={setProductModalVisibility}
          modalTitle="Edit Product"
          inventoryData={inventoryData}
          setInventoryData={setInventoryData}
          menuProductToEdit={menuProductToEdit}
          type={modalType}
        ></ProductModal>
      )}
    </>
  );
};

export default MenuManagementCard;
