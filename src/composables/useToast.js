import { ref } from 'vue'

const toasts = ref([])
let lastKey = null
let lastAt = 0
const WINDOW_MS = 5000

function uid() {
  if (crypto?.randomUUID) return crypto.randomUUID()
  return 't_' + Math.random().toString(36).slice(2) + Date.now()
}

export function useToast() {
  function push({ type = 'info', message = '', duration = 5000, id = uid() }) {
    const key = `${type}|${message}`
    const now = Date.now()
    if (key === lastKey && now - lastAt <= WINDOW_MS) {
      const idx = toasts.value.findIndex(t => `${t.type}|${t.message}` === key)
      if (idx !== -1) {
        const cur = toasts.value[idx]
        toasts.value[idx] = { ...cur, count: (cur.count || 1) + 1 }
        lastAt = now
        return
      }
    }
    lastKey = key
    lastAt = now

    toasts.value.push({ id, type, message, count: 1 })
    if (duration > 0) setTimeout(() => remove(id), duration)
  }

  function remove(id) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return { toasts, push, remove }
}

export function useAxiosErrorToast() {
  const { push } = useToast()

  function showFromAxios(error) {
    if (error.request && !error.response) {
      push({ type: 'warning', message: 'No pudimos conectarnos con el servidor. Revisa tu conexión e inténtalo de nuevo.' })
      return
    }
    const status = error?.response?.status
    const backendMsg = error?.response?.data?.message || error?.response?.data?.error || error?.message

    if (status >= 500 || [502, 503, 504].includes(status)) {
      push({ type: 'error', message: 'El servicio está inestable. Inténtalo de nuevo en unos segundos.' })
      return
    }
    if (status === 429) {
      push({ type: 'warning', message: 'Demasiadas solicitudes. Espera un momento e inténtalo de nuevo.' })
      return
    }
    if (status === 401) {
      push({ type: 'info', message: 'Tu sesión expiró. Inicia sesión para continuar.' })
      return
    }
    if (status === 400 || status === 422) {
      push({ type: 'warning', message: backendMsg || 'Faltan datos para procesar tu solicitud. Revisa e inténtalo de nuevo.' })
      return
    }
    push({ type: 'error', message: 'Ocurrió un error inesperado. Vuelve a intentarlo.' })
  }

  return { showFromAxios }
}
