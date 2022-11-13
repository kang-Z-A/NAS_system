import { createApp } from 'vue'
import App from './App.vue'
import 'virtual:svg-icons-register'
import router from '@/router/index'
import 'element-plus/es/components/message/style/css'


const app = createApp(App)

app.use(router)
app.mount('#app')

