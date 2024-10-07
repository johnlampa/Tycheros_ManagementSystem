"use client";

import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

interface InventoryItem {
  inventoryID: number;
  inventoryName: string;
  inventoryCategory : string;
  reorderPoint: number;
  unitOfMeasure: string;
  purchaseOrderID: number;
  totalQuantity: number;
  quantityRemaining: number;
  pricePerUnit: number;
  stockInDate: string;
  expiryDate: string;
  supplierName: string;
  employeeName: string;
}

export default function InventoryManagementPage() {
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [showAddOverlay, setShowAddOverlay] = useState(false);
  const [showEditOverlay, setShowEditOverlay] = useState(false);
  const [showDeleteOverlay, setShowDeleteOverlay] = useState(false);
  const [newItem, setNewItem] = useState<{
    inventoryName: string;
    inventoryCategory: string;
    unitOfMeasure: string;
    reorderPoint: number;
  }>({
    inventoryName: '',
    inventoryCategory: '',
    unitOfMeasure: '',
    reorderPoint: 0,
  });

  const [itemToEdit, setItemToEdit] = useState<InventoryItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);

  const [showStockInOverlay, setShowStockInOverlay] = useState(false);
  const [stockInData, setStockInData] = useState({
    inventoryID: '',
    supplierName: '',
    employeeID: '',
    quantityOrdered: '',
    actualQuantity: '',
    pricePerUnit: '',
    stockInDate: '',
    expiryDate: '',
  });

  const handleStockIn = async () => {
    try {
      const response = await fetch('http://localhost:8081/inventoryManagement/stockInSubitem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...stockInData,
          quantityOrdered: Number(stockInData.quantityOrdered),
          actualQuantity: Number(stockInData.actualQuantity),
          pricePerUnit: Number(stockInData.pricePerUnit),
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to stock in subitem');
      }
  
      const updatedInventory = await fetch('http://localhost:8081/inventoryManagement/getSubitem').then((res) =>
        res.json()
      );
      setInventoryData(updatedInventory);
  
      alert('Subitem stocked in successfully');
    } catch (error) {
      console.error('Error stocking in subitem:', error);
    }
  };
  
  const [showStockOutOverlay, setShowStockOutOverlay] = useState(false);
  const [stockOutData, setStockOutData] = useState({
    purchaseOrderID: '',
    quantity: 0,
    reason: ''
  });

  const handleStockOut = (purchaseOrderID: string) => {
    setStockOutData({ ...stockOutData, purchaseOrderID });
    setShowStockOutOverlay(true);
  };

  const handleStockOutSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8081/inventoryManagement/stockOutSubitem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stockOutData),
      });
  
      if (response.ok) {
        alert('Stock-out recorded successfully');
        window.location.reload();
        // You might want to refresh the inventory list or update the UI here
      } else {
        const errorData = await response.json();
        alert('Error: ' + errorData.message);
      }
    } catch (err) {
      console.error('Error during stock-out:', err);
      alert('Error during stock-out: ');
    }
  };
  

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch('http://localhost:8081/inventoryManagement/getSubitem');
        if (!response.ok) {
          throw new Error('Network response was not ok');
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
      const response = await fetch('http://localhost:8081/inventoryManagement/postSubitem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) {
        throw new Error('Failed to add inventory item');
      }

      setNewItem({
        inventoryName: '',
        inventoryCategory: '',
        unitOfMeasure: '',
        reorderPoint: 0,
      });

      const updatedInventory = await fetch('http://localhost:8081/inventoryManagement/getSubitem').then((res) =>
        res.json()
      );
      setInventoryData(updatedInventory);

      alert('Inventory item added successfully');
    } catch (error) {
      console.error('Error adding inventory item:', error);
    }
  };

  const handleEditItem = async (id: number) => {
    const item = inventoryData.find((item) => item.inventoryID === id);
    if (item) {
      setItemToEdit(item);
      setShowEditOverlay(true);
    } else {
      alert('Subitem not found');
    }
  };

  const handleSaveChanges = async () => {
    if (itemToEdit) {
      try {
        const response = await fetch(`http://localhost:8081/inventoryManagement/putSubitem/${itemToEdit.inventoryID}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(itemToEdit),
        });

        if (!response.ok) {
          throw new Error('Failed to update subitem');
        }

        const updatedInventory = await fetch('http://localhost:8081/inventoryManagement/getSubitem').then((res) =>
          res.json()
        );
        setInventoryData(updatedInventory);

        setShowEditOverlay(false);
        alert('Subitem updated successfully');
      } catch (error) {
        console.error('Error updating subitem:', error);
      }
    }
  };

  const handleDeleteItem = async () => {
    if (itemToDelete) {
      try {
        const response = await fetch(`http://localhost:8081/inventoryManagement/deleteSubitem/${itemToDelete.inventoryID}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete subitem');
        }

        const updatedInventory = await fetch('http://localhost:8081/inventoryManagement/getSubitem').then((res) =>
          res.json()
        );
        setInventoryData(updatedInventory);

        setShowDeleteOverlay(false);
        alert('Subitem deleted successfully');
      } catch (error) {
        console.error('Error deleting subitem:', error);
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
      return '';
    }
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? '' : format(date, 'yyyy-MM-dd');
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <h1>Inventory Management</h1>
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setShowAddOverlay(true)}
          className="bg-black text-white py-3 px-5 rounded cursor-pointer mr-2"
        >
          Add Subitem
        </button>
        <button
          onClick={() => {
            const id = prompt('Enter Inventory ID to Edit:');
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
            const id = prompt('Enter Inventory ID to Delete:');
            if (id) {
              const item = inventoryData.find((item) => item.inventoryID === Number(id));
              if (item) {
                setItemToDelete(item);
                setShowDeleteOverlay(true);
              } else {
                alert('Subitem not found');
              }
            }
          }}
          className="bg-black text-white py-3 px-5 rounded cursor-pointer mr-2"
        >
          Delete Subitem
        </button>
        <button
          onClick={() => setShowStockInOverlay(true)}
          className="bg-black text-white py-3 px-5 rounded cursor-pointer mr-2"
        >
          Stock In
        </button>
        <button
          onClick={() => {
            const id = prompt('Enter Purchase Order ID to Stock Out:');
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
              <th className="border border-black p-2.5">
                Inventory ID
              </th>
              <th className="border border-black p-2.5">
                Inventory Name
              </th>
              <th className="border border-black p-2.5">
                Category
              </th>
              <th className="border border-black p-2.5">
                Reorder Point
              </th>
              <th className="border border-black p-2.5">
                Purchase Order ID
              </th>
              <th className="border border-black p-2.5">
                Total Quantity
              </th>
              <th className="border border-black p-2.5">
                Quantity Remaining
              </th>
              <th className="border border-black p-2.5">
                Price Per Unit
              </th>
              <th className="border border-black p-2.5">
                Stock In Date
              </th>
              <th className="border border-black p-2.5">
                Expiry Date
              </th>
              <th className="border border-black p-2.5">
                Supplier Name
              </th>
              <th className="border border-black p-2.5">
                Employee Name
              </th>
            </tr>
          </thead>
          <tbody>
            {inventoryData.map((item) => (
              <tr key={item.inventoryID}>
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
                  {item.reorderPoint + item.unitOfMeasure}
                </td>
                <td className="border border-black p-2.5">
                  {item.purchaseOrderID}
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
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg w-72">
            <h2 className="text-black">Add Inventory Subitem</h2>
            <div>
              <input
                type="text"
                placeholder="Inventory Name"
                value={newItem.inventoryName}
                onChange={(e) =>
                  setNewItem({ ...newItem, inventoryName: e.target.value })
                }
                className="mb-2 p-2 w-full text-black"
              />
              <select
                value={newItem.inventoryCategory}
                onChange={(e) =>
                  setNewItem({ ...newItem, inventoryCategory: e.target.value })
                }
                className="mb-2 p-2 w-full text-black"
              >
                <option value="">Select Inventory Category</option>
                <option value="Produce">Produce</option>
                <option value="Dairy and Eggs">Dairy and Eggs</option>
                <option value="Meat and Poultry">Meat and Poultry</option>
                <option value="Seafood">Seafood</option>
                <option value="Canned Goods">Canned Goods</option>
                <option value="Dry Goods">Dry Goods</option>
                <option value="Sauces">Sauces</option>
                <option value="Condiments">Condiments</option>
                <option value="Food & Beverage">Food & Beverage</option>
              </select>
              <input
                type="number"
                placeholder="Reorder Point"
                value={newItem.reorderPoint === 0 ? '' : newItem.reorderPoint}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    reorderPoint: e.target.value === '' ? 0 : Number(e.target.value),
                  })
                }
                className="mb-2 p-2 w-full text-black"
              />

              <input
                type="text"
                placeholder="Unit of Measure"
                value={newItem.unitOfMeasure}
                onChange={(e) =>
                  setNewItem({ ...newItem, unitOfMeasure: e.target.value })
                }
                className="mb-2 p-2 w-full text-black"
              />

              <div className="flex justify-between">
                <button
                  onClick={async () => {
                    await handleAddItem();
                    setShowAddOverlay(false);
                  }}
                  className="bg-black text-white py-2 px-4 rounded cursor-pointer"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowAddOverlay(false)}
                  className="bg-black text-white py-2 px-4 rounded cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditOverlay && itemToEdit && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg w-72">
            <h2 className="bg-white text-black">Edit Inventory Subitem</h2>
            <div>
              <input
                type="text"
                placeholder="Inventory Name"
                value={itemToEdit.inventoryName}
                onChange={(e) =>
                  setItemToEdit({ ...itemToEdit, inventoryName: e.target.value })
                }
                className="mb-2 p-2 w-full text-black"
              />

              {/* Dropdown for Inventory Category with current value */}
              <select
                value={itemToEdit.inventoryCategory} // Use itemToEdit for the current value
                onChange={(e) =>
                  setItemToEdit({ ...itemToEdit, inventoryCategory: e.target.value }) // Update itemToEdit on change
                }
                className="mb-2 p-2 w-full text-black"
              >
                <option value="">Select Inventory Category</option>
                <option value="Produce">Produce</option>
                <option value="Dairy and Eggs">Dairy and Eggs</option>
                <option value="Meat and Poultry">Meat and Poultry</option>
                <option value="Seafood">Seafood</option>
                <option value="Canned Goods">Canned Goods</option>
                <option value="Dry Goods">Dry Goods</option>
                <option value="Sauces">Sauces</option>
                <option value="Condiments">Condiments</option>
                <option value="Food & Beverage">Food & Beverage</option>
              </select>

              <input
                type="number"
                placeholder="Reorder Point"
                value={itemToEdit.reorderPoint === 0 ? '' : itemToEdit.reorderPoint}
                onChange={(e) =>
                  setItemToEdit({
                    ...itemToEdit,
                    reorderPoint: e.target.value === '' ? 0 : Number(e.target.value),
                  })
                }
                className="mb-2 p-2 w-full text-black"
              />
              
              <input
                type="text"
                placeholder="Unit of Measure"
                value={itemToEdit.unitOfMeasure}
                onChange={(e) =>
                  setItemToEdit({ ...itemToEdit, unitOfMeasure: e.target.value })
                }
                className="mb-2 p-2 w-full text-black"
              />

              <div className="flex justify-between">
                <button
                  onClick={async () => {
                    await handleSaveChanges();
                    setShowEditOverlay(false);
                  }}
                  className="bg-black text-white py-2 px-4 rounded cursor-pointer"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowEditOverlay(false)}
                  className="bg-black text-white py-2 px-4 rounded cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {showDeleteOverlay && itemToDelete && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg w-72">
            <h2 className="text-black">Delete Inventory Subitem</h2>
            <p className="text-black">Are you sure you want to delete the following item?</p>
            <p className="text-black"><strong>Inventory ID:</strong> {itemToDelete.inventoryID}</p>
            <p className="text-black"><strong>Name:</strong> {itemToDelete.inventoryName}</p>
            <p className="text-black"><strong>Inventory Category:</strong> {itemToDelete.inventoryCategory}</p>
            <p className="text-black"><strong>Reorder Point:</strong> {itemToDelete.reorderPoint}</p>
            <p className="text-black"><strong>Unit of Measure:</strong> {itemToDelete.unitOfMeasure}</p>
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
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg w-96">
            <h2 className="text-black">Stock In</h2>
            <div>
              <input
                type="text"
                placeholder="Inventory ID"
                value={stockInData.inventoryID}
                onChange={(e) =>
                  setStockInData({ ...stockInData, inventoryID: e.target.value })
                }
                className="mb-2 p-2 w-full text-black"
              />
              <input
                type="text"
                placeholder="Supplier Name"
                value={stockInData.supplierName}
                onChange={(e) =>
                  setStockInData({ ...stockInData, supplierName: e.target.value })
                }
                className="mb-2 p-2 w-full text-black"
              />
              <input
                type="text"
                placeholder="Employee ID"
                value={stockInData.employeeID}
                onChange={(e) =>
                  setStockInData({ ...stockInData, employeeID: e.target.value })
                }
                className="mb-2 p-2 w-full text-black"
              />
              <input
                type="number"
                placeholder="Quantity Ordered"
                value={stockInData.quantityOrdered}
                onChange={(e) =>
                  setStockInData({
                    ...stockInData,
                    quantityOrdered: e.target.value,
                  })
                }
                className="mb-2 p-2 w-full text-black"
              />
              <input
                type="number"
                placeholder="Actual Quantity"
                value={stockInData.actualQuantity}
                onChange={(e) =>
                  setStockInData({
                    ...stockInData,
                    actualQuantity: e.target.value,
                  })
                }
                className="mb-2 p-2 w-full text-black"
              />
              <input
                type="number"
                placeholder="Price Per Unit"
                value={stockInData.pricePerUnit}
                onChange={(e) =>
                  setStockInData({
                    ...stockInData,
                    pricePerUnit: e.target.value,
                  })
                }
                className="mb-2 p-2 w-full text-black"
              />
              <input
                type="date"
                placeholder="Stock In Date"
                value={stockInData.stockInDate}
                onChange={(e) =>
                  setStockInData({ ...stockInData, stockInDate: e.target.value })
                }
                className="mb-2 p-2 w-full text-black"
              />
              <input
                type="date"
                placeholder="Expiry Date"
                value={stockInData.expiryDate}
                onChange={(e) =>
                  setStockInData({ ...stockInData, expiryDate: e.target.value })
                }
                className="mb-2 p-2 w-full text-black"
              />
              <div className="flex justify-between">
                <button
                  onClick={async () => {
                    await handleStockIn();
                    setShowStockInOverlay(false);
                  }}
                  className="bg-black text-white py-2 px-4 rounded border-none cursor-pointer"
                >
                  Stock In
                </button>
                <button
                  onClick={() => setShowStockInOverlay(false)}
                  className="bg-black text-white py-2 px-4 rounded border-none cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}  

      {showStockOutOverlay && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg w-72">
            <h2 className="text-black">Stock Out Subitem</h2>
            <div>
              <input
                type="number"
                placeholder="Quantity"
                value={stockOutData.quantity === 0 ? '' : stockOutData.quantity}
                onChange={(e) =>
                  setStockOutData({
                    ...stockOutData,
                    quantity: e.target.value === '' ? 0 : Number(e.target.value),
                  })
                }
                className="mb-2 p-2 w-full text-black"
              />
              <input
                type="text"
                placeholder="Reason"
                value={stockOutData.reason}
                onChange={(e) =>
                  setStockOutData({ ...stockOutData, reason: e.target.value })
                }
                className="mb-2 p-2 w-full text-black"
              />
              <div className="flex justify-between">
                <button
                  onClick={async () => {
                    await handleStockOutSubmit();
                    setShowStockOutOverlay(false);
                  }}
                  className="bg-black text-white py-2 px-4 rounded cursor-pointer"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowStockOutOverlay(false)}
                  className="bg-black text-white py-2 px-4 rounded cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

               
