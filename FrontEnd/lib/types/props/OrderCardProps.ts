import { Order } from "../OrderDataTypes"
import { ProductDataTypes } from "../ProductDataTypes";

export type OrderCardProps = {
    cart: Order;
    setCart: React.Dispatch<React.SetStateAction<Order>>;
    setOrder: React.Dispatch<React.SetStateAction<Order>>;
    menuData: ProductDataTypes[];
    quantityModalIsVisible: boolean;
    setQuantityModalVisibility: React.Dispatch<React.SetStateAction<boolean>>;

    subtotal: number;
    setSubtotal: React.Dispatch<React.SetStateAction<number>>;
}