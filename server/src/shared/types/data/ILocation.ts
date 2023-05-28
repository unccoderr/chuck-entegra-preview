export interface ILocation {
	country: ICountry,
	city: ICity
}

export type ICountry = string | '*' | '-'
export type ICity = string | '*' | '-'