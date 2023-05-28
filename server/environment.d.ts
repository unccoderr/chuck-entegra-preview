declare global {
	namespace NodeJS {
		interface ProcessEnv {
			SMTP_HOST: string,
			SMTP_PORT: string,
			SMTP_PASSWORD: string,
			SMTP_LOGIN: string,

			JWT_REFRESH_SECRET: string,
			JWT_ACCESS_SECRET: string,

			DB_HOST: string,
			DB_NAME: string,
			DB_USERNAME: string,
			DB_PASSWORD: string,
			PORT: string
		}
	}
}
export {}
