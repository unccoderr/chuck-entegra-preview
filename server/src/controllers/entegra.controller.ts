import axios from "axios"
import { Request, Response } from "express"
import { EntegraMenu, Intervals, IntervalsResponse, Menu, OrderResponse, Stoplist } from "../types"
import { DefaultGood, DefaultGoodSupplement } from "../entities"

import { entegraConfig } from "../config"
import { entegraApi, ResponseService } from "../shared"

export class EntegraController {
	_orderOffset = 40 // time needed to cook the ordered food

	_getCategoryIdByName = (menu: Menu | EntegraMenu, name: string) => {
		return menu.menuItems.categories.filter(i => i.name === name)[0].id
	}

	getMenu = async (req: Request, res: Response) => {
		const rc = new ResponseService(req, res)
		const regExp = new RegExp(/ (\d\dсм|\d\d см)/)
		const restaurantId = req.params.restaurantId
		try {
			if (!restaurantId) {
				return rc.error400('restaurantId is not provided')
			}

			const [{ data: menuData }, {  data: stopListData }] = await Promise.all([
				entegraApi.get<EntegraMenu>(`/${entegraConfig.menuUrl}/${restaurantId}`),
				axios.get<Stoplist>(`/${entegraConfig.stopListUrl}/${restaurantId}`)
			])

			const pizzaCategoryId = this._getCategoryIdByName(menuData, 'Пицца')
			const supplementsCategoryId = this._getCategoryIdByName(menuData, 'Добавки')

			const products = menuData.menuItems.products
				.filter(i => !stopListData.stopList.find(j => j.id === i.id) // no stoplist items
					&& i.name.indexOf('Собери') === -1)  // no custom-builded items
				.map(i => { return { ...i, imageUrl: i.imageUrl } })
			let goods: DefaultGood[] = [] // goods with variants list
			const pizzaSupplements: DefaultGoodSupplement[] = products
				.filter(i => i.categoryId === supplementsCategoryId)
				.map(i => { return { id: i.id, name: i.name, price: i.price } })

			products.forEach(i => {
				const isPizza = i.categoryId === pizzaCategoryId
				const result = regExp.exec(i.name)
				if (!result) {
					goods.push({
						categoryId: i.categoryId,
						name: i.name,
						description: i.description,
						imageUrl: i.imageUrl,
						variants: [
							{ id: i.id, name: '', price: i.price }
						],
						supplements: isPizza ? pizzaSupplements : []
					})
					return
				}

				const productName = i.name.slice(0, result.index)
				const variantName = i.name
					.slice(result.index + 1, i.name.length)
					.replace(' ', '')
				const goodId = goods.findIndex(i => i.name === productName)

				if (goodId >= 0) {
					goods[goodId] = {
						...goods[goodId],
						variants: [
							...goods[goodId].variants,
							{ id: i.id, name: variantName, price: i.price }
						],
					}
				} else {
					goods.push({
						categoryId: i.categoryId,
						name: productName,
						description: i.description,
						imageUrl: i.imageUrl,
						variants: [
							{ id: i.id, name: variantName, price: i.price }
						],
						supplements: isPizza ? pizzaSupplements : []
					})
				}
			})

			return rc.success<Menu>({
				menuItems: {
					goods: goods,
					categories: menuData.menuItems.categories
				},
				lastUpdatedAt: menuData.lastUpdatedAt
			})
		} catch (e) {
			console.log(e)
			rc.error500(e.toString())
		}
	}
	getIntervals = async (req: Request, res: Response) => {
		const rc = new ResponseService(req, res)
		const restaurantId = req.params.restaurantId
		try {
			const { determinant, timestamp } = req.query as { determinant: string | undefined, timestamp: string | undefined }
			if (!determinant) return rc.error400('No determinant')
			if (!restaurantId) return rc.error400('restaurantId was not provided')
			const date = timestamp ? new Date(timestamp) : new Date()
			const dateTimestamp = date.getHours() * 60 + date.getMinutes() + this._orderOffset
			const formattedDate = date.getFullYear()
				+ `-${date.getMonth() + 1 > 9 ? (date.getMonth() + 1) : `0${date.getMonth() + 1}`}`
				+ `-${date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`}`
			const requestUrl = timestamp
				? `/${entegraConfig.intervalUrl}/${restaurantId}?determinant=${determinant}&date=${formattedDate}`
				: `/${entegraConfig.intervalUrl}/${restaurantId}?determinant=${determinant}`
			const { data: intervalsData } = await entegraApi.get<Intervals>(requestUrl)

			const filteredIntervals = intervalsData.intervals
				.map(interval => {
					const [fromTimestamp, toTimestamp] = interval.name.split('-')
					const [fromHour, toHour] = fromTimestamp.replace(' ', '').split(':').map(i => +i)
					const [fromMinutes, toMinutes] = toTimestamp.replace(' ', '').split(':').map(i => +i)
					return {
						...interval,
						fromTimestamp: fromHour * 60 + fromMinutes,
						toTimestamp: toHour * 60 + toMinutes
					}
				})
				.filter(interval => interval.fromTimestamp >= dateTimestamp && interval.toTimestamp > dateTimestamp && timestamp)
				.map(interval => {
					return {
						id: interval.id,
						name: interval.name,
						deliveryTime: interval.deliveryTime,
						pickupTime: interval.pickupTime,
						ordersAvailable: interval.ordersAvailable,
					}
				})

			return rc.success({
				deliveryParameters: {
					id: intervalsData.deliveryParameters.id,
					tax: +intervalsData.deliveryParameters.tax,
					minimumAmount: +intervalsData.deliveryParameters.minimumAmount,
					deliveryFree: +intervalsData.deliveryParameters.deliveryFree,
					deliveryCost: +intervalsData.deliveryParameters.deliveryCost,
				},
				intervals: filteredIntervals
			} as IntervalsResponse)
		} catch (e) {
			console.log(e.toString())
			rc.error500(e.toString())
		}
	}
	createOrder = async (req: Request, res: Response) => {
		const rc = new ResponseService(req, res)
		const restaurantId = req.params.restaurantId
		try	{
			if (!restaurantId) return rc.error400('restaurantId was not provided')

			const { data } = await entegraApi.post<OrderResponse>(`/${entegraConfig.orderUrl}/${restaurantId}`, {
				...req.body
			})

			return rc.success(data)
		} catch (e) {
			console.log(e)
			return rc.error500(e.toString())
		}
	}
	updateOrder = async (req: Request, res: Response) => {
		const rc = new ResponseService(req, res)
		const restaurantId = req.params.restaurantId
		const orderId = req.params.orderId
		const { status } = req.query
		try {
			if (!orderId) return rc.error400('No orderId')
			if (!restaurantId) return rc.error400('No restaurantId')
			if (!status) return rc.error400('No status')
			const { data: orderData } = await entegraApi.put<OrderResponse>(`/${entegraConfig.orderUrl}/${restaurantId}/${orderId}`, {
				status
			})
			return rc.success(orderData)
		} catch (e) {
			return rc.error500(e.toString())
		}
	}
	getOrder = async (req: Request, res: Response) => {
		const rc = new ResponseService(req, res)
		const restaurantId = req.params.restaurantId
		const orderId = req.params.orderId
		try {
			if (!restaurantId) return rc.error400('restaurantId was not provided')
			if (!orderId) return rc.error400('orderId was not provided')
			const { data: orderData } = await entegraApi.get<OrderResponse>(`/${entegraConfig.orderUrl}/${restaurantId}/${orderId}`)
			return rc.success(orderData)
		} catch (e) {
			rc.error500(e.toString())
		}
	}
}