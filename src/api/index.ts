import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.SERVER_URL,
})

export const externalApi = axios.create()
