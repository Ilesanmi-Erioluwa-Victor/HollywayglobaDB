interface DocumentResult<T> {
    _doc : T
}

export interface cartItemTypes extends DocumentResult<cartItemTypes> {
    productId: object;
    userId : object;
    productCount: number;
    totalAmount : number
}
