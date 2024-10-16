"use client"; // Ensures this is a client component

import { useState, useEffect } from "react";
import { QuantityModalProps } from "../../lib/types/props/QuantityModalProps";
import Modal from "@/components/ui/Modal";
import { OrderItemDataTypes } from "../../lib/types/OrderDataTypes";
import { usePathname } from "next/navigation";
import { SubitemDataTypes } from "../../lib/types/ProductDataTypes";
import { InventoryItem } from "../../lib/types/InventoryItemDataTypes";
import axios from "axios";

const QuantityModal: React.FC<QuantityModalProps> = ({
  productToAdd,
  quantityModalIsVisible,
  setQuantityModalVisibility,
  type,
}) => {
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [subitems, setSubitems] = useState<SubitemDataTypes[]>([]);
  const [cart, setCart] = useState<OrderItemDataTypes[]>([]);
  const [quantity, setQuantity] = useState(0);
  const [maxQuantity, setMaxQuantity] = useState<number>(Infinity);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [correctType, setCorrectType] = useState(type);

  // Fetch subitems for the given product
  useEffect(() => {
    axios
      .get(
        `http://localhost:8081/menuManagement/getSpecificSubitems/${productToAdd.productID}`
      )
      .then((response) => {
        setSubitems(response.data);
      })
      .catch((error) => {
        console.error("Error fetching subitems:", error);
        setError(error);
      });
  }, [productToAdd]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch(
          "http://localhost:8081/inventoryManagement/getSubitem"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: InventoryItem[] = await response.json();
        setInventoryData(data);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  // Check for the product in the cart and set the correct type ('edit' or 'add')
  useEffect(() => {
    const itemInCart = cart.find(
      (item) => item.productID === productToAdd.productID
    );
    if (itemInCart) {
      setCorrectType("edit"); // Set type to "edit" if product is in cart
    }
  }, [cart, productToAdd]);

  // Load the cart from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    }
  }, [quantityModalIsVisible]); // Ensure the cart is reloaded when the modal is opened

  // Listen to cart changes to update the modal quantity when it's opened
  useEffect(() => {
    if (
      correctType === "edit" &&
      quantityModalIsVisible &&
      productToAdd.productID
    ) {
      const item = cart.find(
        (item) => item.productID === productToAdd.productID
      );
      if (item) {
        setQuantity(item.quantity ?? 0); // Default to 0 if undefined
      } else {
        setQuantity(0);
      }
    } else if (correctType !== "edit") {
      setQuantity(0);
    }
  }, [correctType, quantityModalIsVisible, productToAdd, cart]);

  useEffect(() => {
    // Calculate the maximum allowable quantity based on subitems and inventory
    calculateMaxQuantity();
  }, [subitems, inventoryData, productToAdd, cart]);

  const calculateMaxQuantity = () => {
    if (
      subitems &&
      inventoryData &&
      subitems.length > 0 &&
      inventoryData.length > 0
    ) {
      const maxQuantities = subitems.map((subitem) => {
        const inventoryItem = inventoryData.find(
          (item) => item.inventoryID === subitem.inventoryID
        );
        if (inventoryItem) {
          return Math.floor(
            inventoryItem.totalQuantity / subitem.quantityNeeded
          );
        }
        return 0;
      });

      const maxPossibleQuantity = Math.min(...maxQuantities);
      setMaxQuantity(maxPossibleQuantity);

      console.log(
        "Max quantity of ",
        productToAdd.productName,
        " is ",
        maxPossibleQuantity
      );
    } else {
      console.log("Max quantity unknown.");
      setMaxQuantity(Infinity); // Set to Infinity if no limitation is found
    }
  };

  let pathname = usePathname();

  const handleSave = () => {
    if (productToAdd.productID) {
      const itemIndex = cart.findIndex(
        (item) => item.productID === productToAdd.productID
      );

      const updatedCart = [...cart];

      if (correctType === "edit") {
        if (quantity === 0) {
          if (itemIndex !== -1) {
            updatedCart.splice(itemIndex, 1); // Remove item if quantity is 0
          }
        } else if (itemIndex !== -1) {
          updatedCart[itemIndex].quantity = quantity; // Update the quantity
        }
      } else {
        if (quantity > 0) {
          if (itemIndex !== -1) {
            updatedCart[itemIndex].quantity += quantity; // Add to existing quantity
          } else {
            const newOrderItem: OrderItemDataTypes = {
              productID: productToAdd.productID,
              quantity: quantity ?? 0, // Fallback to 0 if undefined
            };
            updatedCart.push(newOrderItem);
          }
        }
      }

      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }

    setQuantityModalVisibility(false);
    setQuantity(0);

    if (pathname === "/order-summary") {
      window.location.reload();
    }
  };

  return (
    <div className="w-full">
      <Modal
        modalIsVisible={quantityModalIsVisible}
        setModalVisibility={setQuantityModalVisibility}
      >
        <div className="flex flex-col gap-3 justify-center items-center w-[250px] p-5 bg-white rounded-md shadow-lg m-0 border-black">
          <div className="font-bold text-2xl text-black text-center">
            {productToAdd.productName}
          </div>
          <div className="text-black text-center">Select Quantity</div>
          <div className="flex justify-center items-center">
            <button
              className="px-3 py-1 rounded-full text-black text-sm shadow-xl hover:scale-110 active:bg-secondaryBrown duration-200 bg-cream"
              onClick={() => setQuantity((prev) => Math.max(prev - 1, 0))}
              disabled={quantity <= 0}
            >
              -
            </button>
            <div className="text-black flex flex-col items-center justify-center w-14">
              {quantity}
            </div>
            <button
              className="px-3 py-1 rounded-full text-black text-sm shadow-xl hover:scale-110 active:bg-secondaryBrown duration-200 bg-cream"
              onClick={() => setQuantity((prev) => prev + 1)}
              disabled={quantity >= maxQuantity}
            >
              +
            </button>
          </div>
          {quantity >= maxQuantity && (
            <p className="text-gray text-xs text-center mt-3">
              Maximum quantity reached
            </p>
          )}
          <button
            className="w-full px-4 py-2 mt-3 rounded-md font-semibold text-white text-sm bg-tealGreen hover:bg-gray-500"
            onClick={handleSave}
            disabled={quantity > maxQuantity || quantity === 0}
          >
            Confirm
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default QuantityModal;
