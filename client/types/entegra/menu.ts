import { IGood } from "../good"

export interface EntegraMenu {
	lastUpdatedAt: string,
	menuItems: {
		categories: {
			id: string,
			parentId: string,
			name: string
		}[],
		products: {
			id: string,
			categoryId: string,
			name: string,
			description: string,
			price: number,
			imageUrl: string,
		}[]
	}
}
export interface Menu {
	lastUpdatedAt: string,
	menuItems: {
		categories: {
			id: string,
			parentId: string,
			name: string
		}[],
		goods: IGood[]
	}
}