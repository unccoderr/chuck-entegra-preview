import { localstorageConfig } from "../config"

export class OrderingService {
	setFirstOrder = () => {
		localStorage.setItem(localstorageConfig.firstOrderKey, 'was')
	}
	isFirstOrder = () => {
		return !localStorage.getItem(localstorageConfig.firstOrderKey)
	}
}