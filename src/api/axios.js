import axios from 'axios'
import { useAxiosErrorToast } from '@/composables/useToast'
const API_KEY = import.meta.env.VITE_API_KEY

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 800000,
})

const inFlight = new Map()

function stableStringify(obj) {
  if (obj == null) return ''
  if (typeof obj !== 'object') return String(obj)
  const allKeys = []
  JSON.stringify(obj, (k, v) => (allKeys.push(k), v))
  allKeys.sort()
  return JSON.stringify(obj, allKeys)
}

function buildDedupeKey(config) {
  const method = (config.method || 'get').toUpperCase()
  const url = (config.baseURL || '') + (config.url || '')
  const params = stableStringify(config.params)
  const data = stableStringify(config.data)
  return `${method} ${url} | p:${params} | d:${data}`
}

if (!apiClient.__interceptorsRegistered) {
  apiClient.interceptors.request.use(
    (config) => {
      config.headers['X-Api-Key'] = API_KEY

      if (!config.signal && config.dedupe !== false) {
        const key = buildDedupeKey(config)

        if (inFlight.has(key)) {
          const controller = new AbortController()
          config.signal = controller.signal
          config.__dedupeKey = key
          controller.abort()
          const err = new axios.Cancel('DUPLICATE_REQUEST')
          err.__skipToast = true
          throw err
        }

        const controller = new AbortController()
        config.signal = controller.signal
        config.__dedupeKey = key
        inFlight.set(key, controller)
      }

      return config
    },
    (error) => Promise.reject(error)
  )

  apiClient.interceptors.response.use(
    (response) => {
      const key = response.config?.__dedupeKey
      if (key) inFlight.delete(key)
      return response
    },
    (error) => {
      const cfg = error.config
      const key = cfg?.__dedupeKey
      if (key) inFlight.delete(key)

      if (axios.isCancel(error) || error.__skipToast) {
        return Promise.reject(error)
      }

      const { showFromAxios } = useAxiosErrorToast()
      try { showFromAxios(error) } catch (_) {}

      console.error('API Error:', error.response?.data || error.message)
      return Promise.reject(error)
    }
  )

  apiClient.__interceptorsRegistered = true
}

export default apiClient
