import { Credentials } from "../model/Models";
import { store } from "../utils/store.js";

const SERVER_URL = "http://localhost:9090/";
const authToken: string = store.authToken;
const userId: string = store.userId;

export async function register(credentials: Credentials) {
  return await fetch(SERVER_URL + "users", {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    method: "post",
    body: JSON.stringify(credentials),
  });
}

export async function login(credentials: Credentials) {
  return await fetch(SERVER_URL + "login", {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    method: "post",
    body: JSON.stringify(credentials),
  });
}

export async function logout() {
  return await fetch(SERVER_URL + `logout?token=${authToken}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    method: "post",
    body: "",
  })
    .then((response) => {
      response.ok ? response.json() : Promise.reject(response);
    })
    .then(() => {
      store.authToken = undefined;
      store.userId = undefined;
    });
}

export async function getUserDetails() {
  if (userId === undefined) return;

  return await fetch(SERVER_URL + `users/${userId}?token=${authToken}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    method: "GET",
  })
    .then((response: any) => response.json())
    .then((response: any) => {
      return response;
    });
}

export async function updateUser(updates: any) {
  console.log(JSON.stringify(updates));

  return await fetch(SERVER_URL + `users/${userId}?token=${authToken}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}
