export type OrderItemDataTypes = {
    productID: number,
    quantity: number
}

export type Order = {
    orderId?: number,
    paymentId?: number,
    employeeId: number,
    date: string,
    status: "unpaid" | "pending" | "completed",
    amount?: number
    orderItems?: OrderItemDataTypes[]
}