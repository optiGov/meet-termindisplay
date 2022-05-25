import { reactive, readonly } from "vue";

// global project config
window.config = {
  apiUrl: process.env.NODE_ENV === "development"
    ? "https://demo.optigov.de/api"
    : "/api", // /api
  oauth: {
    endpoints: {
      authorize: process.env.NODE_ENV === "development"
        ? "https://demo.optigov.de/oauth/authorize"
        : "/oauth/authorize", ///oauth/authorize
      token: process.env.NODE_ENV === "development"
        ? "https://demo.optigov.de/oauth/token"
        : "/oauth/token", // /oauth/token
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
  textSize: localStorage.getItem("textSize"),
  //for oAuth
  oauthState: localStorage.getItem("oauthState"),
  oauthCodeVerifier: localStorage.getItem("oauthCodeVerifier"),
  oauthAccessToken: localStorage.getItem("oauthAccessToken"),
  oauthRefreshToken: localStorage.getItem("oauthRefreshToken"),
  oauthExpireDate: localStorage.getItem("oauthExpireDate"),
  loggedIn: localStorage.getItem("loggedIn"),
 });

const getters = {
  getTitel: () => state.titel,
  getUrl: () => state.url,
  getVid: () => state.vid,
  getNumber: () => state.number,
  getColor: () => state.color,
  getTextColor: () => state.textColor,
  getTextSize: () => state.textSize,
  getStaff() {
    if (localStorage.getItem("staff") === "") {
      return
    } else {
      return JSON.parse(localStorage.getItem("staff"));
    }
  },
  //for oAuth
  getOAuthState: () => state.oauthState,
  getOAuthCodeVerifier: () => state.oauthCodeVerifier,
  getOAuthAccessToken: () => state.oauthAccessToken,
  getOAuthRefreshToken: () => state.oauthRefreshToken,
  getOAuthExpireDate: () => state.oauthExpireDate,
  getLoggedIn: () => state.loggedIn,
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
  setTextSize(name) {
    localStorage.setItem("textSize", name);
    state.textSize = name;
  },
  setStaff(name) {
    localStorage.setItem("staff", JSON.stringify(name));
    state.staff = name;
  },
  //for OAuth
  setOAuthState(name) {
    localStorage.setItem("oauthState", name);
    state.oauthState = name;
  },
  setOAuthCodeVerifier(name) {
    localStorage.setItem("oauthCodeVerifier", name);
    state.oauthCodeVerifier = name;
  },
  setOAuthAccessToken(name) {
    localStorage.setItem("oauthAccessToken", name);
    state.oauthAccessToken = name;
  },
  setOAuthRefreshToken(name) {
    localStorage.setItem("oauthRefreshToken", name);
    state.oauthRefreshToken = name;
  },
  setOAuthExpireDate(name) {
    localStorage.setItem("oauthExpireDate", name);
    state.oauthExpireDate = name;
  },
  setLoggedIn(name) {
    localStorage.setItem("loggedIn", name);
    state.loggedIn = name;
  },
};

export default {
  state: readonly(state), //Daten können nur gelesen werden
  getters,
  mutations,
};
