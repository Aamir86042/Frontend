import { config as C } from "./config2.js";
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
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (response.status === 401 && url !== api.otpVerify) {
      clearSession();
      location.replace(loginUrl(C.auth.pages.agent));
      return { ok: false, data: {} };
    }
    const data = await response.json().catch(() => ({}));
    if (response.status === 404) data.error = "This service is not available on the server yet (404).";
    else if (!response.ok && !data.error) data.error = `Server error (${response.status}).`;
    return { ok: response.ok, data };
  } catch (error) {
    const message = error.name === "AbortError" ? "The server is taking too long. Please try again." : "Cannot reach the server.";
    return { ok: false, data: { error: message } };
  } finally {
    clearTimeout(timer);
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
  input.placeholder = "Type naturally, e.g. fill my admission form";
  setChips(Object.entries(FORMS).map(([key, form]) => [form.title, () => startForm(key)]));
};

const beginForm = (key) => {
  const form = FORMS[key];
  const profile = loadProfile();
  state = { mode: "ask", key, data: {}, queue: [] };
  form.fields.forEach((name) => {
    if (profile[name]) state.data[name] = profile[name];
    else state.queue.push(name);
  });
};

const startForm = (key) => {
  const form = FORMS[key];
  beginForm(key);
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

const context = () => {
  const specs = {};
  Object.entries(FIELDS).forEach(([name, field]) => {
    specs[name] = { label: field.label, type: field.type, options: field.options, min: field.min, max: field.max, ask: field.question };
  });
  return {
    mode: state.mode,
    forms: Object.fromEntries(Object.entries(FORMS).map(([key, form]) => [key, { title: form.title, fields: form.fields }])),
    form: state.key || null,
    specs,
    collected: state.data || {},
    missing: state.queue || [],
    asking: state.mode === "ask" ? state.queue[0] : null,
    profile: loadProfile(),
  };
};

const applyFill = (fill) => {
  const rejected = [];
  const allowed = FORMS[state.key].fields;
  Object.entries(fill || {}).forEach(([name, raw]) => {
    const field = FIELDS[name];
    if (!field || !allowed.includes(name)) return;
    const value = normalize(field, String(raw).trim());
    if (!value) return;
    if (!isValid(field, value)) return rejected.push(field.label);
    state.data[name] = value;
    saveProfile({ ...loadProfile(), [name]: value });
  });
  state.queue = allowed.filter((name) => !state.data[name]);
  renderProfile();
  return rejected;
};

const converse = async (text) => {
  say(text, "u");
  history.push({ role: "user", content: text });
  const bubble = say("…");
  const { ok, data } = await authFetch(api.agent, { message: text, history: history.slice(-10), context: context() });
  if (!ok) {
    bubble.remove();
    if (state.mode === "ask") return submitAnswer(text);
    return say(data.error || C.ai.fallback);
  }
  if (data.reply) {
    bubble.textContent = data.reply;
    history.push({ role: "assistant", content: data.reply });
  } else {
    bubble.remove();
  }
  if (data.action === "cancel" && state.key) return cancel();
  const key = FORMS[data.form] ? data.form : state.key;
  if (!key) return;
  if (state.key !== key) beginForm(key);
  const fill = { ...(data.fill || {}) };
  const asking = state.mode === "ask" ? state.queue[0] : null;
  if (asking && !fill[asking] && !text.includes("?") && isValid(FIELDS[asking], normalize(FIELDS[asking], text))) fill[asking] = text;
  const rejected = applyFill(fill);
  if (rejected.length) say(`I could not accept: ${rejected.join(", ")}. Please check ${rejected.length > 1 ? "them" : "it"}.`);
  if (!state.queue.length) {
    if (data.action === "send_otp" && !rejected.length && state.mode === "review") return sendOtp();
    if (Object.keys(fill).length || state.mode !== "review") review();
    return;
  }
  askNext();
};

$("#chatForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const value = input.value.trim();
  if (!value) return;
  input.value = "";
  if (state.mode === "otp") {
    say("••••••", "u");
    verifyOtp(value);
  } else {
    converse(value);
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
say("You can also type naturally, for example: \"admission form bharo, mera naam Aamir hai, 12th mein 92%\". I will fill what I understand.");
renderProfile();
showMenu();
