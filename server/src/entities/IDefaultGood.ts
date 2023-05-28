export interface DefaultGood {
    categoryId: string,
    name: string,
    description: string,
    imageUrl: string,
    variants: DefaultGoodVariant[],
    supplements: DefaultGoodSupplement[]
}
export interface DefaultGoodVariant {
    name: string,
    price: number,
    id: string
}
export interface DefaultGoodSupplement {
    name: string,
    price: number,
    id: string,
}