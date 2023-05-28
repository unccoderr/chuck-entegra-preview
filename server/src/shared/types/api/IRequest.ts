import { Request } from "express"

import { IJWTTokenPayload } from "../../../features"

export interface IRequest<BodyType = any, QueryType = any, StateType = any> extends Omit<Request, 'query'> {
	state: StateType,
	query: QueryType,
	body: BodyType
}
export type IParamedRequest = any
export type IAuthorizedRequest<BodyType = any, QueryType = any> = IRequest<BodyType, QueryType, IJWTTokenPayload>