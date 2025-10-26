import { createApp } from 'vue'
import './assets/tailwind.css'
import App from './App.vue'
import { MotionPlugin } from '@vueuse/motion'


createApp(App).use(MotionPlugin).mount('#app')
