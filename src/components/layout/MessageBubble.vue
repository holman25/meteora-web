<template>
  <motion.div
    v-motion
    :initial="{
      opacity: 0,
      y: 20,
      scale: 0.95
    }"
    :enter="{
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 350,
        damping: 20
      }
    }"
    :class="bubbleWrapperClass"
  >
    <div :class="bubbleClass">
      <p class="text-sm leading-relaxed whitespace-pre-wrap">{{ message.text }}</p>
    </div>
  </motion.div>
</template>

<script setup>
import { computed } from 'vue'
import { useMotion } from '@vueuse/motion'

const props = defineProps({
  message: { type: Object, required: true }
})

const isUser = computed(() => props.message.sender === 'user')

const bubbleWrapperClass = computed(() =>
  isUser.value ? 'flex justify-end' : 'flex justify-start'
)

const bubbleClass = computed(() =>
  isUser.value
    ? 'bg-neutral-800 text-white px-4 py-3 rounded-xl shadow-md max-w-[80%]'
    : 'bg-neutral-700 text-gray-100 px-4 py-3 rounded-xl shadow-md max-w-[80%]'
)
</script>
