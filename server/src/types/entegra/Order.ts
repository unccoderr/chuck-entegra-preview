interface Order {
	originalOrderId: string,
	preOrder: boolean,
	createdAt: string,
	customer: {
		name: string,
		phone: string,
		email: string
	},
	payment: {
		type: 'cash'
	},
	expeditionType: 'delivery',
	delivery: {
		expectedTime: string,
		address: {
			city: {
				name: string
			},
			coordinates: {
				latitude: string,
				longitude: string
			}
		}
	},
	deliveryParameters: {
		parametersId: string,
		intervalId: string
	},
	products: {
		id: string,
		name: string,
		price: number,
		quantity: number,
	}[],
	comment: string,
	price: {
		total: number,
		deliveryFee: number,
		discount: number
	},
	personsQuantity: number,
	callCenter: {
		phone: string
	}
}

/*
	products: {
			id: "51b90f4e-5d60-11e8-8f7d-00155dd9fd01",
			name: "Сякэ Темпура",
			price: 250,
			quantity: 2,
	}[],
 */