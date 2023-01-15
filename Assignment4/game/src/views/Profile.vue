<template>
  <div
    class="w-full bg-gradient-to-r from-cyan-500/75 to-blue-500/50 rounded-lg shadow-md px-8 pt-6 pb-8 mb-4"
  >
    <div class="m-4 mx-6">
      <h1 class="text-6xl text-slate-100 drop-shadow-2xl">
        Hello, {{ user.username }}
      </h1>
    </div>
    <form class="my-8">
      <div class="mb-4">
        <label
          class="block text-slate-100 text-lg font-bold mb-2"
          for="password"
        >
          Change your password
        </label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          v-model="user.password"
          class="shadow appearance-none bg-white border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div>
        <button
          class="bg-gradient-to-r from-cyan-500/75 to-blue-500/50 text-slate-100 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          @click="updateUser"
        >
          Save
        </button>
      </div>
    </form>

    <div>
      <button
        class="bg-gradient-to-r from-cyan-500/75 to-blue-500/50 text-slate-100 text-4xl font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-10"
        type="button"
        @click="logout"
      >
        Logout
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { getUserDetails, logout, updateUser } from "../services/userService";
import { store } from "../utils/store";

export default {
  data() {
    return { user: undefined };
  },
  methods: {
    async logout() {
      await logout();
      this.$router.push("/login");
    },
    async updateUser() {
      await updateUser({
        password: this.user.password,
      }).then(() => {
        this.$router.push("/login");
      });
    },
  },
  async beforeMount() {
    const userId = store.userId;
    const authToken = store.authToken;

    if (userId === undefined || authToken === undefined) {
      this.$router.push("/login");
    }

    this.user = await getUserDetails();
  },
  components: {},
};
</script>
