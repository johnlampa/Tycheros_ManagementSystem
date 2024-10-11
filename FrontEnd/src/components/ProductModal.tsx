import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "@/components/ui/Modal";
import { ProductModalProps } from "../../lib/types/props/ProductModalProps";
import {
  ProductDataTypes,
  SubitemDataTypes,
} from "../../lib/types/ProductDataTypes";
import { FaTrashAlt } from "react-icons/fa";
import React from "react";
import { useEdgeStore } from "../../lib/edgestore";
import Link from "next/link";

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
    Appetizers: 1,
    Entrees: 2,
    Snacks: 3,
    "Combo Meals": 4,
    Wings: 5,
    Salads: 6,
    "Milk Tea": 7,
    Beer: 8,
    Coffee: 9,
    Whiskey: 10,
    Frappe: 11,
    Tea: 12,
  };
  const categoryID = categoryMap[categoryName] || 0;

  const [subitems, setSubitems] = useState<SubitemDataTypes[]>([]);
  const [deletedSubitemIds, setDeletedSubitemIds] = useState<number[]>([]);

  const [file, setFile] = React.useState<File>();
  const [urls, setUrls] = useState<{
    url: string;
    thumbnailUrl: string | null;
  }>();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingMessage, setUploadingMessage] = useState<string | null>(null); // Upload message state
  const { edgestore } = useEdgeStore();

  useEffect(() => {
    if (type === "edit" && menuProductToEdit?.productID) {
      axios
        .get(
          `http://localhost:8081/menuManagement/getSpecificSubitems/${menuProductToEdit.productID}`
        )
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

  useEffect(() => {
    return () => {
      setSubitems([]);
    };
  }, [productModalIsVisible]);

  const handleAddSubitem = () => {
    setSubitems([...subitems, { inventoryID: -1, quantityNeeded: 0 }]);
  };

  const handleDeleteSubitem = (inventoryID: number) => {
    if (inventoryID === -1) {
      if (subitems.length > 0) {
        setSubitems(subitems.slice(0, -1)); // Remove last element which is an empty select option
      }
    } else {
      const updatedSubitems = subitems.filter(
        (subitem) => subitem.inventoryID !== inventoryID
      );
      setSubitems(updatedSubitems);
      setDeletedSubitemIds((prev) => [...prev, inventoryID]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // If there's a file to upload, handle the upload first
    if (file) {
      setIsUploading(true);
      setUploadingMessage("Don’t close. Uploading file...");

      try {
        const res = await edgestore.myPublicImages.upload({ file });
        setUrls({
          url: res.url,
          thumbnailUrl: res.thumbnailUrl,
        });

        console.log(res);

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());

        const updatedProduct: ProductDataTypes = {
          productName: formJson.productName as string,
          sellingPrice: parseFloat(formJson.sellingPrice as string),
          categoryID: categoryID,
          imageUrl: res.url, // Set the uploaded URL to imageUrl
          subitems: subitems.map((subitem, index) => ({
            inventoryID: parseInt(formJson[`subitem-${index}`] as string),
            quantityNeeded: parseFloat(
              formJson[`quantityNeeded-${index}`] as string
            ),
          })),
        };

        if (type === "edit" && menuProductToEdit?.productID) {
          axios
            .put(
              `http://localhost:8081/menuManagement/putProduct/${menuProductToEdit.productID}`,
              {
                ...updatedProduct,
                deletedSubitemIds,
              }
            )
            .then((response) => {
              console.log("Product updated:", updatedProduct);
              if (setMenuProductHolder) {
                setMenuProductHolder(updatedProduct);
              }
              form.reset();
              setProductModalVisibility(false); // Close modal after updating
              window.location.reload();
            })
            .catch((error) => {
              console.error("Error updating product:", error);
            });
        } else {
          axios
            .post(
              "http://localhost:8081/menuManagement/postProduct",
              updatedProduct
            )
            .then((response) => {
              console.log("Product added:", updatedProduct);
              if (setMenuProductHolder) {
                setMenuProductHolder(updatedProduct);
              }
              form.reset();
              setProductModalVisibility(false); // Close modal after adding
              window.location.reload();
            })
            .catch((error) => {
              console.error("Error adding product:", error);
            });
        }
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setIsUploading(false); // Reset upload state
        setUploadingMessage(null); // Clear upload message
      }
    }
  };

  const handleDelete = () => {
    if (menuProductToEdit?.productID) {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      );
      if (confirmDelete) {
        axios
          .delete(
            `http://localhost:8081/menuManagement/deleteProduct/${menuProductToEdit.productID}`
          )
          .then((response) => {
            console.log("Product deleted:", response.data);
            const updatedMenuData = menuData.filter(
              (product) => product.productID !== menuProductToEdit.productID
            );
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
    <Modal
      modalIsVisible={productModalIsVisible}
      setModalVisibility={setProductModalVisibility}
    >
      <form
        id="productForm"
        onSubmit={handleSubmit}
        className="w-[340px] p-6 mx-auto rounded"
      >
        <p className="text-center text-xl font-bold text-black mb-4">
          {modalTitle}
        </p>

        <div className="flex justify-between items-center mb-4 text-black">
          <label htmlFor="productName" className="pr-4">
            Product Name
          </label>
        </div>

        <input
          type="text"
          name="productName"
          id="productName"
          placeholder="Enter product name"
          className="border border-gray rounded w-full p-3 mb-4 text-black placeholder-gray"
          defaultValue={type === "edit" ? menuProductToEdit?.productName : ""}
        />

        <label htmlFor="price" className="block mb-2 text-black">
          Price
        </label>
        <input
          type="number"
          name="sellingPrice"
          id="sellingPrice"
          placeholder="Enter price"
          className="border border-gray rounded w-full p-3 mb-4 text-black placeholder-gray"
          defaultValue={type === "edit" ? menuProductToEdit?.sellingPrice : ""}
          onInput={(e) => {
            const input = e.target as HTMLInputElement;
            if (input.valueAsNumber < 0) {
              input.value = "0"; // Reset the value to 0 if negative
            }
          }}
        />

        <label className="block mb-2 text-black">Subitems</label>
        {subitems.map((subitem, index) => (
          <div
            key={subitem.inventoryID}
            className="flex justify-between items-center mb-4"
          >
            <select
              className="border border-gray rounded w-[60%] p-3 text-black mr-5 h-12"
              defaultValue={subitem.inventoryID}
              name={`subitem-${index}`}
              id={`subitem-${index}`}
            >
              <option value="">Choose</option>
              {inventoryData
                ?.filter((item) => item.inventoryCategory !== "Condiments")
                .map((item) => (
                  <option value={item.inventoryID} key={item.inventoryID}>
                    {item.inventoryName}
                  </option>
                ))}
            </select>

            <input
              type="number"
              name={`quantityNeeded-${index}`}
              id={`quantityNeeded-${index}`}
              placeholder="Quantity"
              className="border border-gray rounded w-[30%] p-3 text-black"
              defaultValue={subitem.quantityNeeded}
              min={0}
            />
            <button
              type="button"
              onClick={() => handleDeleteSubitem(subitem.inventoryID)}
              className="text-black ml-4"
            >
              <FaTrashAlt />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddSubitem}
          className="bg-black hover:bg-black text-white font-semibold py-2 px-4 rounded w-full mb-4"
        >
          + Add Subitem
        </button>

        <label htmlFor="imageUpload" className="block mb-2 text-black">
          Upload Image
        </label>
        <input
          type="file"
          onChange={(e) => {
            setFile(e.target.files?.[0]);
          }}
        />

        {/* Save button with conditional disabled state */}
        <button
          type="submit"
          className={`bg-tealGreen hover:bg-tealGreen text-white font-semibold py-2 px-4 rounded w-full ${
            isUploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isUploading}
        >
          Save
        </button>

        {type === "edit" && (
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red hover:bg-red text-white font-semibold py-2 px-4 rounded w-full mt-4"
          >
            Delete Product
          </button>
        )}

        {/* Message indicating the upload status */}
        {uploadingMessage && (
          <p className="text-black text-center mt-4">{uploadingMessage}</p>
        )}

        <div className="mt-4 text-center">
          <Link
            href="/menuManagement"
            className="bg-gray hover:bg-gray text-white font-semibold py-2 px-4 rounded"
          >
            Cancel
          </Link>
        </div>
      </form>
    </Modal>
  );
};

export default ProductModal;
