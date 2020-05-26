import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage').default,
      redirect: '/home',
      children: [
        {
          path: '/home',
          name: 'home',
          component: require('@/views/Home').default
        },
        {
          path: '/article',
          name: 'article',
          component: require('@/views/Article').default
        },
        {
          path: '/settings',
          name: 'settings',
          component: require('@/views/Settings').default
        },
        {
          path: '/about',
          name: 'about',
          component: require('@/views/About').default
        },
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
