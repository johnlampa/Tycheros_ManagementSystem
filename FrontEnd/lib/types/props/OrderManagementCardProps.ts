import { Order } from "../OrderDataTypes"
import { ProductDataTypes } from "../ProductDataTypes"

export type OrderManagementCardProps = {
    order: Order,
    menuData: ProductDataTypes[],
    orders: Order[],
    setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}