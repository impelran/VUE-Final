import { createRouter, createWebHistory } from 'vue-router';
import RssList from './components/RssList.vue';
import RssNews from './components/RssNews.vue';

const routes = [
  { path: '/', component: RssList },
  { path: '/news/:feedIndex', component: RssNews, props: true }, // Pass feedIndex as prop
  { path: '/:pathMatch(.*)*', redirect: '/' } // Catchall redirect to home
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;