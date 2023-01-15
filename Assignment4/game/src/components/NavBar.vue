<template>
  <nav
    className="fixed top-0 left-0 bg-gradient-to-r from-cyan-500/75 to-blue-500/50 w-full shadow"
  >
    <div className="container m-auto flex justify-between items-center">
      <h1 className="pl-8 py-4 text-xl font-bold">
        <router-link to="/" class="text-4xl text-slate-100 hover:text-slate-100"
          >Match 3 game</router-link
        >
      </h1>
      <ul
        className="hidden md:flex items-center pr-10 text-base font-semibold cursor-pointer"
      >
        <li className="py-4 px-6">
          <router-link
            to="/leaderboard"
            class="text-slate-100 text-3xl hover:text-slate-100"
            >Leaderboard</router-link
          >
        </li>
        <li className="py-4 px-6">
          <router-link
            to="/profile"
            class="text-slate-100 text-3xl hover:text-slate-100"
            >Profile</router-link
          >
        </li>
      </ul>
    </div>
  </nav>
</template>

<script lang="ts">
export default {
  name: "navbar",
  data() {
    return {};
  },
  methods: {},
};
</script>
