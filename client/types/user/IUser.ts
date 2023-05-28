export interface IUser {
	name: string,
	phoneNumber: string,
	address: {
		city: {
			code: string,
			name: string,
		},
		street: {
			code: string,
			name: string,
		},
		houseNumber: string,
		entrance: string,
		floor: string,
		flatNumber: string,
	}
}