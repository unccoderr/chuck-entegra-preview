import { localstorageConfig } from "../config"
import { IUser } from "../types"

export class UserController {
	get = (): IUser | null => {
		const data = localStorage.getItem(localstorageConfig.userKey)
		if (!data) return null

		return JSON.parse(data) as IUser
	}
	set = (user: IUser) => {
		localStorage.setItem(localstorageConfig.userKey, JSON.stringify(user))
	}
}