"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { Order } from "../types/OrderDataTypes";

type CartContextType = {
  cart: Order;
  setCart: React.Dispatch<React.SetStateAction<Order>>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Order>({
    employeeID: 1,
    date: new Date().toISOString(),
    status: "Unpaid",
    orderItems: [],
  });

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
};
