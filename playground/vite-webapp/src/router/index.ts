import {createRouter, createWebHashHistory} from 'vue-router'
import type {RouteRecordRaw} from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'HelloWorld',
    component: () => import('../components/HelloWorld.vue'),
  },
  {
    path: '/test',
    name: 'TestCom',
    component: () => import('../components/TestCom.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory('/'),
  routes,
})
export default router
