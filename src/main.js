import { createApp } from 'vue'
import './assets/tailwind.css'
import App from './App.vue'
import { MotionPlugin } from '@vueuse/motion'
import 'driver.js/dist/driver.css'


createApp(App).use(MotionPlugin).mount('#app')
