import { createRouter, cretaeWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/vue/items",
      component: () => import("../pages/ItemIndex.vue"),
    },
    {
      path: "/vue/items/new",
      component: () => import("../pages/ItemNew.vue"),
    },
    {
      path: "/vue/items/:id",
      component: () => import("../pages/ItemShow.vue"),
    },
    {
      path: "/vue/items/:id/edit",
      component: () => import("../pages/ItemEdit.vue"),
    },
  ],
});

export default router;
