<script lang="ts">
import Game from "../components/Game.vue";
import { store } from "../utils/store.js";

export default {
  data() {
    return {};
  },
  methods: {},
  beforeMount() {
    const userId = store.userId;
    const authToken = store.authToken;

    if (userId === undefined || authToken === undefined) {
      this.$router.push("/login");
    }
  },
  components: { Game },
};
</script>
<template>
  <Game />
</template>
