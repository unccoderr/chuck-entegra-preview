import { IEntegraOrder, IOrderDTO } from "../types"
import * as moment from "moment"
import { bold } from "../utils";

export class OrderService {
    _order: IOrderDTO
    constructor(orderDto: IOrderDTO) {
        this._order = orderDto
    }

    calcTotalPrice = (): number => {
        let totalPrice = this._order.delivery.deliveryCoast

        this._order.goods.forEach(good => {
            good.variants.forEach((variant, idx) => {
                const supplementsPrice = variant.supplements.reduce((a, b) => a + b.price, 0)
                const currentPrice = ((variant.quantity * variant.price) + supplementsPrice) * (1 - this._order.discountPercent)
                totalPrice += currentPrice
            })
        })
        console.log('total = ', totalPrice)
        return totalPrice
    }
    formatMessage = (): string => {
        let text = ''
        let index = 1
        let totalQuantity = 0
        let goods: { amount: number, label: string }[] = []

        if (this._order.delivery.deliveryCoast !== 0) {
            goods.push({
                label: 'Доставка',
                amount: this._order.delivery.deliveryCoast * 100
            })
        }
        this._order.goods.forEach(good => {
            const hasVariants = good.name !== good.variants[0].name
            good.variants.forEach((variant, idx) => {
                const hasSupplements = variant.supplements.length !== 0
                const supplementsPrice = variant.supplements.reduce((a, b) => a + b.price, 0)
                const price = variant.price + supplementsPrice
                const currentPrice = ((variant.quantity * variant.price) + supplementsPrice) * this._order.discountPercent
                const currentName = (hasVariants
                        ? good.name + ' ' + variant.name
                        : good.name)
                    + (hasSupplements
                        ?  ` (${variant.supplements.map(i => i.name).toString()})`
                        : '')

                goods.push({
                    label: currentName,
                    amount: currentPrice * 100,
                })
                text += `${bold(`${index}. ${currentName}`)}\n`
                    + (this._order.discountPercent === 0
                        ? `${variant.quantity} х ${price}руб | ${currentPrice}руб\n\n`
                        : `${variant.quantity} х ${price}руб - ${this._order.discountPercent * 100}% | ${currentPrice}руб\n\n`)

                totalQuantity += variant.quantity
                index++
            })
        })
        if (this._order.delivery.deliveryCoast !== 0) {
            text += `${bold(`${index}. Доставка`)}\n`
                + `${this._order.delivery.deliveryCoast}руб\n\n`
        }
        if (this._order.options.details) {
            text += `Доп сведенья о заказе: ${this._order.options.details}\n\n`
        }

        const totalPrice = this.calcTotalPrice()

        text += `Выбрано позиций: ${totalQuantity}шт\n` +
            `Цена к оплате: ${totalPrice}руб\n\n`

        return text
    }
    getInvoiceGoods = (): { amount: number, label: string }[] => {
        let goods: { amount: number, label: string }[] = []
        this._order.goods.forEach(good => {
            const hasVariants = good.name !== good.variants[0].name

            good.variants.forEach(variant => {
                const hasSupplements = variant.supplements.length !== 0
                const supplementPrice = variant.supplements.reduce((a, b) => a + b.price, 0)
                const currentPrice = ((variant.quantity * variant.price) + supplementPrice) * this._order.discountPercent
                const currentName = (hasVariants ? good.name + ' ' + variant.name : good.name)
                    + (hasSupplements ? ` (${variant.supplements.map(i => i.name).toString()})` : '')

                goods.push({
                    label: currentName,
                    amount: currentPrice * 100,
                })

            })
        })

        if (this._order.delivery.deliveryCoast !== 0) {
           goods.push({
               amount: this._order.delivery.deliveryCoast * 100,
               label: 'Доставка'
           })
        }

        return goods

    }
    createOrder = (orderId: string): IEntegraOrder => {
        const orderGoods: {
            id: string,
            name: string,
            price: number,
            quantity: number,
            ingredients: {
                id: string,
                name: string,
                price: number,
            }[]
        }[] = []

        this._order.goods.forEach(good => {
            good.variants.forEach(variant => {
                const hasVariants = good.name !== variant.name
                const currentPrice = variant.quantity * variant.price * (this._order.discountPercent)
                const supplements: { id: string, name: string, price: number }[] = variant.supplements.map(i => {
                    return {
                        id: i.id,
                        name: i.name,
                        price: i.quantity * i.price
                    }
                })
                const fullName = hasVariants
                    ? good.name + ' ' + variant.name
                    : good.name
                orderGoods.push({
                    id: variant.id,
                    name: fullName,
                    price: currentPrice,
                    quantity: variant.quantity,
                    ingredients: supplements
                })
            })
        })
        const totalPrice = this.calcTotalPrice()

        return {
            source: 'telegram',
            originalOrderId: orderId,
            preOrder: true,
            createdAt: moment().format('YYYY-MM-DDThh:mm:ss') + '+0300',
            customer: {
                name: this._order.person.name,
                phone: this._order.person.phoneNumber
            },
            payment: {
                type: 'online',
                providerPaymentId: '',
                telegramPaymentId: ''
            },
            expeditionType: 'delivery',
            delivery: {
                expectedTime: moment(this._order.expectedTime).format('YYYY-MM-DDThh:mm:ss') + '+0300',
                address: {
                    city: this._order.address.city,
                    street: this._order.address.street,
                    houseNumber: this._order.address.houseNumber,
                    entrance: this._order.address.entrance,
                    floor: this._order.address.floor,
                    flatNumber: this._order.address.flatNumber,
                    coordinates: {
                        latitude: this._order.address.coordinates.latitude,
                        longitude: this._order.address.coordinates.longitude
                    }
                }
            },
            deliveryParameters: {
                parametersId: this._order.delivery.parametersId,
                intervalId: this._order.delivery.intervalId
            },
            products: orderGoods,
            comment: this._order.options.details
                ? this._order.options.details + ' тестовый заказ'
                : 'тестовый заказ',
            price: {
                total: totalPrice,
                deliveryFee: this._order.delivery.deliveryCoast,
                discount: this._order.discountPercent * totalPrice
            },
            personsQuantity: this._order.options.personsCount,
            callCenter: {
                phone: '89007006040'
            }
        }
    }
}