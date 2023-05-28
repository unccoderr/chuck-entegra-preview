import axios from "axios"
import { Request, Response } from "express"
import { ResponseService } from "../shared"

export class KladrController {
	_token = '' // API token
	_baseUrl = 'https://kladr-api.ru/api.php'
	_cityId = 7800000000000 // Saint Petersburg

	getStreet = async (req: Request, res: Response) => {
		const rc = new ResponseService(req, res)
		try	{
			const q = req.body.q
			if (!q) return rc.error400('q is not provided')

			const requestUrl = `${this._baseUrl}`
				+ `?token=${this._token}`
				+ `&oneString=1`
				+ `&query=${q}`
				+ `&limit=1`
				+ `&cityId=${this._cityId}`
				+ `&contentType=street`

			const response = await axios.get(requestUrl)
			const data = response.data as {
				result: {
					id: string,
					name: string,
					zip: null,
					type: string,
					typeShort: string,
					okato: null,
					contentType: 'street',
					fullName: string,
					guid: string,
					ifnsfl: string,
					ifnsul: string,
					oktmo: string,
					parentGuid: string,
					cadnum: string
				}[] | null
			}
			rc.success(data.result[0])
		} catch (e) {
			console.log(e)
			rc.error500(e.toString())
		}

	}
}