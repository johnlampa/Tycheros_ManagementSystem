import { Order } from "../OrderDataTypes"
import { ProductDataTypes } from "../ProductDataTypes";

export type OrderCardProps = {
    order: Order;
    menuData: ProductDataTypes[];
    quantityModalIsVisible: boolean;
    setQuantityModalVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}