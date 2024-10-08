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
      console.log("StockIn Data before request:", stockInData); // Log data before making the request
  
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
      console.log("Stock In Data after success:", stockInData); // Log data after successful stocking in
  
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
  
        // Log the employee names to the console
        response.data.forEach((employee: { firstName: any; lastName: any; }) => {
          console.log(`${employee.firstName} ${employee.lastName}`);
        });
  
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
    setUpdateStockData({ ...updateStockData, inventoryID });
    setShowUpdateStockOverlay(true);
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
        // Refresh the inventory data
        const updatedInventory = await fetch(
          "http://localhost:8081/inventoryManagement/getSubitem"
        ).then((res) => res.json());
        setInventoryData(updatedInventory);
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
    inventoryID: "",
    quantity: 0,
    reason: "",
  });

  const handleStockOut = (inventoryID: string) => {
    setStockOutData({ ...stockOutData, inventoryID });
    setShowStockOutOverlay(true);
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
        // You might want to refresh the inventory list or update the UI here
      } else {
        const errorData = await response.json();
        alert("Error: " + errorData.message);
      }
    } catch (err) {
      console.error("Error during stock-out:", err);
      alert("Error during stock-out: ");
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
      alert("Subitem not found");
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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const formatDate = (dateString?: string | null) => {
    if (!dateString) {
      return "";
    }
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "" : format(date, "yyyy-MM-dd");
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <h1>Inventory Management</h1>
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setShowAddOverlay(true)}
          className="bg-black text-white py-3 px-5 rounded cursor-pointer mr-2"
        >
          Add Subitem
        </button>
        <button
          onClick={() => {
            const id = prompt("Enter Inventory ID to Edit:");
            if (id) {
              handleEditItem(Number(id));
            }
          }}
          className="bg-black text-white py-3 px-5 rounded cursor-pointer mr-2"
        >
          Edit Subitem
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
                alert("Subitem not found");
              }
            }
          }}
          className="bg-black text-white py-3 px-5 rounded cursor-pointer mr-10"
        >
          Delete Subitem
        </button>
        <button
          onClick={() => {
            const id = prompt("Enter Inventory ID to Update Stock:");
            if (id) {
              setUpdateStockData({ inventoryID: id, quantity: 0 });
              setShowUpdateStockOverlay(true);
            }
          }}
          className="bg-black text-white py-3 px-5 rounded cursor-pointer mr-2"
        >
          Update Stock
        </button>
        <button
          onClick={() => setShowStockInOverlay(true)}
          className="bg-black text-white py-3 px-5 rounded cursor-pointer mr-2"
        >
          Stock In
        </button>
        <button
          onClick={() => {
            const id = prompt("Enter Inventory ID to Stock Out:");
            if (id) {
              handleStockOut(id); // Pass the ID directly
            }
          }}
          className="bg-black text-white py-3 px-5 rounded cursor-pointer mr-2"
        >
          Stock Out
        </button>
      </div>

      {inventoryData.length === 0 ? (
        <p>No inventory items found</p>
      ) : (
        <table className="w-full text-black border border-black border-collapse">
          <thead>
            <tr>
              <th className="border border-black p-2.5">Inventory ID</th>
              <th className="border border-black p-2.5">Inventory Name</th>
              <th className="border border-black p-2.5">Category</th>
              <th className="border border-black p-2.5">Reorder Point</th>
              <th className="border border-black p-2.5">Total Quantity</th>
              <th className="border border-black p-2.5">Quantity Remaining</th>
              <th className="border border-black p-2.5">Price Per Unit</th>
              <th className="border border-black p-2.5">Stock In Date</th>
              <th className="border border-black p-2.5">Expiry Date</th>
              <th className="border border-black p-2.5">Supplier Name</th>
              <th className="border border-black p-2.5">Employee Name</th>
            </tr>
          </thead>
          <tbody>
            {inventoryData.map((item) => (
              <tr
              key={item.inventoryID}
              className={item.totalQuantity !== null && item.totalQuantity <= item.reorderPoint ? "bg-low-quantity" : ""}
              >
                <td className="border border-black p-2.5">
                  {item.inventoryID}
                </td>
                <td className="border border-black p-2.5">
                  {item.inventoryName}
                </td>
                <td className="border border-black p-2.5">
                  {item.inventoryCategory}
                </td>
                <td className="border border-black p-2.5">
                  {item.inventoryName ? item.reorderPoint + " " + item.unitOfMeasure : ""}
                </td>
                <td className="border border-black p-2.5">
                  {item.totalQuantity}
                </td>
                <td className="border border-black p-2.5">
                  {item.quantityRemaining}
                </td>
                <td className="border border-black p-2.5">
                  {item.pricePerUnit}
                </td>
                <td className="border border-black p-2.5">
                  {formatDate(item.stockInDate)}
                </td>
                <td className="border border-black p-2.5">
                  {formatDate(item.expiryDate)}
                </td>
                <td className="border border-black p-2.5">
                  {item.supplierName}
                </td>
                <td className="border border-black p-2.5">
                  {item.employeeName}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showAddOverlay && (
        <SubitemModal
          modalTitle="Add Inventory Subitem"
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
          modalTitle="Edit Inventory Subitem"
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
          <div className="bg-white p-5 rounded-lg w-72">
            <h2 className="text-black">Delete Inventory Subitem</h2>
            <p className="text-black">
              Are you sure you want to delete the following item?
            </p>
            <p className="text-black">
              <strong>Inventory ID:</strong> {itemToDelete.inventoryID}
            </p>
            <p className="text-black">
              <strong>Name:</strong> {itemToDelete.inventoryName}
            </p>
            <p className="text-black">
              <strong>Inventory Category:</strong>{" "}
              {itemToDelete.inventoryCategory}
            </p>
            <p className="text-black">
              <strong>Reorder Point:</strong> {itemToDelete.reorderPoint}
            </p>
            <p className="text-black">
              <strong>Unit of Measure:</strong> {itemToDelete.unitOfMeasure}
            </p>
            <div className="flex justify-between">
              <button
                onClick={async () => {
                  await handleDeleteItem();
                  setShowDeleteOverlay(false);
                }}
                className="bg-black text-white py-2 px-4 rounded cursor-pointer"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowDeleteOverlay(false)}
                className="bg-black text-white py-2 px-4 rounded cursor-pointer"
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
                expiryDate: item.expiryDate ? format(new Date(item.expiryDate), 'yyyy-MM-dd') : "",
              })),
            }));
          }}
          employees={employees}
          inventoryNames={inventoryNames}
          handleStockIn={handleStockIn}
          onClose={() => {
            console.log("StockInData on close:", stockInData);
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
        />
      )}

      {showUpdateStockOverlay && (
        <UpdateStockModal
          updateStockData={updateStockData} // Make sure this prop matches the expected prop name in UpdateStockModal
          setUpdateStockData={setUpdateStockData} // Update to match prop name
          handleUpdateStockSubmit={handleUpdateStockSubmit}
          onClose={() => setShowUpdateStockOverlay(false)}
        />
      )}
    </div>
  );
}