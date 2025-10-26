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
    "🧊 Enfriando los servidores… hace calor hasta aquí 😅",
    "🌫️ Las nubes se ven misteriosas hoy…",
    "🧮 Haciendo cálculos meteorológicos y existenciales...",
    "🌈 Si ves un arcoíris, mándame foto, necesito validarlo 🌤️",
    "✅ ¡Listo! Datos frescos del clima recién salidos del horno."
  ],
  [
    "🧭 Girando mi brújula digital… parece que está mareada.",
    "🧰 Ajustando mis barómetros con cinta mágica 🪄",
    "🌬️ Hablando con el viento (no responde mucho).",
    "🌊 Detectando humedad… en el ambiente y en mis circuitos.",
    "🛰️ Clima confirmado: ¡transmisión completada!"
  ],
  [
    "🌋 Escaneando la atmósfera por si hay drama meteorológico...",
    "🧤 Abrígate, que este algoritmo se está poniendo frío ❄️",
    "💫 Consultando con el oráculo de las estaciones...",
    "📊 Las gráficas del clima están bailando hoy 💃",
    "☀️ ¡Listo! Ya tengo el pronóstico con estilo."
  ],
  [
    "🦖 Buscando rastros de dinosaurios… ups, era solo una nube con forma rara.",
    "🧙‍♂️ Mezclando pociones para invocar el clima perfecto...",
    "⚡ Cargando energía eléctrica (de un rayo, literalmente).",
    "💡 Tengo una iluminación... ¡y no es solo el relámpago!",
    "📜 El clima ha hablado. Te lo traduzco enseguida."
  ],
  [
    "🧘 Respirando profundamente para sintonizar con la atmósfera...",
    "🍃 Escuchando los susurros del viento (spoiler: hace frío).",
    "🐸 Las ranas me dijeron algo sobre lluvia, parece confiable.",
    "🌻 Las flores confirmaron que huele a pronóstico bueno.",
    "🪂 ¡Y listo! Descendiendo con la predicción."
  ],
  [
    "🔋 Cargando predicción... y café ☕",
    "💤 Despertando mis sensores del modo siesta...",
    "🎩 Sacando un pronóstico del sombrero (funciona 80% de las veces).",
    "🧊 Procesando... espero que no se me congele el sistema.",
    "🚀 ¡Ahí va! El clima viene en camino."
  ],
  [
    "🕵️‍♂️ Investigando si es lluvia o lágrimas del cielo...",
    "🔬 Analizando partículas de drama en el ambiente.",
    "🌪️ El viento me susurró un spoiler: se avecinan cambios.",
    "🧩 Uniendo piezas del rompecabezas meteorológico...",
    "🎉 Caso resuelto: tengo el pronóstico perfecto."
  ],
  [
    "🧭 Consultando los archivos secretos del clima...",
    "⏳ Esperando que el tiempo (literalmente) me diga la verdad.",
    "👁️ Visualizando el horizonte… wow, qué bonito.",
    "🎢 El clima de hoy parece una montaña rusa.",
    "📬 Predicción lista. ¡Abrígate emocionalmente!"
  ],
  [
    "🐧 Pingüinos reportan desde el sur: todo bajo cero 🥶",
    "🦩 Flamencos del norte dicen: calorcito asegurado ☀️",
    "🎙️ Yo solo transmito lo que ellos dicen...",
    "📡 Sintetizando informes con estilo tropical.",
    "🌍 ¡Listo! Clima internacional servido."
  ],
  [
    "🕹️ Iniciando simulación climática en 3... 2... 1...",
    "💾 Guardando pronóstico en la nube (literalmente).",
    "🎮 Nivel 1: lluvia ligera. Nivel 2: caos total.",
    "🧭 Tomando dirección del viento... o intentando.",
    "🏁 Misión completada: pronóstico desbloqueado."
  ]
]

watch(() => props.show, (newVal) => {
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
  }, 50)
}

function startThinking() {
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