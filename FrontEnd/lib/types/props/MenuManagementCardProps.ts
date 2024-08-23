import { ProductDataTypes } from "../ProductDataTypes";
import { InventoryDataTypes } from "../InventoryDataTypes";

export type MenuManagementCardProps = {
    categoryName: string;
    menuData: ProductDataTypes[];
    setMenuData: React.Dispatch<React.SetStateAction<ProductDataTypes[]>>;
    menuProductHolder: ProductDataTypes;
    setMenuProductHolder: React.Dispatch<React.SetStateAction<ProductDataTypes>>;
    
    inventoryData: InventoryDataTypes[];
    setInventoryData: React.Dispatch<React.SetStateAction<InventoryDataTypes[]>>;
  };
