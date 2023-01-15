<template>
  <div class="w-full max-w-xs">
    <form
      class="bg-gradient-to-r from-cyan-500/75 to-blue-500/50 rounded-lg shadow-md px-8 pt-6 pb-8 mb-4"
    >
      <div class="mb-4">
        <label
          class="block text-slate-100 text-lg font-bold mb-2"
          for="username"
        >
          Username
        </label>
        <input
          class="shadow appearance-none bg-white border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          id="username"
          placeholder="Username"
          v-model="credentials.username"
        />
      </div>
      <div class="mb-6">
        <label
          class="block text-slate-100 text-lg font-bold mb-2"
          for="password"
        >
          Password
        </label>
        <input
          class="shadow appearance-none bg-white border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          type="password"
          id="password"
          placeholder="Password"
          v-model="credentials.password"
        />
      </div>
      <div>
        <button
          class="bg-gradient-to-l from-cyan-500/75 to-blue-500/50 text-slate-100 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          @click="handleLogin"
        >
          Login
        </button>
        <button
          class="bg-gradient-to-r from-cyan-500/75 to-blue-500/50 text-slate-100 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4"
          type="button"
          @click="
            () => {
              this.$router.push('/register');
            }
          "
        >
          To Register
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { Credentials } from "../model/Models";
import { login } from "../services/userService";
import { store } from "../utils/store.js";
export default {
  data() {
    return {
      credentials: {
        username: "",
        password: "",
      },
    };
  },

  methods: {
    async handleLogin() {
      login(this.credentials as Credentials)
        .then((response) =>
          response.ok ? response.json() : Promise.reject(response)
        )
        .then((res) => {
          console.log(res.token);
          // localStorage.setItem("authToken", res.token);
          store.authToken = res.token;
          // localStorage.setItem("userId", res.userId);
          store.userId = res.userId;

          this.$router.push("/");
        })
        .catch((error) => {
          if (error.status === 403) console.log("Wrong credentials");
        });
    },
  },
  mounted() {},
};
</script>
