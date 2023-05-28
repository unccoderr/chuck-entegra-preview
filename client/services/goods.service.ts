import { localstorageConfig } from "../config"
import { ICartSupplements, IGood } from "../types"

const cartKey = localstorageConfig.cartKey

export class GoodsService {
	getCartSupplements = (good: IGood) => {
		let cartSupplements: ICartSupplements = {}
		good.supplements.forEach(i => {
			cartSupplements[i.id] = 0
		})

		return cartSupplements
	}

}