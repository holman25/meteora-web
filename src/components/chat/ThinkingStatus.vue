<template>
  <transition name="fade-up">
    <div
      v-if="visible && currentLine"
      class="text-sm text-neutral-300 px-3 py-2 flex items-center gap-2.5 bg-meteora-light/40 rounded-lg"
    >
      <div class="flex gap-1">
        <span class="animate-bounce text-meteora-cyan" style="animation-delay: 0s;">●</span>
        <span class="animate-bounce text-meteora-cyan" style="animation-delay: 0.15s;">●</span>
        <span class="animate-bounce text-meteora-cyan" style="animation-delay: 0.3s;">●</span>
      </div>
      <span class="typewriter flex-1">{{ displayedText }}</span>
    </div>
  </transition>
</template>

<script setup>
import { ref, onUnmounted, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const currentLine = ref('')
const displayedText = ref('')
const visible = ref(false)
let interval = null
let typewriterInterval = null

const flows = [
  [
    "🧪 Estoy desempolvando mis sensores meteorológicos...",
    "📡 Recibiendo datos desde los satélites... pero está nublado 👀",
    "🌩️ ¿Eso fue un trueno? Espera, sigo calculando...",
    "🤯 Este clima sí que me está confundiendo...",
    "☁️ ¡Listo! Creo que tengo una respuesta... o una nube. O ambas."
  ],
  [
    "🧠 Pensando profundamente... muy profundamente...",
    "🌀 El clima cambia tan rápido como mi humor...",
    "🗺️ Buscando tu ubicación entre las estrellas...",
    "👽 Un ovni me distrajo... ya vuelvo.",
    "🔮 El pronóstico está llegando... mágicamente."
  ],
  [
    "🔍 Analizando... ¿eso es lluvia o solo nostalgia?",
    "☕ Preparando una bebida caliente para inspirarme...",
    "📈 Los datos están fluyendo como el viento 🌬️",
    "🎻 Suena música dramática mientras pienso...",
    "🥽 ¡Ya casi! Ajustando mis gafas climáticas."
  ],
  [
    "🎬 Escena 1: El bot intenta predecir el clima...",
    "🎬 Escena 2: El bot duda de sus sensores...",
    "🎬 Escena 3: ¡El bot se ilumina! 💡",
    "🎬 Final alternativo: sale el sol 🌞",
    "🎬 Créditos: Meteora – tu IA meteorológica."
  ],
  [
    "🐦 Consultando a los pájaros del clima...",
    "📖 Leyendo las nubes como si fueran poesía...",
    "🏔️ Preguntándole a las montañas cómo se sienten hoy...",
    "💭 Soñando con cielos despejados mientras proceso...",
    "✨ ¡Listo! Tengo algo que te podría gustar."
  ]
]

watch(() => props.show, (newVal) => {
  console.log('[ThinkingStatus] show changed to:', newVal)
  if (newVal) {
    startThinking()
  } else {
    stopThinking()
  }
}, { immediate: true })

function typewriterEffect(text) {
  displayedText.value = ''
  if (typewriterInterval) clearInterval(typewriterInterval)
  
  let charIndex = 0
  typewriterInterval = setInterval(() => {
    if (charIndex < text.length) {
      displayedText.value += text[charIndex]
      charIndex++
    } else {
      clearInterval(typewriterInterval)
    }
  }, 50) // 50ms por carácter - más lento para que se aprecie
}

function startThinking() {
  console.log('[ThinkingStatus] Starting thinking animation')
  stopThinking()
  
  const flow = flows[Math.floor(Math.random() * flows.length)]
  let i = 0
  currentLine.value = flow[i]
  visible.value = true
  typewriterEffect(flow[i])

  interval = setInterval(() => {
    i++
    if (i < flow.length) {
      currentLine.value = flow[i]
      typewriterEffect(flow[i])
    }
  }, 3500)
}

function stopThinking() {
  console.log('[ThinkingStatus] Stopping thinking animation')
  if (interval) {
    clearInterval(interval)
    interval = null
  }
  if (typewriterInterval) {
    clearInterval(typewriterInterval)
    typewriterInterval = null
  }
  visible.value = false
  currentLine.value = ''
  displayedText.value = ''
}

onUnmounted(() => {
  stopThinking()
})
</script>

<style scoped>
.fade-up-enter-active {
  transition: all 0.5s ease-out;
}
.fade-up-leave-active {
  transition: all 0.3s ease-in;
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

.animate-bounce {
  animation: bounce 1.2s ease-in-out infinite;
}

.typewriter {
  display: inline-block;
  font-style: italic;
}
</style>