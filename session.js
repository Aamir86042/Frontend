import { config as C } from "./config2.js";

const { token: TOKEN_KEY, user: USER_KEY } = C.auth.storage;

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
};

export const setSession = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const loginUrl = (next) => `${C.auth.pages.login}?next=${encodeURIComponent(next)}`;

export const safeNext = (value) =>
  value && /^[\w-]+\.html(#\w+)?$/.test(value) ? value : C.auth.pages.home;
