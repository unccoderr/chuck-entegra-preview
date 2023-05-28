import { Telegraf } from "telegraf"
import axios from 'axios'
require('dotenv').config()

import { v4 } from "uuid"
import { OrderService } from "./services"
import { API_BASE_URL, RESTAURANT_ID } from "./config"
import { IEntegraOrder, IOrderDTO } from "./types"
import { bold, getInvoice } from "./utils"

const bot = new Telegraf(process.env.TOKEN)


type IStateItem = {
	order: IEntegraOrder,
	dto: IOrderDTO,
}
const state: {
	[tgId: string]: IStateItem[]
} = {}

bot.start(async ctx => {
	ctx.reply(bold('В меню 👀'), {
		parse_mode: 'HTML',
		reply_markup: {
			keyboard: [
				[
					{ web_app: { url: 'https://deliverydemo.artandfact.ru?utm_src=tg_bot' }, text: 'Меню' }
				]
			]
		}
	})
})

bot.on('web_app_data', async ctx => {
	console.log(ctx)
	const orderId = v4()
	const data = ctx.message.web_app_data.data

	const orderDTO: IOrderDTO = await JSON.parse(data)
	const orderService = new OrderService(orderDTO)

	const text = orderService.formatMessage()
	const orderPayload = orderService.createOrder(orderId)
	const totalPrice = orderService.calcTotalPrice()
	const invoiceGoods = orderService.getInvoiceGoods()

	await ctx.reply(text, { parse_mode: "HTML" })

	const stateItem: IStateItem = {
		order: orderPayload,
		dto: orderDTO
	}
	if (state[ctx.from.id]) state[ctx.from.id].push(stateItem)
	else state[ctx.from.id] = [stateItem]

	const invoice = getInvoice(ctx.chat.id, `Заказ №${orderId}`, `Оплатил - заказ получил!`, ctx.from.id, invoiceGoods)
	await ctx.replyWithInvoice(invoice, {
		reply_markup: {
			inline_keyboard: [
				[
					{ text: `Оплатить ${totalPrice} RUB`, pay: true },
				]
			]
		}
	})
})

bot.on('callback_query', async ctx => {
	switch (ctx.callbackQuery.data) {
		case 'send_order': {
			const dataset = (ctx.update.callback_query.message as any).text as string
			const priceWord = dataset.match(/Цена\sк\sоплате:\s(\d){2,10}руб/)[0].substring(15)
			const price = +priceWord.slice(0, priceWord.indexOf('р'))

			await ctx.replyWithInvoice(getInvoice(ctx.chat.id, 'Заказ №198291728', dataset, ctx.from.id, [
				{ label: 'Заказ', amount: price * 100 }
			]))
			break
		}
		case 'reject_order': {
			await ctx.deleteMessage()
			ctx.reply(`Что - то не так? Проверьте в своей корзине!`)
			break
		}
		case 'got_order': {
			await ctx.deleteMessage()
			ctx.reply(`Приятного аппетита! Будем ждать вас вновь!`)
			break
		}
	}
})

bot.launch()
	.then(() => console.log('> bot started'))

bot.on('pre_checkout_query', (ctx) => ctx.answerPreCheckoutQuery(true))
bot.on('successful_payment', async (ctx) => {
	if (state[ctx.from.id]) {
		const orders = state[ctx.from.id]
		const lastStateElem = orders[orders.length - 1]

		const response = await axios.post<{
			data: { id: string }
		}>(`${API_BASE_URL}/entegra/${RESTAURANT_ID}/order`, {
			...lastStateElem.order,
			payment: {
				...lastStateElem.order.payment,
				providerPaymentId: ctx.message.successful_payment.provider_payment_charge_id,
				telegramPaymentId: ctx.message.successful_payment.telegram_payment_charge_id,
			}
		})
		const id = response.data.data.id
		const replyText = `${bold(`Заказ №${id}`)} успешно сформирован!\n\n`
			+ lastStateElem.dto.delivery.deliverySubtitle

		await ctx.reply(replyText, {
			parse_mode: 'HTML'
		})
	}
})

bot.catch(e => console.log('> bot error ', e))
