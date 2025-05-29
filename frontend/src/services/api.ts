import axios from "axios"
const isProd = process.env.NODE_ENV === "production"
const BASE_API_URL = isProd
  ? process.env.NEXT_PUBLIC_API_URL
  : "http://localhost:5000"

const BASE_URL = BASE_API_URL + "/api"

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})
