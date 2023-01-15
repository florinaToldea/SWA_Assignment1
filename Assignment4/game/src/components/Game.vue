<template>
  <div>
    <button
      v-if="!board"
      @click="createBoard"
      class="rounded-lg text-4xl font-bold bg-gradient-to-r from-cyan-500/75 to-blue-500/50 text-slate-100 mx-10"
    >
      New game
    </button>
    <div v-if="board">
      <div class="text-center">
        <div class="text-6xl text-slate-700">Points: {{ score }}</div>
        <div class="text-2xl text-slate-600 mb-3">
          Moves left: {{ maxMoves - currentMove }}
        </div>
      </div>
      <table>
        <tbody>
          <tr v-for="(row, index) in getBoardRows()" :key="'row' + index">
            <td
              v-for="(piece, index) in row"
              :key="'piece' + index"
              @click="selectElement(piece)"
              :class="isSelectedElement(piece) ? ' border-4 border-black' : ''"
              class="w-24 h-24 border border-black cursor-pointer"
              :style="'background-color:' + piece.value"
            />
          </tr>
        </tbody>
      </table>
      <div
        v-if="completed"
        class="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-screen h-screen backdrop-blur-sm"
      >
        <div
          class="bg-gradient-to-r from-cyan-500/75 to-blue-500/50 rounded-lg fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 p-10"
        >
          <div class="text-5xl">Finished game with score: {{ score }}</div>
          <div class="my-6">
            <button
              @click="createBoard"
              class="rounded-lg text-3xl bg-white/75 text-slate-700 mx-10"
            >
              New game
            </button>
            <button
              class="rounded-lg text-3xl bg-white/75 text-slate-700 mx-10"
              @click="goToLeaderboard"
            >
              Leaderboard
            </button>
          </div>
        </div>
      </div>
    </div>
    <div>
      <button
        v-if="selectedElement"
        @click="clearSelection"
        class="bg-gradient-to-r from-cyan-500/75 to-blue-500/50 text-slate-100 mt-3"
      >
        Clear selection
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import {
  initBoard,
  canMove,
  move,
  updateGame,
  createGame,
  getGameById,
} from "../services/gameService";
import { RandomGenerator } from "../utils/generator";

export default {
  data() {
    return {
      rows: [],
      selectedElement: undefined,
      board: undefined,
      generator: undefined,
      score: 0,
      currentMove: 0,
      maxMoves: 5,
      completed: false,
      gameId: undefined,
      events: [],
    };
  },
  methods: {
    createBoard() {
      this.clearState();
      this.board = initBoard(this.generator);

      this.board.addListener((e) => this.events.push(e));
      const id = createGame().then(async (gameInfo) => {
        console.log(gameInfo.id);
        this.gameId = gameInfo.id;
        await updateGame(gameInfo.id, { board: this.board });
      });
    },
    getBoardRows() {
      const rows = [];
      for (let i = 0; i < this.board.pieces.length; i += this.board.width) {
        rows.push(this.board.pieces.slice(i, i + this.board.width));
      }
      return rows;
    },
    selectElement(piece) {
      if (this.maxMoves - this.currentMove <= 0) return;

      if (!this.selectedElement) {
        this.selectedElement = piece;
        updateGame(this.gameId, { firstSelectedItem: piece });
        return;
      }
      if (!canMove(this.board, this.selectedElement.position, piece.position)) {
        console.log("can't move");
        return;
      }
      const result = move(
        this.generator,
        this.board,
        this.selectedElement.position,
        piece.position
      );
      console.log({ result });
      console.log(this.events);

      // --- handling score
      // get all events, filter the match events and add them to the score
      // reset the events at the end

      const matches = this.events.filter((event) => {
        return event.kind === `Match`;
      });
      matches.forEach((match) => {
        this.score += 10 * match.match.positions.length;
      });
      this.events = [];

      this.board.pieces = result;
      this.selectedElement = undefined;
      this.currentMove += 1;
      updateGame(this.gameId, {
        score: this.score,
        board: this.board,
        firstSelectedItem: null,
        currentMove: this.currentMove,
      });
      if (this.currentMove === this.maxMoves) {
        this.finishGame();
      }
    },
    async finishGame() {
      this.completed = true;
      await updateGame(this.gameId, { completed: true })
        .then((response) => (response.ok ? response : Promise.reject(response)))
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
        });
    },
    clearState() {
      this.board = undefined;
      this.currentMove = 0;
      this.completed = false;
      this.score = 0;
      this.rows = [];
    },
    isSelectedElement(piece) {
      return (
        this.selectedElement?.position.col === piece.position.col &&
        this.selectedElement?.position.row === piece.position.row
      );
    },
    clearSelection() {
      this.selectedElement = undefined;
      updateGame(this.gameId, { firstSelectedItem: undefined });
    },
    goToLeaderboard() {
      this.$router.push("/leaderboard");
    },
  },
  beforeMount() {
    this.generator = new RandomGenerator("ABC");
  },
};
</script>
