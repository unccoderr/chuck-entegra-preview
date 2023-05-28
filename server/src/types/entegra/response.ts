import { Menu } from "./"

export enum DefaultResponseStatus {
	SUCCESS = 'SUCCESS',
	BAD_REQUEST = 'BAD_REQUEST',
	SERVER_ERROR = 'SERVER_ERROR'
}
export interface DefaultResponse {
	data: null,
	message: string,
	status: DefaultResponseStatus
}


export interface IntervalsResponse extends Omit<DefaultResponse, 'data'> {
	deliveryParameters: {
		id: string,
		tax: number,
		deliveryCost: number,
		minimumAmount: number,
		deliveryFree: number
	},
	intervals: {
		id: string,
		name: string,
		deliveryTime: number,
		pickupTime: number,
		ordersAvailable: number
	}[]
}

export interface OrderResponse extends Omit<DefaultResponse, 'data'>{
	data: {
		id: string,
		status: string,
		shortCode: string,
		pinCode: string,
		rejectingReason?: {
			code: string,
			message: string
		}
	} | null
}