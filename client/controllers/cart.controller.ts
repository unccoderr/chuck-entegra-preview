import { CartService } from "../services"
import { GoodsController } from "./goods.controller"

import { ICartItem, Menu, IGood, ICartVariant, IGoodSupplement, IGoodVariant } from "../types"

interface ICartGoodItemSupplement extends IGoodSupplement {
	quantity: number
}
interface ICartGoodItemVariant extends IGoodVariant {
	quantity: number,
	supplements: ICartGoodItemSupplement[],
}
export interface ICartGoodItem {
	name: string,
	description: string,
	categoryId: string,
	imageUrl: string,
	variants: ICartGoodItemVariant[],
}
const cartService = new CartService()

export class CartController {
	_menu: Menu | null
	constructor(menu: Menu | null) {
		this._menu = menu
	}

	Cart = () => {
		const goodsController = new GoodsController(this._menu)

		class Cart {
			get = () => {
				return cartService.getCart()
			}

			Good = (good: IGood) => {
				return new CartGood(good, goodsController)
			}

			getGoodsList = () => {
				const cart = cartService.getCart()
				let cartGoods: ICartGoodItem[] = []

				for (const goodId in cart) {
					const cartItem = cart[goodId]
					const good = goodsController.findByVariantId(cartItem[0].id)
					if (good) {
						let currentCartGood: ICartGoodItem = {
							name: good.name,
							description: good.description,
							categoryId: good.categoryId,
							imageUrl: good.imageUrl,
							variants: []
						}
						cartItem.forEach(variant => {
							const variantData = good?.variants.find(i => i.id === variant.id)
							if (!variantData) return

							let supplements: ICartGoodItemSupplement[] = []
							for (const supplement of good.supplements) {
								const supplementData = good.supplements.find(i => i.id === supplement.id)
								const hasVariants = !!variant.supplements[supplement.id]
								if (supplementData && hasVariants) {
									supplements.push({
										...supplementData,
										quantity: variant.supplements[supplement.id]
									})
								}
							}
							//console.log(supplements)
							currentCartGood.variants.push({
								...variantData,
								quantity: variant.quantity,
								supplements
							})
						})
						cartGoods.push(currentCartGood)
					}
				}
				return cartGoods
			}

			getTotalPrice = () => {
				const cart = cartService.getCart()
				let totalPrice = 0

				for (const goodId in cart) {
					const good = cart[goodId]
					good.forEach(variant => {
						const goodData = goodsController.findByVariantId(variant.id)
						const variantData = goodData?.variants.find(i => i.id === variant.id)
						if (goodData && variantData) {
							totalPrice += variant.quantity * variantData.price
							for (const supplementsId in variant.supplements) {
								const supplementData = goodsController.findByVariantId(supplementsId)
								if (supplementData) {
									/*variant.supplements[supplementsId]*/
									totalPrice += variant.quantity * supplementData.variants[0].price
								}
							}
						}

					})
				}
				return totalPrice
			}
			getTotalQuantity = () => {
				const cart = cartService.getCart()
				let totalQuantity = 0

				for (const goodId in cart) {
					const good = cart[goodId]
					good.forEach(variant => {
						totalQuantity += variant.quantity
					})
				}
				return totalQuantity
			}
			getTotalQuantityByCategory = (categoryId: string) => {
				const cart = cartService.getCart()
				let totalQuantity = 0

				for (const goodId in cart) {
					const cartItem = cart[goodId]
					cartItem.forEach(variant => {
						const good = goodsController.findByVariantId(variant.id)
						if (good && good.categoryId === categoryId) {
							totalQuantity += variant.quantity
						}
					})
				}
				return totalQuantity
			}
		}

		return new Cart()
	}
}

class CartGood {
	_cartItemId: string
	_goodData: IGood
	_goodsController: GoodsController

	constructor(good: IGood, goodsController: GoodsController) {
		this._goodsController = goodsController
		this._cartItemId = good ? good.name : ''
		this._goodData = good || {
			categoryId: '',
			name: '',
			description: '',
			imageUrl: '',
			variants: [],
			supplements: [],
		}
	}

	has = (): boolean => {
		const cart = cartService.getCart()
		if (!cart) return false

		return !!cart[this._cartItemId]
	}
	hasVariant = (variantId: number): boolean => {
		if (!this.has()) return false

		const cart = cartService.getCart()
		const cartItem = cart[this._cartItemId]
		const goodVariant = this._goodData.variants[variantId]

		const cartVariantId = cartItem.findIndex(i => i.id === goodVariant.id)
		return cartVariantId !== -1
	}

	get = (): ICartItem | null => {
		if (!this.has()) return null

		const cart = cartService.getCart()
		return cart[this._cartItemId]
	}
	getVariant = (variantId: number): ICartVariant | null => {
		if (!this.hasVariant(variantId)) return null
		const cart = cartService.getCart()
		return cart[this._cartItemId][variantId]
	}

	increment = (amount: number = 1, variantId: number, supplementIds: string[] = []) => {
		if (this._goodData.variants.length === 0) return

		const cart = cartService.getCart()
		const cartItem = cart[this._cartItemId]
		const goodVariantId = this._goodData.variants[variantId].id
		const supplements: { [key: string]: number } = {}

		supplementIds.forEach(id => supplements[id] = 1)

		if (cartItem) {
			const cartVariantId = cartItem.findIndex(i => i.id === goodVariantId)

			if (cartVariantId !== -1) {
				//console.log(`increment ${cartVariantId}`)
				cartItem[cartVariantId] = {
					...cartItem[cartVariantId],
					quantity: cartItem[cartVariantId].quantity + amount
				}
			} else {
				//console.log(`add ${cartItem.length - 1}`)
				cartItem.push({
					id: goodVariantId,
					supplements: supplements,
					quantity: amount
				})
			}
			cart[this._cartItemId] = cartItem
		} else {
			//console.log(`new ${this._cartItemId} with 0`)
			cart[this._cartItemId] = [
				{
					id: goodVariantId,
					supplements: supplements,
					quantity: amount
				}
			]
		}
		cartService.updateCart(cart)
	}
	decrement = (amount: number = 1, variantId: number) => {
		if (!this.has()) return
		if (this._goodData.variants.length === 0) return

		const cart = cartService.getCart()

		let cartItem = cart[this._cartItemId]
		const goodVariantId = this._goodData.variants[variantId].id
		const cartVariantId = cartItem.findIndex(i => i.id === goodVariantId)
		const cartVariant = cartItem[cartVariantId]

		if (!goodVariantId || cartVariantId === -1 || !cartVariant) return


		if (cartVariant.quantity - amount <= 0) {

			if (cartItem.length === 1) {
				//console.log(`delete ${this._cartItemId}`)
				delete cart[this._cartItemId]
			} else  {
				//console.log(`delete ${cartVariantId}`)
				cartItem.splice(cartVariantId, 1)
				cart[this._cartItemId] = cartItem
				//console.log(cart[this._cartItemId])
			}
		} else {
			//console.log(`decrement ${cartVariantId}`)
			cartItem[cartVariantId] = {
				...cartVariant,
				quantity: cartVariant.quantity - amount
			}
			cart[this._cartItemId] = cartItem
		}

		cartService.updateCart(cart)
	}

	hasSupplement = (variantId: number, supplementId: string) => {
		if (!this.has()) return false
		const cart = cartService.getCart()
		const cartItem = cart[this._cartItemId]
		const goodVariant = this._goodData.variants[variantId]
		const cartVariantId = cartItem.findIndex(i => i.id === goodVariant.id)

		if (cartVariantId === -1) return false

		return !!cartItem[cartVariantId].supplements[supplementId]
	}
	getSupplementQuantity = (variantId: number, supplementId: string): number => {
		if (!this.has()) return 0
		const cart = cartService.getCart()
		const cartItem = cart[this._cartItemId]

		const goodVariant = this._goodData.variants[variantId]
		const cartVariantId = cartItem.findIndex(i => i.id === goodVariant.id)


		if (cartVariantId === -1
			|| !cartItem[cartVariantId]
			|| !cartItem[cartVariantId].supplements[supplementId]) return 0

		return cartItem[cartVariantId].supplements[supplementId]
	}
	incrementSupplement = (amount: number = 1, variantId: number, supplementId: string) => {
		if (!this.has()) return
		const cart = cartService.getCart()
		let cartItem = cart[this._cartItemId]

		const goodVariant = this._goodData.variants[variantId]
		const cartVariantId = cartItem.findIndex(i => i.id === goodVariant.id)

		if (cartVariantId === -1) return

		const cartItemSupplements = cartItem[cartVariantId].supplements
		const currentSupplement = cartItemSupplements[supplementId]

		if (!currentSupplement) {
			cartItemSupplements[supplementId] = amount
		} else {
			cartItemSupplements[supplementId] = currentSupplement + amount
		}
		cartItem[cartVariantId].supplements = cartItemSupplements

		cart[this._cartItemId] = cartItem
		cartService.updateCart(cart)
	}
	decrementSupplement = (amount: number = 1, variantId: number, supplementId: string) => {
		if (!this.has()) return
		const cart = cartService.getCart()
		const cartItem = cart[this._cartItemId]

		const goodVariant = this._goodData.variants[variantId]
		const cartVariantId = cartItem.findIndex(i => i.id === goodVariant.id)

		if (cartVariantId === -1) return

		const cartItemSupplements = cartItem[cartVariantId].supplements
		const currentSupplement = cartItemSupplements[supplementId]
		if (!currentSupplement) return

		if (currentSupplement - amount <= 0) {
			delete cartItemSupplements[supplementId]
		} else {
			cartItemSupplements[supplementId] = currentSupplement - amount
		}

		cartItem[cartVariantId].supplements = cartItemSupplements
		cart[this._cartItemId] = cartItem
		cartService.updateCart(cart)
	}
	toggleSupplement = (variantId: number, supplementId: string) => {
		const hasSupplement = this.hasSupplement(variantId, supplementId)
		if (!hasSupplement) {
			this.incrementSupplement(1, variantId, supplementId)
		} else {
			this.decrementSupplement(1, variantId, supplementId)
		}
	}
	getPrice = (variantId: number): number => {
		if (!this.has()) return 0

		const cart = cartService.getCart()
		const cartItem = cart[this._cartItemId]

		const goodVariant = this._goodData.variants[variantId]
		const cartVariantId = cartItem.findIndex(i => i.id === goodVariant.id)
		if (cartVariantId === -1) return 0

		const cartItemVariant = cartItem[cartVariantId]
		let price = 0
		if (!cartItemVariant) return 0

		price += cartItemVariant.quantity * goodVariant.price
		for (let variantSupplementId in cartItemVariant.supplements) {
			const supplementData = this._goodData.supplements.find(i => i.id === variantSupplementId)
			if (supplementData) {
				price += supplementData.price * cartItemVariant.quantity//cartItemVariant.supplements[variantSupplementId]
			}
		}
		return price
	}
	getTotalPrice = (): number => {
		if (!this.has()) return 0

		const cart = cartService.getCart()
		const cartItem = cart[this._cartItemId]

		let totalPrice = 0
		this._goodData.variants.map(variant => {
			const cartVariant = cartItem.find(i => i.id === variant.id)
			const variantData = this._goodData.variants.find(i => i.id === variant.id)

			if (cartVariant && variantData) {
				totalPrice += cartVariant.quantity * variantData.price
				for (let variantSupplementId in cartVariant.supplements) {
					const supplementData = this._goodData.supplements.find(i => i.id === variantSupplementId)
					if (supplementData) {
						totalPrice += supplementData.price * cartVariant.quantity//cartVariant.supplements[variantSupplementId]
					}
				}
			}
		})

		return totalPrice
	}

	getQuantity = (variantId: number): number => {
		if (!this.has()) return 0

		const cart = cartService.getCart()
		const cartItem = cart[this._cartItemId]
		const goodVariantId = this._goodData.variants[variantId].id

		const cartVariant = cartItem.find(i => i.id === goodVariantId)
		if (!cartVariant) return 0

		return cartVariant.quantity
	}
	getQuantityByCategory = (categoryId: string): number => {
		if (!this.has()) return 0
		const cart = cartService.getCart()
		const cartItem = cart[this._cartItemId]

		let totalQuantity = 0
		cartItem.forEach(variant => {
			if (this._goodData.categoryId === categoryId) {
				totalQuantity += variant.quantity
			}
		})

		return totalQuantity
	}
	getTotalQuantity = (): number => {
		if (!this.has()) return 0

		const cart = cartService.getCart()
		const cartItem = cart[this._cartItemId]

		let totalQuantity = 0
		this._goodData.variants.map(variant => {
			const cartVariant = cartItem.find(i => i.id === variant.id)
			if (cartVariant) {
				totalQuantity += cartVariant.quantity
			}
		})

		return totalQuantity
	}
}

