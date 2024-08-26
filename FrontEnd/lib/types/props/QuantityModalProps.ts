import { Order } from "../OrderDataTypes"
import { ProductDataTypes } from "../ProductDataTypes"

export type QuantityModalProps = {
    productToAdd: ProductDataTypes,
    quantityModalIsVisible: boolean,
    setQuantityModalVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}