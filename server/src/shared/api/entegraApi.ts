import axios from "axios"

import { entegraConfig } from "../../config"

export const entegraApi = axios.create({
    baseURL: entegraConfig.baseUrl,
    headers: {
        Authorization: 'Basic d2ViOndlYg=='
    }
})