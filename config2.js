// config2.js - backend URLs (Railway). Baaki sab kuch (pages, content, agent forms...) purani config.js se aata hai.
import { config as base } from "./config.js";

export const API_BASE = "https://backend-production-6aefa9f3.up.railway.app";
const url = (path) => `${API_BASE}${path}`;

export const config = {
  ...base,

  auth: {
    ...base.auth,
    api: {
      ...(base.auth && base.auth.api),
      signupOtp:   url("/api/auth/signup/otp"),   // signup step 1: OTP bhejo
      signup:      url("/api/auth/signup"),       // signup step 2: OTP ke saath account banao
      login:       url("/api/auth/login"),
      forgot:      url("/api/auth/forgot"),       // backend me abhi nahi hai
      reset:       url("/api/auth/reset"),        // backend me abhi nahi hai
      otpSend:     url("/api/otp/send"),
      otpVerify:   url("/api/otp/verify"),
      formSubmit:  url("/api/forms/submit"),
    },
  },

  ai:      { ...base.ai,      apiUrl: url("/api/gemini") },
  enquiry: { ...base.enquiry, apiUrl: url("/api/enquiry") },
};
