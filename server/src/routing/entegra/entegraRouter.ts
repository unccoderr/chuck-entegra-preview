import { Router } from "express"

import { EntegraController } from "../../controllers"
import { entegra } from "../../config"

export const entegraRouter = Router()
const entegraController = new EntegraController()

entegraRouter.get(`/:restaurantId/${entegra.menuUrl}`, entegraController.getMenu)
entegraRouter.get(`/:restaurantId/${entegra.intervalsUrl}`, entegraController.getIntervals)

entegraRouter.post(`/:restaurantId/${entegra.orderUrl}`, entegraController.createOrder)
entegraRouter.put(`/:restaurantId/${entegra.orderUrl}/:orderId`, entegraController.updateOrder)
entegraRouter.get(`/:restaurantId/${entegra.orderUrl}/:orderId`, entegraController.getOrder)


