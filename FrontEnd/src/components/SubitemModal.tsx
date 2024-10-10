import React from "react";

interface SubitemModalProps {
  modalTitle: string;
  subitemData: {
    inventoryName: string;
    inventoryCategory: string;  
    reorderPoint: number;
    unitOfMeasure: string;
  };
  setSubitemData: (newData: any) => void;
  onSave: () => void;
  onCancel: () => void;
}

const SubitemModal: React.FC<SubitemModalProps> = ({
  modalTitle,
  subitemData,
  setSubitemData,
  onSave,
  onCancel,
}) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg w-72">
        <h2 className="text-black">{modalTitle}</h2>
        <div>
          <input
            type="text"
            placeholder="Inventory Name"
            value={subitemData.inventoryName}
            onChange={(e) =>
              setSubitemData({ ...subitemData, inventoryName: e.target.value })
            }
            className="mb-2 p-2 w-full text-black"
          />
          <select
            value={subitemData.inventoryCategory}
            onChange={(e) =>
              setSubitemData({
                ...subitemData,
                inventoryCategory: e.target.value,
              })
            }
            className="mb-2 p-2 w-full text-black"
          >
            <option value="" disabled>Select Inventory Category</option>
            <option value="Produce">Produce</option>
            <option value="Dairy and Eggs">Dairy and Eggs</option>
            <option value="Meat and Poultry">Meat and Poultry</option>
            <option value="Seafood">Seafood</option>
            <option value="Canned Goods">Canned Goods</option>
            <option value="Dry Goods">Dry Goods</option>
            <option value="Sauces">Sauces</option>
            <option value="Condiments">Condiments</option>
            <option value="Beverages">Beverages</option>
          </select>
          <input
            type="number"
            placeholder="Reorder Point"
            value={subitemData.reorderPoint === 0 ? "" : subitemData.reorderPoint}
            onChange={(e) =>
              setSubitemData({
                ...subitemData,
                reorderPoint:
                  e.target.value === "" ? 0 : Number(e.target.value),
              })
            }
            className="mb-2 p-2 w-full text-black"
            min="0"
          />

          <input
            type="text"
            placeholder="Unit of Measure"
            value={subitemData.unitOfMeasure}
            onChange={(e) =>
              setSubitemData({ ...subitemData, unitOfMeasure: e.target.value })
            }
            className="mb-2 p-2 w-full text-black"
          />

          <div className="flex justify-between">
            <button
              onClick={onSave}
              className="bg-black text-white py-2 px-4 rounded cursor-pointer"
            >
              Save
            </button>
            <button
              onClick={onCancel}
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

export default SubitemModal;
