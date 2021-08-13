import Vue from 'vue'
import VueRouter from 'vue-router'
import control from '../views/control/control.vue'
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
		redirect: "/control",
		component: resolve => require(['@/views/menu/menu'], resolve),
		children: [{
				path: '/control',
				name: 'control',
				component: control
			},
			{
				path: '/Statistics',
				name: 'Statistics',
				component: resolve => require(['@/views/Statistics/Statistics'], resolve),
			},
			{
				path: '/mine',
				name: 'mine',
				component: resolve => require(['@/views/mine/mine'], resolve),
				// meta:{requireAuth:true}
			},
			{
				path: '/workOrder',
				name: 'workOrder',
				component: resolve => require(['@/views/workOrder/workOrder'], resolve),
			},
			{
				path: '/event',
				name: 'event',
				component: resolve => require(['@/views/event/event'], resolve),
				meta: {
					requireAuth: true
				}
			},
		]
	},
	{
		path: '/eventDetail',
		name: 'eventDetail',
		component: resolve => require(['@/views/event/eventDetail/eventDetail'], resolve),
	},
	{
		path: '/Hscreen',
		name: 'Hscreen',
		component: resolve => require(['@/views/event/eventDetail/HscreenChat'], resolve),
	},
	{
		path: '/popupChat',
		name: 'popupChat',
		component: resolve => require(['@/views/event/eventDetail/popupChat'], resolve),
	},
	{
		path: '/eventItem',
		name: 'eventItem',
		component: resolve => require(['@/views/event/eventItem/eventItem'], resolve),
	}
]

const router = new VueRouter({
	// mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router
