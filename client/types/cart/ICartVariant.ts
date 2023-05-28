import { ICartSupplements } from "./ICartSupplements"

export interface ICartVariant {
	id: string,
	quantity: number,
	supplements: ICartSupplements
}