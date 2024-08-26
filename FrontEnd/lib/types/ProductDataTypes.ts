// ProductDataTypes.ts
export type SubitemDataTypes = {
  inventoryID: number;
  quantityNeeded: number;
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
