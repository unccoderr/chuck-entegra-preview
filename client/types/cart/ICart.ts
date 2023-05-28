import { ICartItem } from "./ICartItem"

export interface ICart {
	[id: string]: ICartItem
}