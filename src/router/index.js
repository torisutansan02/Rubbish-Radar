import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import UserInput from "../views/UserInput.vue";
import MapTest from "../views/MapTest.vue";
import UserAuth from "../views/UserAuth.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/About.vue"),
    },
    {
      path: "/UserInput",
      name: "UserInput",
      component: UserInput,
    },
    {
      path: "/maptest",
      name: "maptest",
      component: MapTest,
    },
    {
      path: "/UserAuth",
      name: "UserAuth",
      component: UserAuth,
    },
  ],
});

export default router;
