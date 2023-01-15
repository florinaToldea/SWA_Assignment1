<template>
  <div
    class="bg-gradient-to-r from-cyan-500 to-blue-500/75 rounded-lg m-5 w-80 h-32 p-3"
  >
    <div class="text-3xl mb-1">SCORE: {{ data.score }}</div>
    <div class="text-xl mb-1">Game ID: {{ data.id }}</div>
    <div class="text-xl">User ID: {{ data.user }}</div>
  </div>
</template>

<script lang="ts">
import { getUserDetails } from "../services/userService";

export default {
  data() {
    return {};
  },
  methods: {},
  props: {
    data: undefined,
  },
};
</script>
