import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/items",
      component: () => import("../pages/ItemIndex.vue"),
    },
    {
      path: "/items/new",
      component: () => import("../pages/ItemNew.vue"),
    },
    {
      path: "/items/:id",
      component: () => import("../pages/ItemShow.vue"),
    },
    {
      path: "/items/:id/edit",
      component: () => import("../pages/ItemEdit.vue"),
    },
  ],
});

export default router;
