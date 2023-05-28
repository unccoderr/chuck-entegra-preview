import { Model } from "sequelize"
export interface IDefaultModel {
	id: number,
}
export type ModelInstance<T> = Model<T, Omit<T, 'id'>>