import { ModalProps } from "../../lib/types/ModalProps";
import Modal from "@/components/ui/Modal";

const ProductModal: React.FC<ModalProps> = ({
  productModalIsVisible,
  setProductModalVisibility,
  modalTitle,
  menuData,
  setMenuData,
  categoryName,
  inventoryData,
  setInventoryData,
  type,
  menuProductToEdit,
}) => {
  return (
    <>
      <Modal
        productModalIsVisible={productModalIsVisible}
        setProductModalVisibility={setProductModalVisibility}
        modalTitle={modalTitle}
      >
        <form className="">
          <div className="min-w-min grid grid-cols-[minmax(100px, 200px) gap-3">
            <div className="col-span-3">
              <label htmlFor="productName" className="block">
                Product Name
              </label>
              <input
                type="text"
                name="productName"
                id="productName"
                placeholder="Enter sumn"
                className="dark:text-black border border-gray-200 rounded p-1"
                value={
                  type === "edit" ? menuProductToEdit?.productName : undefined
                }
              />
            </div>
            <div className="col-span-3">
              <label htmlFor="price" className="block">
                Price
              </label>
              <input
                type="number"
                name="price"
                id="price"
                placeholder="Enter sumn"
                className="dark:text-black border border-gray-200 rounded p-1"
                value={
                  type === "edit" ? menuProductToEdit?.sellingPrice : undefined
                }
              />
            </div>
            <div className="col-span-3 h-2"></div>
            <p className="col-span-3">Subitems</p>

            {type === "edit" &&
              menuProductToEdit?.subitems?.map((subitem, index) => (
                <div key={index} className="col-span-3 grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <select
                      className="dark:text-black border border-gray-200 rounded p-1"
                      defaultValue={subitem[0]} // set the default selected option to the inventoryId
                    >
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
                      className="dark:text-black border border-gray-200 rounded p-1 w-24"
                      defaultValue={subitem[1]} // set the default value to the quantity needed
                    />
                  </div>
                </div>
              ))}

            {/* {type === "add" && (
              <div className="col-span-3 grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <select className="dark:text-black border border-gray-200 rounded p-1">
                    {inventoryData?.map((item, index) => (
                      <option value={item.inventoryId} key={index}>
                        {item.inventoryName + " (" + item.unitOfMeasure + ")"}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-1">
                  <input
                    type="number"
                    name="quantity"
                    id="quantity"
                    placeholder="Quantity"
                    className="dark:text-black border border-gray-200 rounded p-1 w-24"
                  />
                </div>
              </div>
            )} */}
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ProductModal;
