"use client";

import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

interface InventoryItem {
  inventoryID: number;
  inventoryName: string;
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
    unitOfMeasure: string;
    reorderPoint: number;
  }>({
    inventoryName: '',
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
    <div
      style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h1>Inventory Management</h1>
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setShowAddOverlay(true)}
          style={{
            backgroundColor: 'black',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            marginRight: '10px',
          }}
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
          style={{
            backgroundColor: 'black',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            marginRight: '10px',
          }}
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
          style={{
            backgroundColor: 'black',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            marginRight: '10px',
          }}
        >
          Delete Subitem
        </button>
        <button
          onClick={() => setShowStockInOverlay(true)}
          style={{
            backgroundColor: 'black',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            marginRight: '10px',
          }}
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
          style={{
            backgroundColor: 'black',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            marginRight: '10px',
          }}
        >
          Stock Out
        </button>


      </div>

      {inventoryData.length === 0 ? (
        <p>No inventory items found</p>
      ) : (
        <table
          style={{
            width: '100%',
            color: 'black',
            border: '1px solid black',
            borderCollapse: 'collapse',
          }}
        >
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '10px' }}>
                Inventory ID
              </th>
              <th style={{ border: '1px solid black', padding: '10px' }}>
                Inventory Name
              </th>
              <th style={{ border: '1px solid black', padding: '10px' }}>
                Reorder Point
              </th>
              <th style={{ border: '1px solid black', padding: '10px' }}>
                Unit of Measure
              </th>
              <th style={{ border: '1px solid black', padding: '10px' }}>
                Purchase Order ID
              </th>
              <th style={{ border: '1px solid black', padding: '10px' }}>
                Total Quantity
              </th>
              <th style={{ border: '1px solid black', padding: '10px' }}>
                Quantity Remaining
              </th>
              <th style={{ border: '1px solid black', padding: '10px' }}>
                Price Per Unit
              </th>
              <th style={{ border: '1px solid black', padding: '10px' }}>
                Stock In Date
              </th>
              <th style={{ border: '1px solid black', padding: '10px' }}>
                Expiry Date
              </th>
              <th style={{ border: '1px solid black', padding: '10px' }}>
                Supplier Name
              </th>
              <th style={{ border: '1px solid black', padding: '10px' }}>
                Employee Name
              </th>
            </tr>
          </thead>
          <tbody>
            {inventoryData.map((item) => (
              <tr key={item.inventoryID}>
                <td style={{ border: '1px solid black', padding: '10px' }}>
                  {item.inventoryID}
                </td>
                <td style={{ border: '1px solid black', padding: '10px' }}>
                  {item.inventoryName}
                </td>
                <td style={{ border: '1px solid black', padding: '10px' }}>
                  {item.reorderPoint}
                </td>
                <td style={{ border: '1px solid black', padding: '10px' }}>
                  {item.unitOfMeasure}
                </td>
                <td style={{ border: '1px solid black', padding: '10px' }}>
                  {item.purchaseOrderID}
                </td>
                <td style={{ border: '1px solid black', padding: '10px' }}>
                  {item.totalQuantity}
                </td>
                <td style={{ border: '1px solid black', padding: '10px' }}>
                  {item.quantityRemaining}
                </td>
                <td style={{ border: '1px solid black', padding: '10px' }}>
                  {item.pricePerUnit}
                </td>
                <td style={{ border: '1px solid black', padding: '10px' }}>
                  {formatDate(item.stockInDate)}
                </td>
                <td style={{ border: '1px solid black', padding: '10px' }}>
                  {formatDate(item.expiryDate)}
                </td>
                <td style={{ border: '1px solid black', padding: '10px' }}>
                  {item.supplierName}
                </td>
                <td style={{ border: '1px solid black', padding: '10px' }}>
                  {item.employeeName}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showAddOverlay && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              width: '300px',
            }}
          >
            <h2 style={{ color: 'black' }}>Add Inventory Subitem</h2>
            <div>
              <input
                type="text"
                placeholder="Inventory Name"
                value={newItem.inventoryName}
                onChange={(e) =>
                  setNewItem({ ...newItem, inventoryName: e.target.value })
                }
                style={{
                  marginBottom: '10px',
                  padding: '8px',
                  width: '100%',
                  color: 'black',
                }}
              />
              <input
                type="text"
                placeholder="Unit of Measure"
                value={newItem.unitOfMeasure}
                onChange={(e) =>
                  setNewItem({ ...newItem, unitOfMeasure: e.target.value })
                }
                style={{
                  marginBottom: '10px',
                  padding: '8px',
                  width: '100%',
                  color: 'black',
                }}
              />
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
                style={{
                  marginBottom: '10px',
                  padding: '8px',
                  width: '100%',
                  color: 'black',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                  onClick={async () => {
                    await handleAddItem();
                    setShowAddOverlay(false);
                  }}
                  style={{
                    backgroundColor: 'black',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() => setShowAddOverlay(false)}
                  style={{
                    backgroundColor: 'black',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditOverlay && itemToEdit && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              width: '300px',
            }}
          >
            <h2 style={{ color: 'black' }}>Edit Inventory Subitem</h2>
            <div>
              <input
                type="text"
                placeholder="Inventory Name"
                value={itemToEdit.inventoryName}
                onChange={(e) =>
                  setItemToEdit({ ...itemToEdit, inventoryName: e.target.value })
                }
                style={{
                  marginBottom: '10px',
                  padding: '8px',
                  width: '100%',
                  color: 'black',
                }}
              />
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
                style={{
                  marginBottom: '10px',
                  padding: '8px',
                  width: '100%',
                  color: 'black',
                }}
              />
              <input
                type="text"
                placeholder="Unit of Measure"
                value={itemToEdit.unitOfMeasure}
                onChange={(e) =>
                  setItemToEdit({ ...itemToEdit, unitOfMeasure: e.target.value })
                }
                style={{
                  marginBottom: '10px',
                  padding: '8px',
                  width: '100%',
                  color: 'black',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                  onClick={async () => {
                    await handleSaveChanges();
                    setShowEditOverlay(false);
                  }}
                  style={{
                    backgroundColor: 'black',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() => setShowEditOverlay(false)}
                  style={{
                    backgroundColor: 'black',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteOverlay && itemToDelete && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              width: '300px',
            }}
          >
            <h2 style={{ color: 'black' }}>Delete Inventory Subitem</h2>
            <p style={{ color: 'black' }}>Are you sure you want to delete the following item?</p>
            <p style={{ color: 'black' }}><strong>Inventory ID:</strong> {itemToDelete.inventoryID}</p>
            <p style={{ color: 'black' }}><strong>Name:</strong> {itemToDelete.inventoryName}</p>
            <p style={{ color: 'black' }}><strong>Reorder Point:</strong> {itemToDelete.reorderPoint}</p>
            <p style={{ color: 'black' }}><strong>Unit of Measure:</strong> {itemToDelete.unitOfMeasure}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
                onClick={async () => {
                  await handleDeleteItem();
                  setShowDeleteOverlay(false);
                }}
                style={{
                  backgroundColor: 'black',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Confirm
              </button>
              <button
                onClick={() => setShowDeleteOverlay(false)}
                style={{
                  backgroundColor: 'black',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showStockInOverlay && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              width: '400px',
            }}
          >
            <h2 style={{ color: 'black' }}>Stock In</h2>
            <div>
              <input
                type="text"
                placeholder="Inventory ID"
                value={stockInData.inventoryID}
                onChange={(e) =>
                  setStockInData({ ...stockInData, inventoryID: e.target.value })
                }
                style={{
                  marginBottom: '10px',
                  padding: '8px',
                  width: '100%',
                  color: 'black',
                }}
              />
              <input
                type="text"
                placeholder="Supplier Name"
                value={stockInData.supplierName}
                onChange={(e) =>
                  setStockInData({ ...stockInData, supplierName: e.target.value })
                }
                style={{
                  marginBottom: '10px',
                  padding: '8px',
                  width: '100%',
                  color: 'black',
                }}
              />
              <input
                type="text"
                placeholder="Employee ID"
                value={stockInData.employeeID}
                onChange={(e) =>
                  setStockInData({ ...stockInData, employeeID: e.target.value })
                }
                style={{
                  marginBottom: '10px',
                  padding: '8px',
                  width: '100%',
                  color: 'black',
                }}
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
                style={{
                  marginBottom: '10px',
                  padding: '8px',
                  width: '100%',
                  color: 'black',
                }}
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
                style={{
                  marginBottom: '10px',
                  padding: '8px',
                  width: '100%',
                  color: 'black',
                }}
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
                style={{
                  marginBottom: '10px',
                  padding: '8px',
                  width: '100%',
                  color: 'black',
                }}
              />
              <input
                type="date"
                placeholder="Stock In Date"
                value={stockInData.stockInDate}
                onChange={(e) =>
                  setStockInData({ ...stockInData, stockInDate: e.target.value })
                }
                style={{
                  marginBottom: '10px',
                  padding: '8px',
                  width: '100%',
                  color: 'black',
                }}
              />
              <input
                type="date"
                placeholder="Expiry Date"
                value={stockInData.expiryDate}
                onChange={(e) =>
                  setStockInData({ ...stockInData, expiryDate: e.target.value })
                }
                style={{
                  marginBottom: '10px',
                  padding: '8px',
                  width: '100%',
                  color: 'black',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  onClick={async () => {
                    await handleStockIn();
                    setShowStockInOverlay(false);
                  }}
                  style={{
                    backgroundColor: 'black',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Stock In
                </button>
                <button
                  onClick={() => setShowStockInOverlay(false)}
                  style={{
                    backgroundColor: 'black',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}  
      {showStockOutOverlay && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              width: '300px',
            }}
          >
            <h2 style={{ color: 'black' }}>Stock Out Subitem</h2>
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
                style={{
                  marginBottom: '10px',
                  padding: '8px',
                  width: '100%',
                  color: 'black',
                }}
              />
              <input
                type="text"
                placeholder="Reason"
                value={stockOutData.reason}
                onChange={(e) =>
                  setStockOutData({ ...stockOutData, reason: e.target.value })
                }
                style={{
                  marginBottom: '10px',
                  padding: '8px',
                  width: '100%',
                  color: 'black',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  onClick={async () => {
                    await handleStockOutSubmit();
                    setShowStockOutOverlay(false);
                  }}
                  style={{
                    backgroundColor: 'black',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() => setShowStockOutOverlay(false)}
                  style={{
                    backgroundColor: 'black',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
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

               
