import React, { useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { format } from 'date-fns';
import { MultiItemStockInData } from "../../lib/types/InventoryItemDataTypes";

interface StockInModalProps {
  stockInData: MultiItemStockInData;
  setStockInData: (data: MultiItemStockInData) => void;
  employees: { employeeID: number; firstName: string; lastName: string }[];
  inventoryNames: { inventoryID: number; inventoryName: string }[];
  handleStockIn: () => Promise<void>;
  onClose: () => void;
}

const StockInModal: React.FC<StockInModalProps> = ({
  stockInData,
  setStockInData,
  employees,
  inventoryNames,
  handleStockIn,
  onClose,
}) => {
  const [inventoryItems, setInventoryItems] = useState(
    stockInData.inventoryItems.map(item => ({
      ...item,
      expiryDate: typeof item.expiryDate === 'string' ? item.expiryDate : format(item.expiryDate, 'yyyy-MM-dd'),
      expanded: true
    }))
  );

  const addInventoryItem = () => {
    setInventoryItems([...inventoryItems, {
      inventoryID: 0,
      quantityOrdered: 0,
      actualQuantity: 0,
      pricePerUnit: 0,
      expiryDate: format(new Date(), 'yyyy-MM-dd'),
      expanded: true,
    }]);
  };

  const toggleExpandItem = (index: number) => {
    const newInventoryItems = [...inventoryItems];
    newInventoryItems[index].expanded = !newInventoryItems[index].expanded;
    setInventoryItems(newInventoryItems);
  };

  const updateInventoryItem = (index: number, updatedItem: any) => {
    const newInventoryItems = [...inventoryItems];
    newInventoryItems[index] = { ...newInventoryItems[index], ...updatedItem };
    setInventoryItems(newInventoryItems);
    setStockInData({ ...stockInData, inventoryItems: newInventoryItems });
  };

  const updateAllInventoryItems = (updatedData: any) => {
    const newInventoryItems = inventoryItems.map(item => ({
      ...item,
      ...updatedData
    }));
    setInventoryItems(newInventoryItems);
    setStockInData({ ...stockInData, inventoryItems: newInventoryItems });
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg w-96 max-h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-black">Stock In</h2>
          <div className="flex items-center">
            <label htmlFor="stockInDate" className="text-black mr-2">
              Date:
            </label>
            <input
              type="date"
              id="stockInDate"
              value={stockInData.stockInDate ? stockInData.stockInDate : ''}
              onChange={(e) => {
                const newValue = e.target.value;
                setStockInData({ ...stockInData, stockInDate: newValue });
              }}
              className="p-2 text-black border border-black"
            />
          </div>
        </div>
        <div>
          <input
            type="text"
            placeholder="Supplier Name"
            value={stockInData.supplierName}
            onChange={(e) => {
              const newValue = e.target.value;
              setStockInData({ ...stockInData, supplierName: newValue });
            }}
            className="mb-2 p-2 w-full text-black border border-black"
          />
          <select
            value={stockInData.employeeID}
            onChange={(e) => {
              const newValue = e.target.value;
              setStockInData({ ...stockInData, employeeID: newValue });
            }}
            className="mb-2 p-2 w-full text-black border border-black"
          >
            <option value="" disabled>
              Select Employee
            </option>
            {employees.map((employee) => (
              <option key={employee.employeeID} value={employee.employeeID.toString()}>
                {`${employee.firstName} ${employee.lastName}`}
              </option>
            ))}
          </select>
          {inventoryItems.map((item, index) => (
            <div key={index} className="inventoryItem mb-4 border border-black bg-cream p-2">
              <div className="flex justify-between items-center">
                <select
                  value={item.inventoryID}
                  onChange={(e) =>
                    updateInventoryItem(index, {
                      inventoryID: parseInt(e.target.value),
                    })
                  }
                  className="mb-2 mt-2 p-2 w-full text-black border border-black"
                >
                  <option value="0" disabled>
                    Select Item
                  </option>
                  {inventoryNames.map((inventory) => (
                    <option key={inventory.inventoryID} value={inventory.inventoryID}>
                      {inventory.inventoryName}
                    </option>
                  ))}
                </select>
                <button onClick={() => toggleExpandItem(index)} className="ml-2">
                  {item.expanded ? (
                    <IoIosArrowUp className="text-black" />
                  ) : (
                    <IoIosArrowDown className="text-black" />
                  )}
                </button>
              </div>
              {item.expanded && (
                <div>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="number"
                      placeholder="Quantity Ordered"
                      value={item.quantityOrdered}
                      min="0"
                      onChange={(e) =>
                        updateInventoryItem(index, {
                          quantityOrdered: parseInt(e.target.value),
                        })
                      }
                      className="p-2 w-1/2 text-black border border-black"
                    />
                    <input
                      type="number"
                      placeholder="Actual Quantity"
                      value={item.actualQuantity}
                      min="0"
                      onChange={(e) =>
                        updateInventoryItem(index, {
                          actualQuantity: parseInt(e.target.value),
                        })
                      }
                      className="p-2 w-1/2 text-black border border-black"
                    />
                  </div>

                  <input
                    type="number"
                    placeholder="Price Per Unit"
                    value={item.pricePerUnit}
                    min="0"
                    onChange={(e) =>
                      updateInventoryItem(index, {
                        pricePerUnit: parseFloat(e.target.value),
                      })
                    }
                    className="mb-2 p-2 w-full text-black border border-black"
                  />
                  <input
                    type="date"
                    placeholder="Expiry Date"
                    value={item.expiryDate}
                    onChange={(e) =>
                      updateInventoryItem(index, {
                        expiryDate: e.target.value,
                      })
                    }
                    className="mb-2 p-2 w-full text-black border border-black"
                  />
                </div>
              )}
            </div>
          ))}
          <button
            onClick={addInventoryItem}
            className="bg-tealGreen text-black py-2 px-4 rounded mb-4 border-none cursor-pointer mx-auto block"
          >
            Add Inventory Item
          </button>
          <div className="flex justify-between">
            <button
              onClick={async () => {
                console.log("Stock In Data:", inventoryItems);
                await handleStockIn();
                onClose();
              }}
              className="bg-tealGreen text-black py-2 px-4 rounded border-none cursor-pointer"
            >
              Stock In
            </button>
            <button
              onClick={onClose}
              className="bg-tealGreen text-black py-2 px-4 rounded border-none cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockInModal;