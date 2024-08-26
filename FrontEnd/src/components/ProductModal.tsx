import { useState, useEffect } from "react";
import axios from "axios";
import { ProductModalProps } from "../../lib/types/props/ProductModalProps";
import Modal from "@/components/ui/Modal";
import { ProductDataTypes, SubitemDataTypes } from "../../lib/types/ProductDataTypes";

const ProductModal: React.FC<ProductModalProps> = ({
  productModalIsVisible,
  setProductModalVisibility,
  modalTitle,
  setMenuProductHolder,
  inventoryData,
  type,
  menuProductToEdit,
  categoryName,
  menuData,
  setMenuData,
}) => {


  // Define categoryMap with string index signature
  const categoryMap: { [key: string]: number } = {
    "Appetizers": 1,
    "Entrees": 2,
    "Snacks": 3,
    "Combo Meals": 4,
    "Wings": 5,
    "Salads": 6,
    "Milk Tea": 7,
    "Beer": 8,
    "Coffee": 9,
    "Whiskey": 10,
    "Frappe": 11,
    "Tea": 12,
  };

  const categoryID = categoryMap[categoryName] || 0; // Default to 0 if categoryName is not found


  const [subitems, setSubitems] = useState<SubitemDataTypes[]>([]);
  
  useEffect(() => {
    if (type === "edit" && menuProductToEdit?.subitems) {
      setSubitems(menuProductToEdit.subitems);
    }
  }, [type, menuProductToEdit]);  

  const handleAddSubitem = () => {
    setSubitems([...subitems, { inventoryID: 0, quantityNeeded: 0 }]);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProductModalVisibility(false);
  
    const form = e.currentTarget;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
  
    const newProduct: ProductDataTypes = {
      productName: formJson.productName as string,
      sellingPrice: parseFloat(formJson.sellingPrice as string),
      categoryID: categoryID, // categoryID should be a number
      imageUrl: "/assets/images/MilkTea.jpg", // Placeholder image URL
      subitems: subitems.map((subitem, index) => ({
        inventoryID: parseInt(formJson[`subitem-${index}`] as string),
        quantityNeeded: parseFloat(formJson[`quantityNeeded-${index}`] as string),
      })),
    };
  
    axios
      .post("http://localhost:8081/menuManagement/postProduct", newProduct)
      .then((response) => {
        console.log("Product added:", response.data);
        console.log("Added: ", newProduct);
        form.reset(); // Optional: Clear the form after submission
        // window.location.reload();
      })
      .catch((error) => {
        console.error("Error adding product:", error);
      });
  
    if (setMenuProductHolder) {
      setMenuProductHolder(newProduct);
    }
  };

  const handleDelete = () => {
    const updatedMenuData = menuData.filter(
      (product) => product.productID !== menuProductToEdit?.productID
    );
    setMenuData(updatedMenuData);
    setProductModalVisibility(false);
  };
  
  return (
    <>
      <Modal
        modalIsVisible={productModalIsVisible}
        setModalVisibility={setProductModalVisibility}
      >
        <form id="productForm" onSubmit={handleSubmit}>
          <p className="text-black dark:text-black flex justify-center items-center mb-4 text-xl font-bold">
            {modalTitle}
          </p>
          <div className="absolute bottom-6 right-6 flex flex-col gap-y-2">
            <button
              type="submit"
              className="px-5 rounded-lg border border-black text-gray-400 text-sm bg-white hover:bg-gray-50 hover:text-gray-600"
            >
              Save
            </button>
            <button
              onClick={() => {
                setProductModalVisibility(false);
              }}
              className="px-5 rounded-lg border border-black text-gray-400 text-sm bg-white hover:bg-gray-50 hover:text-gray-600"
            >
              Cancel
            </button>
          </div>

          {type === "edit" && (
            <div className="absolute bottom-6 left-6">
              <button
                onClick={handleDelete}
                className="px-3 rounded-lg border border-black text-black text-sm bg-red-400 hover:bg-white hover:text-red-400"
              >
                Remove Product
              </button>
            </div>
          )}

          <div className="min-w-min grid grid-cols-[minmax(100px, 200px)] gap-3">
            <div className="col-span-3">
              <label htmlFor="productName" className="block dark:text-black">
                Product Name
              </label>
              <input
                type="text"
                name="productName"
                id="productName"
                placeholder="Enter sumn"
                className="dark:text-black border border-gray-200 rounded p-1 w-[264px]"
                defaultValue={
                  type === "edit" ? menuProductToEdit?.productName : ""
                }
              />
            </div>

            <div className="col-span-3">
              <label htmlFor="price" className="block dark:text-black">
                Price
              </label>
              <input
                type="number"
                name="sellingPrice"
                id="sellingPrice"
                placeholder="Enter sumn"
                className="dark:text-black border border-gray-200 rounded p-1 w-[264px]"
                defaultValue={
                  type === "edit" ? menuProductToEdit?.sellingPrice : ""
                }
              />
            </div>

            <div className="col-span-3 h-2"></div>

            <p className="col-span-3 dark:text-black">Subitems</p>
              {subitems.map((subitem, index) => (
                <div key={index} className="col-span-3 grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <select
                      className="dark:text-black border border-gray-200 rounded h-9 w-[172px] bg-white text-sm"
                      defaultValue={type === "edit" ? subitem.inventoryID : ""}
                      name={`subitem-${index}`}
                      id={`subitem-${index}`}
                    >
                      <option value="" disabled>
                        Choose
                      </option>
                      {inventoryData?.map((item) => (
                        <option value={item.inventoryID} key={item.inventoryID}>
                          {item.inventoryName + " (" + item.unitOfMeasure + ")"}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-1">
                    <input
                      type="number"
                      name={`quantityNeeded-${index}`}
                      id={`quantityNeeded-${index}`}
                      placeholder="Quantity Needed"
                      className="dark:text-black border border-gray-200 rounded p-1 w-[80px]"
                      defaultValue={subitem.quantityNeeded}
                    />
                  </div>
                </div>
              ))}

            <button
              type="button"
              onClick={handleAddSubitem}
              className="col-span-3 mt-2 px-3 py-1 rounded-lg border border-black text-gray-400 bg-white hover:bg-gray-50 hover:text-gray-600"
            >
              Add Subitem
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ProductModal;
