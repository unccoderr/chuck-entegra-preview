import { localstorageConfig } from "../config"
import { ICart } from "../types"

const cartKey = localstorageConfig.cartKey

export class CartService {
	updateCart = (cart: ICart) => localStorage.setItem(cartKey, JSON.stringify(cart))
	getCart = (): ICart => {
		const cartData = localStorage.getItem(cartKey)
		if (!cartData) return {}
		return JSON.parse(cartData)
	}


}