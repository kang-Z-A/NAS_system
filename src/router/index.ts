import {createRouter, createWebHashHistory} from 'vue-router'

const routes = [
    {
        path:'/login',
        name:'login',
        component:() => import('@/pages/login.vue')
    },
    {
        path:'/register',
        name:'register',
        component:() => import('@/pages/register.vue')
    },
    {
        path:'/menu',
        name:'menu',
        component:() => import('@/pages/menu.vue')
    },
    {
        path:'/',
        redirect:'login'
    }
]

const router = createRouter({
    history:createWebHashHistory(),
    routes:routes
})


export default router