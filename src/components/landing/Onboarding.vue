<template>
  <transition name="fade" appear>
    <section v-if="show" class="fixed inset-0 z-[1200] bg-[#07090F] text-white overflow-hidden">
      <canvas ref="trailCanvas" class="absolute inset-0 w-full h-full pointer-events-none"></canvas>
      <div class="absolute inset-0 pointer-events-none">
        <div
          class="absolute -inset-40 blur-3xl"
          style="
            background:
              radial-gradient(60% 50% at 20% 15%, rgba(125, 211, 252, .18), transparent 60%),
              radial-gradient(50% 60% at 85% 20%, rgba(96, 165, 250, .14), transparent 60%),
              radial-gradient(60% 60% at 40% 85%, rgba(192, 132, 252, .12), transparent 60%);
          "
        ></div>
        <div class="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_1px_1px,#9aa9bd_1px,transparent_1.5px)] [background-size:34px_34px]"></div>
      </div>

      <!-- Contenido -->
      <div class="relative h-full max-w-6xl mx-auto flex flex-col items-center justify-center px-6">
        <div class="select-none flex flex-col items-center">
          <div class="flex items-end gap-2 md:gap-3 leading-none">
            <span class="word" :style="gradStyle">M</span>
            <span class="word" :style="gradStyle">E</span>
            <span class="word" :style="gradStyle">T</span>
            <span class="word" :style="gradStyle">E</span>
            <span ref="eyeRef" class="relative inline-flex items-center justify-center"
                  :style="{ width: eyeSize + 'px', height: eyeSize + 'px' }">
              <span class="absolute inset-0 rounded-full ring-2" :style="ringStyle"></span>
              <span class="pupil absolute rounded-full" :style="pupilStyle"></span>
            </span>

            <span class="word" :style="gradStyle">R</span>
            <span class="word" :style="gradStyle">A</span>
          </div>

          <p class="mt-6 md:mt-8 text-center text-neutral-300 text-[18px] md:text-[20px] leading-relaxed max-w-3xl">
            Meteora es tu asistente de clima. Consulta el tiempo en tu ciudad con respuestas claras,
            visuales agradables y tips útiles—todo en tiempo real.
          </p>
        </div>

        <div class="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button @click="start"
                  class="relative overflow-hidden px-6 md:px-7 py-3 md:py-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition font-semibold">
            <span class="relative z-10">Get Started</span>
            <span class="absolute inset-0 -z-0 bg-gradient-to-r from-fuchsia-600/30 via-cyan-400/30 to-purple-500/30 opacity-0 hover:opacity-100 transition"></span>
          </button>

          <button @click="learn"
                  class="px-6 md:px-7 py-3 md:py-3.5 rounded-xl border border-white/10 text-neutral-300 hover:text-white hover:bg-white/5 transition">
            Take the tour
          </button>
        </div>

        <p class="mt-6 text-xs text-neutral-500"> <code>By Holman Alba 2025 All Rights </code> ✨</p>
      </div>

      <div
        class="pointer-events-none absolute inset-0 scale-50 opacity-0 origin-center rounded-[40px] border border-white/10 shadow-[0_0_0_9999px_rgba(7,10,15,0)]
               transition-transform transition-opacity duration-[900ms] ease-[cubic-bezier(.16,.84,.44,1)]"
        :class="{ 'on-exit': isExiting }"
      />
    </section>
  </transition>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch, nextTick } from 'vue'
import useTour from '@/composables/useTour'
const { startTour } = useTour()

const props = defineProps({ show: { type: Boolean, default: false } })
const emit  = defineEmits(['start','learn','close'])

/* ---------- Branding ---------- */
const gradStyle = {
  background: 'linear-gradient(120deg,#7dd3fc 0%, #60a5fa 40%, #a78bfa 75%, #c084fc 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  textShadow: '0 6px 28px rgba(96,165,250,.18)'
}
const ringStyle = {
  borderColor: 'rgba(167,139,250,.95)',
  boxShadow: '0 0 18px rgba(167,139,250,.45), inset 0 0 12px rgba(96,165,250,.25)'
}

const eyeSize = 84
const pupilSize = 26
const eyeRef = ref(null)

const pupil = ref({ x: 0, y: 0 })
const target = ref({ x: 0, y: 0 })
const SMOOTH = 0.16

const pupilStyle = computed(() => ({
  width: pupilSize + 'px',
  height: pupilSize + 'px',
  background: 'radial-gradient(circle,#38bdf8 0%,#22d3ee 45%,#0ea5e9 100%)',
  boxShadow: '0 0 16px rgba(34,211,238,.5)',
  transform: `translate(${pupil.value.x}px, ${pupil.value.y}px)`
}))

const trailCanvas = ref(null)
let ctx = null
let rafId = null
let rafEye = null
const DPR = Math.min(window.devicePixelRatio || 1, 2)

const particles = []
const MAX_PART = 80
const EMIT_THROTTLE = 28
let lastEmit = 0

const floaters = []
const FLOATER_COUNT = 40

const mouse = { x: -9999, y: -9999, active: false }

function resizeCanvas () {
  const c = trailCanvas.value
  if (!c) return
  c.width = c.clientWidth * DPR
  c.height = c.clientHeight * DPR
  ctx = c.getContext('2d')
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
  ctx.globalCompositeOperation = 'lighter'
}

function addParticle (x, y) {
  if (particles.length > MAX_PART) particles.shift()
  particles.push({
    x, y,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.25,
    life: 1,
    r: 4 + Math.random() * 3
  })
}

function spawnFloaters () {
  floaters.length = 0
  const c = trailCanvas.value
  const w = c?.clientWidth || 0
  const h = c?.clientHeight || 0
  for (let i = 0; i < FLOATER_COUNT; i++) {
    floaters.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      r: 1 + Math.random() * 2,
      tw: Math.random() * Math.PI * 2
    })
  }
}

function drawHalo () {
  if (!mouse.active || !ctx) return
  const radius = 90
  const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, radius)
  g.addColorStop(0, 'rgba(255,255,255,0.06)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(mouse.x, mouse.y, radius, 0, Math.PI * 2)
  ctx.fill()
}

function animate () {
  rafId = requestAnimationFrame(animate)
  if (!ctx) return
  const c = trailCanvas.value
  const w = c.clientWidth
  const h = c.clientHeight
  ctx.clearRect(0, 0, w, h)

  // fondo flotante
  for (const f of floaters) {
    f.x += f.vx; f.y += f.vy
    if (f.x < -10) f.x = w + 10
    if (f.x > w + 10) f.x = -10
    if (f.y < -10) f.y = h + 10
    if (f.y > h + 10) f.y = -10
    f.tw += 0.02
    const a = 0.15 + Math.abs(Math.sin(f.tw)) * 0.15
    ctx.fillStyle = `rgba(203,213,225,${a})`
    ctx.beginPath()
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2)
    ctx.fill()
  }

  drawHalo()

  // partículas del mouse
  for (let p of particles) {
    p.x += p.vx
    p.y += p.vy
    p.life *= 0.975
    if (p.life < 0.03) continue
    const alpha = 0.5 * p.life
    const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4.2)
    grd.addColorStop(0, `rgba(125,211,252,${alpha})`)
    grd.addColorStop(0.6, `rgba(96,165,250,${alpha * 0.45})`)
    grd.addColorStop(1, 'rgba(192,132,252,0)')
    ctx.fillStyle = grd
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r * 4.2, 0, Math.PI * 2)
    ctx.fill()
  }
}

function onMoveBase (clientX, clientY) {
  const now = performance.now()
  if (now - lastEmit > EMIT_THROTTLE) {
    addParticle(clientX, clientY)
    lastEmit = now
  }
  mouse.x = clientX; mouse.y = clientY; mouse.active = true

  const el = eyeRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  const dx = clientX - cx
  const dy = clientY - cy
  const max = (eyeSize - pupilSize) / 2 - 4
  const dist = Math.hypot(dx, dy)
  const clamped = dist > 0 ? Math.min(max, dist) : 0
  const factor = dist > 0 ? clamped / dist : 0
  target.value = { x: dx * factor, y: dy * factor }
}

function onMouseMove (e) { onMoveBase(e.clientX, e.clientY) }
function onTouchMove (e) {
  if (!e.touches?.length) return
  const t = e.touches[0]
  onMoveBase(t.clientX, t.clientY)
}

function eyeLoop () {
  rafEye = requestAnimationFrame(eyeLoop)
  pupil.value = {
    x: pupil.value.x + (target.value.x - pupil.value.x) * SMOOTH,
    y: pupil.value.y + (target.value.y - pupil.value.y) * SMOOTH
  }
}

function onResize () {
  resizeCanvas()
  spawnFloaters()
}

function initCanvasAndLoops () {
  resizeCanvas()
  spawnFloaters()
  if (!rafId)  rafId  = requestAnimationFrame(animate)
  if (!rafEye) rafEye = requestAnimationFrame(eyeLoop)
  window.addEventListener('mousemove', onMouseMove, { passive: true })
  window.addEventListener('touchmove', onTouchMove, { passive: true })
  window.addEventListener('resize', onResize, { passive: true })
}

function stopCanvasAndLoops () {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('touchmove', onTouchMove)
  window.removeEventListener('resize', onResize)
  if (rafId)  { cancelAnimationFrame(rafId);  rafId  = null }
  if (rafEye) { cancelAnimationFrame(rafEye); rafEye = null }
  ctx = null
}

watch(() => props.show, async (isShown) => {
  if (isShown) {
    await nextTick()
    initCanvasAndLoops()
  } else {
    stopCanvasAndLoops()
  }
}, { immediate: true })

function start () {
  isExiting.value = true
  setTimeout(() => { emit('start'); emit('close'); isExiting.value = false }, 650)
}

function learn () {
  emit('learn')
  emit('close')

  nextTick().then(() => {
    setTimeout(() => {
      startTour({
        onFinish: () => {
          setTimeout(() => window.location.reload(), 150)
        }
      })
    }, 50)
  })
}

const isExiting = ref(false)

onMounted(() => {
})

onBeforeUnmount(() => {
  stopCanvasAndLoops()
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active, .fade-appear-active { transition: opacity .25s ease; }
.fade-enter-from, .fade-leave-to, .fade-appear-from { opacity: 0; }
.fade-enter-to, .fade-leave-from, .fade-appear-to { opacity: 1; }

.word {
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu;
  font-weight: 300;
  letter-spacing: .12em;
  font-size: clamp(42px, 8vw, 120px);
  line-height: 1;
}

.pupil { transition: transform .02s linear; }

.on-exit { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(7,10,15,0.0); }
</style>
