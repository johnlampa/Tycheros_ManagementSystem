import React from "react";

interface StockInModalProps {
  stockInData: {
    inventoryID: string;
    supplierName: string;
    employeeID: string;
    quantityOrdered: string;
    actualQuantity: string;
    pricePerUnit: string;
    expiryDate: string;
    stockInDate: string;
  };
  setStockInData: (data: any) => void;
  employees: { id: number; firstName: string; lastName: string }[];
  inventoryNames: { id: number; inventoryName: string }[];
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
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-black">Stock In</h2>
          <div className="flex items-center">
            <label htmlFor="stockInDate" className="text-black mr-2">
              Date:
            </label>
            <input
              type="date"
              id="stockInDate"
              value={stockInData.stockInDate}
              onChange={(e) =>
                setStockInData({ ...stockInData, stockInDate: e.target.value })
              }
              className="p-2 text-black"
            />
          </div>
        </div>
        <div>
          <input
            type="text"
            placeholder="Supplier Name"
            value={stockInData.supplierName}
            onChange={(e) =>
              setStockInData({
                ...stockInData,
                supplierName: e.target.value,
              })
            }
            className="mb-2 p-2 w-full text-black"
          />
          <select
            value={stockInData.employeeID}
            onChange={(e) =>
              setStockInData({
                ...stockInData,
                employeeID: e.target.value,
              })
            }
            className="mb-2 p-2 w-full text-black"
          >
            <option value="" disabled>
              Select Employee
            </option>
            {employees.map((employee) => (
              <option
                key={employee.id}
                value={`${employee.firstName} ${employee.lastName}`}
              >
                {`${employee.firstName} ${employee.lastName}`}
              </option>
            ))}
          </select>
          <select
            value={stockInData.inventoryID}
            onChange={(e) =>
              setStockInData({
                ...stockInData,
                inventoryID: e.target.value,
              })
            }
            className="mb-2 p-2 w-full text-black"
          >
            <option value="" disabled>
              Select Item
            </option>
            {inventoryNames.map((item) => (
              <option key={item.id} value={item.inventoryName}>
                {item.inventoryName}
              </option>
            ))}
          </select>
  
          {/* Side-by-Side Inputs for Quantity Ordered and Actual Quantity */}
          <div className="flex gap-2 mb-2">
            <input
              type="number"
              placeholder="Quantity Ordered"
              value={stockInData.quantityOrdered}
              min="0"
              onChange={(e) =>
                setStockInData({
                  ...stockInData,
                  quantityOrdered: e.target.value,
                })
              }
              className="p-2 w-1/2 text-black"
            />
            <input
              type="number"
              placeholder="Actual Quantity"
              value={stockInData.actualQuantity}
              min="0"
              onChange={(e) =>
                setStockInData({
                  ...stockInData,
                  actualQuantity: e.target.value,
                })
              }
              className="p-2 w-1/2 text-black"
            />
          </div>
  
          <input
            type="number"
            placeholder="Price Per Unit"
            value={stockInData.pricePerUnit}
            min="0"
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
                onClose();
              }}
              className="bg-black text-white py-2 px-4 rounded border-none cursor-pointer"
            >
              Stock In
            </button>
            <button
              onClick={onClose}
              className="bg-black text-white py-2 px-4 rounded border-none cursor-pointer"
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
