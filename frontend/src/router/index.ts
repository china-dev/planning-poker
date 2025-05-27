// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import RoomView from '../views/RoomView.vue';
import { useSession } from '../composable/useSession.ts';

const routes = [
  { 
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/room/:roomId',
    name: 'Room',
    component: RoomView,
    meta: { requiresSession: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const { verifySession } = useSession();

  if (!(to.name === 'Room' && from.name === 'Home') && to.name !== 'Home') {
    verifySession();
  }

  next();
});

export default router;
