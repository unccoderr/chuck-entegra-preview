import { sign, verify } from "jsonwebtoken"

import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from "./constants"

export type IJWTTokenType = 'refresh' | 'access'
export interface IJWTTokenPayload {
	isActivated: boolean,
	businessId: number,
	botId: number,
	ownerGuid: string,
	ownerId: number,
	ownerType: 'client' | 'user'
}

export class JwtFeature {
	private generateToken = async (payload: object, type: IJWTTokenType) => {
		switch (type) {
			case "access": return sign(payload, JWT_ACCESS_SECRET, { expiresIn: '30m' })
			case "refresh": return sign(payload, JWT_REFRESH_SECRET, { expiresIn: '30d' })
		}
	}
	generateTokens = async (payload: IJWTTokenPayload) => {
		const refreshToken = await this.generateToken(payload, 'refresh')
		const accessToken = await this.generateToken(payload, 'access')
		return {
			refreshToken,
			accessToken
		}
	}
	validateToken = async (token: string, type: IJWTTokenType) => {
		switch (type) {
			case 'access': return verify(token, JWT_ACCESS_SECRET)
			case "refresh": return verify(token, JWT_REFRESH_SECRET)
		}
	}
}