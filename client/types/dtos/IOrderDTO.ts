import { ICartGoodItem } from "../../controllers"
import { IMenu } from "../good";

export interface IOrderDTO {
	person: {
		name: string,
		phoneNumber: string,
		isBirthday: boolean,
	},
	address: {
		coordinates: {
			latitude: string,
			longitude: string,
		},
		city: {
			name: string,
			code: string,
		},
		street: {
			name: string,
			code: string
		},
		houseNumber: string,
		entrance: string,
		floor: string
		flatNumber: string,
	},
	isPickup: boolean,
	paymentType: 'cash' | 'card' | 'online',
	delivery: {
		parametersId: string,
		intervalId: string,
		deliveryCoast: number,
		deliverySubtitle: string,
	},
	options: {
		promoCode: string,
		personsCount: number,
		details: string,
	}
	discountPercent: number,
	expectedTime: Date,
	goods: ICartGoodItem[],
}

