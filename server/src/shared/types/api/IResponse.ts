export interface IResponse<ResultType> {
	result: ResultType | null,
	info?: IDefaultResponseInfo
}
export type IDefaultResponseInfo = {
	ip: string,
	timestamp?: string,
	status: number,
	message?: string,
} | undefined