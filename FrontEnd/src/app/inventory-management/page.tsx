"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { MultiItemStockInData, InventoryItem } from "../../../lib/types/InventoryItemDataTypes";
import SubitemModal from "@/components/SubitemModal";
import StockInModal from "@/components/StockInModal";
import StockOutModal from "@/components/StockOutModal";
import UpdateStockModal from "@/components/UpdateStockModal";
import axios from "axios";

export default function InventoryManagementPage() {
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [collapsedRows, setCollapsedRows] = useState<number[]>([]); // State to track which rows are collapsed
  const [showAddOverlay, setShowAddOverlay] = useState(false);
  const [showEditOverlay, setShowEditOverlay] = useState(false);
  const [showDeleteOverlay, setShowDeleteOverlay] = useState(false);

  const initialItemState = {
    inventoryName: "",
    inventoryCategory: "",
    reorderPoint: 0,
    unitOfMeasure: "",
  };

  const resetNewItem = () => {
    setNewItem(initialItemState);
  };

  const [newItem, setNewItem] = useState<{
    inventoryName: string;
    inventoryCategory: string;
    unitOfMeasure: string;
    reorderPoint: number;
  }>({
    inventoryName: "",
    inventoryCategory: "",
    unitOfMeasure: "",
    reorderPoint: 0,
  });

  const [itemToEdit, setItemToEdit] = useState<InventoryItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);

  const [showStockInOverlay, setShowStockInOverlay] = useState(false);
  const [stockInData, setStockInData] = useState<MultiItemStockInData>({
    supplierName: "",
    employeeID: "",
    stockInDate: "",
    inventoryItems: [
      {
        inventoryID: 0,
        quantityOrdered: 0,
        actualQuantity: 0,
        pricePerUnit: 0,
        expiryDate: "",
      },
    ],
  });

  const handleStockIn = async () => {
    try {
      const response = await fetch(
        "http://localhost:8081/inventoryManagement/stockInInventoryItem",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(stockInData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to stock in subitem");
      }

      const updatedInventory = await fetch(
        "http://localhost:8081/inventoryManagement/getSubitem"
      ).then((res) => res.json());
      setInventoryData(updatedInventory);

      alert("Subitem stocked in successfully");

      // Reset data only after successful stock-in
      setStockInData({
        supplierName: "",
        employeeID: "",
        stockInDate: "",
        inventoryItems: [
          {
            inventoryID: 0,
            quantityOrdered: 0,
            actualQuantity: 0,
            pricePerUnit: 0,
            expiryDate: "",
          },
        ],
      });
    } catch (error) {
      console.error("Error stocking in subitem:", error);
    }
  };

  const [employees, setEmployees] = useState<{ employeeID: number; firstName: string; lastName: string }[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:8081/employeemanagement/getEmployee');
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  const [showUpdateStockOverlay, setShowUpdateStockOverlay] = useState(false);
  const [updateStockData, setUpdateStockData] = useState({
    inventoryID: "",
    quantity: 0,
  });

  const handleUpdateStock = (inventoryID: string) => {
    // Find the item in inventoryData based on the entered inventoryID
    const item = inventoryData.find((item) => item.inventoryID.toString() === inventoryID);
    
    if (item) {
      // If the item is found, proceed with setting update stock data
      setUpdateStockData({ ...updateStockData, inventoryID });
      setShowUpdateStockOverlay(true);
    } else {
      // If the item is not found, alert the user
      alert("Item not found");
    }
  };
  

  const handleUpdateStockSubmit = async () => {
    try {
      const response = await fetch("http://localhost:8081/inventoryManagement/updateSubitemQuantity", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateStockData),
      });

      if (response.ok) {
        alert("Stock updated successfully");
        const updatedInventory = await fetch(
          "http://localhost:8081/inventoryManagement/getSubitem"
        ).then((res) => res.json());
        setInventoryData(updatedInventory);
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert("Error: " + errorData.message);
      }
    } catch (err) {
      console.error("Error updating stock:", err);
      alert("Error updating stock");
    }
  };

  const [inventoryNames, setInventoryNames] = useState<{ inventoryID: number; inventoryName: string }[]>([]);
  useEffect(() => {
    const fetchInventoryNames = async () => {
      try {
        const response = await axios.get('http://localhost:8081/inventoryManagement/getInventoryName');
        setInventoryNames(response.data);
      } catch (error) {
        console.error('Error fetching inventory names:', error);
      }
    };

    fetchInventoryNames();
  }, []);

  const [showStockOutOverlay, setShowStockOutOverlay] = useState(false);
  const [stockOutData, setStockOutData] = useState({
    inventoryID: 0,
    quantity: 0,
    reason: "",
    stockOutDate: "",
  });

  const handleStockOut = (inventoryID: number) => {
    // Find the item in inventoryData based on the entered inventoryID
    const item = inventoryData.find((item) => item.inventoryID === inventoryID);
    
    if (item) {
      // If the item is found, proceed with setting stock out data
      setStockOutData({
        ...stockOutData,
        inventoryID,
        stockOutDate: new Date().toISOString().split("T")[0], // Initialize with today's date
      });
      setShowStockOutOverlay(true);
    } else {
      // If the item is not found, alert the user
      alert("Item not found");
    }
  };

  const handleStockOutSubmit = async () => {
    try {
      const response = await fetch(
        "http://localhost:8081/inventoryManagement/stockOutSubitem",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(stockOutData),
        }
      );

      if (response.ok) {
        alert("Stock-out recorded successfully");
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert("Error: " + errorData.message);
      }
    } catch (err) {
      console.error("Error during stock-out:", err);
      alert("Error during stock-out");
    }
  };

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

  const handleAddItem = async () => {
    try {
      const response = await fetch(
        "http://localhost:8081/inventoryManagement/postSubitem",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newItem),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add inventory item");
      }

      setNewItem({
        inventoryName: "",
        inventoryCategory: "",
        unitOfMeasure: "",
        reorderPoint: 0,
      });

      const updatedInventory = await fetch(
        "http://localhost:8081/inventoryManagement/getSubitem"
      ).then((res) => res.json());
      setInventoryData(updatedInventory);
      setShowAddOverlay(false);

      alert("Inventory item added successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error adding inventory item:", error);
    }
  };

  const handleEditItem = async (id: number) => {
    const item = inventoryData.find((item) => item.inventoryID === id);
    if (item) {
      setItemToEdit(item);
      setShowEditOverlay(true);
    } else {
      alert("Item not found");
    }
  };

  const handleSaveChanges = async () => {
    if (itemToEdit) {
      try {
        const response = await fetch(
          `http://localhost:8081/inventoryManagement/putSubitem/${itemToEdit.inventoryID}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(itemToEdit),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update subitem");
        }

        const updatedInventory = await fetch(
          "http://localhost:8081/inventoryManagement/getSubitem"
        ).then((res) => res.json());
        setInventoryData(updatedInventory);

        setShowEditOverlay(false);
        alert("Subitem updated successfully");
      } catch (error) {
        console.error("Error updating subitem:", error);
      }
    }
  };

  const handleDeleteItem = async () => {
    if (itemToDelete) {
      try {
        const response = await fetch(
          `http://localhost:8081/inventoryManagement/deleteSubitem/${itemToDelete.inventoryID}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete subitem");
        }

        const updatedInventory = await fetch(
          "http://localhost:8081/inventoryManagement/getSubitem"
        ).then((res) => res.json());
        setInventoryData(updatedInventory);

        setShowDeleteOverlay(false);
        alert("Subitem deleted successfully");
      } catch (error) {
        console.error("Error deleting subitem:", error);
      }
    }
  };

  const [detailedData, setDetailedData] = useState<{ [key: number]: any }>({}); // Store details for each inventoryID

  const toggleRow = async (inventoryID: number) => {
    if (collapsedRows.includes(inventoryID)) {
      // Collapse row
      setCollapsedRows(collapsedRows.filter(id => id !== inventoryID));
    } else {
      // Expand row and fetch details if not already fetched
      if (!detailedData[inventoryID]) {
        try {
          const response = await axios.get(`http://localhost:8081/inventoryManagement/getSubitemDetails/${inventoryID}`);
          setDetailedData({
            ...detailedData,
            [inventoryID]: response.data,
          });
        } catch (error) {
          console.error(`Error fetching details for inventory ID ${inventoryID}:`, error);
        }
      }
      setCollapsedRows([...collapsedRows, inventoryID]);
    }
  };
  

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="flex justify-center items-center w-full pb-7 min-h-screen">
      <div className="w-[360px] flex flex-col items-center bg-white min-h-screen p-4 rounded-lg shadow-md">
        <h1 className="text-center text-sm mb-4 text-black">Inventory Management</h1>
        <div className="mb-4 w-full flex flex-wrap justify-between">
          <button
            onClick={() => setShowAddOverlay(true)}
            className="bg-black text-white py-2 px-3 text-xs rounded mr-2"
          >
            Add Item
          </button>
          <button
            onClick={() => {
              const id = prompt("Enter Inventory ID to Edit:");
              if (id) {
                handleEditItem(Number(id));
              }
            }}
            className="bg-black text-white py-2 px-3 text-xs rounded mr-2"
          >
            Edit Item
          </button>

          <button
            onClick={() => {
              const id = prompt("Enter Inventory ID to Delete:");
              if (id) {
                const item = inventoryData.find(
                  (item) => item.inventoryID === Number(id)
                );
                if (item) {
                  setItemToDelete(item);
                  setShowDeleteOverlay(true);
                } else {
                  alert("Item not found");
                }
              }
            }}
            className="bg-black text-white py-2 px-3 text-xs rounded"
          >
            Delete Item
          </button>

         <button
          onClick={() => {
            const id = prompt("Enter Inventory ID to Update Stock:");
            if (id) {
              handleUpdateStock(id);
            }
          }}
          className="bg-black text-white py-2 px-3 text-xs rounded"
        >
          Update Stock
        </button>

          <button
            onClick={() => setShowStockInOverlay(true)}
            className="bg-black text-white py-2 px-3 text-xs rounded"
          >
            Stock In
          </button>

          <button
            onClick={() => {
              const id = prompt("Enter Inventory ID to Stock Out:");
              if (id) {
                handleStockOut(Number(id)); // Validate and handle stock out
              }
            }}
            className="bg-black text-white py-2 px-3 text-xs rounded"
          >
            Stock Out
          </button>
        </div>

        {inventoryData.length === 0 ? (
          <p className="text-sm text-black">No inventory items found</p>
        ) : (
          <table className="w-full text-black text-xs">
            <thead>
              <tr>
                <th className="border p-1">ID</th>
                <th className="border p-1">Name</th>
                <th className="border p-1">Category</th>
                <th className="border p-1">Reorder Point</th>
                <th className="border p-1">Total Qty</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.map((item) => (
                <React.Fragment key={item.inventoryID}>
                  <tr
                    onClick={() => toggleRow(item.inventoryID)} // Click to toggle
                    className={`cursor-pointer ${
                      collapsedRows.includes(item.inventoryID)
                        ? "bg-cream"
                        : item.totalQuantity <= item.reorderPoint
                        ? "bg-lightRed text-black" // Add background and text color for low stock
                        : ""
                    }`}
                  >
                    <td className="border p-1">{item.inventoryID}</td>
                    <td className="border p-1">{item.inventoryName}</td>
                    <td className="border p-1">{item.inventoryCategory}</td>
                    <td className="border p-1">
                      {item.reorderPoint} {item.unitOfMeasure}
                    </td>
                    <td className="border p-1">
                      {item.totalQuantity} {item.unitOfMeasure}
                    </td>
                  </tr>
                  {collapsedRows.includes(item.inventoryID) && detailedData[item.inventoryID] && (
                    <tr>
                    <td colSpan={5} className="p-1 border bg-cream">
                        <div className="text-xs mb-2">
                          <strong>Details:</strong>
                          {detailedData[item.inventoryID] && detailedData[item.inventoryID].length > 0 ? (
                            <ul>
                              {detailedData[item.inventoryID].map((detail: any, index: number) => (
                                <li key={index} className="mt-2">
                                  <strong>Subinventory ID:</strong> {detail.subinventoryID} <br />
                                  <strong>Qty Remaining:</strong> {detail.quantityRemaining} <br />
                                  <strong>Price per Unit:</strong> {detail.pricePerUnit} <br />
                                  <strong>Expiry Date:</strong> {detail.expiryDate ? format(new Date(detail.expiryDate), "yyyy-MM-dd") : "N/A"} <br />
                                  <strong>Stock-in Date:</strong> {detail.stockInDate ? format(new Date(detail.stockInDate), "yyyy-MM-dd") : "N/A"} <br />
                                  <strong>Supplier:</strong> {detail.supplierName} <br />
                                  <strong>Handled by:</strong> {detail.employeeName}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p>No Stock Available</p>
                          )}
                        </div>
                      </td>
                    </tr> 
                  )}

                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}

        {showAddOverlay && (
          <SubitemModal
            modalTitle="Add Inventory Item"
            subitemData={newItem}
            setSubitemData={setNewItem}
            onSave={async () => {
              await handleAddItem();
              resetNewItem();
            }}
            onCancel={() => {
              setShowAddOverlay(false);
              resetNewItem();
            }}
          />
        )}

        {showEditOverlay && itemToEdit && (
          <SubitemModal
            modalTitle="Edit Inventory Item"
            subitemData={itemToEdit}
            setSubitemData={setItemToEdit}
            onSave={async () => {
              await handleSaveChanges();
            }}
            onCancel={() => setShowEditOverlay(false)}
          />
        )}

        {showDeleteOverlay && itemToDelete && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg w-72">
              <h2 className="text-black text-sm">Delete Inventory Item</h2>
              <p className="text-black text-xs">
                Are you sure you want to delete the following item?
              </p>
              <p className="text-black text-xs">
                <strong>ID:</strong> {itemToDelete.inventoryID}
              </p>
              <p className="text-black text-xs">
                <strong>Name:</strong> {itemToDelete.inventoryName}
              </p>
              <p className="text-black text-xs">
                <strong>Category:</strong> {itemToDelete.inventoryCategory}
              </p>
              <p className="text-black text-xs">
                <strong>Reorder Point:</strong> {itemToDelete.reorderPoint}
              </p>
              <p className="text-black text-xs">
                <strong>Unit:</strong> {itemToDelete.unitOfMeasure}
              </p>
              <div className="flex justify-between">
                <button
                  onClick={async () => {
                    await handleDeleteItem();
                    setShowDeleteOverlay(false);
                  }}
                  className="bg-black text-white py-1 px-2 text-xs rounded"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowDeleteOverlay(false)}
                  className="bg-black text-white py-1 px-2 text-xs rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showStockInOverlay && (
          <StockInModal
            stockInData={stockInData}
            setStockInData={(data) => {
              setStockInData((prevData) => ({
                ...prevData,
                ...data,
                inventoryItems: data.inventoryItems.map((item) => ({
                  ...item,
                  expiryDate: item.expiryDate
                    ? format(new Date(item.expiryDate), "yyyy-MM-dd")
                    : "",
                })),
              }));
            }}
            employees={employees}
            inventoryNames={inventoryNames}
            handleStockIn={handleStockIn}
            onClose={() => {
              setShowStockInOverlay(false);
            }}
          />
        )}

        {showStockOutOverlay && (
          <StockOutModal
            stockOutData={stockOutData}
            setStockOutData={setStockOutData}
            handleStockOutSubmit={handleStockOutSubmit}
            onClose={() => setShowStockOutOverlay(false)}
            inventoryNames={inventoryNames}
          />
        )}

        {showUpdateStockOverlay && (
          <UpdateStockModal
            updateStockData={updateStockData}
            setUpdateStockData={setUpdateStockData}
            handleUpdateStockSubmit={handleUpdateStockSubmit}
            onClose={() => setShowUpdateStockOverlay(false)}
          />
        )}
      </div>
    </div>
  );
}
