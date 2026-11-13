import { config as C } from "./config.js";
import { getToken, getUser, clearSession, loginUrl } from "./session.js";

if (!getToken()) location.replace(loginUrl(C.auth.pages.agent));

const { api } = C.auth;
const { fields: FIELDS, forms: FORMS } = C.agent;
const user = getUser() || {};
const PROFILE_KEY = `${C.agent.profileKey}:${user.email || "guest"}`;

const $ = (selector) => document.querySelector(selector);
const messages = $("#msgs");
const input = $("#input");
const chips = $("#chips");
const history = [];
let state = { mode: "chat" };

const loadProfile = () => {
  try {
    return { name: user.name, email: user.email, phone: user.phone, ...JSON.parse(localStorage.getItem(PROFILE_KEY)) };
  } catch {
    return { name: user.name, email: user.email, phone: user.phone };
  }
};

const saveProfile = (profile) => localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));

const authFetch = async (url, body) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify(body),
    });
    if (response.status === 401) {
      clearSession();
      location.replace(loginUrl(C.auth.pages.agent));
      return { ok: false, data: {} };
    }
    return { ok: response.ok, data: await response.json().catch(() => ({})) };
  } catch {
    return { ok: false, data: { error: "Cannot reach the server." } };
  }
};

const say = (text, who = "b") => {
  const bubble = document.createElement("div");
  bubble.className = `m ${who}`;
  bubble.textContent = text;
  messages.append(bubble);
  messages.scrollTop = messages.scrollHeight;
  return bubble;
};

const setChips = (items) => {
  chips.replaceChildren(
    ...items.map(([label, handler]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.addEventListener("click", () => {
        setChips([]);
        handler();
      });
      return button;
    })
  );
};

const normalize = (field, value) =>
  field.normalize === "phone" ? value.replace(/[\s-]/g, "").replace(/^\+91/, "") : value;

const isValid = (field, value) => {
  if (field.options) return field.options.includes(value);
  if (field.pattern) return new RegExp(field.pattern).test(value);
  if (field.type === "date") return Boolean(value) && new Date(value) < new Date();
  if (field.type === "number") return value !== "" && +value >= (field.min ?? -Infinity) && +value <= (field.max ?? Infinity);
  return value.length >= (field.minLength ?? 1);
};

const renderProfile = () => {
  const profile = loadProfile();
  const entries = Object.entries(profile).filter(([, value]) => value);
  const list = $("#profile");
  list.replaceChildren();
  entries.forEach(([key, value]) => {
    const row = document.createElement("div");
    const term = document.createElement("dt");
    const detail = document.createElement("dd");
    term.textContent = FIELDS[key]?.label || key;
    detail.textContent = value;
    row.append(term, detail);
    list.append(row);
  });
};

const showMenu = () => {
  state = { mode: "chat" };
  input.type = "text";
  input.value = "";
  input.setAttribute("list", "");
  input.placeholder = "Ask anything or pick a form…";
  setChips(Object.entries(FORMS).map(([key, form]) => [form.title, () => startForm(key)]));
};

const startForm = (key) => {
  const form = FORMS[key];
  const profile = loadProfile();
  state = { mode: "ask", key, data: {}, queue: [] };
  form.fields.forEach((name) => {
    if (profile[name]) state.data[name] = profile[name];
    else state.queue.push(name);
  });
  say(form.title, "u");
  say(
    state.queue.length === form.fields.length
      ? "I will process your form. I need your details once; I will save them in this browser and fill future forms automatically."
      : "I will process your form. I found your saved details and filled what I could."
  );
  state.queue.length ? askNext() : review();
};

const askNext = () => {
  const name = state.queue[0];
  const field = FIELDS[name];
  say(field.question);
  input.type = field.type;
  input.value = "";
  input.placeholder = field.label;
  input.setAttribute("list", field.suggest ? "suggestions" : "");
  input.focus();
  const options = (field.options || []).map((option) => [option, () => submitAnswer(option, true)]);
  setChips([...options, ["Cancel", cancel]]);
};

const submitAnswer = (raw, echo = false) => {
  const name = state.queue[0];
  const field = FIELDS[name];
  const value = normalize(field, String(raw).trim());
  if (echo) say(value, "u");
  if (!isValid(field, value)) {
    say(`That does not look right for "${field.label}". Please try again.`);
    return askNext();
  }
  state.data[name] = value;
  saveProfile({ ...loadProfile(), [name]: value });
  renderProfile();
  state.queue.shift();
  state.queue.length ? askNext() : review();
};

const review = () => {
  const form = FORMS[state.key];
  state.mode = "review";
  input.type = "text";
  input.value = "";
  input.setAttribute("list", "");
  input.placeholder = "Type to ask a question…";
  say("Please check your form:\n" + form.fields.map((name) => `• ${FIELDS[name].label}: ${state.data[name]}`).join("\n"));
  setChips([
    ["Confirm and send OTP", sendOtp],
    ["Edit a detail", () => setChips(form.fields.map((name) => [FIELDS[name].label, () => editField(name)]))],
    ["Cancel", cancel],
  ]);
};

const editField = (name) => {
  state.queue = [name];
  state.mode = "ask";
  askNext();
};

const sendOtp = async () => {
  const { ok, data } = await authFetch(api.otpSend, { email: state.data.email });
  if (!ok) {
    say(data.error || "Could not send the OTP. Please try again.");
    return review();
  }
  state.mode = "otp";
  say(`An OTP was sent to ${state.data.email}. Enter it below.`);
  input.type = "tel";
  input.value = "";
  input.placeholder = "6-digit OTP";
  input.focus();
  setChips([["Resend OTP", sendOtp], ["Cancel", cancel]]);
};

const verifyOtp = async (code) => {
  const verified = await authFetch(api.otpVerify, { email: state.data.email, code });
  if (!verified.ok) return say(verified.data.error || "Wrong OTP. Try again or resend.");
  const submitted = await authFetch(api.formSubmit, { form: state.key, data: state.data });
  if (!submitted.ok) {
    say(submitted.data.error || "Could not submit the form. Please try again.");
    return review();
  }
  say(`Done! Your ${FORMS[state.key].title} has been submitted. Next time any form will be filled automatically.`);
  showMenu();
};

const cancel = () => {
  say("Cancelled. Your saved details are kept.");
  showMenu();
};

const chat = async (question) => {
  say(question, "u");
  history.push({ role: "user", content: question });
  const bubble = say("…");
  const { data } = await authFetch(C.ai.apiUrl, { message: question, history: history.slice(-10) });
  const reply = data.reply || C.ai.fallback;
  bubble.textContent = reply;
  history.push({ role: "assistant", content: reply });
};

$("#chatForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const value = input.value.trim();
  if (!value) return;
  input.value = "";
  if (state.mode === "ask") {
    say(value, "u");
    submitAnswer(value);
  } else if (state.mode === "otp") {
    say("••••••", "u");
    verifyOtp(value);
  } else {
    chat(value);
  }
});

$("#logout").addEventListener("click", () => {
  clearSession();
  location.replace(C.auth.pages.login);
});

$("#clear").addEventListener("click", () => {
  if (!confirm("Delete all details saved in this browser?")) return;
  localStorage.removeItem(PROFILE_KEY);
  renderProfile();
  say("Your saved data has been deleted.");
});

$("#suggestions").innerHTML = C.programmes.map((name) => `<option value="${name.replace(/"/g, "&quot;")}">`).join("");
say(C.agent.welcome);
renderProfile();
showMenu();
