import { Request, Response } from "express"
import { IResponse } from "../"

export class ResponseService {
	private res: Response
	private req: Request
	private ip: string
	private timestamp: string

	constructor(req: Request, res: Response) {
		this.req = req
		this.res = res
		this.ip = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].toString() : ''
		this.timestamp = new Date().toString()
	}

	setRefreshToken = (refreshToken: string) => {
		this.res.cookie('refreshToken', refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 100,
			httpOnly: true,
			secure: true
		})
	}
	redirect = (redirectUrl: string) => {
		this.res.redirect(redirectUrl)
	}

	success = <ResultType>(result: ResultType | null = null, message?: string) => {
		this.res.json({
			result,
			info: {
				ip: this.ip,
				timestamp: this.timestamp,
				status: 200,
				message: message,
			}
		} as IResponse<ResultType>)
	}
	error400 = (message?: string) => {
		this.res.status(400).json({
			result: null,
			info: {
				ip: this.ip,
				timestamp: this.timestamp,
				status: 400,
				message,
			}
		} as IResponse<null>)
	}
	error401 = (message?: string) => {
		this.res.status(401).json({
			result: null,
			info: {
				ip: this.ip,
				timestamp: this.timestamp,
				status: 401,
				message: message,
			}
		} as IResponse<null>)
	}
	error403 = (message?: string) => {
		this.res.status(403).json({
			result: null,
			info: {
				ip: this.ip,
				timestamp: this.timestamp,
				status: 403,
				message: message,
			}
		} as IResponse<null>)
	}
	error500 = (message?: string, result?: any) => {
		this.res.status(500).json({
			result,
			info: {
				ip: this.ip,
				timestamp: this.timestamp,
				status: 500,
				message: message,
			}
		} as IResponse<null>)
	}
}