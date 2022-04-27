import { reactive, readonly } from "vue";

const state = reactive({
  titel: localStorage.getItem("titel"),
  url: localStorage.getItem("url"),
  staff: "",
  vid: localStorage.getItem("vid"),
  number: localStorage.getItem("number"),
  color: localStorage.getItem("color"),
});

const getters = {
  getTitel: () => state.titel,
  getUrl: () => state.url,
  getVid: () => state.vid,
  getNumber: () => state.number,
  getColor: () => state.color,
};

const mutations = {
  setTitel(name) {
    localStorage.setItem("titel", name);
    state.titel = name;
    //console.log(state.titel);
  },
  setUrl(name) {
    localStorage.setItem("url", name);
    state.url = name;
    //console.log(state.url);
  },
  setVid(name) {
    localStorage.setItem("vid", name);
    state.vid = name;
    //console.log(state.url);
  },
  setNumber(name) {
    localStorage.setItem("number", name);
    state.number = name;
    //console.log(state.url);
  },
  setColor(name) {
    localStorage.setItem("color", name);
    state.color = name;
    //console.log(state.url);
  },
};

export default {
  state: readonly(state), //Daten können nur gelesen werden
  getters,
  mutations,
};
