import { useEffect, useState } from "react";
import { CancelOrderModalProps } from "../../lib/types/props/CancelOrderModalProps";
import Modal from "@/components/ui/Modal";
import { Order, SubitemUsed } from "../../lib/types/OrderDataTypes";
import axios from "axios";
import { InventoryDataTypes } from "../../lib/types/InventoryDataTypes";
import { SubitemForStockInDataTypes } from "../../lib/types/ProductDataTypes";

const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  cancelOrderModalIsVisible,
  setCancelOrderModalVisibility,
  modalTitle,
  orderToEdit,
  orders,
  setOrders,
}) => {
  const [subitemsUsed, setSubitemsUsed] = useState<SubitemUsed[]>([]);
  const [inventoryData, setInventoryData] = useState<InventoryDataTypes[]>([]);
  const [subitems, setSubitems] = useState<SubitemForStockInDataTypes[]>([]);

  useEffect(() => {
    const fetchSubitems = async (productID: number) => {
      try {
        const response = await axios.get(
          `http://localhost:8081/menuManagement/getSpecificSubitems/${productID}`
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching subitems:", error);
        return [];
      }
    };

    const fetchAllSubitems = async () => {
      if (!orderToEdit?.orderItems || orderToEdit.orderItems.length === 0) {
        return;
      }

      try {
        const allSubitems: SubitemForStockInDataTypes[] = [];

        for (const orderItem of orderToEdit.orderItems) {
          const productID = orderItem.productID;
          if (productID) {
            const fetchedSubitems = await fetchSubitems(productID);
            allSubitems.push(...fetchedSubitems);
          }
        }

        setSubitems(allSubitems);
      } catch (error) {
        console.error("Error in fetchAllSubitems:", error);
      }
    };

    if (orderToEdit?.orderItems) {
      fetchAllSubitems();
    }
  }, [orderToEdit]);

  useEffect(() => {
    axios
      .get("http://localhost:8081/menuManagement/getAllSubitems")
      .then((response) => {
        setInventoryData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching inventory data:", error);
      });
  }, []);

  const handleAddSubitemUsed = () => {
    setSubitemsUsed([...subitemsUsed, { subitemID: 0, quantityUsed: 0 }]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!orderToEdit) {
      console.error("orderToEdit is not defined. Cannot proceed with update.");
      return;
    }

    // Log the quantity of each order item
    if (orderToEdit.orderItems) {
      orderToEdit.orderItems.forEach((orderItem) => {
        console.log(`ProductID: ${orderItem.productID}, Quantity: ${orderItem.quantity}`);
      });
    }
  
    // 1. Update the order status to "Cancelled"
    try {
      await axios.put("http://localhost:8081/orderManagement/updateOrderStatus", {
        orderID: orderToEdit.orderID,
        newStatus: "Cancelled",
      });
  
      console.log("Order status updated to 'Cancelled'");
    } catch (error) {
      console.error("Error updating order status:", error);
      return;
    }
  
    // 2. Prepare cancellation data for /cancelOrder API
    const cancellationReason = orderToEdit.status === "Unpaid" ? "Cancelled Order" : (e.target as any).cancellationReason.value;
    const cancellationType = orderToEdit.status;
  
    let updatedSubitemsUsed: SubitemUsed[] = [];
  
    // Handle subitems logic based on order status
    if (orderToEdit.status === "Pending") {
      // If the order is pending, use user input for the subitem quantity
      updatedSubitemsUsed = subitemsUsed.map((subitemUsed, index) => ({
        subitemID: parseInt((e.target as any)[`subitemUsed-${index}`].value),
        quantityUsed: parseFloat((e.target as any)[`quantityUsed-${index}`].value),
      }));
    } else if (orderToEdit.status === "Completed") {
      // Create a map to quickly lookup the quantity by productID from orderItems
      const orderItemQuantities: { [productID: number]: number } = {};
    
      if (orderToEdit.orderItems) {
        // Use forEach to populate the lookup map
        orderToEdit.orderItems.forEach((orderItem) => {
          console.log(`ProductID: ${orderItem.productID}, Quantity: ${orderItem.quantity}`);
          orderItemQuantities[orderItem.productID] = orderItem.quantity;
        });
      }
    
      // Now use subitems.map to calculate the quantityUsed by looking up from the map
      updatedSubitemsUsed = subitems.map((subitem) => {
        // Retrieve the quantity from the lookup map for the current subitem's productID
        const orderItemQuantity = orderItemQuantities[subitem.productID];
    
        if (orderItemQuantity !== undefined) {
          console.log(`Subitem ProductID: ${subitem.productID}, Order Quantity: ${orderItemQuantity}`);
        } else {
          console.warn(`No matching order item found for Subitem ProductID: ${subitem.productID}`);
        }
    
        // Multiply quantityNeeded by the orderItem's quantity (or default to 1 if no match found)
        return {
          subitemID: subitem.subitemID,
          quantityUsed: subitem.quantityNeeded * (orderItemQuantity || 1),
        };
      });
    } else if (orderToEdit.status === "Unpaid") {
      // If the order is unpaid, set quantityUsed to 0
      updatedSubitemsUsed = subitems.map((subitem) => ({
        subitemID: subitem.subitemID,
        quantityUsed: 0,
      }));
    }
  
    const cancelOrderData = {
      orderID: orderToEdit.orderID,
      cancellationReason,
      cancellationType,
      subitemsUsed: updatedSubitemsUsed,
    };
  
    try {
      // 3. Call the /cancelOrder API
      const response = await axios.post(
        "http://localhost:8081/orderManagement/cancelOrder",
        cancelOrderData
      );
  
      if (response.status === 200) {
        console.log("Order cancelled successfully");
  
        const updatedOrder: Order = {
          ...orderToEdit,
          status: "Cancelled",
        };
  
        setOrders?.(
          orders.map((o) =>
            o.orderID === orderToEdit.orderID ? updatedOrder : o
          )
        );
        setCancelOrderModalVisibility(false);
      } else {
        console.error("Failed to cancel order:", response.data);
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };
  
  

  return (
    <Modal
      modalIsVisible={cancelOrderModalIsVisible}
      setModalVisibility={setCancelOrderModalVisibility}
    >
      <form
        id="cancelOrderForm"
        onSubmit={handleSubmit}
        className="w-[340px] p-6 mx-auto"
      >
        <p className="text-center text-xl font-bold text-black mb-4">
          {modalTitle}
        </p>
        <label htmlFor="cancellationReason" className="block mb-2 text-black">
          Reason
        </label>
        <input
          type="text"
          name="cancellationReason"
          id="cancellationReason"
          value={orderToEdit?.status === "Unpaid" ? "Cancelled Order" : undefined}
          placeholder="Enter reason"
          className="border border-gray-300 rounded w-full p-3 mb-4 text-black placeholder-gray-400"
          required
          disabled={orderToEdit?.status === "Unpaid"}
        />
        {orderToEdit?.status === "Pending" && (
          <div>
            <label className="block mb-2 text-black">Subitems Used</label>
            {subitemsUsed.map((subitemUsed, index) => (
              <div key={index} className="flex justify-between items-center mb-4">
                <select
                  className="border border-gray-300 rounded w-[60%] p-3 text-black"
                  name={`subitemUsed-${index}`}
                  id={`subitemUsed-${index}`}
                >
                  <option value="0" disabled>
                    Choose
                  </option>
                  {subitems
                    .filter(
                      (subitem) =>
                        inventoryData.some((item) => item.inventoryID === subitem.inventoryID)
                    )
                    .map((subitem) => {
                      const inventory = inventoryData.find(
                        (item) => item.inventoryID === subitem.inventoryID
                      );
                      return (
                        <option value={subitem.subitemID} key={subitem.subitemID}>
                          {inventory?.inventoryName} ({inventory?.unitOfMeasure})
                        </option>
                      );
                    })}
                </select>

                <input
                  type="number"
                  name={`quantityUsed-${index}`}
                  id={`quantityUsed-${index}`}
                  defaultValue={0}
                  placeholder="Quantity"
                  className="border border-gray-300 rounded w-[30%] p-3 text-black placeholder-gray-400"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddSubitemUsed}
              className="border border-black rounded px-4 py-2 w-full mb-4 text-black"
            >
              Add Subitem
            </button>
          </div>
        )}
        <div className="flex justify-between">
          <button
            type="submit"
            className="border border-black px-6 py-3 rounded bg-gray-300 hover:bg-gray-400 text-black"
          >
            Save
          </button>

          <button
            onClick={() => setCancelOrderModalVisibility(false)}
            className="border border-black px-6 py-3 rounded bg-gray-300 hover:bg-gray-400 text-black"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CancelOrderModal;
