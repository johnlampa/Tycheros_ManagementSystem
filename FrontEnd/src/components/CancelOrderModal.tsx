//if orderToEdit.status === "pending" {ask for subitemsUsed}
//if orderToEdit.status === "completed" {ask for reason, automatically
//subitemsUsed = orderToEdit.orderItems.ALLsubitems}

import { useEffect, useState } from "react";
import { CancelOrderModalProps } from "../../lib/types/props/CancelOrderModalProps";

import Modal from "@/components/ui/Modal";
import { Order, SubitemUsed } from "../../lib/types/OrderDataTypes";
import axios from "axios";
import { InventoryDataTypes } from "../../lib/types/InventoryDataTypes";
import { SubitemDataTypes } from "../../lib/types/ProductDataTypes";

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
  const [subitems, setSubitems] = useState<SubitemDataTypes[]>([]);

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
        console.warn("No order items to process.");
        return;
      }

      try {
        const allSubitems: SubitemDataTypes[] = [];

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
        console.log("Fetched subitems: ", allSubitems);
      } catch (error) {
        console.error("Error in fetchAllSubitems:", error);
      }
    };

    // Only call fetchAllSubitems if orderToEdit has valid data
    if (orderToEdit?.orderItems) {
      fetchAllSubitems();
    }

    console.log("Subitems: ", subitems);
  }, [orderToEdit]); // Dependency on orderToEdit

  useEffect(() => {
    // Fetch Inventory Data
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

  const handleSave = () => {
    if (!orderToEdit) {
      console.error("orderToEdit is not defined. Cannot proceed with update.");
      return;
    }

    // Directly define and assign 'updatedOrderToEdit' in this scope
    const updatedOrderToEdit: Order = {
      ...orderToEdit,
      status: "Cancelled",
      subitemsUsed: subitemsUsed, // Ensure subitemsUsed is properly assigned
      date: orderToEdit.date.substring(0, 10), // Truncate the date if needed
      employeeID: orderToEdit?.employeeID ?? 0, // Default employeeID to 0 if undefined
    };

    console.log("Updated order before saving:", updatedOrderToEdit);

    setOrders?.(
      orders.map((o) =>
        o.orderID === orderToEdit.orderID ? updatedOrderToEdit : o
      )
    );

    // Optionally call your API to persist the change
    // updateOrderStatus("Cancelled");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCancelOrderModalVisibility(false);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());

    if (!orderToEdit) {
      console.error("orderToEdit is not defined. Cannot proceed with update.");
      return;
    }

    let updatedOrderToEdit: Order;

    if (orderToEdit.status === "Pending") {
      // Directly define and assign 'updatedOrderToEdit' in this scope
      updatedOrderToEdit = {
        ...orderToEdit,
        status: "Cancelled",
        subitemsUsed: subitemsUsed.map((subitemUsed, index) => ({
          subitemID: parseInt(formJson[`subitemUsed-${index}`] as string),
          quantityUsed: parseFloat(formJson[`quantityUsed-${index}`] as string),
        })),
        date: orderToEdit.date.substring(0, 10), // Truncate the date if needed
        employeeID: orderToEdit?.employeeID ?? 0, // Default employeeID to 0 if undefined
        cancellationReason: formJson.cancellationReason as string,
        cancellationType: orderToEdit.status,
      };
    } else {
      updatedOrderToEdit = {
        ...orderToEdit,
        status: "Cancelled",
        subitemsUsed: subitems.map((subitem, index) => ({
          subitemID: subitem.inventoryID,
          quantityUsed: subitem.quantityNeeded,
        })),
        date: orderToEdit.date.substring(0, 10), // Truncate the date if needed
        employeeID: orderToEdit?.employeeID ?? 0, // Default employeeID to 0 if undefined
        cancellationReason: formJson.cancellationReason as string,
        cancellationType: orderToEdit.status,
      };
    }

    console.log("Updated order before saving:", updatedOrderToEdit);

    setOrders?.(
      orders.map((o) =>
        o.orderID === orderToEdit.orderID ? updatedOrderToEdit : o
      )
    );

    // if (type === "edit" && menuProductToEdit?.productID) {
    //   axios
    //     .put(`http://localhost:8081/menuManagement/putProduct/${menuProductToEdit.productID}`, updatedProduct)
    //     .then((response) => {
    //       console.log("Product updated:", updatedProduct);
    //       if (setMenuProductHolder) {
    //         setMenuProductHolder(updatedProduct);
    //       }
    //       form.reset();
    //       window.location.reload();
    //     })
    //     .catch((error) => {
    //       console.error("Error updating product:", error);
    //     });
    // } else {
    //   axios
    //     .post("http://localhost:8081/menuManagement/postProduct", updatedProduct)
    //     .then((response) => {
    //       console.log("Product added:", updatedProduct);
    //       if (setMenuProductHolder) {
    //         setMenuProductHolder(updatedProduct);
    //       }
    //       form.reset();
    //       window.location.reload();
    //     })
    //     .catch((error) => {
    //       console.error("Error adding product:", error);
    //     });
    // }
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
          {" "}
          {/* Added padding to the form */}
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
                    <option value="" disabled>
                      Choose
                    </option>
                    {inventoryData
                      .filter(
                        (item) =>
                          subitems.some(
                            (subitem) =>
                              subitem.inventoryID === item.inventoryID
                          ) // Check if the inventoryID matches
                      )
                      .map((item) => (
                        <option value={item.inventoryID} key={item.inventoryID}>
                          {item.inventoryName} ({item.unitOfMeasure})
                        </option>
                      ))}
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
