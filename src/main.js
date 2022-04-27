import { createApp } from "vue";
import App from "./App.vue";

createApp(App).mount("#app");

// global project config
window.config = {
  apiUrl: window.webpackHotUpdate
    ? "https://backend.optigov.de/core/api"
    : "/api",
  oauth: {
    endpoints: {
      authorize: window.webpackHotUpdate
        ? "https://demo.optigov.de/oauth/authorize"
        : "/oauth/authorize",
      token: window.webpackHotUpdate
        ? "https://demo.optigov.de/oauth/token"
        : "/oauth/token",
    },
  },
};
