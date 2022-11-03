import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import IndexPageVue from "../pages/IndexPage.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: IndexPageVue,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
