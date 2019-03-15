export const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    component: () => import('@/pages/login/Login'),
    name: 'login',
    meta: { requiresLogin: false, title: 'Login' }
  },
  {
    path: '/home',
    component: () => import('@/pages/Home'),
    meta: { requiresLogin: true, title: 'Home' }
  },
  {
    path: '/articles',
    component: () => import('@/pages/articles/Index'),
    meta: { requiresLogin: true, title: 'Articles' }
  },
  {
    path: '/articles/create',
    component: () => import('@/pages/articles/Create'),
    meta: { requiresLogin: true, title: 'Articles' }
  },
  {
    path: '/articles/:id',
    component: () => import('@/pages/articles/Edit'),
    meta: { requiresLogin: true, title: 'Articles' }
  },
  {
    path: '*',
    component: () => import('@/pages/404'),
    meta: { requiresLogin: false, title: 'Page Not Found' }
  }
]