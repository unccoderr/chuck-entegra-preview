import { Request } from "express"

export class RequestService {
	private _req: Request

	constructor(req: Request) {
		this._req = req
	}

	getParam = (key: string) => {
		return this._req.params[key]
	}

	getRefreshToken = (): string | undefined => {
		return this._req.cookies.refreshToken
	}
	getAccessToken = (): string | undefined => {
		if (!this._req.header('Authorization')) return undefined
		return this._req
			.header('Authorization')
			.replace('Bearer ', '')
	}
}