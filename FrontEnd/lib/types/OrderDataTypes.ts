export type OrderItemDataTypes = {
    productID: number,
    quantity: number
}

export type Order = {
    orderID?: number,
    paymentID?: number,
    employeeID: number,
    date: string,
    status: "unpaid" | "pending" | "completed",
    amount?: number
    orderItems?: OrderItemDataTypes[]
}