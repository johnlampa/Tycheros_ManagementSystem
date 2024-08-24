export type ProductDataTypes = {
    productId: number,
    productName: string,
    categoryName?: string,
    sellingPrice: number,
    imageUrl: string,
    subitems?: [number, number][] //[inventoryId, quantityNeeded]
}