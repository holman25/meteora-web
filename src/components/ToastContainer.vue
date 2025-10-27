<template>
  <div class="fixed top-4 right-4 z-[9999] space-y-2 w-[min(92vw,360px)]">
    <div
      v-for="t in toasts"
      :key="t.id"
      class="rounded-xl shadow-lg px-4 py-3 text-sm text-white flex items-start gap-2"
      :class="bgByType(t.type)"
      role="status"
      aria-live="polite"
    >
      <span class="mt-0.5">
        <span v-if="t.type==='success'">✅</span>
        <span v-else-if="t.type==='info'">ℹ️</span>
        <span v-else-if="t.type==='warning'">⚠️</span>
        <span v-else>❌</span>
      </span>
      <div class="flex-1">
        <p class="leading-snug">
          {{ t.message }}<span v-if="t.count>1"> (x{{ t.count }})</span>
        </p>
      </div>
      <button
        class="opacity-70 hover:opacity-100 transition"
        @click="remove(t.id)"
        aria-label="Cerrar notificación"
        title="Cerrar"
      >✖</button>
    </div>
  </div>
</template>

<script setup>
import { useToast } from '@/composables/useToast'
const { toasts, remove } = useToast()

function bgByType(type) {
  switch (type) {
    case 'success': return 'bg-green-600'
    case 'info':    return 'bg-blue-600'
    case 'warning': return 'bg-amber-600'
    default:        return 'bg-rose-600'
  }
}
</script>
