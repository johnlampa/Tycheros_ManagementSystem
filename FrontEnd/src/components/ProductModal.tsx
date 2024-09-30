import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "@/components/ui/Modal";
import { ProductModalProps } from "../../lib/types/props/ProductModalProps";
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
  const categoryID = categoryMap[categoryName] || 0;

  const [subitems, setSubitems] = useState<SubitemDataTypes[]>([]);

  useEffect(() => {
    if (type === "edit" && menuProductToEdit?.productID) {
      axios
        .get(`http://localhost:8081/menuManagement/getSpecificSubitems/${menuProductToEdit.productID}`)
        .then((response) => {
          setSubitems(response.data);
        })
        .catch((error) => {
          console.error("Error fetching subitems:", error);
        });
    } else if (type === "add") {
      setSubitems([]);
    }
  }, [type, menuProductToEdit]);

  // Reset subitems when the modal is closed
  useEffect(() => {
    return () => {
      setSubitems([]);
    };
  }, [productModalIsVisible]);

  const handleAddSubitem = () => {
    setSubitems([...subitems, { inventoryID: 0, quantityNeeded: 0 }]);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProductModalVisibility(false);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());

    const updatedProduct: ProductDataTypes = {
      productName: formJson.productName as string,
      sellingPrice: parseFloat(formJson.sellingPrice as string),
      categoryID: categoryID,
      imageUrl: "/assets/images/MilkTea.jpg",
      subitems: subitems.map((subitem, index) => ({
        inventoryID: parseInt(formJson[`subitem-${index}`] as string),
        quantityNeeded: parseFloat(formJson[`quantityNeeded-${index}`] as string),
      })),
    };

    if (type === "edit" && menuProductToEdit?.productID) {
      axios
        .put(`http://localhost:8081/menuManagement/putProduct/${menuProductToEdit.productID}`, updatedProduct)
        .then((response) => {
          console.log("Product updated:", updatedProduct);
          if (setMenuProductHolder) {
            setMenuProductHolder(updatedProduct);
          }
          form.reset();
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error updating product:", error);
        });
    } else {
      axios
        .post("http://localhost:8081/menuManagement/postProduct", updatedProduct)
        .then((response) => {
          console.log("Product added:", updatedProduct);
          if (setMenuProductHolder) {
            setMenuProductHolder(updatedProduct);
          }
          form.reset();
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error adding product:", error);
        });
    }
  };

  const handleDelete = () => {
    if (menuProductToEdit?.productID) {
      const confirmDelete = window.confirm("Are you sure you want to delete this product? This action cannot be undone.");
      if (confirmDelete) {
        axios
          .delete(`http://localhost:8081/menuManagement/deleteProduct/${menuProductToEdit.productID}`)
          .then((response) => {
            console.log("Product deleted:", response.data);
            const updatedMenuData = menuData.filter((product) => product.productID !== menuProductToEdit.productID);
            setMenuData(updatedMenuData);
            setProductModalVisibility(false);
          })
          .catch((error) => {
            console.error("Error deleting product:", error);
          });
      }
    }
  };

  return (
    <Modal modalIsVisible={productModalIsVisible} setModalVisibility={setProductModalVisibility}>
      <form id="productForm" onSubmit={handleSubmit} className="w-[340px] p-6 mx-auto"> {/* Added padding to the form */}
        <p className="text-center text-xl font-bold text-black mb-4">{modalTitle}</p>

        <div className="flex justify-between items-center mb-4 text-black">
          <label htmlFor="productName" className="pr-4"> {/* Padding added to label */}
            Product Name
          </label>
          <button type="button" className="px-4 py-2 bg-gray-300">Insert Image</button>
        </div>

        <input
          type="text"
          name="productName"
          id="productName"
          placeholder="Enter product name"
          className="border border-gray-300 rounded w-full p-3 mb-4 text-black placeholder-gray-400"
          defaultValue={type === "edit" ? menuProductToEdit?.productName : ""}
        />

        <label htmlFor="price" className="block mb-2 text-black">Price</label>
        <input
          type="number"
          name="sellingPrice"
          id="sellingPrice"
          placeholder="Enter price"
          className="border border-gray-300 rounded w-full p-3 mb-4 text-black placeholder-gray-400"
          defaultValue={type === "edit" ? menuProductToEdit?.sellingPrice : ""}
        />

        <label className="block mb-2 text-black">Subitems</label>
        {subitems.map((subitem, index) => (
          <div key={index} className="flex justify-between items-center mb-4">
            <select
              className="border border-gray-300 rounded w-[60%] p-3 text-black" 
              defaultValue={subitem.inventoryID}
              name={`subitem-${index}`}
              id={`subitem-${index}`}
            >
              <option value="" disabled>Choose</option>
              {inventoryData?.map((item) => (
                <option value={item.inventoryID} key={item.inventoryID}>
                  {item.inventoryName} ({item.unitOfMeasure})
                </option>
              ))}
            </select>

            <input
              type="number"
              name={`quantityNeeded-${index}`}
              id={`quantityNeeded-${index}`}
              placeholder="Quantity"
              className="border border-gray-300 rounded w-[30%] p-3 text-black placeholder-gray-400"
              defaultValue={subitem.quantityNeeded}
            />
          </div>
        ))}

        <button type="button" onClick={handleAddSubitem} className="border border-black rounded px-4 py-2 w-full mb-4 text-black">
          Add Subitem
        </button>
      
        {type === "edit" && (
            <button
              onClick={handleDelete}
              className="border border-black px-1 py-2 rounded bg-red-400 text-black hover:bg-red-500 mb-4" 
            >
              Remove Product
            </button>
          )}

        <div className="flex justify-between">
          <button
            type="submit"
            className="border border-black px-6 py-3 rounded bg-gray-300 hover:bg-gray-400 text-black" 
          >
            Save
          </button>

          <button
            onClick={() => setProductModalVisibility(false)}
            className="border border-black px-6 py-3 rounded bg-gray-300 hover:bg-gray-400 text-black" 
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductModal;
