import React, { useState } from "react";

interface StockOutModalProps {
  stockOutData: {
    inventoryID: string;
    quantity: number;
    reason: string;
  };
  setStockOutData: (data: any) => void;
  handleStockOutSubmit: () => Promise<void>;
  onClose: () => void;
}

const StockOutModal: React.FC<StockOutModalProps> = ({
  stockOutData,
  setStockOutData,
  handleStockOutSubmit,
  onClose,
}) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg w-72">
        <h2 className="text-black">Stock Out Subitem</h2>
        <div>
          <input
            type="number"
            placeholder="Quantity"
            value={stockOutData.quantity === 0 ? "" : stockOutData.quantity}
            onChange={(e) =>
              setStockOutData({
                ...stockOutData,
                quantity: e.target.value === "" ? 0 : Number(e.target.value),
              })
            }
            className="mb-2 p-2 w-full text-black border border-black"
          />
          <input
            type="text"
            placeholder="Reason"
            value={stockOutData.reason}
            onChange={(e) =>
              setStockOutData({ ...stockOutData, reason: e.target.value })
            }
            className="mb-2 p-2 w-full text-black border border-black"
          />
          <div className="flex justify-between">
            <button
              onClick={async () => {
                await handleStockOutSubmit();
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

export default StockOutModal;