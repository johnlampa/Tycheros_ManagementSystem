import { Order } from "../OrderDataTypes";

export type CancelOrderModalProps = {
  cancelOrderModalIsVisible: boolean;
  setCancelOrderModalVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  modalTitle: string;

  orderToEdit: Order | undefined;

  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
};
