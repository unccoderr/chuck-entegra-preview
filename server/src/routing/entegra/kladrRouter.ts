import { Router } from "express"

import { KladrController } from "../../controllers"

export const kladrRouter = Router()
const kladrController = new KladrController()

kladrRouter.put(`/street`, kladrController.getStreet)


