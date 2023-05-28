import { DefaultCategory, DefaultGood } from "../../entities"

export interface EntegraMenu {
	lastUpdatedAt: string,
	menuItems: {
		categories: DefaultCategory[],
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
		categories: DefaultCategory[],
		goods: DefaultGood[]
	}
}