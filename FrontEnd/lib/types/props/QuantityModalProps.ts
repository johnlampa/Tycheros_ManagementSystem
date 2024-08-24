import { Order } from "../OrderDataTypes"
import { ProductDataTypes } from "../ProductDataTypes"

export type QuantityModalProps = {
    productToAdd: ProductDataTypes,
    cart: Order,
    setCart: React.Dispatch<React.SetStateAction<Order>>;
    quantityModalIsVisible: boolean,
    setQuantityModalVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}