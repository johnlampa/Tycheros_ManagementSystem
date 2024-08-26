export type OrderItemDataTypes = {
    productID: number,
    quantity: number
}

export type Order = {
    orderID?: number,
    paymentID?: number,
    employeeID: number,
    date: string,
    status: "Unpaid" | "Pending" | "Completed",
    amount?: number
    orderItems?: OrderItemDataTypes[]
}