export namespace PrivateApiRoutingConfig {
	export const BASE_URL = 'private'
	export const AUTH = {
		BASE_URL: 'auth',
		REGISTER_URL: 'register',
		ACTIVATE: {
			URL: 'activate',
			CODE: 'code_id'
		},
		LOGIN_URL: 'login',
		REFRESH_URL: 'refresh',
		LOGOUT_URL: 'logout'
	}
	export const BUSINESSES = {
		BASE_URL: 'businesses',
		ID_PARAM: 'business_id',
		BOTS: {
			BASE_URL: 'bots',
			ID_PARAM: 'bot_id',
		},
		GOODS: {
			BASE_URL: 'goods',
			ID_PARAM: 'good_id'
		},
		CATEGORIES: {
			BASE_URL: 'categories',
			ID_PARAM: 'category_id'
		},
	}
	export const CLIENTS = {
		BASE_URL: 'clients',
		ID_PARAM: 'client_id',
		CART: {
			BASE_URL: 'cart'
		},
		DOCS: {
			BASE_URL: 'docs'
		},
		ORDERS: {
			BASE_URL: 'orders',
			ID_PARAM: 'order_id'
		},
		FAVORITES: {
			BASE_URL: 'favorites',
			ID_PARAM: 'favorite_id'
		},
		GOODS: {
			BASE_URL: 'goods',
			ID_PARAM: 'good_id',
			DOCUMENT_URL: 'doc'
		}
	}
	export const UTILS = {
		OSM: {
			BASE_URL: 'geo', //https://nominatim.openstreetmap.org/
			// API_URL: 'https://nominatim.openstreetmap.org'
		},
		KLADR: {
			BASE_URL: 'kladr',
			STREET: {
				BASE_URL: 'street'
			}
		}
	}
	export const SYNC = {
		BASE_URL: 'sync',
		ONE_C: {
			URL: '1c',
			BUSINESS_PARAM: 'business_id',
			BOT_PARAM: 'bot_id'
		}
	}
}

export namespace PublicApiRoutingConfig {
	export const BASE_URL = 'public'
	export const CLIENT = {
		BASE_URL: 'client',
		CART_URL: 'cart',
		ORDERS: {
			BASE_URL: 'orders',
			ID_PARAM: 'order_id'
		},
		DOCUMENT: {
			BASE_URL: 'docs'
		},
		FAVORITES: {
			BASE_URL: 'favorites',
			ID_PARAM: 'favorite_id'
		},
		GOODS: {
			BASE_URL: 'goods',
			ID_PARAM: 'good_id',
			DOCUMENT_URL: 'doc'
		}
	}
	export const BUSINESS = {
		BASE_URL: 'business',
		BUSINESS_PARAM: 'business_id',
		BOT_PARAM: 'bot_id',
		NOMENCLATURE_URL: 'nomenclature'
	}
}

export const entegra = {
	baseUrl: 'entegra',
	menuUrl: 'menu',
	intervalsUrl: 'intervals',
	orderUrl: 'order'
}


