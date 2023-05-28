import { IGood } from "./IGood"
import { IGoodCategory } from "./IGoodCategory";

export interface IMenu {
	lastUpdatedAt: string,
	menuItems: {
		categories: IGoodCategory[],
		goods: IGood[]
	}
}