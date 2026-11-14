import { config as base } from "./config.js";

export const API_BASE = "https://backend-production-6aefa9f3.up.railway.app";
const url = (path) => `${API_BASE}${path}`;

export const config = {
  ...base,

  auth: {
    ...base.auth,
    api: {
      ...(base.auth && base.auth.api),
      signupOtp:   url("/api/auth/signup/otp"),
      signup:      url("/api/auth/signup"),
      login:       url("/api/auth/login"),
      portalLogin: url("/api/auth/portal-login"),
      forgot:      url("/api/auth/forgot"),
      reset:       url("/api/auth/reset"),
      otpSend:     url("/api/otp/send"),
      otpVerify:   url("/api/otp/verify"),
      formSubmit:  url("/api/forms/submit"),
      agent:       url("/api/agent"),
    },
  },

  ai:      { ...base.ai,      apiUrl: url("/api/gemini") },
  enquiry: { ...base.enquiry, apiUrl: url("/api/enquiry") },
};
