import { ReactNode } from "react";

import "@/styles/globals.css";
import { CartProvider } from "../../lib/context/CartContext";

export const metadata = {
  title: "Tycheros Management System",
  description: "",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
