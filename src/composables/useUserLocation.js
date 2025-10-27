import { ref, onMounted } from 'vue'
import Cookies from 'js-cookie'

const location = ref(null)
const error = ref(null)
const status = ref('idle')

function readCookie() {
  const saved = Cookies.get('user_location')
  if (!saved) return null
  try { return JSON.parse(saved) } catch { Cookies.remove('user_location'); return null }
}

function writeCookie(loc) {
  Cookies.set('user_location', JSON.stringify(loc), { expires: 7 })
}

function clearCookie() {
  Cookies.remove('user_location')
}

function getPositionOnce({ timeout = 10000, enableHighAccuracy = false } = {}) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      status.value = 'unavailable'
      error.value = 'Geolocalización no soportada'
      return reject(new Error('GEO_UNAVAILABLE'))
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lon: pos.coords.longitude }
        resolve(loc)
      },
      (err) => {
        reject(err)
      },
      { timeout, enableHighAccuracy, maximumAge: 600000 }
    )
  })
}

async function queryPermission() {
  if (!navigator.permissions || !navigator.permissions.query) return null
  try {
    const res = await navigator.permissions.query({ name: 'geolocation' })
    return res.state
  } catch {
    return null
  }
}

async function ensureLocation({ forcePrompt = true } = {}) {
  const cookieLoc = readCookie()
  if (cookieLoc && typeof cookieLoc.lat === 'number' && typeof cookieLoc.lon === 'number') {
    location.value = cookieLoc
    status.value = 'granted'
    error.value = null
    return location.value
  }

  const perm = await queryPermission()

  if (perm === 'granted') {
    try {
      const loc = await getPositionOnce({})
      location.value = loc
      status.value = 'granted'
      error.value = null
      writeCookie(loc)
      return loc
    } catch (e) {
      status.value = 'unavailable'
      error.value = 'No fue posible obtener la ubicación'
      throw new Error('GEO_FAILED')
    }
  }

  if (perm === 'prompt' || perm === null) {
    if (!forcePrompt) {
      status.value = 'prompt'
      throw new Error('GEO_NEEDS_PROMPT')
    }
    try {
      const loc = await getPositionOnce({})
      location.value = loc
      status.value = 'granted'
      error.value = null
      writeCookie(loc)
      return loc
    } catch (e) {
      status.value = 'denied'
      error.value = 'Permiso denegado o no disponible'
      clearCookie()
      throw new Error('GEO_DENIED')
    }
  }
  status.value = 'denied'
  error.value = 'Permiso de ubicación denegado'
  clearCookie()
  throw new Error('GEO_DENIED')
}

function fetchLocation() {
  ensureLocation().catch(() => {})
}

onMounted(fetchLocation)

export default function useUserLocation() {
  return {
    location,
    error,
    status,
    ensureLocation,
    fetchLocation,
    clearLocation: clearCookie,
  }
}
