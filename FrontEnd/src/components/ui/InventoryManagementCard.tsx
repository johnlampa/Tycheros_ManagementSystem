"use client";

import React, { useState } from "react"; // Make sure React is imported
import { InventoryItem } from "../../../lib/types/InventoryItemDataTypes";

import { PiCaretCircleUpFill, PiCaretCircleDownFill } from "react-icons/pi";
import { IconContext } from "react-icons";
import axios from "axios";

import { format } from "date-fns";

export type InventoryManagementCardProps = {
  inventoryItem: InventoryItem;
  handleEditItem: Function;
  handleUpdateStock: Function;

  expandedRow: number | null;
  setExpandedRow: React.Dispatch<React.SetStateAction<number | null>>;
  toggleRow: Function;

  detailedData: { [key: number]: any };
  setDetailedData: React.Dispatch<React.SetStateAction<{ [key: number]: any }>>;
};

const InventoryManagementCard: React.FC<InventoryManagementCardProps> = ({
  inventoryItem,
  handleEditItem,
  handleUpdateStock,
  expandedRow,
  setExpandedRow,
  toggleRow,
  detailedData,
  setDetailedData,
}) => {
  return (
    <>
      <div className="p-3 w-[320px] rounded-md bg-cream">
        <div className="flex justify-between">
          <div className="flex gap-x-1">
            {inventoryItem?.inventoryStatus === 1 ? (
              <div className="py-1 px-2 rounded-md bg-tealGreen w-min text-xs text-white mb-2">
                Active
              </div>
            ) : (
              <div className="py-1 px-2 rounded-md bg-red w-min text-xs text-white mb-2">
                Inactive
              </div>
            )}
            {inventoryItem?.totalQuantity < inventoryItem?.reorderPoint && (
              <div className="py-1 px-2 rounded-md bg-red text-xs text-white mb-2 w-max">
                Low stock
              </div>
            )}
          </div>
          <IconContext.Provider value={{ color: "#6C4E3D", size: "27px" }}>
            <button onClick={() => toggleRow(inventoryItem?.inventoryID)}>
              <PiCaretCircleDownFill className="text-white group-hover:text-primaryBrown transition-colors duration-300" />
            </button>
          </IconContext.Provider>
        </div>

        <div className="font-bold text-black">
          {inventoryItem?.inventoryName.toUpperCase()}
        </div>
        <div className="text-black text-sm">
          <span className="font-bold">
            {inventoryItem?.totalQuantity} {inventoryItem?.unitOfMeasure}
          </span>{" "}
          in stock
        </div>
        <div className="text-gray text-sm">
          {inventoryItem?.inventoryCategory}
        </div>
        <div className="flex justify-end gap-x-1 mt-3">
          <button
            onClick={() => {
              if (inventoryItem?.inventoryID !== null) {
                handleEditItem(inventoryItem.inventoryID); // Use the selected radio button's inventory ID
              }
            }}
            className="bg-cream border-2 border-primaryBrown text-primaryBrown py-1 px-2 text-sm rounded"
          >
            Edit Item
          </button>
          <button
            onClick={() => {
              if (inventoryItem?.inventoryID !== null) {
                handleUpdateStock(inventoryItem.inventoryID.toString()); // Use the selected radio button's inventory ID
              }
            }}
            className="bg-primaryBrown text-white py-1 px-2 text-sm rounded"
          >
            Update Stock
          </button>
        </div>

        {expandedRow === inventoryItem?.inventoryID &&
          detailedData[inventoryItem?.inventoryID] && (
            <div className="text-xs flex flex-col justify-center items-center mb-1">
              {detailedData[inventoryItem?.inventoryID] &&
              detailedData[inventoryItem?.inventoryID].length > 0 ? (
                <>
                  <div className="w-full h-[2px] bg-primaryBrown my-4"></div>
                  <strong>Stock in records:</strong>
                  <ul>
                    {detailedData[inventoryItem?.inventoryID].map(
                      (detail: any, index: number) => (
                        <li key={index} className="mt-2">
                          <strong>Subinventory ID:</strong>{" "}
                          {detail.subinventoryID} <br />
                          <strong>Qty Remaining:</strong>{" "}
                          {detail.quantityRemaining} <br />
                          <strong>Price per Unit:</strong> {detail.pricePerUnit}{" "}
                          <br />
                          <strong>Expiry Date:</strong>{" "}
                          {detail.expiryDate
                            ? format(new Date(detail.expiryDate), "yyyy-MM-dd")
                            : "N/A"}{" "}
                          <br />
                          <strong>Stock-in Date:</strong>{" "}
                          {detail.stockInDate
                            ? format(new Date(detail.stockInDate), "yyyy-MM-dd")
                            : "N/A"}{" "}
                          <br />
                          <strong>Supplier:</strong> {detail.supplierName}{" "}
                          <br />
                          <strong>Handled by:</strong> {detail.employeeName}
                        </li>
                      )
                    )}
                  </ul>
                </>
              ) : (
                <>
                  <div className="h-[2px] w-full bg-primaryBrown my-4"></div>
                  <p>No Stock Available</p>
                </>
              )}
            </div>
          )}
      </div>
    </>
  );
};

export default React.memo(InventoryManagementCard);
