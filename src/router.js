import { createWebHistory, createRouter } from "vue-router";
import Home from './components/Home.vue';
import MainCrop from './components/MainCrop.vue';
import Tesseract from './components/Tesseract.vue';

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/template",
    name: "MainCrop",
    component: MainCrop,
  },
  {
    path: "/test",
    name: "Tesseract",
    component: Tesseract,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;