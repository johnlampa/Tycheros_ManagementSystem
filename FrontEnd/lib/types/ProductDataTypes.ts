// ProductDataTypes.ts
export type SubitemDataTypes = {
  productID: number;
  inventoryID: number;
  quantityNeeded: number;
  subinventoryID: number; // Added
  quantityRemaining: number; // Added
  expiryDate: string; // Added
};

export type ProductDataTypes = {
  productID?: number;
  productName: string;
  categoryName?: string;
  categoryID?: number;
  sellingPrice: number;
  imageUrl: string;
  subitems?: SubitemDataTypes[];
};
