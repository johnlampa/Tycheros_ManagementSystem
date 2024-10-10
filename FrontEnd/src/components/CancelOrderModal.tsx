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
        console.log("Fetched specific subitems for productID:", productID, response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching subitems:", error);
        return [];
      }
    };

    const fetchAllSubitems = async () => {
      if (!orderToEdit?.orderItems || orderToEdit.orderItems.length === 0) {
        console.warn("No order items to process.");
        return;
      }

      try {
        const allSubitems: SubitemForStockInDataTypes[] = [];

        // Outer loop: Iterate over all orderItems
        for (const orderItem of orderToEdit.orderItems) {
          const productID = orderItem.productID;

          if (productID) {
            const fetchedSubitems = await fetchSubitems(productID);
            allSubitems.push(...fetchedSubitems);
          }
        }

        // After fetching all subitems, update the state once
        setSubitems(allSubitems);
        console.log("All fetched subitems for order:", allSubitems);
      } catch (error) {
        console.error("Error in fetchAllSubitems:", error);
      }
    };

    // Only call fetchAllSubitems if orderToEdit has valid data
    if (orderToEdit?.orderItems) {
      fetchAllSubitems();
    }

    console.log("Subitems state:", subitems);
  }, [orderToEdit]); // Dependency on orderToEdit

  useEffect(() => {
    // Fetch Inventory Data
    axios
      .get("http://localhost:8081/menuManagement/getAllSubitems")
      .then((response) => {
        setInventoryData(response.data);
        console.log("Fetched inventory data:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching inventory data:", error);
      });
  }, []);

  const handleAddSubitemUsed = () => {
    setSubitemsUsed([...subitemsUsed, { subitemID: 0, quantityUsed: 0 }]);
    console.log("Subitems used after adding:", subitemsUsed);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCancelOrderModalVisibility(false);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());

    if (!orderToEdit) {
      console.error("orderToEdit is not defined. Cannot proceed with update.");
      return;
    }

    let cancellationType = orderToEdit.status;
    let cancellationReason = formJson.cancellationReason as string;

    let updatedSubitemsUsed: SubitemUsed[] = [];

    if (orderToEdit.status === "Pending") {
      // Map subitemsUsed from form inputs
      updatedSubitemsUsed = subitemsUsed.map((subitemUsed, index) => ({
        subitemID: parseInt(formJson[`subitemUsed-${index}`] as string),
        quantityUsed: parseFloat(formJson[`quantityUsed-${index}`] as string),
      }));
    } else if (orderToEdit.status === "Completed") {
      // Automatically fetch all subitems and set quantity needed as quantity used
      updatedSubitemsUsed = subitems.map((subitem) => ({
        subitemID: subitem.subitemID,
        quantityUsed: subitem.quantityNeeded,
      }));
    } else if (orderToEdit.status === "Unpaid") {
      // Set quantityUsed to 0 for unpaid orders
      updatedSubitemsUsed = subitems.map((subitem) => ({
        subitemID: subitem.subitemID,
        quantityUsed: 0,
      }));
    }

    console.log("Subitems used to cancel the order:", updatedSubitemsUsed);

    // Prepare data for API call
    const cancelOrderData = {
      orderID: orderToEdit.orderID,
      cancellationReason,
      subitemsUsed: updatedSubitemsUsed,
    };

    try {
      // Make API call to cancel order
      const response = await axios.post(
        "http://localhost:8081/orderManagement/cancelOrder",
        cancelOrderData
      );

      if (response.status === 200) {
        console.log("Order cancelled successfully:", response.data);

        // Update order status to "Cancelled" locally
        const updatedOrderToEdit: Order = {
          ...orderToEdit,
          status: "Cancelled",
        };

        setOrders?.(
          orders.map((o) =>
            o.orderID === orderToEdit.orderID ? updatedOrderToEdit : o
          )
        );
      } else {
        console.error("Failed to cancel order:", response.data);
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };

  return (
    <>
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
            type="string"
            name="cancellationReason"
            id="cancellationReason"
            placeholder="Enter reason"
            className="border border-gray-300 rounded w-full p-3 mb-4 text-black placeholder-gray-400"
            required
          />
          {orderToEdit?.status === "Pending" && (
            <div>
              <label className="block mb-2 text-black">Subitems Used</label>
              {subitemsUsed.map((subitemUsed, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center mb-4"
                >
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
    </>
  );
};

export default CancelOrderModal;
