export type Payment = {
    paymentID?: number,
    amount: number,
    method: string,
    referenceNumber: string,
    discount: string,
    discountAmount: number
}