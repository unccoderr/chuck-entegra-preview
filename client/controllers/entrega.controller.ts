import axios from 'axios'
import { getDistance } from "../utils"

import { IGoodVariant, IntervalsResponse, MenuResponse } from "../types"

import { routingConfig } from "../config"
const { base_url, entegraUrl } = routingConfig.api

export class EntegraController {
	_baseUrl = `${base_url}/${entegraUrl}/a7898941-95f4-11eb-850a-0050569dbef0`

	getIntervals = async (expectedTime: string | undefined, lat1: number, lon1: number, lat2: number, lon2: number) => {
		const determinant = getDistance(lat1, lon1, lat2, lon2)
		if (expectedTime) {
			const response = await axios.get<IntervalsResponse>(`${this._baseUrl}/intervals?determinant=${determinant}&timestamp=${expectedTime}`)
			return response.data
		} else {
			const response = await axios.get<IntervalsResponse>(`${this._baseUrl}/intervals?determinant=${determinant}`)
			return response.data
		}
	}
	getMenu = async () => {
		const response = await axios.get<MenuResponse>(`${this._baseUrl}/menu`)

		return response.data
	}
}


