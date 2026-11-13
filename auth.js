import { config as C } from "./config2.js";
import { getToken, setSession, safeNext } from "./session.js";

const { api, pages, otp: OTP, backgrounds = [] } = C.auth;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const nextUrl = safeNext(new URLSearchParams(location.search).get("next"));
const loginPage = `${pages.login}?next=${encodeURIComponent(nextUrl)}`;

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isPhone = (value) => /^(\+91)?[6-9]\d{9}$/.test(value);

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
    const message = error.name === "AbortError" ? "The server is taking too long. Please try again." : "Cannot reach the server. Please try again.";
    return { ok: false, data: { error: message } };
  } finally {
    clearTimeout(timer);
  }
};

const say = (element, text, type = "error") => {
  element.textContent = text;
  element.dataset.type = type;
};

const setBusy = (form, busy) => {
  const button = $(".cta", form);
  button.disabled = busy;
  button.classList.toggle("loading", busy);
};

const showStep = (step) => {
  $("#stepOne").hidden = step !== 1;
  $("#stepTwo").hidden = step !== 2;
  $$(".steps li").forEach((item, index) => item.classList.toggle("on", index < step));
};

const mountBackground = () => {
  const container = $("#bg");
  backgrounds.forEach((url, index) => {
    const slide = document.createElement("div");
    slide.className = index === 0 ? "slide show" : "slide";
    slide.style.backgroundImage = `url("${url}")`;
    container.append(slide);
  });
  if (backgrounds.length < 2 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let current = 0;
  setInterval(() => {
    const slides = container.children;
    slides[current].classList.remove("show");
    current = (current + 1) % slides.length;
    slides[current].classList.add("show");
  }, 6000);
};

const mountPasswordToggles = () => {
  $$("[data-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = button.previousElementSibling;
      const reveal = input.type === "password";
      input.type = reveal ? "text" : "password";
      button.textContent = reveal ? "Hide" : "Show";
    });
  });
};

const passwordScore = (password) =>
  [/.{8,}/, /[a-z]/, /[A-Z]/, /\d/, /[^\w\s]/].filter((rule) => rule.test(password)).length;

const mountStrengthMeter = () => {
  const input = $('input[name="password"]');
  const meter = $("#meter");
  if (!input || !meter) return;
  input.addEventListener("input", () => {
    meter.dataset.level = input.value ? passwordScore(input.value) : 0;
  });
};

const createOtpInput = (container) => {
  const boxes = Array.from({ length: OTP.length }, (_, index) => {
    const box = document.createElement("input");
    box.inputMode = "numeric";
    box.maxLength = 1;
    box.autocomplete = "one-time-code";
    box.setAttribute("aria-label", `Digit ${index + 1}`);
    container.append(box);
    return box;
  });

  boxes.forEach((box, index) => {
    box.addEventListener("input", () => {
      box.value = box.value.replace(/\D/g, "");
      if (box.value && boxes[index + 1]) boxes[index + 1].focus();
    });
    box.addEventListener("keydown", (event) => {
      if (event.key === "Backspace" && !box.value && boxes[index - 1]) boxes[index - 1].focus();
    });
    box.addEventListener("paste", (event) => {
      event.preventDefault();
      const digits = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, boxes.length);
      [...digits].forEach((digit, position) => {
        boxes[position].value = digit;
      });
      boxes[Math.min(digits.length, boxes.length - 1)].focus();
    });
  });

  return {
    value: () => boxes.map((box) => box.value).join(""),
    focus: () => boxes[0].focus(),
    clear: () => {
      boxes.forEach((box) => {
        box.value = "";
      });
      boxes[0].focus();
    },
  };
};

const createResendTimer = (button) => {
  let handle;
  const start = () => {
    let remaining = OTP.resendSeconds;
    clearInterval(handle);
    const tick = () => {
      button.disabled = remaining > 0;
      button.textContent = remaining > 0 ? `Resend code in ${remaining}s` : "Resend code";
      remaining -= 1;
      if (remaining < 0) clearInterval(handle);
    };
    tick();
    handle = setInterval(tick, 1000);
  };
  return { start };
};

const initLogin = () => {
  const form = $("#stepOne");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const fields = new FormData(form);
    const body = { email: fields.get("email").trim().toLowerCase(), password: fields.get("password") };
    if (!isEmail(body.email)) return say($("#msg"), "Enter a valid email address.");
    if (!body.password) return say($("#msg"), "Enter your password.");

    setBusy(form, true);
    const { ok, data } = await post(api.login, body);
    setBusy(form, false);
    if (!ok) return say($("#msg"), data.error || "Sign in failed.");

    setSession(data.token, data.user);
    say($("#msg"), "Signed in. Redirecting…", "ok");
    location.replace(nextUrl);
  });
};

const initSignup = () => {
  const stepOne = $("#stepOne");
  const stepTwo = $("#stepTwo");
  const otp = createOtpInput($("#otp"));
  const timer = createResendTimer($("#resend"));
  let body = null;

  stepOne.addEventListener("submit", async (event) => {
    event.preventDefault();
    const fields = new FormData(stepOne);
    body = {
      name: fields.get("name").trim(),
      email: fields.get("email").trim().toLowerCase(),
      phone: fields.get("phone").replace(/[\s-]/g, ""),
      password: fields.get("password"),
      confirmPassword: fields.get("confirm"),
    };
    if (body.name.length < 3) return say($("#msg"), "Enter your full name.");
    if (!isEmail(body.email)) return say($("#msg"), "Enter a valid email address.");
    if (!isPhone(body.phone)) return say($("#msg"), "Enter a valid 10-digit mobile number.");
    if (body.password.length < 8) return say($("#msg"), "Password must be at least 8 characters.");
    if (body.password !== body.confirmPassword) return say($("#msg"), "Passwords do not match.");

    setBusy(stepOne, true);
    const { ok, data } = await post(api.signupOtp, body);
    setBusy(stepOne, false);
    if (!ok) return say($("#msg"), data.error || "Could not send the code.");

    $("#sentTo").textContent = body.email;
    say($("#msg"), "");
    showStep(2);
    otp.focus();
    timer.start();
  });

  stepTwo.addEventListener("submit", async (event) => {
    event.preventDefault();
    const code = otp.value();
    if (code.length !== OTP.length) return say($("#msgTwo"), `Enter the ${OTP.length}-digit code.`);

    setBusy(stepTwo, true);
    const { ok, data } = await post(api.signup, { ...body, code });
    setBusy(stepTwo, false);
    if (!ok) {
      otp.clear();
      return say($("#msgTwo"), data.error || "Sign up failed.");
    }

    setSession(data.token, data.user);
    say($("#msgTwo"), "Account created. Redirecting…", "ok");
    location.replace(nextUrl);
  });

  $("#resend").addEventListener("click", async () => {
    const { ok, data } = await post(api.signupOtp, body);
    if (!ok) return say($("#msgTwo"), data.error || "Could not resend the code.");
    say($("#msgTwo"), "A new code has been sent.", "ok");
    timer.start();
  });

  $("#back").addEventListener("click", () => showStep(1));
};

const initForgot = () => {
  const stepOne = $("#stepOne");
  const stepTwo = $("#stepTwo");
  const otp = createOtpInput($("#otp"));
  const timer = createResendTimer($("#resend"));
  let email = "";

  const sendCode = () => post(api.forgot, { email });

  stepOne.addEventListener("submit", async (event) => {
    event.preventDefault();
    email = new FormData(stepOne).get("email").trim().toLowerCase();
    if (!isEmail(email)) return say($("#msg"), "Enter a valid email address.");

    setBusy(stepOne, true);
    const { ok, data } = await sendCode();
    setBusy(stepOne, false);
    if (!ok) return say($("#msg"), data.error || "Could not send the code.");

    $("#sentTo").textContent = email;
    showStep(2);
    otp.focus();
    timer.start();
  });

  stepTwo.addEventListener("submit", async (event) => {
    event.preventDefault();
    const fields = new FormData(stepTwo);
    const body = {
      email,
      code: otp.value(),
      password: fields.get("password"),
      confirmPassword: fields.get("confirm"),
    };
    if (body.code.length !== OTP.length) return say($("#msgTwo"), `Enter the ${OTP.length}-digit code.`);
    if (body.password.length < 8) return say($("#msgTwo"), "Password must be at least 8 characters.");
    if (body.password !== body.confirmPassword) return say($("#msgTwo"), "Passwords do not match.");

    setBusy(stepTwo, true);
    const { ok, data } = await post(api.reset, body);
    setBusy(stepTwo, false);
    if (!ok) return say($("#msgTwo"), data.error || "Could not reset the password.");

    say($("#msgTwo"), "Password updated. Redirecting to sign in…", "ok");
    setTimeout(() => location.replace(loginPage), 1200);
  });

  $("#resend").addEventListener("click", async () => {
    const { ok, data } = await sendCode();
    if (!ok) return say($("#msgTwo"), data.error || "Could not resend the code.");
    say($("#msgTwo"), "A new code has been sent if the email is registered.", "ok");
    timer.start();
  });

  $("#back").addEventListener("click", () => showStep(1));
};

const page = document.body.dataset.page;

mountBackground();
mountPasswordToggles();
mountStrengthMeter();

if (getToken() && page !== "forgot") {
  location.replace(nextUrl);
} else {
  ({ login: initLogin, signup: initSignup, forgot: initForgot })[page]?.();
}
