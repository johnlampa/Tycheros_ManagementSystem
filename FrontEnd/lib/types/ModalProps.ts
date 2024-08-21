import { ProductDataTypes } from "./ProductDataTypes";
import { InventoryDataTypes } from "./InventoryDataTypes";

export type ModalProps = {
  productModalIsVisible: boolean;
    setProductModalVisibility: React.Dispatch<React.SetStateAction<boolean>>;
    children?: React.ReactNode
    modalTitle: string
    menuData?: ProductDataTypes[];
    setMenuData?: React.Dispatch<React.SetStateAction<ProductDataTypes[]>>;
    categoryName?: string;
    inventoryData?: InventoryDataTypes[];
    setInventoryData?: React.Dispatch<React.SetStateAction<InventoryDataTypes[]>>;
    type?: string
    menuProductToEdit?: ProductDataTypes
  };