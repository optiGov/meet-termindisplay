<template>
  <HeaderVue />

  <main>
    <div class="container-fluid fixedList">
      <div class="row text-start p-4 border-bottom border-2">
        <div class="col-2"><strong>Ihr Aufruf</strong></div>
        <div class="col-3"><strong>Uhrzeit</strong></div>
        <div class="col-3"><strong>Dauer</strong></div>
        <div class="col-4"><strong>Raum</strong></div>
      </div>
      <div class="listGroup">
        <TermineList :key="componentKey" />
      </div>
    </div>
  </main>

  <div class="position-fixed bottom-0 end-0 m-4">
    <button
      type="button"
      class="btn btn-light"
      data-bs-toggle="modal"
      data-bs-target="#staticBackdrop"
    >
      <i class="fa-solid fa-gear"></i>
    </button>
  </div>

  <!-- Settings Modal -->
  <div
    class="modal fade"
    id="staticBackdrop"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="staticBackdropLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
      <div class="modal-content">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title" id="staticBackdropLabel">Einstellungen</h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form>
            <p>
              <button type="button" class="btn btn-light w-100 border">
                OptiGov-Authentifizierung
              </button>
            </p>
            <div class="form-floating mb-3">
              <input
                type="text"
                class="form-control"
                id="floatingInput"
                placeholder="ID"
                v-model="vid"
              />
              <label for="floatingInput">ID der Verwaltung</label>
            </div>
            <div class="form-floating mb-3">
              <input
                type="text"
                class="form-control"
                id="floatingInput"
                placeholder="Eingang"
                v-model="titel"
              />
              <label for="floatingInput">Titel des Displays</label>
            </div>

            <div class="form-floating">
              <select
                class="form-select"
                id="floatingSelect"
                aria-label="Floating label select example"
                v-model="number"
              >
                <option v-for="index in 20" :key="index" v-bind:value="index">
                  {{ index }}
                </option>
              </select>
              <label for="floatingSelect">Anzahl an Terminen</label>
            </div>
            <br />
            <div class="row">
              <div class="col-md-6">
                <label for="exampleColorInput" class="form-label float-start"
                  >Hintergrundfarbe auswählen</label
                >
                <input
                  type="color"
                  class="form-control form-control-color w-100"
                  id="exampleColorInput"
                  title="Wähle eine Hintergrundfarbe aus"
                  v-model="color"
                />
              </div>
              <div class="col-md-6">
                <label for="exampleColorInput" class="form-label float-start"
                  >Textfarbe auswählen</label
                >
                <input
                  type="color"
                  class="form-control form-control-color w-100"
                  id="exampleColorInput"
                  title="Wähle eine Textfarbe aus"
                  v-model="textColor"
                />
              </div>
            </div>

            <br />
            <label for="ColorInput" class="form-label float-start"
              >Auswahl der Mitarbeiter
              <!--{{ staff }}--></label
            >
            <select
              class="form-select"
              multiple
              aria-label="multiple select example"
              v-model="staff"
            >
              <option
                v-for="item in mitarbeiter"
                :key="item.id"
                v-bind:value="item.id"
              >
                {{ item.name }} ({{ item.vorname }} {{ item.nachname }})
              </option>
            </select>
          </form>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-dark btn-lg w-100"
            @click="storeSettings()"
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Store from "./store";
import "bootstrap/dist/js/bootstrap.min.js";
import TermineList from "./components/TermineList.vue";
import HeaderVue from "./components/HeaderVue.vue";

export default {
  name: "App",
  data() {
    return {
      termin: [],
      mitarbeiter: [],
      url: localStorage.getItem("url"),
      titel: localStorage.getItem("titel"),
      staff: JSON.parse(localStorage.getItem("staff")),
      vid: localStorage.getItem("vid"),
      number: localStorage.getItem("number"),
      color: localStorage.getItem("color"),
      textColor: localStorage.getItem("textColor"),
      componentKey: 0,
    };
  },
  components: {
    TermineList,
    HeaderVue,
  },
  computed: {
    getVid() {
      return Store.getters.getVid();
    },
    getTitel() {
      return Store.getters.getTitel();
    },
    getUrl() {
      return Store.getters.getUrl();
    },
    getNumber() {
      return Store.getters.getNumber();
    },
    getColor() {
      return Store.getters.getColor();
    },
    getTextColor() {
      return Store.getters.getTextColor();
    },
    getStaff() {
      return Store.getters.getStaff();
    },
  },
  methods: {
    //TerminList-Component aktualisieren
    forceRerender() {
      this.componentKey += 1;
    },
    //Daten aus dem Formular speichern
    storeSettings() {
      //Mitarbeiterdaten aktualisieren
      this.getMa();
      //TerminList-Component neuladen
      this.forceRerender();
      //Daten speichern
      Store.mutations.setVid(this.vid);
      Store.mutations.setTitel(this.titel);
      Store.mutations.setUrl(this.url);
      Store.mutations.setNumber(this.number);
      Store.mutations.setColor(this.color);
      Store.mutations.setTextColor(this.textColor);
      Store.mutations.setStaff(this.staff);
      this.error = false;
    },
    async getMa() {
      try {
        this.mitarbeiter = [];
        var result = await axios({
          method: "POST",
          url: window.config.apiUrl,
          data: {
            query: `
              {
              verwaltung(id: ${this.vid}) {
                id
                name
                mitarbeiter {
                  id
                  vorname
                  nachname
                  name
                }
              }
            } `,
          },
        });
        this.mitarbeiter = result.data.data.verwaltung.mitarbeiter;
        //console.log(result);
        //console.log(this.termin);
      } catch (error) {
        //console.error(error);
      }
    },
  },
  beforeMount() {
    //Initial
    localStorage.setItem("vid", "1");
    localStorage.setItem("titel", "Bürgerservice");
    localStorage.setItem("color", "#A600FF");
    localStorage.setItem("textColor", "#FFFFFF");
    localStorage.setItem("number", "5");
  },
  mounted() {
    //Daten zu Beginn abfragen
    this.getMa();
  },
};
</script>

<style>
@import "~bootstrap/dist/css/bootstrap.min.css";
@import "~@fortawesome/fontawesome-free/css/all.min.css";

@font-face {
  font-family: "gotoMEDIA";
  src: url("assets/webfonts/gotoMEDIA/gotoMEDIA.eot?5fw36d");
  src: url("assets/webfonts/gotoMEDIA/gotoMEDIA.eot?#iefix5fw36d")
      format("embedded-opentype"),
    url("assets/webfonts/gotoMEDIA/gotoMEDIA.woff?5fw36d") format("woff"),
    url("assets/webfonts/gotoMEDIA/gotoMEDIA.ttf?5fw36d") format("truetype"),
    url("assets/webfonts/gotoMEDIA/gotoMEDIA.svg") format("svg");
  font-weight: normal;
  font-style: normal;
}

#app {
  font-family: "gotoMEDIA", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000;
}

.navbar-brand h1 {
  font-weight: 600 !important;
  font-stretch: expanded;
}

ul.list-group.list-group-striped li:nth-of-type(odd) {
  background: #f8f9fa;
}
ul.list-group.list-group-striped li:nth-of-type(even) {
  background: #fff;
}

/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #fff;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #fff;
}

.fixedList {
  height: 100%;
  width: 100%;
  position: fixed;
  left: 0;
  right: 0;
  top: 124px;
}

.listGroup {
  overflow-x: hidden;
  overflow-y: hidden;
  height: 100%;
  width: 100%;
  position: fixed;
  top: 197px;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0;
}
</style>
