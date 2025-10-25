import { ref, onMounted } from 'vue'
import Cookies from 'js-cookie'

const location = ref(null)
const error = ref(null)

export default function useUserLocation() {
  const fetchLocation = () => {
    const saved = Cookies.get('user_location')
    if (saved) {
      try {
        location.value = JSON.parse(saved)
        return
      } catch (e) {
        Cookies.remove('user_location')
      }
    }

    if (!navigator.geolocation) {
      error.value = 'Geolocalización no soportada'
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        }
        location.value = loc
        Cookies.set('user_location', JSON.stringify(loc), { expires: 7 }) // 7 días
      },
      (err) => {
        error.value = 'Permiso denegado o no disponible'
        console.warn('Ubicación no obtenida:', err)
      }
    )
  }

  onMounted(fetchLocation)

  return {
    location,
    error,
    fetchLocation
  }
}
