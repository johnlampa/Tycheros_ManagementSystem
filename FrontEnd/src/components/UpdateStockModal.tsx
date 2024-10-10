import React, { useState } from "react";

interface UpdateStockModalProps {
    updateStockData: {
      inventoryID: string;
      quantity: number;
    };
    setUpdateStockData: React.Dispatch<React.SetStateAction<{ inventoryID: string; quantity: number }>>;
    handleUpdateStockSubmit: () => Promise<void>;
    onClose: () => void;
  }
  
  const UpdateStockModal: React.FC<UpdateStockModalProps> = ({ updateStockData, setUpdateStockData, handleUpdateStockSubmit, onClose }) => {
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-5 rounded-lg w-72">
          <h2 className="text-black">Update Stock Quantity</h2>
          <div>
            <input
              type="number"
              placeholder="Quantity"
              value={updateStockData.quantity === 0 ? "" : updateStockData.quantity}
              onChange={(e) =>
                setUpdateStockData({
                  ...updateStockData,
                  quantity: e.target.value === "" ? 0 : Number(e.target.value),
                })
              }
              className="mb-2 p-2 w-full text-black"
            />
            <div className="flex justify-between">
              <button
                onClick={async () => {
                  await handleUpdateStockSubmit();
                  onClose();
                }}
                className="bg-black text-white py-2 px-4 rounded cursor-pointer"
              >
                Save
              </button>
              <button
                onClick={onClose}
                className="bg-black text-white py-2 px-4 rounded cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default UpdateStockModal;
  