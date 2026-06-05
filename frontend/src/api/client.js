import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const fetchWeather = (lat, lon, days = 7, units = 'metric') =>
  api.get('/weather/', { params: { lat, lon, days, units } })

export const fetchUsage = () =>
  api.get('/weather/usage/')

export const analyzeTree = (formData) =>
  api.post('/trees/analyze/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 90000,
  })

export const fetchTreeHistory = (limit = 10) =>
  api.get('/trees/history/', { params: { limit } })

export const fetchTreeQuota = () =>
  api.get('/trees/quota/')

export default api
