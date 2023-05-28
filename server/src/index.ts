import * as express from 'express'
import * as bodyParser from "body-parser"
import * as cookieParser from "cookie-parser"
const cors = require('cors')
require('dotenv').config()

import { MAIN_PAGE_TEMPLATE, ALLOWED_ORIGIN_LIST, BODY_SIZE_LIMIT, PORT, QUERY_SIZE_LIMIT } from "./app"
import { entegraRouter, kladrRouter } from "./routing"

export const app = express()

app.use(cors({
	origin: ALLOWED_ORIGIN_LIST,
	credentials: true
}))
app.use(bodyParser.urlencoded({ extended: false, limit: QUERY_SIZE_LIMIT }))
app.use(bodyParser.json({ limit: BODY_SIZE_LIMIT }))
app.use(cookieParser())


app.use(`/entegra`, entegraRouter)
app.use(`/kladr`, kladrRouter)

app.get(`/`, async (req, res) => res.send(MAIN_PAGE_TEMPLATE))


app.listen(PORT, () => console.log(`>> server started\n>> listening ::${PORT}`))
