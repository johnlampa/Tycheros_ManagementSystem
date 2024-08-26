export type Order = {
    orderId?: number,
    paymentId?: number,
    employeeId: number,
    date: string,
    status: "unpaid" | "pending" | "completed",
    amount?: number
    orderItems?: [number, number][] //[productId, quantity]
}