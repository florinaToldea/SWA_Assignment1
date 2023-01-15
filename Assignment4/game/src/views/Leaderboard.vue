<template>
  <div>
    <div class="flex justify-around">
      <div class="p-4">
        <div class="text-black text-6xl mt-10">Your best</div>
        <div v-if="!userBest.length" class="text-black text-3xl mt-10">
          No data yet
        </div>
        <ScoreCard
          v-for="(userScore, index) in userBest"
          :key="'userbestItem' + index"
          :data="{ ...userScore }"
        />
      </div>
      <div class="p-4">
        <div class="text-black text-6xl mt-10">Overall best</div>
        <div v-if="!totalBest.length" class="text-black text-3xl mt-10">
          No data yet
        </div>
        <ScoreCard
          v-for="(totalScore, index) in totalBest"
          :key="'userbestItem' + index"
          :data="{ ...totalScore }"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ScoreCard from "../components/ScoreCard.vue";
import { getGames } from "../services/gameService";
import { store } from "../utils/store";

export default {
  data() {
    return {
      totalBest: [],
      userBest: [],
      games: [],
    };
  },
  components: { ScoreCard },
  methods: {},
  beforeMount() {
    const userId = store.userId;
    const authToken = store.authToken;

    if (userId === undefined || authToken === undefined) {
      this.$router.push("/login");
    }

    getGames().then((result) => {
      console.log(result);
      this.userBest = result
        .filter((game) => {
          return game.completed && game.user === parseInt(userId);
        })
        .sort((a, b) => {
          return b.score - a.score;
        })
        .slice(0, 3);

      this.totalBest = result
        .filter((game) => {
          return game.completed;
        })
        .sort((a, b) => {
          return b.score - a.score;
        })
        .slice(0, 10);
    });
  },
};
</script>
<style>
.title {
  text-align: center;
  font-size: 2rem;
  font-weight: 800;
}
</style>
