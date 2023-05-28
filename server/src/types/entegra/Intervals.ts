export interface Intervals {
	deliveryParameters: {
		id: string,
		tax: string,
		deliveryCost: string,
		minimumAmount: string,
		deliveryFree: string
	},
	intervals: {
		id: string,
		name: string,
		deliveryTime: number,
		pickupTime: number,
		ordersAvailable: number
	}[]
}