import { createRouter, createWebHistory } from "vue-router";
import LeaderboardVue from "../views/Leaderboard.vue";
import LobbyVue from "../views/Lobby.vue";
import LoginVue from "../views/Login.vue";
import ProfileVue from "../views/Profile.vue";
import RegisterVue from "../views/Register.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "Home", component: LobbyVue },
    { path: "/register", name: "Register", component: RegisterVue },
    { path: "/login", name: "Login", component: LoginVue },
    { path: "/leaderboard", name: "Leaderboard", component: LeaderboardVue },
    { path: "/profile", name: "Profile", component: ProfileVue },
  ],
});

export default router;
