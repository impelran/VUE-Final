import { createRouter, createWebHistory } from 'vue-router';
import RssList from './components/RssList.vue';
import RssNews from './components/RssNews.vue';
import NewsDetail from './components/NewsDetail.vue';
import NotFound from './components/NotFound.vue';
import Preferences from './components/Preferences.vue';
import RssForm from './components/RssForm.vue';


const routes = [
  { path: '/', component: RssList },
  { path: '/news/:feedIndex', component: RssNews, props: true },
  { path: '/news/:feedIndex/:newsIndex', component: NewsDetail, props: true },
  { path: '/preferences', component: Preferences },
  { path: '/add-feed', component: RssForm },
  { path: '/:pathMatch(.*)*', component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;