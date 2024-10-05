export type InventoryDataTypes = {
    inventoryID: number;
    inventoryName: string;
    inventoryCategory: "Produce" | "Dairy and Eggs" | "Meat and Poultry" | "Seafood" | "Canned Goods" | "Dry Goods" | "Bottled Sauces and Condiments";
    unitOfMeasure: string;
    reorderPoint: number;
}
