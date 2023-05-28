import { IGoodSupplement } from "./IGoodSupplement"
import { IGoodVariant } from "./IGoodVariant"

export interface IGood {
	categoryId: string,
	name: string,
	description: string,
	imageUrl: string,
	variants: IGoodVariant[],
	supplements: IGoodSupplement[]
}