import { useState, useEffect } from "react";
import { ProductModalProps } from "../../lib/types/ProductModalProps";
import Modal from "@/components/ui/Modal";
import { ProductDataTypes } from "../../lib/types/ProductDataTypes";

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
  const [subitems, setSubitems] = useState<[number, number][]>([]);

  useEffect(() => {
    if (type === "edit" && menuProductToEdit?.subitems) {
      setSubitems(menuProductToEdit.subitems);
    }
  }, [type, menuProductToEdit]);

  const handleAddSubitem = () => {
    setSubitems([...subitems, [0, 0]]); // Add a new subitem with default values
  };

  function handleSubmit(e: { preventDefault: () => void; target: any }) {
    e.preventDefault();
    setProductModalVisibility(false);

    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);

    if (type === "add") {
      const newProduct: ProductDataTypes = {
        productName: formJson.productName as string,
        sellingPrice: parseInt(formJson.sellingPrice as string),
        categoryName: categoryName,
        imageUrl: "/assets/images/MilkTea.jpg", // Placeholder,
        subitems: subitems.map((subitem, index) => [
          parseInt(formJson[`subitem-${index}`] as string),
          parseFloat(formJson[`quantity-${index}`] as string),
        ]) as [number, number][],
      };

      console.log("new:", newProduct);
      if (setMenuProductHolder) {
        setMenuProductHolder(newProduct);
      }
    }

    if (type === "edit") {
      const updatedProduct: ProductDataTypes = {
        productId: menuProductToEdit?.productId,
        productName: formJson.productName as string,
        sellingPrice: parseInt(formJson.sellingPrice as string),
        categoryName: categoryName,
        imageUrl: "/assets/images/MilkTea.jpg", // Placeholder
        subitems: subitems.map((subitem, index) => [
          parseInt(formJson[`subitem-${index}`] as string),
          parseFloat(formJson[`quantity-${index}`] as string),
        ]) as [number, number][],
      };

      console.log("updated:", updatedProduct);

      if (setMenuProductHolder) {
        setMenuProductHolder(updatedProduct);
      }
    }
  }

  function handleDelete() {
    const updatedMenuData = menuData.filter(
      (product) => product.productId !== menuProductToEdit?.productId
    );
    setMenuData(updatedMenuData);
    setProductModalVisibility(false);
  }

  return (
    <>
      <Modal
        productModalIsVisible={productModalIsVisible}
        setProductModalVisibility={setProductModalVisibility}
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

          <div className="min-w-min grid grid-cols-[minmax(100px, 200px) gap-3">
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
                  type === "edit" ? menuProductToEdit?.productName : undefined
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
                  type === "edit" ? menuProductToEdit?.sellingPrice : undefined
                }
              />
            </div>

            <div className="col-span-3 h-2"></div>

            <p className="col-span-3 dark:text-black">Subitems</p>
            {subitems.map((subitem, index) => (
              <div key={index} className="col-span-3 grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <select
                    className="dark:text-black border border-gray-200 rounded h-9 w-[172px] bg-white text-sm "
                    defaultValue={type === "edit" ? subitem[0] : ""}
                    name={`subitem-${index}`}
                    id={`subitem-${index}`}
                  >
                    <option value="" disabled>
                      Choose
                    </option>
                    {inventoryData?.map((item) => (
                      <option value={item.inventoryId} key={item.inventoryId}>
                        {item.inventoryName + " (" + item.unitOfMeasure + ")"}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-1">
                  <input
                    type="number"
                    name={`quantity-${index}`}
                    id={`quantity-${index}`}
                    placeholder="Quantity"
                    className="dark:text-black border border-gray-200 rounded p-1 w-[80px]"
                    defaultValue={subitem[1]}
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
