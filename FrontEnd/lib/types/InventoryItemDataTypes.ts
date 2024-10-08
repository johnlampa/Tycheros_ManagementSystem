export type InventoryItem = {
    inventoryID: number;
    inventoryName: string;
    inventoryCategory : string;
    reorderPoint: number;
    unitOfMeasure: string;
    purchaseOrderID: number;
    totalQuantity: number;
    quantityRemaining: number;
    pricePerUnit: number;
    stockInDate: string;
    expiryDate: string;
    supplierName: string;
    employeeName: string;
  }