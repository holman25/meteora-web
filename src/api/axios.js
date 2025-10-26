import axios from 'axios'
const API_KEY = import.meta.env.VITE_API_KEY

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 800000,
})

apiClient.interceptors.request.use(config => {
  config.headers['X-Api-Key'] = API_KEY
  return config
})

apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export default apiClient
