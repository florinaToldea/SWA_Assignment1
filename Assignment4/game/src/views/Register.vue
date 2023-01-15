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
          type="text"
          placeholder="Password"
          v-model="credentials.password"
        />
      </div>
      <div class="flex-row">
        <button
          class="bg-gradient-to-l from-cyan-500/75 to-blue-500/50 text-slate-100 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          @click="handleRegister"
        >
          Register
        </button>
        <button
          class="bg-gradient-to-r from-cyan-500/75 to-blue-500/50 text-slate-100 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4"
          type="button"
          @click="
            () => {
              this.$router.push('/login');
            }
          "
        >
          To Login
        </button>
      </div>
    </form>
  </div>
  {{ responseField }}
</template>

<script lang="ts">
import { register } from "../services/userService";
import { Credentials } from "../model/Models";
import { store } from "../utils/store.js";

export default {
  data() {
    return {
      responseField: "",
      credentials: {
        username: "",
        password: "",
      },
    };
  },

  methods: {
    async handleRegister() {
      register(this.credentials as Credentials)
        .then((response) =>
          response.ok ? response.json() : Promise.reject(response)
        )
        .then((res) => {
          this.$router.push("/");
          store.loggedIn = true;
          return res.json;
        })
        .catch((error) => {
          if (error.status === 400) console.log("Username already exists");
        });
    },
  },
  mounted() {},
};
</script>
