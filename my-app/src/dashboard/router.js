import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/home.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: '/',

    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/overlay',
            name: 'overlay',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('./views/overlay.vue')
        }
    ]
})