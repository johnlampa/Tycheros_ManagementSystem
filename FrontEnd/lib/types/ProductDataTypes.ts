export type ProductDataTypes = {
    productID?: number,
    productName: string,
    categoryName?: string,
    categoryId?: number,
    sellingPrice: number,
    imageUrl: string,
    subitems?: [number, number][] //[inventoryId, quantityNeeded]
}