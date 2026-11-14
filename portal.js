import { config as C } from "./config2.js";
import { getToken, setSession, safeNext } from "./session.js";

const SITE_KEY = "0x4AAAAAAGAlLIy38d4CYu7Q";
const nextUrl = safeNext(new URLSearchParams(location.search).get("next"));

if (getToken()) location.replace(nextUrl);

const $ = (selector) => document.querySelector(selector);
const form = $("#loginForm");
const submitButton = $("#submitButton");
const captchaStatus = $("#captchaStatus");
const message = $("#formMessage");
const usernameInput = $("#username");
const passwordInput = $("#password");
const slot = $("#turnstile-widget");
const roles = $("#roles");

let widgetId = null;
let token = "";
let busy = false;
let role = "Student";

$("#year").textContent = new Date().getFullYear();

const refreshButton = () => {
  submitButton.disabled = busy || !token;
  submitButton.classList.toggle("loading", busy);
};

const say = (text, type = "") => {
  message.textContent = text;
  message.className = `msg ${text ? type : ""}`.trim();
  if (type === "error") {
    void message.offsetWidth;
    message.classList.add("shake");
  }
};

const setCaptcha = (text, value = "") => {
  token = value;
  captchaStatus.textContent = text;
  refreshButton();
};

const resetCaptcha = () => {
  setCaptcha("Complete the Cloudflare check to enable sign in.");
  if (window.turnstile && widgetId !== null) window.turnstile.reset(widgetId);
};

const showNote = (text) => {
  const note = document.createElement("span");
  note.className = "slot-note";
  note.textContent = text;
  slot.replaceChildren(note);
};

const renderTurnstile = () => {
  widgetId = window.turnstile.render(slot, {
    sitekey: SITE_KEY,
    theme: "auto",
    size: slot.clientWidth < 300 ? "compact" : "flexible",
    callback: (value) => {
      setCaptcha("Security check completed.", value);
      say("");
    },
    "expired-callback": () => {
      setCaptcha("Verification expired. Please complete the check again.");
      say("Your security check expired. Please try again.", "error");
    },
    "error-callback": () => {
      setCaptcha("Could not verify right now. Please retry.");
      say("Cloudflare verification failed to load. Check your connection and retry.", "error");
      return true;
    },
    "timeout-callback": () => {
      setCaptcha("Verification timed out. Please try again.");
      say("The security check timed out. Please try again.", "error");
    },
  });
};

let waited = 0;
const waitForTurnstile = () => {
  if (window.turnstile && typeof window.turnstile.render === "function") return renderTurnstile();
  waited += 150;
  if (waited > 10000) {
    showNote("Security check could not load. Please refresh the page.");
    return setCaptcha("Cloudflare verification is unavailable.");
  }
  setTimeout(waitForTurnstile, 150);
};
waitForTurnstile();

roles.addEventListener("click", (event) => {
  const button = event.target.closest(".role");
  if (!button) return;
  const buttons = [...roles.querySelectorAll(".role")];
  buttons.forEach((item) => {
    const active = item === button;
    item.classList.toggle("active", active);
    item.setAttribute("aria-pressed", String(active));
  });
  roles.style.setProperty("--i", buttons.indexOf(button));
  role = button.dataset.role;
});

$("#togglePassword").addEventListener("click", (event) => {
  const button = event.currentTarget;
  const visible = passwordInput.type === "text";
  passwordInput.type = visible ? "password" : "text";
  button.textContent = visible ? "Show" : "Hide";
  button.setAttribute("aria-pressed", String(!visible));
  button.setAttribute("aria-label", visible ? "Show password" : "Hide password");
});

const post = async (url, body) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const data = await response.json().catch(() => ({}));
    if (response.status === 404) data.error = "This service is not available on the server yet (404).";
    else if (!response.ok && !data.error) data.error = `Server error (${response.status}).`;
    return { ok: response.ok, data };
  } catch (error) {
    const text = error.name === "AbortError" ? "The server is taking too long. Please try again." : "Cannot reach the server. Please try again.";
    return { ok: false, data: { error: text } };
  } finally {
    clearTimeout(timer);
  }
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (busy) return;
  say("");
  const username = usernameInput.value.trim();
  const password = passwordInput.value;
  if (!username || !password) return say("Enter your username and password.", "error");
  if (!token) return say("Please complete the Cloudflare security check.", "error");

  busy = true;
  refreshButton();
  const { ok, data } = await post(C.auth.api.portalLogin, { role, username, password, turnstileToken: token });
  busy = false;

  if (ok && data.token) {
    setSession(data.token, data.user);
    say("Signed in. Redirecting…", "success");
    location.replace(nextUrl);
    return;
  }
  say(data.error || "Sign in failed. Please try again.", "error");
  passwordInput.value = "";
  resetCaptcha();
});
