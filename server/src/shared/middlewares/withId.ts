import { Response } from "express"

import { IRequest, ResponseService } from "../index"

export const withId = (idKey: string, _next?: () => void) => {
	return (req: IRequest, res: Response, next: () => any) => {
		const rc = new ResponseService(req, res)
		try {
			if (!req.params[idKey] || isNaN(+req.params[idKey])) {
				return rc.error400()
			} else {
				req.state = {
					...req.state,
				}
				req.state[idKey] = req.params[idKey]
				if (_next) {
					return _next()
				} else {
					return next()
				}
			}
		} catch (e) {
			console.log(e)
			return rc.error500()
		}
	}
}