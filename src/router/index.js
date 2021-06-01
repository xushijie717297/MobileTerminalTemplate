import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '../views/home/home.vue'
import error from '@/views/404/error'

Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
	if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
	return originalPush.call(this, location).catch(err => err)
}
const routes = [
    {
		path:'/error',
		name:'error',
		component:error
	},
	{
		path: '/',
		name: 'menu',
		redirect: "/home",
		component: resolve => require(['@/views/menu/menu'], resolve),
		children: [{
				path: '/home',
				name: 'home',
				component: home
			},
			{
				path: '/category',
				name: 'category',
				component: resolve => require(['@/views/category/category'], resolve),
			},
			{
				path: '/profile',
				name: 'profile',
				component: resolve => require(['@/views/profile/profile'], resolve),
				// meta:{requireAuth:true}
			},
			{
				path: '/shopcart',
				name: 'shopcart',
				component: resolve => require(['@/views/shopcart/shopcart'], resolve),
			},
			{
				path: '/programme',
				name: 'programme',
				component: resolve => require(['@/views/programme/programme'], resolve),
				meta: {
					requireAuth: true
				}
			},
		]
	},
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router
