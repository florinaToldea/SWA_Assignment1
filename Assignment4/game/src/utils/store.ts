import { reactive } from "vue";

export const store = reactive({
  loggedIn: false,
  authToken: undefined,
  userId: undefined,
  gameId: undefined,
});
