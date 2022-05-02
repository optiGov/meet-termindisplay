import { reactive, readonly } from "vue";

// global project config
window.config = {
  apiUrl: window.webpackHotUpdate
    ? "https://backend.optigov.de/core/api"
    : "https://backend.optigov.de/core/api",
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

const state = reactive({
  titel: localStorage.getItem("titel"),
  url: window.config.apiUrl,
  staff: [],
  vid: localStorage.getItem("vid"),
  number: localStorage.getItem("number"),
  color: localStorage.getItem("color"),
  textColor: localStorage.getItem("textColor"),
});

const getters = {
  getTitel: () => state.titel,
  getUrl: () => state.url,
  getVid: () => state.vid,
  getNumber: () => state.number,
  getColor: () => state.color,
  getTextColor: () => state.textColor,
  getStaff() {
    if (localStorage.getItem("staff") === "") {
      return
    } else {
      return JSON.parse(localStorage.getItem("staff"));
    }
  },
};

const mutations = {
  setTitel(name) {
    localStorage.setItem("titel", name);
    state.titel = name;
  },
  setUrl(name) {
    localStorage.setItem("url", name);
    state.url = name;
  },
  setVid(name) {
    localStorage.setItem("vid", name);
    state.vid = name;
  },
  setNumber(name) {
    localStorage.setItem("number", name);
    state.number = name;
  },
  setColor(name) {
    localStorage.setItem("color", name);
    state.color = name;
  },
  setTextColor(name) {
    localStorage.setItem("textColor", name);
    state.textColor = name;
  },
  setStaff(name) {
    localStorage.setItem("staff", JSON.stringify(name));
    state.staff = name;
  },
};

export default {
  state: readonly(state), //Daten können nur gelesen werden
  getters,
  mutations,
};
