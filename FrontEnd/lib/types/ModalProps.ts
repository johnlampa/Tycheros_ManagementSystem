import { ProductDataTypes } from "./ProductDataTypes";
import { InventoryDataTypes } from "./InventoryDataTypes";

import { MouseEventHandler } from "react";

export type ModalProps = {
  productModalIsVisible: boolean;
  setProductModalVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
};